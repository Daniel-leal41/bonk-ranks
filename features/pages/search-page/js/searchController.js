// searchController.js
// Responsabilidade: ORQUESTRAR a página de busca.
//   - Define o filtro puro (genérico por campos) e a paginação pura
//   - Lê a URL, captura filtros, escuta eventos e chama os renders
//   - Guarda o estado de paginação { page } e decide quando resetar
// Só roda em searchPage.html.

// --- FILTRO PURO ---
// Padrão: cada checkbox carrega a classe "filter-<campo>", onde <campo> é
// uma propriedade do player (ex.: filter-region, filter-rank).
// O filtro é GENÉRICO: qualquer campo presente nos filtros é verificado,
// então adicionar um filtro novo NÃO exige mexer aqui.
window.searchPlayers = function(query, players, filters = {}) {
  var q = query.trim().toLowerCase();

  return players.filter(function(player) {
    // Validação de Texto
    var matchesQuery = q === "" || player.username.toLowerCase().includes(q);

    // Validação de todos os filtros (região, rank, país, etc.)
    // Para cada campo: lista vazia = ignora filtro; senão player[campo] ∈ lista
    var matchesAllFilters = Object.keys(filters).every(function(field) {
      var selected = filters[field] || [];
      return selected.length === 0 || selected.includes(player[field]);
    });

    return matchesQuery && matchesAllFilters;
  });
};

// --- PAGINAÇÃO PURA ---
// Fatia a lista sem mutá-la: página 1 = primeiros perPage itens.
// Mesmo espírito do searchPlayers: sem DOM, sem estado.
window.paginate = function (items, page, perPage) {
  var start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
};

// --- ORQUESTRAÇÃO ---
(function () {
  var PER_PAGE = 10;

  function init() {
    var params = new URLSearchParams(window.location.search);
    var queryInput = document.getElementById("topbar-input");
    queryInput.value = params.get("q") || "";

    var container = document.getElementById("results-container");
    var paginationEl = document.getElementById("pagination-container");

    // Estado da paginação: muda só via Anterior/Próxima (onChange).
    // Qualquer mudança de busca/filtro reseta para a página 1 (updateDisplay).
    var state = { page: 1 };

    // Lê todos os checkboxes marcados e agrupa por campo (a classe filter-<campo>)
    function readFilters() {
      var filters = {};
      document.querySelectorAll('input[type="checkbox"]:checked').forEach(function(cb) {
        cb.classList.forEach(function(cls) {
          if (cls.indexOf("filter-") === 0) {
            var field = cls.slice("filter-".length);
            (filters[field] = filters[field] || []).push(cb.value);
          }
        });
      });
      return filters;
    }

    // Renderiza o estado atual SEM resetar a página (Anterior/Próxima, troca
    // de idioma). Clampa a página se os filtros encolheram o resultado:
    // nunca renderiza em branco — cai na última página válida.
    function renderDisplay() {
      var filtered = window.searchPlayers(queryInput.value, window.players, readFilters());
      var totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
      state.page = Math.min(state.page, totalPages);

      window.renderResults(window.paginate(filtered, state.page, PER_PAGE), container);
      window.renderPagination({
        page: state.page,
        totalPages: totalPages,
        total: filtered.length,
        onChange: function (p) { state.page = p; renderDisplay(); }
      }, paginationEl);
    }

    // Reset para a página 1 + render (digitação, filtros, clear).
    function updateDisplay() {
      state.page = 1;
      renderDisplay();
    }

    // Escuta mudanças nos checkboxes de qualquer filtro
    document.querySelectorAll('input[type="checkbox"][class*="filter-"]').forEach(el => {
      el.addEventListener('change', updateDisplay);
    });

    // Escuta digitação no campo de busca
    queryInput.addEventListener('input', updateDisplay);

    // Botão de limpar: zera só a query, mantém filtros de região/rank
    document.querySelector('.clear-btn').addEventListener('click', function () {
      queryInput.value = "";
      updateDisplay();
    });

    // Execução inicial
    updateDisplay();

    // Re-renderiza ao trocar de idioma (estado vazio, resultados e labels da
    // paginação). Mantém a página atual — só busca/filtro resetam para a 1ª.
    document.addEventListener('localeChanged', renderDisplay);
  }

  // Se os dados já existem no window (fetch resolvido antes deste script rodar,
  // ex.: cache), executa init() imediatamente; senão aguarda o evento dataReady.
  // Evita a race condition de o evento ser disparado antes do listener existir.
  if (window.players) {
    init();
  } else {
    document.addEventListener("dataReady", init);
  }
})();
