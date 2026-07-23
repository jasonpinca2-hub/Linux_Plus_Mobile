const CACHE_NAME = "linuxplus-trainer-rev6-8";
const APP_FILES = [
  "./",
  "./index.html",
  "./START_HERE_iPhone.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./js/app.js",
  "./js/pwa.js",
  "./js/rev64.js",
  "./js/rev65.js",
  "./js/rev66.js",
  "./js/rev67.js",
  "./js/rev68.js",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/m10_q10_0.jpeg",
  "./assets/m10_q12_0.jpeg",
  "./assets/m10_q14_0.jpeg",
  "./assets/m10_q15_0.jpeg",
  "./assets/m10_q19_0.jpeg",
  "./assets/m10_q23_0.jpeg",
  "./assets/m10_q24_0.jpeg",
  "./assets/m10_q25_0.jpeg",
  "./assets/m10_q5_0.jpeg",
  "./assets/m10_q6_0.jpeg",
  "./assets/m10_q7_0.jpeg",
  "./assets/m10_q8_0.jpeg",
  "./assets/m10_q9_0.jpeg",
  "./assets/m11_q11_0.jpeg",
  "./assets/m11_q13_0.jpeg",
  "./assets/m11_q15_0.jpeg",
  "./assets/m11_q5_0.jpeg",
  "./assets/m11_q8_0.jpeg",
  "./assets/m13_q13_0.png",
  "./assets/m13_q9_0.png",
  "./assets/m2_q12_0.jpeg",
  "./assets/m2_q7_0.jpeg",
  "./assets/m3_q2_0.jpeg",
  "./assets/m3_q3_0.jpeg",
  "./assets/m3_q4_0.jpeg",
  "./assets/m3_q4_1.jpeg",
  "./assets/m6_q4_0.jpeg",
  "./assets/m7_q2_0.jpeg",
  "./assets/m8_q10_0.jpeg",
  "./assets/m8_q12_0.jpeg",
  "./assets/m8_q13_0.jpeg",
  "./assets/m8_q14_0.jpeg",
  "./assets/m8_q5_0.jpeg",
  "./assets/m8_q6_0.jpeg",
  "./assets/m8_q7_0.jpeg"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Network-first for page navigations so new GitHub Pages revisions appear promptly.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache-first for stable app assets, with background cache population.
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response && response.status === 200) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
