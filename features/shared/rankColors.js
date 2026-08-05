/**
 * rankColors.js
 * Módulo responsável pela colorização do rank no perfil do jogador.
 * Para editar uma cor, basta alterar as entradas em RANK_GRADIENTS.
 *
 * Famílias de cor:
 *   S → Vermelho   (+ mais escuro, - mais claro)
 *   A → Azul       (+ mais escuro, - mais claro)
 *   B → Amarelo    (+ mais escuro, - mais claro)
 *   C → Verde      (+ mais escuro, - mais claro)
 *   D → Cinza      (+ mais escuro, - mais claro)
 *   F → Marrom
 */

const RANK_GRADIENTS = {
  // ── S TIER — Vermelho ────────────────────────────────────────────────────
  'S+': { colors: ['#8b0000', '#cc0000'], glow: 'rgba(180,0,0,0.5)'      },
  'S':  { colors: ['#cc0000', '#ff3333'], glow: 'rgba(220,0,0,0.45)'     },
  'S-': { colors: ['#ff3333', '#ff8080'], glow: 'rgba(255,80,80,0.4)'    },

  // ── A TIER — Azul ────────────────────────────────────────────────────────
  'A+': { colors: ['#00008b', '#0000dd'], glow: 'rgba(0,0,180,0.5)'      },
  'A':  { colors: ['#0000dd', '#3366ff'], glow: 'rgba(30,60,255,0.45)'   },
  'A-': { colors: ['#3366ff', '#88aaff'], glow: 'rgba(80,130,255,0.4)'   },

  // ── B TIER — Amarelo ─────────────────────────────────────────────────────
  'B+': { colors: ['#997700', '#ccaa00'], glow: 'rgba(180,140,0,0.5)'    },
  'B':  { colors: ['#ccaa00', '#ffdd00'], glow: 'rgba(220,190,0,0.45)'   },
  'B-': { colors: ['#ffdd00', '#ffee77'], glow: 'rgba(255,220,50,0.4)'   },

  // ── C TIER — Verde ───────────────────────────────────────────────────────
  'C+': { colors: ['#005500', '#008800'], glow: 'rgba(0,120,0,0.5)'      },
  'C':  { colors: ['#008800', '#00cc00'], glow: 'rgba(0,180,0,0.45)'     },
  'C-': { colors: ['#00cc00', '#66ee66'], glow: 'rgba(50,210,50,0.4)'    },

  // ── D TIER — Cinza ───────────────────────────────────────────────────────
  'D+': { colors: ['#333333', '#555555'], glow: 'rgba(80,80,80,0.4)'     },
  'D':  { colors: ['#555555', '#888888'], glow: 'rgba(110,110,110,0.35)' },
  'D-': { colors: ['#888888', '#bbbbbb'], glow: 'rgba(150,150,150,0.3)'  },

  // ── F TIER — Marrom ──────────────────────────────────────────────────────
  'F':  { colors: ['#3b1a0a', '#7a3a1a'], glow: 'rgba(90,40,15,0.35)'   },
};

/** Fallback para ranks desconhecidos */
const RANK_FALLBACK = {
  colors: ['#666666', '#999999'],
  glow: 'rgba(150,150,150,0.2)',
};

function getRankConfig(rank) {
  return RANK_GRADIENTS[rank] ?? RANK_FALLBACK;
}

function getRankGradientCSS(rank) {
  const { colors } = getRankConfig(rank);
  return `linear-gradient(135deg, ${colors.join(', ')})`;
}

function applyRankColor(element, rank) {
  if (!element) return;
  const { glow } = getRankConfig(rank);
  element.style.background = getRankGradientCSS(rank);
  element.style.webkitBackgroundClip = 'text';
  element.style.webkitTextFillColor = 'transparent';
  element.style.backgroundClip = 'text';
  element.style.filter = `drop-shadow(0 0 12px ${glow})`;
}