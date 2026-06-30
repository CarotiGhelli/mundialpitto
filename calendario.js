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

function playoffBadge(nomeSquadra) {
    if (!nomeSquadra) return `<div class="team-badge" style="opacity:0.35;">?</div>`;
    return getSquadraLogo(nomeSquadra);
}

function renderCalendarioPlayoff(d) {
    const calendarContainer = document.querySelector('.calendario-container');

    function tp(girone, pos) {
        const arr = classificheDB[girone] || [];
        const sorted = [...arr].sort((a, b) => a.posizione - b.posizione);
        return sorted[pos - 1]?.squadra || null;
    }

    const qf2t1 = tp('A', 2); const qf2t2 = tp('B', 3);
    const qf1t1 = tp('B', 2); const qf1t2 = tp('A', 3);
    const sf1t1 = tp('B', 1); const sf1t2 = d.qf2_winner || null;
    const sf2t1 = tp('A', 1); const sf2t2 = d.qf1_winner || null;
    const fint1  = d.sf1_winner || null; const fint2  = d.sf2_winner || null;
    const p34t1  = d.sf1_loser  || null; const p34t2  = d.sf2_loser  || null;
    const p56t1  = d.qf1_loser  || null; const p56t2  = d.qf2_loser  || null;

    function goalsStr(g1, g2) {
        return (g1 !== undefined && g1 !== null) ? `${g1} - ${g2}` : '- - -';
    }

    function matchCard(label, orario, t1, seed1, t2, seed2, g1, g2) {
        const name1 = t1 || seed1;
        const name2 = t2 || seed2;
        const b1 = playoffBadge(t1);
        const b2 = playoffBadge(t2);
        return `
            <div class="cal-girone-divider">${label}</div>
            <div class="match-card" style="cursor:default;pointer-events:none;">
                <div class="match-row">
                    <div class="team">
                        <span class="team-name">${name1}</span>
                        ${b1}
                    </div>
                    <div class="score-center">
                        <span class="match-time-label">${orario}</span>
                        <div class="score-pill">${goalsStr(g1, g2)}</div>
                    </div>
                    <div class="team away">
                        ${b2}
                        <span class="team-name">${name2}</span>
                    </div>
                </div>
            </div>`;
    }

    const html = `
        <div class="giornata-box">
            <div class="giornata-header">
                <h2>FASE PLAYOFF</h2>
                <span class="riposo-tag">30 Giugno 2026</span>
            </div>
            ${matchCard('Quarti di Finale', '18:00', qf2t1, '2° Girone A', qf2t2, '3° Girone B', d.qf2_g1, d.qf2_g2)}
            ${matchCard('Quarti di Finale', '18:30', qf1t1, '2° Girone B', qf1t2, '3° Girone A', d.qf1_g1, d.qf1_g2)}
            ${matchCard('Semifinale', '19:00', sf2t1, '1° Girone A', sf2t2, 'Vin. QF1', d.sf2_g1, d.sf2_g2)}
            ${matchCard('Semifinale', '19:30', sf1t1, '1° Girone B', sf1t2, 'Vin. QF2', d.sf1_g1, d.sf1_g2)}
            ${matchCard('5° / 6° Posto', '20:00', p56t1, 'Perd. QF1', p56t2, 'Perd. QF2', d.p56_g1, d.p56_g2)}
            ${matchCard('3° / 4° Posto', '20:30', p34t1, 'Perd. SF1', p34t2, 'Perd. SF2', d.p34_g1, d.p34_g2)}
            ${matchCard('FINALE', '21:00', fint1, 'Vin. SF1', fint2, 'Vin. SF2', d.fin_g1, d.fin_g2)}
        </div>`;

    calendarContainer.insertAdjacentHTML('beforeend', html);
}

document.addEventListener('DOMContentLoaded', async () => {
    await firebaseReady;
    const bracketData = await loadBracketFromFirebase();
    renderCalendario();
    renderCalendarioPlayoff(bracketData);
});
