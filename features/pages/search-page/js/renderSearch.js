// render-search.js
// Responsabilidade: ler a URL, buscar jogadores, exibir resultados clicáveis fiel ao mockup.
// Só roda em searchPage.html.

document.addEventListener("dataReady", function () {
  var params = new URLSearchParams(window.location.search);
  var queryInput = document.getElementById("topbar-input");
  queryInput.value = params.get("q") || "";

  // --- FUNÇÃO DE RENDERIZAÇÃO CENTRALIZADA ---
  function updateDisplay() {
    var query = queryInput.value;

    // Captura Regiões (Checkboxes)
    var regions = Array.from(document.querySelectorAll('.filter-checkbox:checked'))
      .map(cb => cb.value);

    // Captura Rank (Select)
    var rank = document.getElementById("rank-filter").value;

    var results = window.searchPlayers(query, window.players, {
      regions: regions,
      rank: rank
    });

    var container = document.getElementById("results-container");
    renderCards(results, container);
  }

  function renderCards(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<p class="player-not-found">Nenhum jogador encontrado.</p>';
      return;
    }

    container.innerHTML = results.map(function (player) {
      var desc = `Jogador nível ${player.rank || 'N/A'} atuando na região ${player.region || 'Desconhecida'}.`;

      // Caminho da imagem vindo do JSON ou fallback para uma imagem padrão
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
  }

  // --- LISTENERS ---

  // Escuta mudanças nos Checkboxes e Select
  document.querySelectorAll('.filter-checkbox, #rank-filter').forEach(el => {
    el.addEventListener('change', updateDisplay);
  });

  // Escuta digitação no campo de busca
  queryInput.addEventListener('input', updateDisplay);

  // Execução inicial
  updateDisplay();
});
