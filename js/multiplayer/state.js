// Shared multiplayer state for La Baie des Naufragés.
// Extracted from script.js during the ES-modules migration.
//
// This module owns the reactive-ish state that every multiplayer function
// used to read from / write to in the script.js IIFE. Keeping it in one
// place lets the other multiplayer modules (lobby, connection, status) be
// pure wrappers over getters/setters instead of requiring 15-argument
// dependency injection.
//
// Mutations go through setters so that future subscribers (or assertions)
// can be plugged in without touching callers. Cohabitation rule still
// applies: the original `let multiplayerSocket = null;` etc. inside
// script.js remain in place until the final consolidation.

const state = {
    socket: null,
    activeRoom: null,
    selectedGameId: null,
    entryMode: 'create',
    chatSignature: '',
    busy: false
};

// --- getters ---
export function getMultiplayerSocket() {
    return state.socket;
}

export function getMultiplayerActiveRoom() {
    return state.activeRoom;
}

export function getMultiplayerSelectedGameId() {
    return state.selectedGameId;
}

export function getMultiplayerEntryMode() {
    return state.entryMode;
}

export function getMultiplayerChatSignature() {
    return state.chatSignature;
}

// --- setters ---
export function setMultiplayerSocket(socket) {
    state.socket = socket || null;
}

export function setMultiplayerActiveRoom(activeRoom) {
    state.activeRoom = activeRoom || null;
}

export function setMultiplayerSelectedGameId(gameId) {
    state.selectedGameId = gameId || null;
}

export function setMultiplayerEntryMode(mode) {
    state.entryMode = mode === 'join' ? 'join' : 'create';
}

export function setMultiplayerChatSignature(signature) {
    state.chatSignature = String(signature || '');
}

export function getMultiplayerBusy() {
    return state.busy;
}

export function setMultiplayerBusy(busy) {
    state.busy = Boolean(busy);
}

/**
 * Convenience predicate: are we currently in a multiplayer room?
 */
export function hasActiveMultiplayerRoom() {
    return Boolean(state.activeRoom?.code);
}

/**
 * Returns the player that represents the current client inside the active
 * room, falling back to a match on the socket id.
 */
export function getCurrentMultiplayerPlayer() {
    if (!state.activeRoom?.players) {
        return null;
    }
    return state.activeRoom.players.find((player) => player.isYou)
        || state.activeRoom.players.find((player) => player.id === state.socket?.id)
        || null;
}

/**
 * Is the current client the host of the active room?
 */
export function isCurrentMultiplayerHost() {
    const currentPlayer = getCurrentMultiplayerPlayer();
    return Boolean(
        currentPlayer?.isHost
        || (state.socket?.id && state.activeRoom?.hostId === state.socket.id)
    );
}

/**
 * Returns a "readyCount/readyTotal" label summarising the room readiness.
 */
export function getMultiplayerReadySummary() {
    const readyCount = Number(state.activeRoom?.readyCount || 0);
    const readyTotal = Number(state.activeRoom?.readyTotal || state.activeRoom?.playerCount || 0);
    return `${readyCount}/${readyTotal || 0}`;
}

/**
 * Is the current client flagged as ready inside the active room?
 */
export function isCurrentPlayerMultiplayerReady() {
    return Boolean(getCurrentMultiplayerPlayer()?.roomReady);
}

/**
 * Is the active room waiting for a specific game to launch?
 */
export function isMultiplayerLaunchPending(gameId = state.activeRoom?.gameId) {
    return state.activeRoom?.gameId === gameId && !state.activeRoom?.gameLaunched;
}
