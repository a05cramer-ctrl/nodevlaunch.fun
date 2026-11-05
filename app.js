(function () {
  const C = window.NODEV_CONFIG || {};
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const live = !!(C.ca && C.ca.trim());
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };

  // ── intro: draw the mark, snap the name in, then the mark glides into the hero (match cut)
  const intro = $('#intro');
  const introMark = $('.intro-mark');
  const heroArt = $('#heroArt');
  const gradAnim = $('#ngs animateTransform');
  let introDone = false;
  function startGradient() { try { gradAnim && gradAnim.beginElement(); } catch (e) {} }
  function endIntro(fast) {
    if (introDone) return; introDone = true;
    document.body.classList.remove('locked');
    if (fast) { document.body.classList.add('ready', 'swap'); intro.remove(); startGradient(); return; }
    const a = introMark.getBoundingClientRect(), b = heroArt.getBoundingClientRect();
    const dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2), sc = b.width / a.width;
    intro.classList.add('leave');
    introMark.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + sc.toFixed(4) + ')';
    setTimeout(() => document.body.classList.add('ready'), 260);
    setTimeout(() => { document.body.classList.add('swap'); startGradient(); intro.remove(); }, 780);
    store.set('nodev-intro', '1');
  }
  if (reduce || store.get('nodev-intro') || location.hash) {
    endIntro(true);
  } else {
    document.body.classList.add('locked');
    requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('go')));
    setTimeout(() => endIntro(false), 1950);
    intro.addEventListener('click', () => endIntro(false));
  }
  if (reduce) $$('animateTransform').forEach(a => a.remove());

  // ── links & launch state ───────────────────────────────────
  $$('[data-x]').forEach(a => { a.href = (C.links && C.links.x) || '#'; });
  const opens = Date.parse(C.launchesOpen || '');
  $$('[data-opens]').forEach(el => { el.textContent = opens ? new Date(opens).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }) + ' · 16:00 UTC' : 'soon'; });

  if (live) {
    const ca = C.ca.trim();
    $$('[data-buy]').forEach(a => { a.href = C.buyUrl(ca); a.target = '_blank'; a.rel = 'noopener'; });
    $$('[data-chart]').forEach(a => { a.href = C.chartUrl(ca); });
    $$('[data-ca-text]').forEach(el => { el.textContent = ca; });
    $('[data-ca-label]').textContent = ca.slice(0, 6) + '…' + ca.slice(-6) + ' · copy';
    $$('[data-copy]').forEach(b => { b.disabled = false; });
    $$('[data-state-badge] span:last-child').forEach(s => { s.textContent = 'Live'; });
    loadMarket(ca);
  } else {
    $$('[data-chart]').forEach(a => a.classList.add('off'));
    $$('.token [data-buy]').forEach(a => a.classList.add('off'));
    const t = Date.parse(C.launchTimeUtc || '');
    const tick = () => {
      const d = t - Date.now();
      const txt = !t || d <= 0 ? 'any minute' : (() => {
        const h = Math.floor(d / 36e5), m = Math.floor(d % 36e5 / 6e4), s = Math.floor(d % 6e4 / 1e3);
        return (h >= 24 ? Math.floor(h / 24) + 'd ' + (h % 24) + 'h ' : h + 'h ') + String(m).padStart(2, '0') + 'm ' + String(s).padStart(2, '0') + 's';
      })();
      $$('[data-countdown]').forEach(el => { el.textContent = txt; });
    };
    tick(); setInterval(tick, 1000);
  }
  function copyCA(btn) {
    if (!live) return;
    navigator.clipboard && navigator.clipboard.writeText(C.ca.trim()).then(() => {
      if (!btn) return; const o = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => (btn.textContent = o), 1400);
    });
  }
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => copyCA(b)));
  $('[data-ca-pill]').addEventListener('click', () => {
    if (live) { copyCA(); const l = $('[data-ca-label]'); const o = l.textContent; l.textContent = 'Copied'; setTimeout(() => (l.textContent = o), 1400); }
    else location.hash = '#token';
  });

  const fmtUsd = (n) => n >= 1e9 ? '$' + (n / 1e9).toFixed(2) + 'B' : n >= 1e6 ? '$' + (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? '$' + (n / 1e3).toFixed(1) + 'K' : '$' + Math.round(n);
  async function loadMarket(ca) {
    try {
      const r = await fetch('https://api.dexscreener.com/tokens/v1/solana/' + ca);
      const j = await r.json();
      const p = (Array.isArray(j) ? j : []).sort((a, b) => ((b.liquidity && b.liquidity.usd) || 0) - ((a.liquidity && a.liquidity.usd) || 0))[0];
      if (!p) return;
      $('[data-mcap]').textContent = p.marketCap ? fmtUsd(p.marketCap) : '—';
      $('[data-vol]').textContent = p.volume && p.volume.h24 != null ? fmtUsd(p.volume.h24) : '—';
      $('[data-liq]').textContent = p.liquidity && p.liquidity.usd != null ? fmtUsd(p.liquidity.usd) : '—';
      $('[data-live]').hidden = false;
    } catch (e) {}
  }

  // ── launcher wallet, checked live ──────────────────────────
  const launcher = (C.launcher || '').trim();
  if (launcher) {
    const line = $('#launcherLine');
    const short = launcher.slice(0, 4) + '…' + launcher.slice(-4);
    line.innerHTML = '<a href="' + C.solscan(launcher) + '" target="_blank" rel="noopener">' + short + '</a> creates every Nodev coin. Checking its balance…';
    if (live) {
      fetch(C.rpc, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getTokenAccountsByOwner', params: [launcher, { mint: C.ca.trim() }, { encoding: 'jsonParsed' }] }) })
        .then(r => r.json()).then(j => {
          const n = ((j.result && j.result.value) || []).reduce((s, a) => s + Number(a.account.data.parsed.info.tokenAmount.uiAmountString || 0), 0);
          line.innerHTML = '<a href="' + C.solscan(launcher) + '" target="_blank" rel="noopener">' + short + '</a> creates every Nodev coin. It holds <b>' + n.toLocaleString('en-US') + ' $NODEV</b> right now, checked live on Solana.';
        }).catch(() => { line.innerHTML = '<a href="' + C.solscan(launcher) + '" target="_blank" rel="noopener">' + short + '</a> creates every Nodev coin. Live check unavailable right now; open it on Solscan.'; });
    } else {
      line.innerHTML = '<a href="' + C.solscan(launcher) + '" target="_blank" rel="noopener">' + short + '</a> creates every Nodev coin, including this one. Its balance is checked live here once $NODEV is live.';
    }
  }

  // ── reveals ─────────────────────────────────────────────────
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal').forEach((el, i) => { el.style.setProperty('--i', i % 3); io.observe(el); });

  // ── reserve a ticker: card ──────────────────────────────────
  const cv = $('#rsCanvas');
  function drawMark(x, cx, cy, size) {
    const s = size / 1000;
    const g = x.createLinearGradient(cx + 380 * s, cy - 380 * s, cx - 380 * s, cy + 380 * s);
    g.addColorStop(0, '#C200FB'); g.addColorStop(.5, '#3772FF'); g.addColorStop(1, '#5AC4BE');
    x.save(); x.translate(cx, cy); x.scale(s, s);
    x.strokeStyle = g; x.lineWidth = 122; x.beginPath(); x.arc(0, 0, 330, 0, Math.PI * 2); x.stroke();
    x.lineWidth = 120; x.beginPath(); x.moveTo(-350, 350); x.lineTo(350, -350); x.stroke();
    x.restore();
  }
  function drawCard(ticker, name) {
    const W = 1200, H = 630, x = cv.getContext('2d');
    x.fillStyle = '#0B1022'; x.fillRect(0, 0, W, H);
    const glow = x.createRadialGradient(900, 315, 0, 900, 315, 420);
    glow.addColorStop(0, 'rgba(55,114,255,.28)'); glow.addColorStop(1, 'rgba(55,114,255,0)');
    x.fillStyle = glow; x.fillRect(0, 0, W, H);
    x.fillStyle = 'rgba(171,196,255,.14)';
    for (let i = 620; i < W; i += 28) for (let j = 40; j < H; j += 28) { x.beginPath(); x.arc(i, j, 1.2, 0, 7); x.fill(); }
    drawMark(x, 905, 315, 470);
    x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    x.fillStyle = '#8FA3FF'; x.font = '600 22px "JetBrains Mono"'; x.fillText('RESERVED ON NODEV', 72, 150);
    let fs = 128; x.font = '800 ' + fs + 'px "Inter Tight"';
    while (x.measureText('$' + ticker).width > 560 && fs > 56) { fs -= 6; x.font = '800 ' + fs + 'px "Inter Tight"'; }
    x.fillStyle = '#FAFAFA'; x.fillText('$' + ticker, 66, 290);
    x.fillStyle = '#A9B6DE'; x.font = '500 34px "Inter Tight"'; x.fillText(name, 72, 350);
    x.font = '800 44px "Inter Tight"';
    const g2 = x.createLinearGradient(72, 0, 620, 0); g2.addColorStop(0, '#5AC4BE'); g2.addColorStop(.5, '#3772FF'); g2.addColorStop(1, '#C200FB');
    x.fillStyle = g2; x.fillText('A coin with no dev.', 70, 440);
    x.fillStyle = '#5C6A99'; x.font = '500 20px "JetBrains Mono"';
    x.fillText('no dev wallet · no dev bag · fees to holders', 72, 500);
    x.fillStyle = '#8FA3FF'; x.font = '600 20px "JetBrains Mono"';
    x.fillText('NODEV  ·  ' + (location.host || 'nodev') + '  ·  ' + new Date().toISOString().slice(0, 10), 72, 566);
  }
  let lastCard = null;
  $('#rsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const ticker = $('#rsTicker').value.trim().replace(/^\$/, '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    const name = $('#rsName').value.trim().slice(0, 28) || 'Coin with no dev';
    if (!ticker) { $('#rsTicker').focus(); return; }
    Promise.all([document.fonts.load('800 40px "Inter Tight"'), document.fonts.load('600 20px "JetBrains Mono"')]).finally(() => {
      drawCard(ticker, name);
      lastCard = { ticker, name };
      $('#rsOut').hidden = false;
      $('#rsPost').href = 'https://x.com/intent/post?text=' + encodeURIComponent('Reserved $' + ticker + ' on Nodev.\n\nA coin with no dev: no dev wallet, no dev bag, fees go to holders.\n\n' + location.origin + location.pathname + '\n\n$NODEV');
      $('#rsOut').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    });
  });
  $('#rsSave').addEventListener('click', () => {
    if (!lastCard) return;
    const a = document.createElement('a'); a.download = 'nodev-' + lastCard.ticker + '.png'; a.href = cv.toDataURL('image/png'); a.click();
  });
})();
