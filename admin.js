let currentMatchId = null;
let currentFase = null;
let currentEvents = []; // { nome, squadra, tipo: 'gol'|'giallo'|'rosso' }
const tipoSelezionato = { 1: 'gol', 2: 'gol' };

const FASI = {
    girone:      { titolo: 'Girone',   filter: p => !p.playoffRound },
    triangolare: { titolo: 'Play In',  filter: p => ['pi1', 'pi2', 'pi3'].includes(p.playoffRound) },
    semifinale:  { titolo: 'Semifinale', filter: p => ['sf1', 'sf2'].includes(p.playoffRound) },
    finalina:    { titolo: 'Finalina', filter: p => p.playoffRound === 'p34' },
    finale:      { titolo: 'Finale',   filter: p => p.playoffRound === 'fin' }
};

function initAdmin() {
    popolaSelectSquadreAggiungiGiocatore();
    aggiungiRigaGiocatore();
}

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== NAVIGAZIONE VISTE =====
function mostraVista(id) {
    ['view-menu', 'view-matches', 'view-result'].forEach(v => {
        document.getElementById(v).style.display = v === id ? 'block' : 'none';
    });
}

function tornaAlMenu() {
    currentFase = null;
    mostraVista('view-menu');
}

function tornaAFase() {
    currentMatchId = null;
    mostraVista('view-matches');
}

function apriFase(fase) {
    currentFase = fase;
    renderListaPartiteFase();
    mostraVista('view-matches');
}

function renderListaPartiteFase() {
    const info = FASI[currentFase];
    document.getElementById('matches-fase-title').textContent = info.titolo;
    const list = partiteDB.filter(info.filter).sort((a, b) => a.id - b.id);
    const container = document.getElementById('fase-matches-list');

    let html = '';
    list.forEach(p => {
        const risDisplay = p.risultato
            ? `${p.risultato}${p.rigori ? ` (rig. ${p.rigori})` : ''}`
            : null;
        const stato = risDisplay
            ? `<strong style="color:var(--neon-green)">${risDisplay}</strong>`
            : '<span style="color:var(--text-muted)">In attesa</span>';
        const t1 = escHtml(p.squadra1 || '—');
        const t2 = escHtml(p.squadra2 || '—');
        const meta = p.playoffRound
            ? `${p.label || ''} &ndash; ${p.orario}`
            : `G${p.giorno} &ndash; ${p.orario} | Girone ${p.girone}`;
        html += `
            <div class="match-item" onclick="apriRisultato(${p.id})">
                <div class="match-info">
                    <div class="match-title">${t1} vs ${t2}</div>
                    <div class="match-meta">${meta} | ${stato}</div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html || '<p style="color: var(--text-muted);">Nessuna partita in questa fase</p>';
}

function getBadgeHtml(nomeSquadra) {
    const sq = squadreDB.find(s => s.nome === nomeSquadra);
    if (sq && sq.logo) return `<img src="Loghi/${sq.logo}" alt="${sq.nome}" class="team-badge-img">`;
    return `<div class="team-badge">${sq ? sq.badge : '?'}</div>`;
}

// ===== APERTURA RISULTATO PARTITA =====
function apriRisultato(id) {
    const partita = partiteDB.find(p => p.id === id);
    if (!partita) return;
    currentMatchId = id;

    document.getElementById('rh-name1').textContent = partita.squadra1 || '—';
    document.getElementById('rh-name2').textContent = partita.squadra2 || '—';
    document.getElementById('rh-badge1').innerHTML = getBadgeHtml(partita.squadra1);
    document.getElementById('rh-badge2').innerHTML = getBadgeHtml(partita.squadra2);
    document.getElementById('aep-name1').textContent = partita.squadra1 || '—';
    document.getElementById('aep-name2').textContent = partita.squadra2 || '—';
    document.getElementById('rig-label1').textContent = partita.squadra1 || 'Squa. 1';
    document.getElementById('rig-label2').textContent = partita.squadra2 || 'Squa. 2';

    if (partita.risultato) {
        const [g1, g2] = partita.risultato.split(' - ').map(Number);
        document.getElementById('goals-team1').value = g1;
        document.getElementById('goals-team2').value = g2;
    } else {
        document.getElementById('goals-team1').value = 0;
        document.getElementById('goals-team2').value = 0;
    }

    const rigoriSection = document.getElementById('rigori-section');
    rigoriSection.style.display = partita.playoffRound ? 'block' : 'none';
    if (partita.rigori) {
        const [r1, r2] = partita.rigori.split(' - ').map(Number);
        document.getElementById('rigori-team1').value = r1;
        document.getElementById('rigori-team2').value = r2;
    } else {
        document.getElementById('rigori-team1').value = 0;
        document.getElementById('rigori-team2').value = 0;
    }

    currentEvents = [];
    (partita.marcatori || []).forEach(m => {
        for (let i = 0; i < (m.gol || 0); i++) currentEvents.push({ nome: m.nome, squadra: m.squadra, tipo: 'gol' });
    });
    (partita.cartellini || []).forEach(c => currentEvents.push({ nome: c.nome, squadra: c.squadra, tipo: c.tipo }));

    tipoSelezionato[1] = 'gol';
    tipoSelezionato[2] = 'gol';
    aggiornaToggleUI(1);
    aggiornaToggleUI(2);
    document.getElementById('aep-search1').value = '';
    document.getElementById('aep-search2').value = '';

    renderEventsLists();
    renderPickList(1);
    renderPickList(2);
    populateMvpSelect(partita);
    document.getElementById('mvp-select').value = partita.mvp || '';

    mostraVista('view-result');
}

// ===== LISTE EVENTI (marcatori/cartellini) =====
function iconaTipo(tipo) {
    if (tipo === 'gol') return '&#9917;';
    if (tipo === 'giallo') return '&#128992;';
    return '&#128308;';
}

function renderEventsLists() {
    const partita = partiteDB.find(p => p.id === currentMatchId);
    if (!partita) return;
    [1, 2].forEach(side => {
        const nomeSquadra = side === 1 ? partita.squadra1 : partita.squadra2;
        const container = document.getElementById(`events-list${side}`);
        let html = '';
        currentEvents.forEach((ev, idx) => {
            if (ev.squadra !== nomeSquadra) return;
            html += `
                <div class="event-chip">
                    <span>${iconaTipo(ev.tipo)} ${escHtml(ev.nome)}</span>
                    <button class="ec-remove" onclick="rimuoviEvento(${idx})">&#x2715;</button>
                </div>`;
        });
        container.innerHTML = html || '<p style="color:var(--text-muted);font-size:0.85rem;">Nessuno</p>';
    });
}

function rimuoviEvento(idx) {
    currentEvents.splice(idx, 1);
    renderEventsLists();
}

function aggiungiEvento(side, nome, squadra) {
    currentEvents.push({ nome, squadra, tipo: tipoSelezionato[side] });
    renderEventsLists();
}

function setTipoEvento(side, tipo) {
    tipoSelezionato[side] = tipo;
    aggiornaToggleUI(side);
}

function aggiornaToggleUI(side) {
    const toggle = document.getElementById(`aep-toggle${side}`);
    const tipo = tipoSelezionato[side];
    toggle.querySelectorAll('button').forEach((btn, i) => {
        const map = ['gol', 'giallo', 'rosso'];
        btn.className = map[i] === tipo ? `active-${tipo}` : '';
    });
}

function renderPickList(side) {
    const partita = partiteDB.find(p => p.id === currentMatchId);
    if (!partita) return;
    const nomeSquadra = side === 1 ? partita.squadra1 : partita.squadra2;
    const sq = squadreDB.find(s => s.nome === nomeSquadra);
    const container = document.getElementById(`pick-list${side}`);
    if (!sq) { container.innerHTML = ''; return; }

    const query = (document.getElementById(`aep-search${side}`).value || '').toLowerCase().trim();
    const giocatori = sq.giocatori.filter(g => g.nome.toLowerCase().includes(query));

    container.innerHTML = giocatori.map(g => {
        const label = (g.numero ? g.numero + '. ' : '') + g.nome + (g.capitano ? ' (C)' : '');
        return `<button type="button" class="player-pick-item" data-nome="${escHtml(g.nome)}">${escHtml(label)}</button>`;
    }).join('') || '<p style="color:var(--text-muted);font-size:0.85rem;">Nessun giocatore</p>';

    container.querySelectorAll('.player-pick-item').forEach(btn => {
        btn.addEventListener('click', () => aggiungiEvento(side, btn.dataset.nome, nomeSquadra));
    });
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

// ===== SALVATAGGIO RISULTATO =====
function saveAll() {
    if (!currentMatchId) { showError('Seleziona una partita'); return; }
    const partita = partiteDB.find(p => p.id === currentMatchId);
    if (!partita) return;

    const g1 = parseInt(document.getElementById('goals-team1').value) || 0;
    const g2 = parseInt(document.getElementById('goals-team2').value) || 0;

    const marcatoriMap = {};
    const cartellini = [];
    currentEvents.forEach(ev => {
        if (ev.tipo === 'gol') {
            const key = ev.nome + '|' + ev.squadra;
            if (!marcatoriMap[key]) marcatoriMap[key] = { nome: ev.nome, squadra: ev.squadra, gol: 0 };
            marcatoriMap[key].gol++;
        } else {
            cartellini.push({ nome: ev.nome, squadra: ev.squadra, tipo: ev.tipo });
        }
    });
    const newMarcatori = Object.values(marcatoriMap);

    partita.risultato = `${g1} - ${g2}`;
    partita.marcatori = newMarcatori;
    partita.cartellini = cartellini;
    partita.mvp = document.getElementById('mvp-select').value || null;
    partita.rigori = null;
    if (partita.playoffRound && g1 === g2) {
        const r1 = parseInt(document.getElementById('rigori-team1')?.value) || 0;
        const r2 = parseInt(document.getElementById('rigori-team2')?.value) || 0;
        if (r1 !== r2) partita.rigori = `${r1} - ${r2}`;
    }

    recomputeAllClassifications();
    applyPlayoffTeams();
    recomputeGiocatoriStats();
    saveDataToFirebase();

    showSuccess(`Salvato: ${partita.squadra1} ${g1}-${g2} ${partita.squadra2}`);

    const elencati1 = newMarcatori.filter(m => m.squadra === partita.squadra1).reduce((s, m) => s + m.gol, 0);
    const elencati2 = newMarcatori.filter(m => m.squadra === partita.squadra2).reduce((s, m) => s + m.gol, 0);
    if (elencati1 !== g1 || elencati2 !== g2) {
        showWarning(`Gol dei marcatori non tornano col risultato: ${partita.squadra1} ${elencati1}/${g1}, ${partita.squadra2} ${elencati2}/${g2}. Salvato comunque (autogol o marcatori ignoti?).`);
    }

    renderListaPartiteFase();
}

function deleteCurrentResult() {
    if (!currentMatchId) return;
    if (!confirm('Cancellare il risultato di questa partita?')) return;

    const partita = partiteDB.find(p => p.id === currentMatchId);
    if (!partita) return;

    partita.risultato = null;
    partita.marcatori = [];
    partita.cartellini = [];
    partita.mvp = null;
    partita.rigori = null;

    recomputeAllClassifications();
    applyPlayoffTeams();
    recomputeGiocatoriStats();
    saveDataToFirebase();

    showSuccess('Risultato cancellato');
    tornaAFase();
}

function recomputeAllClassifications() {
    Object.keys(classificheDB).forEach(girone => {
        classificheDB[girone].forEach(s => {
            s.punti = 0; s.giocate = 0; s.vinte = 0; s.pareggiate = 0; s.perse = 0; s.gf = 0; s.gs = 0;
        });
    });
    partiteDB.forEach(p => {
        if (!p.risultato) return;
        const cl = classificheDB[p.girone];
        if (!cl) return; // salta partite playoff (girone: 'PO')
        const [g1, g2] = p.risultato.split(' - ').map(Number);
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
    Object.keys(classificheDB).forEach(girone => {
        classificheDB[girone].sort((a, b) => b.punti !== a.punti ? b.punti - a.punti : (b.gf - b.gs) - (a.gf - a.gs));
        classificheDB[girone].forEach((s, i) => s.posizione = i + 1);
    });
}

function recomputeGiocatoriStats() {
    giocatoriStatsDB.forEach(g => { g.marcatori = 0; });
    partiteDB.forEach(p => {
        (p.marcatori || []).forEach(m => {
            let g = giocatoriStatsDB.find(x => x.nome === m.nome);
            if (!g) {
                g = { nome: m.nome, squadra: m.squadra, marcatori: 0 };
                giocatoriStatsDB.push(g);
            }
            g.marcatori += m.gol || 0;
        });
    });
}

function showSuccess(msg) {
    const el = document.getElementById('success-msg');
    el.textContent = '✅ ' + msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3500);
}

function showWarning(msg) {
    const el = document.getElementById('warning-msg');
    el.textContent = '⚠️ ' + msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 9000);
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
    partita.cartellini = [];
    partita.mvp = null;
    currentEvents = [];

    document.getElementById('goals-team1').value = teamNum === 1 ? 3 : 0;
    document.getElementById('goals-team2').value = teamNum === 1 ? 0 : 3;
    renderEventsLists();
    document.getElementById('mvp-select').value = '';

    recomputeAllClassifications();
    applyPlayoffTeams();
    recomputeGiocatoriStats();
    saveDataToFirebase();
    showSuccess(`Vittoria a tavolino: ${partita.squadra1} ${partita.risultato} ${partita.squadra2}`);
    renderListaPartiteFase();
}

// ===== AGGIUNGI GIOCATORI =====
function popolaSelectSquadreAggiungiGiocatore() {
    const sel = document.getElementById('aggp-team-select');
    squadreDB.forEach(sq => {
        const o = document.createElement('option');
        o.value = sq.id;
        o.textContent = sq.nome;
        sel.appendChild(o);
    });
}

function aggiungiRigaGiocatore() {
    const container = document.getElementById('aggp-rows');
    const row = document.createElement('div');
    row.className = 'aggp-row';
    row.innerHTML = `
        <input type="text" class="aggp-nome" placeholder="Nome">
        <input type="text" class="aggp-cognome" placeholder="Cognome">
        <input type="number" class="aggp-numero" placeholder="N.º" min="0">
        <button class="btn-remove-scorer" onclick="this.closest('.aggp-row').remove()" style="background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:6px;cursor:pointer;padding:0.4rem 0.6rem;">&#x2715;</button>
    `;
    container.appendChild(row);
}

async function salvaGiocatoriNuovi() {
    const squadraId = parseInt(document.getElementById('aggp-team-select').value);
    if (!squadraId) { showError('Seleziona una squadra'); return; }
    const sq = squadreDB.find(s => s.id === squadraId);
    if (!sq) return;

    const nuovi = [];
    document.querySelectorAll('#aggp-rows .aggp-row').forEach(row => {
        const nome = row.querySelector('.aggp-nome').value.trim();
        const cognome = row.querySelector('.aggp-cognome').value.trim();
        const numero = parseInt(row.querySelector('.aggp-numero').value) || null;
        if (!nome && !cognome) return;
        const nomeCompleto = [nome, cognome].filter(Boolean).join(' ');
        nuovi.push({ nome: nomeCompleto, numero });
    });

    if (nuovi.length === 0) { showError('Inserisci almeno un giocatore'); return; }

    await saveRosterExtraToFirebase(squadraId, nuovi);
    nuovi.forEach(g => { if (!sq.giocatori.some(x => x.nome === g.nome)) sq.giocatori.push(g); });

    showSuccess(`Aggiunti ${nuovi.length} giocatori a ${sq.nome}`);
    document.getElementById('aggp-rows').innerHTML = '';
    aggiungiRigaGiocatore();
}

document.addEventListener('DOMContentLoaded', async () => {
    await firebaseReady;
    initAdmin();
});
