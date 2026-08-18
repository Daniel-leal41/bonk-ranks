// renderPagination.js
// Responsabilidade: APENAS renderizar o nav de paginação.
// Não sabe de onde vieram os dados, não decide estado, não escuta eventos
// além dos próprios cliques (que só repassam a intenção ao controller).
// Recebe a config { page, totalPages, total, onChange } e o navEl, e desenha
// o nav Bootstrap: Anterior / "Página X de Y · N resultados" / Próxima.
// Só roda em searchPage.html.

window.renderPagination = function (config, navEl) {
  // Sem paginação quando há 0 ou 1 página (inclui o estado vazio):
  // o nav nem aparece.
  if (config.totalPages <= 1) {
    navEl.innerHTML = '';
    return;
  }

  // Helper i18n com fallback (convenção do projeto — nunca chamar
  // window.SiteI18n.t() direto).
  function t(key) {
    return window.SiteI18n ? window.SiteI18n.t(key) : key;
  }

  var page = config.page;
  var totalPages = config.totalPages;

  navEl.setAttribute('aria-label', t('search.pagination.nav'));

  // Indicador: "Página X de Y · N resultado(s)" (plural correto).
  var resultsWord = config.total === 1
    ? t('search.pagination.result')
    : t('search.pagination.results');
  var pageLabel = t('search.pagination.pageOf') + ' ' + page + ' '
    + t('search.pagination.of') + ' ' + totalPages + ' · '
    + config.total + ' ' + resultsWord;

  // Botões desabilitados nas bordas: atributo disabled no <button>
  // (impede o clique e dispensa href="#" que pularia o scroll).
  var prevDisabled = page <= 1;
  var nextDisabled = page >= totalPages;

  navEl.innerHTML = [
    '<ul class="pagination justify-content-center mb-0">',
    '  <li class="page-item' + (prevDisabled ? ' disabled' : '') + '">',
    '    <button type="button" class="page-link" data-action="prev"' + (prevDisabled ? ' disabled' : '') + '>' + t('search.pagination.prev') + '</button>',
    '  </li>',
    '  <li class="page-item disabled">',
    '    <span class="page-link">' + pageLabel + '</span>',
    '  </li>',
    '  <li class="page-item' + (nextDisabled ? ' disabled' : '') + '">',
    '    <button type="button" class="page-link" data-action="next"' + (nextDisabled ? ' disabled' : '') + '>' + t('search.pagination.next') + '</button>',
    '  </li>',
    '</ul>'
  ].join('');

  // Cliques repassam a intenção ao controller; ele faz o clamp. Botões
  // disabled não disparam clique (atributo nativo do <button>).
  navEl.querySelector('[data-action="prev"]').addEventListener('click', function () {
    config.onChange(page - 1);
  });
  navEl.querySelector('[data-action="next"]').addEventListener('click', function () {
    config.onChange(page + 1);
  });
};
