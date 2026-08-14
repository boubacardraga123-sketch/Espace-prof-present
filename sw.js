// Service worker minimal — nécessaire sur certains navigateurs pour permettre
// l'installation de l'Espace Professeur comme une application.
const CACHE_NAME = 'espace-prof-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Stratégie "network first" : on essaie toujours d'aller chercher la version
// la plus récente en ligne, avec un repli sur le cache si hors-ligne.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
