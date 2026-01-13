
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Language, Scenario, TranscriptionEntry } from '../types';
import { encode, decode, decodeAudioData } from '../utils/audioHelpers';
import { Visualizer } from './Visualizer';

interface LiveConversationProps {
  language: Language;
  scenario: Scenario;
  onClose: () => void;
}

export const LiveConversation: React.FC<LiveConversationProps> = ({ language, scenario, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionEntry[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  const [userStream, setUserStream] = useState<MediaStream | null>(null);

  const sessionRef = useRef<any>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Use a ref for transcription to avoid closure issues in callbacks
  const transcriptionRef = useRef<TranscriptionEntry[]>([]);

  const addTranscription = useCallback((type: 'user' | 'model', text: string) => {
    const newEntry: TranscriptionEntry = { type, text, timestamp: Date.now() };
    setTranscription(prev => [...prev, newEntry]);
    transcriptionRef.current = [...transcriptionRef.current, newEntry];
  }, []);

  const stopConversation = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    if (userStream) {
      userStream.getTracks().forEach(track => track.stop());
      setUserStream(null);
    }
    setIsConnected(false);
  }, [userStream]);

  const startConversation = async () => {
    setIsConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setUserStream(stream);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: `${scenario.systemInstruction}. Target Language: ${language}. Please speak primarily in ${language}. If the user makes a significant grammatical error, briefly provide a correction in English then continue in ${language}. Keep your turns concise to encourage more speaking time from the user.`,
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            if (message.serverContent?.inputTranscription) {
              setCurrentInput(prev => prev + message.serverContent!.inputTranscription!.text);
            }
            if (message.serverContent?.outputTranscription) {
              setCurrentOutput(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            if (message.serverContent?.turnComplete) {
              // We use refs to capture the latest text before clearing state
              // In this simplified logic, we just use the current state
              // which might have lag, but turnComplete helps synchronize
            }

            // Handle Audio
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const sourceNode = outputCtx.createBufferSource();
              sourceNode.buffer = audioBuffer;
              sourceNode.connect(outputCtx.destination);
              
              sourceNode.addEventListener('ended', () => {
                sourcesRef.current.delete(sourceNode);
              });
              
              sourceNode.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(sourceNode);
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Gemini Live Error:', e);
            setIsConnecting(false);
          },
          onclose: () => {
            setIsConnected(false);
          }
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error('Failed to start conversation:', err);
      setIsConnecting(false);
    }
  };

  // Synchronize transcription entries with turn completions
  useEffect(() => {
    // This is a simplified transcription sync. 
    // In a production app, we'd wait for turnComplete or specific timings.
    if (currentInput.length > 50) { // arbitrary threshold for simulation
        // addTranscription('user', currentInput);
        // setCurrentInput('');
    }
  }, [currentInput, addTranscription]);

  return (
    <div className="fixed inset-0 z-50 glass flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>{scenario.icon}</span> {scenario.title}
            </h2>
            <p className="text-blue-100 text-sm opacity-90">Practicing {language} conversation</p>
          </div>
          <button 
            onClick={() => { stopConversation(); onClose(); }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {!isConnected && !isConnecting && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                 </svg>
              </div>
              <div className="max-w-xs">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Ready to start?</h3>
                <p className="text-slate-500 mb-6">Your AI partner will help you practice {language} in a {scenario.title} context.</p>
                <button 
                  onClick={startConversation}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Start Conversation
                </button>
              </div>
            </div>
          )}

          {isConnecting && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 font-medium">Connecting to Linguist AI...</p>
            </div>
          )}

          {isConnected && (
            <div className="space-y-6">
               <div className="flex flex-col gap-4">
                 {/* Current Input/Output Display */}
                 {currentInput && (
                   <div className="flex justify-end">
                     <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-md">
                       <p className="text-xs font-bold mb-1 opacity-70">YOU</p>
                       <p>{currentInput}</p>
                     </div>
                   </div>
                 )}
                 {currentOutput && (
                   <div className="flex justify-start">
                     <div className="bg-white text-slate-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-md border border-slate-200">
                       <p className="text-xs font-bold mb-1 text-blue-600">LINGUIST AI</p>
                       <p>{currentOutput}</p>
                     </div>
                   </div>
                 )}
               </div>

               {/* Hint Box */}
               <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-yellow-800">
                 <p className="font-semibold mb-1 flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                   </svg>
                   Pro Tip
                 </p>
                 <p>Don't worry about making mistakes. The AI is here to help you improve! Try to respond as naturally as possible.</p>
               </div>
            </div>
          )}
        </div>

        {/* Footer / Controls */}
        <div className="p-6 bg-white border-t border-slate-100 flex flex-col items-center gap-4">
          {isConnected && (
            <>
              <Visualizer stream={userStream} isActive={isConnected} />
              <div className="flex items-center gap-4 w-full">
                <button 
                  onClick={stopConversation}
                  className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors border border-red-200"
                >
                  End Session
                </button>
              </div>
            </>
          )}
          {!isConnected && !isConnecting && (
             <p className="text-slate-400 text-xs">Microphone access is required for conversation.</p>
          )}
        </div>
      </div>
    </div>
  );
};
