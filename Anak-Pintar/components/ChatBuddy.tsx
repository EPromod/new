import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { chatWithTeacher, generateSpeech } from '../services/geminiService';
import { Send, Bot, Volume2, Sparkles } from 'lucide-react';

interface Msg {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const SUGGESTIONS = [
  "Kenapa langit berwarna biru? ☁️",
  "Apa makanan singa? 🦁",
  "Ceritakan lelucon dong! 😂",
  "Siapa penemu lampu? 💡",
  "Berapa jarak ke bulan? 🚀"
];

interface ChatBuddyProps {
  onEarnStars: (amount: number) => void;
}

export const ChatBuddy: React.FC<ChatBuddyProps> = ({ onEarnStars }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    { id: 'init', role: 'model', text: 'Halo! Aku Kakak Pintar. Ada yang ingin kamu tanyakan? Aku tahu banyak rahasia dunia loh!' }
  ]);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Msg = { id: Date.now().toString(), role: 'user', text: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithTeacher(history, userMsg.text);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      }]);
      
      onEarnStars(10); // Reward for curiosity
    } catch (e) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Maaf, sinyal kakak sedang jelek. Bisa ulang lagi?"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const playMessage = async (msgId: string, text: string) => {
    if (playingId) return; // Simple block if already playing
    setPlayingId(msgId);
    
    try {
        const buffer = await generateSpeech(text);
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setPlayingId(null);
        source.start(0);
    } catch (e) {
        setPlayingId(null);
        alert("Gagal memutar suara");
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full h-[calc(100vh-140px)] flex flex-col p-2 md:p-4">
      <div className="flex-1 bg-white rounded-3xl shadow-2xl border-4 border-green-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-green-50 p-4 border-b-2 border-green-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full text-green-600 shadow-sm border border-green-200">
                <Bot size={24} />
            </div>
            <div>
                <h2 className="font-bold text-green-900 text-lg">Kakak Pintar</h2>
                <div className="flex items-center gap-1 text-xs text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#f8fff9]">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`p-4 rounded-2xl text-lg shadow-sm relative group ${
                      msg.role === 'user' 
                        ? 'bg-green-500 text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 border-2 border-gray-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                    
                    {/* TTS Button for Model messages */}
                    {msg.role === 'model' && (
                        <button 
                            onClick={() => playMessage(msg.id, msg.text)}
                            disabled={playingId !== null}
                            className={`absolute -bottom-10 left-0 p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-green-600 hover:border-green-300 transition-all shadow-sm opacity-0 group-hover:opacity-100 ${playingId === msg.id ? 'text-green-600 border-green-400 opacity-100 animate-pulse' : ''}`}
                        >
                            <Volume2 size={16} />
                        </button>
                    )}
                  </div>
              </div>
            </div>
          ))}
          
          {loading && (
             <div className="flex justify-start w-full animate-pulse">
               <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-gray-400 text-sm">
                 Sedang mengetik...
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions & Input */}
        <div className="p-4 bg-white border-t border-gray-100 space-y-3">
            {messages.length < 4 && !loading && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {SUGGESTIONS.map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSend(s)}
                            className="whitespace-nowrap px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100 hover:bg-green-100 transition-colors flex items-center gap-1"
                        >
                           <Sparkles size={12} /> {s}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(input)}
                placeholder="Tulis pertanyaanmu..."
                disabled={loading}
                className="flex-1 p-4 rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-50 focus:outline-none bg-gray-50 transition-all text-lg"
            />
            <Button 
                onClick={() => handleSend(input)} 
                disabled={loading || !input.trim()}
                variant="success"
                className="rounded-2xl w-14 flex items-center justify-center shadow-green-200"
            >
                <Send size={24} />
            </Button>
            </div>
        </div>
      </div>
    </div>
  );
};