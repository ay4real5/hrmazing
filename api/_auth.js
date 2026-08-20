/* ============================================================================
   Shared admin auth for Vercel.
   Password-gate + signed JWT. No external identity service needed.

   Login:  POST /api/auth  { password }  →  { token }
   Verify: send  Authorization: Bearer <token>  on every admin request.

   Env vars (set in Vercel dashboard → Settings → Environment Variables):
     ADMIN_PASSWORD  — the password you type at /admin.html login
     JWT_SECRET      — a long random string used to sign tokens
   ========================================================================== */

const crypto = require('crypto');

const TOKEN_TTL = 1000 * 60 * 60 * 12; // 12 hours

/** Sign a payload with HS256. */
function sign(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const enc = obj => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const h = enc(header);
  const p = enc({ ...payload, exp: Date.now() + TOKEN_TTL });
  const sig = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
  return `${h}.${p}.${sig}`;
}

/** Verify a token. Returns the payload or null. */
function verify(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, sig] = parts;
  const expected = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
  // timing-safe compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(p, 'base64url').toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Express-like middleware: checks the Authorization header. */
function requireAdmin(req) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return { status: 500, body: { error: 'JWT_SECRET is not set. Add it in Vercel env vars.' } };
  }
  const auth = req.headers.authorization || req.headers.Authorization || '';
  const m = /^Bearer\s+(.+)$/i.exec(auth);
  if (!m) return { status: 401, body: { error: 'Not signed in.' } };
  const payload = verify(m[1], secret);
  if (!payload) return { status: 401, body: { error: 'Session expired — please sign in again.' } };
  return { user: payload };
}

/** Standard JSON response. */
function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders
    },
    body: JSON.stringify(body)
  };
}

module.exports = { sign, verify, requireAdmin, json, TOKEN_TTL };
