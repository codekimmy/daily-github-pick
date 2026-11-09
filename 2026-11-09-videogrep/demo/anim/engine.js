// 공용 그리기 도구 (과정 애니메이션·롱폼이 같이 씀) — Day 9~12 engine.js 기본 도구 + Day 13 영상 타임라인·플레이어
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
function mark(ok, x, y, size, a = 1) { // ✔ / ✘ 동그라미
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(x, y, size, 0, 7); ctx.fillStyle = ok ? '#1f6f3a' : '#8e1c1c'; ctx.fill(); ctx.restore();
  text(ok ? '✔' : '✘', x, y + 2, size * 1.2, '#fff', 900, 'center', a);
}

// ---- Day 13 videogrep: 실제 결과 영상 프레임(fr/) 재생, 자막 줄 타임라인 ----
const IMG = {};
function loadFrames(base) { // base: fr 폴더 위치(상대 경로)
  const ps = [];
  Object.entries(R.FR).forEach(([n, c]) => { IMG[n] = []; for (let i = 1; i <= c; i++) { const im = new Image(); im.src = `${base}/${n}/${n === 'src' ? String(i).padStart(3, '0') : String(i).padStart(4, '0')}.jpg`; IMG[n].push(im); ps.push(im.decode().catch(() => {})); } });
  return Promise.all(ps);
}
// 영상 플레이어 창: name 프레임을 시각 t(초)에 맞춰 그림 (10fps로 뽑은 실제 결과 영상)
function player(x, y, w, h, name, t, title, a = 1) {
  if (a <= 0) return; const L = IMG[name], i = clamp(Math.floor(t * 10), 0, L.length - 1);
  box(x - 3, y - 3, w + 6, h + 52, 14, '#010409', '#30363d', a, 2);
  ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(L[i], x, y, w, h); ctx.restore();
  const k = (i + 1) / L.length; box(x, y + h + 18, w, 8, 4, '#30363d', null, a); box(x, y + h + 18, w * k, 8, 4, RED, null, a);
  if (title) text(title, x + 10, y + h + 40, 20, SUB, 600, 'left', a);
}
const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
// 원본 영상 타임라인: 자막 줄마다 칸, hits 줄은 금색
function timeline(x, y, w, h, srt, total, hits, a = 1, hk = 1, label = true) {
  if (a <= 0) return; box(x, y, w, h, 10, '#161b22', '#30363d', a, 2);
  srt.forEach(([s, e], i) => { const hit = hits.includes(i), xx = x + w * s / total, ww = Math.max(3, w * (e - s) / total);
    box(xx, y + 8, ww, h - 16, 3, hit ? `rgba(242,193,78,${.25 + .75 * hk})` : 'rgba(88,166,255,.28)', hit && hk > .5 ? GOLD : null, a, 2); });
  if (label) { text('0:00', x, y + h + 26, 20, SUB, 600, 'left', a); text(mmss(total), x + w, y + h + 26, 20, SUB, 600, 'right', a); }
}
