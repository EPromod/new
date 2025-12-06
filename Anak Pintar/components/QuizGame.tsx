import React, { useState } from 'react';
import { Button } from './Button';
import { generateQuizQuestion } from '../services/geminiService';
import { QuizQuestion, QuizTopic } from '../types';
import { Brain, CheckCircle, XCircle, Star, Zap } from 'lucide-react';

const TOPICS: QuizTopic[] = ['Hewan', 'Luar Angkasa', 'Matematika', 'Buah & Sayur', 'Pengetahuan Umum', 'Bahasa Inggris'];

interface QuizGameProps {
  onEarnStars: (amount: number) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ onEarnStars }) => {
  const [topic, setTopic] = useState<QuizTopic | null>(null);
  const [questionData, setQuestionData] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const loadQuestion = async (selectedTopic: QuizTopic) => {
    setLoading(true);
    setQuestionData(null);
    setSelectedAnswer(null);
    try {
      // Difficulty increases with streak
      const diff = streak < 2 ? 'Mudah' : streak < 5 ? 'Sedang' : 'Sulit';
      const data = await generateQuizQuestion(selectedTopic, diff);
      setQuestionData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (t: QuizTopic) => {
    setTopic(t);
    loadQuestion(t);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    
    if (answer === questionData?.correctAnswer) {
      const baseReward = 20;
      const streakBonus = streak * 5;
      onEarnStars(baseReward + streakBonus);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (topic) loadQuestion(topic);
  };

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto w-full p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border-b-8 border-purple-300">
          <div className="text-center mb-10">
            <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
              <Brain size={40} />
            </div>
            <h2 className="text-4xl font-black text-purple-700 mb-2">Arena Kuis</h2>
            <p className="text-gray-500 text-lg">Kumpulkan bintang sebanyak-banyaknya!</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TOPICS.map((t) => (
              <Button 
                key={t} 
                onClick={() => handleTopicSelect(t)} 
                variant="accent" 
                size="lg"
                className="py-8 text-lg font-bold shadow-purple-200"
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => setTopic(null)} variant="secondary" size="sm" className="bg-white border-gray-200 text-gray-600">
          &larr; Ganti Topik
        </Button>
        <div className="flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-bold border-2 border-orange-200">
          <Zap size={20} fill="currentColor" />
          <span>Streak: {streak}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-100 min-h-[400px] flex flex-col relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-50 rounded-full z-0"></div>
        
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 z-10">
             <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
             <p className="text-purple-400 font-bold animate-pulse">Menyiapkan tantangan...</p>
          </div>
        ) : questionData ? (
          <div className="animate-fade-in z-10 flex flex-col h-full">
            <div className="flex justify-center mb-4">
               <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                 Tingkat {streak < 2 ? 'Mudah' : streak < 5 ? 'Sedang' : 'Sulit'}
               </span>
            </div>

            <h3 className="text-2xl font-black text-gray-800 text-center mb-8 leading-snug">
              {questionData.question}
            </h3>

            <div className="grid gap-4 mb-6">
              {questionData.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === questionData.correctAnswer;
                const showResult = !!selectedAnswer;

                let variant: 'primary' | 'success' | 'danger' = 'primary';
                if (showResult) {
                  if (isCorrect) variant = 'success';
                  else if (isSelected && !isCorrect) variant = 'danger';
                  else variant = 'primary';
                }

                return (
                  <Button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    variant={variant}
                    disabled={showResult}
                    className={`w-full text-left justify-start relative p-4 transition-all ${
                      showResult && !isCorrect && !isSelected ? 'opacity-40 grayscale' : ''
                    }`}
                  >
                    <div className="flex items-center w-full">
                        <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mr-4 text-sm font-bold">
                            {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 font-semibold">{option}</span>
                        {showResult && isCorrect && <CheckCircle className="ml-2 text-white" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="ml-2 text-white" />}
                    </div>
                  </Button>
                );
              })}
            </div>

            {selectedAnswer && (
              <div className="mt-auto animate-bounce-in">
                <div className={`p-4 rounded-2xl ${selectedAnswer === questionData.correctAnswer ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${selectedAnswer === questionData.correctAnswer ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {selectedAnswer === questionData.correctAnswer ? <Star size={24} fill="currentColor" /> : <XCircle size={24} />}
                        </div>
                        <div>
                            <p className="font-bold text-lg text-gray-800">
                                {selectedAnswer === questionData.correctAnswer ? "Hebat! Kamu Benar!" : "Yah, kurang tepat."}
                            </p>
                            <p className="text-gray-600 mt-1 text-sm leading-relaxed">{questionData.explanation}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <Button onClick={nextQuestion} variant="accent" size="lg" className="w-full md:w-auto shadow-purple-300">
                    Lanjut Main &rarr;
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
            <div className="text-center">Gagal memuat. <Button onClick={() => loadQuestion(topic)}>Coba Lagi</Button></div>
        )}
      </div>
    </div>
  );
};