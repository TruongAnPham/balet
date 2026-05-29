/* ============================================================
   collection.js — Whisper of Motion (Collection Page)
   Minimal: nav, lazy-load, lightbox. NO animations.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCollectionNav();
  initCollectionLazyLoad();
  initCollectionLightbox();
});


/* ---------- 1. Navigation ---------- */
function initCollectionNav() {
  const hamburger = document.querySelector('.cnav__hamburger');
  const overlay = document.querySelector('.cnav-overlay');
  if (!hamburger || !overlay) return;

  const toggle = (forceState) => {
    const isOpen = typeof forceState === 'boolean'
      ? forceState
      : !hamburger.classList.contains('active');

    hamburger.classList.toggle('active', isOpen);
    overlay.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    overlay.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });

  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) toggle(false);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) toggle(false);
  });
}


/* ---------- 2. Lazy Loading ---------- */
function initCollectionLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      obs.unobserve(img);
    });
  }, { rootMargin: '300px' });

  images.forEach(img => observer.observe(img));
}


/* ---------- 3. Lightbox ---------- */
function initCollectionLightbox() {
  const items = document.querySelectorAll('[data-lightbox]');
  const lightbox = document.querySelector('.clightbox');
  if (!items.length || !lightbox) return;

  const img = lightbox.querySelector('.clightbox__image');
  const btnClose = lightbox.querySelector('.clightbox__close');
  const btnPrev = lightbox.querySelector('.clightbox__nav--prev');
  const btnNext = lightbox.querySelector('.clightbox__nav--next');

  const gallery = [...items].map(el => el.dataset.src || el.src);
  let current = 0;
  let touchStartX = 0;

  const show = (index) => {
    current = (index + gallery.length) % gallery.length;
    if (img) {
      img.src = gallery[current];
      img.alt = items[current]?.alt || '';
    }
  };

  const open = (index) => {
    show(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  items.forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => open(i));
  });

  btnPrev?.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
  btnNext?.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
  btnClose?.addEventListener('click', close);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Touch swipe support
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 50) {
      show(delta > 0 ? current - 1 : current + 1);
    }
  }, { passive: true });
}
