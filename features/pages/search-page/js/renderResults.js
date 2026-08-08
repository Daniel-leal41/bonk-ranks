// renderResults.js
// Responsabilidade: APENAS renderizar os resultados no container.
// Não sabe de onde vieram os dados, não lê filtros, não escuta eventos.
// Recebe uma lista de jogadores já filtrada e um container, e desenha.
// Só roda em searchPage.html.

window.renderResults = function (results, container) {
  if (results.length === 0) {
    var empty = window.SiteI18n ? window.SiteI18n.t('results.empty') : 'results.empty';
    container.innerHTML = '<p class="player-not-found">' + empty + '</p>';
    return;
  }

  container.innerHTML = results.map(function (player) {
    var avatarUrl = player.avatarUrl || '';

    return `
      <a href="../player-page/playerPage.html?id=${player.id}" class="player-card d-flex align-items-center text-decoration-none border rounded-3 p-3">
        <img src="${avatarUrl}" class="player-avatar rounded-circle me-3" alt="${player.username}">
        <div class="player-info flex-grow-1">
          <span class="player-name fw-bold d-block text-truncate">${player.username}</span>
          <span class="player-meta text-secondary small d-block text-truncate">${player.title}</span>
        </div>
      </a>
    `;
  }).join("");
};
