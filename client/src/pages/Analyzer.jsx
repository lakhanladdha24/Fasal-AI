import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import { Upload, Camera, Loader2, CheckCircle, AlertTriangle, Leaf } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const Analyzer = () => {
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
            setError('');
        }
    };

    const analyzeImage = async () => {
        if (!selectedImage) return;

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            // In real app, this goes to Python/Cloud API
            const response = await axios.post('/api/analyze-crop', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(response.data.analysis);
        } catch (err) {
            console.error(err);
            setError("Failed to analyze image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('analysis.upload_title')}</h1>
                <p className="text-gray-500">Upload a clear photo of the affected crop leaf or stem</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center relative overflow-hidden transition-colors ${preview ? 'border-green-500' : 'border-gray-300 hover:border-green-400'}`}>
                        {preview ? (
                            <img src={preview} alt="Crop Preview" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-4">
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>

                    <button
                        onClick={analyzeImage}
                        disabled={!selectedImage || loading}
                        className="w-full mt-4 bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <ScanIcon />}
                        {loading ? "Analyzing..." : t('analysis.analyze_btn')}
                    </button>
                    {error && <p className="text-red-500 text-center mt-2 text-sm">{error}</p>}
                </div>

                {/* Result Section */}
                <div className="relative">
                    <AnimatePresence>
                        {/* Initial State */}
                        {!loading && !result && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8 border border-gray-100 rounded-2xl bg-gray-50/50"
                            >
                                <Leaf size={48} className="mb-4 text-green-200" />
                                <p>Results will appear here after analysis</p>
                            </motion.div>
                        )}

                        {/* Result Display */}
                        {!loading && result && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-lime-500 h-full"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle className="text-lime-600" size={24} />
                                    <h2 className="text-xl font-bold text-gray-800">{t('analysis.result_title')}</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Disease Info */}
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                        <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Detected Issue</span>
                                        <div className="flex justify-between items-center mt-1">
                                            <h3 className="text-2xl font-bold text-gray-800">{result.disease}</h3>
                                            <span className="bg-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                                                {(result.confidence * 100).toFixed(0)}% Confidence
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Growth Stage</p>
                                            <p className="font-semibold text-gray-700">{result.details.growth_stage}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Harvest In</p>
                                            <p className="font-semibold text-gray-700">{result.details.harvest_time_estimate}</p>
                                        </div>
                                    </div>

                                    {/* Remedy */}
                                    <div>
                                        <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                                            <Leaf size={16} className="text-green-600" /> Recommended Action
                                        </h4>
                                        <p className="text-gray-600 text-sm bg-green-50 p-3 rounded-lg border border-green-100">
                                            {result.details.remedy}
                                        </p>
                                    </div>

                                    {/* Fertilizer */}
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm mb-1">Suggested Fertilizer</h4>
                                        <p className="text-green-700 font-medium">{result.details.fertilizer_recommendation}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// Helper Icon
const ScanIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /></svg>
)

export default Analyzer;
