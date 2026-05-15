// Game module - Coin Clicker (Tresor du capitaine).

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';

export const COIN_CLICKER_STORAGE_KEY = 'baie-des-naufrages-coin-clicker';
export const COIN_CLICKER_EVENT_DURATION_MS = 15000;

export const COIN_CLICKER_UPGRADES = [
    { id: 'crew', icon: 'Clic', label: 'Equipage du quai', baseCost: 25, effectType: 'click', bonus: 1, description: '+1 par clic', unlockAt: 0 },
    { id: 'map', icon: 'Gain', label: 'Carte des epaves', baseCost: 90, effectType: 'multiplier', bonus: 0.18, description: '+18% sur tout le butin', unlockAt: 75 },
    { id: 'parrot', icon: 'Auto', label: 'Vigie du port', baseCost: 150, effectType: 'auto', bonus: 1.5, description: '+1,5 pieces / sec', unlockAt: 160 },
    { id: 'net', icon: 'Clic', label: 'Filet a doublons', baseCost: 340, effectType: 'click', bonus: 6, description: '+6 par clic', unlockAt: 420 },
    { id: 'harbor', icon: 'Auto', label: 'Comptoir du port', baseCost: 760, effectType: 'auto', bonus: 8, description: '+8 pieces / sec', unlockAt: 900 },
    { id: 'compass', icon: 'Gain', label: 'Compas des marees', baseCost: 1450, effectType: 'multiplier', bonus: 0.32, description: '+32% sur tout le butin', unlockAt: 1800 },
    { id: 'fleet', icon: 'Auto', label: 'Flotte des Naufrages', baseCost: 3200, effectType: 'auto', bonus: 32, description: '+32 pieces / sec', unlockAt: 4200 },
    { id: 'crown', icon: 'Gain', label: 'Couronne de corail', baseCost: 7800, effectType: 'multiplier', bonus: 0.65, description: '+65% sur tout le butin', unlockAt: 8200 }
];

const COIN_CLICKER_RANKS = [
    { label: 'Mousse fauche', threshold: 0 },
    { label: 'Pilleur de plage', threshold: 250 },
    { label: 'Quartier-maitre', threshold: 1500 },
    { label: 'Capitaine de la baie', threshold: 7000 },
    { label: 'Amiral des Naufrages', threshold: 25000 },
    { label: 'Legende du recif', threshold: 100000 }
];

const COIN_CLICKER_CONTRACTS = [
    { id: 'haul', label: 'Premier coffre', text: 'Gagne 2 000 pieces au total', goal: 2000, metric: 'totalEarned', reward: 500 },
    { id: 'combo', label: 'Rafale de clics', text: 'Atteins un combo x18', goal: 18, metric: 'bestCombo', reward: 350 },
    { id: 'shop', label: 'Cale equipee', text: 'Achete 9 ameliorations', goal: 9, metric: 'upgradesBought', reward: 700 }
];

const DEFAULT_UPGRADES = () => Object.fromEntries(COIN_CLICKER_UPGRADES.map((upgrade) => [upgrade.id, 0]));

let coinClickerMenuVisible = true;
let coinClickerMenuShowingRules = false;
let coinClickerMenuClosing = false;
let coinClickerMenuEntering = false;
let coinClickerState = createCoinClickerState();
let coinClickerAutoTimer = null;
let coinClickerLastAutoTick = (typeof performance !== 'undefined' ? performance.now() : 0);
let coinClickerLastSaveAt = 0;

const $ = (id) => document.getElementById(id);

function createCoinClickerState() {
    return {
        coins: 0,
        clickPower: 1,
        multiplier: 1,
        autoPower: 0,
        tideBoost: 1,
        tide: 0,
        combo: 0,
        bestCombo: 0,
        totalEarned: 0,
        upgradesBought: 0,
        contractsClaimed: {},
        activeEvent: null,
        upgrades: DEFAULT_UPGRADES()
    };
}

function dom() {
    return {
        coinClickerTable: $('coinClickerTable'),
        coinClickerScoreDisplay: $('coinClickerScoreDisplay'),
        coinClickerPowerDisplay: $('coinClickerPowerDisplay'),
        coinClickerMultiplierDisplay: $('coinClickerMultiplierDisplay'),
        coinClickerAutoDisplay: $('coinClickerAutoDisplay'),
        coinClickerHelpText: $('coinClickerHelpText'),
        coinClickerShop: $('coinClickerShop'),
        coinClickerContracts: $('coinClickerContracts'),
        coinClickerRankLabel: $('coinClickerRankLabel'),
        coinClickerRankProgress: $('coinClickerRankProgress'),
        coinClickerRankNext: $('coinClickerRankNext'),
        coinClickerTideValue: $('coinClickerTideValue'),
        coinClickerTideProgress: $('coinClickerTideProgress'),
        coinClickerEventBanner: $('coinClickerEventBanner'),
        coinClickerFloatLayer: $('coinClickerFloatLayer'),
        coinClickerMenuOverlay: $('coinClickerMenuOverlay'),
        coinClickerMenuEyebrow: $('coinClickerMenuEyebrow'),
        coinClickerMenuTitle: $('coinClickerMenuTitle'),
        coinClickerMenuText: $('coinClickerMenuText'),
        coinClickerMenuActionButton: $('coinClickerMenuActionButton'),
        coinClickerMenuRulesButton: $('coinClickerMenuRulesButton')
    };
}

function formatCoinAmount(value, digits = 0) {
    return Number(value || 0).toLocaleString('fr-FR', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });
}

function getCoinClickerRank() {
    let current = COIN_CLICKER_RANKS[0];
    let next = null;
    COIN_CLICKER_RANKS.forEach((rank, index) => {
        if (coinClickerState.totalEarned >= rank.threshold) {
            current = rank;
            next = COIN_CLICKER_RANKS[index + 1] || null;
        }
    });
    return { current, next };
}

function getContractProgress(contract) {
    if (contract.metric === 'upgradesBought') {
        return Math.min(contract.goal, Object.values(coinClickerState.upgrades).reduce((sum, level) => sum + (Number(level) || 0), 0));
    }
    return Math.min(contract.goal, Number(coinClickerState[contract.metric]) || 0);
}

function getVisibleCoinClickerContract() {
    return COIN_CLICKER_CONTRACTS.find((contract) => !coinClickerState.contractsClaimed[contract.id])
        || COIN_CLICKER_CONTRACTS[COIN_CLICKER_CONTRACTS.length - 1];
}

function getVisibleCoinClickerUpgrades() {
    const firstLockedIndex = COIN_CLICKER_UPGRADES.findIndex((upgrade) => !isUpgradeUnlocked(upgrade));
    const visibleLimit = firstLockedIndex === -1
        ? COIN_CLICKER_UPGRADES.length
        : Math.min(COIN_CLICKER_UPGRADES.length, firstLockedIndex + 1);
    return COIN_CLICKER_UPGRADES.slice(0, visibleLimit);
}

function getCoinClickerEventMultiplier() {
    if (!coinClickerState.activeEvent) {
        return 1;
    }
    return coinClickerState.activeEvent.type === 'highTide' ? 2.5 : 1;
}

function getCoinClickerCriticalChance() {
    return Math.min(0.28, 0.06 + coinClickerState.combo * 0.004);
}

function isUpgradeUnlocked(upgrade) {
    return coinClickerState.totalEarned >= (upgrade.unlockAt || 0);
}

function addCoinClickerCoins(amount) {
    if (amount <= 0) {
        return;
    }
    coinClickerState.coins += amount;
    coinClickerState.totalEarned += amount;
}

function saveCoinClickerStateSoon(force = false) {
    const now = Date.now();
    if (!force && now - coinClickerLastSaveAt < 800) {
        return;
    }
    coinClickerLastSaveAt = now;
    saveCoinClickerState();
}

function triggerCoinClickerHighTide() {
    coinClickerState.tide = 0;
    coinClickerState.activeEvent = {
        type: 'highTide',
        endsAt: Date.now() + COIN_CLICKER_EVENT_DURATION_MS
    };
    const { coinClickerHelpText } = dom();
    if (coinClickerHelpText) {
        coinClickerHelpText.textContent = 'Maree haute ! Pendant 15 secondes, tout le butin vaut x2,5.';
    }
}

function clearExpiredCoinClickerEvent() {
    if (coinClickerState.activeEvent && Date.now() >= coinClickerState.activeEvent.endsAt) {
        coinClickerState.activeEvent = null;
    }
}

export function spawnCoinClickerFloat(label, tone = 'normal') {
    const { coinClickerFloatLayer } = dom();
    if (!coinClickerFloatLayer) {
        return;
    }
    const item = document.createElement('span');
    item.className = `coinclicker-float coinclicker-float-${tone}`;
    item.textContent = label;
    item.style.left = `${20 + Math.random() * 60}%`;
    coinClickerFloatLayer.append(item);
    window.setTimeout(() => item.remove(), 900);
}

export function loadCoinClickerState() {
    try {
        const storedState = JSON.parse(window.localStorage.getItem(COIN_CLICKER_STORAGE_KEY) || 'null');

        if (!storedState) {
            return;
        }

        const nextState = createCoinClickerState();
        nextState.coins = Math.max(0, Number(storedState.coins) || 0);
        nextState.clickPower = Math.max(1, Number(storedState.clickPower) || 1);
        nextState.multiplier = Math.max(1, Number(storedState.multiplier) || 1);
        nextState.autoPower = Math.max(0, Number(storedState.autoPower) || 0);
        nextState.tideBoost = Math.max(1, Number(storedState.tideBoost) || 1);
        nextState.tide = Math.min(100, Math.max(0, Number(storedState.tide) || 0));
        nextState.combo = Math.max(0, Number(storedState.combo) || 0);
        nextState.bestCombo = Math.max(0, Number(storedState.bestCombo) || 0);
        nextState.totalEarned = Math.max(nextState.coins, Number(storedState.totalEarned) || nextState.coins);
        nextState.upgradesBought = Math.max(0, Number(storedState.upgradesBought) || 0);
        nextState.contractsClaimed = storedState.contractsClaimed && typeof storedState.contractsClaimed === 'object'
            ? storedState.contractsClaimed
            : {};
        nextState.activeEvent = storedState.activeEvent?.endsAt > Date.now() ? storedState.activeEvent : null;
        COIN_CLICKER_UPGRADES.forEach((upgrade) => {
            nextState.upgrades[upgrade.id] = Math.max(0, Number(storedState.upgrades?.[upgrade.id]) || 0);
        });
        coinClickerState = nextState;
    } catch (error) {
        console.error('Impossible de relire Coin Clicker.', error);
    }
}

export function saveCoinClickerState() {
    window.localStorage.setItem(COIN_CLICKER_STORAGE_KEY, JSON.stringify(coinClickerState));
}

export function getCoinClickerUpgradeCost(upgrade) {
    const level = coinClickerState.upgrades[upgrade.id] || 0;
    return Math.round(upgrade.baseCost * (1.72 ** level));
}

export function getCoinClickerCoinsPerClick() {
    return coinClickerState.clickPower * coinClickerState.multiplier * getCoinClickerEventMultiplier();
}

export function getCoinClickerCoinsPerSecond() {
    return coinClickerState.autoPower * coinClickerState.multiplier * getCoinClickerEventMultiplier();
}

export function handleCoinClickerPress(event) {
    if (coinClickerMenuVisible || coinClickerMenuClosing) {
        return;
    }
    if (event?.pointerType === 'mouse' && event.button !== 0) {
        return;
    }

    const now = Date.now();
    coinClickerState.combo = now - (coinClickerState.lastClickAt || 0) < 900
        ? Math.min(99, coinClickerState.combo + 1)
        : 1;
    coinClickerState.lastClickAt = now;
    coinClickerState.bestCombo = Math.max(coinClickerState.bestCombo, coinClickerState.combo);

    const critical = Math.random() < getCoinClickerCriticalChance();
    const comboBonus = 1 + Math.min(0.45, coinClickerState.combo * 0.012);
    const gain = getCoinClickerCoinsPerClick() * comboBonus * (critical ? 3 : 1);
    addCoinClickerCoins(gain);
    coinClickerState.tide = Math.min(100, coinClickerState.tide + (5.8 * coinClickerState.tideBoost));

    if (coinClickerState.tide >= 100 && !coinClickerState.activeEvent) {
        triggerCoinClickerHighTide();
    }

    spawnCoinClickerFloat(`+${formatCoinAmount(gain, gain < 10 ? 1 : 0)}`, critical ? 'crit' : 'normal');
    saveCoinClickerStateSoon();
    renderCoinClicker();
}

export function buyCoinClickerUpgrade(upgradeId) {
    const upgrade = COIN_CLICKER_UPGRADES.find((item) => item.id === upgradeId);

    if (!upgrade || !isUpgradeUnlocked(upgrade)) {
        return false;
    }

    const cost = getCoinClickerUpgradeCost(upgrade);

    if (coinClickerState.coins < cost) {
        return false;
    }

    coinClickerState.coins -= cost;
    coinClickerState.upgrades[upgrade.id] += 1;
    coinClickerState.upgradesBought += 1;

    if (upgrade.effectType === 'click') {
        coinClickerState.clickPower += upgrade.bonus;
    } else if (upgrade.effectType === 'multiplier') {
        coinClickerState.multiplier += upgrade.bonus;
    } else if (upgrade.effectType === 'auto') {
        coinClickerState.autoPower += upgrade.bonus;
    } else if (upgrade.effectType === 'tide') {
        coinClickerState.tideBoost += upgrade.bonus;
    }

    const { coinClickerHelpText } = dom();
    if (coinClickerHelpText) {
        coinClickerHelpText.textContent = `${upgrade.label} ajoute de la puissance au coffre. Continue : clics, maree, boutique.`;
    }
    saveCoinClickerStateSoon(true);
    renderCoinClicker();
    return true;
}

export function claimCoinClickerContract(contractId) {
    const contract = COIN_CLICKER_CONTRACTS.find((item) => item.id === contractId);
    if (!contract || coinClickerState.contractsClaimed[contract.id] || getContractProgress(contract) < contract.goal) {
        return false;
    }
    coinClickerState.contractsClaimed[contract.id] = true;
    addCoinClickerCoins(contract.reward);
    spawnCoinClickerFloat(`Contrat +${formatCoinAmount(contract.reward)}`, 'crit');
    const { coinClickerHelpText } = dom();
    if (coinClickerHelpText) {
        coinClickerHelpText.textContent = `${contract.label} valide. Le capitaine ajoute ${formatCoinAmount(contract.reward)} pieces au coffre.`;
    }
    saveCoinClickerStateSoon(true);
    renderCoinClicker();
    return true;
}

export function renderCoinClicker() {
    clearExpiredCoinClickerEvent();
    const {
        coinClickerScoreDisplay,
        coinClickerPowerDisplay,
        coinClickerMultiplierDisplay,
        coinClickerAutoDisplay,
        coinClickerShop,
        coinClickerContracts,
        coinClickerRankLabel,
        coinClickerRankProgress,
        coinClickerRankNext,
        coinClickerTideValue,
        coinClickerTideProgress,
        coinClickerEventBanner
    } = dom();

    if (coinClickerScoreDisplay) coinClickerScoreDisplay.textContent = formatCoinAmount(Math.floor(coinClickerState.coins));
    if (coinClickerPowerDisplay) {
        const value = getCoinClickerCoinsPerClick();
        coinClickerPowerDisplay.textContent = formatCoinAmount(value, value % 1 === 0 ? 0 : 1);
    }
    if (coinClickerMultiplierDisplay) coinClickerMultiplierDisplay.textContent = `x${coinClickerState.multiplier.toFixed(2)}`;
    if (coinClickerAutoDisplay) {
        const value = getCoinClickerCoinsPerSecond();
        coinClickerAutoDisplay.textContent = formatCoinAmount(value, value % 1 === 0 ? 0 : 1);
    }

    const rank = getCoinClickerRank();
    if (coinClickerRankLabel) coinClickerRankLabel.textContent = rank.current.label;
    if (coinClickerRankProgress) {
        const previous = rank.current.threshold;
        const next = rank.next?.threshold || Math.max(coinClickerState.totalEarned, previous + 1);
        const progress = rank.next ? ((coinClickerState.totalEarned - previous) / (next - previous)) * 100 : 100;
        coinClickerRankProgress.style.width = `${Math.max(4, Math.min(100, progress))}%`;
    }
    if (coinClickerRankNext) {
        coinClickerRankNext.textContent = rank.next
            ? `Prochain rang : ${formatCoinAmount(rank.next.threshold)} pieces gagnees`
            : 'Rang maximum : la baie connait ton nom';
    }

    if (coinClickerTideValue) coinClickerTideValue.textContent = `${Math.floor(coinClickerState.tide)}%`;
    if (coinClickerTideProgress) coinClickerTideProgress.style.width = `${Math.max(2, coinClickerState.tide)}%`;

    if (coinClickerEventBanner) {
        const activeEvent = coinClickerState.activeEvent;
        if (activeEvent) {
            const seconds = Math.max(0, Math.ceil((activeEvent.endsAt - Date.now()) / 1000));
            coinClickerEventBanner.classList.add('is-active');
            coinClickerEventBanner.innerHTML = `
                <span class="coinclicker-event-kicker">Maree haute</span>
                <strong>Ruee de pieces x2,5</strong>
                <span>${seconds}s avant que la baie se calme.</span>
            `;
        } else {
            coinClickerEventBanner.classList.remove('is-active');
            coinClickerEventBanner.innerHTML = `
                <span class="coinclicker-event-kicker">Quart calme</span>
                <strong>Objectif simple</strong>
                <span>Clique jusqu'a 100% de maree pour declencher le bonus.</span>
            `;
        }
    }

    if (coinClickerContracts) {
        const contract = getVisibleCoinClickerContract();
        const progress = getContractProgress(contract);
        const isComplete = progress >= contract.goal;
        const isClaimed = Boolean(coinClickerState.contractsClaimed[contract.id]);
        coinClickerContracts.innerHTML = `
            <button type="button" class="coinclicker-contract ${isComplete ? 'is-complete' : ''} ${isClaimed ? 'is-claimed' : ''}" data-coin-contract="${contract.id}" ${isClaimed ? 'disabled' : ''}>
                <span class="coinclicker-panel-kicker">Contrat actif</span>
                <span class="coinclicker-contract-title">${contract.label}</span>
                <span class="coinclicker-contract-text">${contract.text}</span>
                <span class="coinclicker-contract-bar"><span style="width: ${(progress / contract.goal) * 100}%"></span></span>
                <strong>${isClaimed ? 'Tout est encaisse' : isComplete ? `Reclamer +${formatCoinAmount(contract.reward)}` : `${formatCoinAmount(progress)} / ${formatCoinAmount(contract.goal)}`}</strong>
            </button>
        `;
    }

    if (coinClickerShop) {
        coinClickerShop.innerHTML = `
            <div class="coinclicker-shop-heading">
                <span class="coinclicker-panel-kicker">Boutique</span>
                <strong>Achete une amelioration</strong>
            </div>
        ` + getVisibleCoinClickerUpgrades().map((upgrade) => {
            const cost = getCoinClickerUpgradeCost(upgrade);
            const level = coinClickerState.upgrades[upgrade.id] || 0;
            const locked = !isUpgradeUnlocked(upgrade);
            const disabled = locked || coinClickerState.coins < cost;
            return `
                <button type="button" class="coinclicker-upgrade ${disabled ? 'is-disabled' : ''} ${locked ? 'is-locked' : ''}" data-coin-upgrade="${upgrade.id}" ${locked ? 'disabled' : ''}>
                    <span class="coinclicker-upgrade-icon" aria-hidden="true">${upgrade.icon}</span>
                    <span class="coinclicker-upgrade-title">${upgrade.label}</span>
                    <strong class="coinclicker-upgrade-bonus">${locked ? `Debloque a ${formatCoinAmount(upgrade.unlockAt)} pieces gagnees` : upgrade.description}</strong>
                    <span class="coinclicker-upgrade-meta">Niveau ${level} - Cout ${formatCoinAmount(cost)}</span>
                </button>
            `;
        }).join('');
    }
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
        clearExpiredCoinClickerEvent();
        const passiveGain = getCoinClickerCoinsPerSecond() * deltaSeconds;

        if (passiveGain > 0) {
            addCoinClickerCoins(passiveGain);
            saveCoinClickerStateSoon();
        }

        renderCoinClicker();
    }, 250);
}

export function getCoinClickerRulesText() {
    return 'Clique la grande piece pour gagner du butin. La barre de maree se remplit a chaque clic ; a 100%, tes gains sont multiplies pendant quelques secondes. Achete une amelioration dans la boutique, puis reclame le contrat actif quand il est termine.';
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
            ? 'Regles'
            : 'Tresor du capitaine';
    }

    if (coinClickerMenuTitle) {
        coinClickerMenuTitle.textContent = coinClickerMenuShowingRules
            ? 'Comment piller la baie'
            : 'Coin Clicker';
    }

    if (coinClickerMenuText) {
        coinClickerMenuText.textContent = coinClickerMenuShowingRules
            ? getCoinClickerRulesText()
            : 'Clique la grande piece, remplis la maree, puis depense ton butin dans la boutique. Le contrat actif te donne un objectif clair.';
    }

    if (coinClickerMenuActionButton) {
        coinClickerMenuActionButton.textContent = coinClickerMenuShowingRules
            ? 'Retour'
            : 'Piller le coffre';
    }

    if (coinClickerMenuRulesButton) {
        coinClickerMenuRulesButton.textContent = 'Regles';
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
        coinClickerState = createCoinClickerState();
        saveCoinClickerState();
        const { coinClickerHelpText } = dom();
        if (coinClickerHelpText) {
            coinClickerHelpText.textContent = 'Nouvelle fortune lancee. La baie attend son capitaine.';
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
