// features/shared/topbar/settings.js
// Responsabilidade: painel de configurações (offcanvas à direita). Separado do
// topbar.js — a top bar apenas chama window.SiteSettings.open(); todo o
// conteúdo e comportamento das configurações vivem aqui. Hoje é um
// placeholder: as opções reais serão adicionadas neste arquivo sem tocar na
// top bar.

(function () {
  var PANEL_ID = 'settings-offcanvas';

  // Cria o painel uma única vez e o anexa ao body (script no fim do body).
  function ensurePanel() {
    var el = document.getElementById(PANEL_ID);
    if (el) return el;

    var div = document.createElement('div');
    div.id = PANEL_ID;
    div.className = 'offcanvas offcanvas-end';
    div.setAttribute('tabindex', '-1');
    div.setAttribute('aria-labelledby', 'settings-title');
    div.innerHTML =
      '<div class="offcanvas-header">' +
        '<h5 class="offcanvas-title" id="settings-title">Configurações</h5>' +
        '<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Fechar"></button>' +
      '</div>' +
      '<div class="offcanvas-body">' +
        '<p class="text-muted mb-0">Em breve.</p>' +
      '</div>';

    document.body.appendChild(div);
    return div;
  }

  window.SiteSettings = {
    open: function () {
      var el = ensurePanel();
      var offcanvas = bootstrap.Offcanvas.getOrCreateInstance(el);
      offcanvas.show();
    }
  };
})();
