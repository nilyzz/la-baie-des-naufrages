// Navire Musique — clavier de piano synthétisé (Web Audio).
// Extracted verbatim from script.js during the ES-modules migration.
// DOM refs (pianoKeyboard, pianoHelpText) are resolved lazily on each call.

export const PIANO_NOTES = [
    { id: 'c4', key: 'a', keyLabel: 'A', note: 'C4', frequency: 261.63, type: 'white' },
    { id: 'cs4', note: 'C#4', frequency: 277.18, type: 'black', anchor: 0.7, keyLabel: 'W' },
    { id: 'd4', key: 's', keyLabel: 'S', note: 'D4', frequency: 293.66, type: 'white' },
    { id: 'ds4', note: 'D#4', frequency: 311.13, type: 'black', anchor: 1.7, keyLabel: 'E' },
    { id: 'e4', key: 'd', keyLabel: 'D', note: 'E4', frequency: 329.63, type: 'white' },
    { id: 'f4', key: 'f', keyLabel: 'F', note: 'F4', frequency: 349.23, type: 'white' },
    { id: 'fs4', note: 'F#4', frequency: 369.99, type: 'black', anchor: 3.7, keyLabel: 'T' },
    { id: 'g4', key: 'g', keyLabel: 'G', note: 'G4', frequency: 392, type: 'white' },
    { id: 'gs4', note: 'G#4', frequency: 415.3, type: 'black', anchor: 4.7, keyLabel: 'Y' },
    { id: 'a4', key: 'h', keyLabel: 'H', note: 'A4', frequency: 440, type: 'white' },
    { id: 'as4', note: 'A#4', frequency: 466.16, type: 'black', anchor: 5.7, keyLabel: 'U' },
    { id: 'b4', key: 'j', keyLabel: 'J', note: 'B4', frequency: 493.88, type: 'white' },
    { id: 'c5', key: 'k', keyLabel: 'K', note: 'C5', frequency: 523.25, type: 'white' },
    { id: 'cs5', note: 'C#5', frequency: 554.37, type: 'black', anchor: 7.7, keyLabel: 'Maj+W' },
    { id: 'd5', key: 'a', keyLabel: 'Maj+S', note: 'D5', frequency: 587.33, type: 'white', shiftKey: 's' },
    { id: 'ds5', note: 'D#5', frequency: 622.25, type: 'black', anchor: 8.7, keyLabel: 'Maj+E' },
    { id: 'e5', key: 'd', keyLabel: 'Maj+D', note: 'E5', frequency: 659.25, type: 'white', shiftKey: 'd' },
    { id: 'f5', key: 'f', keyLabel: 'Maj+F', note: 'F5', frequency: 698.46, type: 'white', shiftKey: 'f' },
    { id: 'fs5', note: 'F#5', frequency: 739.99, type: 'black', anchor: 10.7, keyLabel: 'Maj+T' },
    { id: 'g5', key: 'g', keyLabel: 'Maj+G', note: 'G5', frequency: 783.99, type: 'white', shiftKey: 'g' },
    { id: 'gs5', note: 'G#5', frequency: 830.61, type: 'black', anchor: 11.7, keyLabel: 'Maj+Y' },
    { id: 'a5', key: 'h', keyLabel: 'Maj+H', note: 'A5', frequency: 880, type: 'white', shiftKey: 'h' },
    { id: 'as5', note: 'A#5', frequency: 932.33, type: 'black', anchor: 12.7, keyLabel: 'Maj+U' },
    { id: 'b5', key: 'j', keyLabel: 'Maj+J', note: 'B5', frequency: 987.77, type: 'white', shiftKey: 'j' },
    { id: 'c6', key: 'k', keyLabel: 'Maj+K', note: 'C6', frequency: 1046.5, type: 'white', shiftKey: 'k' }
];

export const PIANO_NOTE_MAP = new Map(PIANO_NOTES.map((note) => [note.id, note]));

export const PIANO_KEYBOARD_LAYOUT = new Map([
    ['a', { base: 'c4' }],
    ['w', { base: 'cs4', shifted: 'cs5' }],
    ['s', { base: 'd4', shifted: 'd5' }],
    ['e', { base: 'ds4', shifted: 'ds5' }],
    ['d', { base: 'e4', shifted: 'e5' }],
    ['f', { base: 'f4', shifted: 'f5' }],
    ['t', { base: 'fs4', shifted: 'fs5' }],
    ['g', { base: 'g4', shifted: 'g5' }],
    ['y', { base: 'gs4', shifted: 'gs5' }],
    ['h', { base: 'a4', shifted: 'a5' }],
    ['u', { base: 'as4', shifted: 'as5' }],
    ['j', { base: 'b4', shifted: 'b5' }],
    ['k', { base: 'c5', shifted: 'c6' }]
]);

// --- module-level state (would be IIFE-local otherwise) ---
let pianoAudioContext = null;
let pianoMasterGain = null;
const pianoActiveNotes = new Map();
let pianoSustainActive = false;

function getPianoKeyboard() {
    return document.getElementById('pianoKeyboard');
}

function getPianoHelpText() {
    return document.getElementById('pianoHelpText');
}

export function ensurePianoAudio() {
    if (!pianoAudioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            const helpText = getPianoHelpText();
            if (helpText) {
                helpText.textContent = 'Le navigateur ne prend pas en charge le son du piano.';
            }
            return false;
        }
        pianoAudioContext = new AudioContextClass();
        pianoMasterGain = pianoAudioContext.createGain();
        pianoMasterGain.gain.value = 0.2;
        pianoMasterGain.connect(pianoAudioContext.destination);
    }

    if (pianoAudioContext.state === 'suspended') {
        pianoAudioContext.resume();
    }

    return true;
}

export function renderPiano() {
    const pianoKeyboard = getPianoKeyboard();
    if (!pianoKeyboard) {
        return;
    }

    const whiteKeys = PIANO_NOTES.filter((note) => note.type === 'white');
    const blackKeys = PIANO_NOTES.filter((note) => note.type === 'black');
    pianoKeyboard.style.setProperty('--white-key-count', String(whiteKeys.length));

    pianoKeyboard.innerHTML = `
        <div class="piano-white-keys">
            ${whiteKeys.map((note) => `
                <button
                    type="button"
                    class="piano-key piano-key-white${pianoActiveNotes.has(note.id) ? ' is-active' : ''}"
                    data-piano-key="${note.id}"
                    aria-label="${note.note} touche ${note.keyLabel}"
                >
                    <span class="piano-key-note">${note.note}</span>
                    <span class="piano-key-label">${note.keyLabel}</span>
                </button>
            `).join('')}
        </div>
        <div class="piano-black-keys">
            ${blackKeys.map((note) => `
                <button
                    type="button"
                    class="piano-key piano-key-black${pianoActiveNotes.has(note.id) ? ' is-active' : ''}"
                    data-piano-key="${note.id}"
                    style="left: calc(${note.anchor} * ((100% - (var(--white-key-gap) * (var(--white-key-count) - 1))) / var(--white-key-count)) + ${note.anchor} * var(--white-key-gap));"
                    aria-label="${note.note} touche ${note.keyLabel}"
                >
                    <span class="piano-key-note">${note.note}</span>
                    <span class="piano-key-label">${note.keyLabel}</span>
                </button>
            `).join('')}
        </div>
    `;
}

export function updatePianoHelpText(note = null) {
    const pianoHelpText = getPianoHelpText();
    if (!pianoHelpText) {
        return;
    }
    if (note) {
        pianoHelpText.textContent = `${note.note} en cours. ${pianoSustainActive ? 'Pédale active. ' : ''}Commande : ${note.keyLabel}.`;
        return;
    }
    if (pianoSustainActive) {
        pianoHelpText.textContent = 'Pédale active. Espace maintient les notes, relâche Espace pour couper celles qui ne sont plus tenues.';
        return;
    }
    pianoHelpText.textContent = "Utilise A à K. Maintiens Maj pour l'octave au-dessus, Espace pour la pédale, ou clique directement sur le clavier.";
}

function releasePianoAudioNote(noteId) {
    const activeNote = pianoActiveNotes.get(noteId);
    if (!activeNote || !pianoAudioContext) {
        return;
    }
    const now = pianoAudioContext.currentTime;
    activeNote.noteGain.gain.cancelScheduledValues(now);
    activeNote.noteGain.gain.setValueAtTime(Math.max(activeNote.noteGain.gain.value, 0.0001), now);
    activeNote.noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    activeNote.oscillator.stop(now + 0.14);
    activeNote.overtone.stop(now + 0.14);
    pianoActiveNotes.delete(noteId);
}

export function startPianoNote(noteId, source = 'keyboard') {
    const note = PIANO_NOTE_MAP.get(noteId);
    if (!note || !ensurePianoAudio()) {
        return;
    }

    const activeNote = pianoActiveNotes.get(noteId);
    if (activeNote) {
        activeNote.sources.add(source);
        activeNote.sustained = false;
        updatePianoHelpText(note);
        renderPiano();
        return;
    }

    const now = pianoAudioContext.currentTime;
    const oscillator = pianoAudioContext.createOscillator();
    const overtone = pianoAudioContext.createOscillator();
    const noteGain = pianoAudioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(note.frequency, now);
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(note.frequency * 2, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.14);

    oscillator.connect(noteGain);
    overtone.connect(noteGain);
    noteGain.connect(pianoMasterGain);

    oscillator.start(now);
    overtone.start(now);

    pianoActiveNotes.set(noteId, {
        oscillator,
        overtone,
        noteGain,
        sources: new Set([source]),
        sustained: false
    });
    updatePianoHelpText(note);
    renderPiano();
}

export function stopPianoNote(noteId, source = 'keyboard', force = false) {
    const activeNote = pianoActiveNotes.get(noteId);
    if (!activeNote) {
        return;
    }

    if (force) {
        releasePianoAudioNote(noteId);
        updatePianoHelpText();
        renderPiano();
        return;
    }

    activeNote.sources.delete(source);

    if (activeNote.sources.size) {
        renderPiano();
        return;
    }

    if (pianoSustainActive) {
        activeNote.sustained = true;
        updatePianoHelpText();
        renderPiano();
        return;
    }

    releasePianoAudioNote(noteId);
    updatePianoHelpText();
    renderPiano();
}

export function stopAllPianoNotes(force = true) {
    [...pianoActiveNotes.keys()].forEach((noteId) => stopPianoNote(noteId, 'all', force));
}

export function releaseSustainedPianoNotes() {
    [...pianoActiveNotes.entries()].forEach(([noteId, activeNote]) => {
        if (!activeNote.sources.size) {
            releasePianoAudioNote(noteId);
        }
    });
    updatePianoHelpText();
    renderPiano();
}

export function getPianoNoteIdFromKeyboardEvent(event) {
    const layout = PIANO_KEYBOARD_LAYOUT.get(event.key.toLowerCase());
    if (!layout) {
        return null;
    }
    return event.shiftKey && layout.shifted ? layout.shifted : layout.base;
}

export function setPianoSustainActive(active) {
    pianoSustainActive = Boolean(active);
}

export function isPianoSustainActive() {
    return pianoSustainActive;
}
