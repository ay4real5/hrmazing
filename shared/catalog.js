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
  BEST_SELLERS.forEach(sku => { const p = PRODUCTS.find(x => x.sku === sku); if (p) p.bestSeller = true; });
  Object.entries(CONTENTS).forEach(([sku, list]) => {
    const p = PRODUCTS.find(x => x.sku === sku); if (p) p.contents = list;
  });

  const bySku = Object.fromEntries(PRODUCTS.map(p => [p.sku, p]));

  /** Format cents as a display price. */
  function money(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  /** True when the basket contains anything that must not be posted. */
  function hasLocalOnly(lines) {
    return lines.some(l => (bySku[l.sku] || {}).shipping === 'local');
  }

  /** Shipping choices valid for the given basket. */
  function shippingFor(lines) {
    return hasLocalOnly(lines) ? SHIPPING.filter(s => s.scope === 'local') : SHIPPING;
  }

  return { CURRENCY, PRODUCTS, SHIPPING, CARD_STYLES, bySku, money,
           hasLocalOnly, shippingFor, PRICES_ARE_PLACEHOLDERS: true };
});
