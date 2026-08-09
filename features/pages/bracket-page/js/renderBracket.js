// renderBracket.js
// Responsabilidade: renderizar o chaveamento de UM torneio
// (cabeçalho do torneio + colunas de rodadas).
// Não orquestra navegação; recebe o torneio e os containers.
// Nomes de jogadores são clicáveis e vão DIRETO para a página de perfil
// via playerPage.html?id=<id> quando o slot tem id (players.json); sem id,
// o nome é texto sem link.
// Só roda em bracketPage.html.

// Resolve strings via i18n. Sem SiteI18n, devolve a própria chave.
function t(key) {
  return window.SiteI18n ? window.SiteI18n.t(key) : key;
}

window.renderTournamentBracket = function (tournament, headerEl, bracketEl) {
  var statusLabel = tournament.status === "finalizado"
    ? t('tournaments.status.finished')
    : t('tournaments.status.ongoing');
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

  // Título da rodada calculado a partir da distância da final:
  // (N - 1) - roundIndex → 0 = Final, 1 = Semifinais, 2 = Quartas, ...
  // Nomes vêm do dicionário i18n (bracket.round.N); se a distância passar das
  // chaves definidas, usa um genérico "Rodada/Round N".
  var totalRounds = tournament.rounds.length;
  function roundTitle(round) {
    var fromFinal = totalRounds - 1 - round.roundIndex;
    var key = 'bracket.round.' + fromFinal;
    var label = t(key);
    if (label === key) {
      label = t('bracket.genericRound') + ' ' + (fromFinal + 1);
    }
    return label;
  }

  // Colunas de rodadas. Cada coluna tem o título (fora do fluxo flex) e o
  // bloco de partidas com justify-content-around: o navegador distribui as
  // partidas uniformemente e a partida da rodada seguinte fica automaticamente
  // centralizada entre suas duas "pais".
  bracketEl.innerHTML = tournament.rounds.map(function (round) {
    var matches = round.matches.map(buildMatch).join("");

    return `
      <div class="bracket-round d-flex flex-column">
        <div class="bracket-round-title text-center text-secondary small text-uppercase fw-bold mb-2">
          ${roundTitle(round)}
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
// player pode ser null (partida ainda não definida) → placeholder "A definir" (i18n).
function buildSlot(player) {
  if (!player || !player.name) {
    return `
      <div class="bracket-slot d-flex justify-content-between align-items-center text-secondary">
        <span>${t('bracket.tbd')}</span>
      </div>
    `;
  }

  var score = player.score != null ? player.score : "";
  var cls = player.winner ? "bracket-winner" : "bracket-loser";

  return `
    <div class="bracket-slot d-flex justify-content-between align-items-center ${cls}">
      <span class="bracket-name text-truncate">${linkPlayer(player)}</span>
      <span class="bracket-score">${score}</span>
    </div>
  `;
}

// Nome do slot: linka ao perfil pelo ID (players.json) quando o slot tem id;
// sem id (ex.: "A definir" ou partida sem identidade), renderiza texto sem link.
function linkPlayer(player) {
  if (!player.id) return player.name;
  return `<a class="text-decoration-none" href="../player-page/playerPage.html?id=${player.id}">${player.name}</a>`;
}
