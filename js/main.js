/* ============================================================
   main.js — Whisper of Motion (Vanilla JS, zero dependencies)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollSpy();
  initNavbarScroll();
  initLightbox();
  initLazyLoad();
  initFadeIn();
});

/* ---------- 1. Hamburger Menu + Smooth Scroll ---------- */
function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const overlay = document.querySelector('.cnav-overlay'); // SỬA: đúng class của bạn
  if (!hamburger || !overlay) return;

  const overlayLinks = overlay.querySelectorAll('a');

  const toggleMenu = (forceState) => {
    const isOpen = typeof forceState === 'boolean'
      ? forceState
      : !hamburger.classList.contains('active');

    hamburger.classList.toggle('active', isOpen);
    overlay.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // SỬA: bỏ aria-hidden hoặc set đúng cách
    if (isOpen) {
      overlay.removeAttribute('aria-hidden');
    } else {
      overlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  // Toggle on hamburger click
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu + smooth-scroll when clicking overlay links
  overlayLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      
      // Đóng menu trước
      toggleMenu(false);
      
      // Xử lý smooth scroll cho anchor links (#concept)
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      } else if (href && href !== '#') {
        // Chuyển trang cho link không phải anchor
        setTimeout(() => {
          window.location.href = href;
        }, 150);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  // Close on clicking outside (on the overlay background itself)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      toggleMenu(false);
    }
  });

  // Smooth scroll for ALL other anchor links on the page
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if ([...overlayLinks].includes(anchor)) return; // already handled
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------- 2. Active Section Detection (Scroll Spy) ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('#concept, #process, #collection');
  const desktopLinks = document.querySelectorAll('.nav-links-desktop a');
  if (!sections.length || !desktopLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      desktopLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { threshold: 0.05, rootMargin: '-10% 0px -80% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* ---------- 3. Navbar Scroll State ---------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- 4. Lightbox ---------- */
function initLightbox() {
  const items = document.querySelectorAll('[data-lightbox]');
  const lightbox = document.querySelector('.lightbox');
  if (!items.length || !lightbox) return;

  const img = lightbox.querySelector('.lightbox-image');
  const btnClose = lightbox.querySelector('.lightbox-close');
  const btnPrev = lightbox.querySelector('.lightbox-nav--prev');
  const btnNext = lightbox.querySelector('.lightbox-nav--next');

  // Build gallery array — use data-src (lazy) or src (loaded)
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
    btnClose?.focus();
  };

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Click to open
  items.forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => open(i));
  });

  // Navigation
  btnPrev?.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
  btnNext?.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });

  // Close
  btnClose?.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Touch swipe
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

/* ---------- 5. Lazy Loading ---------- */
function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      img.removeAttribute('data-src');
      obs.unobserve(img);
    });
  }, { rootMargin: '200px' });

  images.forEach(img => observer.observe(img));
}

/* ---------- 6. Fade-In on Scroll (IntersectionObserver) ---------- */
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  // Check for prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}