// bracketController.js
// Responsabilidade: ORQUESTRAR o chaveamento.
//   - Escuta os dados de torneios
//   - Lê ?id= da URL, acha o torneio em window.tournaments e renderiza
//   - Fallback de "torneio não encontrado"
// Só roda em bracketPage.html.

document.addEventListener("tournamentsDataReady", function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");

  var tournament = window.tournaments.tournaments.find(function (t) {
    return t.id === id;
  });

  if (!tournament) {
    document.getElementById("bracket-header").innerHTML =
      '<p class="text-secondary">Torneio não encontrado.</p>';
    return;
  }

  window.renderTournamentBracket(
    tournament,
    document.getElementById("bracket-header"),
    document.getElementById("bracket-container")
  );
});
