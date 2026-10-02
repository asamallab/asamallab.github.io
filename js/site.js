/* ASLab — shared header behaviour for every page (hamburger, mobile dropdowns, current page). */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
  }
  document.querySelectorAll('.dropdown').forEach(drop => {
    const toggle = drop.querySelector('.dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', e => {
      e.preventDefault();
      drop.classList.toggle('active');
    });
  });

  // Mark the link for the page being viewed.
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-menu a[href$=".html"]').forEach(a => {
    if (a.getAttribute('href').toLowerCase() === here) {
      a.setAttribute('aria-current', 'page');
      const parent = a.closest('.dropdown');
      if (parent) parent.classList.add('is-current');
    }
  });
});
