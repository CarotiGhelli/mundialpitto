// Trova l'edizione archiviata da mostrare, in base al parametro ?ed= nell'URL
function getEdizioneArchivio() {
    const id = new URLSearchParams(location.search).get('ed');
    return archivioEdizioniDB.find(e => e.id === id) || archivioEdizioniDB[archivioEdizioniDB.length - 1] || null;
}

function getSquadraLogoSmallArchivio(squadre, nomeSquadra) {
    const squadra = squadre.find(s => s.nome === nomeSquadra);
    if (squadra && squadra.logo) {
        return `<img src="Loghi/${squadra.logo}" alt="${squadra.nome}" style="width:28px;height:28px;object-fit:contain;border-radius:4px;">`;
    }
    return `<div style="width:28px;height:28px;border-radius:4px;background:${squadra?.colore||'#333'};display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-weight:900;">${squadra?.badge||'?'}</div>`;
}

function renderClassificheArchivio(ed) {
    const container = document.querySelector('.gironi-container:not(.stats-container)');
    let html = '';
    Object.keys(ed.classifiche || {}).sort().forEach(girone => {
        const squadre = [...ed.classifiche[girone]].sort((a, b) => a.posizione - b.posizione);
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
                    ${squadre.map(sq => `
                    <tr>
                        <td class="col-pos">${sq.posizione}</td>
                        <td class="col-team">
                            <div style="display:flex;align-items:center;gap:0.6rem;">
                                ${getSquadraLogoSmallArchivio(ed.squadre, sq.squadra)}
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
}

function renderStatisticheArchivio(ed) {
    const statsContainer = document.querySelector('.stats-container');
    const marcatori = [...(ed.giocatoriStats || [])]
        .filter(g => g.marcatori > 0)
        .sort((a, b) => b.marcatori - a.marcatori);

    const emptyMsg = '<p style="color:var(--text-muted);text-align:center;padding:1rem;">Nessun dato</p>';

    function buildTable(lista) {
        if (lista.length === 0) return emptyMsg;
        return `<table class="classifica-table">
            <thead><tr>
                <th>Pos</th><th>Giocatore</th><th>Squadra</th>
                <th class="col-data" style="text-align:center;">Gol</th>
            </tr></thead>
            <tbody>
                ${lista.slice(0, 10).map((g, i) => `
                <tr>
                    <td class="col-pos">${i + 1}</td>
                    <td class="col-team" style="font-weight:600;">${g.nome}</td>
                    <td style="color:var(--text-muted);font-size:0.85rem;">${g.squadra}</td>
                    <td class="col-highlight" style="text-align:center;">${g.marcatori}</td>
                </tr>`).join('')}
            </tbody>
        </table>`;
    }

    statsContainer.innerHTML = `
        <div class="girone-card">
            <h2 class="girone-title">&#9917; CLASSIFICA MARCATORI</h2>
            ${buildTable(marcatori)}
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    const ed = getEdizioneArchivio();
    if (!ed) {
        document.querySelector('.classifica-page-container').innerHTML +=
            '<p style="text-align:center;color:var(--text-muted);">Nessuna edizione archiviata trovata.</p>';
        return;
    }
    document.getElementById('ed-nome').textContent = ed.nome;
    document.title = `Classifiche ${ed.nome} - MundialPitto`;
    document.getElementById('playoff-link').href = `playoff-archivio.html?ed=${ed.id}`;
    renderClassificheArchivio(ed);
    renderStatisticheArchivio(ed);
});
