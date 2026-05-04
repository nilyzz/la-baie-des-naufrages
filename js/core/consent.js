(function () {
    const CONSENT_KEY = 'baie-des-naufrages-ad-consent-v1';
    const LEGACY_PERSONALIZED_MODE = 'personalized';
    const ADSENSE_SCRIPT_ID = 'baieAdsenseLoader';
    const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1302716532000899';
    const adContainer = document.querySelector('.site-ads');
    const adSlot = document.querySelector('.ad-slot');
    const consentBanner = document.getElementById('consentBanner');
    const consentStatusText = document.getElementById('consentStatusText');
    const openConsentPreferencesButton = document.getElementById('openConsentPreferencesButton');
    const closeConsentButtons = document.querySelectorAll('[data-close-consent-banner="true"]');
    const consentChoiceButtons = document.querySelectorAll('[data-consent-choice]');
    let adRequestIssued = false;

    function getAdsQueue() {
        return window.adsbygoogle = window.adsbygoogle || [];
    }

    function readConsent() {
        try {
            const storedConsent = JSON.parse(window.localStorage.getItem(CONSENT_KEY) || 'null');
            if (!storedConsent || ![LEGACY_PERSONALIZED_MODE, 'non-personalized', 'rejected'].includes(storedConsent.mode)) {
                return null;
            }
            if (storedConsent.mode === LEGACY_PERSONALIZED_MODE) {
                return {
                    ...storedConsent,
                    mode: 'non-personalized',
                    legacyPersonalized: true
                };
            }
            return storedConsent;
        } catch (_error) {
            return null;
        }
    }

    function writeConsent(mode) {
        try {
            window.localStorage.setItem(CONSENT_KEY, JSON.stringify({
                mode,
                updatedAt: Date.now()
            }));
        } catch (error) {
            console.warn('Impossible de sauvegarder le choix de consentement.', error);
        }
    }

    function describeConsent(mode) {
        if (mode === 'non-personalized') {
            return 'Tu autorises uniquement des annonces non personnalisees. La zone pub peut se charger sans ciblage publicitaire personnalise.';
        }
        if (mode === 'rejected') {
            return 'Tu refuses le chargement publicitaire. Les annonces restent désactivées tant que tu ne changes pas ce choix.';
        }
        return 'Aucun choix n\'est enregistré. Par défaut, la publicité reste bloquée tant que tu n\'as pas décidé.';
    }

    function openConsentBanner() {
        if (!consentBanner) {
            return;
        }
        consentBanner.classList.remove('hidden');
        consentBanner.setAttribute('aria-hidden', 'false');
    }

    function closeConsentBanner() {
        if (!consentBanner) {
            return;
        }
        consentBanner.classList.add('hidden');
        consentBanner.setAttribute('aria-hidden', 'true');
        openConsentPreferencesButton?.focus();
    }

    function setAdsBlockedState(blocked) {
        if (!adContainer) {
            return;
        }
        adContainer.classList.toggle('site-ads-consent-blocked', blocked);
        if (blocked) {
            getAdsQueue().pauseAdRequests = 1;
            adContainer.classList.remove('site-ads-ready', 'site-ads-unconfigured');
        }
    }

    function requestAdFill(mode) {
        if (!adContainer || !adSlot) {
            return;
        }
        const adsQueue = getAdsQueue();
        adsQueue.requestNonPersonalizedAds = mode === 'non-personalized' ? 1 : 0;
        adsQueue.pauseAdRequests = 0;

        if (adRequestIssued) {
            return;
        }

        try {
            adsQueue.push({});
            adRequestIssued = true;
            adContainer.classList.add('site-ads-ready');
        } catch (_error) {
            adContainer.classList.add('site-ads-unconfigured');
        }
    }

    function ensureAdsenseLoaded(mode) {
        if (!adContainer || !adSlot) {
            return;
        }

        if (mode !== 'non-personalized') {
            setAdsBlockedState(true);
            return;
        }

        setAdsBlockedState(false);
        const adsQueue = getAdsQueue();
        adsQueue.pauseAdRequests = 1;
        adsQueue.requestNonPersonalizedAds = mode === 'non-personalized' ? 1 : 0;

        const existingScript = document.getElementById(ADSENSE_SCRIPT_ID);
        if (existingScript) {
            if (existingScript.dataset.loaded === 'true') {
                requestAdFill(mode);
            }
            return;
        }

        const adsenseScript = document.createElement('script');
        adsenseScript.id = ADSENSE_SCRIPT_ID;
        adsenseScript.async = true;
        adsenseScript.src = ADSENSE_SRC;
        adsenseScript.crossOrigin = 'anonymous';
        adsenseScript.addEventListener('load', () => {
            adsenseScript.dataset.loaded = 'true';
            requestAdFill(mode);
        }, { once: true });
        adsenseScript.addEventListener('error', () => {
            adContainer.classList.add('site-ads-unconfigured');
        }, { once: true });
        document.head.appendChild(adsenseScript);
    }

    function applyConsent(mode) {
        if (consentStatusText) {
            consentStatusText.textContent = describeConsent(mode);
        }
        openConsentPreferencesButton?.setAttribute('data-consent-mode', mode || 'unset');
        ensureAdsenseLoaded(mode);
    }

    function requiresReload(previousMode, nextMode) {
        if (!previousMode || previousMode === 'rejected') {
            return false;
        }
        return previousMode !== nextMode;
    }

    closeConsentButtons.forEach((button) => {
        button.addEventListener('click', () => {
            closeConsentBanner();
        });
    });

    openConsentPreferencesButton?.addEventListener('click', () => {
        openConsentBanner();
    });

    consentChoiceButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const previousMode = readConsent()?.mode || null;
            const nextMode = button.dataset.consentChoice || 'rejected';
            writeConsent(nextMode);
            applyConsent(nextMode);
            closeConsentBanner();

            if (requiresReload(previousMode, nextMode)) {
                window.setTimeout(() => {
                    window.location.reload();
                }, 120);
            }
        });
    });

    const initialConsent = readConsent();
    const initialMode = initialConsent?.mode || null;
    if (initialConsent?.legacyPersonalized) {
        writeConsent(initialMode);
    }
    applyConsent(initialMode);
})();
