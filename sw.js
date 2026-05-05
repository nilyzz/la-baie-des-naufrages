const CACHE_NAME = 'baie-des-naufrages-v2-32';
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/confidentialite.html',
    '/mentions-legales.html',
    '/ads.txt',
    '/style.min.css?v=v2-32',
    '/js/main.bundle.min.js?v=v2-32',
    '/js/core/consent.js?v=v2-32',
    '/js/core/sw-register.js?v=v2-32',
    '/site.webmanifest',
    '/assets/branding/logo-baie-cartoon.svg',
    '/assets/navires/navire-cinema.svg',
    '/assets/navires/navire-jeux.svg',
    '/assets/navires/navire-math.svg',
    '/assets/navires/navire-musique.svg',
    // CHUNKS_START
    '/js/chunks/chunk-KXJW57KP.js',
    '/js/chunks/chunk-N3QHIL6Q.js',
    '/js/chunks/chunk-V2AZNKNT.js',
    '/js/chunks/chunk-VC46IEJQ.js',
    '/js/chunks/chunk-W4TJQMPG.js',
    '/js/chunks/chunk-ZQH3MLCO.js',
    '/js/chunks/cinema-L2HPFVZV.js',
    '/js/chunks/game-event-bindings-4T7SZCQR.js',
    '/js/chunks/game-lifecycle-OK2VRUQ5.js',
    '/js/chunks/math-4IXABKSN.js',
    '/js/chunks/music-5ZEZPDUJ.js',
    // CHUNKS_END
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS).catch((err) => { console.warn('[SW] precache partiel:', err.message || err); return null; }))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )).then(() => self.clients.claim())
            .then(() => self.clients.matchAll({ type: 'window' }))
            .then((clients) => clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED' })))
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

    const isHtml = request.headers.get('Accept')?.includes('text/html')
        || url.pathname.endsWith('.html')
        || url.pathname === '/';

    if (isHtml) {
        // Network-first pour les pages HTML : l'utilisateur voit toujours la dernière version
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.ok && response.type === 'basic') {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => null);
                    }
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Cache-first pour les assets versionnés (CSS/JS avec ?v=...) et fichiers statiques
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
