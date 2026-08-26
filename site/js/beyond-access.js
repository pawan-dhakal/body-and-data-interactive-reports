/**
 * Body & Data — Beyond Access Interactive Script
 * Audre Lorde Erotic Reframing Lens · Qualitative Voices Filter · Recs Tabs
 */

(function () {
  'use strict';

  // 1. Audre Lorde Erotic Reframing Matrix Toggle
  function initEroticLensToggle() {
    const toggleBtn = document.getElementById('btn-toggle-erotic-lens');
    const activityCards = Array.from(document.querySelectorAll('.activity-card'));

    let isEroticLens = false;

    toggleBtn?.addEventListener('click', () => {
      isEroticLens = !isEroticLens;
      toggleBtn.classList.toggle('active', isEroticLens);
      toggleBtn.setAttribute('aria-pressed', isEroticLens ? 'true' : 'false');

      activityCards.forEach((card) => {
        const isErotic = card.dataset.erotic === 'true';
        card.classList.toggle('erotic-highlight', isEroticLens && isErotic);
      });
    });
  }

  // 2. Qualitative Voices Filter by Theme
  function initVoicesThemeFilter() {
    const filterBtns = Array.from(document.querySelectorAll('[data-beyond-voice-filter]'));
    const quoteCards = Array.from(document.querySelectorAll('.quote-card'));

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.beyondVoiceFilter;

        filterBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        quoteCards.forEach((card) => {
          const theme = card.dataset.theme;
          const show = filter === 'all' || theme === filter;
          card.style.display = show ? 'block' : 'none';
        });
      });
    });
  }

  // 3. Tabbed Recommendations Switcher (5 Sectors)
  function initBeyondRecsTabs() {
    const tabBtns = Array.from(document.querySelectorAll('[data-beyond-rec-tab]'));
    const recGrids = Array.from(document.querySelectorAll('[data-beyond-rec-content]'));

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.beyondRecTab;

        tabBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        recGrids.forEach((grid) => {
          const show = grid.dataset.beyondRecContent === target;
          grid.style.display = show ? 'grid' : 'none';
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initEroticLensToggle();
    initVoicesThemeFilter();
    initBeyondRecsTabs();
  });
})();
