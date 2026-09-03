// Trova l'edizione archiviata da mostrare, in base al parametro ?ed= nell'URL
function getEdizioneArchivio() {
    const id = new URLSearchParams(location.search).get('ed');
    return archivioEdizioniDB.find(e => e.id === id) || archivioEdizioniDB[archivioEdizioniDB.length - 1] || null;
}

function renderSquadreArchivio() {
    const ed = getEdizioneArchivio();
    const grid = document.getElementById('teams-grid');

    if (!ed) {
        grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;">Nessuna edizione archiviata trovata.</p>';
        return;
    }

    document.getElementById('ed-nome').textContent = ed.nome;
    document.title = `Squadre ${ed.nome} - MundialPitto`;

    grid.innerHTML = ed.squadre.map((sq, i) => {
        const crestContent = sq.logo
            ? `<img src="Loghi/${sq.logo}" alt="${sq.nome}" style="width:100%; height:100%; object-fit:contain; border-radius:8px;">`
            : sq.badge;
        const crestBg = sq.logo
            ? `background: linear-gradient(135deg, ${sq.colore}44 0%, ${sq.coloreScuro}88 100%);`
            : `background: linear-gradient(135deg, ${sq.colore} 0%, ${sq.coloreScuro} 100%);`;

        const roster = sq.giocatori.map(g => `
            <li>${g.numero ? `<span class="ros-num">${g.numero}</span>` : ''}${g.nome}${g.capitano ? ' &#127937;' : ''}</li>
        `).join('');

        const staff = [
            sq.allenatore ? `Allenatore: ${sq.allenatore}` : '',
            sq.assistente ? `Assistente: ${sq.assistente}` : '',
            sq.dirigente ? `Dirigente: ${sq.dirigente}` : ''
        ].filter(Boolean).join(' &bull; ');

        return `
        <div class="team-showcase-card archivio-team-card" data-idx="${i}">
            <div class="showcase-crest" style="${crestBg} box-shadow: 0 4px 15px ${sq.colore}44;">${crestContent}</div>
            <div class="showcase-name">${sq.nome}</div>
            <div class="showcase-group">${sq.girone}</div>
            <div class="btn-roster">Vedi Rosa</div>
            <div class="archivio-roster-panel" id="roster-${i}">
                <ul class="archivio-roster-list">${roster}</ul>
                ${staff ? `<p class="archivio-staff">${staff}</p>` : ''}
            </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.archivio-team-card').forEach(card => {
        card.addEventListener('click', () => {
            const panel = card.querySelector('.archivio-roster-panel');
            panel.classList.toggle('open');
        });
    });
}

document.addEventListener('DOMContentLoaded', renderSquadreArchivio);
