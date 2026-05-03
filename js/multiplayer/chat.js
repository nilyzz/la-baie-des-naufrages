// Multiplayer chat sender for La Baie des Naufragés.
// Extracted from script.js during the ES-modules migration.

import { MULTIPLAYER_SUPPORTED_GAMES } from '../core/constants.js';
import { getMultiplayerActiveRoom } from './state.js';
import { setMultiplayerStatus } from './status.js';

const CHAT_COOLDOWN_MS = 3000;

export function bindMultiplayerChat({ getActiveGameTab, ensureMultiplayerConnection, multiplayerChatInput }) {
    let lastSentAt = 0;

    return async function sendMultiplayerChatMessage() {
        const message = multiplayerChatInput?.value.trim() || '';
        if (!message) return;

        const room = getMultiplayerActiveRoom();
        const tab = getActiveGameTab();
        if (!Boolean(room?.code && room?.gameLaunched && MULTIPLAYER_SUPPORTED_GAMES[tab] && room.gameId === tab)) {
            setMultiplayerStatus('Le chat sera disponible une fois la partie lancée.');
            return;
        }

        const now = Date.now();
        const remaining = CHAT_COOLDOWN_MS - (now - lastSentAt);
        if (remaining > 0) {
            setMultiplayerStatus(`Attends ${Math.ceil(remaining / 1000)}s avant le prochain message.`);
            return;
        }

        lastSentAt = now;

        try {
            const socket = await ensureMultiplayerConnection();
            socket.emit('room:chat:send', { message });
            multiplayerChatInput.value = '';
            multiplayerChatInput.focus();
        } catch (error) {
            setMultiplayerStatus(`${error.message} Verifie que le serveur multijoueur est en ligne puis recharge la page.`);
        }
    };
}
