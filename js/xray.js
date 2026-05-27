/* ============================================================
   XRAY.JS — X-Ray Reveal Touch Toggle
   Whisper of Motion — Lina Nguen
   ============================================================ */

(function () {
  'use strict';

  function initXray() {
    const containers = document.querySelectorAll('.xray-container');
    if (!containers.length) return;

    // Touch toggle (hover state is CSS-only)
    containers.forEach((el) => {
      el.addEventListener('click', () => {
        if (window.matchMedia('(hover: none)').matches) {
          el.classList.toggle('revealed');
        }
      });
    });
  }

  window.initXray = initXray;
})();
