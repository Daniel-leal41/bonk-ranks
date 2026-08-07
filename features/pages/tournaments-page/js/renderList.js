// renderList.js
// Responsabilidade: renderizar os cards da lista de torneios.
// Não orquestra navegação; recebe os torneios já filtrados e o container.
// Cada card inteiro é um link para o chaveamento do torneio (?id=).
// Só roda em tournaments.html.

window.renderTournamentList = function (tournaments, container) {
  if (!tournaments || tournaments.length === 0) {
    container.innerHTML = '<p class="text-secondary">Nenhum torneio encontrado.</p>';
    return;
  }

  container.innerHTML = tournaments.map(function (t) {
    var statusLabel = t.status === "finalizado" ? "Finalizado" : "Em andamento";
    var statusClass = t.status === "finalizado" ? "text-bg-success" : "text-bg-warning text-dark";

    return `
      <div class="col">
        <a href="../bracket-page/bracketPage.html?id=${t.id}"
          class="card h-100 text-decoration-none text-body shadow-sm">
          <div class="card-body d-flex flex-column">
            <div class="d-flex align-items-center gap-2 mb-2">
              <img src="${t.logo}" class="rounded-circle" width="48" height="48" alt="Logo ${t.name}">
              <span class="tier-badge tier-${t.tier} badge">Tier ${t.tier}</span>
            </div>
            <h5 class="card-title fw-bold">${t.name}</h5>
            <p class="card-text text-secondary small flex-grow-1">${t.description}</p>
            <span class="badge ${statusClass} align-self-start">${statusLabel}</span>
          </div>
        </a>
      </div>
    `;
  }).join("");
};
