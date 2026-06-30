function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function teamByPos(arr, pos) {
    const sorted = [...arr].sort((a, b) => a.posizione - b.posizione);
    return sorted[pos - 1]?.squadra || '—';
}

async function renderBracket() {
    const classA = classificheDB['A'] || [];
    const classB = classificheDB['B'] || [];

    // QUARTI DI FINALE
    setText('qf1-t1', teamByPos(classB, 2));
    setText('qf1-t2', teamByPos(classA, 3));
    setText('qf2-t1', teamByPos(classA, 2));
    setText('qf2-t2', teamByPos(classB, 3));

    // SEMIFINALI (accesso diretto per i 1° classificati)
    // SF1 (top): 1° Girone B vs Vin. QF2
    // SF2 (bottom): 1° Girone A vs Vin. QF1
    setText('sf1-t1', teamByPos(classB, 1));
    setText('sf2-t1', teamByPos(classA, 1));

    // Carica i risultati playoff da Firebase
    const bracketData = await loadBracketFromFirebase();

    // Nomi vincitori/perdenti
    if (bracketData.qf2_winner) setText('sf1-t2', bracketData.qf2_winner);
    if (bracketData.qf1_winner) setText('sf2-t2', bracketData.qf1_winner);
    if (bracketData.sf1_winner) setText('fin-t1', bracketData.sf1_winner);
    if (bracketData.sf2_winner) setText('fin-t2', bracketData.sf2_winner);
    if (bracketData.winner)     setText('winner-name', bracketData.winner);

    if (bracketData.sf1_loser)  setText('p34-t1', bracketData.sf1_loser);
    if (bracketData.sf2_loser)  setText('p34-t2', bracketData.sf2_loser);
    if (bracketData.qf1_loser)  setText('p56-t1', bracketData.qf1_loser);
    if (bracketData.qf2_loser)  setText('p56-t2', bracketData.qf2_loser);

    // Goal per ogni slot (formato bracketData: qf1_g1, qf1_g2, ...)
    const goalSlots = [
        'qf1_g1','qf1_g2',
        'qf2_g1','qf2_g2',
        'sf1_g1','sf1_g2',
        'sf2_g1','sf2_g2',
        'fin_g1','fin_g2',
        'p34_g1','p34_g2',
        'p56_g1','p56_g2'
    ];
    goalSlots.forEach(key => {
        if (bracketData[key] !== undefined) {
            const htmlId = key.replace('_g', '-g');
            setText(htmlId, bracketData[key]);
            const el = document.getElementById(htmlId);
            if (el) el.classList.add('has-score');
        }
    });

    // Evidenzia il vincitore se già noto
    if (bracketData.winner && bracketData.winner !== '—') {
        const box = document.getElementById('winner-box');
        if (box) box.classList.add('winner-known');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await firebaseReady;
    renderBracket();
});
