/* ============================================================================
   Creates a Stripe Checkout Session.

   SECURITY: the browser sends only { sku, qty, note }. Every price is looked
   up again from shared/catalog.js on the server, so editing the cart in
   localStorage or devtools cannot change what is charged.

   Requires the STRIPE_SECRET_KEY environment variable (set in the Netlify
   dashboard — never commit it). See SETUP.md.
   ========================================================================== */

const Stripe = require('stripe');
const catalog = require('../../shared/catalog.js');

const MAX_QTY = 99;
const MAX_LINES = 40;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return json(500, {
      error: 'Payments are not configured yet. Add STRIPE_SECRET_KEY in Netlify — see SETUP.md.'
    });
  }

  let lines;
  try {
    ({ lines } = JSON.parse(event.body || '{}'));
  } catch {
    return json(400, { error: 'Malformed request.' });
  }

  if (!Array.isArray(lines) || !lines.length) {
    return json(400, { error: 'Your basket is empty.' });
  }
  if (lines.length > MAX_LINES) {
    return json(400, { error: 'Too many items in one order — please split it or contact us.' });
  }

  // Rebuild every line from the catalogue. Anything unknown is rejected outright.
  const items = [];
  for (const line of lines) {
    const product = catalog.bySku[line.sku];
    if (!product) return json(400, { error: `Unknown item: ${line.sku}` });

    const qty = Math.floor(Number(line.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > MAX_QTY) {
      return json(400, { error: `Invalid quantity for ${product.name}.` });
    }

    const note = typeof line.note === 'string' ? line.note.trim().slice(0, 120) : '';

    items.push({
      quantity: qty,
      price_data: {
        currency: catalog.CURRENCY,
        unit_amount: product.price,              // ← server-side price, always
        product_data: {
          name: product.name,
          metadata: { sku: product.sku },
          ...(note ? { description: `Personalisation: ${note}` } : {})
        }
      }
    });
  }

  // Perishable / cash items restrict the whole order to local fulfilment.
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
    event.headers.origin ||
    (event.headers.host ? `https://${event.headers.host}` : '');

  try {
    const stripe = Stripe(key);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items,
      shipping_options: shipping,
      shipping_address_collection: {
        // cash + perishables never leave the country
        allowed_countries: localOnly ? ['US'] : SHIPPING_COUNTRIES
      },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'auto',
      custom_fields: [{
        key: 'gift_message',
        label: { type: 'custom', custom: 'Gift message (optional)' },
        type: 'text',
        optional: true
      }],
      metadata: { local_only: String(localOnly) },
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel.html`
    });

    return json(200, { url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    // Never leak Stripe internals to the browser.
    return json(502, { error: 'We could not start checkout. Please try again, or text us to order.' });
  }
};

/* A conservative worldwide list. Trim it to where Kayyleb will actually post. */
const SHIPPING_COUNTRIES = [
  'US','CA','GB','IE','AU','NZ','DE','FR','ES','IT','NL','BE','AT','CH','SE','NO','DK','FI',
  'PL','PT','CZ','GR','RO','HU','NG','GH','KE','ZA','AE','SA','QA','IN','SG','MY','JP','KR',
  'BR','MX','AR','CL','JM','TT','BB'
];

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body)
  };
}
