/* ASLab People: highlights the category chip for the section in view; shows initials if a photo is missing. */
  (function () {
    const chips = [...document.querySelectorAll('.px-chip')];
    const secs = chips.map(c => document.querySelector(c.getAttribute('href')));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) chips.forEach((c, i) => c.classList.toggle('is-active', secs[i] === e.target));
    }), { rootMargin: '-30% 0px -60% 0px' });
    secs.forEach(s => s && io.observe(s));
    document.querySelectorAll('img.px-photo').forEach(im => im.addEventListener('error', () => {
      const n = (im.alt || '?').trim().split(/\s+/);
      const d = document.createElement('div'); d.className = 'px-photo px-avatar';
      d.textContent = (n[0][0] + (n.length > 1 ? n[n.length - 1][0] : '')).toUpperCase();
      im.replaceWith(d);
    }));
  })();
  
