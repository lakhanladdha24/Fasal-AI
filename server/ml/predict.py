import sys
import os
import json
import joblib
import pandas as pd

def main():
    # Verify inputs
    if len(sys.argv) < 9:
        print(json.dumps({
            "error": "Insufficient arguments. Usage: python predict.py <Crop_Type> <Farm_Area> <Irrigation_Type> <Fertilizer_Used> <Pesticide_Used> <Soil_Type> <Season> <Water_Usage>"
        }))
        sys.exit(1)

    try:
        crop = sys.argv[1]
        area = float(sys.argv[2])
        irrigation = sys.argv[3]
        fertilizer = float(sys.argv[4])
        pesticide = float(sys.argv[5])
        soil = sys.argv[6]
        season = sys.argv[7]
        water = float(sys.argv[8])
    except ValueError as e:
        print(json.dumps({"error": f"Invalid numerical value: {str(e)}"}))
        sys.exit(1)

    # Path to saved model pipeline
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, '../data/best_model.joblib')
    if not os.path.exists(model_path):
        print(json.dumps({"error": f"Trained model not found at {model_path}. Please run train_and_backtest.py first."}))
        sys.exit(1)

    try:
        # Load preprocessor + model pipeline
        pipeline = joblib.load(model_path)

        # Create input dataframe
        input_data = pd.DataFrame([{
            'Crop_Type': crop,
            'Farm_Area(acres)': area,
            'Irrigation_Type': irrigation,
            'Fertilizer_Used(tons)': fertilizer,
            'Pesticide_Used(kg)': pesticide,
            'Soil_Type': soil,
            'Season': season,
            'Water_Usage(cubic meters)': water
        }])

        # Perform prediction
        predicted_yield = pipeline.predict(input_data)[0]
        
        # Calculate derived metrics
        yield_per_acre = predicted_yield / area if area > 0 else 0
        
        # Simple rule-based advisory feedback based on inputs
        recommendations = []
        if crop in ['Rice', 'Sugarcane'] and water < 40000:
            recommendations.append(f"Water usage ({water:.0f} m³) is low for water-intensive {crop}. Yield may improve with higher irrigation.")
        elif crop not in ['Rice', 'Sugarcane'] and water > 60000:
            recommendations.append(f"Water usage ({water:.0f} m³) seems high for {crop}. Consider drip irrigation to conserve resources.")
            
        if fertilizer > 8.0:
            recommendations.append("High fertilizer dosage detected. Over-fertilization can degrade soil health over time.")
        elif fertilizer < 2.0:
            recommendations.append("Low fertilizer dosage. Organic or chemical supplementation could boost growth.")

        if irrigation == 'Flood':
            recommendations.append("Flood irrigation is water-intensive. Upgrading to Drip or Sprinkler can improve water efficiency.")

        print(json.dumps({
            "success": True,
            "predicted_yield": round(predicted_yield, 2),
            "yield_per_acre": round(yield_per_acre, 3),
            "recommendations": recommendations
        }))

    except Exception as e:
        print(json.dumps({"error": f"Prediction failed: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()
