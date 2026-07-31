const CACHE = 'heardit-v1.5.19';
const ASSETS = [
  './manifest.json',
  // SVG icons
  './assets/close_icon.svg',
  './assets/gain-minus.svg',
  './assets/gain-plus.svg',
  './assets/i_icon.svg',
  './assets/try.svg',
  './assets/union-bird.svg',
  // PWA icons (PNG for compatibility)
  './assets/app-icon-180.png',
  './assets/app-icon-192.png',
  './assets/app-icon-512.png',
  // WebP images
  './assets/1_cup.webp',
  './assets/2_cup.webp',
  './assets/3_cup.webp',
  './assets/4_cup.webp',
  './assets/bird-icon-small.webp',
  './assets/bird-logo-big.webp',
  './assets/cetingtu_left.webp',
  './assets/cetingtu_right.webp',
  './assets/circle-btn-bg-1afd37.webp',
  './assets/left ear_cup.webp',
  './assets/left ear_cup_stop.webp',
  './assets/level_cup_no.webp',
  './assets/level_cup_yes.webp',
  './assets/mic-headset-151ff4.webp',
  './assets/mic_phone.webp',
  './assets/right ear_cup.webp',
  './assets/right ear_cup_stop.webp',
  './assets/start_cup.webp',
  './assets/stop_cup.webp',
  './assets/test ear_illust.webp',
  './assets/test over cup1.webp',
  './assets/test over cup2.webp',
  './assets/test-complete-bird.webp',
  './assets/test-ear-pause.webp',
  './assets/test-quiet.webp',
  './assets/test-tap.webp',
  './assets/test-volume.webp',
  './assets/test-wired.webp',
  './assets/text_btn_icon.webp'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
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
  // Network-first for HTML (navigation requests) - always get latest version
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }
  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});