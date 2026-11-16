// 장면 그리기. 장(c)의 자막 시작 시각(c.cues[i][0])에 맞춰 화면 요소가 하나씩 나타난다 → 다 나타난 뒤 자막 길이(최소 3초)만큼 멈춤
// 터미널 화면: clips.js (casts/*.cast = genact가 실제로 출력한 글자를 pyte로 다시 재생해 12분의 1초마다 찍은 것) · 숫자: data.js (RES = 측정값)
// 연출(tools/kit/README.md): 바탕 격자 + 픽셀 글꼴(터미널 분위기), 도장 배지, 세트 뒷면 뒤집기(새로 만듦: flip + setBack)
const cs = (c, i) => c.cues[Math.min(i, c.cues.length - 1)][0];
const ap = (lt, t, d = .7) => out3(prog(lt, t, t + d));
const MOD = Object.fromEntries(RES.modules.map(r => [r.module, r]));
const DONE = RES.modules.filter(r => !r.timeout && r.sec < 60).sort((a, b) => a.sec - b.sec);
const DL = RES.download_10s, SP = RES.speed_10s_lines, MX = RES.mixed_30s;
const PB = KIT.PIXEL_B;

// 터미널 창: genact가 실제로 출력한 화면(clip)을 t초 시점으로 그림 (13초 넘으면 처음부터 다시)
function term(name, x, y, w, h, t, a = 1, label = null, hl = null) {
  if (a <= 0) return; const C = CLIPS[name]; ctx.save(); ctx.globalAlpha *= a;
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; box(x, y, w, h, 14, '#0a0e14', hl || LINE, 1, hl ? 4 : 2); ctx.shadowBlur = 0;
  box(x, y, w, 40, 14, '#1c2230'); ctx.fillStyle = '#1c2230'; ctx.fillRect(x, y + 26, w, 14);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + 24 + i * 22, y + 20, 7, 0, 7); ctx.fill(); });
  text(label || ('genact -m ' + name), x + w / 2, y + 21, Math.min(22, w / 22), SUB, 600, 'center', 1, MONO);
  const fs = Math.min((w - 24) / C.cols / .6, (h - 56) / C.rows / 1.22), lh = fs * 1.22;
  const n = C.frames.length, fr = C.frames[Math.max(0, Math.floor(((t % 13) + 13) % 13 * C.fps)) % n];
  ctx.beginPath(); ctx.rect(x + 8, y + 44, w - 16, h - 52); ctx.clip();
  ctx.font = `500 ${fs}px ${MONO}`; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
  const cw = ctx.measureText('M').width;
  fr.forEach((row, j) => { let cx = x + 12; row.forEach(([s, col]) => { ctx.fillStyle = col; ctx.fillText(s, cx, y + 50 + j * lh); cx += s.length * cw; }); });
  ctx.restore();
}
// 세트 뒷면: 나무 버팀목 + 안내 글 (앞면만 있는 영화 세트의 뒤쪽)
function setBack(x, y, w, h, lines, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; box(x, y, w, h, 14, '#2a2118', '#6b5233', 1, 3);
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.strokeStyle = 'rgba(160,120,70,.55)'; ctx.lineWidth = Math.max(8, w / 60);
  [[.15, 0, .15, 1], [.85, 0, .85, 1], [0, .5, 1, .5], [.15, 0, .85, 1], [.85, 0, .15, 1]].forEach(([a1, b1, a2, b2]) => { ctx.beginPath(); ctx.moveTo(x + a1 * w, y + b1 * h); ctx.lineTo(x + a2 * w, y + b2 * h); ctx.stroke(); });
  ctx.restore(); ctx.save(); ctx.globalAlpha *= a;
  const fs = Math.min(54, w / 13); box(x + w * .08, y + h / 2 - lines.length * fs * .8 - 20, w * .84, lines.length * fs * 1.6 + 40, 16, 'rgba(11,16,32,.92)', GOLD, 1, 3);
  lines.forEach((l, i) => text(l, x + w / 2, y + h / 2 + (i - (lines.length - 1) / 2) * fs * 1.6, fit(l, i ? fs * .8 : fs, w * .78, 700), i ? INK : GOLD, 700, 'center', 1, i ? F : PB));
  ctx.restore();
}
// 세트 뒤집기: k 0→1 동안 가로로 접혔다 펴지며 앞면 → 뒷면
function flip(x, y, w, h, k, front, back) {
  const s = Math.abs(Math.cos(Math.PI * k)); ctx.save(); ctx.translate(x + w / 2, 0); ctx.scale(Math.max(.02, s), 1); ctx.translate(-(x + w / 2), 0);
  if (k < .5) front(); else back(); ctx.restore();
}
function rows(c, lt, R, items, opt = {}) { // 한 줄씩 나타나는 카드 목록 [글, 색, 고정폭?]
  const n = items.length, gap = opt.gap || 18, h = Math.min(opt.h || 120, (R.h - gap * (n - 1)) / n), y0 = R.y + (R.h - (h * n + gap * (n - 1))) / 2;
  items.forEach(([s, col, mono], i) => {
    const k = ap(lt, cs(c, i + (opt.off || 0))), y = y0 + i * (h + gap) + (1 - k) * 20;
    box(R.x, y, R.w, h, 16, CARD, col || LINE, k, 3); ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = col || BLUE; ctx.fillRect(R.x, y + 12, 8, h - 24); ctx.restore();
    const fs = fit(s, opt.fs || 40, R.w - 80, 700); text(s, R.x + 40, y + h / 2, fs, INK, 700, 'left', k, mono ? MONO : F);
  });
}
function chip(s, x, y, size, col, a) { return pill(s, x, y, size, col, a); }
function bar(x, y, w, h, val, max, col, k, label, a = 1, fs = 28) {
  if (a <= 0) return; box(x, y, w, h, h / 2, 'rgba(255,255,255,.06)', null, a); box(x, y, Math.max(h, w * Math.min(1, val / max) * k), h, h / 2, col, null, a);
  text(label, x + Math.max(h, w * Math.min(1, val / max) * k) + 16, y + h / 2, fs, INK, 800, 'left', a);
}
const LR = { x: 60, y: 120, w: 1800, h: 800 };

const DRAW_LONG = {
  preview(c, lt) {
    const t = lt, w = 860, h = 600, y = 170;
    term('cc', 70, y, w, h, t + 2, ap(lt, 0));
    const kf = ease(prog(lt, cs(c, 1) + .5, cs(c, 1) + 1.7));
    flip(990, y, w, h, kf, () => term('download', 990, y, w, h, t, ap(lt, 0)), () => setBack(990, y, w, h, ['세트 뒷면', '빈 폴더 · 생긴 파일 0개']));
    KIT.stamp(ctx, '실제 작업 없음', 960, 120, ap(lt, cs(c, 1), .5), RED, 46);
    KIT.stamp(ctx, '213MB → 파일 0개', 1420, 840, ap(lt, cs(c, 2), .5), GOLD, 48);
  },
  title(c, lt) {
    ['cc', 'memdump', 'bruteforce', 'download'].forEach((m, i) => term(m, 60 + i * 455, 620, 435, 300, lt + i, .35 * ap(lt, 0)));
    const k = ap(lt, 0); ctx.save(); ctx.globalAlpha = k; ctx.font = `700 150px ${PB}`; ctx.fillStyle = GREEN; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('genact', 960, 250); ctx.restore();
    text('젠액트 · 바쁜 척 화면 생성기', 960, 370, 44, SUB, 700, 'center', k);
    text('일반인 쓸모 ★★½☆☆ (2.5)', 960, 470, 64, GOLD, 900, 'center', ap(lt, cs(c, 1)));
    text('명령 창에 일하는 척 화면을 띄우는 무료 프로그램', 960, 560, 40, INK, 700, 'center', ap(lt, cs(c, 2)));
  },
  what(c, lt) {
    // 왼쪽: 영화 세트 건물(앞면 → 뒷면), 오른쪽: genact 창(앞면 → 뒷면)
    const kb1 = ease(prog(lt, cs(c, 0) + 1.6, cs(c, 0) + 2.8)), x = 80, y = 200, w = 720, h = 560;
    flip(x, y, w, h, kb1, () => building(x, y, w, h, ap(lt, 0)), () => setBack(x, y, w, h, ['영화 세트 뒷면', '앞면만 있고 뒤는 빈 공간']));
    text('영화 세트장 건물', x + w / 2, y + h + 50, 36, SUB, 700, 'center', ap(lt, 0));
    const k1 = ap(lt, cs(c, 1)), kb2 = ease(prog(lt, cs(c, 3), cs(c, 3) + 1.2)), X = 1000, Y = 200, Wd = 840;
    flip(X, Y, Wd, h, kb2, () => term('kernel_compile', X, Y, Wd, h, lt, k1, 'genact = 명령 창용 영화 세트', lt > cs(c, 2) && lt < cs(c, 3) ? GREEN : null),
      () => setBack(X, Y, Wd, h, ['genact 뒷면', '파일 만들기 없음 · 인터넷 접속 없음']));
    text('genact', X + Wd / 2, y + h + 50, 40, GREEN, 700, 'center', k1, PB);
    const k4 = ap(lt, cs(c, 4)); ['장면(모듈) 21가지', '만든 사람 svenstaro(독일)', 'MIT 라이선스', '⭐ 12,233'].forEach((s, i) => chip(s, 330 + i * 420, 892, 30, BLUE, k4));
  },
  install(c, lt) {
    rows(c, lt, { x: 140, y: 150, w: 1640, h: 760 }, [
      ['① Releases → genact-1.6.0-x86_64-pc-windows-msvc.exe (977KB)', BLUE, true],
      ['설치 과정 없음 · 받은 파일을 명령 프롬프트에서 실행', GREEN],
      ['② scoop install genact (공식 안내)', BLUE, true],
      ['시연(리눅스): cargo install genact 90초 · 버전 1.6.0', GOLD, true],
      ['Windows 실행은 공식 안내 기준 · 시연에서는 확인 전', RED]], { h: 120 });
  },
  usage(c, lt) {
    rows(c, lt, { x: 140, y: 150, w: 1640, h: 760 }, [
      ['genact            → 21가지 장면 무작위 · 멈추기 Ctrl+C', GREEN, true],
      ['genact -m cc      → 원하는 장면만 · genact -l → 목록', BLUE, true],
      ['-s 5 → 5배 빠르게 · --exit-after-time 10min → 10분 뒤 종료', GOLD, true],
      ['장면고르기.bat → 번호(1~5)와 시간(분)만 고르기', PURPLE]], { h: 150 });
  },
  demo1(c, lt) {
    term('cc', 70, 150, 880, 640, lt, ap(lt, 0), 'genact -m cc', lt < cs(c, 1) ? GREEN : null);
    term('kernel_compile', 970, 150, 880, 640, lt + 4, ap(lt, cs(c, 1)), 'genact -m kernel_compile', lt >= cs(c, 1) && lt < cs(c, 2) ? GREEN : null);
    KIT.stamp(ctx, '무작위로 지어낸 글자', 960, 470, ap(lt, cs(c, 2), .5), GOLD, 50);
    chip('장면 하나 9.5초 ~ 56초 → 다음 장면', 960, 860, 34, BLUE, ap(lt, cs(c, 3)));
  },
  demo2(c, lt) {
    const x = 70, y = 150, w = 1060, h = 600, kf = ease(prog(lt, cs(c, 2) + .3, cs(c, 2) + 1.5));
    flip(x, y, w, h, kf, () => term('download', x, y, w, h, lt, ap(lt, 0), 'genact -m download'), () => setBack(x, y, w, h, ['빈 폴더 확인', '실행 전 0개 → 실행 후 0개']));
    const k1 = ap(lt, cs(c, 1)), v = DL.shown_max_MiB * ease(prog(lt, cs(c, 1), cs(c, 1) + 2));
    box(1180, 170, 680, 230, 18, CARD, BLUE, k1, 3); text('화면에 나온 내려받은 양', 1520, 220, 32, SUB, 700, 'center', k1);
    text(v.toFixed(0) + ' MiB', 1520, 320, 96, BLUE, 700, 'center', k1, PB);
    const k2 = ap(lt, cs(c, 2) + 1.5, .5); box(1180, 430, 680, 230, 18, CARD, GOLD, k2, 3); text('폴더에 실제로 생긴 파일', 1520, 480, 32, SUB, 700, 'center', k2);
    text(DL.files_after + '개', 1520, 580, 110, GOLD, 700, 'center', k2, PB);
    const k3 = ap(lt, cs(c, 3)); chip('Saving work to disk...', 600, 820, 36, INK, k3); KIT.stamp(ctx, '가짜 문구', 920, 800, ap(lt, cs(c, 3) + .8, .5), RED, 40);
    chip('인터넷 끊고 실행 → 그대로 작동', 1520, 820, 34, GREEN, ap(lt, cs(c, 4)));
  },
  demo3(c, lt) {
    const W2 = 880, H2 = 380, P = [[70, 140], [970, 140], [70, 540], [970, 540]];
    ['bruteforce', 'botnet', 'memdump', 'cryptomining'].forEach((m, i) => { const st = [0, 0, 1, 2][i];
      term(m, P[i][0], P[i][1], W2, H2, lt + i * 2, ap(lt, cs(c, st) + (i === 1 ? 1.5 : 0)), 'genact -m ' + m, i === 3 && lt > cs(c, 2) ? GOLD : null); });
    KIT.stamp(ctx, '그래픽카드 0개', 1410, 730, ap(lt, cs(c, 3), .5), RED, 52);
    const k = ap(lt, cs(c, 4)); if (k > 0) { box(160, 400, 1600, 140, 20, 'rgba(1,4,9,.94)', RED, k, 4); text('⚠ 남에게 "해킹당했다"고 겁주는 장난은 하지 않기', 960, 470, 50, RED, 800, 'center', k); }
  },
  demo4(c, lt) {
    const names = Object.keys(CLIPS), k1 = 1 - .75 * ap(lt, cs(c, 1));
    names.forEach((m, i) => term(m, 40 + (i % 4) * 462, 120 + Math.floor(i / 4) * 272, 450, 260, lt + i * .7, ap(lt, i * .08, .5) * k1, m));
    const k = ap(lt, cs(c, 1)); if (k <= 0) return;
    box(140, 130, 1640, 790, 20, 'rgba(13,17,23,.95)', LINE, k, 2);
    text('장면 하나가 끝날 때까지 걸린 시간 (한 번씩 실행, 90초에서 측정 중단)', 960, 170, 30, SUB, 700, 'center', k);
    const all = [...DONE, ...RES.modules.filter(r => !DONE.includes(r))];
    all.forEach((r, i) => { const y = 205 + i * 33.5, done = DONE.includes(r), col = done ? (r === DONE[0] || r === DONE[DONE.length - 1] ? GOLD : GREEN) : RED;
      const kk = ap(lt, cs(c, 1) + .3 + i * .05, .5) * (done ? 1 : ap(lt, cs(c, 3) - .2, .5) * .99 + .01);
      text(r.module, 480, y + 13, 22, done ? INK : SUB, 600, 'right', k, MONO);
      bar(500, y, 1050, 24, Math.min(r.sec, 90), 90, col, kk, done ? r.sec.toFixed(1) + '초' : '약 90초+', k, 22); });
  },
  demo5(c, lt) {
    const k = ap(lt, 0); text('같은 10초 동안 나온 줄 수 (kernel_compile)', 520, 190, 34, SUB, 700, 'center', k);
    [[1, '기본'], [5, '-s 5'], [20, '-s 20']].forEach(([f, lab], i) => { const y = 250 + i * 110, kk = ap(lt, i * .9);
      text(lab, 200, y + 30, 34, INK, 700, 'right', kk, MONO); bar(230, y, 640, 60, SP[f], 420, [SUB, BLUE, GREEN][i], ease(prog(lt, i * .9, i * .9 + 1.6)), SP[f] + '줄', kk, 32); });
    const k1 = ap(lt, cs(c, 1)); box(1080, 170, 760, 330, 20, CARD, GOLD, k1, 3);
    text('--exit-after-time 1min', 1460, 230, 34, GOLD, 600, 'center', k1, MONO);
    const v = 60.5 * ease(prog(lt, cs(c, 1), cs(c, 1) + 2)); text(v.toFixed(1) + '초', 1460, 350, 110, INK, 700, 'center', k1, PB);
    text('에 스스로 종료', 1460, 450, 34, SUB, 700, 'center', k1);
    KIT.stamp(ctx, 'CPU ' + MX.cpu_percent + '%', 560, 720, ap(lt, cs(c, 2), .5), GREEN, 64);
    KIT.stamp(ctx, '메모리 ' + MX.rss_mb_max + 'MB', 1340, 720, ap(lt, cs(c, 2) + 1, .5), BLUE, 64, 6);
    chip('화면만 바쁘고 컴퓨터는 거의 쉼 (30초 실행 측정)', 960, 870, 34, INK, ap(lt, cs(c, 3)));
  },
  uses(c, lt) {
    term('memdump', 1240, 180, 620, 680, lt, .9 * ap(lt, 0), '녹화용 소품 화면');
    rows(c, lt, { x: 60, y: 180, w: 1140, h: 680 }, [['① 영상·발표용 "컴퓨터 작업 중" 배경', BLUE], ['② 연극·방탈출·행사 무대 모니터 소품', GOLD], ['③ 가족·친구와 해커 흉내 놀이 → 끝나면 정체 밝히기', GREEN]], { h: 170, fs: 38 });
  },
  cons(c, lt) {
    text('아쉬운 점', 960, 170, 60, GOLD, 700, 'center', ap(lt, 0), PB);
    rows(c, lt, { x: 160, y: 240, w: 1600, h: 660 }, [['① 쓸 곳이 재미·영상 소품 정도', RED], ['② 화면 글자는 모두 영어 · 한국어 장면 없음', RED], ['③ 명령 창 없이 실행하면 일부 장면(ansible) 오류로 멈춤', RED], ['④ 화면 꺼짐 방지(--inhibit)·웹 버전·Windows 실행은 확인 못 함', RED]], { off: 1, h: 140 });
  },
  summary(c, lt) {
    text('정리', 960, 170, 60, GOLD, 700, 'center', ap(lt, 0), PB);
    rows(c, lt, { x: 160, y: 240, w: 1600, h: 660 }, [['✔ 앞면만 있는 명령 창 영화 세트 · 장면 21가지', GREEN], ['✔ Windows 실행 파일 하나 977KB · 장면 -m · 속도 -s', GREEN], ['✔ 213MB 받는 척해도 파일 0개 · CPU 0.04%', GREEN], ['✔ 회사 업무나 남을 속이는 데는 쓰지 않기', GOLD]], { off: 1, h: 140 });
  },
  end(c, lt) { endCard(c, lt, { x: 0, y: 60, w: 1920, h: 900 }, 72); },
};
// 영화 세트 건물 앞면 (간단한 그림)
function building(x, y, w, h, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; box(x, y + h * .12, w, h * .88, 6, '#8a6d55', '#5a4535', 1, 3);
  ctx.fillStyle = '#5a4535'; ctx.beginPath(); ctx.moveTo(x - 20, y + h * .14); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + w + 20, y + h * .14); ctx.fill();
  for (let r = 0; r < 3; r++) for (let q = 0; q < 4; q++) box(x + 60 + q * (w - 120) / 4 + 10, y + h * .22 + r * h * .2, (w - 120) / 4 - 20, h * .13, 4, '#f2d38a', '#5a4535', 1, 3);
  box(x + w / 2 - 60, y + h * .78, 120, h * .22, 4, '#3b2a1e'); text('앞면', x + w / 2, y + h * .07 + 20, 34, INK, 700, 'center', 1, PB); ctx.restore();
}
function endCard(c, lt, R, big = 64) {
  const cx = R.x + R.w / 2, k = ap(lt, 0), v = R.h > R.w;
  text('genact · 바쁜 척 화면', cx, R.y + R.h * (v ? .3 : .28), big * .8, GREEN, 700, 'center', k, PB);
  const Ls = wrap('다음에 또 멋진 오픈소스 소개하겠습니다!', R.w - 80, big, 900);
  Ls.forEach((l, i) => text(l, cx, R.y + R.h * (v ? .42 : .45) + i * big * 1.3, big, INK, 900, 'center', k));
  const k2 = ap(lt, .8), yy = R.y + R.h * (v ? .78 : .8);
  if (v) { let j = 0; DISCLAIMER.forEach(d => wrap(d, R.w - 60, 28, 500).forEach(l => text(l, cx, yy + (j++) * 44, 28, SUB, 500, 'center', k2))); }
  else DISCLAIMER.forEach((d, i) => { const fs = fit(d, 24, R.w - 40, 500); text(d, cx, yy + i * 38, fs, SUB, 500, 'center', k2); });
}

// ───── 과정 애니메이션 (숏폼 대본, 가로·세로 공용)
function DRAW_ANIM(c, lt, W, H) {
  const v = H > W, R = v ? { x: 50, y: 230, w: W - 100, h: 1250 } : { x: 120, y: 90, w: W - 240, h: 820 }, cx = R.x + R.w / 2;
  if (c.id === 's_hook') { const h = v ? 1000 : 760; term('cc', R.x, R.y + (v ? 60 : 0), R.w, h, lt + 2, ap(lt, 0));
    KIT.stamp(ctx, '실제 작업 0', cx, R.y + (v ? 560 : 380), ap(lt, 3, .5), RED, v ? 80 : 70); }
  if (c.id === 's_what') { const ms = ['cc', 'bruteforce', 'download', 'memdump', 'botnet', 'simcity'], cols = v ? 2 : 3, ww = (R.w - (cols - 1) * 16) / cols, hh = v ? 300 : 360;
    ms.forEach((m, i) => term(m, R.x + (i % cols) * (ww + 16), R.y + (v ? 40 : 0) + Math.floor(i / cols) * (hh + 16), ww, hh, lt + i, ap(lt, i * .25, .5) * (1 - .6 * ap(lt, cs(c, 1))), m));
    KIT.stamp(ctx, '장면 21가지', cx, R.y + (v ? 520 : 380), ap(lt, cs(c, 1), .5), GOLD, v ? 90 : 80); }
  if (c.id === 's_dl') { const h = v ? 760 : 620, y = R.y + (v ? 40 : 0), kf = ease(prog(lt, 3.6, 4.8));
    flip(R.x, y, R.w, h, kf, () => term('download', R.x, y, R.w, h, lt, ap(lt, 0)), () => setBack(R.x, y, R.w, h, ['세트 뒷면: 빈 폴더', '실행 전 0개 → 실행 후 0개']));
    const v2 = DL.shown_max_MiB * ease(prog(lt, .5, 3)); text(v2.toFixed(0) + ' MiB 받는 척', cx, y + h + (v ? 110 : 80), v ? 70 : 60, BLUE, 700, 'center', ap(lt, .3), PB);
    KIT.stamp(ctx, '파일 0개', cx, y + h / 2 + (v ? 320 : 220), ap(lt, 5, .5), GOLD, v ? 90 : 70); }
  if (c.id === 's_gpu') { const h = v ? 760 : 620, y = R.y + (v ? 40 : 0); term('cryptomining', R.x, y, R.w, h, lt, ap(lt, 0), 'genact -m cryptomining', GOLD);
    KIT.stamp(ctx, '그래픽카드 0개', cx, y + h * .45, ap(lt, 2.2, .5), RED, v ? 76 : 64);
    KIT.stamp(ctx, 'CPU ' + MX.cpu_percent + '%', cx, y + h + (v ? 140 : 100), ap(lt, cs(c, 1), .5), GREEN, v ? 76 : 60, 5); }
  if (c.id === 's_end') { const a = ap(lt, 0); box(R.x + (v ? 0 : 300), R.y + 30, R.w - (v ? 0 : 600), v ? 300 : 230, 20, CARD, BLUE, a, 3);
    text('Windows 실행 파일 하나', cx, R.y + (v ? 110 : 90), v ? 46 : 40, SUB, 700, 'center', a);
    text('977KB · 설치 과정 없음', cx, R.y + (v ? 220 : 180), v ? 64 : 56, BLUE, 700, 'center', a, PB);
    const k2 = ap(lt, 1.5), yb = R.y + (v ? 520 : 400); text('일반인 쓸모 ★★½☆☆ (2.5)', cx, yb, v ? 64 : 56, GOLD, 900, 'center', k2);
    const k3 = ap(lt, cs(c, 0) + 5.5); box(R.x + (v ? 0 : 300), yb + (v ? 110 : 80), R.w - (v ? 0 : 600), v ? 170 : 120, 18, 'rgba(1,4,9,.9)', RED, k3, 3);
    para('⚠ 남을 속이는 데 쓰지 않기', cx, yb + (v ? 195 : 140), R.w - 60, v ? 48 : 44, RED, 800, 'center', k3); }
}
