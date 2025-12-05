const CACHE_NAME = 'forensik-ai-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  // Library External (Wajib di-cache agar tampilan tidak rusak saat offline)
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/exif-js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
];

// 1. Install Service Worker & Cache File
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Menyimpan aset offline...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activate & Hapus Cache Lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. Fetch (Strategi: Cache First, Network Fallback)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika ada di cache, pakai cache. Jika tidak, ambil dari internet.
      return response || fetch(event.request).catch(() => {
          // Jika offline dan file tidak ada di cache (misal request API Gemini), biarkan gagal secara natural
          // atau return halaman offline kustom jika ada.
      });
    })
  );
});