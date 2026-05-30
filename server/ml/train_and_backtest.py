import os
import json
import warnings
warnings.filterwarnings('ignore')
# pyrefly: ignore [missing-import]
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, KFold
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Import models
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor

try:
    # pyrefly: ignore [missing-import]
    import xgboost as xgb
    XGB_AVAILABLE = True
except (ImportError, Exception):
    # Catch both package import error and loader errors (e.g. missing libomp on macOS)
    XGB_AVAILABLE = False
    print("XGBoost is not available (likely missing OpenMP library libomp).")

# Try importing LightGBM and CatBoost, fallback if not available
try:
    # pyrefly: ignore [missing-import]
    import lightgbm as lgb
    LGB_AVAILABLE = True
except (ImportError, Exception):
    LGB_AVAILABLE = False

try:
    # pyrefly: ignore [missing-import]
    import catboost as cb
    CB_AVAILABLE = True
except (ImportError, Exception):
    CB_AVAILABLE = False

print(f"XGBoost available: {XGB_AVAILABLE}")

print(f"LightGBM available: {LGB_AVAILABLE}")
print(f"CatBoost available: {CB_AVAILABLE}")

# 1. Load the original dataset
script_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(script_dir, '../data/agriculture_dataset.csv')
if not os.path.exists(csv_path):
    raise FileNotFoundError(f"Original dataset not found at {csv_path}")

df_orig = pd.read_csv(csv_path)
print(f"Loaded original dataset with {len(df_orig)} rows.")

# 2. Generate synthetic data to ensure robust training & backtesting
# We want to create realistic relationships between inputs and crop yield.
np.random.seed(42)
num_synthetic = 2000

# Extract existing unique values for categories
crops = df_orig['Crop_Type'].unique()
irrigations = df_orig['Irrigation_Type'].unique()
soils = df_orig['Soil_Type'].unique()
seasons = df_orig['Season'].unique()

# Generate random features
syn_crop = np.random.choice(crops, num_synthetic)
syn_area = np.random.uniform(10, 500, num_synthetic)
syn_irrigation = np.random.choice(irrigations, num_synthetic)
syn_fertilizer = np.random.uniform(0.5, 10.0, num_synthetic)
syn_pesticide = np.random.uniform(0.1, 5.0, num_synthetic)
syn_soil = np.random.choice(soils, num_synthetic)
syn_season = np.random.choice(seasons, num_synthetic)
syn_water = np.random.uniform(5000, 100000, num_synthetic)

# Yield simulation based on features + rules + noise
syn_yield = []
for i in range(num_synthetic):
    crop = syn_crop[i]
    area = syn_area[i]
    irr = syn_irrigation[i]
    fert = syn_fertilizer[i]
    pest = syn_pesticide[i]
    soil = syn_soil[i]
    water = syn_water[i]
    
    # Base yield factor by crop type
    # (Tons per acre basis, scaled by log area or linear area)
    base_yields = {
        'Rice': 3.5, 'Sugarcane': 8.0, 'Cotton': 2.0, 'Tomato': 4.5, 
        'Potato': 5.0, 'Carrot': 4.0, 'Soybean': 2.5, 'Maize': 3.0, 'Barley': 2.2
    }
    base = base_yields.get(crop, 3.0)
    
    # Area scaling factor (diminishing return on large area)
    area_factor = np.log10(area) * 1.5
    
    # Fertilizer effect (quadratic relationship - optimal is around 6-8 tons)
    fert_factor = -0.1 * (fert - 7)**2 + 2.5
    if fert_factor < 0.5:
        fert_factor = 0.5
        
    # Pesticide effect (avoiding pests increases yield, but excess harms soil)
    pest_factor = 1.0 + 0.3 * pest - 0.05 * (pest**2)
    
    # Irrigation and Water effect
    # Rice and Sugarcane need a LOT of water
    if crop in ['Rice', 'Sugarcane']:
        water_optimal = 70000
        water_factor = 1.5 - ((water - water_optimal) / 50000)**2
    else:
        water_optimal = 35000
        water_factor = 1.2 - ((water - water_optimal) / 30000)**2
    
    if water_factor < 0.2:
        water_factor = 0.2
        
    # Irrigation type efficiency
    irr_multipliers = {
        'Drip': 1.2,        # highly efficient
        'Sprinkler': 1.1,
        'Flood': 0.9,       # wastes water
        'Rain-fed': 0.8,    # uncertain
        'Manual': 1.0
    }
    irr_mult = irr_multipliers.get(irr, 1.0)
    
    # Soil type compatibility
    soil_compat = 1.0
    if crop in ['Rice', 'Sugarcane'] and soil in ['Clay', 'Silty']:
        soil_compat = 1.2
    elif crop in ['Potato', 'Carrot'] and soil in ['Loamy', 'Sandy']:
        soil_compat = 1.2
    elif soil == 'Sandy' and crop in ['Rice', 'Sugarcane']:
        soil_compat = 0.7 # sandy soil drains water too fast
        
    # Calculate yield (tons)
    y = base * area_factor * fert_factor * pest_factor * water_factor * irr_mult * soil_compat
    
    # Add random Gaussian noise
    noise = np.random.normal(0, y * 0.1) # 10% standard deviation noise
    y_final = max(1.0, y + noise)
    syn_yield.append(round(y_final, 2))

# Create synthetic dataframe
df_syn = pd.DataFrame({
    'Farm_ID': [f'F_SYN_{i:04d}' for i in range(num_synthetic)],
    'Crop_Type': syn_crop,
    'Farm_Area(acres)': np.round(syn_area, 2),
    'Irrigation_Type': syn_irrigation,
    'Fertilizer_Used(tons)': np.round(syn_fertilizer, 2),
    'Pesticide_Used(kg)': np.round(syn_pesticide, 2),
    'Yield(tons)': syn_yield,
    'Soil_Type': syn_soil,
    'Season': syn_season,
    'Water_Usage(cubic meters)': np.round(syn_water, 2)
})

# Combine original and synthetic
df_combined = pd.concat([df_orig, df_syn], ignore_index=True)
print(f"Combined dataset contains {len(df_combined)} rows.")

# 3. Data Preprocessing
X = df_combined.drop(columns=['Farm_ID', 'Yield(tons)'])
y = df_combined['Yield(tons)']

# Preprocessing for numerical and categorical data
categorical_cols = ['Crop_Type', 'Irrigation_Type', 'Soil_Type', 'Season']
numerical_cols = ['Farm_Area(acres)', 'Fertilizer_Used(tons)', 'Pesticide_Used(kg)', 'Water_Usage(cubic meters)']

# Create preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_cols),
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols)
    ])

# Fit the preprocessor on the whole X to ensure all categories are covered
preprocessor.fit(X)

# Split into train/test for overall evaluation
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Model Definitions
models = {
    'Linear Regression': LinearRegression(),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
}

if XGB_AVAILABLE:
    models['XGBoost'] = xgb.XGBRegressor(n_estimators=100, learning_rate=0.08, max_depth=6, random_state=42)

if LGB_AVAILABLE:
    models['LightGBM'] = lgb.LGBMRegressor(n_estimators=100, learning_rate=0.08, max_depth=6, random_state=42, verbose=-1)

if CB_AVAILABLE:
    models['CatBoost'] = cb.CatBoostRegressor(iterations=150, learning_rate=0.08, depth=6, random_state=42, verbose=0)

# 5. Backtesting (5-Fold Cross Validation) & Evaluation
metrics_summary = {}
best_model_name = None
best_model_r2 = -float('inf')
best_pipeline = None

# We use K-Fold cross validation on the combined dataset
kf = KFold(n_splits=5, shuffle=True, random_state=42)

for name, model in models.items():
    print(f"\nEvaluating Model: {name}...")
    pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('regressor', model)])
    
    cv_r2 = []
    cv_mse = []
    cv_mae = []
    
    for train_idx, val_idx in kf.split(X):
        X_tr, X_val = X.iloc[train_idx], X.iloc[val_idx]
        y_tr, y_val = y.iloc[train_idx], y.iloc[val_idx]
        
        pipeline.fit(X_tr, y_tr)
        preds = pipeline.predict(X_val)
        
        cv_r2.append(r2_score(y_val, preds))
        cv_mse.append(mean_squared_error(y_val, preds))
        cv_mae.append(mean_absolute_error(y_val, preds))
        
    mean_r2 = np.mean(cv_r2)
    mean_mse = np.mean(cv_mse)
    mean_mae = np.mean(cv_mae)
    
    print(f"Backtesting (5-Fold CV) Results for {name}:")
    print(f"  R2 Score:  {mean_r2:.4f}")
    print(f"  MSE:       {mean_mse:.4f}")
    print(f"  MAE:       {mean_mae:.4f}")
    
    # Train model on full training set to get test metrics
    pipeline.fit(X_train, y_train)
    test_preds = pipeline.predict(X_test)
    test_r2 = r2_score(y_test, test_preds)
    test_mse = mean_squared_error(y_test, test_preds)
    test_mae = mean_absolute_error(y_test, test_preds)
    
    metrics_summary[name] = {
        'cv_r2': round(mean_r2, 4),
        'cv_mse': round(mean_mse, 4),
        'cv_mae': round(mean_mae, 4),
        'test_r2': round(test_r2, 4),
        'test_mse': round(test_mse, 4),
        'test_mae': round(test_mae, 4)
    }
    
    # Select best model based on CV R2
    if mean_r2 > best_model_r2:
        best_model_r2 = mean_r2
        best_model_name = name
        # Retrain best model on 100% of data before saving
        best_pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('regressor', model)])
        best_pipeline.fit(X, y)

print(f"\nBest Model: {best_model_name} with CV R2: {best_model_r2:.4f}")

# 6. Save the best pipeline (preprocessor + model)
model_dir = os.path.join(script_dir, '../data')
os.makedirs(model_dir, exist_ok=True)

model_path = os.path.join(model_dir, "best_model.joblib")
joblib.dump(best_pipeline, model_path)
print(f"Saved best model pipeline to {model_path}")

# 7. Save metrics JSON for the Node server and frontend React app
metrics_path = os.path.join(model_dir, "ml_metrics.json")
output_data = {
    'best_model': best_model_name,
    'metrics': metrics_summary,
    'dataset_info': {
        'total_rows': len(df_combined),
        'synthetic_rows': num_synthetic,
        'original_rows': len(df_orig),
        'crops_covered': list(crops),
        'features': X.columns.tolist()
    }
}

with open(metrics_path, 'w') as f:
    json.dump(output_data, f, indent=4)
print(f"Saved evaluation metrics to {metrics_path}")
print("ML Training and Backtesting Pipeline completed successfully!")
