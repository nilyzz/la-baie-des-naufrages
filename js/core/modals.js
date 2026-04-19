// Shared modals for La Baie des Naufragés: legal notice + generic game over.
// Extracted from script.js during the ES-modules migration.
//
// DOM references are resolved lazily (on each call) to avoid any race with
// DOMContentLoaded and to keep the module safe to import early.
//
// Note: script.js's IIFE has a small override in its own `openGameOverModal`
// that routes 2048 to `reveal2048OutcomeMenu()`. That special case is NOT
// replicated here; it remains inside script.js until the 2048 game module
// itself is extracted. Current main.js does not call the pure version yet.

import { LEGAL_NOTICE_ANIMATION_MS } from './constants.js';

function getLegalNoticeModal() {
    return document.getElementById('legalNoticeModal');
}

function getCloseLegalNoticeButton() {
    return document.getElementById('closeLegalNoticeButton');
}

function getOpenLegalNoticeButton() {
    return document.getElementById('openLegalNoticeButton');
}

function getGameOverModal() {
    return document.getElementById('gameOverModal');
}

function getGameOverTitle() {
    return document.getElementById('gameOverTitle');
}

function getGameOverText() {
    return document.getElementById('gameOverText');
}

/**
 * Shows the legal-notice modal with a fade-in. Focuses the close button.
 */
export function openLegalNoticeModal() {
    const legalNoticeModal = getLegalNoticeModal();
    if (!legalNoticeModal) {
        return;
    }

    legalNoticeModal.classList.remove('hidden');
    window.requestAnimationFrame(() => {
        legalNoticeModal.classList.add('modal-visible');
    });
    legalNoticeModal.setAttribute('aria-hidden', 'false');
    getCloseLegalNoticeButton()?.focus();
}

/**
 * Hides the legal-notice modal with a fade-out, then restores focus on the
 * opener button once the animation has played out.
 */
export function closeLegalNoticeModal() {
    const legalNoticeModal = getLegalNoticeModal();
    if (!legalNoticeModal) {
        return;
    }

    legalNoticeModal.classList.remove('modal-visible');
    legalNoticeModal.setAttribute('aria-hidden', 'true');

    window.setTimeout(() => {
        if (!legalNoticeModal.classList.contains('modal-visible')) {
            legalNoticeModal.classList.add('hidden');
            getOpenLegalNoticeButton()?.focus();
        }
    }, LEGAL_NOTICE_ANIMATION_MS);
}

/**
 * Pure version of the generic game-over modal (no per-game override).
 * The script.js IIFE keeps its own copy that additionally routes 2048
 * through reveal2048OutcomeMenu(); that hook stays there until 2048 is
 * extracted on its own.
 */
export function openGameOverModal(title = "C'est perdu", text = "Le joueur s'est noyé.") {
    const gameOverModal = getGameOverModal();
    const gameOverTitle = getGameOverTitle();
    const gameOverText = getGameOverText();
    if (!gameOverModal || !gameOverTitle || !gameOverText) {
        return;
    }

    gameOverTitle.textContent = title;
    gameOverText.textContent = text;
    gameOverModal.classList.remove('hidden');
    gameOverModal.setAttribute('aria-hidden', 'false');
}

export function closeGameOverModal() {
    const gameOverModal = getGameOverModal();
    if (!gameOverModal) {
        return;
    }

    gameOverModal.classList.add('hidden');
    gameOverModal.setAttribute('aria-hidden', 'true');
}
