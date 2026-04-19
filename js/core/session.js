// Session persistence in localStorage for La Baie des Naufragés.
// Extracted from script.js during the ES-modules migration.
// Side-effects tied to the running app (activity timer rescheduling, view
// reload) remain in script.js for now: this module only deals with reading,
// writing and clearing the persisted payload.

import { SESSION_KEY, SESSION_TIMEOUT_MS } from './constants.js';

/**
 * Reads the current session from localStorage.
 * Returns null when no valid (authenticated + recent) session is present.
 * A stale session is cleared as a side-effect.
 */
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

/**
 * Persists session data, merging with whatever is already stored.
 * Always refreshes `lastActivity` to "now".
 *
 * Note: the original `saveSession` in script.js also re-schedules the
 * activity-based timeout; that scheduler still lives in script.js for now.
 */
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
}

/**
 * Removes the persisted session. Does NOT clear any timer set by script.js —
 * the IIFE version still handles that alongside its own `clearSession`.
 */
export function clearSession() {
    window.localStorage.removeItem(SESSION_KEY);
}
