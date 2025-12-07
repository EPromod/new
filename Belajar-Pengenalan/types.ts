export enum CategoryType {
  ALPHABET = 'alphabet',
  NUMBERS = 'numbers',
  ANIMALS = 'animals',
  OBJECTS = 'objects',
  BODY = 'body',
  UNIVERSE = 'universe',
  COLORS = 'colors',
  SHAPES = 'shapes',
  FRUITS = 'fruits',
  PROFESSIONS = 'professions',
  VEHICLES = 'vehicles',
  EMOTIONS = 'emotions',
  WEATHER = 'weather'
}

export interface LearningItem {
  id: string;
  label: string;
  emoji: string;
  color: string;
  textColor?: string;
  category: CategoryType;
  description?: string; // Optional basic description
}

export interface CategoryDef {
  id: CategoryType;
  title: string;
  icon: string;
  color: string; // Tailwind bg class
  accentColor: string; // Darker shade for border/shadow
  description: string;
}

export interface AiResponse {
  text: string;
  audioBase64?: string;
}