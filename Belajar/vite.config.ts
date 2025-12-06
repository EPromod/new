import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    // PENTING: base './' wajib agar aplikasi bisa jalan di subfolder (seperti /Anak-Pintar/)
    base: './', 
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  };
});