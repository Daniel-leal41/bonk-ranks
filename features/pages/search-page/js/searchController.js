// searchController.js
// Responsabilidade: ORQUESTRAR a página de busca.
//   - Define o filtro puro (genérico por campos)
//   - Lê a URL, captura filtros, escuta eventos e chama o render
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

// --- ORQUESTRAÇÃO ---
document.addEventListener("dataReady", function () {
  var params = new URLSearchParams(window.location.search);
  var queryInput = document.getElementById("topbar-input");
  queryInput.value = params.get("q") || "";

  var container = document.getElementById("results-container");

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

  // Lê filtros atuais, filtra e manda renderizar
  function updateDisplay() {
    var results = window.searchPlayers(queryInput.value, window.players, readFilters());
    window.renderResults(results, container);
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
});
