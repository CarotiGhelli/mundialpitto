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
    if (el) { el.textContent = `d.c.r. ${p.rigori}`; el.style.display = 'block'; }
}

function renderBracket() {
    // applyPlayoffTeams() is already called inside _applyFirebaseData, so partiteDB is ready
    function p(round) { return partiteDB.find(x => x.playoffRound === round); }

    const qf2 = p('qf2'); const qf1 = p('qf1');
    const sf1 = p('sf1'); const sf2 = p('sf2');
    const fin = p('fin'); const p34 = p('p34'); const p56 = p('p56');

    // Team names
    if (qf2) { setText('qf2-t1', qf2.squadra1); setText('qf2-t2', qf2.squadra2); }
    if (qf1) { setText('qf1-t1', qf1.squadra1); setText('qf1-t2', qf1.squadra2); }
    if (sf1) { setText('sf1-t1', sf1.squadra1); setText('sf1-t2', sf1.squadra2); }
    if (sf2) { setText('sf2-t1', sf2.squadra1); setText('sf2-t2', sf2.squadra2); }
    if (fin) { setText('fin-t1', fin.squadra1);  setText('fin-t2', fin.squadra2);  }
    if (p34) { setText('p34-t1', p34.squadra1);  setText('p34-t2', p34.squadra2);  }
    if (p56) { setText('p56-t1', p56.squadra1);  setText('p56-t2', p56.squadra2);  }

    // Scores
    setGoals('qf2', 'qf2-g1', 'qf2-g2');
    setGoals('qf1', 'qf1-g1', 'qf1-g2');
    setGoals('sf1', 'sf1-g1', 'sf1-g2');
    setGoals('sf2', 'sf2-g1', 'sf2-g2');
    setGoals('fin', 'fin-g1',  'fin-g2');
    setGoals('p34', 'p34-g1',  'p34-g2');
    setGoals('p56', 'p56-g1',  'p56-g2');

    // Rigori (d.c.r.)
    setRigori('qf2', 'qf2-dcr');
    setRigori('qf1', 'qf1-dcr');
    setRigori('sf1', 'sf1-dcr');
    setRigori('sf2', 'sf2-dcr');
    setRigori('fin', 'fin-dcr');
    setRigori('p34', 'p34-dcr');
    setRigori('p56', 'p56-dcr');

    // Campione
    if (fin && fin.risultato) {
        const [g1, g2] = fin.risultato.split(' - ').map(Number);
        const winner = g1 > g2 ? fin.squadra1 : g2 > g1 ? fin.squadra2 : null;
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
