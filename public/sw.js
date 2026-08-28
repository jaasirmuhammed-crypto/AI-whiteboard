// AI Whiteboard Service Worker (PWA Offline Caching Engine)
const CACHE_NAME = 'ai-whiteboard-cache-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './icons.svg',
];

// 1. Install event: Pre-cache core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate event: Clean up legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch event: Stale-While-Revalidate with Cache-First for static assets
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Exclude Firebase Firestore and external AI API endpoints from service worker caching
  if (url.origin.includes('googleapis.com') || url.origin.includes('firebase') || url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If cached response found, return it and revalidate in background
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
