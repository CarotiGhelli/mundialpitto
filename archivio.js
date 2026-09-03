// Archivio permanente delle edizioni concluse del MundialPitto.
// Ogni voce e' una fotografia COMPLETA e definitiva di un'edizione (squadre, rose,
// calendario/risultati, statistiche giocatori, classifiche finali) presa al momento
// della conclusione del torneo, cosi' da restare consultabile anche quando
// squadreDB/partiteDB/giocatoriStatsDB/classificheDB in script.js verranno
// sovrascritti con i dati della nuova edizione.
//
// Quando inizia una nuova edizione:
// 1. Aggiungere qui una nuova voce con id/anno/nome dell'edizione appena conclusa
//    (i dati si possono ricavare da squadreDB/partiteDB/giocatoriStatsDB/classificheDB
//    correnti, dopo l'ultima partita).
// 2. Aggiungere in script.js, dentro storicoDB, il riepilogo di quell'edizione
//    (campione/finalista/terzo/capocannoniere) con lo stesso "id" in "archivioId",
//    cosi' l'Albo d'Oro potra' linkare Squadre/Calendario alla versione archiviata.
// 3. Sovrascrivere squadreDB/partiteDB/giocatoriStatsDB/classificheDB in script.js
//    con i dati della nuova edizione e aggiornare annoCorrente/nomeEdizioneCorrente.
const archivioEdizioniDB = [
    {
        "id": "estate-2026",
        "anno": 2026,
        "nome": "Estate 2026",
        "squadre": [
            {
                "id": 1,
                "nome": "ADLSR FC",
                "badge": "ADLSR",
                "logo": "ADLSR.png",
                "girone": "Girone B",
                "colore": "#00cc44",
                "coloreScuro": "#008833",
                "giocatori": [
                    {
                        "numero": 3,
                        "nome": "Francesco Francese"
                    },
                    {
                        "numero": 7,
                        "nome": "Emanuele Cavallini",
                        "capitano": true
                    },
                    {
                        "numero": 8,
                        "nome": "Leonardo Lemmi"
                    },
                    {
                        "numero": 10,
                        "nome": "Luigi Bartolozzi"
                    },
                    {
                        "numero": 20,
                        "nome": "Gianni Landi"
                    },
                    {
                        "numero": 47,
                        "nome": "Alessandro Salvadori"
                    },
                    {
                        "numero": 63,
                        "nome": "Mattia Aprile"
                    },
                    {
                        "numero": 67,
                        "nome": "Gianmarco Lelli"
                    },
                    {
                        "numero": 77,
                        "nome": "Gabriele Lemmi"
                    },
                    {
                        "numero": 9,
                        "nome": "Alessandro Riccardi"
                    },
                    {
                        "numero": 14,
                        "nome": "Gabriele Massimo Catalano Belisario"
                    }
                ]
            },
            {
                "id": 2,
                "nome": "Narcos",
                "badge": "NC",
                "logo": "Narcos.png",
                "girone": "Girone A",
                "colore": "#cc2200",
                "coloreScuro": "#882200",
                "giocatori": [
                    {
                        "nome": "Rei Pilinci",
                        "capitano": true
                    },
                    {
                        "nome": "Tommaso Carbonel"
                    },
                    {
                        "nome": "Mohamed"
                    },
                    {
                        "nome": "Gabriele Gentile"
                    },
                    {
                        "nome": "Lorenzo Bertozzi"
                    },
                    {
                        "nome": "Andrea Pengo"
                    },
                    {
                        "nome": "Gregorio Cozy"
                    }
                ]
            },
            {
                "id": 3,
                "nome": "DA PIERINO PSG",
                "badge": "PSG",
                "logo": "Pierino.png",
                "girone": "Girone B",
                "colore": "#004488",
                "coloreScuro": "#002244",
                "giocatori": [
                    {
                        "nome": "Giorgio Giannetti",
                        "capitano": true
                    },
                    {
                        "nome": "Francesco Marinai"
                    },
                    {
                        "nome": "Stefan Piendibene"
                    },
                    {
                        "nome": "Cristiano Mannucci"
                    },
                    {
                        "nome": "Matteo Casapieri"
                    },
                    {
                        "nome": "Alessandro Petracchi"
                    }
                ]
            },
            {
                "id": 4,
                "nome": "Atletico Gaza",
                "badge": "AG",
                "logo": "Atletico_Gaza.png",
                "girone": "Girone B",
                "colore": "#1e3a8a",
                "coloreScuro": "#0f172a",
                "giocatori": [
                    {
                        "nome": "Leonardo Castagnoli",
                        "capitano": true
                    },
                    {
                        "nome": "Lorenzo Bacci"
                    },
                    {
                        "nome": "Gregorio Paglini"
                    },
                    {
                        "nome": "Francesco Ceccarelli"
                    },
                    {
                        "nome": "Leonardo Manetti"
                    },
                    {
                        "nome": "Diego Giannetti"
                    }
                ]
            },
            {
                "id": 5,
                "nome": "Staff Poco Tecnico",
                "badge": "SPT",
                "logo": "Football_Livorno.png",
                "girone": "Girone A",
                "colore": "#cc1111",
                "coloreScuro": "#880000",
                "giocatori": [
                    {
                        "nome": "Andrea Sorrentino"
                    },
                    {
                        "nome": "Matteo Abrans"
                    },
                    {
                        "nome": "Marzio Casaccio"
                    },
                    {
                        "nome": "Lorenzo Baldi"
                    },
                    {
                        "nome": "Samuele Norfini"
                    },
                    {
                        "nome": "Simone Bernardi"
                    },
                    {
                        "nome": "Elia Mannelli"
                    },
                    {
                        "nome": "Alberto Dainelli"
                    }
                ]
            },
            {
                "id": 6,
                "nome": "Bundesdini All-Stars",
                "badge": "BUN",
                "logo": "Bundesdini.png",
                "girone": "Girone A",
                "colore": "#cc0000",
                "coloreScuro": "#880000",
                "allenatore": "Pietro Caroti Ghelli",
                "assistente": "Giacomo Cunardi",
                "dirigente": "Mattia Lo Giudice",
                "giocatori": [
                    {
                        "nome": "Emanuele Nannetti"
                    },
                    {
                        "nome": "Elias Meliani"
                    },
                    {
                        "nome": "Christian Del Nobile"
                    },
                    {
                        "nome": "Francesko Vrapi"
                    },
                    {
                        "nome": "Matteo Biagi"
                    },
                    {
                        "nome": "Tommaso Albanesi"
                    },
                    {
                        "nome": "Cesare Kevin Desi"
                    },
                    {
                        "nome": "Xhovani Hokja"
                    }
                ]
            }
        ],
        "partite": [
            {
                "id": 1,
                "giorno": 1,
                "orario": "18:30-19:00",
                "girone": "A",
                "squadra1": "Narcos",
                "squadra2": "Staff Poco Tecnico",
                "risultato": "3 - 5",
                "marcatori": [
                    {
                        "assist": 0,
                        "gol": 3,
                        "nome": "Mohamed",
                        "squadra": "Narcos"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Andrea Sorrentino",
                        "squadra": "Staff Poco Tecnico"
                    },
                    {
                        "assist": 0,
                        "gol": 4,
                        "nome": "Matteo Abrans",
                        "squadra": "Staff Poco Tecnico"
                    }
                ],
                "mvp": "Matteo Abrans",
                "rigori": null
            },
            {
                "id": 2,
                "giorno": 1,
                "orario": "19:00-19:30",
                "girone": "B",
                "squadra1": "Atletico Gaza",
                "squadra2": "DA PIERINO PSG",
                "risultato": "1 - 7",
                "marcatori": [
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Stefan Piendibene",
                        "squadra": "DA PIERINO PSG"
                    },
                    {
                        "assist": 0,
                        "gol": 2,
                        "nome": "Matteo Casapieri",
                        "squadra": "DA PIERINO PSG"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Alessandro Petracchi",
                        "squadra": "DA PIERINO PSG"
                    },
                    {
                        "assist": 0,
                        "gol": 2,
                        "nome": "Giorgio Giannetti",
                        "squadra": "DA PIERINO PSG"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Francesco Marinai",
                        "squadra": "DA PIERINO PSG"
                    }
                ],
                "mvp": "Giorgio Giannetti",
                "rigori": null
            },
            {
                "id": 3,
                "giorno": 1,
                "orario": "19:30-20:00",
                "girone": "A",
                "squadra1": "Bundesdini All-Stars",
                "squadra2": "Staff Poco Tecnico",
                "risultato": "2 - 1",
                "marcatori": [
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Matteo Abrans",
                        "squadra": "Staff Poco Tecnico"
                    },
                    {
                        "assist": 0,
                        "gol": 2,
                        "nome": "Xhovani Hokja",
                        "squadra": "Bundesdini All-Stars"
                    },
                    {
                        "assist": 1,
                        "gol": 0,
                        "nome": "Tommaso Albanesi",
                        "squadra": "Bundesdini All-Stars"
                    }
                ],
                "mvp": "Xhovani Hokja",
                "rigori": null
            },
            {
                "id": 4,
                "giorno": 1,
                "orario": "20:00-20:30",
                "girone": "B",
                "squadra1": "ADLSR FC",
                "squadra2": "DA PIERINO PSG",
                "risultato": "1 - 5",
                "marcatori": [
                    {
                        "assist": 0,
                        "gol": 2,
                        "nome": "Matteo Casapieri",
                        "squadra": "DA PIERINO PSG"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Mattia Aprile",
                        "squadra": "ADLSR FC"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Stefan Piendibene",
                        "squadra": "DA PIERINO PSG"
                    },
                    {
                        "assist": 2,
                        "gol": 1,
                        "nome": "Francesco Marinai",
                        "squadra": "DA PIERINO PSG"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Giorgio Giannetti",
                        "squadra": "DA PIERINO PSG"
                    }
                ],
                "mvp": "Francesco Marinai",
                "rigori": null
            },
            {
                "id": 5,
                "giorno": 1,
                "orario": "20:30-21:00",
                "girone": "A",
                "squadra1": "Narcos",
                "squadra2": "Bundesdini All-Stars",
                "risultato": "0 - 3",
                "marcatori": [
                    {
                        "assist": 0,
                        "gol": 2,
                        "nome": "Xhovani Hokja",
                        "squadra": "Bundesdini All-Stars"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Tommaso Albanesi",
                        "squadra": "Bundesdini All-Stars"
                    },
                    {
                        "assist": 1,
                        "gol": 0,
                        "nome": "Christian Del Nobile",
                        "squadra": "Bundesdini All-Stars"
                    }
                ],
                "mvp": "Xhovani Hokja",
                "rigori": null
            },
            {
                "id": 6,
                "giorno": 1,
                "orario": "21:00-21:30",
                "girone": "B",
                "squadra1": "ADLSR FC",
                "squadra2": "Atletico Gaza",
                "risultato": "8 - 2",
                "marcatori": [
                    {
                        "assist": 0,
                        "gol": 3,
                        "nome": "Mattia Aprile",
                        "squadra": "ADLSR FC"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Gabriele Lemmi",
                        "squadra": "ADLSR FC"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Leonardo Manetti",
                        "squadra": "Atletico Gaza"
                    },
                    {
                        "assist": 0,
                        "gol": 3,
                        "nome": "Emanuele Cavallini",
                        "squadra": "ADLSR FC"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Leonardo Castagnoli",
                        "squadra": "Atletico Gaza"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Leonardo Lemmi",
                        "squadra": "ADLSR FC"
                    }
                ],
                "mvp": "Emanuele Cavallini",
                "rigori": null
            },
            {
                "id": 101,
                "giorno": 2,
                "orario": "18:30",
                "girone": "PO",
                "playoffRound": "qf2",
                "label": "Quarti di Finale",
                "squadra1": "Staff Poco Tecnico",
                "squadra2": "Atletico Gaza",
                "risultato": "3 - 1",
                "marcatori": [
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Lorenzo Baldi",
                        "squadra": "Staff Poco Tecnico"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Leonardo Manetti",
                        "squadra": "Atletico Gaza"
                    },
                    {
                        "assist": 0,
                        "gol": 2,
                        "nome": "Matteo Abrans",
                        "squadra": "Staff Poco Tecnico"
                    }
                ],
                "mvp": "Diego Giannetti",
                "rigori": null
            },
            {
                "id": 102,
                "giorno": 2,
                "orario": "19:00",
                "girone": "PO",
                "playoffRound": "qf1",
                "label": "Quarti di Finale",
                "squadra1": "ADLSR FC",
                "squadra2": "Narcos",
                "risultato": "7 - 3",
                "marcatori": [
                    {
                        "assist": 0,
                        "gol": 3,
                        "nome": "Emanuele Cavallini",
                        "squadra": "ADLSR FC"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Leonardo Lemmi",
                        "squadra": "ADLSR FC"
                    },
                    {
                        "assist": 0,
                        "gol": 2,
                        "nome": "Tommaso Carbonel",
                        "squadra": "Narcos"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Gianni Landi",
                        "squadra": "ADLSR FC"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Gianmarco Lelli",
                        "squadra": "ADLSR FC"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Mattia Aprile",
                        "squadra": "ADLSR FC"
                    }
                ],
                "mvp": "Emanuele Cavallini",
                "rigori": null
            },
            {
                "id": 103,
                "giorno": 2,
                "orario": "19:30",
                "girone": "PO",
                "playoffRound": "sf2",
                "label": "Semifinale",
                "squadra1": "Bundesdini All-Stars",
                "squadra2": "ADLSR FC",
                "risultato": "2 - 2",
                "marcatori": [
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Gianni Landi",
                        "squadra": "ADLSR FC"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Emanuele Cavallini",
                        "squadra": "ADLSR FC"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Cesare Kevin Desi",
                        "squadra": "Bundesdini All-Stars"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Elias Meliani",
                        "squadra": "Bundesdini All-Stars"
                    }
                ],
                "mvp": "Alessandro Salvadori",
                "rigori": "1 - 2"
            },
            {
                "id": 104,
                "giorno": 2,
                "orario": "20:00",
                "girone": "PO",
                "playoffRound": "sf1",
                "label": "Semifinale",
                "squadra1": "DA PIERINO PSG",
                "squadra2": "Staff Poco Tecnico",
                "risultato": "5 - 2",
                "marcatori": [
                    {
                        "assist": 0,
                        "gol": 4,
                        "nome": "Matteo Casapieri",
                        "squadra": "DA PIERINO PSG"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Giorgio Giannetti",
                        "squadra": "DA PIERINO PSG"
                    },
                    {
                        "assist": 0,
                        "gol": 2,
                        "nome": "Andrea Sorrentino",
                        "squadra": "Staff Poco Tecnico"
                    }
                ],
                "mvp": null,
                "rigori": null
            },
            {
                "id": 105,
                "giorno": 2,
                "orario": "20:30",
                "girone": "PO",
                "playoffRound": "p56",
                "label": "5° / 6° Posto",
                "squadra1": "Narcos",
                "squadra2": "Atletico Gaza",
                "risultato": "1 - 5",
                "marcatori": [
                    {
                        "assist": 2,
                        "gol": 1,
                        "nome": "Francesco Ceccarelli",
                        "squadra": "Atletico Gaza"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Tommaso Carbonel",
                        "squadra": "Narcos"
                    },
                    {
                        "assist": 3,
                        "gol": 0,
                        "nome": "Leonardo Castagnoli",
                        "squadra": "Atletico Gaza"
                    },
                    {
                        "assist": 0,
                        "gol": 4,
                        "nome": "Leonardo Manetti",
                        "squadra": "Atletico Gaza"
                    }
                ],
                "mvp": "Leonardo Manetti",
                "rigori": null
            },
            {
                "id": 106,
                "giorno": 2,
                "orario": "21:00",
                "girone": "PO",
                "playoffRound": "p34",
                "label": "3° / 4° Posto",
                "squadra1": "Staff Poco Tecnico",
                "squadra2": "Bundesdini All-Stars",
                "risultato": "6 - 2",
                "marcatori": [
                    {
                        "assist": 0,
                        "gol": 3,
                        "nome": "Matteo Abrans",
                        "squadra": "Staff Poco Tecnico"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Elias Meliani",
                        "squadra": "Bundesdini All-Stars"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Andrea Sorrentino",
                        "squadra": "Staff Poco Tecnico"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Francesko Vrapi",
                        "squadra": "Bundesdini All-Stars"
                    }
                ],
                "mvp": "Matteo Abrans",
                "rigori": null
            },
            {
                "id": 107,
                "giorno": 2,
                "orario": "21:30",
                "girone": "PO",
                "playoffRound": "fin",
                "label": "Finale",
                "squadra1": "DA PIERINO PSG",
                "squadra2": "ADLSR FC",
                "risultato": "5 - 2",
                "marcatori": [
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Alessandro Petracchi",
                        "squadra": "DA PIERINO PSG"
                    },
                    {
                        "assist": 0,
                        "gol": 2,
                        "nome": "Matteo Casapieri",
                        "squadra": "DA PIERINO PSG"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Stefan Piendibene",
                        "squadra": "DA PIERINO PSG"
                    },
                    {
                        "assist": 0,
                        "gol": 1,
                        "nome": "Gianni Landi",
                        "squadra": "ADLSR FC"
                    },
                    {
                        "assist": 1,
                        "gol": 1,
                        "nome": "Luigi Bartolozzi",
                        "squadra": "ADLSR FC"
                    }
                ],
                "mvp": "Matteo Casapieri",
                "rigori": null
            }
        ],
        "giocatoriStats": [
            {
                "nome": "Francesco Francese",
                "squadra": "ADLSR FC",
                "marcatori": 0,
                "assist": 0
            },
            {
                "nome": "Emanuele Cavallini",
                "squadra": "ADLSR FC",
                "marcatori": 7,
                "assist": 0
            },
            {
                "nome": "Leonardo Lemmi",
                "squadra": "ADLSR FC",
                "marcatori": 2,
                "assist": 0
            },
            {
                "nome": "Alessandro Petracchi",
                "squadra": "DA PIERINO PSG",
                "marcatori": 2,
                "assist": 0
            },
            {
                "nome": "Andrea Sorrentino",
                "squadra": "Staff Poco Tecnico",
                "marcatori": 4,
                "assist": 0
            },
            {
                "nome": "Cesare Kevin Desi",
                "squadra": "Bundesdini All-Stars",
                "marcatori": 1,
                "assist": 0
            },
            {
                "nome": "Christian Del Nobile",
                "squadra": "Bundesdini All-Stars",
                "marcatori": 0,
                "assist": 1
            },
            {
                "nome": "Diego Giannetti",
                "squadra": "Atletico Gaza",
                "marcatori": 0,
                "assist": 0
            },
            {
                "nome": "Elias Meliani",
                "squadra": "Bundesdini All-Stars",
                "marcatori": 2,
                "assist": 0
            },
            {
                "nome": "Francesco Ceccarelli",
                "squadra": "Atletico Gaza",
                "marcatori": 1,
                "assist": 2
            },
            {
                "nome": "Francesco Marinai",
                "squadra": "DA PIERINO PSG",
                "marcatori": 2,
                "assist": 2
            },
            {
                "nome": "Francesko Vrapi",
                "squadra": "Bundesdini All-Stars",
                "marcatori": 1,
                "assist": 0
            },
            {
                "nome": "Gabriele Lemmi",
                "squadra": "ADLSR FC",
                "marcatori": 1,
                "assist": 0
            },
            {
                "nome": "Gabriele Massimo Catalano Belisario",
                "squadra": "ADLSR FC",
                "marcatori": 0,
                "assist": 0
            },
            {
                "nome": "Gianmarco Lelli",
                "squadra": "ADLSR FC",
                "marcatori": 1,
                "assist": 0
            },
            {
                "nome": "Giannetti Giorgio",
                "squadra": "DA PIERINO PSG",
                "marcatori": 0,
                "assist": 0
            },
            {
                "nome": "Gianni Landi",
                "squadra": "ADLSR FC",
                "marcatori": 3,
                "assist": 0
            },
            {
                "nome": "Giorgio Giannetti",
                "squadra": "DA PIERINO PSG",
                "marcatori": 4,
                "assist": 0
            },
            {
                "nome": "Leonardo Castagnoli",
                "squadra": "Atletico Gaza",
                "marcatori": 1,
                "assist": 3
            },
            {
                "nome": "Leonardo Manetti",
                "squadra": "Atletico Gaza",
                "marcatori": 6,
                "assist": 0
            },
            {
                "nome": "Lorenzo Bacci",
                "squadra": "Atletico Gaza",
                "marcatori": 0,
                "assist": 0
            },
            {
                "nome": "Lorenzo Baldi",
                "squadra": "Staff Poco Tecnico",
                "marcatori": 1,
                "assist": 0
            },
            {
                "nome": "Luigi Bartolozzi",
                "squadra": "ADLSR FC",
                "marcatori": 1,
                "assist": 1
            },
            {
                "nome": "Marinai Francesco",
                "squadra": "DA PIERINO PSG",
                "marcatori": 0,
                "assist": 0
            },
            {
                "nome": "Matteo Abrans",
                "squadra": "Staff Poco Tecnico",
                "marcatori": 10,
                "assist": 0
            },
            {
                "nome": "Matteo Casapieri",
                "squadra": "DA PIERINO PSG",
                "marcatori": 10,
                "assist": 0
            },
            {
                "nome": "Mattia Aprile",
                "squadra": "ADLSR FC",
                "marcatori": 5,
                "assist": 0
            },
            {
                "nome": "Mohamed",
                "squadra": "Narcos",
                "marcatori": 3,
                "assist": 0
            },
            {
                "nome": "Petracchi Alessandro",
                "squadra": "DA PIERINO PSG",
                "marcatori": 0,
                "assist": 0
            },
            {
                "nome": "Rei Pilinci",
                "squadra": "Narcos",
                "marcatori": 0,
                "assist": 0
            },
            {
                "nome": "Samuele Norfini",
                "squadra": "Staff Poco Tecnico",
                "marcatori": 0,
                "assist": 0
            },
            {
                "nome": "Stefan Piendibene",
                "squadra": "DA PIERINO PSG",
                "marcatori": 3,
                "assist": 0
            },
            {
                "nome": "Tommaso Albanesi",
                "squadra": "Bundesdini All-Stars",
                "marcatori": 1,
                "assist": 1
            },
            {
                "nome": "Tommaso Carbonel",
                "squadra": "Narcos",
                "marcatori": 3,
                "assist": 0
            },
            {
                "nome": "Xhovani Hokja",
                "squadra": "Bundesdini All-Stars",
                "marcatori": 4,
                "assist": 0
            }
        ],
        "classifiche": {
            "A": [
                {
                    "gf": 5,
                    "giocate": 2,
                    "gs": 1,
                    "pareggiate": 0,
                    "perse": 0,
                    "posizione": 1,
                    "punti": 6,
                    "squadra": "Bundesdini All-Stars",
                    "vinte": 2
                },
                {
                    "gf": 6,
                    "giocate": 2,
                    "gs": 5,
                    "pareggiate": 0,
                    "perse": 1,
                    "posizione": 2,
                    "punti": 3,
                    "squadra": "Staff Poco Tecnico",
                    "vinte": 1
                },
                {
                    "gf": 3,
                    "giocate": 2,
                    "gs": 8,
                    "pareggiate": 0,
                    "perse": 2,
                    "posizione": 3,
                    "punti": 0,
                    "squadra": "Narcos",
                    "vinte": 0
                }
            ],
            "B": [
                {
                    "gf": 12,
                    "giocate": 2,
                    "gs": 2,
                    "pareggiate": 0,
                    "perse": 0,
                    "posizione": 1,
                    "punti": 6,
                    "squadra": "DA PIERINO PSG",
                    "vinte": 2
                },
                {
                    "gf": 9,
                    "giocate": 2,
                    "gs": 7,
                    "pareggiate": 0,
                    "perse": 1,
                    "posizione": 2,
                    "punti": 3,
                    "squadra": "ADLSR FC",
                    "vinte": 1
                },
                {
                    "gf": 3,
                    "giocate": 2,
                    "gs": 15,
                    "pareggiate": 0,
                    "perse": 2,
                    "posizione": 3,
                    "punti": 0,
                    "squadra": "Atletico Gaza",
                    "vinte": 0
                }
            ]
        }
    }
];
