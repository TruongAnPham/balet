/* ============================================================
   GSAP-INIT.JS — GSAP + ScrollTrigger Setup
   Whisper of Motion — Lina Nguen
   ============================================================ */

(function () {
  'use strict';

  function initGSAP() {
    // Check GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Reduced motion guard ---
    if (window.WOM?.prefersReducedMotion) {
      gsap.globalTimeline.timeScale(0);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      return;
    }

    // --- Hero wave parallax ---
    const heroWave = document.querySelector('.hero-wave');
    if (heroWave) {
      gsap.to(heroWave, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // --- Clip-path heading line reveal ---
    document.querySelectorAll('.section-heading').forEach((heading) => {
      const lines = heading.querySelectorAll('.heading-line');
      if (!lines.length) return;

      gsap.from(lines, {
        yPercent: 100,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
        },
      });
    });

    // --- Pinned timeline (Process page only) ---
    const timelineSection = document.querySelector('.timeline-section');
    const timelinePanels = document.querySelector('.timeline-panels');

    if (timelineSection && timelinePanels && window.innerWidth >= 768) {
      gsap.to(timelinePanels, {
        x: () =>
          -(timelinePanels.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: timelineSection,
          pin: true,
          scrub: 1,
          end: () => '+=' + timelinePanels.scrollWidth,
          invalidateOnRefresh: true,
        },
      });
    }

    // --- Collection hero image reveal ---
    const collectionHeroImg = document.querySelector(
      '.collection-hero-image'
    );
    if (collectionHeroImg) {
      gsap.from(collectionHeroImg, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: collectionHeroImg,
          start: 'top 90%',
        },
      });
    }
  }

  window.initGSAP = initGSAP;
})();
