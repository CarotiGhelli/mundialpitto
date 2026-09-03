// Badge/logo di una squadra, cercata per nome nel DB dell'edizione corrente.
// Le squadre di edizioni passate non sono più nel DB: in quel caso si mostra solo il nome.
function getBadgeStorico(nomeSquadra) {
    const sq = squadreDB.find(s => s.nome === nomeSquadra);
    if (sq && sq.logo) {
        return `<img src="Loghi/${sq.logo}" alt="${sq.nome}" style="width:100%;height:100%;object-fit:contain;">`;
    }
    if (sq) {
        return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, ${sq.colore} 0%, ${sq.coloreScuro} 100%);font-weight:900;">${sq.badge}</div>`;
    }
    return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-card-hover);font-size:1.5rem;">&#127942;</div>`;
}

function renderEdizioneCorrente() {
    const box = document.getElementById('edizione-corrente-box');
    const ed = getEdizioneCorrente();

    if (!ed.campione) {
        box.innerHTML = `
            <div class="edizione-corrente-card in-corso">
                <div class="trophy-icon" style="font-size:2.2rem;">&#9203;</div>
                <h2 class="edizione-anno-title">MUNDIALPITTO ${ed.anno} &mdash; IN CORSO</h2>
                <p class="storico-sub">Il campione di quest'edizione non è ancora stato incoronato.</p>
                ${ed.capocannoniere ? `<p class="storico-sub">Capocannoniere al momento: <strong>${ed.capocannoniere.nome}</strong> (${ed.capocannoniere.squadra}) con ${ed.capocannoniere.marcatori} gol</p>` : ''}
                <a href="classifica.html" class="btn-playoff" style="margin-top:1rem;">Vedi la Classifica &rarr;</a>
            </div>`;
        return;
    }

    box.innerHTML = `
        <div class="edizione-corrente-card">
            <div class="trophy-icon" style="font-size:2.2rem;">&#127942;</div>
            <div class="storico-badge">EDIZIONE ${ed.anno}</div>
            <div class="campione-crest">${getBadgeStorico(ed.campione)}</div>
            <h2 class="edizione-anno-title">${ed.campione}</h2>
            <p class="storico-sub">Campione del MundialPitto ${ed.anno}</p>
            <div class="edizione-stats-row">
                <div class="edizione-stat">
                    <span class="edizione-stat-label">Finalista</span>
                    <span class="edizione-stat-value">${ed.finalista || '—'}</span>
                </div>
                <div class="edizione-stat">
                    <span class="edizione-stat-label">3&deg; Posto</span>
                    <span class="edizione-stat-value">${ed.terzo || '—'}</span>
                </div>
                <div class="edizione-stat">
                    <span class="edizione-stat-label">Capocannoniere</span>
                    <span class="edizione-stat-value">${ed.capocannoniere ? `${ed.capocannoniere.nome} (${ed.capocannoniere.marcatori}&#9917;)` : '—'}</span>
                </div>
            </div>
        </div>`;
}

function renderAlboOro() {
    const grid = document.getElementById('albo-oro-grid');
    const edCorrente = getEdizioneCorrente();

    const edizioni = [...storicoDB];
    if (edCorrente.conclusa) edizioni.push(edCorrente);
    edizioni.sort((a, b) => b.anno - a.anno);

    if (edizioni.length === 0) {
        grid.innerHTML = `
            <div class="girone-card" style="text-align:center;color:var(--text-muted);">
                Il MundialPitto è nato nel ${annoCorrente}: l'albo d'oro si arricchirà edizione dopo edizione.
            </div>`;
        return;
    }

    grid.innerHTML = `
        <div class="albo-oro-list">
            ${edizioni.map(ed => `
                <div class="girone-card albo-oro-item">
                    <div class="albo-oro-anno">${ed.anno}</div>
                    <div class="albo-oro-crest">${getBadgeStorico(ed.campione)}</div>
                    <div class="albo-oro-info">
                        <div class="albo-oro-campione">${ed.campione}</div>
                        <div class="albo-oro-dettagli">
                            Finalista: <strong>${ed.finalista || '—'}</strong>
                            ${ed.terzo ? ` &bull; 3&deg;: <strong>${ed.terzo}</strong>` : ''}
                        </div>
                        ${ed.capocannoniere ? `<div class="albo-oro-dettagli">Capocannoniere: <strong>${ed.capocannoniere.nome}</strong> (${ed.capocannoniere.marcatori}&#9917;)</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>`;
}

document.addEventListener('DOMContentLoaded', async () => {
    await firebaseReady;
    renderEdizioneCorrente();
    renderAlboOro();
});
