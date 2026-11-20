// 장면 그리기. 장(c)의 자막 시작 시각(c.cues[i][0])에 맞춰 화면 요소가 하나씩 나타난다 → 다 나타난 뒤 자막 길이(최소 3초)만큼 멈춤
// 숫자: data.js (RES = 2026-11-21 시연 측정값, demo/results.json) · 그림: img/seq/*.png(별 줍기 자동 플레이 화면), img/ex_*.png(Pyxel 제작자 예제 실행 화면), img/korean.png, img/editor.png
// 연출(tools/kit/README.md): 바탕 격자 + 픽셀 제목 글꼴, 도장 배지 + 새 연출 '게임기 화면'(handheld: 실제 실행 프레임을 게임기 틀 안에서 재생)·'16색 크레파스'(pal16)·'소리 4줄'(wave)
const cs = (c, i) => c.cues[Math.min(i, c.cues.length - 1)][0];
const ap = (lt, t, d = .7) => out3(prog(lt, t, t + d));
const R0 = RES, PIX = KIT.PIXEL_B;
const PAL = ['#000000', '#2b335f', '#7e2072', '#19959c', '#8b4852', '#395c98', '#a9c1ff', '#eeeeee', '#d4186c', '#d38441', '#e9c35b', '#70c6a9', '#7696de', '#a3a3a3', '#ff9798', '#edc7b0'];
const SEQ = [], IMG = {};
const loadImg = (src) => new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(im); im.src = src; });
const IMG_READY = Promise.all([
  ...Array.from({ length: 180 }, (_, i) => loadImg(`img/seq/f${String(i * 2).padStart(5, '0')}.png`).then(im => SEQ[i] = im)),
  ...['korean', 'editor', 'ex_02_jump_game', 'ex_03_draw_api', 'ex_10_platformer', 'ex_16_transform'].map(n => loadImg(`img/${n}.png`).then(im => IMG[n] = im)),
]);
function pic(im, x, y, w, h, a = 1) { if (!im || !im.width || a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.imageSmoothingEnabled = false; ctx.drawImage(im, x, y, w, h); ctx.restore(); }
function fitPic(im, x, y, w, h, a = 1) { if (!im || !im.width) return; const s = Math.min(w / im.width, h / im.height), dw = im.width * s, dh = im.height * s; pic(im, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh, a); box(x + (w - dw) / 2, y + (h - dh) / 2, dw, dh, 0, null, LINE, a, 2); }
const stamp = (s, x, y, k, color = GOLD, size = 48, rot = -7) => KIT.stamp(ctx, s, x, y, k, color, size, rot);
function ptext(s, x, y, size, color = INK, align = 'center', a = 1) { text(s, x, y, size, color, 700, align, a, PIX); }

// ── 새 연출 '게임기 화면': 실제 실행 프레임(15장/초)을 게임기 틀 안에서 재생. t = 재생 시각(초)
function handheld(x, y, w, t, a = 1, label = 'star_catch.py') {
  if (a <= 0) return; const sw = w - 60, sh = sw * .75, h = sh + 220;
  box(x, y, w, h, 34, '#c9c3b6', '#8f897c', a, 4); box(x + 30, y + 30, sw, sh, 10, '#000', '#3a3a3a', a, 6);
  const i = Math.max(0, Math.min(179, Math.floor(t * 15))); pic(SEQ[i], x + 30, y + 30, sw, sh, a);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#3d3a35'; const cy = y + sh + 120;
  ctx.fillRect(x + 70, cy - 12, 100, 24); ctx.fillRect(x + 108, cy - 50, 24, 100);
  ctx.fillStyle = '#a3263f'; [[w - 150, 14], [w - 80, -24]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(x + dx, cy + dy, 26, 0, 7); ctx.fill(); });
  ctx.restore(); text(label, x + w / 2, y + sh + 70, 22, '#55514a', 700, 'center', a, MONO);
}
// ── 새 연출 '16색 크레파스': 4×4 칸이 칸 단위로 채워짐
function pal16(x, y, cell, k, a = 1, num = true) {
  PAL.forEach((c, i) => { const kk = clamp(k * 16 - i), cx = x + (i % 4) * (cell + 8), cy = y + Math.floor(i / 4) * (cell + 8);
    if (kk <= 0) return; box(cx, cy + (1 - kk) * 10, cell, cell, 6, c, '#ffffff33', a * kk, 2); if (num) text(String(i), cx + cell / 2, cy + cell / 2, cell * .32, i < 2 || i === 4 || i === 5 ? '#fff' : '#0b1020', 800, 'center', a * kk, MONO); });
}
// ── 새 연출 '소리 4줄': 자동 작곡 파형(앞 8초 막대 96개)을 왼쪽부터 그림
function wave(p, x, y, w, h, k, col, a = 1, lab = '') {
  if (a <= 0) return; box(x, y, w, h, 12, CARD, LINE, a, 2); const d = R0.wave[p], n = d.length, bw = (w - 40) / n;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col;
  for (let i = 0; i < n * k; i++) { const v = Math.min(1, d[i]) * (h - 40) / 2; ctx.fillRect(x + 20 + i * bw, y + h / 2 - v, Math.max(2, bw - 2), v * 2); }
  ctx.restore(); if (lab) text(lab, x - 20, y + h / 2, 30, col, 800, 'right', a);
}
function code(x, y, w, h, from, n, hl, a = 1, fs = 22) {
  if (a <= 0) return; box(x, y, w, h, 14, '#05070c', LINE, a, 2);
  for (let i = 0; i < n; i++) { const ln = from + i, s = R0.code[ln] || '', on = hl && hl.includes(ln + 1); const yy = y + 36 + i * fs * 1.5;
    if (on) box(x + 8, yy - fs * .75, w - 16, fs * 1.5, 4, 'rgba(242,193,78,.18)', null, a);
    text(String(ln + 1).padStart(2, ' '), x + 20, yy, fs, SUB, 500, 'left', a * .7, MONO);
    text(s.length > 62 ? s.slice(0, 62) + '…' : s, x + 70, yy, fs, on ? GOLD : (s.trim().startsWith('#') ? '#7d8590' : INK), 500, 'left', a, MONO); }
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
const LR = { x: 60, y: 120, w: 1800, h: 800 };
const NAMES = ['타이틀', '출발', '마을', '평화', '들판', '모험', '전투', '위기'], WCOL = [BLUE, GREEN, GOLD, PURPLE, GREEN, BLUE, RED, RED];

const DRAW_LONG = {
  preview(c, lt) {
    handheld(110, 120, 760, lt, ap(lt, 0));
    const k1 = ap(lt, cs(c, 1)); text('자동 작곡 8가지', 1370, 170, 40, GOLD, 900, 'center', k1);
    [0, 4, 6].forEach((p, i) => wave(p, 1080, 240 + i * 150, 760, 110, ease(prog(lt, cs(c, 1) + i * .8, cs(c, 1) + i * .8 + 2)), WCOL[p], k1 * ap(lt, cs(c, 1) + i * .8), ''));
    [0, 4, 6].forEach((p, i) => text(NAMES[p], 1090, 222 + i * 150, 24, WCOL[p], 800, 'left', k1 * ap(lt, cs(c, 1) + i * .8)));
    stamp('각각 0.02초 안', 1460, 700, ap(lt, cs(c, 1) + 2.8, .5), GOLD, 44);
    const k2 = ap(lt, cs(c, 2)); box(1080, 780, 760, 110, 16, CARD, GREEN, k2, 2); text('pip install pyxel', 1460, 835, 40, GREEN, 600, 'center', k2, MONO);
  },
  title(c, lt) {
    const k = ap(lt, 0); pal16(860, 120, 42, prog(lt, .2, 1.8), k, false);
    ptext('Pyxel', 960, 430, 150, GOLD, 'center', k);
    text('픽셀 · 8비트 게임기 조립 상자', 960, 540, 46, SUB, 700, 'center', k);
    text('일반인 쓸모 ★★★☆☆ (3)', 960, 640, 66, GOLD, 900, 'center', ap(lt, cs(c, 1)));
    text('파이썬으로 옛날 오락실 느낌 게임을 만드는 무료 도구', 960, 740, 42, INK, 700, 'center', ap(lt, cs(c, 2)));
  },
  what(c, lt) {
    const k0 = ap(lt, 0), k1 = ap(lt, cs(c, 1)), k2 = ap(lt, cs(c, 2)), k3 = ap(lt, cs(c, 3)), k4 = ap(lt, cs(c, 4));
    // 상자
    const f = 1 - ap(lt, cs(c, 4) - .6, .6);
    box(140, 200, 1640, 620, 30, 'rgba(242,193,78,.06)', GOLD, k0 * f, 4); ptext('8비트 게임기 조립 상자', 960, 250, 50, GOLD, 'center', k0 * f);
    pal16(220, 330, 70, prog(lt, cs(c, 1), cs(c, 1) + 2), k1 * f); text('16색 크레파스', 375, 690, 32, INK, 800, 'center', k1 * f);
    ['ch0', 'ch1', 'ch2', 'ch3'].forEach((_, i) => wave(i * 2, 640, 330 + i * 85, 460, 70, ease(prog(lt, cs(c, 1) + .5 + i * .4, cs(c, 1) + 2 + i * .4)), [BLUE, GREEN, GOLD, RED][i], k1 * f, ''));
    text('소리 4줄 (채널)', 870, 690, 32, INK, 800, 'center', k1 * f);
    fitPic(IMG.editor, 1180, 330, 520, 330, k1 * ap(lt, cs(c, 1) + 1.5) * f); text('그림판 · 작곡판', 1440, 690, 32, INK, 800, 'center', k1 * ap(lt, cs(c, 1) + 1.5) * f);
    if (k2 > 0) { box(220, 740, 1480, 60, 12, 'rgba(1,4,9,.9)', BLUE, k2 * f, 2); text('조립 설명서 = 파이썬 코드 (화면 크기·색·움직임을 글로 적음)', 960, 770, 32, BLUE, 800, 'center', k2 * f); }
    if (k3 > 0) stamp('일부러 16색 · 소리 4줄', 1500, 250, k3 * f, RED, 40, 6);
    if (k4 > 0) { box(410, 260, 1100, 400, 22, 'rgba(1,4,9,.94)', BLUE, k4, 3); ptext('Pyxel', 960, 340, 80, GOLD, 'center', k4);
      text('만든 사람 kitao(일본) · 라이선스 MIT (무료)', 960, 440, 38, INK, 800, 'center', k4);
      text('GitHub 별 약 1.78만 (2026-11-21 확인) · PyPI 3.0.3 (2026-11-20)', 960, 510, 32, SUB, 700, 'center', k4);
      text('파이썬 3.11 이상 · 엔진 속은 Rust로 만듦', 960, 575, 32, SUB, 700, 'center', k4); }
  },
  install(c, lt) {
    rows(c, lt, LR, [['① 파이썬 3.11 이상 설치 (python.org)', BLUE], ['② 명령 창: pip install pyxel', GREEN, true],
      ['시연(리눅스): 약 1.1초 · 3.0.3 · 27.2MB · 함께 설치되는 프로그램 0개', GOLD], ['Windows용 설치 파일 9.2MB(PyPI) · Windows 실행은 시연 확인 전', PURPLE]], { h: 140 });
  },
  demo1(c, lt) {
    const L = [['$ pyxel copy_examples', GREEN], ['copied pyxel_examples/01_hello_pyxel.py …', SUB], ['', INK], ['$ cd pyxel_examples', GREEN], ['$ pyxel run 02_jump_game.py', GREEN]];
    const n = lt < cs(c, 2) ? Math.min(2, prog(lt, 0, 2) * 2) : 3 + Math.min(2, prog(lt, cs(c, 2), cs(c, 2) + 1.5) * 2);
    const f3 = 1 - ap(lt, cs(c, 3) - .6, .6);
    term(80, 140, 860, 360, L, n, ap(lt, 0) * f3, 28);
    const k1 = ap(lt, cs(c, 1)); [['예제 파일', R0.examples_py, BLUE], ['3D 예제', R0.examples_cube, PURPLE], ['완성 게임', R0.examples_apps.length, GOLD]].forEach(([s, v, col], i) => {
      const a = k1 * ap(lt, cs(c, 1) + i * .8) * f3, x = 160 + i * 270; box(x - 120, 560, 240, 230, 18, CARD, col, a, 3); text(s, x, 610, 30, SUB, 700, 'center', a);
      text(String(Math.round(v * ease(prog(lt, cs(c, 1) + i * .8, cs(c, 1) + i * .8 + 1.5)))) + '개', x, 700, 70, col, 900, 'center', a); });
    const k2 = ap(lt, cs(c, 2)); if (f3 > 0) { pic(IMG.ex_02_jump_game, 1000, 140, 840, 630, k2 * f3); box(1000, 140, 840, 630, 0, null, LINE, k2 * f3, 2); text('02_jump_game.py 실행 화면', 1420, 820, 30, SUB, 700, 'center', k2 * f3); }
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) [['ex_02_jump_game', '점프 게임'], ['ex_03_draw_api', '그리기 기능'], ['ex_10_platformer', '발판 게임'], ['ex_16_transform', '돌리기·키우기']].forEach(([n2, s], i) => {
      const a = k3 * ap(lt, cs(c, 3) + i * .8), x = 80 + i * 450; fitPic(IMG[n2], x, 200, 420, 520, a); text(s, x + 210, 770, 32, INK, 800, 'center', a); });
    if (k3 > 0) text('Pyxel 제작자 예제를 클라우드에서 실행한 화면', 960, 150, 30, SUB, 700, 'center', k3);
  },
  demo2(c, lt) {
    const k0 = ap(lt, 0), fc = 1 - ap(lt, cs(c, 3) - .6, .6);
    const hl = lt < cs(c, 1) ? null : lt < cs(c, 2) ? [14] : lt < cs(c, 3) ? [21, 37] : null;
    const from = lt < cs(c, 2) ? 10 : 18;
    code(60, 130, 1000, 640, from, 18, hl, k0 * fc, 22);
    stamp('빈 줄·설명 빼고 ' + R0.star_lines_code + '줄', 560, 860, ap(lt, 1, .5) * fc, GOLD, 34, -3);
    const k2 = ap(lt, cs(c, 2)) * fc; if (k2 > 0) { box(1100, 770, 760, 150, 16, CARD, BLUE, k2, 2);
      text('update → draw → update → draw …', 1480, 815, 30, BLUE, 700, 'center', k2, MONO); text('1초에 30번 되풀이 (fps=30)', 1480, 875, 36, INK, 900, 'center', k2); }
    const mv = ease(prog(lt, cs(c, 3) - .6, cs(c, 3)));
    handheld(lerp(1180, 120, mv), 120, lerp(600, 760, mv), lt, ap(lt, .5));
    const k3 = ap(lt, cs(c, 3)), st = R0.star.state;
    if (k3 > 0) { const kk = ease(prog(lt, cs(c, 3), cs(c, 3) + 1.8));
      box(1000, 160, 820, 420, 18, CARD, GOLD, k3, 2); text('자동 플레이 12초 결과', 1410, 210, 32, SUB, 700, 'center', k3);
      text('받은 별 ' + Math.round(st.score * kk) + '개', 1410, 310, 64, GOLD, 900, 'center', k3); text('놓친 별 ' + Math.round(st.miss * kk) + '개', 1410, 400, 48, RED, 900, 'center', k3);
      text('그린 화면 ' + Math.round(R0.star.frames * kk) + '장 ÷ ' + R0.star.sec.toFixed(1) + '초 = 초당 ' + R0.star.fps.toFixed(0) + '장', 1410, 500, 32, INK, 700, 'center', k3); }
    stamp('그래픽카드 없이 초당 30장', 1410, 700, ap(lt, cs(c, 4), .5), GREEN, 42, -4);
  },
  demo3(c, lt) {
    const k0 = ap(lt, 0), im = IMG.korean, W0 = 1400, X0 = 260;
    const crop = (sy, sh, y, a, col) => { if (!im || !im.width || a <= 0) return; const h = W0 * sh / im.width; ctx.save(); ctx.globalAlpha *= a; ctx.imageSmoothingEnabled = false; ctx.drawImage(im, 0, sy, im.width, sh, X0, y, W0, h); ctx.restore(); box(X0, y, W0, h, 0, null, col, a, 3); return h; };
    crop(0, 72, 140, k0, RED); text('내장 글꼴: "Built-in: 안녕 Hello" → 한글 자리가 빈칸', 960, 340, 30, RED, 800, 'center', k0);
    const k1 = ap(lt, cs(c, 1)); crop(80, 80, 390, k1, GREEN); text("글꼴 파일 지정: pyxel.Font('글꼴.ttf', 12) → 한글 보임", 960, 605, 30, GREEN, 800, 'center', k1);
    const k2 = ap(lt, cs(c, 2)), kk = ease(prog(lt, cs(c, 2) + .3, cs(c, 2) + 1.8));
    if (k2 > 0) { box(260, 660, 1400, 170, 16, 'rgba(1,4,9,.94)', GOLD, k2, 2); text('메모리 최대 사용량 (별 줍기 12초)', 960, 690, 26, SUB, 700, 'center', k2);
      hbar(760, 715, 640, 44, R0.star_nofont.max_rss_mb, 480, BLUE, kk, '한글 글꼴 없음', R0.star_nofont.max_rss_mb.toFixed(0) + 'MB', k2, 28);
      hbar(760, 772, 640, 44, R0.star.max_rss_mb, 480, GOLD, kk, '큰 한글 글꼴(Noto CJK)', R0.star.max_rss_mb.toFixed(0) + 'MB', k2, 28); }
    stamp('가벼운 한글 글꼴 권장', 1560, 150, ap(lt, cs(c, 3), .5), GOLD, 36, 4);
  },
  demo4(c, lt) {
    const k0 = ap(lt, 0); box(60, 130, 1800, 90, 14, '#05070c', LINE, k0, 2);
    text('pyxel.gen_bgm(분위기 0~7, 높이, 악기, 번호)  →  악보(MML) 4줄', 960, 175, 34, GREEN, 600, 'center', k0, MONO);
    const k1 = ap(lt, cs(c, 1));
    R0.bgm.forEach((b, i) => { const col = i % 2, row = Math.floor(i / 2), x = 230 + col * 900, y = 250 + row * 140, a = k1 * ap(lt, cs(c, 1) + i * .4);
      wave(i, x, y, 640, 110, ease(prog(lt, cs(c, 1) + i * .4, cs(c, 1) + i * .4 + 1.6)), WCOL[i], a, NAMES[i]);
      const kk = ap(lt, cs(c, 2) + i * .15); text(b.gen_sec.toFixed(4) + '초', x + 660, y + 55, 28, INK, 800, 'left', a * kk); });
    stamp('8가지 모두 각각 0.02초 안', 960, 830, ap(lt, cs(c, 2) + 1.5, .5), GOLD, 44, -3);
    const k3 = ap(lt, cs(c, 3)) * (1 - ap(lt, cs(c, 4) - .6, .6)); if (k3 > 0) { box(360, 360, 1200, 300, 20, 'rgba(1,4,9,.95)', BLUE, k3, 3); text('musics[0].save("bgm.wav", 20)', 960, 440, 36, BLUE, 600, 'center', k3, MONO);
      text('20초짜리 WAV 저장 → 각각 0.01초', 960, 520, 46, INK, 900, 'center', k3); text('소리 장치 없는 클라우드에서도 파일로 저장됨', 960, 600, 30, SUB, 700, 'center', k3); }
    const k4 = ap(lt, cs(c, 4)); if (k4 > 0) { box(360, 360, 1200, 300, 20, 'rgba(1,4,9,.95)', PURPLE, k4, 3); text('번호(seed) 바꾸기 → 다른 곡', 960, 460, 46, PURPLE, 900, 'center', k4); text('같은 번호 → 같은 곡 (다시 만들 수 있음)', 960, 560, 40, INK, 800, 'center', k4); }
  },
  demo5(c, lt) {
    const k0 = ap(lt, 0); fitPic(IMG.editor, 80, 130, 900, 680, k0); text('pyxel edit 실행 화면 (예제 그림 파일을 연 모습)', 530, 850, 28, SUB, 700, 'center', k0);
    const k1 = ap(lt, cs(c, 1)); [['그림 (256×256)', '3장', BLUE], ['지도 (타일맵)', '8장', GREEN], ['소리', '64개', GOLD], ['음악', '8곡', PURPLE]].forEach(([s, v, col], i) => {
      const a = k1 * ap(lt, cs(c, 1) + i * .6), y = 150 + i * 120; box(1040, y, 800, 100, 14, CARD, col, a, 2); text(s, 1080, y + 50, 34, INK, 800, 'left', a); text(v, 1800, y + 50, 44, col, 900, 'right', a); });
    const k2 = ap(lt, cs(c, 2)); if (k2 > 0) { box(1040, 660, 800, 170, 16, CARD, GOLD, k2, 2); text('내장 녹화: pyxel.screencast()', 1440, 710, 32, GOLD, 600, 'center', k2, MONO);
      text('마지막 12초 → GIF ' + R0.star.gif_kb + 'KB', 1440, 785, 42, INK, 900, 'center', k2); }
  },
  demo6(c, lt) {
    const k0 = ap(lt, 0), P = R0.package;
    const L = [['$ pyxel package star_catch star_catch/star_catch.py', GREEN], ['→ star_catch.pyxapp (' + P.pyxapp_kb + 'KB)', GOLD], ['$ pyxel app2html star_catch.pyxapp', GREEN], ['→ star_catch.html (' + P.html_kb + 'KB)', GOLD], ['<script src="https://kitao.dev/pyxel/3.0.3/pyxel.js">', SUB]];
    term(80, 130, 1760, 380, L, lt < cs(c, 1) ? prog(lt, 0, 2) * 2 : lt < cs(c, 2) ? 2 + prog(lt, cs(c, 1), cs(c, 1) + 2) * 2 : 4 + prog(lt, cs(c, 2), cs(c, 2) + 1.5), k0, 30);
    stamp('게임 하나 = ' + P.pyxapp_kb + 'KB', 1500, 250, ap(lt, 2.2, .5), GOLD, 40, 5);
    const k2 = ap(lt, cs(c, 2)); if (k2 > 0) { box(80, 560, 1760, 130, 16, 'rgba(242,193,78,.08)', GOLD, k2, 3); text('웹 페이지는 제작자 누리집(kitao.dev)에서 실행 파일을 받아 옴 → 인터넷 필요', 960, 625, 36, GOLD, 800, 'center', k2); }
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) { box(80, 720, 1760, 130, 16, 'rgba(255,123,114,.08)', RED, k3, 3); text('시연 환경: kitao.dev 연결이 막혀 웹 실행은 확인하지 못함', 960, 785, 36, RED, 800, 'center', k3); }
  },
  uses(c, lt) { rows(c, lt, LR, [['① 아이와 함께 첫 코딩: 화면에 바로 움직이는 결과', BLUE], ['② 생일·기념일 축하 미니 게임 만들어 보내기', GREEN], ['③ 유튜브·발표 영상에 넣을 8비트 배경음악 만들기', GOLD]], { h: 150 }); },
  cons(c, lt) {
    text('아쉬운 점', 960, 170, 56, GOLD, 900, 'center', ap(lt, 0));
    rows(c, lt, { x: 140, y: 230, w: 1640, h: 640 }, [['① 마우스로 만드는 도구가 아님 · 파이썬 코드를 써야 함', RED], ['② 내장 글꼴은 한글 불가 → 글꼴 파일 필요', RED],
      ['③ 16색 · 작은 화면 → 화려한 그래픽 게임은 어려움', RED], ['④ 웹 변환본은 인터넷 필요 · Windows 실행은 시연 확인 전', RED]], { off: 1, h: 130 });
  },
  summary(c, lt) {
    text('정리', 960, 170, 56, BLUE, 900, 'center', ap(lt, 0));
    rows(c, lt, { x: 140, y: 230, w: 1640, h: 640 }, [['✔ Pyxel = 파이썬으로 조립하는 8비트 게임기 상자', GOLD], ['✔ 40줄 게임이 1초에 30장 · 그래픽카드 없이', GREEN],
      ['✔ 자동 작곡 8가지 · 각각 0.02초 안', GREEN], ['✔ 한글은 글꼴 파일 지정 필요', RED]], { off: 1, h: 130 });
  },
  end(c, lt) { endCard(c, lt, { x: 0, y: 60, w: 1920, h: 900 }, 72); },
};
function endCard(c, lt, R, big = 64) {
  const cx = R.x + R.w / 2, k = ap(lt, 0), v = R.h > R.w, cell = v ? 34 : 26;
  pal16(cx - (cell * 4 + 24) / 2, R.y + R.h * (v ? .06 : .02), cell, 1, k, false);
  ptext('Pyxel · 8비트 게임기 조립 상자', cx, R.y + R.h * (v ? .3 : .28), big * .7, GOLD, 'center', k);
  const Ls = wrap('다음에 또 멋진 오픈소스 소개하겠습니다!', R.w - 80, big, 900);
  Ls.forEach((l, i) => text(l, cx, R.y + R.h * (v ? .42 : .45) + i * big * 1.3, big, INK, 900, 'center', k));
  const k2 = ap(lt, .8), yy = R.y + R.h * (v ? .78 : .8);
  if (v) { let j = 0; DISCLAIMER.forEach(d => wrap(d, R.w - 60, 28, 500).forEach(l => text(l, cx, yy + (j++) * 44, 28, SUB, 500, 'center', k2))); }
  else DISCLAIMER.forEach((d, i) => { const fs = fit(d, 24, R.w - 40, 500); text(d, cx, yy + i * 38, fs, SUB, 500, 'center', k2); });
}
function DRAW_ANIM(c, lt, W, H) {
  const v = H > W, R = v ? { x: 50, y: 230, w: W - 100, h: 1250 } : { x: 120, y: 90, w: W - 240, h: 820 }, cx = R.x + R.w / 2;
  if (c.id === 's_hook') {
    const w = v ? R.w - 40 : 700; handheld(v ? R.x + 20 : R.x, R.y + (v ? 20 : 0), w, lt, ap(lt, 0));
    const bx = v ? cx : R.x + R.w - 420, by = v ? R.y + 20 + (w - 60) * .75 + 300 : R.y + 220;
    text('파이썬', bx, by, v ? 50 : 46, SUB, 700, 'center', ap(lt, 1));
    ptext(R0.star_lines_code + '줄', bx, by + (v ? 120 : 110), v ? 120 : 110, GOLD, 'center', ap(lt, 1.8));
    stamp('초당 30장', bx, by + (v ? 280 : 270), ap(lt, 3, .5), GREEN, v ? 60 : 54);
  }
  if (c.id === 's_what') {
    const k1 = ap(lt, cs(c, 1)); ptext('Pyxel', cx, v ? R.y + 110 : R.y + 70, v ? 120 : 100, GOLD, 'center', ap(lt, 0));
    text('옛날 오락실 느낌 게임 만들기', cx, v ? R.y + 240 : R.y + 170, v ? 48 : 44, INK, 800, 'center', ap(lt, 0));
    const cell = v ? 90 : 70; pal16(v ? cx - (cell * 4 + 24) / 2 : R.x + 120, v ? R.y + 360 : R.y + 260, cell, prog(lt, cs(c, 1), cs(c, 1) + 2), k1, false);
    [0, 1, 2, 3].forEach(i => wave(i * 2, v ? R.x + 40 : cx + 20, (v ? R.y + 820 : R.y + 260) + i * (v ? 100 : 85), v ? R.w - 80 : 640, v ? 80 : 70, ease(prog(lt, cs(c, 1) + .8 + i * .4, cs(c, 1) + 2 + i * .4)), [BLUE, GREEN, GOLD, RED][i], k1, ''));
    text('16색 · 소리 4줄', cx, v ? R.y + 1250 : R.y + 640, v ? 46 : 42, SUB, 800, 'center', k1);
  }
  if (c.id === 's_bgm') {
    const n = 8, h = v ? 120 : 72, gap = v ? 22 : 10, x = v ? R.x + 150 : R.x + 260, w = v ? R.w - 170 : 1000, y0 = v ? R.y + 80 : R.y + 40;
    R0.bgm.forEach((b, i) => { const a = ap(lt, i * .35); wave(i, x, y0 + i * (h + gap), w, h, ease(prog(lt, i * .35, i * .35 + 1.4)), WCOL[i], a, NAMES[i]); });
    stamp('각각 0.02초 안', cx, v ? R.y + 1200 : R.y + 770, ap(lt, cs(c, 1), .5), GOLD, v ? 64 : 56, -4);
  }
  if (c.id === 's_korean') {
    const im = IMG.korean, w = v ? R.w : 1300, x = cx - w / 2, y = v ? R.y + 150 : R.y + 60;
    const crop = (sy, sh, yy, a, col) => { if (!im || !im.width || a <= 0) return 0; const h = w * sh / im.width; ctx.save(); ctx.imageSmoothingEnabled = false; ctx.globalAlpha *= a; ctx.drawImage(im, 0, sy, im.width, sh, x, yy, w, h); ctx.restore(); box(x, yy, w, h, 0, null, col, a, 4); return h; };
    const h1 = w * 72 / 640; crop(0, 72, y, ap(lt, 0), RED); text('내장 글꼴 → 한글 빈칸', cx, y + h1 + 50, v ? 46 : 40, RED, 900, 'center', ap(lt, 0));
    const k1 = ap(lt, cs(c, 1)), y2 = y + h1 + (v ? 200 : 120), h2 = w * 80 / 640; crop(80, 80, y2, k1, GREEN);
    text('한글 글꼴 파일 지정 → 해결', cx, y2 + h2 + 50, v ? 46 : 40, GREEN, 900, 'center', k1);
  }
  if (c.id === 's_end') { const a = ap(lt, 0); box(R.x + (v ? 0 : 300), R.y + 30, R.w - (v ? 0 : 600), v ? 300 : 230, 20, CARD, BLUE, a, 3);
    text('Windows 명령 창 (파이썬 3.11 이상)', cx, R.y + (v ? 110 : 90), v ? 40 : 38, SUB, 700, 'center', a);
    text('pip install pyxel', cx, R.y + (v ? 220 : 180), v ? 56 : 54, GREEN, 600, 'center', a, MONO);
    const k2 = ap(lt, 1.5), yb = R.y + (v ? 520 : 400); text('일반인 쓸모 ★★★☆☆ (3)', cx, yb, v ? 64 : 56, GOLD, 900, 'center', k2); }
}
