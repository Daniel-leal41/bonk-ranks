// js/compare.js
// Responsabilidade: função PURA de comparação entre jogadores (sem DOM, sem
// estado). Dado um array de objetos jogador (window.players), devolve:
//   - categories      → as 6 categorias na ordem padrão do site
//   - perPlayer       → para cada jogador: médias por categoria (getAverage,
//                       mesma regra da player page) e overall (média arredondada
//                       das 6 médias)
//   - winners         → por categoria + 'overall': { index, value } do vencedor,
//                       ou null em caso de EMPATE (ninguém ganha)

window.comparePlayers = function (players) {
  var categories = ['IQ', 'Defense', 'Offense', 'Core', 'Mental', 'Special'];

  var perPlayer = players.map(function (p) {
    var averages = categories.map(function (c) {
      return window.StatsUtils.getAverage(p.skills[c]);
    });
    var overall = Math.round(
      averages.reduce(function (a, b) { return a + b; }, 0) / averages.length
    );
    return { id: p.id, username: p.username, averages: averages, overall: overall };
  });

  // Vencedor por status: só existe se houver UM valor máximo (empate = null).
  function computeWinner(valueFn) {
    var max = Math.max.apply(null, perPlayer.map(valueFn));
    var top = perPlayer.filter(function (pp) { return valueFn(pp) === max; });
    return top.length === 1 ? { index: perPlayer.indexOf(top[0]), value: max } : null;
  }

  var winners = {};
  categories.forEach(function (cat, i) {
    winners[cat] = computeWinner(function (pp) { return pp.averages[i]; });
  });
  winners.overall = computeWinner(function (pp) { return pp.overall; });

  return { categories: categories, perPlayer: perPlayer, winners: winners };
};
