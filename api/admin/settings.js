/* ============================================================================
   /api/admin/settings  (admin only)
   GET  → { settings }
   PUT  → { ok, settings }
   ========================================================================== */

const { requireAdmin } = require('../auth-helpers');
const { loadOverrides, saveSettings, sanitizeSettings } = require('../store-helpers');

const DEFAULTS = {
  currency: 'usd',
  pricesArePlaceholders: true,
  announcement: '',
  email: 'hermazingtouch@gmail.com',
  phone: '5715757174'
};

module.exports = async (req, res) => {
  const auth = requireAdmin(req);
  if (auth.status) return res.status(auth.status).json(auth.body);

  if (req.method === 'GET') return await get(res);
  if (req.method === 'PUT') return await put(req, res);
  return res.status(405).json({ error: 'Method not allowed.' });
};

async function get(res) {
  const ov = await loadOverrides();
  const settings = Object.assign({}, DEFAULTS, ov.settings || {});
  return res.status(200).json({ settings });
}

async function put(req, res) {
  const raw = req.body;
  let body = {};
  if (typeof raw === 'string') {
    try { body = JSON.parse(raw || '{}'); } catch { return res.status(400).json({ error: 'Malformed request.' }); }
  } else if (raw && typeof raw === 'object') {
    body = raw;
  }

  const incoming = body && typeof body === 'object' && body.settings ? body.settings : body;
  const cleaned = sanitizeSettings(Object.assign({}, DEFAULTS, incoming));

  try {
    const saved = await saveSettings(cleaned);
    return res.status(200).json({ ok: true, settings: saved });
  } catch (err) {
    console.error('settings PUT:', err);
    return res.status(502).json({ error: 'Could not save settings.' });
  }
}
