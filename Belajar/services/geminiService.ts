import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizQuestion, QuizTopic } from "../types";

// API Key diambil dari process.env.API_KEY yang sudah di-define di vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textModelId = "gemini-2.5-flash";
const ttsModelId = "gemini-2.5-flash-preview-tts";
const imageModelId = "gemini-2.5-flash-image";

// --- Helpers for Audio ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- API Functions ---

export const generateStory = async (character: string, setting: string, theme: string): Promise<string> => {
  try {
    const prompt = `Buatkan cerita pendek anak-anak (maks 100 kata).
    Tokoh: ${character}
    Latar: ${setting}
    Tema: ${theme}
    Gunakan Bahasa Indonesia yang ceria. Berikan Judul di baris pertama.`;

    const response = await ai.models.generateContent({
      model: textModelId,
      contents: prompt,
    });

    return response.text || "Gagal membuat cerita.";
  } catch (error) {
    console.error("Story Error:", error);
    throw new Error("Gagal membuat cerita.");
  }
};

export const generateIllustration = async (character: string, setting: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: imageModelId,
      contents: {
        parts: [
          { text: `Cute colorful children's book illustration of ${character} in ${setting}. 3D render style, vibrant colors, soft lighting, pixar style.` }
        ]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null; 
  }
};

export const generateSpeech = async (text: string): Promise<AudioBuffer> => {
  try {
    const response = await ai.models.generateContent({
      model: ttsModelId,
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1,
    );
    return audioBuffer;
  } catch (error) {
    console.error("TTS Error:", error);
    throw new Error("Gagal membuat suara.");
  }
};

export const generateQuizQuestion = async (topic: QuizTopic, difficulty: string): Promise<QuizQuestion> => {
  try {
    // Variasi acak agar pertanyaan tidak monoton
    const modifiers = [
      "Fakta unik yang jarang diketahui",
      "Tebak ciri-ciri fisik",
      "Fungsi atau kegunaan",
      "Habitat atau tempat tinggal",
      "Perilaku atau kebiasaan unik",
      "Rekor dunia (terbesar, terkecil, tercepat)",
      "Mitos vs Fakta",
      "Teka-teki sederhana"
    ];
    const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    const randomSeed = Math.floor(Math.random() * 1000000);

    const prompt = `Buatkan 1 soal kuis pilihan ganda yang SERU dan UNIK untuk anak SD.
    Topik: ${topic}
    Fokus Pertanyaan: ${randomModifier}
    Tingkat Kesulitan: ${difficulty}
    
    Instruksi Khusus:
    - Hindari pertanyaan umum yang membosankan (seperti 'apa warna langit?').
    - Gunakan bahasa yang ceria.
    - Opsi jawaban harus masuk akal.
    - Gunakan seed acak ini untuk variasi: ${randomSeed}
    
    Format JSON.`;

    const response = await ai.models.generateContent({
      model: textModelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data");
    return JSON.parse(jsonText) as QuizQuestion;
  } catch (error) {
    console.error("Quiz Error:", error);
    throw new Error("Gagal membuat kuis.");
  }
};

export const chatWithTeacher = async (history: {role: string, parts: {text: string}[]}[], newMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: textModelId,
      history: history,
      config: {
        systemInstruction: "Kamu adalah 'Kakak Pintar'. Jawab singkat, padat, jelas, dan ceria untuk anak kecil.",
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Maaf, coba lagi ya.";
  } catch (error) {
    console.error("Chat Error:", error);
    throw new Error("Koneksi terputus.");
  }
};