import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('fasal_lang') || null);

    const selectLanguage = (lang) => {
        localStorage.setItem('fasal_lang', lang);
        setLanguage(lang);
    };

    const translations = {
        en: {
            nav: {
                home: "Home",
                news: "News",
                suggestion: "Crop Suggestion",
                fertilizer: "Fertilizer",
                analyzer: "AI Crop Analyzer",
                chatbot: "Farmer Chatbot"
            },
            analysis: {
                upload_title: "Upload Crop Image",
                analyze_btn: "Analyze Crop",
                result_title: "Analysis Result"
            },
            hero: {
                tagline: "Smart Farming with AI – Grow More, Spend Less",
                cta_analyze: "Analyze Crop Image",
                cta_ask: "Ask Fasal AI"
            }
        },
        hi: {
            nav: {
                home: "होम",
                news: "समाचार",
                suggestion: "फसल सुझाव",
                fertilizer: "खाद गाइड",
                analyzer: "AI फसल जांच",
                chatbot: "किसान चैटबॉट"
            },
            analysis: {
                upload_title: "फसल की फोटो अपलोड करें",
                analyze_btn: "जांच करें",
                result_title: "जांच परिणाम"
            },
            hero: {
                tagline: "AI के साथ स्मार्ट खेती – ज्यादा उगाएं, कम खर्च करें",
                cta_analyze: "फसल की जांच करें",
                cta_ask: "फसल AI से पूछें"
            }
        }
    };

    // Helper to get text simply: t('nav.home')
    const t = (path) => {
        if (!language) return "";
        const keys = path.split('.');
        let value = translations[language];
        for (const key of keys) {
            value = value?.[key];
        }
        return value || path;
    };

    return (
        <LanguageContext.Provider value={{ language, selectLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
