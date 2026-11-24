// segno (2026-11-24) 모션 장면 — tools/motion 예시
// 숫자: data.js 의 RES (= demo/results.json 시연 측정값), QR 칸 배열: MAT (segno 로 만든 실제 QR, mkdata.py)
// 시간: 모두 S.cue(i)(자막 i 의 시작 초) 기준 → retime.py 로 구간이 바뀌어도 그대로 따라감
// 여기 없는 장(what·install·demo1…)은 motion.js 의 기본 장면(fallback)으로 그려짐 → 하나씩 채워 넣으면 됨
const { C, P, eOut, eIO, eBack, lerp, popIn, out, shake, el, box, tf, caption, stamp, hand, pen, ellipsePath, arrowPath, circleAround, count, term, qr, scanAt, pill, pillRender, stars, iconTile, ending } = M;
const EL = RES.errorlevel.map(e => ({ level: e.level, cover: e.cover, n: MAT['url' + e.level].length }));
const WIFI_CMD = 'segno "WIFI:T:WPA;S:우리집_5G;P:kimchi2026!;;" -o wifi.png --scale 10';
const DISCLAIMER = ['정보 제공용 · 2026-11-24 클라우드 시연 결과(운영자 직접 검증 아님) · 와이파이·연락처는 시연용 가상 자료', '휴대폰 카메라·Windows에서는 결과가 다를 수 있음 · 비밀번호 QR은 아는 사람에게만 · 인쇄 전 직접 읽어 확인'];
const SCENES = {};

// ======================= 롱폼 (1920×1080) =======================
// ---- 미리보기: 명령 타이핑 → QR 칸이 찍혀 나옴 + 0.06초 도장 → 읽기 띠 + 결과 카드 + 빨간 펜 ----
SCENES.preview = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2), e2 = S.cueEnd(2);
  const caps = [caption(c0 - .1, c1 - .3, [['가상', '와이파이로'], ['*명령 한 줄*']]),
    caption(c1 - .1, c2 - .3, [['segno가'], ['*0.06초*', '만에', 'QR']]),
    caption(c2 - .06, e2 + .5, [['다른', '프로그램으로', '읽으니'], ['*그대로*', '나옴']]),
    caption(e2 + .7, null, [['이 QR을', '만든'], ['*오늘의 오픈소스*']])];
  const tm = term(110, 380, 860, 330);
  const res = box(110, 380, 860, 400, 'card', { overflow: 'hidden' });
  el('div', null, { background: C.ink, color: '#fff', fontWeight: '800', fontSize: '28px', padding: '16px 30px' }, res, 'zxing-cpp로 읽은 결과');
  const rows = [['와이파이 이름', '우리집_5G'], ['비밀번호', 'kimchi2026!'], ['방식', 'WPA']].map((r, i) => {
    const d = el('div', null, { display: 'flex', alignItems: 'center', padding: '0 30px', height: '96px', borderBottom: i < 2 ? '3px dashed #ddd' : 'none', fontSize: '34px' }, res);
    el('div', null, { width: '250px', color: '#777', fontWeight: '700', fontSize: '28px' }, d, r[0]);
    const v = el('div', 'mono', { fontWeight: '800' }, d, r[1]); el('div', null, { flex: '1' }, d);
    const ck = el('div', null, { width: '54px', height: '54px', borderRadius: '50%', background: C.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px', fontWeight: '900' }, d, '✓');
    return { d, v, ck };
  });
  const circ = pen(circleAround(rows[0].v, 28, 18), 6);
  const vr = rows[0].v.getBoundingClientRect();
  const hd = hand('← 한글도 그대로 읽힘', vr.right + 46, vr.top + 4, 34);
  const qc = box(1150, 150, 640, 640); const code = qr(MAT.wifi, 572, { left: '30px', top: '30px' }, qc);
  const st = stamp('0.06초', 1560, 120, 58);
  const chip = el('div', 'chip', { left: '1340px', top: '830px' }, null, '29 × 29칸');
  const okb = el('div', null, { position: 'absolute', left: '1730px', top: '740px', width: '96px', height: '96px', borderRadius: '50%', background: C.green, border: '4px solid #141414', color: '#fff', fontSize: '58px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }, null, '✓');
  const recap = ['⌨ 명령 한 줄', '⚡ 0.06초', '✓ 그대로 읽힘'].map((s, i) => el('div', 'chip', { left: (110 + i * 330) + 'px', top: '560px', fontSize: '34px', padding: '14px 28px' }, null, s));
  return t => {
    caps.forEach(c => c.render(t));
    const ti = popIn(t, c0 - .15, .55), tx = out(t, c2 - .3, .45); tf(tm.el, -tx * 1000, (1 - ti) * 400, 1, 0, 1 - tx);
    tm.render(t, [{ at: c0 + .6, text: WIFI_CMD, dur: 2.8 }, { at: c0 + 3.95, kind: 'out', text: '✓ wifi.png 저장 · 29 × 29칸 · 490바이트' }]);
    const qi = popIn(t, c1 - .8, .5), qo = out(t, e2 + .6, .5);
    tf(qc, qo * -200, (1 - qi) * -500, 1 - qo * .35, (1 - qi) * 12 + Math.sin(t * 1.3) * .6, qi > 0 ? 1 - qo : 0);
    code.draw(t, { stamp: c1 + .06, dur: 1.9, scan: scanAt(t, c2 + .04) });
    st.render(t, c1 + 2.3, e2 + .6); const cp = popIn(t, c1 + 2.9); tf(chip, qo * -200, (1 - cp) * 30, cp, 0, cp * (1 - qo));
    const kb = popIn(t, c2 + 1.85, .45); tf(okb, qo * -200, 0, kb, 0, kb > 0 ? 1 - qo : 0);
    const ri = eOut(P(t, c2 + .2, c2 + .7)), ro = out(t, e2 + .55, .45); tf(res, (1 - ri) * -1000 - ro * 1000, 0, 1, 0, ri > 0 ? 1 : 0);
    rows.forEach((r, i) => { const a = popIn(t, c2 + .7 + i * .8, .4); r.d.style.opacity = Math.min(1, a * 2); r.d.style.transform = `translateX(${(1 - a) * -60}px)`; r.ck.style.transform = `scale(${popIn(t, c2 + 1.0 + i * .8, .4)})`; });
    circ.set(eOut(P(t, c2 + 2.5, c2 + 3.1)), -ro * 1000); hd.render(t, c2 + 2.9, .6, 1e9, -ro * 1000);
    recap.forEach((r, i) => { const a = popIn(t, e2 + 1.2 + i * .8); tf(r, 0, (1 - a) * 60, a, (1 - a) * -8, Math.min(1, a * 2)); });
  };
};
// ---- 타이틀: 글자가 떨어지며 'segno.' + 별 822 카운트 → 별점 3/5 → 쓰임새 카드 3장 + '무료' 도장 ----
SCENES.title = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2);
  const tag = el('div', 'chip', { left: '110px', top: '200px', background: C.ink, color: '#fff', fontSize: '30px' }, null, '오늘의 오픈소스 · 2026.11.24');
  const word = el('div', null, { position: 'absolute', left: '100px', top: '250px', fontSize: '250px', fontWeight: '900', letterSpacing: '-8px', lineHeight: '1', transformOrigin: 'left top' });
  const letters = [...'segno'].map(ch => el('span', null, { display: 'inline-block' }, word, ch)); const dot = el('span', null, { display: 'inline-block', color: C.orange }, word, '.');
  const chips = [['github.com/heuer/segno', 110, 'mono'], ['★ 0', 560, ''], ['BSD-3-Clause · 상업적 사용 가능', 780, 'mono']].map(c => el('div', 'chip ' + c[2], { left: c[1] + 'px', top: '570px', fontSize: '26px' }, null, c[0]));
  const st = box(1330, 200, 460, 460, 'card', { padding: '22px' }); const code = qr(MAT.wifi, 408, { left: '22px', top: '22px' }, st);
  const rc = box(1060, 190, 740, 330, 'card', { padding: '34px 40px', transformOrigin: 'right top' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, rc, '일반인 쓸모 별점');
  const sr = stars(40, 100, 112, 3, 5, rc); const score = el('div', null, { position: 'absolute', left: '40px', top: '228px', fontSize: '60px', fontWeight: '900', transformOrigin: 'left center' }, rc, '3 <span style="color:#999;font-size:40px">/ 5</span>');
  const uses = [['와이파이', 'wifi', 'wifi'], ['연락처', 'person', 'card'], ['주소', 'link', 'short']].map((u, i) => {
    const c = box(110 + i * 580, 600, 530, 280, 'card', { padding: '34px', display: 'flex', alignItems: 'center', gap: '30px' });
    const L = el('div', null, { flex: '1' }, c); el('div', null, { marginBottom: '18px' }, L, iconTile(u[1])); el('div', null, { fontSize: '52px', fontWeight: '900' }, L, u[0]);
    return { c, q: qr(MAT[u[2]], 190, { position: 'relative' }, c) };
  });
  const free = stamp('무료', 1600, 560, 64, -10);
  return t => {
    const ti = popIn(t, c0 + .2); const top = eIO(P(t, c2 - .3, c2 + .3));
    tf(tag, 0, -top * 60, ti, 0, ti > 0 ? 1 : 0);
    letters.forEach((l, i) => { const a = popIn(t, c0 + .3 + i * .09, .55); l.style.transform = `translateY(${(1 - a) * -320}px) rotate(${(1 - a) * 20}deg)`; l.style.opacity = a > 0 ? 1 : 0; });
    dot.style.transform = `scale(${popIn(t, c0 + .85)})`; tf(word, 0, -top * 60, 1 - top * .35);
    chips.forEach((c, i) => { const a = popIn(t, c0 + 1.3 + i * .8); tf(c, 0, (1 - a) * 40 - top * 40, a, 0, Math.min(1, a * 2) * (1 - top)); });
    count(chips[1], t, c0 + 2.1, 822, 1.6, v => '★ ' + Math.round(v));
    const si = popIn(t, c0 + .7, .6), so = eIO(P(t, c1 - .4, c1 + .1));
    tf(st, so * 900, (1 - si) * -600 - so * 200, 1, (1 - si) * 25 + 6 + Math.sin(t * 1.5) * 1.2 - so * 30, si > 0 ? 1 : 0); code.draw(t, { stamp: c0 + 1.0, dur: 1.3 });
    const ri = popIn(t, c1 - .1, .55), rmv = eIO(P(t, c2 - .3, c2 + .3)); tf(rc, 0, (1 - ri) * 300 - rmv * 60, 1 - rmv * .45, 0, ri > 0 ? 1 : 0);
    sr.render(t, c1 + .5); const sc = popIn(t, c1 + 1.8); score.style.transform = `scale(${sc})`;
    uses.forEach((u, i) => { const a = popIn(t, c2 + .1 + i * .8, .55); tf(u.c, 0, (1 - a) * 500, 1, (1 - a) * 6, a > 0 ? 1 : 0); u.q.draw(t, { stamp: c2 + .4 + i * .8, dur: .9 }); });
    free.render(t, c2 + 2.8);
  };
};
// ---- 시연 ④: QR 4장(L·M·Q·H) → 가운데 주황 상자 5·10·15% → ✓/✗ 줄 → H만 10% 도장 → 25칸→33칸 + -e H ----
SCENES.demo4 = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2), c3 = S.cue(3);
  const caps = [caption(c0, c1 - .2, [['같은', '주소를'], ['*여분 칸*', '네', '단계로']]),
    caption(c1 - .05, c2 - .17, [['가운데를', '*주황 상자*로'], ['가림']]),
    caption(c2 - .02, c3 - .17, [['*H 단계*만'], ['10%까지', '읽힘']]),
    caption(c3 - .02, null, [['대신', '칸이', '늘어남'], ['로고를', '얹을', '때만', '*-e H*']])];
  const X0 = 100, W = 350, G = 40, TOP = 320, cx = i => X0 + i * (W + G) + W / 2;   // 오른쪽 280px는 냥봇 자리
  const cards = EL.map((r, i) => {
    const c = box(X0 + i * (W + G), TOP, W, 430);
    const q = qr(MAT['url' + r.level], 290, { left: '26px', top: '18px' }, c);
    el('div', null, { position: 'absolute', left: '26px', top: '334px', width: '72px', height: '72px', borderRadius: '18px', background: C.ink, color: '#fff', fontSize: '46px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }, c, r.level);
    const k = el('div', null, { position: 'absolute', left: '116px', top: '334px', fontSize: '50px', fontWeight: '900', lineHeight: '1' }, c, '0');
    el('div', null, { position: 'absolute', left: '116px', top: '388px', fontSize: '22px', fontWeight: '700', color: '#777' }, c, '× 칸 (단계 ' + r.level + ')');
    const pills = [5, 10, 15].map((p, j) => pill(`<span style="color:#141414">${p}% 가림</span>&nbsp; ${r.cover[p] ? '✓ 읽힘' : '✗ 실패'}`, r.cover[p], X0 + i * (W + G), 772 + j * 60, W, 50));
    return { c, q, k, pills, r };
  });
  const arrow = pen(arrowPath(cx(0), 800, cx(3), 790, -70), 7);
  const ah = hand('L → H : 여분 칸 ↑ · 칸 수 ↑', cx(1) + 20, 866, 38, -3);
  const hc = pen(ellipsePath(cx(3), 772 + 60 + 25, W / 2 + 26, 40), 6);
  const hs = stamp('H만 10%!', cx(3) + 40, 290, 46, -10);
  const panel = box(X0, TOP, 3 * W + 2 * G, 610, 'card', { padding: '50px 60px' });
  const big = el('div', null, { fontSize: '130px', fontWeight: '900', letterSpacing: '-3px', whiteSpace: 'nowrap', lineHeight: '1.1' }, panel, '');
  el('div', null, { fontSize: '30px', fontWeight: '700', color: '#666', margin: '10px 0 26px' }, panel, '같은 주소 · L 단계 → H 단계 (칸이 촘촘해짐)');
  const tline = el('div', 'mono', { background: C.termBg, color: '#EDEDED', fontSize: '34px', padding: '26px 30px', borderRadius: '14px', whiteSpace: 'pre' }, panel);
  const CMD = 'segno "주소" -e H -o 로고용.png';
  const nb = M.buddy(1636, 548, .62);
  const NB = [{ at: c0 + .8, a: 'enter' }, { at: c0 + 1.5, a: 'wave' }, { at: c0 + 4.8, a: 'point', dir: 'left' }, { at: c1 + .2, a: 'look' }, { at: c2 + .5, a: 'oops' }, { at: c2 + 2.95, a: 'stamp' }, { at: c3 + .6, a: 'point', dir: 'left' }, { at: c3 + 3.6, a: 'happy' }];
  const rowAt = [c1 + 1.0, c2 + .08, c2 + 1.98];
  return t => {
    caps.forEach(c => c.render(t));
    // 가림 상자: 그림 전체(흰 여백 포함) 넓이의 5% → 10% → 15% → 10% (bench.py 와 같은 계산)
    let bx = 0;
    if (t >= c1 + .1) bx = .05 * eBack(P(t, c1 + .1, c1 + .7));
    if (t >= c1 + 1.9) bx = lerp(.05, .10, eBack(P(t, c1 + 1.9, c1 + 2.4)));
    if (t >= c2 + 1.38) bx = lerp(.10, .15, eBack(P(t, c2 + 1.38, c2 + 1.78)));
    if (t >= c2 + 2.48) bx = lerp(.15, .10, eIO(P(t, c2 + 2.48, c2 + 2.88)));
    cards.forEach((C2, i) => {
      const a = popIn(t, c0 + .25 + i * .22, .6);
      const dim = (i < 3) ? eOut(P(t, c2 + 2.68, c2 + 3.08)) : 0, hi = i === 3 ? eBack(P(t, c2 + 2.68, c2 + 3.18)) * .04 : 0;
      const bt = c0 + 4.7 + i * .35, bump = (t > bt && t < bt + .4) ? Math.sin(P(t, bt, bt + .4) * Math.PI) * .06 : 0;
      tf(C2.c, 0, (1 - a) * -700, 1 + hi + bump, (1 - a) * (i % 2 ? 10 : -10), a > 0 ? 1 - dim * .5 : 0); C2.c.style.filter = dim ? `grayscale(${dim})` : 'none';
      C2.q.draw(t, { stamp: c0 + .6 + i * .22, dur: 1.0, box: bx });
      count(C2.k, t, c0 + 2.5 + i * .15, C2.r.n, 1.6);
      C2.pills.forEach((p, j) => pillRender(p, t, rowAt[j] + i * .12, C2.r.cover[[5, 10, 15][j]], dim));
    });
    arrow.set(eOut(P(t, c0 + 4.7, c0 + 6.0)) * (1 - P(t, c1 + .1, c1 + .5))); ah.render(t, c0 + 5.5, .8, c1 + .1);
    hc.set(eOut(P(t, c2 + 2.88, c2 + 3.48)) * (1 - P(t, c3 - .1, c3 + .2))); hs.render(t, c2 + 3.28);
    const pp = eOut(P(t, c3 + .08, c3 + .53)); tf(panel, (1 - pp) * -1600, 0, 1, 0, pp > 0 ? 1 : 0);
    big.innerHTML = `<span style="color:#9aa">25칸</span> → <span style="color:${C.orange}">${Math.round(lerp(25, 33, eOut(P(t, c3 + .73, c3 + 2.33))))}칸</span>`;
    const n = Math.floor(P(t, c3 + 2.0, c3 + 3.5) * CMD.length);
    nb.render(t, NB);
    tline.innerHTML = '<span style="color:#FFB86B">C:\\&gt; </span>' + M.esc(CMD.slice(0, n)) + (Math.floor(t * 2.5) % 2 === 0 ? '<span style="background:#EDEDED">&nbsp;</span>' : '&nbsp;');
  };
};
// ---- 엔딩 (유의사항 2줄) ----
SCENES.end = S => ending(S, { name: 'segno · QR 스티커 인쇄소', lines: [['다음에 또 멋진'], ['*오픈소스*', '소개하겠습니다!']], disclaimer: DISCLAIMER });

// ======================= 숏폼 · 과정 애니메이션 (세로 1080×1920 / 가로 1920×1080 둘 다) =======================
// S.V 로 배치만 바꾼다: 세로 = 위아래로 쌓기, 가로 = 왼쪽·오른쪽 두 칸
const LY = S => S.V ? { x: 70, w: 940, y: 520, x2: 70, y2: 1000, w2: 940 } : { x: 110, w: 820, y: 340, x2: 1030, y2: 150, w2: 780 };
SCENES.s_hook = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['와이파이', '비밀번호,'], ['*아직도*', '불러', '주십니까?']], { size: S.V ? 76 : 78 });
  const cd = box(L.x, S.V ? 620 : 360, S.V ? L.w : 1000, 420, 'card', { padding: '40px 48px' });
  const r1 = el('div', null, { display: 'flex', alignItems: 'center', gap: '28px', fontSize: '50px', fontWeight: '900' }, cd, M.iconTile('wifi', 96) + '<span class="mono">우리집_5G</span>');
  el('div', null, { fontSize: '30px', color: '#777', fontWeight: '700', margin: '40px 0 8px' }, cd, '비밀번호 (시연용 가상 자료)');
  const pw = el('div', 'mono', { fontSize: '64px', fontWeight: '800', display: 'inline-block' }, cd, 'kimchi2026!');
  const strike = pen('M0 0', 9); const hd = hand('→ QR 한 장으로', S.V ? 560 : 820, S.V ? 1110 : 850, 56, -6);
  let pr = null;
  return t => {
    cap.render(t); const a = popIn(t, c0 + .4, .55); tf(cd, 0, (1 - a) * 300, 1, (1 - a) * 4, a > 0 ? 1 : 0);
    if (!pr && a >= 1) { const r = pw.getBoundingClientRect(); pr = `M${r.left - 10} ${r.top + r.height * .55} C ${r.left + r.width * .4} ${r.top + r.height * .45}, ${r.left + r.width * .7} ${r.top + r.height * .62}, ${r.right + 12} ${r.top + r.height * .5}`; strike.el.querySelector('path').setAttribute('d', pr); const Ln = strike.el.querySelector('path').getTotalLength(); strike.el.querySelector('path').style.strokeDasharray = Ln; strike.L = Ln; }
    const sp = eOut(P(t, c0 + 1.9, c0 + 2.5)); if (strike.L) { strike.el.querySelector('path').style.strokeDashoffset = strike.L * (1 - sp); strike.el.style.opacity = sp > 0 ? 1 : 0; } else strike.el.style.opacity = 0;
    hd.render(t, c0 + 2.6, .7);
  };
};
SCENES.s_what = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['*segno*'], ['글을', 'QR', '그림으로']]), caption(c1 - .1, null, [['명령', '한', '줄', '→'], ['*0.06초*']])];
  const tm = term(L.x, L.y, L.w, S.V ? 300 : 330, { fs: S.V ? 30 : 31 });
  const qs = S.V ? 560 : 640, qc = box(S.V ? (1080 - qs) / 2 : L.x2 + 60, S.V ? 860 : 150, qs, qs); const code = qr(MAT.wifi, qs - 60, { left: '30px', top: '30px' }, qc);
  const st = stamp('0.06초', S.V ? 640 : 1560, S.V ? 830 : 120, 60);
  return t => {
    caps.forEach(c => c.render(t)); const a = popIn(t, c0 + .2, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c0 + .8, text: WIFI_CMD, dur: 2.8 }]);
    const q = popIn(t, c1 - .3, .5); tf(qc, 0, (1 - q) * -500, 1, (1 - q) * 10, q > 0 ? 1 : 0); code.draw(t, { stamp: c1 + .2, dur: 1.8 }); st.render(t, c1 + 2.2);
  };
};
SCENES.s_read = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['다른', '프로그램으로'], ['읽으니', '*그대로*']]), caption(c1 - .1, null, [['연락처도,'], ['*1,000장*도']])];
  const qs = S.V ? 460 : 560, qc = box(S.V ? (1080 - qs) / 2 : L.x2 + 100, S.V ? 500 : 190, qs, qs); const code = qr(MAT.wifi, qs - 50, { left: '25px', top: '25px' }, qc);
  const res = box(L.x, S.V ? 1010 : 380, L.w, 330, 'card', { overflow: 'hidden' });
  el('div', null, { background: C.ink, color: '#fff', fontWeight: '800', fontSize: '28px', padding: '14px 28px' }, res, 'zxing-cpp로 읽은 결과');
  const rows = [['와이파이 이름', '우리집_5G'], ['비밀번호', 'kimchi2026!']].map((r, i) => { const d = el('div', null, { display: 'flex', alignItems: 'center', padding: '0 28px', height: '120px', fontSize: '38px', borderBottom: i ? 'none' : '3px dashed #ddd' }, res);
    el('div', null, { width: '260px', color: '#777', fontWeight: '700', fontSize: '28px' }, d, r[0]); el('div', 'mono', { fontWeight: '800', flex: '1' }, d, r[1]); el('div', null, { color: C.green, fontSize: '48px', fontWeight: '900' }, d, '✓'); return d; });
  const ch1 = el('div', 'chip', { left: L.x + 'px', top: (S.V ? 1010 : 380) + 'px', fontSize: '40px', padding: '16px 30px' }, null, '👤 연락처 QR ✓');
  const ch2 = el('div', 'chip', { left: L.x + 'px', top: (S.V ? 1130 : 500) + 'px', fontSize: '40px', padding: '16px 30px' }, null, '');
  return t => {
    caps.forEach(c => c.render(t)); tf(qc, 0, 0, 1, 2, 1); code.draw(t, { scan: scanAt(t, c0 + .3) });
    const ri = popIn(t, c0 + .9, .5), ro = out(t, c1 - .3, .4); tf(res, -ro * 1200, (1 - ri) * 200, 1, 0, ri > 0 ? 1 : 0);
    rows.forEach((d, i) => { d.style.opacity = Math.min(1, popIn(t, c0 + 1.4 + i * .8) * 2); });
    const a1 = popIn(t, c1 + .2), a2 = popIn(t, c1 + 1.0); tf(ch1, 0, (1 - a1) * 40, a1, 0, a1 > 0 ? 1 : 0); tf(ch2, 0, (1 - a2) * 40, a2, 0, a2 > 0 ? 1 : 0);
    count(ch2, t, c1 + 1.1, 1000, 1.6, v => `▦ QR ${Math.round(v).toLocaleString('en-US')}장 · 2.1초`);
  };
};
SCENES.s_cover = S => {
  const c0 = S.cue(0), c1 = S.cue(1);
  const caps = [caption(c0 - .1, c1 - .25, [['가운데를', '*10%*'], ['가리면?']]), caption(c1 - .1, null, [['로고를', '얹을', '땐'], ['*-e H*']])];
  const cw = S.V ? 440 : 340, gx = S.V ? 40 : 40, pos = i => S.V ? [70 + (i % 2) * (cw + gx), 480 + Math.floor(i / 2) * 560] : [110 + i * (cw + gx), 330];
  const nb = S.V ? M.buddy(770, 168, .62) : M.buddy(1636, 548, .62);
  const NB = [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.0, a: 'look' }, { at: c0 + 2.5, a: 'oops' }, { at: c1 - .05, a: 'stamp' }, { at: c1 + 1.5, a: 'happy' }];
  const cards = EL.map((r, i) => { const [x, y] = pos(i); const c = box(x, y, cw, S.V ? 500 : 470);
    const qs = cw - 70; const q = qr(MAT['url' + r.level], qs, { left: '35px', top: '18px' }, c);
    el('div', null, { position: 'absolute', left: '35px', top: (qs + 30) + 'px', fontSize: '44px', fontWeight: '900' }, c, r.level + ' 단계');
    const p = S.V ? pill(r.cover[10] ? '✓ 읽힘' : '✗ 실패', r.cover[10], x + cw - 200, y + qs + 32, 170, 56) : pill(r.cover[10] ? '✓ 읽힘' : '✗ 실패', r.cover[10], x + 35, y + qs + 95, 170, 56);  /* 가로: 단계 글자 아래 (2026-11-24 설치 확인에서 겹침 고침) */ return { c, q, p, r }; });
  const H = cards[3]; const [hx, hy] = pos(3); const hc = pen(ellipsePath(hx + cw / 2, hy + (S.V ? 250 : 235), cw / 2 + 24, (S.V ? 250 : 235) + 18), 7);
  const hs = stamp('H만 10%!', hx + cw - 230, hy - 40, 50, -10);
  return t => {
    caps.forEach(c => c.render(t));
    cards.forEach((C2, i) => { const a = popIn(t, c0 + .15 + i * .15, .55); const dim = i < 3 ? eOut(P(t, c0 + 3.0, c0 + 3.4)) : 0;
      tf(C2.c, 0, (1 - a) * -500, 1, (1 - a) * (i % 2 ? 8 : -8), a > 0 ? 1 - dim * .5 : 0); C2.c.style.filter = dim ? `grayscale(${dim})` : 'none';
      C2.q.draw(t, { stamp: c0 + .3 + i * .15, dur: .8, box: .10 * eBack(P(t, c0 + 1.2, c0 + 1.8)) });
      pillRender(C2.p, t, c0 + 2.2 + i * .12, C2.r.cover[10], dim); });
    hc.set(eOut(P(t, c0 + 3.3, c0 + 3.9))); hs.render(t, c1 + .3); nb.render(t, NB);
  };
};
SCENES.s_end = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['설치는'], ['*명령 한 줄*']]);
  const tm = term(L.x, S.V ? 560 : 360, S.V ? L.w : 900, 220, { fs: 34 });
  const rc = box(S.V ? L.x : 1080, S.V ? 860 : 360, S.V ? L.w : 720, 300, 'card', { padding: '34px 40px' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, rc, '일반인 쓸모 별점'); const sr = stars(40, 100, 112, 3, 5, rc);
  return t => { cap.render(t); const a = popIn(t, c0, .5); tf(tm.el, 0, (1 - a) * 200, 1, 0, a > 0 ? 1 : 0); tm.render(t, [{ at: c0 + .4, text: 'py -m pip install segno', dur: 1.4 }]);
    const b = popIn(t, c0 + 1.6, .5); tf(rc, 0, (1 - b) * 200, 1, 0, b > 0 ? 1 : 0); sr.render(t, c0 + 2.0); };
};
