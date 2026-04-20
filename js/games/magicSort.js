// Game module — Magic Sort.
// Extracted verbatim from script.js during the ES-modules migration.

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
    violet: '#a78bfa'
};
export const MAGIC_SORT_TUBE_CAPACITY = 4;
export const MAGIC_SORT_FILLED_TUBES = 6;
export const MAGIC_SORT_EMPTY_TUBES = 2;

let magicSortTubes = [];
let magicSortSelectedTube = null;
let magicSortMoves = 0;
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
        if (!fromTube.length) {
            return;
        }

        const movingColor = fromTube[fromTube.length - 1];
        let contiguousCount = 0;

        for (let cursor = fromTube.length - 1; cursor >= 0; cursor -= 1) {
            if (fromTube[cursor] !== movingColor) {
                break;
            }
            contiguousCount += 1;
        }

        tubes.forEach((toTube, toIndex) => {
            if (fromIndex === toIndex || toTube.length >= 4) {
                return;
            }

            const topTarget = toTube[toTube.length - 1];
            if (topTarget && topTarget !== movingColor) {
                return;
            }

            const amount = Math.min(contiguousCount, 4 - toTube.length);
            if (!amount) {
                return;
            }

            moves.push({ fromIndex, toIndex, amount });
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

export function generateMagicSortLevel() {
    const colorKeys = shuffleArray(Object.keys(MAGIC_SORT_COLORS)).slice(0, MAGIC_SORT_FILLED_TUBES);

    function getTubeTopInfo(tube) {
        if (!tube.length) {
            return null;
        }

        const color = tube[tube.length - 1];
        let count = 1;

        for (let cursor = tube.length - 2; cursor >= 0; cursor -= 1) {
            if (tube[cursor] !== color) {
                break;
            }
            count += 1;
        }

        return { color, count };
    }

    function getMixedTubeCount(tubes) {
        return tubes.filter((tube) => tube.length > 1 && !tube.every((color) => color === tube[0])).length;
    }

    for (let attempt = 0; attempt < 24; attempt += 1) {
        const tubes = colorKeys.map((color) => Array(MAGIC_SORT_TUBE_CAPACITY).fill(color));
        tubes.push(...Array.from({ length: MAGIC_SORT_EMPTY_TUBES }, () => []));

        const reverseMoves = 32 + Math.floor(Math.random() * 20);

        for (let moveIndex = 0; moveIndex < reverseMoves; moveIndex += 1) {
            const sourceOptions = tubes
                .map((tube, index) => ({ tube, index, top: getTubeTopInfo(tube) }))
                .filter(({ top }) => Boolean(top));

            if (!sourceOptions.length) {
                break;
            }

            const { index: sourceIndex, top } = sourceOptions[Math.floor(Math.random() * sourceOptions.length)];
            const destinationOptions = tubes
                .map((tube, index) => ({ tube, index }))
                .filter(({ tube, index }) => index !== sourceIndex && tube.length < MAGIC_SORT_TUBE_CAPACITY);

            if (!destinationOptions.length) {
                continue;
            }

            const { index: destinationIndex, tube: destinationTube } = destinationOptions[Math.floor(Math.random() * destinationOptions.length)];
            const movableCount = Math.min(top.count, MAGIC_SORT_TUBE_CAPACITY - destinationTube.length);
            const amount = 1 + Math.floor(Math.random() * movableCount);

            for (let step = 0; step < amount; step += 1) {
                destinationTube.push(tubes[sourceIndex].pop());
            }
        }

        if (getMixedTubeCount(tubes) >= 3) {
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
        [],
        [],
        []
    ];
}

export function updateMagicSortHud() {
    const { magicSortSolvedDisplay, magicSortMovesDisplay } = dom();
    const solvedTubes = magicSortTubes.filter((tube) => (
        tube.length === 4 && tube.every((color) => color === tube[0])
    )).length;
    const targetTubes = new Set(magicSortTubes.flat().filter(Boolean)).size;

    if (magicSortSolvedDisplay) magicSortSolvedDisplay.textContent = `${solvedTubes} / ${targetTubes}`;
    if (magicSortMovesDisplay) magicSortMovesDisplay.textContent = String(magicSortMoves);
}

export function renderMagicSort() {
    const { magicSortBoard } = dom();
    updateMagicSortHud();
    if (!magicSortBoard) return;
    magicSortBoard.innerHTML = magicSortTubes.map((tube, tubeIndex) => {
        const slots = Array.from({ length: 4 }, (_, slotIndex) => {
            const color = tube[slotIndex];
            const fill = color ? MAGIC_SORT_COLORS[color] : 'rgba(255, 255, 255, 0.06)';
            return `<span class="magicsort-layer" style="background: ${fill};"></span>`;
        }).join('');

        return `
            <div class="magicsort-tube${magicSortSelectedTube === tubeIndex ? ' is-selected' : ''}">
                <button type="button" class="magicsort-tube-button" data-magic-sort-tube="${tubeIndex}">
                    ${slots}
                </button>
            </div>
        `;
    }).join('');
}

export function getMagicSortRulesText() {
    return 'Clique une fiole pour la s\u00e9lectionner, puis une autre pour y verser le liquide du dessus. Tu ne peux verser que sur une couleur identique (ou sur une fiole vide). Termine la carte quand chaque fiole ne contient qu\u2019une seule couleur.';
}

export function renderMagicSortMenu() {
    const { magicSortMenuOverlay, magicSortTable, magicSortMenuEyebrow, magicSortMenuTitle, magicSortMenuText, magicSortMenuActionButton, magicSortMenuRulesButton } = dom();
    if (!magicSortMenuOverlay || !magicSortTable) return;
    syncGameMenuOverlayBounds(magicSortMenuOverlay, magicSortTable);
    magicSortMenuOverlay.classList.toggle('hidden', !magicSortMenuVisible);
    magicSortMenuOverlay.classList.toggle('is-closing', magicSortMenuClosing);
    magicSortMenuOverlay.classList.toggle('is-entering', magicSortMenuEntering);
    magicSortTable.classList.toggle('is-menu-open', magicSortMenuVisible);
    if (!magicSortMenuVisible) return;
    const hasResult = Boolean(magicSortMenuResult);
    if (magicSortMenuEyebrow) magicSortMenuEyebrow.textContent = magicSortMenuShowingRules ? 'R\u00e8gles' : (hasResult ? magicSortMenuResult.eyebrow : 'Fioles du vieux navigateur');
    if (magicSortMenuTitle) magicSortMenuTitle.textContent = magicSortMenuShowingRules ? 'Rappel rapide' : (hasResult ? magicSortMenuResult.title : 'Magic Sort');
    if (magicSortMenuText) magicSortMenuText.textContent = magicSortMenuShowingRules ? getMagicSortRulesText() : (hasResult ? magicSortMenuResult.text : 'Verse les couleurs dans les fioles jusqu\u2019\u00e0 ce que chacune n\u2019en contienne plus qu\u2019une.');
    if (magicSortMenuActionButton) magicSortMenuActionButton.textContent = magicSortMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer le tri' : 'Lancer le tri');
    if (magicSortMenuRulesButton) { magicSortMenuRulesButton.textContent = 'R\u00e8gles'; magicSortMenuRulesButton.hidden = magicSortMenuShowingRules; }
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

export function initializeMagicSort() {
    closeGameOverModal();
    magicSortTubes = generateMagicSortLevel();
    magicSortSelectedTube = null;
    magicSortMoves = 0;
    const { magicSortHelpText } = dom();
    if (magicSortHelpText) magicSortHelpText.textContent = "Verse les couleurs d'un récipient à l'autre pour obtenir des tubes uniformes. Chaque partie mélange les fioles différemment.";
    magicSortMenuResult = null;
    magicSortMenuShowingRules = false;
    magicSortMenuClosing = false;
    magicSortMenuEntering = false;
    renderMagicSortMenu();
    renderMagicSort();
}

export function isMagicSortSolved() {
    return magicSortTubes.every((tube) => (
        tube.length === 0 || (tube.length === 4 && tube.every((color) => color === tube[0]))
    ));
}

export function handleMagicSortTubeClick(index) {
    const { magicSortHelpText } = dom();
    const sourceTube = magicSortTubes[index];

    if (magicSortSelectedTube === null) {
        if (!sourceTube.length) {
            return;
        }

        magicSortSelectedTube = index;
        if (magicSortHelpText) magicSortHelpText.textContent = 'Choisis maintenant le tube de destination.';
        renderMagicSort();
        return;
    }

    if (magicSortSelectedTube === index) {
        magicSortSelectedTube = null;
        if (magicSortHelpText) magicSortHelpText.textContent = 'Sélection annulée.';
        renderMagicSort();
        return;
    }

    const fromTube = magicSortTubes[magicSortSelectedTube];
    const toTube = magicSortTubes[index];

    if (!fromTube.length || toTube.length === 4) {
        magicSortSelectedTube = null;
        renderMagicSort();
        return;
    }

    const movingColor = fromTube[fromTube.length - 1];
    const topTarget = toTube[toTube.length - 1];
    if (topTarget && topTarget !== movingColor) {
        if (magicSortHelpText) magicSortHelpText.textContent = 'Les couleurs doivent correspondre pour verser.';
        magicSortSelectedTube = null;
        renderMagicSort();
        return;
    }

    let contiguousCount = 0;
    for (let cursor = fromTube.length - 1; cursor >= 0; cursor -= 1) {
        if (fromTube[cursor] !== movingColor) {
            break;
        }
        contiguousCount += 1;
    }

    const movableCount = Math.min(contiguousCount, 4 - toTube.length);
    if (!movableCount) {
        magicSortSelectedTube = null;
        renderMagicSort();
        return;
    }

    for (let step = 0; step < movableCount; step += 1) {
        toTube.push(fromTube.pop());
    }

    magicSortMoves += 1;
    magicSortSelectedTube = null;
    if (magicSortHelpText) magicSortHelpText.textContent = 'Bien joue. Continue de trier les fioles.';
    renderMagicSort();

    if (isMagicSortSolved()) {
        if (magicSortHelpText) magicSortHelpText.textContent = 'Toutes les fioles sont rangées.';
        revealMagicSortOutcomeMenu(
            'Fioles rangées',
            `Toutes les couleurs ont été triées en ${magicSortMoves} coups.`,
            'Alchimie réussie'
        );
    }
}

export function getMagicSortMenuVisible() { return magicSortMenuVisible; }
export function setMagicSortMenuVisible(v) { magicSortMenuVisible = Boolean(v); }
export function setMagicSortMenuShowingRules(v) { magicSortMenuShowingRules = Boolean(v); }
export function getMagicSortMenuShowingRules() { return magicSortMenuShowingRules; }
export function getMagicSortMenuClosing() { return magicSortMenuClosing; }
