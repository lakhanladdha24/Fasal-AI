import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
// Import other pages as placeholders for now
import Analyzer from './pages/Analyzer';
import Suggestion from './pages/Suggestion';
import Fertilizer from './pages/Fertilizer';
import News from './pages/News';
import Chatbot from './components/Chatbot';

const AppContent = () => {
  const { language } = useLanguage();

  if (!language) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen bg-fasal-light flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/suggestion" element={<Suggestion />} />
          <Route path="/fertilizer" element={<Fertilizer />} />
          <Route path="/news" element={<News />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
