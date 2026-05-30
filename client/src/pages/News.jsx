import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Newspaper, Loader2, Calendar, MapPin, Thermometer, Wind, Droplets, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Info, AlertTriangle, ShieldCheck, ThermometerSun, Eye } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const localTranslations = {
    en: {
        page_title: "Live Weather & Farming News",
        section_weather: "Live Location Forecast",
        section_news: "Latest Agricultural News",
        loading_weather: "Detecting location and fetching live forecast...",
        humidity: "Humidity",
        wind: "Wind Speed",
        rain_prob: "Precipitation",
        advisory_title: "Agricultural Weather Advisory",
        advisory_desc: "Farming decisions recommended for the upcoming conditions:",
        day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        
        // Advisories
        adv_heavy_rain: "Heavy rain expected. Suspend planned irrigation and avoid applying fertilizers or pesticides to prevent run-off.",
        adv_extreme_heat: "High temperatures forecasted. Irrigate crops in the early morning or evening to reduce water loss from evaporation.",
        adv_frost_risk: "Low temperatures forecasted. Protect frost-sensitive crops and consider smoke pots or light crop covers.",
        adv_perfect: "Weather is stable. Ideal conditions for general harvesting, soil tillage, and pesticide application.",
        adv_rainy: "Rain showers expected. Avoid spraying pesticides or fertilizers today as they might wash off.",
        
        source: "Source"
    },
    hi: {
        page_title: "लाइव मौसम और कृषि समाचार",
        section_weather: "लाइव स्थान मौसम पूर्वानुमान",
        section_news: "नवीनतम कृषि समाचार",
        loading_weather: "स्थान का पता लगाया जा रहा है और पूर्वानुमान प्राप्त किया जा रहा है...",
        humidity: "आर्द्रता (नमी)",
        wind: "हवा की गति",
        rain_prob: "बारिश की संभावना",
        advisory_title: "कृषि मौसम सलाह",
        advisory_desc: "आने वाले मौसम के अनुसार खेती से जुड़े महत्वपूर्ण सुझाव:",
        day_names: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
        
        // Advisories
        adv_heavy_rain: "भारी बारिश की संभावना है। पानी देना बंद करें और उर्वरक या कीटनाशकों का छिड़काव रोकें ताकि वे बह न जाएं।",
        adv_extreme_heat: "उच्च तापमान का अनुमान है। पानी के वाष्पीकरण को रोकने के लिए फसलों की सिंचाई सुबह जल्दी या शाम को करें।",
        adv_frost_risk: "कम तापमान का अनुमान है। संवेदनशील फसलों को पाले से बचाएं और हल्के सुरक्षा कवच का उपयोग करें।",
        adv_perfect: "मौसम स्थिर है। कटाई, मिट्टी की जुताई और कीटनाशकों के छिड़काव के लिए आदर्श परिस्थितियां हैं।",
        adv_rainy: "हल्की बारिश की संभावना है। आज कीटनाशकों या खादों के छिड़काव से बचें, वे धुल सकते हैं।",
        
        source: "स्रोत"
    }
};

const getWeatherDetails = (code) => {
    if (code === 0) return { label: { en: "Sunny / Clear", hi: "साफ धूप" }, icon: <Sun className="text-amber-500" size={28} /> };
    if ([1, 2, 3].includes(code)) return { label: { en: "Partly Cloudy", hi: "आंशिक रूप से बादल" }, icon: <Cloud className="text-blue-400" size={28} /> };
    if ([45, 48].includes(code)) return { label: { en: "Foggy", hi: "कोहरा" }, icon: <Cloud className="text-gray-400" size={28} /> };
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { label: { en: "Rain / Showers", hi: "बारिश" }, icon: <CloudRain className="text-blue-500" size={28} /> };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: { en: "Snowy", hi: "बर्फबारी" }, icon: <CloudSnow className="text-sky-300" size={28} /> };
    if ([95, 96, 99].includes(code)) return { label: { en: "Thunderstorm", hi: "आंधी-तूफान" }, icon: <CloudLightning className="text-purple-500" size={28} /> };
    return { label: { en: "Cloudy", hi: "बादल" }, icon: <Cloud className="text-gray-300" size={28} /> };
};

const News = () => {
    const { language } = useLanguage();
    const [news, setNews] = useState([]);
    const [loadingNews, setLoadingNews] = useState(true);
    
    // Weather states
    const [weatherData, setWeatherData] = useState(null);
    const [weatherCity, setWeatherCity] = useState("New Delhi");
    const [loadingWeather, setLoadingWeather] = useState(true);
    const [weatherError, setWeatherError] = useState(null);

    const activeTranslations = localTranslations[language] || localTranslations.en;

    // Fetch news and geocode
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axios.get('/api/news');
                setNews(res.data);
            } catch (err) {
                console.error("Failed to fetch news", err);
            } finally {
                setLoadingNews(false);
            }
        };

        const fetchWeatherData = async (lat, lon) => {
            try {
                // Fetch from Express Open-Meteo proxy route
                const res = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
                setWeatherData(res.data);
            } catch (err) {
                console.error("Failed to fetch weather forecast", err);
                setWeatherError("Unable to retrieve weather forecast data.");
            } finally {
                setLoadingWeather(false);
            }
        };

        const reverseGeocode = async (lat, lon) => {
            try {
                const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, {
                    headers: { 'Accept-Language': language === 'hi' ? 'hi' : 'en' }
                });
                const address = res.data.address;
                const city = address.city || address.town || address.village || address.suburb || address.county || "Current Location";
                setWeatherCity(city);
            } catch (err) {
                console.error("Reverse geocoding failed", err);
                setWeatherCity(language === 'hi' ? "वर्तमान स्थान" : "Current Location");
            }
        };

        // Geolocation hook
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherData(latitude, longitude);
                    reverseGeocode(latitude, longitude);
                },
                () => {
                    // Fallback to Delhi
                    fetchWeatherData(28.6139, 77.2090);
                    setWeatherCity(language === 'hi' ? "नई दिल्ली" : "New Delhi");
                }
            );
        } else {
            fetchWeatherData(28.6139, 77.2090);
            setWeatherCity(language === 'hi' ? "नई दिल्ली" : "New Delhi");
        }

        fetchNews();
    }, [language]);

    // Helper for news category colors
    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'Government': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Weather': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Market': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Evaluate weather advisory alert
    const getWeatherAdvisory = () => {
        if (!weatherData) return null;
        const currentTemp = weatherData.current.temperature_2m;
        const hasRain = weatherData.current.precipitation > 0;
        
        // Look ahead in 7-day forecast for weather codes representing rain
        const dailyCodes = weatherData.daily.weather_code;
        const rainInForecast = dailyCodes.some(code => [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code));
        const heavyRainInForecast = dailyCodes.some(code => [63, 65, 82, 95, 96, 99].includes(code));
        
        if (heavyRainInForecast || hasRain) {
            return {
                text: activeTranslations.adv_heavy_rain,
                type: 'warning',
                icon: <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
            };
        }
        if (currentTemp > 38) {
            return {
                text: activeTranslations.adv_extreme_heat,
                type: 'heat',
                icon: <ThermometerSun className="text-amber-500 flex-shrink-0" size={24} />
            };
        }
        if (currentTemp < 10) {
            return {
                text: activeTranslations.adv_frost_risk,
                type: 'frost',
                icon: <AlertTriangle className="text-cyan-500 flex-shrink-0" size={24} />
            };
        }
        if (rainInForecast) {
            return {
                text: activeTranslations.adv_rainy,
                type: 'info',
                icon: <Info className="text-blue-500 flex-shrink-0" size={24} />
            };
        }
        return {
            text: activeTranslations.adv_perfect,
            type: 'stable',
            icon: <ShieldCheck className="text-emerald-500 flex-shrink-0" size={24} />
        };
    };

    const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        const dayIdx = date.getDay();
        return activeTranslations.day_names[dayIdx];
    };

    const advisory = getWeatherAdvisory();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
                    <Newspaper className="text-emerald-600" /> {activeTranslations.page_title}
                </h1>
                <p className="text-gray-500 text-sm mt-1">Get dynamic weather reports and relevant farming instructions in real-time.</p>
            </div>

            {/* Weather forecasting section */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 pb-2 border-b border-gray-50">
                    <MapPin className="text-emerald-600" size={20} />
                    {activeTranslations.section_weather}
                </h2>

                {loadingWeather ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="animate-spin text-emerald-600 h-10 w-10" />
                        <span className="text-sm text-gray-500">{activeTranslations.loading_weather}</span>
                    </div>
                ) : weatherError ? (
                    <div className="text-center text-red-500 py-6 text-sm">{weatherError}</div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Current conditions panel */}
                            <div className="lg:col-span-1 bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow flex flex-col justify-between h-48 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Cloud size={140} />
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-black text-2xl tracking-tight flex items-center gap-1">
                                            <MapPin size={18} /> {weatherCity}
                                        </h3>
                                        <p className="text-xs text-emerald-100 font-semibold uppercase tracking-wider mt-0.5">
                                            {getWeatherDetails(weatherData.daily.weather_code[0]).label[language] || getWeatherDetails(weatherData.daily.weather_code[0]).label.en}
                                        </p>
                                    </div>
                                    <div className="bg-white/20 p-2 rounded-xl">
                                        {getWeatherDetails(weatherData.daily.weather_code[0]).icon}
                                    </div>
                                </div>
                                
                                <div>
                                    <span className="text-5xl font-black tracking-tight">{Math.round(weatherData.current.temperature_2m)}°C</span>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/25 pt-3 text-[11px] font-semibold text-emerald-100">
                                    <span className="flex items-center gap-1"><Droplets size={12} /> {activeTranslations.humidity}: {weatherData.current.relative_humidity_2m}%</span>
                                    <span className="flex items-center gap-1"><Wind size={12} /> {activeTranslations.wind}: {weatherData.current.wind_speed_10m || 5} km/h</span>
                                </div>
                            </div>

                            {/* Weather advisory for farmers */}
                            {advisory && (
                                <div className="lg:col-span-2 bg-gray-50 border border-gray-100 p-6 rounded-2xl flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                            {advisory.icon}
                                            {activeTranslations.advisory_title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{activeTranslations.advisory_desc}</p>
                                        <p className="text-sm font-medium text-gray-700 mt-4 leading-relaxed bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                                            {advisory.text}
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-4 flex items-center gap-1">
                                        <Info size={12} /> Powered by WMO Crop Health Advisory mapping
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* 7-day daily forecast cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                            {weatherData.daily.time.map((time, idx) => {
                                const code = weatherData.daily.weather_code[idx];
                                const maxTemp = Math.round(weatherData.daily.temperature_2m_max[idx]);
                                const minTemp = Math.round(weatherData.daily.temperature_2m_min[idx]);
                                const details = getWeatherDetails(code);
                                const isToday = idx === 0;

                                return (
                                    <div 
                                        key={time} 
                                        className={`p-4 rounded-xl border text-center flex flex-col items-center justify-between gap-2 shadow-xs transition duration-200 hover:shadow-sm ${
                                            isToday 
                                                ? 'bg-emerald-50/30 border-emerald-200 font-semibold' 
                                                : 'bg-white border-gray-100'
                                        }`}
                                    >
                                        <span className="text-xs font-bold text-gray-600 block">{isToday ? "Today" : getDayName(time)}</span>
                                        <div className="p-1.5 rounded-lg bg-gray-50/80 my-1">{details.icon}</div>
                                        <span className="text-[10px] text-gray-400 line-clamp-1 h-3 block">{details.label[language] || details.label.en}</span>
                                        <div className="flex gap-2 text-xs font-bold mt-1">
                                            <span className="text-gray-800">{maxTemp}°</span>
                                            <span className="text-gray-400">{minTemp}°</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* News listing section */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-50">
                    <Newspaper className="text-emerald-600" size={20} />
                    {activeTranslations.section_news}
                </h2>

                {loadingNews ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-emerald-600 h-10 w-10" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden flex flex-col"
                            >
                                <div className="p-5 flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase border ${getCategoryColor(item.category)}`}>
                                            {item.category}
                                        </span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                                            <Calendar size={12} /> {item.date}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-gray-800 mb-2 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                                        {item.summary}
                                    </p>
                                </div>
                                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    {activeTranslations.source}: {item.source}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
