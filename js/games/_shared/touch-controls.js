function bindSwipe(element, options = {}) {
    const {
        canStart = () => true,
        minSwipeDistance = 20,
        onSwipe,
        onTap
    } = options;
    let startX = null;
    let startY = null;

    element?.addEventListener('touchstart', (event) => {
        if (!canStart()) {
            return;
        }

        const touch = event.changedTouches[0];
        if (!touch) {
            return;
        }

        startX = touch.clientX;
        startY = touch.clientY;
    }, { passive: true });

    element?.addEventListener('touchend', (event) => {
        if (!canStart()) {
            startX = null;
            startY = null;
            return;
        }

        const touch = event.changedTouches[0];
        if (!touch || startX === null || startY === null) {
            startX = null;
            startY = null;
            return;
        }

        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        startX = null;
        startY = null;

        if (Math.max(absX, absY) < minSwipeDistance) {
            if (typeof onTap === 'function') {
                onTap(event);
            }
            return;
        }

        onSwipe?.({ deltaX, deltaY, absX, absY, event });
    }, { passive: false });
}

export function bindTouchGameControls(options = {}) {
    const {
        getActiveGameTab,
        is2048Blocked,
        move2048,
        queueSnakeDirectionInput,
        isPacmanBlocked,
        setPacmanNextDirection,
        isTetrisBlocked,
        moveTetrisHorizontally,
        dropTetrisStep,
        rotateTetrisPiece,
        setPongTouchInput,
        clearPongTouchInput,
        pushMultiplayerPongInput,
        setAirHockeyTouchPos,
        clearAirHockeyTouchPos,
        pushMultiplayerAirHockeyInput,
        isMultiplayerAirHockeyActive
    } = options;

    const pongBoard = document.getElementById('pongBoard');
    if (pongBoard) {
        const onPongTouch = (event) => {
            if (getActiveGameTab?.() !== 'pong') return;
            event.preventDefault();
            const touch = event.touches[0] || event.changedTouches[0];
            if (!touch) return;
            const rect = pongBoard.getBoundingClientRect();
            const fraction = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
            setPongTouchInput?.(fraction);
            pushMultiplayerPongInput?.();
        };
        pongBoard.addEventListener('touchstart', onPongTouch, { passive: false });
        pongBoard.addEventListener('touchmove', onPongTouch, { passive: false });
        pongBoard.addEventListener('touchend', () => {
            clearPongTouchInput?.();
            pushMultiplayerPongInput?.();
        }, { passive: true });
    }

    const airHockeyBoard = document.getElementById('airHockeyBoard');
    if (airHockeyBoard) {
        const onAirHockeyTouch = (event) => {
            if (getActiveGameTab?.() !== 'airHockey') return;
            event.preventDefault();
            const touch = event.touches[0] || event.changedTouches[0];
            if (!touch) return;
            const rect = airHockeyBoard.getBoundingClientRect();
            const fracX = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
            const fracY = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
            setAirHockeyTouchPos?.(fracX, fracY);
            pushMultiplayerAirHockeyInput?.();
        };
        airHockeyBoard.addEventListener('touchstart', onAirHockeyTouch, { passive: false });
        airHockeyBoard.addEventListener('touchmove', onAirHockeyTouch, { passive: false });
        airHockeyBoard.addEventListener('touchend', () => {
            clearAirHockeyTouchPos?.();
            pushMultiplayerAirHockeyInput?.();
        }, { passive: true });
    }

    bindSwipe(document.getElementById('game2048Board'), {
        canStart: () => getActiveGameTab?.() === '2048' && !is2048Blocked?.(),
        minSwipeDistance: 24,
        onSwipe: ({ deltaX, deltaY, absX, absY, event }) => {
            event.preventDefault();
            move2048?.(absX > absY
                ? (deltaX > 0 ? 'right' : 'left')
                : (deltaY > 0 ? 'down' : 'up'));
        }
    });

    bindSwipe(document.getElementById('snakeBoard'), {
        canStart: () => getActiveGameTab?.() === 'snake',
        minSwipeDistance: 20,
        onSwipe: ({ deltaX, deltaY, absX, absY, event }) => {
            queueSnakeDirectionInput?.(
                absX > absY
                    ? (deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 })
                    : (deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 })
            );
            event.preventDefault();
        }
    });

    bindSwipe(document.getElementById('pacmanBoard'), {
        canStart: () => getActiveGameTab?.() === 'pacman' && !isPacmanBlocked?.(),
        minSwipeDistance: 20,
        onSwipe: ({ deltaX, deltaY, absX, absY, event }) => {
            setPacmanNextDirection?.(absX > absY
                ? (deltaX > 0 ? { row: 0, col: 1 } : { row: 0, col: -1 })
                : (deltaY > 0 ? { row: 1, col: 0 } : { row: -1, col: 0 }));
            event.preventDefault();
        }
    });

    bindSwipe(document.getElementById('tetrisBoard'), {
        canStart: () => getActiveGameTab?.() === 'tetris' && !isTetrisBlocked?.(),
        minSwipeDistance: 20,
        onTap: (event) => {
            rotateTetrisPiece?.();
            event.preventDefault();
        },
        onSwipe: ({ deltaX, deltaY, absX, absY, event }) => {
            if (absX > absY) {
                moveTetrisHorizontally?.(deltaX > 0 ? 1 : -1);
            } else if (deltaY > 0) {
                dropTetrisStep?.();
            } else {
                rotateTetrisPiece?.();
            }

            event.preventDefault();
        }
    });
}
