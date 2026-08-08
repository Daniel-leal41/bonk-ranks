// js/renderPlayer.js
// Responsabilidade: ler ?id= ou ?name= da URL, achar o jogador, exibir o perfil.

document.addEventListener("dataReady", function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var name = params.get("name");
  var container = document.getElementById("player-container");

  // --- ACHAR O JOGADOR ---
  // Aceita ?id= (busca por id) ou ?name= (busca por username, case-insensitive).
  // O ?name= é usado pela bracket page para linkar nomes de partidas ao perfil.
  var player = window.players.find(function (p) {
    if (id) return p.id === id;
    if (name) return p.username.toLowerCase() === name.toLowerCase();
    return false;
  });

  if (!player) {
    container.innerHTML = '<p class="player-not-found">Jogador não encontrado.</p>';
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
        <p class="profile-meta text-secondary mb-0 mt-2">Região: ${player.region || 'Desconhecida'}</p>
      </div>
      <div class="profile-rank-box border rounded-3 text-center">
        <span class="rank-label">RANK</span>
        <div class="profile-rank">${player.rank || 'N/A'}</div>
      </div>
    </div>

    <div class="card skills-container">
      <div class="card-body">
        <h2 class="h4 fw-bold mb-4">Description</h2>
        <div class="row g-4 align-items-start">
          <div class="col-12 col-md-6 skills-text">
            <p class="mb-0">${player.description || 'sem nada para mostrar por enquanto...'}</p>
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
  // Cores de traço/rótulo acompanham o tema (data-bs-theme): no claro usam
  // preto (contraparte do branco), no escuro voltam ao branco. Sem isso os
  // traços brancos somem no fundo claro.
  function themeColors() {
    var isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    return {
      grid: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      label: isDark ? '#fff' : '#000',
      point: isDark ? '#ffffff' : '#000000'
    };
  }

  var ctx = document.getElementById('skillsChart').getContext('2d');

  var skillsChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: chartLabels,
      datasets: [{
        data: transformedData,
        backgroundColor: 'rgba(99, 102, 241, 0.4)',
        borderColor: '#6366f1',
        pointBackgroundColor: themeColors().point,
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
          angleLines: { color: themeColors().grid },
          grid: { color: themeColors().grid },
          pointLabels: {
            color: themeColors().label,
            font: { size: 12, weight: '600' }
          },
          ticks: { display: false }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  // Reaplica as cores quando o tema muda, sem recriar o gráfico.
  document.addEventListener('themechange', function () {
    var c = themeColors();
    skillsChart.options.scales.r.angleLines.color = c.grid;
    skillsChart.options.scales.r.grid.color = c.grid;
    skillsChart.options.scales.r.pointLabels.color = c.label;
    skillsChart.data.datasets[0].pointBackgroundColor = c.point;
    skillsChart.update();
  });

});
