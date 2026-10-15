// Renderizza il calendario con le partite dal database
function renderCalendario() {
    const calendarContainer = document.querySelector('.calendario-container');

    if (partiteDB.length === 0) {
        calendarContainer.innerHTML = `
            <div class="no-results-msg">
                <p class="no-results-icon">&#128197;</p>
                <p class="no-results-title">Calendario non ancora disponibile</p>
                <p class="no-results-sub">Le partite di questa edizione verranno pubblicate a breve.</p>
            </div>`;
        return;
    }

    const giornate = {};
    partiteDB.filter(p => !p.playoffRound).forEach(partita => {
        if (!giornate[partita.giorno]) giornate[partita.giorno] = [];
        giornate[partita.giorno].push(partita);
    });

    let html = '';

    Object.keys(giornate).sort().forEach(giorno => {
        const partite = giornate[giorno];
        // TODO: aggiornare con le date reali del weekend di Autunno 2026 non appena note.
        const data = giorno == 1 ? 'Sabato' : 'Domenica';

        html += `<div class="giornata-box">
            <div class="giornata-header">
                <h2>GIORNATA ${giorno}</h2>
                <span class="riposo-tag">${data}</span>
            </div>`;

        partite.forEach(partita => {
            const gironeLabel = partita.girone === 'PO' ? (partita.label || 'Playoff') : `Girone ${partita.girone}`;
            const badge1 = getSquadraLogo(partita.squadra1);
            const badge2 = getSquadraLogo(partita.squadra2);
            const risultato = partita.risultato || '- - -';
            const rigoriHtml = partita.rigori ? `<span class="rigori-badge">rig. ${partita.rigori}</span>` : '';

            html += `
                <div class="cal-girone-divider">${gironeLabel}</div>
                <a href="partita.html?id=${partita.id}" class="match-card">
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
                        <div class="scorers-col">${getScorerText(partita, partita.squadra1, 'left')}</div>
                        <div class="scorers-col right">${getScorerText(partita, partita.squadra2, 'right')}</div>
                    </div>
                    ${partita.mvp ? `<div class="mvp-card-row">&#11088; MVP: ${partita.mvp}</div>` : ''}
                </a>`;
        });

        if (giorno == 1) {
            html += `<div class="giornata-box-footer">
                <a href="playoff.html" class="btn-go-playoff">Vai al Tabellone Playoff &rarr;</a>
            </div>`;
        }

        html += `</div>`;
    });

    calendarContainer.innerHTML = html;
}

function getSquadraLogo(nomeSquadra) {
    const squadra = squadreDB.find(s => s.nome === nomeSquadra);
    if (squadra && squadra.logo) {
        return `<img src="Loghi/${squadra.logo}" alt="${squadra.nome}" class="team-badge-img">`;
    }
    return `<div class="team-badge">${squadra ? squadra.badge : '?'}</div>`;
}

function renderCalendarioPlayoff() {
    const playoff = partiteDB.filter(p => p.playoffRound).sort((a, b) => a.id - b.id);
    if (playoff.length === 0) return;

    const calendarContainer = document.querySelector('.calendario-container');

    let html = `
        <div class="giornata-box">
            <div class="giornata-header">
                <h2>FASE PLAYOFF</h2>
                <span class="riposo-tag">30 Giugno 2026</span>
            </div>`;

    playoff.forEach(partita => {
        const name1 = partita.squadra1 || '—';
        const name2 = partita.squadra2 || '—';
        const badge1 = getSquadraLogo(name1);
        const badge2 = getSquadraLogo(name2);
        const risultato = partita.risultato || '- - -';
        const rigoriHtml = partita.rigori ? `<span class="rigori-badge">rig. ${partita.rigori}</span>` : '';

        html += `
            <div class="cal-girone-divider">${partita.label}</div>
            <a href="partita.html?id=${partita.id}" class="match-card">
                <div class="match-row">
                    <div class="team">
                        <span class="team-name">${name1}</span>
                        ${badge1}
                    </div>
                    <div class="score-center">
                        <span class="match-time-label">${partita.orario}</span>
                        <div class="score-pill">${risultato}</div>
                        ${rigoriHtml}
                    </div>
                    <div class="team away">
                        ${badge2}
                        <span class="team-name">${name2}</span>
                    </div>
                </div>
                <div class="match-scorers-row">
                    <div class="scorers-col">${getScorerText(partita, partita.squadra1, 'left')}</div>
                    <div class="scorers-col right">${getScorerText(partita, partita.squadra2, 'right')}</div>
                </div>
                ${partita.mvp ? `<div class="mvp-card-row">&#11088; MVP: ${partita.mvp}</div>` : ''}
            </a>`;
    });

    html += '</div>';
    calendarContainer.insertAdjacentHTML('beforeend', html);
}

document.addEventListener('DOMContentLoaded', async () => {
    await firebaseReady;
    renderCalendario();
    renderCalendarioPlayoff();
});
