/* ============================================================
   MARQUEE.JS — Marquee Strip
   Whisper of Motion — Lina Nguen
   ============================================================ */

(function () {
  'use strict';

  function initMarquee() {
    // Duplicate track content for seamless loop if needed
    document.querySelectorAll('.marquee__track').forEach((track) => {
      const children = track.children;
      if (children.length < 2) {
        const clone = children[0]?.cloneNode(true);
        if (clone) {
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        }
      }
    });
  }

  window.initMarquee = initMarquee;
})();
