// Multiplayer lobby — DOM-centric, cleanly extractable pieces.
// Extracted from script.js during the ES-modules migration.
//
// Scope (5 functions):
//   - copyMultiplayerRoomCode
//   - leaveMultiplayerRoom
//   - renderMultiplayerPlayers
//   - renderMultiplayerChatMessages
//   - updateMultiplayerChatPanel
//
// DEFERRED to a future step (need a shared multiplayer state module or heavy
// dependency injection — would violate the "do not modify logic" rule today):
//   createMultiplayerRoom, joinMultiplayerRoom, toggleMultiplayerReady,
//   launchMultiplayerGame, updateMultiplayerLobby, syncMultiplayerEntryModeAccess.
//
// These pure versions take the active room / socket / activeGameTab as
// explicit arguments, so they can be called from either script.js (once
// unplugged) or later module code.

import { MULTIPLAYER_SUPPORTED_GAMES } from '../core/constants.js';
import { setMultiplayerStatus, getMultiplayerGameLabel } from './status.js';

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
