const path = require('path');
const http = require('http');
const cors = require('cors');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MAX_ROOM_PLAYERS = 4;
const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CORS_ORIGIN = parseCorsOrigin(process.env.CORS_ORIGIN);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

const rooms = new Map();

function parseCorsOrigin(value) {
  const origins = String(value || '*')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (!origins.length || origins.includes('*')) {
    return '*';
  }

  return origins;
}

app.use(express.json());
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST']
}));
app.use(express.static(path.join(__dirname)));

function generateRoomCode() {
  let code = '';

  for (let index = 0; index < ROOM_CODE_LENGTH; index += 1) {
    const alphabetIndex = Math.floor(Math.random() * ROOM_CODE_ALPHABET.length);
    code += ROOM_CODE_ALPHABET[alphabetIndex];
  }

  return code;
}

function createUniqueRoomCode() {
  let attempts = 0;

  while (attempts < 1000) {
    const code = generateRoomCode();
    if (!rooms.has(code)) {
      return code;
    }
    attempts += 1;
  }

  throw new Error('Impossible de generer un code de room unique.');
}

function sanitizePlayerName(name, fallback = 'Pirate') {
  const nextName = String(name || '').trim().slice(0, 24);
  return nextName || fallback;
}

function buildRoomPayload(room, socketId = null) {
  return {
    code: room.code,
    gameId: room.gameId,
    hostId: room.hostId,
    playerCount: room.players.length,
    players: room.players.map((player) => ({
      id: player.id,
      name: player.name,
      isHost: player.id === room.hostId,
      isYou: player.id === socketId
    }))
  };
}

function getRoom(code) {
  return rooms.get(String(code || '').trim().toUpperCase()) || null;
}

function removePlayerFromRoom(room, socketId) {
  room.players = room.players.filter((player) => player.id !== socketId);

  if (!room.players.length) {
    rooms.delete(room.code);
    return;
  }

  if (room.hostId === socketId) {
    room.hostId = room.players[0].id;
  }

  io.to(room.code).emit('room:updated', buildRoomPayload(room));
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, rooms: rooms.size });
});

app.post('/api/rooms', (request, response) => {
  try {
    const roomCode = createUniqueRoomCode();
    const room = {
      code: roomCode,
      gameId: String(request.body?.gameId || 'lobby').trim() || 'lobby',
      hostId: null,
      players: []
    };

    rooms.set(roomCode, room);
    response.status(201).json({ code: roomCode, gameId: room.gameId });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get('/api/rooms/:code', (request, response) => {
  const room = getRoom(request.params.code);

  if (!room) {
    response.status(404).json({ error: 'Room introuvable.' });
    return;
  }

  response.json(buildRoomPayload(room));
});

io.on('connection', (socket) => {
  socket.on('room:create', ({ code, playerName }) => {
    const room = getRoom(code);

    if (!room) {
      socket.emit('room:error', { message: 'Cette room n existe pas.' });
      return;
    }

    if (room.players.length >= MAX_ROOM_PLAYERS) {
      socket.emit('room:error', { message: 'Cette room est deja pleine.' });
      return;
    }

    if (room.players.some((player) => player.id === socket.id)) {
      socket.emit('room:joined', buildRoomPayload(room, socket.id));
      return;
    }

    const player = {
      id: socket.id,
      name: sanitizePlayerName(playerName, room.players.length ? `Pirate ${room.players.length + 1}` : 'Capitaine')
    };

    room.players.push(player);
    if (!room.hostId) {
      room.hostId = player.id;
    }

    socket.join(room.code);
    socket.data.roomCode = room.code;
    io.to(room.code).emit('room:updated', buildRoomPayload(room));
    socket.emit('room:joined', buildRoomPayload(room, socket.id));
  });

  socket.on('room:join', ({ code, playerName }) => {
    const room = getRoom(code);

    if (!room) {
      socket.emit('room:error', { message: 'Code de room invalide.' });
      return;
    }

    if (room.players.length >= MAX_ROOM_PLAYERS) {
      socket.emit('room:error', { message: 'La room est complete.' });
      return;
    }

    if (room.players.some((player) => player.id === socket.id)) {
      socket.emit('room:joined', buildRoomPayload(room, socket.id));
      return;
    }

    const player = {
      id: socket.id,
      name: sanitizePlayerName(playerName, `Pirate ${room.players.length + 1}`)
    };

    room.players.push(player);
    socket.join(room.code);
    socket.data.roomCode = room.code;

    io.to(room.code).emit('room:updated', buildRoomPayload(room));
    socket.emit('room:joined', buildRoomPayload(room, socket.id));
  });

  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) {
      return;
    }

    const room = getRoom(roomCode);
    if (!room) {
      return;
    }

    removePlayerFromRoom(room, socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`La Baie des Naufrages multiplayer server listening on port ${PORT}`);
  console.log(`CORS origin: ${Array.isArray(CORS_ORIGIN) ? CORS_ORIGIN.join(', ') : CORS_ORIGIN}`);
});
