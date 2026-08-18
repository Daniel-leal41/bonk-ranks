// bracketController.js
// Responsabilidade: ORQUESTRAR o chaveamento.
//   - Escuta os dados de torneios
//   - Lê ?id= da URL, acha o torneio em window.tournaments e renderiza
//   - Fallback de "torneio não encontrado"
// Só roda em bracketPage.html.

(function () {
  function init() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var headerEl = document.getElementById("bracket-header");
    var bracketEl = document.getElementById("bracket-container");

    // Resolve strings via i18n. Sem SiteI18n, devolve a própria chave.
    function t(key) {
      return window.SiteI18n ? window.SiteI18n.t(key) : key;
    }

    function render() {
      var tournament = window.tournaments.tournaments.find(function (t) {
        return t.id === id;
      });

      if (!tournament) {
        headerEl.innerHTML = '<p class="text-secondary">' + t('bracket.notFound') + '</p>';
        return;
      }

      window.renderTournamentBracket(tournament, headerEl, bracketEl);
    }

    render();

    // Re-renderiza ao trocar de idioma (labels de status e "A definir").
    document.addEventListener('localeChanged', render);
  }

  // Se os dados já existem no window (fetch resolvido antes deste script rodar,
  // ex.: cache), executa init() imediatamente; senão aguarda o evento
  // tournamentsDataReady. Evita a race condition de o evento ser disparado
  // antes do listener existir.
  if (window.tournaments) {
    init();
  } else {
    document.addEventListener("tournamentsDataReady", init);
  }
})();
