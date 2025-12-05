const CACHE_NAME = 'live-editor-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  // Library External (Wajib di-cache agar jalan offline)
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@phosphor-icons/web',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap',
  // Ikon (Ganti dengan file lokal jika sudah didownload)
  'https://cdn-icons-png.flaticon.com/512/1005/1005141.png'
];

// 1. Install Service Worker & Cache Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Menyimpan file untuk offline...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activate & Hapus Cache Lama jika ada update
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

// 3. Fetch (Cek Cache dulu, kalau tidak ada baru ambil internet)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika ada di cache, pakai itu. Jika tidak, ambil dari internet.
      return response || fetch(event.request).then((fetchResponse) => {
         // Opsional: Cache file baru yang belum ada di daftar
         return caches.open(CACHE_NAME).then((cache) => {
             // Cache copy dari response network
             if(event.request.url.startsWith('http')) {
                 cache.put(event.request, fetchResponse.clone());
             }
             return fetchResponse;
         });
      });
    }).catch(() => {
        // Jika offline total dan file tidak ada di cache
        // Bisa tampilkan halaman fallback sederhana jika mau
    })
  );
});