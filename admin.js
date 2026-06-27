let currentMatchId = null;

function initAdmin() {
    loadMatchesInSelect();
    displayMatches();
    document.getElementById('match-select').addEventListener('change', onMatchSelect);
}

function loadMatchesInSelect() {
    const sel = document.getElementById('match-select');
    sel.innerHTML = '<option value="">-- Seleziona una partita --</option>';
    partiteDB.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        const stato = p.risultato ? ` [${p.risultato}]` : '';
        opt.textContent = `G${p.giorno} ${p.orario} | ${p.squadra1} vs ${p.squadra2}${stato}`;
        sel.appendChild(opt);
    });
}

function onMatchSelect() {
    const id = parseInt(this.value);
    const section = document.getElementById('match-detail-section');
    if (!id) { section.style.display = 'none'; currentMatchId = null; return; }

    currentMatchId = id;
    section.style.display = 'block';

    const partita = partiteDB.find(p => p.id === id);
    document.getElementById('label-team1').textContent = partita.squadra1;
    document.getElementById('label-team2').textContent = partita.squadra2;

    if (partita.risultato) {
        const [g1, g2] = partita.risultato.split(' - ').map(Number);
        document.getElementById('goals-team1').value = g1;
        document.getElementById('goals-team2').value = g2;
    } else {
        document.getElementById('goals-team1').value = 0;
        document.getElementById('goals-team2').value = 0;
    }

    document.getElementById('scorers-list').innerHTML = '';
    if (partita.marcatori && partita.marcatori.length > 0) {
        partita.marcatori.forEach(m => addScorerRow(m.nome, m.gol || 0, m.assist || 0));
    }

    populateMvpSelect(partita);
    if (partita.mvp) document.getElementById('mvp-select').value = partita.mvp;
}

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildPlayerOptionsHtml(partita, defaultValue) {
    let html = '<option value="">-- Giocatore --</option>';
    [partita.squadra1, partita.squadra2].forEach(nomeSquadra => {
        const sq = squadreDB.find(s => s.nome === nomeSquadra);
        if (!sq) return;
        html += `<optgroup label="${escHtml(nomeSquadra)}">`;
        sq.giocatori.forEach(g => {
            const sel = g.nome === defaultValue ? 'selected' : '';
            html += `<option value="${escHtml(g.nome)}" ${sel}>${escHtml(g.nome)}${g.capitano ? ' (C)' : ''}</option>`;
        });
        html += '</optgroup>';
    });
    return html;
}

function addScorerRow(playerName, gol, assist) {
    playerName = playerName || '';
    gol = gol || 0;
    assist = assist || 0;
    const partita = partiteDB.find(p => p.id === currentMatchId);
    if (!partita) return;

    const list = document.getElementById('scorers-list');
    const row = document.createElement('div');
    row.className = 'scorer-row';
    row.innerHTML = `
        <select class="s-player">${buildPlayerOptionsHtml(partita, playerName)}</select>
        <span class="s-lbl">Gol</span>
        <input type="number" class="s-gol scorer-num" min="0" value="${gol}">
        <span class="s-lbl">Ast</span>
        <input type="number" class="s-ast scorer-num" min="0" value="${assist}">
        <button class="btn-remove-scorer" onclick="this.closest('.scorer-row').remove()">&#x2715;</button>
    `;
    list.appendChild(row);
}

function populateMvpSelect(partita) {
    const sel = document.getElementById('mvp-select');
    sel.innerHTML = '<option value="">-- Nessun MVP --</option>';
    [partita.squadra1, partita.squadra2].forEach(nomeSquadra => {
        const sq = squadreDB.find(s => s.nome === nomeSquadra);
        if (!sq) return;
        const group = document.createElement('optgroup');
        group.label = nomeSquadra;
        sq.giocatori.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g.nome;
            opt.textContent = g.nome + (g.capitano ? ' (C)' : '');
            group.appendChild(opt);
        });
        sel.appendChild(group);
    });
}

function saveAll() {
    if (!currentMatchId) { showError('Seleziona una partita'); return; }

    const partita = partiteDB.find(p => p.id === currentMatchId);
    if (!partita) return;

    const g1 = parseInt(document.getElementById('goals-team1').value) || 0;
    const g2 = parseInt(document.getElementById('goals-team2').value) || 0;

    const newMarcatori = [];
    document.querySelectorAll('.scorer-row').forEach(row => {
        const nome = row.querySelector('.s-player').value;
        if (!nome) return;
        const gol = parseInt(row.querySelector('.s-gol').value) || 0;
        const assist = parseInt(row.querySelector('.s-ast').value) || 0;
        if (gol === 0 && assist === 0) return;

        let squadra = '';
        [partita.squadra1, partita.squadra2].forEach(nomeSquadra => {
            const sq = squadreDB.find(s => s.nome === nomeSquadra);
            if (sq && sq.giocatori.some(g => g.nome === nome)) squadra = nomeSquadra;
        });
        newMarcatori.push({ nome, squadra, gol, assist });
    });

    partita.risultato = `${g1} - ${g2}`;
    partita.marcatori = newMarcatori;
    partita.mvp = document.getElementById('mvp-select').value || null;

    recomputeAllClassifications();
    recomputeGiocatoriStats();
    saveDataToFirebase();

    showSuccess(`Salvato: ${partita.squadra1} ${g1}-${g2} ${partita.squadra2}`);
    loadMatchesInSelect();
    displayMatches();
}

function deleteCurrentResult() {
    if (!currentMatchId) return;
    if (!confirm('Cancellare il risultato di questa partita?')) return;

    const partita = partiteDB.find(p => p.id === currentMatchId);
    if (!partita) return;

    partita.risultato = null;
    partita.marcatori = [];
    partita.mvp = null;

    recomputeAllClassifications();
    recomputeGiocatoriStats();
    saveDataToFirebase();

    showSuccess('Risultato cancellato');
    loadMatchesInSelect();
    displayMatches();

    document.getElementById('goals-team1').value = 0;
    document.getElementById('goals-team2').value = 0;
    document.getElementById('scorers-list').innerHTML = '';
    document.getElementById('mvp-select').value = '';
}

function recomputeAllClassifications() {
    ['A', 'B'].forEach(girone => {
        classificheDB[girone].forEach(s => {
            s.punti = 0; s.giocate = 0; s.vinte = 0; s.pareggiate = 0; s.perse = 0; s.gf = 0; s.gs = 0;
        });
    });
    partiteDB.forEach(p => {
        if (!p.risultato) return;
        const [g1, g2] = p.risultato.split(' - ').map(Number);
        const cl = classificheDB[p.girone];
        const sq1 = cl.find(s => s.squadra === p.squadra1);
        const sq2 = cl.find(s => s.squadra === p.squadra2);
        if (!sq1 || !sq2) return;
        sq1.giocate++; sq2.giocate++;
        sq1.gf += g1; sq1.gs += g2;
        sq2.gf += g2; sq2.gs += g1;
        if (g1 > g2) { sq1.vinte++; sq2.perse++; sq1.punti += 3; }
        else if (g1 < g2) { sq2.vinte++; sq1.perse++; sq2.punti += 3; }
        else { sq1.pareggiate++; sq2.pareggiate++; sq1.punti++; sq2.punti++; }
    });
    ['A', 'B'].forEach(girone => {
        classificheDB[girone].sort((a, b) => b.punti !== a.punti ? b.punti - a.punti : (b.gf - b.gs) - (a.gf - a.gs));
        classificheDB[girone].forEach((s, i) => s.posizione = i + 1);
    });
}

function recomputeGiocatoriStats() {
    giocatoriStatsDB.forEach(g => { g.marcatori = 0; g.assist = 0; });
    partiteDB.forEach(p => {
        (p.marcatori || []).forEach(m => {
            let g = giocatoriStatsDB.find(x => x.nome === m.nome);
            if (!g) {
                g = { nome: m.nome, squadra: m.squadra, marcatori: 0, assist: 0 };
                giocatoriStatsDB.push(g);
            }
            g.marcatori += m.gol || 0;
            g.assist += m.assist || 0;
        });
    });
}

function displayMatches() {
    const container = document.getElementById('matches-list');
    let html = '';
    partiteDB.forEach(partita => {
        const stato = partita.risultato
            ? `<strong style="color:var(--neon-green)">${partita.risultato}</strong>`
            : '<span style="color:var(--text-muted)">In attesa</span>';
        const mvpTag = partita.mvp ? ` | MVP: ${escHtml(partita.mvp)}` : '';
        html += `
            <div class="match-item">
                <div class="match-info">
                    <div class="match-title">${escHtml(partita.squadra1)} vs ${escHtml(partita.squadra2)}</div>
                    <div class="match-meta">G${partita.giorno} &ndash; ${partita.orario} | Girone ${partita.girone} | ${stato}${mvpTag}</div>
                </div>
                <div class="match-actions">
                    <button class="btn-small btn-edit" onclick="editMatch(${partita.id})">Modifica</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html || '<p style="color: var(--text-muted);">Nessuna partita</p>';
}

function editMatch(id) {
    document.getElementById('match-select').value = id;
    document.getElementById('match-select').dispatchEvent(new Event('change'));
    document.getElementById('match-select').scrollIntoView({ behavior: 'smooth' });
}

function showSuccess(msg) {
    const el = document.getElementById('success-msg');
    el.textContent = '✅ ' + msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3500);
}

function showError(msg) {
    const el = document.getElementById('error-msg');
    el.textContent = '❌ ' + msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3500);
}

document.addEventListener('DOMContentLoaded', async () => {
    await firebaseReady;
    initAdmin();
});
