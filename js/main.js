(function () {
  'use strict';

  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var CATALOG = [
    ['C172 Magic Full Embedded Big', '70.000 €', 'products/cessna-172-magic-big.html', 'img/products/gallery/c172-magic-full-embedded-big-0.jpg'],
    ['Professional C172 Magic Full Embedded Big', '75.000 €', 'products/professional-cessna-172-magic-big.html', 'img/products/gallery/professional-c172-magic-full-embedded-mini-2-0.jpg'],
    ['C172 Magic Full Embedded Mini', '65.000 €', 'products/cessna-172-magic-mini.html', 'img/products/gallery/c152-magic-full-embedded-big-copy-0.jpg'],
    ['Professional C172 Magic Full Embedded Mini', '70.000 €', 'products/professional-cessna-172-magic-mini.html', 'img/products/gallery/professional-c172-magic-full-embedded-mini-0.jpg'],
    ['C152 Magic Full Embedded Big', '70.000 €', 'products/cessna-152-magic-big.html', 'img/products/gallery/c152-magic-full-embedded-big-copy-copy-0.jpg'],
    ['Professional C152 Magic Full Embedded Big', '75.000 €', 'products/professional-cessna-152-magic-big.html', 'img/products/gallery/professional-c152-magic-full-embedded-big-0.jpg'],
    ['C152 Magic Full Embedded Mini', '65.000 €', 'products/cessna-152-magic-mini.html', 'img/products/gallery/c152-magic-full-embedded-mini-0.jpg'],
    ['Professional C152 Magic Full Embedded Mini', '70.000 €', 'products/professional-cessna-152-magic-mini.html', 'img/products/gallery/professional-c152-magic-full-embedded-mini-0.jpg'],
    ['Professional ATC Simulator', '350.000 €', 'products/atc-simulator.html', 'img/products/gallery/professional-atc-simulator-realistic-training-for-air-traffic-controllers-0.jpg'],
    ['Professional Drone Simulator', '15.000 €', 'products/drone-simulator.html', 'img/products/gallery/professional-drone-simulator-0.jpg'],
    ['Full Cessna Cabin 172/152', '10.000 €', 'products/cessna-cabin-172-152.html', 'img/products/gallery/full-cessna-cabin-172-152-for-professional-flight-simulator-0.jpg'],
    ['Magic YOKE', '350 €', 'products/magic-yoke.html', 'img/products/gallery/magic-yoke-0.jpg'],
    ['Garmin G1000', '950 €', 'products/garmin-g1000.html', 'img/products/gallery/garmin-g1000-0.jpg'],
    ['Garmin G530', '650 €', 'products/garmin-g530.html', 'img/products/gallery/garmin-g430-0.jpg'],
    ['Garmin G430', '520 €', 'products/garmin-g430.html', 'img/products/gallery/garmin-g530-copy-0.jpg'],
    ['Pro Flight Radio Panel', '300 €', 'products/pro-flight-radio-panel.html', 'img/products/gallery/pro-flight-radio-panel-0.jpg'],
    ['Transponder KT76C', '320 €', 'products/transponder.html', 'img/products/gallery/transponder-0.jpg'],
    ['Cessna magnetic compass', '230 €', 'products/cessna-magnetic-compass.html', 'img/products/gallery/cessna-magnetic-compass-0.jpg']
  ];

  var PARTS = {
    'products/cessna-cabin-172-152.html': 1,
    'products/magic-yoke.html': 1,
    'products/garmin-g1000.html': 1,
    'products/garmin-g430.html': 1,
    'products/garmin-g530.html': 1,
    'products/pro-flight-radio-panel.html': 1,
    'products/transponder.html': 1,
    'products/cessna-magnetic-compass.html': 1
  };

  function langPrefix() {
    var m = location.pathname.match(/^\/(es|fr|ru|de|it|el)(?=\/|$)/);
    return m ? '/' + m[1] : '';
  }
  function assetUrl(rel) {
    return '/' + String(rel || '').replace(/^\//, '');
  }
  function pageUrl(rel) {
    return langPrefix() + '/' + String(rel || '').replace(/^\//, '');
  }

  var homeBlocks = document.getElementById('homeBlocks');
  if (homeBlocks) {
    var pool = CATALOG.filter(function (p) { return !PARTS[p[2]]; });
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }
    for (var start = 0; start < pool.length; start += 4) {
      var block = document.createElement('div');
      block.className = 'grid product-grid home-block';
      pool.slice(start, start + 4).forEach(function (p) {
        var card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = '<a><img class="card-img-real" alt="" loading="lazy"></a><div class="card-body"><h3></h3><p class="price"><strong></strong></p><a class="btn btn-sm btn-primary">Details</a></div>';
        card.querySelector('img').src = assetUrl(p[3]);
        card.querySelector('img').alt = p[0];
        card.querySelector('h3').textContent = p[0];
        card.querySelector('strong').textContent = p[1];
        card.querySelectorAll('a').forEach(function (a) { a.href = pageUrl(p[2]); });
        block.appendChild(card);
      });
      homeBlocks.appendChild(block);
    }
  }

  function filterCards(raw) {
    var cards = document.querySelectorAll('.product-grid .card, .product-grid article');
    if (!cards.length) return;
    var q = (raw || '').trim().toLowerCase();
    var shown = 0;
    cards.forEach(function (card) {
      var ok = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
      card.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });
    var note = document.getElementById('searchNote');
    var grid = document.querySelector('.product-grid');
    if (!note && grid && grid.parentElement) {
      note = document.createElement('p');
      note.id = 'searchNote';
      note.className = 'no-results';
      grid.parentElement.insertBefore(note, grid);
    }
    if (note) {
      var tr = window.FS_I18N ? FS_I18N.t : function (s) { return s; };
      note.setAttribute('data-no-i18n', '');
      note.textContent = q
        ? (shown ? shown + ' ' + tr(shown === 1 ? 'result' : 'results') + ' ' + tr('for') + ' “' + raw.trim() + '”' : tr('No products match') + ' “' + raw.trim() + '”.')
        : '';
    }
  }

  var header = document.querySelector('.header-inner');
  if (header && !document.getElementById('siteSearch')) {
    var searchForm = document.createElement('form');
    searchForm.className = 'search';
    searchForm.id = 'siteSearch';
    searchForm.setAttribute('role', 'search');
    searchForm.action = pageUrl('products/');
    searchForm.method = 'get';
    searchForm.innerHTML = '<input type="search" name="q" placeholder="Search products…" autocomplete="off" aria-label="Search products" enterkeyhint="search"><div class="search-results" data-no-i18n hidden></div>';
    var toggleBtn = header.querySelector('.nav-toggle');
    if (toggleBtn) header.insertBefore(searchForm, toggleBtn);
    else header.appendChild(searchForm);

    var input = searchForm.querySelector('input');
    var box = searchForm.querySelector('.search-results');
    var preset = new URLSearchParams(location.search).get('q') || '';
    if (preset) input.value = preset;

    function renderMatches(q) {
      var query = (q || '').trim().toLowerCase();
      if (!query) { box.hidden = true; box.innerHTML = ''; return; }
      var hits = CATALOG.filter(function (p) {
        return (p[0] + ' ' + p[1]).toLowerCase().indexOf(query) !== -1;
      }).slice(0, 8);
      box.innerHTML = hits.length
        ? hits.map(function (p) {
            var img = p[3] ? '<img src="' + assetUrl(p[3]) + '" alt="" width="46" height="46">' : '';
            return '<a href="' + pageUrl(p[2]) + '">' + img + '<span>' + p[0] + '<small>' + p[1] + '</small></span></a>';
          }).join('')
        : '<div class="search-empty">' + (window.FS_I18N ? FS_I18N.t('No products match.') : 'No products match.') + '</div>';
      box.hidden = false;
    }

    input.addEventListener('input', function () {
      renderMatches(input.value);
      filterCards(input.value);
    });
    input.addEventListener('focus', function () { if (input.value.trim()) renderMatches(input.value); });
    document.addEventListener('click', function (e) {
      if (!searchForm.contains(e.target)) box.hidden = true;
    });
    filterCards(input.value);
    document.addEventListener('fs-lang', function () {
      renderMatches(input.value);
      filterCards(input.value);
    });
  }

  var onCatalogue = !!document.getElementById('grid-c172');
  if (onCatalogue) {
    fetch('/1q2w3e4r5t6y7u8i9o0p/products.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (list) {
        if (!Array.isArray(list)) return;
        list.forEach(function (p) {
          var imgs = Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []);
          imgs = imgs.filter(function (src) { return /^img\/products\/[A-Za-z0-9._/-]+$/.test(String(src)); });
          if (!imgs.length || !p.id) return;
          var cat = p.category || 'parts';
          var grid = document.getElementById('grid-' + cat);
          if (!grid) {
            var host = document.getElementById('custom-categories');
            if (host) {
              var title = document.createElement('h2');
              title.style.cssText = 'margin:0 0 1.2rem;font-size:1.25rem';
              title.textContent = p.categoryLabel || cat;
              grid = document.createElement('div');
              grid.className = 'grid product-grid';
              grid.id = 'grid-' + cat;
              grid.style.marginBottom = '2.5rem';
              host.appendChild(title);
              host.appendChild(grid);
            } else {
              grid = document.getElementById('grid-parts');
            }
          }
          var card = document.createElement('article');
          card.className = 'card';
          var href = p.id + '.html';
          card.innerHTML = '<a><img class="card-img-real" loading="lazy" alt=""></a><div class="card-body"><h3></h3><p class="price"><strong></strong></p><a class="btn btn-sm btn-primary">Details</a></div>';
          card.querySelector('img').src = assetUrl(imgs[0]);
          card.querySelector('img').alt = p.name || '';
          card.querySelector('h3').textContent = p.name || '';
          card.querySelector('strong').textContent = p.price || '';
          card.querySelectorAll('a').forEach(function (a) { a.href = href; });
          grid.appendChild(card);
          CATALOG.push([p.name || '', p.price || '', 'products/' + href, imgs[0]]);
        });
        if (window.FS_I18N) FS_I18N.apply();
      })
      .catch(function () {});
  }

  // Contact form
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type=submit]');
      var orig = btn.textContent;
      var tr = window.FS_I18N ? FS_I18N.t : function (s) { return s; };
      btn.textContent = tr('Sent ✓');
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = orig;
        btn.disabled = false;
        form.reset();
        alert(tr('Thank you. We will reply shortly.'));
      }, 700);
    });
  }

  // ========== GDPR Cookie Consent ==========
  var CONSENT_KEY = 'fs_cookie_consent';
  var banner = document.getElementById('cookie-banner');
  var modal = document.getElementById('cookie-modal');

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; }
  }
  function setConsent(obj) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(obj));
    applyConsent(obj);
    hideBanner();
    hideModal();
  }
  function hideBanner() { if (banner) banner.classList.remove('show'); }
  function showBanner() { if (banner) banner.classList.add('show'); }
  function hideModal() { if (modal) modal.classList.remove('show'); }
  function showModal() { if (modal) modal.classList.add('show'); }

  function applyConsent(c) {
    if (!c) return;
    // Analytics only if accepted
    if (c.analytics) {
      loadAnalytics();
    }
  }

  // --- Google Analytics 4 (G-NH69P6V66N), only after consent ---
  function loadAnalytics() {
    if (window.__ga_loaded) return;
    window.__ga_loaded = true;
    var GA_ID = 'G-BKCQ86LGR1';
    if (!GA_ID || GA_ID.indexOf('XXXX') !== -1) return; // skip if not configured
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  // Init consent UI
  var existing = getConsent();
  if (existing) {
    applyConsent(existing);
  } else {
    showBanner();
  }

  var btnAccept = document.getElementById('cookie-accept');
  var btnReject = document.getElementById('cookie-reject');
  var btnSettings = document.getElementById('cookie-settings');
  var btnSave = document.getElementById('cookie-save');
  var btnClose = document.getElementById('cookie-close');

  if (btnAccept) {
    btnAccept.addEventListener('click', function () {
      setConsent({ necessary: true, analytics: true, marketing: false, ts: Date.now() });
    });
  }
  if (btnReject) {
    btnReject.addEventListener('click', function () {
      setConsent({ necessary: true, analytics: false, marketing: false, ts: Date.now() });
    });
  }
  if (btnSettings) {
    btnSettings.addEventListener('click', function () { showModal(); });
  }
  if (btnClose) {
    btnClose.addEventListener('click', function () { hideModal(); });
  }
  if (btnSave) {
    btnSave.addEventListener('click', function () {
      var analytics = document.getElementById('opt-analytics');
      setConsent({
        necessary: true,
        analytics: analytics ? analytics.checked : false,
        marketing: false,
        ts: Date.now()
      });
    });
  }
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) hideModal();
    });
  }
  if (window.FS_I18N) FS_I18N.start();
})();
