// 장면 그리기. 장(c)의 자막 시작 시각(c.cues[i][0])에 맞춰 화면 요소가 하나씩 나타난다 → 다 나타난 뒤 자막 길이(최소 3초)만큼 멈춤
// 숫자: data.js (RES = 2026-11-20 시연 측정값, demo/results.json) · 그림: img/photo_*.png (scikit-image CC0 사진 = 가상 가족 사진)
// 연출(tools/kit/README.md): 도장 배지, 설정별 막대 비교 + 새 연출 '자물쇠 잠그기'(lockDoc: 글이 자물쇠와 함께 뒤섞인 글자로 바뀜)
const cs = (c, i) => c.cues[Math.min(i, c.cues.length - 1)][0];
const ap = (lt, t, d = .7) => out3(prog(lt, t, t + d));
const R0 = RES, B = n => n.toLocaleString() + '바이트';
const IMG = {}; const IMG_READY = Promise.all([1, 2, 3, 4, 5, 6].map(i => new Promise(r => { const im = new Image(); im.onload = r; im.onerror = r; im.src = `img/photo_${i}.png`; IMG[i] = im; })));

// 도장 배지 (2026-11-19-gifski와 같음)
function stamp(s, x, y, k, color = GOLD, size = 48, rot = -7) {
  if (k <= 0) return; const sc = k < .6 ? 1.8 - (k / .6) * .8 : 1; ctx.save(); ctx.globalAlpha *= Math.min(1, k * 2.5);
  ctx.translate(x, y); ctx.rotate(rot * Math.PI / 180); ctx.scale(sc, sc); ctx.font = `900 ${size}px ${F}`;
  const w = ctx.measureText(s).width + size * .9, h = size * 1.6; ctx.fillStyle = 'rgba(1,4,9,.9)'; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = color; ctx.lineWidth = size * .09; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(s, 0, size * .04); ctx.restore();
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
// ── 새 연출 '자물쇠 잠그기' ─────────────────────────────
// 자물쇠: closed 0(고리 열림) → 1(닫힘), 몸통에 글자(선택)
function padlock(x, y, s, closed, col = GOLD, a = 1, label = '') {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; const lift = (1 - closed) * s * .32;
  ctx.strokeStyle = col; ctx.lineWidth = s * .13; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * .28, y - s * .05 - lift * (closed < 1 ? 0 : 0)); ctx.lineTo(x - s * .28, y - s * .38 - lift);
  ctx.arc(x, y - s * .38 - lift, s * .28, Math.PI, 0); ctx.lineTo(x + s * .28, y - s * .05 - lift); ctx.stroke();
  rr(x - s * .45, y - s * .08, s * .9, s * .7, s * .12); ctx.fillStyle = col; ctx.fill();
  ctx.fillStyle = '#0d1117'; ctx.beginPath(); ctx.arc(x, y + s * .2, s * .09, 0, 7); ctx.fill(); ctx.fillRect(x - s * .035, y + s * .2, s * .07, s * .2);
  ctx.restore(); if (label) text(label, x, y + s * .85, s * .2, col, 800, 'center', a);
}
// 열쇠 아이콘
function keyIcon(x, y, s, col = GREEN, a = 1, rot = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = s * .12;
  ctx.beginPath(); ctx.arc(-s * .3, 0, s * .2, 0, 7); ctx.stroke(); ctx.fillRect(-s * .1, -s * .06, s * .65, s * .12);
  ctx.fillRect(s * .32, 0, s * .08, s * .2); ctx.fillRect(s * .45, 0, s * .08, s * .15); ctx.restore();
}
// 문서 카드: scr 0 → 1 이면 글자가 앞에서부터 뒤섞인 글자로 바뀜(결정적인 의사 무작위)
const GLYPH = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789+/=#%&@$';
const scramble = (s, k, seed = 1) => [...s].map((ch, i) => (ch === ' ' || (i + 1) / s.length > k) ? ch : GLYPH[(i * 31 + seed * 17 + ((i * i * 7 + seed) % 13)) % GLYPH.length]).join('');
function doc(x, y, w, h, title, lines, scr, a = 1, col = BLUE, fs = 28) {
  if (a <= 0) return; box(x, y, w, h, 16, CARD, scr > .5 ? GOLD : col, a, 3);
  text(title, x + 28, y + 40, 26, scr > .5 ? GOLD : col, 800, 'left', a, MONO);
  ctx.save(); ctx.beginPath(); ctx.rect(x + 10, y + 70, w - 20, h - 80); ctx.clip();
  lines.forEach((l, i) => { const s = scr > 0 ? scramble(l, clamp(scr * 1.4 - i * .1), i + 3) : l; text(s, x + 28, y + 100 + i * fs * 1.55, fs, scr > 0 ? (scr > .5 ? '#c9a24a' : INK) : INK, 600, 'left', a, scr > .3 ? MONO : F); });
  ctx.restore();
}
function lockDoc(x, y, w, h, k, a = 1, fs = 28, title2 = 'diary.txt.age') { // k: 0 원본 → 1 잠김
  const lines = R0.diary_lines.map(l => l.length > 30 ? l.slice(0, 30) + '…' : l);
  doc(x, y, w, h, k > .5 ? title2 : 'diary.txt', lines, ease(prog(k, .35, 1)), a, BLUE, fs);
  const s = Math.min(w, h) * .32, py = lerp(y - s * .4, y + h * .55, ease(prog(k, 0, .35)));
  padlock(x + w - s * .7, py, s, ease(prog(k, .3, .5)), GOLD, a * Math.min(1, k * 4));
}
// 명령 창 패널: lines [글, 색], k = 보이는 줄 수(소수 = 타이핑 중)
function term(x, y, w, h, lines, k, a = 1, fs = 26) {
  if (a <= 0) return; box(x, y, w, h, 14, '#05070c', LINE, a, 2); [RED, GOLD, GREEN].forEach((c, i) => { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 26 + i * 26, y + 24, 7, 0, 7); ctx.fill(); ctx.restore(); });
  lines.forEach(([s, col], i) => { if (i >= k) return; const part = i + 1 > k ? s.slice(0, Math.floor(s.length * (k - i))) : s;
    text(part, x + 24, y + 70 + i * fs * 1.5, fit(s, fs, w - 48, 600), col || INK, 600, 'left', a, MONO); });
}
function person(x, y, s, lab, col, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y - s * .35, s * .22, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y + s * .15, s * .36, s * .28, 0, Math.PI, 0); ctx.fill(); ctx.restore(); text(lab, x, y + s * .4, s * .22, col, 800, 'center', a);
}
const LR = { x: 60, y: 120, w: 1800, h: 800 };

const DRAW_LONG = {
  preview(c, lt) {
    const k1 = ap(lt, cs(c, 1)), k2 = ap(lt, cs(c, 2));
    lockDoc(100, 180, 900, 520, prog(lt, .8, 3.4), 1, 32);
    // 오른쪽: '비밀번호' 찾기 결과
    box(1080, 180, 740, 250, 18, CARD, LINE, k1, 2); text("'비밀번호' 글자 찾기", 1450, 230, 34, SUB, 700, 'center', k1);
    text('원본 3줄', 1260, 330, 52, RED, 900, 'center', k1); text('→', 1450, 330, 52, SUB, 900, 'center', k1); text('잠근 파일 0줄', 1640, 330, 52, GREEN, 900, 'center', ap(lt, cs(c, 1) + .8));
    box(1080, 470, 740, 230, 18, CARD, LINE, k2, 2);
    keyIcon(1180, 540, 90, RED, k2); text('다른 열쇠', 1300, 540, 36, INK, 700, 'left', k2); cross(1720, 540, 60, ap(lt, cs(c, 2) + .5));
    keyIcon(1180, 640, 90, GREEN, ap(lt, cs(c, 2) + 1)); text('내 열쇠 · 0.002초', 1300, 640, 36, INK, 700, 'left', ap(lt, cs(c, 2) + 1)); check(1720, 640, 60, prog(lt, cs(c, 2) + 1.5, cs(c, 2) + 2));
    stamp('비밀번호 0줄', 1450, 820, ap(lt, cs(c, 1) + 1.5, .5), GOLD, 50);
  },
  title(c, lt) {
    const k = ap(lt, 0); padlock(960, 160, 140, ease(prog(lt, .4, 1.2)), GOLD, k);
    text('rage', 960, 410, 150, GOLD, 900, 'center', k);
    text('레이지 · 파일 자물쇠', 960, 520, 46, SUB, 700, 'center', k);
    text('일반인 쓸모 ★★★☆☆ (3)', 960, 620, 66, GOLD, 900, 'center', ap(lt, cs(c, 1)));
    text('파일을 자물쇠로 잠그는 무료 암호화 프로그램', 960, 720, 42, INK, 700, 'center', ap(lt, cs(c, 2)));
  },
  what(c, lt) {
    const k0 = ap(lt, 0), k1 = ap(lt, cs(c, 1)), k2 = ap(lt, cs(c, 2)), k3 = ap(lt, cs(c, 3)), k4 = ap(lt, cs(c, 4));
    const f1 = 1 - ap(lt, cs(c, 1) - .6, .6);
    doc(460, 200, 1000, 420, 'diary.txt → 뒤섞인 글자', R0.diary_lines, ease(prog(lt, 1, 3.5)), k0 * f1, BLUE, 32);
    // 열쇠 + 짝 자물쇠
    const f4 = 1 - ap(lt, cs(c, 4) - .6, .6);
    keyIcon(360, 360, 200, GREEN, k1 * f4); text('열쇠 (key.txt)', 360, 500, 34, GREEN, 800, 'center', k1 * f4); text('나만 가짐', 360, 550, 28, SUB, 700, 'center', k1 * f4);
    padlock(760, 380, 170, 0, GOLD, k1 * f4); text('자물쇠 (age1…)', 760, 540, 34, GOLD, 800, 'center', k1 * f4);
    // 자물쇠를 세 사람에게 나눠 줌
    [['친구', 1180], ['회사', 1440], ['가족', 1700]].forEach(([n, x], i) => { const a = k2 * ap(lt, cs(c, 2) + i * .5) * f4; person(x, 330, 150, n, BLUE, a); padlock(x, 520, 80, ease(prog(lt, cs(c, 2) + 1.5 + i * .3, cs(c, 2) + 2 + i * .3)), GOLD, a); });
    text('누구나 자물쇠로 잠글 수 있음', 1440, 640, 32, SUB, 700, 'center', k2 * f4);
    if (k3 > 0) { box(260, 680, 1400, 110, 18, 'rgba(126,231,135,.1)', GREEN, k3 * f4, 3); text('여는 것은 열쇠 파일을 가진 사람만', 960, 735, 44, GREEN, 900, 'center', k3 * f4); }
    if (k4 > 0) { box(410, 260, 1100, 380, 22, 'rgba(1,4,9,.94)', BLUE, k4, 3); text('rage', 960, 340, 70, GOLD, 900, 'center', k4);
      text('age 형식(첫 줄 age-encryption.org/v1)을 쓰는 러스트 프로그램', 960, 430, 32, SUB, 700, 'center', k4);
      text('만든 사람 str4d · 라이선스 MIT 또는 Apache-2.0', 960, 500, 36, INK, 800, 'center', k4); text('crates.io 0.12.1 (2026-07-14)', 960, 565, 32, SUB, 700, 'center', k4); }
  },
  install(c, lt) {
    rows(c, lt, LR, [['① winget install str4d.rage   (winget 목록 기준)', BLUE, true], ['② Rust 설치 후 cargo install rage', PURPLE, true],
      ['시연(리눅스): cargo install rage → 약 89초 · 0.12.1', GREEN, true], ['Windows 설치·실행은 시연에서 확인 전', GOLD]], { h: 140 });
  },
  keys(c, lt) {
    const L = [['$ rage-keygen -o key.txt', GREEN], ['Public key: ' + R0.pubkey_head + '…', GOLD], ['', INK], ['$ rage-keygen -y -o lock.txt key.txt', GREEN], ['(lock.txt = 자물쇠만 담긴 파일)', SUB]];
    const n = lt < cs(c, 2) ? Math.min(2, prog(lt, 0, 2) * 2) : 3 + Math.min(2, prog(lt, cs(c, 2), cs(c, 2) + 2) * 2);
    term(80, 140, 900, 420, L, n, ap(lt, 0), 28); stamp('0.002초', 820, 200, ap(lt, 1.6, .5), GREEN, 36);
    const k1 = ap(lt, cs(c, 1)); box(1040, 140, 800, 420, 16, CARD, BLUE, k1, 2); text('key.txt 안', 1440, 185, 30, BLUE, 800, 'center', k1);
    [['# created: 2026-11-19T22:54:11Z', SUB], ['# public key: age1…(62글자)', GOLD], ['AGE-SECRET-KEY-1…(숨김)', RED]].forEach(([s, col], i) => text(s, 1080, 260 + i * 70, 30, col, 600, 'left', ap(lt, cs(c, 1) + i * .8), MONO));
    padlock(1300, 520, 70, 0, GOLD, ap(lt, cs(c, 1) + .8)); text('= 자물쇠', 1360, 520, 28, GOLD, 800, 'left', ap(lt, cs(c, 1) + .8));
    keyIcon(1600, 520, 80, RED, ap(lt, cs(c, 1) + 1.6)); text('= 열쇠', 1660, 520, 28, RED, 800, 'left', ap(lt, cs(c, 1) + 1.6));
    const k3 = ap(lt, cs(c, 3)); box(160, 660, 1600, 130, 18, 'rgba(255,123,114,.1)', RED, k3, 3);
    text('⚠ 열쇠 파일은 남에게 보내지 않기 · 잃으면 아무도 못 엶', 960, 725, 42, RED, 900, 'center', k3);
  },
  demo1(c, lt) {
    lockDoc(80, 150, 820, 470, prog(lt, cs(c, 1), cs(c, 1) + 2.4), ap(lt, 0), 28);
    const k2 = ease(prog(lt, cs(c, 2), cs(c, 2) + 1.5));
    hbar(1260, 190, 380, 56, R0.diary_bytes, R0.enc_bytes, BLUE, ap(lt, cs(c, 0)), '원본 일기', B(R0.diary_bytes), ap(lt, 0), 30);
    hbar(1260, 280, 380, 56, R0.enc_bytes * k2, R0.enc_bytes, GOLD, 1, '잠근 파일', B(Math.round(R0.enc_bytes * k2)), ap(lt, cs(c, 2)), 30);
    text('+350바이트 = 자물쇠 정보(머리말)', 1500, 380, 28, SUB, 700, 'center', ap(lt, cs(c, 2) + 1));
    const k3 = ap(lt, cs(c, 3)); box(1000, 440, 840, 160, 16, CARD, LINE, k3, 2); text("'비밀번호' 찾기", 1420, 480, 30, SUB, 700, 'center', k3);
    text('원본 3줄  →  잠근 파일 0줄', 1420, 550, 44, GREEN, 900, 'center', k3);
    const k4 = ap(lt, cs(c, 4)); box(80, 660, 1760, 170, 16, CARD, PURPLE, k4, 2); text('같은 일기를 두 번 잠근 결과 (끝부분 12바이트)', 960, 700, 28, PURPLE, 800, 'center', k4);
    text('1회: ' + R0.hex_a, 960, 750, 30, INK, 600, 'center', k4, MONO); text('2회: ' + R0.hex_b, 960, 795, 30, INK, 600, 'center', ap(lt, cs(c, 4) + .6), MONO);
  },
  demo2(c, lt) {
    const L = [['$ rage -d -i key.txt diary.txt.age', GREEN], [R0.diary_lines[0], INK], [R0.diary_lines[1].slice(0, 34) + '…', INK], ['$ rage -d -i other.txt diary.txt.age', GREEN], ['Error: ' + R0.wrong_key_err.replace('Error: ', ''), RED], ['(결과 파일 만들어지지 않음)', SUB]];
    const n = lt < cs(c, 1) ? prog(lt, 0, 1.5) * 3 : 3 + prog(lt, cs(c, 1), cs(c, 2) + .5) * 3;
    term(80, 130, 1000, 470, L, n, ap(lt, 0), 28); stamp('0.002초 · 원본과 같음', 900, 200, ap(lt, 1.8, .5), GREEN, 32);
    // 1바이트 바꾸기
    const k3 = ap(lt, cs(c, 3)), hx = R0.hex_a.split(' '); box(1140, 130, 700, 470, 16, CARD, RED, k3, 2); text('잠근 파일 1바이트 바꾸기', 1490, 175, 32, RED, 800, 'center', k3);
    hx.forEach((h, i) => { const flip = i === 5 && lt > cs(c, 3) + 1; const x = 1200 + (i % 6) * 104, y = 260 + Math.floor(i / 6) * 70;
      box(x, y - 26, 90, 52, 8, flip ? 'rgba(255,123,114,.35)' : 'rgba(255,255,255,.05)', flip ? RED : null, k3, 2); text(flip ? (parseInt(h, 16) ^ 1).toString(16).padStart(2, '0') : h, x + 45, y, 30, flip ? RED : INK, 700, 'center', k3, MONO); });
    text('→ Error: decryption error · 결과 0바이트', 1490, 470, 30, RED, 800, 'center', ap(lt, cs(c, 3) + 1.6)); cross(1490, 540, 60, ap(lt, cs(c, 3) + 1.8));
    const k4 = ap(lt, cs(c, 4)); box(80, 660, 1760, 140, 16, 'rgba(255,123,114,.08)', RED, k4, 3);
    text('끝 50바이트를 잘라 낸 파일도 → 열기 실패 (중간에 바뀐 파일을 믿지 않음)', 960, 730, 40, RED, 800, 'center', k4);
  },
  demo3(c, lt) {
    const k0 = ap(lt, 0); padlock(300, 330, 260, ease(prog(lt, 1, 2)), PURPLE, k0); text('번호 자물쇠 = 암호 문장', 300, 560, 36, PURPLE, 800, 'center', k0);
    const L = [['$ rage -p -o diary.txt.age diary.txt', GREEN], ['Type passphrase (leave empty to autogenerate', INK], ['  a secure one): ********', INK], ['Confirm passphrase: ********', INK]];
    term(560, 130, 1280, 300, L, lt < cs(c, 1) ? 1 : 1 + prog(lt, cs(c, 1), cs(c, 1) + 2) * 3, k0, 28);
    const k2 = ap(lt, cs(c, 2)); box(560, 460, 1280, 130, 16, CARD, GOLD, k2, 2); text('빈칸으로 두면 → 낱말 10개 암호 문장을 만들어 줌', 1200, 495, 30, GOLD, 800, 'center', k2);
    text(R0.pw_auto_msg.split('\n').pop().trim(), 1200, 550, fit(R0.pw_auto_msg.split('\n').pop().trim(), 30, 1220, 600), INK, 600, 'center', k2, MONO);
    const k3 = ap(lt, cs(c, 3)), tsec = R0.pw_after_input_s * ease(prog(lt, cs(c, 3), cs(c, 3) + 1.6));
    box(80, 640, 860, 170, 16, CARD, BLUE, k3, 2); text('열 때 걸린 시간', 510, 680, 30, SUB, 700, 'center', k3); text('약 ' + tsec.toFixed(1) + '초', 510, 755, 60, BLUE, 900, 'center', k3);
    text('열쇠 파일: 0.002초', 510, 800, 1, SUB, 700, 'center', 0);
    box(980, 640, 860, 170, 16, CARD, BLUE, k3, 2); text('일부러 느리게 계산 (scrypt, 2의 19제곱)', 1410, 690, 30, SUB, 700, 'center', k3); text('→ 마구 맞혀 보기를 늦춤', 1410, 755, 40, BLUE, 900, 'center', k3);
    stamp('한 글자 틀리면 → Decryption failed', 960, 880, ap(lt, cs(c, 4), .5), RED, 38, -3);
  },
  demo4(c, lt) {
    const f = 1 - ap(lt, cs(c, 2) - .6, .6), k0 = ap(lt, 0);
    if (f > 0) {
      doc(660, 160, 600, 300, 'family.age', R0.diary_lines.slice(0, 3), 1, k0 * f, GOLD, 26);
      padlock(560, 260, 110, 1, GOLD, k0 * f, '나'); padlock(1360, 260, 110, 1, PURPLE, ap(lt, .8) * f, '엄마');
      const k1 = ap(lt, cs(c, 1)); [['나', GOLD, true, 460], ['엄마', PURPLE, true, 960], ['다른 사람', SUB, false, 1460]].forEach(([n, col, ok, x], i) => { const a = k1 * ap(lt, cs(c, 1) + i * .7) * f;
        person(x, 640, 150, n, col, a); keyIcon(x + 140, 610, 80, col, a); if (ok) check(x + 260, 610, 70, prog(lt, cs(c, 1) + i * .7 + .4, cs(c, 1) + i * .7 + .9), GREEN, a); else cross(x + 260, 610, 70, a * ap(lt, cs(c, 1) + i * .7 + .4)); });
      text('잠근 파일 하나 (' + B(R0.two_rcpt_bytes) + ')를 두 사람이 각자 열쇠로 엶', 960, 810, 30, SUB, 700, 'center', k1 * f);
    }
    const k2 = ap(lt, cs(c, 2)); if (k2 > 0) {
      [1, 2, 3, 4, 5, 6].forEach(i => { const x = 120 + ((i - 1) % 3) * 260, y = 200 + Math.floor((i - 1) / 3) * 230, a = k2 * ap(lt, cs(c, 2) + i * .3);
        if (IMG[i] && IMG[i].width && a > 0) { const w = 230, h = Math.min(200, w * IMG[i].height / IMG[i].width); ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(IMG[i], x, y, w, h); ctx.restore(); box(x, y, w, h, 0, null, LINE, a, 2); } });
      text('가상 가족 사진 6장 (CC0)', 500, 690, 30, SUB, 700, 'center', k2);
      text('tar로 묶기 →', 900, 300, 30, BLUE, 800, 'center', ap(lt, cs(c, 2) + 2.5));
      const kb = ap(lt, cs(c, 2) + 3); box(1000, 220, 760, 160, 16, CARD, BLUE, kb, 2); text('photos.tar (묶은 파일)', 1380, 265, 30, BLUE, 800, 'center', kb); text(Math.round(R0.tar_bytes / 1024) + 'KB', 1380, 330, 48, INK, 900, 'center', kb);
      const k3 = ap(lt, cs(c, 3)); box(1000, 420, 760, 160, 16, CARD, GOLD, k3, 2); padlock(1080, 500, 80, ease(prog(lt, cs(c, 3), cs(c, 3) + .6)), GOLD, k3);
      text('photos.tar.age · 0.004초', 1420, 470, 34, GOLD, 800, 'center', k3); text(Math.round(R0.photos_age_bytes / 1024) + 'KB', 1420, 530, 40, INK, 900, 'center', k3);
      stamp('6장 모두 원본과 같음', 1380, 700, ap(lt, cs(c, 3) + 1.5, .5), GREEN, 44);
    }
  },
  demo5(c, lt) {
    const b1 = R0.big100, b2 = R0.big1024, k = t => ease(prog(lt, t, t + 1.5));
    text('무작위 데이터 큰 파일 (CPU 2개)', 960, 150, 34, SUB, 700, 'center', ap(lt, 0));
    hbar(560, 220, 900, 60, b1.enc_s * k(cs(c, 1)), 2.2, GOLD, 1, '100MB 잠그기', (b1.enc_s * k(cs(c, 1))).toFixed(2) + '초', ap(lt, cs(c, 1), .4), 32);
    hbar(560, 300, 900, 60, b1.dec_s * k(cs(c, 1) + .8), 2.2, GREEN, 1, '100MB 열기', (b1.dec_s * k(cs(c, 1) + .8)).toFixed(2) + '초', ap(lt, cs(c, 1) + .8, .4), 32);
    hbar(560, 400, 900, 60, b2.enc_s * k(cs(c, 2)), 2.2, GOLD, 1, '1GB 잠그기', (b2.enc_s * k(cs(c, 2))).toFixed(2) + '초', ap(lt, cs(c, 2), .4), 32);
    hbar(560, 480, 900, 60, b2.dec_s * k(cs(c, 2) + .8), 2.2, GREEN, 1, '1GB 열기', (b2.dec_s * k(cs(c, 2) + .8)).toFixed(2) + '초', ap(lt, cs(c, 2) + .8, .4), 32);
    const k3 = ap(lt, cs(c, 3)); term(160, 590, 1600, 260, [['$ rage -a -R lock.txt -o diary.txt.age.txt diary.txt', GREEN], [R0.armor_head[0], GOLD], [R0.armor_head[1], INK], ['… (모두 ' + R0.armor_lines + '줄 · ' + B(R0.armor_bytes) + ')', SUB]], k3 * 4, k3, 26);
  },
  uses(c, lt) { rows(c, lt, LR, [['① 여권·통장 사본, 비밀 일기를 잠가 클라우드·USB에 보관', BLUE], ['② 가족 모두의 자물쇠로 잠가 함께 보관', GREEN], ['③ 메일로 보내는 파일을 잠가 보내기 (암호는 전화 등 다른 길로)', GOLD]], { h: 150 }); },
  cons(c, lt) {
    text('아쉬운 점', 960, 170, 56, GOLD, 900, 'center', ap(lt, 0));
    rows(c, lt, { x: 140, y: 230, w: 1640, h: 640 }, [['① 열쇠 파일·암호 문장을 잃으면 아무도 못 엶 (되찾는 방법 없음)', RED], ['② -o에 이미 있는 파일 이름을 쓰면 묻지 않고 덮어씀', RED],
      ['③ 화면 프로그램 없이 명령어로만 · 폴더는 따로 묶어야 함', RED], ['④ 제작자가 아직 [BETA]로 표시 (crates.io 설명)', RED]], { off: 1, h: 130 });
  },
  summary(c, lt) {
    text('정리', 960, 170, 56, BLUE, 900, 'center', ap(lt, 0));
    rows(c, lt, { x: 140, y: 230, w: 1640, h: 640 }, [['✔ rage = 자물쇠는 나눠 주고 열쇠는 내가 갖는 파일 암호화', GOLD], ["✔ 잠근 일기에서 '비밀번호' 0줄 · 1바이트만 바꿔도 열기 거부", GREEN],
      ['✔ 1GB 잠그기 1.59초 · 가족이 함께 열기 가능', GREEN], ['✔ 열쇠 파일은 따로 백업 · 잃으면 못 엶', RED]], { off: 1, h: 130 });
  },
  end(c, lt) { endCard(c, lt, { x: 0, y: 60, w: 1920, h: 900 }, 72); },
};
function endCard(c, lt, R, big = 64) {
  const cx = R.x + R.w / 2, k = ap(lt, 0), v = R.h > R.w;
  padlock(cx, R.y + R.h * (v ? .14 : .1), v ? 120 : 90, 1, GOLD, k);
  text('rage · 파일 자물쇠', cx, R.y + R.h * (v ? .3 : .28), big * .8, GOLD, 900, 'center', k);
  const Ls = wrap('다음에 또 멋진 오픈소스 소개하겠습니다!', R.w - 80, big, 900);
  Ls.forEach((l, i) => text(l, cx, R.y + R.h * (v ? .42 : .45) + i * big * 1.3, big, INK, 900, 'center', k));
  const k2 = ap(lt, .8), yy = R.y + R.h * (v ? .78 : .8);
  if (v) { let j = 0; DISCLAIMER.forEach(d => wrap(d, R.w - 60, 28, 500).forEach(l => text(l, cx, yy + (j++) * 44, 28, SUB, 500, 'center', k2))); }
  else DISCLAIMER.forEach((d, i) => { const fs = fit(d, 24, R.w - 40, 500); text(d, cx, yy + i * 38, fs, SUB, 500, 'center', k2); });
}
function DRAW_ANIM(c, lt, W, H) {
  const v = H > W, R = v ? { x: 50, y: 230, w: W - 100, h: 1250 } : { x: 120, y: 90, w: W - 240, h: 820 }, cx = R.x + R.w / 2;
  if (c.id === 's_hook') {
    const w = v ? R.w : 900, h = v ? 600 : 560; lockDoc(v ? R.x : R.x, R.y + 40, w, h, prog(lt, .5, 3), 1, v ? 30 : 30);
    const bx = v ? cx : R.x + R.w - 380, by = v ? R.y + 40 + h + 160 : R.y + 200;
    text("'비밀번호' 글자", bx, by, v ? 44 : 40, SUB, 700, 'center', ap(lt, 1));
    text('3줄 → 0줄', bx, by + (v ? 110 : 100), v ? 96 : 84, GREEN, 900, 'center', ap(lt, 2.5));
    stamp('잠금 완료', bx, by + (v ? 280 : 260), ap(lt, 3.2, .5), GOLD, v ? 70 : 60);
  }
  if (c.id === 's_what') {
    const k1 = ap(lt, cs(c, 1)), y0 = v ? R.y + 200 : R.y + 220;
    keyIcon(v ? cx - 220 : cx - 520, y0, v ? 200 : 180, GREEN, ap(lt, 0)); text('열쇠 (나만)', v ? cx - 220 : cx - 520, y0 + 140, 40, GREEN, 800, 'center', ap(lt, 0));
    padlock(v ? cx + 220 : cx - 120, y0 + 20, v ? 180 : 160, 0, GOLD, ap(lt, .6)); text('자물쇠', v ? cx + 220 : cx - 120, y0 + 170, 40, GOLD, 800, 'center', ap(lt, .6));
    [['친구', 0], ['회사', 1], ['가족', 2]].forEach(([n, i]) => { const a = k1 * ap(lt, cs(c, 1) + i * .5), x = v ? R.x + 170 + i * 320 : cx + 220 + i * 230, y = v ? R.y + 720 : R.y + 200;
      person(x, y, v ? 170 : 150, n, BLUE, a); padlock(x, y + (v ? 210 : 190), v ? 90 : 80, 1, GOLD, a); });
    if (k1 > 0) { box(v ? R.x : R.x + 200, v ? R.y + 1060 : R.y + 560, v ? R.w : R.w - 400, 120, 18, 'rgba(126,231,135,.1)', GREEN, ap(lt, cs(c, 1) + 1.5), 3);
      text('여는 건 열쇠 주인만', cx, v ? R.y + 1120 : R.y + 620, v ? 50 : 46, GREEN, 900, 'center', ap(lt, cs(c, 1) + 1.5)); }
  }
  if (c.id === 's_lock') {
    const k1 = ap(lt, cs(c, 1)), rows3 = [['다른 열쇠', RED, false, 0], ['1바이트 바꾼 파일', RED, false, .9], ['내 열쇠 · 0.002초', GREEN, true, cs(c, 1)]];
    rows3.forEach(([s, col, ok, t0], i) => { const a = ap(lt, t0), y = (v ? R.y + 200 : R.y + 150) + i * (v ? 300 : 220), x = v ? R.x + 40 : R.x + 200, w = v ? R.w - 80 : R.w - 400;
      box(x, y - 90, w, 180, 20, CARD, col, a, 3); keyIcon(x + 110, y, 120, col, a); text(s, x + 220, y, v ? 46 : 46, INK, 800, 'left', a);
      if (ok) check(x + w - 90, y, 90, prog(lt, t0 + .4, t0 + 1)); else cross(x + w - 90, y, 90, ap(lt, t0 + .4)); });
  }
  if (c.id === 's_speed') {
    const b2 = R0.big1024, kk = ease(prog(lt, .3, 2.3)), bw = v ? R.w - 380 : 1000, bx = v ? R.x + 300 : R.x + 420;
    text('1GB 파일 (무작위 데이터 · CPU 2개)', cx, v ? R.y + 120 : R.y + 80, v ? 40 : 36, SUB, 700, 'center', ap(lt, 0));
    hbar(bx, v ? R.y + 220 : R.y + 160, bw, 80, b2.enc_s * kk, 2.4, GOLD, 1, '잠그기', (b2.enc_s * kk).toFixed(2) + '초', ap(lt, 0), v ? 40 : 38);
    hbar(bx, v ? R.y + 360 : R.y + 280, bw, 80, b2.dec_s * ease(prog(lt, 1, 3)), 2.4, GREEN, 1, '열기', (b2.dec_s * ease(prog(lt, 1, 3))).toFixed(2) + '초', ap(lt, 1), v ? 40 : 38);
    const k1 = ap(lt, cs(c, 1)); box(v ? R.x : R.x + 150, v ? R.y + 620 : R.y + 450, v ? R.w : R.w - 300, v ? 340 : 260, 20, 'rgba(255,123,114,.1)', RED, k1, 3);
    keyIcon(cx, v ? R.y + 740 : R.y + 540, 150, RED, k1); cross(cx + 120, v ? R.y + 740 : R.y + 540, 70, k1);
    text('열쇠 파일을 잃으면 아무도 못 엶', cx, v ? R.y + 880 : R.y + 650, v ? 48 : 46, RED, 900, 'center', k1);
  }
  if (c.id === 's_end') { const a = ap(lt, 0); box(R.x + (v ? 0 : 300), R.y + 30, R.w - (v ? 0 : 600), v ? 300 : 230, 20, CARD, BLUE, a, 3);
    text('Windows 설치 명령 한 줄 (winget 목록 기준)', cx, R.y + (v ? 110 : 90), v ? 40 : 38, SUB, 700, 'center', a);
    text('winget install str4d.rage', cx, R.y + (v ? 220 : 180), v ? 48 : 50, BLUE, 600, 'center', a, MONO);
    const k2 = ap(lt, 1.5), yb = R.y + (v ? 520 : 400); text('일반인 쓸모 ★★★☆☆ (3)', cx, yb, v ? 64 : 56, GOLD, 900, 'center', k2); }
}
