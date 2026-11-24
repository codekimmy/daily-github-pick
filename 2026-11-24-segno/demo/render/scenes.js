// segno (2026-11-24) 모션 장면 — tools/motion 예시
// 숫자: data.js 의 RES (= demo/results.json 시연 측정값), QR 칸 배열: MAT (segno 로 만든 실제 QR, mkdata.py)
// 시간: 모두 S.cue(i)(자막 i 의 시작 초) 기준 → retime.py 로 구간이 바뀌어도 그대로 따라감
// 2026-11-24 Day 29 다시 만들기: 롱폼 14개 장 모두 직접 만듦, end 를 뺀 모든 장과 숏폼 모든 장면에 냥봇(장마다 2~4번 반응)
const { C, P, eOut, eIO, eBack, lerp, popIn, out, shake, el, box, tf, caption, stamp, hand, pen, ellipsePath, arrowPath, circleAround, count, term, qr, scanAt, pill, pillRender, stars, iconTile, ending } = M;
const EL = RES.errorlevel.map(e => ({ level: e.level, cover: e.cover, n: MAT['url' + e.level].length }));
const WIFI_CMD = 'segno "WIFI:T:WPA;S:우리집_5G;P:kimchi2026!;;" -o wifi.png --scale 10';
const DISCLAIMER = ['정보 제공용 · 2026-11-24 클라우드 시연 결과(운영자 직접 검증 아님) · 와이파이·연락처는 시연용 가상 자료', '휴대폰 기종·Windows에 따라 결과가 다를 수 있음 · 비밀번호 QR은 아는 사람에게만 · 인쇄 전 내 휴대폰으로 읽어 확인'];
const SCENES = {};

// ======================= 롱폼 (1920×1080) =======================
// ---- 미리보기: 명령 타이핑 → QR 칸이 찍혀 나옴 + 0.06초 도장 → 읽기 띠 + 결과 카드 + 빨간 펜 ----
SCENES.preview = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2), e2 = S.cueEnd(2);
  const caps = [caption(c0 - .1, c1 - .3, [['가상', '와이파이로'], ['*명령 한 줄*']]),
    caption(c1 - .1, c2 - .3, [['segno가'], ['*0.06초*', '만에', 'QR']]),
    caption(c2 - .06, e2 + .5, [['휴대폰', 'QR', '앱으로', '읽어도'], ['*그대로*', '나옴']]),
    caption(e2 + .7, null, [['이 QR을', '만든'], ['*오늘의 오픈소스*']])];
  const tm = term(110, 380, 860, 330);
  const res = box(110, 380, 860, 400, 'card', { overflow: 'hidden' });
  el('div', null, { background: C.ink, color: '#fff', fontWeight: '800', fontSize: '28px', padding: '16px 30px' }, res, 'QR로 읽은 결과');
  const rows = [['와이파이 이름', '우리집_5G'], ['비밀번호', 'kimchi2026!'], ['방식', 'WPA']].map((r, i) => {
    const d = el('div', null, { display: 'flex', alignItems: 'center', padding: '0 30px', height: '96px', borderBottom: i < 2 ? '3px dashed #ddd' : 'none', fontSize: '34px' }, res);
    el('div', null, { width: '250px', color: '#777', fontWeight: '700', fontSize: '28px' }, d, r[0]);
    const v = el('div', 'mono', { fontWeight: '800' }, d, r[1]); el('div', null, { flex: '1' }, d);
    const ck = el('div', null, { width: '54px', height: '54px', borderRadius: '50%', background: C.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px', fontWeight: '900' }, d, '✓');
    return { d, v, ck };
  });
  const circ = pen(circleAround(rows[0].v, 28, 18), 6);
  const vr = rows[0].v.getBoundingClientRect();
  const hd = hand('← 한글 그대로', vr.right + 46, vr.top + 4, 34);
  const qc = box(1030, 170, 560, 560); const code = qr(MAT.wifi, 500, { left: '30px', top: '30px' }, qc);
  const st = stamp('0.06초', 1400, 130, 58);
  const chip = el('div', 'chip', { left: '1220px', top: '770px' }, null, '29 × 29칸');
  const nb = M.buddy(1636, 548, .62);
  const okb = el('div', null, { position: 'absolute', left: '1520px', top: '680px', width: '96px', height: '96px', borderRadius: '50%', background: C.green, border: '4px solid #141414', color: '#fff', fontSize: '58px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }, null, '✓');
  const recap = ['⌨ 명령 한 줄', '⚡ 0.06초', '✓ 그대로 읽힘'].map((s, i) => el('div', 'chip', { left: (110 + i * 330) + 'px', top: '560px', fontSize: '34px', padding: '14px 28px' }, null, s));
  return t => {
    caps.forEach(c => c.render(t));
    const ti = popIn(t, c0 - .15, .55), tx = out(t, c2 - .3, .45); tf(tm.el, -tx * 1000, (1 - ti) * 400, 1, 0, 1 - tx);
    tm.render(t, [{ at: c0 + .6, text: WIFI_CMD, dur: 2.8 }, { at: c0 + 3.95, kind: 'out', text: '✓ wifi.png 저장 · 29 × 29칸 · 490바이트' }]);
    const qi = popIn(t, c1 - .8, .5), qo = 0;   // 음성 길이에 맞춰 장이 짧아져도 결과 화면을 끝까지 유지 (2026-11-25)
    tf(qc, qo * -200, (1 - qi) * -500, 1 - qo * .35, (1 - qi) * 12 + Math.sin(t * 1.3) * .6, qi > 0 ? 1 - qo : 0);
    code.draw(t, { stamp: c1 + .06, dur: 1.9, scan: scanAt(t, c2 + .04) });
    st.render(t, c1 + 2.3, e2 + .6); const cp = popIn(t, c1 + 2.9); tf(chip, qo * -200, (1 - cp) * 30, cp, 0, cp * (1 - qo));
    const kb = popIn(t, c2 + 1.85, .45); tf(okb, qo * -200, 0, kb, 0, kb > 0 ? 1 - qo : 0);
    const ri = eOut(P(t, c2 + .2, c2 + .7)), ro = 0; tf(res, (1 - ri) * -1000 - ro * 1000, 0, 1, 0, ri > 0 ? 1 : 0);
    rows.forEach((r, i) => { const a = popIn(t, c2 + .7 + i * .8, .4); r.d.style.opacity = Math.min(1, a * 2); r.d.style.transform = `translateX(${(1 - a) * -60}px)`; r.ck.style.transform = `scale(${popIn(t, c2 + 1.0 + i * .8, .4)})`; });
    circ.set(eOut(P(t, c2 + 2.5, c2 + 3.1)), -ro * 1000); hd.render(t, c2 + 2.9, .6, 1e9, -ro * 1000);
    recap.forEach(r => tf(r, 0, 0, 1, 0, 0));   // 요약 알약은 쓰지 않음 (장 끝이 짧아 끝까지 나타나지 못함)
    nb.render(t, [{ at: c0 + .6, a: 'enter' }, { at: c0 + 1.2, a: 'point', dir: 'left' }, { at: c1 + 2.3 - .35, a: 'stamp' }, { at: c2 + 2.0, a: 'nod' }]);
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
    const c = box(110 + i * 500, 600, 470, 280, 'card', { padding: '34px', display: 'flex', alignItems: 'center', gap: '30px' });
    const L = el('div', null, { flex: '1' }, c); el('div', null, { marginBottom: '18px' }, L, iconTile(u[1])); el('div', null, { fontSize: '44px', fontWeight: '900', whiteSpace: 'nowrap' }, L, u[0]);
    return { c, q: qr(MAT[u[2]], 190, { position: 'relative' }, c) };
  });
  const free = stamp('무료', 1330, 560, 64, -10);
  const nb = M.buddy(1636, 548, .62);
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
    nb.render(t, [{ at: c0 + .8, a: 'enter' }, { at: c0 + 1.4, a: 'wave' }, { at: c1 + 2.0, a: 'nod' }, { at: c2 + 2.8 - .35, a: 'stamp' }]);
  };
};
// ---- 시연 ④: QR 4장(L·M·Q·H) → 가운데 주황 상자 5·10·15% → ✓/✗ 줄 → H만 10% 도장 → 25칸→33칸 + -e H ----
SCENES.demo4 = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2), c3 = S.cue(3);
  const caps = [caption(c0, c1 - .2, [['같은', '주소', 'QR', '4장'], ['*여분 칸*', '양만', '다름']]),
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
const NBX = S => S.V ? M.buddy(770, 168, .62) : M.buddy(1636, 548, .62);   // 세로: 오른쪽 위 · 가로: 오른쪽 아래
const LY = S => S.V ? { x: 70, w: 940, y: 520, x2: 70, y2: 1000, w2: 940 } : { x: 110, w: 820, y: 340, x2: 1030, y2: 150, w2: 780 };
SCENES.s_hook = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['와이파이', '비밀번호,'], ['*아직도*', '불러', '주십니까?']], { size: S.V ? 76 : 78 });
  const cd = box(L.x, S.V ? 620 : 360, S.V ? L.w : 1000, 420, 'card', { padding: '40px 48px' });
  const r1 = el('div', null, { display: 'flex', alignItems: 'center', gap: '28px', fontSize: '50px', fontWeight: '900' }, cd, M.iconTile('wifi', 96) + '<span class="mono">우리집_5G</span>');
  el('div', null, { fontSize: '30px', color: '#777', fontWeight: '700', margin: '40px 0 8px' }, cd, '비밀번호 (시연용 가상 자료)');
  const pw = el('div', 'mono', { fontSize: '64px', fontWeight: '800', display: 'inline-block' }, cd, 'kimchi2026!');
  const strike = pen('M0 0', 9); const nb = NBX(S); const hd = hand('→ QR 한 장으로', S.V ? 560 : 820, S.V ? 1110 : 850, 56, -6);
  let pr = null;
  return t => {
    cap.render(t); const a = popIn(t, c0 + .4, .55); tf(cd, 0, (1 - a) * 300, 1, (1 - a) * 4, a > 0 ? 1 : 0);
    if (!pr && a >= 1) { const r = pw.getBoundingClientRect(); pr = `M${r.left - 10} ${r.top + r.height * .55} C ${r.left + r.width * .4} ${r.top + r.height * .45}, ${r.left + r.width * .7} ${r.top + r.height * .62}, ${r.right + 12} ${r.top + r.height * .5}`; strike.el.querySelector('path').setAttribute('d', pr); const Ln = strike.el.querySelector('path').getTotalLength(); strike.el.querySelector('path').style.strokeDasharray = Ln; strike.L = Ln; }
    const sp = eOut(P(t, c0 + 1.9, c0 + 2.5)); if (strike.L) { strike.el.querySelector('path').style.strokeDashoffset = strike.L * (1 - sp); strike.el.style.opacity = sp > 0 ? 1 : 0; } else strike.el.style.opacity = 0;
    hd.render(t, c0 + 2.6, .7);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.1, a: 'look' }, { at: c0 + 1.9, a: 'oops' }, { at: c0 + 2.7, a: 'point', dir: 'left' }]);
  };
};
SCENES.s_what = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['*segno*'], ['글을', 'QR', '그림으로']]), caption(c1 - .1, null, [['명령', '한', '줄', '→'], ['*0.06초*']])];
  const tm = term(L.x, L.y, L.w, S.V ? 300 : 330, { fs: S.V ? 30 : 31 });
  const qs = S.V ? 560 : 520, qc = box(S.V ? (1080 - qs) / 2 : 1060, S.V ? 860 : 330, qs, qs); const code = qr(MAT.wifi, qs - 60, { left: '30px', top: '30px' }, qc);
  const st = stamp('0.06초', S.V ? 640 : 1380, S.V ? 830 : 300, 60); const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t)); const a = popIn(t, c0 + .2, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c0 + .8, text: WIFI_CMD, dur: 2.8 }]);
    const q = popIn(t, c1 - .3, .5); tf(qc, 0, (1 - q) * -500, 1, (1 - q) * 10, q > 0 ? 1 : 0); code.draw(t, { stamp: c1 + .2, dur: 1.8 }); st.render(t, c1 + 2.2);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.0, a: 'point', dir: S.V ? 'left' : 'left' }, { at: c1 + 2.2 - .35, a: 'stamp' }]);
  };
};
SCENES.s_read = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['휴대폰', 'QR', '앱으로'], ['읽으니', '*그대로*']]), caption(c1 - .1, null, [['연락처도,'], ['*1,000장*도']])];
  const qs = S.V ? 460 : 480, qc = box(S.V ? (1080 - qs) / 2 : 1080, S.V ? 500 : 340, qs, qs); const nb = NBX(S); const code = qr(MAT.wifi, qs - 50, { left: '25px', top: '25px' }, qc);
  const res = box(L.x, S.V ? 1010 : 380, L.w, 330, 'card', { overflow: 'hidden' });
  el('div', null, { background: C.ink, color: '#fff', fontWeight: '800', fontSize: '28px', padding: '14px 28px' }, res, 'QR로 읽은 결과');
  const rows = [['와이파이 이름', '우리집_5G'], ['비밀번호', 'kimchi2026!']].map((r, i) => { const d = el('div', null, { display: 'flex', alignItems: 'center', padding: '0 28px', height: '120px', fontSize: '38px', borderBottom: i ? 'none' : '3px dashed #ddd' }, res);
    el('div', null, { width: '260px', color: '#777', fontWeight: '700', fontSize: '28px' }, d, r[0]); el('div', 'mono', { fontWeight: '800', flex: '1' }, d, r[1]); el('div', null, { color: C.green, fontSize: '48px', fontWeight: '900' }, d, '✓'); return d; });
  const ch1 = el('div', 'chip', { left: L.x + 'px', top: (S.V ? 1010 : 380) + 'px', fontSize: '40px', padding: '16px 30px' }, null, '👤 연락처 QR ✓');
  const ch2 = el('div', 'chip', { left: L.x + 'px', top: (S.V ? 1130 : 500) + 'px', fontSize: '40px', padding: '16px 30px' }, null, '');
  return t => {
    caps.forEach(c => c.render(t)); tf(qc, 0, 0, 1, 2, 1); code.draw(t, { scan: scanAt(t, c0 + .3) });
    const ri = popIn(t, c0 + .9, .5), ro = out(t, c1 - .3, .4); tf(res, -ro * 1200, (1 - ri) * 200, 1, 0, ri > 0 ? 1 : 0);
    rows.forEach((d, i) => { d.style.opacity = Math.min(1, popIn(t, c0 + 1.4 + i * .8) * 2); });
    const a1 = popIn(t, c1 + .2), a2 = popIn(t, c1 + 1.0); tf(ch1, 0, (1 - a1) * 40, a1, 0, a1 > 0 ? 1 : 0); tf(ch2, 0, (1 - a2) * 40, a2, 0, a2 > 0 ? 1 : 0);
    count(ch2, t, c1 + 1.1, 1000, 1.6, v => `▦ QR ${Math.round(v).toLocaleString('en-US')}장 · ${RES.many1000}초`);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 2.3, a: 'nod' }, { at: c1 + 2.8, a: 'happy' }]);
  };
};
SCENES.s_cover = S => {
  const c0 = S.cue(0), c1 = S.cue(1);
  const caps = [caption(c0 - .1, c1 - .25, [['가운데를', '*10%*'], ['가리면?']]), caption(c1 - .1, null, [['로고를', '얹을', '땐'], ['*-e H*']])];
  const cw = S.V ? 440 : 340, gx = S.V ? 40 : 40, pos = i => S.V ? [70 + (i % 2) * (cw + gx), 480 + Math.floor(i / 2) * 560] : [110 + i * (cw + gx), 330];
  const nb = NBX(S);
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
  const tm = term(L.x, S.V ? 560 : 360, S.V ? L.w : 880, 220, { fs: 34 });
  const nb = NBX(S); const rc = box(S.V ? L.x : 1060, S.V ? 860 : 360, S.V ? L.w : 540, 300, 'card', { padding: '34px 40px' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, rc, '일반인 쓸모 별점'); const sr = stars(40, 100, S.V ? 112 : 78, 3, 5, rc);
  return t => { cap.render(t); const a = popIn(t, c0, .5); tf(tm.el, 0, (1 - a) * 200, 1, 0, a > 0 ? 1 : 0); tm.render(t, [{ at: c0 + .4, text: 'py -m pip install segno', dur: 1.4 }]);
    const b = popIn(t, c0 + 1.6, .5); tf(rc, 0, (1 - b) * 200, 1, 0, b > 0 ? 1 : 0); sr.render(t, c0 + 2.0);
    nb.render(t, [{ at: c0 + .2, a: 'enter' }, { at: c0 + .7, a: 'point', dir: 'left' }, { at: c0 + 2.6, a: 'happy' }]); };
};

// ======================= 롱폼 나머지 장 (2026-11-24 Day 29 다시 만들기) =======================
// 공통: 큰 제목은 자막마다 1개(caps), 무대 y 320~930, 카드는 x 1600 안쪽(오른쪽 280px = 냥봇 자리)
const capsOf = (S, arr) => arr.map((L, i) => caption(S.cue(i) - .1, i < arr.length - 1 ? S.cue(i + 1) - .25 : null, L));
const NB = () => M.buddy(1636, 548, .62);
const fadeIn = (t, a, d = .5) => Math.min(1, popIn(t, a, d) * 2);
const dropIn = (e, t, a, dy = -500, r = 0) => { const k = popIn(t, a, .55); tf(e, 0, (1 - k) * dy, 1, (1 - k) * r, k > 0 ? 1 : 0); return k; };
const slideIn = (e, t, a, dx = -300) => { const k = popIn(t, a, .5); tf(e, (1 - k) * dx, 0, 1, 0, k > 0 ? Math.min(1, k * 2) : 0); return k; };
const tagChip = (txt, x, y, css = {}) => el('div', 'chip', Object.assign({ left: x + 'px', top: y + 'px' }, css), null, txt);
function qrCard(mat, x, y, w, qs, label) {
  const c = box(x, y, w, qs + 140); const q = qr(mat, qs, { left: ((w - qs) / 2) + 'px', top: '18px' }, c);
  const k = el('div', null, { position: 'absolute', left: '0', right: '0', top: (qs + 30) + 'px', textAlign: 'center', fontSize: '44px', fontWeight: '900' }, c, '0');
  const lb = el('div', null, { position: 'absolute', left: '0', right: '0', top: (qs + 86) + 'px', textAlign: 'center', fontSize: '26px', fontWeight: '700', color: '#666' }, c, label);
  return { c, q, k, lb };
}

// ---- 01 무엇인가: 주문서 → 화살표 → QR 스티커(25칸 → 61칸) → 가운데 상자 + ✓ → 라이선스 알약 ----
SCENES.what = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['segno', '='], ['*QR 스티커*', '인쇄소']], [['①', '주문서', '='], ['*넣을 글*']], [['②', '글이', '길수록'], ['*칸이*', '많아짐']], [['③', '*여분 칸*을', '넣으면'], ['가려져도', '읽힘']], [['파이썬', '프로그램'], ['*상업적 사용*', '가능']]]);
  const slip = box(110, 340, 520, 470, 'card', { padding: '30px 36px', background: '#FFF8E1' });
  el('div', null, { fontSize: '40px', fontWeight: '900', marginBottom: '20px' }, slip, '🧾 주문서');
  const lines = [['주소', 'https://example.com'], ['와이파이', 'WIFI:T:WPA;S:…;;'], ['연락처', 'MECARD:N:김하늘;…']].map(r => {
    const d = el('div', null, { borderTop: '3px dashed #d8c9a0', padding: '16px 0' }, slip);
    el('div', null, { fontSize: '30px', fontWeight: '900' }, d, r[0]); el('div', 'mono', { fontSize: '22px', color: '#555' }, d, r[1]); return d; });
  const arrow = pen(arrowPath(650, 560, 760, 560, -40), 8);
  const qc = box(790, 330, 520, 560); const q1 = qr(MAT.short, 460, { left: '30px', top: '20px' }, qc), q2 = qr(MAT.k100, 460, { left: '30px', top: '20px' }, qc);
  const cnt = el('div', null, { position: 'absolute', left: '0', right: '0', top: '488px', textAlign: 'center', fontSize: '44px', fontWeight: '900' }, qc, '');
  const okp = pill('✓ 가려져도 읽힘', true, 1340, 420, 250, 56);
  const chips = [['🐍 Python', 110], ['★ 822', 380], ['BSD-3-Clause', 600]].map(([s, x]) => tagChip(s, x, 860, { fontSize: '28px' }));
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(slip, t, c[1] - .2, 400, -4); lines.forEach((d, i) => { d.style.opacity = fadeIn(t, c[1] + .4 + i * .8); });
    arrow.set(eOut(P(t, c[1] + 2.8, c[1] + 3.4)));
    dropIn(qc, t, c[0] + .3, -600, 8);
    const big = t >= c[2] + .3; q1.el.style.display = big ? 'none' : 'block'; q2.el.style.display = big ? 'block' : 'none';
    q1.draw(t, { stamp: c[0] + .7, dur: 1.4 }); q2.draw(t, { stamp: c[2] + .3, dur: 1.8, box: .06 * eBack(P(t, c[3] + .4, c[3] + .9)) });
    const n = t < c[2] + .3 ? Math.round(25 * eOut(P(t, c[0] + .7, c[0] + 2.2))) : Math.round(lerp(25, 61, eOut(P(t, c[2] + .3, c[2] + 2.0))));
    cnt.textContent = n ? `${n} × ${n}칸` : '';
    pillRender(okp, t, c[3] + 1.4, true);
    chips.forEach((e, i) => { const a = popIn(t, c[4] + .3 + i * .8); tf(e, 0, (1 - a) * 40, a, 0, a > 0 ? 1 : 0); });
    nb.render(t, [{ at: c[0] + .5, a: 'enter' }, { at: c[1] + 1.0, a: 'point', dir: 'left' }, { at: c[3] + 1.5, a: 'nod' }, { at: c[4] + 1.5, a: 'happy' }]);
  };
};

// ---- 02 설치: 'Add python.exe to PATH' 체크 카드 → 명령 창 타이핑 → 0.61초 카운트 · 함께 설치 0개 → segno --ver ----
SCENES.install = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['먼저'], ['*파이썬*', '설치']], [['명령', '*한 줄*로'], ['segno', '설치']], [['*' + RES.install.sec + '초*', '만에'], ['설치', '끝']], [['버전', '확인'], ['*' + RES.version + '*']]]);
  const ck = box(110, 340, 700, 190, 'card', { padding: '28px 34px' });
  el('div', null, { fontSize: '26px', fontWeight: '700', color: '#666', marginBottom: '14px' }, ck, 'python.org 설치 첫 화면 아래쪽');
  const row = el('div', null, { display: 'flex', alignItems: 'center', gap: '22px', fontSize: '38px', fontWeight: '900' }, ck);
  const bx = el('div', null, { width: '56px', height: '56px', border: '5px solid #141414', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green, fontSize: '44px' }, row, '');
  el('div', 'mono', { fontSize: '32px' }, row, 'Add python.exe to PATH');
  const tm = term(110, 560, 1480, 360, { fs: 34 });
  const sec = tagChip('', 860, 360, { fontSize: '40px', padding: '14px 30px' }), dep = tagChip('함께 설치되는 프로그램 0개', 860, 450, { fontSize: '32px' });
  const win = tagChip('Windows 실행은 시연 확인 전 · 안 되면 py -m segno.cli', 860, 450, { fontSize: '26px', background: '#FFF6CC' });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(ck, t, c[0] + .2, 300); bx.textContent = t > c[0] + 1.6 ? '✓' : ''; bx.style.transform = `scale(${t > c[0] + 1.6 ? popIn(t, c[0] + 1.6, .4) : 1})`;
    dropIn(tm.el, t, c[1] - .3, 400);
    tm.render(t, [{ at: c[1] + .4, text: 'py -m pip install segno', dur: 1.4 }, { at: c[2] + .2, kind: 'out', text: 'Successfully installed segno-1.6.6' }, { at: c[3] + .3, text: 'segno --ver', dur: .8 }, { at: c[3] + 1.4, kind: 'out', text: RES.version }]);
    const a = popIn(t, c[2] + .3); tf(sec, 0, (1 - a) * 40, a, 0, a > 0 ? 1 : 0); count(sec, t, c[2] + .4, RES.install.sec * 100, 1.6, v => '⏱ ' + (v / 100).toFixed(2) + '초');
    const b = popIn(t, c[2] + 1.3) * (1 - out(t, c[3] - .1)); tf(dep, 0, (1 - b) * 40, Math.max(b, .001), 0, b);
    const w = popIn(t, c[3] + 2.0); tf(win, 0, (1 - w) * 40, w, 0, w > 0 ? 1 : 0);
    nb.render(t, [{ at: c[0] + .5, a: 'enter' }, { at: c[1] + .6, a: 'point', dir: 'left' }, { at: c[2] + 1.0, a: 'nod' }, { at: c[3] + 2.2, a: 'look' }]);
  };
};

// ---- 03 시연 ① 와이파이 QR: 형식 카드 → 명령 타이핑 → QR 찍힘 + 0.06초 → 칸·픽셀·바이트 알약 → 읽는 띠 + 결과 ✓ → 빨간 손글씨 ----
SCENES.demo1 = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['와이파이', 'QR은'], ['*정해진 형식*']], [['명령', '한', '줄', '→'], ['*' + RES.wifi.sec.toFixed(2) + '초*']], [['*29 × 29칸*'], ['490바이트', 'PNG']], [['휴대폰', 'QR', '앱으로', '읽기'], ['*그대로*', '나옴']], [['실제', '와이파이', '접속은'], ['*확인 못 함*']]]);
  const fm = box(110, 340, 860, 140, 'card', { padding: '26px 34px' });
  el('div', 'mono', { fontSize: '40px', fontWeight: '800' }, fm, 'WIFI:T:<b style="color:#FF5A1F">WPA</b>;S:<b style="color:#FF5A1F">이름</b>;P:<b style="color:#FF5A1F">비밀번호</b>;;');
  const tm = term(110, 510, 860, 240, { fs: 28 });
  const res = box(110, 510, 860, 330, 'card', { overflow: 'hidden' });
  el('div', null, { background: C.ink, color: '#fff', fontWeight: '800', fontSize: '28px', padding: '14px 30px' }, res, 'QR로 읽은 결과');
  const rows = [['이름', '우리집_5G'], ['비밀번호', 'kimchi2026!'], ['방식', 'WPA']].map((r, i) => {
    const d = el('div', null, { display: 'flex', alignItems: 'center', padding: '0 30px', height: '88px', borderBottom: i < 2 ? '3px dashed #ddd' : 'none', fontSize: '34px' }, res);
    el('div', null, { width: '220px', color: '#777', fontWeight: '700', fontSize: '28px' }, d, r[0]); el('div', 'mono', { fontWeight: '800', flex: '1' }, d, r[1]);
    el('div', null, { color: C.green, fontSize: '44px', fontWeight: '900' }, d, '✓'); return d; });
  const qc = box(1050, 330, 520, 520); const code = qr(MAT.wifi, 460, { left: '30px', top: '30px' }, qc);
  const sec = tagChip('', 1060, 262, { fontSize: '34px' });
  const info = [`29 × 29칸`, `${RES.wifi.px} × ${RES.wifi.px} 픽셀`, `${RES.wifi.bytes}바이트`].map((s, i) => tagChip(s, 1050 + [0, 165, 400][i], 866, { fontSize: '26px' }));
  const hd = hand('✗ 실제 와이파이 접속은 확인 못 함 (가상 와이파이)', 120, 868, 36, -2);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(fm, t, c[0] + .3, 300);
    const ti = popIn(t, c[1] - .3), to = out(t, c[3] - .3, .4); tf(tm.el, -to * 1100, (1 - ti) * 300, 1, 0, ti > 0 ? 1 - to : 0);
    tm.render(t, [{ at: c[1] + .2, text: WIFI_CMD, dur: 2.4 }, { at: c[1] + 2.8, kind: 'out', text: '✓ wifi.png 저장' }]);
    dropIn(qc, t, c[1] + 2.6, -600, 8); code.draw(t, { stamp: c[1] + 2.9, dur: 1.6, scan: scanAt(t, c[3] + .1) });
    const sa = popIn(t, c[1] + 4.6); tf(sec, 0, (1 - sa) * 30, sa, 0, sa > 0 ? 1 : 0); count(sec, t, c[1] + 4.6, RES.wifi.sec * 100, 1.5, v => '⏱ ' + (v / 100).toFixed(2) + '초');
    info.forEach((e, i) => { const a = popIn(t, c[2] + .3 + i * .8); tf(e, 0, (1 - a) * -30, a, 0, a > 0 ? 1 : 0); });
    const ri = popIn(t, c[3] + .1, .5); tf(res, (1 - ri) * -900, 0, 1, 0, ri > 0 ? 1 : 0);
    rows.forEach((d, i) => { d.style.opacity = fadeIn(t, c[3] + 1.6 + i * .8); });
    hd.render(t, c[4] + .4, .8);
    nb.render(t, [{ at: c[0] + .5, a: 'enter' }, { at: c[1] + 3.0, a: 'point', dir: 'left' }, { at: c[3] + 2.4, a: 'nod' }, { at: c[4] + .4, a: 'oops' }]);
  };
};

// ---- 04 시연 ② 연락처 QR: 가상 명함 카드 → MECARD QR(33칸 카운트) → vCard QR(41칸) → 두 카드 아래 ✓ 알약 ----
SCENES.demo2 = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['연락처에도'], ['*정해진 형식*']], [['MECARD', '→'], ['*33 × 33칸*']], [['회사', '이름까지', '넣으면'], ['*41 × 41칸*']], [['두', '형식', '모두'], ['한글', '이름', '*그대로*']]]);
  const card = box(110, 340, 520, 470, 'card', { padding: '30px 34px' });
  el('div', null, { fontSize: '24px', fontWeight: '800', color: '#999', marginBottom: '12px' }, card, '시연용 가상 인물');
  el('div', null, { display: 'flex', alignItems: 'center', gap: '22px', fontSize: '56px', fontWeight: '900', marginBottom: '24px' }, card, M.iconTile('person', 90) + '김하늘');
  const rows = [['전화', '010-1234-5678'], ['메일', 'sky@example.com'], ['회사', '가상상회 (vCard만)']].map(r => { const d = el('div', null, { borderTop: '3px dashed #ddd', padding: '14px 0', fontSize: '30px' }, card);
    d.innerHTML = `<span style="color:#888;font-weight:700;display:inline-block;width:90px">${r[0]}</span><b class="mono">${r[1]}</b>`; return d; });
  const A = qrCard(MAT.card, 670, 330, 450, 380, 'MECARD 형식'), B = qrCard(MAT.vcard, 1150, 330, 450, 380, 'vCard 형식');
  const pA = pill('✓ 한글 이름 읽힘', true, 715, 870, 360, 52), pB = pill('✓ 한글 이름 읽힘', true, 1195, 870, 360, 52);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(card, t, c[0] + .3, 300, -3); rows.forEach((d, i) => { d.style.opacity = fadeIn(t, c[0] + 1.0 + i * .8); });
    dropIn(A.c, t, c[1] - .2, -600, -6); A.q.draw(t, { stamp: c[1] + .2, dur: 1.5 }); count(A.k, t, c[1] + .3, MAT.card.length, 1.6, v => `${Math.round(v)} × ${Math.round(v)}칸`);
    dropIn(B.c, t, c[2] - .2, -600, 6); B.q.draw(t, { stamp: c[2] + .2, dur: 1.6 }); count(B.k, t, c[2] + .3, MAT.vcard.length, 1.6, v => `${Math.round(v)} × ${Math.round(v)}칸`);
    pillRender(pA, t, c[3] + .4, true); pillRender(pB, t, c[3] + .55, true);
    nb.render(t, [{ at: c[0] + .5, a: 'enter' }, { at: c[1] + .8, a: 'point', dir: 'left' }, { at: c[2] + 1.0, a: 'look' }, { at: c[3] + 1.0, a: 'nod' }]);
  };
};

// ---- 05 시연 ③ 글 길이: QR 3장(25·61·129칸) 차례로 → 한글 984자 알약 + 1,000자 오류 줄(빨간 손글씨) → 짧은 주소 카드 빨간 펜 동그라미 ----
SCENES.demo3 = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['글이', '길수록'], ['칸이', '*촘촘*']], [['25칸', '→', '61칸', '→'], ['*129칸*']], [['한글', '*984자*까지'], ['1,000자는', '오류']], [['작게', '인쇄하면'], ['*짧은 글*이', '유리']]]);
  const L = RES.length, items = [[MAT.short, '짧은 주소 ' + L[0].chars + '자'], [MAT.k100, '한글 ' + L[2].chars + '자'], [MAT.k500, '한글 ' + L[3].chars + '자']];
  const cards = items.map((it, i) => qrCard(it[0], 110 + i * 500, 320, 460, 330, it[1]));
  const er = box(110, 800, 1480, 110, 'card dark', { padding: '0 34px', display: 'flex', alignItems: 'center' });
  el('div', 'mono', { fontSize: '30px', color: '#FF8A80' }, er, '✗ 한글 1,000자 → ' + M.esc(RES.toolong.msg));
  const mx = tagChip('', 1250, 262, { fontSize: '32px', background: '#FFF6CC' });
  const circ = pen(ellipsePath(110 + 230, 320 + 235, 260, 255), 7);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((k, i) => { const at = i === 0 ? c[0] + .3 : c[1] + (i - 1) * 1.2; const dim = i > 0 ? eOut(P(t, c[3] + .2, c[3] + .7)) * .55 : 0;
      dropIn(k.c, t, at, -600, i % 2 ? 6 : -6); k.c.style.opacity = (popIn(t, at, .55) > 0 ? 1 : 0) * (1 - dim); k.q.draw(t, { stamp: at + .3, dur: 1.2 });
      count(k.k, t, at + .4, [L[0], L[2], L[3]][i].modules, 1.5, v => `${Math.round(v)} × ${Math.round(v)}칸`); });
    const ea = popIn(t, c[2] + .5); tf(er, 0, (1 - ea) * 150, 1, 0, ea > 0 ? 1 : 0); tf(er.firstChild, shake(t, c[2] + .9, .35, 6), 0, 1, 0, 1);
    const ma = popIn(t, c[2] + .2); tf(mx, 0, (1 - ma) * 30, ma, 0, ma > 0 ? 1 : 0); count(mx, t, c[2] + .3, RES.max_korean, 1.6, v => '한글 최대 ' + Math.round(v) + '자');
    circ.set(eOut(P(t, c[3] + .6, c[3] + 1.3)));
    nb.render(t, [{ at: c[0] + .5, a: 'enter' }, { at: c[1] + 2.6, a: 'look' }, { at: c[2] + .9, a: 'oops' }, { at: c[3] + .6, a: 'pen' }]);
  };
};

// ---- 07 시연 ⑤ 색·여백·흐림: 색 QR 5장 + ✓ → 연회색 빨간 펜 + 손글씨 → 어두운 바탕 여백 0칸 ✗ / 4칸 ✓ → 카메라 흉내 알약 5개 ----
SCENES.demo5 = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['색을', '바꿔도'], ['*5가지*', '모두', '읽힘']], [['흐린', '색은'], ['휴대폰에서', '*다를 수 있음*']], [['흰', '여백', '0칸은'], ['어두운', '바탕에서', '*실패*']], [['많이', '흐리거나'], ['*아주 작으면*', '실패']]]);
  const OPT = [{ dark: '#1a2a6c', light: '#ffffff' }, { dark: '#c0392b', light: '#fff7d6' }, { dark: '#d0d0d0', light: '#ffffff' }, { dark: '#ffffff', light: '#000000' }, { dark: '#1a2a6c', light: '#9fb0c4' }];
  const cols = RES.colors.map((cc, i) => { const x = 110 + i * 300; const b = box(x, 320, 270, 300, 'card', { padding: '0' });
    const q = qr(MAT.urlL, 230, { left: '20px', top: '14px' }, b); el('div', null, { position: 'absolute', left: 0, right: 0, top: '252px', textAlign: 'center', fontSize: '24px', fontWeight: '800' }, b, cc.name);
    const p = pill(cc.decoded_ok ? '✓ 읽힘' : '✗ 실패', cc.decoded_ok, x + 50, 632, 170, 44); return { b, q, p, o: OPT[i], ok: cc.decoded_ok }; });
  const circ = pen(ellipsePath(110 + 2 * 300 + 135, 470, 165, 175), 7); const hd = hand('휴대폰 카메라는 다를 수 있음', 820, 685, 32, -3);
  const dark = box(110, 700, 760, 230, 'card', { background: '#2b2b2b' });
  const crop = el('div', null, { position: 'absolute', left: '60px', top: '40px', width: '140px', height: '140px', overflow: 'hidden' }, dark);
  const b0 = qr(MAT.urlL, 231, { left: '-45.5px', top: '-45.5px' }, crop), b4 = qr(MAT.urlL, 170, { left: '400px', top: '30px' }, dark);
  const p0 = pill('여백 0칸 ✗ 실패', RES.border['0'].on_dark, 220 + 30, 840, 0, 0), p4 = pill('여백 4칸 ✓ 읽힘', RES.border['4'].on_dark, 0, 0, 0, 0);
  [[p0, 230, 730], [p4, 590, 730]].forEach(([p, x, y]) => Object.assign(p.style, { left: x + 'px', top: y + 'px', width: '240px', height: '50px' }));
  const cam = RES.camera.map((k, i) => pill((k.ok ? '✓ ' : '✗ ') + k.name, k.ok, 900 + (i % 2) * 350, 710 + Math.floor(i / 2) * 70, 330, 54));
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const hideTop = out(t, c[2] - .2, .4);
    cols.forEach((k, i) => { const a = popIn(t, c[0] + .2 + i * .18, .55); tf(k.b, 0, (1 - a) * -500, 1, (1 - a) * (i % 2 ? 8 : -8), a > 0 ? 1 : 0);
      k.q.draw(t, Object.assign({ stamp: c[0] + .5 + i * .18, dur: .9 }, k.o)); pillRender(k.p, t, c[0] + 2.6 + i * .15, k.ok); });
    circ.set(eOut(P(t, c[1] + .4, c[1] + 1.0))); hd.render(t, c[1] + 1.1, .8, c[2] - .2);
    const da = popIn(t, c[2] + .1); tf(dark, 0, (1 - da) * 300, 1, 0, da > 0 ? 1 : 0);
    b0.draw(t, { stamp: c[2] + .3, dur: .8 }); b4.draw(t, { stamp: c[2] + .5, dur: .8 });
    pillRender(p0, t, c[2] + 1.6, RES.border['0'].on_dark); pillRender(p4, t, c[2] + 2.4, RES.border['4'].on_dark);
    cam.forEach((p, i) => pillRender(p, t, c[3] + .3 + i * .15, RES.camera[i].ok));
    nb.render(t, [{ at: c[0] + .5, a: 'enter' }, { at: c[0] + 3.2, a: 'nod' }, { at: c[1] + .5, a: 'look' }, { at: c[2] + 1.7, a: 'oops' }]);
  };
};
// 여백 0칸 QR: qr()는 흰 여백 4칸까지 그리므로 바깥 4칸을 잘라 낸 상자(crop) 안에 넣어 '-b 0' 모습으로 보여 줌

// ---- 08 시연 ⑥ 1,000장: 파이썬 예제 카드 → 작은 QR 1,000칸이 채워짐 + 카운트 + '2.1초' 도장 → 5장 읽기 ✓ → 명령 한 번 0.05초 ----
SCENES.demo6 = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['번호만', '다른'], ['QR', '*1,000장*']], [['파이썬', '예제', '4줄'], ['*' + RES.many1000 + '초*']], [['5장', '골라', '읽기'], ['*모두*', '맞음']], [['명령', '한', '번은'], ['*' + RES.cli_once.toFixed(2) + '초*']]]);
  const grid = box(110, 330, 984, 600, 'card', { padding: '0', overflow: 'hidden' });
  const gc = el('canvas', null, { position: 'absolute', left: '12px', top: '12px' }, grid); gc.width = 960; gc.height = 576; const g = gc.getContext('2d');
  const tile = document.createElement('canvas'); tile.width = tile.height = 22; { const tq = tile.getContext('2d'), m = MAT.short, n = m.length, s = 22 / (n + 4); tq.fillStyle = '#fff'; tq.fillRect(0, 0, 22, 22); tq.fillStyle = C.ink;
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (m[r][k] === '1') tq.fillRect((k + 2) * s, (r + 2) * s, s + .3, s + .3); }
  const code = box(1130, 330, 470, 250, 'card dark', { padding: '20px 22px' });
  el('div', 'mono', { fontSize: '19px', lineHeight: '1.6', whiteSpace: 'pre', color: '#EDEDED' }, code, 'import os, segno\nos.makedirs("qr_1000", …)\nfor i in range(1, 1001):\n  segno.make(f"…/table/{i}")\n   .save(f"qr_1000/t{i:04d}.png")');
  const cnt = tagChip('', 1130, 600, { fontSize: '36px' });
  const st = stamp(RES.many1000 + '초', 1420, 590, 54);
  const chk = box(1130, 690, 470, 240, 'card', { padding: '14px 26px' });
  const rows = [1, 250, 500, 750, 1000].map(n => el('div', null, { fontSize: '26px', fontWeight: '800', height: '42px', display: 'flex', justifyContent: 'space-between' }, chk, `<span class="mono">table/${n}</span><span style="color:${C.green}">✓ 맞음</span>`));
  const one = tagChip('명령 한 번 ' + RES.cli_once.toFixed(2) + '초 · CPU 2개 클라우드', 1130, 600, { fontSize: '24px', background: '#FFF6CC' });
  const nb = NB(); let drawn = -1;
  return t => {
    caps.forEach(k => k.render(t));
    const ga = popIn(t, c[0] + .2); tf(grid, 0, (1 - ga) * 300, 1, 0, ga > 0 ? 1 : 0);
    const k = Math.round(1000 * eIO(P(t, c[1] + .4, c[1] + 3.4)));
    if (k < drawn) drawn = -1; if (drawn < 0) { g.fillStyle = '#F4EFE6'; g.fillRect(0, 0, 960, 576); drawn = 0; }
    for (let i = drawn; i < k; i++) g.drawImage(tile, (i % 40) * 24, Math.floor(i / 40) * 23 + 0, 22, 22); drawn = Math.max(drawn, k);
    dropIn(code, t, c[0] + .8, -400, 4);
    const ca = popIn(t, c[1] + .3) * (1 - out(t, c[3] - .2)); tf(cnt, 0, (1 - ca) * 30, Math.max(ca, .001), 0, ca); cnt.textContent = '▦ ' + k.toLocaleString('en-US') + '장';
    st.render(t, c[1] + 3.6, c[3] - .2);
    const cha = popIn(t, c[2] + .2); tf(chk, 0, (1 - cha) * 200, 1, 0, cha > 0 ? 1 : 0); rows.forEach((r, i) => { r.style.opacity = fadeIn(t, c[2] + .6 + i * .25, .3); });
    const oa = popIn(t, c[3] + .3); tf(one, 0, (1 - oa) * 30, oa, 0, oa > 0 ? 1 : 0);
    nb.render(t, [{ at: c[0] + .5, a: 'enter' }, { at: c[1] + .6, a: 'point', dir: 'left' }, { at: c[1] + 3.6 - .35, a: 'stamp' }, { at: c[2] + 2.0, a: 'nod' }]);
  };
};

// ---- 09 옵션: 옵션 카드 3장(0.8초 이상 간격) + 명령 창에 글자로 그린 QR ----
SCENES.opts = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['자주', '쓰는'], ['*옵션*', '모음']], [['파일', '이름과', '크기,'], ['*인쇄용*', '해상도']], [['여분', '칸·여백,'], ['*색*', '바꾸기']], [['파일', '이름', '없이'], ['*명령 창*에', 'QR']]]);
  const OP = [['-o qr.png / qr.svg  --scale 10  --dpi 300', `SVG ${RES.svg_bytes.toLocaleString('en-US')}바이트(확대해도 또렷) · PNG 인쇄 해상도`], ['-e H   -b 4   --dark navy  --light white', '여분 칸 단계 · 흰 여백 칸 수 · 색'], ['segno "https://example.com" --compact', '-o 없이 실행 → 명령 창에 QR (' + RES.terminal_lines + '줄)']];
  const cards = OP.map((o, i) => { const b = box(110, 340 + i * 195, 1000, 165, 'card', { padding: '24px 34px' });
    el('div', 'mono', { fontSize: '32px', fontWeight: '800', color: C.orange, marginBottom: '12px' }, b, M.esc(o[0])); el('div', null, { fontSize: '28px', fontWeight: '700', color: '#555' }, b, o[1]); return b; });
  const tb = box(1150, 340, 450, 560, 'card dark', { padding: '26px', overflow: 'hidden' });
  const m = MAT.short, txt = ['', '', ...m.map(r => '  ' + [...r].map(v => v === '1' ? '██' : '  ').join('')), '', ''].join('\n');
  const pre = el('div', 'mono', { fontSize: '11.4px', lineHeight: '1', whiteSpace: 'pre', color: '#EDEDED', letterSpacing: '0' }, tb, '');
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((b, i) => slideIn(b, t, c[i + 1] - .1, -400));
    const ta = popIn(t, c[3] - .1); tf(tb, 0, (1 - ta) * 400, 1, 0, ta > 0 ? 1 : 0);
    const n = Math.floor(P(t, c[3] + .4, c[3] + 1.8) * (m.length + 2)); pre.textContent = txt.split('\n').slice(0, n + 2).join('\n');
    nb.render(t, [{ at: c[0] + .5, a: 'enter' }, { at: c[1] + .8, a: 'point', dir: 'left' }, { at: c[2] + .8, a: 'point', dir: 'left' }, { at: c[3] + 2.0, a: 'nod' }]);
  };
};

// ---- 10 쓸 곳: 아이콘 카드 3장(0.8초 이상 간격) + 카드 안 QR 찍힘 ----
SCENES.uses = S => {
  const c = [0, 1, 2].map(S.cue);
  const caps = capsOf(S, [[['①', '손님용'], ['*와이파이 QR*', '붙이기']], [['②', '명함·안내문에'], ['*연락처 QR*']], [['③', '번호별', 'QR을'], ['*한꺼번에*']]]);
  const U = [['wifi', '손님용 와이파이', '인쇄해 붙여 두기', MAT.wifi], ['person', '명함 · 안내문', '연락처·신청 주소', MAT.card], ['file', '번호별 QR', '테이블·물품 번호', MAT.short]];
  const cards = U.map((u, i) => { const b = box(110 + i * 500, 340, 460, 560, 'card', { padding: '30px' });
    el('div', null, { marginBottom: '18px' }, b, M.iconTile(u[0], 96)); el('div', null, { fontSize: '44px', fontWeight: '900' }, b, u[1]); el('div', null, { fontSize: '28px', fontWeight: '700', color: '#666', marginBottom: '16px' }, b, u[2]);
    return { b, q: qr(u[3], 230, { left: '115px', top: '300px' }, b) }; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((k, i) => { dropIn(k.b, t, c[i] - .05, 500, i % 2 ? 5 : -5); k.q.draw(t, { stamp: c[i] + .5, dur: 1.0 }); });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 1.2, a: 'point', dir: 'left' }, { at: c[1] + 1.2, a: 'nod' }, { at: c[2] + 1.8, a: 'happy' }]);
  };
};

// ---- 11 아쉬운 점: 카드 4장(자막마다) + 빨간 펜 밑줄(②) + 빨간 펜 동그라미(④) ----
SCENES.cons = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['아쉬운', '점도'], ['*짚어*', '보겠습니다']], [['①', '화면', '없는'], ['*명령어 도구*']], [['②', '명령 창에'], ['형식', '*직접 입력*']], [['③', '실제', '접속은'], ['*확인 못 함*']], [['④', '비밀번호가'], ['QR에', '*그대로*']]]);
  const K = [['화면 없는 명령어 도구 · 파이썬 따로 설치', '저장소의 와이파이QR.bat는 이름·비밀번호만 물어봄'], ['명령 창에 와이파이 형식 글자를 직접 입력해야 함', '비밀번호 속 ; , : \\ " 앞에는 \\ · 와이파이QR.bat는 이름·비밀번호만 물어보고 자동 처리'],
    ['휴대폰 QR 앱 읽기는 됨 · 실제 접속은 확인 못 함', '시연용 가상 와이파이라 접속 시험 불가 · 인쇄 전 내 휴대폰으로 확인'], ['비밀번호가 QR 그림에 그대로 들어감', 'QR을 읽으면 누구나 알 수 있음 → 손님용 네트워크에만']];
  const cards = K.map((k, i) => { const b = box(110, 330 + i * 150, 1480, 132, 'card', { display: 'flex', alignItems: 'center', gap: '26px', padding: '0 30px' });
    el('div', null, { minWidth: '68px', height: '68px', borderRadius: '16px', background: C.red, color: '#fff', fontWeight: '900', fontSize: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, b, String(i + 1));
    const tx = el('div', null, {}, b); const h = el('div', null, { fontSize: '36px', fontWeight: '900' }, tx, M.esc(k[0])); el('div', null, { fontSize: '25px', fontWeight: '700', color: '#666' }, tx, M.esc(k[1])); return { b, h }; });
  // 펜 선은 만들 때(층이 보이는 동안) 자리를 재서 그 장의 층에 붙인다 — 그릴 때 만들면 다른 장 위에 남음
  const r1 = cards[1].h.getBoundingClientRect(), r3 = cards[3].h.getBoundingClientRect();
  const ul = pen(`M${r1.left - 6} ${r1.bottom + 2} C ${r1.left + r1.width * .4} ${r1.bottom - 4}, ${r1.left + r1.width * .7} ${r1.bottom + 6}, ${r1.right + 8} ${r1.bottom}`, 6);
  const ring = pen(ellipsePath((r3.left + r3.right) / 2, (r3.top + r3.bottom) / 2 + 4, r3.width / 2 + 30, r3.height / 2 + 20), 6);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((k, i) => slideIn(k.b, t, c[i + 1] - .1, -500));
    ul.set(eOut(P(t, c[2] + .6, c[2] + 1.2))); ring.set(eOut(P(t, c[4] + .6, c[4] + 1.3)));
    nb.render(t, [{ at: c[1] + .4, a: 'enter' }, { at: c[2] + .6, a: 'pen' }, { at: c[3] + .5, a: 'oops' }, { at: c[4] + .6, a: 'pen' }]);
  };
};

// ---- 정리: 체크리스트 3줄(✓가 하나씩) + 핵심 숫자 알약 ----
SCENES.summary = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['오늘', '내용', '*정리*']], [['segno', '='], ['*QR 스티커*', '인쇄소']], [[RES.wifi.sec.toFixed(2) + '초,'], ['1,000장', '*' + RES.many1000 + '초*']], [['로고엔', '*-e H*,'], ['여백은', '그대로']]]);
  const L = ['segno = QR 스티커 인쇄소 (함께 설치 0개)', `와이파이 QR ${RES.wifi.sec.toFixed(2)}초 · QR 1,000장 ${RES.many1000}초`, '로고를 얹으면 -e H · 흰 여백은 지우지 않기'];
  const cd = box(110, 340, 1480, 540, 'card', { padding: '40px 50px' });
  const rows = L.map((s, i) => { const r = el('div', null, { display: 'flex', alignItems: 'center', gap: '30px', height: '150px', borderBottom: i < 2 ? '3px dashed #ddd' : 'none' }, cd);
    const b = el('div', null, { minWidth: '76px', height: '76px', border: '5px solid #141414', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '58px', fontWeight: '900', color: C.green }, r, '');
    el('div', null, { fontSize: '44px', fontWeight: '900' }, r, M.esc(s)); return { r, b }; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(cd, t, c[0] + .2, 400);
    rows.forEach((k, i) => { k.r.style.opacity = fadeIn(t, c[i + 1] - .1); const on = t > c[i + 1] + .5; k.b.textContent = on ? '✓' : ''; k.b.style.transform = `scale(${on ? popIn(t, c[i + 1] + .5, .4) : 1})`; });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'nod' }, { at: c[2] + 1.0, a: 'nod' }, { at: c[3] + 1.8, a: 'happy' }]);
  };
};
