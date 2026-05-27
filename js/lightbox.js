/* ============================================================
   LIGHTBOX.JS — Custom Lightbox (No Library)
   Whisper of Motion — Lina Nguen
   ============================================================ */

(function () {
  'use strict';

  function initLightbox() {
    const overlay = document.querySelector('.lightbox-overlay');
    if (!overlay) return;

    const lightboxImg = overlay.querySelector('.lightbox-image');
    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-nav--prev');
    const nextBtn = overlay.querySelector('.lightbox-nav--next');

    let images = [];
    let currentIndex = 0;
    let triggerElement = null;

    // Collect lightbox-able images
    function collectImages() {
      images = Array.from(document.querySelectorAll('[data-lightbox]'));
    }
    collectImages();

    // --- iOS-safe scroll lock ---
    function lockScroll() {
      const y = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${y}px`;
      document.body.style.width = '100%';
      document.body.dataset.scrollY = y;
    }

    function unlockScroll() {
      const y = parseInt(document.body.dataset.scrollY || '0');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, y);
    }

    // --- Focus trap ---
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let focusableEls = [];
    let firstFocusable, lastFocusable;

    function setupFocusTrap() {
      focusableEls = Array.from(overlay.querySelectorAll(focusableSelector));
      firstFocusable = focusableEls[0];
      lastFocusable = focusableEls[focusableEls.length - 1];
    }

    function trapFocus(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    // --- Open ---
    function openLightbox(index) {
      if (index < 0 || index >= images.length) return;
      currentIndex = index;
      triggerElement = images[index];

      const src =
        images[index].getAttribute('data-lightbox') ||
        images[index].src;
      lightboxImg.src = src;
      lightboxImg.alt = images[index].alt || '';

      overlay.classList.add('active');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Image lightbox');

      lockScroll();
      setupFocusTrap();
      closeBtn?.focus();
      document.addEventListener('keydown', handleKeyboard);
      document.addEventListener('keydown', trapFocus);
    }

    // --- Close ---
    function closeLightbox() {
      overlay.classList.remove('active');
      unlockScroll();
      document.removeEventListener('keydown', handleKeyboard);
      document.removeEventListener('keydown', trapFocus);

      if (triggerElement) {
        triggerElement.focus();
        triggerElement = null;
      }
    }

    // --- Navigate ---
    function showImage(index) {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentIndex = index;

      const src =
        images[index].getAttribute('data-lightbox') ||
        images[index].src;
      lightboxImg.src = src;
      lightboxImg.alt = images[index].alt || '';
    }

    function nextImage() {
      showImage(currentIndex + 1);
    }

    function prevImage() {
      showImage(currentIndex - 1);
    }

    // --- Keyboard ---
    function handleKeyboard(e) {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
      }
    }

    // --- Touch swipe ---
    let touchStartX = 0;
    let touchEndX = 0;

    overlay.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    overlay.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) nextImage();
          else prevImage();
        }
      },
      { passive: true }
    );

    // --- Event listeners ---
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-lightbox]');
      if (target) {
        e.preventDefault();
        collectImages();
        const index = images.indexOf(target);
        openLightbox(index >= 0 ? index : 0);
      }
    });

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', prevImage);
    nextBtn?.addEventListener('click', nextImage);

    // Outside click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });
  }

  window.initLightbox = initLightbox;
})();
