// Game module - Magic Sort (Atelier des marees).

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';
import { shuffleArray } from '../core/utils.js';

export const MAGIC_SORT_COLORS = {
    pink: '#f472b6',
    gold: '#facc15',
    mint: '#34d399',
    sky: '#38bdf8',
    coral: '#fb7185',
    violet: '#a78bfa',
    pearl: '#f8fafc',
    ink: '#64748b'
};
export const MAGIC_SORT_TUBE_CAPACITY = 4;
export const MAGIC_SORT_FILLED_TUBES = 6;
export const MAGIC_SORT_EMPTY_TUBES = 2;
export const MAGIC_SORT_LEVELS = [
    { colors: 4, empty: 2, scramble: 24, par: 18 },
    { colors: 5, empty: 2, scramble: 34, par: 25 },
    { colors: 6, empty: 2, scramble: 44, par: 34 },
    { colors: 7, empty: 2, scramble: 56, par: 45 },
    { colors: 8, empty: 2, scramble: 68, par: 58 }
];

let magicSortTubes = [];
let magicSortSelectedTube = null;
let magicSortMoves = 0;
let magicSortLevel = 0;
let magicSortUndoStack = [];
let magicSortPourEffect = null;
let magicSortShakeTube = null;
let magicSortMenuVisible = true;
let magicSortMenuShowingRules = false;
let magicSortMenuClosing = false;
let magicSortMenuEntering = false;
let magicSortMenuResult = null;

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        magicSortBoard: $('magicSortBoard'),
        magicSortTable: $('magicSortTable'),
        magicSortSolvedDisplay: $('magicSortSolvedDisplay'),
        magicSortMovesDisplay: $('magicSortMovesDisplay'),
        magicSortLevelDisplay: $('magicSortLevelDisplay'),
        magicSortUndoButton: $('magicSortUndoButton'),
        magicSortHelpText: $('magicSortHelpText'),
        magicSortRestartButton: $('magicSortRestartButton'),
        magicSortMenuOverlay: $('magicSortMenuOverlay'),
        magicSortMenuEyebrow: $('magicSortMenuEyebrow'),
        magicSortMenuTitle: $('magicSortMenuTitle'),
        magicSortMenuText: $('magicSortMenuText'),
        magicSortMenuActionButton: $('magicSortMenuActionButton'),
        magicSortMenuRulesButton: $('magicSortMenuRulesButton')
    };
}

export function getMagicSortValidMoves(tubes) {
    const moves = [];
    tubes.forEach((fromTube, fromIndex) => {
        if (!fromTube.length) return;
        const movingColor = fromTube[fromTube.length - 1];
        let contiguousCount = 0;
        for (let cursor = fromTube.length - 1; cursor >= 0; cursor -= 1) {
            if (fromTube[cursor] !== movingColor) break;
            contiguousCount += 1;
        }
        tubes.forEach((toTube, toIndex) => {
            if (fromIndex === toIndex || toTube.length >= MAGIC_SORT_TUBE_CAPACITY) return;
            const topTarget = toTube[toTube.length - 1];
            if (topTarget && topTarget !== movingColor) return;
            const amount = Math.min(contiguousCount, MAGIC_SORT_TUBE_CAPACITY - toTube.length);
            if (amount) moves.push({ fromIndex, toIndex, amount });
        });
    });
    return moves;
}

export function applyMagicSortMove(tubes, move) {
    const fromTube = tubes[move.fromIndex];
    const toTube = tubes[move.toIndex];
    for (let step = 0; step < move.amount; step += 1) {
        toTube.push(fromTube.pop());
    }
}

function getMagicSortTopInfo(tube) {
    if (!tube.length) return null;
    const color = tube[tube.length - 1];
    let count = 1;
    for (let cursor = tube.length - 2; cursor >= 0; cursor -= 1) {
        if (tube[cursor] !== color) break;
        count += 1;
    }
    return { color, count };
}

function getMagicSortTopColor(tube) {
    return tube[tube.length - 1] || null;
}

function getMagicSortTubeState(tube) {
    if (!tube.length) return 'empty';
    return tube.length === MAGIC_SORT_TUBE_CAPACITY && tube.every((color) => color === tube[0]) ? 'complete' : 'mixed';
}

function getMagicSortMixedTubeCount(tubes) {
    return tubes.filter((tube) => tube.length > 1 && !tube.every((color) => color === tube[0])).length;
}

export function generateMagicSortLevel(levelIndex = magicSortLevel) {
    const config = MAGIC_SORT_LEVELS[Math.min(levelIndex, MAGIC_SORT_LEVELS.length - 1)];
    const colorKeys = shuffleArray(Object.keys(MAGIC_SORT_COLORS)).slice(0, config.colors);

    for (let attempt = 0; attempt < 32; attempt += 1) {
        const tubes = colorKeys.map((color) => Array(MAGIC_SORT_TUBE_CAPACITY).fill(color));
        tubes.push(...Array.from({ length: config.empty }, () => []));
        const reverseMoves = config.scramble + Math.floor(Math.random() * 14);

        for (let moveIndex = 0; moveIndex < reverseMoves; moveIndex += 1) {
            const sourceOptions = tubes
                .map((tube, index) => ({ tube, index, top: getMagicSortTopInfo(tube) }))
                .filter(({ top }) => Boolean(top));
            if (!sourceOptions.length) break;

            const source = sourceOptions[Math.floor(Math.random() * sourceOptions.length)];
            const destinationOptions = tubes
                .map((tube, index) => ({ tube, index }))
                .filter(({ tube, index }) => index !== source.index && tube.length < MAGIC_SORT_TUBE_CAPACITY);
            if (!destinationOptions.length) continue;

            const destination = destinationOptions[Math.floor(Math.random() * destinationOptions.length)];
            const movableCount = Math.min(source.top.count, MAGIC_SORT_TUBE_CAPACITY - destination.tube.length);
            const amount = 1 + Math.floor(Math.random() * movableCount);
            for (let step = 0; step < amount; step += 1) {
                destination.tube.push(tubes[source.index].pop());
            }
        }

        if (getMagicSortMixedTubeCount(tubes) >= Math.min(4, config.colors - 1)) {
            return tubes.map((tube) => [...tube]);
        }
    }

    const fallbackColors = colorKeys.slice(0, 4);
    return [
        [fallbackColors[0], fallbackColors[1], fallbackColors[2], fallbackColors[3]],
        [fallbackColors[2], fallbackColors[3], fallbackColors[1], fallbackColors[0]],
        [fallbackColors[1], fallbackColors[0], fallbackColors[3], fallbackColors[2]],
        [fallbackColors[3], fallbackColors[2], fallbackColors[0], fallbackColors[1]],
        [],
        []
    ];
}

export function updateMagicSortHud() {
    const { magicSortSolvedDisplay, magicSortMovesDisplay, magicSortLevelDisplay, magicSortUndoButton } = dom();
    const solvedTubes = magicSortTubes.filter((tube) => (
        tube.length === MAGIC_SORT_TUBE_CAPACITY && tube.every((color) => color === tube[0])
    )).length;
    const targetTubes = new Set(magicSortTubes.flat().filter(Boolean)).size;
    const config = MAGIC_SORT_LEVELS[Math.min(magicSortLevel, MAGIC_SORT_LEVELS.length - 1)];

    if (magicSortSolvedDisplay) magicSortSolvedDisplay.textContent = `${solvedTubes} / ${targetTubes}`;
    if (magicSortMovesDisplay) magicSortMovesDisplay.textContent = `${magicSortMoves} / ${config.par}`;
    if (magicSortLevelDisplay) magicSortLevelDisplay.textContent = `Niveau ${magicSortLevel + 1}`;
    if (magicSortUndoButton) magicSortUndoButton.disabled = !magicSortUndoStack.length || magicSortMenuVisible;
}

export function renderMagicSort() {
    const { magicSortBoard } = dom();
    updateMagicSortHud();
    if (!magicSortBoard) return;
    const selectedColor = magicSortSelectedTube !== null ? getMagicSortTopColor(magicSortTubes[magicSortSelectedTube]) : null;
    const columns = Math.min(5, Math.max(4, Math.ceil(magicSortTubes.length / 2)));
    magicSortBoard.style.setProperty('--magicsort-columns', String(columns));
    magicSortBoard.innerHTML = magicSortTubes.map((tube, tubeIndex) => {
        const topColor = getMagicSortTopColor(tube);
        const state = getMagicSortTubeState(tube);
        const canReceive = selectedColor && magicSortSelectedTube !== tubeIndex && tube.length < MAGIC_SORT_TUBE_CAPACITY && (!topColor || topColor === selectedColor);
        const slots = Array.from({ length: MAGIC_SORT_TUBE_CAPACITY }, (_, slotIndex) => {
            const color = tube[slotIndex];
            const fill = color ? MAGIC_SORT_COLORS[color] : 'rgba(15, 23, 42, 0.06)';
            return `<span class="magicsort-layer ${color ? `tone-${color}` : ''}" style="background: ${fill};"></span>`;
        }).join('');

        return `
            <div class="magicsort-tube${magicSortSelectedTube === tubeIndex ? ' is-selected' : ''}${canReceive ? ' can-receive' : ''}${state === 'complete' ? ' is-complete' : ''}${magicSortShakeTube === tubeIndex ? ' is-shaking' : ''}">
                <button type="button" class="magicsort-tube-button" data-magic-sort-tube="${tubeIndex}">
                    <span class="magicsort-glass-shine" aria-hidden="true"></span>
                    ${slots}
                </button>
                <span class="magicsort-tube-label">${state === 'complete' ? 'Pret' : canReceive ? 'Verse ici' : `Fiole ${tubeIndex + 1}`}</span>
            </div>
        `;
    }).join('') + (magicSortPourEffect ? `
        <div class="magicsort-pour-effect tone-${magicSortPourEffect.color}" style="
            --from-x: ${magicSortPourEffect.fromX}%;
            --to-x: ${magicSortPourEffect.toX}%;
            --arc-x: ${(magicSortPourEffect.fromX + magicSortPourEffect.toX) / 2}%;
        ">
            <span style="background:${MAGIC_SORT_COLORS[magicSortPourEffect.color]};"></span>
            <strong>+${magicSortPourEffect.amount}</strong>
        </div>
    ` : '');
}

export function getMagicSortRulesText() {
    return 'Clique une fiole source, puis une destination lumineuse. Tu peux verser sur la meme couleur ou dans une fiole vide. Annuler reprend le dernier versement. Termine avec le moins de coups possible pour battre le par.';
}

export function renderMagicSortMenu() {
    const { magicSortMenuOverlay, magicSortTable, magicSortMenuEyebrow, magicSortMenuTitle, magicSortMenuText, magicSortMenuActionButton, magicSortMenuRulesButton } = dom();
    if (!magicSortMenuOverlay || !magicSortTable) return;
    syncGameMenuOverlayBounds(magicSortMenuOverlay, magicSortTable);
    magicSortMenuOverlay.classList.toggle('hidden', !magicSortMenuVisible);
    magicSortMenuOverlay.classList.toggle('is-closing', magicSortMenuClosing);
    magicSortMenuOverlay.classList.toggle('is-entering', magicSortMenuEntering);
    magicSortTable.classList.toggle('is-menu-open', magicSortMenuVisible);
    updateMagicSortHud();
    if (!magicSortMenuVisible) return;
    const hasResult = Boolean(magicSortMenuResult);
    if (magicSortMenuEyebrow) magicSortMenuEyebrow.textContent = magicSortMenuShowingRules ? 'Regles' : (hasResult ? magicSortMenuResult.eyebrow : 'Atelier des marees');
    if (magicSortMenuTitle) magicSortMenuTitle.textContent = magicSortMenuShowingRules ? 'Comment trier' : (hasResult ? magicSortMenuResult.title : 'Magic Sort');
    if (magicSortMenuText) magicSortMenuText.textContent = magicSortMenuShowingRules ? getMagicSortRulesText() : (hasResult ? magicSortMenuResult.text : 'Trie les fioles de la baie. Les destinations possibles brillent, les versements s animent, et chaque niveau ajoute un peu plus de chaos.');
    if (magicSortMenuActionButton) magicSortMenuActionButton.textContent = magicSortMenuShowingRules ? 'Retour' : (hasResult ? 'Niveau suivant' : 'Lancer le tri');
    if (magicSortMenuRulesButton) { magicSortMenuRulesButton.textContent = 'Regles'; magicSortMenuRulesButton.hidden = magicSortMenuShowingRules; }
}

export function closeMagicSortMenu() {
    magicSortMenuClosing = true;
    renderMagicSortMenu();
    window.setTimeout(() => {
        magicSortMenuClosing = false;
        magicSortMenuVisible = false;
        magicSortMenuShowingRules = false;
        magicSortMenuEntering = false;
        magicSortMenuResult = null;
        renderMagicSortMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealMagicSortOutcomeMenu(title, text, eyebrow) {
    magicSortMenuVisible = true;
    magicSortMenuResult = { title, text, eyebrow };
    magicSortMenuShowingRules = false;
    magicSortMenuClosing = false;
    magicSortMenuEntering = true;
    const { magicSortHelpText } = dom();
    if (magicSortHelpText) magicSortHelpText.textContent = text;
    renderMagicSortMenu();
    window.setTimeout(() => { magicSortMenuEntering = false; renderMagicSortMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeMagicSort(options = {}) {
    closeGameOverModal();
    if (options.nextLevel && magicSortMenuResult) {
        magicSortLevel = Math.min(magicSortLevel + 1, MAGIC_SORT_LEVELS.length - 1);
    } else if (options.resetLevel) {
        magicSortLevel = 0;
    }
    magicSortTubes = generateMagicSortLevel(magicSortLevel);
    magicSortSelectedTube = null;
    magicSortMoves = 0;
    magicSortUndoStack = [];
    magicSortPourEffect = null;
    magicSortShakeTube = null;
    const { magicSortHelpText } = dom();
    if (magicSortHelpText) magicSortHelpText.textContent = 'Choisis une fiole, puis une destination brillante. Le bouton Annuler sauve les mauvais versements.';
    magicSortMenuResult = null;
    magicSortMenuShowingRules = false;
    magicSortMenuClosing = false;
    magicSortMenuEntering = false;
    renderMagicSortMenu();
    renderMagicSort();
}

export function isMagicSortSolved() {
    return magicSortTubes.every((tube) => (
        tube.length === 0 || (tube.length === MAGIC_SORT_TUBE_CAPACITY && tube.every((color) => color === tube[0]))
    ));
}

export function handleMagicSortTubeClick(index) {
    const { magicSortHelpText } = dom();
    const sourceTube = magicSortTubes[index];
    magicSortShakeTube = null;

    if (magicSortSelectedTube === null) {
        if (!sourceTube.length) {
            magicSortShakeTube = index;
            if (magicSortHelpText) magicSortHelpText.textContent = 'Cette fiole est vide. Choisis une fiole avec une couleur.';
            renderMagicSort();
            window.setTimeout(() => { magicSortShakeTube = null; renderMagicSort(); }, 320);
            return;
        }
        magicSortSelectedTube = index;
        if (magicSortHelpText) magicSortHelpText.textContent = 'Choisis maintenant une destination brillante.';
        renderMagicSort();
        return;
    }

    if (magicSortSelectedTube === index) {
        magicSortSelectedTube = null;
        if (magicSortHelpText) magicSortHelpText.textContent = 'Selection annulee.';
        renderMagicSort();
        return;
    }

    const fromIndex = magicSortSelectedTube;
    const fromTube = magicSortTubes[fromIndex];
    const toTube = magicSortTubes[index];
    if (!fromTube.length || toTube.length === MAGIC_SORT_TUBE_CAPACITY) {
        magicSortShakeTube = index;
        magicSortSelectedTube = null;
        renderMagicSort();
        window.setTimeout(() => { magicSortShakeTube = null; renderMagicSort(); }, 320);
        return;
    }

    const movingColor = fromTube[fromTube.length - 1];
    const topTarget = toTube[toTube.length - 1];
    if (topTarget && topTarget !== movingColor) {
        if (magicSortHelpText) magicSortHelpText.textContent = 'Mauvaise fiole : verse sur la meme couleur ou dans une fiole vide.';
        magicSortShakeTube = index;
        magicSortSelectedTube = null;
        renderMagicSort();
        window.setTimeout(() => { magicSortShakeTube = null; renderMagicSort(); }, 320);
        return;
    }

    let contiguousCount = 0;
    for (let cursor = fromTube.length - 1; cursor >= 0; cursor -= 1) {
        if (fromTube[cursor] !== movingColor) break;
        contiguousCount += 1;
    }
    const movableCount = Math.min(contiguousCount, MAGIC_SORT_TUBE_CAPACITY - toTube.length);
    if (!movableCount) return;

    magicSortUndoStack.push({ tubes: magicSortTubes.map((tube) => [...tube]), moves: magicSortMoves });
    magicSortPourEffect = {
        fromX: ((fromIndex % 4) * 25) + 12.5,
        toX: ((index % 4) * 25) + 12.5,
        color: movingColor,
        amount: movableCount
    };
    for (let step = 0; step < movableCount; step += 1) {
        toTube.push(fromTube.pop());
    }

    magicSortMoves += 1;
    magicSortSelectedTube = null;
    if (magicSortHelpText) magicSortHelpText.textContent = 'Versement reussi. Les fioles brillantes peuvent recevoir cette couleur.';
    renderMagicSort();
    window.setTimeout(() => {
        magicSortPourEffect = null;
        renderMagicSort();
    }, 520);

    if (isMagicSortSolved()) {
        const config = MAGIC_SORT_LEVELS[Math.min(magicSortLevel, MAGIC_SORT_LEVELS.length - 1)];
        const rating = magicSortMoves <= config.par ? 'Par battu' : 'Tri termine';
        if (magicSortHelpText) magicSortHelpText.textContent = 'Toutes les fioles sont rangees.';
        revealMagicSortOutcomeMenu(
            'Fioles rangees',
            `${rating} en ${magicSortMoves} coups. Niveau ${magicSortLevel + 1} purifie.`,
            'Alchimie reussie'
        );
    }
}

export function undoMagicSortMove() {
    if (!magicSortUndoStack.length || magicSortMenuVisible || magicSortMenuClosing) return;
    const previous = magicSortUndoStack.pop();
    magicSortTubes = previous.tubes.map((tube) => [...tube]);
    magicSortMoves = previous.moves;
    magicSortSelectedTube = null;
    magicSortPourEffect = null;
    magicSortShakeTube = null;
    const { magicSortHelpText } = dom();
    if (magicSortHelpText) magicSortHelpText.textContent = 'Dernier versement annule.';
    renderMagicSort();
}

export function getMagicSortMenuVisible() { return magicSortMenuVisible; }
export function setMagicSortMenuVisible(v) { magicSortMenuVisible = Boolean(v); }
export function setMagicSortMenuShowingRules(v) { magicSortMenuShowingRules = Boolean(v); }
export function getMagicSortMenuShowingRules() { return magicSortMenuShowingRules; }
export function getMagicSortMenuClosing() { return magicSortMenuClosing; }
