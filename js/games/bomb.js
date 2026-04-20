// Game module — La Bombe, duel local au clavier et multijoueur en ligne.
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { normalizeBombWord } from '../core/utils.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal, openGameOverModal } from '../core/modals.js';
import {
    getMultiplayerActiveRoom,
    isCurrentPlayerMultiplayerReady,
    getMultiplayerReadySummary
} from '../multiplayer/state.js';

const BOMB_LOCAL_SYLLABLES = [
    'ba', 'be', 'bi', 'bo', 'bu',
    'ca', 'ce', 'ci', 'co',
    'da', 'de', 'di', 'do',
    'fa', 'fe', 'fi', 'fo',
    'ga', 'ge', 'go',
    'la', 'le', 'li', 'lo', 'lu',
    'ma', 'me', 'mi', 'mo', 'mu',
    'na', 'ne', 'ni', 'no',
    'pa', 'pe', 'pi', 'po',
    'ra', 're', 'ri', 'ro',
    'sa', 'se', 'si', 'so',
    'ta', 'te', 'ti', 'to',
    'ou', 'on', 'an', 'eu', 'oi'
];
const BOMB_LOCAL_TURN_MS = 12000;
const BOMB_LOCAL_MIN_TURN_MS = 5000;
const BOMB_LOCAL_TURN_STEP_MS = 280;
const BOMB_LOCAL_RANDOM_EXPLOSION_MS = 800;
const BOMB_LOCAL_MIN_BEFORE_RANDOM_MS = 2500;
const BOMB_LOCAL_WORD_HISTORY_LIMIT = 24;

let bombLastFinishedStateKey = '';
let bombState = null;
let bombTimerInterval = null;
let bombMenuVisible = true;
let bombMenuShowingRules = false;
let bombMenuClosing = false;
let bombMenuEntering = false;
let bombSelectedMode = 'local';
let bombLocalState = null;

let activeGameTabAccessor = () => null;
export function setBombActiveGameTabAccessor(fn) {
    if (typeof fn === 'function') activeGameTabAccessor = fn;
}

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        bombGame: $('bombGame'),
        bombTable: $('bombTable'),
        bombSyllableDisplay: $('bombSyllableDisplay'),
        bombSpotlightSyllable: $('bombSpotlightSyllable'),
        bombTimerDisplay: $('bombTimerDisplay'),
        bombTurnDisplay: $('bombTurnDisplay'),
        bombHelpText: $('bombHelpText'),
        bombStatusBanner: $('bombStatusBanner'),
        bombSpotlightPlayer: $('bombSpotlightPlayer'),
        bombPlayersBoard: $('bombPlayersBoard'),
        bombUsedWords: $('bombUsedWords'),
        bombWordInput: $('bombWordInput'),
        bombWordSubmitButton: $('bombWordSubmitButton'),
        bombRestartButton: $('bombRestartButton'),
        bombMenuOverlay: $('bombMenuOverlay'),
        bombMenuEyebrow: $('bombMenuEyebrow'),
        bombMenuTitle: $('bombMenuTitle'),
        bombMenuText: $('bombMenuText'),
        bombMenuActionButton: $('bombMenuActionButton'),
        bombMenuRulesButton: $('bombMenuRulesButton'),
        bombMenuModeButtons: document.querySelectorAll('[data-bomb-mode]')
    };
}

export function pickRandomBombSyllable() {
    return BOMB_LOCAL_SYLLABLES[Math.floor(Math.random() * BOMB_LOCAL_SYLLABLES.length)];
}

export function isBombLocalActive() {
    return !isMultiplayerBombActive() && Boolean(bombLocalState);
}

export function getBombLocalRulesText() {
    return 'Les deux capitaines partagent le clavier. Tape un mot contenant la syllabe imprim\u00e9e sur la bombe, puis appuie sur Entr\u00e9e ou clique sur Envoyer pour passer la bombe \u00e0 l\u2019autre. La m\u00e8che raccourcit \u00e0 chaque tour et la bombe peut exploser sans pr\u00e9venir. Celui qui la tient au moment du boum a perdu.';
}

export function createBombLocalState() {
    const syllable = pickRandomBombSyllable();
    const now = Date.now();
    return {
        players: [
            { id: 'local-1', name: 'Capitaine 1', eliminated: false, lives: 1 },
            { id: 'local-2', name: 'Capitaine 2', eliminated: false, lives: 1 }
        ],
        currentPlayerIndex: 0,
        currentSyllable: syllable,
        usedWords: [],
        usedWordsMap: {},
        winner: null,
        statusMessage: `Tour du Capitaine 1. Trouve un mot contenant \u00ab ${syllable.toUpperCase()} \u00bb.`,
        turnCount: 0,
        round: 1,
        turnDurationMs: BOMB_LOCAL_TURN_MS,
        turnDeadlineAt: now + BOMB_LOCAL_TURN_MS,
        fuseStart: now,
        lastWord: '',
        lastWordBy: null
    };
}

export function startBombLocalRound() {
    const { bombWordInput } = dom();
    bombLocalState = createBombLocalState();
    bombState = bombLocalState;
    startBombTimerLoop();
    renderBomb();
    window.setTimeout(() => {
        bombWordInput?.focus();
    }, 40);
}

export function finishBombLocal(loserIndex, reason = 'explosion') {
    if (!bombLocalState) return;
    const loser = bombLocalState.players[loserIndex];
    const winner = bombLocalState.players[(loserIndex + 1) % 2];
    bombLocalState.winner = winner.id;
    bombLocalState.turnDeadlineAt = 0;
    bombLocalState.statusMessage = reason === 'timeout'
        ? `Temps écoulé. La bombe explose sur ${loser.name}. ${winner.name} remporte le duel.`
        : `BOUM ! La bombe saute sur ${loser.name}. ${winner.name} tient bon jusqu'à la fin.`;
    renderBomb();
    revealBombOutcomeMenu(
        `${winner.name} s'en sort`,
        `${loser.name} garde la bombe au moment de l'explosion. ${winner.name} remporte le duel.`,
        'Duel terminé'
    );
}

export function handleBombLocalSubmit(word) {
    if (!bombLocalState || bombLocalState.winner) return;
    const trimmed = String(word || '').trim();
    if (!trimmed) return;
    const normalized = normalizeBombWord(trimmed);
    const normalizedSyllable = normalizeBombWord(bombLocalState.currentSyllable);

    if (normalized.length < 3) {
        bombLocalState.statusMessage = 'Trouve un mot d\u2019au moins 3 lettres.';
        renderBomb();
        return;
    }
    if (!normalized.includes(normalizedSyllable)) {
        bombLocalState.statusMessage = `Le mot doit contenir \u00ab ${bombLocalState.currentSyllable.toUpperCase()} \u00bb.`;
        renderBomb();
        return;
    }
    if (bombLocalState.usedWordsMap[normalized]) {
        bombLocalState.statusMessage = 'Ce mot a d\u00e9j\u00e0 \u00e9t\u00e9 utilis\u00e9.';
        renderBomb();
        return;
    }

    const currentPlayer = bombLocalState.players[bombLocalState.currentPlayerIndex];
    bombLocalState.usedWordsMap[normalized] = true;
    bombLocalState.usedWords.unshift({
        value: trimmed.slice(0, 32),
        normalized,
        by: currentPlayer.id
    });
    if (bombLocalState.usedWords.length > BOMB_LOCAL_WORD_HISTORY_LIMIT) {
        const removed = bombLocalState.usedWords.pop();
        if (removed?.normalized) {
            delete bombLocalState.usedWordsMap[removed.normalized];
        }
    }
    bombLocalState.lastWord = trimmed.slice(0, 32);
    bombLocalState.lastWordBy = currentPlayer.id;

    bombLocalState.currentPlayerIndex = (bombLocalState.currentPlayerIndex + 1) % 2;
    bombLocalState.currentSyllable = pickRandomBombSyllable();
    bombLocalState.turnCount += 1;
    const nextDuration = Math.max(
        BOMB_LOCAL_MIN_TURN_MS,
        BOMB_LOCAL_TURN_MS - bombLocalState.turnCount * BOMB_LOCAL_TURN_STEP_MS
    );
    bombLocalState.turnDurationMs = nextDuration;
    const now = Date.now();
    bombLocalState.turnDeadlineAt = now + nextDuration;
    bombLocalState.fuseStart = now;
    const nextPlayer = bombLocalState.players[bombLocalState.currentPlayerIndex];
    bombLocalState.statusMessage = `${currentPlayer.name} joue \u00ab ${bombLocalState.lastWord} \u00bb. Tour de ${nextPlayer.name}.`;
    renderBomb();
}

export function tickBombLocal() {
    if (!bombLocalState || bombLocalState.winner) return;
    const now = Date.now();
    if (now >= bombLocalState.turnDeadlineAt) {
        finishBombLocal(bombLocalState.currentPlayerIndex, 'timeout');
        return;
    }
    const elapsed = now - (bombLocalState.fuseStart || now);
    if (elapsed >= BOMB_LOCAL_MIN_BEFORE_RANDOM_MS) {
        if (Math.random() < BOMB_LOCAL_RANDOM_EXPLOSION_MS / 60000) {
            finishBombLocal(bombLocalState.currentPlayerIndex, 'explosion');
        }
    }
}

export function cloneBombState(state) {
    if (!state) {
        return null;
    }

    return {
        players: Array.isArray(state.players) ? state.players.map((player) => ({ ...player })) : [],
        currentPlayerIndex: Number(state.currentPlayerIndex ?? -1),
        currentSyllable: String(state.currentSyllable || ''),
        usedWords: Array.isArray(state.usedWords) ? state.usedWords.map((entry) => ({ ...entry })) : [],
        winner: state.winner || null,
        statusMessage: String(state.statusMessage || ''),
        turnCount: Number(state.turnCount || 0),
        round: Number(state.round || 0),
        turnDurationMs: Number(state.turnDurationMs || 0),
        turnDeadlineAt: Number(state.turnDeadlineAt || 0),
        lastWord: String(state.lastWord || ''),
        lastWordBy: state.lastWordBy || null
    };
}

export function isMultiplayerBombActive() {
    const room = getMultiplayerActiveRoom();
    return room?.gameId === 'bomb' && Boolean(room?.gameState);
}

export function stopBombTimerLoop() {
    if (bombTimerInterval) {
        window.clearInterval(bombTimerInterval);
        bombTimerInterval = null;
    }
}

export function startBombTimerLoop() {
    stopBombTimerLoop();
    bombTimerInterval = window.setInterval(() => {
        if (activeGameTabAccessor() === 'bomb') {
            if (isBombLocalActive()) {
                tickBombLocal();
            }
            renderBomb();
        }
    }, 200);
}

export function getBombCurrentPlayer() {
    return bombState?.players?.[bombState.currentPlayerIndex] || null;
}

export function getBombTimerSecondsLeft() {
    if (!bombState?.turnDeadlineAt) {
        return null;
    }

    return Math.max(0, Math.ceil((bombState.turnDeadlineAt - Date.now()) / 1000));
}

export function maybeOpenBombOutcomeModal() {
    if (!bombState?.winner) {
        bombLastFinishedStateKey = '';
        return;
    }
    if (isBombLocalActive()) {
        return;
    }

    const finishedKey = `${bombState.round}:${bombState.winner}`;
    if (finishedKey === bombLastFinishedStateKey) {
        return;
    }

    bombLastFinishedStateKey = finishedKey;
    const winner = bombState.players.find((player) => player.id === bombState.winner);
    const isVictory = Boolean(getMultiplayerActiveRoom()?.players?.find((player) => player.isYou)?.id === bombState.winner);
    openGameOverModal(isVictory ? 'Victoire' : 'Partie terminée', `${winner?.name || 'Un joueur'} remporte la manche de la Bombe.`);
}

export function renderBombPlayers() {
    const { bombPlayersBoard } = dom();
    if (!bombPlayersBoard) {
        return;
    }

    if (!bombState?.players?.length) {
        bombPlayersBoard.textContent = 'Les joueurs de la room apparaitront ici.';
        return;
    }

    const currentPlayer = getBombCurrentPlayer();
    const currentRoomPlayer = getMultiplayerActiveRoom()?.players?.find((player) => player.isYou) || null;
    bombPlayersBoard.innerHTML = bombState.players.map((player) => {
        const classes = ['bomb-player-chip'];
        if (currentPlayer?.id === player.id) {
            classes.push('is-active');
        }
        if (currentRoomPlayer?.id === player.id) {
            classes.push('is-you');
        }
        if (player.eliminated) {
            classes.push('is-eliminated');
        }

        return `
            <div class="${classes.join(' ')}">
                <div class="bomb-player-head">
                    <span class="bomb-player-name">${player.name}</span>
                    <span class="bomb-player-role">${currentRoomPlayer?.id === player.id ? 'Toi' : (currentPlayer?.id === player.id ? 'Actif' : 'En veille')}</span>
                </div>
                <div class="bomb-player-meta">
                    <span>Vies: ${Math.max(0, Number(player.lives || 0))}</span>
                    <span>${player.eliminated ? 'Explosé' : 'Encore à bord'}</span>
                </div>
            </div>
        `;
    }).join('');
}

export function renderBombUsedWords() {
    const { bombUsedWords } = dom();
    if (!bombUsedWords) {
        return;
    }

    if (!bombState?.usedWords?.length) {
        bombUsedWords.textContent = 'Aucun mot valide pour le moment.';
        return;
    }

    bombUsedWords.innerHTML = bombState.usedWords.slice(0, 16).map((entry) => {
        return `<span class="bomb-used-word-chip">${entry.value}</span>`;
    }).join('');
}

export function renderBomb() {
    const {
        bombGame,
        bombSyllableDisplay,
        bombSpotlightSyllable,
        bombTurnDisplay,
        bombTimerDisplay,
        bombSpotlightPlayer,
        bombStatusBanner,
        bombHelpText,
        bombWordInput,
        bombWordSubmitButton,
        bombRestartButton
    } = dom();
    if (!bombGame) {
        return;
    }

    const isOnline = isMultiplayerBombActive();
    const isLocal = isBombLocalActive();
    const currentPlayer = getBombCurrentPlayer();
    const you = getMultiplayerActiveRoom()?.players?.find((player) => player.isYou) || null;
    const isYourTurn = isLocal
        ? Boolean(currentPlayer && !bombState?.winner)
        : Boolean(currentPlayer?.id && currentPlayer.id === you?.id);
    const secondsLeft = getBombTimerSecondsLeft();
    const waitingForReady = isOnline && !getMultiplayerActiveRoom()?.gameLaunched;
    const winner = bombState?.players?.find((player) => player.id === bombState?.winner) || null;

    bombSyllableDisplay.textContent = bombState?.currentSyllable?.toUpperCase?.() || '-';
    bombSpotlightSyllable.textContent = bombState?.currentSyllable?.toUpperCase?.() || '-';
    bombTurnDisplay.textContent = currentPlayer?.name || '-';
    bombTimerDisplay.textContent = secondsLeft === null ? '--' : `${secondsLeft}s`;
    bombSpotlightPlayer.textContent = winner
        ? `${winner.name} garde son calme jusqu'au bout.`
        : (currentPlayer ? `${currentPlayer.name} doit répondre maintenant.` : "En attente d'équipage");
    bombStatusBanner.textContent = waitingForReady
        ? "Quand tout le monde est prêt, la bombe s'allume dans la room."
        : (bombState?.statusMessage || (isLocal ? 'Passe la bombe en envoyant un mot valide.' : 'Rejoins un salon pour lancer la bombe.'));
    bombHelpText.textContent = isLocal
        ? (winner
            ? `Manche terminée. ${winner.name} remporte le duel local.`
            : `Tour de ${currentPlayer?.name || 'Capitaine'}. Mot avec ${bombState?.currentSyllable?.toUpperCase?.() || '-'} puis Entrée.`)
        : (isOnline
            ? (isYourTurn
                ? `A toi de jouer. Entre un mot avec ${bombState?.currentSyllable?.toUpperCase?.() || '-'} avant l'explosion.`
                : `Observe la manche. ${currentPlayer?.name || 'Un joueur'} tient la bombe.`)
            : "Duel local ou multijoueur. Choisis ton mode depuis le menu pour lancer la bombe.");
    bombWordInput.disabled = !((isOnline && !waitingForReady && isYourTurn && !bombState?.winner) || (isLocal && !bombState?.winner));
    bombWordSubmitButton.disabled = bombWordInput.disabled;
    bombRestartButton.disabled = isOnline
        ? (waitingForReady || !Boolean(bombState?.winner))
        : !isLocal;

    renderBombPlayers();
    renderBombUsedWords();
    maybeOpenBombOutcomeModal();
    renderBombMenu();
}

export function getBombRulesText() {
    return getBombLocalRulesText();
}

export function renderBombMenu() {
    const {
        bombMenuOverlay,
        bombTable,
        bombMenuModeButtons,
        bombMenuEyebrow,
        bombMenuTitle,
        bombMenuText,
        bombMenuActionButton,
        bombMenuRulesButton
    } = dom();
    if (!bombMenuOverlay || !bombTable) return;
    syncGameMenuOverlayBounds(bombMenuOverlay, bombTable);
    bombMenuOverlay.classList.toggle('hidden', !bombMenuVisible);
    bombMenuOverlay.classList.toggle('is-closing', bombMenuClosing);
    bombMenuOverlay.classList.toggle('is-entering', bombMenuEntering);
    bombTable.classList.toggle('is-menu-open', bombMenuVisible);

    bombMenuModeButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.bombMode === bombSelectedMode);
    });

    if (!bombMenuVisible) return;

    const hasResult = Boolean(bombState?.winner);

    if (bombMenuEyebrow) {
        bombMenuEyebrow.textContent = bombMenuShowingRules
            ? 'R\u00e8gles'
            : (hasResult ? 'Fin de manche' : 'La Bombe du bord');
    }
    if (bombMenuTitle) {
        bombMenuTitle.textContent = bombMenuShowingRules
            ? 'Rappel rapide'
            : (hasResult ? 'Manche terminée' : 'Bombe');
    }
    if (bombMenuText) {
        if (bombMenuShowingRules) {
            bombMenuText.textContent = getBombRulesText();
        } else if (hasResult) {
            const winner = bombState.players.find((player) => player.id === bombState.winner);
            bombMenuText.textContent = winner
                ? `${winner.name} garde son calme et remporte le duel.`
                : 'La manche est terminée.';
        } else {
            bombMenuText.textContent = bombSelectedMode === 'local'
                ? 'Duel local : deux capitaines partagent le clavier. Passe la bombe avant qu\u2019elle n\u2019explose.'
                : 'Multijoueur en ligne : rejoins ou cr\u00e9e un salon dans le navire Jeux pour affronter d\u2019autres capitaines.';
        }
    }
    if (bombMenuActionButton) {
        const roomForMenu = getMultiplayerActiveRoom();
        const waitingForReady = isMultiplayerBombActive() && !roomForMenu?.gameLaunched;
        bombMenuActionButton.textContent = bombMenuShowingRules
            ? 'Retour'
            : (waitingForReady
                ? `${isCurrentPlayerMultiplayerReady() ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat'} (${getMultiplayerReadySummary()})`
                : (hasResult ? 'Rejouer un duel' : (bombSelectedMode === 'local' ? 'Allumer la mèche' : 'Aller au lobby')));
    }
    if (bombMenuRulesButton) {
        bombMenuRulesButton.textContent = 'R\u00e8gles';
        bombMenuRulesButton.hidden = bombMenuShowingRules;
    }
}

export function closeBombMenu() {
    bombMenuClosing = true;
    renderBombMenu();
    window.setTimeout(() => {
        bombMenuClosing = false;
        bombMenuVisible = false;
        bombMenuShowingRules = false;
        bombMenuEntering = false;
        renderBombMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealBombOutcomeMenu(title, text, eyebrow) {
    const { bombMenuEyebrow, bombMenuTitle, bombMenuText } = dom();
    bombMenuVisible = true;
    bombMenuShowingRules = false;
    bombMenuClosing = false;
    bombMenuEntering = true;
    renderBombMenu();
    if (bombMenuEyebrow && eyebrow) bombMenuEyebrow.textContent = eyebrow;
    if (bombMenuTitle && title) bombMenuTitle.textContent = title;
    if (bombMenuText && text) bombMenuText.textContent = text;
    window.setTimeout(() => {
        bombMenuEntering = false;
        renderBombMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function syncMultiplayerBombState() {
    const { bombWordInput } = dom();
    if (!isMultiplayerBombActive()) {
        if (activeGameTabAccessor() === 'bomb') {
            initializeBomb();
        }
        return;
    }

    // Ferme auto le menu « Mettre prêt » quand la bombe est vraiment armée.
    {
        const room = getMultiplayerActiveRoom();
        if (room?.gameLaunched && bombMenuVisible) {
            bombMenuVisible = false;
            renderBombMenu();
        }
    }

    bombState = cloneBombState(getMultiplayerActiveRoom().gameState);
    startBombTimerLoop();
    renderBomb();
    const currentPlayer = getBombCurrentPlayer();
    const you = getMultiplayerActiveRoom()?.players?.find((player) => player.isYou) || null;
    if (activeGameTabAccessor() === 'bomb' && currentPlayer?.id === you?.id && !bombState?.winner) {
        window.setTimeout(() => {
            bombWordInput?.focus();
            bombWordInput?.select?.();
        }, 40);
    }
}

export function initializeBomb() {
    const { bombWordInput } = dom();
    closeGameOverModal();
    bombMenuShowingRules = false;
    bombMenuClosing = false;
    bombMenuEntering = false;
    if (isMultiplayerBombActive()) {
        bombLocalState = null;
        const room = getMultiplayerActiveRoom();
        bombMenuVisible = !room?.gameLaunched;
        renderBombMenu();
        syncMultiplayerBombState();
        if (bombWordInput && getMultiplayerActiveRoom()?.gameLaunched) {
            const currentPlayer = getBombCurrentPlayer();
            const you = getMultiplayerActiveRoom()?.players?.find((player) => player.isYou) || null;
            if (currentPlayer?.id === you?.id) {
                window.setTimeout(() => bombWordInput.focus(), 60);
            }
        }
        return;
    }

    stopBombTimerLoop();
    bombLocalState = null;
    bombState = null;
    renderBomb();
}

export function resetBombMultiplayerTrackers() {
    bombLastFinishedStateKey = '';
    bombState = null;
    stopBombTimerLoop();
}

// State accessors for wiring in script.js.
export function getBombState() { return bombState; }
export function setBombState(v) { bombState = v; }
export function getBombLocalState() { return bombLocalState; }
export function setBombLocalState(v) { bombLocalState = v; }
export function getBombMenuVisible() { return bombMenuVisible; }
export function setBombMenuVisible(v) { bombMenuVisible = Boolean(v); }
export function getBombMenuShowingRules() { return bombMenuShowingRules; }
export function setBombMenuShowingRules(v) { bombMenuShowingRules = Boolean(v); }
export function getBombMenuClosing() { return bombMenuClosing; }
export function getBombSelectedMode() { return bombSelectedMode; }
export function setBombSelectedMode(v) { bombSelectedMode = v; }
