// 공용 그리기 도구 (과정 애니메이션·롱폼이 같이 씀)
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
// 원본 → 배경 지운 결과로 바뀌는 장면: sweep(0~1) 위쪽은 결과(바둑판 위), 아래쪽은 원본
function reveal(orig, cut, x, y, w, h, sweep, a = 1, round = 18, bgFill = null) {
  if (a <= 0) return; const [ix, iy, iw, ih] = fit(orig, x, y, w, h);
  ctx.save(); ctx.globalAlpha *= a; rr(ix, iy, iw, ih, round * S); ctx.clip();
  ctx.drawImage(orig, ix, iy, iw, ih);
  if (sweep > 0) {
    const sy = iy + ih * sweep; ctx.save(); ctx.beginPath(); ctx.rect(ix, iy, iw, sy - iy); ctx.clip();
    if (bgFill === 'white') { ctx.fillStyle = '#fff'; ctx.fillRect(ix, iy, iw, ih); } else if (bgFill && bgFill.width) ctx.drawImage(bgFill, ix, iy, iw, ih); else checker(ix, iy, iw, ih);
    ctx.drawImage(cut, ix, iy, iw, ih); ctx.restore();
    if (sweep < 1) { const g = ctx.createLinearGradient(0, sy - 30 * S, 0, sy + 6 * S); g.addColorStop(0, 'rgba(88,166,255,0)'); g.addColorStop(1, 'rgba(88,166,255,.9)'); ctx.fillStyle = g; ctx.fillRect(ix, sy - 30 * S, iw, 36 * S); ctx.fillStyle = '#cfe6ff'; ctx.fillRect(ix, sy - 2 * S, iw, 4 * S); }
  }
  ctx.restore(); return [ix, iy, iw, ih];
}
// 배경 지운 결과만 (바둑판 또는 색 배경 위)
function cutOn(cut, x, y, w, h, a = 1, bg = 'checker', round = 18) {
  if (a <= 0) return; const [ix, iy, iw, ih] = fit(cut, x, y, w, h);
  ctx.save(); ctx.globalAlpha *= a; rr(ix, iy, iw, ih, round * S); ctx.clip();
  if (bg === 'checker') checker(ix, iy, iw, ih); else if (bg && bg.width) ctx.drawImage(bg, ix, iy, iw, ih); else if (bg) { ctx.fillStyle = bg; ctx.fillRect(ix, iy, iw, ih); }
  ctx.drawImage(cut, ix, iy, iw, ih); ctx.restore(); return [ix, iy, iw, ih];
}
function photo(im, x, y, w, h, a = 1, round = 18) {
  if (a <= 0) return; const [ix, iy, iw, ih] = fit(im, x, y, w, h);
  ctx.save(); ctx.globalAlpha *= a; rr(ix, iy, iw, ih, round * S); ctx.clip(); ctx.drawImage(im, ix, iy, iw, ih); ctx.restore(); return [ix, iy, iw, ih];
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
const fmtSec = s => s.toFixed(1) + '초';
// 메모장 창: lines(글줄 배열) 중 앞에서부터 nChars 글자까지 보여 줌. --- 는 파란색(장 나누기), # 는 노란색(제목)
function mdColor(l, inFront) { if (l === '---') return BLUE; if (inFront) return PURPLE; if (l.startsWith('#')) return GOLD; if (l.startsWith('|')) return SUB; return INK; }
function notepad(x, y, w, h, title, lines, nChars, a = 1, size = 19, lh = 25, scroll = 0) {
  box(x, y, w, h, 14 * S, '#ffffff', '#30363d', a, 2); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = '#e9edf2'; rr(x, y, w, 44 * S, [14 * S, 14 * S, 0, 0]); ctx.fill();
  text(title, x + 22 * S, y + 22 * S, 20, '#24292f', 600, 'left');
  ctx.fillStyle = '#1e2329'; rr(x + 2 * S, y + 44 * S, w - 4 * S, h - 46 * S, [0, 0, 12 * S, 12 * S]); ctx.fill();
  ctx.beginPath(); ctx.rect(x, y + 50 * S, w, h - 56 * S); ctx.clip();
  let left = nChars, front = 0, cur = null;
  lines.forEach((l, i) => {
    if (l === '---' && i < 6) front++;
    const inFront = front === 1 && l !== '---';
    if (left <= 0) return; const s = l.slice(0, Math.max(0, left)); left -= l.length + 1;
    const yy = y + (64 + i * lh - scroll) * S;
    text(String(i + 1).padStart(2, ' '), x + 34 * S, yy, size - 3, '#5c6773', 500, 'right', 1, MONO);
    text(s, x + 50 * S, yy, size, mdColor(l, inFront), l.startsWith('#') ? 800 : 600, 'left', 1, MONO);
    cur = [x + 50 * S + tw(s, size, 600, MONO), yy];
  });
  if (cur && left <= 0) { ctx.fillStyle = GREEN; ctx.fillRect(cur[0] + 2 * S, cur[1] - size * .6 * S, 3 * S, size * 1.2 * S); }
  ctx.restore();
}
