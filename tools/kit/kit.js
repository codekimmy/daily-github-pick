// 연출 아카이브 코드 (2026-11-15 운영자 요청): 오픈소스마다 어울리는 것만 골라 꺼내 쓰는 효과 모음. 목록·쓰임은 tools/kit/README.md
// 장 번호 카드 · 픽셀 조각 전환 · 장면 틀(꼬리표 + 큰 제목) · 도장 배지 · 체감 카운터 · 질문형 마무리 · 바탕 격자
// (캐릭터 '오픈이' char()는 보류 — 운영자: AI 사람 목소리와 안 어울리고 투박함. 코드만 남겨 둠, 쓰지 않음)
// 사용: page.html 에서 <link rel="stylesheet" href="../../../tools/kit/kit.css"><script src="../../../tools/kit/kit.js"></script>
//       모든 함수는 첫 인자로 캔버스 ctx 를 받음. 글꼴: PIXEL = 갈무리(Galmuri, SIL OFL 1.1, tools/kit/fonts)
const KIT_Q_COLOR = '#f5c542';
const KIT = (() => {
  const PIXEL = '"Galmuri11", "Noto Sans CJK KR", monospace', PIXEL_B = '"Galmuri11 Bold", "Galmuri11", "Noto Sans CJK KR", monospace';
  const C = { navy: '#0b1020', grid: 'rgba(120,150,220,.07)', yellow: '#f5c542', ink: '#f0f3f6', sub: '#9aa7b8', blue: '#58a6ff', red: '#ff7b72', green: '#7ee787' };
  // ───── 오픈이 팔레트 (종이 상자 + 하늘색 테이프 + 볼터치)
  const P = { o: '#3b2414', b: '#d99a5b', s: '#b5763f', h: '#f0bb7c', t: '#7cc4ff', T: '#4f9fe0', e: '#1a1410', w: '#ffffff', c: '#ff8f80', m: '#7a2e1f', d: '#2a1a10', k: '#ffe36e' };
  // 18×16 격자. 뚜껑(0~3줄)은 자세마다 바뀌고, 몸통(4~15줄)은 눈·입만 바뀜
  const LID_CLOSED = [
    '..oooooooooooooo..',
    '.ohhhhhhttthhhhho.',
    '.obbbbbbtTtbbbbbo.',
    'oooooooooooooooooo'];
  const LID_OPEN = [
    'oo..............oo',
    'ohho..........ohho',
    '.ohho........ohho.',
    'oooooooooooooooooo'];
  const BODY = [
    'obbbbbbbtTtbbbbbbo',
    'obbbbbbbtTtbbbbbbo',
    'obb@@@bbbbbb###bbo',
    'obb@@@bbbbbb###bbo',
    'obb@@@bbbbbb###bbo',
    'obcbbbbb$$bbbbbcbo',
    'obbbbbbb$$bbbbbbbo',
    'obbbbbbbbbbbbbbbbo',
    'osssssssssssssssso',
    'oooooooooooooooooo',
    '..oo..........oo..',
    '..oo..........oo..'];
  const EYES = { // 3×3 눈 (@=왼눈, #=오른눈)
    normal: ['eew', 'eee', 'eee'], blink: ['bbb', 'eee', 'bbb'], wide: ['wee', 'eee', 'eew'], up: ['ewe', 'eee', 'bbb'], happy: ['beb', 'ebe', 'bbb'] };
  const MOUTH = { smile: ['mb', 'bm'], o: ['mm', 'mm'], flat: ['mm', 'bb'], grin: ['mm', 'mm'] };
  const POSE = {
    idle: { lid: LID_CLOSED, eye: 'normal', mouth: 'smile' },
    open: { lid: LID_OPEN, eye: 'happy', mouth: 'grin', inside: true },   // 짠! (상자를 열어 오늘의 오픈소스를 꺼냄)
    wow: { lid: LID_OPEN, eye: 'wide', mouth: 'o', inside: true },        // 와…
    think: { lid: LID_CLOSED, eye: 'up', mouth: 'flat' },                 // 음?
    point: { lid: LID_CLOSED, eye: 'normal', mouth: 'smile', arm: true }, // 이쪽을 보시기 바랍니다
  };
  function grid(pose, blink) {
    const p = POSE[pose] || POSE.idle, eye = EYES[blink ? 'blink' : p.eye], mo = MOUTH[p.mouth];
    const rows = p.lid.concat(BODY).map(r => r.split(''));
    if (p.inside) rows[3] = 'oddddddddddddddddo'.split('');
    for (let y = 0; y < rows.length; y++) for (let x = 0; x < 18; x++) {
      const ch = rows[y][x];
      if (ch === '@' || ch === '#') { const ey = y - 6, ex = x - (ch === '@' ? 3 : 12); rows[y][x] = eye[ey][ch === '@' ? ex : 2 - ex]; }
      if (ch === '$') { rows[y][x] = mo[y - 9][x - 8]; }
    }
    return rows;
  }
  // 오픈이 그리기. (x, y) = 발 가운데, s = 픽셀 한 칸 크기, t = 초(눈 깜빡임·숨쉬기). opt.arm 오른팔, opt.flip 좌우 반전
  function char(ctx, pose, x, y, s, t = 0, opt = {}) {
    const blink = pose !== 'open' && pose !== 'wow' && (t % 3.7) > 3.55;
    const bob = Math.round(Math.sin(t * 2.4) * 0.6) * s * (pose === 'wow' ? 0 : 1);
    const rows = grid(pose, blink), W = 18 * s, H = rows.length * s, x0 = Math.round(x - W / 2), y0 = Math.round(y - H + bob);
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    if (opt.flip) { ctx.translate(x * 2, 0); ctx.scale(-1, 1); }
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x0 + 2 * s, Math.round(y) + s * .2, W - 4 * s, s * .8); // 그림자
    rows.forEach((r, j) => r.forEach((ch, i) => { if (ch !== '.' && P[ch]) { ctx.fillStyle = P[ch]; ctx.fillRect(x0 + i * s, y0 + j * s, s, s); } }));
    if (POSE[pose]?.arm || opt.arm) { // 오른팔(가리키기)
      ctx.fillStyle = P.o; [[18, 10], [19, 10], [20, 9], [21, 8]].forEach(([i, j]) => ctx.fillRect(x0 + i * s, y0 + j * s, s, s));
      ctx.fillStyle = P.b; ctx.fillRect(x0 + 21 * s, y0 + 6 * s, s * 2, s * 2); ctx.fillStyle = P.o; ctx.fillRect(x0 + 23 * s, y0 + 6 * s, s, s); }
    if (pose === 'think') { // 머리 위 물음표
      ctx.fillStyle = KIT_Q_COLOR; ['.ooo.', 'o...o', '...o.', '..o..', '.....', '..o..'].forEach((r, j) => r.split('').forEach((ch, i) => {
        if (ch === 'o') ctx.fillRect(x0 + (14 + i) * s, y0 + (j - 8) * s, s, s); })); }
    if (pose === 'open' || pose === 'wow') { // 상자에서 나오는 반짝이
      ctx.fillStyle = P.k; [[4, -2], [9, -4], [14, -2], [6, -6], [12, -7]].forEach(([i, j], n) => {
        const on = Math.sin(t * 6 + n * 1.7) > -0.2; if (on) ctx.fillRect(x0 + i * s, y0 + j * s, s, s); }); }
    ctx.restore(); return { w: W, h: H, top: y0 };
  }
  // 말풍선 (픽셀 테두리)
  function bubble(ctx, s, x, y, size = 30, a = 1) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `700 ${size}px ${PIXEL_B}`; const w = ctx.measureText(s).width + size * 1.2, h = size * 1.8;
    ctx.fillStyle = C.ink; ctx.fillRect(x - w / 2, y - h, w, h); ctx.fillRect(x - size * .3, y, size * .5, size * .4);
    ctx.fillStyle = '#111'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y - h / 2); ctx.restore();
  }
  // 바탕: 남색 + 옅은 격자
  function bg(ctx, W, H, cell = 40) {
    ctx.fillStyle = C.navy; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = 0; x <= W; x += cell) { ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); } for (let y = 0; y <= H; y += cell) { ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); } ctx.stroke();
  }
  // 장면 틀: 위 작은 꼬리표(장 이름) + 큰 노란 제목 (모든 장면 같은 자리)
  function head(ctx, W, kicker, title, k = 1, y = 120, big = 72, color = C.yellow) {
    if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `400 ${Math.round(big * .42)}px ${PIXEL}`; ctx.fillStyle = C.sub; ctx.fillText(kicker, W / 2, y - big * .75);
    ctx.font = `700 ${big}px ${PIXEL_B}`; ctx.fillStyle = color; ctx.fillText(title, W / 2, y + (1 - k) * 12); ctx.restore();
  }
  // 장 번호 카드: 노란 전체 화면 + 큰 번호 + 제목. k = 0~1 (나타남)
  function chapterCard(ctx, W, H, num, title, k = 1) {
    if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = C.yellow; ctx.fillRect(0, 0, W, H);
    const v = H > W, n = v ? 260 : 220; ctx.fillStyle = '#16120a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `700 ${n}px ${PIXEL_B}`; ctx.fillText(String(num).padStart(2, '0'), W / 2, H / 2 - n * .35);
    ctx.fillRect(W / 2 - n * .9, H / 2 + n * .3, n * 1.8, 6);
    ctx.font = `700 ${Math.round(n * .3)}px ${PIXEL_B}`; ctx.fillText(title, W / 2, H / 2 + n * .62); ctx.restore();
  }
  // 픽셀 조각 전환: drawA(앞 장면) 위로 drawB(새 장면)가 칸 단위로 무작위 순서로 바뀜. k = 0~1
  function dissolve(ctx, W, H, k, drawA, drawB, cell = 48, seed = 7) {
    drawA(); if (k <= 0) return; const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
    ctx.save(); ctx.beginPath(); let r = seed;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { r = (r * 16807) % 2147483647; if ((r % 1000) / 1000 < k) ctx.rect(i * cell, j * cell, cell, cell); }
    ctx.clip(); drawB(); ctx.restore();
  }
  // 도장 배지: 비스듬히 '쾅' 찍힘 (k: 0→1 동안 크게 → 제자리)
  function stamp(ctx, s, x, y, k, color = C.yellow, size = 56, rot = -8) {
    if (k <= 0) return; const sc = k < .6 ? 1.8 - (k / .6) * .8 : 1; ctx.save(); ctx.globalAlpha *= Math.min(1, k * 2.5);
    ctx.translate(x, y); ctx.rotate(rot * Math.PI / 180); ctx.scale(sc, sc); ctx.font = `700 ${size}px ${PIXEL_B}`;
    const w = ctx.measureText(s).width + size * .9, h = size * 1.5; ctx.fillStyle = 'rgba(11,16,32,.85)'; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = color; ctx.lineWidth = size * .09; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(s, 0, size * .05); ctx.restore();
  }
  // 체감 카운터: "이 영상 보는 동안 +N단위" — 재생 시간(sec)에 비례해 올라감 (perSec = 1초당 값, 시연 측정값으로만 계산)
  function watchCounter(ctx, x, y, w, label, perSec, sec, unit, k = 1, fmt = v => Math.floor(v).toLocaleString('ko-KR')) {
    if (k <= 0) return; const h = 200; ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = 'rgba(11,16,32,.9)'; ctx.fillRect(x - w / 2, y, w, h);
    ctx.strokeStyle = C.yellow; ctx.lineWidth = 4; ctx.strokeRect(x - w / 2, y, w, h); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `700 34px ${PIXEL_B}`; ctx.fillStyle = C.yellow; ctx.fillText(label, x, y + 40);
    ctx.font = `400 26px ${PIXEL}`; ctx.fillStyle = C.sub; ctx.fillText('이 영상 보는 동안', x, y + 82);
    ctx.font = `700 64px ${PIXEL_B}`; ctx.fillStyle = C.ink; ctx.fillText('+' + fmt(perSec * Math.max(0, sec)) + unit, x, y + 145); ctx.restore();
  }
  // 질문형 마무리: 오픈이 + 말풍선 질문 + "댓글로 알려 주시기 바랍니다"
  function askEnd(ctx, W, H, question, t, k = 1) { // 질문 말풍선 + "댓글로 알려 주시기 바랍니다" (캐릭터 없이)
    if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; const v = H > W, cy = v ? H * .45 : H * .5, fs = v ? 48 : 44;
    bubble(ctx, question, W / 2, cy, fs, Math.min(1, t * 2));
    ctx.font = `700 ${v ? 40 : 36}px ${PIXEL_B}`; ctx.fillStyle = C.yellow; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('댓글로 알려 주시기 바랍니다', W / 2, cy + (v ? 110 : 90)); ctx.restore();
  }
  return { PIXEL, PIXEL_B, C, P, POSE, char, bubble, bg, head, chapterCard, dissolve, stamp, watchCounter, askEnd };
})();
