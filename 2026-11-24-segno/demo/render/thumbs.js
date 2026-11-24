// segno 썸네일·블로그 그림 — 모션 스타일 (2026-11-25 운영자 요청, tools/motion/README.md 10장)
// 숫자는 data.js 의 RES(= demo/results.json 시연 측정값), QR 은 MAT(segno 로 만든 실제 QR) 만 씀. 각 장면은 3초 안에 다 나타나고 마지막 프레임을 찍음
const { C, el, box, tf, caption, stamp, hand, pen, ellipsePath, arrowPath, qr, pill, pillRender, stars } = M;
const FOOT = '2026-11-24 클라우드 시연 결과 · 와이파이·연락처는 시연용 가상 자료';
const foot = (W, H) => el('div', null, { position: 'absolute', right: '28px', bottom: '18px', fontSize: '20px', fontWeight: '700', color: '#666' }, null, FOOT);
const chip = (s, x, y, css = {}) => el('div', 'chip', Object.assign({ left: x + 'px', top: y + 'px' }, css), null, s);
const OKc = (x, y, s = 84) => el('div', null, { position: 'absolute', left: x + 'px', top: y + 'px', width: s + 'px', height: s + 'px', borderRadius: '50%', background: C.green, border: '4px solid #141414', color: '#fff', fontSize: (s * .6) + 'px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }, null, '✓');
function qcard(mat, x, y, size, pad = 26, rot = 0) { const b = box(x, y, size, size); b.style.transform = `rotate(${rot}deg)`; const q = qr(mat, size - pad * 2, { left: pad + 'px', top: pad + 'px' }, b); return { b, q }; }
const done = (o = {}) => Object.assign({ stamp: -9, dur: .1 }, o);    // QR 을 처음부터 다 찍힌 모습으로
const pillOn = (p, ok) => pillRender(p, 9, 0, ok);                        // 알약을 다 나타난 모습으로

const THUMBS = {
  // ---- 롱폼 썸네일 1280×720 ----
  thumb: { w: 1280, h: 720, file: 'thumbnail.jpg', bg: C.beige, scene: S => {
    const a = qcard(MAT.wifi, 60, 120, 470, 26, -4);
    const st = stamp(RES.wifi.sec.toFixed(2) + '초', 300, 66, 56, -9);
    const cap = caption(-1, null, [['와이파이', '비밀번호'], ['*QR 한 장*으로']], { x: 590, y: 120, size: 84 });
    const ch = chip('명령 한 줄 · 함께 설치 0개', 600, 380, { fontSize: '34px', padding: '12px 26px' });
    const nm = el('div', 'mono', { position: 'absolute', left: '600px', top: '500px', fontSize: '96px', fontWeight: '800', color: C.ink, letterSpacing: '-3px' }, null, 'segno<span style="color:#FF5A1F">.</span>');
    const nb = M.buddy(1050, 400, .62);
    return t => { cap.render(t); a.q.draw(t, done()); st.render(t, 0); nb.render(t, [{ at: 2.4, a: 'point', dir: 'left' }]); };
  } },
  // ---- 숏폼 썸네일 1080×1920 (글자는 위아래 250px 안쪽) ----
  thumbv: { w: 1080, h: 1920, file: 'thumbnail-shorts.jpg', bg: C.beige, scene: S => {
    const cap = caption(-1, null, [['와이파이', '비밀번호,'], ['*QR 한 장*으로']], { x: 70, y: 290, size: 100 });
    const a = qcard(MAT.wifi, 110, 620, 760, 34, -3);
    const st = stamp(RES.wifi.sec.toFixed(2) + '초', 640, 570, 76, -9);
    const nb = M.buddy(800, 1180, .62);
    const nm = el('div', 'mono', { position: 'absolute', left: 0, right: 0, top: '1450px', textAlign: 'center', fontSize: '120px', fontWeight: '800', letterSpacing: '-4px' }, null, 'segno<span style="color:#FF5A1F">.</span>');
    return t => { cap.render(t); a.q.draw(t, done()); st.render(t, 0); nb.render(t, [{ at: 2.4, a: 'point', dir: 'left' }]); };
  } },
  // ---- 블로그 그림 1600×900: 와이파이 QR + 읽은 결과 ----
  wifi: { w: 1600, h: 900, file: 'wifi-qr.png', bg: C.blue, scene: S => {
    const cap = caption(-1, null, [['와이파이', 'QR', '*' + RES.wifi.sec.toFixed(2) + '초*', '·', '휴대폰', 'QR', '앱도', '그대로', '읽음']], { x: 70, y: 46, size: 60 });
    const a = qcard(MAT.wifi, 70, 160, 560, 28, -2);
    const tm = box(680, 160, 840, 170, 'card dark', { padding: '22px 30px' });
    el('div', 'mono', { fontSize: '23px', lineHeight: '1.55', color: '#EDEDED' }, tm, '<span style="color:#FFB86B">C:\\&gt; </span>segno "WIFI:T:WPA;S:우리집_5G;P:kimchi2026!;;"<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-o wifi.png --scale 10');
    const res = box(680, 360, 840, 330, 'card', { overflow: 'hidden' });
    el('div', null, { background: C.ink, color: '#fff', fontWeight: '800', fontSize: '26px', padding: '12px 28px' }, res, 'QR로 읽은 결과');
    [['이름', '우리집_5G'], ['비밀번호', 'kimchi2026!'], ['방식', 'WPA']].forEach((r, i) => { const d = el('div', null, { display: 'flex', alignItems: 'center', padding: '0 28px', height: '86px', borderBottom: i < 2 ? '3px dashed #ddd' : 'none', fontSize: '32px' }, res);
      el('div', null, { width: '200px', color: '#777', fontWeight: '700', fontSize: '26px' }, d, r[0]); el('div', 'mono', { fontWeight: '800', flex: '1' }, d, r[1]); el('div', null, { color: C.green, fontSize: '42px', fontWeight: '900' }, d, '✓'); });
    [`⏱ ${RES.wifi.sec.toFixed(2)}초`, '29 × 29칸', `${RES.wifi.px} × ${RES.wifi.px} 픽셀`, `${RES.wifi.bytes}바이트`].forEach((s, i) => chip(s, 70 + [0, 190, 400, 680][i], 760, { fontSize: '28px' }));
    const hd = hand('실제 와이파이 접속은 확인 못 함', 980, 760, 32, -3);
    foot(); return t => { cap.render(t); a.q.draw(t, done()); hd.render(t, 0, .1); };
  } },
  // ---- 블로그 그림: 글 길이 → 칸 수 ----
  len: { w: 1600, h: 900, file: 'length.png', bg: C.peach, scene: S => {
    const cap = caption(-1, null, [['글이', '길수록', '칸이', '*촘촘*', '(segno', '자동', '선택)']], { x: 70, y: 46, size: 58 });
    const L = RES.length, it = [[MAT.short, '짧은 주소 ' + L[0].chars + '자', L[0].modules, C.green], [MAT.k100, '한글 ' + L[2].chars + '자', L[2].modules, C.orange], [MAT.k500, '한글 ' + L[3].chars + '자', L[3].modules, C.red]];
    it.forEach((k, i) => { const x = 70 + i * 500; const a = qcard(k[0], x, 160, 440, 24); a.q.draw(0, done()); a.q.draw(9, done());
      el('div', null, { position: 'absolute', left: x + 'px', width: '440px', top: '622px', textAlign: 'center', fontSize: '36px', fontWeight: '900' }, null, k[1]);
      el('div', 'mono', { position: 'absolute', left: x + 'px', width: '440px', top: '672px', textAlign: 'center', fontSize: '34px', fontWeight: '800', color: k[3] }, null, `${k[2]} × ${k[2]}칸`); });
    const er = box(70, 750, 1460, 84, 'card dark', { padding: '0 30px', display: 'flex', alignItems: 'center' });
    el('div', 'mono', { fontSize: '26px', color: '#FF8A80' }, er, `✗ 한글 1,000자 → ${M.esc(RES.toolong.msg)}  (한글은 ${RES.max_korean}자까지)`);
    foot(); return t => { cap.render(t); };
  } },
  // ---- 블로그 그림: 가운데 10% 가림 시험 ----
  cover: { w: 1600, h: 900, file: 'cover-test.png', bg: C.mint, scene: S => {
    const cap = caption(-1, null, [['가운데를', '가리면?', '*H 단계*만', '10%까지', '읽힘']], { x: 70, y: 46, size: 58 });
    const EL = {}; RES.errorlevel.forEach(e => EL[e.level] = e);
    const cards = ['L', 'M', 'Q', 'H'].map((l, i) => { const x = 70 + i * 360, e = EL[l], n = MAT['url' + l].length; const b = box(x, 160, 320, 470);
      const q = qr(MAT['url' + l], 270, { left: '25px', top: '18px' }, b);
      el('div', null, { position: 'absolute', left: '25px', top: '300px', fontSize: '42px', fontWeight: '900' }, b, l + ' 단계');
      el('div', 'mono', { position: 'absolute', left: '25px', top: '356px', fontSize: '28px', fontWeight: '800', color: '#666' }, b, `${n} × ${n}칸`);
      const ps = [5, 10].map((p, j) => { const pp = pill(`<span style="color:#141414">${p}% 가림</span>&nbsp; ${e.cover[p] ? '✓ 읽힘' : '✗ 실패'}`, e.cover[p], x, 660 + j * 64, 320, 52); pillOn(pp, e.cover[p]); return pp; });
      return { b, q, dim: l !== 'H' }; });
    const H = cards[3]; const circ = pen(ellipsePath(70 + 3 * 360 + 160, 395, 190, 270), 7);
    const st = stamp('H만 10%!', 70 + 3 * 360 + 120, 128, 44, -10);
    el('div', null, { position: 'absolute', left: '70px', top: '800px', fontSize: '26px', fontWeight: '800', color: '#555' }, null, '15% 이상 가리면 네 단계 모두 실패 · 가림 % = 흰 여백까지 포함한 그림 전체 넓이 기준 (주황 상자)');
    foot(); return t => { cap.render(t); cards.forEach(k => { k.q.draw(t, done({ box: .10 })); k.b.style.filter = k.dim ? 'grayscale(.6)' : 'none'; k.b.style.opacity = k.dim ? .7 : 1; }); circ.set(1); st.render(t, 0); };
  } },
  // ---- 블로그 그림: 색과 흰 여백 ----
  color: { w: 1600, h: 900, file: 'color-border.png', bg: C.lilac, scene: S => {
    const cap = caption(-1, null, [['색을', '바꿔도', '*5가지*', '모두', '읽힘', '·', '여백', '0칸은', '실패']], { x: 70, y: 46, size: 54 });
    const OPT = [{ dark: '#1a2a6c', light: '#ffffff' }, { dark: '#c0392b', light: '#fff7d6' }, { dark: '#d0d0d0', light: '#ffffff' }, { dark: '#ffffff', light: '#000000' }, { dark: '#1a2a6c', light: '#9fb0c4' }];
    const cs = RES.colors.map((cc, i) => { const x = 70 + i * 296; const b = box(x, 160, 266, 300); const q = qr(MAT.urlL, 226, { left: '20px', top: '14px' }, b);
      el('div', null, { position: 'absolute', left: 0, right: 0, top: '250px', textAlign: 'center', fontSize: '24px', fontWeight: '800' }, b, cc.name);
      const p = pill(cc.decoded_ok ? '✓ 읽힘' : '✗ 실패', cc.decoded_ok, x + 48, 480, 170, 46); pillOn(p, cc.decoded_ok); return { q, o: OPT[i] }; });
    const dark = box(70, 570, 760, 250, 'card', { background: '#2b2b2b' });
    const crop = el('div', null, { position: 'absolute', left: '60px', top: '40px', width: '150px', height: '150px', overflow: 'hidden' }, dark);
    const b0 = qr(MAT.urlL, 248, { left: '-49px', top: '-49px' }, crop), b4 = qr(MAT.urlL, 180, { left: '420px', top: '30px' }, dark);
    const p0 = pill('여백 0칸 ✗ 실패', RES.border['0'].on_dark, 90, 790, 240, 50), p4 = pill('여백 4칸 ✓ 읽힘', RES.border['4'].on_dark, 470, 790, 240, 50); pillOn(p0, RES.border['0'].on_dark); pillOn(p4, RES.border['4'].on_dark);
    el('div', null, { position: 'absolute', left: '880px', top: '590px', width: '500px', fontSize: '30px', fontWeight: '800', lineHeight: '1.5' }, null, '어두운 바탕 위에 놓았을 때 흰 여백 0칸(<span class="mono">-b 0</span>)은 읽지 못함, 기본 4칸은 읽힘.<br><span style="color:#E5482D">연회색처럼 흐린 색은 휴대폰 카메라에서 다를 수 있음</span>');
    const circ = pen(ellipsePath(70 + 2 * 296 + 133, 310, 160, 175), 6);
    const nb = M.buddy(1400, 560, .5);
    foot(); return t => { cap.render(t); cs.forEach(k => k.q.draw(t, done(k.o))); b0.draw(t, done()); b4.draw(t, done()); circ.set(1); nb.render(t, [{ at: 2.5, a: 'look' }]); };
  } },
};
