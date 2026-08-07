// tournamentsData.js
// Responsabilidade: ser a ÚNICA fonte dos dados de torneios.
// Espelho de data.js (players): busca o JSON, expõe window.tournaments
// e dispara o evento "tournamentsDataReady".
// Se amanhã você trocar JSON por uma API, só esse arquivo muda.

// Caminho relativo à PÁGINA tournaments.html (que vive em features/pages/tournaments-page/),
// seguindo a mesma convenção do data.js.
fetch("../../api/tournaments.json")

  .then(function(response) {
    return response.json(); // converte o texto JSON em objeto JavaScript
  })

  .then(function(data) {
    window.tournaments = data; // objeto { tournaments: [...] } acessível aos renders

    // dispara um evento customizado avisando que os dados de torneios estão prontos
    document.dispatchEvent(new Event("tournamentsDataReady"));
  })

  .catch(function(error) {
    console.error("Erro ao carregar torneios:", error);
  });
