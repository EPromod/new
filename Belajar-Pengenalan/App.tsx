import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES, ITEMS } from './constants';
import { CategoryType, LearningItem } from './types';
import { generateFunFactAndAudio } from './services/geminiService';
import { ArrowLeft, Volume2, Sparkles, Home, Play, Star } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>(null);
  const [activeItem, setActiveItem] = useState<LearningItem | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<{ text: string; audio: string | null } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Simulate loading to ensure everything renders smoothly
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Background with animated gradient
  const renderBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="absolute top-0 left-0 w-full h-full opacity-60">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-[20%] right-[15%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[20%] left-[20%] w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      </div>
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#6366f1 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
    </div>
  );

  const playSystemSound = (text: string) => {
    try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        window.speechSynthesis.speak(utterance);
    } catch (e) {
        console.error("Speech error", e);
    }
  };

  const playAudioBase64 = (base64: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(`data:audio/wav;base64,${base64}`);
    audioRef.current = audio;
    audio.play();
  };

  const handleMagicClick = async (item: LearningItem) => {
    if (aiLoading) return;
    setAiLoading(true);
    setAiData(null);

    playSystemSound(`Sebentar ya, aku sedang berpikir tentang ${item.label}`);

    const result = await generateFunFactAndAudio(item.label);
    
    setAiLoading(false);
    
    if (result) {
      setAiData({ text: result.text, audio: result.audioBase64 || null });
      if (result.audioBase64) {
        playAudioBase64(result.audioBase64);
      } else {
        playSystemSound(result.text);
      }
    } else {
      const fallbackText = `Wow! ${item.label} itu sangat hebat!`;
      setAiData({ text: fallbackText, audio: null });
      playSystemSound(fallbackText);
    }
  };

  const handleCategorySelect = (id: CategoryType, title: string) => {
    playSystemSound(title);
    setTimeout(() => {
        setActiveCategory(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const handleItemSelect = (item: LearningItem) => {
    playSystemSound(item.label);
    setTimeout(() => {
        setActiveItem(item);
        setAiData(null);
        setAiLoading(false);
    }, 200);
  };

  const handleBack = () => {
    playSystemSound("Kembali");
    if (activeItem) {
      setActiveItem(null);
      window.speechSynthesis.cancel();
      if (audioRef.current) audioRef.current.pause();
    } else {
      setActiveCategory(null);
    }
  };

  if (!loaded) return <div className="min-h-screen bg-blue-50 flex items-center justify-center">Loading...</div>;

  // --- 1. HOME SCREEN (Category Selection) ---
  if (!activeCategory) {
    return (
      <div className="min-h-screen relative px-4 py-8 flex flex-col items-center">
        {renderBackground()}
        
        <header className="mb-8 text-center z-10 animate-slide-down">
          <div className="glass-panel px-8 py-5 rounded-full inline-block shadow-lg">
             <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 drop-shadow-sm tracking-wide">
              Dunia Pintar
            </h1>
          </div>
          <div className="mt-4 flex justify-center">
            <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-2xl text-violet-700 font-bold shadow-sm border border-white">
                ✨ Belajar jadi seru!
            </span>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl w-full z-10 pb-12">
          {CATEGORIES.map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id, cat.title)}
              className={`
                relative group overflow-hidden
                ${cat.color} 
                border-b-8 ${cat.accentColor}
                active:border-b-0 active:translate-y-2
                rounded-3xl p-4
                shadow-xl hover:shadow-2xl hover:shadow-blue-500/20
                transform transition-all duration-300 
                hover:-translate-y-1 hover:scale-105
                flex flex-col items-center justify-center 
                aspect-[1/1]
              `}
              style={{ animation: `popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${index * 0.05}s`, opacity: 0 }}
            >
              {/* Shine effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />

              <div className="bg-white/30 backdrop-blur-sm rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-3 shadow-inner border-2 border-white/40">
                 <span className="text-5xl md:text-6xl drop-shadow-sm filter transition-transform group-hover:scale-110 group-hover:rotate-6">{cat.icon}</span>
              </div>
              <span className="text-lg md:text-2xl font-black text-white text-shadow-sm text-center leading-tight">
                {cat.title}
              </span>
              <span className="text-xs md:text-sm font-bold text-white/90 mt-1 bg-black/10 px-2 py-0.5 rounded-lg">{cat.description}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- 2. DETAIL ITEM SCREEN ---
  if (activeItem) {
    return (
      <div className="min-h-screen relative p-4 flex flex-col items-center justify-center">
        {renderBackground()}

        <button 
          onClick={handleBack}
          className="absolute top-6 left-6 z-20 bg-white border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 p-3 rounded-2xl shadow-lg hover:bg-slate-50 transition group"
        >
          <ArrowLeft size={32} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className={`
          glass-panel p-6 md:p-10 rounded-[2.5rem] shadow-2xl 
          max-w-md w-full flex flex-col items-center text-center 
          relative z-10 animate-pop-in border-4 border-white
        `}>
          
          <div 
             className="relative group cursor-pointer mb-6" 
             onClick={() => playSystemSound(activeItem.label)}
          >
             {/* Glow background */}
             <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300 to-purple-300 rounded-full opacity-30 filter blur-3xl animate-pulse"></div>
             
             <div className="relative text-[10rem] md:text-[12rem] leading-none transform transition-transform duration-500 hover:scale-110 hover:rotate-3 drop-shadow-xl select-none">
              {activeItem.emoji}
            </div>
            
            <div className="absolute -bottom-4 right-4 bg-white text-blue-500 p-3 rounded-full shadow-lg animate-bounce border-2 border-blue-100">
                <Volume2 size={24} fill="currentColor" />
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-2 tracking-tight drop-shadow-sm">{activeItem.label}</h2>
          {activeItem.description && (
             <h3 className="text-xl md:text-2xl font-bold text-slate-500 mb-8 bg-white/50 px-4 py-1 rounded-xl">{activeItem.description}</h3>
          )}

          <div className="w-full space-y-3">
             <button
              onClick={() => handleMagicClick(activeItem)}
              disabled={aiLoading}
              className={`
                w-full relative overflow-hidden group
                ${aiLoading ? 'bg-slate-300 cursor-wait' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600'} 
                text-white p-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-fuchsia-200
                transform transition-all duration-200 active:scale-95 border-b-4 ${aiLoading ? 'border-slate-400' : 'border-fuchsia-700'} active:border-b-0 active:translate-y-1
              `}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl"></div>
              <Sparkles size={28} className={`${aiLoading ? 'animate-spin' : 'animate-pulse text-yellow-300'}`} />
              <span className="font-bold text-xl relative z-10">{aiLoading ? 'Sedang Mikir...' : 'Cerita Ajaib'}</span>
            </button>
          </div>

          {aiData && (
             <div className="mt-6 bg-amber-50 p-6 rounded-3xl border-4 border-amber-200 animate-slide-down w-full text-left relative shadow-sm">
                <div className="absolute -top-4 -left-2 bg-yellow-400 text-white p-2 rounded-xl shadow-md transform -rotate-12">
                    <Star size={24} fill="white" />
                </div>
                <p className="text-xl text-slate-700 leading-relaxed font-bold font-comic mt-2">
                  "{aiData.text}"
                </p>
             </div>
          )}
        </div>
      </div>
    );
  }

  // --- 3. GRID ITEMS SCREEN ---
  const currentCategoryDef = CATEGORIES.find(c => c.id === activeCategory);
  const categoryItems = ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen relative p-4">
      {renderBackground()}

      <header className="sticky top-2 z-30 flex items-center gap-3 mb-6 bg-white/80 backdrop-blur-md p-3 rounded-[2rem] shadow-lg border-2 border-white/50 animate-slide-down max-w-4xl mx-auto">
        <button 
          onClick={handleBack}
          className="bg-slate-100 p-3 rounded-full shadow-sm border-2 border-slate-200 hover:bg-slate-200 transition shrink-0 active:scale-90"
        >
          <Home size={28} className="text-slate-600" />
        </button>
        <div className="flex-1 flex items-center gap-3 px-2">
           <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner ${currentCategoryDef?.color} text-white`}>
             {currentCategoryDef?.icon}
           </div>
           <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 leading-none">{currentCategoryDef?.title}</h1>
              <p className="text-slate-500 text-sm font-bold">{currentCategoryDef?.description}</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 z-10 relative pb-20 max-w-6xl mx-auto">
        {categoryItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleItemSelect(item)}
            className={`
              relative group
              ${item.color} 
              rounded-[2rem] p-3
              shadow-md hover:shadow-xl 
              transform transition-all duration-300 
              hover:-translate-y-2 hover:z-10
              flex flex-col items-center justify-between
              aspect-[4/5]
              border-4 border-white
              active:scale-95
            `}
            style={{ animation: `popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${index * 0.05}s`, opacity: 0 }}
          >
            <div className="flex-1 flex items-center justify-center w-full relative">
               {/* Shine on hover */}
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300 blur-xl"></div>
               <span className="text-7xl md:text-8xl filter drop-shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3">{item.emoji}</span>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm w-full py-2.5 rounded-2xl mt-2 flex items-center justify-center shadow-sm border border-white/50">
               <span className={`text-lg md:text-xl font-black ${item.textColor ? 'text-slate-800' : 'text-slate-800'}`}>
                 {item.label}
               </span>
            </div>
            
            {/* Play icon badge */}
            <div className="absolute top-3 right-3 bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 shadow-md">
                <Play size={14} className="text-emerald-500 fill-emerald-500" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;