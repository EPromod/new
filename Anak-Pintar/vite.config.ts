import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Property 'cwd' does not exist on type 'Process'. Cast process to any.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    // Menggunakan './' memaksa semua link aset menjadi relatif (contoh: src="./assets/...")
    // Ini solusi paling ampuh untuk masalah layar blank di GitHub Pages
    base: './', 
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  };
});