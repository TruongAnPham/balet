/* ============================================================
   SCROLL-TEXT.JS — Scroll-Illuminated Text (per-word)
   Whisper of Motion — Lina Nguen
   ============================================================ */

(function () {
  'use strict';

  function initScrollText() {
    const illuminatedSections = document.querySelectorAll('[data-illuminate]');
    if (!illuminatedSections.length) return;

    // Mobile fallback: simple IntersectionObserver fade
    if (window.innerWidth < 768 || window.WOM?.isLowEnd) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);
            entry.target.querySelectorAll('.word').forEach((w) => {
              w.style.opacity = '1';
            });
          });
        },
        { threshold: 0.3 }
      );

      illuminatedSections.forEach((section) => obs.observe(section));
      return;
    }

    // Desktop: real-time scroll-linked illumination
    // Cache layout values
    const sections = [];

    function cacheLayout() {
      sections.length = 0;
      illuminatedSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const words = Array.from(section.querySelectorAll('.word'));
        const totalWords = words.length;

        sections.push({
          el: section,
          top: rect.top + window.scrollY,
          height: rect.height,
          words,
          totalWords,
          // Mark last 3 words as accent candidates
          accentStart: Math.max(0, totalWords - 3),
        });
      });
    }

    cacheLayout();

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(cacheLayout, 200);
    });

    // Register with master rAF loop
    window._updateTextIllumination = function (scrollY) {
      sections.forEach((s) => {
        const viewTop = scrollY;
        const viewBottom = scrollY + window.innerHeight;

        // Section visibility progress
        const sectionStart = s.top - window.innerHeight * 0.95;
        const sectionEnd = s.top + s.height * 0.15;
        const range = sectionEnd - sectionStart;

        if (range <= 0) return;

        const progress = Math.max(
          0,
          Math.min(1, (viewTop - sectionStart) / range)
        );

        // How many words to illuminate
        const wordsToShow = Math.floor(progress * s.totalWords);

        s.words.forEach((word, i) => {
          if (i < wordsToShow) {
            word.classList.add('illuminated');
            // Accent the last few words
            if (i >= s.accentStart && progress > 0.9) {
              word.classList.add('accent');
            }
          } else {
            word.classList.remove('illuminated');
            word.classList.remove('accent');
          }
        });
      });
    };
  }

  window.initScrollText = initScrollText;
})();
