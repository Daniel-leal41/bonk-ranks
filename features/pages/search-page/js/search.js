// search.js
// Responsabilidade: saber como filtrar uma lista de jogadores.
// Não sabe de onde vieram os dados. Não sabe como eles serão exibidos.
// Só recebe uma lista e uma query, e devolve uma lista filtrada.
 
// Por que receber "players" como parâmetro em vez de usar window.players direto?
// Porque assim a função é "pura" — o resultado depende APENAS dos argumentos.
// Isso facilita testar: searchPlayers("fulano", listaFalsa) funciona isolado.
 
window.searchPlayers = function(query, players, filters = {}) {
  var q = query.trim().toLowerCase();
  var selectedRegions = filters.regions || []; // Expectativa: Array ['BR', 'NA']
  var selectedRank = filters.rank || "all";   // Expectativa: String 'S+'

  return players.filter(function(player) {
    // Validação de Texto
    var matchesQuery = q === "" || player.username.toLowerCase().includes(q);
    
    // Validação de Região (se array estiver vazio, ignora filtro)
    var matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(player.region);
    
    // Validação de Rank
    var matchesRank = selectedRank === "all" || player.rank === selectedRank;

    return matchesQuery && matchesRegion && matchesRank;
  });
};
 