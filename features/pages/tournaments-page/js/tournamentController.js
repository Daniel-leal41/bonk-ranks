// tournamentController.js
// Responsabilidade: ORQUESTRAR a lista de torneios.
//   - Define o filtro puro por NOME
//   - Escuta o evento de dados e re-renderiza a cada input na busca
// Só roda em tournaments.html.

// --- FILTRO PURO ---
// Filtra torneios por nome (case-insensitive). Query vazia retorna tudo.
window.filterTournaments = function (query, tournaments) {
  var q = query.trim().toLowerCase();
  if (q === "") return tournaments;

  return tournaments.filter(function (t) {
    return t.name.toLowerCase().includes(q);
  });
};

// --- ORQUESTRAÇÃO ---
document.addEventListener("tournamentsDataReady", function () {
  var searchInput = document.getElementById("tournament-search");
  var container = document.getElementById("tournaments-container");

  function updateDisplay() {
    window.renderTournamentList(
      window.filterTournaments(searchInput.value, window.tournaments.tournaments),
      container
    );
  }

  searchInput.addEventListener("input", updateDisplay);

  document.querySelector(".clear-btn").addEventListener("click", function () {
    searchInput.value = "";
    updateDisplay();
  });

  updateDisplay();

  // Re-renderiza ao trocar de idioma (estado vazio e labels de status).
  document.addEventListener('localeChanged', updateDisplay);
});
