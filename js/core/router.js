// View / router primitives for La Baie des Naufrages.
// Extracted from script.js during the ES-modules migration.
//
// showGamePanel still lives in script.js because it branches through every
// game's init/cleanup. The global nav/router chrome lives here and receives
// tiny callbacks for app-local state when needed.

let siteAdsEnterTimer = null;
let gamesFiltersEnterTimer = null;

function getLoginView() {
    return document.getElementById('loginView');
}

function getServicesView() {
    return document.getElementById('servicesView');
}

function getAppView() {
    return document.getElementById('appView');
}

function getGamesView() {
    return document.getElementById('gamesView');
}

function getMathView() {
    return document.getElementById('mathView');
}

function getMusicView() {
    return document.getElementById('musicView');
}

export function setHeaderMode(mode = 'none') {
    const headerMap = {
        cinema: document.getElementById('cinemaHeaderNav'),
        games: document.getElementById('gamesHeaderNav'),
        math: document.getElementById('mathHeaderNav'),
        music: document.getElementById('musicHeaderNav')
    };

    Object.entries(headerMap).forEach(([key, element]) => {
        element?.classList.toggle('hidden', mode !== key);
    });
}

export function shouldHideSiteAdsForView(view) {
    return view === getLoginView() || view === getServicesView() || view === getAppView();
}

export function syncSiteAdsVisibility(targetView, options = {}) {
    const siteAds = document.querySelector('.site-ads');
    if (!siteAds) {
        return;
    }

    const { immediate = false } = options;
    const shouldHide = shouldHideSiteAdsForView(targetView);

    if (shouldHide) {
        window.clearTimeout(siteAdsEnterTimer);
        siteAds.classList.remove('site-ads-entering');
    }

    siteAds.classList.toggle('site-ads-no-transition', immediate);
    siteAds.classList.toggle('site-ads-hidden', shouldHide);

    if (immediate) {
        window.requestAnimationFrame(() => {
            siteAds.classList.remove('site-ads-no-transition');
        });
    }
}

export function playSiteAdsEntrance() {
    const siteAds = document.querySelector('.site-ads');
    if (!siteAds) {
        return;
    }

    window.clearTimeout(siteAdsEnterTimer);
    siteAds.classList.remove('site-ads-entering');
    void siteAds.offsetWidth;
    siteAds.classList.add('site-ads-entering');
    siteAdsEnterTimer = window.setTimeout(() => {
        siteAds.classList.remove('site-ads-entering');
    }, 550);
}

export function syncGamesFiltersCardVisibility(targetView, options = {}) {
    const gamesFiltersCard = document.getElementById('gamesFiltersCard');
    if (!gamesFiltersCard) {
        return;
    }

    const { immediate = false } = options;
    const shouldHide = targetView !== getGamesView();

    gamesFiltersCard.classList.toggle('games-filters-card-no-transition', immediate);
    gamesFiltersCard.classList.toggle('games-filters-card-hidden', shouldHide);

    if (immediate) {
        window.requestAnimationFrame(() => {
            gamesFiltersCard.classList.remove('games-filters-card-no-transition');
        });
    }
}

export function playGamesFiltersEntrance() {
    const gamesFiltersCard = document.getElementById('gamesFiltersCard');
    if (!gamesFiltersCard) {
        return;
    }

    window.clearTimeout(gamesFiltersEnterTimer);
    gamesFiltersCard.classList.remove('games-filters-card-entering');
    void gamesFiltersCard.offsetWidth;
    gamesFiltersCard.classList.add('games-filters-card-entering');
    gamesFiltersEnterTimer = window.setTimeout(() => {
        gamesFiltersCard.classList.remove('games-filters-card-entering');
    }, 550);
}

export function transitionToView(currentView, nextView, options = {}) {
    const {
        showHeader = false,
        headerMode = 'none',
        onComplete,
        onBeforeLeave,
        onViewChanged
    } = options;

    if (!currentView || !nextView) {
        return;
    }

    const loginView = getLoginView();
    const appView = getAppView();
    const gamesView = getGamesView();
    const mathView = getMathView();
    const musicView = getMusicView();
    const shouldHideAdsOnCurrentView = shouldHideSiteAdsForView(currentView);
    const shouldHideAdsOnNextView = shouldHideSiteAdsForView(nextView);
    const shouldHideGamesFiltersOnCurrentView = currentView !== gamesView;
    const shouldHideGamesFiltersOnNextView = nextView !== gamesView;

    currentView.classList.add('view-leaving');

    if (shouldHideAdsOnNextView) {
        syncSiteAdsVisibility(nextView);
    }

    if (shouldHideGamesFiltersOnNextView) {
        syncGamesFiltersCardVisibility(nextView);
    }

    window.setTimeout(() => {
        if (typeof onBeforeLeave === 'function') {
            onBeforeLeave(nextView);
        }

        currentView.classList.remove('view-active', 'view-leaving');
        currentView.setAttribute('aria-hidden', 'true');

        const siteHeader = document.getElementById('siteHeader');
        const logoutButton = document.getElementById('logoutButton');
        const pageBackButton = document.getElementById('pageBackButton');

        siteHeader?.classList.toggle('hidden', !showHeader);
        siteHeader?.setAttribute('aria-hidden', String(!showHeader));
        setHeaderMode(headerMode);
        logoutButton?.classList.toggle('hidden', nextView === loginView);
        pageBackButton?.classList.toggle('hidden', nextView !== appView && nextView !== gamesView && nextView !== mathView && nextView !== musicView);

        nextView.classList.add('view-active');
        nextView.setAttribute('aria-hidden', 'false');

        if (typeof onViewChanged === 'function') {
            onViewChanged(nextView);
        }

        if (!shouldHideAdsOnNextView && shouldHideAdsOnCurrentView) {
            syncSiteAdsVisibility(nextView);
            playSiteAdsEntrance();
        }

        if (!shouldHideGamesFiltersOnNextView && shouldHideGamesFiltersOnCurrentView) {
            syncGamesFiltersCardVisibility(nextView);
            playGamesFiltersEntrance();
        }

        if (typeof onComplete === 'function') {
            onComplete();
        }
    }, 450);
}

/**
 * Switches the active view immediately. Hides every `.view` element, then
 * reveals the given one, synchronising `aria-hidden`, header visibility, and
 * the `logoutButton` / `pageBackButton` chrome.
 */
export function showViewImmediately(nextView, options = {}) {
    const {
        showHeader = false,
        headerMode = 'none',
        onComplete,
        onBeforeLeave,
        onViewChanged,
        setHeaderMode: setHeaderModeCallback = setHeaderMode,
        syncSiteAdsVisibility: syncSiteAdsVisibilityCallback = syncSiteAdsVisibility,
        syncGamesFiltersCardVisibility: syncGamesFiltersCardVisibilityCallback = syncGamesFiltersCardVisibility
    } = options;

    if (!nextView) {
        return;
    }

    if (typeof onBeforeLeave === 'function') {
        onBeforeLeave(nextView);
    }

    document.querySelectorAll('.view').forEach((view) => {
        view.classList.remove('view-active', 'view-leaving');
        view.setAttribute('aria-hidden', 'true');
    });

    const siteHeader = document.getElementById('siteHeader');
    if (siteHeader) {
        siteHeader.classList.toggle('hidden', !showHeader);
        siteHeader.setAttribute('aria-hidden', String(!showHeader));
    }

    if (typeof setHeaderModeCallback === 'function') {
        setHeaderModeCallback(headerMode);
    }

    if (typeof syncSiteAdsVisibilityCallback === 'function') {
        syncSiteAdsVisibilityCallback(nextView, { immediate: true });
    }

    if (typeof syncGamesFiltersCardVisibilityCallback === 'function') {
        syncGamesFiltersCardVisibilityCallback(nextView, { immediate: true });
    }

    const loginView = getLoginView();
    const appView = getAppView();
    const gamesView = getGamesView();
    const mathView = getMathView();
    const musicView = getMusicView();
    const logoutButton = document.getElementById('logoutButton');
    const pageBackButton = document.getElementById('pageBackButton');

    logoutButton?.classList.toggle('hidden', nextView === loginView);
    pageBackButton?.classList.toggle(
        'hidden',
        nextView !== appView && nextView !== gamesView && nextView !== mathView && nextView !== musicView
    );

    nextView.classList.add('view-active');
    nextView.setAttribute('aria-hidden', 'false');

    if (typeof onViewChanged === 'function') {
        onViewChanged(nextView);
    }

    if (typeof onComplete === 'function') {
        onComplete();
    }
}

export function activatePanel(targetId) {
    document.querySelectorAll('#cinemaHeaderNav .nav-button').forEach((button) => {
        const isActive = button.dataset.target === targetId;
        button.classList.toggle('is-active', isActive);
    });

    document.querySelectorAll('.panel').forEach((panel) => {
        panel.classList.toggle('panel-active', panel.id === targetId);
    });
}

export function activateMathPanel(targetId) {
    document.querySelectorAll('#mathHeaderNav .nav-button').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.mathTab === targetId);
    });

    document.querySelectorAll('.math-panel').forEach((panel) => {
        panel.classList.toggle('math-panel-active', panel.id === targetId);
    });

    return targetId;
}

export function activateMusicPanel(targetId, options = {}) {
    const { onPianoPanel } = options;

    document.querySelectorAll('#musicHeaderNav .nav-button').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.musicTab === targetId);
    });

    document.querySelectorAll('.music-panel').forEach((panel) => {
        panel.classList.toggle('music-panel-active', panel.id === targetId);
    });

    if (targetId === 'pianoPanel' && typeof onPianoPanel === 'function') {
        onPianoPanel();
    }

    return targetId;
}
