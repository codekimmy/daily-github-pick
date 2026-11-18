// 장면 그리기. 장(c)의 자막 시작 시각(c.cues[i][0])에 맞춰 화면 요소가 하나씩 나타난다 → 다 나타난 뒤 자막 길이(최소 3초)만큼 멈춤
// 그림: img/ (prep_img.py가 실제 결과 GIF·원본 영상에서 꺼낸 프레임) · 숫자: data.js (RES = 시연 측정값)
// 연출(tools/kit/README.md): 돋보기 확대 비교(2026-11-16-vtracer zoomBox), 설정별 막대 비교, 도장 배지 + 새 연출 '크레파스 상자'(crayons)
const cs = (c, i) => c.cues[Math.min(i, c.cues.length - 1)][0];
const ap = (lt, t, d = .7) => out3(prog(lt, t, t + d));
const C = RES.clips, EX = RES.extra, MB = kb => (kb / 1024).toFixed(kb < 1024 ? 2 : 1) + 'MB', KB = kb => Math.round(kb) + 'KB';
const NAME = { src: '원본 영상', ffmpeg_basic: 'ffmpeg 기본', ffmpeg_palette: 'ffmpeg 팔레트', gifski_q90: 'gifski', gifski_q50: 'gifski -Q 50' };
const COL = { ffmpeg_basic: RED, ffmpeg_palette: PURPLE, gifski_q90: GREEN, gifski_q50: GOLD, src: SUB };

// 그림 미리 불러오기
const IMG = {}, KEYS = [];
['photo', 'sunset'].forEach(c => ['src', 'ffmpeg_basic', 'ffmpeg_palette', 'gifski_q90', 'gifski_q50'].forEach(m => { KEYS.push(`${c}_${m}`); for (let i = 0; i < 20; i++) KEYS.push(`seq/${c}_${m}_${i}`); }));
['screen_src', 'screen_ffmpeg_palette', 'screen_gifski_q90'].forEach(k => KEYS.push(k)); for (let i = 0; i < 20; i++) KEYS.push(`seq/screen_src_${i}`);
const IMG_READY = Promise.all(KEYS.map(k => new Promise(r => { const im = new Image(); im.onload = r; im.onerror = () => { console.log('missing', k); r(); }; im.src = `img/${k}.png`; IMG[k] = im; })));
// 재생: 원본 초당 20장 중 5장마다 1장 → 초당 4장씩 넘기면 실제 속도(5초에 한 바퀴)
const seq = (clip, m, t) => `seq/${clip}_${m}_${Math.floor(((t % 5) + 5) % 5 * 4) % 20}`;

function pic(key, x, y, w, h, a = 1, smooth = false) {
  if (a <= 0 || !IMG[key]) return; ctx.save(); ctx.globalAlpha *= a; ctx.imageSmoothingEnabled = smooth; ctx.drawImage(IMG[key], x, y, w, h); ctx.restore();
  box(x, y, w, h, 0, null, LINE, a, 2);
}
// 돋보기 확대 (2026-11-16-vtracer zoomBox를 고쳐 씀): 그림 중심 (cx, cy)는 그림 가로·세로 비율(0~1), z배 확대, 점 하나하나가 보이게 부드럽게 하지 않음
function zoomBox(key, x, y, w, h, cx, cy, z, a = 1) {
  if (a <= 0 || !IMG[key]) return; const im = IMG[key], S = (w / im.width) * z; ctx.save(); ctx.globalAlpha *= a;
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.imageSmoothingEnabled = false;
  const ox = clamp(x + w / 2 - cx * im.width * S, x + w - im.width * S, x), oy = clamp(y + h / 2 - cy * im.height * S, y + h - im.height * S, y);
  ctx.drawImage(im, ox, oy, im.width * S, im.height * S); ctx.restore(); box(x, y, w, h, 0, null, LINE, a, 2);
}
// 그림 + 위 이름표 + 아래 크기
function panel(key, x, y, w, h, a, lab, col, size, z = 1, cx = .5, cy = .5) {
  if (a <= 0) return; if (z > 1.01) zoomBox(key, x, y, w, h, cx, cy, z, a); else pic(key, x, y, w, h, a);
  pill(lab, x + w / 2, y - 30, Math.min(26, w / 14), col, a);
  if (size) text(size, x + w / 2, y + h + 44, Math.min(44, w / 10), col, 900, 'center', a);
  if (z > 1.01) pill('×' + z.toFixed(1), x + w - 60, y + h - 36, 22, GOLD, a);
}
// 도장 배지 (Noto 글꼴): 크게 → 제자리 '쾅'
function stamp(s, x, y, k, color = GOLD, size = 48, rot = -7) {
  if (k <= 0) return; const sc = k < .6 ? 1.8 - (k / .6) * .8 : 1; ctx.save(); ctx.globalAlpha *= Math.min(1, k * 2.5);
  ctx.translate(x, y); ctx.rotate(rot * Math.PI / 180); ctx.scale(sc, sc); ctx.font = `900 ${size}px ${F}`;
  const w = ctx.measureText(s).width + size * .9, h = size * 1.6; ctx.fillStyle = 'rgba(1,4,9,.9)'; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = color; ctx.lineWidth = size * .09; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(s, 0, size * .04); ctx.restore();
}
// 설정별 막대 비교: 같은 기준(max)으로 막대가 자람
function hbar(x, y, w, h, val, max, col, k, lab, valLab, a = 1, fs = 30) {
  if (a <= 0) return; text(lab, x - 20, y + h / 2, fs, INK, 700, 'right', a);
  box(x, y, w, h, 10, 'rgba(255,255,255,.06)', null, a); const bw = Math.max(12, w * Math.min(1, val / max) * k); box(x, y, bw, h, 10, col, null, a);
  text(valLab, x + bw + 16, y + h / 2, fs, col, 900, 'left', a * Math.min(1, k * 2));
}
// 새 연출 '크레파스 상자': 16×16칸 = 256색. pal(i) → 색. 상자 뚜껑에 이름
function crayons(x, y, w, lab, pal, a = 1, k = 1, col = GOLD) {
  if (a <= 0) return; const n = 16, cw = w / n, h = cw * n * .62; box(x - 14, y - 60, w + 28, h + 80, 18, CARD, col, a, 3);
  text(lab, x + w / 2, y - 30, Math.min(30, w / 11), col, 800, 'center', a);
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < 256; i++) { if (i / 256 > k) break; const cx = x + (i % n) * cw, cy = y + Math.floor(i / n) * (h / n); ctx.fillStyle = pal(i); ctx.fillRect(cx + 1, cy + 1, cw - 2, h / n - 2); }
  ctx.restore();
}
const hsl = (h, s, l) => `hsl(${h},${s}%,${l}%)`;
const PAL_FIX = i => hsl((i * 37) % 360, 70, 30 + (i % 5) * 12);                          // 정해진 크레파스(여러 색이 고르게)
const PAL_SCENE = s => i => hsl(10 + s * 8 + (i % 16) * 2.2, 55 + (i % 7) * 5, 18 + Math.floor(i / 16) * 4.4); // 장면에 맞춘 노을색
function rows(c, lt, R, items, opt = {}) { // 한 줄씩 나타나는 카드 목록 [글, 색, 고정폭?]
  const n = items.length, gap = opt.gap || 18, h = Math.min(opt.h || 120, (R.h - gap * (n - 1)) / n), y0 = R.y + (R.h - (h * n + gap * (n - 1))) / 2;
  items.forEach(([s, col, mono], i) => {
    const k = ap(lt, cs(c, i + (opt.off || 0))), y = y0 + i * (h + gap) + (1 - k) * 20;
    box(R.x, y, R.w, h, 16, CARD, col || LINE, k, 3); ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = col || BLUE; ctx.fillRect(R.x, y + 12, 8, h - 24); ctx.restore();
    const fs = fit(s, opt.fs || 40, R.w - 80, 700); text(s, R.x + 40, y + h / 2, fs, INK, 700, 'left', k, mono ? MONO : F);
  });
}
const LR = { x: 60, y: 120, w: 1800, h: 800 };
const S = C.sunset, P = C.photo, SC = C.screen;

const DRAW_LONG = {
  preview(c, lt) {
    const w = 840, h = 560, y = 170, z = 1 + 3 * ease(prog(lt, cs(c, 2), cs(c, 2) + 1.5));
    panel(z > 1.01 ? 'sunset_ffmpeg_basic' : seq('sunset', 'ffmpeg_basic', lt), 80, y, w, h, ap(lt, 0), 'ffmpeg 기본 변환', RED, '', z, .5, .3);
    panel(z > 1.01 ? 'sunset_gifski_q90' : seq('sunset', 'gifski_q90', lt), 1000, y, w, h, ap(lt, 0), 'gifski', GREEN, '', z, .5, .3);
    const k = ap(lt, cs(c, 1));
    text(MB(S.ffmpeg_basic.kb), 80 + w / 2, y + h + 60, 64, RED, 900, 'center', k); text(MB(S.gifski_q90.kb), 1000 + w / 2, y + h + 60, 64, GREEN, 900, 'center', k);
    stamp('용량 1/4', 1420, 230, ap(lt, cs(c, 2) + 1.6, .5), GOLD, 56);
  },
  title(c, lt) {
    const k = ap(lt, 0); pic(seq('sunset', 'gifski_q90', lt), 0, 0, 1920, 1280, .22 * k, true);
    ctx.fillStyle = `rgba(13,17,23,${.5 * k})`; ctx.fillRect(0, 0, 1920, 1080);
    text('gifski', 960, 250, 170, GREEN, 900, 'center', k);
    text('기프스키 · 고화질 GIF 만들기', 960, 380, 46, SUB, 700, 'center', k);
    text('일반인 쓸모 ★★★½☆ (3.5)', 960, 490, 66, GOLD, 900, 'center', ap(lt, cs(c, 1)));
    text('영상을 작고 선명한 GIF(움짤)로 바꿔 주는 무료 프로그램', 960, 590, 42, INK, 700, 'center', ap(lt, cs(c, 2)));
  },
  what(c, lt) {
    // ① 크레파스 상자 256개 → ② 정해진 크레파스로 점 찍기(확대 화면) → ③ 장면마다 새 상자 → ④ 색 수 비교 → ⑤ 만든 사람
    const k0 = ap(lt, 0), k1 = ap(lt, cs(c, 1)), k2 = ap(lt, cs(c, 2)), k3 = ap(lt, cs(c, 3)), k4 = ap(lt, cs(c, 4));
    const fadeA = 1 - ap(lt, cs(c, 2) - .6, .6);
    crayons(110, 230, 560, 'GIF 한 장면 = 크레파스 256개', PAL_FIX, k0 * fadeA, prog(lt, 0, 2.5));
    zoomBox('sunset_ffmpeg_basic', 800, 170, 1000, 560, .5, .3, 4, k1 * fadeA); if (k1 * fadeA > 0) pill('흔한 변환: 정해진 색으로 점 찍기 → 점무늬', 1300, 140, 28, RED, k1 * fadeA);
    // gifski: 장면 1·2·3 상자 (색이 장면마다 다름)
    [0, 1, 2].forEach(s => { const a = k2 * ap(lt, cs(c, 2) + s * .9) * (1 - k4); crayons(110 + s * 600, 230, 500, `gifski 장면 ${s + 1}의 크레파스`, PAL_SCENE(s * 3), a, 1, GREEN); });
    if (k3 > 0) {
      const y = 680; hbar(560, y, 900, 56, 255 * k3, 4210, PURPLE, 1, 'ffmpeg 팔레트', '255색', k3 * (1 - k4));
      hbar(560, y + 90, 900, 56, Math.round(4210 * ease(prog(lt, cs(c, 3), cs(c, 3) + 1.8))), 4210, GREEN, 1, 'gifski', Math.round(4210 * ease(prog(lt, cs(c, 3), cs(c, 3) + 1.8))).toLocaleString() + '색', k3 * (1 - k4));
      text('커피잔 영상 50번째 장면에 보이는 색 개수', 960, y - 40, 28, SUB, 600, 'center', k3 * (1 - k4));
    }
    if (k4 > 0) { box(460, 300, 1000, 300, 22, 'rgba(1,4,9,.94)', BLUE, k4, 3); text('Kornel Lesiński', 960, 380, 56, BLUE, 900, 'center', k4);
      text('pngquant(PNG 압축 도구) 제작자 · gif.ski', 960, 460, 34, SUB, 700, 'center', k4); text('⭐ 5,711 · AGPL-3.0-or-later · Rust', 960, 530, 36, INK, 800, 'center', k4); }
  },
  install(c, lt) {
    rows(c, lt, LR, [['① winget install ImageOptim.gifski   (화면 프로그램 1.14.4)', BLUE, true], ['영상을 창에 끌어다 놓고 크기·품질 고르기 (공식 안내)', BLUE],
      ['② gif.ski → 명령어 버전 zip (1.32.0)', PURPLE, true], ['시연(리눅스): cargo install gifski → 39초 · 1.34.0', GREEN, true], ['Windows 설치·실행은 시연에서 확인 전', GOLD]], { h: 128 });
  },
  usage(c, lt) {
    const y = 220, items = [['영상.mp4', SUB], ['ffmpeg\n(영상 풀기)', BLUE], ['gifski\n(색 골라 칠하기)', GREEN], ['결과.gif', GOLD]];
    items.forEach(([s, col], i) => { const a = ap(lt, i * .5), x = 110 + i * 440; box(x, y, 340, 170, 20, CARD, col, a, 3);
      s.split('\n').forEach((l, j, L) => text(l, x + 170, y + 85 + (j - (L.length - 1) / 2) * 50, j ? 30 : 44, j ? SUB : col, 800, 'center', a));
      if (i) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = SUB; ctx.beginPath(); ctx.moveTo(x - 30, y + 85); ctx.lineTo(x - 70, y + 60); ctx.lineTo(x - 70, y + 110); ctx.fill(); ctx.restore(); } });
    const k1 = ap(lt, cs(c, 1)); box(110, 450, 1700, 110, 16, '#05070c', LINE, k1, 2);
    text('ffmpeg -i 영상.mp4 -f yuv4mpegpipe - | gifski -o 결과.gif -', 960, 505, fit('ffmpeg -i 영상.mp4 -f yuv4mpegpipe - | gifski -o 결과.gif -', 40, 1640, 600), GREEN, 600, 'center', k1, MONO);
    const k2 = ap(lt, cs(c, 2)); [['-Q 품질 (기본 90)', GREEN], ['-W 가로 크기', BLUE], ['-r 초당 장면 수 (기본 20)', PURPLE]].forEach(([s, col], i) => pill(s, 400 + i * 560, 640, 32, col, k2));
    const k3 = ap(lt, cs(c, 3)); box(260, 730, 1400, 110, 16, 'rgba(242,193,78,.12)', GOLD, k3, 3); text('⚠ 시연 버전(cargo 기본 설치)은 mp4를 직접 못 읽음 → ffmpeg로 넘김', 960, 785, 34, GOLD, 800, 'center', k3);
  },
  demo1(c, lt) {
    const ms = ['ffmpeg_basic', 'ffmpeg_palette', 'gifski_q90'], w = 560, h = 373, y = 140, z = 1 + 3 * ease(prog(lt, cs(c, 3), cs(c, 3) + 1.5));
    ms.forEach((m, i) => { const x = 60 + i * 620, a = ap(lt, i * .4);
      panel(z > 1.01 ? `sunset_${m}` : seq('sunset', m, lt), x, y, w, h, a, NAME[m], COL[m], '', z, .5, .28);
      const kb = ap(lt, cs(c, 1) + i * .8, 1.5); hbar(x + 10, y + h + 40, w - 200, 44, S[m].kb * kb, S.ffmpeg_basic.kb, COL[m], 1, '', MB(S[m].kb * kb), ap(lt, cs(c, 1)), 30);
      const k2 = ap(lt, cs(c, 2) + i * .5); text('닮은 정도 ' + S[m].ssim.toFixed(3), x + w / 2, y + h + 140, 36, COL[m], 800, 'center', k2); });
    stamp('가장 작고 가장 닮음', 1500, 760, ap(lt, cs(c, 2) + 2, .5), GREEN, 42);
  },
  demo2(c, lt) {
    const w = 800, h = 533, y = 150, z = 1 + 3 * ease(prog(lt, cs(c, 3), cs(c, 3) + 1.5));
    [['ffmpeg_palette', 120], ['gifski_q90', 1000]].forEach(([m, x], i) => { const a = ap(lt, i * .4);
      panel(z > 1.01 ? `photo_${m}` : seq('photo', m, lt), x, y, w, h, a, NAME[m], COL[m], '', z, .45, .45);
      text(MB(P[m].kb), x + w / 2, y + h + 50, 56, COL[m], 900, 'center', ap(lt, cs(c, 1) + i * .6));
      text('닮은 정도 ' + P[m].ssim.toFixed(3), x + w / 2, y + h + 120, 34, SUB, 800, 'center', ap(lt, cs(c, 2))); });
    stamp('약 44% 작음', 1700, 200, ap(lt, cs(c, 1) + 1.2, .5), GREEN, 48);
  },
  demo3(c, lt) {
    pic(lt < cs(c, 1) ? seq('screen', 'src', lt) : 'screen_gifski_q90', 80, 160, 720, 480, ap(lt, 0), true); pill('메모장 타이핑 영상 (직접 만든 화면)', 440, 130, 26, SUB, ap(lt, 0));
    const k = ap(lt, cs(c, 1)), max = 120;
    hbar(1180, 260, 560, 70, SC.ffmpeg_palette.kb * ap(lt, cs(c, 1), 1.5), max, PURPLE, 1, 'ffmpeg 팔레트', KB(SC.ffmpeg_palette.kb * ap(lt, cs(c, 1), 1.5)), k, 34);
    hbar(1180, 370, 560, 70, SC.gifski_q90.kb * ap(lt, cs(c, 1) + .8, 1.5), max, GREEN, 1, 'gifski', KB(SC.gifski_q90.kb * ap(lt, cs(c, 1) + .8, 1.5)), k, 34);
    stamp('화면 녹화는 ffmpeg 팔레트가 더 작음', 1360, 540, ap(lt, cs(c, 2), .5), PURPLE, 38, -4);
    const k3 = ap(lt, cs(c, 3)); box(900, 640, 940, 170, 18, 'rgba(255,123,114,.1)', RED, k3, 3);
    text('ffmpeg 기본 변환: ' + MB(SC.ffmpeg_basic.kb), 1370, 695, 44, RED, 900, 'center', k3); text('색이 적은 화면도 점무늬 + 큰 용량', 1370, 760, 32, SUB, 700, 'center', k3);
  },
  demo4(c, lt) {
    const L = [['gifski 기본 (-Q 90)', P.gifski_q90.kb, GREEN, 0], ['-Q 70', P.gifski_q70.kb, GREEN, 1], ['-Q 50', P.gifski_q50.kb, GOLD, 1],
      ['-W 320', EX.w320.kb, BLUE, 2], ['-r 10', EX.fps10.kb, BLUE, 2], ['-W 320 -r 10', EX.w320_fps10.kb, PURPLE, 3], ['-W 320 -r 10 -Q 70', EX.w320_fps10_q70.kb, PURPLE, 3]];
    L.forEach(([lab, kb, col, ci], i) => { const t0 = cs(c, ci) + (i === 2 || i === 4 || i === 6 ? .8 : 0), k = ease(prog(lt, t0, t0 + 1.5));
      hbar(560, 130 + i * 92, 820, 58, kb * k, P.gifski_q90.kb, col, 1, lab, MB(kb * k), ap(lt, t0, .4), 32); });
    const k4 = ap(lt, cs(c, 1) + 1); zoomBox('photo_gifski_q50', 1560, 200, 300, 300, .45, .45, 3, k4); pill('-Q 50 확대: 얼룩', 1710, 170, 22, GOLD, k4);
    stamp('5.6MB → 0.95MB', 1700, 640, ap(lt, cs(c, 3) + 1, .5), PURPLE, 40);
    const k5 = ap(lt, cs(c, 4)); text('변환 시간: 5초 영상 하나에 0.5~6.9초 (CPU 2개)', 960, 800, 34, SUB, 700, 'center', k5);
  },
  uses(c, lt) { rows(c, lt, LR, [['① 블로그·카페 글에 넣는 사용법 움짤을 작게', BLUE], ['② 여행·반려동물 영상에서 몇 초만 잘라 메신저 움짤로', GREEN], ['③ 상품 소개·발표 자료에 넣을 짧은 움직이는 그림', GOLD]], { h: 150 }); },
  cons(c, lt) {
    text('아쉬운 점', 960, 170, 56, GOLD, 900, 'center', ap(lt, 0));
    rows(c, lt, { x: 140, y: 230, w: 1640, h: 640 }, [['① 화면 녹화처럼 색이 적은 영상은 ffmpeg 팔레트보다 큼 (98KB vs 58KB)', RED], ['② 시연 버전은 영상을 직접 못 읽음 → ffmpeg가 따로 필요', RED],
      ['③ 사진 영상은 장면마다 비교한 점수가 낮음 (0.894 vs 0.947)', RED], ['④ 회사 프로그램에 넣어 팔려면 별도 상업 라이선스 (AGPL)', RED]], { off: 1, h: 130 });
  },
  summary(c, lt) {
    text('정리', 960, 170, 56, BLUE, 900, 'center', ap(lt, 0));
    rows(c, lt, { x: 140, y: 230, w: 1640, h: 640 }, [['✔ gifski = 장면마다 크레파스를 다시 고르는 GIF 화가', GREEN], ['✔ 노을 영상: 5.2MB → 1.4MB, 원본과 닮은 정도 최고', GREEN],
      ['✔ 화면 녹화는 ffmpeg 팔레트 방법이 더 작음', GOLD], ['✔ Windows는 winget으로 화면 프로그램 설치', BLUE]], { off: 1, h: 130 });
  },
  end(c, lt) { endCard(c, lt, { x: 0, y: 60, w: 1920, h: 900 }, 72); },
};
function endCard(c, lt, R, big = 64) {
  const cx = R.x + R.w / 2, k = ap(lt, 0), v = R.h > R.w;
  text('gifski · 작고 선명한 움짤', cx, R.y + R.h * (v ? .3 : .28), big * .8, GREEN, 900, 'center', k);
  const Ls = wrap('다음에 또 멋진 오픈소스 소개하겠습니다!', R.w - 80, big, 900);
  Ls.forEach((l, i) => text(l, cx, R.y + R.h * (v ? .42 : .45) + i * big * 1.3, big, INK, 900, 'center', k));
  const k2 = ap(lt, .8), yy = R.y + R.h * (v ? .78 : .8);
  if (v) { let j = 0; DISCLAIMER.forEach(d => wrap(d, R.w - 60, 28, 500).forEach(l => text(l, cx, yy + (j++) * 44, 28, SUB, 500, 'center', k2))); }
  else DISCLAIMER.forEach((d, i) => { const fs = fit(d, 24, R.w - 40, 500); text(d, cx, yy + i * 38, fs, SUB, 500, 'center', k2); });
}
function DRAW_ANIM(c, lt, W, H) {
  const v = H > W, R = v ? { x: 50, y: 230, w: W - 100, h: 1250 } : { x: 120, y: 90, w: W - 240, h: 820 }, cx = R.x + R.w / 2;
  if (c.id === 's_hook') {
    const w = v ? 840 : 800, h = w * 2 / 3, p1 = v ? [cx - w / 2, R.y + 40] : [R.x, R.y + 60], p2 = v ? [cx - w / 2, R.y + 40 + h + 90] : [R.x + R.w - w, R.y + 60];
    panel(seq('sunset', 'ffmpeg_basic', lt), p1[0], p1[1], w, h, ap(lt, 0), '흔한 변환 ' + MB(S.ffmpeg_basic.kb), RED, '');
    panel(seq('sunset', 'gifski_q90', lt), p2[0], p2[1], w, h, ap(lt, .6), 'gifski ' + MB(S.gifski_q90.kb), GREEN, '');
    stamp('용량 1/4', cx, v ? p2[1] + h - 70 : R.y + 720, ap(lt, 2.5, .5), GOLD, v ? 84 : 70);
  }
  if (c.id === 's_what') {
    const k1 = ap(lt, cs(c, 1)), bw = v ? R.w - 120 : 560;
    if (!v) { [0, 1, 2].forEach(s => crayons(R.x + 30 + s * 570, R.y + 120, 480, `장면 ${s + 1}의 크레파스`, PAL_SCENE(s * 3), ap(lt, s * .8), 1, GREEN)); }
    else { [0, 1].forEach(s => crayons(R.x + 60, R.y + 100 + s * 520, bw, `장면 ${s + 1}의 크레파스`, PAL_SCENE(s * 4), ap(lt, s * .8), 1, GREEN)); }
    const n = Math.round(4210 * ease(prog(lt, cs(c, 1), cs(c, 1) + 1.8)));
    stamp('한 화면 ' + n.toLocaleString() + '색', cx, v ? R.y + 1120 : R.y + 640, k1, GREEN, v ? 80 : 70);
  }
  if (c.id === 's_sun') {
    const z = 1 + 3 * ease(prog(lt, cs(c, 1), cs(c, 1) + 1.5)), w = v ? 840 : 800, h = w * 2 / 3;
    const p1 = v ? [cx - w / 2, R.y + 40] : [R.x, R.y + 60], p2 = v ? [cx - w / 2, R.y + 40 + h + 90] : [R.x + R.w - w, R.y + 60];
    panel(z > 1.01 ? 'sunset_ffmpeg_basic' : seq('sunset', 'ffmpeg_basic', lt), p1[0], p1[1], w, h, ap(lt, 0), '흔한 변환', RED, '', z, .5, .28);
    panel(z > 1.01 ? 'sunset_gifski_q90' : seq('sunset', 'gifski_q90', lt), p2[0], p2[1], w, h, ap(lt, 0), 'gifski', GREEN, '', z, .5, .28);
    stamp(MB(S.ffmpeg_basic.kb) + ' → ' + MB(S.gifski_q90.kb), cx, v ? p2[1] + h - 70 : R.y + 720, ap(lt, .4, .5), GOLD, v ? 72 : 64, -4);
  }
  if (c.id === 's_screen') {
    const w = v ? R.w : 720, h = w * 2 / 3; pic(seq('screen', 'src', lt), v ? R.x : R.x, R.y + 40, w, h, ap(lt, 0), true);
    const bx = v ? R.x + 260 : R.x + 1000, by = v ? R.y + 40 + h + 80 : R.y + 120, bw = v ? R.w - 420 : 520, k = ap(lt, .3);
    hbar(bx, by, bw, 64, SC.ffmpeg_palette.kb * ap(lt, .5, 1.5), 120, PURPLE, 1, 'ffmpeg 팔레트', KB(SC.ffmpeg_palette.kb * ap(lt, .5, 1.5)), k, v ? 34 : 30);
    hbar(bx, by + 100, bw, 64, SC.gifski_q90.kb * ap(lt, 1.2, 1.5), 120, GREEN, 1, 'gifski', KB(SC.gifski_q90.kb * ap(lt, 1.2, 1.5)), k, v ? 34 : 30);
    stamp('색이 많은 영상에 알맞음', cx, v ? by + 330 : R.y + 640, ap(lt, cs(c, 1), .5), GREEN, v ? 60 : 56, -4);
  }
  if (c.id === 's_end') { const a = ap(lt, 0); box(R.x + (v ? 0 : 300), R.y + 30, R.w - (v ? 0 : 600), v ? 300 : 230, 20, CARD, BLUE, a, 3);
    text('Windows 설치 명령 한 줄', cx, R.y + (v ? 110 : 90), v ? 46 : 40, SUB, 700, 'center', a);
    text('winget install ImageOptim.gifski', cx, R.y + (v ? 220 : 180), v ? 40 : 46, BLUE, 600, 'center', a, MONO);
    const k2 = ap(lt, 1.5), yb = R.y + (v ? 520 : 400); text('일반인 쓸모 ★★★½☆ (3.5)', cx, yb, v ? 64 : 56, GOLD, 900, 'center', k2); }
}
