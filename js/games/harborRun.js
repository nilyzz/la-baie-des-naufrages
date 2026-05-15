// Game module - Navire 2D (Harbor Run).

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const HARBOR_RUN_BEST_KEY = 'baie-des-naufrages-harbor-run-best';
export const HARBOR_RUN_LANES = [10, 30, 50, 70, 90];

const HARBOR_RUN_TYPES = ['rock', 'buoy', 'wreck', 'ship'];
const HARBOR_RUN_MISSION_DISTANCE = 1200;

let harborRunLane = 2;
let harborRunVisualLane = 2;
let harborRunEntities = [];
let harborRunEffects = [];
let harborRunScore = 0;
let harborRunCoins = 0;
let harborRunLighthouses = 0;
let harborRunBestScore = (typeof window !== 'undefined' && Number(window.localStorage.getItem(HARBOR_RUN_BEST_KEY))) || 0;
let harborRunRunning = false;
let harborRunAnimationFrame = null;
let harborRunLastFrame = 0;
let harborRunSpawnTimer = 0;
let harborRunSafeLane = 2;
let harborRunBackdropOffset = 0;
let harborRunShieldMs = 0;
let harborRunBoostMs = 0;
let harborRunShakeMs = 0;
let harborRunCrash = null;
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

function formatHarborRunDistance(value) {
    return `${Math.floor(value)} m`;
}

function getHarborRunSpeed() {
    const baseSpeed = 32 + Math.min(70, harborRunScore * 0.045);
    return harborRunBoostMs > 0 ? baseSpeed * 1.28 : baseSpeed;
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

function getHarborRunOpenLane() {
    const reachable = [harborRunSafeLane - 1, harborRunSafeLane, harborRunSafeLane + 1]
        .filter((lane) => lane >= 0 && lane < HARBOR_RUN_LANES.length);
    return reachable[Math.floor(Math.random() * reachable.length)];
}

function createHarborRunWave() {
    const openLane = getHarborRunOpenLane();
    harborRunSafeLane = openLane;
    const maxBlocked = harborRunScore < 260 ? 2 : (harborRunScore < 780 ? 3 : 4);
    const blockedCount = Math.min(maxBlocked, 1 + Math.floor(Math.random() * maxBlocked));
    const candidateLanes = HARBOR_RUN_LANES.map((_, lane) => lane).filter((lane) => lane !== openLane);
    const lanes = [];

    while (lanes.length < blockedCount && candidateLanes.length) {
        const index = Math.floor(Math.random() * candidateLanes.length);
        lanes.push(candidateLanes.splice(index, 1)[0]);
    }

    lanes.forEach((lane) => {
        harborRunEntities.push({
            kind: 'obstacle',
            type: HARBOR_RUN_TYPES[Math.floor(Math.random() * HARBOR_RUN_TYPES.length)],
            lane,
            y: -18 - (Math.random() * 10),
            passed: false
        });
    });

    if (Math.random() < 0.72) {
        harborRunEntities.push({
            kind: 'coin',
            label: '+1',
            lane: openLane,
            y: -24,
            collected: false
        });
    }

    if (harborRunScore > 250 && Math.random() < 0.18) {
        const pickupKind = Math.random() < 0.58 ? 'shield' : 'boost';
        harborRunEntities.push({
            kind: pickupKind,
            label: pickupKind === 'shield' ? 'BOUCLIER' : 'BOOST',
            lane: openLane,
            y: -42,
            collected: false
        });
    }
}

function addHarborRunEffect(kind, lane, y, text) {
    harborRunEffects.push({
        id: `${Date.now()}-${Math.random()}`,
        kind,
        lane,
        y,
        text,
        life: 780
    });
}

function isHarborRunEntityCollision(entity) {
    const { harborRunBoard } = dom();
    const boardHeight = harborRunBoard?.clientHeight || 620;
    const playerCenterX = getHarborRunPlayerPosition();
    const entityCenterX = HARBOR_RUN_LANES[entity.lane];
    const playerWidthPercent = 14;
    const entityWidthPercent = entity.kind === 'obstacle' ? 12 : 8;
    const horizontalGap = Math.abs(playerCenterX - entityCenterX);

    if (horizontalGap > ((playerWidthPercent + entityWidthPercent) / 2)) {
        return false;
    }

    const playerHeightPercent = (92 / boardHeight) * 100;
    const playerBottomPercent = 100 - ((22 / boardHeight) * 100);
    const playerTopPercent = playerBottomPercent - playerHeightPercent + 2;
    const entityHeightPx = entity.kind === 'obstacle' ? 76 : 44;
    const entityHeightPercent = (entityHeightPx / boardHeight) * 100;
    const entityTopPercent = entity.y + 2;
    const entityBottomPercent = entityTopPercent + entityHeightPercent - 3;
    return entityBottomPercent >= playerTopPercent && entityTopPercent <= playerBottomPercent;
}

export function updateHarborRunHud() {
    const { harborRunScoreDisplay, harborRunBestDisplay, harborRunStartButton } = dom();
    if (harborRunScoreDisplay) harborRunScoreDisplay.textContent = formatHarborRunDistance(harborRunScore);
    if (harborRunBestDisplay) harborRunBestDisplay.textContent = formatHarborRunDistance(harborRunBestScore);
    if (harborRunStartButton) harborRunStartButton.textContent = harborRunRunning ? 'En mer' : 'Prendre la mer';
}

export function renderHarborRun() {
    const { harborRunBoard } = dom();
    if (!harborRunBoard) return;
    if (harborRunMenuVisible) { harborRunBoard.innerHTML = ''; return; }

    const speed = getHarborRunSpeed();
    const farOffset = (harborRunBackdropOffset * 0.16) % 220;
    const midOffset = (harborRunBackdropOffset * 0.34) % 260;
    const nearOffset = (harborRunBackdropOffset * 0.72) % 180;
    const foamOffset = (harborRunBackdropOffset * 1.08) % 130;
    const nextLighthouse = (harborRunLighthouses + 1) * HARBOR_RUN_MISSION_DISTANCE;
    const previousLighthouse = harborRunLighthouses * HARBOR_RUN_MISSION_DISTANCE;
    const missionProgress = Math.min(100, ((harborRunScore - previousLighthouse) / HARBOR_RUN_MISSION_DISTANCE) * 100);
    const lanesMarkup = HARBOR_RUN_LANES.map((lane) => (
        `<span class="harborrun-lane" style="left: ${lane}%;"></span>`
    )).join('');
    const statusMarkup = `
        <div class="harborrun-ingame-hud">
            <div><span>Distance</span><strong>${formatHarborRunDistance(harborRunScore)}</strong></div>
            <div><span>Pieces</span><strong>${harborRunCoins}</strong></div>
            <div><span>Vitesse</span><strong>${Math.round(speed)} nd</strong></div>
        </div>
        <div class="harborrun-mission">
            <span>Prochain phare ${nextLighthouse} m</span>
            <strong>${Math.floor(missionProgress)}%</strong>
            <i style="width:${missionProgress}%"></i>
        </div>
    `;
    const backdropMarkup = `
        <div class="harborrun-skyline" style="background-position: center ${farOffset}px;"></div>
        <div class="harborrun-backdrop harborrun-backdrop-far" style="background-position: center ${farOffset}px;"></div>
        <div class="harborrun-backdrop harborrun-backdrop-mid" style="background-position: center ${midOffset}px;"></div>
        <div class="harborrun-waves harborrun-waves-near" style="background-position: center ${nearOffset}px;"></div>
        <div class="harborrun-foam" style="background-position: center ${foamOffset}px;"></div>
        ${lanesMarkup}
    `;
    const playerMarkup = `
        <div class="harborrun-player ${harborRunShieldMs > 0 ? 'has-shield' : ''} ${harborRunBoostMs > 0 ? 'has-boost' : ''}" style="left: ${getHarborRunPlayerPosition()}%;"></div>
    `;
    const entitiesMarkup = harborRunEntities.map((entity) => `
        <div
            class="harborrun-entity harborrun-${entity.kind} ${entity.kind === 'obstacle' ? `type-${entity.type}` : ''}"
            style="left: ${HARBOR_RUN_LANES[entity.lane]}%; top: ${entity.y}%;"
        >${entity.kind === 'coin' ? '<span>PIECE</span>' : entity.kind === 'shield' ? '<span>BOUCLIER</span>' : entity.kind === 'boost' ? '<span>BOOST</span>' : ''}</div>
    `).join('');
    const effectsMarkup = harborRunEffects.map((effect) => `
        <div
            class="harborrun-pickup-effect effect-${effect.kind}"
            style="left: ${HARBOR_RUN_LANES[effect.lane]}%; top: ${effect.y}%;"
        >${effect.text}</div>
    `).join('');

    const crashMarkup = harborRunCrash
        ? `<div class="harborrun-crash" style="left: ${HARBOR_RUN_LANES[harborRunCrash.lane]}%; top: ${harborRunCrash.y}%;">
            <span></span><span></span><span></span><span></span>
        </div>`
        : '';

    harborRunBoard.classList.toggle('is-shaking', harborRunShakeMs > 0);
    harborRunBoard.classList.toggle('is-crashed', Boolean(harborRunCrash));
    harborRunBoard.innerHTML = `${backdropMarkup}${statusMarkup}${playerMarkup}${entitiesMarkup}${effectsMarkup}${crashMarkup}`;
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
    return 'Pilote sur toute la carte avec les fleches, Q/D ou un clic gauche/droite. Evite les obstacles, ramasse les pieces, prends les boucliers et traverse les courants pour accelerer sans casser le navire.';
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
            ? 'Regles'
            : (hasResult ? harborRunMenuResult.eyebrow : 'Course dans la baie');
    }
    if (harborRunMenuTitle) {
        harborRunMenuTitle.textContent = harborRunMenuShowingRules
            ? 'Cap, pieces, boucliers'
            : (hasResult ? harborRunMenuResult.title : 'Navire 2D');
    }
    if (harborRunMenuText) {
        harborRunMenuText.textContent = harborRunMenuShowingRules
            ? getHarborRunRulesText()
            : (hasResult
                ? harborRunMenuResult.text
                : 'Toute la carte devient ton chenal. Glisse entre les bateaux, ramasse les pieces et tiens jusqu au phare.');
    }
    if (harborRunMenuActionButton) {
        harborRunMenuActionButton.textContent = harborRunMenuShowingRules
            ? 'Retour'
            : (hasResult ? 'Reprendre la mer' : 'Prendre la mer');
    }
    if (harborRunMenuRulesButton) {
        harborRunMenuRulesButton.textContent = 'Regles';
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
    if (harborRunHelpText) harborRunHelpText.textContent = text;

    renderHarborRunMenu();
    window.setTimeout(() => {
        harborRunMenuEntering = false;
        renderHarborRunMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeHarborRun() {
    closeGameOverModal();
    stopHarborRun();
    harborRunLane = 2;
    harborRunVisualLane = 2;
    harborRunSafeLane = 2;
    harborRunEntities = [];
    harborRunEffects = [];
    harborRunScore = 0;
    harborRunCoins = 0;
    harborRunLighthouses = 0;
    harborRunShieldMs = 0;
    harborRunBoostMs = 0;
    harborRunShakeMs = 0;
    harborRunCrash = null;
    harborRunSpawnTimer = 0;
    harborRunBackdropOffset = 0;
    harborRunMenuResult = null;
    harborRunMenuShowingRules = false;
    harborRunMenuClosing = false;
    harborRunMenuEntering = false;
    const { harborRunStartButton, harborRunHelpText } = dom();
    if (harborRunStartButton) harborRunStartButton.textContent = 'Prendre la mer';
    if (harborRunHelpText) harborRunHelpText.textContent = 'Utilise toute la largeur de la baie. Pieces jaunes, boucliers cyan, courants corail.';
    renderHarborRun();
    renderHarborRunMenu();
}

export function moveHarborRun(direction) {
    if (!harborRunRunning) return;
    harborRunLane = Math.max(0, Math.min(HARBOR_RUN_LANES.length - 1, harborRunLane + direction));
    renderHarborRun();
}

export function startHarborRun() {
    if (harborRunRunning) return;
    closeGameOverModal();
    initializeHarborRun();
    harborRunRunning = true;
    const { harborRunHelpText } = dom();
    if (harborRunHelpText) harborRunHelpText.textContent = 'Va le plus loin possible. Chaque phare donne un gros bonus et la course continue.';
    updateHarborRunHud();
    harborRunAnimationFrame = window.requestAnimationFrame(runHarborRunFrame);
}

function handleHarborRunPickup(entity) {
    entity.collected = true;
    if (entity.kind === 'coin') {
        harborRunCoins += 1;
        harborRunScore += 18;
        addHarborRunEffect('coin', entity.lane, entity.y, '+1 piece');
    } else if (entity.kind === 'shield') {
        harborRunShieldMs = 5200;
        addHarborRunEffect('shield', entity.lane, entity.y, 'Bouclier');
    } else if (entity.kind === 'boost') {
        harborRunBoostMs = 3200;
        harborRunScore += 35;
        addHarborRunEffect('boost', entity.lane, entity.y, 'Boost');
    }
}

function runHarborRunFrame(timestamp) {
    if (!harborRunRunning) return;
    if (!harborRunLastFrame) harborRunLastFrame = timestamp;

    const deltaMs = Math.min(48, timestamp - harborRunLastFrame);
    const deltaSeconds = deltaMs / 1000;
    harborRunLastFrame = timestamp;
    harborRunSpawnTimer += deltaMs;
    harborRunShieldMs = Math.max(0, harborRunShieldMs - deltaMs);
    harborRunBoostMs = Math.max(0, harborRunBoostMs - deltaMs);
    harborRunShakeMs = Math.max(0, harborRunShakeMs - deltaMs);
    harborRunEffects.forEach((effect) => {
        effect.life -= deltaMs;
        effect.y -= deltaSeconds * 18;
    });

    if (harborRunSpawnTimer >= Math.max(430, 930 - (harborRunScore * 0.38))) {
        const hasRecentWave = harborRunEntities.some((entity) => entity.kind === 'obstacle' && entity.y < 26);
        if (!hasRecentWave) {
            harborRunSpawnTimer = 0;
            createHarborRunWave();
        }
    }

    const speed = getHarborRunSpeed();
    const laneSmoothing = Math.min(1, deltaSeconds * 11);
    harborRunVisualLane += (harborRunLane - harborRunVisualLane) * laneSmoothing;
    harborRunBackdropOffset += deltaSeconds * speed * 5.8;
    harborRunScore += deltaSeconds * speed * 1.35;

    harborRunEntities.forEach((entity) => {
        entity.y += deltaSeconds * speed;
        if (entity.kind === 'obstacle' && !entity.passed && entity.y > 104) {
            entity.passed = true;
            harborRunScore += 25;
        }
    });

    for (const entity of harborRunEntities) {
        if (!isHarborRunEntityCollision(entity)) continue;
        if (entity.kind === 'obstacle') {
            if (harborRunShieldMs > 0) {
                entity.passed = true;
                entity.y = 120;
                harborRunShieldMs = 0;
                harborRunShakeMs = 300;
                harborRunScore += 40;
                continue;
            }
            stopHarborRun();
            harborRunScore = Math.floor(harborRunScore);
            harborRunCrash = {
                lane: entity.lane,
                y: Math.min(82, Math.max(16, entity.y))
            };
            if (harborRunScore > harborRunBestScore) {
                harborRunBestScore = harborRunScore;
                window.localStorage.setItem(HARBOR_RUN_BEST_KEY, String(harborRunBestScore));
            }
            renderHarborRun();
            window.setTimeout(() => {
                revealHarborRunOutcomeMenu(
                    'Navire echoue',
                    `Distance : ${formatHarborRunDistance(harborRunScore)}. Pieces : ${harborRunCoins}. Record : ${formatHarborRunDistance(harborRunBestScore)}.`,
                    'Retour au port'
                );
            }, 520);
            return;
        }
        if (!entity.collected) handleHarborRunPickup(entity);
    }

    harborRunEntities = harborRunEntities.filter((entity) => entity.y < 125 && !entity.collected);
    harborRunEffects = harborRunEffects.filter((effect) => effect.life > 0);
    if (harborRunScore > harborRunBestScore) {
        harborRunBestScore = Math.floor(harborRunScore);
        window.localStorage.setItem(HARBOR_RUN_BEST_KEY, String(harborRunBestScore));
    }

    const reachedLighthouses = Math.floor(harborRunScore / HARBOR_RUN_MISSION_DISTANCE);
    if (reachedLighthouses > harborRunLighthouses) {
        harborRunLighthouses = reachedLighthouses;
        harborRunShieldMs = Math.max(harborRunShieldMs, 3200);
        harborRunScore += 180;
        addHarborRunEffect('lighthouse', 2, 18, `Phare ${harborRunLighthouses} +180`);
        const { harborRunHelpText } = dom();
        if (harborRunHelpText) harborRunHelpText.textContent = `Phare ${harborRunLighthouses} franchi. Bonus +180, bouclier offert, continue !`;
    }

    renderHarborRun();
    harborRunAnimationFrame = window.requestAnimationFrame(runHarborRunFrame);
}

export function getHarborRunRunning() { return harborRunRunning; }
export function getHarborRunMenuVisible() { return harborRunMenuVisible; }
export function setHarborRunMenuVisible(v) { harborRunMenuVisible = Boolean(v); }
export function setHarborRunMenuShowingRules(v) { harborRunMenuShowingRules = Boolean(v); }
export function getHarborRunMenuShowingRules() { return harborRunMenuShowingRules; }
export function getHarborRunMenuClosing() { return harborRunMenuClosing; }
