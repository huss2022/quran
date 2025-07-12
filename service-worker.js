const CACHE_NAME = 'quran-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo-light.png',
  '/logo-dark.png',
  'icons/icon-72x72.png',
  'icons/icon-96x96.png',
  'icons/icon-128x128.png',
  'icons/icon-144x144.png',
  'icons/icon-152x152.png',
  'icons/icon-192x192.png',
  'icons/icon-384x384.png',
  'icons/icon-512x512.png'
];

// تثبيت Service Worker وتخزين الموارد الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// تفعيل Service Worker وإزالة التخزين المؤقت القديم
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// استرجاع الطلبات من التخزين المؤقت أو من الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجدت في التخزين المؤقت، نعيدها
        if (response) {
          return response;
        }
        // وإلا نجلب من الشبكة
        return fetch(event.request);
      })
  );
});