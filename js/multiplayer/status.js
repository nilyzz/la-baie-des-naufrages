// Multiplayer status + lobby-entry helpers for La Baie des Naufragés.
// Extracted from script.js during the ES-modules migration.
//
// Pure versions: DOM refs are looked up on demand. State is fetched from
// `multiplayer/state.js` by default but can be overridden via arguments for
// testability.

import { MULTIPLAYER_SUPPORTED_GAMES } from '../core/constants.js';
import {
    getMultiplayerSelectedGameId,
    getMultiplayerEntryMode
} from './state.js';

/**
 * Prints a short status line in the multiplayer lobby banner.
 */
export function setMultiplayerStatus(message) {
    const target = document.getElementById('multiplayerLobbyStatus');
    if (target) {
        target.textContent = message;
    }
}

/**
 * Human-readable label for a multiplayer game id ("pong" -> "Pong", etc.).
 */
export function getMultiplayerGameLabel(gameId) {
    return MULTIPLAYER_SUPPORTED_GAMES[gameId] || 'Jeu inconnu';
}

/**
 * Returns the currently selected multiplayer game id, falling back to the
 * first tile in the DOM if the provided id is not a supported game.
 *
 * @param {string|null} selectedGameId  the id currently stored by the app.
 *                                      (script.js holds this in its IIFE as
 *                                      `multiplayerSelectedGameId`.)
 */
export function getSelectedMultiplayerGame(selectedGameId = getMultiplayerSelectedGameId()) {
    const tiles = document.querySelectorAll('[data-multiplayer-game-select]');
    const fallbackGameId = tiles[0]?.dataset.multiplayerGameSelect || null;
    const activeGameId = MULTIPLAYER_SUPPORTED_GAMES[selectedGameId]
        ? selectedGameId
        : fallbackGameId;
    return MULTIPLAYER_SUPPORTED_GAMES[activeGameId] ? activeGameId : null;
}

/**
 * Picks the best pseudo to display, preferring the currently-active panel.
 *
 * @param {'create'|'join'} preferredSource
 */
export function getPreferredMultiplayerPlayerName(preferredSource = getMultiplayerEntryMode()) {
    const createInput = document.getElementById('multiplayerCreatePlayerNameInput');
    const joinInput = document.getElementById('multiplayerJoinPlayerNameInput');
    const createName = createInput?.value.trim() || '';
    const joinName = joinInput?.value.trim() || '';

    if (preferredSource === 'join') {
        return joinName || createName;
    }

    return createName || joinName;
}

/**
 * Mirrors the pseudo between the "create" and "join" lobby panels so that
 * typing it once is enough.
 */
export function syncMultiplayerPlayerNames(source = 'create') {
    const createInput = document.getElementById('multiplayerCreatePlayerNameInput');
    const joinInput = document.getElementById('multiplayerJoinPlayerNameInput');

    if (source === 'create' && joinInput && !joinInput.value.trim()) {
        joinInput.value = createInput?.value.trim() || '';
    }

    if (source === 'join' && createInput && !createInput.value.trim()) {
        createInput.value = joinInput?.value.trim() || '';
    }
}
