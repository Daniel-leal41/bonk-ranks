// features/pages/index-page/js/dynamicWord.js
// Responsabilidade: charme da home. Dois comportamentos independentes:
//   1. #dynamic-word cicla entre home.word.1..4 (i18n) com fade.
//   2. #dynamic-avatar-link: clique dispara o "fidget" da logo
//      (a animação fica no CSS; aqui só liga/desliga a classe).
//
// Script no fim do body. O início é adiado para o DOMContentLoaded para
// rodar DEPOIS do applyPage() do i18n (registrado no <head>) — assim o
// texto i18n inicial é preenchido antes de assumirmos a palavra atual.

(function () {
  var WORD_KEYS = ['home.word.1', 'home.word.2', 'home.word.3', 'home.word.4'];
  var SWAP_MS = 2500;
  var FIDGET_CLASS = 'fidget';
  var FADE_CLASS = 'word-fade';

  var wordEl = document.getElementById('dynamic-word');
  var avatarLink = document.getElementById('dynamic-avatar-link');
  var avatarImg = document.getElementById('dynamic-avatar');
  var currentIndex = 0;
  var timer = null;

  // Resolve strings SEMPRE via helper com fallback (convenção do projeto).
  function t(key) {
    return window.SiteI18n ? window.SiteI18n.t(key) : key;
  }

  // Aplica a palavra com fade: remove a classe, força reflow e readiciona
  // para reiniciar a animação CSS (fade-in a cada troca).
  function renderWord() {
    if (!wordEl) return;
    wordEl.classList.remove(FADE_CLASS);
    void wordEl.offsetWidth;
    wordEl.textContent = t(WORD_KEYS[currentIndex]);
    wordEl.classList.add(FADE_CLASS);
  }

  function startCycle() {
    if (timer) return;
    timer = setInterval(function () {
      currentIndex = (currentIndex + 1) % WORD_KEYS.length;
      renderWord();
    }, SWAP_MS);
  }

  function stopCycle() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Clique na logo: reinicia o fidget (remove/readiciona a classe para
  // reiniciar a animação mesmo com cliques seguidos). O animationend do
  // próprio fidget remove a classe, devolvendo o giro contínuo do idle.
  function fidget() {
    if (!avatarImg) return;
    avatarImg.classList.remove(FIDGET_CLASS);
    void avatarImg.offsetWidth;
    avatarImg.classList.add(FIDGET_CLASS);
  }

  function onFidgetEnd(e) {
    if (e.animationName === 'avatar-fidget') {
      avatarImg.classList.remove(FIDGET_CLASS);
    }
  }

  function init() {
    renderWord();
    startCycle();

    if (avatarLink && avatarImg) {
      avatarLink.addEventListener('click', function (e) {
        e.preventDefault();
        fidget();
      });
      avatarImg.addEventListener('animationend', onFidgetEnd);
    }

    // Ao trocar de idioma, reapresenta a palavra atual no novo idioma.
    if (window.SiteI18n) {
      document.addEventListener('localeChanged', renderWord);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
