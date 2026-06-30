function renderClassifiche() {
    const container = document.querySelector('.gironi-container');

    let html = '';
    ['A', 'B'].forEach(girone => {
        const squadre = classificheDB[girone];
        html += `
        <div class="girone-card">
            <h2 class="girone-title">GIRONE ${girone}</h2>
            <table class="classifica-table">
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Squadra</th>
                        <th class="col-data" style="text-align:center;">Pt</th>
                        <th class="col-data">G</th>
                        <th class="col-data">V</th>
                        <th class="col-data">N</th>
                        <th class="col-data">P</th>
                        <th class="col-data">GF</th>
                        <th class="col-data">GS</th>
                    </tr>
                </thead>
                <tbody>
                    ${squadre.map((sq, i) => `
                    <tr>
                        <td class="col-pos">${sq.posizione}</td>
                        <td class="col-team">
                            <div style="display:flex;align-items:center;gap:0.6rem;">
                                ${getSquadraLogoSmall(sq.squadra)}
                                <span>${sq.squadra}</span>
                            </div>
                        </td>
                        <td class="col-highlight" style="text-align:center;">${sq.punti}</td>
                        <td class="col-data">${sq.giocate}</td>
                        <td class="col-data">${sq.vinte}</td>
                        <td class="col-data">${sq.pareggiate}</td>
                        <td class="col-data">${sq.perse}</td>
                        <td class="col-data">${sq.gf}</td>
                        <td class="col-data">${sq.gs}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;
    });
    container.innerHTML = html;

    // Render statistiche affiancate
    renderStatistiche();
}

function getSquadraLogoSmall(nomeSquadra) {
    const squadra = squadreDB.find(s => s.nome === nomeSquadra);
    if (squadra && squadra.logo) {
        return `<img src="Loghi/${squadra.logo}" alt="${squadra.nome}" style="width:28px;height:28px;object-fit:contain;border-radius:4px;">`;
    }
    return `<div style="width:28px;height:28px;border-radius:4px;background:${squadra?.colore||'#333'};display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-weight:900;">${squadra?.badge||'?'}</div>`;
}

function renderStatistiche() {
    const statsContainer = document.querySelector('.stats-container');
    if (!statsContainer) return;

    // Ordina marcatori e assist
    const marcatori = [...giocatoriStatsDB]
        .filter(g => g.marcatori > 0)
        .sort((a, b) => b.marcatori - a.marcatori);

    const assist = [...giocatoriStatsDB]
        .filter(g => g.assist > 0)
        .sort((a, b) => b.assist - a.assist);

    const emptyMsg = '<p style="color:var(--text-muted);text-align:center;padding:1rem;">Nessun dato ancora</p>';

    function buildTable(lista, campo, label) {
        if (lista.length === 0) return emptyMsg;
        return `<table class="classifica-table">
            <thead><tr>
                <th>Pos</th><th>Giocatore</th><th>Squadra</th>
                <th class="col-data" style="text-align:center;">${label}</th>
            </tr></thead>
            <tbody>
                ${lista.slice(0, 10).map((g, i) => `
                <tr>
                    <td class="col-pos">${i + 1}</td>
                    <td class="col-team" style="font-weight:600;">${g.nome}</td>
                    <td style="color:var(--text-muted);font-size:0.85rem;">${g.squadra}</td>
                    <td class="col-highlight" style="text-align:center;">${g[campo]}</td>
                </tr>`).join('')}
            </tbody>
        </table>`;
    }

    statsContainer.innerHTML = `
        <div class="girone-card">
            <h2 class="girone-title">⚽ CLASSIFICA MARCATORI</h2>
            ${buildTable(marcatori, 'marcatori', 'Gol')}
        </div>`;
}

document.addEventListener('DOMContentLoaded', async () => {
    await firebaseReady;
    renderClassifiche();
});
