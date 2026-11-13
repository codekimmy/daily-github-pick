// 그리기 도구 (롱폼·과정 애니메이션 공용). 숫자는 모두 ../results.json(시연 측정값)에서 가져옴 — 2026-11-14-spec-LTX-2 엔진을 고쳐 씀
const F = '"Noto Sans CJK KR", sans-serif', MONO = '"DejaVu Sans Mono", "Noto Sans CJK KR", monospace';
const BG = '#0d1117', CARD = '#161b22', LINE = '#30363d', INK = '#f0f3f6', SUB = '#9aa7b8', BLUE = '#58a6ff', RED = '#ff7b72', GOLD = '#f2c14e', GREEN = '#7ee787', PURPLE = '#d2a8ff';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, out3 = x => 1 - Math.pow(1 - x, 3), lerp = (a, b, k) => a + (b - a) * k;
let ctx;
function text(s, x, y, size, color = INK, weight = 700, align = 'center', alpha = 1, font = F) {
  if (alpha <= 0 || !s) return; ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); ctx.restore();
}
const tw = (s, size, weight = 700, font = F) => { ctx.font = `${weight} ${size}px ${font}`; return ctx.measureText(s).width; };
function fit(s, size, maxw, weight = 700) { while (size > 14 && tw(s, size, weight) > maxw) size -= 1; return size; }
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function box(x, y, w, h, r, fill, stroke, a = 1, lw = 2) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; rr(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } ctx.restore();
}
function pill(s, x, y, size, color, a = 1, fill = 'rgba(1,4,9,.85)') {
  const w = tw(s, size, 800) + size * 1.4, h = size * 1.9; box(x - w / 2, y - h / 2, w, h, h / 2, fill, color, a, 2); text(s, x, y, size, color, 800, 'center', a); return w;
}
// 글 여러 줄 (최대 너비에서 낱말 단위로 줄바꿈)
function wrap(s, maxw, size, weight = 700) {
  const out = []; let line = '';
  for (const wd of s.split(' ')) { const t = line ? line + ' ' + wd : wd; if (tw(t, size, weight) > maxw && line) { out.push(line); line = wd; } else line = t; }
  if (line) out.push(line); return out;
}
function para(s, x, y, maxw, size, color = INK, weight = 700, align = 'left', a = 1, lh = 1.35) {
  const L = wrap(s, maxw, size, weight); L.forEach((l, i) => text(l, x, y + i * size * lh, size, color, weight, align, a)); return L.length * size * lh;
}
// 체크 표시(그려지는 V)
function check(x, y, s, k, color = GREEN, a = 1) {
  if (k <= 0 || a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = color; ctx.lineWidth = s * .16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const p = [[x - s * .35, y], [x - s * .08, y + s * .28], [x + s * .4, y - s * .3]]; const L1 = .4;
  ctx.beginPath(); ctx.moveTo(...p[0]);
  if (k < L1) ctx.lineTo(lerp(p[0][0], p[1][0], k / L1), lerp(p[0][1], p[1][1], k / L1));
  else { ctx.lineTo(...p[1]); const q = (k - L1) / (1 - L1); ctx.lineTo(lerp(p[1][0], p[2][0], q), lerp(p[1][1], p[2][1], q)); }
  ctx.stroke(); ctx.restore();
}
function cross(x, y, s, a = 1, color = RED) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = color; ctx.lineWidth = s * .16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * .3, y - s * .3); ctx.lineTo(x + s * .3, y + s * .3); ctx.moveTo(x + s * .3, y - s * .3); ctx.lineTo(x - s * .3, y + s * .3); ctx.stroke(); ctx.restore();
}
const DISCLAIMER = ['정보 제공용 · 2026-11-14 클라우드 시연 결과(운영자 직접 검증 아님)', '원본 녹음은 따로 보관 · 결과는 직접 들어 보고 확인 · 시연 녹음은 직접 합성한 가상 녹음'];
