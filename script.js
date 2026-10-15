// Database centrale di squadre e giocatori - MUNDIAL PITTO Autunno 2026
const squadreDB = [
    {
        id: 1,
        nome: "ADLSR FC",
        badge: "ADLSR",
        logo: "ADLSR.png",
        girone: "Girone Unico",
        colore: "#00cc44",
        coloreScuro: "#008833",
        giocatori: [
            { numero: 7,  nome: "Emanuele Cavallini", capitano: true },
            { numero: 8,  nome: "Leonardo Lemmi" },
            { numero: 9,  nome: "Alessandro Riccardi" },
            { numero: 14, nome: "Gabriele Massimo Catalano Belisario" },
            { numero: 20, nome: "Gianni Landi" },
            { numero: 47, nome: "Alessandro Salvadori", portiere: true },
            { numero: 63, nome: "Mattia Aprile" },
            { numero: 67, nome: "Gianmarco Lelli" },
            { numero: 77, nome: "Gabriele Lemmi" }
        ]
    },
    {
        id: 2,
        nome: "Cripta",
        badge: "CRIPTA",
        logo: "Cripta.webp",
        girone: "Girone Unico",
        colore: "#6b3fa0",
        coloreScuro: "#2e1a47",
        giocatori: [
            { numero: 2,  nome: "Emanuele Nannetti" },
            { numero: 6,  nome: "Elias Meliani" },
            { numero: 9,  nome: "Francesko Vrapi" },
            { numero: 11, nome: "André Bergamo" },
            { numero: 13, nome: "Christian Del Nobile" }
        ]
    },
    {
        id: 3,
        nome: "Raccattati FC",
        badge: "RACC",
        logo: "Raccattati.webp",
        girone: "Girone Unico",
        colore: "#c9a227",
        coloreScuro: "#1a1a1a",
        giocatori: [
            { nome: "Stefan Piendibene", capitano: true },
            { nome: "Matteo Casapieri" },
            { nome: "Matteo Ferrini" },
            { nome: "Alessandro Petracchi" },
            { nome: "Edoardo Ribecai" },
            { nome: "Gabriele Pagano" },
            { nome: "Andrea Sorrentino" },
            { nome: "Daniele Cicorelli" }
        ]
    },
    {
        id: 4,
        nome: "Here We Calcio",
        badge: "HWC",
        logo: "HereWeCalcio.webp",
        girone: "Girone Unico",
        colore: "#e8c400",
        coloreScuro: "#1a1a1a",
        giocatori: [
            { nome: "Leonardo Castagnoli" },
            { nome: "Giorgio Giannetti Junior" },
            { nome: "Lorenzo Libia" },
            { nome: "Lorenzo One" },
            { nome: "Kekko Marinai" },
            { nome: "Pietro Asei" }
        ]
    },
    {
        id: 5,
        nome: "Pam FC",
        badge: "PAM",
        logo: "Pam.jpg",
        girone: "Girone Unico",
        colore: "#1a5c38",
        coloreScuro: "#0d2e1c",
        allenatore: "Lorenzo Stefanutti",
        dirigente: "Manfredi Zecca, Daniele Marradi, Luca Musolino",
        giocatori: [
            { nome: "Lorenzo Stefanutti" },
            { nome: "Daniele Marradi" },
            { nome: "Tommaso Marradi" },
            { nome: "Diego Marradi" },
            { nome: "Matteo Morelli" },
            { nome: "Mattia Cirinei" },
            { nome: "Gabriele Palumbo" },
            { nome: "Francesco Fiori" },
            { nome: "Nicola Endrizzi" },
            { nome: "Andrea Claudio Panciatici" },
            { nome: "Francesco Valentin Badiu" },
            { nome: "Tancredi Vannucci" },
            { nome: "Simone Capobianco" },
            { nome: "Vittorio Orsetti" },
            { nome: "Carlo Amaroni" },
            { nome: "Tommaso Casamassima" },
            { nome: "Niccolò Bechini" }
        ]
    }
];

// Database partite - MUNDIAL PITTO Autunno 2026
// Calendario non ancora disponibile (sorteggio casuale, da definire). Le partite
// verranno aggiunte qui non appena arrivano date/orari/accoppiamenti.
const partiteDB = [];

// Database centrale dei marcatori e assist
const giocatoriStatsDB = [];

// Database classifiche: girone unico da 5 squadre (formato Autunno 2026).
// classifica.js/admin.js leggono le chiavi dinamicamente (Object.keys), quindi
// il nome della chiave ("UNICO") puo' essere cambiato liberamente in futuro.
const classificheDB = {
    'UNICO': [
        { posizione: 1, squadra: 'ADLSR FC', punti: 0, giocate: 0, vinte: 0, pareggiate: 0, perse: 0, gf: 0, gs: 0 },
        { posizione: 2, squadra: 'Cripta', punti: 0, giocate: 0, vinte: 0, pareggiate: 0, perse: 0, gf: 0, gs: 0 },
        { posizione: 3, squadra: 'Raccattati FC', punti: 0, giocate: 0, vinte: 0, pareggiate: 0, perse: 0, gf: 0, gs: 0 },
        { posizione: 4, squadra: 'Here We Calcio', punti: 0, giocate: 0, vinte: 0, pareggiate: 0, perse: 0, gf: 0, gs: 0 },
        { posizione: 5, squadra: 'Pam FC', punti: 0, giocate: 0, vinte: 0, pareggiate: 0, perse: 0, gf: 0, gs: 0 }
    ]
};

// Popola le squadre nelle partite playoff in base a classifiche e risultati precedenti.
// NOTA Autunno 2026: scritta per il vecchio formato (2 gironi A/B + QF/SF/Finale).
// Il nuovo formato (girone unico + triangolare retrocessione + semifinali) e'
// diverso: finche' partiteDB non ha voci playoffRound per il nuovo tabellone,
// questa funzione non trova nulla da popolare e non fa niente (safe no-op).
// Da riscrivere quando sara' definito l'esatto tabellone della domenica.
function applyPlayoffTeams() {
    function tp(girone, pos) {
        const arr = classificheDB[girone] || [];
        return [...arr].sort((a, b) => a.posizione - b.posizione)[pos - 1]?.squadra || null;
    }
    function getWinner(round) {
        const p = partiteDB.find(x => x.playoffRound === round);
        if (!p || !p.risultato) return null;
        const [g1, g2] = p.risultato.split(' - ').map(Number);
        if (g1 > g2) return p.squadra1;
        if (g2 > g1) return p.squadra2;
        if (!p.rigori) return null;
        const [r1, r2] = p.rigori.split(' - ').map(Number);
        return r1 > r2 ? p.squadra1 : r2 > r1 ? p.squadra2 : null;
    }
    function getLoser(round) {
        const p = partiteDB.find(x => x.playoffRound === round);
        if (!p || !p.risultato) return null;
        const [g1, g2] = p.risultato.split(' - ').map(Number);
        if (g1 > g2) return p.squadra2;
        if (g2 > g1) return p.squadra1;
        if (!p.rigori) return null;
        const [r1, r2] = p.rigori.split(' - ').map(Number);
        return r1 > r2 ? p.squadra2 : r2 > r1 ? p.squadra1 : null;
    }
    function set(round, t1, t2) {
        const p = partiteDB.find(x => x.playoffRound === round);
        if (!p) return;
        if (t1) p.squadra1 = t1;
        if (t2) p.squadra2 = t2;
    }
    // QF: team da classifica gironi
    set('qf2', tp('A', 2), tp('B', 3));
    set('qf1', tp('B', 2), tp('A', 3));
    // SF: 1° girone + vincitore QF
    set('sf1', tp('B', 1), getWinner('qf2'));
    set('sf2', tp('A', 1), getWinner('qf1'));
    // Piazzamenti e finale
    set('p56', getLoser('qf1'), getLoser('qf2'));
    set('p34', getLoser('sf1'), getLoser('sf2'));
    set('fin', getWinner('sf1'), getWinner('sf2'));
}

// --- FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDrClGGLFYtIzo5tt0UcmIVJ9PyIh8mv0Q",
    authDomain: "mundialpitto.firebaseapp.com",
    databaseURL: "https://mundialpitto-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mundialpitto",
    storageBucket: "mundialpitto.firebasestorage.app",
    messagingSenderId: "134098735194",
    appId: "1:134098735194:web:74093e01a91eb420668863"
};
firebase.initializeApp(firebaseConfig);
const firebaseDB = firebase.database();

// Percorso Firebase dei dati dell'edizione corrente. Per una nuova edizione
// cambiare SOLO questo valore, es. 'mundialPitto/edizioni/inverno-2027': i
// risultati della nuova edizione finiscono in un ramo separato e quelli vecchi
// restano intatti. Deve stare DENTRO 'mundialPitto': le regole del database
// negano l'accesso ad altri rami (verificato: 'edizioni/...' -> permission_denied).
// 'mundialPitto' (radice) = edizione Estate 2026, congelata in archivio.js: non
// toccare quel ramo, resta il record storico di quell'edizione.
const FIREBASE_PATH = 'mundialPitto/edizioni/autunno-2026';

// Promise globale che si risolve quando Firebase ha caricato i dati
let _firebaseReadyResolve;
const firebaseReady = new Promise(resolve => { _firebaseReadyResolve = resolve; });

function _applyFirebaseData(data) {
    if (data.partite) {
        partiteDB.forEach(p => {
            const saved = data.partite[p.id];
            if (saved) {
                p.risultato = saved.risultato || null;
                p.marcatori = saved.marcatori
                    ? (Array.isArray(saved.marcatori) ? saved.marcatori : Object.values(saved.marcatori))
                    : [];
                p.mvp = saved.mvp || null;
                p.rigori = saved.rigori || null;
            }
        });
    }
    if (data.giocatoriStats) {
        giocatoriStatsDB.forEach(g => { g.marcatori = 0; g.assist = 0; });
        const stats = Array.isArray(data.giocatoriStats)
            ? data.giocatoriStats : Object.values(data.giocatoriStats);
        stats.forEach(saved => {
            const g = giocatoriStatsDB.find(x => x.nome === saved.nome);
            if (g) {
                g.marcatori = saved.marcatori || 0;
                g.assist = saved.assist || 0;
            } else {
                giocatoriStatsDB.push({ nome: saved.nome, squadra: saved.squadra, marcatori: saved.marcatori || 0, assist: saved.assist || 0 });
            }
        });
    }
    if (data.classifiche) {
        Object.keys(data.classifiche).forEach(girone => {
            const arr = data.classifiche[girone];
            classificheDB[girone] = (Array.isArray(arr) ? arr : Object.values(arr))
                .map(s => ({ ...s, squadra: s.squadra === 'ADLSR' ? 'ADLSR FC' : s.squadra }));
        });
    }
    // Migra vecchio nome nei marcatori
    partiteDB.forEach(p => {
        (p.marcatori || []).forEach(m => { if (m.squadra === 'ADLSR') m.squadra = 'ADLSR FC'; });
    });
    giocatoriStatsDB.forEach(g => { if (g.squadra === 'ADLSR') g.squadra = 'ADLSR FC'; });
    // Aggiorna le squadre nelle partite playoff
    applyPlayoffTeams();
}

// Cache locale dell'ultimo dato ricevuto: le pagine si disegnano subito da qui e
// Firebase aggiorna in background. Non usata in admin (si modificano dati veri).
// La chiave include il percorso: ogni edizione ha la sua cache.
const _CACHE_KEY = 'mpDataCache_v1:' + FIREBASE_PATH;
const _USE_CACHE = !/admin\.html$/.test(location.pathname);
let _cachedRaw = null;
try { localStorage.removeItem('mpDataCache_v1'); } catch (e) {}
if (_USE_CACHE) {
    try { _cachedRaw = localStorage.getItem(_CACHE_KEY); } catch (e) { _cachedRaw = null; }
}
let _lastRaw = null; // dato attualmente applicato alle strutture in memoria
if (_cachedRaw) {
    try {
        _applyFirebaseData(JSON.parse(_cachedRaw));
        _lastRaw = _cachedRaw;
        _firebaseReadyResolve();
    } catch (e) { _cachedRaw = null; }
} else if (document.body) {
    document.body.classList.add('mp-loading');
}

// Applica un dato arrivato da Firebase. Ritorna true solo se e' DIVERSO da
// quello gia' mostrato (cosi' la pagina sa che deve ridisegnarsi).
function _ingest(value) {
    const raw = JSON.stringify(value);
    if (raw === _lastRaw) return false;
    const eraGiaMostrato = _lastRaw !== null;
    _applyFirebaseData(value);
    _lastRaw = raw;
    if (_USE_CACHE) {
        try { localStorage.setItem(_CACHE_KEY, raw); } catch (e) {}
    }
    return eraGiaMostrato;
}

// Dato nuovo dopo il primo disegno: le pagine "live" si ridisegnano da sole,
// le altre si ricaricano una volta (con protezione anti-loop).
function _datoCambiato() {
    if (window.mpLiveCallback) { window.mpLiveCallback(); return; }
    let last = 0;
    try { last = Number(sessionStorage.getItem('mpReloadedAt')) || 0; } catch (e) {}
    if (Date.now() - last > 10000) {
        try { sessionStorage.setItem('mpReloadedAt', String(Date.now())); } catch (e) {}
        location.reload();
    }
}

// Carica i dati una volta all'avvio e risolve firebaseReady
firebaseDB.ref(FIREBASE_PATH).once('value', snapshot => {
    const cambiato = snapshot.exists() ? _ingest(snapshot.val()) : false;
    _firebaseReadyResolve();
    if (document.body) document.body.classList.remove('mp-loading');
    if (cambiato) _datoCambiato();
}, error => {
    // Es. permission_denied: si mostra la pagina con i dati statici invece di
    // restare bloccati per sempre sulla barra di caricamento.
    console.error('Firebase non raggiungibile su', FIREBASE_PATH, error && error.message);
    _firebaseReadyResolve();
    if (document.body) document.body.classList.remove('mp-loading');
});

// Aggiornamento live: da chiamare solo nelle pagine che devono ridisegnarsi da sole
// (Home, Partita). Tiene aperta una connessione per visitatore. Mai in admin.
function mpEnableLive(onUpdate) {
    if (!_USE_CACHE) return;
    window.mpLiveCallback = onUpdate;
    firebaseDB.ref(FIREBASE_PATH).on('value', snapshot => {
        if (snapshot.exists() && _ingest(snapshot.val())) onUpdate();
    }, error => console.error('Aggiornamento live non disponibile:', error && error.message));
}

// Salva tutti i dati dinamici su Firebase
function saveDataToFirebase() {
    const partiteDaSalvare = {};
    partiteDB.forEach(p => {
        partiteDaSalvare[p.id] = { risultato: p.risultato || null, marcatori: p.marcatori || [], mvp: p.mvp || null, rigori: p.rigori || null };
    });
    const statsDaSalvare = {};
    giocatoriStatsDB.forEach(g => {
        const key = g.nome.replace(/[.#$[\]/]/g, '_');
        statsDaSalvare[key] = { nome: g.nome, squadra: g.squadra, marcatori: g.marcatori || 0, assist: g.assist || 0 };
    });
    return firebaseDB.ref(FIREBASE_PATH).update({
        partite: partiteDaSalvare,
        giocatoriStats: statsDaSalvare,
        classifiche: classificheDB
    });
}

// Default formation positions (used as fallback if no formation is saved)
const DEFAULT_FORMATION = {
    casa:      { gk:{left:5,top:50}, def:{left:20,top:50}, ml:{left:33,top:24}, mr:{left:33,top:76}, fw:{left:46,top:50} },
    trasferta: { gk:{left:95,top:50}, def:{left:80,top:50}, ml:{left:67,top:24}, mr:{left:67,top:76}, fw:{left:54,top:50} }
};

function saveFormazioniToFirebase(squadraId, data) {
    return firebaseDB.ref(`${FIREBASE_PATH}/formazioni/${squadraId}`).set(data);
}
function loadFormazioniFromFirebase(squadraId) {
    return new Promise(resolve => {
        firebaseDB.ref(`${FIREBASE_PATH}/formazioni/${squadraId}`).once('value', snap => {
            resolve(snap.exists() ? snap.val() : null);
        });
    });
}
function savePosizioniPartitaToFirebase(partitaId, data) {
    return firebaseDB.ref(`${FIREBASE_PATH}/posizioniPartita/${partitaId}`).set(data);
}
function loadPosizioniPartitaFromFirebase(partitaId) {
    return new Promise(resolve => {
        firebaseDB.ref(`${FIREBASE_PATH}/posizioniPartita/${partitaId}`).once('value', snap => {
            resolve(snap.exists() ? snap.val() : null);
        });
    });
}

function saveBracketToFirebase(bracketData) {
    return firebaseDB.ref(`${FIREBASE_PATH}/bracket`).set(bracketData);
}

function loadBracketFromFirebase() {
    return new Promise(resolve => {
        firebaseDB.ref(`${FIREBASE_PATH}/bracket`).once('value', snap => {
            resolve(snap.exists() ? snap.val() : {});
        });
    });
}

// Utility: testo marcatori per una squadra in una partita
// 3 celle per giocatore: gol | assist | nome (left) oppure nome | gol | assist (right)
// Il grid a 3 colonne sul parent mantiene goals e assists sempre nella stessa colonna
function getScorerText(partita, squadra, side) {
    if (!partita.risultato) return '<span class="no-scorer">&mdash;</span>';
    const lista = (partita.marcatori || []).filter(m => m.squadra === squadra && (m.gol > 0 || m.assist > 0));
    if (lista.length === 0) return '<span class="no-scorer">&mdash;</span>';
    return lista.map(m => {
        const g = m.gol   > 0 ? `${m.gol}&#9917;`    : '';
        const a = m.assist > 0 ? `${m.assist}&#x1F45F;` : '';
        const gSpan = `<span class="scorer-g">${g}</span>`;
        const aSpan = `<span class="scorer-a">${a}</span>`;
        const nSpan = `<span class="scorer-name">${m.nome}</span>`;
        return side === 'right' ? nSpan + gSpan + aSpan : gSpan + aSpan + nSpan;
    }).join('');
}

// Anno e nome dell'edizione attualmente in corso
const annoCorrente = 2026;
const nomeEdizioneCorrente = 'Autunno 2026';

// Id dell'edizione corrente dentro archivioEdizioniDB (vedi archivio.js), se già
// stata congelata in archivio. Va aggiornato quando si prepara una nuova edizione.
// Vuoto finche' questa edizione non e' conclusa e congelata.
const archivioIdEdizioneCorrente = '';

// Albo d'oro: un oggetto per ogni edizione CONCLUSA in anni precedenti.
// Quando un'edizione finisce, aggiungere qui uno snapshot e azzerare/aggiornare
// squadreDB/partiteDB/giocatoriStatsDB/classificheDB per la nuova edizione.
// Esempio: { anno: 2025, nome: 'Estate 2025', campione: 'Nome Squadra', finalista: 'Nome Squadra', terzo: 'Nome Squadra',
//            capocannonieri: [{ nome: 'Nome Giocatore', squadra: 'Nome Squadra', gol: 5 }] (piu' voci se pari merito), squadrePartecipanti: 6,
//            archivioId: 'estate-2025' }
// "ordine": solo se due edizioni hanno lo stesso "anno" (es. Pasqua ed Estate
// dello stesso anno) — numero progressivo cronologico (1 = prima). Senza
// "ordine" l'edizione conta come la piu' recente di quell'anno.
// "archivioId" va aggiunto solo se esiste anche uno snapshot completo in
// archivio.js (squadre/rose/calendario): senza, l'Albo d'Oro mostra solo il
// riepilogo, senza i bottoni Squadre/Calendario.
const storicoDB = [
    {
        anno: 2026,
        nome: 'Pasqua 2026',
        ordine: 1,
        campione: 'ADLSR FC',
        finalista: 'Bundesdini All-Stars',
        terzo: 'Atletico Gaza',
        capocannonieri: [{ nome: 'Emanuele Nannetti', squadra: 'Bundesdini All-Stars', gol: 6 }]
        // Nessun archivioId: non abbiamo dati di squadre/calendario per questa edizione.
    },
    {
        anno: 2026,
        nome: 'Estate 2026',
        ordine: 2,
        campione: 'DA PIERINO PSG',
        finalista: 'ADLSR FC',
        terzo: 'Staff Poco Tecnico',
        capocannonieri: [
            { nome: 'Matteo Abrans', squadra: 'Staff Poco Tecnico', gol: 10 },
            { nome: 'Matteo Casapieri', squadra: 'DA PIERINO PSG', gol: 10 }
        ],
        squadrePartecipanti: 6,
        archivioId: 'estate-2026'
    }
];

// Calcola l'esito (vincitore/perdente) di una partita, considerando anche i rigori
function esitoPartita(p) {
    if (!p || !p.risultato) return { vincitore: null, perdente: null };
    const [g1, g2] = p.risultato.split(' - ').map(Number);
    if (g1 > g2) return { vincitore: p.squadra1, perdente: p.squadra2 };
    if (g2 > g1) return { vincitore: p.squadra2, perdente: p.squadra1 };
    if (!p.rigori) return { vincitore: null, perdente: null };
    const [r1, r2] = p.rigori.split(' - ').map(Number);
    if (r1 > r2) return { vincitore: p.squadra1, perdente: p.squadra2 };
    if (r2 > r1) return { vincitore: p.squadra2, perdente: p.squadra1 };
    return { vincitore: null, perdente: null };
}

// Riepilogo dell'edizione in corso, calcolato dai dati live (usato dalla pagina Storico)
function getEdizioneCorrente() {
    const finale = esitoPartita(partiteDB.find(p => p.playoffRound === 'fin'));
    const terzoPosto = esitoPartita(partiteDB.find(p => p.playoffRound === 'p34'));
    const marcatori = [...giocatoriStatsDB].filter(g => g.marcatori > 0).sort((a, b) => b.marcatori - a.marcatori);

    return {
        anno: annoCorrente,
        nome: nomeEdizioneCorrente,
        archivioId: archivioIdEdizioneCorrente || null,
        conclusa: !!finale.vincitore,
        campione: finale.vincitore,
        finalista: finale.perdente,
        terzo: terzoPosto.vincitore,
        // Tutti i giocatori a pari merito al primo posto (non ne sceglie uno arbitrario)
        capocannonieri: marcatori
            .filter(g => g.marcatori === (marcatori[0] || {}).marcatori)
            .map(g => ({ nome: g.nome, squadra: g.squadra, gol: g.marcatori })),
        squadrePartecipanti: squadreDB.length
    };
}

// Riferimenti agli elementi HTML reali del widget (dentro l'aside)
const widgetTitle = document.getElementById('widget-title');
const statList = document.getElementById('stat-list');

// Funzione principale di rendering basata sul database unificato
function renderLista() {
    if (!statList) return;
    statList.innerHTML = '';

    // Ordina i giocatori clonando l'array per preservare il DB intatto
    const giocatoriOrdinati = [...giocatoriStatsDB]
        .filter(g => g.marcatori > 0)
        .sort((a, b) => b.marcatori - a.marcatori);

    // Prendi fino a un massimo di 5 giocatori per la home page
    const topCinque = giocatoriOrdinati.slice(0, 5);

    topCinque.forEach((giocatore, index) => {
        const coloreNumeroUno = index === 0 ? 'style="color: var(--neon-green);"' : '';
        const valoreStatistica = giocatore.marcatori;

        const itemHTML = `
            <div class="stat-item">
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <span class="pos-number" ${coloreNumeroUno}>${index + 1}</span>
                    <div>
                        <span class="p-name">${giocatore.nome}</span>
                        <span class="p-team">${giocatore.squadra}</span>
                    </div>
                </div>
                <span class="stat-value">${valoreStatistica}</span>
            </div>
        `;
        statList.innerHTML += itemHTML;
    });

    // Se non ci sono dati
    if (topCinque.length === 0) {
        statList.innerHTML = '<div class="stat-item" style="color: var(--text-muted)">Nessun dato registrato</div>';
    }
}

// Avvio al caricamento della pagina
document.addEventListener("DOMContentLoaded", async () => {
    await firebaseReady;
    renderLista();
});
