let currentMatchId = null;

function initAdmin() {
    loadMatchesInSelect();
    displayMatches();
    document.getElementById('match-select').addEventListener('change', onMatchSelect);
    initFormationEditor();
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
    const posEditor = document.getElementById('posizioni-partita-editor');
    if (posEditor) posEditor.style.display = 'none';
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

    // Nascondi il form e resetta la selezione (la partita torna "non giocata")
    currentMatchId = null;
    document.getElementById('match-select').value = '';
    document.getElementById('match-detail-section').style.display = 'none';
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

// ===== VITTORIA A TAVOLINO =====
function vittoriaATavolino(teamNum) {
    if (!currentMatchId) { showError('Seleziona una partita'); return; }
    const partita = partiteDB.find(p => p.id === currentMatchId);
    if (!partita) return;
    const winner = teamNum === 1 ? partita.squadra1 : partita.squadra2;
    if (!confirm(`Vittoria a tavolino 3-0 per ${winner}?`)) return;

    partita.risultato = teamNum === 1 ? '3 - 0' : '0 - 3';
    partita.marcatori = [];
    partita.mvp = null;

    document.getElementById('goals-team1').value = teamNum === 1 ? 3 : 0;
    document.getElementById('goals-team2').value = teamNum === 1 ? 0 : 3;
    document.getElementById('scorers-list').innerHTML = '';
    document.getElementById('mvp-select').value = '';

    recomputeAllClassifications();
    recomputeGiocatoriStats();
    saveDataToFirebase();
    showSuccess(`Vittoria a tavolino: ${partita.squadra1} ${partita.risultato} ${partita.squadra2}`);
    loadMatchesInSelect();
    displayMatches();
}

// ===== FORMATION EDITOR =====
const formState = { squadraId: null, casa: null, trasferta: null };
const matchPosState = { team1: null, team2: null };
let activeDrag = null;

function deepCopyFormation(f) {
    const result = {};
    Object.keys(f).forEach(r => { result[r] = { left: f[r].left, top: f[r].top }; });
    return result;
}

function initFormationEditor() {
    const sel = document.getElementById('formazione-team-select');
    squadreDB.forEach(sq => {
        const o = document.createElement('option');
        o.value = sq.id;
        o.textContent = sq.nome;
        sel.appendChild(o);
    });
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchmove', onTouchDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
}

function onTeamSelectChange() {
    const id = parseInt(document.getElementById('formazione-team-select').value);
    const editor = document.getElementById('formazione-editor');
    if (!id) { editor.style.display = 'none'; return; }
    formState.squadraId = id;
    editor.style.display = 'block';
    loadFormazioniFromFirebase(id).then(data => {
        formState.casa      = data && data.casa      ? deepCopyFormation(data.casa)      : deepCopyFormation(DEFAULT_FORMATION.casa);
        formState.trasferta = data && data.trasferta ? deepCopyFormation(data.trasferta) : deepCopyFormation(DEFAULT_FORMATION.trasferta);
        renderFormDots('pitch-casa',      formState.casa,      'team1-dot', 'casa');
        renderFormDots('pitch-trasferta', formState.trasferta, 'team2-dot', 'trasferta');
    });
}

const ROLE_LABELS = { gk: 'POR', def: 'DIF', ml: 'CL', mr: 'CR', fw: 'ATT' };

function renderFormDots(pitchId, formation, dotClass, stateKey) {
    const pitch = document.getElementById(pitchId);
    if (!pitch) return;
    pitch.querySelectorAll('.form-dot').forEach(d => d.remove());
    Object.entries(formation).forEach(([role, pos]) => {
        const dot = document.createElement('div');
        dot.className = `form-dot ${dotClass}`;
        dot.style.left = pos.left + '%';
        dot.style.top  = pos.top  + '%';
        dot.textContent = ROLE_LABELS[role] || role.toUpperCase();
        dot.dataset.role     = role;
        dot.dataset.stateKey = stateKey;
        dot.addEventListener('mousedown',  onDragStart);
        dot.addEventListener('touchstart', onDragStart, { passive: false });
        pitch.appendChild(dot);
    });
}

function onDragStart(e) {
    activeDrag = {
        dot: e.currentTarget,
        pitch: e.currentTarget.parentElement,
        stateKey: e.currentTarget.dataset.stateKey,
        role: e.currentTarget.dataset.role
    };
    e.preventDefault();
}

function getPosPct(clientX, clientY, pitch) {
    const rect = pitch.getBoundingClientRect();
    return {
        left: Math.max(2, Math.min(98, (clientX - rect.left) / rect.width  * 100)),
        top:  Math.max(2, Math.min(98, (clientY - rect.top)  / rect.height * 100))
    };
}

function applyDrag(clientX, clientY) {
    if (!activeDrag) return;
    const pos = getPosPct(clientX, clientY, activeDrag.pitch);
    activeDrag.dot.style.left = pos.left.toFixed(1) + '%';
    activeDrag.dot.style.top  = pos.top.toFixed(1)  + '%';
    const stored = { left: parseFloat(pos.left.toFixed(1)), top: parseFloat(pos.top.toFixed(1)) };
    const sk = activeDrag.stateKey;
    if (sk === 'casa')      formState.casa[activeDrag.role]      = stored;
    else if (sk === 'trasferta') formState.trasferta[activeDrag.role] = stored;
    else if (sk === 'match1')    matchPosState.team1[activeDrag.role] = stored;
    else if (sk === 'match2')    matchPosState.team2[activeDrag.role] = stored;
}

function onDragMove(e)      { applyDrag(e.clientX, e.clientY); }
function onTouchDragMove(e) { if (activeDrag) { applyDrag(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); } }
function onDragEnd()        { activeDrag = null; }

async function salvaFormazione() {
    if (!formState.squadraId) { showError('Seleziona una squadra'); return; }
    await saveFormazioniToFirebase(formState.squadraId, { casa: formState.casa, trasferta: formState.trasferta });
    showSuccess('Formazione salvata!');
}

// ===== MATCH POSITION OVERRIDE =====
async function togglePosizioniPartita() {
    const editor = document.getElementById('posizioni-partita-editor');
    if (editor.style.display !== 'none') { editor.style.display = 'none'; return; }
    if (!currentMatchId) return;

    const partita = partiteDB.find(p => p.id === currentMatchId);
    if (!partita) return;

    document.getElementById('label-pitch1').textContent = partita.squadra1;
    document.getElementById('label-pitch2').textContent = partita.squadra2;

    const existing = await loadPosizioniPartitaFromFirebase(currentMatchId);
    const sq1 = squadreDB.find(s => s.nome === partita.squadra1);
    const sq2 = squadreDB.find(s => s.nome === partita.squadra2);
    let f1 = null, f2 = null;
    if (!existing) {
        [f1, f2] = await Promise.all([
            sq1 ? loadFormazioniFromFirebase(sq1.id) : Promise.resolve(null),
            sq2 ? loadFormazioniFromFirebase(sq2.id) : Promise.resolve(null)
        ]);
    }

    matchPosState.team1 = existing && existing.squadra1
        ? deepCopyFormation(existing.squadra1)
        : f1 && f1.casa ? deepCopyFormation(f1.casa) : deepCopyFormation(DEFAULT_FORMATION.casa);
    matchPosState.team2 = existing && existing.squadra2
        ? deepCopyFormation(existing.squadra2)
        : f2 && f2.trasferta ? deepCopyFormation(f2.trasferta) : deepCopyFormation(DEFAULT_FORMATION.trasferta);

    renderFormDots('pitch-match1', matchPosState.team1, 'team1-dot', 'match1');
    renderFormDots('pitch-match2', matchPosState.team2, 'team2-dot', 'match2');
    editor.style.display = 'block';
}

async function salvaPosizioniPartita() {
    if (!currentMatchId) return;
    await savePosizioniPartitaToFirebase(currentMatchId, { squadra1: matchPosState.team1, squadra2: matchPosState.team2 });
    showSuccess('Posizioni partita salvate!');
}

async function cancellaPosizioniPartita() {
    if (!currentMatchId) return;
    if (!confirm('Rimuovere le posizioni personalizzate per questa partita?')) return;
    await firebaseDB.ref(`mundialPitto/posizioniPartita/${currentMatchId}`).remove();
    document.getElementById('posizioni-partita-editor').style.display = 'none';
    showSuccess('Posizioni personalizzate rimosse');
}

// ===== PLAYOFF BRACKET ADMIN =====
let bracketCache = {};

async function initBracketAdmin() {
    bracketCache = await loadBracketFromFirebase();
    renderBracketAdmin();
}

function bracketTeams() {
    function tp(girone, pos) {
        const arr = classificheDB[girone] || [];
        return [...arr].sort((a, b) => a.posizione - b.posizione)[pos - 1]?.squadra || null;
    }
    const d = bracketCache;
    return {
        qf2: { label: 'QF2 · 18:00', t1: tp('A', 2), t2: tp('B', 3) },
        qf1: { label: 'QF1 · 18:30', t1: tp('B', 2), t2: tp('A', 3) },
        sf1: { label: 'SF1 · 19:30', t1: tp('B', 1), t2: d.qf2_winner || null },
        sf2: { label: 'SF2 · 19:00', t1: tp('A', 1), t2: d.qf1_winner || null },
        p56: { label: '5°/6° Posto · 20:00', t1: d.qf1_loser || null, t2: d.qf2_loser || null },
        p34: { label: '3°/4° Posto · 20:30', t1: d.sf1_loser || null, t2: d.sf2_loser || null },
        fin: { label: 'Finale · 21:00', t1: d.sf1_winner || null, t2: d.sf2_winner || null },
    };
}

function renderBracketAdmin() {
    const container = document.getElementById('bracket-admin-container');
    if (!container) return;
    const teams = bracketTeams();
    const d = bracketCache;
    const order = ['qf2', 'qf1', 'sf1', 'sf2', 'p56', 'p34', 'fin'];

    let html = '';
    order.forEach(key => {
        const m = teams[key];
        const g1val = d[`${key}_g1`] !== undefined ? d[`${key}_g1`] : '';
        const g2val = d[`${key}_g2`] !== undefined ? d[`${key}_g2`] : '';
        const winner = key === 'fin' ? d.winner : d[`${key}_winner`];
        const disabled = (!m.t1 || !m.t2) ? ' disabled' : '';
        const t1name = escHtml(m.t1 || '(da definire)');
        const t2name = escHtml(m.t2 || '(da definire)');
        const winTag = winner
            ? `<span style="color:var(--neon-green);font-size:0.8rem;">&#10003; Vin: ${escHtml(winner)}</span>`
            : '';
        const delBtn = winner
            ? `<button class="btn-small btn-danger" onclick="deletePlayoffMatch('${key}')">&#x2715;</button>`
            : '';

        html += `
            <div class="match-item">
                <div class="match-info">
                    <div class="match-meta" style="margin-bottom:0.4rem;">${m.label}</div>
                    <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
                        <span style="flex:1;font-weight:600;font-size:0.85rem;">${t1name}</span>
                        <input type="number" id="bg-${key}-g1" class="score-num-input"
                               style="width:48px;font-size:1rem;" min="0" value="${g1val}"${disabled}>
                        <span class="score-sep" style="font-size:1rem;">:</span>
                        <input type="number" id="bg-${key}-g2" class="score-num-input"
                               style="width:48px;font-size:1rem;" min="0" value="${g2val}"${disabled}>
                        <span style="flex:1;font-weight:600;font-size:0.85rem;text-align:right;">${t2name}</span>
                    </div>
                    <div style="margin-top:0.35rem;">${winTag}</div>
                </div>
                <div class="match-actions" style="align-self:center;">
                    <button class="btn-small btn-edit" onclick="savePlayoffMatch('${key}')"${disabled}>Salva</button>
                    ${delBtn}
                </div>
            </div>`;
    });

    container.innerHTML = html || '<p style="color:var(--text-muted);">Nessuna partita</p>';
}

async function savePlayoffMatch(key) {
    const teams = bracketTeams();
    const m = teams[key];
    if (!m.t1 || !m.t2) { showError('Squadre non ancora definite'); return; }

    const g1 = parseInt(document.getElementById(`bg-${key}-g1`).value) || 0;
    const g2 = parseInt(document.getElementById(`bg-${key}-g2`).value) || 0;
    const winner = g1 > g2 ? m.t1 : g2 > g1 ? m.t2 : null;
    const loser  = g1 > g2 ? m.t2 : g2 > g1 ? m.t1 : null;

    bracketCache[`${key}_g1`] = g1;
    bracketCache[`${key}_g2`] = g2;
    if (key === 'fin') {
        bracketCache.winner = winner;
    } else {
        if (winner) { bracketCache[`${key}_winner`] = winner; bracketCache[`${key}_loser`] = loser; }
    }

    await saveBracketToFirebase(bracketCache);
    showSuccess(`${key.toUpperCase()} salvato: ${m.t1} ${g1}–${g2} ${m.t2}${winner ? ' | Vin: ' + winner : ''}`);
    renderBracketAdmin();
}

async function deletePlayoffMatch(key) {
    if (!confirm(`Cancellare il risultato di ${key.toUpperCase()}?`)) return;

    delete bracketCache[`${key}_g1`];
    delete bracketCache[`${key}_g2`];
    if (key === 'fin') {
        delete bracketCache.winner;
    } else {
        delete bracketCache[`${key}_winner`];
        delete bracketCache[`${key}_loser`];
    }

    // Cancella a cascata i risultati dipendenti
    if (key === 'qf2') { clearBracketMatch('sf1'); clearBracketMatch('fin'); clearBracketMatch('p34'); }
    if (key === 'qf1') { clearBracketMatch('sf2'); clearBracketMatch('fin'); clearBracketMatch('p34'); }
    if (key === 'sf1' || key === 'sf2') { clearBracketMatch('fin'); clearBracketMatch('p34'); }

    await saveBracketToFirebase(bracketCache);
    showSuccess(`Risultato ${key.toUpperCase()} cancellato`);
    renderBracketAdmin();
}

function clearBracketMatch(key) {
    delete bracketCache[`${key}_g1`];
    delete bracketCache[`${key}_g2`];
    delete bracketCache[`${key}_winner`];
    delete bracketCache[`${key}_loser`];
    if (key === 'fin') delete bracketCache.winner;
}

document.addEventListener('DOMContentLoaded', async () => {
    await firebaseReady;
    initAdmin();
    await initBracketAdmin();
});
