/* ============================================================================
   HER-mazing Touch — catalogue hydration

   The storefront ships with a hand-written seed catalogue (shared/catalog.js)
   and hand-written product cards in index.html. Anything the admin adds or
   edits lives server-side instead, behind GET /api/catalog.

   This file bridges the two. It runs BEFORE cart.js / script.js / shop.js —
   it injects them itself once hydration is done — so those files see the final
   catalogue and the final DOM and need no changes of their own.

   It is fail-safe by design: if the API is slow, down, or returns junk, we
   fall through to the seed and the site behaves exactly as it did before.
   ========================================================================== */

(function () {
  'use strict';

  var SCRIPTS = ['js/cart.js', 'js/script.js', 'js/shop.js'];
  var TIMEOUT_MS = 2500;

  // category -> the grid new products get appended to, and their fallback art
  var GRIDS = {
    'candles':   { grid: 'candleGrid',  art: 'candle', tag: null },
    'gift sets': { grid: 'giftGrid',    art: 'box',    tag: 'Gift Set' },
    'engraving': { grid: 'engraveGrid', art: 'tag',    tag: null }
  };
  var FALLBACK = { grid: 'giftGrid', art: 'box', tag: null };

  // Every hand-written card is an <article data-sku>. Do NOT narrow this to
  // `.pcard` — the four seasonal candles are `.scard`, and missing them means
  // hydration treats them as new and appends duplicates.
  var CARD_SEL = 'article[data-sku]';

  /* ---------------- kick the fetch off immediately ---------------- */
  var fetched = fetchCatalog();
  var domReady = new Promise(function (resolve) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    } else resolve();
  });

  Promise.all([fetched, domReady])
    .then(function (r) { apply(r[0]); })
    .catch(function (err) { console.warn('[hydrate] falling back to seed catalogue:', err); })
    .then(loadRest, loadRest);

  // script.js owns the preloader, and its own 2.6s safety net cannot start
  // until it runs — which is behind us. Guarantee the curtain lifts.
  setTimeout(function () {
    var pre = document.getElementById('preloader');
    if (pre) pre.classList.add('done');
  }, 4000);

  /* ---------------- fetch ---------------- */
  function fetchCatalog() {
    if (typeof fetch !== 'function') return Promise.resolve(null);
    var ctl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, TIMEOUT_MS);

    return fetch('/api/catalog', {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: ctl ? ctl.signal : undefined
    })
      .then(function (res) { return res.ok ? res.json() : null; })
      .catch(function () { return null; })
      .then(function (data) { clearTimeout(timer); return data; });
  }

  /* ---------------- apply ---------------- */
  function apply(data) {
    if (!data || !Array.isArray(data.products) || !data.products.length) return;

    var C = window.CATALOG;
    if (!C || typeof C.buildCatalog !== 'function') return;

    // Rebuild, then copy onto the EXISTING object: cart.js and shop.js capture
    // `window.CATALOG` by reference, so replacing it wholesale would leave them
    // pointing at stale data.
    var next = C.buildCatalog({
      products: data.products,
      shipping: data.shipping,
      cardStyles: data.cardStyles,
      settings: data.settings
    });
    ['CURRENCY', 'PRODUCTS', 'SHIPPING', 'CARD_STYLES', 'SETTINGS', 'bySku',
     'hasLocalOnly', 'shippingFor', 'PRICES_ARE_PLACEHOLDERS'].forEach(function (k) {
      C[k] = next[k];
    });

    var live = C.bySku;

    // 1. Any hand-written card whose SKU the admin hid or deleted comes out of
    //    the DOM entirely, so search, sort and counts stay honest.
    document.querySelectorAll(CARD_SEL).forEach(function (card) {
      if (!live[card.dataset.sku]) card.remove();
    });

    // 2. Existing cards keep their copy but take the admin's photo.
    document.querySelectorAll(CARD_SEL).forEach(function (card) {
      var p = live[card.dataset.sku];
      if (p && p.image) setPhoto(card, p, false);
    });

    // 3. Products the admin added get a generated card.
    var known = {};
    document.querySelectorAll(CARD_SEL).forEach(function (c) { known[c.dataset.sku] = true; });
    C.PRODUCTS.forEach(function (p) { if (!known[p.sku]) addCard(p); });
  }

  /* ---------------- card building ---------------- */
  function placement(category) {
    return GRIDS[String(category || '').trim().toLowerCase()] || FALLBACK;
  }

  function addCard(p) {
    var spot = placement(p.category);
    var grid = document.getElementById(spot.grid) || document.getElementById(FALLBACK.grid);
    if (!grid) return;

    var card = document.createElement('article');
    card.dataset.sku = p.sku;
    card.className = 'pcard reveal tilt' + (spot.grid === 'giftGrid' ? ' gcard' : '');
    card.dataset.occasions = 'just-because';
    if (!p.image) card.dataset.art = spot.art;

    var label = spot.tag || (p.category || '').trim();
    if (label && spot.grid === 'giftGrid') {
      var tag = document.createElement('span');
      tag.className = 'type-tag';
      tag.textContent = label;
      card.appendChild(tag);
    }

    var art = document.createElement('div');
    art.className = 'pcard-art';
    card.appendChild(art);

    var body = document.createElement('div');
    body.className = 'pcard-body';

    var h3 = document.createElement('h3');
    h3.textContent = p.name;
    body.appendChild(h3);

    var desc = p.note || (Array.isArray(p.contents) ? p.contents.join(' · ') : '');
    if (desc) {
      var para = document.createElement('p');
      para.textContent = desc;
      body.appendChild(para);
    }

    if (Array.isArray(p.contents) && p.contents.length) {
      var notes = document.createElement('div');
      notes.className = 'notes';
      p.contents.slice(0, 3).forEach(function (item) {
        var s = document.createElement('span');
        s.textContent = item;
        notes.appendChild(s);
      });
      body.appendChild(notes);
    }

    card.appendChild(body);
    grid.appendChild(card);

    if (p.image) setPhoto(card, p, true);
  }

  function setPhoto(card, p, isNew) {
    var art = card.querySelector('.pcard-art');
    if (!art) return;
    var img = document.createElement('img');
    img.className = 'pcard-photo';
    img.src = p.image;
    img.alt = p.name || '';
    img.loading = isNew ? 'lazy' : 'eager';
    // A dead blob URL must not leave a blank tile — fall back to the SVG art.
    img.onerror = function () {
      img.remove();
      card.dataset.art = placement(p.category).art;
    };
    art.innerHTML = '';
    art.appendChild(img);
    delete card.dataset.art;          // stop script.js overwriting the photo
  }

  /* ---------------- hand off to the rest of the site ---------------- */
  function loadRest() {
    // Append all three at once with async=false: the browser downloads them in
    // parallel (already warm from the <link rel=preload> hints in <head>) but
    // still executes them in insertion order, which cart -> script -> shop
    // depends on. Loading them one-by-one instead cost ~2s of dead time.
    var pending = SCRIPTS.length;
    var done = function () { if (--pending === 0) finish(); };
    SCRIPTS.forEach(function (src) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = done;
      s.onerror = function () { console.error('[hydrate] failed to load', src); done(); };
      document.body.appendChild(s);
    });
  }

  function finish() {
    // Those scripts register DOMContentLoaded handlers, and by now the real
    // event has already fired — so replay it, once, for them.
    document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
    if (document.readyState === 'complete') {
      window.dispatchEvent(new Event('load'));
    }
  }
})();
