# HER-mazing Touch — Website

A simple, mobile-friendly advertisement website for HER-mazing Touch — a small business offering scented candles, gift sets, and custom engraving. Built to drive customers to call or text **571-575-7174** to order (no online checkout yet).

## Structure

- `index.html` — the entire site (single page with tab-based navigation: Home, Candles, Gift Sets, Custom Engraving, Contact)
- `css/style.css` — all styling, colors, and responsive layout
- `js/script.js` — tab switching, mobile menu, gift-set occasion filters, scroll animations

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
