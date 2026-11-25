// jrnl (2026-11-25) 모션 장면 — tools/motion 키트 (GUIDE 5-4)
// 숫자: data.js 의 RES (= demo/results.json 시연 측정값)만 씀. 일기 내용은 모두 시연용 가상 자료
// 시간: 모두 S.cue(i)(자막 i 의 시작 초) 기준 → 음성 길이에 맞춰 구간이 바뀌어도 그대로 따라감
// 롱폼 14개 장 + 숏폼 5장면 모두 직접 만듦 (기본 장면 없음), end 를 뺀 모든 장·장면에 냥봇(2~4번 반응)
// 비유 하나: '날짜 도장 수첩' — 한 줄 쓰면 날짜 도장이 찍히고, @꼬리표로 모아 보고, 자물쇠도 채움
const { C, P, eOut, eIO, eBack, lerp, popIn, out, shake, el, box, tf, caption, stamp, hand, pen, ellipsePath, arrowPath, circleAround, count, term, pill, pillRender, stars, iconTile, ending } = M;
const DISCLAIMER = ['정보 제공용 · 2026-11-25 클라우드 시연 결과(운영자 직접 검증 아님) · 일기 내용은 시연용 가상 자료',
  'Windows·버전에 따라 결과가 다를 수 있음 · 암호를 잊으면 되살릴 수 없음 · 일기 파일은 따로 백업'];
const STARS = 7363;                                   // GitHub 별 (2026-11-25 검색 API 확인)
const f2 = v => Number(v).toFixed(2);
const WRITE = f2(RES.write_avg), BIG = RES.big;
const SCENES = {};

// ---------- 공통 도우미 ----------
const capsOf = (S, arr) => arr.map((L, i) => caption(S.cue(i) - .1, i < arr.length - 1 ? S.cue(i + 1) - .25 : null, L));
const NB = () => M.buddy(1636, 548, .62);
const fadeIn = (t, a, d = .5) => Math.min(1, popIn(t, a, d) * 2);
const dropIn = (e, t, a, dy = -500, r = 0) => { const k = popIn(t, a, .55); tf(e, 0, (1 - k) * dy, 1, (1 - k) * r, k > 0 ? 1 : 0); return k; };
const slideIn = (e, t, a, dx = -300) => { const k = popIn(t, a, .5); tf(e, (1 - k) * dx, 0, 1, 0, k > 0 ? Math.min(1, k * 2) : 0); return k; };
const tagHL = s => M.esc(s).replace(/([@#][^\s.,]+)/g, `<span style="color:${C.orange};font-weight:900">$1</span>`);
// 일기 한 장: 왼쪽 날짜 도장(동그란 빨간 도장) + 제목 + 본문(꼬리표 주황)
function entry(x, y, w, date, title, body, o = {}) {
  const h = o.h || 150;
  const b = box(x, y, w, h, 'card', { display: 'flex', alignItems: 'center', gap: '26px', padding: '0 30px', background: o.bg || '#fff' }, o.par);
  const d = el('div', null, { minWidth: '150px', height: '104px', border: `5px solid ${C.red}`, borderRadius: '18px', color: C.red, fontWeight: '900', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: '1.1', transform: 'rotate(-6deg)' }, b);
  const [dd, tt] = date.split(' ');
  el('div', null, { fontSize: '27px' }, d, dd.slice(5).replace('-', '.')); el('div', null, { fontSize: '23px' }, d, tt || '');
  const tx = el('div', null, { overflow: 'hidden' }, b);
  el('div', null, { fontSize: (o.fs || 36) + 'px', fontWeight: '900', whiteSpace: 'nowrap' }, tx, tagHL(title) + (o.star ? ` <span style="color:#FFC531">★</span>` : ''));
  if (body) el('div', null, { fontSize: ((o.fs || 36) - 8) + 'px', fontWeight: '700', color: '#555', whiteSpace: 'nowrap' }, tx, tagHL(body));
  return { b, d, render(t, t0, dx = 0, dim = 0) { const a = popIn(t, t0, .5); tf(b, dx + (1 - a) * -260, 0, 1, 0, (a > 0 ? Math.min(1, a * 2) : 0) * (1 - dim * .6));
    const s = P(t, t0 + .35, t0 + .7); d.style.transform = `rotate(-6deg) scale(${lerp(2.2, 1, eOut(s))})`; d.style.opacity = s; b.style.filter = dim ? `grayscale(${dim})` : 'none'; } };
}
const E = { // 시연에 쓴 가상 일기 (bench.py 와 같은 글, 날짜는 24시간 표시)
  lunch: ['2026-11-24 09:00', '점심은 김치찌개였다.', '@점심 #가계부 9000원'],
  party: ['2026-11-20 19:00', '친구 생일 파티.', '@모임 케이크를 나눠 먹었다'],
  meet: ['2026-11-16 15:00', '팀 회의 메모.', '@회의 다음 주 금요일까지 보고서'],
  walk: ['2026-11-25 07:47', '오늘 저녁 산책 30분.', '@운동'],
  kor: ['2026-11-25 07:47', '어제: 한글로 날짜를 쓰면?', ''],
};

// ======================= 롱폼 (1920×1080) =======================
// ---- 미리보기: 명령 타이핑 → 일기 카드에 날짜 도장 → 10년치 목록이 내려가며 '떡볶이' 461개 ----
SCENES.preview = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2), e2 = S.cueEnd(2);
  const caps = [caption(c0 - .1, c1 - .3, [['명령', '창에'], ['*한 줄*', '일기']]),
    caption(c1 - .1, c2 - .3, [['날짜가', '저절로,'], ['*' + WRITE + '초*', '저장']]),
    caption(c2 - .06, null, [['10년치에서', '찾기도'], ['*' + f2(BIG.contains.sec) + '초*']])];
  const tm = term(110, 340, 900, 260);
  const en = entry(110, 640, 900, E.lunch[0], E.lunch[1], E.lunch[2]);
  const st = stamp(WRITE + '초', 820, 600, 52);
  const lst = box(1060, 330, 540, 430, 'card', { overflow: 'hidden', padding: '0' });
  el('div', null, { position: 'relative', zIndex: '2', background: C.ink, color: '#fff', fontWeight: '800', fontSize: '26px', padding: '14px 26px' }, lst, '가상 일기 3,650개 (10년)');
  const inner = el('div', 'mono', { position: 'absolute', left: '0', right: '0', top: '62px', fontSize: '24px', lineHeight: '46px', padding: '0 24px' }, lst);
  const foods = ['김치찌개', '떡볶이', '비빔밥', '라면', '떡볶이', '칼국수', '샐러드', '떡볶이', '김밥', '된장찌개'];
  let h = ''; for (let i = 0; i < 40; i++) { const f = foods[i % 10]; h += `<div style="white-space:nowrap">${2016 + Math.floor(i / 4)}-${String(1 + i % 12).padStart(2, '0')}-1${i % 9} <b style="${f === '떡볶이' ? `background:${C.yellow}` : ''}">${f}</b></div>`; }
  inner.innerHTML = h;
  const big = el('div', null, { position: 'absolute', left: '1070px', top: '790px', fontSize: '84px', fontWeight: '900', color: C.orange, textShadow: '4px 4px 0 #141414' }, null, '0개');
  const nb = NB();
  return t => {
    caps.forEach(c => c.render(t));
    const a = popIn(t, c0 - .1, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c0 + .5, text: 'jrnl "점심은 김치찌개였다. @점심"', dur: 2.2 }, { at: c1 - .2, kind: 'out', text: '[Entry added to default journal]' }]);
    en.render(t, c1 + .1); st.render(t, c1 + 1.6);
    const l = popIn(t, c2 - .2, .5); tf(lst, 0, (1 - l) * -600, 1, (1 - l) * 6, l > 0 ? 1 : 0);
    inner.style.transform = `translateY(${-eIO(P(t, c2 + .3, c2 + 2.3)) * 1400}px)`;
    const bi = popIn(t, c2 + 2.1, .5); tf(big, 0, 0, bi, -4, bi > 0 ? 1 : 0); count(big, t, c2 + 2.1, BIG.contains.n, 1.6, v => Math.round(v) + '개');
    nb.render(t, [{ at: c0 + .5, a: 'enter' }, { at: c1 + 1.6 - .35, a: 'stamp' }, { at: c2 + .6, a: 'point', dir: 'left' }, { at: c2 + 3.8, a: 'nod' }]);
  };
};
// ---- 타이틀: 'jrnl.' 글자가 떨어짐 + 별 카운트 → 별점 3/5 → 쓰임새 카드 3장 + '무료' 도장 ----
SCENES.title = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2);
  const tag = el('div', 'chip', { left: '110px', top: '200px', background: C.ink, color: '#fff', fontSize: '30px' }, null, '오늘의 오픈소스 · 2026.11.25');
  const word = el('div', null, { position: 'absolute', left: '100px', top: '250px', fontSize: '250px', fontWeight: '900', letterSpacing: '-8px', lineHeight: '1', transformOrigin: 'left top' });
  const letters = [...'jrnl'].map(ch => el('span', null, { display: 'inline-block' }, word, ch)); const dot = el('span', null, { display: 'inline-block', color: C.orange }, word, '.');
  const chips = [['github.com/jrnl-org/jrnl', 110, 'mono'], ['★ 0', 600, ''], ['GPL-3.0 · 무료', 860, 'mono']].map(c => el('div', 'chip ' + c[2], { left: c[1] + 'px', top: '570px', fontSize: '26px' }, null, c[0]));
  const book = box(1250, 190, 340, 420, 'card', { background: '#FFF8E1', padding: '30px' });
  [0, 1, 2, 3].forEach(i => el('div', null, { height: '3px', background: '#d8cfb8', margin: '58px 0 0' }, book));
  const bst = el('div', null, { position: 'absolute', left: '60px', top: '80px', width: '200px', height: '120px', border: `6px solid ${C.red}`, borderRadius: '20px', color: C.red, fontSize: '40px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)' }, book, '11.25');
  const rc = box(1000, 190, 600, 330, 'card', { padding: '34px 40px', transformOrigin: 'right top' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, rc, '일반인 쓸모 별점');
  const sr = stars(40, 100, 90, 3, 5, rc); const score = el('div', null, { position: 'absolute', left: '40px', top: '220px', fontSize: '60px', fontWeight: '900', transformOrigin: 'left center' }, rc, '3 <span style="color:#999;font-size:40px">/ 5</span>');
  const uses = [['업무 일지', 'file'], ['한 줄 일기', 'check'], ['암호 자물쇠', 'lock']].map((u, i) => {
    const c = box(110 + i * 500, 640, 460, 240, 'card', { padding: '34px', display: 'flex', alignItems: 'center', gap: '30px' });
    el('div', null, {}, c, iconTile(u[1], 110)); el('div', null, { fontSize: '46px', fontWeight: '900', whiteSpace: 'nowrap' }, c, u[0]); return c;
  });
  const free = stamp('무료', 1380, 560, 64, -10);
  const nb = NB();
  return t => {
    const ti = popIn(t, c0 + .2); const top = eIO(P(t, c2 - .3, c2 + .3));
    tf(tag, 0, -top * 60, ti, 0, ti > 0 ? 1 : 0);
    letters.forEach((l, i) => { const a = popIn(t, c0 + .3 + i * .1, .55); l.style.transform = `translateY(${(1 - a) * -320}px) rotate(${(1 - a) * 20}deg)`; l.style.opacity = a > 0 ? 1 : 0; });
    dot.style.transform = `scale(${popIn(t, c0 + .8)})`; tf(word, 0, -top * 60, 1 - top * .35);
    chips.forEach((c, i) => { const a = popIn(t, c0 + 1.2 + i * .8); tf(c, 0, (1 - a) * 40 - top * 40, a, 0, Math.min(1, a * 2) * (1 - top)); });
    count(chips[1], t, c0 + 2.0, STARS, 1.6, v => '★ ' + Math.round(v).toLocaleString('en-US'));
    const bi = popIn(t, c0 + .6, .6), bo = eIO(P(t, c1 - .4, c1 + .1));
    tf(book, bo * 700, (1 - bi) * -600, 1, (1 - bi) * 20 + 5 + Math.sin(t * 1.5) * 1.2, bi > 0 ? 1 - bo : 0);
    const bs = P(t, c0 + 1.3, c0 + 1.65); bst.style.transform = `rotate(-8deg) scale(${lerp(2.4, 1, eOut(bs))})`; bst.style.opacity = bs;
    const ri = popIn(t, c1 - .1, .55), rmv = eIO(P(t, c2 - .3, c2 + .3)); tf(rc, 0, (1 - ri) * 300 - rmv * 60, 1 - rmv * .45, 0, ri > 0 ? 1 : 0);
    sr.render(t, c1 + .5); score.style.transform = `scale(${popIn(t, c1 + 1.8)})`;
    uses.forEach((u, i) => { const a = popIn(t, c2 + .1 + i * .8, .55); tf(u, 0, (1 - a) * 500, 1, (1 - a) * 6, a > 0 ? 1 : 0); });
    free.render(t, c2 + 2.6);
    nb.render(t, [{ at: c0 + .8, a: 'enter' }, { at: c0 + 1.4, a: 'wave' }, { at: c1 + 2.0, a: 'nod' }, { at: c2 + 2.6 - .35, a: 'stamp' }]);
  };
};
// ---- 01 무엇인가: 수첩 펼침 → ① 한 줄 + 날짜 도장 → ② 꼬리표 3개가 붙음 → ③ 자물쇠 → 라이선스 알약 ----
SCENES.what = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['jrnl', '='], ['*날짜 도장*', '수첩']], [['①', '한', '줄', '쓰면'], ['*날짜 도장*', '찍힘']], [['②', '*@꼬리표*로'], ['모아', '보기']], [['③', '수첩에'], ['*암호 자물쇠*']], [['파이썬', '프로그램'], ['별', '*7천 개*', '넘음']]]);
  const nbk = box(110, 330, 980, 580, 'card', { background: '#FFF8E1', padding: '40px' });
  for (let i = 0; i < 6; i++) el('div', null, { position: 'absolute', left: '40px', right: '40px', top: (120 + i * 76) + 'px', height: '3px', background: '#e2d8bf' }, nbk);
  const rows = [E.lunch, E.party, E.walk].map((e, i) => entry(150, 380 + i * 170, 900, e[0], e[1], e[2], { h: 140, fs: 34, star: i === 1 }));
  const tags = ['@점심', '@모임', '@운동'].map((s, i) => el('div', 'chip', { left: '1150px', top: (380 + i * 110) + 'px', fontSize: '40px', padding: '14px 30px', background: C.orange, color: '#fff' }, null, s));
  const lock = box(1180, 340, 380, 420, 'card', { display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.ink });
  el('div', null, {}, lock, M.icon('lock', 260, C.yellow, 2.2));
  const lic = ['Python', '별 7,363', 'GPL-3.0 · 무료'].map((s, i) => el('div', 'chip', { left: '1180px', top: (790 + i * 62) + 'px', fontSize: '28px' }, null, s));
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(nbk, t, c[0] - .1, 500, -3);
    rows.forEach((r, i) => r.render(t, c[1] + .1 + i * .9));
    tags.forEach((g, i) => { const a = popIn(t, c[2] + .2 + i * .8, .45), o2 = eIO(P(t, c[3] - .3, c[3] + .1)); tf(g, o2 * 500, (1 - a) * -200, a, (1 - a) * 20, a > 0 ? 1 - o2 : 0); });
    const l = popIn(t, c[3] + .1, .5); tf(lock, 0, (1 - l) * -500 + shake(t, c[3] + .6, .3, 6), 1, (1 - l) * 12, l > 0 ? 1 : 0);
    lic.forEach((g, i) => { const a = popIn(t, c[4] + .3 + i * .8, .45); tf(g, 0, (1 - a) * 40, a, 0, a > 0 ? 1 : 0); });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + .6, a: 'stamp' }, { at: c[2] + 1.0, a: 'point', dir: 'left' }, { at: c[3] + .6, a: 'nod' }]);
  };
};
// ---- 02 설치: 파이썬 카드 → 명령 타이핑 → 3.32초 카운트 + 22개 → 질문 3개 카드(Enter) ----
SCENES.install = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['먼저', '*파이썬*'], ['3.11 ~ 3.14']], [['명령', '창에'], ['*설치 한 줄*']], [['*' + f2(RES.install.sec) + '초*', '설치'], ['함께', RES.install.others + '개']], [['처음엔', '*질문 3개*'], ['모르면', 'Enter']]]);
  const py = box(110, 340, 600, 300, 'card', { padding: '34px' });
  el('div', null, { fontSize: '46px', fontWeight: '900' }, py, 'python.org');
  el('div', null, { fontSize: '30px', fontWeight: '700', color: '#666', margin: '10px 0 26px' }, py, '파이썬 3.13 받기 (3.11~3.14)');
  const ck = el('div', null, { display: 'flex', alignItems: 'center', gap: '18px', fontSize: '32px', fontWeight: '800' }, py, `<span style="width:46px;height:46px;border:4px solid #141414;border-radius:8px;display:flex;align-items:center;justify-content:center;color:${C.green};font-size:40px" id="ckbox"></span> Add python.exe to PATH`);
  const ckb = ck.querySelector('span');
  const tm = term(760, 340, 840, 300, { fs: 30 });
  const sec = el('div', null, { position: 'absolute', left: '110px', top: '690px', fontSize: '110px', fontWeight: '900', color: C.orange, textShadow: '4px 4px 0 #141414' }, null, '0.00초');
  const sub = el('div', 'chip', { left: '110px', top: '840px', fontSize: '30px' }, null, `함께 설치 ${RES.install.others}개 · 약 ${Math.round(RES.install.mb)}MB`);
  const Q = ['일기 파일 위치?  → Enter (기본 위치)', '암호 걸기? [y/N]  → Enter (안 걸기)', '색 쓰기? [Y/n]  → Enter'];
  const qs = Q.map((q, i) => { const b = box(760, 680 + i * 84, 840, 70, 'card', { display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: '28px', fontWeight: '800' }); b.innerHTML = `<span style="color:${C.orange};margin-right:14px">Q${i + 1}</span>` + M.esc(q); return b; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(py, t, c[0] - .05, -400); const on = t > c[0] + 1.4; ckb.textContent = on ? '✓' : ''; ckb.style.transform = `scale(${on ? popIn(t, c[0] + 1.4, .4) : 1})`;
    const a = popIn(t, c[1] - .1, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c[1] + .4, text: 'py -m pip install jrnl', dur: 1.4 }, { at: c[2] - .1, kind: 'out', text: 'Successfully installed jrnl-4.6 …' }, { at: c[2] + .4, text: 'py -m jrnl --version', dur: 1.0 }, { at: c[2] + 1.6, kind: 'out', text: 'jrnl v4.6' }]);
    const s = popIn(t, c[2], .45); tf(sec, 0, 0, s, -3, s > 0 ? 1 : 0); count(sec, t, c[2] + .1, RES.install.sec, 1.6, v => v.toFixed(2) + '초');
    const b = popIn(t, c[2] + 1.9, .45); tf(sub, 0, (1 - b) * 30, b, 0, b > 0 ? 1 : 0);
    qs.forEach((q, i) => slideIn(q, t, c[3] + .2 + i * .8, 400));
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 1.4, a: 'nod' }, { at: c[2] + .5, a: 'point', dir: 'left' }, { at: c[3] + 1.0, a: 'look' }]);
  };
};
// ---- 03 시연 ①: 한 줄 쓰기 → 0.15초 도장 → 여러 줄(Ctrl+Z) → 영어 날짜 ✓ / 한글 '어제' ✗ ----
SCENES.demo1 = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['jrnl', '뒤에', '글'], ['*첫 문장*', '= 제목']], [['한', '번', '쓰기'], ['평균', '*' + WRITE + '초*']], [['여러', '줄은'], ['*Ctrl+Z*', '→ Enter']], [['영어', '날짜', '말'], ['*그 날짜*로', '저장']], [['한글', "'어제'는"], ['*날짜로 못 읽음*']]]);
  const tm = term(110, 330, 860, 330, { fs: 28 });
  const en = entry(110, 700, 860, E.walk[0], E.walk[1], E.walk[2]);
  const st = stamp(WRITE + '초', 760, 660, 50);
  const ml = box(1010, 330, 590, 330, 'card dark', { padding: '26px 30px' });
  el('div', 'mono', { color: '#EDEDED', fontSize: '26px', lineHeight: '1.6', whiteSpace: 'pre' }, ml, 'C:\\> py -m jrnl\nWriting Entry\nTo finish writing, press\nCtrl+z and then Enter …\n오늘은 비가 왔다.\n^Z');
  const R = [['yesterday: 점심은 김치찌개', '→ 11.24 09:00', true], ['2026-11-20 7pm: 친구 생일', '→ 11.20 19:00', true], ['어제: 한글로 날짜를 쓰면?', '→ 지금 시각 · 제목에 그대로', false]];
  const rows = R.map((r, i) => { const b = box(110, 330 + i * 150, 1490, 128, 'card', { display: 'flex', alignItems: 'center', gap: '24px', padding: '0 30px' });
    el('div', 'mono', { fontSize: '34px', fontWeight: '800', flex: '1', whiteSpace: 'nowrap' }, b, M.esc(r[0])); el('div', null, { fontSize: '32px', fontWeight: '800', color: '#555', whiteSpace: 'nowrap' }, b, M.esc(r[1]));
    const p = el('div', null, { minWidth: '150px', padding: '10px 20px', borderRadius: '40px', border: '4px solid #141414', background: r[2] ? C.green : C.red, color: '#fff', fontWeight: '900', fontSize: '30px', textAlign: 'center' }, b, r[2] ? '✓ 날짜' : '✗ 글자'); return { b, p }; });
  const r2 = rows[2].b.getBoundingClientRect();
  const ring = pen(ellipsePath(r2.left + 330, (r2.top + r2.bottom) / 2, 300, 62), 6);
  const hd = hand('영어로 쓰기!', 1180, 820, 44, -5);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const gone = eIO(P(t, c[3] - .4, c[3] + .1));
    const a = popIn(t, c[0] - .05, .5); tf(tm.el, -gone * 1200, (1 - a) * 300, 1, 0, a > 0 ? 1 - gone : 0);
    tm.render(t, [{ at: c[0] + .4, text: 'jrnl "오늘 저녁 산책 30분. @운동"', dur: 2.0 }, { at: c[0] + 2.6, kind: 'out', text: '[Entry added to default journal]' }]);
    en.render(t, c[0] + 2.9, -gone * 1200); st.render(t, c[1] + .6, c[3] - .4);
    const m = popIn(t, c[2] - .05, .5); tf(ml, gone * 900, (1 - m) * -400, 1, (1 - m) * 6, m > 0 ? 1 - gone : 0);
    rows.forEach((r, i) => { slideIn(r.b, t, c[3] + .1 + i * .9 + (i === 2 ? c[4] - c[3] - 1.8 : 0), -600); r.p.style.transform = `scale(${popIn(t, c[3] + .5 + i * .9 + (i === 2 ? c[4] - c[3] - 1.8 : 0), .4)})`; });
    ring.set(eOut(P(t, c[4] + .6, c[4] + 1.2))); hd.render(t, c[4] + 1.3, .7);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + .6 - .35, a: 'stamp' }, { at: c[3] + 1.2, a: 'nod' }, { at: c[4] + .5, a: 'oops' }]);
  };
};
// ---- 04 시연 ②: 일기 4장 → '@점심'만 남고 나머지 회색 → 꼬리표 표(막대) → 별표·글자·기간 알약 ----
SCENES.demo2 = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['@점심', '#가계부'], ['*한글 꼬리표*', 'OK']], [['jrnl', '@점심'], ['→', '*그 일기만*']], [['--tags', '→'], ['*몇 번*', '썼는지']], [['별표·글자·기간'], ['*찾기*도', '됨']]]);
  const L = [E.meet, E.party, E.lunch, E.walk];
  const cards = L.map((e, i) => entry(110, 330 + i * 132, 1000, e[0], e[1], e[2], { h: 118, fs: 31, star: e === E.party }));
  const res = el('div', 'chip', { left: '1150px', top: '640px', fontSize: '34px', padding: '14px 30px', background: C.ink, color: '#fff' }, null, `1 entry found · ${f2(RES.find_tag.sec)}초`);
  const tg = box(1150, 330, 450, 520, 'card', { padding: '24px 30px' });
  el('div', null, { fontSize: '30px', fontWeight: '900', marginBottom: '16px' }, tg, 'jrnl --tags');
  const T = RES.tags.out.split('\n').map(l => l.split(':')[0].trim());
  const bars = T.map(n => { const r = el('div', null, { display: 'flex', alignItems: 'center', gap: '16px', height: '62px', fontSize: '30px', fontWeight: '800' }, tg);
    el('div', null, { width: '150px', color: C.orange }, r, M.esc(n)); const b = el('div', null, { height: '30px', width: '0', background: C.yellow, border: '3px solid #141414', borderRadius: '8px' }, r); el('div', null, {}, r, '1'); return { r, b }; });
  const pills = [['★ -starred', '1개'], ['-contains 보고서', '1개'], ['-from 11-20 -to 11-24', '2개']].map((p, i) => pill(`${M.esc(p[0])} → ${p[1]}`, true, 110 + i * 500, 880, 470, 56));
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const keep = eOut(P(t, c[1] + .5, c[1] + 1.0)), back = eOut(P(t, c[2] - .3, c[2] + .2)), sh = eIO(P(t, c[3] - .3, c[3] + .2));
    cards.forEach((k, i) => k.render(t, c[0] + .1 + i * .8, 0, i === 2 ? 0 : keep * (1 - back)));
    const r = popIn(t, c[1] + 1.1, .45); tf(res, 0, (1 - r) * 30, r, 0, r > 0 ? 1 - back : 0);
    const g = popIn(t, c[2] - .05, .5); tf(tg, 0, (1 - g) * -500, 1, 0, g > 0 ? 1 : 0);
    bars.forEach((b, i) => { b.b.style.width = (eOut(P(t, c[2] + .5 + i * .15, c[2] + 1.3 + i * .15)) * 150) + 'px'; });
    pills.forEach((p, i) => pillRender(p, t, c[3] + .3 + i * .8, true));
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.1, a: 'point', dir: 'left' }, { at: c[2] + 1.2, a: 'nod' }, { at: c[3] + 2.4, a: 'happy' }]);
  };
};
// ---- 05 시연 ③: 일기 → 마크다운 문서 카드(연도·월 제목) + 파일 3개 크기 막대 → 메모장 journal.txt ----
SCENES.demo3 = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['--format', 'md'], ['→', '*마크다운 파일*']], [['md', '·', 'JSON', '·'], ['*글자 파일*']], [['연도·달', '제목이'], ['*저절로*']], [['원본도', '*메모장*으로'], ['열림']]]);
  const tm = term(110, 330, 780, 190, { fs: 28 });
  const md = box(110, 560, 780, 360, 'card', { padding: '26px 34px', fontFamily: '"DejaVu Sans Mono", monospace' });
  const ML = [['# 2026', 1], ['## November', 2], ['### 2026-11-16 15:00 팀 회의 메모.', 3], ['@회의 다음 주 금요일까지 보고서', 0], ['### 2026-11-20 19:00 친구 생일 파티.', 3]];
  const mls = ML.map(([s, lv]) => el('div', 'mono', { fontSize: lv === 1 ? '40px' : lv === 2 ? '34px' : '26px', fontWeight: lv ? '900' : '700', color: lv ? C.ink : '#666', lineHeight: '1.6', whiteSpace: 'nowrap' }, md, tagHL(s)));
  const FX = [['일기.md', RES.export.md.bytes], ['일기.json', RES.export.json.bytes], ['일기.txt', RES.export.txt.bytes]];
  const fl = box(940, 330, 660, 330, 'card', { padding: '30px' });
  const fr = FX.map(([n, b]) => { const r = el('div', null, { display: 'flex', alignItems: 'center', gap: '14px', height: '86px', fontSize: '30px', fontWeight: '800' }, fl);
    el('div', null, {}, r, M.icon('file', 44, C.ink)); el('div', 'mono', { width: '200px' }, r, n); const bar = el('div', null, { height: '30px', width: '0', background: C.yellow, border: '3px solid #141414', borderRadius: '8px' }, r); const v = el('div', null, {}, r, '0'); return { r, bar, v, b }; });
  const note = box(940, 700, 660, 220, 'card', { padding: '0', overflow: 'hidden' });
  el('div', null, { background: '#dfe6ee', fontSize: '24px', fontWeight: '800', padding: '10px 20px' }, note, 'journal.txt - 메모장');
  el('div', 'mono', { fontSize: '24px', padding: '14px 20px', lineHeight: '1.6', whiteSpace: 'pre' }, note, '[2026-11-24 09:00] 점심은 김치찌개였다.\n@점심 #가계부 9000원');
  const r0 = mls[0].getBoundingClientRect(), r1 = mls[1].getBoundingClientRect();
  const ring = pen(ellipsePath((r0.left + r1.right) / 2 - 40, (r0.top + r1.bottom) / 2, (r1.right - r0.left) / 2 + 40, (r1.bottom - r0.top) / 2 + 4), 6);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const a = popIn(t, c[0] - .05, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c[0] + .4, text: 'jrnl --format md --file 일기.md', dur: 1.8 }, { at: c[0] + 2.4, kind: 'out', text: 'Journal exported to 일기.md' }]);
    const m = popIn(t, c[0] + 2.6, .5); tf(md, 0, (1 - m) * 400, 1, (1 - m) * -4, m > 0 ? 1 : 0);
    mls.forEach((l, i) => { l.style.opacity = fadeIn(t, c[0] + 2.9 + i * .25); });
    dropIn(fl, t, c[1] - .05, -400);
    fr.forEach((f, i) => { const k = eOut(P(t, c[1] + .4 + i * .8, c[1] + 2.0 + i * .8)); f.bar.style.width = (k * f.b / 1776 * 200) + 'px'; f.v.textContent = Math.round(k * f.b).toLocaleString('en-US') + 'B'; f.r.style.opacity = fadeIn(t, c[1] + .3 + i * .8); });
    ring.set(eOut(P(t, c[2] + .5, c[2] + 1.1)));
    const n = popIn(t, c[3] - .05, .5); tf(note, 0, (1 - n) * 300, 1, 0, n > 0 ? 1 : 0);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'point', dir: 'left' }, { at: c[2] + .5, a: 'pen' }, { at: c[3] + 1.0, a: 'nod' }]);
  };
};
// ---- 06 시연 ④: 암호 2번 → 자물쇠 쾅(0.45초) → 메모장이 알 수 없는 글자 → 틀린 암호 ✗✗✗ / 맞는 암호 ✓ → 손글씨 경고 ----
SCENES.demo4 = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['--encrypt', '→'], ['암호', '*2번*']], [['*' + f2(RES.encrypt.sec) + '초*', '만에'], ['잠김']], [['열어', '보면'], ['*알 수 없는 글자*']], [['틀린', '암호', '3번', '→', '*멈춤*'], ['맞는', '암호', '→', '열림']], [['암호를', '잊으면'], ['*되살릴 수 없음*']]]);
  const tm = term(110, 330, 820, 270, { fs: 28, prompt: 'C:\\> ' });
  const lock = box(990, 330, 330, 330, 'card', { display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.ink });
  el('div', null, {}, lock, M.icon('lock', 220, C.yellow, 2.2));
  const st = stamp(f2(RES.encrypt.sec) + '초', 1220, 300, 50);
  const sz = el('div', 'chip', { left: '990px', top: '690px', fontSize: '30px' }, null, '');
  const note = box(110, 640, 820, 280, 'card', { padding: '0', overflow: 'hidden' });
  el('div', null, { background: '#dfe6ee', fontSize: '24px', fontWeight: '800', padding: '10px 20px' }, note, 'journal.txt - 메모장 (잠근 뒤)');
  const garb = el('div', 'mono', { fontSize: '25px', padding: '14px 20px', lineHeight: '1.5', wordBreak: 'break-all', color: '#444' }, note, 'JRNLv3 0eyJzYWx0IjoiQ0hkZ3Vq… gAAAAABn4kQ2x9Lw0kVnR1… Zm8sQXp3cE1oN2ZvT0R…');
  const noKim = el('div', null, { position: 'absolute', left: '560px', top: '860px', fontSize: '34px', fontWeight: '900', color: C.red }, null, "'김치찌개' 0번");
  const tries = [false, false, false, true].map((ok, i) => pill(ok ? '✓ 맞는 암호 → 열림' : `✗ 틀린 암호 ${i + 1}`, ok, 990 + (i % 2) * 310, 690 + Math.floor(i / 2) * 76 + (ok ? 0 : 0), ok ? 300 : 290, 58));
  tries[3].style.left = '990px'; tries[3].style.top = '842px'; tries[3].style.width = '600px';
  const tm2 = el('div', 'chip', { left: '1300px', top: '766px', fontSize: '24px', background: C.red, color: '#fff' }, null, 'Too many attempts');
  const hd = hand('암호는 따로 적어 두기!', 1000, 400, 50, -5);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const a = popIn(t, c[0] - .05, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c[0] + .4, text: 'jrnl --encrypt', dur: .9 }, { at: c[0] + 1.6, kind: 'out', color: '#EDEDED', text: 'Enter password for new journal: ●●●●●●' }, { at: c[0] + 2.6, kind: 'out', color: '#EDEDED', text: 'Enter password again: ●●●●●●' }, { at: c[1] + .1, kind: 'out', text: 'Journal encrypted.' }]);
    const lk = popIn(t, c[1] - .05, .5), lo = eIO(P(t, c[4] - .3, c[4] + .2)); tf(lock, 0, (1 - lk) * -500 + shake(t, c[1] + .45, .35, 8), 1 - lo * .3, (1 - lk) * 15, lk > 0 ? 1 - lo : 0);
    st.render(t, c[1] + .6, c[4] - .3);
    const s = popIn(t, c[1] + 1.4, .45); tf(sz, 0, (1 - s) * 30, s, 0, s > 0 ? 1 - eIO(P(t, c[3] - .4, c[3])) : 0); count(sz, t, c[1] + 1.5, RES.encrypt.enc_bytes, 1.6, v => `${RES.encrypt.plain_bytes}바이트 → ${Math.round(v)}바이트`, RES.encrypt.plain_bytes);
    const n = popIn(t, c[2] - .05, .5); tf(note, 0, (1 - n) * 400, 1, 0, n > 0 ? 1 : 0); garb.style.opacity = fadeIn(t, c[2] + .5);
    const k = popIn(t, c[2] + 1.5, .45); tf(noKim, 0, 0, k, -4, k > 0 ? 1 : 0);
    tries.forEach((p, i) => pillRender(p, t, c[3] + .2 + (i < 3 ? i * .5 : 2.6), i === 3, 0));
    const tmk = popIn(t, c[3] + 1.4, .4); tf(tm2, 0, 0, tmk, 0, tmk > 0 ? 1 : 0);
    hd.render(t, c[4] + .4, .9);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + .6 - .35, a: 'stamp' }, { at: c[3] + .4, a: 'oops' }, { at: c[4] + .5, a: 'pen' }]);
  };
};
// ---- 07 시연 ⑤: 달력 10칸 × 365점이 차오름(3,650개) → 떡볶이를 쓴 날 칸만 노랑 461개 + 0.34초 → 결과 알약 → 해마다 오늘 9개 ----
SCENES.demo5 = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['가상', '일기'], ['*10년치*', '3,650개']], [["'떡볶이'로", '검색'], ['*' + f2(BIG.contains.sec) + '초*']], [['꼬리표·연도·별표도'], ['*0.3초대*']], [['해마다', '*오늘*'], ['쓴', '일기만']]]);
  const gd = box(110, 330, 1100, 590, 'card', { padding: '24px 28px' });
  const cv = el('canvas', null, { position: 'absolute', left: '90px', top: '24px' }, gd); cv.width = 980; cv.height = 540; const g = cv.getContext('2d');
  for (let y = 0; y < 10; y++) el('div', null, { position: 'absolute', left: '18px', top: (34 + y * 54) + 'px', fontSize: '22px', fontWeight: '800', color: '#777' }, gd, (y + 1) + '년');
  let sd = 25; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const hit = Array.from({ length: 3650 }, () => rnd() < BIG.contains.n / 3650), day = Array.from({ length: 3650 }, (_, i) => (i % 365) === 363);
  const cnt = el('div', null, { position: 'absolute', left: '1250px', top: '340px', fontSize: '96px', fontWeight: '900', lineHeight: '1' }, null, '0');
  const cl = el('div', null, { position: 'absolute', left: '1254px', top: '450px', fontSize: '30px', fontWeight: '800', color: '#666' }, null, '개 · 285KB 글자 파일');
  const fnd = el('div', null, { position: 'absolute', left: '1250px', top: '540px', fontSize: '96px', fontWeight: '900', color: C.orange, lineHeight: '1', textShadow: '4px 4px 0 #141414' }, null, '0');
  const fl = el('div', null, { position: 'absolute', left: '1254px', top: '650px', fontSize: '30px', fontWeight: '800', color: '#666' }, null, "개 · '떡볶이'");
  const st = stamp(f2(BIG.contains.sec) + '초', 1290, 700, 54);
  const pills = [[`@운동 ${BIG.tag.n}개`, BIG.tag.sec], [`2020년 ${BIG.year.n}개`, BIG.year.sec], [`별표 ${BIG.starred.n}개`, BIG.starred.sec]].map((p, i) => pill(`${p[0]} · ${f2(p[1])}초`, true, 1250, 330 + i * 76, 350, 58));
  const hist = el('div', 'chip', { left: '1250px', top: '600px', fontSize: '30px', padding: '14px 24px', background: C.ink, color: '#fff' }, null, `-today-in-history → ${BIG.today_in_history.n}개`);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(gd, t, c[0] - .1, 500);
    const fill = P(t, c[0] + .4, c[0] + 2.6), mark = P(t, c[1] + .2, c[1] + 1.4), dayk = P(t, c[3] + .3, c[3] + 1.1);
    g.clearRect(0, 0, 980, 540);
    for (let i = 0; i < 3650; i++) { if (i / 3650 > fill) break; const y = Math.floor(i / 365), x = i % 365; let col = '#cfc7b4';
      if (hit[i] && i / 3650 < mark) col = C.orange; if (day[i] && dayk > 0) col = C.green; g.fillStyle = col; g.fillRect(x * 2.68, y * 54 + 10, 2.2, day[i] && dayk > 0 ? 34 : 30); }
    const out1 = eIO(P(t, c[2] - .3, c[2] + .2));
    [cnt, cl].forEach(e => tf(e, 0, 0, 1, 0, fadeIn(t, c[0] + .4) * (1 - out1))); count(cnt, t, c[0] + .4, 3650, 2.2);
    [fnd, fl].forEach(e => tf(e, 0, 0, 1, 0, fadeIn(t, c[1] + .1) * (1 - out1))); count(fnd, t, c[1] + .2, BIG.contains.n, 1.6);
    st.render(t, c[1] + 2.0, c[2] - .3);
    pills.forEach((p, i) => pillRender(p, t, c[2] + .2 + i * .8, true));
    const h = popIn(t, c[3] + .9, .45); tf(hist, 0, (1 - h) * 30, h, 0, h > 0 ? 1 : 0);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 2.0 - .35, a: 'stamp' }, { at: c[2] + 1.0, a: 'nod' }, { at: c[3] + 1.0, a: 'point', dir: 'left' }]);
  };
};
// ---- 08 옵션: 옵션 카드가 하나씩 + 달력 보기 미니 그림 → 일기장 두 권(기본·업무) ----
SCENES.opts = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['자주', '쓰는'], ['*옵션*', '모음']], [['최근', '·', '오늘', '·'], ['*기간*', '고르기']], [['제목만', '·', '달력', '·'], ['*편집기*로', '고치기']], [['일기장', '*여러 개*'], ['업무 일지', '따로']]]);
  const O = [['-n 5', '최근 5개'], ['-on today', '오늘 쓴 것'], ['-from / -to', '기간'], ['--short', '제목만'], ['--format calendar', '달력 보기'], ['--edit', '편집기로 고치기']];
  const cards = O.map((o, i) => { const b = box(110 + (i % 3) * 500, 340 + Math.floor(i / 3) * 170, 470, 140, 'card', { padding: '20px 28px' });
    el('div', 'mono', { fontSize: '36px', fontWeight: '900', color: C.orange, whiteSpace: 'nowrap' }, b, M.esc(o[0])); el('div', null, { fontSize: '30px', fontWeight: '800' }, b, o[1]); return b; });
  const bk = [['default', '기본 일기장', '#FFF8E1'], ['업무', '업무일지.txt', '#E3EDF8']].map((b, i) => { const x = box(110 + i * 520, 700, 480, 220, 'card', { padding: '26px 30px', background: b[2] });
    el('div', null, { fontSize: '40px', fontWeight: '900' }, x, b[0]); el('div', 'mono', { fontSize: '26px', color: '#666', fontWeight: '700' }, x, b[1]); return x; });
  const cmd = el('div', 'mono', { position: 'absolute', left: '1150px', top: '740px', width: '450px', background: C.termBg, color: '#EDEDED', fontSize: '28px', padding: '22px 24px', borderRadius: '14px', whiteSpace: 'pre' }, null, '');
  const C2 = 'jrnl 업무 "거래처 미팅"';
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((b, i) => { const at = i < 3 ? c[1] + .1 + i * .8 : c[2] + .1 + (i - 3) * .8; const k = popIn(t, at, .45); tf(b, 0, (1 - k) * 200, 1, 0, k > 0 ? Math.min(1, k * 2) : 0); });
    bk.forEach((b, i) => dropIn(b, t, c[3] + .1 + i * .8, 400));
    const cc = popIn(t, c[3] + 1.6, .4); tf(cmd, 0, 0, 1, 0, cc > 0 ? 1 : 0); const n = Math.floor(P(t, c[3] + 1.8, c[3] + 3.0) * C2.length);
    cmd.innerHTML = '<span style="color:#FFB86B">C:\\&gt; </span>' + M.esc(C2.slice(0, n));
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'point', dir: 'left' }, { at: c[2] + 1.5, a: 'nod' }, { at: c[3] + 2.0, a: 'happy' }]);
  };
};
// ---- 09 쓸 곳: 아이콘 카드 3장(0.8초 간격) + 카드마다 예시 일기 한 줄 ----
SCENES.uses = S => {
  const c = [0, 1, 2].map(S.cue);
  const caps = capsOf(S, [[['①', '업무', '일지·'], ['*회의 메모*']], [['②', '한', '줄', '일기·'], ['*가계부 메모*']], [['③', '공부·운동'], ['*기록*', '꺼내 보기']]]);
  const U = [['file', '업무 일지', '회의 메모', '팀 회의 메모. @회의'], ['check', '한 줄 일기', '가계부 메모', '점심 9000원 #가계부'], ['bolt', '공부·운동', '1년 뒤 꺼내 보기', '영어 단어 15개 @공부']];
  const cards = U.map((u, i) => { const b = box(110 + i * 500, 340, 460, 560, 'card', { padding: '30px' });
    el('div', null, { marginBottom: '18px' }, b, iconTile(u[0], 96)); el('div', null, { fontSize: '46px', fontWeight: '900' }, b, u[1]); el('div', null, { fontSize: '30px', fontWeight: '700', color: '#666', marginBottom: '30px' }, b, u[2]);
    const ln = el('div', null, { background: '#FFF8E1', border: '3px dashed #c9bd9c', borderRadius: '14px', padding: '20px', fontSize: '28px', fontWeight: '800' }, b, tagHL(u[3])); return { b, ln }; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((k, i) => { dropIn(k.b, t, c[i] - .05, 500, i % 2 ? 5 : -5); const a = P(t, c[i] + .6, c[i] + 1.4); k.ln.style.clipPath = `inset(0 ${100 - a * 100}% 0 0)`; });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 1.2, a: 'point', dir: 'left' }, { at: c[1] + 1.2, a: 'nod' }, { at: c[2] + 1.8, a: 'happy' }]);
  };
};
// ---- 10 아쉬운 점: 카드 4장 + 빨간 펜 밑줄(②) + 동그라미(④) ----
SCENES.cons = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['아쉬운', '점도'], ['*짚어*', '보겠습니다']], [['①', '화면', '없는'], ['*명령어 도구*']], [['②', '날짜', '말은'], ['*영어만*']], [['③', '상자', '화면에서'], ['*한글 줄 어긋남*']], [['④', '암호를', '잊으면'], ['*끝*', '· 백업 필수']]]);
  const K = [['화면 없는 명령어 도구 · 휴대폰 앱 없음', '저장소의 한줄일기.bat는 한 줄만 물어보고 저장'], ["날짜 말은 영어만 · 'last monday' → 11월 16일(9일 전)", "한글 '어제:'는 제목 글자로 남음 · 날짜는 2026-11-20 처럼 숫자로 쓰면 확실"],
    ['꾸민 상자 화면(--format fancy) · 꼬리표 표에서 한글 줄 어긋남', '기본 화면·마크다운 내보내기는 한글 그대로'], ['암호를 잊으면 되살릴 방법 없음', '일기 파일(journal.txt)을 따로 백업 · 암호는 따로 적어 두기']];
  const cards = K.map((k, i) => { const b = box(110, 330 + i * 150, 1480, 132, 'card', { display: 'flex', alignItems: 'center', gap: '26px', padding: '0 30px' });
    el('div', null, { minWidth: '68px', height: '68px', borderRadius: '16px', background: C.red, color: '#fff', fontWeight: '900', fontSize: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, b, String(i + 1));
    const tx = el('div', null, {}, b); const h = el('div', null, { fontSize: '34px', fontWeight: '900', whiteSpace: 'nowrap' }, tx, M.esc(k[0])); el('div', null, { fontSize: '25px', fontWeight: '700', color: '#666' }, tx, M.esc(k[1])); return { b, h }; });
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
// ---- 정리: 체크리스트 3줄(✓가 하나씩) ----
SCENES.summary = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['오늘', '내용', '*정리*']], [['jrnl', '='], ['*날짜 도장*', '수첩']], [['쓰기', WRITE + '초,'], ['10년치', '*' + f2(BIG.contains.sec) + '초*']], [['날짜는', '*영어로*,'], ['암호는', '따로 적기']]]);
  const L = ['jrnl = 날짜 도장 수첩 (@꼬리표 · 암호 자물쇠)', `한 줄 쓰기 ${WRITE}초 · 10년치 3,650개 찾기 ${f2(BIG.contains.sec)}초`, '날짜는 영어나 숫자로 · 암호는 따로 적고 파일은 백업'];
  const cd = box(110, 340, 1480, 540, 'card', { padding: '40px 50px' });
  const rows = L.map((s, i) => { const r = el('div', null, { display: 'flex', alignItems: 'center', gap: '30px', height: '150px', borderBottom: i < 2 ? '3px dashed #ddd' : 'none' }, cd);
    const b = el('div', null, { minWidth: '76px', height: '76px', border: '5px solid #141414', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '58px', fontWeight: '900', color: C.green }, r, '');
    el('div', null, { fontSize: '42px', fontWeight: '900', whiteSpace: 'nowrap' }, r, M.esc(s)); return { r, b }; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(cd, t, c[0] + .2, 400);
    rows.forEach((k, i) => { k.r.style.opacity = fadeIn(t, c[i + 1] - .1); const on = t > c[i + 1] + .5; k.b.textContent = on ? '✓' : ''; k.b.style.transform = `scale(${on ? popIn(t, c[i + 1] + .5, .4) : 1})`; });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'nod' }, { at: c[2] + 1.0, a: 'nod' }, { at: c[3] + 1.8, a: 'happy' }]);
  };
};
// ---- 엔딩 (유의사항 2줄) ----
SCENES.end = S => ending(S, { name: 'jrnl · 날짜 도장 수첩', lines: [['다음에 또 멋진'], ['*오픈소스*', '소개하겠습니다!']], disclaimer: DISCLAIMER });

// ======================= 숏폼 · 과정 애니메이션 (세로 1080×1920 / 가로 1920×1080 둘 다) =======================
const NBX = S => S.V ? M.buddy(770, 168, .62) : M.buddy(1636, 548, .62);
const LY = S => S.V ? { x: 70, w: 940, y: 520 } : { x: 110, w: 1480, y: 340 };
SCENES.s_hook = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['10년', '전', '오늘,'], ['*기억*', '하십니까?']], { size: S.V ? 80 : 78 });
  const W = S.V ? L.w : 1000;
  const rows = [['2017-11-25 21:00', '점심은 떡볶이.', '오늘은 영어 단어 15개. @독서'], ['2020-11-25 21:00', '점심은 비빔밥.', '오늘은 산책 30분. @운동'], ['2023-11-25 21:00', '점심은 칼국수.', '오늘은 영화 한 편. @모임']]
    .map((e, i) => entry(L.x, (S.V ? 560 : 340) + i * (S.V ? 200 : 170), W, e[0], e[1], e[2], { h: S.V ? 170 : 150, fs: S.V ? 36 : 34 }));
  const q = el('div', null, { position: 'absolute', left: (S.V ? 620 : 1220) + 'px', top: (S.V ? 1170 : 400) + 'px', fontSize: S.V ? '200px' : '240px', fontWeight: '900', color: C.orange, textShadow: '6px 6px 0 #141414' }, null, '?');
  const nb = NBX(S);
  return t => {
    cap.render(t); rows.forEach((r, i) => r.render(t, c0 + .4 + i * .8));
    const a = popIn(t, c0 + 2.8, .5); tf(q, 0, 0, a, (1 - a) * 30, a > 0 ? 1 : 0);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.4, a: 'look' }, { at: c0 + 3.0, a: 'point', dir: S.V ? 'left' : 'left' }]);
  };
};
SCENES.s_what = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['*jrnl*'], ['한', '줄', '일기장']]), caption(c1 - .1, null, [['날짜가', '저절로,'], ['*' + WRITE + '초*']])];
  const tm = term(L.x, L.y, S.V ? L.w : 860, S.V ? 280 : 300, { fs: S.V ? 30 : 31 });
  const en = entry(L.x, S.V ? 880 : 700, S.V ? L.w : 860, E.lunch[0], E.lunch[1], E.lunch[2], { h: S.V ? 170 : 150 });
  const st = stamp(WRITE + '초', S.V ? 640 : 1120, S.V ? 1110 : 500, 60);
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t)); const a = popIn(t, c0 + .2, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c0 + .7, text: 'jrnl "점심은 김치찌개였다. @점심"', dur: 2.2 }, { at: c1 + .1, kind: 'out', text: '[Entry added]' }]);
    en.render(t, c1 + .3); st.render(t, c1 + 1.6);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.0, a: 'point', dir: 'left' }, { at: c1 + 1.6 - .35, a: 'stamp' }]);
  };
};
SCENES.s_find = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['10년치', '3,650개'], ["'떡볶이'", '→', '*' + f2(BIG.contains.sec) + '초*']]), caption(c1 - .1, null, [['해마다', '*오늘*'], ['쓴', '일기만']])];
  const gw = S.V ? L.w : 1000, gh = S.V ? 520 : 560;
  const gd = box(L.x, S.V ? 540 : 340, gw, gh, 'card', { padding: '20px' });
  const cv = el('canvas', null, { position: 'absolute', left: '20px', top: '20px' }, gd); cv.width = gw - 40; cv.height = gh - 40; const g = cv.getContext('2d');
  let sd = 25; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const hit = Array.from({ length: 3650 }, () => rnd() < BIG.contains.n / 3650);
  const cw = (gw - 40) / 365, rh = (gh - 40) / 10;
  const fnd = el('div', null, { position: 'absolute', left: (S.V ? L.x : 1150) + 'px', top: (S.V ? 1110 : 360) + 'px', fontSize: '110px', fontWeight: '900', color: C.orange, textShadow: '5px 5px 0 #141414' }, null, '0개');
  const st = stamp(f2(BIG.contains.sec) + '초', S.V ? 620 : 1300, S.V ? 1130 : 520, 60);
  const hist = el('div', 'chip', { left: (S.V ? L.x : 1150) + 'px', top: (S.V ? 1290 : 700) + 'px', fontSize: '36px', padding: '16px 28px', background: C.ink, color: '#fff' }, null, `해마다 11월 25일 → ${BIG.today_in_history.n}개`);
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t)); dropIn(gd, t, c0 - .1, 400);
    const fill = P(t, c0 + .2, c0 + 1.6), mark = P(t, c0 + 1.6, c0 + 2.6), dk = P(t, c1 + .2, c1 + .9);
    g.clearRect(0, 0, cv.width, cv.height);
    for (let i = 0; i < 3650; i++) { if (i / 3650 > fill) break; const y = Math.floor(i / 365), x = i % 365; let col = '#cfc7b4'; if (hit[i] && i / 3650 < mark) col = C.orange; if (x === 363 && dk > 0) col = C.green;
      g.fillStyle = col; g.fillRect(x * cw, y * rh + 4, Math.max(1.2, cw * .82), x === 363 && dk > 0 ? rh - 4 : rh - 12); }
    const f = fadeIn(t, c0 + 1.6); tf(fnd, 0, 0, 1, 0, f); count(fnd, t, c0 + 1.6, BIG.contains.n, 1.6, v => Math.round(v) + '개');
    st.render(t, c0 + 3.0);
    const h = popIn(t, c1 + .9, .45); tf(hist, 0, (1 - h) * 30, h, 0, h > 0 ? 1 : 0);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 3.0 - .35, a: 'stamp' }, { at: c1 + 1.0, a: 'nod' }]);
  };
};
SCENES.s_lock = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['암호', '자물쇠', '→'], ['*알 수 없는 글자*']]), caption(c1 - .1, null, [['날짜', '말은', '*영어만*,'], ['암호는', '따로 적기']])];
  const lock = box(S.V ? 350 : 1150, S.V ? 520 : 340, 380, 380, 'card', { display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.ink });
  el('div', null, {}, lock, M.icon('lock', 250, C.yellow, 2.2));
  const note = box(L.x, S.V ? 950 : 340, S.V ? L.w : 980, 280, 'card', { padding: '0', overflow: 'hidden' });
  el('div', null, { background: '#dfe6ee', fontSize: '26px', fontWeight: '800', padding: '10px 20px' }, note, 'journal.txt (잠근 뒤)');
  el('div', 'mono', { fontSize: '28px', padding: '16px 20px', lineHeight: '1.5', wordBreak: 'break-all', color: '#444' }, note, 'JRNLv3 0eyJzYWx0IjoiQ0hkZ3Vq… gAAAAABn4kQ2x9Lw0kVnR1… Zm8sQXp3cE1o…');
  const pills = [["yesterday: → ✓ 날짜", true], ["어제: → ✗ 글자 그대로", false]].map((p, i) => pill(p[0], p[1], L.x, (S.V ? 1270 : 680) + i * 80, S.V ? 560 : 520, 62));
  const hd = hand('암호는 따로!', S.V ? 600 : 1150, S.V ? 1300 : 780, 54, -5);
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t));
    const l = popIn(t, c0 + .1, .5); tf(lock, 0, (1 - l) * -500 + shake(t, c0 + .6, .35, 8), 1, (1 - l) * 12, l > 0 ? 1 : 0);
    const n = popIn(t, c0 + 1.0, .5); tf(note, 0, (1 - n) * 400, 1, 0, n > 0 ? 1 : 0);
    pills.forEach((p, i) => pillRender(p, t, c1 + .3 + i * .8, i === 0));
    hd.render(t, c1 + 2.0, .7);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.4, a: 'nod' }, { at: c1 + 1.1, a: 'oops' }, { at: c1 + 2.0, a: 'pen' }]);
  };
};
SCENES.s_end = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['설치는'], ['*명령 한 줄*']]);
  const tm = term(L.x, S.V ? 560 : 360, S.V ? L.w : 880, 220, { fs: 34 });
  const nb = NBX(S); const rc = box(S.V ? L.x : 1060, S.V ? 860 : 360, S.V ? L.w : 540, 300, 'card', { padding: '34px 40px' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, rc, '일반인 쓸모 별점'); const sr = stars(40, 100, S.V ? 112 : 78, 3, 5, rc);
  return t => { cap.render(t); const a = popIn(t, c0, .5); tf(tm.el, 0, (1 - a) * 200, 1, 0, a > 0 ? 1 : 0); tm.render(t, [{ at: c0 + .4, text: 'py -m pip install jrnl', dur: 1.4 }]);
    const b = popIn(t, c0 + 1.6, .5); tf(rc, 0, (1 - b) * 200, 1, 0, b > 0 ? 1 : 0); sr.render(t, c0 + 2.0);
    nb.render(t, [{ at: c0 + .2, a: 'enter' }, { at: c0 + .7, a: 'point', dir: 'left' }, { at: c0 + 2.6, a: 'happy' }]); };
};
