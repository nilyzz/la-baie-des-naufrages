// Game module — Coin Clicker (Trésor du capitaine).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';

export const COIN_CLICKER_STORAGE_KEY = 'baie-des-naufrages-coin-clicker';

export const COIN_CLICKER_UPGRADES = [
    { id: 'captain', label: 'Capitaine', baseCost: 15, effectType: 'click', bonus: 1, description: '+1 par clic' },
    { id: 'hook', label: 'Crochet en or', baseCost: 60, effectType: 'multiplier', bonus: 0.2, description: '+0,20 multiplicateur' },
    { id: 'parrot', label: 'Perroquet mousse', baseCost: 110, effectType: 'auto', bonus: 1, description: '+1 pièce / sec' },
    { id: 'harbor', label: 'Port marchand', baseCost: 260, effectType: 'auto', bonus: 4, description: '+4 pièces / sec' },
    { id: 'fleet', label: 'Flotte dorée', baseCost: 420, effectType: 'click', bonus: 8, description: '+8 par clic' },
    { id: 'treasury', label: 'Trésor royal', baseCost: 760, effectType: 'multiplier', bonus: 0.5, description: '+0,50 multiplicateur' }
];

let coinClickerMenuVisible = true;
let coinClickerMenuShowingRules = false;
let coinClickerMenuClosing = false;
let coinClickerMenuEntering = false;
let coinClickerState = {
    coins: 0,
    clickPower: 1,
    multiplier: 1,
    autoPower: 0,
    upgrades: Object.fromEntries(COIN_CLICKER_UPGRADES.map((upgrade) => [upgrade.id, 0]))
};
let coinClickerAutoTimer = null;
let coinClickerLastAutoTick = (typeof performance !== 'undefined' ? performance.now() : 0);

let activeGameTabAccessor = () => null;
export function setCoinClickerActiveGameTabAccessor(accessor) {
    if (typeof accessor === 'function') {
        activeGameTabAccessor = accessor;
    }
}

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        coinClickerTable: $('coinClickerTable'),
        coinClickerScoreDisplay: $('coinClickerScoreDisplay'),
        coinClickerPowerDisplay: $('coinClickerPowerDisplay'),
        coinClickerMultiplierDisplay: $('coinClickerMultiplierDisplay'),
        coinClickerAutoDisplay: $('coinClickerAutoDisplay'),
        coinClickerHelpText: $('coinClickerHelpText'),
        coinClickerShop: $('coinClickerShop'),
        coinClickerMenuOverlay: $('coinClickerMenuOverlay'),
        coinClickerMenuEyebrow: $('coinClickerMenuEyebrow'),
        coinClickerMenuTitle: $('coinClickerMenuTitle'),
        coinClickerMenuText: $('coinClickerMenuText'),
        coinClickerMenuActionButton: $('coinClickerMenuActionButton'),
        coinClickerMenuRulesButton: $('coinClickerMenuRulesButton')
    };
}

export function loadCoinClickerState() {
    try {
        const storedState = JSON.parse(window.localStorage.getItem(COIN_CLICKER_STORAGE_KEY) || 'null');

        if (!storedState) {
            return;
        }

        coinClickerState.coins = Number(storedState.coins) || 0;
        coinClickerState.clickPower = Number(storedState.clickPower) || 1;
        coinClickerState.multiplier = Math.max(1, Number(storedState.multiplier) || 1);
        coinClickerState.autoPower = Math.max(0, Number(storedState.autoPower) || 0);
        COIN_CLICKER_UPGRADES.forEach((upgrade) => {
            coinClickerState.upgrades[upgrade.id] = Number(storedState.upgrades?.[upgrade.id]) || 0;
        });
    } catch (error) {
        console.error('Impossible de relire Coin Clicker.', error);
    }
}

export function saveCoinClickerState() {
    window.localStorage.setItem(COIN_CLICKER_STORAGE_KEY, JSON.stringify(coinClickerState));
}

export function getCoinClickerUpgradeCost(upgrade) {
    return Math.round(upgrade.baseCost * (1.7 ** (coinClickerState.upgrades[upgrade.id] || 0)));
}

export function getCoinClickerCoinsPerClick() {
    return coinClickerState.clickPower * coinClickerState.multiplier;
}

export function getCoinClickerCoinsPerSecond() {
    return coinClickerState.autoPower * coinClickerState.multiplier;
}

export function renderCoinClicker() {
    const {
        coinClickerScoreDisplay,
        coinClickerPowerDisplay,
        coinClickerMultiplierDisplay,
        coinClickerAutoDisplay,
        coinClickerShop
    } = dom();
    coinClickerScoreDisplay.textContent = Math.floor(coinClickerState.coins).toLocaleString('fr-FR');
    coinClickerPowerDisplay.textContent = getCoinClickerCoinsPerClick().toLocaleString('fr-FR', {
        minimumFractionDigits: getCoinClickerCoinsPerClick() % 1 === 0 ? 0 : 1,
        maximumFractionDigits: 1
    });
    coinClickerMultiplierDisplay.textContent = `x${coinClickerState.multiplier.toFixed(2)}`;
    coinClickerAutoDisplay.textContent = getCoinClickerCoinsPerSecond().toLocaleString('fr-FR', {
        minimumFractionDigits: getCoinClickerCoinsPerSecond() % 1 === 0 ? 0 : 1,
        maximumFractionDigits: 1
    });
    coinClickerShop.innerHTML = COIN_CLICKER_UPGRADES.map((upgrade) => {
        const cost = getCoinClickerUpgradeCost(upgrade);
        const level = coinClickerState.upgrades[upgrade.id] || 0;
        return `
            <button type="button" class="coinclicker-upgrade ${coinClickerState.coins < cost ? 'is-disabled' : ''}" data-coin-upgrade="${upgrade.id}">
                <span class="coinclicker-upgrade-title">${upgrade.label}</span>
                <strong class="coinclicker-upgrade-bonus">${upgrade.description}</strong>
                <span class="coinclicker-upgrade-meta">Niveau ${level} Â· ${cost} pieces</span>
            </button>
        `;
    }).join('');
}

export function startCoinClickerAutoLoop() {
    if (coinClickerAutoTimer) {
        return;
    }

    coinClickerLastAutoTick = performance.now();
    coinClickerAutoTimer = window.setInterval(() => {
        const now = performance.now();
        const deltaSeconds = (now - coinClickerLastAutoTick) / 1000;
        coinClickerLastAutoTick = now;
        const passiveGain = getCoinClickerCoinsPerSecond() * deltaSeconds;

        if (passiveGain <= 0) {
            return;
        }

        coinClickerState.coins += passiveGain;
        saveCoinClickerState();
        renderCoinClicker();
    }, 250);
}

export function getCoinClickerRulesText() {
    return 'Clique la pi\u00e8ce pour ajouter des pi\u00e8ces au coffre du capitaine. D\u00e9pense-les dans la boutique du navire pour augmenter le gain par clic, le multiplicateur et le rendement automatique. Ta fortune est sauvegard\u00e9e ; "Nouvelle fortune" remet tout \u00e0 z\u00e9ro.';
}

export function renderCoinClickerMenu() {
    const {
        coinClickerMenuOverlay,
        coinClickerTable,
        coinClickerMenuEyebrow,
        coinClickerMenuTitle,
        coinClickerMenuText,
        coinClickerMenuActionButton,
        coinClickerMenuRulesButton
    } = dom();
    if (!coinClickerMenuOverlay || !coinClickerTable) {
        return;
    }

    syncGameMenuOverlayBounds(coinClickerMenuOverlay, coinClickerTable);
    coinClickerMenuOverlay.classList.toggle('hidden', !coinClickerMenuVisible);
    coinClickerMenuOverlay.classList.toggle('is-closing', coinClickerMenuClosing);
    coinClickerMenuOverlay.classList.toggle('is-entering', coinClickerMenuEntering);
    coinClickerTable.classList.toggle('is-menu-open', coinClickerMenuVisible);

    if (!coinClickerMenuVisible) {
        return;
    }

    if (coinClickerMenuEyebrow) {
        coinClickerMenuEyebrow.textContent = coinClickerMenuShowingRules
            ? 'R\u00e8gles'
            : 'Tr\u00e9sor du capitaine';
    }

    if (coinClickerMenuTitle) {
        coinClickerMenuTitle.textContent = coinClickerMenuShowingRules
            ? 'Rappel rapide'
            : 'Coin Clicker';
    }

    if (coinClickerMenuText) {
        coinClickerMenuText.textContent = coinClickerMenuShowingRules
            ? getCoinClickerRulesText()
            : 'Clique sur la pi\u00e8ce pour remplir le coffre, puis automatise ton butin gr\u00e2ce \u00e0 la boutique du navire.';
    }

    if (coinClickerMenuActionButton) {
        coinClickerMenuActionButton.textContent = coinClickerMenuShowingRules
            ? 'Retour'
            : 'Lancer la fortune';
    }

    if (coinClickerMenuRulesButton) {
        coinClickerMenuRulesButton.textContent = 'R\u00e8gles';
        coinClickerMenuRulesButton.hidden = coinClickerMenuShowingRules;
    }
}

export function closeCoinClickerMenu() {
    coinClickerMenuClosing = true;
    renderCoinClickerMenu();
    window.setTimeout(() => {
        coinClickerMenuClosing = false;
        coinClickerMenuVisible = false;
        coinClickerMenuShowingRules = false;
        coinClickerMenuEntering = false;
        renderCoinClickerMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeCoinClicker(reset = false) {
    if (reset) {
        coinClickerState = {
            coins: 0,
            clickPower: 1,
            multiplier: 1,
            autoPower: 0,
            upgrades: Object.fromEntries(COIN_CLICKER_UPGRADES.map((upgrade) => [upgrade.id, 0]))
        };
        saveCoinClickerState();
        const { coinClickerHelpText } = dom();
        if (coinClickerHelpText) {
            coinClickerHelpText.textContent = 'Nouvelle fortune lanc\u00e9e. Clique pour remplir la caisse, puis automatise ton butin.';
        }
        coinClickerMenuVisible = true;
        coinClickerMenuShowingRules = false;
        coinClickerMenuClosing = false;
        coinClickerMenuEntering = false;
    } else {
        loadCoinClickerState();
    }

    coinClickerLastAutoTick = performance.now();
    renderCoinClicker();
    renderCoinClickerMenu();
}

export function getCoinClickerState() { return coinClickerState; }
export function getCoinClickerMenuVisible() { return coinClickerMenuVisible; }
export function getCoinClickerMenuShowingRules() { return coinClickerMenuShowingRules; }
export function getCoinClickerMenuClosing() { return coinClickerMenuClosing; }
export function setCoinClickerMenuVisible(v) { coinClickerMenuVisible = Boolean(v); }
export function setCoinClickerMenuShowingRules(v) { coinClickerMenuShowingRules = Boolean(v); }
