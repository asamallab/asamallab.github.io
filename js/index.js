/* ASLab Home — page scripts (moved out of index.html unchanged): News filters/arrows, scroll reveal, profile tilt, trajectory panel.
   The header/menu script is shared in js/site.js. */
(function () {
  // News: filter chips (with live counts) + side-by-side track driven by the arrows.
  // Cards are only shown/hidden -- their text is never touched.
  const chips = document.querySelectorAll('.hx-chip');
  const cards = [...document.querySelectorAll('.news-card')];
  const track = document.querySelector('.news-container');
  const prev = document.querySelector('.hx-chip-arrow-left');
  const next = document.querySelector('.hx-chip-arrow-right');
  const status = document.getElementById('hxNewsStatus');
  const labels = { all:'All', award:'Awards', media:'Media', paper:'Paper talks', policy:'Policy' };

  chips.forEach(chip => {
    const f = chip.dataset.filter;
    const n = f === 'all' ? cards.length : cards.filter(c => c.dataset.filter === f).length;
    chip.innerHTML = labels[f] + ' <span class="hx-count">(' + n + ')</span>';
  });

  const visible = () => cards.filter(c => c.style.display !== 'none');
  function updateNav() {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
    const vis = visible();
    if (!vis.length) { status.textContent = ''; return; }
    const left = track.scrollLeft, right = left + track.clientWidth;
    const base = vis[0].offsetLeft;
    let first = 0, last = 0;
    vis.forEach((c, i) => {
      const x = c.offsetLeft - base;
      if (x + c.offsetWidth > left + 4 && !first) first = i + 1;
      if (x < right - 4) last = i + 1;
    });
    status.textContent = 'Showing ' + (first || 1) + '\u2013' + last + ' of ' + vis.length;
  }
  const step = () => { const c = visible()[0]; return c ? c.offsetWidth + 20 : 340; };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-selected', 'false'); });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');
      const filter = chip.dataset.filter;
      cards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.filter === filter) ? '' : 'none';
      });
      track.scrollTo({ left: 0, behavior: 'auto' });
      updateNav();
    });
  });
  updateNav();
  window.addEventListener('load', updateNav);

  // Cursor-responsive light inside News cards.
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100) + '%');
      card.style.setProperty('--my', ((e.clientY-r.top)/r.height*100) + '%');
    });
  });

  })();
  (function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll reveal: each block fades/slides in as it enters the screen.
    var items = document.querySelectorAll('.hx-reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('is-in'); });
    }

    // Profile card: gentle tilt following the mouse.
    var card = document.querySelector('.hx-card');
    if (card && !reduce) {
      card.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--ry', (x * 5) + 'deg');
        card.style.setProperty('--rx', (-y * 5) + 'deg');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    }

    // Trajectory: click the teaser card to open / close the map + timeline.
    var btn = document.querySelector('.hx-traj-card');
    var panel = document.getElementById('hx-traj-panel');
    if (btn && panel) {
      btn.addEventListener('click', function () {
        var open = panel.classList.toggle('is-open');
        btn.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open && !reduce) {
          setTimeout(function () {
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 350);
        }
      });
    }
  })();
  
