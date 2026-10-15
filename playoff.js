function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '—';
}

function setGoals(round, slot1, slot2) {
    const p = partiteDB.find(x => x.playoffRound === round);
    if (!p || !p.risultato) return;
    const [g1, g2] = p.risultato.split(' - ');
    const el1 = document.getElementById(slot1);
    const el2 = document.getElementById(slot2);
    if (el1) { el1.textContent = g1; el1.classList.add('has-score'); }
    if (el2) { el2.textContent = g2; el2.classList.add('has-score'); }
}

function setRigori(round, dcrId) {
    const p = partiteDB.find(x => x.playoffRound === round);
    if (!p || !p.rigori) return;
    const el = document.getElementById(dcrId);
    if (el) { el.textContent = `rig. ${p.rigori}`; el.style.display = 'block'; }
}

function setOrario(round, vsId) {
    const p = partiteDB.find(x => x.playoffRound === round);
    const el = document.getElementById(vsId);
    if (el && p && p.orario) el.textContent = `${p.orario} • vs`;
}

function renderBracket() {
    // applyPlayoffTeams() is already called inside _applyFirebaseData, so partiteDB is ready
    function p(round) { return partiteDB.find(x => x.playoffRound === round); }

    const rounds = ['pi1', 'pi2', 'pi3', 'sf1', 'sf2', 'p34', 'fin'];
    rounds.forEach(round => {
        const partita = p(round);
        if (partita) { setText(`${round}-t1`, partita.squadra1); setText(`${round}-t2`, partita.squadra2); }
        setGoals(round, `${round}-g1`, `${round}-g2`);
        setRigori(round, `${round}-dcr`);
        setOrario(round, `${round}-vs`);
    });

    // Mini-classifica Play In (solo se le 3 partite sono state giocate)
    const classificaPlayIn = typeof getClassificaPlayIn === 'function' ? getClassificaPlayIn() : null;
    const wrapper = document.getElementById('playin-classifica-wrapper');
    if (classificaPlayIn && wrapper) {
        wrapper.style.display = 'block';
        document.getElementById('playin-classifica-body').innerHTML = classificaPlayIn.map((s, i) => `
            <tr class="${i < 2 ? 'row-playin-qualificata' : ''}">
                <td class="col-pos">${i + 1}</td>
                <td class="col-team">${s.squadra}</td>
                <td class="col-highlight" style="text-align:center;">${s.punti}</td>
                <td class="col-data">${s.gf}</td>
                <td class="col-data">${s.gs}</td>
            </tr>`).join('');
    }

    // Campione
    const fin = p('fin');
    if (fin && fin.risultato) {
        const [g1, g2] = fin.risultato.split(' - ').map(Number);
        let winner = g1 > g2 ? fin.squadra1 : g2 > g1 ? fin.squadra2 : null;
        if (!winner && fin.rigori) {
            const [r1, r2] = fin.rigori.split(' - ').map(Number);
            winner = r1 > r2 ? fin.squadra1 : r2 > r1 ? fin.squadra2 : null;
        }
        if (winner) {
            setText('winner-name', winner);
            document.getElementById('winner-box')?.classList.add('winner-known');
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await firebaseReady;
    renderBracket();
});
