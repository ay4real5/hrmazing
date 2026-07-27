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

## Step 3 — Deploy to Netlify

GitHub Pages can only serve files — it cannot run the checkout code or keep a
secret key safe. Netlify can, and it is free at this scale.

1. Go to **https://app.netlify.com** and sign in with GitHub.
2. *Add new site → Import an existing project* → pick the `hrmazing` repo.
3. Leave the build settings as they are — `netlify.toml` already configures
   everything. Deploy.
4. Open **Site configuration → Environment variables** and add:

   | Key | Value |
   |---|---|
   | `STRIPE_SECRET_KEY` | your Stripe secret key (`sk_test_…`, then `sk_live_…`) |

5. **Redeploy** after adding the variable — functions only pick up environment
   variables on a fresh deploy.

### ⚠️ Never put the secret key in the code
It must only ever live in Netlify's environment variables. Anyone with that key
can charge cards and issue refunds on the account. `.gitignore` already blocks
`.env` files so it cannot be committed by accident. If it is ever exposed, roll
it immediately in the Stripe dashboard.

---

## Running it on your own machine

```bash
npm install
npm install -g netlify-cli
netlify dev          # serves the site AND the checkout function
```

Create a `.env` file (already git-ignored) with:

```
STRIPE_SECRET_KEY=sk_test_your_test_key_here
```

Opening `index.html` directly by double-clicking still works for browsing the
site, but checkout will not run — it needs `netlify dev`.

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

## Still to do before launch

These are business decisions, not code:

- [ ] Real prices and weights in `shared/catalog.js`
- [ ] Decide the local delivery radius, and what "local delivery" costs
- [ ] Trim the shipping country list in `netlify/functions/create-checkout.js`
      to places Kayyleb will actually post to
- [ ] Write a returns/refund policy — required by Stripe, and customers will ask.
      Personalised and perishable goods are normally excluded from the usual
      right to return; say so explicitly
- [ ] Add terms of service and a privacy policy
- [ ] Confirm whether sales tax needs collecting. Stripe Tax can handle this
      automatically, but somebody has to decide whether it applies
- [ ] Point a proper domain at the Netlify site
