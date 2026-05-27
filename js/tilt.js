/* ============================================================
   TILT.JS — 3D Tilt Effect on Cards/Images
   Whisper of Motion — Lina Nguen
   ============================================================ */

(function () {
  'use strict';

  function initTilt() {
    if (!window.WOM?.isPointerFine) return;
    if (window.WOM?.isLowEnd) return;
    if (window.WOM?.prefersReducedMotion) return;

    const tiltEls = document.querySelectorAll('[data-tilt]');
    const maxAngle = 8;

    tiltEls.forEach((el) => {
      el.style.perspective = '1000px';
      el.style.transformStyle = 'preserve-3d';

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotateX = (y - 0.5) * -maxAngle * 2;
        const rotateY = (x - 0.5) * maxAngle * 2;

        el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transition =
          'transform 600ms cubic-bezier(0.2, 0, 0, 1)';
        el.style.transform = 'rotateX(0) rotateY(0) scale(1)';

        setTimeout(() => {
          el.style.transition = '';
        }, 600);
      });
    });
  }

  window.initTilt = initTilt;
})();
