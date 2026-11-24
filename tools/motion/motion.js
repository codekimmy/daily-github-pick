// =====================================================================
// 모션 스타일 공용 엔진 (2026-11-24 운영자 요청 — "정적인 그래픽 → 움직이는 영상")
//  · DOM(HTML/CSS) 위에 장(챕터)마다 '층(layer)'을 만들고, 프레임마다 render(lt) 로 모습을 정한다.
//  · 기존 demo/render/render.py 와 그대로 맞물린다: 페이지가 READY · TOTAL · frame(f) 를 내놓음.
//  · 모든 움직임은 '시간 t 의 함수'다 (상태를 쌓지 않음) → 어느 프레임부터 찍어도 같은 그림.
//  · 장면 시간은 자막 구간(timing.js 의 cues) 시작 시각 S.cue(i) 기준으로 잡는다 → retime.py 로
//    음성에 맞춰 구간이 바뀌어도 화면이 따라 움직인다.
// 사용법·연출 사전: tools/motion/README.md
// =====================================================================
const M = (() => {
  const C = { ink: '#141414', orange: '#FF5A1F', yellow: '#FFD84D', red: '#E5482D', green: '#18A058', box: '#FF8C00',
    beige: '#F4EFE6', blue: '#E3EDF8', peach: '#FBE4D6', mint: '#E2F3EA', lilac: '#ECE6F7', termBg: '#17181C' };
  const BGS = [C.beige, C.blue, C.peach, C.mint, C.lilac];
  const FONT = '"Noto Sans CJK KR", sans-serif';
  const cfg = { W: 1920, H: 1080, V: false, fps: 30, mode: 'long', brand: '', disclaimer: [] };

  // ---------- 시간·움직임 ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const P = (t, a, b) => clamp((t - a) / (b - a));                       // a~b 사이 진행도 0~1
  const eOut = x => 1 - Math.pow(1 - x, 3);
  const eIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const eBack = x => { const c1 = 1.9, c3 = c1 + 1; return x <= 0 ? 0 : x >= 1 ? 1 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const lerp = (a, b, x) => a + (b - a) * x;
  const popIn = (t, a, d = .45) => eBack(P(t, a, a + d));                // a초에 '톡' 튀어나옴 (살짝 넘쳤다 돌아옴)
  const out = (t, a, d = .35) => eIO(P(t, a, a + d));                    // a초부터 사라짐
  const shake = (t, a, d = .25, amp = 4) => (t > a && t < a + d) ? Math.sin(t * 90) * amp * (1 - P(t, a, a + d)) : 0;

  // ---------- 요소 ----------
  let parent = null;                                                      // 지금 만드는 장의 층 (run 이 정해 줌)
  function el(tag, cls, css, par, html) {
    const e = document.createElement(tag); if (cls) e.className = cls; if (css) Object.assign(e.style, css);
    if (html != null) e.innerHTML = html; (par || parent).appendChild(e); return e;
  }
  const px = v => typeof v === 'number' ? v + 'px' : v;
  function box(x, y, w, h, cls = 'card', css = {}, par) { return el('div', cls, Object.assign({ left: px(x), top: px(y), width: px(w), height: px(h) }, css), par); }
  function tf(e, x = 0, y = 0, s = 1, r = 0, o = 1) { e.style.transform = `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg)`; e.style.opacity = o; }
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const mctx = document.createElement('canvas').getContext('2d');
  function textW(s, size, weight = 700, font = FONT) { mctx.font = `${weight} ${size}px ${font}`; return mctx.measureText(s).width; }
  function wrap(s, maxw, size, weight = 700) {
    const outl = []; let line = '';
    for (const wd of String(s).split(' ')) { const t = line ? line + ' ' + wd : wd; if (textW(t, size, weight) > maxw && line) { outl.push(line); line = wd; } else line = t; }
    if (line) outl.push(line); return outl;
  }
  function fitSize(s, size, maxw, weight = 800, min = 18) { while (size > min && textW(s, size, weight) > maxw) size -= 1; return size; }

  // ---------- 큰 제목(키네틱 자막) ----------
  // lines: [["낱말","*강조 낱말*"], ["둘째 줄"]] — *로 감싼 낱말은 주황 + 노란 형광 밑줄. t1 = null 이면 사라지지 않음
  // 화면 글자도 합니다체 또는 명사형(~함·~됨·~읽힘)으로 쓴다 (GUIDE 3장). 해요체·반말 금지
  function caption(t0, t1, lines, o = {}) {
    const size = o.size || (cfg.V ? 84 : 78);
    const c = el('div', 'cap', { left: px(o.x ?? (cfg.V ? 70 : 110)), top: px(o.y ?? (cfg.V ? 230 : 118)), fontSize: size + 'px' });
    if (o.center) { c.style.left = '0'; c.style.right = '0'; c.style.textAlign = 'center'; }
    const toks = [];
    lines.forEach(L => {
      const ln = el('div', 'ln', null, c);
      L.forEach(w => { const acc = w.startsWith('*'); const s = el('span', 'tk' + (acc ? ' acc' : ''), null, ln, esc(w.replace(/\*/g, ''))); toks.push({ s, ul: acc ? el('span', 'ul', null, s) : null }); });
    });
    return {
      el: c, render(t) {
        toks.forEach((k, i) => {
          const a = P(t, t0 + i * .07, t0 + i * .07 + .5), e = eBack(a); const o2 = t1 == null ? 0 : out(t, t1 - .32 + i * .025, .28);
          k.s.style.opacity = Math.min(1, a * 2) * (1 - o2);
          k.s.style.transform = `translateY(${(1 - e) * 60 - o2 * 50}px) rotate(${(1 - e) * -6}deg)`;
          if (k.ul) k.ul.style.transform = `scaleX(${eOut(P(t, t0 + .35 + i * .07, t0 + .75 + i * .07))})`;
        });
      }
    };
  }

  // ---------- 도장 ('쾅' 찍힘) ----------
  function stamp(text, x, y, size = 56, rot = -9, color = C.red) {
    const e = el('div', 'stamp', { left: px(x), top: px(y), fontSize: size + 'px', borderColor: color, color });
    e.textContent = text;
    return { el: e, render(t, t0, hide = 1e9, dx = 0) { const p = P(t, t0, t0 + .35); tf(e, dx + shake(t, t0 + .35), 0, lerp(2.4, 1, eOut(p)), rot, p * (1 - out(t, hide))); } };
  }
  // ---------- 손글씨 (왼쪽부터 써지듯 드러남) ----------
  function hand(text, x, y, size = 38, rot = -5) {
    const e = el('div', 'hand', { left: px(x), top: px(y), fontSize: size + 'px' }); e.textContent = text;
    return { el: e, render(t, t0, d = .6, hide = 1e9, dx = 0) { const p = P(t, t0, t0 + d); e.style.clipPath = `inset(-20% ${100 - p * 100}% -20% -5%)`; tf(e, dx, 0, 1, rot, p > 0 ? 1 - out(t, hide) : 0); } };
  }
  // ---------- 빨간 펜 (선이 그려짐) ----------
  function pen(d, w = 7, color = C.red) {
    const NS = 'http://www.w3.org/2000/svg', sv = document.createElementNS(NS, 'svg');
    sv.setAttribute('class', 'pen'); sv.setAttribute('width', cfg.W); sv.setAttribute('height', cfg.H);
    const p = document.createElementNS(NS, 'path');
    Object.entries({ d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }).forEach(([k, v]) => p.setAttribute(k, v));
    sv.appendChild(p); parent.appendChild(sv); const L = p.getTotalLength(); p.style.strokeDasharray = L;
    return { el: sv, set(x, dx = 0) { p.style.strokeDashoffset = L * (1 - x); sv.style.opacity = x > 0 ? 1 : 0; sv.style.transform = `translateX(${dx}px)`; } };
  }
  function ellipsePath(cx, cy, rx, ry, turn = 1.12, rot = -.25) {
    let d = ''; const k = 60;
    for (let i = 0; i <= k; i++) { const a = rot + i / k * Math.PI * 2 * turn, j = 1 + .04 * Math.sin(i * .9); d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rx * j).toFixed(1) + ' ' + (cy + Math.sin(a) * ry * j).toFixed(1); }
    return d;
  }
  function arrowPath(x1, y1, x2, y2, bend = 80) {                         // 휘어진 화살표 + 머리
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const cx = mx - dy / L * bend, cy = my + dx / L * bend, a = Math.atan2(y2 - cy, x2 - cx), h = 30;
    return `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2} M${x2} ${y2} L${x2 - h * Math.cos(a - .45)} ${y2 - h * Math.sin(a - .45)} M${x2} ${y2} L${x2 - h * Math.cos(a + .45)} ${y2 - h * Math.sin(a + .45)}`;
  }
  // 요소 둘레 동그라미 (요소가 아직 움직이지 않은 자리 기준)
  function circleAround(e, padX = 30, padY = 22) { const r = e.getBoundingClientRect(), s = stageRect(); return ellipsePath(r.left - s.left + r.width / 2, r.top - s.top + r.height / 2, r.width / 2 + padX, r.height / 2 + padY); }
  let stageEl = null; const stageRect = () => stageEl.getBoundingClientRect();

  // ---------- 숫자 카운트업 (1.5초 이상 · 다 오른 뒤 2초 이상 보이게 — GUIDE 5장) ----------
  function count(e, t, t0, to, d = 1.6, fmt = v => Math.round(v).toLocaleString('en-US'), from = 0) { e.textContent = fmt(lerp(from, to, eOut(P(t, t0, t0 + d)))); }

  // ---------- 명령 창 (한 줄씩 타이핑) ----------
  // steps: [{at, text, dur, kind:'cmd'|'out', color}] — cmd 는 'C:\> ' 뒤로 글자가 하나씩, out 은 한 번에 톡
  function term(x, y, w, h, o = {}) {
    const fs = o.fs || 31; const c = box(x, y, w, h, 'card dark', { padding: '26px 34px' });
    el('div', null, { display: 'flex', gap: '10px', marginBottom: '18px' }, c, ['#FF5F57', '#FEBC2E', '#28C840'].map(k => `<i style="width:16px;height:16px;border-radius:50%;background:${k};display:block"></i>`).join(''));
    const body = el('div', 'mono', { fontSize: fs + 'px', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }, c);
    const prompt = o.prompt ?? 'C:\\> ';
    return {
      el: c, render(t, steps) {
        let h2 = ''; let typing = false;
        for (const s of steps) {
          if (t < s.at) break;
          if ((s.kind || 'cmd') === 'cmd') { const d = s.dur ?? Math.max(.8, s.text.length * .04); const n = Math.floor(P(t, s.at, s.at + d) * s.text.length); typing = n < s.text.length; h2 += `<div><span style="color:#FFB86B">${esc(prompt)}</span>${esc(s.text.slice(0, n))}`; h2 += '</div>'; }
          else { const a = P(t, s.at, s.at + .25); h2 += `<div style="color:${s.color || '#3DDC84'};opacity:${a}">${esc(s.text)}</div>`; }
        }
        const blink = typing || Math.floor(t * 2.5) % 2 === 0;
        body.innerHTML = h2.replace(/<\/div>$/, (blink ? '<span style="background:#EDEDED">&nbsp;</span>' : '&nbsp;') + '</div>');
      }
    };
  }

  // ---------- QR 스티커 찍기 (칸 배열을 직접 그림: 왼쪽 위 → 오른쪽 아래 대각선) ----------
  // mat: ["0101..", ...] (segno 의 q.matrix, mkdata.py) · draw(t,{stamp:시작초, dur, box:가림 넓이 비율(0~1, 흰 여백 포함 그림 전체 기준), scan:0~1 읽는 띠})
  function qr(mat, size, css = {}, par) {
    const cv = el('canvas', null, Object.assign({ position: 'absolute' }, css), par); cv.width = size; cv.height = size;
    const g = cv.getContext('2d'), n = mat.length, N = n + 8, m = size / N;
    return {
      el: cv, draw(t, o = {}) {
        g.fillStyle = o.light || '#fff'; g.fillRect(0, 0, size, size); g.fillStyle = o.dark || C.ink;
        const st = o.stamp ?? -99, du = o.dur ?? 1.6;
        for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
          if (mat[r][c] !== '1') continue; const d = st + ((r + c) / (2 * (n - 1))) * du, q = P(t, d, d + .22); if (q <= 0) continue;
          const s = eBack(q), w = (m + .6) * s; g.fillRect((c + 4.5) * m - w / 2, (r + 4.5) * m - w / 2, w, w);
        }
        if (o.box > 0) { const sd = size * Math.sqrt(o.box); g.fillStyle = C.box; g.fillRect((size - sd) / 2, (size - sd) / 2, sd, sd); }
        if (o.scan != null && o.scan > 0 && o.scan < 1) {
          const y = o.scan * size, gr = g.createLinearGradient(0, y - 70, 0, y); gr.addColorStop(0, 'rgba(24,200,100,0)'); gr.addColorStop(1, 'rgba(24,200,100,.45)');
          g.fillStyle = gr; g.fillRect(0, y - 70, size, 70); g.fillStyle = '#18C864'; g.fillRect(0, y - 3, size, 6);
        }
      }
    };
  }
  const scanAt = (t, t0, d = 1.7) => { if (t <= t0 || t >= t0 + d) return null; const s = P(t, t0, t0 + d); return s < .55 ? eIO(s / .55) : 1 - eIO((s - .55) / .45); };

  // ---------- 결과 알약 (✓ 읽힘 / ✗ 실패) ----------
  function pillRender(e, t, t0, ok, dim = 0, dx = 0) { const a = popIn(t, t0, .4); tf(e, dx + (!ok ? shake(t, t0 + .3, .3, 5) : 0), (1 - a) * 24, a, 0, Math.min(1, a * 2) * (1 - dim * .5)); e.style.filter = dim ? `grayscale(${dim})` : 'none'; }

  // ---------- 별점 ----------
  const STAR = (s, f) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" fill="${f}" stroke="#141414" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  function stars(x, y, size, score, max = 5, par) {
    const row = el('div', null, { position: 'absolute', left: px(x), top: px(y), height: size + 'px', width: (max * (size + 12)) + 'px' }, par);
    for (let i = 0; i < max; i++) el('div', null, { position: 'absolute', left: (i * (size + 12)) + 'px', top: 0 }, row, STAR(size, '#fff'));
    const on = []; for (let i = 0; i < score; i++) on.push(el('div', null, { position: 'absolute', left: (i * (size + 12)) + 'px', top: 0 }, row, STAR(size, '#FFC531')));
    return { el: row, render(t, t0, gap = .4) { on.forEach((s, i) => { const a = popIn(t, t0 + i * gap, .4); s.style.transform = `scale(${a}) rotate(${(1 - a) * -90}deg)`; }); } };
  }

  // ---------- 아이콘 (선 그림, 24칸 기준) ----------
  const ICON = {
    wifi: 'M4 9a12 12 0 0 1 16 0M7 12.5a7.5 7.5 0 0 1 10 0M10 16a3 3 0 0 1 4 0',
    person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1-4.5 4-6.5 8-6.5s7 2 8 6.5',
    link: 'M10 14a4 4 0 0 0 6 .5l3-3a4 4 0 0 0-6-6l-1.5 1.5M14 10a4 4 0 0 0-6-.5l-3 3a4 4 0 0 0 6 6l1.5-1.5',
    file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5',
    bolt: 'M13 2L4 14h7l-1 8 9-12h-7z', check: 'M5 12.5l4.5 4.5L19 7.5', term: 'M4 6l6 6-6 6M12 19h8',
    image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15.5 9.5h.01', music: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4', warn: 'M12 3l10 18H2zM12 10v5M12 18h.01'
  };
  const icon = (name, s = 54, color = '#fff', sw = 2.4) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${ICON[name] || ICON.check}"/></svg>`;
  const iconTile = (name, s = 84) => `<div style="width:${s}px;height:${s}px;border-radius:${s * .24}px;background:${C.orange};display:flex;align-items:center;justify-content:center">${icon(name, s * .64)}</div>`;

  // ---------- 기본 장면 (그 장의 장면을 아직 안 만들었을 때) ----------
  // 장 제목을 큰 제목으로, 자막 문장마다 카드 1장 — 자막 시작 시각에 한 장씩 (간격 = 자막 간격 ≥ 0.8초)
  function fallback(S) {
    const tagTxt = (S.c.tag || '').replace(/^\d+\s*/, '') || S.c.cues[0][2];
    const words = tagTxt.split(' '); let l1 = [], l2 = [];
    words.forEach(w => (textW(l1.join(' '), 78, 900) < (cfg.V ? 820 : 1300) && !l2.length ? l1 : l2).push(w));
    const cap = caption(.05, null, l2.length ? [l1, l2] : [l1]);
    const n = S.c.cues.length, X = cfg.V ? 70 : 110, Y0 = cfg.V ? 560 : 360, Wd = cfg.W - 2 * X, bottom = cfg.V ? 1480 : 920, gap = 24;
    const h = Math.min(cfg.V ? 190 : 130, (bottom - Y0 - gap * (n - 1)) / n);
    const cards = S.c.cues.map((q, i) => {
      const c = box(X, Y0 + i * (h + gap), Wd, h, 'card', { display: 'flex', alignItems: 'center', gap: '28px', padding: '0 34px' });
      el('div', null, { minWidth: '64px', height: '64px', borderRadius: '16px', background: C.ink, color: '#fff', fontWeight: '900', fontSize: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, c, String(i + 1));
      const fs = fitSize(q[2], cfg.V ? 40 : 38, Wd - 160, 800, 24);
      el('div', null, { fontSize: fs + 'px', fontWeight: '800', lineHeight: '1.3' }, c, esc(q[2]));
      return c;
    });
    return t => {
      cap.render(t);
      cards.forEach((c, i) => {
        const a = popIn(t, S.cue(i) - .1, .5), on = t >= S.cue(i) && (i === n - 1 || t < S.cue(i + 1));
        tf(c, (1 - a) * -120, 0, 1, 0, a > 0 ? Math.min(1, a * 2) : 0);
        c.style.background = on ? '#FFF6CC' : '#fff';
      });
    };
  }
  // ---------- 엔딩 (마지막 인사 + 유의사항 작은 글씨 1~2줄, GUIDE 6-1장) ----------
  function ending(S, o = {}) {
    const sz = cfg.V ? 70 : 76, deflines = wrap(S.c.cues[0][2], cfg.W - 200, sz, 900).map(l => [l]);
    const cap = caption(S.cue(0), null, o.lines || deflines, { center: true, y: cfg.V ? 700 : 330, size: sz });
    const name = o.name ? el('div', null, { position: 'absolute', left: 0, right: 0, top: px(cfg.V ? 560 : 220), textAlign: 'center', fontSize: '40px', fontWeight: '900', color: C.orange }, null, esc(o.name)) : null;
    const disc = el('div', null, { position: 'absolute', left: px(cfg.V ? 60 : 160), right: px(cfg.V ? 60 : 160), top: px(cfg.V ? 1340 : 720), textAlign: 'center', fontSize: cfg.V ? '24px' : '24px', lineHeight: '1.6', color: '#555', fontWeight: '700' }, null, (o.disclaimer || cfg.disclaimer).map(esc).join('<br>'));
    return t => { cap.render(t); if (name) tf(name, 0, 0, 1, 0, P(t, 0, .4)); tf(disc, 0, 0, 1, 0, P(t, S.cue(0) + .6, S.cue(0) + 1.1)); };
  }

  // ---------- 아래 자막 상자 · 진행 막대 (GUIDE 5장 깜빡임 방지 규칙 그대로) ----------
  function chrome(chapters) {
    const CY = cfg.V ? 1600 : 992, CS = cfg.V ? 42 : 36, CMAX = cfg.V ? cfg.W - 80 : 1760;
    const CAP = []; chapters.forEach(c => c.cues.forEach(q => CAP.push([c.t0 + q[0], c.t0 + q[1], q[2]])));
    CAP.forEach((q, i) => { const n = CAP[i + 1]; q.join = !!n && n[0] - q[1] < .6; if (q.join) q[1] = n[0]; });
    const lines = s => wrap(s, CMAX - 70, CS, 700), wOf = s => Math.min(Math.max(...lines(s).map(l => textW(l, CS, 700))) + 90, CMAX);
    const sub = el('div', null, { fontSize: CS + 'px', lineHeight: '1.3' }, stageEl); sub.id = 'sub';
    const sa = el('span', null, null, sub), sb = el('span', null, null, sub);
    let prog = null; if (cfg.mode === 'long') { const pr = el('div', null, null, stageEl); pr.id = 'prog'; prog = el('div', null, null, pr); prog.id = 'progf';
      chapters.slice(1).forEach(c => el('div', null, { position: 'absolute', left: (c.t0 / cfg.end * 100) + '%', top: 0, bottom: 0, width: '3px', background: C.beige }, pr)); }
    if (cfg.brand) { const b = el('div', null, { right: px(cfg.V ? 60 : 110), top: px(cfg.V ? 70 : 42) }, stageEl, esc(cfg.brand)); b.id = 'brand'; }
    const setTxt = (sp, s) => { if (sp._s !== s) { sp._s = s; sp.innerHTML = lines(s).map(esc).join('<br>'); } };
    return t => {
      if (prog) prog.style.width = (t / cfg.end * 100) + '%';
      const i = CAP.findIndex(q => t >= q[0] && t < q[1]); if (i < 0) { sub.style.opacity = 0; return; }
      const q = CAP[i], p = CAP[i - 1], jp = p && p.join, k = jp ? eIO(P(t, q[0], q[0] + .3)) : 1;
      const a = (jp ? 1 : P(t, q[0], q[0] + .2)) * (q.join ? 1 : 1 - P(t, q[1] - .15, q[1]));
      const n = Math.max(lines(q[2]).length, jp ? lines(p[2]).length : 1), h = 36 + n * CS * 1.3, w = jp ? lerp(wOf(p[2]), wOf(q[2]), k) : wOf(q[2]);
      Object.assign(sub.style, { left: (cfg.W / 2 - w / 2) + 'px', top: (CY - h / 2) + 'px', width: w + 'px', height: h + 'px', opacity: a });
      setTxt(sb, q[2]); sb.style.opacity = k; if (jp && k < 1) { setTxt(sa, p[2]); sa.style.opacity = 1 - k; } else sa.style.opacity = 0;
    };
  }

  // ---------- 하프톤(점) 전환: 새 장이 커지는 점 모양으로 드러남 — 검은 화면을 거치지 않음 ----------
  const mcv = document.createElement('canvas'); mcv.width = 960; mcv.height = 540; const mg = mcv.getContext('2d');
  function dotsMask(k) {
    mcv.width = cfg.V ? 540 : 960; mcv.height = cfg.V ? 960 : 540; const Wm = mcv.width, Hm = mcv.height, s = 27;
    mg.clearRect(0, 0, Wm, Hm); mg.fillStyle = '#000';
    for (let y = 0; y < Hm + s; y += s) for (let x = 0; x < Wm + s; x += s) {
      const ox = x + ((y / s) % 2) * s / 2, q = clamp(k * 1.7 - ((ox + y) / (Wm + Hm)) * .7); if (q <= 0) continue;
      mg.beginPath(); mg.arc(ox, y, q * s * .78, 0, 7); mg.fill();
    }
    return `url(${mcv.toDataURL()})`;
  }

  // ---------- 실행 ----------
  // chapters: LONG | SHORTS (timing.js) · scenes: { 장id: S => (lt => {...}) } · opts: { 장id: {bg, trans:'fade'|'dots'} }
  function run({ chapters, scenes, opts = {}, brand = '', disclaimer = [], extraEnd = 0, endScene = null }) {
    const Q = new URLSearchParams(location.search);
    cfg.W = +(Q.get('w') || 1920); cfg.H = +(Q.get('h') || 1080); cfg.V = cfg.H > cfg.W; cfg.fps = +(Q.get('fps') || 30);
    cfg.mode = Q.get('mode') || 'long'; cfg.brand = brand; cfg.disclaimer = disclaimer;
    const CH = chapters.slice();
    if (extraEnd > 0) { const L = CH[CH.length - 1]; CH.push({ id: '__end', tag: '', t0: L.t0 + L.dur, dur: extraEnd, cues: [[.3, extraEnd - .3, endScene?.text || '다음에 또 멋진 오픈소스 소개하겠습니다!']] }); }
    cfg.end = CH[CH.length - 1].t0 + CH[CH.length - 1].dur;
    stageEl = document.createElement('div'); stageEl.id = 'stage'; Object.assign(stageEl.style, { width: cfg.W + 'px', height: cfg.H + 'px' }); document.body.appendChild(stageEl);
    const L = CH.map((c, i) => {
      const o = opts[c.id] || {}; const layer = el('div', 'layer', { background: o.bg || BGS[i % BGS.length] }, stageEl); parent = layer;   // 만드는 동안은 보이게 둠(자리 재기용), 다 만들고 숨김
      el('div', 'dots');
      if (c.tag) { const tg = el('div', 'tag', { left: px(cfg.V ? 70 : 110), top: px(cfg.V ? 120 : 42) }); const m = c.tag.match(/^(\d+)\s+(.*)$/); tg.innerHTML = m ? `<span class="no">${m[1]}</span><span>${esc(m[2])}</span>` : `<span>${esc(c.tag)}</span>`; }
      const S = { c, layer, dur: c.dur, V: cfg.V, W: cfg.W, H: cfg.H, cue: k => c.cues[Math.min(k, c.cues.length - 1)][0], cueEnd: k => c.cues[Math.min(k, c.cues.length - 1)][1], text: k => c.cues[Math.min(k, c.cues.length - 1)][2] };
      const make = c.id === '__end' ? (S2 => ending(S2, endScene || {})) : (scenes[c.id] || fallback);
      if (c.id !== '__end' && !scenes[c.id] && !cfg.mode.startsWith('thumb')) console.error('기본 장면(fallback) 사용 — 직접 만들어야 함: ' + c.id);   // 2026-11-25 운영자 요청: 모든 장 직접
      let render; try { render = make(S); } catch (e) { console.error('장면 오류', c.id, e); layer.innerHTML = ''; el('div', 'dots'); render = fallback(S); }
      layer.style.display = 'none';
      return { c, layer, render, trans: o.trans || 'fade' };
    });
    parent = stageEl; const ch = chrome(CH);
    window.TOTAL = Math.round(cfg.end * cfg.fps);
    window.frame = f => {
      const t = f / cfg.fps; let i = CH.findIndex(c => t >= c.t0 && t < c.t0 + c.dur); if (i < 0) i = CH.length - 1;
      const cur = L[i], lt = t - cur.c.t0, TD = cur.trans === 'dots' ? .9 : .6, prev = i > 0 && lt < TD ? L[i - 1] : null;
      L.forEach((x, j) => { if (x !== cur && x !== prev) x.layer.style.display = 'none'; });
      if (prev) { prev.layer.style.display = 'block'; prev.layer.style.opacity = 1; prev.layer.style.zIndex = 1; prev.layer.style.webkitMaskImage = 'none'; prev.render(prev.c.dur); }
      cur.layer.style.display = 'block'; cur.layer.style.zIndex = 2;
      const k = prev ? P(lt, 0, TD) : 1;
      if (cur.trans === 'dots' && prev) { cur.layer.style.opacity = 1; cur.layer.style.webkitMaskImage = dotsMask(eIO(k)); cur.layer.style.webkitMaskSize = '100% 100%'; }
      else { cur.layer.style.webkitMaskImage = 'none'; cur.layer.style.opacity = prev ? eIO(k) : 1; }
      cur.render(lt); ch(t);
    };
    window.READY = false;
    Promise.all([document.fonts.load(`900 40px ${FONT}`), document.fonts.load(`700 40px ${FONT}`), document.fonts.load('400 20px "DejaVu Sans Mono"')]).then(() => { window.READY = true; });
  }

  return { C, cfg, clamp, P, eOut, eIO, eBack, lerp, popIn, out, shake, el, box, tf, esc, textW, wrap, fitSize, caption, stamp, hand, pen, ellipsePath, arrowPath, circleAround,
    count, term, qr, scanAt, pillRender, stars, icon, iconTile, fallback, ending, run,
    pill: (html, ok, x, y, w, h = 52) => { const e = box(x, y, w, h, 'pill ' + (ok ? 'ok' : 'ng')); e.innerHTML = html; return e; },
    get parent() { return parent; } };
})();
