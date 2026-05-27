/* ============================================================
   CURSOR.JS — Custom Cursor, Magnetic, Image Preview
   Whisper of Motion — Lina Nguen
   ============================================================ */

(function () {
  'use strict';

  function initCursor() {
    // Only on pointer:fine devices
    if (!window.WOM?.isPointerFine) return;
    if (window.WOM?.isLowEnd) return;

    // --- CUSTOM CURSOR ---
    const cursorEl = document.querySelector('.custom-cursor');
    const cursorDot = cursorEl?.querySelector('.cursor-dot');
    if (!cursorEl || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const lerpFactor = 0.12;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursor() {
      cursorX += (mouseX - cursorX) * lerpFactor;
      cursorY += (mouseY - cursorY) * lerpFactor;
      cursorEl.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Cursor states
    const interactiveSelectors =
      'a, button, .cta-btn, .theme-toggle, .pill-link, .nav-link, [data-bloom], [role="button"]';
    const imageSelectors = '.lookbook-item, .xray-container, .media-container img, .card__image';
    const textLinkSelectors = '.footer-link';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(imageSelectors)) {
        cursorDot.className = 'cursor-dot hover-image';
      } else if (e.target.closest(textLinkSelectors)) {
        cursorDot.className = 'cursor-dot hover-text';
      } else if (e.target.closest(interactiveSelectors)) {
        cursorDot.className = 'cursor-dot hover-interactive';
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (
        e.target.closest(interactiveSelectors) ||
        e.target.closest(imageSelectors) ||
        e.target.closest(textLinkSelectors)
      ) {
        cursorDot.className = 'cursor-dot';
      }
    });

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.style.cursor = 'none';
    });

    // --- MAGNETIC BUTTONS ---
    const magneticEls = document.querySelectorAll('[data-magnetic]');
    const magneticRadius = 80;
    const magneticStrength = 0.3;
    const maxDisplacement = 12;

    magneticEls.forEach((el) => {
      let elRect = el.getBoundingClientRect();
      let isNear = false;

      // Cache rect
      const updateRect = () => {
        elRect = el.getBoundingClientRect();
      };

      // Debounced resize
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateRect, 200);
      });

      document.addEventListener('mousemove', (e) => {
        updateRect();
        const cx = elRect.left + elRect.width / 2;
        const cy = elRect.top + elRect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < magneticRadius) {
          isNear = true;
          const moveX = Math.min(Math.max(dx * magneticStrength, -maxDisplacement), maxDisplacement);
          const moveY = Math.min(Math.max(dy * magneticStrength, -maxDisplacement), maxDisplacement);
          el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else if (isNear) {
          isNear = false;
          el.style.transition = 'transform 600ms cubic-bezier(0.2, 0, 0, 1)';
          el.style.transform = 'translate(0, 0)';
          setTimeout(() => {
            el.style.transition = '';
          }, 600);
        }
      });
    });
  }

  window.initCursor = initCursor;
})();
