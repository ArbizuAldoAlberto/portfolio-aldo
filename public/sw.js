self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('nexus-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/favicon-dev.svg',
        '/favicon-founder.svg',
        '/favicon-gentleman.svg',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      }).catch(() => {
        return new Response('Network error occurred', { status: 408, headers: { 'Content-Type': 'text/plain' } });
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(name => name !== 'nexus-cache-v1').map(name => caches.delete(name))
      );
    })
  );
});
