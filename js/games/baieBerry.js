// Game module — BaieBerry (Suika-like physics merge game).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const BAIE_BERRY_BEST_KEY = 'baie-des-naufrages-baieberry-best';
export const BAIE_BERRY_DANGER_LINE_Y = 74;
export const BAIE_BERRY_DANGER_DURATION_MS = 1600;
export const BAIE_BERRY_DANGER_GRACE_MS = 700;
export const BAIE_BERRY_COMBO_WINDOW_MS = 1400;
export const BAIE_BERRY_SHAKE_DECAY = 0.9;
export const BAIE_BERRY_DROP_COOLDOWN_MS = 500;
export const BAIE_BERRY_FRUITS = [
    { name: 'Myrtille', radius: 16, color: '#60a5fa', score: 10 },
    { name: 'Framboise', radius: 21, color: '#fb7185', score: 24 },
    { name: 'Groseille', radius: 28, color: '#f97316', score: 56 },
    { name: 'Mure', radius: 36, color: '#a78bfa', score: 120 },
    { name: 'Cassis', radius: 46, color: '#4338ca', score: 260 },
    { name: 'Baie Royale', radius: 58, color: '#facc15', score: 560 },
    { name: 'Perle Marine', radius: 72, color: '#2dd4bf', score: 1120 },
    { name: 'Rubis des Flots', radius: 88, color: '#ef4444', score: 2240 },
    { name: 'Couronne Abyssale', radius: 106, color: '#0f172a', score: 4480 }
];

let baieBerryState = null;
let baieBerryAnimationFrame = null;
let baieBerryLastFrame = 0;
let baieBerryBestScore = (typeof window !== 'undefined' && Number(window.localStorage.getItem(BAIE_BERRY_BEST_KEY))) || 0;
let baieBerryNextFruitId = 1;
let baieBerryLastPointerX = null;
let baieBerryDropLineTimer = null;
let baieBerryLastDropAt = 0;
let baieBerryMenuVisible = true;
let baieBerryMenuShowingRules = false;
let baieBerryMenuClosing = false;
let baieBerryMenuEntering = false;
let baieBerryMenuResult = false;

const $ = (id) => document.getElementById(id);
function dom() {
    const baieBerryGame = $('baieBerryGame');
    const baieBerryCanvas = $('baieBerryCanvas');
    return {
        baieBerryGame,
        baieBerryCanvas,
        baieBerryContext: baieBerryCanvas?.getContext('2d'),
        baieBerryTable: $('baieBerryTable'),
        baieBerryStage: baieBerryGame?.querySelector('.baieberry-stage'),
        baieBerryDropLine: $('baieBerryDropLine'),
        baieBerryDropGuide: $('baieBerryDropGuide'),
        baieBerryScoreDisplay: $('baieBerryScoreDisplay'),
        baieBerryBestDisplay: $('baieBerryBestDisplay'),
        baieBerryNextDisplay: $('baieBerryNextDisplay'),
        baieBerryObjectiveDisplay: { textContent: '' },
        baieBerryHelpText: $('baieBerryHelpText'),
        baieBerryMenuOverlay: $('baieBerryMenuOverlay'),
        baieBerryMenuEyebrow: $('baieBerryMenuEyebrow'),
        baieBerryMenuTitle: $('baieBerryMenuTitle'),
        baieBerryMenuText: $('baieBerryMenuText'),
        baieBerryMenuActionButton: $('baieBerryMenuActionButton'),
        baieBerryMenuRulesButton: $('baieBerryMenuRulesButton')
    };
}

function getRandomBaieBerryIndex() {
    return Math.floor(Math.random() * Math.min(4, BAIE_BERRY_FRUITS.length));
}

function getRandomBaieBerryObjective() {
    const targets = [
        { type: 'score', target: 1500, label: 'Atteins 1500 points' },
        { type: 'score', target: 3000, label: 'Atteins 3000 points' },
        { type: 'level', target: 6, label: 'Cree une Perle Marine' },
        { type: 'level', target: 7, label: 'Cree un Rubis des Flots' }
    ];
    return { ...targets[Math.floor(Math.random() * targets.length)], completed: false };
}

export function refreshBaieBerryHud() {
    const { baieBerryScoreDisplay, baieBerryBestDisplay, baieBerryNextDisplay, baieBerryObjectiveDisplay } = dom();
    if (!baieBerryState) {
        return;
    }

    if (baieBerryScoreDisplay) baieBerryScoreDisplay.textContent = String(baieBerryState.score);
    if (baieBerryBestDisplay) baieBerryBestDisplay.textContent = String(baieBerryBestScore);
    const nextFruit = BAIE_BERRY_FRUITS[baieBerryState.nextQueue[1]];
    if (baieBerryNextDisplay) {
        baieBerryNextDisplay.style.setProperty('--baieberry-preview-color', nextFruit.color);
        baieBerryNextDisplay.setAttribute('aria-label', `Fruit suivant: ${nextFruit.name}`);
    }
    baieBerryObjectiveDisplay.textContent = baieBerryState.objective.completed
        ? `${baieBerryState.objective.label} âœ“`
        : baieBerryState.objective.label;
}

function addBaieBerryParticles(x, y, color, count = 14) {
    if (!baieBerryState) {
        return;
    }

    for (let index = 0; index < count; index += 1) {
        const maxLife = 0.7 + (Math.random() * 0.45);
        baieBerryState.particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 220,
            vy: -40 - (Math.random() * 180),
            life: maxLife,
            maxLife,
            size: 3 + (Math.random() * 7),
            color
        });
    }
}

function addBaieBerryScorePopup(x, y, text, color = '#f8fafc') {
    baieBerryState?.scorePopups.push({
        x,
        y,
        vy: -36,
        life: 1,
        text,
        color
    });
}

function updateBaieBerryObjective(lastMergedLevel = null) {
    if (!baieBerryState || baieBerryState.objective.completed) {
        return;
    }

    const { objective } = baieBerryState;
    if (objective.type === 'score' && baieBerryState.score >= objective.target) {
        objective.completed = true;
    }

    if (objective.type === 'level' && lastMergedLevel !== null && lastMergedLevel >= objective.target) {
        objective.completed = true;
    }

    if (objective.completed) {
        const { baieBerryHelpText, baieBerryCanvas } = dom();
        if (baieBerryHelpText) baieBerryHelpText.textContent = `Objectif accompli: ${objective.label}. Continue de faire grimper la r\u00e9colte.`;
        if (baieBerryCanvas) addBaieBerryScorePopup(baieBerryCanvas.width * 0.5, 108, 'Objectif atteint', '#fde68a');
        refreshBaieBerryHud();
    }
}

export function updateBaieBerryDropGuide(positionX = null) {
    const { baieBerryDropGuide, baieBerryDropLine, baieBerryCanvas } = dom();
    if (!baieBerryDropGuide || !baieBerryDropLine || !baieBerryState) {
        return;
    }

    const nextFruit = BAIE_BERRY_FRUITS[baieBerryState.nextQueue[0]];
    const guideSize = Math.max(28, nextFruit.radius * 1.6);
    const clampedX = positionX === null
        ? (baieBerryCanvas.width / 2)
        : Math.max(nextFruit.radius, Math.min(baieBerryCanvas.width - nextFruit.radius, positionX));
    const renderedBounds = baieBerryCanvas.getBoundingClientRect();
    const scaleX = (renderedBounds.width || baieBerryCanvas.width) / baieBerryCanvas.width;
    const scaleY = (renderedBounds.height || baieBerryCanvas.height) / baieBerryCanvas.height;
    const visualGuideSize = guideSize * Math.min(scaleX, scaleY);
    const visualX = clampedX * scaleX;

    baieBerryDropGuide.style.width = `${visualGuideSize}px`;
    baieBerryDropGuide.style.height = `${visualGuideSize}px`;
    baieBerryDropGuide.style.transform = `translateX(${visualX - (visualGuideSize / 2)}px)`;
    baieBerryDropGuide.style.setProperty('--baieberry-guide-color', nextFruit.color);
    baieBerryDropLine.style.height = `${Math.max(0, renderedBounds.height - visualGuideSize - 22)}px`;
    baieBerryDropLine.style.transform = `translateX(${visualX - 1}px)`;
    baieBerryDropLine.style.setProperty('--baieberry-guide-color', nextFruit.color);
    baieBerryDropLine.style.opacity = '0.92';
}

function drawBaieBerryFruit(context, fruit, alpha = 1) {
    const config = BAIE_BERRY_FRUITS[fruit.level];
    const mergeScale = fruit.mergeProgress ? (1 + (fruit.mergeProgress * 0.14)) : 1;
    const eyeOffsetX = config.radius * 0.22;
    const eyeY = -config.radius * 0.08;
    const blink = fruit.blink ? 0.18 : 1;
    const mouthCurve = fruit.expression === 'happy' ? 1 : fruit.expression === 'worried' ? -1 : 0;
    const pirateVariant = (fruit.id + fruit.level) % 5;
    const gradient = context.createRadialGradient(
        -config.radius * 0.35,
        -config.radius * 0.42,
        config.radius * 0.08,
        0,
        0,
        config.radius
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
    gradient.addColorStop(0.16, config.color);
    gradient.addColorStop(0.72, config.color);
    gradient.addColorStop(1, 'rgba(15,23,42,0.68)');

    context.save();
    context.globalAlpha = alpha;
    context.translate(fruit.x, fruit.y);
    context.rotate(fruit.rotation || 0);
    context.scale(mergeScale, mergeScale);
    context.beginPath();
    context.fillStyle = gradient;
    context.arc(0, 0, config.radius, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.strokeStyle = 'rgba(255,255,255,0.2)';
    context.lineWidth = Math.max(2, config.radius * 0.08);
    context.arc(0, 0, config.radius * 0.82, Math.PI * 1.12, Math.PI * 1.84);
    context.stroke();

    context.beginPath();
    context.fillStyle = 'rgba(255,255,255,0.24)';
    context.ellipse(
        -config.radius * 0.28,
        -config.radius * 0.34,
        config.radius * 0.24,
        config.radius * 0.14,
        -0.4,
        0,
        Math.PI * 2
    );
    context.fill();

    if (pirateVariant === 1 || pirateVariant === 3) {
        const bandanaBase = pirateVariant === 1
            ? 'rgba(153, 27, 27, 0.96)'
            : 'rgba(30, 64, 175, 0.96)';
        const bandanaHighlight = pirateVariant === 1
            ? 'rgba(248, 113, 113, 0.34)'
            : 'rgba(147, 197, 253, 0.34)';

        context.beginPath();
        context.fillStyle = bandanaBase;
        context.moveTo(-config.radius * 0.88, -config.radius * 0.38);
        context.quadraticCurveTo(-config.radius * 0.3, -config.radius * 0.84, 0, -config.radius * 0.82);
        context.quadraticCurveTo(config.radius * 0.34, -config.radius * 0.82, config.radius * 0.88, -config.radius * 0.38);
        context.quadraticCurveTo(config.radius * 0.44, -config.radius * 0.08, 0, -config.radius * 0.14);
        context.quadraticCurveTo(-config.radius * 0.46, -config.radius * 0.08, -config.radius * 0.88, -config.radius * 0.38);
        context.closePath();
        context.fill();

        context.beginPath();
        context.strokeStyle = bandanaHighlight;
        context.lineWidth = Math.max(1.4, config.radius * 0.045);
        context.moveTo(-config.radius * 0.54, -config.radius * 0.4);
        context.quadraticCurveTo(0, -config.radius * 0.58, config.radius * 0.56, -config.radius * 0.4);
        context.stroke();

        context.beginPath();
        context.fillStyle = bandanaBase;
        context.ellipse(config.radius * 0.74, -config.radius * 0.04, config.radius * 0.1, config.radius * 0.22, -0.46, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.fillStyle = bandanaBase;
        context.ellipse(config.radius * 0.86, config.radius * 0.12, config.radius * 0.07, config.radius * 0.18, -0.12, 0, Math.PI * 2);
        context.fill();
    } else if (pirateVariant === 4) {
        context.beginPath();
        context.fillStyle = 'rgba(68, 37, 20, 0.98)';
        context.moveTo(-config.radius * 0.78, -config.radius * 0.76);
        context.quadraticCurveTo(-config.radius * 0.48, -config.radius * 1.16, -config.radius * 0.06, -config.radius * 1.06);
        context.quadraticCurveTo(config.radius * 0.14, -config.radius * 1.4, config.radius * 0.34, -config.radius * 1.04);
        context.quadraticCurveTo(config.radius * 0.58, -config.radius * 1.12, config.radius * 0.8, -config.radius * 0.76);
        context.quadraticCurveTo(config.radius * 0.28, -config.radius * 0.92, -config.radius * 0.12, -config.radius * 0.88);
        context.quadraticCurveTo(-config.radius * 0.42, -config.radius * 0.86, -config.radius * 0.78, -config.radius * 0.76);
        context.closePath();
        context.fill();

        context.beginPath();
        context.fillStyle = 'rgba(51, 29, 16, 0.98)';
        context.ellipse(0, -config.radius * 0.74, config.radius * 0.82, config.radius * 0.14, -0.04, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.strokeStyle = 'rgba(251, 191, 36, 0.68)';
        context.lineWidth = Math.max(1.2, config.radius * 0.036);
        context.moveTo(-config.radius * 0.3, -config.radius * 0.86);
        context.quadraticCurveTo(config.radius * 0.02, -config.radius * 0.96, config.radius * 0.28, -config.radius * 0.84);
        context.stroke();

        context.beginPath();
        context.fillStyle = 'rgba(245, 158, 11, 0.96)';
        context.fillRect(-config.radius * 0.06, -config.radius * 0.98, config.radius * 0.12, config.radius * 0.08);

        context.beginPath();
        context.fillStyle = 'rgba(255, 248, 220, 0.9)';
        context.arc(0, -config.radius * 0.94, Math.max(1.2, config.radius * 0.045), 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.strokeStyle = 'rgba(255,255,255,0.12)';
        context.lineWidth = Math.max(1, config.radius * 0.03);
        context.moveTo(-config.radius * 0.18, -config.radius * 1.02);
        context.quadraticCurveTo(config.radius * 0.02, -config.radius * 1.2, config.radius * 0.2, -config.radius * 1.04);
        context.stroke();
    } else {
        context.beginPath();
        context.strokeStyle = 'rgba(34,197,94,0.92)';
        context.lineWidth = Math.max(2, config.radius * 0.07);
        context.moveTo(0, -config.radius * 0.92);
        context.quadraticCurveTo(
            config.radius * 0.08,
            -config.radius * 1.18,
            config.radius * 0.26,
            -config.radius * 1.04
        );
        context.stroke();

        context.beginPath();
        context.fillStyle = 'rgba(74, 222, 128, 0.95)';
        context.ellipse(
            config.radius * 0.12,
            -config.radius * 0.96,
            config.radius * 0.18,
            config.radius * 0.1,
            0.45,
            0,
            Math.PI * 2
        );
        context.fill();
    }

    context.fillStyle = 'rgba(15, 23, 42, 0.92)';
    if (pirateVariant === 2 || pirateVariant === 4) {
        context.beginPath();
        context.lineWidth = Math.max(1.5, config.radius * 0.048);
        context.strokeStyle = 'rgba(127, 29, 29, 0.88)';
        context.moveTo(-eyeOffsetX - (config.radius * 0.2), eyeY - (config.radius * 0.16));
        context.lineTo(-eyeOffsetX + (config.radius * 0.2), eyeY + (config.radius * 0.14));
        context.moveTo(-eyeOffsetX - (config.radius * 0.18), eyeY + (config.radius * 0.14));
        context.lineTo(-eyeOffsetX + (config.radius * 0.22), eyeY - (config.radius * 0.12));
        context.stroke();
    }

    if (pirateVariant === 3) {
        context.beginPath();
        context.strokeStyle = 'rgba(15, 23, 42, 0.78)';
        context.lineWidth = Math.max(1.6, config.radius * 0.05);
        context.moveTo(-config.radius * 0.68, eyeY - (config.radius * 0.08));
        context.lineTo(eyeOffsetX - (config.radius * 0.2), eyeY - (config.radius * 0.04));
        context.moveTo(eyeOffsetX + (config.radius * 0.2), eyeY - (config.radius * 0.04));
        context.lineTo(config.radius * 0.68, eyeY - (config.radius * 0.08));
        context.stroke();

        context.beginPath();
        context.fillStyle = 'rgba(17, 24, 39, 0.98)';
        context.ellipse(eyeOffsetX, eyeY, Math.max(4, config.radius * 0.19), Math.max(4, config.radius * 0.15), -0.08, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.strokeStyle = 'rgba(255,255,255,0.14)';
        context.lineWidth = Math.max(0.9, config.radius * 0.024);
        context.moveTo(eyeOffsetX - (config.radius * 0.08), eyeY - (config.radius * 0.08));
        context.lineTo(eyeOffsetX + (config.radius * 0.06), eyeY - (config.radius * 0.16));
        context.stroke();
    } else {
        context.beginPath();
        context.ellipse(eyeOffsetX, eyeY, Math.max(2, config.radius * 0.1), Math.max(1.1, config.radius * 0.13 * blink), 0, 0, Math.PI * 2);
        context.fill();
    }

    context.beginPath();
    context.ellipse(-eyeOffsetX, eyeY, Math.max(2, config.radius * 0.1), Math.max(1.1, config.radius * 0.13 * blink), 0, 0, Math.PI * 2);
    context.fill();

    if (pirateVariant !== 3) {
        context.beginPath();
        context.ellipse(eyeOffsetX, eyeY, Math.max(2, config.radius * 0.1), Math.max(1.1, config.radius * 0.13 * blink), 0, 0, Math.PI * 2);
        context.fill();
    }

    context.beginPath();
    context.strokeStyle = 'rgba(15, 23, 42, 0.72)';
    context.lineWidth = Math.max(2, config.radius * 0.07);
    if (mouthCurve > 0) {
        context.arc(0, config.radius * 0.14, config.radius * 0.18, 0.15, Math.PI - 0.15);
    } else if (mouthCurve < 0) {
        context.arc(0, config.radius * 0.3, config.radius * 0.16, Math.PI * 1.12, Math.PI * 1.88);
    } else {
        context.moveTo(-config.radius * 0.14, config.radius * 0.22);
        context.lineTo(config.radius * 0.14, config.radius * 0.22);
    }
    context.stroke();

    if (pirateVariant === 0) {
        context.beginPath();
        context.strokeStyle = 'rgba(255,255,255,0.62)';
        context.lineWidth = Math.max(1, config.radius * 0.035);
        context.moveTo(config.radius * 0.1, config.radius * 0.02);
        context.lineTo(config.radius * 0.26, config.radius * 0.14);
        context.stroke();
    } else if (pirateVariant === 4) {
        context.beginPath();
        context.strokeStyle = 'rgba(120, 53, 15, 0.76)';
        context.lineWidth = Math.max(1.4, config.radius * 0.05);
        context.moveTo(config.radius * 0.04, config.radius * 0.02);
        context.quadraticCurveTo(config.radius * 0.18, config.radius * 0.16, config.radius * 0.34, config.radius * 0.08);
        context.stroke();
    }
    context.restore();
}

export function drawBaieBerry() {
    const { baieBerryContext, baieBerryCanvas } = dom();
    if (!baieBerryContext || !baieBerryState) {
        return;
    }

    const context = baieBerryContext;

    context.clearRect(0, 0, baieBerryCanvas.width, baieBerryCanvas.height);
    const backdrop = context.createLinearGradient(0, 0, 0, baieBerryCanvas.height);
    backdrop.addColorStop(0, '#dbeafe');
    backdrop.addColorStop(0.18, '#93c5fd');
    backdrop.addColorStop(0.65, '#38bdf8');
    backdrop.addColorStop(1, '#0f766e');
    context.fillStyle = backdrop;
    context.fillRect(0, 0, baieBerryCanvas.width, baieBerryCanvas.height);

    context.fillStyle = 'rgba(255,255,255,0.14)';
    for (let bubbleIndex = 0; bubbleIndex < 16; bubbleIndex += 1) {
        const drift = ((baieBerryState.elapsed || 0) * (8 + bubbleIndex)) % (baieBerryCanvas.height + 80);
        const x = 26 + (bubbleIndex * 21) % (baieBerryCanvas.width - 52);
        const y = baieBerryCanvas.height + 30 - drift;
        const radius = 3 + (bubbleIndex % 4) * 1.7;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
    }

    for (let kelpIndex = 0; kelpIndex < 6; kelpIndex += 1) {
        const baseX = 34 + (kelpIndex * 58);
        const sway = Math.sin((baieBerryState.elapsed || 0) * 1.8 + kelpIndex) * 8;
        context.beginPath();
        context.moveTo(baseX, baieBerryCanvas.height - 16);
        context.quadraticCurveTo(baseX + sway, baieBerryCanvas.height - 92, baseX - (sway * 0.6), baieBerryCanvas.height - 164);
        context.strokeStyle = 'rgba(16, 185, 129, 0.28)';
        context.lineWidth = 8;
        context.lineCap = 'round';
        context.stroke();
    }

    const dangerRatio = Math.min(1, baieBerryState.dangerTime / BAIE_BERRY_DANGER_DURATION_MS);
    if (dangerRatio > 0) {
        context.fillStyle = `rgba(239, 68, 68, ${0.08 + (dangerRatio * 0.18)})`;
        context.fillRect(0, 0, baieBerryCanvas.width, BAIE_BERRY_DANGER_LINE_Y + 8);
    }

    context.fillStyle = 'rgba(255,255,255,0.1)';
    context.fillRect(18, 12, baieBerryCanvas.width - 36, 6);
    context.fillStyle = 'rgba(255,255,255,0.08)';
    context.fillRect(12, baieBerryCanvas.height - 28, baieBerryCanvas.width - 24, 12);
    context.fillStyle = 'rgba(239, 68, 68, 0.16)';
    context.fillRect(18, BAIE_BERRY_DANGER_LINE_Y - 4, baieBerryCanvas.width - 36, 8);
    context.strokeStyle = `rgba(254, 202, 202, ${0.5 + (dangerRatio * 0.45)})`;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(18, BAIE_BERRY_DANGER_LINE_Y);
    context.lineTo(baieBerryCanvas.width - 18, BAIE_BERRY_DANGER_LINE_Y);
    context.stroke();

    baieBerryState.fruits.forEach((fruit) => {
        drawBaieBerryFruit(context, fruit);
    });

    baieBerryState.particles.forEach((particle) => {
        context.save();
        context.globalAlpha = Math.max(0, particle.life / particle.maxLife);
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
    });

    baieBerryState.scorePopups.forEach((popup) => {
        context.save();
        context.globalAlpha = popup.life;
        context.fillStyle = popup.color;
        context.font = '700 18px "Trebuchet MS", sans-serif';
        context.textAlign = 'center';
        context.fillText(popup.text, popup.x, popup.y);
        context.restore();
    });
}

export function getBaieBerryRulesText() {
    return 'Glisse la récolte en cliquant ou en touchant la colonne voulue. Deux fruits identiques fusionnent au simple contact, mais la ligne rouge ne doit jamais rester occupée trop longtemps.';
}

export function renderBaieBerryMenu() {
    const { baieBerryMenuOverlay, baieBerryTable, baieBerryGame, baieBerryNextDisplay, baieBerryDropGuide, baieBerryDropLine, baieBerryMenuEyebrow, baieBerryMenuTitle, baieBerryMenuText, baieBerryMenuActionButton, baieBerryMenuRulesButton } = dom();
    if (!baieBerryMenuOverlay || !baieBerryTable) {
        return;
    }

    syncGameMenuOverlayBounds(baieBerryMenuOverlay, baieBerryGame);
    baieBerryMenuOverlay.classList.toggle('hidden', !baieBerryMenuVisible);
    baieBerryMenuOverlay.classList.toggle('is-closing', baieBerryMenuClosing);
    baieBerryMenuOverlay.classList.toggle('is-entering', baieBerryMenuEntering);
    if (baieBerryGame) baieBerryGame.classList.toggle('is-menu-open', baieBerryMenuVisible);
    if (baieBerryNextDisplay) {
        baieBerryNextDisplay.style.opacity = baieBerryMenuVisible ? '0' : '1';
    }
    if (baieBerryDropGuide) {
        baieBerryDropGuide.style.opacity = baieBerryMenuVisible ? '0' : '1';
    }
    if (baieBerryDropLine) {
        baieBerryDropLine.style.opacity = baieBerryMenuVisible ? '0' : '0.92';
    }

    if (!baieBerryMenuVisible) {
        return;
    }

    const currentScore = baieBerryState?.score ?? 0;
    const objectiveLabel = baieBerryState?.objective?.label ?? 'Atteins 1500 points';
    const objectiveStatus = baieBerryState?.objective?.completed ? 'Objectif accompli.' : `Objectif du jour: ${objectiveLabel}.`;

    if (baieBerryMenuEyebrow) {
        baieBerryMenuEyebrow.textContent = baieBerryMenuShowingRules ? 'R\u00e8gles' : (baieBerryMenuResult ? 'Fin de r\u00e9colte' : "Baie d'arcade");
    }
    if (baieBerryMenuTitle) {
        baieBerryMenuTitle.textContent = baieBerryMenuShowingRules
            ? 'Rappel rapide'
            : (baieBerryMenuResult ? 'Recolte termin\u00e9e' : 'BaieBerry');
    }
    if (baieBerryMenuText) {
        baieBerryMenuText.textContent = baieBerryMenuShowingRules
            ? getBaieBerryRulesText()
            : (baieBerryMenuResult
                ? `Score ${currentScore}. ${objectiveStatus} La ligne rouge est restée occupée trop longtemps.`
                : 'Prepare ta r\u00e9colte avant de laisser tomber les fruits dans le panier.');
    }
    if (baieBerryMenuActionButton) {
        baieBerryMenuActionButton.textContent = baieBerryMenuShowingRules
            ? 'Retour'
            : (baieBerryMenuResult ? 'Relancer la partie' : 'Lancer la partie');
    }
    if (baieBerryMenuRulesButton) {
        baieBerryMenuRulesButton.textContent = 'R\u00e8gles';
        baieBerryMenuRulesButton.hidden = baieBerryMenuShowingRules;
    }
}

export function startBaieBerryLaunchSequence() {
    baieBerryMenuClosing = true;
    renderBaieBerryMenu();
    window.setTimeout(() => {
        const { baieBerryCanvas } = dom();
        baieBerryMenuClosing = false;
        baieBerryMenuVisible = false;
        baieBerryMenuShowingRules = false;
        baieBerryMenuEntering = false;
        baieBerryMenuResult = false;
        refreshBaieBerryHud();
        updateBaieBerryDropGuide(baieBerryLastPointerX ?? (baieBerryCanvas.width / 2));
        if (!baieBerryAnimationFrame) {
            baieBerryAnimationFrame = window.requestAnimationFrame(updateBaieBerry);
        }
        renderBaieBerryMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealBaieBerryOutcomeMenu() {
    baieBerryMenuShowingRules = false;
    baieBerryMenuClosing = false;
    baieBerryMenuEntering = true;
    baieBerryMenuVisible = true;
    baieBerryMenuResult = true;
    renderBaieBerryMenu();
    window.setTimeout(() => {
        baieBerryMenuEntering = false;
        renderBaieBerryMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeBaieBerry() {
    closeGameOverModal();
    stopBaieBerry();
    if (baieBerryDropLineTimer) {
        window.clearTimeout(baieBerryDropLineTimer);
        baieBerryDropLineTimer = null;
    }
    baieBerryState = {
        fruits: [],
        nextQueue: [getRandomBaieBerryIndex(), getRandomBaieBerryIndex()],
        score: 0,
        gameOver: false,
        dangerTime: 0,
        comboCount: 0,
        comboExpiresAt: 0,
        objective: getRandomBaieBerryObjective(),
        particles: [],
        scorePopups: [],
        shake: 0,
        elapsed: 0
    };
    const { baieBerryCanvas, baieBerryHelpText } = dom();
    baieBerryLastFrame = 0;
    baieBerryLastPointerX = baieBerryCanvas ? baieBerryCanvas.width / 2 : null;
    baieBerryLastDropAt = 0;
    baieBerryMenuVisible = true;
    baieBerryMenuShowingRules = false;
    baieBerryMenuClosing = false;
    baieBerryMenuEntering = false;
    baieBerryMenuResult = false;
    refreshBaieBerryHud();
    if (baieBerryHelpText) baieBerryHelpText.textContent = 'Surveille la ligne rouge et vise une grande chaine de fusions.';
    updateBaieBerryDropGuide();
    drawBaieBerry();
    renderBaieBerryMenu();
}

export function stopBaieBerry() {
    if (baieBerryAnimationFrame) {
        window.cancelAnimationFrame(baieBerryAnimationFrame);
        baieBerryAnimationFrame = null;
    }
    if (baieBerryDropLineTimer) {
        window.clearTimeout(baieBerryDropLineTimer);
        baieBerryDropLineTimer = null;
    }
    baieBerryLastFrame = 0;
    const { baieBerryStage } = dom();
    if (baieBerryStage) {
        baieBerryStage.style.transform = 'translate(0, 0)';
    }
}

export function dropBaieBerryAt(x) {
    if (!baieBerryState || baieBerryState.gameOver) {
        return;
    }

    const { baieBerryCanvas, baieBerryDropLine } = dom();
    const now = performance.now();
    if ((now - baieBerryLastDropAt) < BAIE_BERRY_DROP_COOLDOWN_MS) {
        return;
    }
    baieBerryLastDropAt = now;
    if (!baieBerryAnimationFrame) {
        baieBerryAnimationFrame = window.requestAnimationFrame(updateBaieBerry);
    }

    baieBerryLastPointerX = x;
    if (baieBerryDropLine) {
        baieBerryDropLine.style.opacity = '0';
    }
    if (baieBerryDropLineTimer) {
        window.clearTimeout(baieBerryDropLineTimer);
        baieBerryDropLineTimer = null;
    }

    const level = baieBerryState.nextQueue[0];
    const radius = BAIE_BERRY_FRUITS[level].radius;
    baieBerryState.fruits.push({
        id: baieBerryNextFruitId++,
        x: Math.max(radius, Math.min(baieBerryCanvas.width - radius, x)),
        y: radius + 4,
        vx: 0,
        vy: 0,
        spawnedAt: now,
        rotation: 0,
        mergeProgress: 0,
        blink: 1,
        expression: 'focused',
        level
    });
    baieBerryState.nextQueue = [baieBerryState.nextQueue[1], getRandomBaieBerryIndex()];
    refreshBaieBerryHud();
    updateBaieBerryDropGuide(baieBerryLastPointerX ?? x);
    if (baieBerryDropLine) {
        baieBerryDropLine.style.opacity = '0';
    }
    baieBerryDropLineTimer = window.setTimeout(() => {
        baieBerryDropLineTimer = null;
        if (!baieBerryState?.gameOver && !baieBerryMenuVisible && !baieBerryMenuClosing) {
            updateBaieBerryDropGuide(baieBerryLastPointerX ?? x);
        }
    }, 220);
}

export function updateBaieBerry(timestamp) {
    if (!baieBerryState) {
        return;
    }

    const { baieBerryCanvas, baieBerryHelpText, baieBerryStage } = dom();

    if (!baieBerryLastFrame) {
        baieBerryLastFrame = timestamp;
    }

    const delta = Math.min(0.032, (timestamp - baieBerryLastFrame) / 1000);
    baieBerryLastFrame = timestamp;
    baieBerryState.elapsed += delta;

    if (!baieBerryState.gameOver) {
        baieBerryState.fruits.forEach((fruit) => {
            const radius = BAIE_BERRY_FRUITS[fruit.level].radius;
            fruit.vy += 620 * delta;
            fruit.x += fruit.vx * delta;
            fruit.y += fruit.vy * delta;
            fruit.rotation = (fruit.rotation || 0) + ((fruit.vx * delta) / Math.max(12, radius));
            fruit.vx *= fruit.y >= baieBerryCanvas.height - radius - 1 ? 0.992 : 0.998;
            fruit.mergeProgress = 0;
            fruit.blink = Math.sin((baieBerryState.elapsed * 2.4) + fruit.id) > 0.96 ? 0.18 : 1;
            fruit.expression = Math.abs(fruit.vy) < 35 ? 'happy' : 'focused';

            if (fruit.x < radius || fruit.x > baieBerryCanvas.width - radius) {
                fruit.x = Math.max(radius, Math.min(baieBerryCanvas.width - radius, fruit.x));
                fruit.vx *= -0.35;
            }

            if (fruit.y > baieBerryCanvas.height - radius) {
                fruit.y = baieBerryCanvas.height - radius;
                fruit.vy *= -0.18;
                fruit.vx *= 0.98;
            }
        });

        for (let index = 0; index < baieBerryState.fruits.length; index += 1) {
            const fruitA = baieBerryState.fruits[index];
            for (let compareIndex = index + 1; compareIndex < baieBerryState.fruits.length; compareIndex += 1) {
                const fruitB = baieBerryState.fruits[compareIndex];
                const radiusA = BAIE_BERRY_FRUITS[fruitA.level].radius;
                const radiusB = BAIE_BERRY_FRUITS[fruitB.level].radius;
                const dx = fruitB.x - fruitA.x;
                const dy = fruitB.y - fruitA.y;
                const distance = Math.hypot(dx, dy) || 0.001;
                const minDistance = radiusA + radiusB;

                if (distance < minDistance) {
                    const overlap = minDistance - distance;
                    const nx = dx / distance;
                    const ny = dy / distance;
                    fruitA.x -= nx * overlap * 0.5;
                    fruitA.y -= ny * overlap * 0.5;
                    fruitB.x += nx * overlap * 0.5;
                    fruitB.y += ny * overlap * 0.5;
                    const sidePush = overlap * 7;
                    fruitA.vx -= nx * sidePush;
                    fruitB.vx += nx * sidePush;
                    fruitA.vy *= 0.94;
                    fruitB.vy *= 0.94;

                    if (fruitA.level === fruitB.level && fruitA.level < BAIE_BERRY_FRUITS.length - 1) {
                        const nextLevel = fruitA.level + 1;
                        const now = performance.now();
                        baieBerryState.comboCount = baieBerryState.comboExpiresAt > now
                            ? baieBerryState.comboCount + 1
                            : 1;
                        baieBerryState.comboExpiresAt = now + BAIE_BERRY_COMBO_WINDOW_MS;
                        const comboBonus = baieBerryState.comboCount > 1 ? baieBerryState.comboCount * 35 : 0;
                        baieBerryState.score += BAIE_BERRY_FRUITS[nextLevel].score + comboBonus;
                        const mergeX = (fruitA.x + fruitB.x) / 2;
                        const mergeY = (fruitA.y + fruitB.y) / 2;
                        baieBerryState.fruits.splice(compareIndex, 1);
                        baieBerryState.fruits.splice(index, 1, {
                            id: baieBerryNextFruitId++,
                            x: mergeX,
                            y: mergeY,
                            vx: (fruitA.vx + fruitB.vx) * 0.15,
                            vy: Math.min(fruitA.vy, fruitB.vy, 0) - 90,
                            rotation: ((fruitA.rotation || 0) + (fruitB.rotation || 0)) / 2,
                            mergeProgress: 0.9,
                            blink: 1,
                            expression: 'happy',
                            level: nextLevel
                        });
                        addBaieBerryParticles(mergeX, mergeY, BAIE_BERRY_FRUITS[nextLevel].color, 18 + (baieBerryState.comboCount * 3));
                        addBaieBerryScorePopup(
                            mergeX,
                            mergeY - 10,
                            comboBonus ? `+${BAIE_BERRY_FRUITS[nextLevel].score + comboBonus}` : `+${BAIE_BERRY_FRUITS[nextLevel].score}`,
                            '#fde68a'
                        );
                        if (baieBerryState.comboCount > 1) {
                            addBaieBerryScorePopup(
                                mergeX,
                                mergeY - 34,
                                `x${baieBerryState.comboCount}`,
                                '#e2e8f0'
                            );
                        }
                        baieBerryState.shake = Math.min(18, 8 + (nextLevel * 1.8) + (baieBerryState.comboCount * 1.5));
                        if (baieBerryHelpText) baieBerryHelpText.textContent = baieBerryState.comboCount > 1
                            ? `Combo x${baieBerryState.comboCount}. Les fusions s enchainent.`
                            : `Fusion ${BAIE_BERRY_FRUITS[nextLevel].name}. Continue la r\u00e9colte.`;
                        refreshBaieBerryHud();
                        updateBaieBerryObjective(nextLevel);
                        if (baieBerryState.score > baieBerryBestScore) {
                            baieBerryBestScore = baieBerryState.score;
                            window.localStorage.setItem(BAIE_BERRY_BEST_KEY, String(baieBerryBestScore));
                        }
                        break;
                    }
                }
            }
        }

        const dangerNow = performance.now();
        const touchesDangerLine = baieBerryState.fruits.some((fruit) => (
            (dangerNow - (fruit.spawnedAt || 0)) >= BAIE_BERRY_DANGER_GRACE_MS
            && (fruit.y - BAIE_BERRY_FRUITS[fruit.level].radius) <= BAIE_BERRY_DANGER_LINE_Y
        ));
        baieBerryState.dangerTime = touchesDangerLine
            ? Math.min(BAIE_BERRY_DANGER_DURATION_MS, baieBerryState.dangerTime + (delta * 1000))
            : Math.max(0, baieBerryState.dangerTime - (delta * 700));

        baieBerryState.particles = baieBerryState.particles.filter((particle) => {
            particle.x += particle.vx * delta;
            particle.y += particle.vy * delta;
            particle.vy += 220 * delta;
            particle.life -= delta;
            return particle.life > 0;
        });

        baieBerryState.scorePopups = baieBerryState.scorePopups.filter((popup) => {
            popup.y += popup.vy * delta;
            popup.life -= delta * 1.2;
            return popup.life > 0;
        });

        baieBerryState.shake *= BAIE_BERRY_SHAKE_DECAY;
        if (baieBerryStage) {
            const intensity = baieBerryState.shake;
            baieBerryStage.style.transform = intensity > 0.2
                ? `translate(${(Math.random() - 0.5) * intensity}px, ${(Math.random() - 0.5) * intensity}px)`
                : 'translate(0, 0)';
        }

        if (baieBerryState.dangerTime >= BAIE_BERRY_DANGER_DURATION_MS) {
            baieBerryState.gameOver = true;
            if (baieBerryHelpText) baieBerryHelpText.textContent = `Récolte terminée. Score ${baieBerryState.score}. La ligne rouge est restée occupée trop longtemps.`;
            revealBaieBerryOutcomeMenu();
        }
    }

    drawBaieBerry();
    baieBerryAnimationFrame = window.requestAnimationFrame(updateBaieBerry);
}

export function getBaieBerryState() { return baieBerryState; }
export function getBaieBerryMenuVisible() { return baieBerryMenuVisible; }
export function setBaieBerryMenuVisible(v) { baieBerryMenuVisible = Boolean(v); }
export function setBaieBerryMenuShowingRules(v) { baieBerryMenuShowingRules = Boolean(v); }
export function getBaieBerryLastPointerX() { return baieBerryLastPointerX; }
export function setBaieBerryLastPointerX(v) { baieBerryLastPointerX = v; }
