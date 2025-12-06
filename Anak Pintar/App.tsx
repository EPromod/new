import React, { useState, useEffect } from 'react';
import { AppMode, UserStats, Badge } from './types';
import { StoryMaker } from './components/StoryMaker';
import { QuizGame } from './components/QuizGame';
import { ChatBuddy } from './components/ChatBuddy';
import { Button } from './components/Button';
import { Home, BookOpen, Brain, MessageCircle, Star, Crown, User, Trophy, Lock } from 'lucide-react';

const AVATARS = ['🦁', '🐯', '🐼', '🦊', '🐸', '🦄', '🦖', '🚀', '⭐', '🤖'];

const BADGES_LIST: Badge[] = [
  { id: 'first_story', name: 'Penulis Pemula', icon: '📝', description: 'Membuat cerita pertama', unlocked: false },
  { id: 'quiz_master', name: 'Si Jenius', icon: '🧠', description: 'Kumpulkan 200 bintang', unlocked: false },
  { id: 'story_lover', name: 'Kutu Buku', icon: '📚', description: 'Buat 5 cerita ajaib', unlocked: false },
  { id: 'explorer', name: 'Petualang', icon: '🌍', description: 'Capai Level 5', unlocked: false },
];

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('duniaPintarStats_v2');
    return saved ? JSON.parse(saved) : { 
        stars: 0, 
        level: 1, 
        name: 'Petualang', 
        avatar: '🦁', 
        badges: [], 
        storiesCreated: 0 
    };
  });

  useEffect(() => {
    localStorage.setItem('duniaPintarStats_v2', JSON.stringify(stats));
  }, [stats]);

  // Badge Check Logic
  useEffect(() => {
    const checkBadges = () => {
        const unlockedNow: string[] = [];
        
        // Logic checks
        if (stats.storiesCreated >= 1 && !stats.badges.includes('first_story')) unlockedNow.push('first_story');
        if (stats.storiesCreated >= 5 && !stats.badges.includes('story_lover')) unlockedNow.push('story_lover');
        if (stats.stars >= 200 && !stats.badges.includes('quiz_master')) unlockedNow.push('quiz_master');
        if (stats.level >= 5 && !stats.badges.includes('explorer')) unlockedNow.push('explorer');

        if (unlockedNow.length > 0) {
            setStats(prev => ({ ...prev, badges: [...prev.badges, ...unlockedNow] }));
            const badgeDetails = BADGES_LIST.find(b => b.id === unlockedNow[0]);
            if (badgeDetails) {
                setNewBadge(badgeDetails);
                setTimeout(() => setNewBadge(null), 4000);
            }
        }
    };
    checkBadges();
  }, [stats.stars, stats.storiesCreated, stats.level, stats.badges]);

  const updateStats = (amount: number, type?: 'STORY' | 'QUIZ') => {
    setStats(prev => {
      const newStars = prev.stars + amount;
      const newLevel = Math.floor(newStars / 100) + 1;
      const newStories = type === 'STORY' ? prev.storiesCreated + 1 : prev.storiesCreated;
      
      return { 
          ...prev, 
          stars: newStars, 
          level: newLevel,
          storiesCreated: newStories
      };
    });
  };

  const changeAvatar = (av: string) => {
    setStats(prev => ({ ...prev, avatar: av }));
    setShowProfileModal(false);
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.STORY:
        return <StoryMaker onEarnStars={(n) => updateStats(n, 'STORY')} />;
      case AppMode.QUIZ:
        return <QuizGame onEarnStars={(n) => updateStats(n, 'QUIZ')} />;
      case AppMode.CHAT:
        return <ChatBuddy onEarnStars={(n) => updateStats(n)} />;
      default:
        return (
          <div className="flex flex-col items-center min-h-[70vh] p-4 space-y-8 animate-fade-in relative z-10 max-w-6xl mx-auto">
            
            {/* Hero Profile Card */}
            <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-xl border-b-8 border-yellow-300 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-0 transform translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="flex items-center gap-6 z-10">
                    <button onClick={() => setShowProfileModal(true)} className="relative group">
                        <div className="text-7xl md:text-8xl bg-yellow-100 rounded-full p-4 border-4 border-white shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                            {stats.avatar}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white">
                            <User size={16} />
                        </div>
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-gray-800">Halo, {stats.name}!</h2>
                        <p className="text-gray-500 mb-2">Siap berpetualang hari ini?</p>
                        <div className="flex gap-2">
                             <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                <Star size={14} fill="currentColor" /> {stats.stars} Bintang
                             </div>
                             <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                <Crown size={14} fill="currentColor" /> Level {stats.level}
                             </div>
                        </div>
                    </div>
                </div>

                {/* Badges Mini View */}
                <div className="flex gap-2 z-10 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {BADGES_LIST.map(badge => {
                        const isUnlocked = stats.badges.includes(badge.id);
                        return (
                            <div key={badge.id} className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl border-2 ${isUnlocked ? 'bg-white border-yellow-200 shadow-sm' : 'bg-gray-200 border-gray-300 grayscale opacity-50'}`} title={badge.name}>
                                {isUnlocked ? badge.icon : <Lock size={16} />}
                            </div>
                        )
                    })}
                </div>
            </div>
            
            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div 
                onClick={() => setMode(AppMode.STORY)}
                className="cursor-pointer group bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] border-b-8 border-blue-400 hover:border-blue-500 transition-all transform hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="bg-blue-100 p-6 rounded-3xl mb-6 text-blue-500 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-inner">
                  <BookOpen size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">Cerita & Gambar</h3>
                <p className="text-gray-500 font-medium">Buat dongeng dengan ilustrasi ajaib!</p>
                <span className="mt-4 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><Star size={10} fill="currentColor"/> +50 Bintang</span>
              </div>

              <div 
                onClick={() => setMode(AppMode.QUIZ)}
                className="cursor-pointer group bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(168,85,247,0.3)] border-b-8 border-purple-400 hover:border-purple-500 transition-all transform hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="bg-purple-100 p-6 rounded-3xl mb-6 text-purple-500 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-inner">
                  <Brain size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">Kuis Cerdas</h3>
                <p className="text-gray-500 font-medium">Asah otak dan kumpulkan piala!</p>
                <span className="mt-4 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><Star size={10} fill="currentColor"/> +20 Bintang</span>
              </div>

              <div 
                onClick={() => setMode(AppMode.CHAT)}
                className="cursor-pointer group bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(34,197,94,0.3)] border-b-8 border-green-400 hover:border-green-500 transition-all transform hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="bg-green-100 p-6 rounded-3xl mb-6 text-green-500 group-hover:scale-110 transition-transform shadow-inner">
                  <MessageCircle size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">Teman Belajar</h3>
                <p className="text-gray-500 font-medium">Tanya apa saja pada Kakak Pintar.</p>
                <span className="mt-4 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><Star size={10} fill="currentColor"/> +10 Bintang</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#f0f9ff] relative overflow-x-hidden selection:bg-yellow-200">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#bae6fd 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none" 
            onClick={() => setMode(AppMode.HOME)}
          >
            <div className="bg-gradient-to-tr from-blue-500 to-cyan-400 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                <span className="text-xl">🚀</span>
            </div>
            <span className="text-2xl font-black text-gray-800 tracking-tight hidden sm:block">DuniaPintar</span>
          </div>

          <div className="flex items-center gap-3">
             {mode !== AppMode.HOME && (
                <div className="hidden md:flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm mr-2">
                    <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm">
                        <Star fill="currentColor" size={16} /> {stats.stars}
                    </div>
                </div>
             )}
             
             {mode !== AppMode.HOME && (
               <Button onClick={() => setMode(AppMode.HOME)} variant="secondary" size="sm" className="flex items-center gap-2 rounded-xl">
                 <Home size={18} />
                 <span className="hidden sm:inline">Menu</span>
               </Button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 relative z-10">
        {renderContent()}
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
             <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><User size={24} /></button>
                <h3 className="text-2xl font-black text-center mb-6">Pilih Avatarmu!</h3>
                <div className="grid grid-cols-5 gap-4 mb-6">
                    {AVATARS.map(av => (
                        <button 
                            key={av} 
                            onClick={() => changeAvatar(av)}
                            className={`text-4xl p-2 rounded-xl hover:bg-gray-100 transition-colors ${stats.avatar === av ? 'bg-blue-100 ring-4 ring-blue-200' : ''}`}
                        >
                            {av}
                        </button>
                    ))}
                </div>
                <div className="border-t pt-6">
                    <h4 className="font-bold text-gray-600 mb-4 flex items-center gap-2"><Trophy size={18} /> Koleksi Piala</h4>
                    <div className="grid grid-cols-4 gap-2">
                        {BADGES_LIST.map(badge => {
                             const isUnlocked = stats.badges.includes(badge.id);
                             return (
                                 <div key={badge.id} className="flex flex-col items-center text-center">
                                     <div className={`w-14 h-14 flex items-center justify-center rounded-full text-2xl border-2 mb-1 ${isUnlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-100 border-gray-200 grayscale opacity-40'}`}>
                                         {isUnlocked ? badge.icon : <Lock size={16} />}
                                     </div>
                                     <span className="text-[10px] font-bold text-gray-500 leading-tight">{badge.name}</span>
                                 </div>
                             )
                        })}
                    </div>
                </div>
                <Button onClick={() => setShowProfileModal(false)} className="w-full mt-6">Simpan</Button>
             </div>
        </div>
      )}

      {/* Badge Notification Toast */}
      {newBadge && (
          <div className="fixed bottom-8 right-0 left-0 flex justify-center z-50 pointer-events-none">
              <div className="bg-white border-4 border-yellow-300 rounded-2xl shadow-2xl p-4 flex items-center gap-4 animate-bounce-in pointer-events-auto">
                  <div className="text-4xl bg-yellow-100 p-2 rounded-full">{newBadge.icon}</div>
                  <div>
                      <h4 className="font-black text-yellow-600 text-lg">Piala Baru!</h4>
                      <p className="font-bold text-gray-800">{newBadge.name}</p>
                      <p className="text-xs text-gray-500">{newBadge.description}</p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;