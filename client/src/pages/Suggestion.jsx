import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, CloudRain, ThermometerSun, X, BarChart3, HelpCircle, Activity, Sparkles, Droplets, FlaskConical, ShieldCheck } from 'lucide-react';

const localTranslations = {
    en: {
        tab_advisor: "Farming Advisor",
        tab_predictor: "AI Yield Predictor & Backtesting",
        season: "Select Season",
        season_kharif: "Kharif (Monsoon)",
        season_rabi: "Rabi (Winter)",
        season_zaid: "Zaid (Summer)",
        soil: "Soil Type",
        soil_alluvial: "Alluvial (Loamy)",
        soil_black: "Black Soil",
        soil_red: "Red Soil",
        water: "Water Availability",
        water_high: "High (Irrigated/Rain)",
        water_medium: "Medium",
        water_low: "Low (Dry)",
        btn: "Find Crops",
        placeholder: "Enter details to see recommendations",
        no_match: "No specific match found. Try Wheat or Maize universally.",
        profit: "Profit Potential",
        profit_high: "High",
        profit_medium: "Medium",
        profit_low: "Low",
        details_btn: "View Details",
        modal_duration: "Growth Duration",
        modal_temp: "Optimal Temp",
        modal_sowing: "Sowing Depth & Method",
        modal_pests: "Key Pests to Watch",
        modal_market: "Market Demand",
        modal_close: "Close",
        
        // Predictor translations
        predictor_title: "AI Crop Yield Predictor",
        predictor_subtitle: "Enter parameters to predict yield using our trained machine learning models",
        crop_type: "Crop Type",
        farm_area: "Farm Area (acres)",
        irrigation_type: "Irrigation Type",
        fertilizer_used: "Fertilizer Used (tons)",
        pesticide_used: "Pesticide Used (kg)",
        water_usage: "Water Usage (cubic meters)",
        predict_btn: "Predict Yield",
        predicting_btn: "Running AI Models...",
        result_title: "Yield Prediction Result",
        predicted_yield: "Predicted Yield",
        yield_per_acre: "Yield Density",
        tons: "Tons",
        tons_per_acre: "Tons / Acre",
        advisory_tips: "AI Advisory & Optimization Tips",
        enter_inputs: "Enter your farm inputs on the left to predict yield dynamically.",
        
        // Backtesting translations
        backtesting_title: "Model Backtesting & Performance",
        backtesting_desc: "We evaluated 5 different regression models on our dataset using 5-Fold Cross-Validation (backtesting) to select the best predictor.",
        best_model: "Best Model Pipeline",
        dataset_size: "Training Dataset Size",
        original_samples: "Original Samples",
        synthetic_samples: "Synthetic (Augmented)",
        model_name: "Model Name",
        cv_r2: "CV R² Accuracy",
        cv_mae: "CV MAE (Error)",
        cv_mse: "CV MSE",
        test_r2: "Test R²",
        
        crop_names: {
            "Rice (Paddy)": "Rice (Paddy)",
            "Rice": "Rice (Paddy)",
            "Wheat": "Wheat",
            "Cotton": "Cotton",
            "Sugarcane": "Sugarcane",
            "Mustard": "Mustard",
            "Maize": "Maize",
            "Pulse (Moong)": "Pulse (Moong)",
            "Groundnut": "Groundnut",
            "Tomato": "Tomato",
            "Potato": "Potato",
            "Carrot": "Carrot",
            "Soybean": "Soybean",
            "Barley": "Barley"
        },
        irrigation_names: {
            "Drip": "Drip Irrigation",
            "Sprinkler": "Sprinkler Irrigation",
            "Flood": "Flood Irrigation",
            "Rain-fed": "Rain-fed",
            "Manual": "Manual Watering"
        },
        soil_names: {
            "Loamy": "Loamy Soil",
            "Peaty": "Peaty Soil",
            "Silty": "Silty Soil",
            "Clay": "Clay Soil",
            "Sandy": "Sandy Soil",
            "alluvial": "Alluvial (Loamy)",
            "black": "Black Soil",
            "red": "Red Soil"
        }
    },
    hi: {
        tab_advisor: "कृषि सलाहकार",
        tab_predictor: "एआई उपज भविष्यवक्ता और बैकटेस्टिंग",
        season: "मौसम चुनें",
        season_kharif: "खरीफ (मानसून)",
        season_rabi: "रबी (सर्दियों)",
        season_zaid: "जायद (गर्मी)",
        soil: "मिट्टी का प्रकार",
        soil_alluvial: "जलोढ़ मिट्टी (दोमट)",
        soil_black: "काली मिट्टी",
        soil_red: "लाल मिट्टी",
        water: "पानी की उपलब्धता",
        water_high: "उच्च (सिंचित/बारिश)",
        water_medium: "मध्यम",
        water_low: "कम (सूखा)",
        btn: "फसलें खोजें",
        placeholder: "सिफारिशें देखने के लिए विवरण दर्ज करें",
        no_match: "कोई विशेष परिणाम नहीं मिला। सामान्य रूप से गेहूं या मक्का का प्रयास करें।",
        profit: "लाभ की संभावना",
        profit_high: "उच्च",
        profit_medium: "मध्यम",
        profit_low: "कम",
        details_btn: "विवरण देखें",
        modal_duration: "फसल अवधि",
        modal_temp: "इष्टतम तापमान",
        modal_sowing: "बुवाई की गहराई और विधि",
        modal_pests: "प्रमुख कीट और रोग",
        modal_market: "बाजार में मांग",
        modal_close: "बंद करें",
        
        // Predictor translations
        predictor_title: "एआई फसल उपज भविष्यवक्ता",
        predictor_subtitle: "हमारे प्रशिक्षित मशीन लर्निंग मॉडल का उपयोग करके उपज का अनुमान लगाने के लिए विवरण दर्ज करें",
        crop_type: "फसल का प्रकार",
        farm_area: "कृषि क्षेत्र (एकड़)",
        irrigation_type: "सिंचाई का प्रकार",
        fertilizer_used: "उर्वरक उपयोग (टन)",
        pesticide_used: "कीटनाशक उपयोग (किग्रा)",
        water_usage: "पानी का उपयोग (घन मीटर)",
        predict_btn: "उपज का अनुमान लगाएं",
        predicting_btn: "एआई मॉडल चल रहे हैं...",
        result_title: "उपज भविष्यवाणी परिणाम",
        predicted_yield: "अनुमानित उपज",
        yield_per_acre: "उपज घनत्व",
        tons: "टन",
        tons_per_acre: "टन / एकड़",
        advisory_tips: "एआई सलाहकार और अनुकूलन सुझाव",
        enter_inputs: "उपज का गतिशील अनुमान लगाने के लिए बाईं ओर अपने खेत का विवरण दर्ज करें।",
        
        // Backtesting translations
        backtesting_title: "मॉडल बैकटेस्टिंग और प्रदर्शन",
        backtesting_desc: "हमने सबसे अच्छा भविष्यवक्ता चुनने के लिए 5-फ़ोल्ड क्रॉस-वैलिडेशन (बैकटेस्टिंग) का उपयोग करके अपने डेटासेट पर 5 अलग-अलग रिग्रेशन मॉडल का मूल्यांकन किया।",
        best_model: "सर्वश्रेष्ठ मॉडल पाइपलाइन",
        dataset_size: "प्रशिक्षण डेटासेट आकार",
        original_samples: "मूल नमूने",
        synthetic_samples: "सिंथेटिक (संवर्धित)",
        model_name: "मॉडल का नाम",
        cv_r2: "CV R² सटीकता",
        cv_mae: "CV MAE (त्रुटि)",
        cv_mse: "CV MSE",
        test_r2: "टेस्ट R²",
        
        crop_names: {
            "Rice (Paddy)": "धान (चावल)",
            "Rice": "धान (चावल)",
            "Wheat": "गेहूं",
            "Cotton": "कपास",
            "Sugarcane": "गन्ना",
            "Mustard": "सरसों",
            "Maize": "मक्का",
            "Pulse (Moong)": "मूंग दाल",
            "Groundnut": "मूंगफली",
            "Tomato": "टमाटर",
            "Potato": "आलू",
            "Carrot": "गाजर",
            "Soybean": "सोयाबीन",
            "Barley": "जौ"
        },
        irrigation_names: {
            "Drip": "टपकन सिंचाई (Drip)",
            "Sprinkler": "फव्वारा सिंचाई",
            "Flood": "बाढ़ सिंचाई",
            "Rain-fed": "वर्षा आधारित",
            "Manual": "हाथ से सिंचाई"
        },
        soil_names: {
            "Loamy": "दोमट मिट्टी",
            "Peaty": "पीट मिट्टी",
            "Silty": "गाद मिट्टी",
            "Clay": "चिकनी मिट्टी",
            "Sandy": "बलुई मिट्टी",
            "alluvial": "जलोढ़ मिट्टी (दोमट)",
            "black": "काली मिट्टी",
            "red": "लाल मिट्टी"
        }
    }
};

const cropDetails = {
    en: {
        "Rice (Paddy)": {
            duration: "120-150 Days",
            temp: "22°C - 32°C",
            sowing: "Direct seeding or transplanting 2-3 cm deep",
            pests: "Stem borer, Leaf folder, Rice blast",
            market: "High demand in domestic and export markets"
        },
        "Wheat": {
            duration: "110-140 Days",
            temp: "15°C - 20°C",
            sowing: "Drill or broadcasting 4-5 cm deep",
            pests: "Rust, Loose smut, Aphids",
            market: "Constant staple food demand year-round"
        },
        "Cotton": {
            duration: "150-180 Days",
            temp: "21°C - 30°C",
            sowing: "Line sowing 3-4 cm deep",
            pests: "Bollworm, Whitefly, Jassids",
            market: "High commercial value for textile industries"
        },
        "Sugarcane": {
            duration: "10-12 Months",
            temp: "20°C - 35°C",
            sowing: "Setts planting in furrows 10-12 cm deep",
            pests: "Pyrilla, Early shoot borer, Red rot",
            market: "High cash crop value for sugar mills"
        },
        "Mustard": {
            duration: "110-130 Days",
            temp: "10°C - 25°C",
            sowing: "Line sowing 2-3 cm deep",
            pests: "Aphids, Mustard sawfly, Alternaria blight",
            market: "Steady demand for mustard oil extraction"
        },
        "Maize": {
            duration: "90-110 Days",
            temp: "21°C - 27°C",
            sowing: "Sowing at 3-5 cm depth",
            pests: "Fall armyworm, Stem borer",
            market: "High utility in animal feed and food processing"
        },
        "Pulse (Moong)": {
            duration: "60-75 Days",
            temp: "25°C - 35°C",
            sowing: "Sowing at 3-4 cm depth",
            pests: "Pod borer, Whitefly, Yellow mosaic virus",
            market: "High demand as a rich source of plant protein"
        },
        "Groundnut": {
            duration: "110-130 Days",
            temp: "22°C - 30°C",
            sowing: "Sowing at 5 cm depth",
            pests: "White grub, Red hairy caterpillar, Tikka leaf spot",
            market: "Strong commercial value for edible oil"
        }
    },
    hi: {
        "Rice (Paddy)": {
            duration: "120-150 दिन",
            temp: "22°C - 32°C",
            sowing: "सीधी बुवाई या 2-3 सेमी गहरी रोपाई",
            pests: "तना छेदक (Stem borer), पत्ती लपेटक, झुलसा रोग (Blast)",
            market: "घरेलू और निर्यात बाजारों में उच्च मांग"
        },
        "Wheat": {
            duration: "110-140 दिन",
            temp: "15°C - 20°C",
            sowing: "ड्रिल या छिड़काव विधि, 4-5 सेमी गहरा",
            pests: "गेरुआ (Rust), कंडुआ रोग (Loose smut), चेपा (Aphids)",
            market: "साल भर स्थिर खाद्यान्न मांग"
        },
        "Cotton": {
            duration: "150-180 दिन",
            temp: "21°C - 30°C",
            sowing: "लाइन में बुवाई, 3-4 सेमी गहरी",
            pests: "गुलाबी सुंडी (Bollworm), सफेद मक्खी, जैसिड्स",
            market: "कपड़ा उद्योगों के लिए उच्च व्यावसायिक मूल्य"
        },
        "Sugarcane": {
            duration: "10-12 महीने",
            temp: "20°C - 35°C",
            sowing: "नाली विधि (furrows) में टुकड़ों (setts) की रोपाई, 10-12 सेमी गहरी",
            pests: "पायरीला, अगेती तना छेदक, लाल सड़न (Red rot)",
            market: "चीनी मिलों के लिए उच्च नकदी फसल मूल्य"
        },
        "Mustard": {
            duration: "110-130 दिन",
            temp: "10°C - 25°C",
            sowing: "लाइन में बुवाई, 2-3 सेमी गहरी",
            pests: "सरसों तेल के लिए चेपा (Aphids), आरा मक्खी",
            market: "सरसों तेल निष्कर्षण के लिए निरंतर मांग"
        },
        "Maize": {
            duration: "90-110 दिन",
            temp: "21°C - 27°C",
            sowing: "3-5 सेमी गहराई पर बुवाई",
            pests: "फॉल आर्मीवॉर्म, तना छेदक",
            market: "पशु आहार और खाद्य प्रसंस्करण में अत्यधिक उपयोग"
        },
        "Pulse (Moong)": {
            duration: "60-75 दिन",
            temp: "25°C - 35°C",
            sowing: "3-4 सेमी गहराई पर बुवाई",
            pests: "फली छेदक, सफेद मक्खी, पीला मोज़ेक वायरस",
            market: "पौध प्रोटीन के समृद्ध स्रोत के रूप में उच्च मांग"
        },
        "Groundnut": {
            duration: "110-130 दिन",
            temp: "22°C - 30°C",
            sowing: "5 सेमी गहराई पर बुवाई",
            pests: "सफेद लट (White grub), लाल बालों वाली इल्ली, टिक्का रोग",
            market: "खाद्य तेल के लिए मजबूत व्यावसायिक मूल्य"
        }
    }
};

const seasonTranslation = {
    en: { kharif: "Kharif", rabi: "Rabi", zaid: "Zaid", year_round: "Year-Round" },
    hi: { kharif: "खरीफ", rabi: "रबी", zaid: "जायद", year_round: "वर्ष भर" }
};

const profitTranslation = {
    en: { High: "High", Medium: "Medium", Low: "Low", "N/A": "N/A" },
    hi: { High: "उच्च", Medium: "मध्यम", Low: "कम", "N/A": "लागू नहीं" }
};

const Suggestion = () => {
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState('advisor'); // 'advisor' or 'predictor'
    
    // Advisor state
    const [formData, setFormData] = useState({
        season: 'kharif',
        soil: 'alluvial',
        water: 'medium'
    });
    const [recommendations, setRecommendations] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [searchSnippets, setSearchSnippets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Predictor state
    const [predictorForm, setPredictorForm] = useState({
        crop_type: 'Rice',
        farm_area: 50,
        irrigation_type: 'Drip',
        fertilizer_used: 4.5,
        pesticide_used: 1.8,
        soil_type: 'Clay',
        season: 'Kharif',
        water_usage: 45000
    });
    const [predicting, setPredicting] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const [mlMetrics, setMlMetrics] = useState(null);
    const [predictorError, setPredictorError] = useState(null);

    const activeTranslations = localTranslations[language] || localTranslations.en;

    // Fetch backtesting metrics on mount
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await axios.get('/api/ml-metrics');
                setMlMetrics(res.data);
            } catch (err) {
                console.error("Failed to fetch ML metrics from backend:", err);
            }
        };
        fetchMetrics();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePredictorChange = (e) => {
        const { name, value } = e.target;
        const processedValue = ['farm_area', 'fertilizer_used', 'pesticide_used', 'water_usage'].includes(name)
            ? parseFloat(value) || 0
            : value;
        setPredictorForm({ ...predictorForm, [name]: processedValue });
    };

    const getSuggestions = async () => {
        setLoadingSuggestions(true);
        setSearchSnippets([]);
        setSearchQuery('');

        const db = [
            { name: "Rice (Paddy)", season: "kharif", soil: "alluvial", water: "high", profit: "High" },
            { name: "Wheat", season: "rabi", soil: "alluvial", water: "medium", profit: "Medium" },
            { name: "Cotton", season: "kharif", soil: "black", water: "medium", profit: "High" },
            { name: "Sugarcane", season: "year_round", soil: "alluvial", water: "high", profit: "High" },
            { name: "Mustard", season: "rabi", soil: "alluvial", water: "low", profit: "Medium" },
            { name: "Maize", season: "kharif", soil: "red", water: "medium", profit: "Medium" },
            { name: "Pulse (Moong)", season: "zaid", soil: "alluvial", water: "low", profit: "Low" },
            { name: "Groundnut", season: "kharif", soil: "red", water: "medium", profit: "High" }
        ];

        const filtered = db.filter(crop =>
            (crop.season === formData.season || crop.season === 'year_round') &&
            (crop.soil === formData.soil) &&
            (crop.water === formData.water || (formData.water === 'high' && crop.water !== 'low'))
        );

        if (filtered.length > 0) {
            setRecommendations(filtered);
            setLoadingSuggestions(false);
        } else {
            // No local database match, query web search engine
            try {
                const response = await axios.get(`/api/search-suggestions?season=${formData.season}&soil=${formData.soil}&water=${formData.water}`);
                const { recommendations: webRecommendations, snippets, query } = response.data;
                
                if (webRecommendations && webRecommendations.length > 0) {
                    setRecommendations(webRecommendations);
                } else {
                    setRecommendations([{ name: "No specific match found even via web search. Try Wheat or Maize universally.", profit: "N/A", season: "year_round" }]);
                }
                setSearchSnippets(snippets || []);
                setSearchQuery(query || '');
            } catch (err) {
                console.error("Web search suggestion failed:", err);
                setRecommendations([{ name: "No local match, and web search failed. Try Wheat or Maize universally.", profit: "N/A", season: "year_round" }]);
            } finally {
                setLoadingSuggestions(false);
            }
        }
    };

    const runYieldPrediction = async (e) => {
        e.preventDefault();
        setPredicting(true);
        setPredictorError(null);
        setPredictionResult(null);
        
        try {
            const res = await axios.post('/api/predict-yield', predictorForm);
            setPredictionResult(res.data);
        } catch (err) {
            console.error("Prediction failed:", err);
            setPredictorError(err.response?.data?.error || "Failed to contact the prediction model. Make sure the backend server is running.");
        } finally {
            setPredicting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Title Section */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-3">
                    <Sprout className="text-fasal-green animate-bounce" size={38} />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-600">
                        Fasal AI Yield Engine
                    </span>
                </h1>
                <p className="text-gray-500 mt-2 text-md max-w-xl mx-auto">
                    Optimizing Indian agriculture using modern data science, custom suggestions, and machine learning models.
                </p>
            </div>

            {/* Premium Tab Selector */}
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('advisor')}
                    className={`px-6 py-2.5 rounded-full font-bold transition duration-300 flex items-center gap-2 shadow-sm border ${
                        activeTab === 'advisor'
                            ? 'bg-gradient-to-r from-emerald-600 to-lime-600 text-white border-transparent'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <Sprout size={18} />
                    {activeTranslations.tab_advisor}
                </button>
                <button
                    onClick={() => setActiveTab('predictor')}
                    className={`px-6 py-2.5 rounded-full font-bold transition duration-300 flex items-center gap-2 shadow-sm border ${
                        activeTab === 'predictor'
                            ? 'bg-gradient-to-r from-emerald-600 to-lime-600 text-white border-transparent'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <Sparkles size={18} />
                    {activeTranslations.tab_predictor}
                </button>
            </div>

            {/* Tab 1: Farming Advisor */}
            {activeTab === 'advisor' && (
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-md border border-gray-100 h-fit">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-50">
                            <Activity size={18} className="text-emerald-500" />
                            {activeTranslations.tab_advisor}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{activeTranslations.season}</label>
                                <select name="season" value={formData.season} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-white">
                                    <option value="kharif">{activeTranslations.season_kharif}</option>
                                    <option value="rabi">{activeTranslations.season_rabi}</option>
                                    <option value="zaid">{activeTranslations.season_zaid}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{activeTranslations.soil}</label>
                                <select name="soil" value={formData.soil} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-white">
                                    <option value="alluvial">{activeTranslations.soil_alluvial}</option>
                                    <option value="black">{activeTranslations.soil_black}</option>
                                    <option value="red">{activeTranslations.soil_red}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{activeTranslations.water}</label>
                                <select name="water" value={formData.water} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-white">
                                    <option value="high">{activeTranslations.water_high}</option>
                                    <option value="medium">{activeTranslations.water_medium}</option>
                                    <option value="low">{activeTranslations.water_low}</option>
                                </select>
                            </div>
                            <button
                                onClick={getSuggestions}
                                className="w-full bg-gradient-to-r from-emerald-600 to-lime-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition shadow-sm"
                            >
                                {activeTranslations.btn}
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="md:col-span-2">
                        {loadingSuggestions ? (
                            <div className="flex flex-col items-center justify-center h-64 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <Activity className="animate-spin mb-4 text-emerald-500" size={48} />
                                <p className="text-gray-500 font-medium">Searching Agricultural Web Index...</p>
                            </div>
                        ) : recommendations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 border-dashed">
                                <Sprout size={48} className="mb-2 text-emerald-300" />
                                <p>{activeTranslations.placeholder}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recommendations.map((crop, idx) => {
                                    const isMockNoMatch = crop.profit === "N/A";
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-emerald-500 border border-gray-100 flex justify-between items-center hover:shadow-md transition"
                                        >
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                                    {activeTranslations.crop_names[crop.name] || crop.name}
                                                    {crop.isWebSearchResult && (
                                                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                                                            Live Web Match
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                    <CloudRain size={14} className="text-blue-400" /> 
                                                    <span>{(seasonTranslation[language]?.[crop.season] || crop.season).toUpperCase()}</span>
                                                    <span className="text-gray-300">|</span>
                                                    <ThermometerSun size={14} className="text-amber-500" /> 
                                                    <span>{activeTranslations.profit}: {profitTranslation[language]?.[crop.profit] || crop.profit}</span>
                                                </p>
                                            </div>
                                            {!isMockNoMatch && (
                                                <button
                                                    onClick={() => setSelectedCrop(crop)}
                                                    className="text-emerald-600 text-sm font-bold border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition duration-200"
                                                >
                                                    {activeTranslations.details_btn}
                                                </button>
                                            )}
                                        </motion.div>
                                    );
                                })}

                                {searchSnippets.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-5 rounded-2xl border border-emerald-100/50 space-y-3"
                                    >
                                        <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                                            <Sparkles size={16} className="text-emerald-600 animate-pulse" />
                                            Live Web Search Evidence
                                        </h4>
                                        <p className="text-xs text-emerald-700 italic">Query: "{searchQuery}"</p>
                                        <ul className="space-y-2">
                                            {searchSnippets.map((snippet, idx) => (
                                                <li key={idx} className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs leading-relaxed">
                                                    {snippet}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tab 2: AI Yield Predictor */}
            {activeTab === 'predictor' && (
                <div className="space-y-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Form */}
                        <form onSubmit={runYieldPrediction} className="md:col-span-1 bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-50">
                                <FlaskConical size={18} className="text-lime-500" />
                                {activeTranslations.predictor_title}
                            </h2>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{activeTranslations.crop_type}</label>
                                <select name="crop_type" value={predictorForm.crop_type} onChange={handlePredictorChange} className="w-full p-2 border rounded-lg bg-white text-sm">
                                    {['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Tomato', 'Potato', 'Carrot', 'Soybean', 'Barley', 'Maize'].map(crop => (
                                        <option key={crop} value={crop}>{activeTranslations.crop_names[crop] || crop}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{activeTranslations.farm_area}</label>
                                    <input type="number" name="farm_area" value={predictorForm.farm_area} onChange={handlePredictorChange} min="1" step="any" className="w-full p-2 border rounded-lg text-sm bg-white" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{activeTranslations.season}</label>
                                    <select name="season" value={predictorForm.season} onChange={handlePredictorChange} className="w-full p-2 border rounded-lg bg-white text-sm">
                                        {['Kharif', 'Rabi', 'Zaid'].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{activeTranslations.irrigation_type}</label>
                                    <select name="irrigation_type" value={predictorForm.irrigation_type} onChange={handlePredictorChange} className="w-full p-2 border rounded-lg bg-white text-sm">
                                        {['Drip', 'Sprinkler', 'Flood', 'Rain-fed', 'Manual'].map(i => (
                                            <option key={i} value={i}>{activeTranslations.irrigation_names[i] || i}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{activeTranslations.soil}</label>
                                    <select name="soil_type" value={predictorForm.soil_type} onChange={handlePredictorChange} className="w-full p-2 border rounded-lg bg-white text-sm">
                                        {['Loamy', 'Peaty', 'Silty', 'Clay', 'Sandy'].map(s => (
                                            <option key={s} value={s}>{activeTranslations.soil_names[s] || s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{activeTranslations.fertilizer_used}</label>
                                <input type="number" name="fertilizer_used" value={predictorForm.fertilizer_used} onChange={handlePredictorChange} min="0" step="any" className="w-full p-2 border rounded-lg text-sm bg-white" required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{activeTranslations.pesticide_used}</label>
                                    <input type="number" name="pesticide_used" value={predictorForm.pesticide_used} onChange={handlePredictorChange} min="0" step="any" className="w-full p-2 border rounded-lg text-sm bg-white" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{activeTranslations.water_usage}</label>
                                    <input type="number" name="water_usage" value={predictorForm.water_usage} onChange={handlePredictorChange} min="0" step="any" className="w-full p-2 border rounded-lg text-sm bg-white" required />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={predicting}
                                className="w-full bg-gradient-to-r from-emerald-600 to-lime-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-75"
                            >
                                {predicting ? (
                                    <>
                                        <Activity className="animate-spin" size={16} />
                                        {activeTranslations.predicting_btn}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} />
                                        {activeTranslations.predict_btn}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Result Display */}
                        <div className="md:col-span-2 flex flex-col justify-between">
                            {predictorError && (
                                <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100 flex items-start gap-3 h-fit">
                                    <X className="text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-sm">Prediction Service Error</h3>
                                        <p className="text-xs mt-1 leading-relaxed">{predictorError}</p>
                                    </div>
                                </div>
                            )}

                            {!predictionResult && !predictorError && !predicting && (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 border-dashed my-auto">
                                    <Sparkles size={48} className="mb-2 text-lime-400 animate-pulse" />
                                    <p className="text-center">{activeTranslations.enter_inputs}</p>
                                </div>
                            )}

                            {predicting && (
                                <div className="flex flex-col items-center justify-center h-64 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 my-auto">
                                    <Activity size={48} className="animate-spin mb-4 text-emerald-500" />
                                    <p className="text-gray-500 font-medium">{activeTranslations.predicting_btn}</p>
                                </div>
                            )}

                            {predictionResult && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6 flex-grow flex flex-col justify-between"
                                >
                                    {/* Main Yield Card */}
                                    <div className="bg-gradient-to-br from-emerald-600 to-lime-600 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-48">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <Sprout size={160} />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">{activeTranslations.result_title}</span>
                                        <div>
                                            <span className="text-5xl font-black tracking-tight">{predictionResult.predicted_yield}</span>
                                            <span className="text-xl ml-2 font-bold">{activeTranslations.tons}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-white/20 pt-3">
                                            <span className="text-xs text-emerald-100 flex items-center gap-1">
                                                <Activity size={14} />
                                                {activeTranslations.yield_per_acre}: <strong>{predictionResult.yield_per_acre} {activeTranslations.tons_per_acre}</strong>
                                            </span>
                                            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-bold">
                                                CatBoost ML Model
                                            </span>
                                        </div>
                                    </div>

                                    {/* AI Advisory recommendations */}
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-grow">
                                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <Sparkles size={16} className="text-amber-500" />
                                            {activeTranslations.advisory_tips}
                                        </h3>
                                        {predictionResult.recommendations && predictionResult.recommendations.length > 0 ? (
                                            <ul className="space-y-2.5">
                                                {predictionResult.recommendations.map((tip, i) => (
                                                    <li key={i} className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-2.5">
                                                        <Droplets size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                                        <span>{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-xs text-emerald-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 flex items-center gap-2">
                                                <ShieldCheck size={16} className="text-emerald-500" />
                                                <span>Your resource inputs are perfectly balanced and optimized for this crop yield!</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Backtesting Performance Panel */}
                    {mlMetrics && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <BarChart3 className="text-emerald-600" size={20} />
                                    {activeTranslations.backtesting_title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    {activeTranslations.backtesting_desc}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-4 gap-4">
                                <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50 text-center">
                                    <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">{activeTranslations.best_model}</span>
                                    <h4 className="text-lg font-black text-emerald-700 mt-1">{mlMetrics.best_model}</h4>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{activeTranslations.dataset_size}</span>
                                    <h4 className="text-lg font-black text-gray-800 mt-1">{mlMetrics.dataset_info.total_rows}</h4>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{activeTranslations.original_samples}</span>
                                    <h4 className="text-lg font-black text-gray-800 mt-1">{mlMetrics.dataset_info.original_rows}</h4>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{activeTranslations.synthetic_samples}</span>
                                    <h4 className="text-lg font-black text-gray-800 mt-1">{mlMetrics.dataset_info.synthetic_rows}</h4>
                                </div>
                            </div>

                            {/* Metrics comparison table */}
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold">
                                            <th className="p-3.5">{activeTranslations.model_name}</th>
                                            <th className="p-3.5">{activeTranslations.cv_r2}</th>
                                            <th className="p-3.5">{activeTranslations.cv_mae}</th>
                                            <th className="p-3.5">{activeTranslations.cv_mse}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-gray-700">
                                        {Object.entries(mlMetrics.metrics).map(([name, data]) => {
                                            const isBest = name === mlMetrics.best_model;
                                            return (
                                                <tr key={name} className={`hover:bg-gray-50/50 transition ${isBest ? 'bg-emerald-50/20 font-semibold' : ''}`}>
                                                    <td className="p-3.5 flex items-center gap-2">
                                                        {isBest && <Sparkles size={12} className="text-emerald-600" />}
                                                        {name}
                                                    </td>
                                                    <td className="p-3.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className={isBest ? 'text-emerald-700 font-bold' : ''}>
                                                                {data.cv_r2}
                                                            </span>
                                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                                                                <div 
                                                                    className={`h-full rounded-full ${isBest ? 'bg-emerald-500' : 'bg-gray-400'}`}
                                                                    style={{ width: `${Math.max(0, data.cv_r2 * 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3.5">{data.cv_mae}</td>
                                                    <td className="p-3.5">{data.cv_mse}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {selectedCrop && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border-t-4 border-emerald-600"
                        >
                            <button 
                                onClick={() => setSelectedCrop(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {activeTranslations.crop_names[selectedCrop.name] || selectedCrop.name}
                            </h2>
                            
                            {cropDetails[language]?.[selectedCrop.name] ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500">{activeTranslations.modal_duration}</p>
                                            <p className="font-semibold text-gray-800">{cropDetails[language][selectedCrop.name].duration}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500">{activeTranslations.modal_temp}</p>
                                            <p className="font-semibold text-gray-800">{cropDetails[language][selectedCrop.name].temp}</p>
                                        </div>
                                    </div>
                                    <div className="bg-green-50/50 p-3 rounded-xl border border-green-100/50">
                                        <p className="text-xs text-green-700 font-bold uppercase mb-1">{activeTranslations.modal_sowing}</p>
                                        <p className="text-gray-700 text-sm">{cropDetails[language][selectedCrop.name].sowing}</p>
                                    </div>
                                    <div className="bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                                        <p className="text-xs text-red-600 font-bold uppercase mb-1">{activeTranslations.modal_pests}</p>
                                        <p className="text-gray-700 text-sm">{cropDetails[language][selectedCrop.name].pests}</p>
                                    </div>
                                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                        <p className="text-xs text-blue-700 font-bold uppercase mb-1">{activeTranslations.modal_market}</p>
                                        <p className="text-gray-700 text-sm">{cropDetails[language][selectedCrop.name].market}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No additional details available for this item.</p>
                            )}

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedCrop(null)}
                                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition"
                                >
                                    {activeTranslations.modal_close}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Suggestion;
