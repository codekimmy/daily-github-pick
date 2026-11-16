// 장면 그리기. 장(c)의 자막 시작 시각(c.cues[i][0])에 맞춰 화면 요소가 하나씩 나타난다 → 다 나타난 뒤 자막 길이(최소 3초)만큼 멈춤
// 그림 자료: data.js (RES = results.json 측정값), img/* (시연 입력 그림 + VTracer가 만든 SVG 그대로)
// 연출(tools/kit/README.md): 와이프(전·후), 돋보기 확대 비교(새로 만듦: zoomPair), 도장 배지, 픽셀 조각 전환(도트 장면)
const cs = (c, i) => c.cues[Math.min(i, c.cues.length - 1)][0];
const ap = (lt, t, d = .7) => out3(prog(lt, t, t + d));
const f1 = x => x.toFixed(1), f2 = x => x.toFixed(2);
const kb = x => x.toLocaleString('ko-KR', { maximumFractionDigits: 1 }) + 'KB';

// 그림 한 장 (흰 바탕 카드 위). smooth=false 면 칸 모양 그대로 확대
function pic(key, x, y, w, h, a = 1, smooth = true, bg = '#ffffff') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 20;
  ctx.fillStyle = bg; ctx.fillRect(x, y, w, h); ctx.shadowBlur = 0; ctx.imageSmoothingEnabled = smooth; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(IMG[key], x, y, w, h); ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h); ctx.restore();
}
// 돋보기 확대: 그림의 (cx, cy) 지점(0~1)을 z배로 키워 상자에 보여 줌. 그림 전체를 z배 크기로 그리고 상자로 잘라 냄 (SVG는 벡터로 다시 그려짐)
function zoomBox(key, x, y, w, h, cx, cy, z, base, a = 1, smooth = true) {
  if (a <= 0) return; const S = base * z; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, h);
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.imageSmoothingEnabled = smooth; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(IMG[key], x + w / 2 - cx * S, y + h / 2 - cy * S, S, S * IMG[key].height / IMG[key].width); ctx.restore();
  box(x, y, w, h, 0, null, LINE, a, 2);
}
function zoomPair(A, B, R, cx, cy, z, base, a, labA, labB, colA = RED, colB = GREEN) {
  const gap = 40, w = (R.w - gap) / 2;
  zoomBox(A, R.x, R.y, w, R.h, cx, cy, z, base, a); zoomBox(B, R.x + w + gap, R.y, w, R.h, cx, cy, z, base, a);
  pill(labA, R.x + w / 2, R.y - 34, 26, colA, a); pill(labB, R.x + w + gap + w / 2, R.y - 34, 26, colB, a);
  pill('×' + z.toFixed(z < 10 ? 1 : 0), R.x + R.w / 2, R.y + R.h - 40, 30, GOLD, a);
}
// 와이프: 전(A) 위로 후(B)가 왼쪽부터 덮이며 세로 막대가 지나감 (2026-11-14 noisereduce 연출을 고쳐 씀)
function wipe(A, B, x, y, w, h, k, a = 1, lab = 'VTracer', smoothA = true, smoothB = true) {
  pic(A, x, y, w, h, a, smoothA); if (k <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.rect(x, y, w * k, h); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, h);
  ctx.imageSmoothingEnabled = smoothB; ctx.drawImage(IMG[B], x, y, w, h); ctx.restore();
  if (k < 1) { const sx = x + w * k; box(sx - 3, y - 10, 6, h + 20, 3, GREEN, null, a); pill(lab, sx, y - 34, 24, GREEN, a); }
}
// 도장 배지 (tools/kit/kit.js stamp를 Noto 글꼴로 고쳐 씀): 크게 → 제자리 '쾅'
function stamp(s, x, y, k, color = GOLD, size = 48, rot = -7) {
  if (k <= 0) return; const sc = k < .6 ? 1.8 - (k / .6) * .8 : 1; ctx.save(); ctx.globalAlpha *= Math.min(1, k * 2.5);
  ctx.translate(x, y); ctx.rotate(rot * Math.PI / 180); ctx.scale(sc, sc); ctx.font = `900 ${size}px ${F}`;
  const w = ctx.measureText(s).width + size * .9, h = size * 1.6; ctx.fillStyle = 'rgba(1,4,9,.88)'; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = color; ctx.lineWidth = size * .09; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(s, 0, size * .04); ctx.restore();
}
// 픽셀 조각 전환 (tools/kit/kit.js dissolve를 상자 안으로 좁혀 씀)
function dissolveBox(x, y, w, h, k, drawA, drawB, cell = 40) {
  drawA(); if (k <= 0) return; const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell); let r = 7;
  ctx.save(); ctx.beginPath();
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { r = (r * 16807) % 2147483647; if ((r % 1000) / 1000 < k) ctx.rect(x + i * cell, y + j * cell, cell, cell); }
  ctx.clip(); drawB(); ctx.restore();
}
function counter(v, t0, lt, dur = 1.6) { return v * ease(prog(lt, t0, t0 + dur)); }
function code(lines, x, y, w, a, size = 32) { box(x, y, w, lines.length * size * 1.6 + 40, 16, '#010409', LINE, a); lines.forEach((l, i) => text(l, x + 30, y + 40 + i * size * 1.6, fit(l, size, w - 60, 600), l.startsWith('::') ? SUB : GREEN, 600, 'left', a, MONO)); }
function card(x, y, w, h, lab, val, col, k, vs = 60) { box(x, y, w, h, 20, CARD, col, k, 3); text(lab, x + w / 2, y + h * .3, fit(lab, 30, w - 40), SUB, 700, 'center', k); text(val, x + w / 2, y + h * .66, fit(val, vs, w - 40, 900), col, 900, 'center', k); }
function bar(x, y, w, h, v, max, col, k, lab, a = 1, size = 28) {
  box(x, y, w, h, 8, '#21262d', null, a); box(x, y, Math.max(4, w * v / max * k), h, 8, col, null, a);
  text(lab, x + Math.max(4, w * v / max * k) + 14, y + h / 2, size, INK, 800, 'left', a * (k > .05 ? 1 : 0));
}
const L = RES.logo, SG = RES.sign, CT = RES.cat, DT = RES.dot;

// ───── 공용 장면 (가로·세로)
function sceneLogo(c, lt, R, tConv, tZoom, opt = {}) { // 작은 로고 → 와이프로 SVG → 돋보기 ×1 → ×20
  const v = R.h > R.w, s = v ? 700 : 520, x = R.x + (R.w - s) / 2, y = R.y + (opt.dy ?? 60);
  const kz = ease(prog(lt, tZoom, tZoom + 3)), za = ap(lt, tZoom - .3);
  if (za < 1) { ctx.save(); ctx.globalAlpha = 1 - za; wipe('logo', 'logo_svg', x, y, s, s, ease(prog(lt, tConv, tConv + 1.6)), 1, 'VTracer · ' + f2(L.max6_simplify.sec) + '초');
    pill(lt < tConv + 1.6 ? '로고_작은.jpg · 240px · ' + kb(L.in_kb) : '로고.svg · 색 6가지 · 조각 ' + L.max6_simplify.paths + '개', R.x + R.w / 2, y + s + 50, v ? 34 : 28, lt < tConv + 1.6 ? SUB : GREEN, ap(lt, 0)); ctx.restore(); }
  if (za > 0) { const z = 1 + 19 * kz, h = v ? 1000 : 600, RR = v ? { x: R.x, y: R.y + 60, w: R.w, h } : { x: R.x, y: R.y + 50, w: R.w, h };
    if (v) { const hh = (h - 70) / 2; zoomBox('logo', RR.x, RR.y, RR.w, hh, .38, .74, z, 300, za); zoomBox('logo_svg', RR.x, RR.y + hh + 70, RR.w, hh, .38, .74, z, 300, za);
      pill('일반 확대 (JPG)', RR.x + RR.w / 2, RR.y + 34, 30, RED, za); pill('VTracer SVG', RR.x + RR.w / 2, RR.y + hh + 104, 30, GREEN, za); pill('×' + z.toFixed(z < 10 ? 1 : 0), RR.x + RR.w / 2, RR.y + hh + 35, 34, GOLD, za); }
    else zoomPair('logo', 'logo_svg', RR, .38, .74, z, 360, za, '일반 확대 (JPG)', 'VTracer SVG'); }
}
function sceneSign(c, lt, R, tBw, tAd) {
  const v = R.h > R.w, w = v ? 640 : Math.min(640, (R.w - 60) / 2), h = w / 2, x0 = v ? R.x + (R.w - 640) / 2 : R.x, y0 = R.y;
  pic('sign', x0, y0, w, h, ap(lt, 0)); pill('휴대폰으로 찍은 서명 (가상)', x0 + w / 2, y0 - 30, 26, SUB, ap(lt, 0));
  const pos = v ? [[x0, y0 + h + 80], [x0, y0 + 2 * h + 160]] : [[x0 + w + 60, y0], [x0 + w + 60, y0 + h + 90]];
  [['sign_bw', '--preset bw · 조각 ' + SG.bw.paths + '개', RED, tBw], ['sign_ad', '--adaptive · 조각 ' + SG.adaptive.paths + '개', GREEN, tAd]].forEach(([k, lab, col, t], i) => {
    const a = ap(lt, t); pic(k, pos[i][0], pos[i][1], w, h, a, true, '#ffffff'); box(pos[i][0], pos[i][1], w, h, 0, null, col, a, 4); pill(lab, pos[i][0] + w / 2, pos[i][1] - 30, 26, col, a); });
}
function sceneDot(c, lt, R, tSp, tPx, s) {
  const v = R.h > R.w, cx = R.x + R.w / 2, x = v ? cx - s / 2 : R.x + 80, y = R.y + 40;
  const kd = prog(lt, tPx, tPx + 1.4);
  dissolveBox(x, y, s, s, kd, () => pic(lt < tSp ? 'dot' : 'dot_spline', x, y, s, s, ap(lt, 0), false), () => pic('dot_pixel', x, y, s, s, 1, true));
  const lab = lt < tSp ? ['도트.png · 24×24칸', SUB] : (kd < .5 ? ['기본(곡선) 모드 · 칸이 녹음', RED] : ['-m pixel · 칸 모양 그대로', GREEN]);
  pill(lab[0], x + s / 2, y - 34, v ? 32 : 28, lab[1], ap(lt, 0));
}

// ───── 롱폼 (1920×1080)
const LR = { x: 160, y: 130, w: 1600, h: 760 };
const DRAW_LONG = {
  preview(c, lt) { sceneLogo(c, lt, LR, cs(c, 1), cs(c, 2) - .6, { dy: 70 });
    stamp('20배 확대에도 또렷', 1500, 820, ap(lt, cs(c, 2) + 2.6, .5), GREEN, 44); },
  title(c, lt) {
    const k = ap(lt, 0); pill('오늘의 오픈소스', 960, 220, 34, BLUE, k); text('VTracer', 960, 360, 140, INK, 900, 'center', k);
    text('github.com/visioncortex/vtracer · MIT · ⭐ 7,536', 960, 470, 32, SUB, 600, 'center', k);
    const k1 = ap(lt, cs(c, 1)); text('일반인 쓸모 ★★★☆☆ (3)', 960, 600, 64, GOLD, 900, 'center', k1);
    const k2 = ap(lt, cs(c, 2)); text('그림 파일을 확대해도 깨지지 않는 SVG로 바꾸는 무료 프로그램', 960, 720, 44, INK, 800, 'center', k2);
  },
  what(c, lt) {
    const k0 = ap(lt, 0); text('JPG·PNG = 색 점 모자이크', 520, 170, 46, RED, 900, 'center', k0);
    zoomBox('dot', 220, 220, 600, 420, .5, .3, 1 + 1.2 * ease(prog(lt, cs(c, 1), cs(c, 1) + 2)), 600, k0, false);
    text('확대하면 점이 커짐 → 계단·흐림', 520, 690, 34, INK, 800, 'center', ap(lt, cs(c, 1)));
    const k2 = ap(lt, cs(c, 2)); text('SVG = 조립 설명서', 1400, 170, 46, GREEN, 900, 'center', k2);
    code(['<path d="M10,1 l2,0 l0,1 …"', '      fill="#3FA34D"/>', ':: 이 선 안을 초록으로 칠하기'], 1000, 220, 800, k2, 30);
    zoomBox('dot_pixel', 1100, 440, 600, 200, .5, .3, 1 + 1.2 * ease(prog(lt, cs(c, 3), cs(c, 3) + 2)), 600, ap(lt, cs(c, 3)), true);
    text('크기를 바꿔도 설명서대로 다시 그림 → 늘 선명', 1400, 690, 34, INK, 800, 'center', ap(lt, cs(c, 3)));
    const k4 = ap(lt, cs(c, 4)); box(260, 750, 1400, 90, 45, 'rgba(88,166,255,.12)', BLUE, k4, 3);
    text('VTracer: 모자이크를 보고 조립 설명서를 받아 적는 프로그램', 960, 795, 36, BLUE, 900, 'center', k4);
    text('visioncortex(홍콩) · MIT 라이선스 · ⭐ 7,536 · 최신 1.0.0-alpha.4 (시험 버전)', 960, 890, 28, SUB, 700, 'center', ap(lt, cs(c, 5)));
  },
  install(c, lt) {
    const k0 = ap(lt, 0); card(160, 130, 760, 230, '방법 ① 공식 화면 프로그램', 'Windows App', BLUE, k0, 64);
    text('README의 Windows App 설치 파일 · 이번 시연에서는 실행하지 않음', 540, 400, 24, SUB, 700, 'center', k0);
    const k1 = ap(lt, cs(c, 1)); code([':: 방법 ② 파이썬 설치 → VTracer 설치', 'winget install -e --id Python.Python.3.12', 'pip install vtracer==1.0.0a4'], 1000, 130, 760, k1, 28);
    const k2 = ap(lt, cs(c, 2)); box(1000, 360, 760, 70, 14, 'rgba(255,123,114,.10)', RED, k2, 2); text('==1.0.0a4 를 빼면 옛 버전 0.6.15 설치', 1380, 395, 30, RED, 900, 'center', k2);
    [['설치 시간 (리눅스)', f2(RES.install.pip_sec) + '초', GREEN], ['내려받는 파일', '1.2MB', GOLD], ['함께 설치되는 프로그램', '없음', BLUE]].forEach((r, i) => card(160 + i * 540, 500, 500, 170, r[0], r[1], r[2], ap(lt, cs(c, 3) + i * .9)));
    const k4 = ap(lt, cs(c, 4)); box(160, 730, 1600, 100, 18, 'rgba(242,193,78,.10)', GOLD, k4, 2);
    text('Windows 설치는 공식 안내 기준 · Windows 실행 확인 전 (시연은 리눅스)', 960, 780, 34, GOLD, 800, 'center', k4);
  },
  usage(c, lt) {
    code(['C:\\그림> python -c "import vtracer; vtracer.convert_file(\'로고.jpg\', \'로고.svg\')"'], 140, 130, 1640, ap(lt, 0), 30);
    [['max_colors=6', '색 개수 줄이기 (로고)'], ['simplify=1.5', '곡선 단순화 (파일 작게)'], ["clustering='bw', adaptive=True", '흑백 + 밝기 맞춤 (서명)'], ["mode='pixel'", '네모 칸 그대로 (도트 그림)']].forEach(([o, d], j) => {
      const k = ap(lt, cs(c, 1) + j * .9), x = 140 + (j % 2) * 830, y = 280 + Math.floor(j / 2) * 130; box(x, y, 810, 110, 16, CARD, BLUE, k, 2);
      text(o, x + 30, y + 38, fit(o, 30, 750, 700), BLUE, 800, 'left', k, MONO); text(d, x + 30, y + 80, 28, INK, 700, 'left', k); });
    const k2 = ap(lt, cs(c, 2)); ['로고.jpg  (원본 그대로)', '로고.svg  (새 파일)'].forEach((s, i) => { box(140 + i * 840, 560, 800, 90, 14, CARD, i ? GREEN : LINE, k2, 3); text(s, 180 + i * 840, 605, 32, i ? GREEN : INK, 800, 'left', k2); });
    const k3 = ap(lt, cs(c, 3)); box(140, 700, 1640, 130, 16, 'rgba(126,231,135,.10)', GREEN, k3, 2);
    text('SVG만들기.bat 위에 그림을 끌어다 놓기 → 1 로고 · 2 서명 · 3 도트 · 4 사진', 960, 748, 36, GREEN, 800, 'center', k3); text('(Windows 실행 확인 전 · 같은 설정은 리눅스에서 확인)', 960, 800, 26, SUB, 600, 'center', k3);
  },
  demo1(c, lt) {
    const tz = cs(c, 2) - .3;
    if (lt < tz + .7) { const a = 1 - ap(lt, tz, .7); ctx.save(); ctx.globalAlpha = a;
      wipe('logo', 'logo_svg', 300, 170, 600, 600, ease(prog(lt, cs(c, 1), cs(c, 1) + 1.6)), 1, 'VTracer · ' + f2(L.max6_simplify.sec) + '초');
      pill('로고_작은.jpg · 240px · ' + kb(L.in_kb) + ' (가상 로고)', 600, 830, 28, SUB, ap(lt, 0));
      card(1050, 170, 600, 260, '걸린 시간 (색 6가지 + 곡선 단순화)', f2(counter(L.max6_simplify.sec, cs(c, 1) + .4, lt)) + '초', GREEN, ap(lt, cs(c, 1) + .4), 90);
      card(1050, 470, 600, 260, 'SVG 조각(path) 수', Math.round(counter(L.max6_simplify.paths, cs(c, 1) + 1.2, lt)) + '개', BLUE, ap(lt, cs(c, 1) + 1.2), 90); ctx.restore(); }
    const za = ap(lt, tz, .7); if (za <= 0) return;
    const z = 1 + 19 * ease(prog(lt, tz + .5, tz + 3.5)), R = { x: 160, y: 150, w: 1600, h: 520 };
    zoomPair('logo', 'logo_svg', R, .38, .74, z, 360, za, '일반 확대 (JPG)', 'VTracer SVG');
    const k3 = ap(lt, cs(c, 3)); text('1200px 원본과 같은 색인 점', 560, 730, 28, SUB, 700, 'center', k3);
    bar(200, 760, 560, 34, L.bicubic_same, 100, RED, ease(prog(lt, cs(c, 3), cs(c, 3) + 1.5)), '일반 ' + f1(L.bicubic_same) + '%', k3, 26);
    bar(200, 810, 560, 34, L.max6_simplify.same, 100, GREEN, ease(prog(lt, cs(c, 3) + .5, cs(c, 3) + 2)), 'SVG ' + f1(L.max6_simplify.same) + '%', k3, 26);
    const k4 = ap(lt, cs(c, 4)); text('서로 다른 색 값 (미세한 중간색 포함)', 1360, 730, 28, SUB, 700, 'center', k4);
    text(L.bicubic_colors.toLocaleString('ko-KR') + '가지 → 6가지', 1360, 800, 52, GOLD, 900, 'center', k4);
    const k5 = ap(lt, cs(c, 5)); pill('한계: 글자 테두리에 연한 띠가 남은 곳', 1360, 880, 26, RED, k5);
    stamp('20배에도 또렷', 1640, 210, ap(lt, tz + 3.6, .5), GREEN, 40);
  },
  demo2(c, lt) { sceneSign(c, lt, { x: 260, y: 160, w: 1600, h: 700 }, cs(c, 1), cs(c, 2));
    const k3 = ap(lt, cs(c, 3)), y = 600; text('원래 획과 겹친 정도', 580, y, 30, SUB, 800, 'center', k3); text('원래 획 = 그림자를 넣기 전 직접 그린 서명', 580, y + 165, 22, SUB, 600, 'center', k3);
    bar(280, y + 40, 520, 40, SG.bw.iou, 100, RED, ease(prog(lt, cs(c, 3), cs(c, 3) + 1.5)), f1(SG.bw.iou) + '%', k3);
    bar(280, y + 100, 520, 40, SG.adaptive.iou, 100, GREEN, ease(prog(lt, cs(c, 3) + .6, cs(c, 3) + 2.1)), f1(SG.adaptive.iou) + '%', k3);
    const k4 = ap(lt, cs(c, 4)); stamp('배경 투명 · 조각 3개', 580, 830, k4, GREEN, 38); },
  demo3(c, lt) { sceneDot(c, lt, { x: 160, y: 140, w: 1600, h: 760 }, cs(c, 1), cs(c, 2), 640);
    const k1 = ap(lt, cs(c, 1)); card(1000, 180, 700, 200, '기본(곡선) 모드', '조각 ' + DT.spline.paths + '개 · 노란 칸 사라짐', RED, k1, 44);
    const k2 = ap(lt, cs(c, 2)); card(1000, 420, 700, 200, '-m pixel', '조각 ' + DT.pixel.paths + '개 · ' + kb(DT.pixel.kb), GREEN, k2, 56);
    const k3 = ap(lt, cs(c, 3)); pill('480px로 키워도 칸 테두리 그대로', 1350, 700, 30, GREEN, k3); },
  demo4(c, lt) {
    const w = 400 / 1.35, h = 267 / 1.35, items = [['cat', '원본 사진 (CC0)', SUB, 0, null], ['cat_poster', 'poster · ' + f1(CT.poster.same) + '% 같은 색', GREEN, cs(c, 1), CT.poster], ['cat_max8', 'max_colors=8', GOLD, cs(c, 2), CT.max8], ['cat_photo', 'photo · 조각 ' + CT.photo.paths + '개', BLUE, cs(c, 2) + 1, CT.photo], ['cat_ws', 'watershed · 조각 ' + CT.watershed.paths + '개', PURPLE, cs(c, 3), CT.watershed]];
    items.forEach(([k, lab, col, t, m], i) => { const a = ap(lt, t), x = 260 + (i % 3) * 500 + (i >= 3 ? 250 : 0), y = 130 + Math.floor(i / 3) * 350;
      pic(k, x, y, w * 1.35, h * 1.35, a); pill(lab, x + w * .675, y + h * 1.35 + 30, 24, col, a); });
    const k4 = ap(lt, cs(c, 4)); box(160, 830, 1600, 80, 18, 'rgba(242,193,78,.10)', GOLD, k4, 2);
    text('4000px 큰 사진: 기본 ' + f2(RES.big.sec) + '초 · poster ' + Math.round(RES.big_poster.sec) + '초 (파일 ' + (RES.big_poster.kb / 1024).toFixed(1) + 'MB)', 960, 870, 32, GOLD, 800, 'center', k4);
  },
  demo5(c, lt) {
    const k0 = ap(lt, 0); text('--simplify : 곡선을 더 적은 선으로', 960, 160, 44, INK, 900, 'center', k0);
    const rows = [['로고 (기본)', L.default.kb, RED, cs(c, 1)], ['로고 (색 6가지 + simplify)', L.max6_simplify.kb, GREEN, cs(c, 1) + .8], ['고양이 사진 (기본)', CT.default.kb, RED, cs(c, 2)], ['고양이 사진 (simplify)', CT.simplify.kb, GREEN, cs(c, 2) + .8]];
    rows.forEach(([lab, v, col, t], i) => { const k = ap(lt, t), y = 250 + i * 110 + (i >= 2 ? 30 : 0); text(lab, 600, y + 22, 30, col, 800, 'right', k);
      bar(640, y, 1000, 46, v, 600, col, ease(prog(lt, t, t + 1.5)), kb(v), k, 30); });
    const k3 = ap(lt, cs(c, 3)); box(160, 770, 1600, 100, 18, CARD, BLUE, k3, 2); text('만든 SVG → 엣지·크롬으로 열기 · 파워포인트·워드에 그림으로 넣기', 960, 820, 34, BLUE, 800, 'center', k3);
  },
  cons(c, lt) {
    const k0 = ap(lt, 0); text('아쉬운 점', 960, 150, 56, INK, 900, 'center', k0);
    const items = [['시험 버전', '1.0.0-alpha.4 · ==1.0.0a4 를 붙여야 1.0 설치', RED], ['사진은 커짐', '고양이 37.8KB → SVG 697KB (poster)', GOLD],
      ['큰 사진 + poster', '4000px 사진 109초', BLUE], ['시연 범위', '화면 프로그램·Windows 실행은 시연하지 않음', SUB]];
    items.forEach((it, i) => { const k = ap(lt, cs(c, i + 1)), y = 240 + i * 160; box(200, y, 1520, 130, 20, CARD, it[2], k, 3);
      text((i + 1) + '. ' + it[0], 250, y + 65, 42, it[2], 900, 'left', k); text(it[1], 700, y + 65, fit(it[1], 34, 980), INK, 700, 'left', k); });
  },
  summary(c, lt) {
    const k0 = ap(lt, 0); text('VTracer 정리', 960, 160, 56, INK, 900, 'center', k0);
    const items = [['조립 설명서', '모자이크 그림 → SVG, 키워도 선명', BLUE], ['그림별 옵션', '로고 max_colors · 서명 bw+adaptive · 도트 pixel', GREEN], ['처리 시간', '로고 0.06초 · 서명 0.05초 · 설치 0.66초', GOLD], ['원본 보관', '남의 로고는 권리 확인 후 사용', PURPLE]];
    items.forEach((it, i) => { const t = cs(c, i + 1), k = ap(lt, t), y = 260 + i * 150; box(200, y, 1520, 120, 20, CARD, it[2], k, 3);
      check(290, y + 60, 70, prog(lt, t + .2, t + 1), it[2], k); text(it[0], 360, y + 60, 42, it[2], 900, 'left', k); text(it[1], 760, y + 60, fit(it[1], 38, 920, 800), INK, 800, 'left', k); });
  },
  end(c, lt) { endCard(c, lt, { x: 0, y: 60, w: 1920, h: 900 }, 72); },
};
function endCard(c, lt, R, big = 64) {
  const cx = R.x + R.w / 2, k = ap(lt, 0), v = R.h > R.w;
  text('VTracer · 그림을 SVG로', cx, R.y + R.h * (v ? .3 : .28), big * .8, BLUE, 900, 'center', k);
  const Ls = wrap('다음에 또 멋진 오픈소스 소개하겠습니다!', R.w - 80, big, 900);
  Ls.forEach((l, i) => text(l, cx, R.y + R.h * (v ? .42 : .45) + i * big * 1.3, big, INK, 900, 'center', k));
  const k2 = ap(lt, .8), yy = R.y + R.h * (v ? .78 : .8);
  if (v) { let j = 0; DISCLAIMER.forEach(d => wrap(d, R.w - 60, 28, 500).forEach(l => text(l, cx, yy + (j++) * 44, 28, SUB, 500, 'center', k2))); }
  else DISCLAIMER.forEach((d, i) => { const fs = fit(d, 24, R.w - 40, 500); text(d, cx, yy + i * 38, fs, SUB, 500, 'center', k2); });
}

// ───── 과정 애니메이션 (숏폼 대본, 가로·세로 공용)
function DRAW_ANIM(c, lt, W, H) {
  const v = H > W, R = v ? { x: 60, y: 230, w: W - 120, h: 1280 } : { x: 160, y: 110, w: W - 320, h: 800 }, cx = R.x + R.w / 2;
  if (c.id === 's_hook') { const s = v ? 900 : 640, z = 1 + 9 * ease(prog(lt, 1.2, 4.5)), y = R.y + (v ? 120 : 30);
    zoomBox('logo', cx - s / 2, y, s, s, .38, .74, z, s, ap(lt, 0)); pill('로고_작은.jpg · 240px', cx, y - 40, v ? 34 : 28, SUB, ap(lt, 0));
    pill('×' + z.toFixed(1), cx, y + s - 50, v ? 40 : 32, GOLD, ap(lt, 1)); stamp('흐릿', cx + s / 2 - 80, y + 90, ap(lt, 4.6, .5), RED, v ? 60 : 50); }
  if (c.id === 's_logo') sceneLogo(c, lt, R, .8, cs(c, 1), { dy: v ? 120 : 40 });
  if (c.id === 's_sign') { sceneSign(c, lt, { x: R.x, y: R.y + (v ? 60 : 40), w: R.w, h: R.h }, .8, 2.4);
    const k = ap(lt, cs(c, 1)), y = v ? R.y + 1250 : R.y + 640; stamp('원래 획과 겹침 ' + f1(SG.bw.iou) + '% → ' + f1(SG.adaptive.iou) + '%', v ? cx : R.x + 380, y, k, GREEN, v ? 46 : 38); }
  if (c.id === 's_dot') { const s = v ? 860 : 620; sceneDot(c, lt, { x: R.x, y: R.y + (v ? 100 : 30), w: R.w, h: R.h }, 1.2, 3.2, s);
    if (!v) { card(R.x + 800, R.y + 120, 620, 190, '기본(곡선) 모드', '칸이 녹음', RED, ap(lt, 1.2), 52); card(R.x + 800, R.y + 360, 620, 190, '-m pixel', '칸 모양 그대로', GREEN, ap(lt, 3.2), 52); } }
  if (c.id === 's_end') { const a = ap(lt, 0); text('SVG 파일 크기 (원본 사진 ' + kb(CT.in_kb) + ')', cx, R.y + 30, v ? 42 : 36, SUB, 800, 'center', a);
    [['poster', CT.poster.kb, RED], ['max_colors=8', CT.max8.kb, GOLD], ['photo', CT.photo.kb, GREEN]].forEach(([lab, val, col], i) => { const k = ap(lt, i * .9), y = R.y + (v ? 130 : 100) + i * (v ? 150 : 110);
      text(lab, R.x + (v ? 0 : 160), y + 25, v ? 36 : 32, col, 900, 'left', k, MONO); bar(R.x + (v ? 330 : 520), y, R.w - (v ? 520 : 900), 50, val, 750, col, ease(prog(lt, i * .9, i * .9 + 1.5)), kb(val), k, v ? 32 : 28); });
    const k2 = ap(lt, cs(c, 0) + 3.2), yb = R.y + (v ? 700 : 480); text('일반인 쓸모 ★★★☆☆ (3)', cx, yb, v ? 64 : 56, GOLD, 900, 'center', k2);
    text('pip install vtracer==1.0.0a4', cx, yb + (v ? 120 : 90), fit('pip install vtracer==1.0.0a4', 44, R.w), BLUE, 600, 'center', k2, MONO); }
}
