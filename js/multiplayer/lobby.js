// Multiplayer lobby — DOM-centric, cleanly extractable pieces.
// Extracted from script.js during the ES-modules migration.
//
// Scope (11 functions at this step):
//   Chat + basic lobby:
//     copyMultiplayerRoomCode, leaveMultiplayerRoom,
//     renderMultiplayerPlayers, renderMultiplayerChatMessages,
//     updateMultiplayerChatPanel
//   Lobby UI orchestrators (unlocked by multiplayer/state.js):
//     setMultiplayerEntryMode, ensureMultiplayerCreateLeaveButton,
//     updateMultiplayerGameTileSelection, getSelectedMultiplayerGameLabel,
//     syncMultiplayerEntryModeAccess, updateMultiplayerLobby
//
// Still DEFERRED (need the per-game `syncMultiplayer<Game>State` + initialize
// functions that still live in script.js): ensureMultiplayerConnection,
// createMultiplayerRoom, joinMultiplayerRoom, toggleMultiplayerReady,
// launchMultiplayerGame. They will move after the game modules are extracted.

import { MULTIPLAYER_SUPPORTED_GAMES } from '../core/constants.js';
import {
    setMultiplayerStatus,
    getMultiplayerGameLabel,
    getSelectedMultiplayerGame
} from './status.js';
import {
    getMultiplayerActiveRoom,
    getMultiplayerEntryMode,
    setMultiplayerEntryMode as setStateEntryMode,
    getMultiplayerBusy,
    isCurrentMultiplayerHost,
    getCurrentMultiplayerPlayer,
    getMultiplayerSocket
} from './state.js';

/**
 * Copies the active room code to the clipboard and reports the outcome
 * through the lobby status banner.
 */
export async function copyMultiplayerRoomCode(activeRoom) {
    if (!activeRoom?.code) {
        setMultiplayerStatus('Aucune room active a copier pour le moment.');
        return;
    }

    try {
        await navigator.clipboard.writeText(activeRoom.code);
        setMultiplayerStatus(`Code ${activeRoom.code} copie dans le presse-papiers.`);
    } catch (_error) {
        setMultiplayerStatus(`Code actif: ${activeRoom.code}`);
    }
}

/**
 * Asks the server to leave the current room. The caller is responsible for
 * obtaining a connected socket (the script.js version still routes through
 * `ensureMultiplayerConnection` — not extracted yet).
 */
export async function leaveMultiplayerRoom(socket, activeRoom) {
    if (!activeRoom?.code) {
        return;
    }

    try {
        socket?.emit?.('room:leave');
    } catch (error) {
        setMultiplayerStatus(`${error.message} Verifie que le serveur multijoueur est en ligne puis recharge la page.`);
    }
}

/**
 * Renders the player pills ("Alice (hôte)", "Bob (toi)", ...) in the lobby.
 */
export function renderMultiplayerPlayers(activeRoom) {
    const target = document.getElementById('multiplayerRoomPlayers');
    if (!target) {
        return;
    }

    if (!activeRoom?.players?.length) {
        target.textContent = "Personne n'a embarqué pour l'instant.";
        return;
    }

    target.textContent = '';
    const fragment = document.createDocumentFragment();

    activeRoom.players.forEach((player) => {
        const pill = document.createElement('span');
        pill.className = 'multiplayer-lobby-player-pill';

        if (player.isYou) {
            pill.classList.add('is-you');
        }
        if (player.isHost) {
            pill.classList.add('is-host');
        }

        const suffix = [player.isHost ? 'hôte' : '', player.isYou ? 'toi' : ''].filter(Boolean).join(' - ');
        pill.textContent = `${player.name}${suffix ? ` (${suffix})` : ''}`;
        fragment.appendChild(pill);
    });

    target.appendChild(fragment);
}

function formatMultiplayerChatTime(timestamp) {
    if (!timestamp) {
        return '';
    }

    return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(timestamp));
}

/**
 * Renders the chat message list. Returns the signature of the current
 * message id sequence (empty when the chat is in "empty" state) so the
 * caller can cache it and avoid unnecessary re-renders.
 */
export function renderMultiplayerChatMessages(activeRoom) {
    const target = document.getElementById('multiplayerChatMessages');
    if (!target) {
        return '';
    }

    const messages = Array.isArray(activeRoom?.chatMessages) ? activeRoom.chatMessages : [];
    target.textContent = '';

    if (!messages.length) {
        const emptyState = document.createElement('p');
        emptyState.className = 'multiplayer-chat-empty';
        emptyState.textContent = 'La partie est lanc\u00e9e. \u00c9cris le premier message \u00e0 ton \u00e9quipage.';
        target.appendChild(emptyState);
        return '';
    }

    const fragment = document.createDocumentFragment();
    messages.forEach((message) => {
        const item = document.createElement('article');
        item.className = 'multiplayer-chat-message';
        if (message.isYou) {
            item.classList.add('is-you');
        }

        const meta = document.createElement('div');
        meta.className = 'multiplayer-chat-message-meta';

        const author = document.createElement('strong');
        author.className = 'multiplayer-chat-message-author';
        author.textContent = message.playerName || 'Equipage';

        const time = document.createElement('span');
        time.textContent = formatMultiplayerChatTime(message.createdAt);

        const text = document.createElement('p');
        text.className = 'multiplayer-chat-message-text';
        text.textContent = message.text || '';

        meta.append(author, time);
        item.append(meta, text);
        fragment.appendChild(item);
    });

    target.appendChild(fragment);
    target.scrollTop = target.scrollHeight;
    return messages.map((message) => message.id).join('|');
}

/**
 * Tells whether the chat panel should be visible right now — the room must
 * exist, the game must be launched and match the game tab the user is on.
 */
function isMultiplayerChatVisible(activeRoom, activeGameTab) {
    return Boolean(
        activeRoom?.code
        && activeRoom?.gameLaunched
        && MULTIPLAYER_SUPPORTED_GAMES[activeGameTab]
        && activeRoom.gameId === activeGameTab
    );
}

/**
 * Toggles the chat panel (visibility + subtitle + input enabled state) and
 * routes to `renderMultiplayerChatMessages` when visible, or to an empty
 * state when hidden.
 *
 * Returns the signature of the messages currently rendered (empty string
 * when hidden / no messages) so that the caller can cache it across calls.
 */
export function updateMultiplayerChatPanel({ activeRoom, socket, activeGameTab } = {}) {
    const chatCard = document.getElementById('multiplayerChatCard');
    const chatInput = document.getElementById('multiplayerChatInput');
    const chatSendButton = document.getElementById('multiplayerChatSendButton');
    const chatSubtitle = document.getElementById('multiplayerChatSubtitle');
    const chatMessages = document.getElementById('multiplayerChatMessages');

    if (!chatCard || !chatInput || !chatSendButton) {
        return '';
    }

    const chatVisible = isMultiplayerChatVisible(activeRoom, activeGameTab);
    chatCard.classList.toggle('hidden', !chatVisible);
    chatCard.classList.toggle('is-visible', chatVisible);

    const canSend = Boolean(chatVisible && socket?.connected);
    chatInput.disabled = !canSend;
    chatSendButton.disabled = !canSend;

    if (chatSubtitle) {
        chatSubtitle.textContent = chatVisible
            ? `Salon ${activeRoom.code} sur ${getMultiplayerGameLabel(activeRoom.gameId)}.`
            : "Le chat apparaît quand l'hôte lance la partie en ligne.";
    }

    if (!chatVisible) {
        if (chatMessages) {
            chatMessages.textContent = '';
            const emptyState = document.createElement('p');
            emptyState.className = 'multiplayer-chat-empty';
            emptyState.textContent = activeRoom?.code
                ? 'Le salon attend encore le lancement de la partie.'
                : 'Rejoins un salon multijoueur pour ouvrir le chat de bord.';
            chatMessages.appendChild(emptyState);
        }
        chatInput.value = '';
        return '';
    }

    return renderMultiplayerChatMessages(activeRoom);
}

/**
 * Switches the lobby entry between "create" and "join" panels, toggles
 * the corresponding mode buttons and updates the shared state.
 */
export function setMultiplayerEntryMode(mode) {
    const normalized = mode === 'join' ? 'join' : 'create';
    setStateEntryMode(normalized);

    const createBtn = document.getElementById('multiplayerCreateModeButton');
    const joinBtn = document.getElementById('multiplayerJoinModeButton');
    const createPanel = document.getElementById('multiplayerCreatePanel');
    const joinPanel = document.getElementById('multiplayerJoinPanel');

    createBtn?.classList.toggle('is-active', normalized === 'create');
    joinBtn?.classList.toggle('is-active', normalized === 'join');
    createPanel?.classList.toggle('is-active', normalized === 'create');
    joinPanel?.classList.toggle('is-active', normalized === 'join');
}

/**
 * Ensures the "Quitter le salon" button exists next to the copy button,
 * creating it lazily on first call. Safe to call repeatedly.
 *
 * @param {() => (void|Promise<void>)} onLeave  handler to call on click
 */
export function ensureMultiplayerCreateLeaveButton(onLeave) {
    const existing = document.getElementById('multiplayerCreateLeaveButton');
    if (existing) {
        return existing;
    }

    const copyButton = document.getElementById('multiplayerCopyCodeButton');
    if (!copyButton?.parentElement) {
        return null;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'multiplayerCreateLeaveButton';
    button.className = 'secondary-button multiplayer-button-danger';
    button.textContent = 'Quitter le salon';
    button.hidden = true;
    if (typeof onLeave === 'function') {
        button.addEventListener('click', () => { onLeave(); });
    }
    copyButton.parentElement.appendChild(button);
    return button;
}

/**
 * Visually flags the multiplayer-game tile that matches the current
 * selection (or active room gameId if any).
 */
export function updateMultiplayerGameTileSelection() {
    const tiles = document.querySelectorAll('[data-multiplayer-game-select]');
    const selected = getSelectedMultiplayerGame();
    tiles.forEach((tile) => {
        tile.classList.toggle('is-selected', tile.dataset.multiplayerGameSelect === selected);
    });
}

/**
 * Human-readable label of the currently selected multiplayer game.
 * Returns "Aucun" when no supported game is selected.
 */
export function getSelectedMultiplayerGameLabel() {
    const gameId = getSelectedMultiplayerGame();
    return gameId ? MULTIPLAYER_SUPPORTED_GAMES[gameId] : 'Aucun';
}

/**
 * Grants/denies access to the create and join tabs depending on whether
 * the current user is host / guest / not in a room.
 * Also toggles the "Quitter le salon" button visibility.
 */
export function syncMultiplayerEntryModeAccess() {
    const activeRoom = getMultiplayerActiveRoom();
    const currentPlayer = getCurrentMultiplayerPlayer();
    const hasActiveRoom = Boolean(activeRoom?.code && currentPlayer);
    const isHost = isCurrentMultiplayerHost();
    const isGuest = hasActiveRoom && !isHost;

    const createBtn = document.getElementById('multiplayerCreateModeButton');
    const joinBtn = document.getElementById('multiplayerJoinModeButton');
    if (createBtn) {
        createBtn.disabled = isGuest;
    }
    if (joinBtn) {
        joinBtn.disabled = isHost;
    }

    if (hasActiveRoom) {
        setStateEntryMode(isHost ? 'create' : 'join');
    }

    const leaveButton = document.getElementById('multiplayerCreateLeaveButton');
    if (leaveButton) {
        leaveButton.hidden = !isHost;
    }
}

/**
 * Full lobby UI refresh: buttons enablement, room code display, game tile
 * highlight, player list, chat panel, and status banner.
 *
 * @param {Object} options
 * @param {boolean} [options.preserveStatus=false]  skip rewriting the status
 *                                                  banner when the caller has
 *                                                  already set something more
 *                                                  specific.
 * @param {() => (void|Promise<void>)} [options.onLeave]  click handler the
 *                                                  first-time creation of the
 *                                                  "Quitter" button wires up.
 * @param {string} [options.activeGameTab]  active tab so the chat panel can
 *                                          compare with the room gameId.
 */
export function updateMultiplayerLobby({ preserveStatus = false, onLeave, activeGameTab } = {}) {
    const activeRoom = getMultiplayerActiveRoom();
    const socket = getMultiplayerSocket();
    const busy = getMultiplayerBusy();

    ensureMultiplayerCreateLeaveButton(onLeave);
    syncMultiplayerEntryModeAccess();

    const leaveButton = document.getElementById('multiplayerCreateLeaveButton');
    if (leaveButton) {
        leaveButton.disabled = busy;
    }

    const selectedGame = getSelectedMultiplayerGame();
    const selectedLabel = getSelectedMultiplayerGameLabel();
    const canUseMultiplayer = Boolean(selectedGame);
    const activeRoomGameLabel = activeRoom?.gameId && MULTIPLAYER_SUPPORTED_GAMES[activeRoom.gameId]
        ? MULTIPLAYER_SUPPORTED_GAMES[activeRoom.gameId]
        : selectedLabel;
    const hasActiveRoom = Boolean(activeRoom?.code);
    const isHost = isCurrentMultiplayerHost();

    const currentRoomCode = document.getElementById('multiplayerCurrentRoomCode');
    const lobbyPlayersBlock = document.getElementById('multiplayerLobbyPlayersBlock');
    const createPlayerField = document.getElementById('multiplayerCreatePlayerField');
    const joinPlayerField = document.getElementById('multiplayerJoinPlayerField');
    const joinCodeField = document.getElementById('multiplayerJoinCodeField');
    const createRoomButton = document.getElementById('multiplayerCreateRoomButton');
    const joinRoomButton = document.getElementById('multiplayerJoinRoomButton');
    const copyCodeButton = document.getElementById('multiplayerCopyCodeButton');

    if (currentRoomCode) {
        currentRoomCode.textContent = activeRoom?.code || '-';
    }
    lobbyPlayersBlock?.classList.toggle('hidden', !hasActiveRoom);
    createPlayerField?.classList.toggle('hidden', hasActiveRoom);
    joinPlayerField?.classList.toggle('hidden', hasActiveRoom);
    joinCodeField?.classList.toggle('hidden', hasActiveRoom);

    if (createRoomButton) {
        createRoomButton.disabled = busy
            || (!hasActiveRoom && !canUseMultiplayer)
            || (hasActiveRoom && (!isHost || (activeRoom?.playerCount || 0) < 2 || Boolean(activeRoom?.gameLaunched)));
        createRoomButton.textContent = hasActiveRoom ? 'Lancer le jeu' : 'Creer le salon';
    }
    if (joinRoomButton) {
        joinRoomButton.disabled = busy;
        joinRoomButton.textContent = hasActiveRoom ? 'Quitter le salon' : 'Rejoindre avec le code';
        joinRoomButton.classList.toggle('multiplayer-button-success', !hasActiveRoom);
        joinRoomButton.classList.toggle('multiplayer-button-danger', hasActiveRoom);
    }
    if (copyCodeButton) {
        copyCodeButton.disabled = !hasActiveRoom;
    }

    updateMultiplayerGameTileSelection();
    renderMultiplayerPlayers(activeRoom);
    updateMultiplayerChatPanel({ activeRoom, socket, activeGameTab });

    if (preserveStatus) {
        return;
    }

    if (hasActiveRoom) {
        if ((activeRoom.playerCount || 0) < 2) {
            setMultiplayerStatus(`Salon ${activeRoom.code} cree. Attends un autre joueur avant de lancer ${activeRoomGameLabel}.`);
            return;
        }

        if (!activeRoom.gameLaunched) {
            setMultiplayerStatus(isHost
                ? `Salon ${activeRoom.code} prêt. Tu peux lancer ${activeRoomGameLabel} quand tout le monde est là.`
                : `Salon ${activeRoom.code} prêt. Attends que l'hôte lance ${activeRoomGameLabel}.`);
            return;
        }

        setMultiplayerStatus(`${activeRoomGameLabel} est en cours dans le salon ${activeRoom.code}.`);
        return;
    }

    if (!canUseMultiplayer) {
        setMultiplayerStatus('Le multijoueur est pr\u00e9vu pour Bataille, Sea Hockey, Pong, Morpion, Coin 4, \u00c9checs, Dames, Buno et La Bombe.');
        return;
    }

    setMultiplayerStatus('Cree un salon prive ou rejoins-en un avec un code.');
}
