const CACHE_NAME = 'dapur-pintar-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  // Cache Tailwind agar tampilan tetap bagus saat offline
  'https://cdn.tailwindcss.com' 
];

// 1. Install Service Worker
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Menyimpan aset offline...');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activate (Hapus cache lama)
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

// 3. Fetch (Cek Cache dulu, baru Internet)
self.addEventListener('fetch', (evt) => {
  // Abaikan request ke API Gemini (karena tidak bisa dicache)
  if (evt.request.url.includes('generativelanguage.googleapis.com')) {
    return; 
  }

  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
             // Cache file baru yang dibuka (kecuali API)
             if(evt.request.url.startsWith('http')) {
                 cache.put(evt.request, fetchRes.clone());
             }
             return fetchRes;
          });
      });
    }).catch(() => {
      // Jika offline total dan file tidak ada di cache
      if (evt.request.url.indexOf('.html') > -1) {
        return caches.match('./index.html');
      }
    })
  );
});