// data.js
// Responsabilidade: ser a ÚNICA fonte dos dados de jogadores.
// Se amanhã você trocar JSON por uma API, só esse arquivo muda.
 
// fetch() é nativo do navegador. Ele busca qualquer arquivo ou URL
// e retorna uma "Promise" — uma promessa de que os dados vão chegar.
fetch("../../api/players.json")
 
  // .then() executa quando a Promise foi cumprida (dados chegaram)
  // "response" é o objeto HTTP bruto — ainda não são seus dados
  .then(function(response) {
    return response.json(); // converte o texto JSON em array JavaScript
  })
 
  // agora "players" é de fato o array de objetos do seu JSON
  .then(function(players) {
    // window.players torna o array acessível para os outros arquivos JS
    window.players = players;
 
    // dispara um evento customizado avisando que os dados estão prontos
    // render.js vai escutar esse evento para começar a trabalhar
    document.dispatchEvent(new Event("dataReady"));
  })
 
  // .catch() executa se algo der errado (arquivo não encontrado, JSON inválido, etc.)
  .catch(function(error) {
    console.error("Erro ao carregar jogadores:", error);
  });