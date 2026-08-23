/* ============================================================================
   HER-mazing Touch — shop toolbar, product quick-view, chat, corporate form
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const C = window.CATALOG;
  const PHONE = '5715757174';
  const EMAIL = 'hermazingtouch@gmail.com';

  /* ========================================================================
     Shop toolbar — search, sort, result count.
     Works alongside the occasion chips: a card is shown only when it passes
     BOTH the chip filter and the search box.
     ====================================================================== */
  const grid   = document.getElementById('giftGrid');
  const search = document.getElementById('shopSearch');
  const sort   = document.getElementById('shopSort');
  const countEl= document.getElementById('shopCount');
  const empty  = document.getElementById('giftEmpty');

  if (grid && search && sort) {
    const cards = [...grid.querySelectorAll('.pcard')];
    cards.forEach((c, i) => { c.dataset.order = i; });          // remember "featured" order

    function currentChip() {
      const chip = document.querySelector('.chip.is-active');
      return chip ? chip.dataset.filter : 'all';
    }

    function apply() {
      const q = search.value.trim().toLowerCase();
      const filter = currentChip();
      let shown = 0;

      cards.forEach(card => {
        const p = C.bySku[card.dataset.sku] || {};
        const hay = (card.textContent + ' ' + (p.name || '')).toLowerCase();

        const matchesSearch = !q || hay.includes(q);
        const matchesChip =
          filter === 'all'  ? true :
          filter === 'best' ? !!p.bestSeller :
          (card.dataset.occasions || '').split(' ').includes(filter);

        const show = matchesSearch && matchesChip;
        card.classList.toggle('filtered-out', !show);
        if (show) shown++;
      });

      // sort by reordering the flex/grid children
      const mode = sort.value;
      const sorted = [...cards].sort((a, b) => {
        const pa = C.bySku[a.dataset.sku] || {}, pb = C.bySku[b.dataset.sku] || {};
        switch (mode) {
          case 'low':  return pa.price - pb.price;
          case 'high': return pb.price - pa.price;
          case 'az':   return (pa.name || '').localeCompare(pb.name || '');
          case 'best': return (pb.bestSeller ? 1 : 0) - (pa.bestSeller ? 1 : 0);
          default:     return a.dataset.order - b.dataset.order;
        }
      });
      sorted.forEach(c => grid.appendChild(c));

      countEl.textContent = shown === cards.length
        ? `${shown} gifts`
        : `${shown} of ${cards.length} gifts`;
      if (empty) empty.hidden = shown !== 0;
    }

    search.addEventListener('input', apply);
    sort.addEventListener('change', apply);
    // chips are handled in script.js; re-run afterwards so both filters compose
    document.querySelectorAll('.chip').forEach(c =>
      c.addEventListener('click', () => setTimeout(apply, 0)));

    apply();
  }

  /* ========================================================================
     Product quick-view — mirrors a product detail page: contents list,
     fulfilment badges, price and add-to-basket.
     ====================================================================== */
  const qv = document.getElementById('quickView');
  if (qv && C) {
    const body = document.getElementById('qvBody');

    function openQuick(sku) {
      const p = C.bySku[sku];
      if (!p) return;

      const badges = [
        'Signature gold-trimmed packaging',
        'Handwritten greeting card included',
        p.shipping === 'local' ? 'Local delivery or pickup' : 'Ships worldwide',
        p.personalise ? 'Personalised to order' : 'Hand-finished'
      ];

      body.innerHTML = '';

      const h = document.createElement('div');
      h.className = 'qv-head';
      h.innerHTML = `<p class="qv-cat"></p><h3></h3><p class="qv-price"></p>`;
      h.querySelector('.qv-cat').textContent = p.category;
      h.querySelector('h3').textContent = p.name;
      h.querySelector('.qv-price').textContent = C.money(p.price);
      body.appendChild(h);

      if (p.contents) {
        const w = document.createElement('div');
        w.className = 'qv-block';
        w.innerHTML = '<h4>What\'s included</h4>';
        const ul = document.createElement('ul');
        p.contents.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          ul.appendChild(li);
        });
        w.appendChild(ul);
        body.appendChild(w);
      }

      const bl = document.createElement('ul');
      bl.className = 'qv-badges';
      badges.forEach(t => { const li = document.createElement('li'); li.textContent = t; bl.appendChild(li); });
      body.appendChild(bl);

      if (p.note) {
        const n = document.createElement('p');
        n.className = 'qv-note';
        n.textContent = p.note;
        body.appendChild(n);
      }

      const add = document.createElement('button');
      add.className = 'btn btn-gold qv-add';
      add.textContent = 'Add to Basket';
      add.addEventListener('click', () => { window.CART.add(sku, 1, ''); close(); });
      body.appendChild(add);

      qv.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    const close = () => { qv.classList.remove('open'); document.body.style.overflow = ''; };
    document.getElementById('qvClose').addEventListener('click', close);
    qv.addEventListener('click', e => { if (e.target === qv) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    document.addEventListener('click', e => {
      const btn = e.target.closest('.pcard-details');
      if (btn) openQuick(btn.closest('[data-sku]').dataset.sku);
    });
  }

  /* ========================================================================
     Chat widget.
     Honest by design: there is no agent connected, so it never pretends a
     human replied. It collects the message and hands off to text or email.
     To connect a real provider (Tawk.to, Crisp…) drop their embed in and
     hide .chat-launch — see SETUP.md.
     ====================================================================== */
  const panel = document.getElementById('chatPanel');
  if (panel) {
    const log = document.getElementById('chatLog');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    const statusEl = document.getElementById('chatStatus');
    let greeted = false;

    // Mon–Sat 9am–7pm, in the visitor's own clock
    function isOpenNow() {
      const d = new Date();
      return d.getDay() !== 0 && d.getHours() >= 9 && d.getHours() < 19;
    }

    function say(text, who = 'them') {
      const b = document.createElement('div');
      b.className = `chat-msg ${who}`;
      b.textContent = text;
      log.appendChild(b);
      log.scrollTop = log.scrollHeight;
      return b;
    }

    function actions() {
      const wrap = document.createElement('div');
      wrap.className = 'chat-actions';

      const sms = document.createElement('a');
      sms.className = 'chat-act';
      sms.textContent = 'Send as text';
      sms.href = `sms:${PHONE}`;

      const mail = document.createElement('a');
      mail.className = 'chat-act';
      mail.textContent = 'Send as email';
      mail.href = `mailto:${EMAIL}`;

      wrap.append(sms, mail);
      log.appendChild(wrap);
      log.scrollTop = log.scrollHeight;
      return { sms, mail };
    }

    function greet() {
      if (greeted) return;
      greeted = true;
      const open = isOpenNow();
      statusEl.textContent = open ? 'Usually replies within minutes' : 'Away — leave a message';
      statusEl.classList.toggle('is-open', open);
      say(open
        ? 'Hi! Ask us anything about the candles, gift sets or engraving and we’ll get right back to you.'
        : 'Hi! We’re away right now (Mon–Sat, 9am–7pm) — leave your message and we’ll reply as soon as we’re back.');
    }

    function openChat() { panel.classList.add('open'); greet(); setTimeout(() => input.focus(), 350); }
    function closeChat() { panel.classList.remove('open'); }

    document.getElementById('chatLaunch').addEventListener('click', () =>
      panel.classList.contains('open') ? closeChat() : openChat());
    document.getElementById('chatClose').addEventListener('click', closeChat);
    document.getElementById('chatOpen')?.addEventListener('click', openChat);
    document.getElementById('chatOpenFooter')?.addEventListener('click', openChat);

    form.addEventListener('submit', e => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      say(text, 'me');
      input.value = '';

      setTimeout(() => {
        say('Thanks! Send this straight to us and we’ll pick it up — whichever you prefer:');
        const { sms, mail } = actions();
        const body = encodeURIComponent(text);
        sms.href = `sms:${PHONE}?&body=${body}`;
        mail.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Website enquiry')}&body=${body}`;
      }, 500);
    });
  }

  /* ========================================================================
     Corporate enquiry form — no backend, so it composes an email.
     ====================================================================== */
  const corp = document.getElementById('corporateForm');
  if (corp) {
    corp.addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(corp);
      const lines = [
        `Name: ${f.get('name')}`,
        f.get('company') ? `Company: ${f.get('company')}` : '',
        `Email: ${f.get('email')}`,
        f.get('phone') ? `Phone: ${f.get('phone')}` : '',
        `Quantity: ${f.get('quantity')}`,
        f.get('needBy') ? `Needed by: ${f.get('needBy')}` : '',
        '',
        f.get('message') || ''
      ].filter(Boolean);

      window.location.href =
        `mailto:${EMAIL}?subject=${encodeURIComponent('Corporate gifting enquiry')}` +
        `&body=${encodeURIComponent(lines.join('\n'))}`;

      document.getElementById('corpNote').textContent =
        'Opening your email app with the details filled in — just hit send.';
    });
  }
});
