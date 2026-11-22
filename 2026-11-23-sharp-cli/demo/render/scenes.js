// 장면 그리기. 장(c)의 자막 시작 시각(c.cues[i][0])에 맞춰 화면 요소가 하나씩 나타난다 → 다 나타난 뒤 자막 길이(최소 3초)만큼 멈춤
// 숫자: data.js (RES = 2026-11-23 시연 측정값, demo/results.json) · 그림: img/ (시연용 가상 사진과 sharp-cli 결과를 줄인 것, mkdata.py)
// 연출(tools/kit/README.md): 도장 배지, 설정별 막대 비교, 돋보기 확대 비교(화질 값) + 새 연출 '진공 압축팩'(vacBag: 사진 둘레 비닐이 조여들며 공기 화살표가 빠져나감)
const cs = (c, i) => c.cues[Math.min(i, c.cues.length - 1)][0];
const ap = (lt, t, d = .7) => out3(prog(lt, t, t + d));
const R0 = RES, stamp = (s, x, y, k, color = GOLD, size = 48, rot = -7) => KIT.stamp(ctx, s, x, y, k, color, size, rot);
const IMG = {};
const IMG_READY = Promise.all(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'q95', 'q80', 'q40', 'q20', 'qref', 'rot_default', 'rot_auto', 'square'].map(n => new Promise(res => {
  const im = new Image(); im.onload = res; im.onerror = () => { console.log('img fail', n); res(); }; im.src = 'img/' + n + (n[0] === 'q' ? '.png' : '.jpg'); IMG[n] = im;
})));
const f2 = v => v.toFixed(2), PN = ['바다노을', '산풍경', '숲길', '꽃밭', '도시야경', '구름하늘'];
const BEF_MB = R0.photos.map(p => p.mb), AFT_MB = R0.resize.each, FM = R0.formats, QR = R0.quality.rows;
function pic(name, x, y, w, h, a = 1, stroke = LINE) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; rr(x, y, w, h, 12); ctx.clip(); if (IMG[name]) ctx.drawImage(IMG[name], x, y, w, h); ctx.restore(); box(x, y, w, h, 12, null, stroke, a, 3);
}
// 사진 6장 격자 (s = 0~1 크기 비율: 1 → 원래 칸 크기, 작아지면 칸 가운데로 줄어듦) + 용량 꼬리표
function grid6(x, y, w, h, k, s = 1, mbs = BEF_MB, col = INK, opt = {}) {
  const cw = w / 3, ch = h / 2;
  for (let i = 0; i < 6; i++) {
    const a = k * (opt.stagger ? ap(opt.lt, opt.t0 + i * .25, .5) : 1); if (a <= 0) continue;
    const cx = x + (i % 3) * cw + cw / 2, cy = y + Math.floor(i / 3) * ch + ch / 2 - 16, pw = (cw - 30) * s, ph = pw * .75;
    pic('p' + (i + 1), cx - pw / 2, cy - ph / 2, pw, ph, a);
    if (opt.label !== false) text(f2(mbs[i]) + 'MB', cx, cy + ph / 2 + 26, opt.fs || 28, col, 900, 'center', a);
  }
}
// 새 연출 '진공 압축팩': 사진 둘레 반투명 비닐(점선) 이 k 만큼 조여듦, 공기 화살표가 바깥으로 빠져나감
function vacBag(cx, cy, w, h, k, a = 1, t = 0) {
  if (a <= 0) return; const sw = lerp(w * 1.25, w * 1.03, k), sh = lerp(h * 1.25, h * 1.03, k);
  ctx.save(); ctx.globalAlpha *= a; rr(cx - sw / 2, cy - sh / 2, sw, sh, 26); ctx.fillStyle = 'rgba(180,220,255,.10)'; ctx.fill();
  ctx.strokeStyle = 'rgba(180,220,255,.75)'; ctx.lineWidth = 4; ctx.setLineDash([16, 10]); ctx.stroke(); ctx.setLineDash([]);
  // 공기 화살표 (조이는 동안만)
  const air = k > .02 && k < .98 ? 1 : 0;
  if (air) for (let i = 0; i < 4; i++) { const ph = ((t * 1.2 + i / 4) % 1), ang = i * Math.PI / 2 + Math.PI / 4, r0 = Math.max(sw, sh) * .55 + ph * 90;
    const X = cx + Math.cos(ang) * r0, Y = cy + Math.sin(ang) * r0 * .7; ctx.globalAlpha = a * (1 - ph) * .9;
    ctx.strokeStyle = BLUE; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X - Math.cos(ang) * 40, Y - Math.sin(ang) * 28); ctx.lineTo(X, Y); ctx.stroke(); }
  ctx.restore();
}
// 가로 막대 비교 (설정별 막대 비교)
function hbars(x, y, w, rows, k, lt, t0, opt = {}) {
  const max = opt.max || Math.max(...rows.map(r => r.v)), rh = opt.rh || 96, fs = opt.fs || 34;
  rows.forEach((r, i) => {
    const a = k * ap(lt, t0 + i * (opt.gap || .9)); if (a <= 0) return; const yy = y + i * rh, bw = (w - 260) * clamp(r.v / max) * out3(prog(lt, t0 + i * (opt.gap || .9), t0 + i * (opt.gap || .9) + 1.5));
    text(r.name, x + 200, yy + rh * .4, fs, r.col || INK, 900, 'right', a);
    box(x + 220, yy + rh * .4 - rh * .3, Math.max(8, bw), rh * .6, 10, r.col || BLUE, null, a * .9);
    text(r.lab, x + 240 + Math.max(8, bw), yy + rh * .4, fs * .9, INK, 900, 'left', a);
  });
}
function card(s, x, y, w, h, a, col = BLUE, fs = 36, sub = '') {
  if (a <= 0) return; box(x, y, w, h, 18, CARD, col, a, 3); text(s, x + 36, y + (sub ? h * .36 : h / 2), fs, INK, 800, 'left', a);
  if (sub) text(sub, x + 36, y + h * .7, fs * .75, SUB, 700, 'left', a);
}
function cards(c, lt, items, x, y, w, h, gap, startCue = 0, cols = [BLUE, GREEN, GOLD, PURPLE, RED]) {
  items.forEach((s, i) => { const a = ap(lt, cs(c, startCue + i)); const it = Array.isArray(s) ? s : [s, '']; card(it[0], x, y + i * (h + gap), w, h, a, cols[i % cols.length], 38, it[1]); });
}
function termBox(x, y, w, lines, lt, t0, fs = 30, a = 1) {
  const h = 60 + lines.length * fs * 1.7; box(x, y, w, h, 16, '#010409', LINE, a, 2);
  [RED, GOLD, GREEN].forEach((c, i) => { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 30 + i * 28, y + 26, 8, 0, 7); ctx.fill(); ctx.restore(); });
  lines.forEach((l, i) => { const st = t0 + (l.t || i * 1.2), n = Math.floor(clamp((lt - st) / Math.max(.6, l.s.length * .035)) * l.s.length); if (lt < st) return;
    text(l.s.slice(0, n), x + 30, y + 70 + i * fs * 1.7, fs, l.col || INK, 600, 'left', a, MONO); });
}
function gpsTag(x, y, on, a, fs = 30) {
  if (a <= 0) return; const s = on ? '위치 정보: 북위 37.56 · 동경 126.98' : '위치 정보: 없음', col = on ? RED : GREEN;
  pill(s, x, y, fs, col, a);
}

const DRAW_LONG = {
  preview(c, lt) {
    const m = ease(prog(lt, cs(c, 1) + .3, cs(c, 1) + 2.3)), cur = BEF_MB.map((b, i) => lerp(b, AFT_MB[i], m));
    text(m < .5 ? '줄이기 전 · 각 4032 × 3024' : '줄인 뒤 · 각 1600 × 1200', 960, 130, 46, m < .5 ? INK : GREEN, 900, 'center', ap(lt, 0));
    grid6(260, 180, 1400, 640, ap(lt, 0), lerp(1, .62, m), cur, m < .5 ? INK : GREEN);
    const tot = lerp(R0.resize.before, R0.resize.after, m);
    pill('합계 ' + tot.toFixed(2) + 'MB', 960, 860, 40, m < .5 ? GOLD : GREEN, ap(lt, 0));
    stamp(R0.resize.sec.toFixed(1) + '초', 1650, 260, ap(lt, cs(c, 1) + 2.4, .5), GOLD, 64);
    const k2 = ap(lt, cs(c, 2)); if (k2 > 0) { box(560, 380, 800, 200, 20, 'rgba(1,4,9,.94)', GREEN, k2, 3); text('위치 정보(GPS)', 960, 440, 44, INK, 900, 'center', k2); text('기본으로 빠짐', 960, 515, 52, GREEN, 900, 'center', k2); }
  },
  title(c, lt) {
    vacBag(960, 330, 360, 270, ease(prog(lt, .5, 3)), ap(lt, 0), lt); pic('p2', 960 - 180 * lerp(1, .8, ease(prog(lt, .5, 3))), 330 - 135 * lerp(1, .8, ease(prog(lt, .5, 3))), 360 * lerp(1, .8, ease(prog(lt, .5, 3))), 270 * lerp(1, .8, ease(prog(lt, .5, 3))), ap(lt, 0));
    text('sharp-cli', 960, 600, 110, GOLD, 900, 'center', ap(lt, 0), MONO);
    text('★★★½☆ (3.5)', 960, 730, 60, GOLD, 900, 'center', ap(lt, cs(c, 1)));
    text('사진 용량을 명령 한 줄로 줄이는 무료 도구', 960, 820, 44, INK, 800, 'center', ap(lt, cs(c, 2)));
  },
  what(c, lt) {
    text('sharp-cli = 사진 진공 압축팩', 960, 140, 60, GOLD, 900, 'center', ap(lt, 0));
    const k1 = ease(prog(lt, cs(c, 1), cs(c, 1) + 2)), k2 = ease(prog(lt, cs(c, 2), cs(c, 2) + 2.5)), sz = lerp(1, .55, k1);
    const cx = 480, cy = 520, w = 600 * sz, h = 450 * sz;
    vacBag(cx, cy, w, h, k2, ap(lt, cs(c, 2)), lt); pic('p4', cx - w / 2, cy - h / 2, w, h, ap(lt, 0));
    text(k1 < .5 ? '4032 × 3024' : '1600 × 1200', cx, cy + h / 2 + 50, 36, k1 < .5 ? INK : GREEN, 900, 'center', ap(lt, 0), MONO);
    if (ap(lt, cs(c, 3)) > 0) { const k3 = ap(lt, cs(c, 3)) * (1 - ease(prog(lt, cs(c, 3) + 2.2, cs(c, 3) + 3))), dx = ease(prog(lt, cs(c, 3) + .6, cs(c, 3) + 2)) * 120;
      box(cx + 40 + dx, cy - 40, 210, 80, 10, '#fffbe6', RED, k3, 3); text('GPS 영수증', cx + 145 + dx, cy, 28, '#5a3e00', 900, 'center', k3); }
    const steps = [['① 접기 — 크기 줄이기', '4032 × 3024 → 가로 1600'], ['② 공기 빼기 — 화질 값', '1~100, 기본 80'], ['③ 영수증 빼기 — 위치 정보', 'GPS·기기 정보 기본 삭제']];
    steps.forEach((s, i) => card(s[0], 900, 250 + i * 160, 900, 130, ap(lt, cs(c, i + 1)), [BLUE, GREEN, RED][i], 40, s[1]));
    const k4 = ap(lt, cs(c, 4)); if (k4 > 0) text('속 엔진 sharp (별 약 3.3만 · Apache-2.0) + 명령어 sharp-cli (MIT)', 960, 860, 34, SUB, 800, 'center', k4);
  },
  install(c, lt) {
    termBox(260, 170, 1400, [{ s: 'C:\\> winget install OpenJS.NodeJS.LTS', t: cs(c, 0) + .5, col: INK }, { s: 'C:\\> npm install -g sharp-cli', t: cs(c, 1) + .3, col: GOLD },
      { s: '→ 시연(리눅스): 함께 설치 32개 · 약 3.5초 · 37.7MB', t: cs(c, 2) + .3, col: GREEN }, { s: 'C:\\> sharp --version', t: cs(c, 3) + .2, col: GOLD }, { s: '6.1.0', t: cs(c, 3) + 1.2, col: GREEN }], lt, 0, 36, ap(lt, 0));
    text('Node.js 20.10 이상 필요 · 명령 프롬프트(cmd) 기준 · Windows 실행은 시연 확인 전', 960, 760, 32, SUB, 700, 'center', ap(lt, cs(c, 3)));
  },
  demo1(c, lt) {
    const m = ease(prog(lt, cs(c, 2), cs(c, 2) + 2)), cur = BEF_MB.map((b, i) => lerp(b, AFT_MB[i], m));
    grid6(150, 150, 1120, 560, ap(lt, 0), lerp(1, .65, m), cur, m < .5 ? INK : GREEN, { stagger: true, lt, t0: 0 });
    vacBag(710, 430, 1100, 580, m, ap(lt, cs(c, 2)) * (1 - ap(lt, cs(c, 3))), lt);
    termBox(1300, 160, 520, [{ s: 'sharp -i "*.jpg"', t: cs(c, 1) + .2, col: GOLD }, { s: ' -o "작게/{name}.jpg"', t: cs(c, 1) + 1, col: GOLD }, { s: ' resize 1600', t: cs(c, 1) + 1.8, col: GOLD }], lt, 0, 30, ap(lt, cs(c, 1)));
    const tot = lerp(R0.resize.before, R0.resize.after, m);
    pill('합계 ' + tot.toFixed(2) + 'MB', 710, 790, 40, m < .5 ? GOLD : GREEN, ap(lt, 0));
    stamp(R0.resize.sec.toFixed(1) + '초', 1560, 520, ap(lt, cs(c, 2) + 2.1, .5), GOLD, 64);
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) { card('작게/ 폴더에 새로 저장', 1320, 640, 500, 90, k3, GREEN, 32); card('원본 6장은 그대로', 1320, 750, 500, 90, k3 * ap(lt, cs(c, 3) + .8), BLUE, 32); }
  },
  demo2(c, lt) {
    text('같은 6장 · 가로 1600 · 형식만 다르게 (합계 용량)', 960, 140, 44, INK, 900, 'center', ap(lt, 0));
    const rows = [{ name: 'JPG', v: FM.jpeg.total, lab: f2(FM.jpeg.total) + 'MB', col: BLUE }, { name: 'WebP', v: FM.webp.total, lab: f2(FM.webp.total) + 'MB', col: GREEN },
      { name: 'AVIF', v: FM.avif.total, lab: f2(FM.avif.total) + 'MB', col: GOLD }, { name: 'PNG', v: FM.png.total, lab: FM.png.total.toFixed(1) + 'MB  ← 원본 16.5MB보다 큼', col: RED }];
    hbars(160, 220, 1500, rows, ap(lt, 0), lt, cs(c, 1), { max: 36, rh: 120 });
    const k2 = ap(lt, cs(c, 2)); if (k2 > 0) { box(300, 720, 1320, 110, 16, CARD, PURPLE, k2, 3);
      text(`닮은 정도(SSIM, 1 = 똑같음)  JPG ${FM.jpeg.ssim.toFixed(3)} · WebP ${FM.webp.ssim.toFixed(3)} · AVIF ${FM.avif.ssim.toFixed(3)}`, 960, 775, 36, INK, 800, 'center', k2); }
    stamp('AVIF ' + FM.avif.sec.toFixed(1) + '초', 1480, 330, ap(lt, cs(c, 3), .5), GOLD, 46);
  },
  demo3(c, lt) {
    const Q = ['95', '80', '40', '20'];
    Q.forEach((q, i) => { const a = ap(lt, cs(c, 0) + i * .9), x = 120 + i * 430, y = 160, w = 400, h = 300;
      pic('q' + q, x, y, w, h, a, q === '20' ? RED : LINE); text('화질 ' + q, x + w / 2, y + h + 44, 40, GOLD, 900, 'center', a);
      text(QR[q].kb.toFixed(0) + 'KB', x + w / 2, y + h + 100, 44, INK, 900, 'center', a * ap(lt, cs(c, 1) + i * .9));
      text('닮은 정도 ' + QR[q].ssim.toFixed(3), x + w / 2, y + h + 156, 34, i < 2 ? GREEN : RED, 800, 'center', a * ap(lt, cs(c, 2) + i * .9)); });
    text('산풍경 1600px 결과의 같은 자리를 3배 확대 (WebP)', 960, 120, 30, SUB, 700, 'center', ap(lt, 0));
    if (ap(lt, cs(c, 3)) > 0) { const k = ap(lt, cs(c, 3)); ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(1610, 310, 225, 165, 0, 0, 7); ctx.stroke(); ctx.restore();
      text('잔무늬가 뭉개짐', 1610, 700, 40, RED, 900, 'center', k); }
  },
  demo4(c, lt) {
    const off = ease(prog(lt, cs(c, 1) + .3, cs(c, 1) + 1.5));
    pic('p1', 160, 170, 640, 480, ap(lt, 0)); text('원본 (가상 사진)', 480, 700, 36, INK, 900, 'center', ap(lt, 0)); gpsTag(480, 770, true, ap(lt, 0));
    pic('p1', 1120, 170, 640, 480, ap(lt, cs(c, 1))); text('sharp-cli 기본 결과', 1440, 700, 36, INK, 900, 'center', ap(lt, cs(c, 1)));
    gpsTag(1440, 770, off < .5, ap(lt, cs(c, 1)) * (off < .5 ? 1 - off * 2 : (off - .5) * 2));
    if (off >= 1) check(1700, 230, 90, ease(prog(lt, cs(c, 1) + 1.5, cs(c, 1) + 2.2)), GREEN);
    const k2 = ap(lt, cs(c, 2)); if (k2 > 0) { box(1120, 820, 640, 70, 14, CARD, GOLD, k2, 3); text('-m 옵션을 붙이면 → 위치 정보 그대로 남음', 1440, 855, 30, GOLD, 800, 'center', k2); }
    text('→', 960, 410, 90, SUB, 900, 'center', ap(lt, cs(c, 1)));
  },
  demo5(c, lt) {
    pic('rot_default', 160, 250, 640, 480, ap(lt, cs(c, 1))); text('기본 실행 · 1600 × 1200', 480, 790, 38, RED, 900, 'center', ap(lt, cs(c, 1)));
    if (ap(lt, cs(c, 1) + 1) > 0) cross(740, 300, 110, ap(lt, cs(c, 1) + 1));
    pic('rot_auto', 1200, 150, 480, 640, ap(lt, cs(c, 2))); text('--autoOrient · 1200 × 1600', 1440, 840, 38, GREEN, 900, 'center', ap(lt, cs(c, 2)));
    if (ap(lt, cs(c, 2)) > 0) check(1640, 220, 100, ease(prog(lt, cs(c, 2) + .8, cs(c, 2) + 1.6)), GREEN);
    text('휴대폰은 세로 사진을 눕혀 저장 + "돌려서 보여 줘" 표시', 960, 140, 40, INK, 900, 'center', ap(lt, 0) * (1 - ap(lt, cs(c, 1))) + ap(lt, cs(c, 1)) * .0);
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) pill('사진작게.bat에는 --autoOrient가 들어 있음', 960, 900, 34, GOLD, k3);
  },
  demo6(c, lt) {
    const done = ease(prog(lt, cs(c, 1), cs(c, 1) + 3)), N = 60;
    for (let i = 0; i < N; i++) { const a = ap(lt, i * .03, .4), x = 140 + (i % 12) * 112, y = 160 + Math.floor(i / 12) * 104, ok = i < done * N;
      pic('p' + (i % 6 + 1), x, y, ok ? 72 : 100, ok ? 54 : 75, a, ok ? GREEN : LINE); }
    pill('합계 ' + lerp(R0.many.before, R0.many.after, done).toFixed(1) + 'MB', 1680, 300, 40, done < 1 ? GOLD : GREEN, ap(lt, 0));
    stamp(R0.many.sec + '초', 1680, 460, ap(lt, cs(c, 1) + 3, .5), GOLD, 60);
    const k3 = ap(lt, cs(c, 2)); if (k3 > 0) text('한 장에 약 ' + (R0.many.sec / R0.many.n).toFixed(2) + '초꼴', 1680, 600, 38, INK, 900, 'center', k3);
    const k4 = ap(lt, cs(c, 3)); if (k4 > 0) text('CPU 2개 클라우드 기준', 1680, 680, 30, SUB, 700, 'center', k4);
  },
  opts(c, lt) {
    cards(c, lt, [['resize 1600 1600 --fit inside --withoutEnlargement', '긴 변 1600 · 비율 유지 · 작은 사진은 키우지 않음 (800 × 600 → 그대로)'],
      ['-q 80  -f webp  -m  --autoOrient', '화질 · 형식 · 정보 유지 · 방향 바로잡기'], ['resize 1080 1080', '가운데를 잘라 정사각형 (인스타그램용) · 0.22초']], 160, 200, 1180, 170, 40, 1);
    pic('square', 1420, 300, 360, 360, ap(lt, cs(c, 3))); text('1080 × 1080', 1600, 700, 34, GREEN, 900, 'center', ap(lt, cs(c, 3)), MONO);
  },
  uses(c, lt) { cards(c, lt, ['① 블로그·카페에 올릴 사진 여러 장 한 번에 줄이기', '② 용량 제한 있는 서류 제출·메일 첨부 전에 줄이기', '③ 사진 공유 전 위치 정보 지우기'], 260, 230, 1400, 140, 50, 0); },
  cons(c, lt) {
    text('아쉬운 점', 960, 140, 56, RED, 900, 'center', ap(lt, 0));
    cards(c, lt, [['① 결과 폴더 = 원본 폴더 → 묻지 않고 덮어씀', '원본 2.56MB → 0.23MB로 바뀜 · 결과는 꼭 다른 폴더로'], ['② 아이폰 HEIC 사진 실패 · 파일 이름에 [ ] → No input files', '아이폰은 설정 › 카메라 › 포맷 › "높은 호환성"으로 하면 JPG로 저장'],
      ['③ -o에 없는 폴더 이름 → 그 이름의 파일 하나로 저장', '"작게/{name}.jpg"처럼 {name} 틀을 쓰면 폴더가 생김'], ['④ 화면 없는 명령어 도구 · Node.js 따로 설치', '끌어다 놓는 사진작게.bat로 보완']], 200, 210, 1520, 150, 26, 1, [RED, GOLD, PURPLE, BLUE]);
  },
  summary(c, lt) {
    cards(c, lt, ['✔ sharp-cli = 사진 진공 압축팩', '✔ 6장 16.5MB → 1.64MB · 0.5초 · 위치 정보 기본 삭제', '✔ 세로 사진은 --autoOrient · 결과는 다른 폴더로'], 260, 230, 1400, 150, 50, 1, [GOLD, GREEN, BLUE]);
    stamp('약 1/10', 1600, 200, ap(lt, cs(c, 2) + .5, .5), GREEN, 56);
  },
  end(c, lt) { endCard(c, lt, { x: 0, y: 60, w: 1920, h: 880 }, 64); },
};

function endCard(c, lt, R, big = 64) {
  const cx = R.x + R.w / 2, k = ap(lt, 0), v = R.h > R.w, pw = v ? 360 : 280;
  vacBag(cx, R.y + R.h * (v ? .1 : .12), pw, pw * .75, 1, k, 0); pic('p2', cx - pw * .45, R.y + R.h * (v ? .1 : .12) - pw * .34, pw * .9, pw * .675, k);
  text('sharp-cli · 사진 진공 압축팩', cx, R.y + R.h * (v ? .3 : .33), big * .62, GOLD, 900, 'center', k);
  const Ls = wrap('다음에 또 멋진 오픈소스 소개하겠습니다!', R.w - 80, big, 900);
  Ls.forEach((l, i) => text(l, cx, R.y + R.h * (v ? .42 : .47) + i * big * 1.3, big, INK, 900, 'center', k));
  const k2 = ap(lt, .8), yy = R.y + R.h * (v ? .78 : .8);
  if (v) { let j = 0; DISCLAIMER.forEach(d => wrap(d, R.w - 60, 28, 500).forEach(l => text(l, cx, yy + (j++) * 44, 28, SUB, 500, 'center', k2))); }
  else DISCLAIMER.forEach((d, i) => { const fs = fit(d, 24, R.w - 40, 500); text(d, cx, yy + i * 38, fs, SUB, 500, 'center', k2); });
}

function DRAW_ANIM(c, lt, W, H) {
  const v = H > W, R = v ? { x: 50, y: 230, w: W - 100, h: 1250 } : { x: 120, y: 90, w: W - 240, h: 820 }, cx = R.x + R.w / 2;
  if (c.id === 's_hook') {
    const m = ease(prog(lt, 1.5, 3.5)), cur = BEF_MB.map((b, i) => lerp(b, AFT_MB[i], m));
    text(m < .5 ? '줄이기 전' : '줄인 뒤', cx, R.y + 50, v ? 64 : 54, m < .5 ? INK : GREEN, 900, 'center', ap(lt, 0));
    if (v) grid6Vert(R.x + 20, R.y + 120, R.w - 40, 840, ap(lt, 0), lerp(1, .65, m), cur, m < .5 ? INK : GREEN);
    else grid6(R.x + 80, R.y + 100, 1100, 560, ap(lt, 0), lerp(1, .65, m), cur, m < .5 ? INK : GREEN);
    pill('합계 ' + lerp(R0.resize.before, R0.resize.after, m).toFixed(2) + 'MB', v ? cx : R.x + 630, v ? R.y + 1020 : R.y + 720, v ? 50 : 42, m < .5 ? GOLD : GREEN, ap(lt, 0));
    stamp(R0.resize.sec.toFixed(1) + '초', v ? cx : R.x + 1440, v ? R.y + 1160 : R.y + 350, ap(lt, 3.8, .5), GOLD, v ? 90 : 76);
  }
  if (c.id === 's_what') {
    text('sharp-cli', cx, R.y + (v ? 90 : 60), v ? 96 : 90, GOLD, 900, 'center', ap(lt, 0), MONO);
    text('사진 용량을 줄이는 무료 명령어 도구', cx, R.y + (v ? 200 : 150), v ? 46 : 44, INK, 800, 'center', ap(lt, 0));
    const k = ease(prog(lt, cs(c, 1), cs(c, 1) + 2.5)), px = v ? cx : cx - 380, py = R.y + (v ? 560 : 480), w = (v ? 640 : 560) * lerp(1, .7, k), h = w * .75;
    vacBag(px, py, w, h, k, ap(lt, cs(c, 1)), lt); pic('p4', px - w / 2, py - h / 2, w, h, ap(lt, 0));
    const k1 = ap(lt, cs(c, 1)); if (k1 > 0) { const x = v ? cx : cx + 380, y = R.y + (v ? 1020 : 440);
      box(x - 400, y - 120, 800, 240, 20, CARD, BLUE, k1, 3); text('① 접기: 크기 줄이기', x, y - 45, v ? 46 : 42, INK, 800, 'center', k1);
      text('② 공기 빼기: 화질 값', x, y + 45, v ? 46 : 42, GREEN, 800, 'center', k1 * ap(lt, cs(c, 1) + 1)); }
  }
  if (c.id === 's_fmt') {
    const rows = [{ name: 'JPG', v: FM.jpeg.total, lab: f2(FM.jpeg.total), col: BLUE }, { name: 'WebP', v: FM.webp.total, lab: f2(FM.webp.total), col: GREEN },
      { name: 'AVIF', v: FM.avif.total, lab: f2(FM.avif.total), col: GOLD }, { name: 'PNG', v: FM.png.total, lab: FM.png.total.toFixed(1), col: RED }];
    text('같은 6장 · 형식별 합계 (MB)', cx, R.y + 50, v ? 52 : 48, INK, 900, 'center', ap(lt, 0));
    hbars(R.x + (v ? -40 : 100), R.y + (v ? 160 : 140), v ? R.w + 40 : 1400, rows, ap(lt, 0), lt, .3, { max: 24, rh: v ? 190 : 130, fs: v ? 44 : 40, gap: .8 });
    const k1 = ap(lt, cs(c, 1)); if (k1 > 0) { box(cx - 420, R.y + (v ? 1000 : 680), 840, 120, 18, 'rgba(1,4,9,.94)', RED, k1, 3); text('PNG는 원본(16.5MB)보다 큼', cx, R.y + (v ? 1060 : 740), v ? 44 : 40, RED, 900, 'center', k1); }
  }
  if (c.id === 's_gps') {
    const off = ease(prog(lt, .8, 2));
    const pw = v ? 760 : 640, ph = pw * .75, px = v ? cx - pw / 2 : R.x + 40, py = R.y + (v ? 60 : 60);
    pic('p1', px, py, pw, ph, ap(lt, 0)); gpsTag(px + pw / 2, py + ph + 60, off < .5, ap(lt, 0) * (off < .5 ? 1 - off * 2 : (off - .5) * 2), v ? 36 : 32);
    const k1 = ap(lt, cs(c, 1)); if (k1 > 0) { const rx = v ? cx - 380 : R.x + 820, ry = R.y + (v ? 760 : 60);
      pic('rot_default', rx, ry, v ? 400 : 440, v ? 300 : 330, k1); cross(rx + (v ? 370 : 410), ry + 40, 80, k1 * ap(lt, cs(c, 1) + .8));
      pic('rot_auto', rx + (v ? 470 : 560), ry - (v ? 0 : 0), v ? 270 : 300, v ? 360 : 400, k1 * ap(lt, cs(c, 1) + 1.2)); check(rx + (v ? 700 : 820), ry + 40, 80, ease(prog(lt, cs(c, 1) + 1.6, cs(c, 1) + 2.3)));
      text('--autoOrient', rx + (v ? 605 : 710), ry + (v ? 410 : 450), v ? 40 : 36, GREEN, 900, 'center', k1 * ap(lt, cs(c, 1) + 1.2), MONO); }
  }
  if (c.id === 's_end') {
    box(cx - (v ? 470 : 600), R.y + (v ? 200 : 140), v ? 940 : 1200, v ? 330 : 280, 22, '#010409', LINE, ap(lt, 0), 2);
    text('npm install -g sharp-cli', cx, R.y + (v ? 300 : 230), v ? 50 : 54, GOLD, 600, 'center', ap(lt, 0), MONO);
    text('Node.js 먼저 설치', cx, R.y + (v ? 420 : 330), v ? 40 : 40, SUB, 800, 'center', ap(lt, 0));
    text('★★★½☆ (3.5)', cx, R.y + (v ? 700 : 560), v ? 90 : 80, GOLD, 900, 'center', ap(lt, .8));
  }
}
// 세로 화면용 6장 격자 (2열 × 3줄)
function grid6Vert(x, y, w, h, k, s, mbs, col) {
  const cw = w / 2, ch = h / 3;
  for (let i = 0; i < 6; i++) { const cx = x + (i % 2) * cw + cw / 2, cy = y + Math.floor(i / 2) * ch + ch / 2 - 20, pw = Math.min(cw - 40, (ch - 80) / .75) * s, ph = pw * .75;
    pic('p' + (i + 1), cx - pw / 2, cy - ph / 2, pw, ph, k); text(f2(mbs[i]) + 'MB', cx, cy + ph / 2 + 30, 36, col, 900, 'center', k); }
}
