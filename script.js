document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  const toTop = document.getElementById('toTop');
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = [...links].map(l => document.querySelector(l.getAttribute('href')));

  document.getElementById('year').textContent = new Date().getFullYear();

  // Navbar style, back-to-top button and active link on scroll
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 500);
    let current = 0;
    sections.forEach((s, i) => { if (s && s.offsetTop - 120 <= y) current = i; });
    links.forEach((l, i) => l.classList.toggle('active', i === current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Close the mobile menu after choosing a link
  const menu = document.getElementById('navMenu');
  document.querySelectorAll('#navMenu a').forEach(a => a.addEventListener('click', () => {
    if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  }));

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 80 + 'ms';
    io.observe(el);
  });

  // Animated counters
  document.querySelectorAll('.count').forEach(el => {
    const target = +el.dataset.target, start = performance.now(), dur = 1600;
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  });

  // Portfolio filter
  const projects = document.querySelectorAll('.project');
  document.querySelectorAll('.btn-filter').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projects.forEach(p => {
      const match = f === 'all' || p.dataset.cat === f;
      if (match) { p.classList.remove('hide'); requestAnimationFrame(() => p.classList.remove('fade')); }
      else { p.classList.add('fade'); setTimeout(() => p.classList.add('hide'), 300); }
    });
  }));

  // Contact form validation
  const form = document.getElementById('contactForm');
  const ok = document.getElementById('formSuccess');
  form.addEventListener('submit', e => {
    e.preventDefault();
    ok.classList.add('d-none');
    let valid = true;
    form.querySelectorAll('input, select, textarea').forEach(f => {
      const good = f.checkValidity();
      f.classList.toggle('is-invalid', !good);
      f.classList.toggle('is-valid', good);
      if (!good) valid = false;
    });
    if (valid) { ok.classList.remove('d-none'); form.reset(); form.querySelectorAll('.is-valid').forEach(f => f.classList.remove('is-valid')); }
  });
});
