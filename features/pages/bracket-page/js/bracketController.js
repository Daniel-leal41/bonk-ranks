// bracketController.js
// Responsabilidade: ORQUESTRAR o chaveamento.
//   - Escuta os dados de torneios
//   - Lê ?id= da URL, acha o torneio em window.tournaments e renderiza
//   - Fallback de "torneio não encontrado"
// Só roda em bracketPage.html.

document.addEventListener("tournamentsDataReady", function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var headerEl = document.getElementById("bracket-header");
  var bracketEl = document.getElementById("bracket-container");

  function render() {
    var tournament = window.tournaments.tournaments.find(function (t) {
      return t.id === id;
    });

    if (!tournament) {
      headerEl.innerHTML = '<p class="text-secondary">' + window.SiteI18n.t('bracket.notFound') + '</p>';
      return;
    }

    window.renderTournamentBracket(tournament, headerEl, bracketEl);
  }

  render();

  // Re-renderiza ao trocar de idioma (labels de status e "A definir").
  document.addEventListener('localeChanged', render);
});
