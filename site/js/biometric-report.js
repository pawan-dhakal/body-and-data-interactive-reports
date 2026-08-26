/**
 * Body & Data — Nepal’s Biometric Present Interactive Script
 * Interactive OpenStreetMap (Leaflet) · Timeline Filters · Quote Wall · Recommendation Tabs
 */

(function () {
  'use strict';

  // 1. Interactive OpenStreetMap & District Explorer
  function initDistrictMap() {
    const mapEl = document.getElementById('district-osm-map');
    if (!mapEl || typeof L === 'undefined') return;

    // Center on Nepal
    const map = L.map('district-osm-map', {
      center: [27.7, 85.5],
      zoom: 7,
      minZoom: 6,
      maxZoom: 14,
      scrollWheelZoom: false
    });

    // CartoDB Positron Warm Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const districts = [
      {
        id: 'ktm',
        name: 'Kathmandu (Capital)',
        coords: [27.7172, 85.3240],
        color: '#A4234B',
        tag: 'Federal Policy Core',
        desc: 'DONIDCR Headquarters, Ministry of Home Affairs, Department of Passports. High administrative centralization and early pilot rollouts.',
        stat: 'Central NIDMIS Hub · Singha Durbar'
      },
      {
        id: 'sarlahi',
        name: 'Sarlahi (Madhesh Plains)',
        coords: [26.8578, 85.5583],
        color: '#C85A17',
        tag: 'Border Plains · "Difficult" District',
        desc: 'Malangwa, Hariwan, Bagmati. High rates of citizenship deprivation, high illiteracy, and heavy reliance on private cyber café brokers charging Rs 200–500.',
        stat: '300,000 Enrolled · 26 Mobile Camps'
      },
      {
        id: 'khotang',
        name: 'Khotang (Eastern Hills)',
        coords: [27.2189, 86.7907],
        color: '#1F5C55',
        tag: 'Hilly Region · "Successful" District',
        desc: 'Diktel, Halesi, Rupakot. Enrolled 126,856 citizens via 17 mobile camps. Severe device capture failures on farmers with worn fingerprints in winter cold.',
        stat: '126,856 Enrolled · 17 Mobile Camps'
      },
      {
        id: 'panchthar',
        name: 'Panchthar (Eastern Pilot)',
        coords: [27.1500, 87.7667],
        color: '#3A4B8C',
        tag: '2018 Pilot District',
        desc: 'ADB-funded initial pilot in Nov 2018 where the first NID card was ceremonially distributed to a 101-year-old woman.',
        stat: '110,000 Initial Pilot Enrollees'
      }
    ];

    const markers = {};

    districts.forEach((d) => {
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div class="pin-inner-pulse" style="background: ${d.color};"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -14]
      });

      const marker = L.marker(d.coords, { icon: customIcon }).addTo(map);

      const popupContent = `
        <div class="map-popup-card">
          <span class="map-popup-tag">${d.tag}</span>
          <h4 class="map-popup-title">${d.name}</h4>
          <p class="map-popup-desc">${d.desc}</p>
          <div class="map-popup-stat">📊 ${d.stat}</div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        minWidth: 280,
        maxWidth: 360,
        autoPanPadding: [20, 20]
      });

      marker.bindTooltip(`<strong>${d.name}</strong>`, {
        direction: 'top',
        offset: [0, -12],
        opacity: 0.95
      });

      markers[d.id] = marker;
    });

    // Automatically open Kathmandu popup after map initial render
    setTimeout(() => {
      if (markers['ktm']) {
        markers['ktm'].openPopup();
      }
    }, 600);

    // District Chip Buttons FlyTo
    const chipBtns = Array.from(document.querySelectorAll('[data-map-district]'));
    chipBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.mapDistrict;
        chipBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        if (id === 'all') {
          map.closePopup();
          map.flyTo([27.7, 85.5], 7, { duration: 1.2 });
        } else if (markers[id]) {
          const d = districts.find((x) => x.id === id);
          if (d) {
            map.flyTo(d.coords, 9, { duration: 1.2 });
            setTimeout(() => {
              markers[id].openPopup();
            }, 800);
          }
        }
      });
    });

    // Invalidate size on resize/orientation change
    window.addEventListener('resize', () => map.invalidateSize(), { passive: true });
  }

  // 2. Timeline Category Filtering
  function initTimelineFilters() {
    const filterBtns = Array.from(document.querySelectorAll('[data-tl-filter]'));
    const timelineItems = Array.from(document.querySelectorAll('.timeline-item'));

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.tlFilter;

        filterBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        timelineItems.forEach((item) => {
          const cat = item.dataset.category;
          const show = filter === 'all' || cat === filter;
          item.style.display = show ? 'grid' : 'none';
        });
      });
    });
  }

  // 3. Qualitative Voices Filter
  function initVoicesFilters() {
    const filterBtns = Array.from(document.querySelectorAll('[data-voice-filter]'));
    const quoteCards = Array.from(document.querySelectorAll('.quote-card'));

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.voiceFilter;

        filterBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        quoteCards.forEach((card) => {
          const grp = card.dataset.group;
          const show = filter === 'all' || grp === filter;
          card.style.display = show ? 'block' : 'none';
        });
      });
    });
  }

  // 4. Tabbed Recommendations Switcher
  function initRecommendationTabs() {
    const tabBtns = Array.from(document.querySelectorAll('[data-rec-tab]'));
    const recGrids = Array.from(document.querySelectorAll('[data-rec-content]'));

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.recTab;

        tabBtns.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        recGrids.forEach((grid) => {
          const show = grid.dataset.recContent === target;
          grid.style.display = show ? 'grid' : 'none';
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDistrictMap();
    initTimelineFilters();
    initVoicesFilters();
    initRecommendationTabs();
  });
})();
