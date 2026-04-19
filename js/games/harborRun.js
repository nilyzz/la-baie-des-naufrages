// Game module — Navire 2D (Harbor Run).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const HARBOR_RUN_BEST_KEY = 'baie-des-naufrages-harbor-run-best';
export const HARBOR_RUN_LANES = [18, 50, 82];

let harborRunLane = 1;
let harborRunVisualLane = 1;
let harborRunObstacles = [];
let harborRunScore = 0;
let harborRunBestScore = (typeof window !== 'undefined' && Number(window.localStorage.getItem(HARBOR_RUN_BEST_KEY))) || 0;
let harborRunRunning = false;
let harborRunAnimationFrame = null;
let harborRunLastFrame = 0;
let harborRunSpawnTimer = 0;
let harborRunSafeLane = 1;
let harborRunBackdropOffset = 0;
let harborRunMenuVisible = true;
let harborRunMenuShowingRules = false;
let harborRunMenuClosing = false;
let harborRunMenuEntering = false;
let harborRunMenuResult = null;

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        harborRunBoard: $('harborRunBoard'),
        harborRunTable: $('harborRunTable'),
        harborRunScoreDisplay: $('harborRunScoreDisplay'),
        harborRunBestDisplay: $('harborRunBestDisplay'),
        harborRunHelpText: $('harborRunHelpText'),
        harborRunStartButton: $('harborRunStartButton'),
        harborRunMenuOverlay: $('harborRunMenuOverlay'),
        harborRunMenuEyebrow: $('harborRunMenuEyebrow'),
        harborRunMenuTitle: $('harborRunMenuTitle'),
        harborRunMenuText: $('harborRunMenuText'),
        harborRunMenuActionButton: $('harborRunMenuActionButton'),
        harborRunMenuRulesButton: $('harborRunMenuRulesButton')
    };
}

export function updateHarborRunHud() {
    const { harborRunScoreDisplay, harborRunBestDisplay, harborRunStartButton } = dom();
    if (harborRunScoreDisplay) harborRunScoreDisplay.textContent = String(harborRunScore);
    if (harborRunBestDisplay) harborRunBestDisplay.textContent = String(harborRunBestScore);
    if (harborRunStartButton) harborRunStartButton.textContent = harborRunRunning ? 'En course' : 'Lancer la route';
}

function isHarborRunCollision(obstacle) {
    const { harborRunBoard } = dom();
    const boardHeight = harborRunBoard?.clientHeight || 540;
    const playerCenterX = getHarborRunPlayerPosition();
    const obstacleCenterX = HARBOR_RUN_LANES[obstacle.lane];
    const playerWidthPercent = 22;
    const obstacleWidthPercent = obstacle.type === 'rock' ? 18 : 20;
    const horizontalGap = Math.abs(playerCenterX - obstacleCenterX);
    const horizontalHitLimit = ((playerWidthPercent + obstacleWidthPercent) / 2) - 4.5;

    if (horizontalGap > horizontalHitLimit) {
        return false;
    }

    const playerHeightPercent = (82 / boardHeight) * 100;
    const playerBottomPercent = 100 - ((18 / boardHeight) * 100);
    const playerTopPercent = playerBottomPercent - playerHeightPercent + 2.2;
    const playerBottomHitPercent = playerBottomPercent - 2.4;

    const obstacleHeightPx = obstacle.type === 'rock' ? 66 : 78;
    const obstacleHeightPercent = (obstacleHeightPx / boardHeight) * 100;
    const obstacleTopPercent = obstacle.y + (obstacle.type === 'rock' ? 1.4 : 2.2);
    const obstacleBottomPercent = obstacleTopPercent + obstacleHeightPercent - (obstacle.type === 'rock' ? 2.8 : 4.2);

    return obstacleBottomPercent >= playerTopPercent && obstacleTopPercent <= playerBottomHitPercent;
}

function getHarborRunPlayerPosition() {
    const safeLaneIndex = Math.max(0, Math.min(HARBOR_RUN_LANES.length - 1, harborRunVisualLane));
    const lowerLaneIndex = Math.floor(safeLaneIndex);
    const upperLaneIndex = Math.min(HARBOR_RUN_LANES.length - 1, lowerLaneIndex + 1);
    const laneProgress = safeLaneIndex - lowerLaneIndex;
    const lowerPosition = HARBOR_RUN_LANES[lowerLaneIndex];
    const upperPosition = HARBOR_RUN_LANES[upperLaneIndex];
    return lowerPosition + ((upperPosition - lowerPosition) * laneProgress);
}

export function renderHarborRun() {
    const { harborRunBoard } = dom();
    if (!harborRunBoard) return;
    const farOffset = (harborRunBackdropOffset * 0.22) % 180;
    const midOffset = (harborRunBackdropOffset * 0.42) % 210;
    const nearOffset = (harborRunBackdropOffset * 0.72) % 160;
    const foamOffset = (harborRunBackdropOffset * 0.95) % 140;
    const backdropMarkup = `
        <div class="harborrun-backdrop harborrun-backdrop-far" style="background-position: center ${farOffset}px;"></div>
        <div class="harborrun-backdrop harborrun-backdrop-mid" style="background-position: center ${midOffset}px;"></div>
        <div class="harborrun-waves harborrun-waves-near" style="background-position: center ${nearOffset}px;"></div>
        <div class="harborrun-foam" style="background-position: center ${foamOffset}px;"></div>
    `;
    const playerMarkup = `<div class="harborrun-player" style="left: ${getHarborRunPlayerPosition()}%;"></div>`;
    const obstaclesMarkup = harborRunObstacles.map((obstacle) => `
        <div
            class="harborrun-obstacle type-${obstacle.type}"
            style="left: ${HARBOR_RUN_LANES[obstacle.lane]}%; top: ${obstacle.y}%;"
        ></div>
    `).join('');

    harborRunBoard.innerHTML = `${backdropMarkup}${playerMarkup}${obstaclesMarkup}`;
    updateHarborRunHud();
}

export function stopHarborRun() {
    harborRunRunning = false;
    if (harborRunAnimationFrame) {
        window.cancelAnimationFrame(harborRunAnimationFrame);
        harborRunAnimationFrame = null;
    }
    harborRunLastFrame = 0;
    updateHarborRunHud();
}

export function getHarborRunRulesText() {
    return 'Pilote ton navire dans le chenal du port. Fl\u00e8ches, ZQSD ou clic gauche/droit sur l\u2019\u00e9cran pour changer de voie. \u00c9vite rochers, \u00e9paves et autres bateaux \u2014 la vitesse monte au fil de la course.';
}

export function renderHarborRunMenu() {
    const { harborRunMenuOverlay, harborRunTable, harborRunMenuEyebrow, harborRunMenuTitle, harborRunMenuText, harborRunMenuActionButton, harborRunMenuRulesButton } = dom();
    if (!harborRunMenuOverlay || !harborRunTable) {
        return;
    }

    syncGameMenuOverlayBounds(harborRunMenuOverlay, harborRunTable);
    harborRunMenuOverlay.classList.toggle('hidden', !harborRunMenuVisible);
    harborRunMenuOverlay.classList.toggle('is-closing', harborRunMenuClosing);
    harborRunMenuOverlay.classList.toggle('is-entering', harborRunMenuEntering);
    harborRunTable.classList.toggle('is-menu-open', harborRunMenuVisible);

    if (!harborRunMenuVisible) {
        return;
    }

    const hasResult = Boolean(harborRunMenuResult);

    if (harborRunMenuEyebrow) {
        harborRunMenuEyebrow.textContent = harborRunMenuShowingRules
            ? 'R\u00e8gles'
            : (hasResult ? harborRunMenuResult.eyebrow : 'Course dans le chenal');
    }

    if (harborRunMenuTitle) {
        harborRunMenuTitle.textContent = harborRunMenuShowingRules
            ? 'Rappel rapide'
            : (hasResult ? harborRunMenuResult.title : 'Navire 2D');
    }

    if (harborRunMenuText) {
        harborRunMenuText.textContent = harborRunMenuShowingRules
            ? getHarborRunRulesText()
            : (hasResult
                ? harborRunMenuResult.text
                : 'Guide ton navire entre rochers, \u00e9paves et autres bateaux pendant que la vitesse monte.');
    }

    if (harborRunMenuActionButton) {
        harborRunMenuActionButton.textContent = harborRunMenuShowingRules
            ? 'Retour'
            : (hasResult ? 'Reprendre la mer' : 'Prendre la mer');
    }

    if (harborRunMenuRulesButton) {
        harborRunMenuRulesButton.textContent = 'R\u00e8gles';
        harborRunMenuRulesButton.hidden = harborRunMenuShowingRules;
    }
}

export function closeHarborRunMenu() {
    harborRunMenuClosing = true;
    renderHarborRunMenu();
    window.setTimeout(() => {
        harborRunMenuClosing = false;
        harborRunMenuVisible = false;
        harborRunMenuShowingRules = false;
        harborRunMenuEntering = false;
        harborRunMenuResult = null;
        renderHarborRunMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealHarborRunOutcomeMenu(title, text, eyebrow) {
    harborRunMenuVisible = true;
    harborRunMenuResult = { title, text, eyebrow };
    harborRunMenuShowingRules = false;
    harborRunMenuClosing = false;
    harborRunMenuEntering = true;

    const { harborRunHelpText } = dom();
    if (harborRunHelpText) {
        harborRunHelpText.textContent = text;
    }

    renderHarborRunMenu();
    window.setTimeout(() => {
        harborRunMenuEntering = false;
        renderHarborRunMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeHarborRun() {
    closeGameOverModal();
    stopHarborRun();
    harborRunLane = 1;
    harborRunVisualLane = 1;
    harborRunSafeLane = 1;
    harborRunObstacles = [];
    harborRunScore = 0;
    harborRunSpawnTimer = 0;
    harborRunBackdropOffset = 0;
    harborRunMenuResult = null;
    harborRunMenuShowingRules = false;
    harborRunMenuClosing = false;
    harborRunMenuEntering = false;
    const { harborRunStartButton, harborRunHelpText } = dom();
    if (harborRunStartButton) harborRunStartButton.textContent = 'Lancer la route';
    if (harborRunHelpText) harborRunHelpText.textContent = 'Guide ton navire entre navires, épaves et rochers avec plus de marge pour passer.';
    renderHarborRun();
    renderHarborRunMenu();
}

export function moveHarborRun(direction) {
    if (!harborRunRunning) {
        return;
    }

    harborRunLane = Math.max(0, Math.min(HARBOR_RUN_LANES.length - 1, harborRunLane + direction));
    renderHarborRun();
}

export function startHarborRun() {
    if (harborRunRunning) {
        return;
    }

    closeGameOverModal();
    initializeHarborRun();
    harborRunRunning = true;
    const { harborRunHelpText } = dom();
    if (harborRunHelpText) harborRunHelpText.textContent = "Garde le cap. La mer s'accélère peu à peu à mesure que tu avances.";
    updateHarborRunHud();
    harborRunAnimationFrame = window.requestAnimationFrame(runHarborRunFrame);
}

function runHarborRunFrame(timestamp) {
    if (!harborRunRunning) {
        return;
    }

    if (!harborRunLastFrame) {
        harborRunLastFrame = timestamp;
    }

    const deltaMs = timestamp - harborRunLastFrame;
    harborRunLastFrame = timestamp;
    harborRunSpawnTimer += deltaMs;

    if (harborRunSpawnTimer >= Math.max(560, 980 - (harborRunScore * 8))) {
        const hasRecentWave = harborRunObstacles.some((obstacle) => obstacle.y < 28);

        if (!hasRecentWave) {
            harborRunSpawnTimer = 0;
            const accessibleOpenLanes = [harborRunSafeLane - 1, harborRunSafeLane, harborRunSafeLane + 1]
                .filter((lane) => lane >= 0 && lane < HARBOR_RUN_LANES.length);
            const nextOpenLane = accessibleOpenLanes[Math.floor(Math.random() * accessibleOpenLanes.length)];
            harborRunSafeLane = nextOpenLane;
            const blockedLanes = [0, 1, 2].filter((lane) => lane !== nextOpenLane);
            const nearestObstacleY = harborRunObstacles.reduce((nearest, obstacle) => (
                obstacle.y > nearest ? obstacle.y : nearest
            ), -100);
            const canSpawnDouble = harborRunScore > 10 && nearestObstacleY > 42 && Math.random() < 0.18;
            const obstacleLanes = canSpawnDouble
                ? blockedLanes
                : [blockedLanes[Math.floor(Math.random() * blockedLanes.length)]];

            obstacleLanes.forEach((lane) => {
                harborRunObstacles.push({
                    lane,
                    y: -18,
                    passed: false,
                    type: ['ship', 'wreck', 'rock'][Math.floor(Math.random() * 3)]
                });
            });
        }
    }

    const speed = 28 + Math.min(54, harborRunScore * 1.45);
    const laneSmoothing = Math.min(1, (deltaMs / 1000) * 12);
    harborRunVisualLane += (harborRunLane - harborRunVisualLane) * laneSmoothing;
    harborRunBackdropOffset += (deltaMs / 1000) * speed * 5.6;
    harborRunObstacles.forEach((obstacle) => {
        obstacle.y += (deltaMs / 1000) * speed;
        if (!obstacle.passed && obstacle.y > 94) {
            obstacle.passed = true;
            harborRunScore += 1;
            if (harborRunScore > harborRunBestScore) {
                harborRunBestScore = harborRunScore;
                window.localStorage.setItem(HARBOR_RUN_BEST_KEY, String(harborRunBestScore));
            }
        }
    });

    harborRunObstacles = harborRunObstacles.filter((obstacle) => obstacle.y < 118);

    const collided = harborRunObstacles.some((obstacle) => isHarborRunCollision(obstacle));

    if (collided) {
        stopHarborRun();
        const { harborRunHelpText } = dom();
        if (harborRunHelpText) harborRunHelpText.textContent = 'Collision dans le port.';
        renderHarborRun();
        revealHarborRunOutcomeMenu(
            'Navire échoué',
            `Collision dans le chenal. Distance parcourue : ${harborRunScore}. Record : ${harborRunBestScore}.`,
            'Cap sur le port'
        );
        return;
    }

    renderHarborRun();
    harborRunAnimationFrame = window.requestAnimationFrame(runHarborRunFrame);
}

export function getHarborRunRunning() { return harborRunRunning; }
export function getHarborRunMenuVisible() { return harborRunMenuVisible; }
export function setHarborRunMenuVisible(v) { harborRunMenuVisible = Boolean(v); }
export function setHarborRunMenuShowingRules(v) { harborRunMenuShowingRules = Boolean(v); }
