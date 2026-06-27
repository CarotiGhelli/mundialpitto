// Estrae l'ID della squadra dall'URL
function getSquadraId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id')) || 1;
}

// Trova la squadra dal database
function getSquadra(id) {
    return squadreDB.find(s => s.id === id);
}

// Renderizza l'hero della squadra
function renderHero(squadra) {
    const hero = document.getElementById('squadra-hero');
    const badgeContent = squadra.logo
        ? `<img src="Loghi/${squadra.logo}" alt="${squadra.nome}" style="width:100%;height:100%;object-fit:contain;border-radius:12px;padding:8px;">`
        : squadra.badge;
    const badgeStyle = squadra.logo
        ? `background:#000; border: 3px solid var(--neon-green);`
        : `background: linear-gradient(135deg, ${squadra.colore} 0%, ${squadra.coloreScuro} 100%);`;

    hero.innerHTML = `
        <div class="hero-content">
            <div class="hero-badge" style="${badgeStyle}">
                ${badgeContent}
            </div>
            <h1>${squadra.nome}</h1>
            <p class="hero-girone">${squadra.girone}</p>
            <a href="squadre.html" class="btn-back">← Torna alle squadre</a>
        </div>
    `;
}

// Renderizza le informazioni della squadra
function renderInfo(squadra) {
    // Dirigente
    if (squadra.dirigente) {
        document.getElementById('dirigente').textContent = squadra.dirigente;
        document.getElementById('dirigente-item').style.display = 'flex';
    }

    // Allenatore
    if (squadra.allenatore) {
        document.getElementById('allenatore').textContent = squadra.allenatore;
        document.getElementById('allenatore-item').style.display = 'flex';
    }

    // Assistente
    if (squadra.assistente) {
        document.getElementById('assistente').textContent = squadra.assistente;
        document.getElementById('assistente-item').style.display = 'flex';
    }

    // Presidente
    if (squadra.presidente) {
        document.getElementById('presidente').textContent = squadra.presidente;
        document.getElementById('presidente-item').style.display = 'flex';
    }

    document.getElementById('num-giocatori').textContent = squadra.giocatori.length;
    document.getElementById('girone').textContent = squadra.girone;
}

// Renderizza la rosa della squadra
function renderRoster(squadra) {
    const container = document.getElementById('roster-container');

    if (squadra.giocatori.length === 0) {
        container.innerHTML = '<div class="roster-empty">Roster ancora da compilare</div>';
        return;
    }

    const html = squadra.giocatori.map(giocatore => `
        <div class="player-card">
            ${giocatore.numero ? `<div class="player-number">${giocatore.numero}</div>` : ''}
            <div class="player-info">
                <div class="player-name">
                    ${giocatore.nome}
                    ${giocatore.capitano ? '<span class="captain-badge">C</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// Renderizza il breadcrumb
function renderBreadcrumb(squadra) {
    const breadcrumb = document.getElementById('breadcrumb-squadra');
    breadcrumb.textContent = squadra.nome;
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    const squadraId = getSquadraId();
    const squadra = getSquadra(squadraId);

    if (!squadra) {
        document.querySelector('.squadra-detail-container').innerHTML =
            '<p style="text-align: center; margin: 3rem 0; color: var(--text-muted);">Squadra non trovata</p>';
        return;
    }

    renderBreadcrumb(squadra);
    renderHero(squadra);
    renderInfo(squadra);
    renderRoster(squadra);
});
