// 사양 체크 편 장면 (MOSS-Image). 모든 숫자는 공식 자료(README.md 필요 사양 표)에서 옮긴 값 — 모델을 실행한 화면·제작사 그림은 쓰지 않음
// 장(c)의 자막 시작 시각(c.cues[i][0])에 맞춰 화면 요소가 하나씩 나타난다
const cs = (c, i) => c.cues[Math.min(i, c.cues.length - 1)][0];
const ap = (lt, t, d = .7) => out3(prog(lt, t, t + d));
const LR = { x: 120, y: 130, w: 1680, h: 770 };

// 카드 목록 (위→아래), 각 카드: [제목, 값, 색]
function cards(c, lt, R, items, starts, cols = 1, maxH = 150) {
  const gap = 22, rows = Math.ceil(items.length / cols), ch = Math.min(maxH, (R.h - gap * (rows - 1)) / rows), cw = (R.w - gap * (cols - 1)) / cols;
  items.forEach(([k, v, col], i) => {
    const a = ap(lt, starts[i]); if (a <= 0) return;
    const x = R.x + (i % cols) * (cw + gap), y = R.y + Math.floor(i / cols) * (ch + gap) + (1 - a) * 20;
    box(x, y, cw, ch, 18, CARD, col || LINE, a, col ? 3 : 2);
    text(k, x + 30, y + ch * .3, fit(k, 28, cw - 60, 700), SUB, 700, 'left', a);
    text(v, x + 30, y + ch * .68, fit(v, 42, cw - 60, 900), col || GOLD, 900, 'left', a);
  });
}
// 메모리 막대: 그래픽카드 3.65 · RAM 14 · 모델 파일 25 (단위 GB/GiB, 막대 최대 30)
function memBars(x, y, w, lt, starts, fs = 32, rowH = 120, labW = 360) {
  const rows = [['GPU 메모리 (최소 모드)', 3.65, '3.65GiB', GREEN], ['시스템 메모리 RAM', 14, '14GiB', GOLD], ['모델 파일 (저장 공간)', 25, '약 25GB', BLUE]];
  rows.forEach(([lab, v, s, col], i) => { const k = ap(lt, starts[i]), kk = ease(prog(lt, starts[i] + .2, starts[i] + 1.6)), yy = y + i * rowH; if (k <= 0) return;
    text(lab, x, yy, fs * .85, SUB, 700, 'left', k);
    box(x, yy + 26, w, 44, 10, '#21262d', null, k); box(x, yy + 26, Math.max(14, w * v / 30 * kk), 44, 10, col, null, k * .9);
    text(s, x + Math.max(14, w * v / 30 * kk) + 16, yy + 48, fs, col, 900, 'left', k * Math.min(1, kk * 2)); });
}
// 작업대 비유: 넓은 작업대(재료 다 올림) / 좁은 작업대(재료는 선반=RAM·SSD에서 하나씩)
function bench(x, y, w, lt, t0, narrow, a = 1) {
  const k = ap(lt, t0) * a; if (k <= 0) return;
  box(x, y + 80, w, 26, 6, '#8b6b4a', null, k); box(x + 20, y + 106, 16, 70, 4, '#6b5038', null, k); box(x + w - 36, y + 106, 16, 70, 4, '#6b5038', null, k);
  const parts = [['글 이해 모델', BLUE], ['그림 모델', PURPLE], ['그림 변환기', GOLD]];
  if (!narrow) parts.forEach(([s, col], i) => { box(x + 20 + i * (w - 40) / 3, y, (w - 40) / 3 - 14, 76, 10, 'rgba(88,166,255,.12)', col, k, 3); text(s, x + 20 + i * (w - 40) / 3 + ((w - 40) / 3 - 14) / 2, y + 38, 24, col, 800, 'center', k); });
  else {
    const on = Math.floor(prog(lt, t0 + .8, t0 + 4.4) * 3 - 1e-6); const [s, col] = parts[Math.max(0, on)];
    box(x + 20, y, w - 40, 76, 10, 'rgba(242,193,78,.12)', col, k, 3); text(s + ' (지금 쓰는 것만)', x + w / 2, y + 38, 24, col, 800, 'center', k);
    box(x + w + 40, y - 20, 300, 200, 14, CARD, LINE, k, 2); text('선반 = RAM · SSD', x + w + 190, y + 10, 24, SUB, 700, 'center', k);
    parts.forEach(([p, c2], i) => text(p, x + w + 190, y + 60 + i * 40, 22, i === on ? INK : '#6e7681', 700, 'center', k));
  }
}
function taskManager(x, y, w, h, lt, t0, t1, a = 1) {
  if (a <= 0) return; box(x, y, w, h, 16, '#1b1f24', LINE, a, 2);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#262c33'; rr(x, y, w, 52, [16, 16, 0, 0]); ctx.fill(); ctx.restore();
  text('작업 관리자 — 성능 (그림 예시)', x + 24, y + 26, 22, SUB, 700, 'left', a);
  const side = ['CPU', '메모리', '디스크 0 (C:)', 'GPU 0'], sw = w * .3;
  side.forEach((s, i) => { const yy = y + 80 + i * 74, hi = (i === 3 && lt > t0) || (i === 1 && lt > t1 + 1.5);
    box(x + 16, yy, sw - 24, 60, 10, hi ? 'rgba(88,166,255,.18)' : '#21262d', hi ? BLUE : null, a, 3); text(s, x + 36, yy + 30, 24, hi ? BLUE : INK, 700, 'left', a); });
  const k = ap(lt, t0 + .4), rx = x + sw + 10, rw = w - sw - 30;
  text('GPU', rx, y + 100, 34, INK, 900, 'left', a * k);
  box(rx, y + 130, rw, h * .3, 8, '#0f141a', LINE, a * k, 1);
  const k2 = ap(lt, t1), by = y + 150 + h * .3;
  box(rx, by, rw, 90, 12, 'rgba(242,193,78,.12)', GOLD, a * k2, 3);
  text('전용 GPU 메모리', rx + 24, by + 45, 30, SUB, 700, 'left', a * k2); text('?? GB  ← VRAM', rx + rw - 24, by + 45, 34, GOLD, 900, 'right', a * k2);
}
function endCard(c, lt, R, big = 64) {
  const cx = R.x + R.w / 2, k = ap(lt, 0), v = R.h > R.w;
  text('MOSS-Image 사양 체크', cx, R.y + R.h * (v ? .3 : .28), big * .8, BLUE, 900, 'center', k);
  const L = wrap('다음에 또 멋진 오픈소스 소개하겠습니다!', R.w - 80, big, 900);
  L.forEach((l, i) => text(l, cx, R.y + R.h * (v ? .42 : .45) + i * big * 1.3, big, INK, 900, 'center', k));
  const k2 = ap(lt, .8), yy = R.y + R.h * (v ? .78 : .8);
  if (v) { let j = 0; DISCLAIMER.forEach(d => wrap(d, R.w - 60, 28, 500).forEach(l => text(l, cx, yy + (j++) * 44, 28, SUB, 500, 'center', k2))); }
  else DISCLAIMER.forEach((d, i) => { const fs = fit(d, 24, R.w - 40, 500); text(d, cx, yy + i * 38, fs, SUB, 500, 'center', k2); });
}
function hook(lt, R, t1, t2) {
  const cx = R.x + R.w / 2, v = R.h > R.w, a0 = ap(lt, 0);
  pill('사양 체크', cx, R.y + 40, 30, GOLD, a0);
  text('MOSS-Image', cx, R.y + (v ? 170 : 150), v ? 120 : 120, INK, 900, 'center', a0);
  text('OpenMOSS · 무료 공개 그림 생성 AI', cx, R.y + (v ? 270 : 240), 34, SUB, 700, 'center', a0);
  const a1 = ap(lt, t1); text('내 PC로 돌아갈까?', cx, R.y + (v ? 410 : 340), v ? 88 : 80, GOLD, 900, 'center', a1);
  gpu(cx - 150, R.y + (v ? 520 : 420), 300, 140, '', a1);
  const items = [['GPU 메모리(최소 모드)', '3.65GiB'], ['시스템 메모리 RAM', '14GiB'], ['모델 파일', '약 25GB']];
  items.forEach((it, i) => { const k = ap(lt, t2 + i * .9);
    if (v) { const y = R.y + 760 + i * 120; box(R.x + 40, y, R.w - 80, 100, 18, CARD, LINE, k); text(it[0], R.x + 80, y + 50, 32, SUB, 700, 'left', k); text(it[1], R.x + R.w - 80, y + 50, 42, GOLD, 900, 'right', k); }
    else { const w = 470, x = cx - 1.5 * w - 30 + i * (w + 30), y = R.y + 620; box(x, y, w, 120, 18, CARD, LINE, k); text(it[0], x + w / 2, y + 36, 28, SUB, 700, 'center', k); text(it[1], x + w / 2, y + 84, 44, GOLD, 900, 'center', k); } });
}

const DRAW_LONG = {
  preview(c, lt) { hook(lt, LR, cs(c, 1) - .5, cs(c, 1) + .3); },
  title(c, lt) {
    const k = ap(lt, 0); pill('사양 체크 편', 960, 230, 36, GOLD, k); text('MOSS-Image', 960, 380, 140, INK, 900, 'center', k);
    text('github.com/OpenMOSS/MOSS-Image', 960, 490, 32, SUB, 600, 'center', k);
    const k2 = ap(lt, cs(c, 1)); box(260, 600, 1400, 190, 20, 'rgba(242,193,78,.10)', GOLD, k2, 3);
    text('※ 이 프로젝트는 그래픽카드가 필요해 직접 실행하지 않았습니다', 960, 665, 38, GOLD, 800, 'center', k2);
    text('필요 사양은 공식 자료(GitHub README·Mac 문서·사용 안내)를 바탕으로 정리했습니다', 960, 730, 30, INK, 700, 'center', k2);
  },
  what(c, lt) {
    const f = 1 - ap(lt, cs(c, 3) - .6, .6), k0 = ap(lt, 0) * f;
    text('OpenMOSS', 960, 190, 70, INK, 900, 'center', k0); text('2026-10-16 공개 · 글 → 그림', 960, 260, 34, SUB, 700, 'center', k0);
    const k1 = ap(lt, cs(c, 1)) * f; [['그림 속 글자', GREEN], ['배치(레이아웃) 지정', BLUE], ['긴 설명 4K 토큰', PURPLE]].forEach(([s, col], i) => { box(240 + i * 500, 330, 440, 130, 20, CARD, col, k1 * ap(lt, cs(c, 1) + i * .6), 3); text(s, 460 + i * 500, 395, 38, col, 900, 'center', k1 * ap(lt, cs(c, 1) + i * .6)); });
    const k2 = ap(lt, cs(c, 2)) * f; [['MOSS-Image-Base', '기본 모델'], ['MOSS-Image-SFT', '골라 낸 자료로 더 다듬은 모델']].forEach(([a, b], i) => { box(300 + i * 680, 540, 640, 150, 20, CARD, GOLD, k2, 2); text(a, 620 + i * 680, 590, 38, GOLD, 900, 'center', k2, MONO); text(b, 620 + i * 680, 650, 30, INK, 700, 'center', k2); });
    const k3 = ap(lt, cs(c, 3)); text('그래픽카드 메모리(VRAM) = 작업대', 960, 180, 48, BLUE, 900, 'center', k3);
    text('넓은 작업대: 재료를 다 올려놓고 한 번에', 300, 300, 32, GREEN, 800, 'left', k3); bench(300, 340, 900, lt, cs(c, 3) + .5, false);
    text('좁은 작업대: 재료는 선반(RAM·SSD)에 두고 하나씩 → 느려짐', 300, 590, 32, GOLD, 800, 'left', ap(lt, cs(c, 4))); bench(300, 630, 560, lt, cs(c, 4), true);
  },
  spec(c, lt) {
    const rows = [['최소 측정값 (GPU 메모리)', '3.65GiB 할당 · 3.85GiB 예약 (최소 모드, 1024×1024 · 50단계)', GREEN, 'README'], ['시스템 메모리 (RAM)', '14.00GiB (같은 측정, 파일 캐시 포함)', GOLD, 'README'],
      ['자동 설정 기준', 'GPU 메모리 12GiB 미만 → 최소 모드', INK, 'README'], ['모델 파일', '약 25GB (글 이해 약 17GB + 그림 약 10GB)', INK, 'Mac 문서'],
      ['운영체제', '리눅스 + NVIDIA(CUDA) · Apple 칩 Mac 실험 단계', INK, 'README · Mac 문서'], ['Windows', '공식 설치 안내 없음 · ComfyUI 네이티브 지원', RED, 'README']];
    const rh = 120; box(120, 126, 1680, rh * 6 + 8, 18, CARD, LINE, ap(lt, 0));
    rows.forEach((r, i) => { const k = ap(lt, cs(c, i)), y = 130 + i * rh; if (k <= 0) return;
      if (i) box(140, y, 1640, 2, 0, LINE, null, k); text(r[0], 170, y + rh / 2, 32, SUB, 700, 'left', k); text(r[1], 600, y + rh / 2, fit(r[1], 38, 1000, 900), r[2], 900, 'left', k);
      text('출처: ' + r[3], 1770, y + rh / 2, 22, '#6e7681', 500, 'right', k); });
  },
  memory(c, lt) {
    const k0 = ap(lt, 0); text('Gradio 화면 → Advanced settings → Memory mode', 960, 150, 32, SUB, 700, 'center', k0, MONO);
    cards(c, lt, { x: 160, y: 200, w: 1600, h: 560 }, [['① GPU 상주 (GPU resident)', '모델 전체를 그래픽카드에', GREEN], ['② 부분 이동 (Component)', '필요한 부분만 CPU ↔ GPU', BLUE],
      ['③ 순차 (Sequential)', '메모리를 더 아끼는 대신 느림', GOLD], ['④ 저메모리 (Low memory)', '그림 모델은 RAM, 나머지는 SSD에서 읽음', RED]], [1, 2, 3, 4].map(i => cs(c, i)), 2, 260);
    const k5 = ap(lt, cs(c, 5)); box(160, 800, 1600, 100, 16, 'rgba(242,193,78,.10)', GOLD, k5, 3); text('python gradio_app.py --profile minimal  · 모델 파일은 SSD에', 960, 850, 34, GOLD, 800, 'center', k5, MONO);
  },
  disk(c, lt) {
    const k1 = ap(lt, cs(c, 1)), k2 = ap(lt, cs(c, 2)), kk1 = ease(prog(lt, cs(c, 1), cs(c, 1) + 1.5)), kk2 = ease(prog(lt, cs(c, 2), cs(c, 2) + 1.5)), W0 = 1400, x0 = 260;
    text('저장 공간 (공식 Mac 문서의 대략값)', 960, 170, 38, SUB, 700, 'center', ap(lt, 0));
    box(x0, 260, W0, 120, 14, '#21262d', null, ap(lt, 0)); box(x0, 260, W0 * 17 / 40 * kk1, 120, 14, BLUE, null, k1); text('글 이해 모델 약 17GB', x0 + 30, 320, 38, '#0d1117', 900, 'left', k1 * kk1);
    box(x0 + W0 * 17 / 40, 260, W0 * 10 / 40 * kk2, 120, 14, PURPLE, null, k2); text('그림 약 10GB', x0 + W0 * 17 / 40 + 24, 320, 34, '#0d1117', 900, 'left', k2 * kk2);
    text('모델 묶음 약 25GB', x0 + W0 * 27 / 40 / 2, 430, 40, GOLD, 900, 'center', k2);
    const k3 = ap(lt, cs(c, 3)); box(x0, 500, W0, 2, 0, GOLD, null, k3); text('여유 공간 약 40GB 권장 (모델 + 환경 + 내려받기 파일, Mac 안내)', 960, 560, 36, GOLD, 900, 'center', k3);
    text('0GB', x0, 220, 24, SUB, 600, 'left', ap(lt, 0)); text('40GB', x0 + W0, 220, 24, SUB, 600, 'right', ap(lt, 0));
    text('모델 파일 크기는 Hugging Face 모델 페이지에서 다시 확인 (작업 공간에서 접속 막힘)', 960, 700, 30, SUB, 700, 'center', k3);
  },
  time(c, lt) {
    const k0 = ap(lt, 0); pill('공식 문서의 생성 시간 = Apple M1 Max(32GB) · SFT 기록뿐', 960, 170, 30, BLUE, k0);
    [[1, '1024×1024 · 20단계', 320.4, '초'], [2, '768×1024 · 28단계', 0, '344~395초']].forEach(([i, lab, v, u], j) => { const t = cs(c, i), k = ap(lt, t), x = 260 + j * 720;
      box(x, 260, 680, 300, 24, CARD, GOLD, k, 3); text(lab, x + 340, 320, 38, SUB, 800, 'center', k);
      const s = v ? (v * ease(prog(lt, t + .3, t + 2))).toFixed(1) + u : u; text(s, x + 340, 440, v ? 100 : 80, GOLD, 900, 'center', k);
      if (v) text('약 5분', x + 340, 520, 34, INK, 800, 'center', k); });
    const k3 = ap(lt, cs(c, 3)); box(260, 610, 1400, 110, 20, CARD, LINE, k3); text('NVIDIA 그래픽카드 생성 시간: 공개된 측정값 없음', 960, 665, 42, INK, 900, 'center', k3);
    const k4 = ap(lt, cs(c, 4)); text('공식 권장 50단계 이상 → 위 기록(20·28단계)보다 더 걸릴 수 있음', 960, 790, 34, RED, 800, 'center', k4);
  },
  light(c, lt) {
    cards(c, lt, { x: 120, y: 140, w: 1680, h: 760 }, [['공식 · 최소 모드', '--profile minimal (GPU 3.65GiB 측정)', GREEN], ['커뮤니티 · lodestones', '8단계 증류 모델 (ComfyUI용 LoRA)', GOLD],
      ['커뮤니티 · KBlueLeaf', 'FP16 호환 모델 (Diffusers·ComfyUI)', GOLD], ['커뮤니티 · mossimage.cpp', 'C++/CUDA 실행기 (파이썬 없이)', GOLD],
      ['주의', '커뮤니티 버전은 공식 아님 → 각 페이지 확인', BLUE], ['CPU만으로 실행', '공식 안내 없음', RED]],
      [cs(c, 1), cs(c, 2), cs(c, 3), cs(c, 3) + .8, cs(c, 4), cs(c, 5)], 2, 200);
  },
  try(c, lt) {
    cards(c, lt, { x: 220, y: 200, w: 1480, h: 600 }, [['① Hugging Face Space (공식 데모, README 배지)', 'huggingface.co/spaces/OpenMOSS-Team/MOSS-Image', GREEN],
      ['② MOSI API 플랫폼 (2026-10-20 공개, 공식)', 'platform.mosi.cn → Playground', BLUE], ['확인할 것', '이용 조건 · 대기열 · 요금은 각 공식 페이지에서', GOLD]], [cs(c, 1), cs(c, 2), cs(c, 3)], 1, 170);
    text('사양이 부족하면 설치 없이', 960, 150, 34, SUB, 700, 'center', ap(lt, 0));
  },
  check(c, lt) {
    taskManager(160, 140, 1000, 640, lt, cs(c, 1), cs(c, 2), ap(lt, cs(c, 1)));
    const k3 = ap(lt, cs(c, 3)); box(1220, 300, 560, 260, 18, '#05070c', LINE, k3, 2); text('C:\\> nvidia-smi', 1250, 360, 34, GREEN, 600, 'left', k3, MONO);
    text('… MiB / 12288MiB', 1250, 430, 30, INK, 600, 'left', k3, MONO); text('↑ 뒤 숫자 = VRAM (예시)', 1250, 490, 26, SUB, 700, 'left', k3);
    text('내 PC 사양 확인 (Windows)', 960, 120, 30, SUB, 700, 'center', ap(lt, 0) * (1 - ap(lt, cs(c, 1), .5)));
  },
  license(c, lt) {
    cards(c, lt, { x: 220, y: 200, w: 1480, h: 600 }, [['실행 코드 (파이프라인)', 'Apache-2.0 (README)', GREEN], ['모델 파일 (가중치)', 'README에 표기 없음 → 모델 카드 확인', RED],
      ['이번 정리', '작업 공간에서 Hugging Face 접속이 막혀 확인하지 못함', GOLD]], [cs(c, 0), cs(c, 1), cs(c, 2)], 1, 170);
  },
  summary(c, lt) {
    text('정리', 960, 170, 56, BLUE, 900, 'center', ap(lt, 0));
    const items = ['GPU 메모리 3.65GiB 기록은 최소 모드 기준 (느려짐)', 'RAM 14GiB(측정값) · SSD 여유 약 40GB', 'Windows는 ComfyUI 길 · 공식 설치 안내는 리눅스', '사양이 부족하면 공식 웹 데모부터'];
    items.forEach((s, i) => { const k = ap(lt, cs(c, i + 1)), y = 260 + i * 150; box(160, y, 1600, 120, 18, CARD, GREEN, k, 2); check(240, y + 60, 60, prog(lt, cs(c, i + 1) + .2, cs(c, i + 1) + .8)); text(s, 320, y + 60, fit(s, 42, 1400, 800), INK, 800, 'left', k); });
  },
  end(c, lt) { endCard(c, lt, { x: 0, y: 60, w: 1920, h: 900 }, 72); },
};

function DRAW_ANIM(c, lt, W, H) {
  const v = H > W, R = v ? { x: 50, y: 230, w: W - 100, h: 1250 } : { x: 120, y: 90, w: W - 240, h: 820 }, cx = R.x + R.w / 2;
  if (c.id === 's_hook') hook(lt, R, 1.5, 2.6);
  if (c.id === 's_vram') {
    text('공식 측정 (최소 모드, 1024×1024 한 장)', cx, R.y + (v ? 80 : 40), v ? 40 : 36, SUB, 700, 'center', ap(lt, 0));
    memBars(v ? R.x + 30 : R.x + 200, R.y + (v ? 220 : 130), v ? R.w - 260 : 1000, lt, [0.3, cs(c, 1), cs(c, 1) + .9], v ? 40 : 36, v ? 200 : 170);
  }
  if (c.id === 's_time') {
    const k = ap(lt, 0), n = (320.4 * ease(prog(lt, .3, 2))).toFixed(1);
    box(cx - (v ? 450 : 500), R.y + (v ? 100 : 60), v ? 900 : 1000, v ? 420 : 340, 24, CARD, GOLD, k, 3);
    text('Apple M1 Max (32GB) · 1024×1024 · 20단계', cx, R.y + (v ? 170 : 120), v ? 34 : 34, SUB, 700, 'center', k);
    text(n + '초', cx, R.y + (v ? 320 : 250), v ? 120 : 110, GOLD, 900, 'center', k); text('약 5분', cx, R.y + (v ? 450 : 350), 44, INK, 800, 'center', k);
    const k1 = ap(lt, cs(c, 1)); box(cx - (v ? 450 : 500), R.y + (v ? 600 : 460), v ? 900 : 1000, 140, 20, CARD, LINE, k1);
    text('NVIDIA: 공개된 측정값 없음', cx, R.y + (v ? 670 : 530), v ? 50 : 50, INK, 900, 'center', k1);
  }
  if (c.id === 's_try') {
    const k = ap(lt, 0); box(R.x + (v ? 0 : 200), R.y + (v ? 150 : 120), R.w - (v ? 0 : 400), v ? 420 : 320, 24, CARD, GREEN, k, 3);
    text('설치 없이 써 보기', cx, R.y + (v ? 230 : 190), v ? 52 : 48, GREEN, 900, 'center', k);
    text('Hugging Face Space', cx, R.y + (v ? 340 : 280), v ? 56 : 56, INK, 900, 'center', k);
    text('OpenMOSS-Team/MOSS-Image', cx, R.y + (v ? 440 : 360), v ? 38 : 38, SUB, 600, 'center', k, MONO);
  }
  if (c.id === 's_check') {
    taskManager(v ? R.x : R.x + 200, R.y + (v ? 60 : 20), v ? R.w : 1000, v ? 640 : 580, lt, 0.3, 1.5, ap(lt, 0));
    const k = ap(lt, cs(c, 1)); box(v ? R.x : R.x + 200, R.y + (v ? 800 : 640), v ? R.w : 1000, 110, 18, 'rgba(242,193,78,.10)', GOLD, k, 3);
    text('직접 실행하지 않음 · 공식 자료 기준', cx, R.y + (v ? 855 : 695), v ? 40 : 40, GOLD, 900, 'center', k);
  }
}
