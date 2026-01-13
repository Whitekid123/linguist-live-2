
import React, { useState } from 'react';
import { Language, Scenario } from './types';
import { SCENARIOS } from './constants';
import { LiveConversation } from './components/LiveConversation';

const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.Spanish);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  const languages = Object.values(Language);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="inline-block bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-200">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
           </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Linguist <span className="text-blue-600">Live</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
          Immerse yourself in real-time conversations with our AI language partner. 
          Perfect your fluency through immersive roleplay.
        </p>
      </header>

      {/* Main Content */}
      <main className="space-y-12">
        {/* Language Selection */}
        <section className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">What are we learning today?</h2>
              <p className="text-slate-500">Select your target language to begin your practice session.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-200 ${
                    selectedLanguage === lang
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Scenarios Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Choose a Scenario</h2>
            <div className="h-1 flex-1 mx-6 bg-slate-200 rounded-full opacity-30"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCENARIOS.map((scenario) => (
              <div 
                key={scenario.id}
                onClick={() => setActiveScenario(scenario)}
                className="group cursor-pointer bg-white rounded-3xl p-6 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-7xl">{scenario.icon}</span>
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {scenario.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {scenario.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-6">
                    {scenario.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-bold gap-2">
                    Start Session 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Branding */}
      <footer className="mt-24 pt-8 border-t border-slate-200 text-center text-slate-400 pb-12">
        <p className="flex items-center justify-center gap-2">
          Made with <span className="text-red-400">❤</span> for language lovers
        </p>
        <p className="text-sm mt-1">Powered by Gemini 2.5 Live API</p>
      </footer>

      {/* Conversation Modal */}
      {activeScenario && (
        <LiveConversation 
          language={selectedLanguage}
          scenario={activeScenario}
          onClose={() => setActiveScenario(null)}
        />
      )}
    </div>
  );
};

export default App;
