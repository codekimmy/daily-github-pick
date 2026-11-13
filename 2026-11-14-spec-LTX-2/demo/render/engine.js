// 사양 카드 그리기 도구 (롱폼·과정 애니메이션 공용). 모든 숫자는 공식 자료(README.md 필요 사양 표)에서 옮긴 값
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
// 그래픽카드 그림 (직접 그린 단순 도형)
function gpu(x, y, w, h, label, a = 1, color = BLUE) {
  if (a <= 0) return; box(x, y, w, h, 14, '#1f2733', color, a, 3);
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < 2; i++) { const cx = x + w * (.3 + i * .4), cy = y + h * .5, r = h * .32; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.strokeStyle = SUB; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, r * .25, 0, 7); ctx.fillStyle = SUB; ctx.fill(); }
  ctx.fillStyle = GOLD; for (let i = 0; i < 9; i++) ctx.fillRect(x + w * .12 + i * w * .085, y + h, w * .05, h * .12);
  ctx.restore(); if (label) text(label, x + w / 2, y - 26, 26, color, 800, 'center', a);
}
// 0~32GB 눈금 막대
const LADDER = [
  { gb: 8, txt: '내 PC 생성 불가 → 클라우드(API)', c: RED },
  { gb: 10, txt: '720p 5초 · 540p 10초까지', c: GOLD },
  { gb: 12, txt: '1080p 10초 (6조각)', c: GOLD },
  { gb: 16, txt: '1080p 20초 (6조각)', c: GOLD },
  { gb: 24, txt: '1440p 20초 · 4K 10초 (공식 권장 시작)', c: GREEN },
  { gb: 32, txt: '4K 10초 (7조각) · 공식 권장', c: GREEN },
];
function ladder(x, y, w, rowH, shown, lt, starts, compact = false) {
  const lab = compact ? 120 : 150, bw = w - lab - 20;
  LADDER.forEach((r, i) => {
    if (i >= shown) return; const k = out3(prog(lt, starts[i], starts[i] + .8)), yy = y + i * rowH;
    text(r.gb + 'GB', x + lab - 16, yy + rowH * .32, compact ? 34 : 40, r.c, 900, 'right', k);
    box(x + lab, yy + rowH * .12, bw, rowH * .4, 10, '#21262d', null, k);
    box(x + lab, yy + rowH * .12, bw * (r.gb / 32) * k, rowH * .4, 10, r.c, null, .9 * k);
    const fs = fit(r.txt, compact ? 26 : 28, bw, 700);
    text(r.txt, x + lab, yy + rowH * .75, fs, INK, 700, 'left', k);
  });
}
const DISCLAIMER = ['정보 제공용 · 2026-11-14 공식 자료 기준 정리(직접 실행하지 않음)', '사양·시간은 모델 버전·설정·영상 길이에 따라 달라짐 · 라이선스 확인 필수'];
