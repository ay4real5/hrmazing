/* ============================================================================
   HER-mazing Touch — product catalogue (SINGLE SOURCE OF TRUTH)

   ⚠️  ALL PRICES BELOW ARE PLACEHOLDERS. Replace them with real prices before
       taking any live payment. Prices are in CENTS (4500 = $45.00) because
       that is what Stripe expects — this avoids floating-point rounding bugs.

   This file is loaded by BOTH the browser and the Stripe checkout function.
   The server re-reads prices from here and ignores whatever the browser sends,
   so a tampered cart cannot change what a customer is charged.

   shipping:
     "worldwide" — durable goods, safe to post anywhere
     "local"     — perishable (fresh flowers, dipped strawberries) or cash
                   bouquets. Sold online, but pickup / local delivery only.
   ========================================================================== */

(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.CATALOG = data;
})(typeof self !== 'undefined' ? self : globalThis, function () {

  const CURRENCY = 'usd';

  // NOTE: `price` is in cents and is a PLACEHOLDER. `grams` drives shipping bands.
  const PRODUCTS = [
    /* ---------------- candles ---------------- */
    { sku: 'candle-vanilla',    name: 'Vanilla Bean Bliss',      price: 2800, grams: 500, category: 'Candles', shipping: 'worldwide' },
    { sku: 'candle-lavender',   name: 'Lavender Fields',         price: 2800, grams: 500, category: 'Candles', shipping: 'worldwide' },
    { sku: 'candle-linen',      name: 'Fresh Linen',             price: 2800, grams: 500, category: 'Candles', shipping: 'worldwide' },
    { sku: 'candle-coconut',    name: 'Coconut & Sea Salt',      price: 2800, grams: 500, category: 'Candles', shipping: 'worldwide' },
    { sku: 'candle-cinnamon',   name: 'Cinnamon Sugar',          price: 2800, grams: 500, category: 'Candles', shipping: 'worldwide' },
    { sku: 'candle-cherry',     name: 'Black Cherry Merlot',     price: 3000, grams: 500, category: 'Candles', shipping: 'worldwide' },
    { sku: 'candle-fall',       name: 'Make Me Fall',            price: 3200, grams: 500, category: 'Candles', shipping: 'worldwide', badge: 'Signature' },
    { sku: 'candle-winter',     name: 'Winter Wonderland',       price: 3200, grams: 500, category: 'Candles', shipping: 'worldwide' },
    { sku: 'candle-summer',     name: 'Summer Breeze',           price: 3200, grams: 500, category: 'Candles', shipping: 'worldwide' },
    { sku: 'candle-spring',     name: 'Spring Bloom',            price: 3200, grams: 500, category: 'Candles', shipping: 'worldwide' },

    /* ---------------- gift sets ---------------- */
    { sku: 'gift-rose-basket',  name: 'Rose & Chocolate Basket', price: 8500, grams: 2200, category: 'Gift Sets', shipping: 'local',
      note: 'Contains fresh roses and chocolate-dipped strawberries — local delivery or pickup only.' },
    { sku: 'gift-dad-box',      name: "Dad's Deluxe Box",        price: 7500, grams: 1800, category: 'Gift Sets', shipping: 'worldwide' },
    { sku: 'gift-grad-money',   name: 'Grad Cap Money Bouquet',  price: 6500, grams: 700,  category: 'Gift Sets', shipping: 'local',
      note: 'Cash bouquet — local delivery or pickup only.' },
    { sku: 'gift-birthday-box', name: 'Birthday Bliss Box',      price: 6800, grams: 1600, category: 'Gift Sets', shipping: 'worldwide' },
    { sku: 'gift-just-because', name: 'Just Because Bouquet',    price: 5500, grams: 1200, category: 'Gift Sets', shipping: 'local',
      note: 'Fresh flowers — local delivery or pickup only.' },
    { sku: 'gift-mom-money',    name: "Mom's Money Bouquet",     price: 6500, grams: 700,  category: 'Gift Sets', shipping: 'local',
      note: 'Cash bouquet — local delivery or pickup only.' },
    { sku: 'gift-fathers-fav',  name: "Father's Day Favourites", price: 7200, grams: 1900, category: 'Gift Sets', shipping: 'worldwide' },
    { sku: 'gift-next-chapter', name: 'Next Chapter Box',        price: 6900, grams: 1500, category: 'Gift Sets', shipping: 'worldwide' },

    /* ---------------- engraving ---------------- */
    { sku: 'eng-dog-tag',       name: 'Engraved Dog Tag',        price: 1800, grams: 120,  category: 'Engraving', shipping: 'worldwide', personalise: true },
    { sku: 'eng-tumbler',       name: 'Engraved Tumbler',        price: 3400, grams: 600,  category: 'Engraving', shipping: 'worldwide', personalise: true },
    { sku: 'eng-mug',           name: 'Engraved Mug',            price: 2600, grams: 550,  category: 'Engraving', shipping: 'worldwide', personalise: true },
    { sku: 'eng-emblem',        name: 'Family Name Emblem',      price: 5800, grams: 1400, category: 'Engraving', shipping: 'worldwide', personalise: true },
    { sku: 'eng-doormat',       name: 'Custom Doormat',          price: 4800, grams: 2500, category: 'Engraving', shipping: 'worldwide', personalise: true },
    { sku: 'eng-wood',          name: 'Decorative Wood Carving', price: 6200, grams: 1800, category: 'Engraving', shipping: 'worldwide', personalise: true }
  ];

  /* Shipping options. Amounts in cents — ALSO PLACEHOLDERS.
     `scope: 'local'` options are the only ones offered when the basket holds
     perishable or cash items. */
  const SHIPPING = [
    { id: 'pickup',   label: 'Local pickup',            amount: 0,    scope: 'local',     days: [1, 3],  blurb: 'Collect from us — arrange a time by text' },
    { id: 'local',    label: 'Local delivery',          amount: 900,  scope: 'local',     days: [1, 3],  blurb: 'Hand-delivered in the local area' },
    { id: 'domestic', label: 'Standard shipping (US)',  amount: 1200, scope: 'worldwide', days: [3, 7] },
    { id: 'express',  label: 'Express shipping (US)',   amount: 2400, scope: 'worldwide', days: [1, 3] },
    { id: 'intl',     label: 'International shipping',  amount: 3900, scope: 'worldwide', days: [7, 21], blurb: 'Duties and import taxes are payable by the recipient' }
  ];

  /* Greeting cards. One is complimentary with every order; the wording is
     written by hand, so the customer picks an occasion and supplies the message. */
  const CARD_STYLES = [
    'Birthday', 'Congratulations', 'Just Because', 'With Love',
    'Thank You', 'Wedding', 'Housewarming', 'New Baby', 'Sympathy', 'Holiday'
  ];

  /* What a customer actually receives — shown on the product quick-view. */
  const CONTENTS = {
    'gift-rose-basket': ['Wicker keepsake basket', 'Blush roses & white daisies',
                         'Chocolate-dipped strawberries', 'Keepsake mug', 'Handwritten card'],
    'gift-dad-box':     ['Signature gift box', 'Engraved tumbler', 'Selection of treats',
                         'Hand-poured candle', 'Handwritten card'],
    'gift-grad-money':  ['Cash bouquet (amount of your choosing)', 'Mini graduation cap',
                         'Satin ribbon & wrap', 'Handwritten card'],
    'gift-birthday-box':['Signature gift box', 'Hand-poured candle', 'Sweet treats',
                         'Satin bow & gold trim', 'Handwritten card'],
    'gift-just-because':['Fresh roses & daisies', 'Eucalyptus greenery',
                         'Ribbon-tied wrap', 'Handwritten card'],
    'gift-mom-money':   ['Cash bouquet (amount of your choosing)', 'Fresh roses',
                         'Gold ribbon', 'Handwritten card'],
    'gift-fathers-fav': ['Wicker basket', 'Engraved mug', 'Engraved tumbler',
                         'Selection of treats', 'Handwritten card'],
    'gift-next-chapter':['Signature gift box', 'Keepsake candle',
                         'Personalised note', 'Satin bow & gold trim']
  };

  /* Shown as a badge on cards and as a "Best Sellers" filter. */
  const BEST_SELLERS = ['candle-fall', 'gift-rose-basket', 'eng-tumbler', 'gift-mom-money', 'eng-emblem'];

  /** Format cents as a display price. */
  function money(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  /* ------------------------------------------------------------------------
     Build an effective catalogue from the seed + any admin overrides.

     overrides = {
       products:   Array  — REPLACES the product list when present.
                            Each item: { sku, name, price, grams, category,
                                         shipping, badge?, note?, personalise?,
                                         bestSeller?, contents?, hidden? }
       shipping:   Array  — REPLACES the shipping options when present.
       cardStyles: Array  — REPLACES the greeting-card occasions when present.
       settings:   Object — store-wide settings (currency, placeholders flag).
     }

     Anything omitted falls back to the seed, so a partial override (e.g. only
     editing one product) still works: the admin UI always sends the FULL
     current list, so omission just means "no overrides stored yet".
     ---------------------------------------------------------------------- */
  function buildCatalog(overrides) {
    const ov = overrides && typeof overrides === 'object' ? overrides : {};

    const products = (Array.isArray(ov.products) ? ov.products : PRODUCTS)
      .map(cloneProduct)
      .filter(p => p && p.sku && typeof p.price === 'number');

    // mark best sellers + attach contents (overrides may set these per-item too)
    products.forEach(p => {
      if (p.bestSeller === undefined) {
        p.bestSeller = BEST_SELLERS.includes(p.sku);
      }
      if (!p.contents && CONTENTS[p.sku]) p.contents = CONTENTS[p.sku];
    });

    const shipping = (Array.isArray(ov.shipping) ? ov.shipping : SHIPPING)
      .map(s => ({ ...s }))
      .filter(s => s && s.id && s.scope);

    const cardStyles = Array.isArray(ov.cardStyles) ? ov.cardStyles.slice() : CARD_STYLES.slice();

    const settings = Object.assign(
      { currency: CURRENCY, pricesArePlaceholders: true },
      ov.settings && typeof ov.settings === 'object' ? ov.settings : {}
    );

    const bySku = Object.fromEntries(products.map(p => [p.sku, p]));

    function hasLocalOnly(lines) {
      return lines.some(l => (bySku[l.sku] || {}).shipping === 'local');
    }
    function shippingFor(lines) {
      return hasLocalOnly(lines) ? shipping.filter(s => s.scope === 'local') : shipping;
    }

    return {
      CURRENCY: settings.currency,
      PRODUCTS: products,
      SHIPPING: shipping,
      CARD_STYLES: cardStyles,
      SETTINGS: settings,
      bySku,
      money,
      hasLocalOnly,
      shippingFor,
      PRICES_ARE_PLACEHOLDERS: !!settings.pricesArePlaceholders
    };
  }

  function cloneProduct(p) {
    if (!p || typeof p !== 'object') return null;
    const clean = {
      sku: String(p.sku).trim().slice(0, 80),
      name: String(p.name || '').trim().slice(0, 120),
      price: Math.round(Number(p.price)),
      grams: Math.max(0, Math.round(Number(p.grams) || 0)),
      category: String(p.category || '').trim().slice(0, 40),
      shipping: p.shipping === 'local' ? 'local' : 'worldwide'
    };
    if (p.badge)         clean.badge = String(p.badge).slice(0, 40);
    if (p.note)          clean.note = String(p.note).slice(0, 300);
    if (p.image)         clean.image = String(p.image).slice(0, 2000);
    if (p.personalise)   clean.personalise = true;
    if (p.bestSeller)    clean.bestSeller = true;
    if (p.hidden)        clean.hidden = true;
    if (Array.isArray(p.contents)) {
      clean.contents = p.contents.map(s => String(s).slice(0, 120)).slice(0, 20);
    }
    return clean;
  }

  // The seed catalogue — what the browser loads by default before hydrating
  // any admin overrides from the server.
  const SEED = {
    products: PRODUCTS,
    shipping: SHIPPING,
    cardStyles: CARD_STYLES,
    contents: CONTENTS,
    bestSellers: BEST_SELLERS,
    currency: CURRENCY
  };

  const seedCatalog = buildCatalog();

  return Object.assign(seedCatalog, { buildCatalog, SEED });
});
