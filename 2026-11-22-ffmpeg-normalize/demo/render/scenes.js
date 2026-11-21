// 장면 그리기. 장(c)의 자막 시작 시각(c.cues[i][0])에 맞춰 화면 요소가 하나씩 나타난다 → 다 나타난 뒤 자막 길이(최소 3초)만큼 멈춤
// 숫자: data.js (RES = 2026-11-22 시연 측정값, demo/results.json) · 파형: 시연용 가상 녹음 4개의 전·후·최고점 맞춤 결과(막대 96개)
// 연출(tools/kit/README.md): 도장 배지, 설정별 막대 비교 + 새 연출 '음량 계기판 줄 맞추기'(meters: 세로 막대가 목표선 -23으로 모임)·'지휘자'(conductor)
const cs = (c, i) => c.cues[Math.min(i, c.cues.length - 1)][0];
const ap = (lt, t, d = .7) => out3(prog(lt, t, t + d));
const R0 = RES, IMG_READY = Promise.resolve();
const FCOL = [BLUE, GREEN, GOLD, PURPLE], FNAME = ['회의 녹음', '강의 녹음', '인터뷰', '배경음악'];
const BEF = R0.before.map(b => b.lufs), AFT = R0.basic.files.map(b => b.lufs), PK = R0.peak.files.map(b => b.lufs), YT = R0.yt14.files.map(b => b.lufs);
const stamp = (s, x, y, k, color = GOLD, size = 48, rot = -7) => KIT.stamp(ctx, s, x, y, k, color, size, rot);
const f1 = v => v.toFixed(1);

// ── 새 연출 '음량 계기판 줄 맞추기': LUFS 값(-50~0)을 세로 막대로. vals 배열이 바뀌면 막대가 미끄러지듯 바뀜. target이 있으면 점선
function meters(x, y, w, h, vals, k, opt = {}) {
  const n = vals.length, gap = opt.gap || 40, bw = (w - gap * (n - 1)) / n, lo = -50, fs = opt.fs || 30;
  const Y = v => y + h - h * clamp((v - lo) / (0 - lo));
  box(x - 20, y - 10, w + 40, h + 20, 14, 'rgba(255,255,255,.03)', LINE, k, 2);
  if (opt.scale !== false) [0, -10, -20, -30, -40, -50].forEach(v => { text(String(v), x - 34, Y(v), 20, SUB, 600, 'right', k * .8, MONO); ctx.save(); ctx.globalAlpha = ctx.globalAlpha * k * .25; ctx.fillStyle = SUB; ctx.fillRect(x - 20, Y(v), w + 40, 1); ctx.restore(); });
  vals.forEach((v, i) => {
    const a = k * (opt.stagger ? ap(opt.lt, opt.t0 + i * .8) : 1); if (a <= 0) return;
    const bx = x + i * (bw + gap), col = (opt.cols || FCOL)[i], top = Y(v);
    box(bx, top, bw, y + h - top, 10, col, null, a * .9);
    text(opt.label ? opt.label(v, i) : f1(v), bx + bw / 2, top - fs * .9, fs, col, 900, 'center', a, F);
    if (opt.names !== false) text((opt.names || FNAME)[i], bx + bw / 2, y + h + fs * 1.2, fs * .9, INK, 800, 'center', a);
  });
  if (opt.target != null) { const ty = Y(opt.target), ka = k * (opt.tk == null ? 1 : opt.tk); if (ka > 0) {
    ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.moveTo(x - 20, ty); ctx.lineTo(x + w + 20, ty); ctx.stroke(); ctx.restore();
    const ps = '목표 ' + opt.target + ' LUFS', pw = tw(ps, 22, 800) + 31, tp = opt.tpos || 'right';
    if (tp === 'right') pill(ps, x + w + 30 + pw / 2, ty, 22, RED, ka); else if (tp === 'below') pill('빨간 점선 = ' + ps, x + w / 2, y + h + fs * 2.8, 26, RED, ka); } }
}
const mix = (A, B, m) => A.map((v, i) => lerp(v, B[i], m));
// 파형 막대(앞 96칸) — 0~1 = 가장 큰 소리(0 dB) 기준
function wv(arr, x, y, w, h, k, col, lab = '', a = 1, sub = '') {
  if (a <= 0) return; box(x, y, w, h, 12, CARD, LINE, a, 2); const n = arr.length, bw = (w - 40) / n;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col;
  for (let i = 0; i < n * k; i++) { const v = Math.min(1, arr[i]) * (h - 24) / 2; ctx.fillRect(x + 20 + i * bw, y + h / 2 - v, Math.max(2, bw - 2), Math.max(1, v * 2)); }
  ctx.restore(); if (lab) text(lab, x - 20, y + h / 2, 30, col, 800, 'right', a); if (sub) text(sub, x + w + 20, y + h / 2, 30, INK, 900, 'left', a);
}
// ── 새 연출 '지휘자': 막대 인물 + 지휘봉(흔들림)
function conductor(x, y, s, t, a = 1, col = INK) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = s * .07; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(x, y - s * .75, s * .17, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x, y - s * .55); ctx.lineTo(x, y + s * .05); ctx.moveTo(x, y + s * .05); ctx.lineTo(x - s * .2, y + s * .5); ctx.moveTo(x, y + s * .05); ctx.lineTo(x + s * .2, y + s * .5); ctx.stroke();
  const sw = Math.sin(t * 3) * .35, hx = x + s * .35, hy = y - s * .35 + Math.cos(t * 3) * s * .05;
  ctx.beginPath(); ctx.moveTo(x, y - s * .4); ctx.lineTo(x - s * .3, y - s * .2); ctx.moveTo(x, y - s * .4); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.strokeStyle = GOLD; ctx.lineWidth = s * .03; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + Math.cos(-.9 + sw) * s * .45, hy + Math.sin(-.9 + sw) * s * .45); ctx.stroke(); ctx.restore();
}
function hbar(x, y, w, h, val, max, col, k, lab, valLab, a = 1, fs = 30) {
  if (a <= 0) return; text(lab, x - 20, y + h / 2, fs, INK, 700, 'right', a);
  box(x, y, w, h, 10, 'rgba(255,255,255,.06)', null, a); const bw = Math.max(12, w * Math.min(1, val / max) * k); box(x, y, bw, h, 10, col, null, a);
  text(valLab, x + bw + 16, y + h / 2, fs, col, 900, 'left', a * Math.min(1, k * 2));
}
function rows(c, lt, R, items, opt = {}) {
  const n = items.length, gap = opt.gap || 18, h = Math.min(opt.h || 120, (R.h - gap * (n - 1)) / n), y0 = R.y + (R.h - (h * n + gap * (n - 1))) / 2;
  items.forEach(([s, col, mono], i) => {
    const k = ap(lt, cs(c, i + (opt.off || 0))), y = y0 + i * (h + gap) + (1 - k) * 20;
    box(R.x, y, R.w, h, 16, CARD, col || LINE, k, 3); ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = col || BLUE; ctx.fillRect(R.x, y + 12, 8, h - 24); ctx.restore();
    const fs = fit(s, opt.fs || 40, R.w - 80, 700); text(s, R.x + 40, y + h / 2, fs, INK, 700, 'left', k, mono ? MONO : F);
  });
}
function term(x, y, w, h, lines, k, a = 1, fs = 26) {
  if (a <= 0) return; box(x, y, w, h, 14, '#05070c', LINE, a, 2); [RED, GOLD, GREEN].forEach((c, i) => { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 26 + i * 26, y + 24, 7, 0, 7); ctx.fill(); ctx.restore(); });
  lines.forEach(([s, col], i) => { if (i >= k) return; const part = i + 1 > k ? s.slice(0, Math.floor(s.length * (k - i))) : s;
    text(part, x + 24, y + 70 + i * fs * 1.5, fit(s, fs, w - 48, 600), col || INK, 600, 'left', a, MONO); });
}
// 가상 발표 영상 카드
function videoCard(x, y, w, a = 1) { const h = w * 9 / 16; box(x, y, w, h, 12, '#1f6feb', '#ffffff55', a, 3); text('가상 발표 영상', x + w / 2, y + h / 2, w * .075, '#fff', 900, 'center', a);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x, y + h - 36, w, 36); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x + 18, y + h - 28); ctx.lineTo(x + 34, y + h - 18); ctx.lineTo(x + 18, y + h - 8); ctx.fill(); ctx.restore(); }
const LR = { x: 60, y: 120, w: 1800, h: 800 };

const DRAW_LONG = {
  preview(c, lt) {
    const m = ease(prog(lt, cs(c, 1) + .3, cs(c, 1) + 2.3)), k0 = ap(lt, 0);
    text(m < .5 ? '맞추기 전: 소리 크기 제각각' : '맞춘 뒤: 모두 -23 LUFS 근처', 680, 150, 44, m < .5 ? INK : GREEN, 900, 'center', k0);
    meters(200, 230, 960, 560, mix(BEF, AFT, m), k0, { target: -23, tk: ap(lt, cs(c, 1)) });
    stamp(R0.basic.sec + '초', 1580, 300, ap(lt, cs(c, 1) + 2.4, .5), GOLD, 64);
    const k2 = ap(lt, cs(c, 2)); if (k2 > 0) { box(1400, 470, 440, 300, 20, CARD, GREEN, k2, 3); text('가장 큰 − 가장 작은', 1620, 520, 30, SUB, 700, 'center', k2);
      text('32.0', 1620, 600, 64, RED, 900, 'center', k2); text('↓', 1620, 655, 40, SUB, 900, 'center', k2); text('0.4', 1620, 720, 64, GREEN, 900, 'center', k2); }
  },
  title(c, lt) {
    const k = ap(lt, 0), m = ease(prog(lt, .5, 2.5));
    meters(760, 110, 400, 220, mix(BEF, AFT, m), k, { names: false, scale: false, label: () => '', gap: 30 });
    text('ffmpeg-normalize', 960, 440, 110, GOLD, 900, 'center', k, MONO);
    text('에프에프엠펙 노멀라이즈 · 소리 크기 지휘자', 960, 550, 46, SUB, 700, 'center', k);
    text('일반인 쓸모 ★★★☆☆ (3)', 960, 650, 66, GOLD, 900, 'center', ap(lt, cs(c, 1)));
    text('녹음·영상 여러 개의 소리 크기를 한 번에 맞추는 무료 도구', 960, 750, 42, INK, 700, 'center', ap(lt, cs(c, 2)));
  },
  what(c, lt) {
    const k0 = ap(lt, 0), k1 = ap(lt, cs(c, 1)), k2 = ap(lt, cs(c, 2)), k3 = ap(lt, cs(c, 3)), k4 = ap(lt, cs(c, 4));
    const f = 1 - ap(lt, cs(c, 3) - .6, .6);
    conductor(260, 520, 360, lt, k0 * f); text('소리 크기 지휘자', 260, 820, 38, GOLD, 900, 'center', k0 * f);
    // 1단계: 파형 위로 '듣는 선'이 지나감
    const scan = prog(lt, cs(c, 1), cs(c, 1) + 3);
    if (lt < cs(c, 2) + .6) { const a = k1 * (1 - ap(lt, cs(c, 2), .6)) * f; R0.wave_before.forEach((wa, i) => wv(wa, 840, 160 + i * 160, 960, 130, 1, FCOL[i], '', a * k0, ''));
      if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(860 + 920 * scan, 150, 4, 640); ctx.restore();
        R0.wave_before.forEach((_, i) => text(FNAME[i] + ' ' + f1(BEF[i]), 815, 225 + i * 160, 28, FCOL[i], 800, 'right', a * ap(lt, cs(c, 1) + .75 * (i + 1)))); }
      text('1단계: 끝까지 듣고 크기 재기', 1220, 840, 36, INK, 800, 'center', a); }
    else { const m = ease(prog(lt, cs(c, 2) + .3, cs(c, 2) + 2.3)); meters(660, 180, 960, 520, mix(BEF, AFT, m), k2 * f, { target: -23 });
      text('2단계: 작은 소리는 키우고, 큰 소리는 줄이기', 1220, 860, 36, INK, 800, 'center', k2 * f); }
    if (k3 > 0) { const a = k3 * (1 - ap(lt, cs(c, 4) - .6, .6)); box(160, 160, 1600, 620, 24, 'rgba(1,4,9,.94)', BLUE, a, 3);
      text('LUFS (러프스) = 사람 귀가 느끼는 소리 크기', 960, 240, 46, BLUE, 900, 'center', a);
      const X0 = 300, X1 = 1620, xv = v => lerp(X0, X1, (v + 50) / 50); box(X0, 380, X1 - X0, 24, 12, 'rgba(255,255,255,.12)', null, a);
      [-50, -40, -30, -23, -14, -10, 0].forEach(v => { text(String(v), xv(v), 440, 28, v === -23 ? RED : SUB, 800, 'center', a, MONO); });
      box(xv(-23) - 6, 362, 12, 60, 6, RED, null, a); text('기본 목표 -23 (방송 기준 EBU R128)', xv(-23), 330, 30, RED, 800, 'center', a);
      text('← 작은 소리', X0 + 120, 500, 30, SUB, 700, 'center', a); text('큰 소리 →', X1 - 100, 500, 30, SUB, 700, 'center', a);
      text('0에 가까울수록 큰 소리 · 마이너스는 값에 붙는 부호 · 두 값의 차이 = 바뀐 크기', 960, 600, 32, INK, 700, 'center', a);
      text('예: -42.1 → -23.1 LUFS = 약 19 만큼 커짐', 960, 670, 32, GOLD, 800, 'center', a); }
    if (k4 > 0) { box(410, 260, 1100, 400, 22, 'rgba(1,4,9,.94)', BLUE, k4, 3); text('ffmpeg-normalize', 960, 340, 64, GOLD, 900, 'center', k4, MONO);
      text('만든 사람 Werner Robitza (slhck) · 라이선스 MIT (무료)', 960, 440, 36, INK, 800, 'center', k4);
      text('GitHub 별 약 1,540 (2026-11-22 확인) · PyPI 1.45.2 (2026-11-17)', 960, 510, 32, SUB, 700, 'center', k4);
      text('파이썬 3.10 이상 · 실제 소리 처리는 ffmpeg가 맡음', 960, 575, 32, SUB, 700, 'center', k4); }
  },
  install(c, lt) {
    const I = R0.install;
    rows(c, lt, LR, [['① 파이썬 3.10 이상 (python.org) · ② ffmpeg 따로 설치 (예: winget install Gyan.FFmpeg)', BLUE], ['③ 명령 창: pip install ffmpeg-normalize', GREEN, true],
      ['시연(리눅스): 약 ' + I.sec + '초 · ' + I.version.replace('v', '') + ' · 함께 설치되는 프로그램 ' + I.deps.length + '개 · ' + I.venv_mb + 'MB', GOLD], ['ffmpeg가 없으면 실행되지 않음 · Windows 실행은 시연 확인 전', PURPLE]], { h: 140 });
  },
  demo1(c, lt) {
    const k0 = ap(lt, 0), m = ease(prog(lt, cs(c, 2) + .2, cs(c, 2) + 2.2)), f4 = 1 - ap(lt, cs(c, 3) - .6, .6);
    meters(200, 170, 860, 540, mix(BEF, AFT, m), k0 * f4, { target: -23, tk: ap(lt, cs(c, 2)) });
    const L = [['$ ffmpeg-normalize 1_회의녹음.wav 2_강의녹음.wav \\', GREEN], ['    3_인터뷰.mp3 4_배경음악.wav', GREEN], ['✔ Files ━━━━━━━━━━ 100% 4/4', INK], ['→ normalized/ 폴더에 4개', GOLD]];
    term(1300, 170, 580, 300, L, lt < cs(c, 2) ? prog(lt, cs(c, 1), cs(c, 1) + 2) * 2 : 2 + prog(lt, cs(c, 2), cs(c, 2) + 1.5) * 2, ap(lt, cs(c, 1)) * f4, 22);
    stamp(R0.basic.sec + '초', 1590, 600, ap(lt, cs(c, 2) + 2.3, .5) * f4, GOLD, 60);
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) { const a = k3 * (1 - ap(lt, cs(c, 4) - .6, .6)); box(260, 160, 1400, 640, 22, CARD, GOLD, a, 3); text('폴더: normalized', 960, 230, 44, GOLD, 900, 'center', a);
      R0.basic.files.forEach((b, i) => { text(b.out, 420, 330 + i * 90, 36, INK, 700, 'left', a * ap(lt, cs(c, 3) + .4 + i * .3), MONO); text(f1(b.lufs) + ' LUFS', 1500, 330 + i * 90, 36, GREEN, 900, 'right', a * ap(lt, cs(c, 3) + .4 + i * .3)); });
      text('원본 파일 4개는 그대로 남음', 960, 720, 34, SUB, 700, 'center', a); }
    const k4 = ap(lt, cs(c, 4)); if (k4 > 0) { text('파일마다 바뀐 크기 (맞춘 뒤 − 맞추기 전)', 960, 200, 40, INK, 900, 'center', k4);
      BEF.forEach((b, i) => { const d = AFT[i] - b, y = 290 + i * 120, kk = ease(prog(lt, cs(c, 4) + i * .5, cs(c, 4) + i * .5 + 1.2)), a = k4 * ap(lt, cs(c, 4) + i * .5);
        text(FNAME[i], 400, y + 30, 36, FCOL[i], 800, 'right', a); box(960 - 1, y - 10, 2, 80, 0, SUB, null, a);
        const L2 = Math.abs(d) / 20 * 380 * kk; box(d > 0 ? 960 : 960 - L2, y, Math.max(4, L2), 60, 8, d > 0 ? GREEN : RED, null, a);
        text((d > 0 ? '+' : '') + f1(d) + (d > 0 ? ' 키움' : ' 줄임'), d > 0 ? 960 + L2 + 20 : 960 - L2 - 20, y + 30, 34, d > 0 ? GREEN : RED, 900, d > 0 ? 'left' : 'right', a); }); }
  },
  demo2(c, lt) {
    const k0 = ap(lt, 0), sw = ease(prog(lt, cs(c, 1), cs(c, 1) + 1)), f3 = 1 - ap(lt, cs(c, 3) - .6, .6);
    text(sw < .5 ? '귀 기준(LUFS)으로 맞춘 결과' : '최고점(가장 큰 순간)으로 맞춘 결과 · -nt peak', 960, 150, 42, sw < .5 ? GREEN : GOLD, 900, 'center', k0 * f3);
    const W2 = sw < .5 ? R0.wave_after : R0.wave_peak, vals = sw < .5 ? AFT : PK, kk = sw < .5 ? 1 - sw * 2 : sw * 2 - 1;
    W2.forEach((wa, i) => wv(wa, 380, 210 + i * 150, 1000, 120, 1, FCOL[i], FNAME[i], k0 * kk * f3, ''));
    const kv = sw < .5 ? 1 : ap(lt, cs(c, 2)); W2.forEach((_, i) => text(f1(vals[i]) + ' LUFS', 1410, 270 + i * 150, 40, vals[i] > -12 ? RED : INK, 900, 'left', k0 * kk * kv * f3));
    if (sw < .5) stamp('막대는 낮아도 귀 기준 크기는 같음', 1500, 830, ap(lt, 1.5, .5) * (1 - sw * 2), GREEN, 34, -3);
    stamp('차이 ' + f1(Math.max(...PK) - Math.min(...PK)), 1450, 850, ap(lt, cs(c, 2) + .8, .5) * f3, RED, 50, 4);
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) { meters(300, 200, 1240, 520, AFT, k3, { target: -23 }); stamp('기본값 = 귀 기준(LUFS)', 960, 860, ap(lt, cs(c, 3) + .6, .5), GREEN, 48, -3); }
  },
  demo3(c, lt) {
    const k0 = ap(lt, 0), f = 1 - ap(lt, cs(c, 2) - .6, .6);
    const L = [['$ ffmpeg-normalize 1_*.wav 2_*.wav 3_*.mp3 4_*.wav \\', GREEN], ['    -t -14 -c:a libmp3lame -b:a 192k -ext mp3 -of yt', GREEN], ['→ yt/1_회의녹음.mp3 … (4개, ' + R0.yt14.sec + '초)', GOLD]];
    term(120, 180, 1680, 300, L, lt < cs(c, 1) ? prog(lt, 0, 2) * 2 : 2 + prog(lt, cs(c, 1), cs(c, 1) + 1), k0 * f, 32);
    const kt = ap(lt, cs(c, 1)); if (f > 0 && kt > 0) [['-c:a libmp3lame', '소리 형식 = mp3'], ['-b:a 192k', '음질'], ['-ext mp3', '확장자'], ['-t -14', '목표 -14 LUFS']].forEach(([o, s], i) => {
      const a = kt * ap(lt, cs(c, 1) + i * .6) * f, x = 230 + i * 440; box(x - 200, 540, 400, 200, 16, CARD, i === 3 ? RED : BLUE, a, 2); text(o, x, 600, 32, i === 3 ? RED : BLUE, 700, 'center', a, MONO); text(s, x, 680, 34, INK, 800, 'center', a); });
    const k2 = ap(lt, cs(c, 2)); if (k2 > 0) meters(200, 190, 900, 540, YT, k2, { target: -14 });
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) { box(1380, 200, 500, 560, 18, 'rgba(242,193,78,.08)', GOLD, k3, 3); text('주의: 프로그램 경고', 1630, 250, 36, GOLD, 900, 'center', k3);
      para('말소리 3개는 그대로 키우면 최고점이 -2 dB를 넘어서, 덜 키우는 방식(dynamic)으로 바뀜', 1410, 330, 440, 32, INK, 700, 'left', k3);
      para('해결: -tp(최고점 제한)를 올리거나 -t(목표)를 낮추라고 안내', 1410, 600, 440, 30, SUB, 700, 'left', k3); }
  },
  demo4(c, lt) {
    const V0 = R0.video, k0 = ap(lt, 0), m = ease(prog(lt, cs(c, 1) + .2, cs(c, 1) + 2.2));
    videoCard(120, 200, 880, k0); text('11.4초 · 그림 + 작은 말소리', 560, 760, 32, SUB, 700, 'center', k0);
    meters(1200, 200, 260, 460, [lerp(V0.before.lufs, V0.after.lufs, m)], k0, { names: ['영상 소리'], cols: [BLUE], target: -23, tpos: 'below', scale: true });
    const k1 = ap(lt, cs(c, 1)); if (k1 > 0) { check(1720, 330, 90, ease(prog(lt, cs(c, 1) + .6, cs(c, 1) + 1.4)), GREEN, k1); text('그림 = 원본과 같음', 1720, 430, 32, GREEN, 900, 'center', k1); text('(그림 값 비교 일치)', 1720, 475, 24, SUB, 700, 'center', k1);
      text(V0.sec + '초', 1720, 560, 44, GOLD, 900, 'center', k1); }
    const k2 = ap(lt, cs(c, 2)); if (k2 > 0) { box(120, 820, 1680, 110, 16, 'rgba(242,193,78,.1)', GOLD, k2, 3);
      text('주의: 소리 표본 수가 44,100 → 96,000Hz로 바뀜 → -ar 48000 을 붙이면 48,000Hz', 960, 875, 34, GOLD, 800, 'center', k2); }
  },
  demo5(c, lt) {
    const L6 = R0.long60, k0 = ap(lt, 0);
    box(160, 180, 1600, 90, 14, CARD, BLUE, k0, 2); ctx.save(); ctx.globalAlpha *= k0; for (let i = 0; i < 60; i++) { ctx.fillStyle = i % 2 ? '#2f81f7' : '#1f6feb'; ctx.fillRect(180 + i * 26, 200, 24, 50); } ctx.restore();
    text('60분 회의 녹음 (시연용 가상 녹음을 이어 붙임) · WAV ' + L6.in_mb + 'MB', 960, 310, 32, SUB, 700, 'center', k0);
    const k1 = ap(lt, cs(c, 1)), kk = ease(prog(lt, cs(c, 1) + .2, cs(c, 1) + 2.2));
    if (k1 > 0) { text('처리 시간', 560, 420, 34, SUB, 700, 'center', k1); text((L6.sec * kk).toFixed(1) + '초', 560, 510, 90, GOLD, 900, 'center', k1); text('(약 1분 51초)', 560, 590, 32, INK, 700, 'center', k1 * ap(lt, cs(c, 1) + 2.2));
      text('결과 ' + f1(L6.after.lufs) + ' LUFS', 560, 660, 36, GREEN, 900, 'center', k1 * ap(lt, cs(c, 1) + 2.4)); }
    const k2 = ap(lt, cs(c, 2)), k22 = ease(prog(lt, cs(c, 2) + .2, cs(c, 2) + 1.8));
    if (k2 > 0) { hbar(1240, 430, 500, 70, L6.in_mb, 320, BLUE, k22, 'WAV (원본)', L6.in_mb + 'MB', k2, 30); hbar(1240, 560, 500, 70, L6.out_mb, 320, GREEN, k22, 'mp3 (결과)', L6.out_mb + 'MB', k2, 30); }
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) { box(160, 760, 1600, 100, 16, CARD, LINE, k3, 2); text('CPU 2개 클라우드 기준 · 내 PC에서는 성능에 따라 시간이 다를 수 있음', 960, 810, 32, SUB, 700, 'center', k3); }
  },
  opts(c, lt) {
    text('자주 쓰는 옵션', 960, 160, 52, GOLD, 900, 'center', ap(lt, 0));
    rows(c, lt, { x: 140, y: 220, w: 1640, h: 660 }, [['-t -14  목표 크기 (기본 -23)  ·  -tp -1  최고점 제한 (기본 -2)', BLUE, true], ['-c:a libmp3lame / aac  ·  -b:a 192k  ·  -ext mp3  ·  -ar 48000', GREEN, true],
      ['-of 폴더이름  ·  -f 덮어쓰기  ·  -n 미리 보기(실제로 바꾸지 않음)', GOLD, true], ['-nt peak / rms  최고점·평균 크기로 맞추기 (기본 ebu = 귀 기준)', PURPLE, true]], { off: 1, h: 130, fs: 36 });
  },
  uses(c, lt) { rows(c, lt, LR, [['① 회의·강의 녹음 여러 개를 같은 크기로 모아 듣기', BLUE], ['② 유튜브·발표 영상의 작은 소리 키우기 (그림은 그대로)', GREEN], ['③ 운동·드라이브용 음악 모음의 들쭉날쭉한 볼륨 고르기', GOLD]], { h: 150 }); },
  cons(c, lt) {
    text('아쉬운 점', 960, 170, 56, GOLD, 900, 'center', ap(lt, 0));
    rows(c, lt, { x: 140, y: 230, w: 1640, h: 640 }, [['① 화면 없는 명령어 도구 · ffmpeg를 따로 설치해야 함', RED], ['② 기본 결과가 .mkv → mp3·mp4로 받으려면 옵션 필요', RED],
      ['③ 같은 이름 결과가 있으면 건너뜀(-f로 덮어쓰기) · 소리 없는 영상은 오류', RED], ['④ 작은 녹음을 키우면 바탕 잡음도 함께 커질 수 있음', RED]], { off: 1, h: 130 });
  },
  summary(c, lt) {
    text('정리', 960, 170, 56, BLUE, 900, 'center', ap(lt, 0));
    rows(c, lt, { x: 140, y: 230, w: 1640, h: 640 }, [['✔ ffmpeg-normalize = 귀 기준으로 맞추는 소리 크기 지휘자', GOLD], ['✔ 녹음 4개 차이 32.0 → 0.4 · 2.35초', GREEN],
      ['✔ 영상은 그림 그대로 · 60분 녹음 약 1분 51초', GREEN], ['✔ ffmpeg 따로 설치 · mp3는 옵션 지정', RED]], { off: 1, h: 130 });
  },
  end(c, lt) { endCard(c, lt, { x: 0, y: 60, w: 1920, h: 900 }, 72); },
};
function endCard(c, lt, R, big = 64) {
  const cx = R.x + R.w / 2, k = ap(lt, 0), v = R.h > R.w;
  meters(cx - (v ? 220 : 200), R.y + R.h * (v ? .04 : .0), v ? 440 : 400, v ? 200 : 150, AFT, k, { names: false, scale: false, label: () => '', gap: 24 });
  text('ffmpeg-normalize · 소리 크기 지휘자', cx, R.y + R.h * (v ? .3 : .3), big * .62, GOLD, 900, 'center', k);
  const Ls = wrap('다음에 또 멋진 오픈소스 소개하겠습니다!', R.w - 80, big, 900);
  Ls.forEach((l, i) => text(l, cx, R.y + R.h * (v ? .42 : .47) + i * big * 1.3, big, INK, 900, 'center', k));
  const k2 = ap(lt, .8), yy = R.y + R.h * (v ? .78 : .8);
  if (v) { let j = 0; DISCLAIMER.forEach(d => wrap(d, R.w - 60, 28, 500).forEach(l => text(l, cx, yy + (j++) * 44, 28, SUB, 500, 'center', k2))); }
  else DISCLAIMER.forEach((d, i) => { const fs = fit(d, 24, R.w - 40, 500); text(d, cx, yy + i * 38, fs, SUB, 500, 'center', k2); });
}
function DRAW_ANIM(c, lt, W, H) {
  const v = H > W, R = v ? { x: 50, y: 230, w: W - 100, h: 1250 } : { x: 120, y: 90, w: W - 240, h: 820 }, cx = R.x + R.w / 2;
  const MR = v ? { x: R.x + 90, y: R.y + 200, w: R.w - 130, h: 760 } : { x: R.x + 100, y: R.y + 80, w: 900, h: 600 };
  if (c.id === 's_hook') {
    const m = ease(prog(lt, 2, 4)); text(m < .5 ? '맞추기 전' : '맞춘 뒤', cx, R.y + 60, v ? 60 : 50, m < .5 ? INK : GREEN, 900, 'center', ap(lt, 0));
    meters(MR.x, MR.y, MR.w, MR.h, mix(BEF, AFT, m), ap(lt, 0), { target: -23, tk: ap(lt, 2), tpos: v ? 'below' : 'right', fs: v ? 34 : 30 });
    stamp(R0.basic.sec + '초', v ? cx : R.x + R.w - 220, v ? R.y + 1180 : R.y + 380, ap(lt, 4.3, .5), GOLD, v ? 90 : 70);
  }
  if (c.id === 's_what') {
    text('ffmpeg-normalize', cx, R.y + (v ? 90 : 60), v ? 76 : 80, GOLD, 900, 'center', ap(lt, 0), MONO);
    text('소리 크기 맞추는 무료 도구', cx, R.y + (v ? 200 : 150), v ? 50 : 44, INK, 800, 'center', ap(lt, 0));
    conductor(v ? cx : cx - 450, R.y + (v ? 620 : 500), v ? 420 : 340, lt, ap(lt, .5));
    const k1 = ap(lt, cs(c, 1)); if (k1 > 0) { const x = v ? cx : cx + 280, y = R.y + (v ? 1000 : 400);
      box(x - (v ? 440 : 420), y - 110, v ? 880 : 840, 240, 20, CARD, BLUE, k1, 3); text('① 끝까지 한 번 듣고 재기', x, y - 40, v ? 44 : 40, INK, 800, 'center', k1);
      text('② 사람 귀 기준(LUFS)으로 맞추기', x, y + 50, v ? 44 : 40, GREEN, 800, 'center', k1 * ap(lt, cs(c, 1) + .8)); }
  }
  if (c.id === 's_result') {
    meters(MR.x, MR.y - (v ? 60 : 0), MR.w, MR.h, AFT, ap(lt, 0), { target: -23, tpos: v ? 'below' : 'right', fs: v ? 34 : 30 });
    const k1 = ap(lt, cs(c, 1)); if (k1 > 0) { const x = v ? cx : R.x + R.w - 230, y = v ? R.y + 1180 : R.y + 300;
      box(x - 220, y - 120, 440, v ? 250 : 380, 20, 'rgba(1,4,9,.94)', GREEN, k1, 3); text('가장 큰 − 가장 작은', x, y - 70, 30, SUB, 700, 'center', k1);
      if (v) text('32.0 → 0.4', x, y + 30, 70, GREEN, 900, 'center', k1); else { text('32.0', x, y + 10, 70, RED, 900, 'center', k1); text('↓', x, y + 80, 40, SUB, 900, 'center', k1); text('0.4', x, y + 160, 70, GREEN, 900, 'center', k1); } }
  }
  if (c.id === 's_video') {
    const V0 = R0.video, m = ease(prog(lt, 1, 3)), k0 = ap(lt, 0);
    videoCard(v ? R.x + 40 : R.x, R.y + (v ? 20 : 40), v ? R.w - 80 : 760, k0);
    meters(v ? cx - 120 : R.x + 980, R.y + (v ? 600 : 40), 240, v ? 380 : 480, [lerp(V0.before.lufs, V0.after.lufs, m)], k0, { names: ['영상 소리'], cols: [BLUE], target: -23, tpos: 'none', scale: false, fs: 36 });
    if (!v) check(R.x + 380, R.y + 560, 80, ease(prog(lt, 2.5, 3.3)), GREEN, k0);
    text('그림은 그대로 ✔', v ? cx : R.x + 380, R.y + (v ? 1090 : 640), v ? 44 : 38, GREEN, 900, 'center', ap(lt, 2.5));
    const k1 = ap(lt, cs(c, 1)); if (k1 > 0) { if (!v) box(R.x + 900, R.y + 620, 640, 140, 16, CARD, GOLD, k1, 3); else box(R.x + 40, R.y + 1140, R.w - 80, 130, 16, CARD, GOLD, k1, 3);
      text('60분 녹음 → 약 1분 51초', v ? cx : R.x + 1220, R.y + (v ? 1205 : 690), v ? 46 : 40, GOLD, 900, 'center', k1); }
  }
  if (c.id === 's_end') { const a = ap(lt, 0); box(R.x + (v ? 0 : 200), R.y + 30, R.w - (v ? 0 : 400), v ? 380 : 300, 20, CARD, BLUE, a, 3);
    text('Windows 명령 창 (파이썬 3.10 이상)', cx, R.y + (v ? 110 : 90), v ? 40 : 38, SUB, 700, 'center', a);
    text('pip install ffmpeg-normalize', cx, R.y + (v ? 210 : 180), v ? 50 : 54, GREEN, 600, 'center', a, MONO);
    text('+ ffmpeg 따로 설치', cx, R.y + (v ? 310 : 260), v ? 42 : 40, INK, 800, 'center', a);
    const k2 = ap(lt, 1.5), yb = R.y + (v ? 600 : 480); text('일반인 쓸모 ★★★☆☆ (3)', cx, yb, v ? 64 : 56, GOLD, 900, 'center', k2); }
}
