/**
 * Body & Data — Accessible Tooltips & Citations (WCAG 1.4.13 Compliant)
 * Handles [data-note] (Footnotes) & [data-def] (Glossary terms).
 * Features: Viewport containment, hover persistence, Escape dismissal, touch support.
 */

(function () {
  'use strict';

  const HIDE_DELAY = 180;
  let tip = null;
  let hideTimer = null;
  let currentTrigger = null;

  function ensureTooltip() {
    if (tip) return tip;
    tip = document.createElement('div');
    tip.id = 'rp-floating-tooltip';
    tip.role = 'tooltip';
    tip.setAttribute('aria-hidden', 'true');
    Object.assign(tip.style, {
      position: 'fixed',
      zIndex: '9999',
      maxWidth: '340px',
      padding: '10px 14px',
      borderRadius: '6px',
      backgroundColor: '#17150F',
      color: '#F7F4ED',
      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      fontSize: '0.8125rem',
      lineHeight: '1.45',
      boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
      pointerEvents: 'auto',
      opacity: '0',
      visibility: 'hidden',
      transition: 'opacity 0.15s ease, transform 0.15s ease',
      transform: 'translateY(4px)'
    });

    tip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    tip.addEventListener('mouseleave', () => scheduleHide());
    document.body.appendChild(tip);
    return tip;
  }

  function getContent(el) {
    if (el.dataset.note) return `<strong>Citation:</strong> ${el.dataset.note}`;
    if (el.dataset.def) return `<strong>Definition:</strong> ${el.dataset.def}`;
    return '';
  }

  function isTrigger(el) {
    return el && el.nodeType === 1 && (el.hasAttribute('data-note') || el.hasAttribute('data-def'));
  }

  function show(el) {
    clearTimeout(hideTimer);
    const content = getContent(el);
    if (!content) return;

    currentTrigger = el;
    const tooltip = ensureTooltip();
    tooltip.innerHTML = content;
    tooltip.setAttribute('aria-hidden', 'false');
    el.setAttribute('aria-describedby', 'rp-floating-tooltip');

    const rect = el.getBoundingClientRect();
    const margin = 8;

    // Reset styles for measurement
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = '0';
    tooltip.style.display = 'block';

    const tipRect = tooltip.getBoundingClientRect();
    let left = rect.left + (rect.width / 2) - (tipRect.width / 2);
    let top = rect.top - tipRect.height - margin;

    // Viewport Boundary Containment
    if (top < margin) {
      top = rect.bottom + margin; // Flip below
    }
    if (left < margin) {
      left = margin;
    } else if (left + tipRect.width > window.innerWidth - margin) {
      left = window.innerWidth - tipRect.width - margin;
    }

    tooltip.style.left = `${Math.round(left)}px`;
    tooltip.style.top = `${Math.round(top)}px`;
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0)';
  }

  function hideNow() {
    clearTimeout(hideTimer);
    if (currentTrigger) {
      currentTrigger.removeAttribute('aria-describedby');
      currentTrigger = null;
    }
    if (tip) {
      tip.style.opacity = '0';
      tip.style.visibility = 'hidden';
      tip.style.transform = 'translateY(4px)';
      tip.setAttribute('aria-hidden', 'true');
    }
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideNow, HIDE_DELAY);
  }

  // Delegated Event Listeners
  document.addEventListener('mouseover', (e) => {
    const trigger = e.target.closest('[data-note], [data-def]');
    if (trigger) show(trigger);
  });

  document.addEventListener('mouseout', (e) => {
    const trigger = e.target.closest('[data-note], [data-def]');
    if (trigger) scheduleHide();
  });

  document.addEventListener('focusin', (e) => {
    const trigger = e.target.closest('[data-note], [data-def]');
    if (trigger) show(trigger);
  });

  document.addEventListener('focusout', (e) => {
    const trigger = e.target.closest('[data-note], [data-def]');
    if (trigger) hideNow();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideNow();
  });

  window.addEventListener('resize', hideNow, { passive: true });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-note], [data-def]');
    if (!trigger && tip && !tip.contains(e.target)) {
      hideNow();
    }
  });
})();
