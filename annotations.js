// Accessible footnote + glossary tooltips for the research portal.
//
// Progressive enhancement, on purpose:
//  · A footnote marker is a real <a href="#note-N"> that jumps to the endnote
//    in the Notes list. If this script never runs, the citation still works.
//  · A glossary term is a real <button> whose definition also lives in the
//    Glossary section of the page.
//  · The tooltip is decoration on top of that: shown on hover AND on keyboard
//    focus, described to assistive tech via aria-describedby while open,
//    dismissed with Escape (WCAG 1.4.13 Content on Hover or Focus), and
//    hoverable itself so links inside stay reachable.
//
// Markup contract:
//   <a href="#note-3" id="ref-3" data-note="…">3</a>
//   <button type="button" data-term="Interoperability" data-def="…">…</button>

const TIP_ID = 'om-annotation-tip';
const SHOW_DELAY = 110;
const HIDE_DELAY = 180;

export function initAnnotations(scope) {
  const doc = (scope && scope.ownerDocument) || document;
  if (doc.getElementById(TIP_ID)) return;

  const tip = doc.createElement('div');
  tip.id = TIP_ID;
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  tip.style.cssText = [
    'position:fixed', 'z-index:9000', 'max-width:min(380px,calc(100vw - 32px))',
    'background:#17150F', 'color:#F7F4ED', 'border-radius:10px',
    'padding:14px 16px', 'font:400 13.5px/1.55 Archivo,system-ui,sans-serif',
    'box-shadow:0 18px 44px -14px rgba(23,21,15,.65)', 'pointer-events:auto',
    'opacity:0', 'transition:opacity .12s ease'
  ].join(';');
  doc.body.appendChild(tip);

  let current = null;
  let showTimer = null;
  let hideTimer = null;

  const label = doc.createElement('p');
  label.style.cssText = 'margin:0 0 7px;font:500 9.5px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:#E9A8BE';
  const bodyEl = doc.createElement('p');
  bodyEl.style.cssText = 'margin:0;color:#EDE9DE';
  const hint = doc.createElement('p');
  hint.style.cssText = 'margin:10px 0 0;font:500 10.5px/1.4 ui-monospace,Menlo,monospace;color:#9C9585';
  tip.append(label, bodyEl, hint);

  function contentFor(el) {
    if (el.dataset.note !== undefined) {
      return {
        kind: 'Source note ' + (el.textContent || '').trim(),
        text: el.dataset.note,
        hint: 'Select to jump to the full note ↓'
      };
    }
    return {
      kind: el.dataset.term || 'Definition',
      text: el.dataset.def || '',
      hint: 'Esc to dismiss'
    };
  }

  function place(el) {
    const r = el.getBoundingClientRect();
    const t = tip.getBoundingClientRect();
    const gap = 10;
    let top = r.top - t.height - gap;
    if (top < 8) top = r.bottom + gap;
    let left = r.left + r.width / 2 - t.width / 2;
    left = Math.max(12, Math.min(left, doc.documentElement.clientWidth - t.width - 12));
    tip.style.top = Math.round(top) + 'px';
    tip.style.left = Math.round(left) + 'px';
  }

  function show(el) {
    clearTimeout(hideTimer);
    if (current === el) return;
    hideNow(true);
    const c = contentFor(el);
    if (!c.text) return;
    current = el;
    label.textContent = c.kind;
    bodyEl.textContent = c.text;
    hint.textContent = c.hint;
    tip.hidden = false;
    tip.style.opacity = '0';
    place(el);
    requestAnimationFrame(() => { tip.style.opacity = '1'; place(el); });
    el.setAttribute('aria-describedby', TIP_ID);
    if (el.tagName === 'BUTTON') el.setAttribute('aria-expanded', 'true');
  }

  function hideNow(silent) {
    clearTimeout(showTimer);
    if (!current) { if (!silent) tip.hidden = true; return; }
    current.removeAttribute('aria-describedby');
    if (current.tagName === 'BUTTON') current.setAttribute('aria-expanded', 'false');
    current = null;
    tip.style.opacity = '0';
    tip.hidden = true;
  }

  function queueHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => hideNow(), HIDE_DELAY);
  }

  const trigger = (t) => t && t.closest && t.closest('[data-note],[data-def]');

  doc.addEventListener('mouseover', (e) => {
    const el = trigger(e.target);
    if (!el) return;
    clearTimeout(showTimer);
    showTimer = setTimeout(() => show(el), SHOW_DELAY);
  });
  doc.addEventListener('mouseout', (e) => {
    if (trigger(e.target)) { clearTimeout(showTimer); queueHide(); }
  });
  tip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  tip.addEventListener('mouseleave', queueHide);

  doc.addEventListener('focusin', (e) => {
    const el = trigger(e.target);
    if (el) show(el); else if (!tip.contains(e.target)) hideNow();
  });
  doc.addEventListener('focusout', (e) => {
    if (trigger(e.target)) queueHide();
  });
  doc.addEventListener('click', (e) => {
    const el = trigger(e.target);
    if (!el) { hideNow(); return; }
    // Touch / click: toggle rather than requiring hover.
    if (current === el && el.tagName === 'BUTTON') { hideNow(); return; }
    show(el);
  });
  doc.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideNow(); });
  window.addEventListener('scroll', () => { if (current) place(current); }, {passive:true});
  window.addEventListener('resize', () => hideNow());
}
