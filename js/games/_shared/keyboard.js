const TRACKED_DIR_CODES = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyQ', 'KeyD', 'KeyZ', 'KeyS', 'KeyA', 'KeyW']);

export function createDirectionalRepeatGuard() {
    const heldDirectionKeys = [];

    return {
        release(event) {
            const index = heldDirectionKeys.indexOf(event.code);
            if (index !== -1) {
                heldDirectionKeys.splice(index, 1);
            }
        },
        shouldBlock(event, isTypingTarget = false) {
            if (isTypingTarget || !TRACKED_DIR_CODES.has(event.code)) {
                return false;
            }

            if (!event.repeat && !heldDirectionKeys.includes(event.code)) {
                heldDirectionKeys.push(event.code);
            }

            return event.repeat && heldDirectionKeys[heldDirectionKeys.length - 1] !== event.code;
        }
    };
}

export function bindGameKeyReleaseControls(options = {}) {
    const {
        handlePianoKeyUp,
        isPianoActive,
        getPongKeys,
        isMultiplayerPongActive,
        pushMultiplayerPongInput,
        getAirHockeyKeys,
        isMultiplayerAirHockeyActive,
        pushMultiplayerAirHockeyInput,
        getBreakoutKeys
    } = options;

    document.addEventListener('keyup', (event) => {
        if (handlePianoKeyUp?.(event, { active: Boolean(isPianoActive?.()) })) {
            return;
        }

        getPongKeys?.()?.delete(event.key);
        if (isMultiplayerPongActive?.()) {
            pushMultiplayerPongInput?.();
        }

        getAirHockeyKeys?.()?.delete(event.key.toLowerCase());
        if (isMultiplayerAirHockeyActive?.()) {
            pushMultiplayerAirHockeyInput?.();
        }

        getBreakoutKeys?.()?.delete(event.key.toLowerCase());
    });
}
