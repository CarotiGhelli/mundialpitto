// Database centrale di squadre e giocatori - MUNDIAL PITTO 2024
const squadreDB = [
    {
        id: 1,
        nome: "ADLSR FC",
        badge: "ADLSR",
        logo: "ADLSR.png",
        girone: "Girone B",
        colore: "#00cc44",
        coloreScuro: "#008833",
        giocatori: [
            { numero: 3,  nome: "Francesco Francese" },
            { numero: 7,  nome: "Emanuele Cavallini", capitano: true },
            { numero: 8,  nome: "Leonardo Lemmi" },
            { numero: 10, nome: "Luigi Bartolozzi" },
            { numero: 20, nome: "Gianni Landi" },
            { numero: 47, nome: "Alessandro Salvadori" },
            { numero: 63, nome: "Mattia Aprile" },
            { numero: 67, nome: "Gianmarco Lelli" },
            { numero: 77, nome: "Gabriele Lemmi" },
            { numero: 9,  nome: "Alessandro Riccardi" },
            { numero: 14, nome: "Gabriele Massimo Catalano Belisario" }
        ]
    },
    {
        id: 2,
        nome: "Narcos",
        badge: "NC",
        logo: "Narcos.png",
        girone: "Girone A",
        colore: "#cc2200",
        coloreScuro: "#882200",
        giocatori: [
            { nome: "Rei Pilinci" },
            { nome: "Tommaso Carbonel" },
            { nome: "Mohamed Yamal" },
            { nome: "Lorenzo Chieppa" },
            { nome: "Gabriele Gentile" },
            { nome: "Lorenzo Bertozzi" }
        ]
    },
    {
        id: 3,
        nome: "DA PIERINO PSG",
        badge: "PSG",
        logo: "Pierino.png",
        girone: "Girone B",
        colore: "#004488",
        coloreScuro: "#002244",
        giocatori: [
            { nome: "Giorgio Giannetti", capitano: true },
            { nome: "Francesco Marinai" },
            { nome: "Stefan Piendibene" },
            { nome: "Cristiano Mannucci" },
            { nome: "Matteo Casapieri" },
            { nome: "Alessandro Petracchi" }
        ]
    },
    {
        id: 4,
        nome: "Atletico Gaza",
        badge: "AG",
        logo: "Atletico_Gaza.png",
        girone: "Girone B",
        colore: "#1e3a8a",
        coloreScuro: "#0f172a",
        giocatori: [
            { nome: "Leonardo Castagnoli", capitano: true },
            { nome: "Lorenzo Bacci" },
            { nome: "Davide Palma" },
            { nome: "Francesco Ceccarelli" },
            { nome: "Leonardo Manetti" },
            { nome: "Diego Giannetti" }
        ]
    },
    {
        id: 5,
        nome: "Staff Poco Tecnico",
        badge: "SPT",
        logo: "Football_Livorno.png",
        girone: "Girone A",
        colore: "#cc1111",
        coloreScuro: "#880000",
        giocatori: [
            { nome: "Andrea Sorrentino" },
            { nome: "Matteo Abrans" },
            { nome: "Marzio Casaccio" },
            { nome: "Lorenzo Baldi" },
            { nome: "Samuele Norfini" },
            { nome: "Simone Bernardi" },
            { nome: "Elia Mannelli" },
            { nome: "Alberto Dainelli" }
        ]
    },
    {
        id: 6,
        nome: "Bundesdini All-Stars",
        badge: "BUN",
        logo: "Bundesdini.png",
        girone: "Girone A",
        colore: "#cc0000",
        coloreScuro: "#880000",
        allenatore: "Pietro Caroti Ghelli",
        assistente: "Giacomo Cunardi",
        dirigente: "Mattia Lo Giudice",
        giocatori: [
            { nome: "Emanuele Nannetti" },
            { nome: "Elias Meliani" },
            { nome: "Christian Del Nobile" },
            { nome: "Francesko Vrapi" },
            { nome: "Matteo Biagi" },
            { nome: "Tommaso Albanesi" },
            { nome: "Cesare Kevin Desi" },
            { nome: "Xhovani Hokja" }
        ]
    }
];

// Database partite - MUNDIAL PITTO 2026
const partiteDB = [
    // GIORNATA 1 - 29 giugno
    { id: 1, giorno: 1, orario: "18:30-19:00", girone: "A", squadra1: "Narcos", squadra2: "Staff Poco Tecnico", risultato: null, marcatori: [] },
    { id: 2, giorno: 1, orario: "19:00-19:30", girone: "B", squadra1: "Atletico Gaza", squadra2: "DA PIERINO PSG", risultato: null, marcatori: [] },
    { id: 3, giorno: 1, orario: "19:30-20:00", girone: "A", squadra1: "Bundesdini All-Stars", squadra2: "Staff Poco Tecnico", risultato: null, marcatori: [] },
    { id: 4, giorno: 1, orario: "20:00-20:30", girone: "B", squadra1: "ADLSR FC", squadra2: "DA PIERINO PSG", risultato: null, marcatori: [] },
    { id: 5, giorno: 1, orario: "20:30-21:00", girone: "A", squadra1: "Narcos", squadra2: "Bundesdini All-Stars", risultato: null, marcatori: [] },
    { id: 6, giorno: 1, orario: "21:00-21:30", girone: "B", squadra1: "ADLSR FC", squadra2: "Atletico Gaza", risultato: null, marcatori: [] }
];

// Database centrale dei marcatori e assist
const giocatoriStatsDB = [
    { nome: "Francesco Francese", squadra: "ADLSR FC", marcatori: 0, assist: 0 },
    { nome: "Emanuele Cavallini", squadra: "ADLSR FC", marcatori: 0, assist: 0 },
    { nome: "Leonardo Lemmi", squadra: "ADLSR FC", marcatori: 0, assist: 0 }
];

// Database classifiche
const classificheDB = {
    'A': [
        { posizione: 1, squadra: 'Narcos', punti: 0, giocate: 0, vinte: 0, pareggiate: 0, perse: 0, gf: 0, gs: 0 },
        { posizione: 2, squadra: 'Bundesdini All-Stars', punti: 0, giocate: 0, vinte: 0, pareggiate: 0, perse: 0, gf: 0, gs: 0 },
        { posizione: 3, squadra: 'Staff Poco Tecnico', punti: 0, giocate: 0, vinte: 0, pareggiate: 0, perse: 0, gf: 0, gs: 0 }
    ],
    'B': [
        { posizione: 1, squadra: 'ADLSR FC', punti: 0, giocate: 0, vinte: 0, pareggiate: 0, perse: 0, gf: 0, gs: 0 },
        { posizione: 2, squadra: 'Atletico Gaza', punti: 0, giocate: 0, vinte: 0, pareggiate: 0, perse: 0, gf: 0, gs: 0 },
        { posizione: 3, squadra: 'DA PIERINO PSG', punti: 0, giocate: 0, vinte: 0, pareggiate: 0, perse: 0, gf: 0, gs: 0 }
    ]
};

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
            }
        });
    }
    if (data.giocatoriStats) {
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
            classificheDB[girone] = Array.isArray(arr) ? arr : Object.values(arr);
        });
    }
}

// Carica i dati una volta all'avvio e risolve firebaseReady
firebaseDB.ref('mundialPitto').once('value', snapshot => {
    if (snapshot.exists()) _applyFirebaseData(snapshot.val());
    _firebaseReadyResolve();
});

// Salva tutti i dati dinamici su Firebase
function saveDataToFirebase() {
    const partiteDaSalvare = {};
    partiteDB.forEach(p => {
        partiteDaSalvare[p.id] = { risultato: p.risultato || null, marcatori: p.marcatori || [] };
    });
    const statsDaSalvare = {};
    giocatoriStatsDB.forEach(g => {
        const key = g.nome.replace(/[.#$[\]/]/g, '_');
        statsDaSalvare[key] = { nome: g.nome, squadra: g.squadra, marcatori: g.marcatori || 0, assist: g.assist || 0 };
    });
    return firebaseDB.ref('mundialPitto').update({
        partite: partiteDaSalvare,
        giocatoriStats: statsDaSalvare,
        classifiche: classificheDB
    });
}

function saveBracketToFirebase(bracketData) {
    return firebaseDB.ref('mundialPitto/bracket').set(bracketData);
}

function loadBracketFromFirebase() {
    return new Promise(resolve => {
        firebaseDB.ref('mundialPitto/bracket').once('value', snap => {
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

// Stato della vista attuale del widget ("marcatori" o "assist")
let vistaAttuale = "marcatori"; 

const configurazioneVista = {
    marcatori: {
        titolo: "CLASSIFICA MARCATORI",
        proprieta: "marcatori"
    },
    assist: {
        titolo: "CLASSIFICA ASSIST",
        proprieta: "assist"
    }
};

// Riferimenti agli elementi HTML reali del widget (dentro l'aside)
const widgetTitle = document.getElementById('widget-title');
const statList = document.getElementById('stat-list');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

// Funzione principale di rendering basata sul database unificato
function renderLista(tipo) {
    if (!statList || !widgetTitle) return;

    const config = configurazioneVista[tipo];
    widgetTitle.textContent = config.titolo;
    
    // Svuota i vecchi elementi orfani
    statList.innerHTML = '';

    // Ordina i giocatori clonando l'array per preservare il DB intatto
    const giocatoriOrdinati = [...giocatoriStatsDB]
        .filter(g => g[config.proprieta] > 0) // Mostra solo chi ha fatto almeno un'azione rilevante
        .sort((a, b) => b[config.proprieta] - a[config.proprieta]);

    // Prendi fino a un massimo di 5 giocatori per la home page
    const topCinque = giocatoriOrdinati.slice(0, 5);

    topCinque.forEach((giocatore, index) => {
        const coloreNumeroUno = index === 0 ? 'style="color: var(--neon-green);"' : '';
        const valoreStatistica = giocatore[config.proprieta];

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

// Funzione di switch bidirezionale
function switchClassifica() {
    vistaAttuale = (vistaAttuale === "marcatori") ? "assist" : "marcatori";
    renderLista(vistaAttuale);
}

// Associazione degli eventi click ai pulsanti corretti
if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', switchClassifica);
    btnNext.addEventListener('click', switchClassifica);
}

// Avvio al caricamento della pagina
document.addEventListener("DOMContentLoaded", async () => {
    await firebaseReady;
    renderLista(vistaAttuale);
});
