const CACHE_NAME = 'dinov3-v1';
const urlsToCache = [
  '/',
  '/index_optimized.html',
  '/styles.min.css',
  '/script.min.js',
  '/images/dinov3-video-thumbnail.webp',
  '/images/dinov3-video-thumbnail.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return cached response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});