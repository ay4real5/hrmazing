# HER-mazing Touch — Website & Shop

Mobile-friendly site for HER-mazing Touch — scented candles, gift sets and custom
engraving — with online payment via Stripe and worldwide shipping.

> ### ⚠️ Not live yet
> Prices are **placeholders** and no Stripe account is connected, so nothing can
> be charged. Follow **[SETUP.md](SETUP.md)** to put in real prices, connect
> Stripe and deploy. Until then the site still works as a shopfront and every
> page drives to **571-575-7174**.

## Structure

- `index.html` — the entire site (single page with tab-based navigation: Home, Candles, Gift Sets, Custom Engraving, Contact)
- `css/style.css` — all styling, colors, and responsive layout
- `js/script.js` — tab switching, mobile menu, gift-set occasion filters, scroll animations
- `images/` — brand assets
- `shared/catalog.js` — **every product, price and shipping rule** (edit prices here only)
- `js/cart.js` — basket, drawer and checkout hand-off
- `netlify/functions/create-checkout.js` — creates the Stripe Checkout session
- `success.html` / `cancel.html` — post-payment pages

## How payment works

The browser only ever sends `{ sku, qty, note }`. The checkout function looks
every price up again from `shared/catalog.js`, so editing the basket in devtools
or localStorage cannot change what a customer is charged. Card details are
entered on Stripe's own hosted page and never touch this site.

Perishable items (fresh flowers, chocolate-dipped strawberries) and money
bouquets are marked `shipping: 'local'` and are automatically restricted to
pickup or local delivery — the checkout will not accept an overseas address for
them.

## Brand assets

| File | Used for |
|---|---|
| `logo.webp` | full lockup (basket + wordmark) — hero |
| `logo-mark.webp` | basket only — header, preloader, footer |
| `favicon.png` | browser tab icon |
| `gift-bag.webp` | packaging photo on the Home tab |
| `logo.png` | **archival full-quality logo with transparency** — not used by the site; keep this one for print, Instagram, packaging etc. |

The original artwork came on a solid black field. The black was removed with an
edge-connected flood fill (rather than a brightness threshold, which would have eaten
the chocolate-dipped strawberries), so the logo now drops cleanly onto any background.

No build step, no dependencies, no backend required.

## Viewing the site locally

Just open `index.html` in any browser (double-click it, or right-click → Open With → your browser).

## Design

Colours are taken from the brand gift bag: espresso brown, gold foil, candlelight amber,
blush-peach roses, cream and wicker. The thin gold double-rule frame and the small gold
diamond ornament are reused throughout as brand motifs.

## Updating content

- **Product cards**: each card lives in `index.html` inside the relevant
  `<section data-panel="candles|gifts|engraving">` block. Copy an existing `.pcard`
  block and edit the text.
- **Illustrations**: all product art is hand-built SVG in the `ART` object at the top of
  `js/script.js` (`candle`, `basket`, `box`, `bouquet`, `money`, `tag`, `tumbler`, `mug`,
  `emblem`, `mat`, `wood`). A card picks one via `data-art="box"`; candle cards get the jar
  automatically. Each card's `--tint` sets its background glow and `--wax` sets candle colour.
- **Using real photos instead**: replace the contents of a card's
  `<div class="pcard-art"></div>` with `<img src="images/your-photo.jpg" alt="...">`
  and remove its `data-art` attribute.
- **Logo**: the header/hero use a gold gradient script wordmark. To use the real logo image,
  drop it in an `images/` folder and swap the `.brand` markup for an `<img>`.
- **Phone number**: search for `5715757174` in `index.html` to update every call/text link.

## Hosting

This is a static site, so it can be hosted for free on GitHub Pages, Netlify, or Vercel — just push this repo and point the host at the root folder.
