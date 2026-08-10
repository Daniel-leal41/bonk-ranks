// features/shared/i18n/i18n.js
// Responsabilidade: núcleo do sistema de internacionalização.
//   - Decide o idioma ativo: localStorage ('bonk-locale') → navigator.language → pt-BR
//   - Resolve chaves com fallback: idioma ativo → pt-BR → a própria chave
//   - Preenche o DOM estático via data-i18n* (texto, placeholder, alt, aria, title)
//   - Persiste a escolha do usuário e avisa via evento 'localeChanged'
//
// Os dicionários ficam em locales/<codigo>.js e são carregados por <script>
// ANTES deste arquivo (síncrono, sem fetch). O HTML nunca carrega texto
// hardcoded: os nós nascem vazios e o script preenche conforme o idioma ativo.
//
// Carregado no <head> (depois de themeSwitcher.js e dos locales) para setar o
// atributo lang do <html> antes do paint; o preenchimento do DOM acontece no
// DOMContentLoaded (documento ainda não montado durante o parse do head).

(function () {
  var STORAGE_KEY = 'bonk-locale';
  var DEFAULT_LOCALE = 'pt-BR';

  // Idiomas suportados. Cada um deve ter arquivo em locales/<codigo>.js.
  var SUPPORTED = ['pt-BR', 'en'];

  // Detecção do idioma do navegador: pt* → pt-BR; en* → en; resto → pt-BR.
  function detect() {
    var lang = (navigator.language || '').toLowerCase();
    if (lang.indexOf('pt') === 0) return 'pt-BR';
    if (lang.indexOf('en') === 0) return 'en';
    return DEFAULT_LOCALE;
  }

  // Idioma ativo: preferência salva pelo usuário; senão, detecção do browser.
  function current() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    return detect();
  }

  function dict(code) {
    return (window.SiteI18nLocales && window.SiteI18nLocales[code]) || {};
  }

  // Resolve uma chave na cascata: idioma ativo → pt-BR → a própria chave.
  function t(key) {
    var active = current();
    if (dict(active)[key] !== undefined) return dict(active)[key];
    if (dict(DEFAULT_LOCALE)[key] !== undefined) return dict(DEFAULT_LOCALE)[key];
    return key;
  }

  // Resolve um campo localizado dos DADOS (ex.: player.description).
  // Objeto { locale: texto } → cascata ativo → pt-BR → primeira chave → ''.
  // String/ausente → legacy de 1 língua, retorna como está.
  function localized(obj) {
    if (!obj || typeof obj !== 'object') return obj || '';
    var active = current();
    if (typeof obj[active] === 'string' && obj[active] !== '') return obj[active];
    if (typeof obj[DEFAULT_LOCALE] === 'string' && obj[DEFAULT_LOCALE] !== '') {
      return obj[DEFAULT_LOCALE];
    }
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      if (typeof obj[keys[i]] === 'string' && obj[keys[i]] !== '') return obj[keys[i]];
    }
    return '';
  }

  // Preenche os nós marcados com data-i18n* no DOM atual.
  function applyPage() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n-title'));
    });
  }

  // Troca de idioma: persiste, atualiza o <html lang>, reaplica o DOM e avisa.
  function set(code) {
    if (SUPPORTED.indexOf(code) === -1) code = DEFAULT_LOCALE;
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.setAttribute('lang', code);
    applyPage();
    document.dispatchEvent(new Event('localeChanged'));
  }

  window.SiteI18n = {
    get: current,
    set: set,
    t: t,
    localized: localized,
    applyPage: applyPage
  };

  // Aplica o idioma salvo/detectado antes do paint e preenche o DOM quando pronto.
  document.documentElement.setAttribute('lang', current());
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPage);
  } else {
    applyPage();
  }
})();
