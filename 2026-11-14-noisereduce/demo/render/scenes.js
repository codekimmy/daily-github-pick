// 장면 그리기. 장(c)의 자막 시작 시각(c.cues[i][0])에 맞춰 화면 요소가 하나씩 나타난다 → 다 나타난 뒤 자막 길이(최소 3초)만큼 멈춤
// 그림 자료: data.js (WAVE = 파형 크기, RES = results.json), img/*.png (스펙트로그램 띠 — 실제 시연 결과 소리로 그림)
const cs = (c, i) => c.cues[Math.min(i, c.cues.length - 1)][0];
const ap = (lt, t, d = .7) => out3(prog(lt, t, t + d));
const C = RES.cases, F1 = C['선풍기'], DEF = '기본(stationary=False)';
const f1 = x => x.toFixed(1);

// 스펙트로그램 띠 (밝을수록 큰 소리)
function spec(key, x, y, w, h, a = 1, label, color = INK) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; rr(x, y, w, h, 12); ctx.clip(); ctx.drawImage(IMG[key], x, y, w, h); ctx.restore();
  box(x, y, w, h, 12, null, LINE, a, 2);
  if (label) text(label, x + 16, y - 24, 28, color, 800, 'left', a);
}
// 앞 그림(A) 위로 뒤 그림(B)이 왼쪽부터 덮이며 '거름망'이 지나감
function wipe(A, B, x, y, w, h, k, a = 1) {
  spec(A, x, y, w, h, a); if (k <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; rr(x, y, w * k, h, 12); ctx.clip(); ctx.drawImage(IMG[B], x, y, w, h); ctx.restore();
  if (k < 1) { const sx = x + w * k; box(sx - 3, y - 10, 6, h + 20, 3, GREEN, null, a); pill('거름망', sx, y - 34, 24, GREEN, a); }
}
// 파형 (위아래 대칭 막대)
function wave(arr, x, y, w, h, color, a = 1, k = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = color; const n = arr.length, bw = w / n;
  for (let i = 0; i < n * k; i++) { const v = Math.min(1, arr[i] / .55) * h / 2; ctx.fillRect(x + i * bw, y - v, Math.max(1, bw * .8), v * 2 + 1); }
  ctx.restore();
}
// dB 막대 (−80 dB = 0, −20 dB = 꽉 참)
function dbBar(x, y, w, h, db, color, k, lab, a = 1, vertical = true) {
  const r = clamp((db + 80) / 60) * k;
  if (vertical) { box(x, y + h - h * r, w, h * r, 8, color, null, a); text(f1(db) + ' dB', x + w / 2, y + h - h * r - 26, 26, INK, 800, 'center', a * k);
    if (lab) text(lab, x + w / 2, y + h + 34, fit(lab, 26, w + 60), SUB, 700, 'center', a); }
  else { box(x, y, w, h, 8, '#21262d', null, a); box(x, y, w * r, h, 8, color, null, a); text(f1(db) + ' dB', x + w * r + 14, y + h / 2, 28, INK, 800, 'left', a * k); }
}
function counter(v, t0, lt, dur = 1.6) { return v * ease(prog(lt, t0, t0 + dur)); }

// ───── 공용 장면 (가로·세로)
function sceneHook(c, lt, R, opt = {}) {
  const v = R.h > R.w, cx = R.x + R.w / 2, a0 = ap(lt, 0);
  const sh = v ? 300 : 260, sy = R.y + (v ? 180 : 120);
  text('가상 회의 녹음 · 선풍기 잡음 섞임', cx, R.y + (v ? 80 : 40), v ? 44 : 38, RED, 900, 'center', a0);
  const k = ease(prog(lt, opt.w ?? 2, (opt.w ?? 2) + (opt.wd ?? 3)));
  wipe('noisy', 'def', R.x, sy, R.w, sh, k, a0);
  const a2 = ap(lt, (opt.w ?? 2) + (opt.wd ?? 3));
  text('noisereduce 기본 설정 · 0.32초', cx, sy + sh + (v ? 70 : 55), v ? 46 : 40, GREEN, 900, 'center', a2);
  const a3 = ap(lt, opt.n ?? 6.5), by = sy + sh + (v ? 170 : 120);
  if (v) { dbBar(R.x + 80, by, R.w - 360, 70, F1.before.quiet_db, RED, a3, '', a3, false); dbBar(R.x + 80, by + 110, R.w - 360, 70, F1.runs[DEF].quiet_db, GREEN, ap(lt, (opt.n ?? 6.5) + .9), '', ap(lt, (opt.n ?? 6.5) + .9), false);
    text('말 없는 구간 잡음 크기', cx, by + 240, 36, SUB, 700, 'center', a3); }
  else { text('말 없는 구간 잡음', R.x + 20, by + 35, 34, SUB, 700, 'left', a3); dbBar(R.x + 360, by, 560, 70, F1.before.quiet_db, RED, a3, '', a3, false);
    dbBar(R.x + 1100, by, 520, 70, F1.runs[DEF].quiet_db, GREEN, ap(lt, (opt.n ?? 6.5) + .9), '', ap(lt, (opt.n ?? 6.5) + .9), false); text('→', R.x + 1050, by + 35, 50, SUB, 900, 'center', a3); }
}
function sceneSpeech(c, lt, R, st) { // 말소리 크기 막대 5개
  const items = [[RES.clean.speech_db, '#9aa7b8', '깨끗한 원본'], [F1.before.speech_db, RED, '잡음 섞인 녹음'], [F1.runs[DEF].speech_db, BLUE, '기본 설정'],
    [F1.runs['덜 지우기 0.5'].speech_db, PURPLE, '세기 0.5'], [F1.runs['잡음 견본 지정'].speech_db, GREEN, '잡음 견본 지정']];
  const n = items.length, gap = R.w / n, bw = Math.min(170, gap * .6), h = R.h - 120;
  items.forEach((it, i) => { const k = ap(lt, st[i]); if (k <= 0) return; dbBar(R.x + gap * i + (gap - bw) / 2, R.y + 40, bw, h, it[0], it[1], k, it[2], k); });
  const ky = R.y + 40 + h - h * clamp((RES.clean.speech_db + 80) / 60), k0 = ap(lt, st[0]);
  ctx.save(); ctx.globalAlpha = k0 * .8; ctx.setLineDash([10, 8]); ctx.strokeStyle = SUB; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(R.x, ky); ctx.lineTo(R.x + R.w, ky); ctx.stroke(); ctx.restore();
}
function sceneNoise4(c, lt, R, st, v) { // 잡음 4가지 전/후
  const names = [['선풍기', '선풍기 웅웅'], ['쉬소리', "녹음기 '쉬~'"], ['키보드', '키보드 딸깍'], ['옆사람말', '옆자리 말소리']];
  names.forEach(([n, lab], i) => { const k = ap(lt, st[i]); if (k <= 0) return; const b = C[n].before.quiet_db, d = C[n].runs[DEF].quiet_db;
    if (v) { const y = R.y + i * (R.h / 4); text(lab, R.x, y + 20, 40, INK, 900, 'left', k); dbBar(R.x, y + 60, R.w - 220, 50, b, RED, k, '', k, false);
      dbBar(R.x, y + 125, R.w - 220, 50, d, GREEN, ap(lt, st[i] + .8), '', ap(lt, st[i] + .8), false);
      text(Math.round(b - d) + 'dB↓', R.x + R.w, y + 20, 40, b - d > 15 ? GREEN : GOLD, 900, 'right', ap(lt, st[i] + .8)); }
    else { const gw = R.w / 4, x = R.x + i * gw, bw = 120, h = R.h - 170;
      dbBar(x + gw / 2 - bw - 8, R.y + 60, bw, h, b, RED, k, '', k); dbBar(x + gw / 2 + 8, R.y + 60, bw, h, d, GREEN, ap(lt, st[i] + .8), '', ap(lt, st[i] + .8));
      text(lab, x + gw / 2, R.y + h + 100, 34, INK, 900, 'center', k); text(Math.round(b - d) + 'dB↓', x + gw / 2, R.y + 10, 40, b - d > 15 ? GREEN : GOLD, 900, 'center', ap(lt, st[i] + .8)); } });
}
function endCard(c, lt, R, big = 64) {
  const cx = R.x + R.w / 2, k = ap(lt, 0), v = R.h > R.w;
  text('noisereduce · 녹음 잡음 줄이기', cx, R.y + R.h * (v ? .3 : .28), big * .8, BLUE, 900, 'center', k);
  const L = wrap('다음에 또 멋진 오픈소스 소개하겠습니다!', R.w - 80, big, 900);
  L.forEach((l, i) => text(l, cx, R.y + R.h * (v ? .42 : .45) + i * big * 1.3, big, INK, 900, 'center', k));
  const k2 = ap(lt, .8), yy = R.y + R.h * (v ? .78 : .8);
  DISCLAIMER.forEach((d, i) => { const fs = fit(d, 24, R.w - 40, 500); text(d, cx, yy + i * 38, fs, SUB, 500, 'center', k2); });
}

// ───── 롱폼 (1920×1080)
const LR = { x: 120, y: 120, w: 1680, h: 790 };
function code(lines, x, y, w, a, size = 34) { box(x, y, w, lines.length * size * 1.6 + 40, 16, '#010409', LINE, a); lines.forEach((l, i) => text(l, x + 30, y + 40 + i * size * 1.6, size, l.startsWith('::') ? SUB : GREEN, 600, 'left', a, MONO)); }
const DRAW_LONG = {
  preview(c, lt) { sceneHook(c, lt, LR, { w: cs(c, 1), wd: 3, n: cs(c, 2) }); },
  title(c, lt) {
    const k = ap(lt, 0); pill('오늘의 오픈소스', 960, 220, 34, BLUE, k); text('noisereduce', 960, 360, 140, INK, 900, 'center', k);
    text('github.com/timsainb/noisereduce · MIT · ⭐ 1,885', 960, 470, 32, SUB, 600, 'center', k);
    const k1 = ap(lt, cs(c, 1)); text('일반인 쓸모 ★★★☆☆ (3)', 960, 600, 64, GOLD, 900, 'center', k1);
    const k2 = ap(lt, cs(c, 2)); text('녹음 속 바탕 잡음을 줄여 주는 무료 파이썬 프로그램', 960, 720, 44, INK, 800, 'center', k2);
  },
  what(c, lt) {
    const k0 = ap(lt, 0); text("비유: 잡음 모양을 재서 걸러 내는 '소리 거름망'", 960, 150, 48, GREEN, 900, 'center', k0);
    // 1단계: 높낮이 칸 (가로 줄), 2단계: 칸마다 잡음 높이(빨간 선), 3단계: 넘는 것만 남김
    const x = 260, y = 250, w = 1400, rows = 8, rh = 52, k1 = ap(lt, cs(c, 1));
    for (let r = 0; r < rows; r++) { box(x, y + r * rh, w, rh - 8, 8, '#1b222c', LINE, k1, 1); text(['높은 소리', '', '', '', '', '', '', '낮은 소리'][r], x - 20, y + r * rh + rh / 2 - 4, 22, SUB, 700, 'right', k1); }
    const k2 = ap(lt, cs(c, 2)), k3 = ap(lt, cs(c, 3));
    for (let r = 0; r < rows; r++) { const yy = y + r * rh, nl = .18 + .05 * Math.sin(r * 1.3) + (r > 5 ? .12 : 0);
      for (let j = 0; j < 40; j++) { const cx2 = x + 10 + j * 34.5, sp = (j % 9 > 2 && j % 9 < 7 && r > 1 && r < 7) ? .55 + .3 * Math.sin(j + r) : 0, nz = nl * (.6 + .4 * Math.abs(Math.sin(j * 7.1 + r * 3.3)));
        const val = Math.max(sp, nz), keep = val > nl * 1.05, al = keep ? 1 : lerp(1, .12, k3);
        box(cx2, yy + (rh - 8) * (1 - val), 26, (rh - 8) * val, 3, keep ? GOLD : RED, null, k1 * al); }
      box(x, yy + (rh - 8) * (1 - nl) - 1, w, 3, 1, '#ffffff', null, k2 * .8); }
    text('흰 선 = 칸마다 잰 잡음 크기', x, y + rows * rh + 20, 28, INK, 700, 'left', k2);
    text('빨강 = 잡음 → 작게 · 노랑 = 말소리 → 남김', x + w, y + rows * rh + 20, 28, GOLD, 700, 'right', k3);
    const k4 = ap(lt, cs(c, 4)); text('Tim Sainburg · 2019년 공개 · MIT 라이선스 · ⭐ 1,885 · 최신 3.0.3', 960, 790, 32, SUB, 700, 'center', k4);
    const k5 = ap(lt, cs(c, 5)); pill('AI 모델 내려받기 없음 · 계산만으로 작동', 960, 860, 30, BLUE, k5);
  },
  install(c, lt) {
    const k0 = ap(lt, 0); code([':: 0) 파이썬 3 설치 (python.org, "Add python.exe to PATH" 체크)', 'python --version', ':: 1) 설치 — 녹음 파일을 읽고 쓰는 soundfile도 함께', 'pip install noisereduce soundfile'], 160, 140, 1600, k0, 32);
    const k2 = ap(lt, cs(c, 2)); [['설치 시간', '29.5초', GREEN], ['함께 설치되는 프로그램 포함', '약 266MB', GOLD], ['noisereduce 자체', '88KB', BLUE]].forEach((r, i) => {
      const kk = ap(lt, cs(c, 2) + i * .9) * (i === 2 ? ap(lt, cs(c, 3)) : 1), x = 160 + i * 540; box(x, 480, 500, 170, 20, CARD, r[2], kk, 3);
      text(r[0], x + 250, 530, fit(r[0], 30, 460), SUB, 700, 'center', kk); text(r[1], x + 250, 600, 60, r[2], 900, 'center', kk); });
    text('(numpy · scipy · matplotlib 등)', 160 + 540 + 250, 680, 24, SUB, 600, 'center', ap(lt, cs(c, 2) + .9));
    const k4 = ap(lt, cs(c, 4)); box(160, 740, 1600, 110, 18, 'rgba(242,193,78,.10)', GOLD, k4, 2);
    text('바로 쓰는 명령어 없음 → 예제 파일 잡음제거.py (demo 폴더)', 960, 795, 38, GOLD, 800, 'center', k4);
  },
  usage(c, lt) {
    const k0 = ap(lt, 0); code(['C:\\녹음> python 잡음제거.py 회의녹음.wav', '회의녹음.wav → 회의녹음_잡음제거.wav  (28.0초 녹음, 0.36초 걸림)'], 160, 140, 1600, k0, 32);
    const k1 = ap(lt, cs(c, 1)); ['회의녹음.wav  (원본 그대로)', '회의녹음_잡음제거.wav  (새 파일)'].forEach((s, i) => { box(160 + i * 820, 330, 780, 90, 14, CARD, i ? GREEN : LINE, k1, 3); text(s, 200 + i * 820, 375, 32, i ? GREEN : INK, 800, 'left', k1); });
    [[2, '--견본 1.4', '맨 앞 1.4초를 잡음 견본으로 (조용한 구간이 있을 때)'], [3, '--세기 0.8', '잡음을 얼마나 지울지 0.0~1.0 (기본 1.0)']].forEach(([i, o, d], j) => {
      const k = ap(lt, cs(c, i)), y = 470 + j * 130; box(160, y, 1600, 110, 16, CARD, BLUE, k, 2); text(o, 200, y + 55, 40, BLUE, 900, 'left', k, MONO); text(d, 560, y + 55, 34, INK, 700, 'left', k); });
    const k4 = ap(lt, cs(c, 4)); box(160, 740, 1600, 120, 16, 'rgba(126,231,135,.10)', GREEN, k4, 2);
    text('잡음제거.bat 위에 녹음 파일을 끌어다 놓기 → 같은 폴더에 결과 저장', 960, 785, 36, GREEN, 800, 'center', k4); text('(Windows 실행 확인 전 · 같은 폴더에 잡음제거.py 필요)', 960, 835, 26, SUB, 600, 'center', k4);
  },
  demo1(c, lt) {
    const k0 = ap(lt, 0); text('합성 말소리 28초 + 직접 만든 선풍기 잡음 (가상 녹음)', 960, 140, 40, INK, 900, 'center', k0);
    const k1 = ap(lt, cs(c, 1)), x = 160, w = 1600, y = 230, h = 330;
    wipe('noisy', 'def', x, y, w, h, ease(prog(lt, cs(c, 3), cs(c, 3) + 3)), k1);
    text('높은 소리', x - 14, y + 20, 22, SUB, 700, 'right', k1); text('낮은 소리', x - 14, y + h - 20, 22, SUB, 700, 'right', k1);
    const k2 = ap(lt, cs(c, 2)) * (1 - ap(lt, cs(c, 3), .5)); box(x, y + h - 40, w, 40, 6, null, RED, k2, 4); text('← 선풍기 띠 · 바탕 점무늬도 잡음', x + w / 2, y + h + 40, 32, RED, 800, 'center', k2);
    const k3 = ap(lt, cs(c, 3) + 3); text('기본 설정 · ' + F1.runs[DEF].sec.toFixed(2) + '초', 960, y + h + 40, 36, GREEN, 900, 'center', k3);
    const k4 = ap(lt, cs(c, 4)); text('말 없는 구간 잡음', 160, 720, 34, SUB, 700, 'left', k4);
    dbBar(500, 690, 520, 64, F1.before.quiet_db, RED, k4, '', k4, false); dbBar(1180, 690, 520, 64, F1.runs[DEF].quiet_db, GREEN, ap(lt, cs(c, 4) + .9), '', ap(lt, cs(c, 4) + .9), false);
    const k5 = ap(lt, cs(c, 5)); box(x, y, 90, h, 10, null, GOLD, k5, 4); box(x + w - 70, y, 70, h, 10, null, GOLD, k5, 4);
    text('맨 앞·맨 끝 1초 남짓: 옅은 잡음이 남음', 960, 840, 36, GOLD, 800, 'center', k5);
  },
  demo2(c, lt) {
    text('말하는 구간 소리 크기 (선풍기 잡음 녹음)', 960, 140, 40, INK, 900, 'center', ap(lt, 0));
    sceneSpeech(c, lt, { x: 200, y: 170, w: 1520, h: 600 }, [cs(c, 1), cs(c, 1) + .8, cs(c, 2), cs(c, 4) + 1.2, cs(c, 3)]);
    const k4 = ap(lt, cs(c, 4)); text('잡음: 기본 ' + f1(F1.runs[DEF].quiet_db) + ' dB · 견본 지정 ' + f1(F1.runs['잡음 견본 지정'].quiet_db) + ' dB → 비슷하게 줄어듦', 960, 830, 32, GREEN, 800, 'center', k4);
    const k5 = ap(lt, cs(c, 5)); pill('녹음 시작 뒤 2초쯤 조용히 → 견본으로 쓰기', 960, 890, 30, GOLD, k5);
  },
  demo3(c, lt) {
    const k0 = ap(lt, 0); text('같은 말소리 + 잡음 4가지 · 말 없는 구간 잡음 (빨강 → 초록, 기본 설정)', 960, 140, 36, INK, 900, 'center', k0);
    sceneNoise4(c, lt, { x: 160, y: 190, w: 1600, h: 600 }, [cs(c, 1), cs(c, 2), cs(c, 3), cs(c, 4)], false);
    const k5 = ap(lt, cs(c, 5)); box(160, 860, 1600, 70, 14, 'rgba(242,193,78,.10)', GOLD, k5, 2); text('늘 같은 소리 → 크게 줄어듦 · 갑자기 나는 소리·말소리 → 덜 줄어듦', 960, 895, 32, GOLD, 800, 'center', k5);
  },
  demo4(c, lt) {
    text('--세기 (prop_decrease) 값별 결과 · 선풍기 잡음 녹음', 960, 140, 38, INK, 900, 'center', ap(lt, 0));
    const rows = [['1.0 (기본)', DEF], ['0.8', '덜 지우기 0.8'], ['0.5', '덜 지우기 0.5']];
    text('잡음 (낮을수록 조용)', 760, 220, 28, RED, 800, 'center', ap(lt, cs(c, 1))); text('말소리 (원본 -23.8 dB)', 1430, 220, 28, BLUE, 800, 'center', ap(lt, cs(c, 1)));
    rows.forEach(([lab, key], i) => { const k = ap(lt, cs(c, i + 1)), y = 270 + i * 150, r = F1.runs[key];
      text('세기 ' + lab, 180, y + 35, 40, GOLD, 900, 'left', k); dbBar(520, y, 480, 70, r.quiet_db, RED, k, '', k, false); dbBar(1180, y, 480, 70, r.speech_db, BLUE, k, '', k, false); });
    const k4 = ap(lt, cs(c, 4)); text('세기 ↓ = 잡음은 더 남고, 말소리는 덜 작아짐', 960, 760, 40, INK, 900, 'center', k4);
    const k5 = ap(lt, cs(c, 5)); text('알맞은 값은 직접 들어 보고 고르시기 바랍니다', 960, 840, 34, SUB, 700, 'center', k5);
  },
  demo5(c, lt) {
    text('긴 녹음 처리 시간 (CPU 2개 클라우드, 그래픽카드 없음)', 960, 150, 38, INK, 900, 'center', ap(lt, 0));
    [[1, '10분 녹음', RES.long['10분 기본'], RES.long['10분 고정 잡음']], [2, '60분 녹음', RES.long['60분 기본'], RES.long['60분 고정 잡음']]].forEach(([i, lab, v, v2], j) => {
      const t = cs(c, i), k = ap(lt, t), x = 220 + j * 780; box(x, 250, 700, 380, 26, CARD, GREEN, k, 3); text(lab, x + 350, 320, 44, SUB, 800, 'center', k);
      text(counter(v, t + .3, lt).toFixed(1) + '초', x + 350, 450, 130, GREEN, 900, 'center', k);
      text('고정 잡음 설정: ' + v2.toFixed(1) + '초', x + 350, 570, 34, INK, 700, 'center', ap(lt, cs(c, 3))); });
    const k4 = ap(lt, cs(c, 4)); text('28초 녹음은 0.23~0.32초 · 측정 코드 demo/test_all.py', 960, 730, 34, SUB, 700, 'center', k4);
  },
  cons(c, lt) {
    const k0 = ap(lt, 0); text('아쉬운 점', 960, 150, 56, INK, 900, 'center', k0);
    const items = [['바뀌는 잡음', '옆자리 말소리·키보드는 8dB 정도만 줄어듦', RED], ['말소리도 작아짐', '기본 설정 약 9dB ↓ → 견본·세기로 조절', GOLD],
      ['명령어 없음', '화면 프로그램·명령어 없이 파이썬 예제 파일 필요', BLUE], ['시연 범위', '합성 말소리로 시연 · 실제 사람 목소리는 확인 전', SUB]];
    items.forEach((it, i) => { const k = ap(lt, cs(c, i + 1)), y = 240 + i * 160; box(200, y, 1520, 130, 20, CARD, it[2], k, 3);
      text((i + 1) + '. ' + it[0], 250, y + 65, 42, it[2], 900, 'left', k); text(it[1], 700, y + 65, fit(it[1], 36, 980), INK, 700, 'left', k); });
  },
  summary(c, lt) {
    const k0 = ap(lt, 0); text('noisereduce 정리', 960, 160, 56, INK, 900, 'center', k0);
    const items = [["선풍기·에어컨·'쉬~'", '늘 깔린 잡음에 알맞음', GREEN], ['처리 시간', '28초 → 0.32초 · 60분 → 19.9초', BLUE], ['녹음 앞 2초 조용히', '--견본으로 말소리 지키기', GOLD], ['원본 보관', '결과는 직접 들어 보고 확인', PURPLE]];
    items.forEach((it, i) => { const t = cs(c, i + 1), k = ap(lt, t), y = 260 + i * 150; box(200, y, 1520, 120, 20, CARD, it[2], k, 3);
      check(290, y + 60, 70, prog(lt, t + .2, t + 1), it[2], k); text(it[0], 360, y + 60, 42, it[2], 900, 'left', k); text(it[1], 900, y + 60, 40, INK, 800, 'left', k); });
  },
  end(c, lt) { endCard(c, lt, { x: 0, y: 60, w: 1920, h: 900 }, 72); },
};

// ───── 과정 애니메이션 (숏폼 대본, 가로·세로 공용)
function DRAW_ANIM(c, lt, W, H) {
  const v = H > W, R = v ? { x: 60, y: 260, w: W - 120, h: 1250 } : { x: 120, y: 110, w: W - 240, h: 800 }, cx = R.x + R.w / 2;
  if (c.id === 's_hook') sceneHook(c, lt, R, { w: 1.5, wd: 3, n: 5 });
  if (c.id === 's_wipe') { const sh = v ? 260 : 230, a = ap(lt, 0);
    spec('noisy', R.x, R.y + 60, R.w, sh, a, '잡음 섞인 녹음', RED); spec('def', R.x, R.y + 60 + sh + 90, R.w, sh, a, 'noisereduce 기본 설정 후', GREEN);
    const k = ap(lt, cs(c, 0) + .5), y = R.y + 60 + 2 * sh + 140;
    text('말 없는 구간 잡음 ' + f1(F1.before.quiet_db) + ' → ' + f1(F1.runs[DEF].quiet_db) + ' dB', cx, y, fit('말 없는 구간 잡음 -29.0 → -58.1 dB', v ? 54 : 48, R.w), GOLD, 900, 'center', k);
    const k2 = ap(lt, cs(c, 1)); text('noisereduce', cx, y + (v ? 130 : 90), v ? 90 : 64, INK, 900, 'center', k2); text('무료 · MIT · 파이썬', cx, y + (v ? 220 : 150), 34, SUB, 700, 'center', k2); }
  if (c.id === 's_sample') sceneSpeech(c, lt, { x: R.x, y: R.y + (v ? 100 : 20), w: R.w, h: v ? 900 : 680 }, [0, .8, cs(c, 0) + .8, cs(c, 1) + 2, cs(c, 1) + .8]);
  if (c.id === 's_weak') { text('잡음 종류별 (기본 설정)', cx, R.y + 20, v ? 44 : 36, SUB, 800, 'center', ap(lt, 0)); sceneNoise4(c, lt, { x: R.x, y: R.y + (v ? 110 : 70), w: R.w, h: v ? 1000 : 640 }, [.3, 1.2, 2.1, 3.0], v); }
  if (c.id === 's_end') { const a = ap(lt, 0);
    box(R.x + (v ? 0 : 200), R.y + 40, R.w - (v ? 0 : 400), 320, 26, CARD, GREEN, a, 3); text('60분 녹음', cx, R.y + 120, 44, SUB, 800, 'center', a);
    text(counter(RES.long['60분 기본'], .3, lt).toFixed(1) + '초', cx, R.y + 250, v ? 140 : 120, GREEN, 900, 'center', a);
    const k2 = ap(lt, cs(c, 0) + 3); text('일반인 쓸모 ★★★☆☆ (3)', cx, R.y + (v ? 520 : 480), v ? 64 : 56, GOLD, 900, 'center', k2);
    text('pip install noisereduce soundfile', cx, R.y + (v ? 640 : 580), fit('pip install noisereduce soundfile', 40, R.w), BLUE, 600, 'center', k2, MONO); }
}
