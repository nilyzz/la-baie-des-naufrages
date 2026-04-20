// Game module — Stacker (Tour de butin / Stack 2D).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const STACKER_BEST_KEY = 'baie-des-naufrages-stacker-best';
export const STACKER_TARGET_LAYERS = 12;
export const STACKER_LAYER_HEIGHT = 26;
export const STACKER_BASE_BOTTOM = 68;

// --- module-level state ---
let stackerLayers = [];
let stackerCurrentLayer = null;
let stackerFragments = [];
let stackerScore = 0;
let stackerBestScore = (typeof window !== 'undefined' ? Number(window.localStorage.getItem(STACKER_BEST_KEY)) : 0) || 0;
let stackerRunning = false;
let stackerAnimationFrame = null;
let stackerLastFrame = 0;
let stackerMenuVisible = true;
let stackerMenuShowingRules = false;
let stackerMenuClosing = false;
let stackerMenuEntering = false;
let stackerMenuResult = null;

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        stackerBoard: $('stackerBoard'),
        stackerScoreDisplay: $('stackerScoreDisplay'),
        stackerBestDisplay: $('stackerBestDisplay'),
        stackerStartButton: $('stackerStartButton'),
        stackerHelpText: $('stackerHelpText'),
        stackerTable: $('stackerTable'),
        stackerMenuOverlay: $('stackerMenuOverlay'),
        stackerMenuEyebrow: $('stackerMenuEyebrow'),
        stackerMenuTitle: $('stackerMenuTitle'),
        stackerMenuText: $('stackerMenuText'),
        stackerMenuActionButton: $('stackerMenuActionButton'),
        stackerMenuRulesButton: $('stackerMenuRulesButton')
    };
}

export function getStackerBottom(level) {
    return STACKER_BASE_BOTTOM + ((level - 1) * (STACKER_LAYER_HEIGHT - 1));
}

export function getStackerPalette(level) {
    const palettes = [
        { left: '#d4a15d', right: '#8b5a2b' },
        { left: '#ca6b4a', right: '#7a3420' },
        { left: '#4ea9a1', right: '#1f5d59' },
        { left: '#d9b34f', right: '#8f6221' },
        { left: '#7f8fc8', right: '#475281' },
        { left: '#76a85a', right: '#44662e' }
    ];
    return palettes[level % palettes.length];
}

export function getStackerCameraOffset() {
    return Math.max(0, getStackerBottom(Math.max(0, stackerScore)) - 180);
}

export function updateStackerHud() {
    const { stackerScoreDisplay, stackerBestDisplay, stackerStartButton } = dom();
    if (stackerScoreDisplay) stackerScoreDisplay.textContent = String(stackerScore);
    if (stackerBestDisplay) stackerBestDisplay.textContent = String(stackerBestScore);
    if (stackerStartButton) stackerStartButton.textContent = stackerRunning ? 'Empiler' : 'Lancer la tour';
}

export function renderStacker() {
    const { stackerBoard } = dom();
    if (!stackerBoard) return;
    const cameraOffset = getStackerCameraOffset();
    const backdropOffset = Math.min(cameraOffset * 0.18, 48);
    const foregroundOffset = Math.min(cameraOffset * 0.28, 72);
    const layersMarkup = stackerLayers.map((layer) => `
        <div
            class="stacker-layer"
            style="
                width: ${layer.width}%;
                left: ${layer.left}%;
                bottom: ${getStackerBottom(layer.level) - cameraOffset}px;
                --stack-left: ${layer.colorLeft};
                --stack-right: ${layer.colorRight};
            "
        ></div>
    `).join('');
    const fragmentsMarkup = stackerFragments.map((fragment) => `
        <div
            class="stacker-fragment"
            style="
                width: ${fragment.width}%;
                left: ${fragment.left}%;
                bottom: ${fragment.bottom - cameraOffset}px;
                --stack-fragment-x: ${fragment.offsetX || 0}px;
                --stack-fragment-rotation: ${fragment.rotation || 0}deg;
                --stack-left: ${fragment.colorLeft};
                --stack-right: ${fragment.colorRight};
            "
        ></div>
    `).join('');
    const currentMarkup = stackerCurrentLayer ? `
        <div
            class="stacker-current"
            style="
                width: ${stackerCurrentLayer.width}%;
                left: ${stackerCurrentLayer.left}%;
                bottom: ${getStackerBottom(stackerCurrentLayer.level) - cameraOffset}px;
                --stack-left: ${stackerCurrentLayer.colorLeft};
                --stack-right: ${stackerCurrentLayer.colorRight};
            "
        ></div>
    ` : '';

    stackerBoard.innerHTML = `
        <div class="stacker-cloud stacker-cloud-a"></div>
        <div class="stacker-cloud stacker-cloud-b"></div>
        <div class="stacker-backdrop stacker-backdrop-far" style="transform: translateY(${backdropOffset}px);"></div>
        <div class="stacker-backdrop stacker-backdrop-near" style="transform: translateY(${foregroundOffset}px);"></div>
        ${layersMarkup}
        ${fragmentsMarkup}
        ${currentMarkup}
        <div class="stacker-waterline" style="bottom: ${-cameraOffset}px;"></div>
    `;
    updateStackerHud();
}

export function stopStacker() {
    stackerRunning = false;
    if (stackerAnimationFrame) {
        window.cancelAnimationFrame(stackerAnimationFrame);
        stackerAnimationFrame = null;
    }
    stackerLastFrame = 0;
    updateStackerHud();
}

export function createNextStackerLayer(level, width, fromLeft = true) {
    const palette = getStackerPalette(level);
    return {
        level,
        width,
        left: fromLeft ? width / 2 : 100 - (width / 2),
        direction: fromLeft ? 1 : -1,
        speed: 34 + (level * 2),
        colorLeft: palette.left,
        colorRight: palette.right
    };
}

export function getStackerRulesText() {
    return 'Clique sur le plateau ou appuie sur Espace au bon moment pour poser la cargaison qui va et vient. Chaque étage trop décalé se fait rogner. Vise la plus haute tour du port.';
}

export function renderStackerMenu() {
    const { stackerMenuOverlay, stackerTable, stackerMenuEyebrow, stackerMenuTitle, stackerMenuText, stackerMenuActionButton, stackerMenuRulesButton } = dom();
    if (!stackerMenuOverlay || !stackerTable) {
        return;
    }

    syncGameMenuOverlayBounds(stackerMenuOverlay, stackerTable);
    stackerMenuOverlay.classList.toggle('hidden', !stackerMenuVisible);
    stackerMenuOverlay.classList.toggle('is-closing', stackerMenuClosing);
    stackerMenuOverlay.classList.toggle('is-entering', stackerMenuEntering);
    stackerTable.classList.toggle('is-menu-open', stackerMenuVisible);

    if (!stackerMenuVisible) {
        return;
    }

    const hasResult = Boolean(stackerMenuResult);

    if (stackerMenuEyebrow) {
        stackerMenuEyebrow.textContent = stackerMenuShowingRules
            ? 'R\u00e8gles'
            : (hasResult ? stackerMenuResult.eyebrow : 'Tour de butin');
    }
    if (stackerMenuTitle) {
        stackerMenuTitle.textContent = stackerMenuShowingRules
            ? 'Rappel rapide'
            : (hasResult ? stackerMenuResult.title : 'Stack 2D');
    }
    if (stackerMenuText) {
        stackerMenuText.textContent = stackerMenuShowingRules
            ? getStackerRulesText()
            : (hasResult
                ? stackerMenuResult.text
                : 'Clique ou appuie sur Espace au bon moment pour empiler la cargaison. Vise la plus haute tour du port.');
    }
    if (stackerMenuActionButton) {
        stackerMenuActionButton.textContent = stackerMenuShowingRules
            ? 'Retour'
            : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
    }
    if (stackerMenuRulesButton) {
        stackerMenuRulesButton.textContent = 'R\u00e8gles';
        stackerMenuRulesButton.hidden = stackerMenuShowingRules;
    }
}

export function closeStackerMenu() {
    stackerMenuClosing = true;
    renderStackerMenu();
    window.setTimeout(() => {
        stackerMenuClosing = false;
        stackerMenuVisible = false;
        stackerMenuShowingRules = false;
        stackerMenuEntering = false;
        stackerMenuResult = null;
        renderStackerMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealStackerOutcomeMenu(title, text, eyebrow) {
    stackerMenuVisible = true;
    stackerMenuResult = { title, text, eyebrow };
    stackerMenuShowingRules = false;
    stackerMenuClosing = false;
    stackerMenuEntering = true;

    const { stackerHelpText } = dom();
    if (stackerHelpText) {
        stackerHelpText.textContent = text;
    }

    renderStackerMenu();
    window.setTimeout(() => {
        stackerMenuEntering = false;
        renderStackerMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeStacker() {
    closeGameOverModal();
    stopStacker();
    const basePalette = getStackerPalette(1);
    stackerLayers = [{
        level: 1,
        width: 72,
        left: 50,
        colorLeft: basePalette.left,
        colorRight: basePalette.right
    }];
    stackerFragments = [];
    stackerCurrentLayer = createNextStackerLayer(2, 72, true);
    stackerScore = 0;
    stackerMenuResult = null;
    stackerMenuShowingRules = false;
    stackerMenuClosing = false;
    stackerMenuEntering = false;
    const { stackerHelpText } = dom();
    if (stackerHelpText) {
        stackerHelpText.textContent = 'Clique ou appuie sur Espace au bon moment pour empiler les couches du phare.';
    }
    renderStacker();
    renderStackerMenu();
}

export function runStackerFrame(timestamp) {
    if (!stackerRunning || !stackerCurrentLayer) {
        return;
    }

    if (!stackerLastFrame) {
        stackerLastFrame = timestamp;
    }

    const deltaMs = timestamp - stackerLastFrame;
    stackerLastFrame = timestamp;
    const delta = (deltaMs / 1000) * stackerCurrentLayer.speed;
    const minLeft = stackerCurrentLayer.width / 2;
    const maxLeft = 100 - (stackerCurrentLayer.width / 2);

    stackerFragments = stackerFragments
        .map((fragment) => ({
            ...fragment,
            velocityX: fragment.velocityX * 0.995,
            velocityY: fragment.velocityY + (deltaMs / 1000) * 180,
            offsetX: (fragment.offsetX || 0) + ((fragment.velocityX * deltaMs) / 1000),
            bottom: fragment.bottom - ((fragment.velocityY * deltaMs) / 1000),
            rotation: (fragment.rotation || 0) + (((fragment.spin || 0) * deltaMs) / 1000)
        }))
        .filter((fragment) => fragment.bottom > -140 && Math.abs(fragment.offsetX || 0) < 360);

    stackerCurrentLayer.left += delta * stackerCurrentLayer.direction;
    if (stackerCurrentLayer.left <= minLeft) {
        stackerCurrentLayer.left = minLeft;
        stackerCurrentLayer.direction = 1;
    } else if (stackerCurrentLayer.left >= maxLeft) {
        stackerCurrentLayer.left = maxLeft;
        stackerCurrentLayer.direction = -1;
    }

    renderStacker();
    stackerAnimationFrame = window.requestAnimationFrame(runStackerFrame);
}

export function startStacker() {
    if (stackerRunning) {
        return;
    }

    closeGameOverModal();
    stackerRunning = true;
    const { stackerHelpText, stackerStartButton } = dom();
    if (stackerHelpText) stackerHelpText.textContent = "Empile les couches sans perdre l'alignement.";
    if (stackerStartButton) stackerStartButton.textContent = 'Empiler';
    updateStackerHud();
    stackerAnimationFrame = window.requestAnimationFrame(runStackerFrame);
}

export function dropStackerLayer() {
    if (stackerMenuVisible || stackerMenuClosing) {
        return;
    }

    if (!stackerCurrentLayer) {
        return;
    }

    if (!stackerRunning) {
        startStacker();
        return;
    }

    const previousLayer = stackerLayers[stackerLayers.length - 1];
    const previousLeft = previousLayer.left - (previousLayer.width / 2);
    const previousRight = previousLayer.left + (previousLayer.width / 2);
    const currentLeft = stackerCurrentLayer.left - (stackerCurrentLayer.width / 2);
    const currentRight = stackerCurrentLayer.left + (stackerCurrentLayer.width / 2);
    const overlap = Math.min(previousRight, currentRight) - Math.max(previousLeft, currentLeft);
    const currentBottom = getStackerBottom(stackerCurrentLayer.level);

    const { stackerHelpText } = dom();

    if (overlap <= 0) {
        stackerFragments.push({
            width: stackerCurrentLayer.width,
            left: stackerCurrentLayer.left,
            bottom: currentBottom,
            offsetX: 0,
            velocityX: stackerCurrentLayer.direction * 96,
            velocityY: 36,
            rotation: 0,
            spin: stackerCurrentLayer.direction * 170,
            colorLeft: stackerCurrentLayer.colorLeft,
            colorRight: stackerCurrentLayer.colorRight
        });
        stackerCurrentLayer = null;
        stopStacker();
        if (stackerHelpText) stackerHelpText.textContent = 'La couche est tombée dans la baie.';
        renderStacker();
        revealStackerOutcomeMenu(
            'Tour écroulée',
            `La cargaison s'est effondrée après ${stackerScore} étage${stackerScore > 1 ? 's' : ''}. Record : ${stackerBestScore}.`,
            'Cap sur la baie'
        );
        return;
    }

    const center = Math.max(previousLeft, currentLeft) + (overlap / 2);
    const nextLevel = stackerCurrentLayer.level;
    const trimmedWidth = stackerCurrentLayer.width - overlap;

    if (trimmedWidth > 0) {
        const trimmedOnLeft = currentLeft < previousLeft;
        const fragmentLeft = trimmedOnLeft
            ? currentLeft + (trimmedWidth / 2)
            : currentRight - (trimmedWidth / 2);

        stackerFragments.push({
            width: trimmedWidth,
            left: fragmentLeft,
            bottom: currentBottom,
            offsetX: 0,
            velocityX: trimmedOnLeft ? -118 : 118,
            velocityY: 28,
            rotation: 0,
            spin: trimmedOnLeft ? -150 : 150,
            colorLeft: stackerCurrentLayer.colorLeft,
            colorRight: stackerCurrentLayer.colorRight
        });
    }

    const lockedPalette = getStackerPalette(nextLevel);

    stackerLayers.push({
        level: nextLevel,
        width: overlap,
        left: center,
        colorLeft: lockedPalette.left,
        colorRight: lockedPalette.right
    });
    stackerScore = stackerLayers.length - 1;

    if (stackerScore > stackerBestScore) {
        stackerBestScore = stackerScore;
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STACKER_BEST_KEY, String(stackerBestScore));
        }
    }

    stackerCurrentLayer = createNextStackerLayer(nextLevel + 1, overlap, nextLevel % 2 === 1);
    if (stackerHelpText) {
        stackerHelpText.textContent = overlap < previousLayer.width
            ? 'Oups, une partie est tombée. Continue de monter.'
            : 'Empilement parfait. La tour prend de la hauteur.';
    }
    renderStacker();
}

export function setStackerMenuVisible(visible) {
    stackerMenuVisible = Boolean(visible);
}

export function setStackerMenuShowingRules(showing) {
    stackerMenuShowingRules = Boolean(showing);
}

export function getStackerMenuVisible() { return stackerMenuVisible; }
export function getStackerMenuClosing() { return stackerMenuClosing; }
export function getStackerMenuShowingRules() { return stackerMenuShowingRules; }
export function getStackerRunning() { return stackerRunning; }
