// 공용 그리기 도구 (과정 애니메이션·롱폼이 같이 씀) — Day 8 organize 의 engine.js 에서 기본 도구만 가져오고 소리·자막 타임라인을 더함
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
// ---- Day 9 ffsubsync: 소리 필름(말소리 파형) + 자막 필름(자막 막대) ----
// 창(win0~win1초)을 x~x+w 에 그린다. subs = [[시작,끝],...], shift = 자막 필름을 밀어 둔 초
function soundFilm(x, y, w, h, win0, win1, a = 1, hi = null) {
  if (a <= 0) return; box(x, y, w, h, 14 * S, '#0f1620', '#30363d', a, 2); ctx.save(); ctx.globalAlpha *= a;
  rr(x, y, w, h, 14 * S); ctx.clip(); const px = w / (win1 - win0);
  for (let i = Math.max(0, Math.floor(win0 * 20)); i < Math.min(ENV.length, Math.ceil(win1 * 20)); i++) {
    const v = ENV[i], bh = Math.max(2 * S, v * h * .85), bx = x + (i / 20 - win0) * px;
    ctx.fillStyle = v > .02 ? (hi && i / 20 >= hi[0] && i / 20 <= hi[1] ? GOLD : BLUE) : '#30363d'; ctx.fillRect(bx, y + h / 2 - bh / 2, Math.max(1, px / 20 - 1 * S), bh);
  }
  ctx.restore();
}
function subFilm(x, y, w, h, win0, win1, subs, shift, color, a = 1, label = true) {
  if (a <= 0) return; box(x, y, w, h, 14 * S, '#0f1620', '#30363d', a, 2); ctx.save(); ctx.globalAlpha *= a;
  rr(x, y, w, h, 14 * S); ctx.clip(); const px = w / (win1 - win0);
  subs.forEach(([s0, s1], i) => { const bx = x + (s0 + shift - win0) * px, bw = (s1 - s0) * px; if (bx > x + w || bx + bw < x) return;
    ctx.fillStyle = color; ctx.globalAlpha = a * .85; rr(bx, y + h * .18, bw, h * .64, 8 * S); ctx.fill(); ctx.globalAlpha = a;
    if (label && bw > 40 * S) text(`${i + 1}`, bx + bw / 2, y + h / 2, h * .34, '#0d1117', 900, 'center'); });
  ctx.restore();
}
// 시간 눈금 (초)
function ruler(x, y, w, win0, win1, a = 1, every = 5, size = 20) {
  const px = w / (win1 - win0); for (let s = Math.ceil(win0 / every) * every; s <= win1; s += every) {
    const xx = x + (s - win0) * px; box(xx - 1, y - 8, 2, 12, 0, SUB, null, a * .6); text(s + '초', xx, y + 18, size, SUB, 500, 'center', a); }
}
function playhead(x, y, w, h, win0, win1, t, a = 1, c = '#ffffff') {
  if (t < win0 || t > win1) return; const xx = x + (t - win0) * w / (win1 - win0); box(xx - 2 * S, y, 4 * S, h, 2, c, null, a);
}
// 지금 시각에 '들리는 말'과 '보이는 자막' (truth vs subs+shift)
function sayAt(t) { const c = TRUTH.cues.find(q => t >= q[0] && t < q[1]); return c ? c[2] : ''; }
function subAt(t, subs, shift = 0) { const i = subs.findIndex(q => t >= q[0] + shift && t < q[1] + shift); return i < 0 ? '' : TRUTH.cues[i][2]; }
