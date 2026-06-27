// Renderizza il calendario con le partite dal database
function renderCalendario() {
    const giornate = {};
    partiteDB.forEach(partita => {
        if (!giornate[partita.giorno]) giornate[partita.giorno] = [];
        giornate[partita.giorno].push(partita);
    });

    const calendarContainer = document.querySelector('.calendario-container');
    let html = '';

    Object.keys(giornate).sort().forEach(giorno => {
        const partite = giornate[giorno];
        const data = giorno == 1 ? '29 Giugno 2026' : '30 Giugno 2026';

        html += `<div class="giornata-box">
            <div class="giornata-header">
                <h2>GIORNATA ${giorno}</h2>
                <span class="riposo-tag">${data}</span>
            </div>`;

        partite.forEach(partita => {
            const gironeLabel = partita.girone === 'A' ? 'Girone A' : 'Girone B';
            const badge1 = getSquadraLogo(partita.squadra1);
            const badge2 = getSquadraLogo(partita.squadra2);
            const risultato = partita.risultato || '- - -';

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
                        </div>
                        <div class="team away">
                            ${badge2}
                            <span class="team-name">${partita.squadra2}</span>
                        </div>
                    </div>
                    <div class="match-scorers-row">
                        <div class="scorers-col">${getScorerText(partita, partita.squadra1)}</div>
                        <div class="scorers-col right">${getScorerText(partita, partita.squadra2)}</div>
                    </div>
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

document.addEventListener('DOMContentLoaded', renderCalendario);
