// Trova l'edizione archiviata da mostrare, in base al parametro ?ed= nell'URL
function getEdizioneArchivio() {
    const id = new URLSearchParams(location.search).get('ed');
    return archivioEdizioniDB.find(e => e.id === id) || archivioEdizioniDB[archivioEdizioniDB.length - 1] || null;
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '—';
}

function setGoals(partite, round, slot1, slot2) {
    const p = partite.find(x => x.playoffRound === round);
    if (!p || !p.risultato) return;
    const [g1, g2] = p.risultato.split(' - ');
    const el1 = document.getElementById(slot1);
    const el2 = document.getElementById(slot2);
    if (el1) { el1.textContent = g1; el1.classList.add('has-score'); }
    if (el2) { el2.textContent = g2; el2.classList.add('has-score'); }
}

function setRigori(partite, round, dcrId) {
    const p = partite.find(x => x.playoffRound === round);
    if (!p || !p.rigori) return;
    const el = document.getElementById(dcrId);
    if (el) { el.textContent = `rig. ${p.rigori}`; el.style.display = 'block'; }
}

function setOrario(partite, round, vsId) {
    const p = partite.find(x => x.playoffRound === round);
    const el = document.getElementById(vsId);
    if (el && p && p.orario) el.textContent = `${p.orario} • vs`;
}

function renderBracketArchivio(ed) {
    document.getElementById('ed-nome').textContent = ed.nome;
    document.title = `Tabellone Playoff ${ed.nome} - MundialPitto`;

    const partite = ed.partite || [];
    function p(round) { return partite.find(x => x.playoffRound === round); }

    const qf2 = p('qf2'); const qf1 = p('qf1');
    const sf1 = p('sf1'); const sf2 = p('sf2');
    const fin = p('fin'); const p34 = p('p34'); const p56 = p('p56');

    if (qf2) { setText('qf2-t1', qf2.squadra1); setText('qf2-t2', qf2.squadra2); }
    if (qf1) { setText('qf1-t1', qf1.squadra1); setText('qf1-t2', qf1.squadra2); }
    if (sf1) { setText('sf1-t1', sf1.squadra1); setText('sf1-t2', sf1.squadra2); }
    if (sf2) { setText('sf2-t1', sf2.squadra1); setText('sf2-t2', sf2.squadra2); }
    if (fin) { setText('fin-t1', fin.squadra1);  setText('fin-t2', fin.squadra2);  }
    if (p34) { setText('p34-t1', p34.squadra1);  setText('p34-t2', p34.squadra2);  }
    if (p56) { setText('p56-t1', p56.squadra1);  setText('p56-t2', p56.squadra2);  }

    ['qf2', 'qf1', 'sf1', 'sf2', 'fin', 'p34', 'p56'].forEach(round => {
        setGoals(partite, round, `${round}-g1`, `${round}-g2`);
        setRigori(partite, round, `${round}-dcr`);
        setOrario(partite, round, `${round}-vs`);
    });

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

document.addEventListener('DOMContentLoaded', () => {
    const ed = getEdizioneArchivio();
    if (!ed) {
        document.querySelector('.playoff-page-container').innerHTML +=
            '<p style="text-align:center;color:var(--text-muted);">Nessuna edizione archiviata trovata.</p>';
        return;
    }
    renderBracketArchivio(ed);
});
