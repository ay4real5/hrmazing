# Going Live — Setup Guide

The shop is fully built, but it is **not taking real money yet**. Three things
have to happen first. Work through them in order.

> **Right now:** prices are placeholders and no Stripe account is connected.
> If someone clicks *Checkout* today they get a friendly message telling them to
> text instead. Nothing can be charged by accident.

---

## Step 1 — Put in the real prices

Everything sold on the site lives in one file: **`shared/catalog.js`**.

Prices are written in **cents**, not dollars — `2800` means `$28.00`. This avoids
rounding errors, and it is the format Stripe requires.

```js
{ sku: 'candle-vanilla', name: 'Vanilla Bean Bliss', price: 2800, grams: 500, ... }
//                                                          ^^^^ $28.00
```

Change `price` on each line to the real amount, and set `grams` to the rough
posted weight (used for the shipping bands). Also update the `SHIPPING` block
lower down in the same file with real delivery charges.

**Do not edit prices anywhere else.** The product cards and the checkout both
read from this one file, so changing it here updates the whole site at once.

---

## Step 2 — Create the Stripe account

1. Sign up at **https://dashboard.stripe.com/register**.
2. Complete business verification. Stripe will ask for the legal business name,
   an address, and the bank account the money should be paid into. Payouts do
   not start until this is finished.
3. Turn on the payment methods you want (cards are on by default; Apple Pay and
   Google Pay are worth enabling — they convert well on phones).

### Test it before going live
Stripe starts in **test mode**. Use the test secret key first and pay with the
test card `4242 4242 4242 4242`, any future expiry, any CVC. No real money moves.
Only switch to the live key once a test order has gone through correctly.

---

## Step 3 — Deploy to Vercel

The site is deployed on Vercel. The checkout, admin and catalogue all run as
Vercel serverless functions in `/api/`.

1. Go to **https://vercel.com** and sign in with GitHub.
2. *Add New → Project* → import the `hrmazing` repo.
3. Vercel auto-detects the settings from `vercel.json`. Deploy.
4. Open **Settings → Environment Variables** and add:

   | Key | Value | Required for |
   |---|---|---|
   | `STRIPE_SECRET_KEY` | your Stripe secret key (`sk_test_…`, then `sk_live_…`) | Checkout + orders |
   | `ADMIN_PASSWORD` | a strong password you'll type at `/admin.html` | Admin login |
   | `JWT_SECRET` | a long random string (e.g. `openssl rand -hex 32`) | Admin login |
   | `UPSTASH_REDIS_REST_URL` | your Upstash Redis REST URL | Admin persistence |
   | `UPSTASH_REDIS_REST_TOKEN` | your Upstash Redis REST token | Admin persistence |

5. **Redeploy** after adding the variables — functions only pick up environment
   variables on a fresh deploy.

### ⚠️ Never put secrets in the code
They must only ever live in Vercel's environment variables. `.gitignore`
already blocks `.env` files so they cannot be committed by accident. If a key
is ever exposed, roll it immediately in the Stripe / Upstash dashboard.

---

## Admin section

The admin dashboard lives at **`/admin.html`** on your deployed site:

```
https://hrmazing.vercel.app/admin.html
```

It has four sections:

- **Dashboard** — stats (products, orders, revenue, customers), recent orders, top sellers
- **Products** — edit prices, names, categories, shipping scope, badges, hide/show products
- **Orders** — list Stripe checkout sessions, refund in full with one click
- **Settings** — announcement bar, contact email/phone, currency, placeholder flag

### Setting up the admin

1. **Set the env vars** (see Step 3 above): `ADMIN_PASSWORD`, `JWT_SECRET`,
   `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
2. **Create a free Upstash Redis database** at https://console.upstash.com.
   Copy the REST URL and REST token into the Vercel env vars. This is where
   product/settings overrides are stored. Without it, the admin still works
   but changes don't persist across deploys.
3. **Redeploy** on Vercel so the functions pick up the new env vars.
4. Visit `/admin.html`, type your `ADMIN_PASSWORD`, and you're in.

### Previewing the admin design locally

```
http://localhost:8890/admin.html?preview=1
```

The `?preview=1` flag loads the full UI with mock data — no backend, no env
vars, no login needed. Useful for checking the design before deploying.

### How admin auth works

- You type a password at `/admin.html`.
- `POST /api/auth` checks it against `ADMIN_PASSWORD` and returns a signed JWT
  (HS256, valid 12h).
- The JWT is stored in `localStorage` and sent as `Bearer` on every admin
  request.
- Every `/api/admin/*` route verifies the JWT with `JWT_SECRET` before doing
  anything.

No external identity service (Netlify Identity, Auth0, Clerk) is needed.

---

## Running it on your own machine

```bash
npm install
npm install -g vercel
vercel dev          # serves the site AND the API functions
```

Create a `.env` file (already git-ignored) with:

```
STRIPE_SECRET_KEY=sk_test_your_test_key_here
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
```

Opening `index.html` directly by double-clicking still works for browsing the
site, but checkout and admin will not run — they need `vercel dev`.

---

## How the money side works

- **Fees:** Stripe takes roughly 2.9% + 30¢ per successful card payment. Nothing
  is charged for failed payments, and there is no monthly fee.
- **Payouts:** land in the bank account on a rolling schedule (usually 2 days).
- **Orders:** appear under *Payments* in the Stripe dashboard, with the customer's
  address, phone number, gift message, and any engraving wording attached to the
  line item.
- **Refunds:** issued from that same dashboard in one click.

---

## Shipping rules already built in

Some products cannot be posted, and the site enforces this rather than relying
on anyone remembering:

| Product type | Fulfilment |
|---|---|
| Candles, engraved keepsakes, non-perishable boxes | Ship worldwide |
| Fresh flowers, chocolate-dipped strawberries | **Local delivery / pickup only** |
| Money bouquets | **Local delivery / pickup only** |

If a basket contains any local-only item, the checkout will only offer pickup and
local delivery, and will not accept an overseas address. This is set per product
with `shipping: 'local'` in `shared/catalog.js`.

Two reasons for the cash restriction: posted cash is not insurable and is a
common fraud target. For perishables, the reason is simply that fresh fruit and
flowers will not survive an international transit and customs.

---

## ⚠️ After changing anything in `images/`

Run this, or returning visitors will keep seeing the old picture:

```bash
python tools/stamp-assets.py
```

Images are served with `max-age=31536000, immutable` (see `netlify.toml`), which
is good for speed but means a browser holds its copy for a year. Since filenames
never change, swapping `logo.webp` would leave everyone who had already visited
looking at the previous artwork — and you cannot ask customers to hard-refresh.

The script appends a hash of each file's contents to its URL
(`images/logo.webp?v=156e9ed4`). Change the file, the hash changes, the browser
fetches it. It is safe to run any time.

---

## Email address

The site uses `hello@hermazingtouch.com` throughout — **this is a placeholder**.
Replace it everywhere with a real address:

```bash
grep -rl "hello@hermazingtouch.com" . --exclude-dir=node_modules
```

It appears in `index.html`, `js/shop.js` and the policy pages.

---

## Live chat

The chat widget is **not connected to a live agent**, and it does not pretend to be.
It greets the visitor, takes their message, then hands off to text or email — and
outside 9am–7pm Mon–Sat it says so up front rather than leaving someone waiting for
a reply that isn't coming.

To connect a real chat service (Tawk.to and Crisp both have free tiers):

1. Create an account and copy their embed snippet.
2. Paste it just before `</body>` in `index.html`.
3. Hide the built-in launcher so there aren't two chat buttons:
   ```css
   .chat-launch, .chat-panel { display: none; }
   ```
4. Point the "Start a chat" button on the Contact tab at the provider's API instead.

Opening hours live in `js/shop.js` (`isOpenNow`) — adjust if they change.

---

## Still to do before launch

These are business decisions, not code:

- [ ] Real prices and weights in `shared/catalog.js` (or set them via `/admin.html`)
- [ ] Decide the local delivery radius, and what "local delivery" costs
- [ ] Trim the shipping country list in `api/checkout.js`
      to places Kayyleb will actually post to
- [ ] Write a returns/refund policy — required by Stripe, and customers will ask.
      Personalised and perishable goods are normally excluded from the usual
      right to return; say so explicitly
- [ ] Add terms of service and a privacy policy
- [ ] Confirm whether sales tax needs collecting. Stripe Tax can handle this
      automatically, but somebody has to decide whether it applies
- [ ] Point a proper domain at the Vercel site
