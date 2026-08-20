/* ============================================================================
   GET /api/catalog  →  effective catalogue (seed + admin overrides)
   Public — no auth. The storefront hydrates from this.
   ========================================================================== */

const { effectiveCatalog } = require('./store-helpers');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  try {
    const cat = await effectiveCatalog();
    const products = cat.PRODUCTS
      .filter(p => !p.hidden)
      .map(p => ({
        sku: p.sku, name: p.name, price: p.price, grams: p.grams,
        category: p.category, shipping: p.shipping,
        ...(p.badge ? { badge: p.badge } : {}),
        ...(p.note ? { note: p.note } : {}),
        ...(p.personalise ? { personalise: true } : {}),
        ...(p.bestSeller ? { bestSeller: true } : {}),
        ...(p.contents ? { contents: p.contents } : {})
      }));

    return res.status(200).json({
      currency: cat.CURRENCY,
      products,
      shipping: cat.SHIPPING,
      cardStyles: cat.CARD_STYLES,
      settings: cat.SETTINGS,
      pricesArePlaceholders: cat.PRICES_ARE_PLACEHOLDERS
    });
  } catch (err) {
    console.error('catalog error:', err);
    return res.status(502).json({ error: 'Could not load the catalogue.' });
  }
};
