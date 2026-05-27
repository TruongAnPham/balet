/* ============================================================
   TRANSITIONS.JS — Loading Screen & Page Transitions
   Whisper of Motion — Lina Nguen
   ============================================================ */

(function () {
  'use strict';

  let isTransitioning = false;

  // --- CHARACTER-BY-CHARACTER REVEAL ---
  function revealCharacters(container, charDelay, charDuration, callback) {
    const chars = container.querySelectorAll('.char');
    const easing = 'cubic-bezier(0.2, 0.0, 0.0, 1.0)';

    chars.forEach((char, i) => {
      setTimeout(() => {
        char.style.transition = `opacity ${charDuration}ms ${easing}, transform ${charDuration}ms ${easing}`;
        char.style.opacity = '1';
        char.style.transform = 'translateY(0)';
      }, i * charDelay);
    });

    const totalTime = chars.length * charDelay + charDuration;
    if (callback) setTimeout(callback, totalTime);

    return totalTime;
  }

  // --- PREPARE TEXT FOR CHAR-BY-CHAR REVEAL ---
  function splitIntoChars(el) {
    const text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);

    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.classList.add('char');
      span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
      span.setAttribute('aria-hidden', 'true');
      el.appendChild(span);
    }
  }

  // --- SHATTER DISSOLVE EXIT ---
  function shatterExit(container, callback) {
    const isMobile = window.innerWidth < 768;
    const fragmentCount = isMobile ? 4 : 16;
    const containerRect = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Generate clip-path polygons
    const fragments = [];

    if (isMobile) {
      // 4 rectangular panels sliding down
      for (let i = 0; i < 4; i++) {
        const frag = document.createElement('div');
        frag.classList.add('shatter-fragment');
        const top = (i / 4) * 100;
        const bottom = ((i + 1) / 4) * 100;
        Object.assign(frag.style, {
          position: 'fixed',
          top: top + '%',
          left: '0',
          width: '100%',
          height: 25 + '%',
          background: getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim() || '#FFFFFF',
          zIndex: '1001',
        });
        document.body.appendChild(frag);
        fragments.push(frag);
      }

      fragments.forEach((frag, i) => {
        const delay = 20 + Math.random() * 40;
        setTimeout(() => {
          frag.style.transition = `transform 850ms ${getComputedStyle(document.documentElement).getPropertyValue('--ease-cinematic').trim() || 'cubic-bezier(0.2, 0, 0, 1)'}, opacity 850ms ease`;
          frag.style.transform = `translateY(${100 + i * 20}%)`;
          frag.style.opacity = '0';
        }, i * delay);
      });
    } else {
      // Desktop: irregular polygon fragments
      const cols = 4;
      const rows = 4;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const frag = document.createElement('div');
          frag.classList.add('shatter-fragment');

          const x1 = (c / cols) * 100;
          const y1 = (r / rows) * 100;
          const x2 = ((c + 1) / cols) * 100;
          const y2 = ((r + 1) / rows) * 100;

          // Add slight randomness to polygon points
          const jx = 2;
          const jy = 2;
          const p1 = `${x1 + Math.random() * jx}% ${y1 + Math.random() * jy}%`;
          const p2 = `${x2 - Math.random() * jx}% ${y1 + Math.random() * jy}%`;
          const p3 = `${x2 - Math.random() * jx}% ${y2 - Math.random() * jy}%`;
          const p4 = `${x1 + Math.random() * jx}% ${y2 - Math.random() * jy}%`;

          Object.assign(frag.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            clipPath: `polygon(${p1}, ${p2}, ${p3}, ${p4})`,
            background: getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim() || '#FFFFFF',
            zIndex: '1001',
          });
          document.body.appendChild(frag);
          fragments.push(frag);
        }
      }

      fragments.forEach((frag, i) => {
        const delay = 20 + Math.random() * 40;
        const rotX = (Math.random() - 0.5) * 8;
        const rotZ = (Math.random() - 0.5) * 6;
        const ty = 30 + Math.random() * 60;

        setTimeout(() => {
          frag.style.transition = `transform 900ms cubic-bezier(0.2, 0, 0, 1), opacity 900ms ease`;
          frag.style.transform = `translateY(${ty}%) rotate(${rotZ}deg) rotateX(${rotX}deg)`;
          frag.style.opacity = '0';
        }, i * (delay * 0.8));
      });
    }

    const totalDuration = isMobile ? 900 : 950;
    setTimeout(() => {
      fragments.forEach((f) => f.remove());
      if (callback) callback();
    }, totalDuration + 200);
  }

  // --- LOADING SCREEN (Flip-Line Reveal) ---
  function initLoadingScreen() {
    const screen = document.querySelector('.loading-screen');
    if (!screen) {
      window.initPageEntrance();
      return;
    }

    // Handle reduced motion
    if (window.WOM?.prefersReducedMotion) {
      screen.style.transition = 'opacity 300ms ease';
      screen.style.opacity = '0';
      setTimeout(() => {
        screen.style.display = 'none';
        window.initPageEntrance();
      }, 300);
      return;
    }

    const lines = screen.querySelectorAll('.loader-line');
    const glow = screen.querySelector('.loader-glow');
    if (!lines.length) {
      window.initPageEntrance();
      return;
    }

    const lineDelay = 1000;
    const flipDuration = 500;

    function showLine(index) {
      if (index >= lines.length) {
        finishLoading();
        return;
      }

      const line = lines[index];

      // Flip in from below
      line.style.transition = 'opacity ' + flipDuration + 'ms cubic-bezier(0.2, 0, 0, 1), transform ' + flipDuration + 'ms cubic-bezier(0.2, 0, 0, 1)';
      line.style.opacity = '1';
      line.style.transform = 'translateY(0) rotateX(0deg)';

      if (index === lines.length - 1) {
        // Last line: stay visible, activate glow, then exit
        if (glow) {
          setTimeout(function() { glow.classList.add('active'); }, 400);
        }
        setTimeout(function() { finishLoading(); }, lineDelay + 200);
        return;
      }

      // After visible duration, flip current line up/away
      setTimeout(function() {
        line.style.transition = 'opacity ' + flipDuration + 'ms cubic-bezier(0.4, 0, 1, 1), transform ' + flipDuration + 'ms cubic-bezier(0.4, 0, 1, 1)';
        line.style.opacity = '0';
        line.style.transform = 'translateY(-30px) rotateX(45deg)';

        // Show next line after a small overlap
        setTimeout(function() { showLine(index + 1); }, flipDuration * 0.4);
      }, lineDelay);
    }

    function finishLoading() {
      // Curtain pull up effect
      screen.style.transition = 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)';
      screen.style.transform = 'translateY(-100%)';

      setTimeout(function() {
        screen.style.display = 'none';
        screen.style.transform = '';
        window.initPageEntrance();
      }, 750);
    }

    // Start sequence after a brief pause
    setTimeout(function() { showLine(0); }, 200);
  }

  window.initLoadingScreen = initLoadingScreen;

  // --- FORWARD PAGE TRANSITION ---
  function navigateWithTransition(href, originX, originY) {
    if (isTransitioning) return;
    isTransitioning = true;
    document.body.classList.add('is-transitioning');

    const circle = document.createElement('div');
    circle.classList.add('page-transition-circle');

    // Calculate radius to cover full viewport
    const maxDist = Math.sqrt(
      Math.max(originX, window.innerWidth - originX) ** 2 +
        Math.max(originY, window.innerHeight - originY) ** 2
    );

    const size = maxDist * 2;
    Object.assign(circle.style, {
      left: originX - maxDist + 'px',
      top: originY - maxDist + 'px',
      width: size + 'px',
      height: size + 'px',
      transform: 'scale(0)',
    });

    document.body.appendChild(circle);

    requestAnimationFrame(() => {
      circle.style.transition = `transform 560ms cubic-bezier(0.2, 0, 0, 1)`;
      circle.style.transform = 'scale(1)';
    });

    setTimeout(() => {
      window.location.href = href;
    }, 520);
  }

  // --- Intercept internal links ---
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;

    // Skip external, hash, mailto, tel links
    if (
      href.startsWith('http') ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    )
      return;

    // Skip if modified click
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    // Skip reduced motion
    if (window.WOM?.prefersReducedMotion) return;

    e.preventDefault();

    // Vibrate on touch
    if (navigator.vibrate) navigator.vibrate(8);

    const rect = link.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    navigateWithTransition(href, x, y);
  });

  // --- BACK NAVIGATION ---
  let savedScrollPosition = 0;
  window.addEventListener('beforeunload', () => {
    savedScrollPosition = window.scrollY;
  });

  window.addEventListener('popstate', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    playBackTransition(() => {
      isTransitioning = false;
    });
  });

  function playBackTransition(callback) {
    const content = document.querySelector('.page-container');
    if (!content || window.WOM?.prefersReducedMotion) {
      if (callback) callback();
      return;
    }

    content.style.transition = 'opacity 350ms ease-out, transform 350ms ease-out';
    content.style.opacity = '0';
    content.style.transform = 'translateY(20px)';

    setTimeout(() => {
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
      setTimeout(() => {
        window.scrollTo(0, savedScrollPosition);
        if (callback) callback();
      }, 350);
    }, 50);
  }

  // --- BLOOM EFFECT ---
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-bloom]');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const bloom = document.createElement('div');
    bloom.classList.add('bloom');
    bloom.style.left = x + 'px';
    bloom.style.top = y + 'px';
    bloom.style.animation = 'bloom-expand 280ms ease-out forwards';
    document.body.appendChild(bloom);

    // Haptic
    if (navigator.vibrate) navigator.vibrate(8);

    setTimeout(() => bloom.remove(), 300);
  });
})();
