const CACHE_NAME = 'baie-des-naufrages-v47';
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/style.css?v=2026-04-21-unify-1',
    '/script.js?v=2026-04-21-bridge-10',
    '/js/main.js?v=2026-04-20-esm-3',
    '/js/core/constants.js',
    '/js/core/utils.js',
    '/js/core/session.js',
    '/js/core/modals.js',
    '/js/core/router.js',
    '/js/multiplayer/state.js',
    '/js/multiplayer/connection.js',
    '/js/multiplayer/status.js',
    '/js/multiplayer/lobby.js',
    '/js/navires/music.js',
    '/js/navires/math.js',
    '/js/navires/cinema.js',
    '/js/games/_shared/menu-overlay.js',
    '/js/games/_shared/board-helpers.js',
    '/js/games/memory.js',
    '/js/games/stacker.js',
    '/js/games/reaction.js',
    '/js/games/aim.js',
    '/js/games/mentalMath.js',
    '/js/games/snake.js',
    '/js/games/sudoku.js',
    '/js/games/game2048.js',
    '/js/games/minesweeper.js',
    '/js/games/flappy.js',
    '/js/games/tetris.js',
    '/js/games/pacman.js',
    '/js/games/breakout.js',
    '/js/games/harborRun.js',
    '/js/games/magicSort.js',
    '/js/games/flowFree.js',
    '/js/games/blockBlast.js',
    '/js/games/candyCrush.js',
    '/js/games/solitaire.js',
    '/js/games/baieBerry.js',
    '/js/games/ticTacToe.js',
    '/js/games/connect4.js',
    '/js/games/checkers.js',
    '/js/games/chess.js',
    '/js/games/pong.js',
    '/js/games/airHockey.js',
    '/js/games/battleship.js',
    '/js/games/uno.js',
    '/js/games/bomb.js',
    '/js/games/coinClicker.js',
    '/js/games/rhythm.js',
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
