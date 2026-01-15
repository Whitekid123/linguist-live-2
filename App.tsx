import React, { useState } from "react";
import { Language, Scenario } from "./types";
import { SCENARIOS } from "./constants";
import { LiveConversation } from "./components/LiveConversation";

const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    Language.Spanish
  );
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  const languages = Object.values(Language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 bg-mesh">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <header className="mb-12 text-center animate-fade-in">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-3xl mb-6 shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-300/50 transition-all duration-300 hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 tracking-tight animate-slide-up">
            Linguist <span className="text-blue-600">Live</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed animate-slide-up animation-delay-200">
            Immerse yourself in real-time conversations with our AI language
            partner. Perfect your fluency through immersive roleplay scenarios.
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-12">
          {/* Language Selection */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white/50 animate-fade-in animation-delay-400">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  What are we learning today?
                </h2>
                <p className="text-slate-500">
                  Select your target language to begin your practice session.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang, index) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedLanguage === lang
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-300/50 scale-105"
                        : "bg-white/80 text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Scenarios Grid */}
          <section className="animate-fade-in animation-delay-600">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">
                Choose a Scenario
              </h2>
              <div className="h-1 flex-1 mx-6 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-60"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SCENARIOS.map((scenario, index) => (
                <div
                  key={scenario.id}
                  onClick={() => setActiveScenario(scenario)}
                  className="group cursor-pointer bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden hover:border-blue-200/50"
                  style={{ animationDelay: `${600 + index * 150}ms` }}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <span className="text-8xl">{scenario.icon}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/30 transition-all duration-500 rounded-3xl"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg">
                      {scenario.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {scenario.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed mb-6 group-hover:text-slate-600 transition-colors">
                      {scenario.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-bold gap-2 group-hover:text-blue-700 transition-colors">
                      Start Session
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer Branding */}
        <footer className="mt-24 pt-8 border-t border-slate-200/50 text-center text-slate-400 pb-12 animate-fade-in animation-delay-1000">
          <p className="flex items-center justify-center gap-2 text-slate-500">
            Made with <span className="text-red-400 animate-pulse">❤</span> for
            language lovers
          </p>
          <p className="text-sm mt-2 text-slate-400">
            Powered by Gemini 2.5 Live API
          </p>
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
    </div>
  );
};

export default App;
