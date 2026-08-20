/* ============================================================================
   HER-mazing Touch — admin dashboard (Vercel)
   Auth: password → JWT (POST /api/auth). No external identity service.
   API:  /api/admin/products, /api/admin/orders, /api/admin/settings
   Preview mode: ?preview=1 shows the UI with mock data (no backend needed).
   ========================================================================== */

(function () {
  'use strict';

  const API = '/api';
  const PREVIEW = new URLSearchParams(location.search).has('preview');
  const TOKEN_KEY = 'hermazing.admin.token';

  /* ---------- mock data for preview ---------- */
  const MOCK = {
    products: [
      { sku: 'candle-vanilla', name: 'Vanilla Bean Bliss', category: 'Candles', price: 2800, grams: 500, shipping: 'worldwide' },
      { sku: 'candle-lavender', name: 'Lavender Fields', category: 'Candles', price: 2800, grams: 500, shipping: 'worldwide' },
      { sku: 'candle-fall', name: 'Make Me Fall', category: 'Candles', price: 3200, grams: 500, shipping: 'worldwide', badge: 'Signature', bestSeller: true },
      { sku: 'candle-winter', name: 'Winter Wonderland', category: 'Candles', price: 3200, grams: 500, shipping: 'worldwide' },
      { sku: 'gift-rose-basket', name: 'Rose & Chocolate Basket', category: 'Gift Sets', price: 8500, grams: 2200, shipping: 'local', note: 'Local delivery or pickup only.', bestSeller: true },
      { sku: 'gift-dad-box', name: "Dad's Deluxe Box", category: 'Gift Sets', price: 7500, grams: 1800, shipping: 'worldwide' },
      { sku: 'gift-grad-money', name: 'Grad Cap Money Bouquet', category: 'Gift Sets', price: 6500, grams: 700, shipping: 'local' },
      { sku: 'eng-tumbler', name: 'Engraved Tumbler', category: 'Engraving', price: 3400, grams: 600, shipping: 'worldwide', personalise: true, bestSeller: true },
      { sku: 'eng-emblem', name: 'Family Name Emblem', category: 'Engraving', price: 5800, grams: 1400, shipping: 'worldwide', personalise: true },
      { sku: 'eng-mug', name: 'Engraved Mug', category: 'Engraving', price: 2600, grams: 550, shipping: 'worldwide', personalise: true },
    ],
    shipping: [
      { id: 'pickup', label: 'Local pickup', amount: 0, scope: 'local', days: [1, 3] },
      { id: 'local', label: 'Local delivery', amount: 900, scope: 'local', days: [1, 3] },
      { id: 'domestic', label: 'Standard shipping (US)', amount: 1200, scope: 'worldwide', days: [3, 7] },
      { id: 'express', label: 'Express shipping (US)', amount: 2400, scope: 'worldwide', days: [1, 3] },
      { id: 'intl', label: 'International shipping', amount: 3900, scope: 'worldwide', days: [7, 21] },
    ],
    cardStyles: ['Birthday','Congratulations','Just Because','With Love','Thank You','Wedding','Housewarming','New Baby','Sympathy','Holiday'],
    orders: [
      { id: 'cs_demo_1', created: Math.floor(Date.now()/1000)-3600, status: 'complete', paymentStatus: 'paid', amountTotal: 12300, currency: 'usd', customerName: 'Avery M.', customerEmail: 'avery@example.com', phone: '571-555-0101', lineItems: [{ description: 'Make Me Fall', quantity: 1 }, { description: 'Engraved Tumbler', quantity: 1 }], metadata: { card_style: 'Birthday', card_message: 'Happy birthday! Love you.' }, paymentIntent: 'pi_demo_1' },
      { id: 'cs_demo_2', created: Math.floor(Date.now()/1000)-86400, status: 'complete', paymentStatus: 'paid', amountTotal: 8500, currency: 'usd', customerName: 'Jordan R.', customerEmail: 'jordan@example.com', phone: '571-555-0102', lineItems: [{ description: 'Rose & Chocolate Basket', quantity: 1 }], metadata: { card_style: 'Thank You' }, paymentIntent: 'pi_demo_2' },
      { id: 'cs_demo_3', created: Math.floor(Date.now()/1000)-172800, status: 'complete', paymentStatus: 'paid', amountTotal: 6400, currency: 'usd', customerName: 'Morgan S.', customerEmail: 'morgan@example.com', phone: '571-555-0103', lineItems: [{ description: 'Vanilla Bean Bliss', quantity: 2 }], metadata: { card_style: 'Just Because' }, paymentIntent: 'pi_demo_3' },
      { id: 'cs_demo_4', created: Math.floor(Date.now()/1000)-259200, status: 'open', paymentStatus: 'unpaid', amountTotal: 3400, currency: 'usd', customerName: 'Riley K.', customerEmail: 'riley@example.com', lineItems: [{ description: 'Engraved Mug', quantity: 1 }], metadata: {}, paymentIntent: null },
    ],
    settings: {
      currency: 'usd', pricesArePlaceholders: true, announcement: 'Complimentary greeting card with every order',
      email: 'hello@hermazingtouch.com', phone: '571-575-7174'
    }
  };

  /* ========================================================================
     Auth — password gate → JWT stored in localStorage
     ====================================================================== */
  const loginGate = document.getElementById('loginGate');
  const app       = document.getElementById('app');
  const userEmail = document.getElementById('userEmail');
  const userAvatar= document.getElementById('userAvatar');

  function getToken() {
    if (PREVIEW) return 'preview-token';
    return localStorage.getItem(TOKEN_KEY) || '';
  }
  function setToken(t) { localStorage.setItem(TOKEN_KEY, t); }
  function clearToken() { localStorage.removeItem(TOKEN_KEY); }

  function showLogin() { loginGate.hidden = false; app.hidden = true; }
  function showApp() {
    loginGate.hidden = true; app.hidden = false;
    userEmail.textContent = PREVIEW ? 'Preview User' : 'Admin';
    userAvatar.textContent = PREVIEW ? 'P' : 'A';
    document.getElementById('previewPill').hidden = !PREVIEW;
    initNav(); loadProducts(); loadSettings(); updateDashboard();
  }

  async function authedFetch(path, opts) {
    if (PREVIEW) {
      const key = path.replace('/api/', '').replace(/\?.*/, '');
      if (key === 'admin/products') return { products: MOCK.products, shipping: MOCK.shipping, cardStyles: MOCK.cardStyles };
      if (key === 'admin/orders') return { orders: MOCK.orders, hasMore: false };
      if (key === 'admin/settings') return { settings: MOCK.settings };
      return { ok: true };
    }
    opts = opts || {};
    opts.headers = Object.assign({ Authorization: `Bearer ${getToken()}` }, opts.headers || {});
    const res = await fetch(path, opts);
    const raw = await res.text();
    let data = {};
    try { data = JSON.parse(raw); } catch {}
    if (res.status === 401) { clearToken(); showLogin(); throw new Error('Session expired.'); }
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }

  /* ---------- login form ---------- */
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const errEl = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');
    const password = e.target.password.value;
    errEl.hidden = true;
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Signing in…';

    if (PREVIEW) { showApp(); return; }

    try {
      const res = await fetch(`${API}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');
      setToken(data.token);
      showApp();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.hidden = false;
    } finally {
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Sign in';
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (PREVIEW) { location.search = ''; return; }
    clearToken();
    showLogin();
  });

  /* ---------- auto-enter on load ---------- */
  if (PREVIEW) { showApp(); }
  else if (getToken()) { showApp(); }
  else { showLogin(); }

  /* ========================================================================
     Navigation
     ====================================================================== */
  function initNav() {
    document.querySelectorAll('.nav-item, [data-go]').forEach(el => {
      el.addEventListener('click', () => {
        const name = el.dataset.atab || el.dataset.go;
        switchTab(name);
        if (name === 'orders' && !ordersLoaded) loadOrders();
      });
    });
  }

  function switchTab(name) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('is-active', n.dataset.atab === name));
    document.querySelectorAll('.atab-panel').forEach(p => p.classList.toggle('is-active', p.dataset.atabPanel === name));
    document.getElementById('topBreadcrumb').textContent = name.charAt(0).toUpperCase() + name.slice(1);
  }

  /* ========================================================================
     Products
     ====================================================================== */
  let products = [], shipping = [], cardStyles = [], dirty = false;
  let ordersLoaded = false;

  const prodSearch = document.getElementById('prodSearch');
  const prodChips  = document.getElementById('prodChips');
  const prodsGrid  = document.getElementById('prodsGrid');
  const shipList   = document.getElementById('shipList');
  const saveAllBtn = document.getElementById('saveAllBtn');

  async function loadProducts() {
    prodsGrid.innerHTML = '<div class="loading-pulse">Loading the atelier…</div>';
    try {
      const data = await authedFetch(`${API}/admin/products`);
      products = data.products || [];
      shipping = data.shipping || [];
      cardStyles = data.cardStyles || [];
      document.getElementById('cardStylesInput').value = cardStyles.join(', ');
      renderChips(); renderProducts(); renderShipping(); markClean();
    } catch (err) { toast(err.message, 'error'); }
  }

  function renderChips() {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
    prodChips.innerHTML = '<button class="chip is-active" data-cat="">All</button>' +
      cats.map(c => `<button class="chip" data-cat="${escapeAttr(c)}">${escapeHtml(c)}</button>`).join('');
    prodChips.querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
      prodChips.querySelectorAll('.chip').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active'); renderProducts();
    }));
  }

  function renderProducts() {
    const q = prodSearch.value.trim().toLowerCase();
    const cat = prodChips.querySelector('.chip.is-active')?.dataset.cat || '';
    const list = products.filter(p => {
      const mq = !q || `${p.name} ${p.sku}`.toLowerCase().includes(q);
      const mc = !cat || p.category === cat;
      return mq && mc;
    });
    if (!list.length) { prodsGrid.innerHTML = '<div class="loading-pulse">No matches in the atelier.</div>'; return; }
    prodsGrid.innerHTML = list.map(p => {
      const realIdx = products.indexOf(p);
      const catClass = (p.category||'').toLowerCase().includes('candle') ? 'art-candle' : (p.category||'').toLowerCase().includes('gift') ? 'art-gift' : 'art-engrave';
      const flags = [];
      if (p.bestSeller) flags.push('<span class="chip gold">★ Best seller</span>');
      if (p.personalise) flags.push('<span class="chip">Personalised</span>');
      if (p.shipping === 'local') flags.push('<span class="chip local">Local only</span>');
      if (p.badge) flags.push(`<span class="chip">${escapeHtml(p.badge)}</span>`);
      return `
        <article class="prod-card glass ${p.hidden ? 'is-hidden' : ''}">
          ${p.hidden ? '<span class="prod-hidden">Hidden</span>' : ''}
          <div class="prod-art">${productSvg(catClass)}</div>
          <div class="prod-cat">${escapeHtml(p.category)}</div>
          <h3 class="prod-name">${escapeHtml(p.name)}</h3>
          <div class="prod-price">$${(p.price/100).toFixed(2)} <small>· ${p.grams}g</small></div>
          <div class="prod-meta">${flags.join('')}</div>
          <div class="actions">
            <button class="prod-btn gold" data-edit="${realIdx}">Edit</button>
          </div>
        </article>`;
    }).join('');
  }

  function productSvg(cls) {
    return `<svg class="art-illo ${cls}" viewBox="0 0 120 120" width="90" height="90" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M60 25 c12 0 22 10 22 30 0 18-10 38-22 48 -12-10-22-30-22-48 0-20 10-30 22-30z" opacity=".9" fill="currentColor" fill-opacity=".08"/>
      <path d="M60 25 c12 0 22 10 22 30 0 18-10 38-22 48 -12-10-22-30-22-48 0-20 10-30 22-30z"/>
      <path d="M55 15 h10" stroke-width="2.2"/>
      <ellipse cx="60" cy="100" rx="26" ry="5" opacity=".3"/>
    </svg>`;
  }

  prodSearch.addEventListener('input', renderProducts);
  prodsGrid.addEventListener('click', e => {
    const btn = e.target.closest('[data-edit]');
    if (btn) openProductDrawer(parseInt(btn.dataset.edit, 10));
  });

  /* ---------- shipping ---------- */
  function renderShipping() {
    shipList.innerHTML = shipping.map((s, i) => `
      <div class="ship-row" data-ship="${i}">
        <input class="input" data-f="id" value="${escapeAttr(s.id)}" placeholder="id">
        <input class="input" data-f="label" value="${escapeAttr(s.label)}" placeholder="Label">
        <input class="input" data-f="amount" type="number" min="0" value="${s.amount}" placeholder="cents">
        <select class="input" data-f="scope"><option value="worldwide" ${s.scope==='worldwide'?'selected':''}>World</option><option value="local" ${s.scope==='local'?'selected':''}>Local</option></select>
        <input class="input" data-f="days" value="${(s.days||[]).join('-')}" placeholder="min-max">
        <button class="ship-del" data-ship-del="${i}">&times;</button>
      </div>`).join('');
  }
  shipList.addEventListener('input', markDirty);
  shipList.addEventListener('click', e => {
    const del = e.target.closest('[data-ship-del]');
    if (!del) return;
    shipping.splice(parseInt(del.dataset.shipDel, 10), 1);
    renderShipping(); markDirty();
  });
  document.getElementById('addShipBtn').addEventListener('click', () => {
    shipping.push({ id: 'new', label: 'New option', amount: 0, scope: 'worldwide', days: [3, 7] });
    renderShipping(); markDirty();
  });
  document.getElementById('cardStylesInput').addEventListener('input', markDirty);

  /* ---------- product drawer ---------- */
  const drawer = document.getElementById('prodDrawer');
  const prodForm = document.getElementById('prodForm');

  function openProductDrawer(idx) {
    const isNew = idx === -1;
    const p = isNew ? { sku:'', name:'', price:0, grams:0, category:'', shipping:'worldwide' } : products[idx];
    document.getElementById('drawerTitle').textContent = isNew ? 'New creation' : `Edit · ${p.sku}`;
    document.getElementById('prodDeleteBtn').hidden = isNew;
    prodForm._index.value = idx;
    prodForm.sku.value = p.sku || '';
    prodForm.name.value = p.name || '';
    prodForm.category.value = p.category || '';
    prodForm.price.value = p.price || 0;
    prodForm.grams.value = p.grams || 0;
    prodForm.shipping.value = p.shipping || 'worldwide';
    prodForm.badge.value = p.badge || '';
    prodForm.note.value = p.note || '';
    prodForm.contents.value = (p.contents || []).join('\n');
    prodForm.personalise.checked = !!p.personalise;
    prodForm.bestSeller.checked = !!p.bestSeller;
    prodForm.hidden.checked = !!p.hidden;
    drawer.classList.add('is-open');
  }
  function closeDrawer() { drawer.classList.remove('is-open'); }

  document.getElementById('prodDeleteBtn').addEventListener('click', async () => {
    const idx = parseInt(prodForm._index.value, 10);
    if (!confirm(`Delete "${products[idx].name}"?`)) return;
    products.splice(idx, 1);
    renderProducts(); renderChips();
    try { await saveAll(); closeDrawer(); }
    catch (err) { markDirty(); }
  });
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  document.getElementById('drawerScrim').addEventListener('click', closeDrawer);
  document.getElementById('addProductBtn').addEventListener('click', () => openProductDrawer(-1));

  prodForm.addEventListener('submit', e => {
    e.preventDefault();
    const idx = parseInt(prodForm._index.value, 10);
    const data = {
      sku: prodForm.sku.value.trim(), name: prodForm.name.value.trim(),
      category: prodForm.category.value.trim(),
      price: Math.round(Number(prodForm.price.value)),
      grams: Math.round(Number(prodForm.grams.value) || 0),
      shipping: prodForm.shipping.value,
      badge: prodForm.badge.value.trim(),
      note: prodForm.note.value.trim(),
      contents: prodForm.contents.value.split('\n').map(s => s.trim()).filter(Boolean),
      personalise: prodForm.personalise.checked,
      bestSeller: prodForm.bestSeller.checked,
      hidden: prodForm.hidden.checked
    };
    if (idx === -1) products.push(data);
    else products[idx] = Object.assign({}, products[idx], data);
    renderProducts(); renderChips();
    try {
      await saveAll();
      closeDrawer();
    } catch (err) {
      markDirty();
    }
  });

  function markDirty() { dirty = true; saveAllBtn.disabled = false; }
  function markClean() { dirty = false; saveAllBtn.disabled = true; }

  async function saveAll() {
    saveAllBtn.textContent = 'Saving…'; saveAllBtn.disabled = true;
    const shipOut = [...shipList.querySelectorAll('.ship-row')].map(r => {
      const days = r.querySelector('[data-f="days"]').value.split('-').map(n => parseInt(n, 10) || 0);
      return {
        id: r.querySelector('[data-f="id"]').value.trim(),
        label: r.querySelector('[data-f="label"]').value.trim(),
        amount: Math.round(Number(r.querySelector('[data-f="amount"]').value) || 0),
        scope: r.querySelector('[data-f="scope"]').value,
        days: [days[0] || 1, days[1] || 7]
      };
    });
    const cards = document.getElementById('cardStylesInput').value.split(',').map(s => s.trim()).filter(Boolean);
    try {
      await authedFetch(`${API}/admin/products`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products, shipping: shipOut, cardStyles: cards })
      });
      markClean();
      saveAllBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save';
      toast('Changes saved. The storefront is live.', 'ok');
    } catch (err) {
      saveAllBtn.textContent = 'Save';
      toast('Save failed: ' + err.message, 'error');
    }
  }
  saveAllBtn.addEventListener('click', saveAll);

  /* ========================================================================
     Dashboard
     ====================================================================== */
  function updateDashboard() {
    document.getElementById('statProducts').textContent = products.length;
    let revenue = 0;
    MOCK.orders.forEach(o => { if (o.paymentStatus === 'paid' && !o.refunded) revenue += o.amountTotal; });
    document.getElementById('statOrders').textContent = MOCK.orders.length;
    document.getElementById('statRevenue').textContent = '$' + (revenue/100).toFixed(0);
    document.getElementById('statCustomers').textContent = [...new Set(MOCK.orders.map(o => o.customerEmail))].length;

    const dashOrders = document.getElementById('dashOrders');
    dashOrders.innerHTML = MOCK.orders.slice(0,4).map(o => {
      const date = new Date(o.created*1000).toLocaleDateString();
      const first = (o.lineItems && o.lineItems[0] && o.lineItems[0].description) || '—';
      const count = (o.lineItems && o.lineItems.length) || 0;
      return `<div class="order-mini">
        <div class="om-left">
          <span class="om-name">${escapeHtml(o.customerName || o.customerEmail)}</span>
          <span class="om-meta">${date} · ${first}${count > 1 ? ` +${count-1}` : ''}</span>
        </div>
        <div class="om-total">$${(o.amountTotal/100).toFixed(2)}</div>
      </div>`;
    }).join('');

    const top = [...products].sort((a,b) => (b.bestSeller?1:0)-(a.bestSeller?1:0)).slice(0,4);
    document.getElementById('dashTopSellers').innerHTML = top.map((p,i) => `
      <div class="top-item">
        <span class="top-rank">0${i+1}</span>
        <span class="top-name">${escapeHtml(p.name)}</span>
        <span class="top-price">$${(p.price/100).toFixed(2)}</span>
      </div>`).join('');
  }

  /* ========================================================================
     Orders
     ====================================================================== */
  const ordersGrid = document.getElementById('ordersGrid');
  const orderChips = document.getElementById('orderChips');

  orderChips.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    orderChips.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    renderOrders();
  });

  async function loadOrders() {
    ordersLoaded = true;
    ordersGrid.innerHTML = '<div class="loading-pulse">Summoning orders…</div>';
    try {
      const data = await authedFetch(`${API}/admin/orders?limit=50`);
      MOCK.orders = data.orders || [];
      renderOrders(); updateDashboard();
    } catch (err) {
      ordersGrid.innerHTML = `<div class="empty-banner">${escapeHtml(err.message)}<br><span>Set STRIPE_SECRET_KEY in Vercel env vars to load real orders.</span></div>`;
    }
  }

  function renderOrders() {
    const filter = orderChips.querySelector('.chip.is-active').dataset.filter;
    const list = MOCK.orders.filter(o => filter === 'all' || o.paymentStatus === filter || (filter === 'refunded' && o.refunded));
    if (!list.length) { ordersGrid.innerHTML = '<div class="loading-pulse">No orders in this light.</div>'; return; }
    ordersGrid.innerHTML = list.map(o => {
      const date = new Date(o.created * 1000).toLocaleString();
      const status = o.refunded ? 'refunded' : o.paymentStatus;
      const canRefund = o.paymentStatus === 'paid' && !o.refunded && o.paymentIntent;
      const items = (o.lineItems || []).map(li => `<span class="oi-chip">${escapeHtml(li.description)} ×${li.quantity || 1}</span>`).join('');
      return `<article class="order-card glass">
        <div class="order-head">
          <div>
            <div class="order-customer">${escapeHtml(o.customerName || 'Guest')}</div>
            <div class="order-email">${escapeHtml(o.customerEmail || '')}</div>
          </div>
          <div class="order-total">$${(o.amountTotal/100).toFixed(2)}</div>
        </div>
        <div class="order-items">${items || '<span class="oi-chip">No items</span>'}</div>
        <div class="order-foot">
          <span class="order-date">${date}</span>
          <div class="order-actions">
            <span class="status-pill ${status}">${status}</span>
            ${canRefund ? `<button class="order-refund" data-refund="${o.paymentIntent}">Refund</button>` : ''}
          </div>
        </div>
      </article>`;
    }).join('');
  }

  ordersGrid.addEventListener('click', async e => {
    const btn = e.target.closest('[data-refund]');
    if (!btn) return;
    if (PREVIEW) { toast('Refunds are simulated in preview mode.', 'ok'); return; }
    if (!confirm('Refund in full? This cannot be undone.')) return;
    btn.disabled = true; btn.textContent = 'Refunding…';
    try {
      await authedFetch(`${API}/admin/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refund', paymentIntent: btn.dataset.refund })
      });
      btn.textContent = 'Refunded';
      await loadOrders();
    } catch (err) {
      btn.disabled = false; btn.textContent = 'Refund';
      toast(err.message, 'error');
    }
  });
  document.getElementById('refreshOrdersBtn').addEventListener('click', loadOrders);

  /* ========================================================================
     Settings
     ====================================================================== */
  const settingsForm = document.getElementById('settingsForm');

  async function loadSettings() {
    try {
      const data = await authedFetch(`${API}/admin/settings`);
      const s = data.settings || {};
      settingsForm.currency.value = s.currency || 'usd';
      settingsForm.pricesArePlaceholders.checked = s.pricesArePlaceholders !== false;
      settingsForm.announcement.value = s.announcement || '';
      settingsForm.email.value = s.email || '';
      settingsForm.phone.value = s.phone || '';
    } catch (err) { toast(err.message, 'error'); }
  }

  settingsForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('saveSettingsBtn');
    const ok = document.getElementById('settingsSaved');
    btn.disabled = true; btn.textContent = 'Saving…'; ok.hidden = true;
    try {
      await authedFetch(`${API}/admin/settings`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: {
          currency: settingsForm.currency.value.trim(),
          pricesArePlaceholders: settingsForm.pricesArePlaceholders.checked,
          announcement: settingsForm.announcement.value.trim(),
          email: settingsForm.email.value.trim(),
          phone: settingsForm.phone.value.trim()
        }})
      });
      ok.hidden = false;
      toast('Settings saved.', 'ok');
    } catch (err) { toast(err.message, 'error'); }
    finally { btn.disabled = false; btn.textContent = 'Save settings'; }
  });

  /* ========================================================================
     Utilities
     ====================================================================== */
  function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
  function escapeAttr(s) { return escapeHtml(s); }

  const toastStack = document.getElementById('toastStack');
  function toast(msg, type) {
    const d = document.createElement('div');
    d.className = 'toast ' + (type || '');
    d.textContent = msg;
    toastStack.appendChild(d);
    setTimeout(() => d.remove(), 5000);
  }
})();
