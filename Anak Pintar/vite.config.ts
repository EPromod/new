import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// PENTING: Ganti 'nama-repository-anda' dengan nama repository GitHub yang Anda buat.
// Contoh: Jika repo anda https://github.com/budi/dunia-pintar, maka isinya '/dunia-pintar/'
const REPO_NAME = '/Anak pintar/'; 

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // Base URL otomatis berubah tergantung mode (local atau production/github)
    base: mode === 'production' ? REPO_NAME : '/',
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  };
});
