// features/shared/themeSwitcher.js
// Responsabilidade: aplicar e persistir o tema (light/dark) do site via
// data-bs-theme do Bootstrap 5.3. Não tem UI — o controle fica no painel de
// configurações (features/shared/topbar/settings.js), que chama
// window.ThemeSwitcher.
//
// Carregado no <head> de cada página para aplicar o tema salvo antes do
// paint, evitando flash de tema incorreto ao navegar entre páginas.

(function () {
  var STORAGE_KEY = 'bonk-theme';

  function current() {
    return localStorage.getItem(STORAGE_KEY) || 'dark';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    document.dispatchEvent(new Event('themechange'));
  }

  window.ThemeSwitcher = {
    get: current,
    set: apply,
    toggle: function () {
      apply(current() === 'light' ? 'dark' : 'light');
    }
  };

  // Aplica o tema salvo assim que o script roda (no head).
  apply(current());
})();
