// View / router primitives for La Baie des Naufragés.
// Extracted from script.js during the ES-modules migration.
//
// Only the pure view-switching primitive `showViewImmediately` is extracted
// at this stage. The heavier `showGamePanel` still lives in script.js because
// it branches through every single game's init/cleanup — it will be moved
// once the individual game modules have been extracted.
//
// Side-effects that the IIFE version layers on top of the view switch
// (stopping the piano, toggling site ads, refreshing the games filter card,
// initialising panels) are left as callbacks the caller can pass in via
// options. main.js does not invoke this module yet; cohabitation only.

/**
 * Switches the active view. Hides every `.view` element, then reveals the
 * given one, synchronising `aria-hidden`, header visibility, and the
 * `logoutButton` / `pageBackButton` chrome.
 *
 * Options:
 *   - showHeader (bool, default false)
 *   - headerMode ('cinema' | 'games' | 'math' | 'music' | 'none', default 'none')
 *   - onComplete (callback fired once the view has been swapped)
 *   - onBeforeLeave (callback fired before hiding all views, useful e.g. for
 *     stopping piano notes when leaving the music view)
 *   - setHeaderMode (callback to sync header nav with `headerMode`)
 *   - syncSiteAdsVisibility (callback receiving the next view)
 *   - syncGamesFiltersCardVisibility (callback receiving the next view)
 */
export function showViewImmediately(nextView, options = {}) {
    const {
        showHeader = false,
        headerMode = 'none',
        onComplete,
        onBeforeLeave,
        setHeaderMode,
        syncSiteAdsVisibility,
        syncGamesFiltersCardVisibility
    } = options;

    if (!nextView) {
        return;
    }

    if (typeof onBeforeLeave === 'function') {
        onBeforeLeave(nextView);
    }

    const allViews = document.querySelectorAll('.view');
    allViews.forEach((view) => {
        view.classList.remove('view-active', 'view-leaving');
        view.setAttribute('aria-hidden', 'true');
    });

    const siteHeader = document.getElementById('siteHeader');
    if (siteHeader) {
        siteHeader.classList.toggle('hidden', !showHeader);
        siteHeader.setAttribute('aria-hidden', String(!showHeader));
    }

    if (typeof setHeaderMode === 'function') {
        setHeaderMode(headerMode);
    }

    if (typeof syncSiteAdsVisibility === 'function') {
        syncSiteAdsVisibility(nextView, { immediate: true });
    }

    if (typeof syncGamesFiltersCardVisibility === 'function') {
        syncGamesFiltersCardVisibility(nextView, { immediate: true });
    }

    const loginView = document.getElementById('loginView');
    const appView = document.getElementById('appView');
    const gamesView = document.getElementById('gamesView');
    const mathView = document.getElementById('mathView');
    const musicView = document.getElementById('musicView');
    const logoutButton = document.getElementById('logoutButton');
    const pageBackButton = document.getElementById('pageBackButton');

    logoutButton?.classList.toggle('hidden', nextView === loginView);
    pageBackButton?.classList.toggle(
        'hidden',
        nextView !== appView && nextView !== gamesView && nextView !== mathView && nextView !== musicView
    );

    nextView.classList.add('view-active');
    nextView.setAttribute('aria-hidden', 'false');

    if (typeof onComplete === 'function') {
        onComplete();
    }
}
