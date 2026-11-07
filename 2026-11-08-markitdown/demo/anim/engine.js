// 공용 그리기 도구 (과정 애니메이션·롱폼이 같이 씀) — Day 9~11 engine.js 기본 도구 + Day 12 문서 모양·글 화면
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

// ---- Day 12 markitdown: 원본 문서 모양(워드 쪽·엑셀 칸·슬라이드·PDF)과 변환된 글(마크다운) 화면 ----
const KCOL = { 워드: '#2b6cd6', 엑셀: '#1f8a4c', 파워포인트: '#d2552b', PDF: '#c4302b', 웹페이지: '#8957e5', CSV: '#3f9e8f', 전자책: '#b8860b', ZIP: '#6e7781', '스캔 PDF': '#c4302b', 사진: '#bf3989' };
const EXT = { 워드: 'DOCX', 엑셀: 'XLSX', 파워포인트: 'PPTX', PDF: 'PDF', 웹페이지: 'HTML', CSV: 'CSV', 전자책: 'EPUB', ZIP: 'ZIP', '스캔 PDF': 'PDF', 사진: 'JPG' };
// 파일 아이콘 (모서리 접힌 종이 + 확장자 띠)
function fileIcon(kind, cx, cy, s, a = 1) {
  if (a <= 0) return; const w = s * .78, h = s, x = cx - w / 2, y = cy - h / 2, f = s * .24; ctx.save(); ctx.globalAlpha *= a;
  ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x + w - f, y); ctx.lineTo(x + w, y + f); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath();
  ctx.beginPath(); ctx.roundRect(x, y, w - f, h, 8); ctx.rect(x, y + f, w, h - f); ctx.fillStyle = '#e9eef4'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + w - f, y); ctx.lineTo(x + w, y + f); ctx.lineTo(x + w - f, y + f); ctx.closePath(); ctx.fillStyle = '#b8c2cc'; ctx.fill();
  ctx.fillStyle = KCOL[kind] || BLUE; ctx.fillRect(x - s * .06, y + h * .52, w * .9, h * .26); ctx.restore();
  text(EXT[kind] || kind, x - s * .06 + w * .45, y + h * .65, s * .17, '#fff', 900, 'center', a);
  for (let i = 0; i < 3; i++) box(x + w * .14, y + h * (.2 + i * .09), w * (i === 2 ? .4 : .6), h * .035, 2, '#b8c2cc', null, a);
}
// 워드·PDF 쪽 모양. B = [[종류, 내용]] 종류: t 제목, m 작은 글, h 소제목, p 문단, b 글머리, n 번호, tb 표(행 배열)
function page(x, y, w, h, B, a = 1, k = 1, upto = 1e9) {
  if (a <= 0) return; box(x, y, w, h, 6, '#ffffff', '#c9d1d9', a, 1); ctx.save(); rr(x, y, w, h, 6); ctx.clip();
  let yy = y + 34 * k; const L = x + 34 * k, iw = w - 68 * k, dark = '#1f2328', grey = '#57606a';
  B.slice(0, upto).forEach(([t, s], i) => {
    if (t === 't') { text(s, L, yy + 6 * k, 26 * k, dark, 900, 'left', a); yy += 46 * k; }
    else if (t === 'm') { text(cut(s, 13 * k, iw, 500), L, yy, 13 * k, grey, 500, 'left', a); yy += 30 * k; }
    else if (t === 'h') { text(s, L, yy + 4 * k, 19 * k, '#2b6cd6', 800, 'left', a); yy += 34 * k; }
    else if (t === 'p') { text(cut(s, 15 * k, iw, 500), L, yy, 15 * k, dark, 500, 'left', a); yy += 28 * k; }
    else if (t === 'b' || t === 'n') { text((t === 'b' ? '•  ' : `${s[0]}.  `) + (t === 'b' ? s : s[1]), L + 10 * k, yy, 15 * k, dark, 500, 'left', a); yy += 26 * k; }
    else if (t === 'tb') { const rh = 28 * k, cw = [iw * .55, iw * .25, iw * .2];
      s.forEach((row, r) => { let xx = L; row.forEach((c, j) => { box(xx, yy - rh / 2 + 4 * k, cw[j], rh, 0, r === 0 ? '#eef3fb' : null, '#8c959f', a, 1); text(cut(c, 14 * k, cw[j] - 12 * k, 600), xx + 8 * k, yy + 4 * k, 14 * k, dark, r === 0 ? 800 : 500, 'left', a); xx += cw[j]; }); yy += rh; }); yy += 14 * k; }
  }); ctx.restore();
}
const DOCX = [['t', "꽃집 '봄날' 11월 운영 회의록"], ['m', '일시: 2026년 11월 3일(화) 오후 2시 · 장소: 매장 2층 · 참석: 김사장, 이매니저, 박직원'], ['h', '1. 지난달 결과'],
  ['p', '10월 매출은 1,284만 원으로 9월보다 12% 늘었습니다.'], ['b', '가을 꽃다발 주문이 가장 많았습니다'], ['b', '온라인 예약이 전체 주문의 38%였습니다'], ['b', '배달 지연 문의가 7건 있었습니다'],
  ['h', '2. 이번 달 할 일'], ['tb', [['할 일', '담당', '마감'], ['빼빼로데이 꽃다발 30개 준비', '이매니저', '11/10'], ['배달 기사 1명 추가 구하기', '김사장', '11/14'], ['포인세티아 화분 입고', '박직원', '11/20'], ['연말 예약 안내문 붙이기', '박직원', '11/25']]],
  ['h', '3. 정한 것'], ['n', ['1', '배달은 오후 6시 전 주문만 당일 출발']], ['n', ['2', '꽃다발 기본 가격 35,000원 유지']], ['n', ['3', '다음 회의: 12월 1일']]];
// 엑셀 칸 모양 (rows 2차원, 시트 이름 탭)
function sheet(x, y, w, h, rows, tabs, a = 1, k = 1) {
  if (a <= 0) return; box(x, y, w, h, 6, '#ffffff', '#c9d1d9', a, 1); ctx.save(); rr(x, y, w, h, 6); ctx.clip();
  const rh = 30 * k, cw = [w * .26, w * .16, w * .3, w * .28]; let yy = y;
  rows.forEach((row, r) => { let xx = x; row.forEach((c, j) => { box(xx, yy, cw[j], rh, 0, r === 0 ? '#e6f2ea' : null, '#d0d7de', a, 1); text(cut(String(c), 14 * k, cw[j] - 10, 600), xx + (j === 3 ? cw[j] - 8 * k : 8 * k), yy + rh / 2, 14 * k, '#1f2328', r === 0 ? 800 : 500, j === 3 ? 'right' : 'left', a); xx += cw[j]; }); yy += rh; });
  ctx.restore(); tabs.forEach((t, i) => { box(x + 10 + i * 90 * k, y + h - 30 * k, 84 * k, 26 * k, 4, i === 0 ? '#1f8a4c' : '#e6f2ea', null, a); text(t, x + 10 + i * 90 * k + 42 * k, y + h - 17 * k, 13 * k, i === 0 ? '#fff' : '#1f2328', 800, 'center', a); });
}
// 슬라이드 모양
function slide(x, y, w, h, title, lines, a = 1, k = 1, note = '') {
  if (a <= 0) return; box(x, y, w, h, 6, '#fff7f2', '#d2552b', a, 2); box(x, y, w, 10 * k, 0, '#d2552b', null, a);
  text(title, x + 30 * k, y + 54 * k, 28 * k, '#1f2328', 900, 'left', a); lines.forEach((s, i) => text('•  ' + s, x + 40 * k, y + (110 + i * 36) * k, 18 * k, '#1f2328', 500, 'left', a));
  if (note) { box(x, y + h + 8 * k, w, 40 * k, 6, '#161b22', '#30363d', a, 1); text('메모: ' + note, x + 16 * k, y + h + 28 * k, 15 * k, SUB, 600, 'left', a); }
}
// 변환된 글(마크다운) 화면 — 줄 종류별 색: # 제목 파랑, | 표 초록, 글머리 금색, 나머지 흰색
function mdView(x, y, w, h, lines, n, size = 20, a = 1, title = '결과.md (글 파일)') {
  term(x, y, w, h, title, a); if (a <= 0) return; ctx.save(); rr(x, y + 46, w, h - 46, 0); ctx.clip();
  const lh = size * 1.55, max = Math.floor((h - 70) / lh), shown = lines.slice(0, Math.max(0, Math.floor(n))), off = Math.max(0, shown.length - max);
  shown.slice(off).forEach((s, i) => { const c = /^#/.test(s) ? BLUE : /^\|/.test(s) ? GREEN : /^(\*|-|\d+\.) /.test(s) ? GOLD : /^<!--/.test(s) ? SUB : INK;
    text(cut(s || ' ', size, w - 50, 500), x + 24, y + 70 + i * lh, size, c, 500, 'left', a, MONO); });
  ctx.restore();
}
const kb = v => v < 10 ? v.toFixed(2) + 'KB' : v.toFixed(1) + 'KB';
