/* ASLab Collaborators: search + research-area filters. A collaborator can belong to several areas
   (data-topic="boolean systems"). Name opens their CV / profile, institute opens the institution page. */
(() => {
  const cards = [...document.querySelectorAll('.filter-card')];
  const buttons = [...document.querySelectorAll('.filter-button[data-filter]')];
  const input = document.getElementById('searchInput'), label = document.getElementById('activeLabel'), empty = document.getElementById('emptyState');
  const norm = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const state = { filter: 'all', q: '' };
  cards.forEach(c => { c._text = norm(c.textContent); c._topics = (c.dataset.topic || '').split(/\s+/).filter(Boolean); });
  function render() {
    let shown = 0;
    cards.forEach(c => {
      const ok = (state.filter === 'all' || c._topics.includes(state.filter)) && (!state.q || c._text.includes(state.q));
      c.hidden = !ok; if (ok) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
    const b = buttons.find(x => x.dataset.filter === state.filter);
    if (label) label.textContent = state.filter === 'all' ? 'All research areas' : b.textContent.trim();
  }
  buttons.forEach(b => b.addEventListener('click', () => {
    state.filter = b.dataset.filter; buttons.forEach(x => x.classList.toggle('active', x === b)); render();
  }));
  if (input) input.addEventListener('input', e => { state.q = norm(e.target.value); render(); });
  render();
})();
