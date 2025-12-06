export enum AppMode {
  HOME = 'HOME',
  STORY = 'STORY',
  QUIZ = 'QUIZ',
  CHAT = 'CHAT'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: 'Mudah' | 'Sedang' | 'Sulit';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  hasAudio?: boolean;
  audioData?: ArrayBuffer;
}

export type QuizTopic = 'Hewan' | 'Luar Angkasa' | 'Matematika' | 'Buah & Sayur' | 'Pengetahuan Umum' | 'Bahasa Inggris';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface UserStats {
  stars: number;
  level: number;
  name: string;
  avatar: string;
  badges: string[]; // List of unlocked badge IDs
  storiesCreated: number;
}
