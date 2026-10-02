/* Databases & Webservers: search, research-area filters and detail drawer (see explorer.js). */
ASLabExplorer.init({ allLabel: 'All research areas' });

/* Cursor-responsive light on database / webserver cards (Green-Sage design). */
document.querySelectorAll('.resource-card').forEach(card => {
  card.addEventListener('pointermove', e => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
  card.addEventListener('pointerleave', () => { card.style.setProperty('--mx', '50%'); card.style.setProperty('--my', '50%'); });
});
