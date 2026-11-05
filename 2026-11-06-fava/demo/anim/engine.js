// 공용 그리기 도구 (과정 애니메이션·롱폼이 같이 씀) — Day 9 ffsubsync 의 engine.js 기본 도구 + Day 10 fava 용 화면 캡처·메모장·막대그래프
const F = '"Noto Sans CJK KR", sans-serif', MONO = '"DejaVu Sans Mono", "Noto Sans CJK KR", monospace';
const INK = '#f0f3f6', SUB = '#9aa7b8', BLUE = '#58a6ff', RED = '#ff7b72', GOLD = '#f2c14e', GREEN = '#7ee787', PURPLE = '#d2a8ff';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, out3 = x => 1 - Math.pow(1 - x, 3), lerp = (a, b, k) => a + (b - a) * k;
let ctx, S = 1;
function setCtx(c, s) { ctx = c; S = s; }
function text(s, x, y, size, color = INK, weight = 700, align = 'center', alpha = 1, font = F) {
  if (alpha <= 0 || !s) return; ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = color; ctx.font = `${weight} ${size * S}px ${font}`;
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); ctx.restore();
}
const tw = (s, size, weight = 700, font = F) => { ctx.font = `${weight} ${size * S}px ${font}`; return ctx.measureText(s).width; };
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function box(x, y, w, h, r, fill, stroke, a = 1, lw = 3) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; rr(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw * S; ctx.stroke(); } ctx.restore();
}
// 숫자 카드
function stat(x, y, w, h, k, v, a, vc = GOLD, ks = 28, vs = 54) {
  box(x, y, w, h, 18 * S, '#161b22', '#30363d', a, 2); text(k, x + w / 2, y + h * .32, ks, SUB, 700, 'center', a); text(v, x + w / 2, y + h * .68, vs, vc, 900, 'center', a);
}
function pill(s, x, y, size, color, a = 1, fill = 'rgba(1,4,9,.85)') {
  const w = tw(s, size, 800) + size * 1.4 * S, h = size * 1.9 * S; box(x - w / 2, y - h / 2, w, h, h / 2, fill, color, a); text(s, x, y, size, color, 800, 'center', a); return w;
}
function term(x, y, w, h, title, a = 1) {
  box(x, y, w, h, 16 * S, '#010409', '#30363d', a, 2); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = '#161b22'; rr(x, y, w, 46 * S, [16 * S, 16 * S, 0, 0]); ctx.fill();
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { ctx.beginPath(); ctx.arc(x + (28 + i * 26) * S, y + 23 * S, 8 * S, 0, 7); ctx.fillStyle = c; ctx.fill(); });
  text(title, x + w / 2, y + 23 * S, 20, SUB, 500, 'center'); ctx.restore();
}
function typed(s, lt, a, b) { const n = Math.floor(s.length * prog(lt, a, b)); return s.slice(0, n) + (lt > a - 0.6 && lt < b + 0.6 && lt % 1 < .5 ? '▌' : ''); }
const fmtSec = s => s.toFixed(2) + "초";
function cut(s, size, maxw, weight = 600) { if (tw(s, size, weight) <= maxw) return s; while (s.length > 1 && tw(s + '…', size, weight) > maxw) s = s.slice(0, -1); return s + '…'; }
// ---- Day 10 fava: 실제 Fava 화면 캡처(../../media/shots/*.png) ----
const SHOT = {}; const SHOT_NAMES = ['01_income', '02_expense_tree', '03_expense_monthly', '04_balance', '05_journal', '06_food', '07_query', '08_editor', '09_september', '10_error_badge', '11_errors', '12_tenyears'];
function loadShots(base) {
  return Promise.all(SHOT_NAMES.map(n => new Promise(r => { const im = new Image(); im.onload = () => { SHOT[n] = im; r(); }; im.onerror = () => r(); im.src = `${base}/${n}.png`; })));
}
// 캡처 한 장을 (x,y,w,h) 칸에 그림. 원본에서 (sx,sy,sw,sh) 부분을 확대해서 보여 줄 수 있음
function shot(n, x, y, w, h, a = 1, src = null, frame = true) {
  const im = SHOT[n]; if (!im || a <= 0) return; ctx.save(); ctx.globalAlpha *= a; rr(x, y, w, h, 14); ctx.clip();
  const [sx, sy, sw, sh] = src || [0, 0, im.width, im.height]; ctx.drawImage(im, sx, sy, sw, sh, x, y, w, h); ctx.restore();
  if (frame) box(x, y, w, h, 14, null, '#30363d', a, 3);
}
// 확대 구간 보간: from/to = [sx,sy,sw,sh]
const zoom = (from, to, k) => from.map((v, i) => lerp(v, to[i], k));
// 캡처 좌표(1920×1080 기준)를 화면 칸 좌표로 바꿔 강조 상자 그리기
function hl(x, y, w, h, src, r, color, a = 1, label = '') {
  const [sx, sy, sw, sh] = src || [0, 0, 1920, 1080], kx = w / sw, ky = h / sh;
  const X = x + (r[0] - sx) * kx, Y = y + (r[1] - sy) * ky, Wd = r[2] * kx, Hd = r[3] * ky;
  box(X, Y, Wd, Hd, 10, null, color, a, 5); if (label) pill(label, X + Wd / 2, Y - 34, 28, color, a);
}
// 메모장 창 + 장부 글자
function notepad(x, y, w, h, lines, n, a = 1, size = 24, title = '가계부.beancount - 메모장') {
  box(x, y, w, h, 14, '#fbfbfb', '#30363d', a, 2); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; rr(x, y, w, h, 14); ctx.clip();
  ctx.fillStyle = '#e8eaed'; ctx.fillRect(x, y, w, 46); text(title, x + 24, y + 23, 20, '#333', 600, 'left');
  const lh = size * 1.45, rows = Math.floor((h - 70) / lh), start = Math.max(0, Math.ceil(n) - rows);
  for (let i = start; i < Math.min(lines.length, Math.ceil(n)); i++) {
    let s = lines[i]; if (i === Math.ceil(n) - 1) s = s.slice(0, Math.max(1, Math.round(s.length * (n - Math.floor(n) || 1))));
    const yy = y + 70 + (i - start) * lh + lh / 2, col = /^\d{4}/.test(s) ? '#0b5cad' : '#222';
    text(s, x + 24, yy, size, col, /^\d{4}/.test(s) ? 700 : 500, 'left', 1, MONO);
  }
  ctx.restore();
}
// 막대그래프 (값 배열, 강조할 줄 = limit)
function bars(x, y, w, h, vals, labels, k, color, a = 1, limit = null, fmt = v => v, size = 22) {
  if (a <= 0) return; const mx = Math.max(...vals, limit || 0) * 1.12, bw = w / vals.length;
  vals.forEach((v, i) => { const kk = clamp(k * vals.length - i), bh = h * v / mx * out3(kk);
    const over = limit && v > limit; box(x + i * bw + bw * .15, y + h - bh, bw * .7, bh, 6, over ? RED : color, null, a);
    text(labels[i], x + i * bw + bw / 2, y + h + 24, size, SUB, 600, 'center', a);
    if (kk > .9) text(fmt(v), x + i * bw + bw / 2, y + h - bh - 18, size * .9, over ? RED : INK, 700, 'center', a * prog(kk, .9, 1)); });
  box(x, y + h, w, 2, 0, '#30363d', null, a);
  if (limit) { const ly = y + h - h * limit / mx; ctx.save(); ctx.globalAlpha = a; ctx.setLineDash([12, 8]); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, ly); ctx.lineTo(x + w, ly); ctx.stroke(); ctx.restore(); }
}
const won = v => v >= 10000 ? (v / 10000).toFixed(v >= 1000000 ? 0 : 1).replace(/\.0$/, '') + '만' : v.toLocaleString();
