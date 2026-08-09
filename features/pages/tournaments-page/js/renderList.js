// renderList.js
// Responsabilidade: renderizar os cards da lista de torneios.
// Não orquestra navegação; recebe os torneios já filtrados e o container.
// Cada card inteiro é um link para o chaveamento do torneio (?id=).
// Só roda em tournaments.html. Textos via i18n (fallback → própria chave).

// Resolve strings via i18n. Sem SiteI18n, devolve a própria chave.
function t(key) {
  return window.SiteI18n ? window.SiteI18n.t(key) : key;
}

window.renderTournamentList = function (tournaments, container) {
  if (!tournaments || tournaments.length === 0) {
    container.innerHTML = '<p class="text-secondary">' + t('tournaments.empty') + '</p>';
    return;
  }

  container.innerHTML = tournaments.map(function (tournament) {
    var statusLabel = tournament.status === "finalizado"
      ? t('tournaments.status.finished')
      : t('tournaments.status.ongoing');
    var statusClass = tournament.status === "finalizado" ? "text-bg-success" : "text-bg-warning text-dark";

    return `
      <div class="col">
        <a href="../bracket-page/bracketPage.html?id=${tournament.id}"
          class="card h-100 text-decoration-none text-body shadow-sm">
          <div class="card-body d-flex flex-column">
            <div class="d-flex align-items-center gap-2 mb-2">
              <img src="${tournament.logo}" class="rounded-circle" width="48" height="48" alt="Logo ${tournament.name}">
              <span class="tier-badge tier-${tournament.tier} badge">Tier ${tournament.tier}</span>
            </div>
            <h5 class="card-title fw-bold">${tournament.name}</h5>
            <p class="card-text text-secondary small flex-grow-1">${tournament.description}</p>
            <span class="badge ${statusClass} align-self-start">${statusLabel}</span>
          </div>
        </a>
      </div>
    `;
  }).join("");
};
