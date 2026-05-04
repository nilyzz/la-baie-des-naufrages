// Multiplayer session orchestrator for La Baie des Naufragés.
// Extracted from script.js during the ES-modules migration.
//
// Scope: ensureMultiplayerConnection + room action functions
// (createMultiplayerRoom, joinMultiplayerRoom, leaveMultiplayerRoom,
//  copyMultiplayerRoomCode, toggleMultiplayerReady, launchMultiplayerGame).
//
// Uses multiplayer/state.js for all shared state (socket, activeRoom, etc.)
// instead of IIFE-local variables. The syncMultiplayerStateBridge() call from
// script.js is no longer needed here.

import { MULTIPLAYER_SUPPORTED_GAMES } from '../core/constants.js';
import {
    loadSocketIoClient, getMultiplayerServerOrigin, getMultiplayerApiUrl
} from './connection.js';
import {
    setMultiplayerStatus, getMultiplayerGameLabel,
    getPreferredMultiplayerPlayerName, getSelectedMultiplayerGame, syncMultiplayerPlayerNames
} from './status.js';
import {
    getMultiplayerSocket, setMultiplayerSocket,
    getMultiplayerActiveRoom, setMultiplayerActiveRoom,
    setMultiplayerSelectedGameId, setMultiplayerEntryMode,
    getMultiplayerBusy, setMultiplayerBusy,
    isCurrentMultiplayerHost, isCurrentPlayerMultiplayerReady
} from './state.js';
import {
    syncMultiplayerEntryModeAccess, updateMultiplayerLobby, updateMultiplayerChatPanel,
    leaveMultiplayerRoom as lobbyLeaveMultiplayerRoom,
    copyMultiplayerRoomCode as lobbyCopyMultiplayerRoomCode
} from './lobby.js';
import {
    syncMultiplayerAirHockeyState, resetAirHockeyMultiplayerTrackers, initializeAirHockey
} from '../games/airHockey.js';
import { syncMultiplayerBattleshipState, initializeBattleship } from '../games/battleship.js';
import { syncMultiplayerPongState, initializePong } from '../games/pong.js';
import {
    syncMultiplayerTicTacToeState, resetTicTacToeLastFinishedStateKey
} from '../games/ticTacToe.js';
import { syncMultiplayerConnect4State } from '../games/connect4.js';
import { syncMultiplayerChessState } from '../games/chess.js';
import { syncMultiplayerCheckersState } from '../games/checkers.js';
import {
    syncMultiplayerUnoState, initializeUno,
    setUnoMenuVisible, setUnoMenuShowingRules, setUnoMenuClosing
} from '../games/uno.js';
import {
    syncMultiplayerBombState, initializeBomb, setBombState, stopBombTimerLoop
} from '../games/bomb.js';
import { closeGameOverModal } from '../core/modals.js';

function getMultiplayerRoomUiSignature(room) {
    if (!room) return 'no-room';
    const playersSignature = Array.isArray(room.players)
        ? room.players.map((p) => `${p.id}:${p.name}:${p.isHost ? 'h' : '-'}:${p.isYou ? 'y' : '-'}:${p.roomReady ? 'r' : '-'}`).join('|')
        : '';
    return [
        room.code || '',
        room.gameId || '',
        room.hostId || '',
        Number(room.playerCount || 0),
        Number(room.maxPlayers || 0),
        Number(room.readyCount || 0),
        Boolean(room.gameLaunched),
        playersSignature
    ].join('::');
}

function syncAllPerGameState() {
    syncMultiplayerAirHockeyState();
    syncMultiplayerBattleshipState();
    syncMultiplayerPongState();
    syncMultiplayerTicTacToeState();
    syncMultiplayerConnect4State();
    syncMultiplayerChessState();
    syncMultiplayerCheckersState();
    syncMultiplayerUnoState();
    syncMultiplayerBombState();
}

export function bindMultiplayerSession(options = {}) {
    const { getActiveGameTab, openSelectedGame } = options;

    function getLobbyOptions(preserveStatus = false) {
        return {
            preserveStatus,
            onLeave: () => boundLeaveMultiplayerRoom(),
            activeGameTab: getActiveGameTab?.()
        };
    }

    function refreshLobby(preserveStatus = false) {
        updateMultiplayerLobby(getLobbyOptions(preserveStatus));
    }

    function refreshChatPanel() {
        updateMultiplayerChatPanel({
            activeRoom: getMultiplayerActiveRoom(),
            socket: getMultiplayerSocket(),
            activeGameTab: getActiveGameTab?.()
        });
    }

    async function boundEnsureMultiplayerConnection() {
        const socket = getMultiplayerSocket();
        if (socket?.connected) {
            return socket;
        }

        const ioFactory = await loadSocketIoClient();
        let currentSocket = getMultiplayerSocket();

        if (!currentSocket) {
            currentSocket = ioFactory(getMultiplayerServerOrigin(), {
                transports: ['websocket', 'polling']
            });
            setMultiplayerSocket(currentSocket);

            currentSocket.on('connect', () => {
                setMultiplayerStatus('Connexion multijoueur etablie.');
            });

            currentSocket.on('room:joined', (room) => {
                setMultiplayerActiveRoom(room);
                if (MULTIPLAYER_SUPPORTED_GAMES[room.gameId]) {
                    setMultiplayerSelectedGameId(room.gameId);
                }
                setMultiplayerEntryMode(isCurrentMultiplayerHost() ? 'create' : 'join');
                syncAllPerGameState();
                syncMultiplayerEntryModeAccess();
                refreshLobby();
                refreshChatPanel();
            });

            currentSocket.on('room:updated', (room) => {
                const previousUiSignature = getMultiplayerRoomUiSignature(getMultiplayerActiveRoom());
                setMultiplayerActiveRoom(room);
                if (MULTIPLAYER_SUPPORTED_GAMES[room.gameId]) {
                    setMultiplayerSelectedGameId(room.gameId);
                }
                setMultiplayerEntryMode(isCurrentMultiplayerHost() ? 'create' : 'join');
                syncAllPerGameState();
                const nextUiSignature = getMultiplayerRoomUiSignature(room);
                if (previousUiSignature !== nextUiSignature) {
                    syncMultiplayerEntryModeAccess();
                    refreshLobby();
                }
                refreshChatPanel();
            });

            currentSocket.on('room:error', ({ message }) => {
                setMultiplayerStatus(message || 'Une erreur room est survenue.');
            });

            currentSocket.on('room:left', () => {
                setMultiplayerActiveRoom(null);
                setMultiplayerEntryMode('create');
                resetAirHockeyMultiplayerTrackers();
                resetTicTacToeLastFinishedStateKey();
                setBombState(null);
                stopBombTimerLoop();

                const joinInput = document.getElementById('multiplayerJoinRoomCodeInput');
                if (joinInput) joinInput.value = '';

                closeGameOverModal();

                const activeTab = getActiveGameTab?.();
                if (activeTab === 'battleship') initializeBattleship();
                if (activeTab === 'airHockey') initializeAirHockey();
                if (activeTab === 'pong') initializePong();
                if (activeTab === 'uno') initializeUno();
                if (activeTab === 'bomb') initializeBomb();

                syncMultiplayerEntryModeAccess();
                refreshLobby();
                refreshChatPanel();
            });

            currentSocket.on('room:game:start', ({ gameId }) => {
                setMultiplayerStatus(`${getMultiplayerGameLabel(gameId)} se lance pour toute la room.`);
                if (gameId === 'uno') {
                    setUnoMenuVisible(true);
                    setUnoMenuShowingRules(false);
                    setUnoMenuClosing(false);
                }
                openSelectedGame?.(gameId);
                refreshChatPanel();
            });

            currentSocket.on('disconnect', () => {
                setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
            });
        }

        if (currentSocket.connected) {
            return currentSocket;
        }

        await new Promise((resolve, reject) => {
            // 35 s pour absorber le réveil du serveur Render (free tier ~30 s de cold start)
            const timer = setTimeout(() => {
                currentSocket.off('connect', onConnect);
                currentSocket.off('connect_error', onError);
                reject(new Error('Serveur multijoueur inaccessible.'));
            }, 35000);

            function onConnect() {
                clearTimeout(timer);
                currentSocket.off('connect_error', onError);
                resolve();
            }
            function onError() {
                setMultiplayerStatus('Serveur en cours de démarrage, patientez (~30 s)…');
            }

            currentSocket.once('connect', onConnect);
            currentSocket.on('connect_error', onError);
        });

        return currentSocket;
    }

    async function boundCreateMultiplayerRoom() {
        const selectedGame = getSelectedMultiplayerGame();

        if (getMultiplayerActiveRoom()?.code) {
            await boundLaunchMultiplayerGame();
            return;
        }

        if (!selectedGame || getMultiplayerBusy()) {
            refreshLobby();
            return;
        }

        setMultiplayerBusy(true);
        refreshLobby();
        setMultiplayerStatus(`Création d'une room pour ${MULTIPLAYER_SUPPORTED_GAMES[selectedGame]}...`);

        try {
            const response = await fetch(getMultiplayerApiUrl('/api/rooms'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameId: selectedGame })
            });

            if (!response.ok) {
                throw new Error('Impossible de creer la room.');
            }

            const room = await response.json();
            syncMultiplayerPlayerNames('create');
            const socket = await boundEnsureMultiplayerConnection();
            socket.emit('room:create', {
                code: room.code,
                playerName: getPreferredMultiplayerPlayerName('create')
            });
        } catch (error) {
            setMultiplayerStatus(`${error.message} Réessaie dans quelques instants.`);
        } finally {
            setMultiplayerBusy(false);
            refreshLobby(true);
        }
    }

    async function boundJoinMultiplayerRoom() {
        if (getMultiplayerActiveRoom()?.code) {
            await boundLeaveMultiplayerRoom();
            return;
        }

        const joinInput = document.getElementById('multiplayerJoinRoomCodeInput');
        const roomCode = joinInput?.value.trim().toUpperCase() || '';

        if (!roomCode || getMultiplayerBusy()) {
            setMultiplayerStatus('Entre un code de room valide pour rejoindre une partie.');
            return;
        }

        setMultiplayerBusy(true);
        refreshLobby();
        setMultiplayerStatus(`Connexion à la room ${roomCode}...`);

        try {
            syncMultiplayerPlayerNames('join');
            const socket = await boundEnsureMultiplayerConnection();
            socket.emit('room:join', {
                code: roomCode,
                playerName: getPreferredMultiplayerPlayerName('join')
            });
        } catch (error) {
            setMultiplayerStatus(`${error.message} Réessaie dans quelques instants.`);
        } finally {
            setMultiplayerBusy(false);
            refreshLobby(true);
        }
    }

    async function boundLeaveMultiplayerRoom() {
        const activeRoom = getMultiplayerActiveRoom();
        if (!activeRoom?.code) {
            return lobbyLeaveMultiplayerRoom(getMultiplayerSocket(), activeRoom);
        }
        const socket = getMultiplayerSocket()?.connected
            ? getMultiplayerSocket()
            : await boundEnsureMultiplayerConnection();
        return lobbyLeaveMultiplayerRoom(socket, activeRoom);
    }

    async function boundCopyMultiplayerRoomCode() {
        return lobbyCopyMultiplayerRoomCode(getMultiplayerActiveRoom());
    }

    async function boundToggleMultiplayerReady() {
        if (!getMultiplayerActiveRoom()?.code) {
            setMultiplayerStatus('Aucune room active a preparer.');
            return;
        }
        try {
            const socket = await boundEnsureMultiplayerConnection();
            const activeRoom = getMultiplayerActiveRoom();
            socket.emit('room:toggle-ready');
            setMultiplayerStatus(`${isCurrentPlayerMultiplayerReady() ? 'Retrait du statut prêt' : 'Préparation'} pour ${getMultiplayerGameLabel(activeRoom?.gameId)}...`);
        } catch (error) {
            setMultiplayerStatus(`${error.message} Réessaie dans quelques instants.`);
        }
    }

    async function boundLaunchMultiplayerGame() {
        if (!getMultiplayerActiveRoom()?.code) {
            return;
        }
        try {
            const socket = await boundEnsureMultiplayerConnection();
            socket.emit('room:launch-game');
            setMultiplayerStatus(`Lancement de ${getMultiplayerGameLabel(getMultiplayerActiveRoom()?.gameId)}...`);
        } catch (error) {
            setMultiplayerStatus(`${error.message} Réessaie dans quelques instants.`);
        }
    }

    return {
        ensureMultiplayerConnection: boundEnsureMultiplayerConnection,
        createMultiplayerRoom: boundCreateMultiplayerRoom,
        joinMultiplayerRoom: boundJoinMultiplayerRoom,
        leaveMultiplayerRoom: boundLeaveMultiplayerRoom,
        copyMultiplayerRoomCode: boundCopyMultiplayerRoomCode,
        toggleMultiplayerReady: boundToggleMultiplayerReady,
        launchMultiplayerGame: boundLaunchMultiplayerGame
    };
}

export function bindSetSelectedMultiplayerGame({ ensureMultiplayerConnection, updateMultiplayerLobby }) {
    return async function setSelectedMultiplayerGame(gameId) {
        if (!MULTIPLAYER_SUPPORTED_GAMES[gameId]) return;

        if (getMultiplayerActiveRoom()?.code) {
            if (!isCurrentMultiplayerHost()) {
                setMultiplayerStatus("Seul l'hôte peut changer le jeu du salon.");
                return;
            }

            if (getMultiplayerActiveRoom().gameId === gameId) {
                setMultiplayerSelectedGameId(gameId);
                updateMultiplayerLobby();
                return;
            }

            try {
                const socket = await ensureMultiplayerConnection();
                setMultiplayerSelectedGameId(gameId);
                socket.emit('room:update-game', { gameId });
                setMultiplayerStatus(`Jeu du salon change pour ${getMultiplayerGameLabel(gameId)}...`);
            } catch (error) {
                setMultiplayerStatus(`${error.message} Réessaie dans quelques instants.`);
            }
            return;
        }

        setMultiplayerSelectedGameId(gameId);
        updateMultiplayerLobby();
    };
}
