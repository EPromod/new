import { GoogleGenAI, Modality } from "@google/genai";
import { AiResponse } from '../types';

const apiKey = process.env.API_KEY || '';
let client: GoogleGenAI | null = null;

if (apiKey) {
  client = new GoogleGenAI({ apiKey });
}

export const generateFunFactAndAudio = async (itemLabel: string): Promise<AiResponse | null> => {
  if (!client) {
    console.warn("API Key is missing. Skipping AI generation.");
    return null;
  }

  try {
    const prompt = `Ceritakan fakta seru, singkat, dan mendidik untuk anak umur 5 tahun tentang "${itemLabel}". 
    Gunakan bahasa Indonesia yang ceria, mudah dipahami, dan penuh semangat. 
    Maksimal 2 kalimat.`;

    // 1. Generate Text Fact
    const textResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const factText = textResponse.text || `Belajar tentang ${itemLabel} itu menyenangkan!`;

    // 2. Generate Speech for the fact
    const speechResponse = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: factText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is usually a good warm voice
          },
        },
      },
    });

    const audioBase64 = speechResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    return {
      text: factText,
      audioBase64: audioBase64,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};