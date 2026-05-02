if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => null);
    });
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type !== 'SW_UPDATED') return;
        const banner = document.createElement('div');
        banner.setAttribute('role', 'status');
        banner.style.cssText = [
            'position:fixed', 'bottom:20px', 'left:50%', 'transform:translateX(-50%)',
            'z-index:99999', 'display:flex', 'align-items:center', 'gap:14px',
            'padding:14px 20px', 'border-radius:16px',
            'background:rgba(15,23,42,0.97)', 'border:1px solid rgba(148,163,184,0.18)',
            'box-shadow:0 8px 32px rgba(0,0,0,0.5)',
            'color:#e2e8f0', 'font-size:0.92rem', 'font-weight:600',
            'white-space:nowrap', 'backdrop-filter:blur(12px)'
        ].join(';');
        banner.appendChild(document.createTextNode('🆕 Nouvelle version disponible  '));
        const updateBtn = document.createElement('button');
        updateBtn.style.cssText = 'background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;border:0;border-radius:999px;padding:7px 16px;font-weight:700;cursor:pointer;font-size:0.88rem';
        updateBtn.textContent = 'Mettre à jour';
        updateBtn.addEventListener('click', () => window.location.reload());
        const dismissBtn = document.createElement('button');
        dismissBtn.style.cssText = 'background:transparent;border:0;color:#64748b;cursor:pointer;font-size:1.1rem;padding:0 2px';
        dismissBtn.setAttribute('aria-label', 'Ignorer');
        dismissBtn.textContent = '✕';
        dismissBtn.addEventListener('click', () => banner.remove());
        banner.append(updateBtn, dismissBtn);
        document.body.appendChild(banner);
    });
}
