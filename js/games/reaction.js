// Game module — Reaction (Veille au phare).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';

export const REACTION_BEST_KEY = 'baie-des-naufrages-reaction-best';

let reactionState = 'idle';
let reactionBestTime = (typeof window !== 'undefined' ? Number(window.localStorage.getItem(REACTION_BEST_KEY)) : 0) || null;
let reactionStartTime = 0;
let reactionTimeout = null;
let reactionMenuVisible = true;
let reactionMenuShowingRules = false;
let reactionMenuClosing = false;
let reactionMenuEntering = false;
let reactionMenuResult = null;

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        reactionLastDisplay: $('reactionLastDisplay'),
        reactionBestDisplay: $('reactionBestDisplay'),
        reactionHelpText: $('reactionHelpText'),
        reactionTable: $('reactionTable'),
        reactionLantern: $('reactionLantern'),
        reactionMenuOverlay: $('reactionMenuOverlay'),
        reactionMenuEyebrow: $('reactionMenuEyebrow'),
        reactionMenuTitle: $('reactionMenuTitle'),
        reactionMenuText: $('reactionMenuText'),
        reactionMenuActionButton: $('reactionMenuActionButton'),
        reactionMenuRulesButton: $('reactionMenuRulesButton')
    };
}

export function initializeReaction() {
    reactionState = 'idle';
    reactionStartTime = 0;
    window.clearTimeout(reactionTimeout);
    const { reactionLantern, reactionTable, reactionBestDisplay, reactionHelpText } = dom();
    reactionLantern?.classList.remove('is-armed', 'is-lit');
    reactionTable?.classList.remove('is-armed', 'is-lit', 'is-extinguishing');
    if (reactionBestDisplay) reactionBestDisplay.textContent = reactionBestTime ? `${reactionBestTime} ms` : '-';
    if (reactionHelpText) reactionHelpText.textContent = "Attends que la lanterne s'allume, puis clique le plus vite possible.";
    reactionMenuResult = null;
    reactionMenuShowingRules = false;
    reactionMenuClosing = false;
    reactionMenuEntering = false;
    renderReactionMenu();
}

export function getReactionRulesText() {
    return "Lance une veille puis attends que la lanterne s'allume. Clique uniquement au bon moment. Un clic trop tôt annule la manche.";
}

export function getReactionPerformanceCopy(reactionTime, isRecord) {
    if (isRecord || reactionTime <= 220) {
        return {
            eyebrow: isRecord ? 'Meilleur temps' : 'Réflexe légendaire',
            title: isRecord ? 'Nouveau record' : 'Réflexe légendaire',
            text: `Réflexe éclair en ${reactionTime} ms. Le phare n'a même pas eu le temps de trembler.`
        };
    }
    if (reactionTime <= 300) {
        return {
            eyebrow: 'Tres bon temps',
            title: 'Veille termin\u00e9e',
            text: `Belle r\u00e9ponse en ${reactionTime} ms. Tu tiens bien la veille du pont.`
        };
    }
    if (reactionTime <= 420) {
        return {
            eyebrow: 'Reflexe valide',
            title: 'Veille termin\u00e9e',
            text: `Reflexe enregistre en ${reactionTime} ms. Relance pour aller chercher un meilleur temps.`
        };
    }
    return {
        eyebrow: 'Peut mieux faire',
        title: 'Veille termin\u00e9e',
        text: `Temps releve a ${reactionTime} ms. La prochaine lanterne peut tomber plus vite.`
    };
}

export function renderReactionMenu() {
    const { reactionMenuOverlay, reactionTable, reactionMenuEyebrow, reactionMenuTitle, reactionMenuText, reactionMenuActionButton, reactionMenuRulesButton } = dom();
    if (!reactionMenuOverlay || !reactionTable) return;

    syncGameMenuOverlayBounds(reactionMenuOverlay, reactionTable);
    reactionMenuOverlay.classList.toggle('hidden', !reactionMenuVisible);
    reactionMenuOverlay.classList.toggle('is-closing', reactionMenuClosing);
    reactionMenuOverlay.classList.toggle('is-entering', reactionMenuEntering);
    reactionTable.classList.toggle('is-menu-open', reactionMenuVisible);

    if (!reactionMenuVisible) return;

    const hasResult = Boolean(reactionMenuResult);
    if (reactionMenuEyebrow) {
        reactionMenuEyebrow.textContent = reactionMenuShowingRules ? 'R\u00e8gles' : (hasResult ? reactionMenuResult.eyebrow : 'Veille au phare');
    }
    if (reactionMenuTitle) {
        reactionMenuTitle.textContent = reactionMenuShowingRules ? 'Rappel rapide' : (hasResult ? reactionMenuResult.title : 'R\u00e9action');
    }
    if (reactionMenuText) {
        reactionMenuText.textContent = reactionMenuShowingRules
            ? getReactionRulesText()
            : (hasResult
                ? reactionMenuResult.text
                : "Reste calme sur le pont et clique dès que la lanterne s'allume pour signer le meilleur réflexe.");
    }
    if (reactionMenuActionButton) {
        reactionMenuActionButton.textContent = reactionMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la veille' : 'Lancer la veille');
    }
    if (reactionMenuRulesButton) {
        reactionMenuRulesButton.textContent = 'R\u00e8gles';
        reactionMenuRulesButton.hidden = reactionMenuShowingRules;
    }
}

export function closeReactionMenu() {
    reactionMenuClosing = true;
    renderReactionMenu();
    window.setTimeout(() => {
        reactionMenuClosing = false;
        reactionMenuVisible = false;
        reactionMenuShowingRules = false;
        reactionMenuEntering = false;
        reactionMenuResult = null;
        renderReactionMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealReactionOutcomeMenu(title, text, eyebrow) {
    reactionMenuVisible = true;
    reactionMenuResult = { title, text, eyebrow };
    reactionMenuShowingRules = false;
    reactionMenuClosing = false;
    reactionMenuEntering = true;
    const { reactionHelpText } = dom();
    if (reactionHelpText) reactionHelpText.textContent = text;
    renderReactionMenu();
    window.setTimeout(() => {
        reactionMenuEntering = false;
        renderReactionMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function startReactionRound() {
    initializeReaction();
    reactionState = 'armed';
    const { reactionLantern, reactionTable, reactionHelpText } = dom();
    reactionLantern?.classList.add('is-armed');
    reactionTable?.classList.add('is-armed');
    if (reactionHelpText) reactionHelpText.textContent = "Patiente... la lanterne va s'allumer.";
    reactionTimeout = window.setTimeout(() => {
        reactionState = 'lit';
        const refs = dom();
        refs.reactionLantern?.classList.remove('is-armed');
        refs.reactionLantern?.classList.add('is-lit');
        refs.reactionTable?.classList.remove('is-armed');
        refs.reactionTable?.classList.add('is-lit');
        reactionStartTime = performance.now();
        if (refs.reactionHelpText) refs.reactionHelpText.textContent = 'Clique vite, la lanterne est allumée.';
    }, 1200 + Math.random() * 2400);
}

export function handleReactionAttempt() {
    if (reactionState === 'armed') {
        window.clearTimeout(reactionTimeout);
        initializeReaction();
        revealReactionOutcomeMenu(
            'Faux départ',
            "Trop tôt. Attends vraiment l'allumage de la lanterne avant de cliquer.",
            'Veille annulée'
        );
        return;
    }

    if (reactionState !== 'lit') {
        return;
    }

    const reactionTime = Math.round(performance.now() - reactionStartTime);
    reactionState = 'done';
    const { reactionLantern, reactionTable, reactionLastDisplay, reactionBestDisplay } = dom();
    reactionLantern?.classList.remove('is-lit');
    reactionTable?.classList.remove('is-lit');
    reactionTable?.classList.add('is-extinguishing');
    window.setTimeout(() => {
        const t = $('reactionTable');
        t?.classList.remove('is-extinguishing');
    }, 430);
    if (reactionLastDisplay) reactionLastDisplay.textContent = `${reactionTime} ms`;
    const isRecord = !reactionBestTime || reactionTime < reactionBestTime;
    if (!reactionBestTime || reactionTime < reactionBestTime) {
        reactionBestTime = reactionTime;
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(REACTION_BEST_KEY, String(reactionBestTime));
        }
    }
    if (reactionBestDisplay) reactionBestDisplay.textContent = reactionBestTime ? `${reactionBestTime} ms` : '-';
    const reactionCopy = getReactionPerformanceCopy(reactionTime, isRecord);
    revealReactionOutcomeMenu(reactionCopy.title, reactionCopy.text, reactionCopy.eyebrow);
}

export function setReactionMenuVisible(visible) {
    reactionMenuVisible = Boolean(visible);
}

export function setReactionMenuShowingRules(showing) {
    reactionMenuShowingRules = Boolean(showing);
}

export function getReactionMenuVisible() {
    return reactionMenuVisible;
}

export function getReactionMenuClosing() {
    return reactionMenuClosing;
}

export function getReactionMenuShowingRules() {
    return reactionMenuShowingRules;
}
