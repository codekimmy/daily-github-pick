// 공용 그리기 도구 (과정 애니메이션·롱폼이 같이 씀) — Day 9·10 engine.js 기본 도구 + Day 11 사진 불러오기
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
// ---- Day 11 blind_watermark: 시연 사진(../work/*.png, scikit-image 예제 CC0·퍼블릭 도메인) ----
const IMG = {};
function loadImgs(base, names) {
  return Promise.all(names.map(n => new Promise(r => { const im = new Image(); im.onload = () => { IMG[n] = im; r(); }; im.onerror = () => { console.log('missing', n); r(); }; im.src = `${base}/${n}.png`; })));
}
// 사진을 (x,y,w,h) 칸 안에 비율 유지해서 그림. src=[sx,sy,sw,sh] 로 일부 확대 가능. 실제 그린 칸을 돌려줌
function pic(n, x, y, w, h, a = 1, src = null, frame = true, smooth = true) {
  const im = IMG[n]; if (!im || a <= 0) return [x, y, w, h];
  const [sx, sy, sw, sh] = src || [0, 0, im.width, im.height], k = Math.min(w / sw, h / sh), dw = sw * k, dh = sh * k, dx = x + (w - dw) / 2, dy = y + (h - dh) / 2;
  ctx.save(); ctx.globalAlpha *= a; ctx.imageSmoothingEnabled = smooth; rr(dx, dy, dw, dh, 12); ctx.clip(); ctx.drawImage(im, sx, sy, sw, sh, dx, dy, dw, dh); ctx.restore();
  if (frame) box(dx, dy, dw, dh, 12, null, '#30363d', a, 2); return [dx, dy, dw, dh];
}
const zoom = (from, to, k) => from.map((v, i) => lerp(v, to[i], k));
function mark(ok, x, y, size, a = 1) { // ✔ / ✘ 동그라미
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(x, y, size, 0, 7); ctx.fillStyle = ok ? '#1f6f3a' : '#8e1c1c'; ctx.fill(); ctx.restore();
  text(ok ? '✔' : '✘', x, y + 2, size * 1.2, '#fff', 900, 'center', a);
}
