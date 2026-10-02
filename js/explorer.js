/* Shared search + filter + detail drawer for Collaborators and Databases & Webservers.
   Cards:  .filter-card[data-topic="a b"][data-drawer="<html>"]   (a card may belong to several topics)
   Filter: .filter-button[data-filter="all|topic"]                                                     */
window.ASLabExplorer = {
  init(opts) {
    const o = Object.assign({ allLabel: 'All research areas' }, opts || {});
    const $ = s => document.querySelector(s);
    const cards = [...document.querySelectorAll('.filter-card')];
    const buttons = [...document.querySelectorAll('.filter-button')];
    const input = $('#searchInput'), label = $('#activeLabel'), empty = $('#emptyState');
    const drawer = $('#detailDrawer'), backdrop = $('#drawerBackdrop'), content = $('#drawerContent'), closeBtn = $('#drawerClose');
    const state = { filter: 'all', q: '' };
    const norm = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

    // search text = visible card text + drawer text (so institutions / topics are searchable too)
    cards.forEach(c => {
      const tmp = document.createElement('div');
      tmp.innerHTML = c.dataset.drawer || '';
      c._text = norm(c.textContent + ' ' + tmp.textContent);
      c._topics = (c.dataset.topic || '').split(/\s+/).filter(Boolean);
      c.setAttribute('tabindex', '0');
      c.setAttribute('role', 'button');
    });

    function render() {
      let shown = 0;
      cards.forEach(c => {
        const ok = (state.filter === 'all' || c._topics.includes(state.filter)) && (!state.q || c._text.includes(state.q));
        c.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
      const active = buttons.find(b => b.dataset.filter === state.filter);
      if (label) label.textContent = state.filter === 'all' ? o.allLabel : active.textContent.trim();
    }

    function openDrawer(card) {
      content.innerHTML = card.dataset.drawer || '';
      backdrop.hidden = false;
      requestAnimationFrame(() => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); });
      drawer._opener = card;
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      setTimeout(() => { backdrop.hidden = true; }, 280);
      if (drawer._opener) drawer._opener.focus();
    }

    cards.forEach(c => {
      c.addEventListener('click', e => { if (e.target.closest('a')) return; openDrawer(c); });
      c.addEventListener('keydown', e => {
        if (e.target !== c) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(c); }
      });
    });
    buttons.forEach(b => b.addEventListener('click', () => {
      state.filter = b.dataset.filter;
      buttons.forEach(x => x.classList.toggle('active', x === b));
      render();
    }));
    if (input) input.addEventListener('input', e => { state.q = norm(e.target.value); render(); });
    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });
    drawer.setAttribute('aria-hidden', 'true');
    render();
  }
};
