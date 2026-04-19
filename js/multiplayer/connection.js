// Lightweight multiplayer connection primitives for La Baie des Naufragés.
// Extracted from script.js during the ES-modules migration.
//
// Scope: MULTIPLAYER_SERVER_URL + origin/url helpers + Socket.IO client loader.
// The full `ensureMultiplayerConnection` orchestrator (with its 11 event
// handlers that branch into 9 per-game sync functions and ~20 IIFE state
// variables) is NOT extracted at this stage: it would require wiring 40+
// dependencies while those live in script.js. It will be moved once the
// per-game modules have been extracted and a multiplayer state module exists.

function readMultiplayerServerUrl() {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
        return '';
    }
    const metaTag = document.querySelector('meta[name="multiplayer-server-url"]');
    const raw = String(window.BAIE_MULTIPLAYER_SERVER_URL || metaTag?.content || '');
    return raw.trim().replace(/\/+$/, '');
}

/**
 * The origin of the Socket.IO server, as configured via
 * `<meta name="multiplayer-server-url">` or `window.BAIE_MULTIPLAYER_SERVER_URL`.
 * Empty string means "same origin as the page".
 */
export const MULTIPLAYER_SERVER_URL = readMultiplayerServerUrl();

/**
 * Full origin to reach the Socket.IO server: configured value or page origin.
 */
export function getMultiplayerServerOrigin() {
    return MULTIPLAYER_SERVER_URL || window.location.origin;
}

/**
 * Builds a URL under the multiplayer server origin for the given path.
 */
export function getMultiplayerApiUrl(path) {
    return `${getMultiplayerServerOrigin()}${path}`;
}

/**
 * Loads the Socket.IO client script from the multiplayer server, if not
 * already on the page. Resolves to `window.io`. Reuses an in-flight
 * `<script data-socket-io-client="true">` when present.
 */
export function loadSocketIoClient() {
    if (window.io) {
        return Promise.resolve(window.io);
    }

    if (!/^https?:$/i.test(window.location.protocol)) {
        return Promise.reject(new Error('Le client Socket.IO demande le site via http:// ou https://.'));
    }

    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector('script[data-socket-io-client="true"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(window.io), { once: true });
            existingScript.addEventListener('error', () => reject(new Error('Impossible de charger Socket.IO.')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = `${getMultiplayerServerOrigin()}/socket.io/socket.io.js`;
        script.async = true;
        script.dataset.socketIoClient = 'true';
        script.addEventListener('load', () => resolve(window.io), { once: true });
        script.addEventListener('error', () => reject(new Error('Impossible de charger Socket.IO.')), { once: true });
        document.head.appendChild(script);
    });
}
