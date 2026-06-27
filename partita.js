// Estrae l'ID della partita dall'URL
function getPartitaId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id')) || 1;
}

// Trova la partita dal database
function getPartita(id) {
    return partiteDB.find(p => p.id === id);
}

// Trova una squadra dal database
function getSquadra(nome) {
    return squadreDB.find(s => s.nome === nome);
}

// Restituisce le stat del giocatore in questa partita specifica
function getPlayerMatchStats(partita, nome) {
    if (!partita.marcatori) return null;
    return partita.marcatori.find(m => m.nome === nome) || null;
}

// Genera il badge stat (gol/assist/mvp) accanto al nome
function playerStatsBadge(partita, nome) {
    const stats = getPlayerMatchStats(partita, nome);
    const parts = [];
    if (stats) {
        if (stats.gol > 0) parts.push(`&#9917; ${stats.gol}`);
        if (stats.assist > 0) parts.push(`&#x1F45F; ${stats.assist}`);
    }
    const isMvp = partita.mvp && partita.mvp === nome;
    const statsHtml = parts.length
        ? `<span class="player-match-stats">${parts.join(' &middot; ')}</span>`
        : '';
    const mvpHtml = isMvp ? '<span class="player-mvp-tag">&#11088;</span>' : '';
    return statsHtml + mvpHtml;
}

// Renderizza la lista giocatori di una squadra
function renderTeamList(container, partita, squadra, nomeSquadra) {
    if (!squadra || !squadra.giocatori || squadra.giocatori.length === 0) {
        container.querySelector('h3').textContent = nomeSquadra;
        return;
    }
    const playersHtml = squadra.giocatori.map(g => {
        const stats = getPlayerMatchStats(partita, g.nome);
        const isMvp = partita.mvp && partita.mvp === g.nome;
        const label = `${g.numero ? g.numero + '. ' : ''}${g.nome}${g.capitano ? ' (C)' : ''}`;
        const mvp = isMvp ? ' <span class="player-mvp-tag">&#11088;</span>' : '';
        const gol = stats && stats.gol > 0   ? `${stats.gol}&#9917;`    : '';
        const ast = stats && stats.assist > 0 ? `${stats.assist}&#x1F45F;` : '';
        return `<div class="player-row">
            <span class="pr-name">${label}${mvp}</span>
            <span class="pr-g">${gol}</span>
            <span class="pr-a">${ast}</span>
        </div>`;
    }).join('');
    container.innerHTML = `<h3>${nomeSquadra}</h3>` + playersHtml;
}

// Renderizza i dettagli della partita
function renderPartita(partita) {
    if (!partita) {
        document.querySelector('.partita-container').innerHTML =
            '<p style="text-align: center; margin: 3rem 0; color: var(--text-muted);">Partita non trovata</p>';
        return;
    }

    const squadra1 = getSquadra(partita.squadra1);
    const squadra2 = getSquadra(partita.squadra2);

    // Aggiorna header
    const header = document.querySelector('.partita-header h1');
    const girone = document.querySelector('.girone-info');

    header.innerHTML = `${partita.squadra1} <span class="score-highlight">${partita.risultato || '- - -'}</span> ${partita.squadra2}`;
    girone.textContent = `${partita.girone === 'A' ? 'Girone A' : 'Girone B'} - Giornata ${partita.giorno} - ${partita.orario}`;

    // Colori squadre
    if (squadra1) document.documentElement.style.setProperty('--team1-color', squadra1.colore);
    if (squadra2) document.documentElement.style.setProperty('--team2-color', squadra2.colore);

    // Liste giocatori
    const team1List = document.querySelector('.match-details-grid .team-list:first-child');
    const team2List = document.querySelector('.match-details-grid .team-list:last-child');

    renderTeamList(team1List, partita, squadra1, partita.squadra1);
    renderTeamList(team2List, partita, squadra2, partita.squadra2);
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', async () => {
    await firebaseReady;
    const partitaId = getPartitaId();
    const partita = getPartita(partitaId);
    renderPartita(partita);
});
