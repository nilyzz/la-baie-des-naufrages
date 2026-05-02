export function bindAppShellControls(options = {}) {
    const {
        onLogin,
        onCinema,
        onGames,
        onMath,
        onMusic,
        onBackToServices,
        onLogout,
        onActivateCinemaPanel,
        onActivateMathPanel,
        onActivateMusicPanel
    } = options;

    document.getElementById('loginForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        onLogin?.();
    });

    document.querySelectorAll('#cinemaHeaderNav .nav-button').forEach((button) => {
        button.addEventListener('click', () => {
            onActivateCinemaPanel?.(button.dataset.target);
        });
    });

    document.querySelectorAll('#mathHeaderNav .nav-button').forEach((button) => {
        button.addEventListener('click', () => {
            onActivateMathPanel?.(button.dataset.mathTab);
        });
    });

    document.querySelectorAll('#musicHeaderNav .nav-button').forEach((button) => {
        button.addEventListener('click', () => {
            onActivateMusicPanel?.(button.dataset.musicTab);
        });
    });

    document.querySelectorAll('.service-card').forEach((card) => {
        card.addEventListener('click', () => {
            if (card.dataset.service === 'cinema') {
                onCinema?.();
                return;
            }

            if (card.dataset.service === 'math') {
                onMath?.();
                return;
            }

            if (card.dataset.service === 'music') {
                onMusic?.();
                return;
            }

            onGames?.();
        });
    });

    document.querySelectorAll('[data-back-to-services="true"]').forEach((button) => {
        button.addEventListener('click', () => {
            onBackToServices?.();
        });
    });

    document.getElementById('logoutButton')?.addEventListener('click', () => {
        onLogout?.();
    });
}
