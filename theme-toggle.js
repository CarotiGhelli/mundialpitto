// Toggle client-side tra 3 stili visivi: quello attuale (carta/caldo),
// quello precedente al restyling (dark/neon, dal tag git "backup") e una
// prova ispirata al sito della Premier League (viola/magenta). Puramente
// visivo: cambia solo quale foglio di stile e' collegato, nessun dato viene toccato.
const MP_THEMES = [
    { key: 'new', href: 'style.css',    label: 'Stile: Nuovo' },
    { key: 'old', href: 'style-old.css', label: 'Stile: Precedente' },
    { key: 'pl',  href: 'style-pl.css',  label: 'Stile: Premier League' }
];

function mpUpdateButtonLabel(key) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    const theme = MP_THEMES.find(t => t.key === key) || MP_THEMES[0];
    btn.textContent = theme.label;
}

function mpToggleTheme() {
    const link = document.getElementById('main-style');
    const current = localStorage.getItem('mpTheme') || 'new';
    const idx = MP_THEMES.findIndex(t => t.key === current);
    const next = MP_THEMES[(idx + 1) % MP_THEMES.length];

    link.setAttribute('href', next.href);
    localStorage.setItem('mpTheme', next.key);
    mpUpdateButtonLabel(next.key);
}

document.addEventListener('DOMContentLoaded', () => {
    mpUpdateButtonLabel(localStorage.getItem('mpTheme') || 'new');
});
