/* ============================================================================
   POST /api/checkout  { lines, gift }  →  { url }
   Creates a Stripe Checkout Session. Server-side pricing from shared/catalog.js.
   Requires STRIPE_SECRET_KEY env var.
   ========================================================================== */

const Stripe = require('stripe');
const { effectiveCatalog } = require('./store-helpers');

const MAX_QTY = 99;
const MAX_LINES = 40;

const SHIPPING_COUNTRIES = [
  'US','CA','GB','IE','AU','NZ','DE','FR','ES','IT','NL','BE','AT','CH','SE','NO','DK','FI',
  'PL','PT','CZ','GR','RO','HU','NG','GH','KE','ZA','AE','SA','QA','IN','SG','MY','JP','KR',
  'BR','MX','AR','CL','JM','TT','BB'
];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'Payments are not configured yet. Add STRIPE_SECRET_KEY in Vercel — see SETUP.md.'
    });
  }

  const raw = req.body;
  let body = {};
  if (typeof raw === 'string') {
    try { body = JSON.parse(raw || '{}'); } catch { return res.status(400).json({ error: 'Malformed request.' }); }
  } else if (raw && typeof raw === 'object') {
    body = raw;
  }

  const { lines, gift: rawGift } = body;
  const gift = rawGift && typeof rawGift === 'object' ? rawGift : {};

  if (!Array.isArray(lines) || !lines.length) {
    return res.status(400).json({ error: 'Your basket is empty.' });
  }
  if (lines.length > MAX_LINES) {
    return res.status(400).json({ error: 'Too many items in one order — please split it or contact us.' });
  }

  const catalog = await effectiveCatalog();

  const items = [];
  for (const line of lines) {
    const product = catalog.bySku[line.sku];
    if (!product || product.hidden) {
      return res.status(400).json({ error: `Unknown item: ${line.sku}` });
    }
    const qty = Math.floor(Number(line.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > MAX_QTY) {
      return res.status(400).json({ error: `Invalid quantity for ${product.name}.` });
    }
    const note = typeof line.note === 'string' ? line.note.trim().slice(0, 120) : '';
    items.push({
      quantity: qty,
      price_data: {
        currency: catalog.CURRENCY,
        unit_amount: product.price,
        product_data: {
          name: product.name,
          metadata: { sku: product.sku },
          ...(note ? { description: `Personalisation: ${note}` } : {})
        }
      }
    });
  }

  const localOnly = catalog.hasLocalOnly(lines);
  const shipping = catalog.shippingFor(lines).map(s => ({
    shipping_rate_data: {
      type: 'fixed_amount',
      display_name: s.label,
      fixed_amount: { amount: s.amount, currency: catalog.CURRENCY },
      delivery_estimate: {
        minimum: { unit: 'business_day', value: s.days[0] },
        maximum: { unit: 'business_day', value: s.days[1] }
      }
    }
  }));

  const origin =
    req.headers.origin ||
    (req.headers.host ? `https://${req.headers.host}` : '');

  const clean = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
  const cardStyle   = clean(gift.cardStyle, 40);
  const cardMessage = clean(gift.cardMessage, 200);
  const noAddress   = gift.noAddress === true;

  try {
    const stripe = Stripe(key);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items,
      ...(noAddress ? {} : {
        shipping_options: shipping,
        shipping_address_collection: {
          allowed_countries: localOnly ? ['US'] : SHIPPING_COUNTRIES
        }
      }),
      phone_number_collection: { enabled: true },
      billing_address_collection: 'auto',
      custom_fields: noAddress ? [{
        key: 'recipient_contact',
        label: { type: 'custom', custom: "Recipient's phone or email" },
        type: 'text', optional: false
      }] : [],
      metadata: {
        local_only: String(localOnly),
        no_address: String(noAddress),
        card_style: cardStyle,
        card_message: cardMessage
      },
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel.html`
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(502).json({ error: 'We could not start checkout. Please try again, or text us to order.' });
  }
};
