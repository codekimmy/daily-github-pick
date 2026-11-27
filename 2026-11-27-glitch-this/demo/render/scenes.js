// glitch-this (2026-11-27 픽, 2026-11-27 시연) 모션 장면 — tools/motion 키트 (GUIDE 5-4)
// 숫자: data.js 의 RES (= demo/results.json 시연 측정값)만 씀. 그림은 모두 코드로 그린 가상 그림(demo/mksample.py)
// img/* = glitch-this 1.0.3 이 실제로 만든 결과 그림 (bench.py 가 복사, gif0~7 은 움직이는 GIF 의 0·3·6…21번째 장)
// 시간: 모두 S.cue(i)(자막 i 의 시작 초) 기준 → 음성 길이에 맞춰 구간이 바뀌어도 그대로 따라감
// 롱폼 14개 장 + 숏폼 5장면 모두 직접 만듦 (기본 장면 없음), end 를 뺀 모든 장·장면에 냥봇(2~4번 반응)
// 비유 하나: '일부러 고장 낸 텔레비전' — 가로 띠를 옆으로 밀고, 한 색을 어긋나게 하고, 줄무늬를 그음
const { C, P, eOut, eIO, lerp, popIn, shake, el, box, tf, caption, stamp, hand, pen, ellipsePath, arrowPath, count, term, pill, pillRender, stars, iconTile, ending } = M;
const DISCLAIMER = ['정보 제공용 · 2026-11-27 클라우드 시연 결과(운영자 직접 검증 아님) · 그림은 코드로 그린 가상 그림',
  'Windows·버전에 따라 결과가 다를 수 있음 · 파이썬을 먼저 설치해야 함 · 원본 그림은 따로 보관'];
const STARS = 1797;                                   // GitHub 별 (2026-11-27 검색 API 확인)
const f2 = v => Number(v).toFixed(2);
const ONE = f2(RES.levels[5].sec), GIFS = f2(RES.gif.sec);
const SCENES = {};

// ---------- 공통 도우미 ----------
const capsOf = (S, arr) => arr.map((L, i) => caption(S.cue(i) - .1, i < arr.length - 1 ? S.cue(i + 1) - .25 : null, L));
const NB = () => M.buddy(1636, 548, .62);
const fadeIn = (t, a, d = .5) => Math.min(1, popIn(t, a, d) * 2);
const dropIn = (e, t, a, dy = -500, r = 0) => { const k = popIn(t, a, .55); tf(e, 0, (1 - k) * dy, 1, (1 - k) * r, k > 0 ? 1 : 0); return k; };
const slideIn = (e, t, a, dx = -300, o = 1) => { const k = popIn(t, a, .5); tf(e, (1 - k) * dx, 0, 1, 0, k > 0 ? Math.min(1, k * 2) * o : 0); return k; };
const FMT = { png: ['PNG', '#7C3AED'], jpg: ['JPG', '#0E7490'], gif: ['GIF', '#DB2777'] };
// 그림 카드: 위 색 띠(형식 + 파일 이름) + 몸통(실제 결과 그림)
function pic(x, y, w, h, kind, name, src, o = {}) {
  const [lab, col] = FMT[kind];
  const b = box(x, y, w, h, 'card', { padding: '0', overflow: 'hidden' }, o.par);
  el('div', null, { background: col, color: '#fff', fontWeight: '900', fontSize: (o.fs || 26) + 'px', padding: '8px 20px', display: 'flex', gap: '14px', alignItems: 'center', whiteSpace: 'nowrap' }, b,
    `<span style="background:#fff;color:${col};border-radius:8px;padding:0 10px">${lab}</span><span>${M.esc(name)}</span>`);
  const body = el('div', null, { position: 'absolute', left: '0', right: '0', top: (o.fs || 26) + 26 + 'px', bottom: '0', overflow: 'hidden', background: '#222' }, b);
  const img = el('img', null, { width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: o.pos || 'center' }, body); img.src = src;
  return { b, body, img };
}
// 움직이는 GIF 흉내: 실제 결과 GIF 의 장(gif0~7)을 한 장 0.2초(= 실제 GIF 재생 시간)로 넘김
const GF = Array.from({ length: 8 }, (_, i) => `img/gif${i}.jpg`);
const playGif = (k, t, t0) => { if (t < t0) return; const i = Math.floor((t - t0) / (RES.gif.duration_ms / 1000)) % GF.length; const s = GF[i]; if (!k.img.src.endsWith(s)) k.img.src = s; };
// 글자 지직 효과: 정해진 순간에만 빨강·파랑 그림자가 옆으로 어긋남 (같은 시각 = 같은 모양)
const jit = (e, t, on = 1) => { const f = Math.floor(t * 10), r = Math.sin(f * 12.9898) * 43758.5453, v = r - Math.floor(r);
  const d = on && v > .55 ? Math.round((v - .5) * 30) : 0; e.style.textShadow = d ? `${d}px 0 0 #FF2D55, ${-d}px 0 0 #00B3FF` : 'none'; };
const half = (sr, i) => { const k = sr.el.children[i]; if (k) k.style.clipPath = 'inset(0 50% 0 0)'; };   // 2.5개: 3번째 채운 별을 반만 (children 5~7 = 채운 별)
const arrow = (x1, y1, x2, y2, b = 30) => pen(arrowPath(x1, y1, x2, y2, b), 7, C.orange);
const chipAt = (s, x, y, css = {}) => el('div', 'chip', Object.assign({ left: x + 'px', top: y + 'px', fontSize: '27px' }, css), null, s);
const chipIn = (e, t, a) => { const k = popIn(t, a, .45); tf(e, 0, (1 - k) * 30, k, 0, k > 0 ? 1 : 0); };

// ======================= 롱폼 (1920×1080) =======================
// ---- 미리보기: 원본 그림 → 명령 한 줄 → 지직거리는 결과 + 0.17초 도장 → GIF 23장이 움직임 ----
SCENES.preview = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2);
  const caps = [caption(c0 - .1, c1 - .3, [['평범한', '그림'], ['*한 장*']]),
    caption(c1 - .1, c2 - .3, [['명령', '한', '줄'], ['→', '*고장 난 화면*', ONE + '초']]),
    caption(c2 - .06, null, [['움직이는', 'GIF'], ['*' + RES.gif.frames + '장*', GIFS + '초']])];
  const og = pic(110, 330, 640, 400, 'png', '겨울바다.png', 'img/orig.png');
  const tm = term(110, 760, 640, 160, { fs: 26 });
  const ar = arrow(760, 530, 820, 530, 16);
  const gl = pic(830, 330, 760, 460, 'png', 'glitched_겨울바다.png', 'img/lv5.png');
  const st = stamp(ONE + '초', 1250, 780, 52);
  const gf = pic(830, 330, 760, 460, 'gif', `움직임.gif (${RES.gif.frames}장)`, GF[0]);
  const nb = NB();
  return t => {
    caps.forEach(c => c.render(t));
    dropIn(og.b, t, c0 - .1, -500, -3);
    const a = popIn(t, c1 - .2, .5); tf(tm.el, 0, (1 - a) * 200, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c1 + .2, text: 'glitch_this 겨울바다.png 5', dur: 1.4 }]);
    ar.set(eOut(P(t, c1 + 1.6, c1 + 2.1)));
    slideIn(gl.b, t, c1 + 1.9, 400, 1 - eIO(P(t, c2, c2 + .4))); st.render(t, c1 + 2.6);
    const g = popIn(t, c2 + .2, .5); tf(gf.b, 0, 0, .9 + g * .1, 0, g > 0 ? 1 : 0); playGif(gf, t, c2 + .4);
    nb.render(t, [{ at: c0 + .5, a: 'enter' }, { at: c1 + 2.6 - .35, a: 'stamp' }, { at: c2 + .8, a: 'look' }, { at: c2 + 3.0, a: 'happy' }]);
  };
};
// ---- 타이틀: 'glitch-this.' 글자가 떨어지며 지직 + 별 카운트 → 별점 2.5/5 → 세기 0.1~10 막대 + '무료' 도장 ----
SCENES.title = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2);
  const tag = el('div', 'chip', { left: '110px', top: '200px', background: C.ink, color: '#fff', fontSize: '30px' }, null, '오늘의 오픈소스 · 2026.11.27');
  const word = el('div', null, { position: 'absolute', left: '100px', top: '260px', fontSize: '190px', fontWeight: '900', letterSpacing: '-7px', lineHeight: '1', transformOrigin: 'left top' });
  const letters = [...'glitch-this'].map(ch => el('span', null, { display: 'inline-block' }, word, ch)); const dot = el('span', null, { display: 'inline-block', color: C.orange }, word, '.');
  const chips = [['github.com/TotallyNotChase/glitch-this', 110, 'mono'], ['★ 0', 850, ''], ['MIT · 무료', 1060, 'mono']].map(c => el('div', 'chip ' + c[2], { left: c[1] + 'px', top: '540px', fontSize: '25px' }, null, c[0]));
  const rc = box(1000, 190, 600, 330, 'card', { padding: '34px 40px', transformOrigin: 'right top' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, rc, '일반인 쓸모 별점');
  const sr = stars(40, 100, 90, 3, 5, rc); half(sr, 7);
  const score = el('div', null, { position: 'absolute', left: '40px', top: '220px', fontSize: '60px', fontWeight: '900', transformOrigin: 'left center' }, rc, '2.5 <span style="color:#999;font-size:40px">/ 5</span>');
  const lv = box(110, 650, 1100, 250, 'card', { padding: '30px 40px' });
  el('div', null, { fontSize: '38px', fontWeight: '900', color: '#555' }, lv, '망가뜨리는 세기');
  const bar = el('div', null, { position: 'absolute', left: '40px', top: '130px', height: '56px', width: '0px', borderRadius: '12px', background: `linear-gradient(90deg, ${C.green}, ${C.orange}, ${C.red})`, border: '4px solid #141414' }, lv);
  el('div', 'mono', { position: 'absolute', left: '40px', top: '196px', fontSize: '28px', fontWeight: '900' }, lv, '0.1');
  el('div', 'mono', { position: 'absolute', right: '40px', top: '196px', fontSize: '28px', fontWeight: '900' }, lv, '10');
  const free = stamp('무료', 1400, 720, 70, -10);
  const nb = NB();
  return t => {
    const ti = popIn(t, c0 + .2); const top = eIO(P(t, c2 - .3, c2 + .3));
    tf(tag, 0, -top * 60, ti, 0, ti > 0 ? 1 : 0);
    letters.forEach((l, i) => { const a = popIn(t, c0 + .3 + i * .08, .55); l.style.transform = `translateY(${(1 - a) * -320}px) rotate(${(1 - a) * 20}deg)`; l.style.opacity = a > 0 ? 1 : 0; });
    jit(word, t, t > c0 + 1.3); dot.style.transform = `scale(${popIn(t, c0 + 1.2)})`; tf(word, 0, -top * 60, 1 - top * .35);
    chips.forEach((c, i) => { const a = popIn(t, c0 + 1.4 + i * .8); tf(c, 0, (1 - a) * 40 - top * 40, a, 0, Math.min(1, a * 2) * (1 - top)); });
    count(chips[1], t, c0 + 2.2, STARS, 1.6, v => '★ ' + Math.round(v).toLocaleString('en-US'));
    const ri = popIn(t, c1 - .1, .55), rmv = eIO(P(t, c2 - .3, c2 + .3)); tf(rc, 0, (1 - ri) * 300 - rmv * 60, 1 - rmv * .45, 0, ri > 0 ? 1 : 0);
    sr.render(t, c1 + .5); score.style.transform = `scale(${popIn(t, c1 + 1.9)})`;
    const li = popIn(t, c2 + .3, .55); tf(lv, 0, (1 - li) * 500, 1, 0, li > 0 ? 1 : 0); bar.style.width = (1020 * eOut(P(t, c2 + .8, c2 + 2.4))) + 'px';
    free.render(t, c2 + 3.4);
    nb.render(t, [{ at: c0 + .8, a: 'enter' }, { at: c0 + 1.4, a: 'wave' }, { at: c1 + 1.9, a: 'nod' }, { at: c2 + 3.4 - .35, a: 'stamp' }]);
  };
};
// ---- 01 무엇인가: 원본 → 텔레비전 틀 안에서 지직 → 효과 3장(띠 밀기 · 색 · 줄무늬) → 정보 칩 ----
SCENES.what = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['glitch-this', '='], ['*일부러 고장 낸 TV*']], [['①', '가로', '띠를'], ['*옆으로 밀기*']], [['②', '색', '어긋남'], ['③', '*줄무늬*']], [['한', '장', '그림도'], ['*움직이는 GIF*도']], [['2020년', '공개', '·', '별'], ['*' + STARS.toLocaleString('en-US') + '개*']]]);
  const tv = box(110, 330, 760, 520, 'card', { padding: '26px', background: '#2B2B2B' });
  const scr = el('img', null, { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px', display: 'block' }, tv); scr.src = 'img/orig.png';
  const legs = [0, 1].map(i => el('div', null, { position: 'absolute', left: (330 + i * 260) + 'px', top: '850px', width: '16px', height: '60px', background: '#2B2B2B', transform: `rotate(${i ? -20 : 20}deg)` }));
  const E = [['띠 밀기', 'img/lv10.png', '세기 숫자'], ['색 어긋남', 'img/color.png', '-c'], ['줄무늬', 'img/scan.png', '-s']];
  const fx = E.map((e, i) => { const k = pic(920, 330 + i * 200, 420, 180, 'png', e[0], e[1], { fs: 22 });
    const ch = chipAt(e[2], 1360, 380 + i * 200, { fontFamily: '"DejaVu Sans Mono", monospace' }); return { k, ch }; });
  const gifc = pic(920, 330, 420, 580, 'gif', '움직이는 GIF', GF[0], { fs: 22 });
  const lic = ['2020년 공개 · 파이썬', '별 ' + STARS.toLocaleString('en-US'), 'MIT · 무료', '마지막 수정 2024년'].map((s, i) => chipAt(s, 1360, 330 + i * 70));
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(tv, t, c[0] - .05, -500); legs.forEach(l => l.style.opacity = fadeIn(t, c[0] + .3));
    const ph = t < c[1] + .6 ? 'orig' : t < c[2] + .6 ? 'lv10' : t < c[2] + 2.0 ? 'color' : t < c[3] ? 'scan' : '';
    const fl = Math.floor(t * 4) % 2;   // 지직: 0.25초마다 원본과 바꿔 보임
    if (ph) { const s = `img/${ph === 'orig' || fl ? ph : 'orig'}.png`; if (!scr.src.endsWith(s)) scr.src = s; } else playGif({ img: scr }, t, c[3]);
    const hide = 1 - eIO(P(t, c[3] - .2, c[3] + .2));
    fx.forEach((e, i) => { const at = i === 0 ? c[1] + .4 : c[2] + .3 + (i - 1) * 1.0; slideIn(e.k.b, t, at, 500, hide); const a = popIn(t, at + .4, .4); tf(e.ch, 0, (1 - a) * 30, a, 0, a > 0 ? hide : 0); });
    const g = popIn(t, c[3] + .1, .5); tf(gifc.b, 0, (1 - g) * 300, 1, 0, g > 0 ? 1 - eIO(P(t, c[4] - .2, c[4] + .2)) : 0); playGif(gifc, t, c[3] + .3);
    lic.forEach((e, i) => chipIn(e, t, c[4] + .3 + i * .7));
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + .6, a: 'look' }, { at: c[2] + 1.4, a: 'point', dir: 'left' }, { at: c[3] + 1.0, a: 'happy' }]);
  };
};
// ---- 02 설치: 파이썬 먼저(winget) → pip 한 줄 타이핑 → 1.36초 카운트 · 함께 설치 2개 · 83.9MB → 본체 36.6KB ----
SCENES.install = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['Windows는'], ['*파이썬*', '먼저', '설치']], [['명령', '창에'], ['*pip install*', '한', '줄']], [['*' + f2(RES.install.pip_sec) + '초*', '·', '함께', '설치'], ['그림', '도구', '2개']], [['glitch-this', '자체는'], ['*' + RES.install.self_kb + 'KB*']]]);
  const py = box(110, 340, 640, 260, 'card', { padding: '28px 34px' });
  el('div', null, { fontSize: '30px', fontWeight: '800', color: '#666' }, py, '① 파이썬 설치 (한 번만)');
  el('div', 'mono', { fontSize: '27px', fontWeight: '800', margin: '16px 0', whiteSpace: 'nowrap' }, py, 'winget install Python.Python.3.13');
  el('div', null, { fontSize: '26px', fontWeight: '800' }, py, '또는 python.org 설치 파일 · "Add python.exe to PATH" 체크');
  const tm = term(790, 340, 810, 260, { fs: 27 });
  const sec = el('div', null, { position: 'absolute', left: '110px', top: '640px', fontSize: '110px', fontWeight: '900', color: C.orange, textShadow: '4px 4px 0 #141414' }, null, '0.00초');
  const pk = [`numpy ${RES.install.packages.numpy}`, `Pillow ${RES.install.packages.pillow}`, `합쳐서 ${RES.install.site_mb}MB`].map((s, i) => chipAt(s, 110 + i * 250, 790, { fontSize: '26px' }));
  const sub = chipAt('리눅스 시연 · 파이썬 ' + RES.install.python + ' · Windows 실행은 시연하지 않음', 110, 860, { fontSize: '24px' });
  const me = box(1000, 650, 600, 270, 'card', { padding: '28px 34px' });
  el('div', null, { fontSize: '30px', fontWeight: '800', color: '#666' }, me, 'glitch-this 자체 크기');
  const kb = el('div', null, { fontSize: '110px', fontWeight: '900', color: C.orange, lineHeight: '1.2' }, me, '0KB');
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(py, t, c[0] - .05, -400);
    const a = popIn(t, c[1] - .1, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c[1] + .3, text: 'py -m pip install glitch-this', dur: 1.6 }, { at: c[2] + .4, kind: 'out', text: 'Successfully installed glitch_this-1.0.3' }, { at: c[2] + .6, kind: 'out', text: `numpy-${RES.install.packages.numpy} pillow-${RES.install.packages.pillow}` }]);
    const s = popIn(t, c[2], .45); tf(sec, 0, 0, s, -3, s > 0 ? 1 : 0); count(sec, t, c[2] + .1, RES.install.pip_sec, 1.4, v => v.toFixed(2) + '초');
    pk.forEach((e, i) => chipIn(e, t, c[2] + 1.6 + i * .6)); chipIn(sub, t, c[2] + 3.4);
    dropIn(me, t, c[3] - .1, 400); count(kb, t, c[3] + .3, RES.install.self_kb, 1.4, v => v.toFixed(1) + 'KB');
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'point', dir: 'left' }, { at: c[2] + 1.0, a: 'nod' }, { at: c[3] + 1.8, a: 'look' }]);
  };
};
// ---- 03 시연 ①: 명령 타이핑 → 세기 1 · 5 · 10 결과 3장 + 달라진 비율 카운트 → 결과 파일 이름 칩 ----
SCENES.demo1 = S => {
  const c = [0, 1, 2].map(S.cue);
  const caps = capsOf(S, [[['파일', '이름', '뒤에'], ['*세기 숫자*', '→', ONE + '초']], [['달라진', '부분'], ['1 → *' + RES.levels[1].changed_pct + '%*', '·', '10 → *' + RES.levels[10].changed_pct + '%*']], [['결과는', '*새 파일*'], ['원본은', '그대로']]]);
  const tm = term(110, 330, 1490, 150, { fs: 28 });
  const L = [1, 5, 10].map((v, i) => { const k = pic(110 + i * 500, 500, 470, 290, 'png', '세기 ' + v, `img/lv${v}.png`, { fs: 24 });
    const n = el('div', null, { position: 'absolute', left: (110 + i * 500) + 'px', top: '805px', fontSize: '56px', fontWeight: '900', color: C.orange, textShadow: '3px 3px 0 #141414' }, null, '0%'); return { k, n, v }; });
  const fn = chipAt('glitched_겨울바다.png', 110, 805, { fontFamily: '"DejaVu Sans Mono", monospace', fontSize: '30px', padding: '12px 24px' });
  const og = chipAt('겨울바다.png (원본) 그대로', 640, 805, { fontSize: '30px', padding: '12px 24px' });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const a = popIn(t, c[0] - .1, .5); tf(tm.el, 0, (1 - a) * -200, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c[0] + .3, text: 'glitch_this 겨울바다.png 5', dur: 1.3 }, { at: c[0] + 1.8, kind: 'out', text: 'Glitched Image saved in "glitched_겨울바다.png"' }]);
    const hide = 1 - eIO(P(t, c[2] - .2, c[2] + .2));
    L.forEach((u, i) => { dropIn(u.k.b, t, c[0] + 2.4 + i * .6, -500, i % 2 ? 3 : -3); u.n.style.opacity = fadeIn(t, c[1] + .2 + i * .9) * hide; count(u.n, t, c[1] + .2 + i * .9, RES.levels[u.v].changed_pct, 1.0, v => v.toFixed(1) + '%'); });
    chipIn(fn, t, c[2] + .2); chipIn(og, t, c[2] + 1.2);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 3.0, a: 'look' }, { at: c[1] + 2.4, a: 'nod' }, { at: c[2] + 1.4, a: 'happy' }]);
  };
};
// ---- 04 시연 ②: 색 어긋남(확대) → 줄무늬 + 밝기 막대 161 → 81 → 씨앗 번호: 같은 그림 두 장 = ----
SCENES.demo2 = S => {
  const c = [0, 1, 2].map(S.cue);
  const caps = capsOf(S, [[['-c'], ['*색 어긋남*']], [['-s', '줄무늬'], ['밝기', '*절반*']], [['-sd', '씨앗', '번호'], ['같은', '번호', '=', '*같은 결과*']]]);
  const co = pic(110, 330, 720, 420, 'png', '-c 색 어긋남', 'img/color.png', { fs: 24 });
  const zoom = box(110, 770, 720, 150, 'card', { padding: '0', overflow: 'hidden' });
  const zi = el('img', null, { position: 'absolute', left: '-60px', top: '-135px', width: '2000px' }, zoom); zi.src = 'img/color.png';
  const sc = pic(880, 330, 720, 420, 'png', '-s 줄무늬', 'img/scan.png', { fs: 24 });
  const br = box(880, 770, 720, 150, 'card', { padding: '22px 30px' });
  el('div', null, { fontSize: '26px', fontWeight: '800', color: '#666' }, br, '평균 밝기 (0~255)');
  const bo = el('div', null, { position: 'absolute', left: '30px', top: '70px', height: '24px', width: (600 * RES.scan.bright_orig / 255) + 'px', background: '#F5C26B', border: '3px solid #141414', borderRadius: '8px' }, br);
  const bs = el('div', null, { position: 'absolute', left: '30px', top: '104px', height: '24px', width: '0', background: '#444', border: '3px solid #141414', borderRadius: '8px' }, br);
  const bn = el('div', null, { position: 'absolute', right: '26px', top: '64px', fontSize: '40px', fontWeight: '900', color: C.red }, br, `${RES.scan.bright_orig} → ${RES.scan.bright}`);
  const sd = box(110, 330, 1490, 590, 'card', { padding: '30px', display: 'flex', alignItems: 'center', gap: '30px' });
  const s1 = el('img', null, { width: '620px', border: '4px solid #141414', borderRadius: '12px' }, sd); s1.src = 'img/lv5.png';
  el('div', null, { fontSize: '120px', fontWeight: '900', color: C.green }, sd, '=');
  const s2 = el('img', null, { width: '620px', border: '4px solid #141414', borderRadius: '12px' }, sd); s2.src = 'img/lv5.png';
  const sdc = chipAt('-sd 42 로 두 번 → 같은 파일 · 번호 없으면 매번 다름', 110, 860, { fontSize: '28px', background: C.ink, color: '#fff' });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const out = 1 - eIO(P(t, c[2] - .3, c[2] + .1));
    slideIn(co.b, t, c[0] - .05, -500, out); const z = popIn(t, c[0] + 1.2, .5); tf(zoom, 0, (1 - z) * 40, 1, 0, z > 0 ? out : 0);
    slideIn(sc.b, t, c[1] - .05, 500, out); const b = popIn(t, c[1] + .6, .4); tf(br, 0, (1 - b) * 40, 1, 0, b > 0 ? out : 0);
    bs.style.width = (600 * RES.scan.bright / 255 * eOut(P(t, c[1] + 1.2, c[1] + 2.2))) + 'px'; bn.style.opacity = fadeIn(t, c[1] + 2.2);
    const s = popIn(t, c[2] + .1, .5); tf(sd, 0, (1 - s) * 400, 1, 0, s > 0 ? 1 : 0); chipIn(sdc, t, c[2] + 1.6);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 1.6, a: 'look' }, { at: c[1] + 2.2, a: 'oops' }, { at: c[2] + 1.6, a: 'nod' }]);
  };
};
// ---- 05 시연 ③: GIF 가 실제로 움직임 + 장 수 카운트 23 + 1.41초 도장 → -fr/-d 칩 → 씨앗+GIF = 1장 경고 → -ig ----
SCENES.demo3 = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['-g', '→'], ['*GIF ' + RES.gif.frames + '장*', GIFS + '초']], [['장', '수', '·'], ['*한 장 시간*', '바꾸기']], [['씨앗', '번호와', '함께면'], ['*1장짜리*']], [['움직이는', 'GIF도'], ['*-ig*', '로']]]);
  const gf = pic(110, 330, 900, 560, 'gif', `움직임.gif · ${RES.gif.kb}KB`, GF[0]);
  const cnt = el('div', null, { position: 'absolute', left: '1050px', top: '330px', fontSize: '120px', fontWeight: '900', color: C.orange, textShadow: '5px 5px 0 #141414' }, null, '0장');
  const st = stamp(GIFS + '초', 1430, 420, 52);
  const op = chipAt(`-fr 10 -d 100 → ${RES.gif_short.frames}장 · 한 장 ${RES.gif_short.duration_ms / 1000}초`, 1050, 600, { fontSize: '28px', fontFamily: '"DejaVu Sans Mono", monospace' });
  const wr = box(1050, 680, 550, 120, 'card', { padding: '14px 24px', border: `4px solid ${C.red}` });
  el('div', 'mono', { fontSize: '26px', fontWeight: '900', color: C.red }, wr, '-g + -sd 42');
  el('div', null, { fontSize: '28px', fontWeight: '900' }, wr, `→ ${RES.gif_seed.frames}장짜리 (움직이지 않음)`);
  const ig = chipAt(`움짤.gif ${RES.gif_in.src_frames}장 → -ig → ${RES.gif_in.frames}장 모두 효과`, 1050, 830, { fontSize: '27px' });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(gf.b, t, c[0] - .1, -500, -2); playGif(gf, t, c[0] + .4);
    cnt.style.opacity = fadeIn(t, c[0] + .4); count(cnt, t, c[0] + .4, RES.gif.frames, 1.6, v => Math.round(v) + '장'); st.render(t, c[0] + 2.2);
    chipIn(op, t, c[1] + .3); slideIn(wr, t, c[2] + .2, 500); chipIn(ig, t, c[3] + .3);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 2.2 - .35, a: 'stamp' }, { at: c[2] + .6, a: 'oops' }, { at: c[3] + .8, a: 'nod' }]);
  };
};
// ---- 06 시연 ④: 포스터 원본 ↔ 결과 → 촬영 정보(EXIF) 2 → 0 (줄 긋기) → 확장자 칩 ----
SCENES.demo4 = S => {
  const c = [0, 1, 2].map(S.cue);
  const caps = capsOf(S, [[['가상', '포스터', 'JPG'], ['→', '*' + f2(RES.jpg.sec) + '초*']], [['촬영', '정보(EXIF)'], ['*남지 않음*']], [['-o', '이름.jpg', '라도'], ['형식은', '*원본 따라감*']]]);
  const po = pic(110, 330, 440, 590, 'jpg', '포스터.jpg', 'img/poster-orig.jpg');
  const ar = arrow(565, 620, 640, 620, 20);
  const pr = pic(655, 330, 440, 590, 'jpg', '포스터결과.jpg', 'img/poster.jpg');
  const ex = box(1140, 330, 460, 300, 'card', { padding: '26px 30px' });
  el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, ex, '촬영 정보(EXIF) 항목');
  const en = el('div', null, { fontSize: '96px', fontWeight: '900', lineHeight: '1.25' }, ex, `${RES.jpg.src_exif} → <span style="color:${C.red}">${RES.jpg.out_exif}</span>`);
  el('div', null, { fontSize: '22px', fontWeight: '700', color: '#666' }, ex, '가상 값: 카메라 이름 · 찍은 시각');
  const xt = box(1140, 660, 460, 260, 'card', { padding: '22px 28px' });
  el('div', 'mono', { fontSize: '24px', fontWeight: '800', whiteSpace: 'nowrap' }, xt, 'glitch_this 겨울바다.png 5<br>-o 바꿈.jpg');
  el('div', null, { fontSize: '30px', fontWeight: '900', marginTop: '14px' }, xt, `→ 생긴 파일: <span class="mono" style="color:${C.orange}">${RES.ext_ignored.files[0]}</span>`);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(po.b, t, c[0] - .1, -500, -2); ar.set(eOut(P(t, c[0] + 1.0, c[0] + 1.5))); slideIn(pr.b, t, c[0] + 1.3, 500);
    const e = popIn(t, c[1] + .1, .5); tf(ex, 0, (1 - e) * 300, 1, 0, e > 0 ? 1 : 0); en.style.transform = `scale(${.6 + .4 * popIn(t, c[1] + .5, .5)})`;
    slideIn(xt, t, c[2] + .2, 500);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 1.8, a: 'look' }, { at: c[1] + .8, a: 'nod' }, { at: c[2] + 1.2, a: 'point', dir: 'left' }]);
  };
};
// ---- 07 시연 ⑤: 큰 그림 한 장 0.44초 vs GIF 10장 11.59초 (막대) → 그림 20칸이 차례로 바뀜 3.9초 ----
SCENES.demo5 = S => {
  const c = [0, 1, 2].map(S.cue);
  const caps = capsOf(S, [[['1,200만', '화소'], ['한', '장', '*' + f2(RES.big.sec) + '초*']], [['같은', '그림', 'GIF', '10장은'], ['*' + f2(RES.big_gif.sec) + '초*']], [['그림', '20장'], ['하나씩', '*' + RES.batch20.sec + '초*']]]);
  const cmp = box(110, 330, 880, 590, 'card', { padding: '34px' });
  el('div', null, { fontSize: '30px', fontWeight: '800', color: '#666' }, cmp, '4000×3000 큰 그림 · 걸린 시간');
  const MX = RES.big_gif.sec;
  const rows = [['한 장 (-c -s)', RES.big.sec, C.green], [`GIF ${RES.big_gif.frames}장 (-g)`, RES.big_gif.sec, C.red]].map((r, i) => {
    el('div', null, { position: 'absolute', left: '34px', top: (110 + i * 200) + 'px', fontSize: '34px', fontWeight: '900' }, cmp, r[0]);
    const b = el('div', null, { position: 'absolute', left: '34px', top: (165 + i * 200) + 'px', height: '60px', width: '0', background: r[2], border: '4px solid #141414', borderRadius: '12px' }, cmp);
    const n = el('div', null, { position: 'absolute', left: '34px', top: (240 + i * 200) + 'px', fontSize: '36px', fontWeight: '900', color: r[2] }, cmp, ''); return { b, n, v: r[1] }; });
  const gd = box(1030, 330, 570, 590, 'card', { padding: '26px' });
  const tiles = Array.from({ length: 20 }, (_, i) => { const e = el('div', null, { position: 'absolute', left: (26 + (i % 4) * 132) + 'px', top: (26 + Math.floor(i / 4) * 92) + 'px', width: '120px', height: '80px', borderRadius: '8px', border: '3px solid #141414', overflow: 'hidden' }, gd);
    const im = el('img', null, { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }, e); im.src = 'img/orig.png'; return im; });
  const n20 = el('div', null, { position: 'absolute', left: '26px', top: '500px', fontSize: '40px', fontWeight: '900' }, gd, '');
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(cmp, t, c[0] - .1, 500);
    rows.forEach((r, i) => { const at = i ? c[1] + .2 : c[0] + .6; const k = eOut(P(t, at, at + (i ? 2.2 : .5))); r.b.style.width = Math.max(8, 800 * r.v / MX * k) + 'px'; r.n.textContent = t > at ? (r.v * k).toFixed(2) + '초' : ''; });
    dropIn(gd, t, c[2] - .1, -500); const k = P(t, c[2] + .5, c[2] + 2.5);
    tiles.forEach((e, i) => { const s = i / 20 < k ? 'img/lv5.png' : 'img/orig.png'; if (!e.src.endsWith(s)) e.src = s; });
    n20.textContent = t > c[2] ? Math.round(k * 20) + ' / 20장 · ' + RES.batch20.sec + '초' : '';
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 1.4, a: 'nod' }, { at: c[1] + 2.4, a: 'oops' }, { at: c[2] + 2.6, a: 'happy' }]);
  };
};
// ---- 08 옵션: 옵션 카드(0.8초 간격) 3줄 ----
SCENES.opts = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['자주', '쓰는'], ['*옵션*', '모음']], [['세기', '·', '*-c*', '·'], ['*-s*']], [['*-g*', 'GIF', '·', '장', '수'], ['한', '장', '시간']], [['*-sd*', '씨앗', '·'], ['*-o*', '이름', '·', '*-f*']]]);
  const O = [[['숫자 0.1~10', '망가뜨리는 세기'], ['-c', '한 색 어긋남'], ['-s', '줄무늬 (어두워짐)']], [['-g', 'GIF 로 만들기'], ['-fr 23', '장 수'], ['-d 200', '한 장 시간(밀리초)'], ['-ig', 'GIF 넣기']], [['-sd 42', '씨앗 번호'], ['-o 결과.png', '결과 이름'], ['-f', '덮어쓰기 허락']]];
  const cards = O.map((row, r) => row.map((o, i) => { const w = row.length === 4 ? 355 : 475; const b = box(110 + i * (w + 20), 340 + r * 195, w, 175, 'card', { padding: '20px 24px' });
    el('div', 'mono', { fontSize: '32px', fontWeight: '900', color: C.orange, whiteSpace: 'nowrap' }, b, M.esc(o[0])); el('div', null, { fontSize: '28px', fontWeight: '800' }, b, o[1]); return { b, r, i }; })).flat();
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach(k => { const at = c[k.r + 1] + .1 + k.i * .8; const a = popIn(t, at, .45); tf(k.b, 0, (1 - a) * 200, 1, 0, a > 0 ? Math.min(1, a * 2) : 0); });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'point', dir: 'left' }, { at: c[2] + 2.0, a: 'nod' }, { at: c[3] + 1.8, a: 'happy' }]);
  };
};
// ---- 09 쓸 곳: 그림 카드 3장(0.8초 간격) + 카드마다 예시 한 줄 ----
SCENES.uses = S => {
  const c = [0, 1, 2].map(S.cue);
  const caps = capsOf(S, [[['①', '썸네일', '·'], ['*포스터 효과*']], [['②', '프로필', '·', '메신저'], ['*움직이는 그림*']], [['③', '파이썬', '코드로'], ['*다른 프로그램에*']]]);
  const U = [['image', '썸네일 · 포스터', 'img/poster.jpg', 'glitch_this 포스터.jpg 6 -c'], ['person', '프로필 · 메신저', GF[3], 'glitch_this 사진.png 4 -g -c'], ['term', '파이썬 코드', 'img/both.png', 'G().glitch_image(…, 5)']];
  const cards = U.map((u, i) => { const b = box(110 + i * 500, 340, 460, 580, 'card', { padding: '26px' });
    const hd = el('div', null, { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }, b, iconTile(u[0], 72)); el('div', null, { fontSize: '38px', fontWeight: '900', whiteSpace: 'nowrap' }, hd, u[1]);
    const im = el('img', null, { width: '100%', height: '250px', objectFit: 'cover', border: '3px solid #141414', borderRadius: '12px', display: 'block', marginBottom: '22px' }, b); im.src = u[2];
    const ln = el('div', 'mono', { background: '#F4EFE6', border: '3px dashed #c9bd9c', borderRadius: '14px', padding: '16px', fontSize: '22px', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden' }, b, M.esc(u[3])); return { b, ln, im }; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((k, i) => { dropIn(k.b, t, c[i] - .05, 500, i % 2 ? 5 : -5); const a = P(t, c[i] + .6, c[i] + 1.4); k.ln.style.clipPath = `inset(0 ${100 - a * 100}% 0 0)`; });
    playGif({ img: cards[1].im }, t, c[1] + .3);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 1.2, a: 'point', dir: 'left' }, { at: c[1] + 1.2, a: 'nod' }, { at: c[2] + 1.8, a: 'happy' }]);
  };
};
// ---- 10 아쉬운 점: 카드 4장 + 빨간 펜 동그라미(① 파이썬) + 밑줄(④) ----
SCENES.cons = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['아쉬운', '점도'], ['*짚어*', '보겠습니다']], [['①', '*파이썬*', '먼저'], ['명령어', '도구']], [['②', '효과는'], ['*세 가지뿐*']], [['③', '마지막', '수정'], ['*2024년*']], [['④', '도움말과'], ['*단위가 다름*']]]);
  const K = [['파이썬을 먼저 설치 · 버튼·창 없는 명령어 도구', 'Windows: winget install Python.Python.3.13 → py -m pip install glitch-this'], ['효과는 띠 밀기 · 색 어긋남 · 줄무늬 세 가지', '어느 부분을 망가뜨릴지 고를 수 없음 · 줄무늬를 켜면 밝기가 절반'],
    ['마지막 수정 2024년 · 실행 때 PyPI 에 최신 버전 확인', '확인 결과는 14일 동안 기억 · 인터넷이 끊겨도 그림은 만들어짐(시연)'], ['도움말: -d 는 1/100초 → 실제 GIF 는 밀리초', `기본 200 = 한 장 ${RES.gif.duration_ms / 1000}초 · 씨앗 번호와 -g 를 같이 쓰면 1장짜리`]];
  const cards = K.map((k, i) => { const b = box(110, 330 + i * 150, 1480, 132, 'card', { display: 'flex', alignItems: 'center', gap: '26px', padding: '0 30px' });
    el('div', null, { minWidth: '68px', height: '68px', borderRadius: '16px', background: C.red, color: '#fff', fontWeight: '900', fontSize: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, b, String(i + 1));
    const tx = el('div', null, {}, b); const h = el('div', null, { fontSize: '34px', fontWeight: '900', whiteSpace: 'nowrap' }, tx, M.esc(k[0])); el('div', null, { fontSize: '25px', fontWeight: '700', color: '#666' }, tx, M.esc(k[1])); return { b, h }; });
  const r0 = cards[0].h.getBoundingClientRect(), r3 = cards[3].h.getBoundingClientRect();
  const ring = pen(ellipsePath(r0.left + 135, (r0.top + r0.bottom) / 2 + 2, 165, r0.height / 2 + 16), 6);
  const ul = pen(`M${r3.left - 6} ${r3.bottom + 2} C ${r3.left + r3.width * .4} ${r3.bottom - 4}, ${r3.left + r3.width * .7} ${r3.bottom + 6}, ${r3.right + 8} ${r3.bottom}`, 6);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((k, i) => slideIn(k.b, t, c[i + 1] - .1, -500));
    ring.set(eOut(P(t, c[1] + .6, c[1] + 1.3))); ul.set(eOut(P(t, c[4] + .6, c[4] + 1.2)));
    nb.render(t, [{ at: c[1] + .4, a: 'enter' }, { at: c[1] + .6, a: 'pen' }, { at: c[3] + .5, a: 'oops' }, { at: c[4] + .6, a: 'pen' }]);
  };
};
// ---- 정리: 체크리스트 3줄(✓가 하나씩) ----
SCENES.summary = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['오늘', '내용', '*정리*']], [['glitch-this', '='], ['*일부러 고장 낸 TV*']], [['그림', ONE + '초,'], ['GIF', RES.gif.frames + '장', '*' + GIFS + '초*']], [['파이썬', '먼저,'], ['줄무늬는', '*어두워짐*']]]);
  const L = ['glitch-this = 일부러 고장 낸 텔레비전 (세기 0.1~10)', `그림 한 장 ${ONE}초 · GIF ${RES.gif.frames}장 ${GIFS}초 · 원본은 그대로`, '파이썬 먼저 · 효과 3가지 · 줄무늬는 밝기 절반'];
  const cd = box(110, 340, 1480, 540, 'card', { padding: '40px 50px' });
  const rows = L.map((s, i) => { const r = el('div', null, { display: 'flex', alignItems: 'center', gap: '30px', height: '150px', borderBottom: i < 2 ? '3px dashed #ddd' : 'none' }, cd);
    const b = el('div', null, { minWidth: '76px', height: '76px', border: '5px solid #141414', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '58px', fontWeight: '900', color: C.green }, r, '');
    el('div', null, { fontSize: '40px', fontWeight: '900', whiteSpace: 'nowrap' }, r, M.esc(s)); return { r, b }; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(cd, t, c[0] + .2, 400);
    rows.forEach((k, i) => { k.r.style.opacity = fadeIn(t, c[i + 1] - .1); const on = t > c[i + 1] + .5; k.b.textContent = on ? '✓' : ''; k.b.style.transform = `scale(${on ? popIn(t, c[i + 1] + .5, .4) : 1})`; });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'nod' }, { at: c[2] + 1.0, a: 'nod' }, { at: c[3] + 1.8, a: 'happy' }]);
  };
};
// ---- 엔딩 (유의사항 2줄) ----
SCENES.end = S => ending(S, { name: 'glitch-this · 일부러 고장 낸 TV', lines: [['다음에 또 멋진'], ['*오픈소스*', '소개하겠습니다!']], disclaimer: DISCLAIMER });

// ======================= 숏폼 · 과정 애니메이션 (세로 1080×1920 / 가로 1920×1080 둘 다) =======================
const NBX = S => S.V ? M.buddy(770, 168, .62) : M.buddy(1636, 548, .62);
const LY = S => S.V ? { x: 70, w: 940, y: 520 } : { x: 110, w: 1480, y: 340 };
SCENES.s_hook = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['멀쩡한', '그림을'], ['*고장 난 TV*처럼?']], { size: S.V ? 80 : 78 });
  const k = pic(L.x, S.V ? 560 : 340, S.V ? L.w : 1000, S.V ? 560 : 580, 'png', '겨울바다.png', 'img/orig.png');
  const nb = NBX(S);
  return t => {
    cap.render(t); dropIn(k.b, t, c0 + .3, -500, -3);
    const g = t > c0 + 2.2 && Math.floor(t * 5) % 2 ? 'img/lv10.png' : 'img/orig.png'; if (!k.img.src.endsWith(g)) k.img.src = g;
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.4, a: 'look' }, { at: c0 + 3.0, a: 'oops' }]);
  };
};
SCENES.s_what = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['*glitch-this*'], ['그림', '망가뜨리기']]), caption(c1 - .1, null, [['명령', '한', '줄', '→'], ['*' + ONE + '초*']])];
  const tm = term(L.x, L.y, S.V ? L.w : 860, S.V ? 200 : 220, { fs: 32 });
  const k = pic(S.V ? L.x : 1010, S.V ? 760 : 340, S.V ? L.w : 590, S.V ? 560 : 400, 'png', 'glitched_겨울바다.png', 'img/lv5.png', { fs: S.V ? 26 : 22 });
  const st = stamp(ONE + '초', S.V ? 640 : 1300, S.V ? 1300 : 760, 64);
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t)); const a = popIn(t, c0 + .2, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c0 + .7, text: 'glitch_this 겨울바다.png 5', dur: 1.6 }]);
    slideIn(k.b, t, c1 + .2, 500); st.render(t, c1 + 1.4);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.0, a: 'point', dir: 'left' }, { at: c1 + 1.4 - .35, a: 'stamp' }]);
  };
};
SCENES.s_conv = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['*-c*', '색', '·'], ['*-s*', '줄무늬']]), caption(c1 - .1, null, [['GIF', '*' + RES.gif.frames + '장*'], [GIFS + '초']])];
  const W = S.V ? 455 : 700, H = S.V ? 300 : 400;
  const a = pic(L.x, S.V ? 520 : 340, W, H, 'png', '-c', 'img/color.png', { fs: 22 });
  const b = pic(S.V ? 555 : 830, S.V ? 520 : 340, W, H, 'png', '-s', 'img/scan.png', { fs: 22 });
  const g = pic(L.x, S.V ? 860 : 340, S.V ? L.w : 1000, S.V ? 560 : 580, 'gif', `움직임.gif (${RES.gif.frames}장)`, GF[0]);
  const st = stamp(GIFS + '초', S.V ? 640 : 1300, S.V ? 1380 : 760, 60);
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t));
    const out = S.V ? 1 : 1 - eIO(P(t, c1 - .3, c1));
    dropIn(a.b, t, c0 + .2, -500, -3); dropIn(b.b, t, c0 + 1.0, -500, 3); [a, b].forEach(k => k.b.style.opacity = Math.min(+k.b.style.opacity || 0, out));
    const k = popIn(t, c1 - .1, .5); tf(g.b, 0, (1 - k) * 500, 1, 0, k > 0 ? 1 : 0); playGif(g, t, c1 + .2); st.render(t, c1 + 1.8);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.8, a: 'look' }, { at: c1 + 1.8 - .35, a: 'stamp' }]);
  };
};
SCENES.s_limit = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['*파이썬*', '먼저,'], ['줄무늬는', '어두워짐']]);
  const pills = [['✗ 파이썬을 먼저 설치해야 함', false], [`✗ -s 줄무늬: 밝기 ${RES.scan.bright_orig} → ${RES.scan.bright}`, false], ['✓ 원본은 그대로 · 새 파일로 저장', true]]
    .map((p, i) => { const e = pill(p[0], p[1], L.x, (S.V ? 560 : 360) + i * (S.V ? 110 : 100), S.V ? L.w : 900, S.V ? 80 : 74); e.style.fontSize = S.V ? '34px' : '32px'; return e; });
  const sc = pic(S.V ? L.x : 1060, S.V ? 920 : 360, S.V ? L.w : 540, S.V ? 520 : 330, 'png', '-s 줄무늬', 'img/scan.png', { fs: 24 });
  const nb = NBX(S);
  return t => {
    cap.render(t); pills.forEach((p, i) => pillRender(p, t, c0 + .4 + i * .9, i === 2)); slideIn(sc.b, t, c0 + 1.4, 500);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + .8, a: 'oops' }, { at: c0 + 2.6, a: 'nod' }]);
  };
};
SCENES.s_end = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['설치는'], ['*명령 한 줄*']]);
  const tm = term(L.x, S.V ? 560 : 360, S.V ? L.w : 880, S.V ? 250 : 220, { fs: S.V ? 32 : 30 });
  const nb = NBX(S); const rc = box(S.V ? L.x : 1060, S.V ? 860 : 360, S.V ? L.w : 540, 300, 'card', { padding: '34px 40px' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, rc, '일반인 쓸모 별점'); const sr = stars(40, 100, S.V ? 112 : 78, 3, 5, rc); half(sr, 7);
  return t => { cap.render(t); const a = popIn(t, c0, .5); tf(tm.el, 0, (1 - a) * 200, 1, 0, a > 0 ? 1 : 0); tm.render(t, [{ at: c0 + .4, text: 'py -m pip install glitch-this', dur: 1.4 }]);
    const b = popIn(t, c0 + 1.6, .5); tf(rc, 0, (1 - b) * 200, 1, 0, b > 0 ? 1 : 0); sr.render(t, c0 + 2.0);
    nb.render(t, [{ at: c0 + .2, a: 'enter' }, { at: c0 + .7, a: 'point', dir: 'left' }, { at: c0 + 2.6, a: 'happy' }]); };
};
