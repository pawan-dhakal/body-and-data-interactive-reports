/**
 * Body & Data — Mapping Laws Interactive Script
 * 2D Policy Matrix · Undefined Terms Highlighter · Law & Case Explorer
 */

(function () {
  'use strict';

  // 1. 2D Policy Matrix Provision Database
  const matrixData = {
    'eta_foe': {
      title: 'Electronic Transaction Act 2063 — Section 47',
      stance: 'Creates Risk',
      stanceClass: 'badge-accent',
      statute: 'Prohibits publishing materials on electronic media contrary to public morality, decent behavior, or likely to spread hate or jeopardize harmonious relations among castes, communities, and religions. Penalty: Fine up to Rs 100,000 and/or imprisonment up to 5 years.',
      analysis: 'Vague terms like "public morality" (sarwajanik sadachar) and "decency" (shischtata) are undefined. Police routinely misapply this financial e-commerce statute to arrest journalists, satirists, and LGBTQI+ activists for online speech.'
    },
    'penal_foe': {
      title: 'National Penal Code 2074 — Section 305',
      stance: 'Double-Edged',
      stanceClass: 'badge',
      statute: 'Criminalizes defamation through print, speech, or electronic media. Penalty: Imprisonment up to 2 years and/or fine up to Rs 20,000.',
      analysis: 'Offers a legal avenue against online character assassination, but disproportionate criminal penalties risk chilling legitimate journalistic investigation and public interest reporting.'
    },
    'privacy_foe': {
      title: 'Individual Privacy Act 2075 — Section 12',
      stance: 'Protects',
      stanceClass: 'badge-teal',
      statute: 'Guarantees the right to publish and access public records and verified information in good faith.',
      analysis: 'Shields civic watchdogs and digital rights advocates who expose public corruption or systemic institutional abuse.'
    },
    'dv_foe': {
      title: 'Domestic Violence Act 2066 — Section 4',
      stance: 'Protects',
      stanceClass: 'badge-teal',
      statute: 'Explicitly defines emotional, psychological, and verbal harassment as forms of domestic violence actionable under law.',
      analysis: 'Recognizes non-physical harassment conducted via text messages, social media, and digital calls between intimate partners.'
    },
    'children_foe': {
      title: 'Children\'s Act 2075 — Section 66',
      stance: 'Double-Edged',
      stanceClass: 'badge',
      statute: 'Bans the use of electronic media to exploit, sexually abuse, or broadcast harmful content to minors.',
      analysis: 'Protects children from online predators, but paternalistic interpretations have occasionally restricted adolescent access to necessary sexual and reproductive health education.'
    },
    'itbill_foe': {
      title: 'Information Tech Bill 2075 — Section 86 & 88',
      stance: 'Creates Risk',
      stanceClass: 'badge-accent',
      statute: 'Imposes severe fines up to Rs 1.5 million and 5 years imprisonment for social media posts deemed to undermine national sovereignty, morality, or social harmony.',
      analysis: 'Extremely draconian definitions of cyber offenses designed to grant the executive sweeping power to censor dissent, memes, and political critique.'
    },
    'nid_foe': {
      title: 'National ID Act 2076 — Section 14',
      stance: 'Creates Risk',
      stanceClass: 'badge-accent',
      statute: 'Restricts public disclosure of government biometric databases and identity verification logs.',
      analysis: 'Limits transparency and civic oversight regarding which state bodies or foreign contractors access citizens\' identity records.'
    },
    // Lens 2: Privacy
    'eta_privacy': {
      title: 'Electronic Transaction Act 2063 — Section 48',
      stance: 'Double-Edged',
      stanceClass: 'badge',
      statute: 'Mandates confidentiality of electronic records and prohibits unauthorized access or disclosure of digital keys. Penalty: Fine up to Rs 100,000.',
      analysis: 'Protects digital confidentiality in theory, but lacks modern data protection concepts like purpose limitation and data subject consent.'
    },
    'penal_privacy': {
      title: 'National Penal Code 2074 — Sections 293–296',
      stance: 'Protects',
      stanceClass: 'badge-teal',
      statute: 'Criminalizes unauthorized wiretapping, secretly recording private conversations, taking photos without consent, and morphing images. Penalty: Imprisonment up to 3 years.',
      analysis: 'A vital statutory foundation against non-consensual photography, voyeurism, and fake/morphed pornographic imagery in Nepal.'
    },
    'privacy_privacy': {
      title: 'Individual Privacy Act 2075 — Sections 3–10',
      stance: 'Protects',
      stanceClass: 'badge-teal',
      statute: 'Comprehensive statutory protection for privacy of person, residence, property, correspondence, and biometric data.',
      analysis: 'Enshrines constitutional privacy guarantees into law, though enforcement is hampered by the absence of an independent Data Protection Authority.'
    },
    'dv_privacy': {
      title: 'Domestic Violence Act 2066 — Section 5',
      stance: 'Creates Risk',
      stanceClass: 'badge-accent',
      statute: 'Open court proceedings by default unless special in-camera trial is requested.',
      analysis: 'Forces survivors of intimate domestic and digital abuse into open courtrooms where sensitive personal communications are exposed to public scrutiny.'
    },
    'children_privacy': {
      title: 'Children\'s Act 2075 — Section 23',
      stance: 'Protects',
      stanceClass: 'badge-teal',
      statute: 'Strictly prohibits publishing the identity, address, photographs, or school details of any child involved in legal proceedings.',
      analysis: 'Exemplary privacy shield preventing the lifelong digital stigmatization of minor victims or juvenile offenders.'
    },
    'itbill_privacy': {
      title: 'Information Tech Bill 2075 — Section 91',
      stance: 'Creates Risk',
      stanceClass: 'badge-accent',
      statute: 'Authorizes security agencies to intercept, monitor, and decrypt private digital communications without requiring prior judicial warrants.',
      analysis: 'Severe constitutional violation of Article 28 privacy protections, establishing warrantless mass digital surveillance.'
    },
    'nid_privacy': {
      title: 'National ID Act 2076 — Section 5',
      stance: 'Creates Risk',
      stanceClass: 'badge-accent',
      statute: 'Allows the Department to share citizens\' biometric and demographic data with other government and private agencies as prescribed.',
      analysis: 'Creates a centralized biometric honeypot without mandatory encryption standards or independent data protection auditing.'
    },
    // Lens 3: Freedom from Violence
    'eta_violence': {
      title: 'Electronic Transaction Act 2063 — Section 47',
      stance: 'Creates Risk',
      stanceClass: 'badge-accent',
      statute: 'Section 47 misapplied by police as the sole catch-all mechanism for adjudicating online gender-based violence.',
      analysis: 'Focuses on state morality rather than bodily autonomy. Convictions result in nominal state fines with zero victim compensation, emergency takedown orders, or psychosocial support.'
    },
    'penal_violence': {
      title: 'National Penal Code 2074 — Section 224',
      stance: 'Double-Edged',
      stanceClass: 'badge',
      statute: 'Prohibits sexual harassment including sending sexually suggestive texts, images, or verbal remarks. Section 229 enforces a strict 90-day filing deadline.',
      analysis: 'Recognizes digital sexual harassment, but the rigid 90-day limitation period extinguishes claims of survivors facing prolonged blackmail or delayed trauma disclosure.'
    },
    'privacy_violence': {
      title: 'Individual Privacy Act 2075 — Section 16',
      stance: 'Protects',
      stanceClass: 'badge-teal',
      statute: 'Provides civil remedies and direct monetary compensation for victims whose private intimate data or photos are leaked without consent.',
      analysis: 'One of the few statutes providing financial restitution directly to the victim rather than diverting fines into state revenue.'
    },
    'dv_violence': {
      title: 'Domestic Violence Act 2066 — Section 4',
      stance: 'Creates Risk',
      stanceClass: 'badge-accent',
      statute: 'Mandates compulsory reconciliation and mediation attempts between victim and abuser prior to trial.',
      analysis: 'Forces victims of persistent online harassment and physical abuse back into dangerous proximity with abusive intimate partners under the guise of family preservation.'
    },
    'children_violence': {
      title: 'Children\'s Act 2075 — Section 66',
      stance: 'Protects',
      stanceClass: 'badge-teal',
      statute: 'Imposes severe penalties (up to 5 years imprisonment and Rs 50,000 fine) for digital sexual solicitation and exploitation of children.',
      analysis: 'Strong protection framework against child sexual abuse material (CSAM) and online grooming.'
    },
    'itbill_violence': {
      title: 'Information Tech Bill 2075 — Section 83',
      stance: 'Creates Risk',
      stanceClass: 'badge-accent',
      statute: 'Vaguely defines cyberbullying without gender-sensitive dimensions or distinctions between power hierarchies.',
      analysis: 'Fails to address specialized OGBV harms like doxxing and non-consensual image distribution, while risking being weaponized against legitimate online organizers.'
    },
    'nid_violence': {
      title: 'National ID Act 2076 — Section 18',
      stance: 'Creates Risk',
      stanceClass: 'badge-accent',
      statute: 'Conditions public welfare benefits, state pensions, and banking access strictly on NID enrollment.',
      analysis: 'Imposes systemic violence of bureaucratic exclusion on manual laborers, single women, trans individuals, and disabled persons unable to obtain biometric verification.'
    }
  };

  // 1. Interactive 2D Policy Matrix & Synchronized Inspector
  function initPolicyMatrix() {
    const cellBtns = Array.from(document.querySelectorAll('.matrix-cell-btn'));
    const inspectorTitle = document.getElementById('inspector-title');
    const inspectorStance = document.getElementById('inspector-stance');
    const inspectorStatute = document.getElementById('inspector-statute');
    const inspectorAnalysis = document.getElementById('inspector-analysis');

    cellBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        cellBtns.forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');

        const law = btn.dataset.law || 'eta';
        const lens = btn.dataset.lens || 'foe';
        const key = `${law}_${lens}`;
        const data = matrixData[key] || matrixData['eta_foe'];

        if (inspectorTitle) inspectorTitle.textContent = data.title;
        if (inspectorStatute) inspectorStatute.textContent = data.statute;
        if (inspectorAnalysis) inspectorAnalysis.textContent = data.analysis;
        
        if (inspectorStance) {
          inspectorStance.textContent = data.stance;
          if (data.stance === 'Creates Risk') {
            inspectorStance.style.background = 'var(--accent-crimson-tint)';
            inspectorStance.style.color = 'var(--accent-crimson-hover)';
            inspectorStance.style.borderColor = 'var(--accent-crimson)';
          } else if (data.stance === 'Protects') {
            inspectorStance.style.background = 'var(--accent-teal-tint)';
            inspectorStance.style.color = 'var(--accent-teal-hover)';
            inspectorStance.style.borderColor = 'var(--accent-teal)';
          } else {
            inspectorStance.style.background = 'var(--accent-gold-tint)';
            inspectorStance.style.color = 'var(--accent-gold-hover)';
            inspectorStance.style.borderColor = 'var(--accent-gold)';
          }
        }
      });
    });
  }

  // 2. Undefined Terms Highlighter Toggle
  function initUndefinedTermsToggle() {
    const toggleBtn = document.getElementById('btn-toggle-ambiguous');
    const matrixBtns = Array.from(document.querySelectorAll('.matrix-cell-btn[data-ambiguous="true"]'));

    let isHighlighted = false;

    toggleBtn?.addEventListener('click', () => {
      isHighlighted = !isHighlighted;
      toggleBtn.classList.toggle('active', isHighlighted);
      toggleBtn.setAttribute('aria-pressed', isHighlighted ? 'true' : 'false');

      matrixBtns.forEach((btn) => {
        btn.classList.toggle('highlight-amb', isHighlighted);
      });
    });
  }

  // 3. 15 Court Cases Outcome Filter
  function initCaseFilters() {
    const filterBtns = Array.from(document.querySelectorAll('[data-case-filter]'));
    const caseCards = Array.from(document.querySelectorAll('.deck-feature-card[data-outcome]'));

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.caseFilter;

        filterBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        caseCards.forEach((card) => {
          const outcome = card.dataset.outcome;
          const show = filter === 'all' || outcome === filter;
          card.style.display = show ? 'flex' : 'none';
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPolicyMatrix();
    initUndefinedTermsToggle();
    initCaseFilters();
  });
})();
