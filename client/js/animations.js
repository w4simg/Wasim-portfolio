/* ═══════════════════════════════════════════════════════════════════════
   animations.js — Interactions (Professional Theme)
   Wasim Akram Portfolio
═══════════════════════════════════════════════════════════════════════ */

// ── Typewriter Effect ─────────────────────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const texts = [
    'Python backend systems',
    'Django REST APIs',
    'data processing tools',
    'scalable architectures'
  ];

  let textIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let paused   = false;

  function type() {
    const current = texts[textIdx];
    if (paused) {
      paused = false;
      setTimeout(type, 1600);
      return;
    }
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; paused = true; }
      setTimeout(type, 60);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        textIdx  = (textIdx + 1) % texts.length;
      }
      setTimeout(type, 30);
    }
  }

  setTimeout(type, 800);
})();

// ── Scroll Reveal ─────────────────────────────────────────────────────
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

// ── Navbar shrink on scroll ───────────────────────────────────────────
(function initNavbarScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      nav.style.background = 'rgba(4, 13, 7, 0.95)';
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      nav.style.background = 'rgba(4, 13, 7, 0.85)';
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });
})();

// ── Mobile Menu Toggle ────────────────────────────────────────────────
(function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isVisible = links.style.display === 'flex';
    if (isVisible) {
      links.style.display = 'none';
    } else {
      links.style.display = 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '100%';
      links.style.left = '0';
      links.style.width = '100%';
      links.style.background = 'rgba(4, 13, 7, 0.98)';
      links.style.padding = '20px';
      links.style.borderBottom = '1px solid var(--border-color)';
    }
  });

  // Close menu on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        links.style.display = 'none';
      }
    });
  });
})();
