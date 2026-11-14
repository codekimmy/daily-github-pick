// 장면 그리기. 장(c)의 자막 시작 시각(c.cues[i][0])에 맞춰 화면 요소가 하나씩 나타난다 → 다 나타난 뒤 자막 길이(최소 3초)만큼 멈춤
// 그림 자료: data.js (RES = results.json 측정값, OCR = 투명 글자층에서 꺼낸 실제 글자 상자·찾기 위치), img/*.png (시연 PDF 쪽 그림)
const cs = (c, i) => c.cues[Math.min(i, c.cues.length - 1)][0];
const ap = (lt, t, d = .7) => out3(prog(lt, t, t + d));
const f1 = x => x.toFixed(1), A4 = 842.04 / 595.44;
const PG = ['관리비 고지서', '가정통신문', '영수증'];

// 쪽 그림 (그림자 + 테두리). 돌림(rot, 도) 지원
function page(key, x, y, h, a = 1, rot = 0) {
  if (a <= 0) return; const w = h / A4; ctx.save(); ctx.globalAlpha *= a;
  ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot * Math.PI / 180);
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; ctx.drawImage(IMG[key], -w / 2, -h / 2, w, h); ctx.shadowBlur = 0;
  ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.restore(); return w;
}
// 투명 글자 필름: 위에서 아래로 덮이는 반투명 막 + 글자가 붙은 자리(파란 상자)
function film(pi, x, y, h, k, a = 1, src = 'kor4') {
  if (k <= 0 || a <= 0) return; const w = h / A4, fy = y + h * k; ctx.save(); ctx.globalAlpha *= a;
  ctx.beginPath(); ctx.rect(x, y, w, fy - y); ctx.clip();
  ctx.fillStyle = 'rgba(88,166,255,.10)'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(88,166,255,.9)'; ctx.fillStyle = 'rgba(88,166,255,.18)'; ctx.lineWidth = 1.5;
  OCR[src][pi].words.forEach(b => { ctx.fillRect(x + b[0] * w, y + b[1] * h, (b[2] - b[0]) * w, (b[3] - b[1]) * h); ctx.strokeRect(x + b[0] * w, y + b[1] * h, (b[2] - b[0]) * w, (b[3] - b[1]) * h); });
  ctx.restore();
  if (k < 1) box(x - 8, fy - 3, w + 16, 6, 3, BLUE, null, a);
}
// Ctrl+F로 찾은 자리 (노란 형광펜)
function hits(pi, x, y, h, k, a = 1, src = 'kor4') {
  if (k <= 0 || a <= 0) return; const w = h / A4; ctx.save(); ctx.globalAlpha *= a * k;
  OCR[src][pi].hits.forEach(b => { ctx.fillStyle = 'rgba(242,193,78,.55)'; ctx.fillRect(x + b[1] * w - 3, y + b[2] * h - 3, (b[3] - b[1]) * w + 6, (b[4] - b[2]) * h + 6);
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.strokeRect(x + b[1] * w - 3, y + b[2] * h - 3, (b[3] - b[1]) * w + 6, (b[4] - b[2]) * h + 6); });
  ctx.restore();
}
// 찾기 막대 (Ctrl+F 창)
function findBar(x, y, w, word, result, ok, a = 1, size = 30) {
  if (a <= 0) return; const h = size * 2; box(x, y, w, h, 12, '#21262d', ok ? GREEN : RED, a, 3);
  text('Ctrl+F', x + 20, y + h / 2, size * .8, SUB, 800, 'left', a, MONO);
  box(x + size * 4.2, y + 10, w - size * 4.2 - size * 5.6, h - 20, 8, '#0d1117', LINE, a, 1);
  text(word, x + size * 4.6, y + h / 2, size, INK, 700, 'left', a);
  text(result, x + w - 20, y + h / 2, size * .9, ok ? GREEN : RED, 900, 'right', a);
}
// 정확도 막대 (가로)
function accBar(x, y, w, h, v, color, k, a = 1, size = 28) {
  box(x, y, w, h, 8, '#21262d', null, a); box(x, y, Math.max(4, w * v / 100 * k), h, 8, color, null, a);
  text(f1(v * k) + '%', x + Math.max(4, w * v / 100 * k) + 12, y + h / 2, size, INK, 800, 'left', a * (k > .05 ? 1 : 0));
}
function counter(v, t0, lt, dur = 1.6) { return v * ease(prog(lt, t0, t0 + dur)); }
const nfound = r => Object.values(r.found).filter(Boolean).length;

// ───── 공용 장면 (가로·세로)
function sceneFilm(c, lt, R, t1, t2, opt = {}) { // 3쪽(세로는 1쪽) → 필름이 덮이고 → 찾은 자리 표시
  const v = R.h > R.w, n = v ? 1 : 3, h = opt.h || (v ? 900 : 560), w = h / A4, gap = v ? 0 : 60, tot = n * w + (n - 1) * gap, x0 = R.x + (R.w - tot) / 2, y = R.y + (opt.dy ?? 90);
  for (let i = 0; i < n; i++) { const x = x0 + i * (w + gap), a = ap(lt, i * .8);
    page('p' + (i + 1), x, y, h, a); film(i, x, y, h, ease(prog(lt, t1 + i * .5, t1 + i * .5 + 2)), a); hits(i, x, y, h, ap(lt, t2 + i * .4), a);
    if (!v) text(PG[i], x + w / 2, y + h + 34, 28, SUB, 700, 'center', a); }
  const cx = R.x + R.w / 2, fb = Math.min(R.w, v ? R.w : 900), yy = R.y + (opt.by ?? 0);
  const ok = lt >= t2; findBar(cx - fb / 2, yy, fb, '관리비', ok ? '1/3 · 찾음' : '0건', ok, 1, v ? 34 : 28);
  const k2 = ap(lt, t2 + 1.2); text('낱말 9개 중 ' + nfound(RES.kor4) + '개 찾음', cx, y + h + (v ? 70 : 90), v ? 54 : 44, GOLD, 900, 'center', k2);
}
function sceneLang(c, lt, R, t1, t2) { // 영어만 vs 한국어 지정, 1쪽 첫 줄들
  const v = R.h > R.w, bw = v ? R.w : (R.w - 60) / 2, bh = v ? 480 : 560, sz = v ? 34 : 30;
  [[OCR.engLines, '언어 지정 없음 (영어만)', RED, t1], [OCR.korLines.slice(0, 2).concat(OCR.korPay), '-l kor+eng', GREEN, t2]].forEach(([L, lab, col, t], j) => {
    const k = ap(lt, t), x = v ? R.x : R.x + j * (bw + 60), y = v ? R.y + j * (bh + 60) : R.y; box(x, y, bw, bh, 20, '#010409', col, k, 3);
    text(lab, x + 30, y + 44, sz, col, 900, 'left', k);
    L.slice(0, 5).forEach((l, i) => text(l.trim(), x + 30, y + 120 + i * sz * 2.3, fit(l.trim(), sz, bw - 60, 600), INK, 600, 'left', ap(lt, t + .4 + i * .25), j ? F : MONO)); });
}
function sceneRotate(c, lt, R, t1, h) { // 거꾸로 → 바로 세움
  const v = R.h > R.w, w = h / A4, cx = R.x + R.w / 2, y = R.y + 60, k = ease(prog(lt, t1, t1 + 1.6));
  page('up2', cx - w / 2, y, h, 1, 180 * k);
  const x2 = cx + w / 2 + (v ? 0 : 60), sz = v ? 60 : 56;
  const val = k < 1 ? 0 : counter(RES.rotate.acc['가정통신문'], t1 + 1.6, lt, 1.2);
  if (v) { text('둘째 쪽 정확도', cx, y + h + 70, 40, SUB, 800, 'center'); text(f1(val) + '%', cx, y + h + 150, 90, val > 50 ? GREEN : RED, 900, 'center'); pill('--rotate-pages', cx, y - 40, 34, BLUE, ap(lt, t1 - .4)); }
  else { text('둘째 쪽 정확도', x2, y + 120, 40, SUB, 800, 'left'); text(f1(val) + '%', x2, y + 230, 110, val > 50 ? GREEN : RED, 900, 'left'); pill('--rotate-pages', x2 + 170, y + 380, 34, BLUE, ap(lt, t1 - .4)); }
}
function endCard(c, lt, R, big = 64) {
  const cx = R.x + R.w / 2, k = ap(lt, 0), v = R.h > R.w;
  text('OCRmyPDF · 스캔 PDF 글자 찾기', cx, R.y + R.h * (v ? .3 : .28), big * .8, BLUE, 900, 'center', k);
  const L = wrap('다음에 또 멋진 오픈소스 소개하겠습니다!', R.w - 80, big, 900);
  L.forEach((l, i) => text(l, cx, R.y + R.h * (v ? .42 : .45) + i * big * 1.3, big, INK, 900, 'center', k));
  const k2 = ap(lt, .8), yy = R.y + R.h * (v ? .78 : .8);
  DISCLAIMER.forEach((d, i) => { const fs = fit(d, 24, R.w - 40, 500); text(d, cx, yy + i * 38, fs, SUB, 500, 'center', k2); });
}

// ───── 롱폼 (1920×1080)
const LR = { x: 120, y: 110, w: 1680, h: 800 };
function code(lines, x, y, w, a, size = 34) { box(x, y, w, lines.length * size * 1.6 + 40, 16, '#010409', LINE, a); lines.forEach((l, i) => text(l, x + 30, y + 40 + i * size * 1.6, fit(l, size, w - 60, 600), l.startsWith('::') ? SUB : (l.includes('Error') ? RED : GREEN), 600, 'left', a, MONO)); }
function card(x, y, w, h, lab, val, col, k, vs = 60) { box(x, y, w, h, 20, CARD, col, k, 3); text(lab, x + w / 2, y + h * .3, fit(lab, 30, w - 40), SUB, 700, 'center', k); text(val, x + w / 2, y + h * .66, fit(val, vs, w - 40, 900), col, 900, 'center', k); }
const DRAW_LONG = {
  preview(c, lt) { sceneFilm(c, lt, LR, cs(c, 1), cs(c, 2) - .5, { dy: 100, h: 580 }); },
  title(c, lt) {
    const k = ap(lt, 0); pill('오늘의 오픈소스', 960, 220, 34, BLUE, k); text('OCRmyPDF', 960, 360, 140, INK, 900, 'center', k);
    text('github.com/ocrmypdf/OCRmyPDF · MPL-2.0 · ⭐ 35,316', 960, 470, 32, SUB, 600, 'center', k);
    const k1 = ap(lt, cs(c, 1)); text('일반인 쓸모 ★★★½☆ (3.5)', 960, 600, 64, GOLD, 900, 'center', k1);
    const k2 = ap(lt, cs(c, 2)); text('스캔 PDF를 글자 찾기가 되는 PDF로 바꾸는 무료 프로그램', 960, 720, 44, INK, 800, 'center', k2);
  },
  what(c, lt) {
    const h = 760, w = h / A4, x = 200, y = 120; page('p1', x, y, h, ap(lt, 0));
    const k0 = ap(lt, 0); text("글자 = 그림", x + w + 80, 170, 52, RED, 900, 'left', k0);
    const k1 = ap(lt, cs(c, 1)); findBar(x + w + 80, 230, 900, '관리비', '0건', false, k1, 30); text('글자 복사 ✕', x + w + 80, 350, 36, RED, 800, 'left', k1);
    film(0, x, y, h, ease(prog(lt, cs(c, 2), cs(c, 2) + 2.5)), 1); const k2 = ap(lt, cs(c, 2));
    text("비유: 그림 위에 '투명 글자 필름' 한 겹", x + w + 80, 450, 44, BLUE, 900, 'left', k2);
    const k3 = ap(lt, cs(c, 3)); box(x + w + 80, 500, 1000, 250, 16, '#010409', LINE, k3); text('Tesseract가 읽은 글자 (1쪽 앞부분)', x + w + 110, 535, 26, SUB, 700, 'left', k3);
    OCR.korLines.slice(0, 2).forEach((l, i) => text(l, x + w + 110, 595 + i * 56, 34, GREEN, 700, 'left', ap(lt, cs(c, 3) + .5 + i * .8)));
    text('… 표 안 항목은 일부 틀림 (예: "48,3007")', x + w + 110, 712, 26, GOLD, 700, 'left', ap(lt, cs(c, 3) + 2.2));
    const k4 = ap(lt, cs(c, 4)); pill('겉모습은 그대로 · 찾기·복사 가능', x + w + 580, 800, 30, GREEN, k4);
    const k5 = ap(lt, cs(c, 5)); text('James R. Barlow · 2013년 공개 · MPL-2.0 · ⭐ 35,316 · 최신 17.14.1', 960, 920 - 20, 28, SUB, 700, 'center', k5);
  },
  install(c, lt) {
    const L = [':: ① 글자 인식 프로그램 Tesseract', 'winget install -e --id tesseract-ocr.tesseract', ':: ② 한국어 언어 파일 → C:\\Program Files\\Tesseract-OCR\\tessdata', 'curl -L -o kor.traineddata https://github.com/tesseract-ocr/tessdata_fast/raw/main/kor.traineddata',
      ':: ③ 설치 도구 uv → OCRmyPDF', 'winget install -e --id astral-sh.uv', 'uv tool install ocrmypdf'];
    const vis = [0, 1, 2, 2, 3, 3, 3], ks = vis.map(i => ap(lt, cs(c, i)));
    box(140, 120, 1640, L.length * 50 + 40, 16, '#010409', LINE, ap(lt, 0));
    L.forEach((l, i) => text(l, 170, 160 + i * 50, fit(l, 28, 1580, 600), l.startsWith('::') ? SUB : GREEN, 600, 'left', ks[i], MONO));
    const k4 = ap(lt, cs(c, 4)); [['설치 시간 (pip, 리눅스)', '7.0초', GREEN], ['함께 설치되는 프로그램 포함', '약 125MB', GOLD], ['한국어 언어 파일', '1.6MB', BLUE]].forEach((r, i) => card(140 + i * 560, 540, 520, 170, r[0], r[1], r[2], ap(lt, cs(c, 4) + i * .9)));
    const k5 = ap(lt, cs(c, 5)); box(140, 750, 1640, 100, 18, 'rgba(242,193,78,.10)', GOLD, k5, 2);
    text('Windows 설치는 공식 문서 기준 안내 · Windows 실행 확인 전 (시연은 리눅스)', 960, 800, 34, GOLD, 800, 'center', k5);
  },
  usage(c, lt) {
    const k0 = ap(lt, 0); code(['C:\\스캔> ocrmypdf -l kor+eng --tesseract-pagesegmode 4 스캔본.pdf 검색가능.pdf'], 140, 130, 1640, k0, 30);
    [[1, '-l kor+eng', '한국어 + 영어로 읽기 (빼면 영어로만 읽음)'], [2, '--tesseract-pagesegmode 4', '글을 줄 단위로 읽기 (한국어 문서 줄 빠짐 방지)']].forEach(([i, o, d], j) => {
      const k = ap(lt, cs(c, i)), y = 280 + j * 130; box(140, y, 1640, 110, 16, CARD, BLUE, k, 2); text(o, 180, y + 55, 34, BLUE, 900, 'left', k, MONO); text(d, 820, y + 55, 32, INK, 700, 'left', k); });
    const k3 = ap(lt, cs(c, 3)); ['스캔본.pdf  (원본 그대로)', '검색가능.pdf  (새 파일)'].forEach((s, i) => { box(140 + i * 840, 560, 800, 90, 14, CARD, i ? GREEN : LINE, k3, 3); text(s, 180 + i * 840, 605, 32, i ? GREEN : INK, 800, 'left', k3); });
    const k4 = ap(lt, cs(c, 4)); box(140, 700, 1640, 130, 16, 'rgba(126,231,135,.10)', GREEN, k4, 2);
    text('검색PDF만들기.bat 위에 PDF를 끌어다 놓기 → 같은 폴더에 "_검색가능.pdf"', 960, 748, 36, GREEN, 800, 'center', k4); text('(Windows 실행 확인 전 · 한국어·줄 단위·바로 세우기·기울기·건너뛰기 옵션 포함)', 960, 800, 26, SUB, 600, 'center', k4);
  },
  demo1(c, lt) {
    const h = 600, w = h / A4, gap = 70, x0 = 960 - (3 * w + 2 * gap) / 2, y = 200;
    for (let i = 0; i < 3; i++) { const x = x0 + i * (w + gap); page('p' + (i + 1), x, y, h, ap(lt, i * .8)); text(PG[i] + ' (가상)', x + w / 2, y + h + 32, 28, SUB, 700, 'center', ap(lt, i * .8));
      film(i, x, y, h, ease(prog(lt, cs(c, 2) + i * .5, cs(c, 2) + i * .5 + 2)), 1); hits(i, x, y, h, ap(lt, cs(c, 4) + i * .4)); }
    const k1 = ap(lt, cs(c, 1)), k2 = ap(lt, cs(c, 2));
    if (lt < cs(c, 2)) pill('처리 전: 글자 0자 · 낱말 9개 중 0개', 960, 140, 32, RED, k1);
    else pill('OCRmyPDF · 3쪽 ' + counter(RES.kor4.sec, cs(c, 2), lt).toFixed(2) + '초', 960, 140, 32, GREEN, k2);
    const k5 = ap(lt, cs(c, 5)); text('파일 크기 ' + RES.kor4.in_kb + 'KB → ' + RES.kor4.out_kb + 'KB', 1540, 900, 30, SUB, 700, 'center', k5);
    const k4 = ap(lt, cs(c, 4) + 1); text('낱말 9개 중 ' + nfound(RES.kor4) + '개 찾음', 380, 900, 36, GOLD, 900, 'center', k4);
  },
  demo2(c, lt) {
    const fade = 1 - ap(lt, cs(c, 3) - .2, .6);
    if (fade > 0) { ctx.save(); ctx.globalAlpha = fade; sceneLang(c, lt, { x: 140, y: 130, w: 1640, h: 600 }, cs(c, 0), cs(c, 2)); ctx.restore();
      text('찾은 낱말 3/9 (숫자만)', 140 + 395, 760, 34, RED, 900, 'center', ap(lt, cs(c, 1)) * fade); }
    const k3 = ap(lt, cs(c, 3)); if (k3 <= 0) return;
    text('정확도 (띄어쓰기를 뺀 글자 비교)', 960, 140, 36, INK, 900, 'center', k3);
    const rows = [['영어만', RES.eng, RED, cs(c, 3)], ['한국어 기본', RES.kor, GOLD, cs(c, 3) + .8], ['한국어 + 줄 단위', RES.kor4, GREEN, cs(c, 4)]];
    PG.forEach((p, j) => { text(p, 300, 240 + j * 220, 34, INK, 900, 'right', k3);
      rows.forEach(([lab, r, col, t], i) => { const k = ap(lt, t); text(lab, 340, 205 + j * 220 + i * 46, 22, col, 700, 'left', k); accBar(560, 190 + j * 220 + i * 46, 1000, 30, r.acc[p], col, ease(prog(lt, t, t + 1.5)), k, 24); }); });
  },
  demo3(c, lt) {
    const fade = 1 - ap(lt, cs(c, 2) - .2, .6);
    if (fade > 0) { ctx.save(); ctx.globalAlpha = fade; sceneRotate(c, lt, { x: 300, y: 80, w: 1100, h: 760 }, cs(c, 1), 740); ctx.restore(); }
    const k2 = ap(lt, cs(c, 2)); if (k2 <= 0) return; const h = 640, w = h / A4;
    const kd = ap(lt, cs(c, 2) + 1.2, 1.2); page('skew', 160, 170, h, k2 * (1 - kd)); page('deskew', 160, 170, h, k2 * kd);
    pill(kd < .5 ? '4도 기울어진 고지서' : '--deskew → 3.4도 바로잡음', 160 + w / 2, 130, 28, kd < .5 ? GOLD : GREEN, k2);
    const k3 = ap(lt, cs(c, 3)); text('정확도', 900, 240, 36, SUB, 800, 'left', k3);
    accBar(900, 290, 760, 50, RES.skew.acc['관리비 고지서'], GOLD, ease(prog(lt, cs(c, 3), cs(c, 3) + 1.5)), k3, 30); text('그대로', 900, 370, 26, GOLD, 700, 'left', k3);
    accBar(900, 410, 760, 50, RES.deskew.acc['관리비 고지서'], GREEN, ease(prog(lt, cs(c, 3) + .8, cs(c, 3) + 2.3)), ap(lt, cs(c, 3) + .8), 30); text('--deskew', 900, 490, 26, GREEN, 700, 'left', ap(lt, cs(c, 3) + .8), MONO);
    const k4 = ap(lt, cs(c, 4)); box(900, 570, 880, 200, 20, 'rgba(255,123,114,.10)', RED, k4, 2);
    text('6도 기울어진 고지서', 940, 620, 34, RED, 900, 'left', k4); text('기울기를 0.000도로 판단 → 그대로', 940, 675, 32, INK, 700, 'left', k4); text('정확도 ' + f1(RES.deskew6.acc['관리비 고지서']) + '%', 940, 728, 32, INK, 700, 'left', k4);
  },
  demo4(c, lt) {
    const k0 = ap(lt, 0); card(160, 160, 760, 330, '70dpi 거친 스캔 3쪽 (' + RES.lowres.in_kb + 'KB)', nfound(RES.lowres) + ' / 9 찾음', GOLD, k0, 100);
    text("'납부기한'은 찾지 못함", 540, 550, 34, RED, 800, 'center', ap(lt, cs(c, 1)));
    const k2 = ap(lt, cs(c, 2)); box(1000, 160, 760, 330, 20, CARD, GREEN, k2, 3); text('30쪽 문서', 1380, 230, 34, SUB, 700, 'center', k2);
    text(counter(RES.p30.sec, cs(c, 2) + .3, lt).toFixed(2) + '초', 1380, 340, 110, GREEN, 900, 'center', k2); text('5.2MB → 3.9MB', 1380, 440, 30, INK, 700, 'center', k2);
    const k3 = ap(lt, cs(c, 3)); pill('CPU 2개 클라우드 · 그래픽카드 없음 · 측정 코드 demo/test_all.py', 960, 700, 30, SUB, k3);
  },
  demo5(c, lt) {
    const k0 = ap(lt, 0); code(['C:\\스캔> ocrmypdf -l kor+eng 검색가능.pdf 또.pdf', 'PriorOcrFoundError: page 1 already has text! - aborting'], 140, 140, 1640, k0, 30);
    const k1 = ap(lt, cs(c, 1)); text('→ 1쪽에 이미 글자가 있어 멈춤 (종료 코드 6)', 160, 330, 34, RED, 800, 'left', k1);
    const k2 = ap(lt, cs(c, 2)); code(['C:\\스캔> ocrmypdf -l kor+eng --skip-text 검색가능.pdf 또.pdf', '완료 · ' + RES.again_skip.sec + '초'], 140, 400, 1640, k2, 30);
    const k3 = ap(lt, cs(c, 3)); box(140, 650, 1640, 150, 18, 'rgba(126,231,135,.10)', GREEN, k3, 2);
    text('검색PDF만들기.bat = kor+eng · 줄 단위 · --rotate-pages · --deskew · --skip-text', 960, 705, 32, GREEN, 800, 'center', k3);
    text('같은 설정으로 거꾸로 스캔 3쪽: ' + RES.bat_combo.sec + '초 · 낱말 4개 모두 찾음', 960, 760, 28, INK, 700, 'center', k3);
  },
  cons(c, lt) {
    const k0 = ap(lt, 0); text('아쉬운 점', 960, 150, 56, INK, 900, 'center', k0);
    const items = [['표 안 글자', '고지서 정확도 79.4% · 항목 이름 일부 틀림', RED], ['기본 설정', '한국어 문서 줄이 빠질 수 있음 → 줄 단위 옵션', GOLD],
      ['설치', 'Windows 3단계(Tesseract·한국어 파일·OCRmyPDF) · 화면 없음', BLUE], ['시연 범위', '6도 기울기는 그대로 · 손글씨는 시연하지 않음', SUB]];
    items.forEach((it, i) => { const k = ap(lt, cs(c, i + 1)), y = 240 + i * 160; box(200, y, 1520, 130, 20, CARD, it[2], k, 3);
      text((i + 1) + '. ' + it[0], 250, y + 65, 42, it[2], 900, 'left', k); text(it[1], 640, y + 65, fit(it[1], 34, 1040), INK, 700, 'left', k); });
  },
  summary(c, lt) {
    const k0 = ap(lt, 0); text('OCRmyPDF 정리', 960, 160, 56, INK, 900, 'center', k0);
    const items = [['투명 글자 필름', '스캔 PDF에서 찾기·복사 가능', BLUE], ['옵션 두 개', '-l kor+eng · --tesseract-pagesegmode 4', GREEN], ['처리 시간', '3쪽 2.05초 · 30쪽 9.09초', GOLD], ['원본 보관', '금액·날짜는 직접 확인', PURPLE]];
    items.forEach((it, i) => { const t = cs(c, i + 1), k = ap(lt, t), y = 260 + i * 150; box(200, y, 1520, 120, 20, CARD, it[2], k, 3);
      check(290, y + 60, 70, prog(lt, t + .2, t + 1), it[2], k); text(it[0], 360, y + 60, 42, it[2], 900, 'left', k); text(it[1], 820, y + 60, fit(it[1], 40, 860, 800), INK, 800, 'left', k); });
  },
  end(c, lt) { endCard(c, lt, { x: 0, y: 60, w: 1920, h: 900 }, 72); },
};

// ───── 과정 애니메이션 (숏폼 대본, 가로·세로 공용)
function DRAW_ANIM(c, lt, W, H) {
  const v = H > W, R = v ? { x: 60, y: 230, w: W - 120, h: 1280 } : { x: 120, y: 90, w: W - 240, h: 820 }, cx = R.x + R.w / 2;
  if (c.id === 's_hook') { const h = v ? 1000 : 680, w = h / A4, y = R.y + (v ? 140 : 110); page('p1', cx - w / 2, y, h, ap(lt, 0));
    findBar(cx - Math.min(R.w, 900) / 2, R.y, Math.min(R.w, 900), '관리비', '0건', false, ap(lt, .8), v ? 34 : 28);
    const k = ap(lt, cs(c, 0) + 2.5); pill('글자 = 그림', cx, y + h / 2, v ? 60 : 50, RED, k); }
  if (c.id === 's_film') sceneFilm(c, lt, R, .8, cs(c, 1), { dy: v ? 140 : 100, h: v ? 1000 : 600 });
  if (c.id === 's_lang') { sceneLang(c, lt, { x: R.x, y: R.y + (v ? 40 : 40), w: R.w, h: R.h }, 0, cs(c, 1));
    pill('-l kor+eng 꼭 넣기', cx, v ? R.y + 1180 : R.y + 680, v ? 46 : 40, GREEN, ap(lt, cs(c, 1) + 1.5)); }
  if (c.id === 's_rotate') sceneRotate(c, lt, R, 1.5, v ? 900 : 700);
  if (c.id === 's_end') { const a = ap(lt, 0); text('정확도 (한국어 + 줄 단위)', cx, R.y + 30, v ? 46 : 38, SUB, 800, 'center', a);
    PG.forEach((p, i) => { const k = ap(lt, i * .9), y = R.y + (v ? 130 : 100) + i * (v ? 170 : 120); text(p, R.x + (v ? 0 : 160), y + 25, v ? 40 : 34, i === 0 ? RED : INK, 900, 'left', k);
      accBar(R.x + (v ? 300 : 520), y, R.w - (v ? 450 : 860), 50, RES.kor4.acc[p], i === 0 ? RED : GREEN, ease(prog(lt, i * .9, i * .9 + 1.5)), k, v ? 34 : 30); });
    const k2 = ap(lt, cs(c, 0) + 3.2), yb = R.y + (v ? 760 : 520); text('일반인 쓸모 ★★★½☆ (3.5)', cx, yb, v ? 64 : 56, GOLD, 900, 'center', k2);
    text('ocrmypdf -l kor+eng', cx, yb + (v ? 120 : 90), fit('ocrmypdf -l kor+eng', 44, R.w), BLUE, 600, 'center', k2, MONO); }
}
