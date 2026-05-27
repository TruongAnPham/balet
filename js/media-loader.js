/* ============================================================
   MEDIA-LOADER.JS — Lazy Loading, LQIP, Video Activation
   Whisper of Motion — Lina Nguen
   ============================================================ */

(function () {
  'use strict';

  function initMediaLoader() {
    const dpr = window.WOM?.dpr || 1;

    // --- LQIP blur-up reveal ---
    const lqipObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          lqipObserver.unobserve(entry.target);

          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.style.filter = '';
          });
        });
      },
      { rootMargin: '200px' }
    );

    document.querySelectorAll('img[data-src]').forEach((img) => {
      lqipObserver.observe(img);
    });

    // --- Video activation ---
    activateVideos();

    // --- Error detection ---
    document.querySelectorAll('.media-container img').forEach((img) => {
      img.addEventListener('error', () => {
        img.closest('.media-container')?.classList.add('media-failed');
      });

      img.addEventListener('load', () => {
        if (img.naturalWidth <= 1) {
          img.closest('.media-container')?.classList.add('media-failed');
        }
      });
    });

    // --- Low bandwidth: skip video autoplay ---
    if (window.WOM?.isLowEnd) {
      document.querySelectorAll('video').forEach((video) => {
        video.removeAttribute('autoplay');
        video.pause();
      });
    }
  }

  // --- Activate videos ---
  function activateVideos() {
    document.querySelectorAll('video source[data-src]').forEach((source) => {
      if (source.dataset.src) {
        source.src = source.dataset.src;
        source.parentElement.load();
      }
    });
  }

  window.initMediaLoader = initMediaLoader;
  window.activateVideos = activateVideos;
})();
