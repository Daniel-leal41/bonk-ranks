// js/renderPlayer.js
// Responsabilidade: ler ?id= ou ?name= da URL, achar o jogador, exibir o perfil.
// Re-renderiza a cada mudança de idioma (localeChanged): o Chart anterior é
// destruído antes de recriar o radar com o novo idioma.

document.addEventListener("dataReady", function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var name = params.get("name");
  var container = document.getElementById("player-container");
  var chartInstance = null;

  // Resolve strings via i18n. Fallback → a própria chave (que cai em pt-BR).
  function t(key) {
    return window.SiteI18n ? window.SiteI18n.t(key) : key;
  }

  function render() {
    // Destrói o radar anterior antes de remontar o perfil (canvas é recriado
    // pelo innerHTML abaixo; sem destroy, o Chart.js mantém o registro antigo).
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    // --- ACHAR O JOGADOR ---
    // Aceita ?id= (busca por id) ou ?name= (busca por username, case-insensitive).
    // O ?name= é usado pela bracket page para linkar nomes de partidas ao perfil.
    var player = window.players.find(function (p) {
      if (id) return p.id === id;
      if (name) return p.username.toLowerCase() === name.toLowerCase();
      return false;
    });

    if (!player) {
      container.innerHTML = '<p class="player-not-found">' + t('player.notFound') + '</p>';
      return;
    }

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
              <p class="mb-0">${player.description || t('player.noDescription')}</p>
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
    applyRankColor(rankEl, player.rank);

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
    var ctx = document.getElementById('skillsChart').getContext('2d');
    // tooltip para configurar no hover do mouse
    chartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: chartLabels,
        datasets: [{
          data: transformedData,
          backgroundColor: 'rgba(99, 102, 241, 0.4)',
          borderColor: '#6366f1',
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#6366f1',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0, max: 100,
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: {
              color: '#fff',
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
});
