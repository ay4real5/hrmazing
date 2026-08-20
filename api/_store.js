/* ============================================================================
   Upstash Redis-backed store for admin-managed catalogue + settings.
   Works on Vercel serverless (stateless) with zero connection-pool issues.

   Create a free Redis DB at https://console.upstash.com (or enable Vercel KV
   in the Vercel dashboard — it's Upstash under the hood). Then set these env
   vars in Vercel:
     UPSTASH_REDIS_REST_URL   — e.g. https://xxx-xxxx.upstash.io
     UPSTASH_REDIS_REST_TOKEN — the REST token

   If neither is set, we fall back to an in-memory store so the admin still
   works in preview mode (changes won't persist across deploys).
   ========================================================================== */

const catalog = require('../shared/catalog.js');

const KEY_CATALOG = 'hermazing:catalog';
const KEY_SETTINGS = 'hermazing:settings';

/* ---------- in-memory fallback (preview / local dev without Redis) ---------- */
const mem = new Map();

async function redisGet(key) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return mem.get(key) || null;
  const res = await fetch(`${url}/get/${key}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.result; // Upstash returns { result: "..." } or { result: null }
}

async function redisSet(key, value) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) { mem.set(key, value); return; }
  await fetch(`${url}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  });
}

/* ---------- public API ---------- */
async function loadOverrides() {
  try {
    const [catRaw, setRaw] = await Promise.all([redisGet(KEY_CATALOG), redisGet(KEY_SETTINGS)]);
    const cat = catRaw ? safeParse(catRaw) : null;
    const settings = setRaw ? safeParse(setRaw) : null;
    return {
      products: cat && Array.isArray(cat.products) ? cat.products : undefined,
      shipping: cat && Array.isArray(cat.shipping) ? cat.shipping : undefined,
      cardStyles: cat && Array.isArray(cat.cardStyles) ? cat.cardStyles : undefined,
      settings: settings && typeof settings === 'object' ? settings : undefined
    };
  } catch (err) {
    console.error('store load failed, using seed:', err);
    return {};
  }
}

async function saveCatalogOverride(overrides) {
  const doc = {
    products: Array.isArray(overrides.products) ? overrides.products : [],
    shipping: Array.isArray(overrides.shipping) ? overrides.shipping : [],
    cardStyles: Array.isArray(overrides.cardStyles) ? overrides.cardStyles : []
  };
  await redisSet(KEY_CATALOG, JSON.stringify(doc));
  return doc;
}

async function saveSettings(settings) {
  const clean = sanitizeSettings(settings);
  await redisSet(KEY_SETTINGS, JSON.stringify(clean));
  return clean;
}

async function effectiveCatalog() {
  const ov = await loadOverrides();
  return catalog.buildCatalog(ov);
}

function sanitizeSettings(s) {
  if (!s || typeof s !== 'object') s = {};
  return {
    currency: typeof s.currency === 'string' ? s.currency.slice(0, 8).toLowerCase() : 'usd',
    pricesArePlaceholders: s.pricesArePlaceholders !== false,
    announcement: typeof s.announcement === 'string' ? s.announcement.slice(0, 400) : '',
    email: typeof s.email === 'string' ? s.email.slice(0, 120) : '',
    phone: typeof s.phone === 'string' ? s.phone.slice(0, 40) : ''
  };
}

function safeParse(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}

module.exports = {
  loadOverrides, saveCatalogOverride, saveSettings, effectiveCatalog, sanitizeSettings
};
