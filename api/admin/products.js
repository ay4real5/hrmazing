/* ============================================================================
   /api/admin/products  (admin only)
   GET  → { products, shipping, cardStyles }
   PUT  → save full override { products, shipping, cardStyles }
   ========================================================================== */

const { requireAdmin, json } = require('./_auth');
const { loadOverrides, saveCatalogOverride } = require('./_store');
const catalog = require('../shared/catalog.js');

module.exports = async (req, res) => {
  const auth = requireAdmin(req);
  if (auth.status) return res.status(auth.status).json(auth.body);

  if (req.method === 'GET') return await get(res);
  if (req.method === 'PUT')  return await put(req, res);
  return res.status(405).json({ error: 'Method not allowed.' });
};

async function get(res) {
  try {
    const ov = await loadOverrides();
    const products = ov.products || catalog.SEED.products.map(p => ({ ...p }));
    const shipping = ov.shipping || catalog.SEED.shipping.map(s => ({ ...s }));
    const cardStyles = ov.cardStyles || catalog.SEED.cardStyles.slice();
    return res.status(200).json({ products, shipping, cardStyles });
  } catch (err) {
    console.error('admin-products GET:', err);
    return res.status(502).json({ error: 'Could not load products.' });
  }
}

async function put(req, res) {
  let body;
  try { body = JSON.parse(req.body || '{}'); }
  catch { return res.status(400).json({ error: 'Malformed request.' }); }

  const products = Array.isArray(body.products) ? body.products : [];
  const shipping = Array.isArray(body.shipping) ? body.shipping : [];
  const cardStyles = Array.isArray(body.cardStyles) ? body.cardStyles : [];

  const seen = new Set();
  for (const p of products) {
    if (!p || typeof p !== 'object') return res.status(400).json({ error: 'A product entry is invalid.' });
    if (!p.sku || !/^[a-z0-9-]{1,80}$/i.test(String(p.sku)))
      return res.status(400).json({ error: `Invalid SKU: "${p.sku}". Use lowercase letters, numbers and hyphens.` });
    if (seen.has(p.sku)) return res.status(400).json({ error: `Duplicate SKU: ${p.sku}.` });
    seen.add(p.sku);
    if (!p.name || !String(p.name).trim()) return res.status(400).json({ error: `Product ${p.sku} needs a name.` });
    if (!Number.isFinite(Number(p.price)) || Number(p.price) < 0)
      return res.status(400).json({ error: `Product ${p.sku} has an invalid price.` });
    if (!p.category || !String(p.category).trim())
      return res.status(400).json({ error: `Product ${p.sku} needs a category.` });
    if (p.shipping !== 'local' && p.shipping !== 'worldwide')
      return res.status(400).json({ error: `Product ${p.sku}: shipping must be 'local' or 'worldwide'.` });
  }

  for (const s of shipping) {
    if (!s || !s.id || !s.label || !s.scope)
      return res.status(400).json({ error: 'Every shipping option needs id, label and scope.' });
    if (!Number.isFinite(Number(s.amount)) || Number(s.amount) < 0)
      return res.status(400).json({ error: `Shipping option ${s.id} has an invalid amount.` });
    if (!Array.isArray(s.days) || s.days.length !== 2)
      return res.status(400).json({ error: `Shipping option ${s.id} needs a days:[min,max] range.` });
  }

  try {
    const saved = await saveCatalogOverride({ products, shipping, cardStyles });
    return res.status(200).json({ ok: true, saved });
  } catch (err) {
    console.error('admin-products PUT:', err);
    return res.status(502).json({ error: 'Could not save products.' });
  }
}
