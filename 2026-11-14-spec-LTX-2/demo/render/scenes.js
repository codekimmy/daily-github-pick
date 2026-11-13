// 장면 그리기. 장(c)의 자막 시작 시각(c.cues[i][0])에 맞춰 화면 요소가 하나씩 나타난다 → 다 나타난 뒤 자막 길이(최소 3초)만큼 멈춤
const cs = (c, i) => c.cues[Math.min(i, c.cues.length - 1)][0];
const ap = (lt, t, d = .7) => out3(prog(lt, t, t + d));

// ───── 공용 장면 (가로·세로 모두): 영역 R = {x, y, w, h}
function sceneHook(c, lt, R, opt = {}) {
  const cx = R.x + R.w / 2, v = R.h > R.w;
  const a0 = ap(lt, 0);
  pill('사양 체크', cx, R.y + 40, 30, GOLD, a0);
  text('LTX-2.5', cx, R.y + (v ? 170 : 150), v ? 150 : 130, INK, 900, 'center', a0);
  text('Lightricks · 무료 공개 영상 생성 AI', cx, R.y + (v ? 280 : 245), 34, SUB, 700, 'center', a0);
  const a1 = ap(lt, opt.q ?? 1.2);
  text('내 PC로 돌아갈까?', cx, R.y + (v ? 430 : 350), v ? 92 : 80, GOLD, 900, 'center', a1);
  const gw = v ? 260 : 300, gh = v ? 130 : 140, gy = R.y + (v ? 600 : 470);
  gpu(cx - gw / 2, gy, gw, gh, '', a1);
  const a2 = ap(lt, opt.g ?? 2.4);
  const items = [['그래픽카드 메모리(VRAM)', '24GB↑ 권장'], ['저장 공간', '100GB↑ 여유'], ['시스템 메모리(RAM)', '64GB 권장']];
  if (v) items.forEach((it, i) => { const y = gy + 230 + i * 120, k = ap(lt, (opt.g ?? 2.4) + i * .9);
    box(R.x + 40, y, R.w - 80, 100, 18, CARD, LINE, k); text(it[0], R.x + 80, y + 50, 34, SUB, 700, 'left', k); text(it[1], R.x + R.w - 80, y + 50, 40, GOLD, 900, 'right', k); });
  else items.forEach((it, i) => { const w = 470, x = cx - 1.5 * w - 30 + i * (w + 30), y = gy + 190, k = ap(lt, (opt.g ?? 2.4) + i * .9);
    box(x, y, w, 120, 18, CARD, LINE, k); text(it[0], x + w / 2, y + 36, 28, SUB, 700, 'center', k); text(it[1], x + w / 2, y + 84, 42, GOLD, 900, 'center', k); });
}
function sceneLadder(c, lt, R, starts, compact) {
  const head = compact ? 0 : 0;
  ladder(R.x, R.y + head, R.w, (R.h - head) / 6, 6, lt, starts, compact);
}
function sceneCards(c, lt, R, cards, starts, cols = 1, maxH = 170) {
  const gap = 24, rows = Math.ceil(cards.length / cols), ch = Math.min(maxH, (R.h - gap * (rows - 1)) / rows), cw = (R.w - gap * (cols - 1)) / cols;
  cards.forEach((cd, i) => {
    const k = ap(lt, starts[i]); if (k <= 0) return;
    const x = R.x + (i % cols) * (cw + gap), y = R.y + Math.floor(i / cols) * (ch + gap) + (1 - k) * 20;
    box(x, y, cw, ch, 18, CARD, cd.c || LINE, k, cd.c ? 3 : 2);
    const ks = fit(cd.k, maxH > 200 ? 36 : 30, cw - 60, 700); text(cd.k, x + 30, y + ch * .3, ks, SUB, 700, 'left', k);
    const vs = fit(cd.v, (cd.vs || 44) * (maxH > 200 ? 1.25 : 1), cw - 60, 900); text(cd.v, x + 30, y + ch * .66, vs, cd.c || GOLD, 900, 'left', k);
  });
}
function taskManager(x, y, w, h, lt, t0, t1, a = 1) {
  if (a <= 0) return; box(x, y, w, h, 16, '#1b1f24', LINE, a, 2);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#262c33'; rr(x, y, w, 52, [16, 16, 0, 0]); ctx.fill(); ctx.restore();
  text('작업 관리자 — 성능 (그림 예시)', x + 24, y + 26, 22, SUB, 700, 'left', a);
  const side = ['CPU', '메모리', '디스크 0 (C:)', 'GPU 0'], sw = w * .3;
  side.forEach((s, i) => { const yy = y + 80 + i * 74, hi = i === 3 && lt > t0;
    box(x + 16, yy, sw - 24, 60, 10, hi ? 'rgba(88,166,255,.18)' : '#21262d', hi ? BLUE : null, a, 3); text(s, x + 36, yy + 30, 24, hi ? BLUE : INK, 700, 'left', a); });
  const k = ap(lt, t0 + .4), rx = x + sw + 10, rw = w - sw - 30;
  text('GPU', rx, y + 100, 34, INK, 900, 'left', a * k);
  box(rx, y + 130, rw, h * .3, 8, '#0f141a', LINE, a * k, 1);
  ctx.save(); ctx.globalAlpha *= a * k; ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.beginPath();
  for (let i = 0; i <= 60; i++) { const px = rx + rw * i / 60, py = y + 130 + h * .3 * (.75 - .25 * Math.sin(i * .37) * Math.cos(i * .11)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore();
  const k2 = ap(lt, t1), by = y + 150 + h * .3;
  box(rx, by, rw, 90, 12, 'rgba(242,193,78,.12)', GOLD, a * k2, 3);
  text('전용 GPU 메모리', rx + 24, by + 45, 30, SUB, 700, 'left', a * k2); text('?? GB  ← 이 숫자', rx + rw - 24, by + 45, 34, GOLD, 900, 'right', a * k2);
}
function endCard(c, lt, R, big = 64) {
  const cx = R.x + R.w / 2, k = ap(lt, 0), v = R.h > R.w;
  text('LTX-2.5 사양 체크', cx, R.y + R.h * (v ? .3 : .28), big * .8, BLUE, 900, 'center', k);
  const L = wrap('다음에 또 멋진 오픈소스 소개하겠습니다!', R.w - 80, big, 900);
  L.forEach((l, i) => text(l, cx, R.y + R.h * (v ? .42 : .45) + i * big * 1.3, big, INK, 900, 'center', k));
  const k2 = ap(lt, .8), yy = R.y + R.h * (v ? .78 : .8);
  DISCLAIMER.forEach((d, i) => { const fs = fit(d, 24, R.w - 40, 500); text(d, cx, yy + i * 38, fs, SUB, 500, 'center', k2); });
}

// ───── 롱폼 전용 장면 (1920×1080)
const LR = { x: 120, y: 120, w: 1680, h: 790 };
const DRAW_LONG = {
  preview(c, lt) { sceneHook(c, lt, LR, { q: cs(c, 2), g: cs(c, 2) + 1 }); if (lt < cs(c, 2)) { const k = ap(lt, cs(c, 1)) * (1 - ap(lt, cs(c, 2) - .5, .5));
      ['글 한 줄', '→', '소리 붙은 영상'].forEach((s, i) => text(s, 960 + (i - 1) * 420, 560, i === 1 ? 70 : 54, i === 1 ? SUB : PURPLE, 900, 'center', k)); } },
  title(c, lt) {
    const k = ap(lt, 0); pill('사양 체크 편', 960, 230, 36, GOLD, k); text('LTX-2.5', 960, 380, 150, INK, 900, 'center', k);
    text('github.com/Lightricks/LTX-2 · huggingface.co/Lightricks/LTX-2.5', 960, 490, 30, SUB, 600, 'center', k);
    const k2 = ap(lt, cs(c, 1)); box(260, 600, 1400, 190, 20, 'rgba(242,193,78,.10)', GOLD, k2, 3);
    text('※ 이 프로젝트는 그래픽카드가 필요해 직접 실행하지 않았습니다', 960, 665, 38, GOLD, 800, 'center', k2);
    text('필요 사양은 공식 자료(README·공식 앱 문서·라이선스)를 바탕으로 정리했습니다', 960, 730, 32, INK, 700, 'center', k2);
  },
  what(c, lt) {
    const k0 = ap(lt, 0); text('Lightricks', 420, 200, 64, INK, 900, 'center', k0); text('영상 생성 AI · 매개변수 220억 개', 420, 270, 30, SUB, 700, 'center', k0);
    const k1 = ap(lt, cs(c, 1)); ['글', '사진', '소리'].forEach((s, i) => { box(150 + i * 190, 340, 160, 110, 18, CARD, PURPLE, k1, 3); text(s, 230 + i * 190, 395, 40, PURPLE, 900, 'center', k1); });
    text('↓', 420, 495, 50, SUB, 900, 'center', k1); box(220, 540, 400, 110, 18, 'rgba(126,231,135,.12)', GREEN, k1, 3); text('소리가 맞춰진 영상', 420, 595, 38, GREEN, 900, 'center', k1);
    const k2 = ap(lt, cs(c, 2)); pill('Hugging Face 인기 순위 상위 · 좋아요 약 1.1만', 420, 730, 28, GOLD, k2);
    // 비유: 작업대(VRAM)
    const k3 = ap(lt, cs(c, 3)); text('그래픽카드 메모리(VRAM) = 작업대', 1330, 190, 44, BLUE, 900, 'center', k3);
    const st = [cs(c, 4), cs(c, 5), cs(c, 6)], rowY = [320, 530, 750];
    const benches = [{ w: 760, t: '넓은 작업대: 한 번에', parts: 1, c: GREEN }, { w: 470, t: '좁은 작업대: 조각으로 나눠', parts: 4, c: GOLD }, { w: 200, t: '너무 좁음: 시작 못 함', parts: 0, c: RED }];
    benches.forEach((b, i) => { const k = ap(lt, st[i]); if (k <= 0) return; const x = 960, y = rowY[i];
      box(x, y + 60, b.w, 26, 6, '#8b6b4a', null, k); box(x + 20, y + 86, 16, 60, 4, '#6b5038', null, k); box(x + b.w - 36, y + 86, 16, 60, 4, '#6b5038', null, k);
      if (b.parts === 1) box(x + 40, y - 10, b.w - 80, 66, 10, 'rgba(126,231,135,.25)', GREEN, k, 3);
      if (b.parts > 1) for (let j = 0; j < 4; j++) box(x + 20 + j * 110, y + 4, 96, 52, 8, 'rgba(242,193,78,.25)', GOLD, k * ap(lt, st[i] + .4 + j * .3), 3);
      if (b.parts === 0) { box(x + 10, y - 50, 300, 100, 10, 'rgba(255,123,114,.15)', RED, k, 3); cross(x + 160, y, 70, k); }
      text(b.t, x, y - (b.parts === 0 ? 80 : 40), 30, b.c, 800, 'left', k); });
  },
  spec(c, lt) {
    const rows = [['권장 VRAM', '24GB 이상 · 32GB 권장', GREEN], ['그래픽카드 예시', 'RTX 4090 = 24GB · RTX 5090 = 32GB', INK], ['앱 하한', '9GiB (Windows · FP8 지원 카드)', GOLD],
      ['저장 공간', '모델 약 66GiB · 앱 100GB↑ 여유', INK], ['시스템 메모리', 'Windows 64GB 권장', INK], ['운영체제', 'Windows 10·11 · Linux · macOS 26+', INK], ['모델 크기', '매개변수 220억 개 (22B)', INK]];
    const rh = 104; box(120, 116, 1680, rh * 7 + 8, 18, CARD, LINE, ap(lt, 0));
    rows.forEach((r, i) => { const k = ap(lt, cs(c, i)), y = 120 + i * rh; if (k <= 0) return;
      if (i) box(140, y, 1640, 2, 0, LINE, null, k); text(r[0], 170, y + rh / 2, 36, SUB, 700, 'left', k); text(r[1], 600, y + rh / 2, 42, r[2], 900, 'left', k);
      text('출처: ' + ['앱 README', '앱 문서', '앱 README', 'README · 앱', '앱 README', '앱 README', '모델 파일 이름'][i], 1760, y + rh / 2, 22, '#6e7681', 500, 'right', k); });
  },
  ladder(c, lt) {
    const k0 = ap(lt, 0); text('공식 앱(LTX Desktop) 기준 · 16:9 · 24fps', 960, 140, 32, SUB, 700, 'center', k0);
    ladder(160, 180, 1600, 106, 6, lt, [1, 2, 3, 4, 5, 6].map(i => cs(c, i)), false);
    const k7 = ap(lt, cs(c, 7)) * (1 - ap(lt, cs(c, 8) - .4, .4)), k8 = ap(lt, cs(c, 8));
    box(160, 860, 1600, 70, 14, 'rgba(242,193,78,.10)', GOLD, k7, 2); text('조각 수 ↑ = 시간 ↑ · 조각 사이 장면이 조금씩 달라질 수 있음', 960, 895, 32, GOLD, 800, 'center', k7);
    box(160, 860, 1600, 70, 14, 'rgba(88,166,255,.10)', BLUE, k8, 2); text('1440p·4K의 16·24GB 숫자: RTX 5090 측정값으로 계산한 값 (그 카드에서 잰 값 아님)', 960, 895, 30, BLUE, 800, 'center', k8);
  },
  time(c, lt) {
    const k0 = ap(lt, 0); pill('공식 문서의 생성 시간 = RTX 5090(32GB) 기준만', 960, 170, 32, BLUE, k0);
    [[1, '4K · 3초 영상', 7], [2, '4K · 10초 영상', 26]].forEach(([i, lab, m], j) => { const t = cs(c, i), k = ap(lt, t), x = 260 + j * 720;
      box(x, 260, 680, 300, 24, CARD, GOLD, k, 3); text(lab, x + 340, 320, 40, SUB, 800, 'center', k);
      const n = Math.round(m * ease(prog(lt, t + .3, t + 2))); text('약 ' + n + '분', x + 340, 450, 110, GOLD, 900, 'center', k); });
    const k3 = ap(lt, cs(c, 3)); box(260, 610, 1400, 110, 20, CARD, LINE, k3); text('다른 그래픽카드: 공개된 측정값 없음', 960, 665, 44, INK, 900, 'center', k3);
    const k4 = ap(lt, cs(c, 4)); text('작은 카드 → 조각이 늘어 더 오래 걸림 (공식 안내)', 960, 790, 34, SUB, 700, 'center', k4);
  },
  light(c, lt) {
    sceneCards(c, lt, { x: 120, y: 130, w: 1680, h: 760 }, [
      { k: '증류(distilled) 모델', v: '단계 8번 + 4번 · 빠른 시작용', c: GREEN }, { k: 'FP8 설정 (--quantization fp8-cast)', v: '그래픽카드 메모리를 덜 씀' },
      { k: '오프로드 (--offload cpu / disk)', v: 'RAM·디스크에 두고 꺼내 씀 · 느려짐' }, { k: '공식 앱 기본 모델', v: 'LTX 2.5 Fast' },
      { k: 'CPU만으로 실행', v: '공식 안내 없음', c: RED }, { k: '정리', v: '가벼운 설정도 그래픽카드는 필요', c: BLUE }],
      [cs(c, 1), cs(c, 2), cs(c, 3), cs(c, 4), cs(c, 5), cs(c, 5) + 1.2], 2);
    text('사양을 낮추는 공식 방법', 960, 112, 30, SUB, 700, 'center', ap(lt, 0) * (1 - ap(lt, cs(c, 1), .5)));
  },
  try(c, lt) {
    const k0 = ap(lt, 0); text('설치 없이 써 보기 (공식 안내 링크)', 960, 270, 46, INK, 900, 'center', k0);
    [[1, '① LTX 공식 Playground', 'console.ltx.video/playground'], [2, '② LTX Studio 웹 데모 화면', 'app.ltx.studio/ltx-2-playground']].forEach(([i, a, b], j) => {
      const k = ap(lt, cs(c, i)), x = 200 + j * 790; box(x, 360, 730, 220, 22, CARD, BLUE, k, 3); text(a, x + 365, 430, 42, INK, 900, 'center', k); text(b, x + 365, 510, 30, BLUE, 600, 'center', k, MONO); });
    const k3 = ap(lt, cs(c, 3)); box(200, 630, 1520, 100, 18, 'rgba(242,193,78,.10)', GOLD, k3, 2); text('가입 필요 · 무료 범위와 요금은 공식 페이지에서 확인', 960, 680, 38, GOLD, 800, 'center', k3);
    const k4 = ap(lt, cs(c, 4)); text('Pro 모델(LTX 2.5 Pro)은 클라우드(API) 전용', 960, 800, 36, SUB, 700, 'center', k4);
  },
  check(c, lt) {
    const k0 = ap(lt, 0); text('Windows에서 1분 확인', 480, 150, 44, INK, 900, 'center', k0);
    box(160, 220, 640, 90, 16, CARD, BLUE, ap(lt, cs(c, 1)), 3); text('Ctrl + Shift + Esc', 480, 265, 44, BLUE, 900, 'center', ap(lt, cs(c, 1)), MONO);
    taskManager(900, 130, 900, 620, lt, cs(c, 1) + 1, cs(c, 2));
    const k3 = ap(lt, cs(c, 3)); box(160, 360, 640, 220, 16, '#010409', LINE, k3);
    text('C:\\> nvidia-smi', 190, 410, 32, GREEN, 600, 'left', k3, MONO); text('(NVIDIA 카드: 메모리 총량이 표에 나옴)', 190, 470, 24, SUB, 600, 'left', k3);
    const k4 = ap(lt, cs(c, 4)); text('RAM: 성능 → 메모리', 480, 650, 36, INK, 800, 'center', k4);
    const k5 = ap(lt, cs(c, 5)); text('저장 공간: 파일 탐색기 → 내 PC', 480, 720, 36, INK, 800, 'center', k5);
    text('※ 작업 관리자 화면은 이해를 돕는 그림 예시입니다', 1350, 800, 22, '#6e7681', 500, 'center', k0);
  },
  license(c, lt) {
    const cards = [['프로그램 코드', 'Apache-2.0', GREEN], ['모델 파일', 'LTX-2.x 커뮤니티 라이선스', BLUE], ['연 매출 1,000만 달러↑ 회사', '유료 라이선스 필요', RED]];
    cards.forEach((cd, i) => { const k = ap(lt, cs(c, i)), x = 140 + i * 560; box(x, 160, 520, 300, 22, CARD, cd[2], k, 3);
      text(cd[0], x + 260, 240, fit(cd[0], 36, 470), SUB, 800, 'center', k); const L = wrap(cd[1], 460, 46, 900); L.forEach((l, j) => text(l, x + 260, 340 + j * 60, 46, cd[2], 900, 'center', k)); });
    const k3 = ap(lt, cs(c, 3)); text('개인·작은 회사도 라이선스의 금지 용도는 지켜야 함', 960, 560, 40, INK, 800, 'center', k3);
    const k4 = ap(lt, cs(c, 4)); text('모델 파일 받기 전: Hugging Face에서 약관 동의 필요', 960, 650, 36, GOLD, 800, 'center', k4);
    text('※ 법률 자문이 아닙니다. 사용 전 LICENSE-2_x 원문을 확인하시기 바랍니다', 960, 780, 26, '#6e7681', 500, 'center', ap(lt, 0));
  },
  summary(c, lt) {
    const k0 = ap(lt, 0); text('LTX-2.5 사양 체크리스트', 960, 160, 56, INK, 900, 'center', k0);
    const items = [['24GB 이상', '공식 권장 충족', GREEN], ['10~16GB', '짧은 영상 · 조각 생성으로 가능', GOLD], ['8GB 이하', '공식 웹 데모가 현실적', RED], ['함께 확인', '저장 공간 100GB · RAM 32~64GB', BLUE]];
    items.forEach((it, i) => { const t = cs(c, i + 1), k = ap(lt, t), y = 260 + i * 150; box(200, y, 1520, 120, 20, CARD, it[2], k, 3);
      check(290, y + 60, 70, prog(lt, t + .2, t + 1), it[2], k); text(it[0], 360, y + 60, 46, it[2], 900, 'left', k); text(it[1], 760, y + 60, 42, INK, 800, 'left', k); });
  },
  end(c, lt) { endCard(c, lt, { x: 0, y: 60, w: 1920, h: 900 }, 72); },
};

// ───── 과정 애니메이션 (숏폼 대본, 가로·세로 공용)
function DRAW_ANIM(c, lt, W, H) {
  const v = H > W, R = v ? { x: 60, y: 260, w: W - 120, h: 1250 } : { x: 120, y: 110, w: W - 240, h: 800 };
  if (c.id === 's_hook') sceneHook(c, lt, R, { q: 1.2, g: 2.6 });
  if (c.id === 's_ladder') { text('그래픽카드 메모리별 가능 범위 (공식 앱)', R.x + R.w / 2, R.y + 20, v ? 38 : 34, SUB, 700, 'center', ap(lt, 0));
    const st = [cs(c, 1), cs(c, 1) + .9, cs(c, 0) + .9, cs(c, 0) + 1.8, cs(c, 0), cs(c, 0) + .9].map((t, i) => t);
    // 24·32GB(권장)부터 보여 준 뒤 10GB·8GB
    const order = [cs(c, 1) + .9, cs(c, 1), cs(c, 0) + 1.8, cs(c, 0) + 2.7, cs(c, 0), cs(c, 0) + .9];
    ladder(R.x, R.y + 80, R.w, (R.h - 100) / 6, 6, lt, order, true); }
  if (c.id === 's_disk') sceneCards(c, lt, { x: R.x, y: R.y + (v ? 60 : 60), w: R.w, h: v ? 1100 : 700 }, [
      { k: '모델 파일 (기본 구성)', v: '약 66GiB', vs: 64 }, { k: '시스템 메모리(RAM) · Windows', v: '64GB 권장', vs: 64 },
      { k: 'RTX 5090(32GB) · 4K 10초 영상', v: '약 26분', vs: 64, c: RED }, { k: '다른 카드의 생성 시간', v: '공개된 측정값 없음', vs: 50, c: SUB }],
      [cs(c, 0), cs(c, 0) + 1, cs(c, 1), cs(c, 1) + 1], v ? 1 : 2, v ? 230 : 330);
  if (c.id === 's_try') { const cx = R.x + R.w / 2; text('설치 없이 써 보기', cx, R.y + 60, v ? 70 : 60, INK, 900, 'center', ap(lt, 0));
    [['LTX 공식 Playground', 'console.ltx.video'], ['LTX Studio 웹 데모 화면', 'app.ltx.studio']].forEach(([a, b], i) => { const k = ap(lt, .8 + i), w = v ? R.w : 700, x = v ? R.x : cx - 720 + i * 740, y = v ? R.y + 200 + i * 260 : R.y + 200;
      box(x, y, w, 220, 22, CARD, BLUE, k, 3); text(a, x + w / 2, y + 80, 46, INK, 900, 'center', k); text(b, x + w / 2, y + 150, 34, BLUE, 600, 'center', k, MONO); });
    const k3 = ap(lt, cs(c, 1)); text('가입 필요 · 무료 범위·요금은 공식 페이지 확인', cx, v ? R.y + 780 : R.y + 520, fit('가입 필요 · 무료 범위·요금은 공식 페이지 확인', 38, R.w), GOLD, 800, 'center', k3); }
  if (c.id === 's_check') { if (v) taskManager(R.x, R.y + 40, R.w, 640, lt, .5, 1.5); else taskManager(R.x + 160, R.y, R.w - 320, 560, lt, .5, 1.5);
    const k = ap(lt, cs(c, 1)), y = v ? R.y + 800 : R.y + 620;
    box(R.x, y, R.w, v ? 240 : 170, 20, 'rgba(242,193,78,.10)', GOLD, k, 3);
    const L = v ? ['※ 그래픽카드가 필요해 직접 실행하지 않았고,', '공식 자료를 바탕으로 정리했습니다'] : ['※ 그래픽카드가 필요해 직접 실행하지 않았고, 공식 자료를 바탕으로 정리했습니다'];
    L.forEach((l, i) => text(l, R.x + R.w / 2, y + (v ? 80 : 60) + i * 70, fit(l, 38, R.w - 60), GOLD, 800, 'center', k));
    const k2 = ap(lt, cs(c, 1) + 1.2), dy = v ? 1560 : 1000; if (!v) {} DISCLAIMER.forEach((d, i) => text(d, W / 2, (v ? R.y + 1120 : y + 125) + i * 34 - (v ? 0 : 0), fit(d, v ? 26 : 20, W - 80, 500), SUB, 500, 'center', k2 * (v || i === 0 ? 1 : 1))); }
}
