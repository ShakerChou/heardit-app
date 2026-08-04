const CACHE = 'heardit-v1.6.19';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      // Only cache the HTML page in install - other assets are cached via CACHE_ALL message
      return cache.add('./').catch(function() {});
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Cache-first for navigation (HTML) - essential for offline PWA
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        if (cached) return cached;
        // Try matching any entry in cache (handles trailing slash differences)
        return caches.open(CACHE).then(function(cache) {
          return cache.match('./').then(function(rootCached) {
            if (rootCached) return rootCached;
            return fetch(e.request).then(function(response) {
              cache.put(e.request, response.clone());
              return response;
            });
          });
        });
      }).catch(function() {
        return fetch(e.request);
      })
    );
    return;
  }
  // Cache-first for static assets, adding to cache on network fetch
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(response) {
        return caches.open(CACHE).then(function(cache) {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  if (e.data && e.data.type === 'CACHE_ALL') {
    var assets = e.data.assets || [];
    var page = e.data.page;
    e.waitUntil(
      caches.open(CACHE).then(function(cache) {
        var urls = assets.slice();
        if (page) urls.push(page);
        return Promise.all(urls.map(function(url) {
          return cache.add(url).catch(function() {});
        }));
      })
    );
  }
});