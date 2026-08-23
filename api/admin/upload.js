/* ============================================================================
   /api/admin/upload  (admin only)
   POST a base64 image string → upload to Vercel Blob → return public URL
   ========================================================================== */

const { requireAdmin } = require('../auth-helpers');
const { put } = require('@vercel/blob');

module.exports = async (req, res) => {
  const auth = requireAdmin(req);
  if (auth.status) return res.status(auth.status).json(auth.body);

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const body = req.body || {};
  if (typeof body.image !== 'string') return res.status(400).json({ error: 'Missing image.' });

  const dataUrl = body.image;
  const match = dataUrl.match(/^data:([a-zA-Z0-9/+.]+);base64,(.*)$/);
  if (!match) return res.status(400).json({ error: 'Image must be a data URL.' });

  const contentType = match[1];
  const base64 = match[2];
  let buffer;
  try { buffer = Buffer.from(base64, 'base64'); }
  catch { return res.status(400).json({ error: 'Could not decode image.' }); }

  if (buffer.length > 4.5 * 1024 * 1024)
    return res.status(400).json({ error: 'Image is too large. Resize or compress it first.' });

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowed.includes(contentType))
    return res.status(400).json({ error: 'Only JPEG, PNG and WebP images are allowed.' });

  const originalName = (body.name || 'image').split('.')[0] || 'image';
  const clean = originalName.replace(/[^a-z0-9-]/gi, '-').slice(0, 40);
  const ext = contentType === 'image/png' ? 'png' : 'jpg';
  const filename = `products/${Date.now()}-${clean}.${ext}`;

  try {
    const { url } = await put(filename, buffer, { access: 'public', contentType });
    return res.status(200).json({ url });
  } catch (err) {
    console.error('admin-upload error:', err);
    return res.status(500).json({ error: 'Upload failed. Is BLOB_READ_WRITE_TOKEN set?' });
  }
};
