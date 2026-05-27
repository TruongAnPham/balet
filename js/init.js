/* ============================================================
   INIT.JS — Boot Sequence & Single Source of Truth
   Whisper of Motion — Lina Nguen
   ============================================================ */

(function () {
  'use strict';

  // --- Remove no-js ---
  document.documentElement.classList.remove('no-js');

  // --- Force dark mode (permanent) ---
  document.documentElement.setAttribute('data-theme', 'dark');


  // --- Feature detection flags (global) ---
  window.WOM = window.WOM || {};

  WOM.prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  WOM.isLowEnd =
    navigator.hardwareConcurrency <= 2 ||
    navigator.connection?.effectiveType === '2g' ||
    navigator.connection?.saveData === true;

  WOM.isPointerFine =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  WOM.dpr = Math.min(window.devicePixelRatio || 1, 3);

  // --- Scroll restoration ---
  history.scrollRestoration = 'manual';

  // --- Should show loader? Single source of truth ---
  function shouldShowLoader() {
    const navType = performance.getEntriesByType('navigation')[0]?.type;
    const hasLoaded = sessionStorage.getItem('wom_loaded');
    if (!hasLoaded || navType === 'reload') {
      sessionStorage.setItem('wom_loaded', '1');
      return true;
    }
    return false;
  }

  // --- Boot after fonts ready ---
  document.fonts.ready.then(() => {
    document.documentElement.classList.add('fonts-loaded');

    if (WOM.prefersReducedMotion) {
      // Immediately reveal all content
      document.querySelectorAll('[data-animate]').forEach(el => {
        el.classList.add('animate-in');
      });
    }

    if (shouldShowLoader()) {
      // Show loading screen → then page entrance
      if (typeof window.initLoadingScreen === 'function') {
        window.initLoadingScreen();
      } else {
        // Fallback: just show content
        initPageEntrance();
      }
    } else {
      initPageEntrance();
    }
  });

  // --- Page entrance (skip loader) ---
  function initPageEntrance() {
    window.scrollTo(0, 0);

    const loader = document.querySelector('.loading-screen');
    if (loader) {
      loader.style.display = 'none';
    }

    // Wait for next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Trigger hero animations
      document.querySelectorAll('.animate-fade-rise, .animate-fade-rise--delay-1, .animate-fade-rise--delay-2, .animate-fade-rise--delay-3').forEach(el => {
        el.style.animationPlayState = 'running';
      });

      // Initialize all modules safely with try-catch
      const modules = [
        'initAnimations', 'initMediaLoader', 'initCursor',
        'initMarquee', 'initTilt', 'initScrollText',
        'initXray', 'initLightbox', 'initGSAP'
      ];
      
      modules.forEach(name => {
        try {
          if (typeof window[name] === 'function') window[name]();
        } catch (err) {
          console.warn(`[WOM] ${name} failed:`, err);
        }
      });
    });
  }

  window.initPageEntrance = initPageEntrance;



  // --- Navbar scroll state ---
  let navScrolled = false;
  window.addEventListener(
    'scroll',
    () => {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;
      const shouldScroll = window.scrollY > 60;
      if (shouldScroll !== navScrolled) {
        navScrolled = shouldScroll;
        navbar.classList.toggle('scrolled', shouldScroll);
      }
    },
    { passive: true }
  );

  // --- Scroll indicator hide ---
  let scrollIndicatorHidden = false;
  window.addEventListener(
    'scroll',
    () => {
      if (scrollIndicatorHidden) return;
      const indicator = document.querySelector('.scroll-indicator');
      if (indicator && window.scrollY > 50) {
        indicator.classList.add('hidden');
        scrollIndicatorHidden = true;
      }
    },
    { passive: true }
  );

  // --- Active nav link ---
  function setActiveNav() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link, .pill-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const isActive =
        path.endsWith(href) ||
        (href === 'index.html' && (path === '/' || path.endsWith('/')));
      link.classList.toggle('active', isActive);
    });
  }
  setActiveNav();

  // --- Low-end device class ---
  if (WOM.isLowEnd) {
    document.documentElement.classList.add('low-end');
  }
})();
