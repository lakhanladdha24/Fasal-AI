import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Landing = () => {
    const { selectLanguage } = useLanguage();


    const handleLanguageSelect = (lang) => {
        selectLanguage(lang);
        // No need to navigate if we just change state that App.js listens to re-render
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-4 border-fasal-green">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Fasal AI</h1>
                <p className="text-gray-500 mb-8">Please select your preferred language<br />क कृपया अपनी भाषा चुनें</p>

                <div className="space-y-4">
                    <button
                        onClick={() => handleLanguageSelect('en')}
                        className="w-full group relative flex items-center justify-center py-4 px-6 border-2 border-green-100 hover:border-fasal-green rounded-xl transition-all duration-300 hover:bg-green-50"
                    >
                        <span className="text-4xl mr-4">🇬🇧</span>
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-fasal-dark transition-colors">English</h3>
                            <p className="text-sm text-gray-500">Continue in English</p>
                        </div>
                        <div className="absolute right-4 text-green-300 group-hover:text-fasal-green">→</div>
                    </button>

                    <button
                        onClick={() => handleLanguageSelect('hi')}
                        className="w-full group relative flex items-center justify-center py-4 px-6 border-2 border-green-100 hover:border-fasal-green rounded-xl transition-all duration-300 hover:bg-green-50"
                    >
                        <span className="text-4xl mr-4">🇮🇳</span>
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-fasal-dark transition-colors">हिंदी</h3>
                            <p className="text-sm text-gray-500">हिंदी में जारी रखें</p>
                        </div>
                        <div className="absolute right-4 text-green-300 group-hover:text-fasal-green">→</div>
                    </button>
                </div>

                <p className="mt-8 text-xs text-gray-400">Making Farming Smart & Simple</p>
            </div>
        </div>
    );
};

export default Landing;
