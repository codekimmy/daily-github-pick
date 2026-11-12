// 공용 그리기 도구 (과정 애니메이션·롱폼이 같이 씀) — Day 9~16 engine.js 기본 도구 + PixelOE 사진·도트 그림 그리기
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
function typed(s, lt, a, b) { const n = Math.floor(s.length * prog(lt, a, b)); return s.slice(0, n) + (lt >= a && lt < b + .3 ? '▌' : ''); } // 깜빡임 방지: 커서는 치는 동안만 켜 둠(깜빡이지 않음)
const fmtSec = s => s.toFixed(2) + "초";
function cut(s, size, maxw, weight = 600) { if (tw(s, size, weight) <= maxw) return s; while (s.length > 1 && tw(s + '…', size, weight) > maxw) s = s.slice(0, -1); return s + '…'; }
function mark(ok, x, y, size, a = 1) { // ✔ / ✘ 동그라미
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(x, y, size, 0, 7); ctx.fillStyle = ok ? '#1f6f3a' : '#8e1c1c'; ctx.fill(); ctx.restore();
  text(ok ? '✔' : '✘', x, y + 2, size * 1.2, '#fff', 900, 'center', a);
}


// ---- Day 17 PixelOE: 실제 결과 그림(../out/, ../photos/)을 불러와 그림 ----
const IMG = {}, IMG_LIST = ['photos/고양이', 'photos/커피', 'out/고양이_모자이크96', 'out/고양이_pixeloe96', 'out/커피_모자이크96', 'out/커피_pixeloe96',
  'out/고양이_크기32', 'out/고양이_크기64', 'out/고양이_크기128', 'out/고양이_크기256', 'out/cli_커피_점64', 'out/cli_커피_점64_색8', 'out/cli_기본값',
  'out/고양이_두께0', 'out/고양이_두께1', 'out/고양이_두께2', 'out/고양이_두께3', 'out/커피_방식nearest', 'out/커피_방식k-centroid', 'out/커피_방식contrast', 'out/커피_방식center',
  'photos/도트그림/고양이_비교', 'photos/도트그림/커피_비교'];
function loadImages(base) {
  return Promise.all(IMG_LIST.map(n => new Promise((ok, no) => { const im = new Image(); im.onload = () => { IMG[n.split('/').pop()] = im; ok(); }; im.onerror = () => no(n); im.src = base + n + '.png'; })));
}
// 상자(x,y,w,h) 안에 비율을 지키며 가운데 그림. 도트 그림은 계단이 보이게 smoothing 끔. 그린 자리 [x,y,w,h] 를 돌려줌
function fitRect(im, x, y, w, h) { const k = Math.min(w / im.width, h / im.height), ww = im.width * k, hh = im.height * k; return [x + (w - ww) / 2, y + (h - hh) / 2, ww, hh]; }
function pic(n, x, y, w, h, a = 1, smooth = false, border = '#30363d') {
  const im = IMG[n]; if (!im || a <= 0) return [x, y, w, h]; const r = fitRect(im, x, y, w, h);
  ctx.save(); ctx.globalAlpha *= a; ctx.imageSmoothingEnabled = smooth; ctx.drawImage(im, ...r); ctx.restore();
  if (border) box(r[0] - 2, r[1] - 2, r[2] + 4, r[3] + 4, 6, null, border, a, 2); return r;
}
// 원본 위로 도트 그림이 왼쪽부터 덮이는 장면(k: 0→1), 경계에 노란 세로줄
function sweep(orig, dot, x, y, w, h, k, a = 1) {
  const r = pic(orig, x, y, w, h, a, true); if (k <= 0 || a <= 0) return r;
  const im = IMG[dot], cw = r[2] * clamp(k); ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.rect(r[0], r[1], cw, r[3]); ctx.clip();
  ctx.imageSmoothingEnabled = false; ctx.drawImage(im, r[0], r[1], r[2], r[3]); ctx.restore();
  if (k < 1) box(r[0] + cw - 3, r[1], 6, r[3], 3, GOLD, null, a); return r;
}
// 원본 사진 위에 타일 칸(격자)을 그림 (비유: 타일 장인)
function grid(r, nx, a = 1) {
  if (a <= 0) return; const s = r[2] / nx; ctx.save(); ctx.globalAlpha *= a * .55; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1;
  ctx.beginPath(); for (let x = r[0]; x <= r[0] + r[2] + .1; x += s) { ctx.moveTo(x, r[1]); ctx.lineTo(x, r[1] + r[3]); }
  for (let y = r[1]; y <= r[1] + r[3] + .1; y += s) { ctx.moveTo(r[0], y); ctx.lineTo(r[0] + r[2], y); } ctx.stroke(); ctx.restore();
}
// 그림 일부(sx,sy,sw,sh: 0~1 비율)를 확대해서 그림
function zoom(n, sx, sy, sw, sh, x, y, w, h, a = 1, smooth = false, border = GOLD) {
  const im = IMG[n]; if (!im || a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.imageSmoothingEnabled = smooth;
  ctx.drawImage(im, sx * im.width, sy * im.height, sw * im.width, sh * im.height, x, y, w, h); ctx.restore(); box(x - 2, y - 2, w + 4, h + 4, 6, null, border, a, 3);
}
