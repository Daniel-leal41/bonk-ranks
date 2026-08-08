// features/shared/topbar/settings.js
// Responsabilidade: painel de configurações (offcanvas à direita). Separado do
// topbar.js — a top bar apenas chama window.SiteSettings.open(); todo o
// conteúdo e comportamento das configurações vivem aqui.
//
// Tema: a lógica fica em features/shared/themeSwitcher.js (window.ThemeSwitcher);
// aqui fica só a UI (switch "Modo escuro") sincronizada com ele.

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

    // Os textos do painel usam data-i18n* e nascem vazios; o applyPage() logo
    // abaixo os preenche com o idioma ativo (e reaplica a cada localeChanged).
    // Seção de idioma só aparece quando o núcleo i18n está presente.
    var langSection = window.SiteI18n
      ? '<section class="mb-3">' +
          '<h6 class="fw-medium mb-2" data-i18n="settings.language"></h6>' +
          '<select class="form-select" id="language-select" aria-label="" data-i18n-aria="settings.language">' +
            '<option value="pt-BR">Português</option>' +
            '<option value="en">English</option>' +
          '</select>' +
        '</section>'
      : '';

    div.innerHTML =
      '<div class="offcanvas-header">' +
        '<h5 class="offcanvas-title" id="settings-title" data-i18n="settings.title"></h5>' +
        '<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="" data-i18n-aria="settings.close"></button>' +
      '</div>' +
      '<div class="offcanvas-body">' +
        '<section class="mb-3">' +
          '<h6 class="fw-medium mb-2" data-i18n="settings.theme"></h6>' +
          '<div class="form-check form-switch">' +
            '<input class="form-check-input" type="checkbox" role="switch" id="theme-switch">' +
            '<label class="form-check-label" for="theme-switch" data-i18n="settings.darkMode"></label>' +
          '</div>' +
        '</section>' +
        langSection +
      '</div>';

    document.body.appendChild(div);

    // Preenche os textos do painel com o idioma ativo.
    if (window.SiteI18n) {
      window.SiteI18n.applyPage();
    }

    // Sincroniza o switch com o tema atual e delega a alternância ao módulo.
    var themeSwitch = div.querySelector('#theme-switch');
    if (window.ThemeSwitcher) {
      themeSwitch.checked = window.ThemeSwitcher.get() === 'dark';
      themeSwitch.addEventListener('change', function () {
        window.ThemeSwitcher.set(themeSwitch.checked ? 'dark' : 'light');
      });
    }

    // Seletor de idioma: reflete o idioma ativo e delega a troca ao núcleo i18n.
    var langSelect = div.querySelector('#language-select');
    if (langSelect && window.SiteI18n) {
      langSelect.value = window.SiteI18n.get();
      langSelect.addEventListener('change', function () {
        window.SiteI18n.set(langSelect.value);
      });
      // Mantém o select sincronizado se o idioma mudar por outro caminho.
      document.addEventListener('localeChanged', function () {
        langSelect.value = window.SiteI18n.get();
      });
    }

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
