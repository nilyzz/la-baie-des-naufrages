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

import * as musicModule from './navires/music.js';
import * as mathModule from './navires/math.js';
import * as cinemaModule from './navires/cinema.js';

import {
    syncGameMenuOverlayBounds,
    syncAllGameMenuOverlayBounds,
    GAME_MENU_OVERLAY_PAIRS
} from './games/_shared/menu-overlay.js';
import * as boardHelpers from './games/_shared/board-helpers.js';

import * as game2048 from './games/game2048.js';
import * as aimModule from './games/aim.js';
import * as airHockey from './games/airHockey.js';
import * as baieBerry from './games/baieBerry.js';
import * as battleship from './games/battleship.js';
import * as blockBlast from './games/blockBlast.js';
import * as bomb from './games/bomb.js';
import * as breakout from './games/breakout.js';
import * as candyCrush from './games/candyCrush.js';
import * as checkers from './games/checkers.js';
import * as chess from './games/chess.js';
import * as coinClicker from './games/coinClicker.js';
import * as connect4 from './games/connect4.js';
import * as flappy from './games/flappy.js';
import * as flowFree from './games/flowFree.js';
import * as harborRun from './games/harborRun.js';
import * as magicSort from './games/magicSort.js';
import * as memoryGame from './games/memory.js';
import * as mentalMath from './games/mentalMath.js';
import * as minesweeper from './games/minesweeper.js';
import * as pacman from './games/pacman.js';
import * as pong from './games/pong.js';
import * as reaction from './games/reaction.js';
import * as rhythm from './games/rhythm.js';
import * as snake from './games/snake.js';
import * as solitaire from './games/solitaire.js';
import * as stacker from './games/stacker.js';
import * as sudoku from './games/sudoku.js';
import * as tetris from './games/tetris.js';
import * as ticTacToe from './games/ticTacToe.js';
import * as uno from './games/uno.js';

const GAME_MODULES = {
    game2048, aim: aimModule, airHockey, baieBerry, battleship, blockBlast,
    bomb, breakout, candyCrush, checkers, chess, coinClicker, connect4,
    flappy, flowFree, harborRun, magicSort, memory: memoryGame, mentalMath,
    minesweeper, pacman, pong, reaction, rhythm, snake, solitaire, stacker,
    sudoku, tetris, ticTacToe, uno
};

// Pont ESM → script.js : exposé au top-level pour que l'IIFE classique de script.js
// (chargée avec defer, donc après ce module) puisse appeler window.__baie.coinClicker.xxx()
// sans attendre DOMContentLoaded.
if (typeof window !== 'undefined') {
    window.__baie = Object.assign(window.__baie || {}, GAME_MODULES);
    // Bridge ESM → script.js : expose aussi tout ce que les modules core/multiplayer/navires/_shared
    // fournissent, pour que les identifiants référencés dans script.js (qui étaient définis
    // localement avant extraction) continuent de résoudre via la chaîne de scope globale.
    Object.assign(window, {
        LEGAL_NOTICE_ANIMATION_MS, SESSION_KEY, SESSION_TIMEOUT_MS,
        EXCEL_FILE_CANDIDATES, MULTIPLAYER_SUPPORTED_GAMES, GAME_FILTER_TAGS,
        UNO_MENU_CLOSE_DURATION_MS, GRID_OUTCOME_MENU_DELAY_MS,
        shuffleArray, formatMathNumber, normalizeBombWord,
        loadSession, saveSession, clearSession,
        openLegalNoticeModal, closeLegalNoticeModal,
        openGameOverModal, closeGameOverModal,
        showViewImmediately,
        MULTIPLAYER_SERVER_URL, getMultiplayerServerOrigin, getMultiplayerApiUrl, loadSocketIoClient,
        setMultiplayerStatus, getMultiplayerGameLabel, getSelectedMultiplayerGame,
        getPreferredMultiplayerPlayerName, syncMultiplayerPlayerNames,
        copyMultiplayerRoomCode, leaveMultiplayerRoom, renderMultiplayerPlayers,
        renderMultiplayerChatMessages, updateMultiplayerChatPanel, setMultiplayerEntryMode,
        ensureMultiplayerCreateLeaveButton, updateMultiplayerGameTileSelection,
        getSelectedMultiplayerGameLabel, syncMultiplayerEntryModeAccess, updateMultiplayerLobby,
        syncGameMenuOverlayBounds, syncAllGameMenuOverlayBounds, GAME_MENU_OVERLAY_PAIRS
    });
    window.__baie.multiplayerState = multiplayerState;
    window.__baie.music = musicModule;
    window.__baie.math = mathModule;
    window.__baie.cinema = cinemaModule;
    window.__baie.boardHelpers = boardHelpers;
}

function injectActiveGameTabAccessors() {
    const accessor = () => (typeof window !== 'undefined' ? window.__baieActiveGameTab?.() ?? null : null);
    for (const mod of Object.values(GAME_MODULES)) {
        for (const [key, value] of Object.entries(mod)) {
            if (typeof value === 'function' && /^set[A-Z].*ActiveGameTabAccessor$/.test(key)) {
                value(accessor);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    injectActiveGameTabAccessors();

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
        multiplayerState.getMultiplayerBusy() === false,
        Array.isArray(musicModule.PIANO_NOTES) && musicModule.PIANO_NOTES.length === 25,
        musicModule.PIANO_NOTE_MAP.get('c4')?.frequency === 261.63,
        typeof musicModule.renderPiano === 'function',
        typeof musicModule.startPianoNote === 'function',
        typeof musicModule.stopAllPianoNotes === 'function',
        mathModule.UNIT_GROUPS.temperature.units.length === 3,
        typeof mathModule.evaluateCalculatorExpression === 'function',
        typeof mathModule.convertTemperature === 'function',
        mathModule.convertTemperature(100, 'c', 'f') === 212,
        typeof cinemaModule.parseMoviesFromWorkbook === 'function',
        typeof cinemaModule.formatDate === 'function',
        cinemaModule.getRatingBadgeTone(18, 20) === 'is-excellent',
        cinemaModule.DEFAULT_POSTER_URL.startsWith('https://'),
        typeof syncGameMenuOverlayBounds === 'function',
        typeof syncAllGameMenuOverlayBounds === 'function',
        Array.isArray(GAME_MENU_OVERLAY_PAIRS) && GAME_MENU_OVERLAY_PAIRS.length === 31,
        typeof boardHelpers.isInsideGameGrid === 'function',
        typeof boardHelpers.getBoardMoveAnimationMetadata === 'function',
        boardHelpers.CHESS_SIZE === 8,
        Object.keys(GAME_MODULES).length === 31,
        typeof game2048.update2048Hud === 'function',
        typeof aimModule.AIM_GRID_SIZE === 'number',
        typeof airHockey.initializeAirHockey === 'function',
        typeof baieBerry.initializeBaieBerry === 'function' || typeof baieBerry.renderBaieBerry === 'function',
        typeof battleship.initializeBattleship === 'function',
        typeof blockBlast.initializeBlockBlast === 'function' || typeof blockBlast.renderBlockBlast === 'function',
        typeof bomb.initializeBomb === 'function',
        typeof breakout.initializeBreakout === 'function' || typeof breakout.renderBreakout === 'function',
        typeof candyCrush.initializeCandyCrush === 'function' || typeof candyCrush.renderCandyCrush === 'function',
        typeof checkers.initializeCheckers === 'function',
        typeof chess.initializeChess === 'function',
        typeof coinClicker.initializeCoinClicker === 'function',
        typeof connect4.isMultiplayerConnect4Active === 'function',
        typeof flappy.initializeFlappy === 'function' || typeof flappy.renderFlappy === 'function',
        typeof flowFree.initializeFlowFree === 'function' || typeof flowFree.renderFlowFree === 'function',
        typeof harborRun.initializeHarborRun === 'function' || typeof harborRun.renderHarborRun === 'function',
        typeof magicSort.initializeMagicSort === 'function' || typeof magicSort.renderMagicSort === 'function',
        typeof memoryGame.initializeMemory === 'function' || typeof memoryGame.renderMemory === 'function',
        typeof mentalMath.initializeMentalMath === 'function' || typeof mentalMath.renderMentalMath === 'function',
        typeof minesweeper.initializeGame === 'function' && typeof minesweeper.renderBoard === 'function',
        typeof pacman.initializePacman === 'function' || typeof pacman.renderPacman === 'function',
        typeof pong.initializePong === 'function',
        typeof reaction.initializeReaction === 'function' || typeof reaction.renderReaction === 'function',
        typeof rhythm.initializeRhythm === 'function',
        typeof snake.initializeSnake === 'function' || typeof snake.renderSnake === 'function',
        typeof solitaire.initializeSolitaire === 'function' || typeof solitaire.renderSolitaire === 'function',
        typeof stacker.initializeStacker === 'function' || typeof stacker.renderStacker === 'function',
        typeof sudoku.initializeSudoku === 'function' || typeof sudoku.renderSudoku === 'function',
        typeof tetris.initializeTetris === 'function' || typeof tetris.renderTetris === 'function',
        typeof ticTacToe.isMultiplayerTicTacToeActive === 'function',
        typeof uno.initializeUno === 'function'
    ];

    const allOk = sanityChecks.every(Boolean);
    if (allOk) {
        console.log(`ES Modules OK — ${Object.keys(GAME_MODULES).length} jeux extraits + core/ + multiplayer/ + navires/ + games/_shared.`);
    } else {
        console.warn('ES Modules : un ou plusieurs imports ont échoué.', sanityChecks);
    }
});
