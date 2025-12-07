import { CategoryType, CategoryDef, LearningItem } from './types';

export const CATEGORIES: CategoryDef[] = [
  {
    id: CategoryType.ALPHABET,
    title: 'Huruf',
    icon: '🅰️',
    color: 'bg-rose-400',
    accentColor: 'border-rose-600',
    description: 'A B C',
  },
  {
    id: CategoryType.NUMBERS,
    title: 'Angka',
    icon: '🔢',
    color: 'bg-sky-400',
    accentColor: 'border-sky-600',
    description: '1 2 3',
  },
  {
    id: CategoryType.ANIMALS,
    title: 'Hewan',
    icon: '🦁',
    color: 'bg-amber-400',
    accentColor: 'border-amber-600',
    description: 'Dunia Satwa',
  },
  {
    id: CategoryType.FRUITS,
    title: 'Buah',
    icon: '🍓',
    color: 'bg-red-400',
    accentColor: 'border-red-600',
    description: 'Segar & Sehat',
  },
  {
    id: CategoryType.VEHICLES,
    title: 'Kendaraan',
    icon: '🚗',
    color: 'bg-blue-500',
    accentColor: 'border-blue-700',
    description: 'Transportasi',
  },
  {
    id: CategoryType.PROFESSIONS,
    title: 'Profesi',
    icon: '👮',
    color: 'bg-slate-500',
    accentColor: 'border-slate-700',
    description: 'Cita-citaku',
  },
  {
    id: CategoryType.COLORS,
    title: 'Warna',
    icon: '🎨',
    color: 'bg-pink-400',
    accentColor: 'border-pink-600',
    description: 'Warna-warni',
  },
  {
    id: CategoryType.SHAPES,
    title: 'Bentuk',
    icon: '🔶',
    color: 'bg-violet-400',
    accentColor: 'border-violet-600',
    description: 'Geometri',
  },
  {
    id: CategoryType.BODY,
    title: 'Tubuh',
    icon: '👂',
    color: 'bg-orange-400',
    accentColor: 'border-orange-600',
    description: 'Anggota Badan',
  },
  {
    id: CategoryType.EMOTIONS,
    title: 'Emosi',
    icon: '😊',
    color: 'bg-yellow-300',
    accentColor: 'border-yellow-500',
    description: 'Perasaanku',
  },
  {
    id: CategoryType.WEATHER,
    title: 'Cuaca',
    icon: '⛈️',
    color: 'bg-cyan-400',
    accentColor: 'border-cyan-600',
    description: 'Langit Kita',
  },
  {
    id: CategoryType.UNIVERSE,
    title: 'Alam',
    icon: '🪐',
    color: 'bg-indigo-500',
    accentColor: 'border-indigo-700',
    description: 'Luar Angkasa',
  },
  {
    id: CategoryType.OBJECTS,
    title: 'Benda',
    icon: '🧸',
    color: 'bg-emerald-400',
    accentColor: 'border-emerald-600',
    description: 'Sekitar Kita',
  },
];

const generateAlphabet = (): LearningItem[] => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const examples: Record<string, string> = {
    A: 'Apel', B: 'Bola', C: 'Ceri', D: 'Domba', E: 'Ember',
    F: 'Foto', G: 'Gajah', H: 'Hujan', I: 'Itik', J: 'Jeruk',
    K: 'Kuda', L: 'Lampu', M: 'Mobil', N: 'Nanas', O: 'Obor',
    P: 'Panda', Q: 'Quran', R: 'Roti', S: 'Susu', T: 'Topi',
    U: 'Udang', V: 'Vas', W: 'Wortel', X: 'Xilofon', Y: 'Yoyo', Z: 'Zebra'
  };
  
  return letters.map((char) => ({
    id: `alpha-${char}`,
    label: `${char}`,
    emoji: char, 
    color: 'bg-white',
    category: CategoryType.ALPHABET,
    description: examples[char]
  }));
};

const generateNumbers = (): LearningItem[] => {
  return Array.from({ length: 20 }, (_, i) => i + 1).map((num) => ({
    id: `num-${num}`,
    label: num.toString(),
    emoji: num.toString(),
    color: 'bg-white',
    category: CategoryType.NUMBERS,
  }));
};

export const ITEMS: LearningItem[] = [
  ...generateAlphabet(),
  ...generateNumbers(),
  
  // VEHICLES (New)
  { id: 'veh-1', label: 'Mobil', emoji: '🚗', color: 'bg-red-100', category: CategoryType.VEHICLES },
  { id: 'veh-2', label: 'Bus', emoji: '🚌', color: 'bg-yellow-100', category: CategoryType.VEHICLES },
  { id: 'veh-3', label: 'Polisi', emoji: '🚓', color: 'bg-blue-100', category: CategoryType.VEHICLES },
  { id: 'veh-4', label: 'Ambulans', emoji: '🚑', color: 'bg-white', category: CategoryType.VEHICLES },
  { id: 'veh-5', label: 'Pemadam', emoji: '🚒', color: 'bg-red-200', category: CategoryType.VEHICLES },
  { id: 'veh-6', label: 'Sepeda', emoji: '🚲', color: 'bg-green-100', category: CategoryType.VEHICLES },
  { id: 'veh-7', label: 'Motor', emoji: '🛵', color: 'bg-orange-100', category: CategoryType.VEHICLES },
  { id: 'veh-8', label: 'Pesawat', emoji: '✈️', color: 'bg-sky-100', category: CategoryType.VEHICLES },
  { id: 'veh-9', label: 'Helikopter', emoji: '🚁', color: 'bg-sky-200', category: CategoryType.VEHICLES },
  { id: 'veh-10', label: 'Kapal', emoji: '🚢', color: 'bg-blue-200', category: CategoryType.VEHICLES },
  { id: 'veh-11', label: 'Roket', emoji: '🚀', color: 'bg-purple-100', category: CategoryType.VEHICLES },
  { id: 'veh-12', label: 'Truk', emoji: '🚚', color: 'bg-amber-100', category: CategoryType.VEHICLES },

  // PROFESSIONS (New)
  { id: 'prof-1', label: 'Polisi', emoji: '👮', color: 'bg-blue-100', category: CategoryType.PROFESSIONS },
  { id: 'prof-2', label: 'Dokter', emoji: '👩‍⚕️', color: 'bg-green-100', category: CategoryType.PROFESSIONS },
  { id: 'prof-3', label: 'Pemadam', emoji: '👨‍🚒', color: 'bg-red-100', category: CategoryType.PROFESSIONS },
  { id: 'prof-4', label: 'Koki', emoji: '👨‍🍳', color: 'bg-white', category: CategoryType.PROFESSIONS },
  { id: 'prof-5', label: 'Guru', emoji: '👩‍🏫', color: 'bg-yellow-100', category: CategoryType.PROFESSIONS },
  { id: 'prof-6', label: 'Astronot', emoji: '👨‍🚀', color: 'bg-indigo-100', category: CategoryType.PROFESSIONS },
  { id: 'prof-7', label: 'Petani', emoji: '👨‍🌾', color: 'bg-amber-100', category: CategoryType.PROFESSIONS },
  { id: 'prof-8', label: 'Pilot', emoji: '👨‍✈️', color: 'bg-sky-100', category: CategoryType.PROFESSIONS },
  { id: 'prof-9', label: 'Artis', emoji: '👨‍🎨', color: 'bg-pink-100', category: CategoryType.PROFESSIONS },
  { id: 'prof-10', label: 'Ilmuwan', emoji: '👨‍🔬', color: 'bg-purple-100', category: CategoryType.PROFESSIONS },

  // EMOTIONS (New)
  { id: 'emo-1', label: 'Senang', emoji: '😊', color: 'bg-yellow-100', category: CategoryType.EMOTIONS },
  { id: 'emo-2', label: 'Sedih', emoji: '😢', color: 'bg-blue-100', category: CategoryType.EMOTIONS },
  { id: 'emo-3', label: 'Marah', emoji: '😠', color: 'bg-red-100', category: CategoryType.EMOTIONS },
  { id: 'emo-4', label: 'Kaget', emoji: '😱', color: 'bg-purple-100', category: CategoryType.EMOTIONS },
  { id: 'emo-5', label: 'Lucu', emoji: '😂', color: 'bg-orange-100', category: CategoryType.EMOTIONS },
  { id: 'emo-6', label: 'Cinta', emoji: '🥰', color: 'bg-pink-100', category: CategoryType.EMOTIONS },
  { id: 'emo-7', label: 'Takut', emoji: '😨', color: 'bg-gray-200', category: CategoryType.EMOTIONS },
  { id: 'emo-8', label: 'Mengantuk', emoji: '😴', color: 'bg-blue-50', category: CategoryType.EMOTIONS },

  // WEATHER (New)
  { id: 'wea-1', label: 'Cerah', emoji: '☀️', color: 'bg-yellow-100', category: CategoryType.WEATHER },
  { id: 'wea-2', label: 'Hujan', emoji: '🌧️', color: 'bg-blue-200', category: CategoryType.WEATHER },
  { id: 'wea-3', label: 'Berawan', emoji: '☁️', color: 'bg-gray-100', category: CategoryType.WEATHER },
  { id: 'wea-4', label: 'Petir', emoji: '⛈️', color: 'bg-purple-200', category: CategoryType.WEATHER },
  { id: 'wea-5', label: 'Salju', emoji: '❄️', color: 'bg-cyan-100', category: CategoryType.WEATHER },
  { id: 'wea-6', label: 'Angin', emoji: '💨', color: 'bg-gray-200', category: CategoryType.WEATHER },
  { id: 'wea-7', label: 'Pelangi', emoji: '🌈', color: 'bg-sky-100', category: CategoryType.WEATHER },

  // COLORS
  { id: 'col-1', label: 'Merah', emoji: '🔴', color: 'bg-red-500', textColor: 'text-white', category: CategoryType.COLORS },
  { id: 'col-2', label: 'Biru', emoji: '🔵', color: 'bg-blue-500', textColor: 'text-white', category: CategoryType.COLORS },
  { id: 'col-3', label: 'Hijau', emoji: '🟢', color: 'bg-green-500', textColor: 'text-white', category: CategoryType.COLORS },
  { id: 'col-4', label: 'Kuning', emoji: '🟡', color: 'bg-yellow-400', category: CategoryType.COLORS },
  { id: 'col-5', label: 'Oranye', emoji: '🟠', color: 'bg-orange-500', textColor: 'text-white', category: CategoryType.COLORS },
  { id: 'col-6', label: 'Ungu', emoji: '🟣', color: 'bg-purple-500', textColor: 'text-white', category: CategoryType.COLORS },
  { id: 'col-7', label: 'Hitam', emoji: '⚫', color: 'bg-gray-900', textColor: 'text-white', category: CategoryType.COLORS },
  { id: 'col-8', label: 'Putih', emoji: '⚪', color: 'bg-white', category: CategoryType.COLORS },
  { id: 'col-9', label: 'Cokelat', emoji: '🟤', color: 'bg-amber-800', textColor: 'text-white', category: CategoryType.COLORS },
  { id: 'col-10', label: 'Merah Muda', emoji: '🌸', color: 'bg-pink-400', textColor: 'text-white', category: CategoryType.COLORS },

  // SHAPES
  { id: 'shp-1', label: 'Lingkaran', emoji: '⭕', color: 'bg-white', category: CategoryType.SHAPES },
  { id: 'shp-2', label: 'Kotak', emoji: '🟥', color: 'bg-white', category: CategoryType.SHAPES },
  { id: 'shp-3', label: 'Segitiga', emoji: '🔺', color: 'bg-white', category: CategoryType.SHAPES },
  { id: 'shp-4', label: 'Bintang', emoji: '⭐', color: 'bg-white', category: CategoryType.SHAPES },
  { id: 'shp-5', label: 'Hati', emoji: '❤️', color: 'bg-white', category: CategoryType.SHAPES },
  { id: 'shp-6', label: 'Layang-layang', emoji: '🔶', color: 'bg-white', category: CategoryType.SHAPES },

  // FRUITS & VEG
  { id: 'fr-1', label: 'Apel', emoji: '🍎', color: 'bg-red-100', category: CategoryType.FRUITS },
  { id: 'fr-2', label: 'Pisang', emoji: '🍌', color: 'bg-yellow-100', category: CategoryType.FRUITS },
  { id: 'fr-3', label: 'Jeruk', emoji: '🍊', color: 'bg-orange-100', category: CategoryType.FRUITS },
  { id: 'fr-4', label: 'Anggur', emoji: '🍇', color: 'bg-purple-100', category: CategoryType.FRUITS },
  { id: 'fr-5', label: 'Semangka', emoji: '🍉', color: 'bg-green-100', category: CategoryType.FRUITS },
  { id: 'fr-6', label: 'Wortel', emoji: '🥕', color: 'bg-orange-100', category: CategoryType.FRUITS },
  { id: 'fr-7', label: 'Jagung', emoji: '🌽', color: 'bg-yellow-100', category: CategoryType.FRUITS },
  { id: 'fr-8', label: 'Brokoli', emoji: '🥦', color: 'bg-green-100', category: CategoryType.FRUITS },
  { id: 'fr-9', label: 'Stroberi', emoji: '🍓', color: 'bg-pink-100', category: CategoryType.FRUITS },
  { id: 'fr-10', label: 'Nanas', emoji: '🍍', color: 'bg-yellow-100', category: CategoryType.FRUITS },
  { id: 'fr-11', label: 'Alpukat', emoji: '🥑', color: 'bg-green-100', category: CategoryType.FRUITS },
  { id: 'fr-12', label: 'Ceri', emoji: '🍒', color: 'bg-red-100', category: CategoryType.FRUITS },

  // Animals
  { id: 'an-1', label: 'Singa', emoji: '🦁', color: 'bg-orange-100', category: CategoryType.ANIMALS },
  { id: 'an-2', label: 'Kucing', emoji: '🐱', color: 'bg-yellow-100', category: CategoryType.ANIMALS },
  { id: 'an-3', label: 'Anjing', emoji: '🐶', color: 'bg-amber-100', category: CategoryType.ANIMALS },
  { id: 'an-4', label: 'Gajah', emoji: '🐘', color: 'bg-gray-100', category: CategoryType.ANIMALS },
  { id: 'an-5', label: 'Monyet', emoji: '🐵', color: 'bg-orange-100', category: CategoryType.ANIMALS },
  { id: 'an-6', label: 'Ayam', emoji: '🐔', color: 'bg-red-100', category: CategoryType.ANIMALS },
  { id: 'an-7', label: 'Bebek', emoji: '🦆', color: 'bg-green-100', category: CategoryType.ANIMALS },
  { id: 'an-8', label: 'Ikan', emoji: '🐠', color: 'bg-blue-100', category: CategoryType.ANIMALS },
  { id: 'an-9', label: 'Kupu-kupu', emoji: '🦋', color: 'bg-pink-100', category: CategoryType.ANIMALS },
  { id: 'an-10', label: 'Dinosaurus', emoji: '🦖', color: 'bg-green-200', category: CategoryType.ANIMALS },
  { id: 'an-11', label: 'Panda', emoji: '🐼', color: 'bg-white', category: CategoryType.ANIMALS },
  { id: 'an-12', label: 'Jerapah', emoji: '🦒', color: 'bg-yellow-200', category: CategoryType.ANIMALS },
  { id: 'an-13', label: 'Koala', emoji: '🐨', color: 'bg-gray-200', category: CategoryType.ANIMALS },
  { id: 'an-14', label: 'Kelinci', emoji: '🐰', color: 'bg-white', category: CategoryType.ANIMALS },

  // Objects
  { id: 'ob-2', label: 'Bola', emoji: '⚽', color: 'bg-white', category: CategoryType.OBJECTS },
  { id: 'ob-3', label: 'Buku', emoji: '📚', color: 'bg-blue-100', category: CategoryType.OBJECTS },
  { id: 'ob-4', label: 'Pensil', emoji: '✏️', color: 'bg-yellow-100', category: CategoryType.OBJECTS },
  { id: 'ob-5', label: 'Gitar', emoji: '🎸', color: 'bg-orange-100', category: CategoryType.OBJECTS },
  { id: 'ob-8', label: 'Rumah', emoji: '🏠', color: 'bg-orange-200', category: CategoryType.OBJECTS },
  { id: 'ob-9', label: 'Jam', emoji: '⏰', color: 'bg-red-100', category: CategoryType.OBJECTS },
  { id: 'ob-10', label: 'Kamera', emoji: '📷', color: 'bg-gray-200', category: CategoryType.OBJECTS },
  { id: 'ob-11', label: 'Komputer', emoji: '💻', color: 'bg-gray-100', category: CategoryType.OBJECTS },
  { id: 'ob-12', label: 'Kunci', emoji: '🔑', color: 'bg-yellow-200', category: CategoryType.OBJECTS },
  { id: 'ob-13', label: 'Hadiah', emoji: '🎁', color: 'bg-red-100', category: CategoryType.OBJECTS },

  // Body
  { id: 'bd-1', label: 'Mata', emoji: '👀', color: 'bg-pink-100', category: CategoryType.BODY },
  { id: 'bd-2', label: 'Telinga', emoji: '👂', color: 'bg-orange-100', category: CategoryType.BODY },
  { id: 'bd-3', label: 'Hidung', emoji: '👃', color: 'bg-orange-100', category: CategoryType.BODY },
  { id: 'bd-4', label: 'Mulut', emoji: '👄', color: 'bg-red-100', category: CategoryType.BODY },
  { id: 'bd-5', label: 'Tangan', emoji: '✋', color: 'bg-orange-100', category: CategoryType.BODY },
  { id: 'bd-6', label: 'Kaki', emoji: '🦶', color: 'bg-orange-100', category: CategoryType.BODY },
  { id: 'bd-7', label: 'Otak', emoji: '🧠', color: 'bg-pink-200', category: CategoryType.BODY },
  { id: 'bd-8', label: 'Gigi', emoji: '🦷', color: 'bg-white', category: CategoryType.BODY },
  { id: 'bd-9', label: 'Lidah', emoji: '👅', color: 'bg-red-200', category: CategoryType.BODY },

  // Universe
  { id: 'uv-1', label: 'Matahari', emoji: '☀️', color: 'bg-yellow-200', category: CategoryType.UNIVERSE },
  { id: 'uv-2', label: 'Bulan', emoji: '🌙', color: 'bg-gray-200', category: CategoryType.UNIVERSE },
  { id: 'uv-3', label: 'Bintang', emoji: '⭐', color: 'bg-yellow-100', category: CategoryType.UNIVERSE },
  { id: 'uv-4', label: 'Bumi', emoji: '🌍', color: 'bg-blue-200', category: CategoryType.UNIVERSE },
  { id: 'uv-6', label: 'Api', emoji: '🔥', color: 'bg-red-200', category: CategoryType.UNIVERSE },
  { id: 'uv-7', label: 'Air', emoji: '💧', color: 'bg-blue-200', category: CategoryType.UNIVERSE },
  { id: 'uv-8', label: 'Pohon', emoji: '🌳', color: 'bg-green-200', category: CategoryType.UNIVERSE },
  { id: 'uv-11', label: 'Gunung', emoji: '🗻', color: 'bg-blue-100', category: CategoryType.UNIVERSE },
  { id: 'uv-12', label: 'Kaktus', emoji: '🌵', color: 'bg-green-100', category: CategoryType.UNIVERSE },
];