// renderBracket.js
// Responsabilidade: renderizar o chaveamento de UM torneio
// (cabeçalho do torneio + colunas de rodadas).
// Não orquestra navegação; recebe o torneio e os containers.
// Nomes de jogadores são clicáveis e vão DIRETO para a página de perfil
// via playerPage.html?name=<nome> (a player page busca por username).
// Só roda em bracketPage.html.

window.renderTournamentBracket = function (tournament, headerEl, bracketEl) {
  var statusLabel = tournament.status === "finalizado" ? "Finalizado" : "Em andamento";
  var statusClass = tournament.status === "finalizado" ? "text-bg-success" : "text-bg-warning text-dark";

  // Cabeçalho do torneio
  headerEl.innerHTML = `
    <div class="d-flex align-items-center gap-3 mb-2">
      <img src="${tournament.logo}" class="rounded" width="64" height="64" alt="Logo ${tournament.name}">
      <div>
        <h4 class="fw-bold mb-1">${tournament.name}</h4>
        <span class="tier-badge tier-${tournament.tier} badge">Tier ${tournament.tier}</span>
        <span class="badge ${statusClass}">${statusLabel}</span>
      </div>
    </div>
    <p class="text-secondary mb-0">${tournament.description}</p>
  `;

  // Colunas de rodadas. Cada coluna tem o título (fora do fluxo flex) e o
  // bloco de partidas com justify-content-around: o navegador distribui as
  // partidas uniformemente e a partida da rodada seguinte fica automaticamente
  // centralizada entre suas duas "pais".
  bracketEl.innerHTML = tournament.rounds.map(function (round) {
    var matches = round.matches.map(buildMatch).join("");

    return `
      <div class="bracket-round d-flex flex-column">
        <div class="bracket-round-title text-center text-secondary small text-uppercase fw-bold mb-2">
          ${round.name}
        </div>
        <div class="bracket-round-matches d-flex flex-column justify-content-around flex-fill">
          ${matches}
        </div>
      </div>
    `;
  }).join("");
};

// Uma partida = dois slots empilhados
function buildMatch(match) {
  return `
    <div class="bracket-match">
      ${buildSlot(match.player1)}
      ${buildSlot(match.player2)}
    </div>
  `;
}

// Um slot = nome + pontuação. Vencedor destaca, perdedor fica apagado.
// player pode ser null (partida ainda não definida) → placeholder "A definir".
function buildSlot(player) {
  if (!player || !player.name) {
    return `
      <div class="bracket-slot d-flex justify-content-between align-items-center text-secondary">
        <span>A definir</span>
      </div>
    `;
  }

  var score = player.score != null ? player.score : "";
  var cls = player.winner ? "bracket-winner" : "bracket-loser";

  return `
    <div class="bracket-slot d-flex justify-content-between align-items-center ${cls}">
      <span class="bracket-name text-truncate">${linkPlayer(player.name)}</span>
      <span class="bracket-score">${score}</span>
    </div>
  `;
}

// Nome clicável: vai direto ao perfil com a query do nome
function linkPlayer(name) {
  return `<a class="text-decoration-none" href="../player-page/playerPage.html?name=${encodeURIComponent(name)}">${name}</a>`;
}
