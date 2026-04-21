const CACHE_NAME = 'baie-des-naufrages-v63';
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/style.min.css?v=2026-04-22-fix-2',
    '/script.min.js?v=2026-04-22-fix-2',
    '/js/main.bundle.min.js?v=2026-04-22-fix-2',
    '/site.webmanifest',
    '/assets/branding/logo-baie-cartoon.svg',
    '/assets/navires/navire-cinema.svg',
    '/assets/navires/navire-jeux.svg',
    '/assets/navires/navire-math.svg',
    '/assets/navires/navire-musique.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => null))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/socket.io/')) {
        return;
    }

    event.respondWith(
        caches.match(request).then((cached) => {
            const networkFetch = fetch(request).then((response) => {
                if (response && response.ok && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => null);
                }
                return response;
            }).catch(() => cached);

            return cached || networkFetch;
        })
    );
});
