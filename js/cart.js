/* ============================================================================
   HER-mazing Touch — shopping cart

   Holds only { sku, qty, note } in localStorage. Prices are never stored or
   sent to the server for pricing purposes: the checkout function looks every
   price up again from shared/catalog.js, so editing localStorage cannot change
   what a customer is charged.
   ========================================================================== */

(function () {
  const KEY = 'hermazing.cart.v1';
  const C = window.CATALOG;
  if (!C) { console.error('catalog.js must load before cart.js'); return; }

  /* ---------------- state ---------------- */
  let lines = load();

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      // drop anything whose sku no longer exists in the catalogue
      return raw.filter(l => C.bySku[l.sku]).map(l => ({
        sku: l.sku,
        qty: Math.max(1, Math.min(99, parseInt(l.qty, 10) || 1)),
        note: typeof l.note === 'string' ? l.note.slice(0, 120) : ''
      }));
    } catch { return []; }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }

  const count = () => lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = () => lines.reduce((n, l) => n + C.bySku[l.sku].price * l.qty, 0);

  /* ---------------- mutations ---------------- */
  function add(sku, qty = 1, note = '') {
    if (!C.bySku[sku]) return;
    const found = lines.find(l => l.sku === sku && l.note === note);
    if (found) found.qty = Math.min(99, found.qty + qty);
    else lines.push({ sku, qty, note });
    save(); render(); flash(sku);
  }

  function setQty(i, qty) {
    if (!lines[i]) return;
    qty = parseInt(qty, 10) || 0;
    if (qty <= 0) lines.splice(i, 1);
    else lines[i].qty = Math.min(99, qty);
    save(); render();
  }

  function clear() { lines = []; save(); render(); }

  /* ---------------- DOM ---------------- */
  const els = {};
  function cache() {
    els.drawer   = document.getElementById('cartDrawer');
    els.scrim    = document.getElementById('cartScrim');
    els.body     = document.getElementById('cartBody');
    els.subtotal = document.getElementById('cartSubtotal');
    els.badge    = document.getElementById('cartBadge');
    els.checkout = document.getElementById('cartCheckout');
    els.notice   = document.getElementById('cartNotice');
    els.shipList = document.getElementById('cartShipping');
    els.extras   = document.getElementById('cartExtras');
    els.cardStyle= document.getElementById('cardStyle');
    els.cardMsg  = document.getElementById('cardMessage');
    els.noAddr   = document.getElementById('noAddress');
    els.noAddrHint = document.getElementById('noAddressHint');

    // greeting-card occasions come from the catalogue
    if (els.cardStyle && !els.cardStyle.options.length) {
      C.CARD_STYLES.forEach(s => {
        const o = document.createElement('option');
        o.value = o.textContent = s;
        els.cardStyle.appendChild(o);
      });
    }
    els.noAddr?.addEventListener('change', () => {
      els.noAddrHint.hidden = !els.noAddr.checked;
    });
  }

  function open()  { els.drawer.classList.add('open'); els.scrim.classList.add('show'); document.body.style.overflow = 'hidden'; }
  function close() { els.drawer.classList.remove('open'); els.scrim.classList.remove('show'); document.body.style.overflow = ''; }

  /** brief pulse on the cart button so an add is visible */
  function flash() {
    els.badge.classList.remove('pop');
    void els.badge.offsetWidth;   // restart the animation
    els.badge.classList.add('pop');
  }

  function render() {
    const n = count();
    els.badge.textContent = n;
    els.badge.hidden = n === 0;

    if (!lines.length) {
      els.body.innerHTML = '<p class="cart-empty">Your basket is empty.</p>';
      els.subtotal.textContent = C.money(0);
      els.checkout.disabled = true;
      els.notice.hidden = true;
      els.shipList.innerHTML = '';
      if (els.extras) els.extras.hidden = true;
      return;
    }

    els.body.innerHTML = '';
    lines.forEach((l, i) => {
      const p = C.bySku[l.sku];
      const row = document.createElement('div');
      row.className = 'cart-line';
      row.innerHTML = `
        <div class="cl-main">
          <p class="cl-name"></p>
          ${l.note ? '<p class="cl-note"></p>' : ''}
          ${p.shipping === 'local' ? '<p class="cl-local">Local delivery / pickup only</p>' : ''}
        </div>
        <div class="cl-qty">
          <button class="cl-step" data-act="dec" aria-label="Decrease quantity">&minus;</button>
          <span class="cl-num"></span>
          <button class="cl-step" data-act="inc" aria-label="Increase quantity">+</button>
        </div>
        <p class="cl-price"></p>
        <button class="cl-remove" data-act="rm" aria-label="Remove">&times;</button>`;

      // textContent (not innerHTML) so a personalisation note can never inject markup
      row.querySelector('.cl-name').textContent = p.name;
      if (l.note) row.querySelector('.cl-note').textContent = '“' + l.note + '”';
      row.querySelector('.cl-num').textContent = l.qty;
      row.querySelector('.cl-price').textContent = C.money(p.price * l.qty);

      row.addEventListener('click', e => {
        const act = e.target.dataset.act;
        if (act === 'inc') setQty(i, l.qty + 1);
        if (act === 'dec') setQty(i, l.qty - 1);
        if (act === 'rm')  setQty(i, 0);
      });
      els.body.appendChild(row);
    });

    els.subtotal.textContent = C.money(subtotal());
    els.checkout.disabled = false;
    if (els.extras) els.extras.hidden = false;

    const localOnly = C.hasLocalOnly(lines);
    els.notice.hidden = !localOnly;

    els.shipList.innerHTML = '';
    C.shippingFor(lines).forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.label} — ${s.amount ? C.money(s.amount) : 'Free'}`;
      els.shipList.appendChild(li);
    });
  }

  /* ---------------- checkout ---------------- */
  const NOT_CONNECTED =
    'Online payment isn’t switched on yet — you can still order by text and we’ll take payment directly.';

  /** Greeting card + "no address" choices, collected at send time. */
  function giftOptions() {
    return {
      cardStyle: els.cardStyle ? els.cardStyle.value : '',
      cardMessage: els.cardMsg ? els.cardMsg.value.trim().slice(0, 200) : '',
      noAddress: !!(els.noAddr && els.noAddr.checked)
    };
  }

  async function checkout() {
    els.checkout.disabled = true;
    els.checkout.textContent = 'Starting checkout…';
    try {
      const res = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines, gift: giftOptions() })
      });

      // When the function isn't deployed the server answers with an HTML error
      // page, so parse defensively rather than assuming JSON comes back.
      const raw = await res.text();
      let data = {};
      try { data = JSON.parse(raw); } catch { /* not JSON — handled below */ }

      if (!res.ok) throw new Error(data.error || NOT_CONNECTED);
      if (!data.url) throw new Error(NOT_CONNECTED);

      window.location.href = data.url;
    } catch (err) {
      els.checkout.disabled = false;
      els.checkout.textContent = 'Checkout';
      showError(err.message);
    }
  }

  function showError(msg) {
    let box = document.getElementById('cartError');
    if (!box) {
      box = document.createElement('p');
      box.id = 'cartError';
      box.className = 'cart-error';
      els.checkout.parentNode.insertBefore(box, els.checkout);
    }
    // network failure (offline, or opened as a file:// page) reads the same to a customer
    box.textContent = /failed to fetch|networkerror|load failed/i.test(msg) ? NOT_CONNECTED : msg;
  }

  /* ---------------- wiring ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    cache();
    if (!els.drawer) return;

    document.getElementById('cartOpen').addEventListener('click', () => { render(); open(); });
    document.getElementById('cartClose').addEventListener('click', close);
    els.scrim.addEventListener('click', close);
    els.checkout.addEventListener('click', checkout);
    document.getElementById('cartClear').addEventListener('click', clear);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    // add-to-cart buttons are injected onto the product cards by script.js
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-add-sku]');
      if (!btn) return;
      const card = btn.closest('[data-sku]');
      const input = card && card.querySelector('.pcard-personalise input');
      add(btn.dataset.addSku, 1, input ? input.value.trim() : '');
      open();
    });

    render();
  });

  window.CART = { add, clear, open, get lines() { return lines; } };
})();
