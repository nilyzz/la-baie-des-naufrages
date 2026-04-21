// Session persistence + activity scheduler for La Baie des Naufragés.
// Source of truth for session handling. script.js no longer duplicates these
// functions; it calls the window-exposed versions via js/main.js.

import { SESSION_KEY, SESSION_TIMEOUT_MS } from './constants.js';

let sessionTimeout = null;

export function loadSession() {
    try {
        const storedSession = window.localStorage.getItem(SESSION_KEY);

        if (!storedSession) {
            return null;
        }

        const session = JSON.parse(storedSession);

        if (!session?.authenticated || !session.lastActivity) {
            return null;
        }

        if (Date.now() - Number(session.lastActivity) > SESSION_TIMEOUT_MS) {
            clearSession();
            return null;
        }

        return session;
    } catch (error) {
        console.error('Impossible de lire la session sauvegardee.', error);
        clearSession();
        return null;
    }
}

export function saveSession(partialSession = {}) {
    const currentSession = loadSession() || {};
    const nextSession = {
        authenticated: true,
        lastActivity: Date.now(),
        lastDestination: currentSession.lastDestination || 'services',
        ...currentSession,
        ...partialSession
    };

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    scheduleSessionTimeout();
}

export function clearSession() {
    if (sessionTimeout) {
        window.clearTimeout(sessionTimeout);
        sessionTimeout = null;
    }

    window.localStorage.removeItem(SESSION_KEY);
}

export function scheduleSessionTimeout() {
    const session = loadSession();

    if (sessionTimeout) {
        window.clearTimeout(sessionTimeout);
        sessionTimeout = null;
    }

    if (!session) {
        return;
    }

    const timeRemaining = SESSION_TIMEOUT_MS - (Date.now() - Number(session.lastActivity));

    if (timeRemaining <= 0) {
        clearSession();
        return;
    }

    sessionTimeout = window.setTimeout(() => {
        clearSession();
        window.location.reload();
    }, timeRemaining);
}

export function registerActivity() {
    const session = loadSession();

    if (!session) {
        return;
    }

    saveSession({
        ...session,
        lastActivity: Date.now()
    });
}
