// Game module — Buno (uno), solo IA + multijoueur avec actions et couleurs.
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal, openGameOverModal } from '../core/modals.js';
import {
    getMultiplayerActiveRoom,
    getMultiplayerSocket,
    getMultiplayerReadySummary,
    isCurrentPlayerMultiplayerReady
} from '../multiplayer/state.js';
import { setMultiplayerStatus } from '../multiplayer/status.js';

const UNO_COLORS = ['red', 'yellow', 'green', 'blue'];

let unoMode = 'solo';
let unoState = null;
let unoAiTimeout = null;
let unoPendingColorContext = null;
let unoLastWinnerKey = '';
let unoEventBannerTimer = null;
let unoLastPlayedCardId = '';
let unoLastDrawnCardId = '';
let unoPreviousOpponentCounts = new Map();
let unoOpponentDrawFx = new Map();
let unoPendingOpponentDrawAnimations = new Map();
let unoColorChoiceTimer = null;
let unoColorChoicePending = false;
let unoPendingPlayAnimation = null;
let unoPendingDrawAnimation = false;
let unoDrawRequestPending = false;
let unoLastRenderedTopCardId = '';
let unoMenuVisible = true;
let unoMenuShowingRules = false;
let unoMenuClosing = false;
let unoMenuResult = null;

let activeGameTabAccessor = () => null;
export function setUnoActiveGameTabAccessor(fn) {
    if (typeof fn === 'function') activeGameTabAccessor = fn;
}

const $ = (id) => document.getElementById(id);
function dom() {
    const unoGame = $('unoGame');
    return {
        unoGame,
        unoModeButtons: document.querySelectorAll('[data-uno-mode]'),
        unoModeDisplay: $('unoModeDisplay'),
        unoHandCountDisplay: $('unoHandCountDisplay'),
        unoHelpText: $('unoHelpText'),
        unoOpponentsTop: $('unoOpponentsTop'),
        unoOpponentsLeft: $('unoOpponentsLeft'),
        unoOpponentsRight: $('unoOpponentsRight'),
        unoDrawButton: $('unoDrawButton'),
        unoDiscardPile: $('unoDiscardPile'),
        unoTurnDisplay: $('unoTurnDisplay'),
        unoColorPicker: $('unoColorPicker'),
        unoColorChoiceButtons: document.querySelectorAll('[data-uno-color]'),
        unoEventBanner: $('unoEventBanner'),
        unoHand: $('unoHand'),
        unoTable: unoGame?.querySelector('.uno-table') || null,
        unoMenuOverlay: $('unoMenuOverlay'),
        unoMenuEyebrow: $('unoMenuEyebrow'),
        unoMenuTitle: $('unoMenuTitle'),
        unoMenuText: $('unoMenuText'),
        unoMenuActionButton: $('unoMenuActionButton'),
        unoMenuRulesButton: $('unoMenuRulesButton')
    };
}

export function showUnoEvent(message) {
    const { unoEventBanner } = dom();
    if (!unoEventBanner) {
        return;
    }

    unoEventBanner.textContent = message;
    unoEventBanner.classList.remove('is-pop');
    void unoEventBanner.offsetWidth;
    unoEventBanner.classList.add('is-pop');

    if (unoEventBannerTimer) {
        window.clearTimeout(unoEventBannerTimer);
    }

    unoEventBannerTimer = window.setTimeout(() => {
        unoEventBanner?.classList.remove('is-pop');
        unoEventBannerTimer = null;
    }, 1200);
}

export function shuffleUnoDeck(cards) {
    const deck = [...cards];
    for (let index = deck.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [deck[index], deck[randomIndex]] = [deck[randomIndex], deck[index]];
    }
    return deck;
}

export function createUnoCard(color, value, type = 'number') {
    return {
        id: `${color}-${value}-${type}-${Math.random().toString(16).slice(2, 10)}`,
        color,
        value,
        type
    };
}

export function createUnoDeck() {
    const deck = [];

    UNO_COLORS.forEach((color) => {
        deck.push(createUnoCard(color, '0'));
        for (let value = 1; value <= 9; value += 1) {
            deck.push(createUnoCard(color, String(value)));
            deck.push(createUnoCard(color, String(value)));
        }
        ['skip', 'reverse', 'draw2'].forEach((action) => {
            deck.push(createUnoCard(color, action, action));
            deck.push(createUnoCard(color, action, action));
        });
    });

    for (let index = 0; index < 4; index += 1) {
        deck.push(createUnoCard('wild', 'wild', 'wild'));
        deck.push(createUnoCard('wild', 'wildDraw4', 'wildDraw4'));
    }

    return shuffleUnoDeck(deck);
}

export function cloneUnoState(state) {
    return {
        players: state.players.map((player) => ({
            ...player,
            hand: player.hand.map((card) => ({ ...card }))
        })),
        drawPile: state.drawPile.map((card) => ({ ...card })),
        discardPile: state.discardPile.map((card) => ({ ...card })),
        currentPlayerIndex: state.currentPlayerIndex,
        direction: state.direction,
        currentColor: state.currentColor,
        winner: state.winner,
        pendingColorChoice: state.pendingColorChoice ? { ...state.pendingColorChoice } : null,
        drawPenalty: Number(state.drawPenalty || 0),
        turnCount: Number(state.turnCount || 1),
        lastAction: state.lastAction || ''
    };
}

export function buildSoloUnoState() {
    const deck = createUnoDeck();
    const players = [
        { id: 'you', name: 'Toi', hand: [] },
        { id: 'ai-1', name: 'Baiely', hand: [] }
    ];

    for (let index = 0; index < 7; index += 1) {
        players.forEach((player) => {
            player.hand.push(deck.pop());
        });
    }

    let topCard = deck.pop();
    while (topCard.type === 'wildDraw4') {
        deck.unshift(topCard);
        topCard = deck.pop();
    }

    return {
        players,
        drawPile: deck,
        discardPile: [topCard],
        currentPlayerIndex: 0,
        direction: 1,
        currentColor: topCard.color === 'wild' ? 'red' : topCard.color,
        winner: null,
        pendingColorChoice: null,
        drawPenalty: 0,
        turnCount: 1,
        lastAction: 'La traversee commence.'
    };
}

export function getUnoTopCard(state = unoState) {
    return state?.discardPile?.[state.discardPile.length - 1] || null;
}

export function ensureUnoDrawPile(state) {
    if (state.drawPile.length) {
        return;
    }

    state.drawPile = createUnoDeck();
}

export function drawUnoCards(state, playerIndex, amount) {
    const cards = [];
    ensureUnoDrawPile(state);

    for (let index = 0; index < amount; index += 1) {
        ensureUnoDrawPile(state);
        const card = state.drawPile.pop();
        if (!card) {
            break;
        }
        state.players[playerIndex].hand.push(card);
        cards.push(card);
    }

    return cards;
}

export function isUnoCardPlayable(card, state = unoState) {
    if (!card || !state || state.winner || state.pendingColorChoice) {
        return false;
    }

    const topCard = getUnoTopCard(state);
    if (!topCard) {
        return true;
    }

    if (Number(state.drawPenalty || 0) > 0) {
        if (card.type === 'wildDraw4') {
            return true;
        }

        if (card.type === 'draw2') {
            return true;
        }

        return false;
    }

    if (card.color === 'wild') {
        return true;
    }

    const activeColor = ['wild', 'wildDraw4'].includes(topCard.type)
        ? state.currentColor
        : topCard.color;

    if (card.type === 'number') {
        if (topCard.type !== 'number') {
            return card.color === activeColor;
        }

        return card.color === activeColor || card.value === topCard.value;
    }

    if (card.type === 'draw2') {
        if (topCard.type === 'wildDraw4') {
            return card.color === state.currentColor;
        }

        return card.color === activeColor || topCard.type === 'draw2';
    }

    if (card.type === 'skip' || card.type === 'reverse') {
        return card.color === activeColor || card.type === topCard.type;
    }

    return card.color === activeColor;
}

export function hasUnoPenaltyResponse(player, state = unoState) {
    if (!player || Number(state?.drawPenalty || 0) <= 0) {
        return false;
    }

    return (player.hand || []).some((card) => (
        card?.type === 'draw2' || card?.type === 'wildDraw4'
    ));
}

export function maybeAutoResolveUnoPenalty() {
    if (!unoState || unoState.winner || unoState.pendingColorChoice || unoDrawRequestPending) {
        return false;
    }

    const currentPlayer = unoState.players?.[unoState.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.id !== 'you' || Number(unoState.drawPenalty || 0) <= 0) {
        return false;
    }

    if (hasUnoPenaltyResponse(currentPlayer, unoState)) {
        return false;
    }

    unoDrawRequestPending = true;
    window.setTimeout(() => {
        if (isMultiplayerUnoActive()) {
            getMultiplayerSocket()?.emit('uno:draw-card');
            return;
        }

        drawSoloUnoCard();
    }, 240);

    return true;
}

export function getNextUnoPlayerIndex(state, step = 1) {
    const total = state.players.length;
    const offset = (state.currentPlayerIndex + (state.direction * step)) % total;
    return offset < 0 ? offset + total : offset;
}

export function getUnoDisplayColor(color) {
    return {
        red: 'Rouge',
        yellow: 'Jaune',
        green: 'Vert',
        blue: 'Bleu',
        wild: 'Libre'
    }[color] || '-';
}

export function getUnoReadySummary() {
    const room = getMultiplayerActiveRoom();
    const readyCount = Number(room?.unoReadyCount || 0);
    const readyTotal = Number(room?.unoReadyTotal || room?.playerCount || 0);
    return `${readyCount}/${readyTotal || 0}`;
}

export function getUnoRulesText() {
    return "Pose une carte de même couleur ou de même valeur. Les +2 et +4 peuvent s'empiler. La carte Couleur change la teinte du tour. Si tu ne peux rien jouer, tu pioches.";
}

export function renderUnoMenu() {
    const { unoMenuOverlay, unoGame, unoTable, unoMenuEyebrow, unoMenuTitle, unoMenuText, unoMenuActionButton, unoMenuRulesButton } = dom();
    if (!unoMenuOverlay || !unoGame || !unoTable) {
        return;
    }

    syncGameMenuOverlayBounds(unoMenuOverlay, unoTable);
    const isOnline = isMultiplayerUnoActive();
    const room = getMultiplayerActiveRoom();
    const roomStarted = Boolean(room?.unoStarted);
    const currentPlayer = room?.players?.find((player) => player.isYou) || null;
    const readyLabel = currentPlayer?.unoReady ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat';
    const actionLabel = isOnline ? `${readyLabel} (${getUnoReadySummary()})` : 'Lancer la partie';
    const baseText = isOnline
        ? 'Quand tout le monde est pr\u00eat, la travers\u00e9e commence automatiquement.'
        : 'Lance une nouvelle manche quand tu es prêt.';

    // Si une manche vient de se terminer, le menu outcome force l'affichage
    // meme en multijoueur (room encore flaggee roomStarted cote serveur).
    if (unoMenuResult) {
        unoMenuVisible = true;
    } else {
        unoMenuVisible = isOnline ? !roomStarted : unoMenuVisible;
    }
    unoMenuOverlay.classList.toggle('hidden', !unoMenuVisible);
    unoMenuOverlay.classList.toggle('is-closing', unoMenuClosing);
    unoTable.classList.toggle('is-menu-open', unoMenuVisible);

    if (!unoMenuVisible) {
        return;
    }

    const showingOutcome = Boolean(unoMenuResult) && !unoMenuShowingRules;

    if (unoMenuEyebrow) {
        if (unoMenuShowingRules) {
            unoMenuEyebrow.textContent = 'R\u00e8gles';
        } else if (showingOutcome) {
            unoMenuEyebrow.textContent = unoMenuResult.eyebrow || (isOnline ? 'Salle multijoueur' : 'Baie des cartes');
        } else {
            unoMenuEyebrow.textContent = isOnline ? 'Salle multijoueur' : 'Baie des cartes';
        }
    }
    if (unoMenuTitle) {
        if (unoMenuShowingRules) {
            unoMenuTitle.textContent = 'Rappel rapide';
        } else if (showingOutcome) {
            unoMenuTitle.textContent = unoMenuResult.title || 'Manche termin\u00e9e';
        } else {
            unoMenuTitle.textContent = 'Buno';
        }
    }
    if (unoMenuText) {
        if (unoMenuShowingRules) {
            unoMenuText.textContent = getUnoRulesText();
        } else if (showingOutcome) {
            unoMenuText.textContent = unoMenuResult.text || baseText;
        } else {
            unoMenuText.textContent = baseText;
        }
    }
    if (unoMenuActionButton) {
        if (unoMenuShowingRules) {
            unoMenuActionButton.textContent = 'Retour';
        } else if (showingOutcome) {
            unoMenuActionButton.textContent = isOnline ? 'Revenir au salon' : 'Rejouer';
        } else {
            unoMenuActionButton.textContent = actionLabel;
        }
    }
    if (unoMenuRulesButton) {
        unoMenuRulesButton.textContent = 'R\u00e8gles';
        unoMenuRulesButton.hidden = unoMenuShowingRules;
    }
}

export function revealUnoOutcomeMenu(title, text, eyebrow) {
    unoMenuResult = { title, text, eyebrow };
    unoMenuVisible = true;
    unoMenuShowingRules = false;
    unoMenuClosing = false;
    renderUnoMenu();
}

export function startUnoLaunchSequence() {
    unoMenuClosing = true;
    unoMenuResult = null;
    unoLastWinnerKey = '';
    renderUnoMenu();
    window.setTimeout(() => {
        unoMenuClosing = false;
        unoMenuVisible = false;
        unoMenuShowingRules = false;
        renderUnoMenu();
        renderUno();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function getUnoCardSortWeight(card) {
    const colorOrder = {
        red: 0,
        yellow: 1,
        green: 2,
        blue: 3,
        wild: 4
    };
    const typeOrder = {
        number: 0,
        skip: 20,
        reverse: 21,
        draw2: 22,
        wild: 40,
        wildDraw4: 41
    };
    const baseColor = colorOrder[card.color] ?? 9;
    const baseType = typeOrder[card.type] ?? 99;
    const numericValue = card.type === 'number' ? Number(card.value) || 0 : 0;
    return (baseColor * 100) + baseType + numericValue;
}

export function applyUnoCardEffects(state, card, actorName) {
    if (card.type === 'reverse') {
        state.direction *= -1;
        if (state.players.length === 2) {
            state.currentPlayerIndex = getNextUnoPlayerIndex(state, 2);
        } else {
            state.currentPlayerIndex = getNextUnoPlayerIndex(state, 1);
        }
        state.lastAction = `${actorName} inverse le sens.`;
        return;
    }

    if (card.type === 'skip') {
        state.currentPlayerIndex = getNextUnoPlayerIndex(state, 2);
        state.lastAction = `${actorName} bloqu\u00e9 le tour.`;
        return;
    }

    if (card.type === 'draw2') {
        state.drawPenalty = Number(state.drawPenalty || 0) + 2;
        state.currentPlayerIndex = getNextUnoPlayerIndex(state, 1);
        state.lastAction = `${actorName} met +${state.drawPenalty}.`;
        return;
    }

    if (card.type === 'wildDraw4') {
        state.drawPenalty = Number(state.drawPenalty || 0) + 4;
        state.currentPlayerIndex = getNextUnoPlayerIndex(state, 1);
        state.lastAction = `${actorName} met +${state.drawPenalty}.`;
        return;
    }

    if (card.type === 'wild') {
        state.currentPlayerIndex = getNextUnoPlayerIndex(state, 1);
        state.lastAction = `${actorName} change la couleur.`;
        return;
    }

    state.currentPlayerIndex = getNextUnoPlayerIndex(state, 1);
    state.lastAction = `${actorName} joue ${card.value}.`;
}

export function finalizeUnoPlay(state, playerIndex, cardIndex, chosenColor = null) {
    const player = state.players[playerIndex];
    const [card] = player.hand.splice(cardIndex, 1);
    state.discardPile.push(card);
    state.currentColor = card.color === 'wild' ? (chosenColor || 'red') : card.color;
    state.turnCount += 1;
    unoLastPlayedCardId = card.id;
    unoLastDrawnCardId = '';

    if (!player.hand.length) {
        state.winner = player.id;
        state.lastAction = `${player.name} remporte la traversee.`;
        return card;
    }

    applyUnoCardEffects(state, card, player.name);
    return card;
}

export function renderUnoCard(card, options = {}) {
    if (!card) {
        return '<div class="uno-card-face is-empty"></div>';
    }

    const displayColor = options.displayColor || card.color;
    const label = card.type === 'skip'
        ? 'STOP'
        : (card.type === 'reverse'
            ? 'Reverse'
            : (card.type === 'draw2'
                ? '+2'
                : (card.type === 'wildDraw4' ? '+4' : (card.type === 'wild' ? 'Couleur' : card.value))));
    const visualLabel = card.type === 'skip'
        ? '\u2298'
        : (card.type === 'reverse'
            ? '\u27F2'
            : (card.type === 'wild' ? '' : label));
    const isWildFamily = card.type === 'wild' || card.type === 'wildDraw4';
    const wildIcon = `
        <span class="uno-card-wild-icon${card.type === 'wildDraw4' ? ' is-draw4' : ''}">
            <span class="uno-card-wild-dot is-red"></span>
            <span class="uno-card-wild-dot is-yellow"></span>
            <span class="uno-card-wild-dot is-green"></span>
            <span class="uno-card-wild-dot is-blue"></span>
        </span>
    `;

    return `
        <button
            type="button"
            class="uno-card-face is-${displayColor}${options.playable ? ' is-playable' : ''}${options.compact ? ' is-compact' : ''}${isWildFamily ? ' is-wild-card' : ''}${options.extraClass ? ` ${options.extraClass}` : ''}"
            ${options.buttonAttrs || ''}
        >
            <span class="uno-card-corner">${card.type === 'wildDraw4' ? '+4' : (isWildFamily ? '' : visualLabel)}</span>
            <span class="uno-card-center">${isWildFamily ? wildIcon : visualLabel}</span>
        </button>
    `;
}

export function renderUnoCardBack(compact = false) {
    return `
        <div class="uno-card-face is-back${compact ? ' is-back-compact' : ''}">
            <span class="card-back-emblem uno-card-back-mark"></span>
        </div>
    `;
}

export function animateUnoCardTravel(cardHtml, fromElement, toElement, extraClass = '') {
    const startRect = fromElement?.getBoundingClientRect?.();
    const endRect = toElement?.getBoundingClientRect?.();
    if (!startRect || !endRect) {
        return;
    }

    const ghost = document.createElement('div');
    ghost.className = `uno-card-travel${extraClass ? ` ${extraClass}` : ''}`;
    ghost.innerHTML = cardHtml;

    const startX = startRect.left + (startRect.width / 2) - 49;
    const startY = startRect.top + (startRect.height / 2) - 72;
    const endX = endRect.left + (endRect.width / 2) - 49;
    const endY = endRect.top + (endRect.height / 2) - 72;

    ghost.style.left = `${startX}px`;
    ghost.style.top = `${startY}px`;
    ghost.style.setProperty('--uno-travel-x', `${endX - startX}px`);
    ghost.style.setProperty('--uno-travel-y', `${endY - startY}px`);
    document.body.appendChild(ghost);

    window.requestAnimationFrame(() => {
        ghost.classList.add('is-active');
    });

    window.setTimeout(() => {
        ghost.remove();
    }, 540);
}

export function getUnoOpponentSourceElement(playerId, seats = {}) {
    const { unoOpponentsTop, unoOpponentsLeft, unoOpponentsRight } = dom();
    if (!playerId) {
        return null;
    }

    if (seats.topOpponent?.id === playerId) {
        return unoOpponentsTop?.querySelector('.uno-opponent-cards');
    }

    if (seats.leftOpponent?.id === playerId) {
        return unoOpponentsLeft?.querySelector('.uno-opponent-cards');
    }

    if (seats.rightOpponent?.id === playerId) {
        return unoOpponentsRight?.querySelector('.uno-opponent-cards');
    }

    return null;
}

export function playUnoPendingOpponentDrawAnimations(seats = {}) {
    const { unoDrawButton } = dom();
    if (!unoPendingOpponentDrawAnimations.size || !unoDrawButton) {
        return;
    }

    unoPendingOpponentDrawAnimations.forEach((drawCount, playerId) => {
        const destination = getUnoOpponentSourceElement(playerId, seats);
        if (!destination) {
            return;
        }

        const totalAnimations = Math.min(Number(drawCount) || 0, 4);
        for (let index = 0; index < totalAnimations; index += 1) {
            window.setTimeout(() => {
                animateUnoCardTravel(renderUnoCardBack(), unoDrawButton, destination, 'is-opponent-drawn');
            }, index * 90);
        }
    });

    unoPendingOpponentDrawAnimations = new Map();
}

export function getUnoDealTargetElement(playerId, kind = 'opponent') {
    const { unoHand } = dom();
    if (kind === 'self') {
        return unoHand;
    }

    const me = unoState?.players?.find((player) => player.id === 'you' || player.isYou) || unoState?.players?.[0];
    const opponents = (unoState?.players || []).filter((player) => player.id !== me?.id);
    const topOpponent = opponents.length === 1
        ? opponents[0]
        : (opponents.length >= 3 ? opponents[0] : null);
    const leftOpponent = opponents.length === 2
        ? opponents[0]
        : (opponents.length >= 3 ? opponents[1] : null);
    const rightOpponent = opponents.length === 2
        ? opponents[1]
        : (opponents.length >= 3 ? opponents[2] : null);

    return getUnoOpponentSourceElement(playerId, { topOpponent, leftOpponent, rightOpponent });
}

export function renderUnoOpponent(player, isActive = false, orientation = 'top') {
    const count = player.handCount ?? player.hand?.length ?? 0;
    const backCount = Math.min(count, orientation === 'top' ? 10 : 8);
    const drawFxCount = Math.min(unoOpponentDrawFx.get(player.id) || 0, backCount);
    return `
        <div class="uno-opponent uno-opponent-${orientation}${isActive ? ' is-active' : ''}${player.isYou ? ' is-you' : ''}">
            <div class="uno-opponent-head">
                <span class="uno-opponent-name">${player.name}</span>
                <strong class="uno-opponent-count">${count} cartes</strong>
            </div>
            <div class="uno-opponent-cards ${orientation === 'top' ? 'is-top' : 'is-side'}">
                ${Array.from({ length: backCount }, (_, index) => {
                    const extraClass = index >= (backCount - drawFxCount) ? ' is-opponent-drawn' : '';
                    return `<div class="uno-opponent-back-shell${extraClass}">${renderUnoCardBack(true)}</div>`;
                }).join('')}
            </div>
        </div>
    `;
}

export function maybeOpenUnoOutcomeModal() {
    if (!unoState?.winner) {
        unoLastWinnerKey = '';
        unoMenuResult = null;
        return;
    }

    const winnerKey = `${unoMode}:${unoState.turnCount}:${unoState.winner}`;
    if (winnerKey === unoLastWinnerKey) {
        return;
    }

    unoLastWinnerKey = winnerKey;
    const winner = unoState.players.find((player) => player.id === unoState.winner);
    const isVictory = winner?.id === 'you' || winner?.isYou;
    revealUnoOutcomeMenu(
        isVictory ? 'Victoire' : 'Partie termin\u00e9e',
        `${winner?.name || 'Un joueur'} remporte la manche de Buno.`,
        isVictory ? 'Manche gagn\u00e9e' : 'Manche perdue'
    );
}

export function updateUnoHud() {
    const { unoModeDisplay, unoHandCountDisplay, unoTurnDisplay, unoHelpText, unoModeButtons } = dom();
    if (!unoState) {
        return;
    }

    const me = unoState.players.find((player) => player.id === 'you' || player.isYou) || unoState.players[0];
    const currentPlayer = unoState.players[unoState.currentPlayerIndex];
    unoModeDisplay.textContent = isMultiplayerUnoActive() ? 'Online' : 'Solo IA';
    unoHandCountDisplay.textContent = String((unoMenuVisible && !unoMenuClosing) ? 0 : (me?.hand?.length || 0));
    unoTurnDisplay.textContent = currentPlayer ? `A ${currentPlayer.name} de jouer !` : '-';
    unoHelpText.textContent = unoState.winner
        ? `${unoState.players.find((player) => player.id === unoState.winner)?.name || 'Un joueur'} a gagné la manche.`
        : (isMultiplayerUnoActive()
            ? 'Pose une carte valide quand la main est à toi. Les autres mains restent cachées.'
            : 'Clique une carte jouable ou pioche si tu es bloqu\u00e9.');
    unoModeButtons.forEach((button) => {
        button.classList.toggle('is-active', (button.dataset.unoMode === 'online') === isMultiplayerUnoActive() && (!isMultiplayerUnoActive() || button.dataset.unoMode === 'online'));
        if (isMultiplayerUnoActive()) {
            button.disabled = true;
        } else {
            button.disabled = false;
            button.classList.toggle('is-active', button.dataset.unoMode === unoMode);
        }
    });
}

export function renderUno() {
    const { unoOpponentsTop, unoOpponentsLeft, unoOpponentsRight, unoDrawButton, unoDiscardPile, unoHand, unoColorPicker, unoEventBanner } = dom();
    if (!unoState) {
        renderUnoMenu();
        return;
    }

    if (maybeAutoResolveUnoPenalty()) {
        updateUnoHud();
        renderUnoMenu();
        return;
    }

    const me = unoState.players.find((player) => player.id === 'you' || player.isYou) || unoState.players[0];
    const currentPlayer = unoState.players[unoState.currentPlayerIndex];
    const topCard = getUnoTopCard();
    const myTurn = currentPlayer?.id === me?.id;
    const opponents = unoState.players.filter((player) => player.id !== me?.id);
    const topOpponent = opponents.length === 1
        ? opponents[0]
        : (opponents.length >= 3 ? opponents[0] : null);
    const leftOpponent = opponents.length === 2
        ? opponents[0]
        : (opponents.length >= 3 ? opponents[1] : null);
    const rightOpponent = opponents.length === 2
        ? opponents[1]
        : (opponents.length >= 3 ? opponents[2] : null);
    let opponentPlayedCard = null;
    const shouldMaskCardsForMenu = unoMenuVisible || unoMenuClosing;

    opponents.forEach((player) => {
        const count = player.handCount ?? player.hand?.length ?? 0;
        const previous = unoPreviousOpponentCounts.get(player.id);
        if (Number.isFinite(previous) && count > previous) {
            const drawCount = count - previous;
            unoOpponentDrawFx.set(player.id, drawCount);
            unoPendingOpponentDrawAnimations.set(player.id, drawCount);
        }
        if (Number.isFinite(previous) && count < previous && topCard?.id && topCard.id !== unoLastRenderedTopCardId) {
            opponentPlayedCard = player;
        }
        unoPreviousOpponentCounts.set(player.id, count);
    });

    if (unoOpponentsTop) {
        unoOpponentsTop.innerHTML = topOpponent
            ? renderUnoOpponent({
                ...topOpponent,
                handCount: topOpponent.handCount
            }, unoState.players[unoState.currentPlayerIndex]?.id === topOpponent.id, 'top')
            : '';
    }

    if (unoOpponentsLeft) {
        unoOpponentsLeft.innerHTML = leftOpponent
            ? renderUnoOpponent({
                ...leftOpponent,
                handCount: leftOpponent.handCount
            }, unoState.players[unoState.currentPlayerIndex]?.id === leftOpponent.id, 'left')
            : '';
        unoOpponentsLeft.classList.toggle('hidden', !leftOpponent);
    }

    if (unoOpponentsRight) {
        unoOpponentsRight.innerHTML = rightOpponent
            ? renderUnoOpponent({
                ...rightOpponent,
                handCount: rightOpponent.handCount
            }, unoState.players[unoState.currentPlayerIndex]?.id === rightOpponent.id, 'right')
            : '';
        unoOpponentsRight.classList.toggle('hidden', !rightOpponent);
    }

    unoDrawButton.innerHTML = `
        <span class="uno-draw-stack" aria-hidden="true"></span>
        <span class="uno-draw-label">PIOCHE</span>
    `;
    unoDiscardPile.innerHTML = shouldMaskCardsForMenu
        ? renderUnoCardBack()
        : renderUnoCard(topCard, {
            compact: false,
            displayColor: (topCard?.type === 'wild' || topCard?.type === 'wildDraw4') ? unoState.currentColor : topCard?.color
        });
    const sortedHand = (me?.hand || [])
        .map((card, index) => ({ card, originalIndex: index }))
        .sort((left, right) => getUnoCardSortWeight(left.card) - getUnoCardSortWeight(right.card));
    const visibleHand = sortedHand;
    unoHand.innerHTML = visibleHand.map(({ card, originalIndex }) => {
        if (shouldMaskCardsForMenu) {
            return renderUnoCardBack();
        }
        const playable = myTurn && isUnoCardPlayable(card);
        return renderUnoCard(card, {
            playable,
            extraClass: `${card.id === unoLastDrawnCardId ? 'is-drawn' : ''}${!playable ? ' is-unplayable' : ''}`.trim(),
            buttonAttrs: `data-uno-card-index="${originalIndex}"`
        });
    }).join('');

    if (!shouldMaskCardsForMenu && topCard?.id === unoLastPlayedCardId) {
        unoDiscardPile.querySelector('.uno-card-face')?.classList.add('is-played');
    }

    if (!shouldMaskCardsForMenu && !visibleHand.length && !me?.hand?.length) {
        unoHand.innerHTML = '<p class="uno-empty-hand">En attente de la fin de manche...</p>';
    }

    if (unoPendingPlayAnimation) {
        const discardCard = unoDiscardPile.querySelector('.uno-card-face');
        if (discardCard) {
            animateUnoCardTravel(unoPendingPlayAnimation, unoHand, unoDiscardPile);
        }
        unoPendingPlayAnimation = null;
    } else if (opponentPlayedCard && topCard) {
        const opponentSource = getUnoOpponentSourceElement(opponentPlayedCard.id, { topOpponent, leftOpponent, rightOpponent });
        if (opponentSource) {
            animateUnoCardTravel(renderUnoCard(topCard, {
                displayColor: (topCard.type === 'wild' || topCard.type === 'wildDraw4') ? unoState.currentColor : topCard.color
            }), opponentSource, unoDiscardPile);
        }
    }

    if (unoPendingDrawAnimation) {
        animateUnoCardTravel(renderUnoCardBack(), unoDrawButton, unoHand);
        unoPendingDrawAnimation = false;
    }

    if (!shouldMaskCardsForMenu) {
        playUnoPendingOpponentDrawAnimations({ topOpponent, leftOpponent, rightOpponent });
    }

    unoDrawButton.disabled = !myTurn || Boolean(unoState.pendingColorChoice) || Boolean(unoState.winner) || unoDrawRequestPending;
    unoColorPicker.classList.toggle('hidden', !(unoState.pendingColorChoice && unoState.pendingColorChoice.playerId === me?.id));
    unoColorPicker.classList.toggle('is-waiting', unoColorChoicePending);
    unoDrawButton.classList.toggle('is-pulse', myTurn && !unoState.winner);
    unoEventBanner.textContent = unoState.lastAction || '';
    if (unoOpponentDrawFx.size) {
        window.setTimeout(() => {
            unoOpponentDrawFx.clear();
            if (activeGameTabAccessor() === 'uno') {
                renderUno();
            }
        }, 420);
    }
    unoLastRenderedTopCardId = topCard?.id || '';
    updateUnoHud();
    renderUnoMenu();
    maybeOpenUnoOutcomeModal();
}

export function chooseUnoAiColor(hand) {
    const counts = new Map(UNO_COLORS.map((color) => [color, 0]));
    hand.forEach((card) => {
        if (counts.has(card.color)) {
            counts.set(card.color, counts.get(card.color) + 1);
        }
    });
    return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] || 'red';
}

export function runSoloUnoAiTurn() {
    if (!unoState || isMultiplayerUnoActive() || unoState.winner) {
        return;
    }

    const currentPlayer = unoState.players[unoState.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.id === 'you') {
        return;
    }

    const playableIndex = currentPlayer.hand.findIndex((card) => isUnoCardPlayable(card, unoState));

    if (playableIndex !== -1) {
        const chosenCard = currentPlayer.hand[playableIndex];
        const chosenColor = chosenCard.color === 'wild' ? chooseUnoAiColor(currentPlayer.hand) : null;
        finalizeUnoPlay(unoState, unoState.currentPlayerIndex, playableIndex, chosenColor);
        showUnoEvent(unoState.lastAction);
        renderUno();
    } else {
        const penalty = Math.max(1, Number(unoState.drawPenalty || 0));
        drawUnoCards(unoState, unoState.currentPlayerIndex, penalty);
        unoState.lastAction = `${currentPlayer.name} pioche ${penalty}.`;
        unoState.drawPenalty = 0;
        const drawnIndex = currentPlayer.hand.length - 1;
        if (penalty === 1 && isUnoCardPlayable(currentPlayer.hand[drawnIndex], unoState)) {
            const card = currentPlayer.hand[drawnIndex];
            finalizeUnoPlay(unoState, unoState.currentPlayerIndex, drawnIndex, card.color === 'wild' ? chooseUnoAiColor(currentPlayer.hand) : null);
        } else {
            unoState.currentPlayerIndex = getNextUnoPlayerIndex(unoState, 1);
        }
        showUnoEvent(unoState.lastAction);
        renderUno();
    }

    if (!unoState.winner && unoState.players[unoState.currentPlayerIndex]?.id !== 'you') {
        if (unoAiTimeout) {
            window.clearTimeout(unoAiTimeout);
        }
        unoAiTimeout = window.setTimeout(() => {
            unoAiTimeout = null;
            runSoloUnoAiTurn();
        }, 650);
    }
}

export function handleSoloUnoCardPlay(cardIndex) {
    const { unoColorPicker } = dom();
    if (!unoState || unoState.winner) {
        return;
    }

    const currentPlayer = unoState.players[unoState.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.id !== 'you') {
        return;
    }

    const card = currentPlayer.hand[cardIndex];
    if (!isUnoCardPlayable(card)) {
        return;
    }

    if (card.color === 'wild') {
        unoPendingColorContext = { cardIndex };
        unoColorPicker.classList.remove('hidden');
        unoState.pendingColorChoice = { playerId: 'you', cardId: card.id };
        renderUno();
        return;
    }

    unoPendingPlayAnimation = renderUnoCard(card, {
        displayColor: card.color,
        playable: false
    });
    finalizeUnoPlay(unoState, unoState.currentPlayerIndex, cardIndex);
    showUnoEvent(unoState.lastAction);
    renderUno();

    if (!unoState.winner && unoState.players[unoState.currentPlayerIndex]?.id !== 'you') {
        unoAiTimeout = window.setTimeout(() => {
            unoAiTimeout = null;
            runSoloUnoAiTurn();
        }, 650);
    }
}

export function drawSoloUnoCard() {
    if (!unoState || unoState.winner) {
        unoDrawRequestPending = false;
        return;
    }

    const currentPlayer = unoState.players[unoState.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.id !== 'you') {
        unoDrawRequestPending = false;
        return;
    }

    const amount = Math.max(1, Number(unoState.drawPenalty || 0));
    const drawn = drawUnoCards(unoState, unoState.currentPlayerIndex, amount);
    if (!drawn.length) {
        unoDrawRequestPending = false;
        return;
    }

    unoLastDrawnCardId = drawn[0].id;
    unoPendingDrawAnimation = true;
    unoState.lastAction = amount > 1 ? `Tu pioches ${amount}.` : 'Tu pioches 1.';
    showUnoEvent(unoState.lastAction);
    if (amount > 1 || !isUnoCardPlayable(drawn[0])) {
        unoState.currentPlayerIndex = getNextUnoPlayerIndex(unoState, 1);
    }
    unoState.drawPenalty = 0;
    renderUno();
    unoDrawRequestPending = false;

    if (!unoState.winner && unoState.players[unoState.currentPlayerIndex]?.id !== 'you') {
        unoAiTimeout = window.setTimeout(() => {
            unoAiTimeout = null;
            runSoloUnoAiTurn();
        }, 650);
    }
}

export function chooseSoloUnoColor(color) {
    const { unoColorPicker } = dom();
    if (!unoPendingColorContext || !unoState || unoColorChoicePending) {
        return;
    }

    unoColorChoicePending = true;
    unoColorPicker.classList.add('is-waiting');
    showUnoEvent(`Couleur ${getUnoDisplayColor(color).toLowerCase()} choisie...`);
    renderUno();

    if (unoColorChoiceTimer) {
        window.clearTimeout(unoColorChoiceTimer);
    }

    unoColorChoiceTimer = window.setTimeout(() => {
        unoColorChoiceTimer = null;
        unoColorChoicePending = false;
        unoState.pendingColorChoice = null;
        finalizeUnoPlay(unoState, unoState.currentPlayerIndex, unoPendingColorContext.cardIndex, color);
        unoPendingPlayAnimation = renderUnoCard(unoState.discardPile[unoState.discardPile.length - 1], {
            displayColor: unoState.currentColor,
            playable: false
        });
        unoPendingColorContext = null;
        showUnoEvent(unoState.lastAction);
        renderUno();

        if (!unoState.winner && unoState.players[unoState.currentPlayerIndex]?.id !== 'you') {
            unoAiTimeout = window.setTimeout(() => {
                unoAiTimeout = null;
                runSoloUnoAiTurn();
            }, 650);
        }
    }, 500);
}

export function setUnoMode(nextMode) {
    if (isMultiplayerUnoActive()) {
        setMultiplayerStatus('Le mode est piloté par le salon en ligne.');
        return;
    }

    unoMode = nextMode === 'online' ? 'online' : 'solo';
    initializeUno();
}

export function isMultiplayerUnoActive() {
    const room = getMultiplayerActiveRoom();
    return room?.gameId === 'uno' && Boolean(room?.gameState);
}

export function syncMultiplayerUnoState() {
    if (!isMultiplayerUnoActive()) {
        if (unoMode === 'online' && activeGameTabAccessor() === 'uno' && !getMultiplayerActiveRoom()) {
            initializeUno();
        }
        return;
    }

    const shouldResetUnoVisualTrackers = !unoState || unoMode !== 'online';
    unoMode = 'online';
    unoPendingColorContext = null;
    unoColorChoicePending = false;
    if (shouldResetUnoVisualTrackers) {
        unoPreviousOpponentCounts = new Map();
        unoOpponentDrawFx = new Map();
        unoPendingOpponentDrawAnimations = new Map();
        unoPendingPlayAnimation = null;
        unoPendingDrawAnimation = false;
        unoLastRenderedTopCardId = '';
    }
    unoDrawRequestPending = false;
    unoState = cloneUnoState(getMultiplayerActiveRoom().gameState);
    unoLastDrawnCardId = '';
    if (getMultiplayerActiveRoom()?.unoStarted && unoMenuVisible) {
        startUnoLaunchSequence();
        return;
    }
    renderUno();
}

export function initializeUno() {
    closeGameOverModal();
    if (unoAiTimeout) {
        window.clearTimeout(unoAiTimeout);
        unoAiTimeout = null;
    }
    if (unoColorChoiceTimer) {
        window.clearTimeout(unoColorChoiceTimer);
        unoColorChoiceTimer = null;
    }

    if (isMultiplayerUnoActive()) {
        unoMenuVisible = !Boolean(getMultiplayerActiveRoom()?.unoStarted);
        unoMenuShowingRules = false;
        syncMultiplayerUnoState();
        return;
    }

    unoMode = 'solo';
    unoMenuVisible = true;
    unoMenuShowingRules = false;
    unoPendingColorContext = null;
    unoLastWinnerKey = '';
    unoLastPlayedCardId = '';
    unoLastDrawnCardId = '';
    unoPreviousOpponentCounts = new Map();
    unoOpponentDrawFx = new Map();
    unoPendingOpponentDrawAnimations = new Map();
    unoColorChoicePending = false;
    unoPendingPlayAnimation = null;
    unoPendingDrawAnimation = false;
    unoDrawRequestPending = false;
    unoLastRenderedTopCardId = '';
    unoState = buildSoloUnoState();
    renderUno();
}

export function resetUnoMultiplayerTrackers() {
    unoLastWinnerKey = '';
    unoPreviousOpponentCounts = new Map();
    unoOpponentDrawFx = new Map();
    unoPendingOpponentDrawAnimations = new Map();
    unoPendingPlayAnimation = null;
    unoPendingDrawAnimation = false;
    unoLastRenderedTopCardId = '';
    unoLastPlayedCardId = '';
    unoLastDrawnCardId = '';
    unoDrawRequestPending = false;
    unoColorChoicePending = false;
    unoPendingColorContext = null;
}

// State accessors for wiring in script.js.
export function getUnoMode() { return unoMode; }
export function setUnoModeValue(v) { unoMode = v; }
export function getUnoState() { return unoState; }
export function setUnoState(v) { unoState = v; }
export function getUnoMenuVisible() { return unoMenuVisible; }
export function setUnoMenuVisible(v) { unoMenuVisible = Boolean(v); }
export function getUnoMenuShowingRules() { return unoMenuShowingRules; }
export function setUnoMenuShowingRules(v) { unoMenuShowingRules = Boolean(v); }
export function getUnoMenuClosing() { return unoMenuClosing; }
export function setUnoMenuClosing(v) { unoMenuClosing = Boolean(v); }
export function getUnoMenuResult() { return unoMenuResult; }
export function setUnoMenuResult(v) { unoMenuResult = v || null; }
export function getUnoDrawRequestPending() { return unoDrawRequestPending; }
export function setUnoDrawRequestPending(v) { unoDrawRequestPending = Boolean(v); }
export function getUnoPendingDrawAnimation() { return unoPendingDrawAnimation; }
export function setUnoPendingDrawAnimation(v) { unoPendingDrawAnimation = Boolean(v); }
export function getUnoPendingPlayAnimation() { return unoPendingPlayAnimation; }
export function setUnoPendingPlayAnimation(v) { unoPendingPlayAnimation = v; }
export function getUnoColorChoicePending() { return unoColorChoicePending; }
export function setUnoColorChoicePending(v) { unoColorChoicePending = Boolean(v); }
export function getUnoColorChoiceTimer() { return unoColorChoiceTimer; }
export function setUnoColorChoiceTimer(v) { unoColorChoiceTimer = v; }
export { UNO_COLORS };
