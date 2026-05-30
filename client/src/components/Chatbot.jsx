import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Send, Mic, MicOff, Volume2, User, Bot, RefreshCw } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Chatbot = () => {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState([
        { sender: 'bot', text: language === 'hi' ? "नमस्ते! मैं फसल एआई हूँ। पूछिए सवाल?" : "Hello! I'm Fasal AI. Ask me anything about farming." }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Send Message
    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        // Add user message
        const newMsgs = [...messages, { sender: 'user', text }];
        setMessages(newMsgs);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('/api/chat', { message: text, language });
            const botReply = res.data.reply;

            setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);

            // Speak reply
            speak(botReply);
        } catch {
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I am having trouble connecting. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    // Voice Recognition (Web Speech API)
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Voice input is not supported in this browser. Try Chrome.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            handleSend(transcript); // Auto send on voice end? Optional. Let's do it.
        };

        recognition.start();
    };

    // Text to Speech
    const speak = (text) => {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel(); // Stop previous
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">{t('nav.chatbot')}</h1>

            {/* Chat Area */}
            <div className="flex-grow bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-end gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-green-100 text-green-700' : 'bg-lime-500 text-white'}`}>
                                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                ? 'bg-green-50 text-gray-800 rounded-br-none'
                                : 'bg-lime-50 text-gray-800 rounded-bl-none border border-lime-100'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    </motion.div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none text-gray-500 text-xs flex items-center gap-1">
                            <RefreshCw className="animate-spin" size={12} /> Typing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="mt-4 bg-white p-2 rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
                <button
                    onClick={startListening}
                    className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={language === 'hi' ? "यहाँ टाइप करें या बोलें..." : "Type or speak..."}
                    className="flex-grow bg-transparent border-none focus:ring-0 outline-none px-2 text-gray-700"
                />

                <button
                    onClick={() => handleSend()}
                    className="p-3 bg-fasal-green hover:bg-green-700 text-white rounded-full transition-transform active:scale-95"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
