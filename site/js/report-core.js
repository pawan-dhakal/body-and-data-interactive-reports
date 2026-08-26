/**
 * Body & Data — Core Report Engine
 * Dual-Depth Reading Manager · Dynamic Font Scaling (A-/A+) · Scroll Progress & TOC Drawer
 */

(function () {
  'use strict';

  // 1. Zero-Dependency Reactive Store
  class TinyStore {
    constructor(initialState = {}) {
      this.state = initialState;
      this.listeners = {};
    }

    get(key) {
      return this.state[key];
    }

    set(key, val) {
      if (this.state[key] === val) return;
      this.state[key] = val;
      if (this.listeners[key]) {
        this.listeners[key].forEach((fn) => fn(val));
      }
    }

    subscribe(key, fn) {
      if (!this.listeners[key]) this.listeners[key] = [];
      this.listeners[key].push(fn);
      fn(this.state[key]); // Trigger immediately
    }
  }

  // 2. Reading Depth Manager (Full Text ↔ Plain Summary)
  function initReadingDepth(store) {
    const urlParams = new URLSearchParams(window.location.search);
    const depthParam = urlParams.get('depth');
    const hash = window.location.hash;
    const initialDepth = depthParam || (hash === '#glance' ? 'summary' : null) || localStorage.getItem('bd_reading_depth') || 'full';
    
    store.set('readingDepth', initialDepth);

    const toggleBtn = document.getElementById('btn-depth-toggle');
    const depthLabel = toggleBtn ? toggleBtn.querySelector('.depth-label-text') : null;

    function applyDepth(depth) {
      document.body.dataset.readingDepth = depth;
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-pressed', depth === 'full' ? 'true' : 'false');
      }
      if (depthLabel) {
        depthLabel.textContent = depth === 'full' ? 'Full Text' : 'Plain Summary';
      }
      try {
        localStorage.setItem('bd_reading_depth', depth);
      } catch (e) {}
    }

    store.subscribe('readingDepth', applyDepth);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const current = store.get('readingDepth');
        const next = current === 'full' ? 'summary' : 'full';
        store.set('readingDepth', next);
      });
    }
  }

  // 3. Reader Text Zoom Manager (A− / A+) — Modifies Root HTML Font Size
  function initTextZoom(store) {
    let savedScale = 1.0;
    try {
      savedScale = parseFloat(localStorage.getItem('bd_font_scale')) || 1.0;
    } catch (e) {}
    store.set('fontScale', savedScale);

    const btnIn = document.getElementById('btn-zoom-in');
    const btnOut = document.getElementById('btn-zoom-out');

    function applyScale(scale) {
      // 16px is base. Scale modifies the root font size, scaling all rem units instantly
      const basePx = 16;
      const newPx = Math.round(basePx * scale * 10) / 10;
      document.documentElement.style.fontSize = `${newPx}px`;
      document.documentElement.style.setProperty('--font-scale', scale.toString());
      try {
        localStorage.setItem('bd_font_scale', scale.toString());
      } catch (e) {}
    }

    store.subscribe('fontScale', applyScale);

    if (btnIn) {
      btnIn.addEventListener('click', (e) => {
        e.preventDefault();
        const current = store.get('fontScale') || 1.0;
        if (current < 1.45) {
          const next = Math.round((current + 0.1) * 10) / 10;
          store.set('fontScale', next);
        }
      });
    }

    if (btnOut) {
      btnOut.addEventListener('click', (e) => {
        e.preventDefault();
        const current = store.get('fontScale') || 1.0;
        if (current > 0.75) {
          const next = Math.round((current - 0.1) * 10) / 10;
          store.set('fontScale', next);
        }
      });
    }
  }

  // 4. Scroll Progress & ScrollSpy Observer
  function initScrollProgress(store) {
    const progressBar = document.getElementById('reading-progress-bar');
    const sections = Array.from(document.querySelectorAll('section[id], article[id], [data-spy]'));
    const tocLinks = Array.from(document.querySelectorAll('.toc-link'));

    function updateProgress() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      // Check if user is at the bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 30) {
        const lastSec = sections[sections.length - 1];
        if (lastSec) store.set('activeSectionId', lastSec.id);
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    store.subscribe('readingDepth', () => {
      requestAnimationFrame(updateProgress);
    });

    if ('IntersectionObserver' in window && sections.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              store.set('activeSectionId', entry.target.id);
            }
          });
        },
        { rootMargin: '-20% 0px -60% 0px' }
      );

      sections.forEach((sec) => observer.observe(sec));
    }

    store.subscribe('activeSectionId', (id) => {
      if (!id) return;
      tocLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const isActive = href === `#${id}`;
        link.classList.toggle('active', isActive);
      });
    });
  }

  // 5. Accessible Table of Contents Drawer with Focus Trapping
  function initTocDrawer(store) {
    const toggleBtn = document.getElementById('btn-toc-toggle');
    const closeBtn = document.getElementById('btn-toc-close');
    const drawer = document.getElementById('toc-drawer');
    const backdrop = document.getElementById('toc-backdrop');
    const tocLinks = Array.from(drawer ? drawer.querySelectorAll('.toc-link, button, a') : []);

    if (!drawer) return;

    function getFocusableElements() {
      return Array.from(drawer.querySelectorAll('button:not([disabled]), a[href]:not([disabled]), [tabindex="0"]'));
    }

    function openDrawer() {
      drawer.classList.add('open');
      backdrop?.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      toggleBtn?.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      store.set('isTocOpen', true);
      setTimeout(() => closeBtn?.focus(), 50);
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      backdrop?.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      toggleBtn?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      store.set('isTocOpen', false);
      toggleBtn?.focus();
    }

    // Modal Focus Trapping Listener
    drawer.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    toggleBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
    closeBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
    backdrop?.addEventListener('click', closeDrawer);

    tocLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && store.get('isTocOpen')) {
        closeDrawer();
      }
    });

    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
  }

  // Self Initialization
  function init() {
    const store = new TinyStore({
      readingDepth: 'full',
      fontScale: 1.0,
      activeSectionId: '',
      isTocOpen: false
    });

    initReadingDepth(store);
    initTextZoom(store);
    initScrollProgress(store);
    initTocDrawer(store);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
