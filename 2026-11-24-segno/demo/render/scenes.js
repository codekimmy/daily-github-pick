// 장면 그리기. 장(c)의 자막 시작 시각(c.cues[i][0])에 맞춰 화면 요소가 하나씩 나타난다 → 다 나타난 뒤 자막 길이(최소 3초)만큼 멈춤
// 숫자: data.js (RES = 2026-11-24 시연 측정값, demo/results.json) · QR 칸 배열: data.js (MAT = segno로 만든 실제 QR, mkdata.py)
// 연출(tools/kit/README.md): 도장 배지, 설정별 막대 비교(가림 시험 ✓/✗ 표) + 새 연출 'QR 스티커 찍기'(qrDraw: 칸이 대각선으로 찍혀 나옴, scan: 읽는 초록 띠)
const cs = (c, i) => c.cues[Math.min(i, c.cues.length - 1)][0];
const ap = (lt, t, d = .7) => out3(prog(lt, t, t + d));
const R0 = RES, stamp = (s, x, y, k, color = GOLD, size = 48, rot = -7) => KIT.stamp(ctx, s, x, y, k, color, size, rot);
const IMG_READY = Promise.resolve();
const ORANGE = '#ff9f43', EL = {}; R0.errorlevel.forEach(e => EL[e.level] = e);
// 새 연출 'QR 스티커 찍기': m = 칸 배열(문자열 줄), (x,y) 왼쪽 위, s = 한 변(흰 여백 포함), k = 0~1 찍힌 정도(왼쪽 위 → 오른쪽 아래 대각선)
function qrDraw(m, x, y, s, k = 1, a = 1, o = {}) {
  if (a <= 0) return; const n = m.length, b = o.border === undefined ? 4 : o.border, cell = s / (n + 2 * b);
  ctx.save(); ctx.globalAlpha *= a;
  if (o.light !== 'transparent') { ctx.fillStyle = o.light || '#ffffff'; ctx.fillRect(x, y, s, s); }
  ctx.fillStyle = o.dark || '#0b0f14';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (m[r][c] !== '1') continue; const h = ((r * 73 + c * 151) % 97) / 97 * .12, d = (r + c) / (2 * n - 2) * .88 + h;
    if (d > k) continue; const pop = clamp((k - d) / .06), z = cell * (.4 + .6 * pop);
    ctx.fillRect(x + (b + c) * cell + (cell - z) / 2, y + (b + r) * cell + (cell - z) / 2, z + .6, z + .6);
  }
  ctx.restore();
}
// 읽는 초록 띠 (k: 0 → 1 위에서 아래로)
function scan(x, y, s, k, a = 1) {
  if (a <= 0 || k <= 0 || k >= 1) return; const yy = y + s * k; ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(0, yy - 60, 0, yy); g.addColorStop(0, 'rgba(126,231,135,0)'); g.addColorStop(1, 'rgba(126,231,135,.35)');
  ctx.fillStyle = g; ctx.fillRect(x - 10, yy - 60, s + 20, 60); ctx.fillStyle = GREEN; ctx.fillRect(x - 14, yy - 3, s + 28, 6); ctx.restore();
}
// 가운데 가림 상자 (pct = 그림 전체 넓이에 대한 %)
function coverBox(x, y, s, pct, a = 1) { if (a <= 0 || pct <= 0) return; const side = s * Math.sqrt(pct / 100); box(x + (s - side) / 2, y + (s - side) / 2, side, side, 4, ORANGE, null, a); }
// 작은 QR 1장을 미리 그려 둔 그림 (1,000장 장면용)
let TILE = null;
function tile() { if (TILE) return TILE; const cv = document.createElement('canvas'); cv.width = cv.height = 66; const keep = ctx; ctx = cv.getContext('2d'); qrDraw(MAT.short, 0, 0, 66, 1, 1, { border: 2 }); ctx = keep; return TILE = cv; }
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
    text(l.s.slice(0, n), x + 30, y + 70 + i * fs * 1.7, l.fs || fs, l.col || INK, 600, 'left', a, MONO); });
}
const mark = (ok, x, y, s, k, a = 1) => ok ? check(x, y, s, k, GREEN, a) : cross(x, y, s, a * clamp(k * 2), RED);
const WIFI_TXT = 'WIFI:T:WPA;S:우리집_5G;P:kimchi2026!;;';

const DRAW_LONG = {
  preview(c, lt) {
    termBox(80, 170, 700, [{ s: 'C:\\> segno "WIFI:T:WPA;', t: cs(c, 0) + .3, col: GOLD, fs: 28 }, { s: '  S:우리집_5G;P:kimchi2026!;;"', t: cs(c, 0) + 1.2, col: GOLD, fs: 28 }, { s: '  -o wifi.png --scale 10', t: cs(c, 0) + 2.1, col: GOLD, fs: 28 }], lt, 0, 28, ap(lt, 0));
    text('가상 와이파이 이름·비밀번호', 430, 470, 32, SUB, 800, 'center', ap(lt, 0));
    const k = prog(lt, cs(c, 1), cs(c, 1) + 2.2); qrDraw(MAT.wifi, 860, 160, 560, k, ap(lt, cs(c, 1)));
    stamp(R0.wifi.sec.toFixed(2) + '초', 1360, 200, ap(lt, cs(c, 1) + 2.3, .5), GOLD, 56);
    scan(860, 160, 560, prog(lt, cs(c, 2), cs(c, 2) + 1.4), 1);
    const k2 = ap(lt, cs(c, 2) + 1.4); if (k2 > 0) { box(1460, 300, 400, 300, 18, CARD, GREEN, k2, 3); text('읽은 내용', 1660, 350, 32, GREEN, 900, 'center', k2);
      ['이름: 우리집_5G', '비밀번호: kimchi2026!', '방식: WPA'].forEach((s, i) => text(s, 1490, 420 + i * 56, 30, INK, 800, 'left', k2)); check(1800, 350, 50, ease(prog(lt, cs(c, 2) + 1.8, cs(c, 2) + 2.4))); }
  },
  title(c, lt) {
    qrDraw(MAT.wifi, 810, 110, 300, prog(lt, .2, 2.2), ap(lt, 0));
    text('segno', 960, 530, 120, GOLD, 900, 'center', ap(lt, 0), MONO);
    text('★★★☆☆ (3)', 960, 680, 64, GOLD, 900, 'center', ap(lt, cs(c, 1)));
    text('와이파이·연락처·주소를 QR 그림으로 만드는 무료 도구', 960, 790, 44, INK, 800, 'center', ap(lt, cs(c, 2)));
  },
  what(c, lt) {
    text('segno = QR 스티커 인쇄소', 960, 130, 60, GOLD, 900, 'center', ap(lt, 0));
    // 주문서 → 스티커
    const k1 = ap(lt, cs(c, 1)); if (k1 > 0) { box(110, 240, 330, 250, 14, '#fffbe6', GOLD, k1, 3); text('주문서', 275, 285, 34, '#5a3e00', 900, 'center', k1);
      ['주소', '와이파이', '연락처'].forEach((s, i) => text('· ' + s, 150, 345 + i * 46, 30, '#5a3e00', 800, 'left', k1)); text('→', 500, 365, 70, SUB, 900, 'center', k1); }
    const big = ease(prog(lt, cs(c, 2), cs(c, 2) + 2)), m = big < .5 ? MAT.short : MAT.k100;
    qrDraw(m, 570, 210, 320, prog(lt, cs(c, 1) + .5, cs(c, 1) + 2.3) * (big > 0 && big < 1 ? (Math.abs(big - .5) * 2) : 1), ap(lt, cs(c, 1)));
    text(big < .5 ? '25 × 25칸' : '61 × 61칸', 730, 570, 32, big < .5 ? INK : GOLD, 900, 'center', ap(lt, cs(c, 1)), MONO);
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) { coverBox(570, 210, 320, 6 * k3, 1); }
    const steps = [['① 주문서 — 넣을 글', '주소 · 와이파이 · 연락처'], ['② 스티커 크기 — 글이 길수록 칸이 많아짐', '21 × 21칸 ~ 177 × 177칸'], ['③ 여분 칸 — 오류 정정 L · M · Q · H', '일부가 가려져도 읽히게']];
    steps.forEach((s, i) => card(s[0], 980, 210 + i * 170, 840, 140, ap(lt, cs(c, i + 1)), [GOLD, BLUE, ORANGE][i], 38, s[1]));
    const k4 = ap(lt, cs(c, 4)); if (k4 > 0) text('파이썬 프로그램 · 별 822개 · BSD-3-Clause(상업적 사용 가능)', 960, 860, 34, SUB, 800, 'center', k4);
  },
  install(c, lt) {
    termBox(260, 170, 1400, [{ s: 'C:\\> python.org 에서 파이썬 설치 (Add python.exe to PATH 체크)', t: cs(c, 0) + .5, col: SUB, fs: 32 }, { s: 'C:\\> py -m pip install segno', t: cs(c, 1) + .3, col: GOLD },
      { s: '→ 시연(리눅스): 0.61초 · 함께 설치되는 프로그램 0개 · 약 0.3MB', t: cs(c, 2) + .3, col: GREEN, fs: 32 }, { s: 'C:\\> segno --ver', t: cs(c, 3) + .2, col: GOLD }, { s: 'Segno 1.6.6', t: cs(c, 3) + 1.2, col: GREEN }], lt, 0, 36, ap(lt, 0));
    text('명령 프롬프트(cmd) 기준 · segno가 안 되면 py -m segno.cli · Windows 실행은 시연 확인 전', 960, 760, 32, SUB, 700, 'center', ap(lt, cs(c, 3)));
  },
  demo1(c, lt) {
    pill('WIFI:T:WPA;S:이름;P:비밀번호;;', 960, 130, 40, GOLD, ap(lt, 0));
    const k = prog(lt, cs(c, 1), cs(c, 1) + 2.2); qrDraw(MAT.wifi, 160, 220, 560, k, ap(lt, cs(c, 1)));
    stamp(R0.wifi.sec.toFixed(2) + '초', 660, 260, ap(lt, cs(c, 1) + 2.3, .5), GOLD, 56);
    const k2 = ap(lt, cs(c, 2)); if (k2 > 0) [['29 × 29칸', '버전 3 · 여분 칸 M(자동으로 올림)'], ['370 × 370 픽셀', '--scale 10 (한 칸 = 10픽셀)'], ['490바이트 PNG', '메일·문자로 보내기 쉬운 크기']].forEach((s, i) => card(s[0], 820, 220 + i * 120, 960, 100, k2 * ap(lt, cs(c, 2) + i * .8), [BLUE, BLUE, BLUE][i], 36, s[1]));
    scan(160, 220, 560, prog(lt, cs(c, 3), cs(c, 3) + 1.4));
    const k3 = ap(lt, cs(c, 3) + 1.2); if (k3 > 0) { box(820, 600, 960, 110, 16, '#010409', GREEN, k3, 3); text('읽은 내용 → ' + WIFI_TXT, 850, 655, 30, GREEN, 700, 'left', k3, MONO); }
    const k4 = ap(lt, cs(c, 4)); if (k4 > 0) pill('휴대폰 카메라로 실제 접속은 시연에서 확인하지 않음', 1300, 800, 30, RED, k4);
  },
  demo2(c, lt) {
    text('연락처 QR — 가상 인물 김하늘 · 010-1234-5678 · sky@example.com', 960, 130, 38, INK, 900, 'center', ap(lt, 0));
    qrDraw(MAT.card, 220, 210, 520, prog(lt, cs(c, 1), cs(c, 1) + 2.2), ap(lt, cs(c, 1)));
    text('MECARD · 33 × 33칸', 480, 770, 40, BLUE, 900, 'center', ap(lt, cs(c, 1)));
    qrDraw(MAT.vcard, 1180, 210, 520, prog(lt, cs(c, 2), cs(c, 2) + 2.2), ap(lt, cs(c, 2)));
    text('vCard(회사 이름 포함) · 41 × 41칸', 1440, 770, 40, PURPLE, 900, 'center', ap(lt, cs(c, 2)));
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) { check(480, 840, 60, ease(prog(lt, cs(c, 3), cs(c, 3) + .7))); check(1440, 840, 60, ease(prog(lt, cs(c, 3) + .4, cs(c, 3) + 1.1))); text('두 형식 모두 한글 이름까지 그대로 읽힘 (zxing-cpp)', 960, 880, 32, GREEN, 800, 'center', k3); }
  },
  demo3(c, lt) {
    const L = R0.length, items = [[MAT.short, '짧은 주소 19자', '25 × 25칸'], [MAT.k100, '한글 100자', '61 × 61칸'], [MAT.k500, '한글 500자', '129 × 129칸']];
    items.forEach((it, i) => { const t0 = cs(c, 1) + i * 1.2, x = 160 + i * 560, a = ap(lt, i === 0 ? cs(c, 0) : t0);
      qrDraw(it[0], x, 160, 460, prog(lt, i === 0 ? cs(c, 0) : t0, (i === 0 ? cs(c, 0) : t0) + 1.6), a);
      text(it[1], x + 230, 670, 38, INK, 900, 'center', a); text(it[2], x + 230, 725, 36, [GREEN, GOLD, RED][i], 900, 'center', a, MONO); });
    const k2 = ap(lt, cs(c, 2)) * (1 - ap(lt, cs(c, 3), .5)); if (k2 > 0) { box(360, 780, 1200, 100, 16, '#010409', RED, k2, 3); text(`한글 ${R0.max_korean}자까지 · 1,000자 → ${R0.toolong.msg}`, 960, 830, 30, RED, 700, 'center', k2, MONO); }
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) { box(360, 780, 1200, 100, 16, CARD, GOLD, k3, 3); text('칸이 촘촘할수록 작게 인쇄하면 읽기 어려움 → 글은 짧게', 960, 830, 34, GOLD, 800, 'center', k3); }
  },
  demo4(c, lt) {
    const lv = ['L', 'M', 'Q', 'H'], k1 = prog(lt, cs(c, 1), cs(c, 1) + 1.5), k2 = prog(lt, cs(c, 2), cs(c, 2) + 1.2), pct = k1 < 1 ? 5 * ease(k1) : 5 + 5 * ease(k2);
    lv.forEach((l, i) => { const x = 110 + i * 440, s = 380, a = ap(lt, i * .5);
      qrDraw(MAT['url' + l], x, 150, s, prog(lt, i * .5, i * .5 + 1.5), a); coverBox(x, 150, s, pct, ap(lt, cs(c, 1)));
      text(l + ' 단계', x + s / 2, 580, 44, GOLD, 900, 'center', a);
      const e = EL[l];
      if (lt > cs(c, 1) + 1.6) { text('5%', x + 120, 650, 34, INK, 800, 'center', 1); mark(e.cover[5], x + 260, 650, 50, ease(prog(lt, cs(c, 1) + 1.6 + i * .3, cs(c, 1) + 2.2 + i * .3))); }
      if (lt > cs(c, 2) + 1.3) { text('10%', x + 120, 720, 34, INK, 800, 'center', 1); mark(e.cover[10], x + 260, 720, 50, ease(prog(lt, cs(c, 2) + 1.3 + i * .3, cs(c, 2) + 1.9 + i * .3))); }
      const k3 = ap(lt, cs(c, 3)); if (k3 > 0) text(e.version * 4 + 17 + ' × ' + (e.version * 4 + 17) + '칸', x + s / 2, 800, 34, [SUB, SUB, SUB, GOLD][i], 900, 'center', k3, MONO); });
    text('같은 주소 · 가운데를 주황 상자로 가림 (그림 넓이의 ' + pct.toFixed(0) + '%)', 960, 110, 34, SUB, 800, 'center', ap(lt, cs(c, 1)));
    stamp('H만 10%', 1720, 300, ap(lt, cs(c, 2) + 2.6, .5), GREEN, 46);
  },
  demo5(c, lt) {
    const C = R0.colors, opt = [{ dark: '#1a2a6c', light: '#ffffff' }, { dark: '#c0392b', light: '#fff7d6' }, { dark: '#d0d0d0', light: '#ffffff' }, { dark: '#ffffff', light: '#000000' }, { dark: '#1a2a6c', light: 'transparent' }];
    C.forEach((cc, i) => { const x = 130 + i * 340, a = ap(lt, i * .6); if (i === 4) box(x, 120, 260, 260, 4, '#2b3440', null, a);
      qrDraw(MAT.urlL, x, 120, 260, 1, a, opt[i]); text(cc.name, x + 130, 410, 28, INK, 800, 'center', a); if (lt > cs(c, 0) + 3) mark(cc.decoded_ok, x + 230, 130, 44, ease(prog(lt, cs(c, 0) + 3 + i * .2, cs(c, 0) + 3.6 + i * .2))); });
    const k1 = ap(lt, cs(c, 1)); if (k1 > 0) { box(130 + 2 * 340 - 10, 110, 280, 320, 10, null, ORANGE, k1, 5); text('휴대폰 카메라는 다를 수 있음', 130 + 2 * 340 + 130, 460, 26, ORANGE, 800, 'center', k1); }
    const k2 = ap(lt, cs(c, 2)); if (k2 > 0) { box(100, 510, 820, 380, 16, '#2b2b2b', null, k2);
      qrDraw(MAT.urlL, 170, 560, 200, 1, k2, { border: 0 }); text('흰 여백 0칸', 270, 800, 30, INK, 800, 'center', k2); mark(R0.border['0'].on_dark, 380, 570, 50, ease(prog(lt, cs(c, 2) + .8, cs(c, 2) + 1.4)), k2);
      qrDraw(MAT.urlL, 560, 540, 260, 1, k2); text('기본 여백 4칸', 690, 840, 30, INK, 800, 'center', k2); mark(R0.border['4'].on_dark, 800, 560, 50, ease(prog(lt, cs(c, 2) + 1.2, cs(c, 2) + 1.8)), k2);
      text('어두운 바탕 위에 놓았을 때', 510, 870, 26, SUB, 700, 'center', k2); }
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) R0.camera.forEach((t, i) => { const y = 540 + i * 70, a = k3 * ap(lt, cs(c, 3) + i * .5); box(980, y - 30, 820, 60, 12, CARD, t.ok ? GREEN : RED, a, 2);
      text(t.name, 1010, y, 30, INK, 800, 'left', a); text(t.ok ? '읽힘' : '실패', 1700, y, 30, t.ok ? GREEN : RED, 900, 'center', a); });
  },
  demo6(c, lt) {
    const done = ease(prog(lt, cs(c, 1), cs(c, 1) + 3)), N = 1000, T = tile(), per = 40, sz = 26;
    ctx.save(); ctx.globalAlpha *= ap(lt, 0);
    for (let i = 0; i < N; i++) { if (i > done * N) break; const x = 120 + (i % per) * (sz + 2), y = 160 + Math.floor(i / per) * (sz + 2); ctx.drawImage(T, x, y, sz, sz); }
    ctx.restore();
    box(118, 158, per * (sz + 2), 25 * (sz + 2), 6, null, LINE, ap(lt, 0), 2);
    pill('table/' + Math.round(done * N) + ' · ' + Math.round(done * N) + '장', 1640, 230, 34, done < 1 ? GOLD : GREEN, ap(lt, cs(c, 1)));
    stamp(R0.many1000 + '초', 1640, 400, ap(lt, cs(c, 1) + 3, .5), GOLD, 64);
    const k2 = ap(lt, cs(c, 2)); if (k2 > 0) { text('5장 골라 읽기', 1640, 540, 34, INK, 900, 'center', k2); [1, 250, 500, 750, 1000].forEach((n, i) => { text('#' + n, 1500, 600 + i * 50, 28, SUB, 800, 'left', k2); check(1760, 600 + i * 50, 36, ease(prog(lt, cs(c, 2) + .5 + i * .3, cs(c, 2) + 1 + i * .3))); }); }
    const k3 = ap(lt, cs(c, 3)); if (k3 > 0) text('명령 한 번 ' + R0.cli_once.toFixed(2) + '초 · CPU 2개 클라우드 기준', 1600, 880, 28, SUB, 700, 'center', k3);
  },
  opts(c, lt) {
    cards(c, lt, [['-o 파일이름.png / .svg  --scale 10  --dpi 300', `SVG ${(R0.svg_bytes / 1024).toFixed(1)}KB(확대해도 또렷) · 인쇄용 해상도`], ['-e H  -b 4  --dark 남색  --light 흰색', '여분 칸 단계 · 흰 여백(칸 수) · 색'], ['-o 없이 실행 → 명령 창에 QR', '--compact로 ' + R0.terminal_lines + '줄']], 140, 220, 1180, 170, 40, 1);
    const k = ap(lt, cs(c, 3)); if (k > 0) { box(1400, 330, 400, 400, 12, '#010409', LINE, k, 2); qrDraw(MAT.short, 1440, 370, 320, 1, k, { dark: '#0b0f14', light: '#e6edf3', border: 2 }); }
  },
  uses(c, lt) { cards(c, lt, ['① 손님용 와이파이 QR을 인쇄해 붙이기', '② 명함 · 모임 안내문에 연락처 QR 넣기', '③ 테이블 · 물품 번호별 QR을 한꺼번에 만들기'], 260, 230, 1400, 140, 50, 0); },
  cons(c, lt) {
    text('아쉬운 점', 960, 130, 56, RED, 900, 'center', ap(lt, 0));
    cards(c, lt, [['① 화면 없는 명령어 도구 · 파이썬 따로 설치', '저장소의 와이파이QR.bat는 이름·비밀번호만 물어봄'], ['② 와이파이 형식을 손으로 적어야 함', '비밀번호 속 ; , : \\ " 는 앞에 \\ (.bat·파이썬 도우미는 자동 처리)'],
      ['③ 휴대폰 카메라 · 실제 접속은 시연에서 확인 못 함', '읽기 확인은 zxing-cpp 프로그램 기준 · 인쇄 전 내 휴대폰으로 확인'], ['④ 비밀번호가 QR 그림에 그대로 들어감', '누구나 읽을 수 있음 → 아는 사람에게만']], 200, 200, 1520, 150, 26, 1, [RED, GOLD, PURPLE, BLUE]);
  },
  summary(c, lt) {
    cards(c, lt, ['✔ segno = QR 스티커 인쇄소', '✔ 와이파이 QR 0.06초 · 1,000장 2.1초 · 함께 설치 0개', '✔ 로고를 얹으면 -e H · 흰 여백은 지우지 않기'], 260, 230, 1400, 150, 50, 1, [GOLD, GREEN, BLUE]);
    stamp('0.06초', 1600, 200, ap(lt, cs(c, 2) + .5, .5), GREEN, 56);
  },
  end(c, lt) { endCard(c, lt, { x: 0, y: 60, w: 1920, h: 880 }, 64); },
};

function endCard(c, lt, R, big = 64) {
  const cx = R.x + R.w / 2, k = ap(lt, 0), v = R.h > R.w, s = v ? 300 : 220;
  qrDraw(MAT.wifi, cx - s / 2, R.y + R.h * (v ? .02 : .0), s, 1, k);
  text('segno · QR 스티커 인쇄소', cx, R.y + R.h * (v ? .33 : .34), big * .62, GOLD, 900, 'center', k);
  const Ls = wrap('다음에 또 멋진 오픈소스 소개하겠습니다!', R.w - 80, big, 900);
  Ls.forEach((l, i) => text(l, cx, R.y + R.h * (v ? .44 : .48) + i * big * 1.3, big, INK, 900, 'center', k));
  const k2 = ap(lt, .8), yy = R.y + R.h * (v ? .78 : .8);
  if (v) { let j = 0; DISCLAIMER.forEach(d => wrap(d, R.w - 60, 28, 500).forEach(l => text(l, cx, yy + (j++) * 44, 28, SUB, 500, 'center', k2))); }
  else DISCLAIMER.forEach((d, i) => { const fs = fit(d, 24, R.w - 40, 500); text(d, cx, yy + i * 38, fs, SUB, 500, 'center', k2); });
}

function DRAW_ANIM(c, lt, W, H) {
  const v = H > W, R = v ? { x: 50, y: 230, w: W - 100, h: 1250 } : { x: 120, y: 90, w: W - 240, h: 820 }, cx = R.x + R.w / 2;
  if (c.id === 's_hook') {
    const lines = ['와이파이 비밀번호,', '아직도 불러 주십니까?'];
    lines.forEach((l, i) => text(l, cx, R.y + (v ? 80 : 40) + i * (v ? 100 : 80), v ? 76 : 64, i ? GOLD : INK, 900, 'center', ap(lt, i * .6)));
    const s = v ? 760 : 560, x = cx - s / 2, y = R.y + (v ? 300 : 210);
    qrDraw(MAT.wifi, x, y, s, prog(lt, 1.6, 4), ap(lt, 1.4));
    stamp('QR 한 장', cx + s * .38, y + 40, ap(lt, 4.2, .5), GREEN, v ? 64 : 54);
  }
  if (c.id === 's_what') {
    text('segno', cx, R.y + (v ? 70 : 50), v ? 110 : 96, GOLD, 900, 'center', ap(lt, 0), MONO);
    text('글을 QR 그림으로 만드는 무료 도구', cx, R.y + (v ? 190 : 140), v ? 48 : 44, INK, 800, 'center', ap(lt, 0));
    const k1 = ap(lt, cs(c, 1)); if (k1 > 0) { const w = v ? 940 : 1300, y = R.y + (v ? 270 : 210); box(cx - w / 2, y, w, 110, 16, '#010409', LINE, k1, 2);
      text('segno "WIFI:…" -o wifi.png', cx, y + 55, v ? 44 : 46, GOLD, 600, 'center', k1, MONO); }
    const s = v ? 640 : 440, x = cx - s / 2, y = R.y + (v ? 440 : 350);
    qrDraw(MAT.wifi, x, y, s, prog(lt, cs(c, 1) + .8, cs(c, 1) + 2.6), ap(lt, cs(c, 1) + .6));
    stamp(R0.wifi.sec.toFixed(2) + '초', x + s - 40, y + 40, ap(lt, cs(c, 1) + 2.7, .5), GOLD, v ? 72 : 60);
  }
  if (c.id === 's_read') {
    const s = v ? 560 : 440, x = v ? cx - s / 2 : R.x + 60, y = R.y + (v ? 40 : 60);
    qrDraw(MAT.wifi, x, y, s, 1, ap(lt, 0)); scan(x, y, s, prog(lt, .3, 1.8));
    const k = ap(lt, 1.8); const bx = v ? R.x + 20 : R.x + 600, by = v ? y + s + 50 : y, bw = v ? R.w - 40 : 1040;
    if (k > 0) { box(bx, by, bw, 300, 18, CARD, GREEN, k, 3); text('읽은 내용', bx + bw / 2, by + 50, v ? 42 : 38, GREEN, 900, 'center', k);
      ['이름: 우리집_5G', '비밀번호: kimchi2026!', '방식: WPA'].forEach((s2, i) => text(s2, bx + 40, by + 120 + i * 60, v ? 40 : 36, INK, 800, 'left', k)); }
    const k1 = ap(lt, cs(c, 1)); if (k1 > 0) { const yy = v ? by + 360 : by + 360; pill('연락처 QR', bx + bw * .27, yy + 40, v ? 38 : 34, BLUE, k1); pill('1,000장 ' + R0.many1000 + '초', bx + bw * .73, yy + 40, v ? 38 : 34, GOLD, k1 * ap(lt, cs(c, 1) + .6)); }
  }
  if (c.id === 's_cover') {
    const s = v ? 420 : 380, gap = v ? 40 : 200, y = R.y + (v ? 140 : 150), pct = 10 * ease(prog(lt, .6, 1.8));
    text('가운데를 10% 가리면?', cx, R.y + (v ? 50 : 50), v ? 56 : 52, INK, 900, 'center', ap(lt, 0));
    [['L', EL.L], ['H', EL.H]].forEach(([l, e], i) => { const x = cx - s - gap / 2 + i * (s + gap); qrDraw(MAT['url' + l], x, y, s, 1, ap(lt, 0)); coverBox(x, y, s, pct, ap(lt, .5));
      text(l + ' 단계', x + s / 2, y + s + 60, v ? 52 : 46, GOLD, 900, 'center', ap(lt, 0)); if (lt > 2) mark(e.cover[10], x + s / 2, y + s + 160, v ? 90 : 80, ease(prog(lt, 2 + i * .5, 2.7 + i * .5))); });
    const k1 = ap(lt, cs(c, 1)); if (k1 > 0) { const yy = y + s + (v ? 330 : 290); box(cx - 380, yy - 60, 760, 120, 18, '#010409', GOLD, k1, 3); text('로고를 얹을 땐  -e H', cx, yy, v ? 50 : 46, GOLD, 800, 'center', k1, MONO); }
  }
  if (c.id === 's_end') {
    box(cx - (v ? 470 : 600), R.y + (v ? 200 : 140), v ? 940 : 1200, v ? 330 : 280, 22, '#010409', LINE, ap(lt, 0), 2);
    text('py -m pip install segno', cx, R.y + (v ? 300 : 230), v ? 50 : 54, GOLD, 600, 'center', ap(lt, 0), MONO);
    text('파이썬 먼저 설치', cx, R.y + (v ? 420 : 330), 40, SUB, 800, 'center', ap(lt, 0));
    text('★★★☆☆ (3)', cx, R.y + (v ? 700 : 560), v ? 90 : 80, GOLD, 900, 'center', ap(lt, .8));
  }
}
