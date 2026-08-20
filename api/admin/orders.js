/* ============================================================================
   /api/admin/orders  (admin only)
   GET  → { orders, hasMore }   — lists Stripe checkout sessions
   POST → { action:'refund', paymentIntent } — refunds in full
   ========================================================================== */

const Stripe = require('stripe');
const { requireAdmin } = require('../_auth');

module.exports = async (req, res) => {
  const auth = requireAdmin(req);
  if (auth.status) return res.status(auth.status).json(auth.body);

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(503).json({ error: 'Stripe is not configured — set STRIPE_SECRET_KEY in Vercel env vars.' });
  }
  const stripe = Stripe(key);

  if (req.method === 'GET')  return await list(stripe, req, res);
  if (req.method === 'POST') return await refund(stripe, req, res);
  return res.status(405).json({ error: 'Method not allowed.' });
};

async function list(stripe, req, res) {
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const startingAfter = req.query.starting_after || undefined;

  try {
    const sessions = await stripe.checkout.sessions.list({
      limit,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
      expand: ['data.line_items', 'data.payment_intent']
    });

    const orders = sessions.data.map(s => {
      const pi = s.payment_intent && typeof s.payment_intent === 'object' ? s.payment_intent : null;
      return {
        id: s.id, created: s.created, status: s.status, paymentStatus: s.payment_status,
        amountTotal: s.amount_total, currency: s.currency,
        customerEmail: s.customer_details && s.customer_details.email,
        customerName: s.customer_details && s.customer_details.name,
        shipping: s.shipping_details || (s.customer_details && s.customer_details.address),
        phone: s.customer_details && s.customer_details.phone,
        lineItems: (s.line_items && s.line_items.data
          ? s.line_items.data.map(li => ({ description: li.description, quantity: li.quantity, amountTotal: li.amount_total }))
          : []),
        metadata: s.metadata || {},
        paymentIntent: pi ? pi.id : null,
        refunded: pi && pi.charges && pi.charges.data[0] ? pi.charges.data[0].amount_refunded > 0 : false
      };
    });

    return res.status(200).json({ orders, hasMore: sessions.has_more });
  } catch (err) {
    console.error('orders list:', err);
    return res.status(502).json({ error: 'Could not load orders from Stripe.' });
  }
}

async function refund(stripe, req, res) {
  let body;
  try { body = JSON.parse(req.body || '{}'); }
  catch { return res.status(400).json({ error: 'Malformed request.' }); }

  if (body.action !== 'refund' || !body.paymentIntent) {
    return res.status(400).json({ error: 'Expected { action: "refund", paymentIntent: "pi_..." }.' });
  }
  try {
    const refund = await stripe.refunds.create({ payment_intent: String(body.paymentIntent).slice(0, 60) });
    return res.status(200).json({ ok: true, refund: { id: refund.id, amount: refund.amount, status: refund.status } });
  } catch (err) {
    console.error('refund:', err);
    return res.status(502).json({ error: 'Refund failed — check the Stripe dashboard.' });
  }
}
