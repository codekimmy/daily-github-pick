// 공용 그리기 도구 (과정 애니메이션·롱폼이 같이 씀) — Day 6 marp-cli 의 engine.js 에서 가져와 QR용 도구를 더함
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
// 투명 부분을 보여 주는 바둑판 무늬
function checker(x, y, w, h, cell = 18) {
  ctx.save(); rr(x, y, w, h, 0); ctx.clip(); ctx.fillStyle = '#f4f4f4'; ctx.fillRect(x, y, w, h); ctx.fillStyle = '#d0d0d0';
  const c = cell * S; for (let j = 0; j * c < h; j++) for (let i = 0; i * c < w; i++) if ((i + j) % 2) ctx.fillRect(x + i * c, y + j * c, c, c);
  ctx.restore();
}
// 이미지 불러오기
const IMG = {};
function loadImages(map) {
  return Promise.all(Object.entries(map).map(([k, src]) => new Promise(r => { const im = new Image(); im.onload = () => { IMG[k] = im; r(); }; im.onerror = () => { console.error('missing', src); r(); }; im.src = src; })));
}
// 사진을 상자 안에 비율 유지해 맞추기 → [x,y,w,h]
function fit(im, x, y, w, h) { const k = Math.min(w / im.width, h / im.height), iw = im.width * k, ih = im.height * k; return [x + (w - iw) / 2, y + (h - ih) / 2, iw, ih]; }
function photo(im, x, y, w, h, a = 1, round = 18, pixel = false) {
  if (a <= 0 || !im) return; const [ix, iy, iw, ih] = fit(im, x, y, w, h);
  ctx.save(); ctx.globalAlpha *= a; ctx.imageSmoothingEnabled = !pixel; rr(ix, iy, iw, ih, round * S); ctx.clip(); ctx.drawImage(im, ix, iy, iw, ih); ctx.restore(); return [ix, iy, iw, ih];
}
// QR 그림: 흰 카드 위에 또렷하게(픽셀 그대로) 그리기
function qr(im, x, y, w, a = 1, stroke = null) {
  if (a <= 0 || !im) return; box(x - 14 * S, y - 14 * S, w + 28 * S, w + 28 * S, 18 * S, '#ffffff', stroke, a, 4);
  photo(im, x, y, w, w, a, 0, true);
}
// 위에서 아래로 쓸어내리며 a→b 로 바뀌는 장면 (sweep 0~1)
function sweepQR(a, b, x, y, w, sweep, al = 1) {
  if (al <= 0) return; qr(a, x, y, w, al);
  if (sweep <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.beginPath(); ctx.rect(x, y, w, w * sweep); ctx.clip(); ctx.imageSmoothingEnabled = false; ctx.drawImage(b, x, y, w, w); ctx.restore();
  if (sweep < 1) { const sy = y + w * sweep; ctx.save(); ctx.globalAlpha *= al; const g = ctx.createLinearGradient(0, sy - 30 * S, 0, sy + 6 * S); g.addColorStop(0, 'rgba(88,166,255,0)'); g.addColorStop(1, 'rgba(88,166,255,.9)'); ctx.fillStyle = g; ctx.fillRect(x, sy - 30 * S, w, 36 * S); ctx.fillStyle = '#cfe6ff'; ctx.fillRect(x, sy - 2 * S, w, 4 * S); ctx.restore(); }
}
// 휴대폰 카메라 화면처럼 모서리 틀 + 위아래로 움직이는 빨간 선 → done 이면 초록
function scanFrame(x, y, w, t, done, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; const c = done ? GREEN : '#ffffff', L = w * .16, m = 26 * S;
  ctx.strokeStyle = c; ctx.lineWidth = 8 * S; ctx.lineCap = 'round';
  [[x - m, y - m, 1, 1], [x + w + m, y - m, -1, 1], [x - m, y + w + m, 1, -1], [x + w + m, y + w + m, -1, -1]].forEach(([px, py, sx, sy]) => { ctx.beginPath(); ctx.moveTo(px + sx * L, py); ctx.lineTo(px, py); ctx.lineTo(px, py + sy * L); ctx.stroke(); });
  if (!done) { const yy = y + w * (.5 + .5 * Math.sin(t * 4)); ctx.fillStyle = 'rgba(255,80,80,.85)'; ctx.fillRect(x - 10 * S, yy - 2 * S, w + 20 * S, 4 * S); }
  ctx.restore();
}
// 숫자 카드
function stat(x, y, w, h, k, v, a, vc = GOLD, ks = 28, vs = 54) {
  box(x, y, w, h, 18 * S, '#161b22', '#30363d', a, 2); text(k, x + w / 2, y + h * .32, ks, SUB, 700, 'center', a); text(v, x + w / 2, y + h * .68, vs, vc, 900, 'center', a);
}
// 해결/실패 배지
function badge(ok, x, y, size, a = 1) { pill(ok ? '✔ 읽힘' : '✖ 못 읽음', x, y, size, ok ? GREEN : RED, a); }
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
