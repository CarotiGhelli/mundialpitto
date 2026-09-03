// Trova l'edizione archiviata da mostrare, in base al parametro ?ed= nell'URL
function getEdizioneArchivio() {
    const id = new URLSearchParams(location.search).get('ed');
    return archivioEdizioniDB.find(e => e.id === id) || archivioEdizioniDB[archivioEdizioniDB.length - 1] || null;
}

function getSquadraLogoArchivio(squadre, nomeSquadra) {
    const squadra = squadre.find(s => s.nome === nomeSquadra);
    if (squadra && squadra.logo) {
        return `<img src="Loghi/${squadra.logo}" alt="${squadra.nome}" class="team-badge-img">`;
    }
    return `<div class="team-badge">${squadra ? squadra.badge : '?'}</div>`;
}

// Copia locale di getScorerText (da script.js): le pagine archivio sono statiche
// e non caricano script.js/Firebase, quindi non dipendono dai dati live.
function getScorerTextArchivio(partita, squadra, side) {
    if (!partita.risultato) return '<span class="no-scorer">&mdash;</span>';
    const lista = (partita.marcatori || []).filter(m => m.squadra === squadra && (m.gol > 0 || m.assist > 0));
    if (lista.length === 0) return '<span class="no-scorer">&mdash;</span>';
    return lista.map(m => {
        const g = m.gol   > 0 ? `${m.gol}&#9917;`    : '';
        const a = m.assist > 0 ? `${m.assist}&#x1F45F;` : '';
        const gSpan = `<span class="scorer-g">${g}</span>`;
        const aSpan = `<span class="scorer-a">${a}</span>`;
        const nSpan = `<span class="scorer-name">${m.nome}</span>`;
        return side === 'right' ? nSpan + gSpan + aSpan : gSpan + aSpan + nSpan;
    }).join('');
}

function renderMatchCardArchivio(ed, partita, dividerLabel) {
    const badge1 = getSquadraLogoArchivio(ed.squadre, partita.squadra1);
    const badge2 = getSquadraLogoArchivio(ed.squadre, partita.squadra2);
    const risultato = partita.risultato || '- - -';
    const rigoriHtml = partita.rigori ? `<span class="rigori-badge">rig. ${partita.rigori}</span>` : '';

    return `
        <div class="cal-girone-divider">${dividerLabel}</div>
        <div class="match-card">
            <div class="match-row">
                <div class="team">
                    <span class="team-name">${partita.squadra1}</span>
                    ${badge1}
                </div>
                <div class="score-center">
                    <span class="match-time-label">${partita.orario}</span>
                    <div class="score-pill">${risultato}</div>
                    ${rigoriHtml}
                </div>
                <div class="team away">
                    ${badge2}
                    <span class="team-name">${partita.squadra2}</span>
                </div>
            </div>
            <div class="match-scorers-row">
                <div class="scorers-col">${getScorerTextArchivio(partita, partita.squadra1, 'left')}</div>
                <div class="scorers-col right">${getScorerTextArchivio(partita, partita.squadra2, 'right')}</div>
            </div>
            ${partita.mvp ? `<div class="mvp-card-row">&#11088; MVP: ${partita.mvp}</div>` : ''}
        </div>`;
}

function renderCalendarioArchivio() {
    const ed = getEdizioneArchivio();
    const container = document.querySelector('.calendario-container');

    if (!ed) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);">Nessuna edizione archiviata trovata.</p>';
        return;
    }

    document.getElementById('ed-nome').textContent = ed.nome;
    document.title = `Calendario ${ed.nome} - MundialPitto`;

    const giornate = {};
    ed.partite.filter(p => !p.playoffRound).forEach(p => {
        if (!giornate[p.giorno]) giornate[p.giorno] = [];
        giornate[p.giorno].push(p);
    });

    let html = '';
    Object.keys(giornate).sort().forEach(giorno => {
        html += `<div class="giornata-box"><div class="giornata-header"><h2>GIORNATA ${giorno}</h2></div>`;
        giornate[giorno].forEach(p => {
            html += renderMatchCardArchivio(ed, p, p.girone === 'A' ? 'Girone A' : 'Girone B');
        });
        html += `</div>`;
    });

    const playoff = ed.partite.filter(p => p.playoffRound).sort((a, b) => a.id - b.id);
    if (playoff.length > 0) {
        html += `<div class="giornata-box"><div class="giornata-header"><h2>FASE PLAYOFF</h2></div>`;
        playoff.forEach(p => { html += renderMatchCardArchivio(ed, p, p.label); });
        html += `</div>`;
    }

    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderCalendarioArchivio);
