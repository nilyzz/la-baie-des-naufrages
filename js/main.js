// Bootstrap du module ES natif — migration progressive du monolithe script.js.
// Ce fichier cohabite avec script.js pendant la migration, il ne remplace rien.

import {
    LEGAL_NOTICE_ANIMATION_MS,
    SESSION_KEY,
    SESSION_TIMEOUT_MS,
    EXCEL_FILE_CANDIDATES,
    MULTIPLAYER_SUPPORTED_GAMES,
    GAME_FILTER_TAGS,
    UNO_MENU_CLOSE_DURATION_MS,
    GRID_OUTCOME_MENU_DELAY_MS
} from './core/constants.js';

import { shuffleArray, formatMathNumber, normalizeBombWord } from './core/utils.js';
import { loadSession, saveSession, clearSession } from './core/session.js';
import {
    openLegalNoticeModal,
    closeLegalNoticeModal,
    openGameOverModal,
    closeGameOverModal
} from './core/modals.js';
import { showViewImmediately } from './core/router.js';

import {
    MULTIPLAYER_SERVER_URL,
    getMultiplayerServerOrigin,
    getMultiplayerApiUrl,
    loadSocketIoClient
} from './multiplayer/connection.js';
import {
    setMultiplayerStatus,
    getMultiplayerGameLabel,
    getSelectedMultiplayerGame,
    getPreferredMultiplayerPlayerName,
    syncMultiplayerPlayerNames
} from './multiplayer/status.js';
import {
    copyMultiplayerRoomCode,
    leaveMultiplayerRoom,
    renderMultiplayerPlayers,
    renderMultiplayerChatMessages,
    updateMultiplayerChatPanel,
    setMultiplayerEntryMode,
    ensureMultiplayerCreateLeaveButton,
    updateMultiplayerGameTileSelection,
    getSelectedMultiplayerGameLabel,
    syncMultiplayerEntryModeAccess,
    updateMultiplayerLobby
} from './multiplayer/lobby.js';
import * as multiplayerState from './multiplayer/state.js';

document.addEventListener('DOMContentLoaded', () => {
    const sanityChecks = [
        Array.isArray(shuffleArray([1, 2, 3])) && shuffleArray([1, 2, 3]).length === 3,
        formatMathNumber(1.234567, 2) === '1,23',
        normalizeBombWord('Éléphant-12') === 'elephant12',
        typeof LEGAL_NOTICE_ANIMATION_MS === 'number',
        typeof SESSION_KEY === 'string',
        typeof SESSION_TIMEOUT_MS === 'number',
        Array.isArray(EXCEL_FILE_CANDIDATES) && EXCEL_FILE_CANDIDATES.length === 9,
        Object.keys(MULTIPLAYER_SUPPORTED_GAMES).length === 9,
        Object.keys(GAME_FILTER_TAGS).length === 31,
        UNO_MENU_CLOSE_DURATION_MS === 260,
        GRID_OUTCOME_MENU_DELAY_MS === 650,
        typeof loadSession === 'function',
        typeof saveSession === 'function',
        typeof clearSession === 'function',
        typeof openLegalNoticeModal === 'function',
        typeof closeLegalNoticeModal === 'function',
        typeof openGameOverModal === 'function',
        typeof closeGameOverModal === 'function',
        typeof showViewImmediately === 'function',
        typeof MULTIPLAYER_SERVER_URL === 'string',
        typeof getMultiplayerServerOrigin === 'function',
        typeof getMultiplayerApiUrl === 'function' && getMultiplayerApiUrl('/api/health').endsWith('/api/health'),
        typeof loadSocketIoClient === 'function',
        typeof setMultiplayerStatus === 'function',
        getMultiplayerGameLabel('pong') === 'Pong',
        getMultiplayerGameLabel('invalid') === 'Jeu inconnu',
        typeof getSelectedMultiplayerGame === 'function',
        typeof getPreferredMultiplayerPlayerName === 'function',
        typeof syncMultiplayerPlayerNames === 'function',
        typeof copyMultiplayerRoomCode === 'function',
        typeof leaveMultiplayerRoom === 'function',
        typeof renderMultiplayerPlayers === 'function',
        typeof renderMultiplayerChatMessages === 'function',
        typeof updateMultiplayerChatPanel === 'function',
        typeof setMultiplayerEntryMode === 'function',
        typeof ensureMultiplayerCreateLeaveButton === 'function',
        typeof updateMultiplayerGameTileSelection === 'function',
        typeof getSelectedMultiplayerGameLabel === 'function',
        typeof syncMultiplayerEntryModeAccess === 'function',
        typeof updateMultiplayerLobby === 'function',
        multiplayerState.getMultiplayerSocket() === null,
        multiplayerState.getMultiplayerActiveRoom() === null,
        multiplayerState.getMultiplayerEntryMode() === 'create',
        multiplayerState.getMultiplayerBusy() === false
    ];

    const allOk = sanityChecks.every(Boolean);
    if (allOk) {
        console.log('ES Modules OK — core/ + multiplayer/ (state + lobby extended).');
    } else {
        console.warn('ES Modules : un ou plusieurs imports ont échoué.', sanityChecks);
    }
});
