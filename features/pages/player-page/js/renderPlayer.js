// js/renderPlayer.js
// Responsabilidade: ler ?id= da URL, achar o jogador, exibir o perfil.
// Re-renderiza a cada mudança de idioma (localeChanged): o Chart anterior é
// destruído antes de recriar o radar com o novo idioma.

document.addEventListener("dataReady", function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var container = document.getElementById("player-container");
  var chartInstance = null;

  // Resolve strings via i18n. Fallback → a própria chave (que cai em pt-BR).
  function t(key) {
    return window.SiteI18n ? window.SiteI18n.t(key) : key;
  }

  // Cores do radar dependentes do tema (data-bs-theme no <html>). No modo
  // claro o branco puro (grade/linhas/rótulos/pontos) sumiria no fundo.
  function isDark() {
    return document.documentElement.getAttribute('data-bs-theme') === 'dark';
  }

  function chartTheme() {
    return isDark()
      ? { grid: 'rgba(255,255,255,0.1)', labels: '#fff', points: '#ffffff' }
      : { grid: 'rgba(0,0,0,0.2)', labels: '#0f1011', points: '#5e17eb' };
  }

  // Título da aba: nome do jogador + brand, seguindo o padrão do player.title
  // ("Perfil — BonkRANKS"). username é dado (não traduz). Chama no render para
  // acompanhar o localeChanged sem deixar o applyPage() do i18n reverter.
  function setTitle(title) {
    document.title = title;
  }

  function render() {
    // Destrói o radar anterior antes de remontar o perfil (canvas é recriado
    // pelo innerHTML abaixo; sem destroy, o Chart.js mantém o registro antigo).
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    // --- ACHAR O JOGADOR ---
    // Busca por ?id= (usado pela search-page e pela bracket-page via id).
    var player = window.players.find(function (p) {
      return id && p.id === id;
    });

    if (!player) {
      setTitle(t('player.title'));
      container.innerHTML = '<p class="player-not-found">' + t('player.notFound') + '</p>';
      return;
    }

    setTitle(player.username + ' — BonkRANKS');

    // --- 1. CALCULAR MÉDIA DAS SKILLS ---
    var statsData = [
      window.StatsUtils.getAverage(player.skills["IQ"]),
      window.StatsUtils.getAverage(player.skills["Defense"]),
      window.StatsUtils.getAverage(player.skills["Offense"]),
      window.StatsUtils.getAverage(player.skills["Core"]),
      window.StatsUtils.getAverage(player.skills["Mental"]),
      window.StatsUtils.getAverage(player.skills["Special"])
    ];

    // --- 2. RENDERIZAR PERFIL COMPLETO ---
    container.innerHTML = `
      <div class="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-4 mb-5">
        <img src="${player.avatarUrl}" class="profile-avatar" alt="${player.username}">
        <div class="flex-grow-1">
          <h2 class="profile-name fw-bold text-uppercase mb-0">${player.username}</h2>
          <p class="profile-meta text-secondary mb-0 mt-2">${t('player.region')} ${player.region || t('player.unknownRegion')}</p>
        </div>
        <div class="profile-rank-box border rounded-3 text-center">
          <span class="rank-label">${t('player.rankLabel')}</span>
          <div class="profile-rank">${player.rank || t('player.na')}</div>
        </div>
      </div>

      <div class="card skills-container">
        <div class="card-body">
          <h2 class="h4 fw-bold mb-4">${t('player.description')}</h2>
          <div class="row g-4 align-items-start">
            <div class="col-12 col-md-6 skills-text">
              <p class="mb-0">${window.SiteI18n.localized(player.description) || t('player.noDescription')}</p>
            </div>
            <div class="col-12 col-md-6">
              <div class="skills-chart-wrapper">
                <canvas id="skillsChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // --- 3. COLORIR O RANK ---
    var rankEl = container.querySelector('.profile-rank');
    window.RankColors.applyRankColor(rankEl, player.rank);

    // --- 4. PREPARAR DADOS DO GRÁFICO ---
    // Nomes das categorias mantidos em inglês nos dois idiomas (decisão de i18n).
    var baseLabels = ['IQ', 'Defense', 'Offense', 'Core', 'Mental', 'Special'];

    var chartLabels = baseLabels.map(function (label, index) {
      var trueValue = statsData[index];
      var rankLetter = window.StatsUtils.getRankLetter(trueValue);
      return [label, rankLetter];
    });

    function improveContrast(data, max = 100, gamma = 4.9) {
      return data.map(v => {
        const n = Math.max(0, Number(v) || 0) / max;
        return Math.pow(n, gamma) * max;
      });
    }

    const transformedData = improveContrast(statsData);

    // --- 5. INICIAR O GRÁFICO (CHART.JS) ---
    var theme = chartTheme();
    var ctx = document.getElementById('skillsChart').getContext('2d');
    // tooltip para configurar no hover do mouse
    chartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: chartLabels,
        datasets: [{
          data: transformedData,
          backgroundColor: 'rgba(94, 23, 235, 0.4)',
          borderColor: '#5e17eb',
          pointBackgroundColor: theme.points,
          pointBorderColor: '#5e17eb',
          borderWidth: 2
        }]
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
          legend: { display: false },
          tooltip: {
            callbacks: {
               label: function(context) {
                  var value = statsData[context.dataIndex];
                  return value
               }
            }
          }
        }
      }
    });
  }

  render();
  document.addEventListener('localeChanged', render);
  document.addEventListener('themechange', render);
});
