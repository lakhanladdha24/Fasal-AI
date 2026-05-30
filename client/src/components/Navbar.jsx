import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Cloud, Wind, Droplets, MapPin, Menu, X, Thermometer } from 'lucide-react';
import clsx from 'clsx';

const Navbar = () => {
    const { t, language, selectLanguage } = useLanguage();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [weather, setWeather] = useState(null);
    const [userLocation, setUserLocation] = useState('New Delhi'); // Default

    // Fetch Weather (Mock Lat/Lon for New Delhi or use Browser Geolocation)
    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            try {
                const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`);
                setWeather(response.data.current);
            } catch (error) {
                console.error("Weather fetch failed", error);
            }
        };

        const fetchCityName = async (lat, lon) => {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, {
                    headers: { 'Accept-Language': language === 'hi' ? 'hi' : 'en' }
                });
                const address = response.data.address;
                const city = address.city || address.town || address.village || address.suburb || address.county || 'Current Location';
                setUserLocation(city);
            } catch (error) {
                console.error("Geocoding failed", error);
                setUserLocation(language === 'hi' ? 'वर्तमान स्थान' : 'Current Location');
            }
        };

        // Attempt to get location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather(latitude, longitude);
                    fetchCityName(latitude, longitude);
                },
                () => {
                    fetchWeather(28.6139, 77.2090);
                    setTimeout(() => {
                        setUserLocation(language === 'hi' ? 'नई दिल्ली' : 'New Delhi');
                    }, 0);
                }
            );
        } else {
            fetchWeather(28.6139, 77.2090);
            setTimeout(() => {
                setUserLocation(language === 'hi' ? 'नई दिल्ली' : 'New Delhi');
            }, 0);
        }
    }, [language]);

    const navItems = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.news'), path: '/news' },
        { name: t('nav.suggestion'), path: '/suggestion' },
        { name: t('nav.fertilizer'), path: '/fertilizer' },
        { name: t('nav.analyzer'), path: '/analyzer' },
        { name: t('nav.chatbot'), path: '/chatbot' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-fasal-green to-lime-600 bg-clip-text text-transparent">
                            Fasal AI 🌾
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                                    location.pathname === item.path
                                        ? "text-fasal-green bg-green-50"
                                        : "text-gray-600 hover:text-fasal-green hover:bg-green-50"
                                    )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Weather Widget & Language Selector (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="hidden lg:flex items-center space-x-4 bg-green-50 px-3 py-1 rounded-full text-xs text-green-800">
                            {weather ? (
                                <>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        <span>{userLocation}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Thermometer size={14} />
                                        <span>{weather.temperature_2m}°C</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Wind size={14} />
                                        <span>{weather.wind_speed_10m} km/h</span>
                                    </div>
                                </>
                            ) : (
                                <span>Loading Weather...</span>
                            )}
                        </div>

                        {/* Language Toggle */}
                        <button
                            onClick={() => selectLanguage(language === 'en' ? 'hi' : 'en')}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-full text-xs transition duration-200 shadow-sm hover:shadow-md"
                        >
                            <span>{language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-green-600 focus:outline-none"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                            >
                                {item.name}
                            </Link>
                        ))}
                        {/* Mobile Weather */}
                        <div className="px-3 py-2 text-sm text-green-700 bg-green-50 rounded mt-2">
                            {weather ? (
                                <div className="flex justify-between">
                                    <span>{weather.temperature_2m}°C</span>
                                    <span>{userLocation}</span>
                                </div>
                            ) : <span>Weather Loading...</span>}
                        </div>
                        {/* Mobile Language Toggle */}
                        <div className="px-3 py-2 mt-2">
                            <button
                                onClick={() => {
                                    selectLanguage(language === 'en' ? 'hi' : 'en');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg text-sm transition"
                            >
                                <span>{language === 'en' ? '🇮🇳 हिंदी में बदलें' : '🇬🇧 Switch to English'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
