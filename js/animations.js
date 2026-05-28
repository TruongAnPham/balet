/* ============================================================
   ANIMATIONS.JS — Master rAF Loop & IntersectionObserver
   Whisper of Motion — Lina Nguen
   ============================================================ */

(function () {
  'use strict';

  // --- IntersectionObserver for [data-animate] ---
  function setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          // Directly add animate-in — no queue, no transitionend dependency
          requestAnimationFrame(() => {
            entry.target.classList.add('animate-in');
          });
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      // Skip elements that are part of GSAP-owned reveals
      if (el.closest('[data-gsap-reveal]')) return;
      observer.observe(el);
    });
  }

  // --- Background color shift on scroll ---
  // White → rgba(207,166,168,0.06) → white → #F5F3F2
  function updateBackgroundColor(y) {
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const progress = y / docHeight;
    let r, g, b;

    if (progress < 0.33) {
      // White → very faint dusty pink
      const t = progress / 0.33;
      r = 255 - t * 48 * 0.06;
      g = 255 - t * 89 * 0.06;
      b = 255 - t * 87 * 0.06;
    } else if (progress < 0.66) {
      // Faint pink → back toward white
      const t = (progress - 0.33) / 0.33;
      r = 255 - (1 - t) * 48 * 0.06;
      g = 255 - (1 - t) * 89 * 0.06;
      b = 255 - (1 - t) * 87 * 0.06;
    } else {
      // White → warm white (#F5F3F2)
      const t = (progress - 0.66) / 0.34;
      r = 255 - t * 10;
      g = 255 - t * 12;
      b = 255 - t * 13;
    }

    // Only apply in light mode
    if (document.documentElement.getAttribute('data-theme') !== 'dark') {
      document.body.style.backgroundColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
  }

  // --- Scroll progress indicator ---
  function updateScrollProgress(y) {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = (y / docHeight) * 100;
    bar.style.width = pct + '%';
  }

  // --- Master rAF loop ---
  let rafId = null;
  let lastScrollY = -1;

  function masterScrollLoop() {
    const y = window.scrollY;
    if (y !== lastScrollY) {
      updateBackgroundColor(y);
      updateScrollProgress(y);

      // Text illumination is handled by scroll-text.js
      // which registers its own callback
      if (typeof window._updateTextIllumination === 'function') {
        window._updateTextIllumination(y);
      }

      lastScrollY = y;
    }
    rafId = requestAnimationFrame(masterScrollLoop);
  }

  // --- Visibility change handler ---
  function handleVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      lastScrollY = -1;
      masterScrollLoop();
    }
  }

  // --- Init ---
  function initAnimations() {
    if (window.WOM?.prefersReducedMotion || window.WOM?.isLowEnd) {
      // Show everything immediately, skip rAF
      document.querySelectorAll('[data-animate]').forEach((el) => {
        el.classList.add('animate-in');
      });
      // Still show scroll progress
      const bar = document.querySelector('.scroll-progress');
      if (bar) {
        window.addEventListener(
          'scroll',
          () => {
            updateScrollProgress(window.scrollY);
          },
          { passive: true }
        );
      }
      return;
    }

    setupObserver();
    masterScrollLoop();
    document.addEventListener('visibilitychange', handleVisibility);
  }

  window.initAnimations = initAnimations;
})();
