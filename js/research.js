/* ASLab Research: left rail switches the full research section shown on the right (keyboard arrows + #research-N links). */
  (function () {
    const items = [...document.querySelectorAll('.rx-item')];
    const panels = [...document.querySelectorAll('.rx-panel')];
    function show(i, focus) {
      items.forEach((b, j) => { b.classList.toggle('is-active', j === i); b.setAttribute('aria-selected', j === i); });
      panels.forEach((p, j) => { p.hidden = j !== i; p.classList.toggle('is-active', j === i); });
      history.replaceState(null, '', '#research-' + (i + 1));
      if (focus && window.innerWidth <= 900) document.getElementById('rxStage').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    items.forEach((b, i) => {
      b.addEventListener('click', () => show(i, true));
      b.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const j = (i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length;
          items[j].focus(); show(j, false);
        }
      });
    });
    const m = location.hash.match(/^#research-(\d)$/);
    if (m && items[+m[1] - 1]) show(+m[1] - 1, false);
  })();
  
