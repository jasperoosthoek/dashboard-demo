importScripts('/mockServiceWorker.js');

// Activate a new deploy's worker immediately instead of leaving an
// already-open tab running under the old one until it's closed and
// reopened - paired with the controllerchange listener in main.tsx that
// reloads the page once control actually changes mid-session.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
  }
});
