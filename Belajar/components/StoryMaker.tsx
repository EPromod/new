import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { generateStory, generateSpeech, generateIllustration } from '../services/geminiService';
import { BookOpen, Sparkles, RefreshCcw, Volume2, StopCircle, ImageIcon } from 'lucide-react';

interface StoryMakerProps {
  onEarnStars: (amount: number, type: 'STORY') => void;
}

export const StoryMaker: React.FC<StoryMakerProps> = ({ onEarnStars }) => {
  const [character, setCharacter] = useState('');
  const [setting, setSetting] = useState('');
  const [story, setStory] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  
  // Audio state
  const [audioLoading, setAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const handleCreateStory = async () => {
    if (!character || !setting) return;
    setLoading(true);
    setStory(null);
    setImageUrl(null);
    stopAudio();
    
    try {
      // 1. Generate Text
      const textResult = await generateStory(character, setting, 'Petualangan');
      setStory(textResult);
      onEarnStars(50, 'STORY'); // Reward
      
      // 2. Generate Image (in background/parallel but we show loading)
      setImageLoading(true);
      generateIllustration(character, setting).then(img => {
          setImageUrl(img);
          setImageLoading(false);
      });
      
    } catch (e) {
      alert("Ups, ada masalah saat membuat cerita.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async () => {
    if (!story) return;
    
    if (isPlaying) {
      stopAudio();
      return;
    }

    setAudioLoading(true);
    try {
      const buffer = await generateSpeech(story);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      source.start(0);
      
      sourceNodeRef.current = source;
      setIsPlaying(true);
    } catch (e) {
      alert("Gagal memutar suara.");
    } finally {
      setAudioLoading(false);
    }
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const reset = () => {
    stopAudio();
    setStory(null);
    setImageUrl(null);
    setCharacter('');
    setSetting('');
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl border-b-8 border-blue-300 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -z-0 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-100 rounded-tr-full -z-0 opacity-50"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-2xl text-white shadow-lg transform -rotate-3">
              <BookOpen size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-800 tracking-tight">Pabrik Cerita Ajaib</h2>
              <p className="text-gray-500 font-medium">Jadilah penulis dongengmu sendiri!</p>
            </div>
          </div>

          {!story ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-gray-700 font-bold text-lg ml-1">🦸‍♂️ Tokoh Utama</label>
                  <input
                    type="text"
                    value={character}
                    onChange={(e) => setCharacter(e.target.value)}
                    placeholder="Contoh: Kucing Detektif"
                    className="w-full p-4 rounded-2xl border-2 border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none text-lg transition-all bg-blue-50/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-gray-700 font-bold text-lg ml-1">🏰 Latar Tempat</label>
                  <input
                    type="text"
                    value={setting}
                    onChange={(e) => setSetting(e.target.value)}
                    placeholder="Contoh: Planet Donat"
                    className="w-full p-4 rounded-2xl border-2 border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none text-lg transition-all bg-blue-50/50"
                  />
                </div>
              </div>

              <Button 
                onClick={handleCreateStory} 
                disabled={loading || !character || !setting}
                className="w-full py-6 text-xl shadow-blue-200"
                size="lg"
              >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"/>
                        Sedang Mengarang...
                    </span>
                ) : '✨ Buat Cerita Ajaib ✨'}
              </Button>
            </div>
          ) : (
            <div className="animate-fade-in flex flex-col items-center">
              {/* Book Layout */}
              <div className="bg-[#fff9e6] p-6 md:p-8 rounded-2xl shadow-inner border border-[#faeec7] w-full mb-6 relative overflow-hidden">
                 
                 {/* Image Section */}
                 <div className="w-full h-64 md:h-80 bg-gray-100 rounded-xl mb-6 overflow-hidden relative border-4 border-white shadow-sm flex items-center justify-center">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Story illustration" className="w-full h-full object-cover animate-fade-in" />
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center animate-pulse">
                            <ImageIcon size={48} className="mb-2 opacity-50" />
                            <span>Sedang menggambar...</span>
                        </div>
                    )}
                 </div>

                 <h3 className="text-2xl font-black text-center text-gray-800 mb-6 font-serif opacity-90 border-b-2 border-dashed border-gray-300 pb-4">
                   {story.split('\n')[0]} {/* Title */}
                 </h3>
                 <div className="text-xl leading-loose text-gray-800 font-serif whitespace-pre-wrap px-2">
                   {story.replace(story.split('\n')[0], '').trim()}
                 </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center w-full">
                <Button 
                  onClick={playAudio} 
                  variant={isPlaying ? 'danger' : 'success'}
                  className="flex items-center gap-2 min-w-[160px] justify-center"
                  disabled={audioLoading}
                >
                  {audioLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" />
                  ) : isPlaying ? (
                    <>
                      <StopCircle /> Stop Suara
                    </>
                  ) : (
                    <>
                      <Volume2 /> Baca Cerita
                    </>
                  )}
                </Button>

                <Button onClick={reset} variant="secondary" className="flex items-center gap-2">
                  <RefreshCcw />
                  Buat Lagi
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};