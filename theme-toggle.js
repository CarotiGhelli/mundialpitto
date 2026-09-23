// Toggle client-side tra lo stile attuale (carta/caldo) e lo stile precedente
// al restyling (dark/neon, salvato dal tag git "backup"). Puramente visivo:
// cambia solo quale foglio di stile e' collegato, nessun dato viene toccato.
function mpToggleTheme() {
    const link = document.getElementById('main-style');
    const btn = document.getElementById('theme-toggle-btn');
    const isOld = link.getAttribute('href').indexOf('style-old.css') !== -1;

    if (isOld) {
        link.setAttribute('href', 'style.css');
        localStorage.setItem('mpTheme', 'new');
        if (btn) btn.textContent = 'Stile precedente';
    } else {
        link.setAttribute('href', 'style-old.css');
        localStorage.setItem('mpTheme', 'old');
        if (btn) btn.textContent = 'Stile nuovo';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    const isOld = localStorage.getItem('mpTheme') === 'old';
    btn.textContent = isOld ? 'Stile nuovo' : 'Stile precedente';
});
