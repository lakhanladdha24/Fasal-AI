import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown, ChevronUp, Droplet } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const Fertilizer = () => {
    const { t, language } = useLanguage();
    const [expanded, setExpanded] = useState(null);

    const labels = {
        en: {
            organic: "Organic (Recommended)",
            chemical: "Chemical",
            schedule: "Schedule",
            tips: "Important Tip"
        },
        hi: {
            organic: "जैविक (अनुशंसित)",
            chemical: "रासायनिक",
            schedule: "समय सारणी (Schedule)",
            tips: "महत्वपूर्ण सुझाव"
        }
    };

    const data = {
        en: [
            {
                crop: "Wheat",
                organic: "Farmyard Manure (FYM), Vermicompost",
                chemical: "Urea, DAP (Only if needed)",
                schedule: "Apply FYM 15 days before sowing. Top dressing at crown root initiation.",
                tips: "Avoid excess nitrogen to prevent lodging."
            },
            {
                crop: "Rice (Paddy)",
                organic: "Green Manure (Dhaincha), Blue Green Algae",
                chemical: "NPK 120:60:60",
                schedule: "Apply green manure before puddling. Zinc sulfate for zinc deficiency.",
                tips: "Maintain standing water for best results."
            },
            {
                crop: "Cotton",
                organic: "Neem Cake, Bio-fertilizers (Azotobacter)",
                chemical: "DAP, MOP",
                schedule: "Basal dose at sowing. Split nitrogen application at flowering.",
                tips: "Magnesium deficiency is common, check leaf reddening."
            },
            {
                crop: "Sugarcane",
                organic: "Press Mud, Compost",
                chemical: "Urea, SSP",
                schedule: "Heavy feeder. Apply compost during land preparation.",
                tips: "Earthing up should follow fertilizer application."
            }
        ],
        hi: [
            {
                crop: "गेहूं (Wheat)",
                organic: "गोबर की खाद (FYM), केंचुआ खाद (वर्मीकंपोस्ट)",
                chemical: "यूरिया, डीएपी (केवल आवश्यकता होने पर)",
                schedule: "बुवाई से 15 दिन पहले गोबर की खाद डालें। मुकुट जड़ दीक्षा (Crown Root Initiation) पर टॉप ड्रेसिंग करें।",
                tips: "गेहूं को गिरने से बचाने के लिए अत्यधिक नाइट्रोजन से बचें।"
            },
            {
                crop: "धान (Rice / Paddy)",
                organic: "हरी खाद (ढैंचा), नील-हरित शैवाल",
                chemical: "एनपीके 120:60:60",
                schedule: "कद्दू (puddling) करने से पहले हरी खाद मिलाएं। जिंक की कमी के लिए जिंक सल्फेट डालें।",
                tips: "बेहतर परिणाम के लिए खेत में पानी बनाकर रखें।"
            },
            {
                crop: "कपास (Cotton)",
                organic: "नीम की खली, जैव-उर्वरक (एजोटोबैक्टर)",
                chemical: "डीएपी, एमओपी",
                schedule: "बुवाई के समय प्रारंभिक खुराक। फूल आने पर नाइट्रोजन का विभाजित छिड़काव करें।",
                tips: "मैग्नीशियम की कमी आम है, पत्तियों के लाल होने की जांच करें।"
            },
            {
                crop: "गन्ना (Sugarcane)",
                organic: "प्रेस मड, कम्पोस्ट खाद",
                chemical: "यूरिया, एसएसपी",
                schedule: "यह भारी पोषक तत्व लेने वाली फसल है। खेत की तैयारी के समय कम्पोस्ट डालें।",
                tips: "उर्वरक डालने के बाद मिट्टी चढ़ाने (Earthing up) का कार्य करना चाहिए।"
            }
        ]
    };

    const activeData = data[language] || data.en;
    const activeLabels = labels[language] || labels.en;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">{t('nav.fertilizer')}</h1>

            <div className="space-y-4">
                {activeData.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <button
                            onClick={() => setExpanded(expanded === idx ? null : idx)}
                            className="w-full text-left p-5 flex justify-between items-center hover:bg-gray-50 transition"
                        >
                            <span className="text-lg font-bold text-gray-800">{item.crop}</span>
                            {expanded === idx ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                        </button>

                        <AnimatePresence>
                            {expanded === idx && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden bg-green-50/50"
                                >
                                    <div className="p-5 pt-0 border-t border-gray-100">
                                        <div className="mt-4 grid gap-4">
                                            <div className="bg-white p-3 rounded-lg border border-green-100">
                                                <p className="text-xs text-green-600 font-bold uppercase mb-1">{activeLabels.organic}</p>
                                                <p className="text-gray-700">{item.organic}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-red-100">
                                                <p className="text-xs text-red-400 font-bold uppercase mb-1">{activeLabels.chemical}</p>
                                                <p className="text-gray-700">{item.chemical}</p>
                                            </div>
                                            <div className="p-2">
                                                <p className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-1">
                                                    <Droplet size={14} className="text-blue-500" /> {activeLabels.schedule}
                                                </p>
                                                <p className="text-sm text-gray-600">{item.schedule}</p>
                                            </div>
                                            {item.tips && (
                                                <div className="p-2 border-t border-dashed border-gray-200">
                                                    <p className="text-sm font-semibold text-gray-800 mb-1">💡 {activeLabels.tips}</p>
                                                    <p className="text-sm text-gray-600">{item.tips}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Fertilizer;
