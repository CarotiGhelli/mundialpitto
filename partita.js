function getPlayerMatchStats(partita, nome) {
    if (!partita.marcatori) return null;
    return partita.marcatori.find(m => m.nome === nome) || null;
}

function renderTeamList(container, partita, squadra, nomeSquadra) {
    if (!squadra || !squadra.giocatori || squadra.giocatori.length === 0) {
        if (container.querySelector('h3')) container.querySelector('h3').textContent = nomeSquadra;
        return;
    }
    const rows = squadra.giocatori.map((g, i) => {
        const stats = getPlayerMatchStats(partita, g.nome);
        const isMvp = partita.mvp && partita.mvp === g.nome;
        const label = (g.numero ? g.numero + '. ' : '') + g.nome + (g.capitano ? ' (C)' : '');
        const mvpTag = isMvp ? ' <span class="player-mvp-tag">&#11088;</span>' : '';
        const gol = stats && stats.gol   > 0 ? stats.gol   + '&#9917;'      : '';
        const ast = stats && stats.assist > 0 ? stats.assist + '&#x1F45F;'   : '';
        const sep = i > 0 ? '<div class="player-sep"></div>' : '';
        return `${sep}<div class="player-row">
            <span class="pr-name">${label}${mvpTag}</span>
            <span class="pr-g">${gol}</span>
            <span class="pr-a">${ast}</span>
        </div>`;
    }).join('');
    container.innerHTML = `<h3>${nomeSquadra}</h3><div class="players-table">${rows}</div>`;
}

function renderMvpBox(partita) {
    const box = document.getElementById('mvp-box');
    if (!box) return;
    if (!partita.mvp || !partita.risultato) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    box.innerHTML = `<span class="mvp-label">&#11088; MVP della partita</span>${partita.mvp}`;
}

function renderDots(positions) {
    const pitch = document.querySelector('.pitch-container');
    if (!pitch) return;
    pitch.querySelectorAll('.player-dot').forEach(d => d.remove());
    const roles = ['gk', 'def', 'ml', 'mr', 'fw'];
    ['squadra1', 'squadra2'].forEach(side => {
        const cls   = side === 'squadra1' ? 'team1-dot' : 'team2-dot';
        const defSide = side === 'squadra1' ? 'casa' : 'trasferta';
        const posData = (positions && positions[side]) || null;
        roles.forEach(role => {
            const defPos = DEFAULT_FORMATION[defSide][role];
            const pos    = posData ? (posData[role] || defPos) : defPos;
            const dot = document.createElement('div');
            dot.className = `player-dot ${cls}`;
            dot.style.left = pos.left + '%';
            dot.style.top  = pos.top  + '%';
            if (role === 'gk') dot.textContent = 'GK';
            pitch.appendChild(dot);
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await firebaseReady;

    const params  = new URLSearchParams(window.location.search);
    const id      = parseInt(params.get('id')) || 1;
    const partita = partiteDB.find(p => p.id === id);

    if (!partita) {
        document.querySelector('.partita-container').innerHTML =
            '<p style="text-align:center;margin:3rem 0;color:var(--text-muted);">Partita non trovata</p>';
        return;
    }

    const squadra1 = squadreDB.find(s => s.nome === partita.squadra1);
    const squadra2 = squadreDB.find(s => s.nome === partita.squadra2);

    document.querySelector('.partita-header h1').innerHTML =
        `${partita.squadra1} <span class="score-highlight">${partita.risultato || '- - -'}</span> ${partita.squadra2}`;
    document.querySelector('.girone-info').textContent = partita.playoffRound
        ? `${partita.label || 'Playoff'} – ${partita.orario}`
        : `Girone ${partita.girone} – Giornata ${partita.giorno} – ${partita.orario}`;

    if (squadra1) document.documentElement.style.setProperty('--team1-color', squadra1.colore);
    if (squadra2) document.documentElement.style.setProperty('--team2-color', squadra2.colore);

    renderTeamList(document.querySelector('.match-details-grid .team-list:first-child'), partita, squadra1, partita.squadra1);
    renderTeamList(document.querySelector('.match-details-grid .team-list:last-child'),  partita, squadra2, partita.squadra2);

    renderMvpBox(partita);

    try {
        let pos = await loadPosizioniPartitaFromFirebase(id);
        if (!pos || (!pos.squadra1 && !pos.squadra2)) {
            const [f1, f2] = await Promise.all([
                squadra1 ? loadFormazioniFromFirebase(squadra1.id) : Promise.resolve(null),
                squadra2 ? loadFormazioniFromFirebase(squadra2.id) : Promise.resolve(null)
            ]);
            pos = { squadra1: f1 ? f1.casa : null, squadra2: f2 ? f2.trasferta : null };
        }
        renderDots(pos);
    } catch (_) {
        renderDots({});
    }
});
