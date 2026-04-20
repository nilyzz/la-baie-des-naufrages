// Shared board helpers (grid bounds, move animation metadata, capture FX) — hoisted for checkers + chess.

export const CHESS_SIZE = 8;

export function isInsideGameGrid(row, col, size = 8) {
    return row >= 0 && row < size && col >= 0 && col < size;
}

export function getBoardMoveAnimationMetadata(lastMove, row, col, flip = false) {
    if (!lastMove || lastMove.toRow !== row || lastMove.toCol !== col) {
        return { className: '', style: '' };
    }

    const direction = flip ? -1 : 1;
    const moveX = (Number(lastMove.fromCol) - Number(lastMove.toCol)) * direction;
    const moveY = (Number(lastMove.fromRow) - Number(lastMove.toRow)) * direction;
    const isKnightMove = lastMove.pieceType === 'knight' && Math.abs(moveX) + Math.abs(moveY) === 3 && Math.abs(moveX) > 0 && Math.abs(moveY) > 0;
    const className = [
        'is-moving',
        lastMove.capture ? 'is-capture-move' : '',
        isKnightMove ? 'is-knight-move' : ''
    ].filter(Boolean).join(' ');
    const midX = Math.abs(moveX) === 2 ? 0 : moveX;
    const midY = Math.abs(moveY) === 2 ? 0 : moveY;
    const style = `style="--move-x:${moveX}; --move-y:${moveY}; --move-mid-x:${midX}; --move-mid-y:${midY};"`;
    return { className, style };
}

export function getBoardMoveAnimationKey(lastMove) {
    if (!lastMove) {
        return '';
    }

    return [
        lastMove.pieceType,
        lastMove.fromRow,
        lastMove.fromCol,
        lastMove.toRow,
        lastMove.toCol,
        lastMove.capture?.row ?? '-',
        lastMove.capture?.col ?? '-',
        lastMove.captureColor ?? '-'
    ].join(':');
}

export function isBoardCaptureCell(lastMove, row, col) {
    if (!lastMove?.capture) {
        return false;
    }

    return lastMove.capture.row === row && lastMove.capture.col === col;
}

export function spawnBoardCaptureParticles(boardElement, row, col, tone = 'light', positionMapper = null) {
    if (!boardElement) {
        return;
    }

    const fragment = document.createDocumentFragment();
    const particleCount = 9;
    const displayPosition = positionMapper ? positionMapper(Number(row), Number(col)) : { row: Number(row), col: Number(col) };
    const originX = `${((displayPosition.col + 0.5) / CHESS_SIZE) * 100}%`;
    const originY = `${((displayPosition.row + 0.5) / CHESS_SIZE) * 100}%`;
    for (let index = 0; index < particleCount; index += 1) {
        const particle = document.createElement('span');
        particle.className = `board-capture-particle is-${tone}`;
        const angle = (Math.PI * 2 * index) / particleCount;
        const distance = 12 + Math.random() * 20;
        particle.style.setProperty('--particle-origin-x', originX);
        particle.style.setProperty('--particle-origin-y', originY);
        particle.style.setProperty('--particle-x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--particle-y', `${Math.sin(angle) * distance}px`);
        particle.style.setProperty('--particle-delay', `${Math.random() * 70}ms`);
        particle.style.setProperty('--particle-size', `${4 + Math.random() * 5}px`);
        fragment.appendChild(particle);
    }

    boardElement.appendChild(fragment);
    window.setTimeout(() => {
        boardElement.querySelectorAll('.board-capture-particle').forEach((particle) => particle.remove());
    }, 520);
}
