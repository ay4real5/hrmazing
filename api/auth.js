/* ============================================================================
   POST /api/auth  { password }  →  { token }
   Returns a signed JWT valid for 12h if the password matches ADMIN_PASSWORD.
   ========================================================================== */

const { sign, json } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.JWT_SECRET;

  if (!password || !secret) {
    return res.status(500).json({
      error: 'Admin is not configured. Set ADMIN_PASSWORD and JWT_SECRET in Vercel env vars. See SETUP.md.'
    });
  }

  let body;
  try { body = JSON.parse(req.body || '{}'); }
  catch { return res.status(400).json({ error: 'Malformed request.' }); }

  const submitted = typeof body.password === 'string' ? body.password : '';
  if (!submitted) return res.status(400).json({ error: 'Password required.' });

  // timing-safe compare
  const a = Buffer.from(submitted);
  const b = Buffer.from(password);
  if (a.length !== b.length || !require('crypto').timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'Wrong password.' });
  }

  const token = sign({ role: 'admin', iat: Date.now() }, secret);
  return res.status(200).json({ token, expiresIn: 43200 });
};
