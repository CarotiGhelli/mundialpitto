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
    girone.textContent = `${partita.girone == 'A' ? 'Girone A' : 'Girone B'} - Giornata ${partita.giorno} - ${partita.orario}`;

    // Aggiorna badges e colori
    const badge1 = document.querySelector('.partita-container').querySelector('[data-team="1"]');
    const badge2 = document.querySelector('.partita-container').querySelector('[data-team="2"]');

    if (squadra1) {
        document.documentElement.style.setProperty('--team1-color', squadra1.colore);
    }
    if (squadra2) {
        document.documentElement.style.setProperty('--team2-color', squadra2.colore);
    }

    // Aggiorna lista giocatori (se disponibile)
    if (squadra1 && squadra1.giocatori && squadra1.giocatori.length > 0) {
        const team1List = document.querySelector('.match-details-grid .team-list:first-child');
        const team1Name = team1List.querySelector('h3');
        team1Name.textContent = partita.squadra1;

        const playersHtml = squadra1.giocatori.map(g => `
            <div class="player-row">
                <span>${g.numero ? g.numero + '. ' : ''}${g.nome}</span>
                <div class="player-events"></div>
            </div>
        `).join('');

        team1List.innerHTML = `<h3>${partita.squadra1}</h3>` + playersHtml;
    } else {
        const team1List = document.querySelector('.match-details-grid .team-list:first-child');
        team1List.querySelector('h3').textContent = partita.squadra1;
    }

    if (squadra2 && squadra2.giocatori && squadra2.giocatori.length > 0) {
        const team2List = document.querySelector('.match-details-grid .team-list:last-child');
        const team2Name = team2List.querySelector('h3');
        team2Name.textContent = partita.squadra2;

        const playersHtml = squadra2.giocatori.map(g => `
            <div class="player-row">
                <span>${g.numero ? g.numero + '. ' : ''}${g.nome}</span>
                <div class="player-events"></div>
            </div>
        `).join('');

        team2List.innerHTML = `<h3>${partita.squadra2}</h3>` + playersHtml;
    } else {
        const team2List = document.querySelector('.match-details-grid .team-list:last-child');
        team2List.querySelector('h3').textContent = partita.squadra2;
    }
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    const partitaId = getPartitaId();
    const partita = getPartita(partitaId);
    renderPartita(partita);
});
