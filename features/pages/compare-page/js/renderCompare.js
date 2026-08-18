// js/renderCompare.js
// Responsabilidade: orquestrar a página de comparação (2 jogadores via <select>,
// que funcionam como "pesquisa" — liste e filtre pelo nome nativamente).
//   1. Preenche os dois <select> com todos os jogadores e desenha o radar
//      SOBREPOSTO (um dataset por jogador) em #compareChart.
//   2. Monta a tabela "quem vence em cada status" (#compare-table): 6 categorias
//      + média geral; célula do vencedor em verde/negrito, SEM badge, SEM delta.
//   3. Re-renderiza a cada mudança de idioma/tema preservando a seleção atual.
// Dados vêm de window.comparePlayers (js/compare.js — função pura).

(function () {
  function init() {
    var selectA = document.getElementById("compare-player-a");
    var selectB = document.getElementById("compare-player-b");
    var emptyEl = document.getElementById("compare-empty");
    var wrapper = document.getElementById("compare-chart-wrapper");
    var tableSection = document.getElementById("compare-table-section");
    var chartInstance = null;

    // Resolve strings via i18n. Fallback → a própria chave.
    function t(key) {
      return window.SiteI18n ? window.SiteI18n.t(key) : key;
    }

    function isDark() {
      return document.documentElement.getAttribute('data-bs-theme') === 'dark';
    }

    // Cores de grade/rótulos/legenda dependentes do tema (ver renderPlayer.js).
    function chartTheme() {
      return isDark()
        ? { grid: 'rgba(255,255,255,0.1)', labels: '#fff', legend: '#fff' }
        : { grid: 'rgba(0,0,0,0.2)', labels: '#0f1011', legend: '#0f1011' };
    }

    // Paleta fixa por jogador (índice de seleção): indigo, red, green, amber.
    // Com limite de 2 jogadores, só as duas primeiras são usadas.
    var PALETTES = [
      { bg: 'rgba(99,102,241,0.30)', border: '#6366f1', point: '#6366f1' },
      { bg: 'rgba(239,68,68,0.30)',  border: '#ef4444', point: '#ef4444' },
      { bg: 'rgba(34,197,94,0.30)',  border: '#22c55e', point: '#22c55e' },
      { bg: 'rgba(245,158,11,0.30)', border: '#f59e0b', point: '#f59e0b' }
    ];

    // Preenche um <select> preservando o valor atualmente selecionado
    // (o re-render em locale/theme mudança não pode resetar a escolha).
    function fillSelect(select) {
      var prev = select.value;
      select.innerHTML = '<option value="">' + t('compare.selectPlayer') + '</option>' +
        window.players.map(function (p) {
          return '<option value="' + p.id + '">' + p.username + '</option>';
        }).join('');
      select.value = prev;
    }

    function playerOf(select) {
      return window.players.find(function (p) { return p.id === select.value; });
    }

    // Linha de categoria ou média geral: vencedor em verde/negrito, demais em
    // cinza. Empate (winners[status] === null) → ninguém destacado.
    function statusCells(comparison, status, valueOf) {
      var winner = comparison.winners[status];
      return comparison.perPlayer.map(function (pp, i) {
        if (winner && winner.index === i) {
          return '<td><span class="fw-bold text-success">' + valueOf(pp, i) + '</span></td>';
        }
        return '<td class="text-body-secondary">' + valueOf(pp, i) + '</td>';
      }).join('');
    }

    // Cabeçalho: coluna Status + uma coluna por jogador (username).
    function renderTable(comparison) {
      var head = document.getElementById('compare-table-head');
      var body = document.getElementById('compare-table-body');

      head.innerHTML = '<th scope="col">' + t('compare.status') + '</th>' +
        comparison.perPlayer.map(function (pp) {
          return '<th scope="col">' + pp.username + '</th>';
        }).join('');

      var rows = comparison.categories.map(function (cat, i) {
        return '<tr>' +
          '<td class="fw-semibold">' + cat + '</td>' +
          statusCells(comparison, cat, function (pp) { return pp.averages[i]; }) +
        '</tr>';
      }).join('');

      rows += '<tr class="total-row">' +
        '<td>' + t('compare.overall') + '</td>' +
        statusCells(comparison, 'overall', function (pp) { return pp.overall; }) +
      '</tr>';

      body.innerHTML = rows;
    }

    function render() {
      fillSelect(selectA);
      fillSelect(selectB);

      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }

      var playerA = playerOf(selectA);
      var playerB = playerOf(selectB);

      if (!playerA || !playerB) {
        wrapper.hidden = true;
        tableSection.hidden = true;
        emptyEl.hidden = false;
        emptyEl.textContent = (!playerA && !playerB)
          ? t('compare.empty')
          : t('compare.minTwo');
        return;
      }

      emptyEl.hidden = true;

      // Comparação pura (médias + vencedores por status)
      var comparison = window.comparePlayers([playerA, playerB]);

      // --- Radar sobreposto (um dataset por jogador, paleta fixa) ---
      var theme = chartTheme();
      var ctx = document.getElementById('compareChart').getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: comparison.categories,
          datasets: comparison.perPlayer.map(function (pp, i) {
            return {
              label: pp.username,
              data: window.StatsUtils.improveContrast(pp.averages),
              backgroundColor: PALETTES[i].bg,
              borderColor: PALETTES[i].border,
              pointBackgroundColor: PALETTES[i].point,
              pointBorderColor: PALETTES[i].point,
              borderWidth: 2
            };
          })
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              min: 0, max: 100,
              angleLines: { color: theme.grid },
              grid: { color: theme.grid },
              pointLabels: {
                color: theme.labels,
                font: { size: 12, weight: '600' }
              },
              ticks: { display: false }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: { color: theme.legend }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.dataset.label + ': ' + comparison.perPlayer[context.datasetIndex].averages[context.dataIndex];
                }
              }
            }
          }
        }
      });
      wrapper.hidden = false;

      // --- Tabela de vencedores ---
      renderTable(comparison);
      tableSection.hidden = false;
    }

    render();
    selectA.addEventListener('change', render);
    selectB.addEventListener('change', render);
    document.addEventListener('themechange', render);
    document.addEventListener('localeChanged', render);
  }

  // Se os dados já existem no window (fetch resolvido antes deste script rodar,
  // ex.: cache), executa init() imediatamente; senão aguarda o evento dataReady.
  // Evita a race condition de o evento ser disparado antes do listener existir.
  if (window.players) {
    init();
  } else {
    document.addEventListener("dataReady", init);
  }
})();
