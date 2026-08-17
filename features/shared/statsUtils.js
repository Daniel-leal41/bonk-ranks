// js/statsUtils.js
// Responsabilidade: Lidar com cálculos estatísticos e regras de negócio de ranqueamento.

window.StatsUtils = {
  // Calcula a média de um objeto de habilidades
  getAverage: function (obj) {
    if (!obj) return 0;
    var keys = Object.keys(obj);
    if (keys.length === 0) return 0;
    var sum = 0;
    keys.forEach(function (k) { sum += obj[k]; });
    return Math.round(sum / keys.length);
  },

  // Converte valor numérico para letra de Rank
  getRankLetter: function (val) {
    if (val >= 100) return 'S+';
    if (val >= 95) return 'S';
    if (val >= 90) return 'S-';
    if (val >= 85) return 'A+';
    if (val >= 80) return 'A';
    if (val >= 75) return 'A-';
    if (val >= 70) return 'B+';
    if (val >= 65) return 'B';
    if (val >= 60) return 'B-';
    if (val >= 55) return 'C+';
    if (val >= 50) return 'C';
    if (val >= 45) return 'C-';
    if (val >= 40) return 'D+';
    if (val >= 30) return 'D';
    return 'F';
  },

  // Melhora o contraste visual dos dados aplicando uma correção gama
  improveContrast: function (data, max, gamma) {
    var maxVal = (max !== undefined && max !== null) ? max : 100;
    var gammaVal = (gamma !== undefined && gamma !== null) ? gamma : 3.6;
    return data.map(function (v) {
      var n = Math.max(0, Number(v) || 0) / maxVal;
      return Math.pow(n, gammaVal) * maxVal;
    });
  }
};

