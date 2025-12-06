import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Property 'cwd' does not exist on type 'Process'. Cast process to any.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    // Menggunakan string kosong '' membuat path menjadi relatif (misal: ./assets/...)
    // Ini akan otomatis bekerja di repository mana saja (dunia-pintar-anak, new/Anak Pintar, dll)
    base: '', 
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  };
});