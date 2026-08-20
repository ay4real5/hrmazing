/* ============================================================================
   POST /api/auth  { password }  →  { token }
   Returns a signed JWT valid for 12h if the password matches ADMIN_PASSWORD.
   ========================================================================== */

const { sign, json } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // ⚠️  Hardcoded for convenience. For production, move ADMIN_PASSWORD and
  //     JWT_SECRET to Vercel environment variables instead of committing them.
  const HARDCODED_PASSWORD = 'Gentleman@101';
  const HARDCODED_SECRET = 'devin-hardcoded-secret-change-me-in-prod';

  const password = process.env.ADMIN_PASSWORD || HARDCODED_PASSWORD;
  const secret = process.env.JWT_SECRET || HARDCODED_SECRET;

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
