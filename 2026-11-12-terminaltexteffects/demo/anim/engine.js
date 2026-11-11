// 공용 그리기 도구 (과정 애니메이션·롱폼이 같이 씀) — Day 9~15 engine.js 기본 도구 + TTE 실제 프레임 그리기
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


// ---- Day 16 terminaltexteffects: prep.py 가 저장한 실제 효과 프레임(fx.js)을 터미널처럼 한 칸씩 그림 ----
const WIDE = /[\u1100-\u115f\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6]/; // 한글·한자 = 2칸
const fxLen = k => FX[k].frames.length / 30;          // 초 (초당 30장으로 저장)
// k: 효과 이름, s: 효과 시작부터 지난 초(끝나면 마지막 화면 유지), (x, y): 무대 왼쪽 위, cw: 한 칸 너비(px), a: 투명도
function drawFX(k, s, x, y, cw, a = 1, rowsShown) {
  if (a <= 0 || !FX[k]) return; const fx = FX[k], fr = fx.frames[Math.max(0, Math.min(fx.frames.length - 1, Math.floor(s * 30)))], lh = cw * 2.05;
  ctx.save(); ctx.globalAlpha *= a; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  fr.forEach((row, ri) => { let col = 0; const yy = y + ri * lh + lh / 2;
    row.forEach(([t, c]) => { for (const ch of t) { const w = WIDE.test(ch) ? 2 : 1;
      if (ch !== ' ' && c) { ctx.fillStyle = '#' + c; ctx.font = `${w === 2 ? 700 : 600} ${cw * (w === 2 ? 1.86 : 1.66)}px ${w === 2 ? F : MONO}`; ctx.fillText(ch, x + col * cw, yy); }
      col += w; } }); });
  ctx.restore();
}
// 터미널 창 + 효과 (무대 가로 칸 수 × 세로 줄 수에 맞춰 창 크기 계산). 한글 1글자=2칸이므로 가로 여유 10칸 (글 크기 무대는 2배)
function fxTerm(k, s, cx, cy, cw, a = 1, title) {
  if (a <= 0) return; const fx = FX[k], SL = fx.cols < 20 ? fx.cols * 2 : fx.cols + 10, W0 = SL * cw + 40, H0 = fx.rows * cw * 2.05 + 100;
  term(cx - W0 / 2, cy - H0 / 2, W0, H0, title || `tte ${fx.effect}`, a);
  drawFX(k, s, cx - W0 / 2 + 20 + (fx.cols < 20 ? 0 : 5) * cw, cy - H0 / 2 + 70, cw, a);
  return [cx - W0 / 2, cy - H0 / 2, W0, H0];
}
