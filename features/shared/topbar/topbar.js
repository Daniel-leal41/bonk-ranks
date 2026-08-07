// features/shared/topbar/topbar.js
// Responsabilidade: montar a top bar global (brand, links do menu, hamburger e
// botão de engrenagem). Única fonte de verdade para a barra de topo do site.
// As configurações são separadas (settings.js): aqui só chamamos
// window.SiteSettings.open() no clique da engrenagem.
//
// Caminhos: tudo relativo à raiz do site, descoberta a partir do endereço
// deste script — funciona no subpath do GitHub Pages (/bonk-ranks/) e local,
// sem caminhos absolutos. Este arquivo vive sempre em features/shared/topbar/
// (3 níveis abaixo da raiz); document.currentScript só é válido durante o
// parse, por isso é capturado no topo (script sem defer/async).

(function () {
  var scriptUrl = document.currentScript && document.currentScript.src;
  var rootPath = scriptUrl ? new URL('../../..', scriptUrl).pathname : '/'; // .../bonk-ranks/

  // Quantos níveis subir da página atual até a raiz (ex.: "../../")
  function rootPrefix() {
    var rel = location.pathname.slice(rootPath.length);
    var depth = Math.max(0, rel.split('/').filter(Boolean).length - 1);
    return depth > 0 ? Array(depth).fill('../').join('') : '';
  }

  // Marca como ativo quando a página atual é o destino do link.
  // rootPath sempre termina em "/"; index é comparado pelo diretório
  // (serve "/", "/index.html" e "/bonk-ranks/").
  function isActive(href) {
    var target = (rootPath + href).replace(/\/index\.html$/, '/');
    var here = location.pathname.replace(/\/index\.html$/, '/');
    return here === target;
  }

  // Ícones (SVG Feather, mesmo estilo dos demais SVGs do site)
  var ICONS = {
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
    search: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>',
    gear: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>'
  };

  // Envolve o conteúdo do ícone num SVG no estilo padrão do site
  function svg(icon, size) {
    size = size || 18;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round" stroke-linejoin="round">' + icon + '</svg>';
  }

  // <-- Edite aqui para mudar o menu global
  var LINKS = [
    { href: 'index.html', label: 'Início', icon: 'home' },
    { href: 'features/pages/search-page/searchPage.html', label: 'Buscar', icon: 'search' },
    { href: 'features/pages/tournaments-page/tournaments.html', label: 'Torneios', icon: 'trophy' }
  ];

  var LOGO_URL = 'https://res.cloudinary.com/dmmunstfz/image/upload/q_auto/f_auto/v1776456354/BonkRankLogo_tbhxaw.png';

  // Ícone só no mobile (d-md-none); no desktop o link fica só com texto.
  function buildMenu(pre) {
    return LINKS.map(function (l) {
      var active = isActive(l.href);
      return '<li class="nav-item">' +
        '<a class="nav-link d-flex align-items-center gap-2' + (active ? ' active' : '') + '"' +
        (active ? ' aria-current="page"' : '') +
        ' href="' + pre + l.href + '">' +
          '<span class="d-md-none">' + svg(ICONS[l.icon]) + '</span>' + l.label +
        '</a>' +
        '</li>';
    }).join('');
  }

  window.SiteTopbar = {
    build: function (el) {
      var pre = rootPrefix();
      el.classList.add('navbar-expand-md');

      el.innerHTML =
        '<div class="container">' +
          '<a class="navbar-brand d-flex align-items-center gap-2" href="' + pre + 'index.html">' +
            '<img class="rounded-circle" src="' + LOGO_URL + '" width="36" height="36" alt="Logo BonkRANKS">' +
            '<span class="fw-bold">BonkRANKS</span>' +
          '</a>' +

          '<button class="navbar-toggler" type="button" data-bs-toggle="collapse"' +
            ' data-bs-target="#siteTopNav" aria-controls="siteTopNav"' +
            ' aria-expanded="false" aria-label="Abrir menu">' +
            '<span class="navbar-toggler-icon"></span>' +
          '</button>' +

          '<div class="collapse navbar-collapse" id="siteTopNav">' +
            '<ul class="navbar-nav ms-auto align-items-lg-center">' + buildMenu(pre) + '</ul>' 
            +

            '<button class="settings-trigger btn d-flex align-items-center gap-2" type="button" aria-label="Configurações">' +
              svg(ICONS.gear, 22) +
              '<span class="d-md-none">Configurações</span>' +
            '</button>' +
          '</div>' +
        '</div>';
    }
  };

  // Script no fim do body: o placeholder já existe quando este código roda.
  var host = document.querySelector('[data-site-topbar]');
  if (host) {
    window.SiteTopbar.build(host);
    host.querySelector('.settings-trigger').addEventListener('click', function () {
      if (window.SiteSettings && typeof window.SiteSettings.open === 'function') {
        window.SiteSettings.open();
      }
    });
  }
})();
