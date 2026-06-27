// Inizializza il pannello admin
function initAdmin() {
    loadMatchesInSelects();
    displayMatches();

    // Popola il dropdown giocatori quando si sceglie la partita
    document.getElementById('scorer-match-select').addEventListener('change', function() {
        populatePlayerSelect(parseInt(this.value) || null);
    });
}

// Carica le partite nei select
function loadMatchesInSelects() {
    const matchSelect = document.getElementById('match-select');
    const scorerSelect = document.getElementById('scorer-match-select');

    matchSelect.innerHTML = '<option value="">-- Seleziona una partita --</option>';
    scorerSelect.innerHTML = '<option value="">-- Seleziona una partita --</option>';

    partiteDB.forEach(partita => {
        const option = document.createElement('option');
        const label = `${partita.squadra1} vs ${partita.squadra2} (Giorno ${partita.giorno} - ${partita.orario})`;
        option.value = partita.id;
        option.textContent = label;
        matchSelect.appendChild(option);
        scorerSelect.appendChild(option.cloneNode(true));
    });
}

// Popola il select giocatori in base alla partita selezionata
function populatePlayerSelect(matchId) {
    const select = document.getElementById('player-select');
    select.innerHTML = '<option value="">-- Seleziona giocatore --</option>';

    if (!matchId) {
        select.innerHTML = '<option value="">-- Prima seleziona la partita --</option>';
        return;
    }

    const partita = partiteDB.find(p => p.id === matchId);
    if (!partita) return;

    const squadra1 = squadreDB.find(s => s.nome === partita.squadra1);
    const squadra2 = squadreDB.find(s => s.nome === partita.squadra2);

    [squadra1, squadra2].forEach(sq => {
        if (!sq) return;
        const group = document.createElement('optgroup');
        group.label = sq.nome;
        sq.giocatori.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g.nome;
            opt.textContent = g.nome + (g.capitano ? ' (C)' : '');
            group.appendChild(opt);
        });
        select.appendChild(group);
    });
}

// Mostra le partite caricate
function displayMatches() {
    const container = document.getElementById('matches-list');
    let html = '';

    partiteDB.forEach(partita => {
        html += `
            <div class="match-item">
                <div class="match-info">
                    <div class="match-title">${partita.squadra1} vs ${partita.squadra2}</div>
                    <div class="match-meta">
                        Giorno ${partita.giorno} - ${partita.orario} | Girone ${partita.girone}
                        ${partita.risultato ? ` | Risultato: ${partita.risultato}` : ' | In attesa'}
                    </div>
                </div>
                <div class="match-actions">
                    <button class="btn-small btn-edit" onclick="editMatch(${partita.id})">Modifica</button>
                    <button class="btn-small btn-delete" onclick="deleteMatch(${partita.id})">Cancella</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html || '<p style="color: var(--text-muted);">Nessuna partita caricata</p>';
}

// Salva il risultato della partita
function saveMatchResult() {
    const matchId = parseInt(document.getElementById('match-select').value);
    const goalsTeam1 = parseInt(document.getElementById('goals-team1').value);
    const goalsTeam2 = parseInt(document.getElementById('goals-team2').value);

    if (!matchId) {
        showError('Seleziona una partita');
        return;
    }

    const partita = partiteDB.find(p => p.id === matchId);
    if (!partita) {
        showError('Partita non trovata');
        return;
    }

    // Aggiorna il risultato
    partita.risultato = `${goalsTeam1} - ${goalsTeam2}`;

    // Aggiorna la classifica
    updateClassification(partita, goalsTeam1, goalsTeam2);

    // Salva nel localStorage
    saveDataToFirebase();

    // Mostra messaggio di successo
    showSuccess(`Risultato salvato: ${partita.squadra1} ${goalsTeam1} - ${goalsTeam2} ${partita.squadra2}`);

    // Aggiorna la lista
    displayMatches();

    // Reset form
    document.getElementById('match-select').value = '';
    document.getElementById('goals-team1').value = '0';
    document.getElementById('goals-team2').value = '0';
}

// Aggiorna la classifica dopo un risultato
function updateClassification(partita, goalsTeam1, goalsTeam2) {
    const girone = partita.girone;
    const classifiche = classificheDB[girone];

    const squadra1 = classifiche.find(s => s.squadra === partita.squadra1);
    const squadra2 = classifiche.find(s => s.squadra === partita.squadra2);

    if (!squadra1 || !squadra2) return;

    // Aggiorna partite giocate
    squadra1.giocate++;
    squadra2.giocate++;

    // Aggiorna gol
    squadra1.gf += goalsTeam1;
    squadra1.gs += goalsTeam2;
    squadra2.gf += goalsTeam2;
    squadra2.gs += goalsTeam1;

    // Calcola punti
    if (goalsTeam1 > goalsTeam2) {
        squadra1.vinte++;
        squadra2.perse++;
        squadra1.punti += 3;
    } else if (goalsTeam1 < goalsTeam2) {
        squadra2.vinte++;
        squadra1.perse++;
        squadra2.punti += 3;
    } else {
        squadra1.pareggiate++;
        squadra2.pareggiate++;
        squadra1.punti += 1;
        squadra2.punti += 1;
    }

    // Riordina la classifica
    classifiche.sort((a, b) => {
        if (b.punti !== a.punti) return b.punti - a.punti;
        return (b.gf - b.gs) - (a.gf - a.gs);
    });

    // Aggiorna le posizioni
    classifiche.forEach((s, i) => s.posizione = i + 1);
}

// Aggiungi marcatore/assist
function addScorerStats() {
    const matchId = parseInt(document.getElementById('scorer-match-select').value);
    const playerName = document.getElementById('player-select').value.trim();
    const goals = parseInt(document.getElementById('goals-count').value) || 0;
    const assists = parseInt(document.getElementById('assists-count').value) || 0;

    if (!matchId || !playerName) {
        showError('Compila tutti i campi');
        return;
    }

    if (goals === 0 && assists === 0) {
        showError('Inserisci almeno un gol o un assist');
        return;
    }

    const partita = partiteDB.find(p => p.id === matchId);
    if (!partita) {
        showError('Partita non trovata');
        return;
    }

    // Cerca o crea il giocatore nel database
    let giocatore = giocatoriStatsDB.find(g => g.nome === playerName);
    if (!giocatore) {
        // Trova la squadra
        const squadra1 = squadreDB.find(s => s.nome === partita.squadra1);
        const squadra2 = squadreDB.find(s => s.nome === partita.squadra2);

        let squadra = null;
        if (squadra1 && squadra1.giocatori.some(g => g.nome === playerName)) {
            squadra = squadra1.nome;
        } else if (squadra2 && squadra2.giocatori.some(g => g.nome === playerName)) {
            squadra = squadra2.nome;
        }

        if (!squadra) {
            showError('Giocatore non trovato nelle squadre');
            return;
        }

        giocatore = { nome: playerName, squadra, marcatori: 0, assist: 0 };
        giocatoriStatsDB.push(giocatore);
    }

    giocatore.marcatori += goals;
    giocatore.assist += assists;

    // Aggiorna anche i marcatori per partita
    if (!partita.marcatori) partita.marcatori = [];
    let matchScorer = partita.marcatori.find(m => m.nome === playerName);
    if (!matchScorer) {
        matchScorer = { nome: playerName, squadra: giocatore.squadra, gol: 0, assist: 0 };
        partita.marcatori.push(matchScorer);
    }
    matchScorer.gol += goals;
    matchScorer.assist += assists;

    saveDataToFirebase();
    showSuccess(`${playerName}: +${goals} gol, +${assists} assist`);

    // Reset form
    document.getElementById('scorer-match-select').value = '';
    populatePlayerSelect(null);
    document.getElementById('goals-count').value = '0';
    document.getElementById('assists-count').value = '0';
}

// Modifica una partita
function editMatch(id) {
    const partita = partiteDB.find(p => p.id === id);
    if (!partita) return;

    document.getElementById('match-select').value = id;
    const [goals1, goals2] = partita.risultato ? partita.risultato.split(' - ').map(Number) : [0, 0];
    document.getElementById('goals-team1').value = goals1;
    document.getElementById('goals-team2').value = goals2;

    // Scroll al form
    document.getElementById('match-select').scrollIntoView({ behavior: 'smooth' });
}

// Cancella il risultato di una partita
function deleteMatch(id) {
    if (!confirm('Sei sicuro di voler cancellare questo risultato?')) return;

    const partita = partiteDB.find(p => p.id === id);
    if (partita) {
        partita.risultato = null;
        partita.marcatori = [];
        saveDataToFirebase();
        showSuccess('Risultato cancellato');
        displayMatches();
    }
}

// Mostra messaggio di successo
function showSuccess(message) {
    const element = document.getElementById('success-msg');
    element.textContent = '✅ ' + message;
    element.style.display = 'block';
    setTimeout(() => element.style.display = 'none', 3000);
}

// Mostra messaggio di errore
function showError(message) {
    const element = document.getElementById('error-msg');
    element.textContent = '❌ ' + message;
    element.style.display = 'block';
    setTimeout(() => element.style.display = 'none', 3000);
}

// Inizializza al caricamento (script.js carica i dati da Firebase)
document.addEventListener('DOMContentLoaded', async () => {
    await firebaseReady;
    initAdmin();
});
