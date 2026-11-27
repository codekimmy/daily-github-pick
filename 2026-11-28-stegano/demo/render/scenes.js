// Stegano (2026-11-28 픽, 2026-11-28 시연) 모션 장면 — tools/motion 키트 (GUIDE 5-4)
// 숫자: data.js 의 RES (= demo/results.json 시연 측정값)만 씀. 그림은 코드로 그린 가상 그림, 쪽지는 가상 쪽지(demo/mksample.py)
// img/* = Stegano 3.0.0 이 실제로 만든 결과 그림 (bench.py 가 복사: secret = 쪽지를 숨긴 그림, parity-* = 검사 그림, zoom-* = 맨 위 32×6 화소 확대)
// 시간: 모두 S.cue(i)(자막 i 의 시작 초) 기준 → 음성 길이에 맞춰 구간이 바뀌어도 그대로 따라감
// 롱폼 14개 장 + 숏폼 5장면 모두 직접 만듦 (기본 장면 없음), end 를 뺀 모든 장·장면에 냥봇(2~4번 반응)
// 비유 하나: '투명 잉크 편지' — 눈에 안 보이게 쓰고, 꺼내기 명령(불)에 나타나고, 누구나 읽을 수 있고, 물(JPG)에 젖으면 지워짐
const { C, P, eOut, eIO, lerp, popIn, shake, el, box, tf, caption, stamp, hand, pen, ellipsePath, arrowPath, count, term, pill, pillRender, stars, iconTile, ending } = M;
const DISCLAIMER = ['정보 제공용 · 2026-11-28 클라우드 시연 결과(운영자 직접 검증 아님) · 그림·쪽지는 가상 자료',
  '숨기기일 뿐 암호화 아님 · 비밀번호·개인정보는 넣지 말 것 · JPG로 바꾸면 쪽지가 사라짐'];
const STARS = 594;                                    // GitHub 별 (2026-11-28 검색 API 확인)
const f2 = v => Number(v).toFixed(2);
const HIDE = f2(RES.hide.sec), SHOW = f2(RES.reveal.sec), MSG = RES.hide.msg;
const NOTE = '엄마 생신 깜짝 파티: 12월 5일 저녁 7시';   // demo.sh·화면용 짧은 쪽지 (실제 측정 쪽지 = MSG)
const NOPE = 'Impossible to detect message.';
const SCENES = {};

// ---------- 공통 도우미 ----------
const capsOf = (S, arr) => arr.map((L, i) => caption(S.cue(i) - .1, i < arr.length - 1 ? S.cue(i + 1) - .25 : null, L));
const NB = () => M.buddy(1636, 548, .62);
const fadeIn = (t, a, d = .5) => Math.min(1, popIn(t, a, d) * 2);
const dropIn = (e, t, a, dy = -500, r = 0, o = 1) => { const k = popIn(t, a, .55); tf(e, 0, (1 - k) * dy, 1, (1 - k) * r, k > 0 ? o : 0); return k; };
const slideIn = (e, t, a, dx = -300, o = 1) => { const k = popIn(t, a, .5); tf(e, (1 - k) * dx, 0, 1, 0, k > 0 ? Math.min(1, k * 2) * o : 0); return k; };
const FMT = { png: ['PNG', '#7C3AED'], jpg: ['JPG', '#0E7490'], txt: ['TXT', '#475569'] };
// 그림 카드: 위 색 띠(형식 + 파일 이름) + 몸통(실제 결과 그림)
function pic(x, y, w, h, kind, name, src, o = {}) {
  const [lab, col] = FMT[kind];
  const b = box(x, y, w, h, 'card', { padding: '0', overflow: 'hidden' }, o.par);
  el('div', null, { background: col, color: '#fff', fontWeight: '900', fontSize: (o.fs || 26) + 'px', padding: '8px 20px', display: 'flex', gap: '14px', alignItems: 'center', whiteSpace: 'nowrap' }, b,
    `<span style="background:#fff;color:${col};border-radius:8px;padding:0 10px">${lab}</span><span>${M.esc(name)}</span>`);
  const body = el('div', null, { position: 'absolute', left: '0', right: '0', top: (o.fs || 26) + 26 + 'px', bottom: '0', overflow: 'hidden', background: o.bg || '#222' }, b);
  const img = el('img', null, { width: '100%', height: '100%', display: 'block', objectFit: o.fit || 'cover', objectPosition: o.pos || 'center', imageRendering: o.pix ? 'pixelated' : 'auto' }, body); if (src) img.src = src;
  return { b, body, img };
}
// 쪽지 카드: 노란 메모지 + 손으로 쓴 듯한 글
function note(x, y, w, h, text, o = {}) {
  const b = box(x, y, w, h, 'card', { padding: '26px 30px', background: '#FFF6C9' }, o.par);
  el('div', null, { fontSize: (o.hs || 26) + 'px', fontWeight: '800', color: '#9A7B1C', marginBottom: '10px' }, b, o.head || '📝 가상 쪽지');
  const tx = el('div', null, { fontSize: (o.fs || 36) + 'px', fontWeight: '900', lineHeight: '1.35', whiteSpace: 'pre-wrap' }, b, M.esc(text));
  return { b, tx };
}
const arrow = (x1, y1, x2, y2, b = 30) => pen(arrowPath(x1, y1, x2, y2, b), 7, C.orange);
const chipAt = (s, x, y, css = {}) => el('div', 'chip', Object.assign({ left: x + 'px', top: y + 'px', fontSize: '27px' }, css), null, s);
const chipIn = (e, t, a, o = 1) => { const k = popIn(t, a, .45); tf(e, 0, (1 - k) * 30, k, 0, k > 0 ? o : 0); };
const half = (sr, i) => { const k = sr.el.children[i]; if (k) k.style.clipPath = 'inset(0 50% 0 0)'; };   // 2.5개: 3번째 채운 별을 반만
// 투명 잉크: 글자가 왼쪽부터 드러남 (k: 0~1)
const ink = (e, k) => { e.style.clipPath = `inset(-10% ${100 - k * 100}% -10% -2%)`; e.style.opacity = k > 0 ? 1 : 0; };
// 색 번호 칸: 빨강·초록·파랑 숫자 3개 (끝 숫자가 바뀌는 연출용)
function rgbBox(x, y, vals, o = {}) {
  const b = box(x, y, o.w || 520, o.h || 150, 'card', { padding: '18px 22px', display: 'flex', gap: '16px', alignItems: 'center' }, o.par);
  const cells = vals.map((v, i) => { const c = el('div', null, { flex: '1', height: '100%', borderRadius: '14px', border: '4px solid #141414', background: ['#FFD6D6', '#D6F5DE', '#D6E4FF'][i], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }, b);
    el('div', null, { fontSize: '22px', fontWeight: '800', color: '#555' }, c, ['빨강', '초록', '파랑'][i]);
    const n = el('div', 'mono', { fontSize: (o.fs || 52) + 'px', fontWeight: '900' }, c, String(v)); return n; });
  return { b, cells };
}

// ======================= 롱폼 (1920×1080) =======================
// ---- 미리보기: 평범한 그림 → 숨기기 명령 + 비밀.png + 0.22초 도장 → 꺼내기 명령 → 쪽지가 투명 잉크처럼 드러남 ----
SCENES.preview = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2);
  const caps = [caption(c0 - .1, c1 - .3, [['평범해', '보이는'], ['*그림*', '한', '장']]),
    caption(c1 - .1, c2 - .3, [['그림', '속에'], ['*쪽지*가', '숨어', '있음']]),
    caption(c2 - .06, null, [['꺼내기', '한', '줄', '→'], ['*쪽지*', '그대로', SHOW + '초']])];
  const og = pic(110, 330, 760, 450, 'png', '가을산책.png', 'img/orig.png');
  const sc = pic(110, 330, 760, 450, 'png', '비밀.png (쪽지 숨김)', 'img/secret.png');
  const st = stamp(HIDE + '초', 620, 760, 52);
  const tm = term(920, 330, 680, 260, { fs: 25 });
  const nt = note(920, 620, 680, 290, NOTE.replace(': ', '\n'), { fs: 40 });
  const nb = NB();
  return t => {
    caps.forEach(c => c.render(t));
    dropIn(og.b, t, c0 - .1, -500, -3, 1 - eIO(P(t, c1 + 1.6, c1 + 2.0)));
    const s = popIn(t, c1 + 1.6, .5); tf(sc.b, 0, 0, .94 + .06 * s, 0, s > 0 ? 1 : 0); st.render(t, c1 + 2.4);
    const a = popIn(t, c1 - .2, .5); tf(tm.el, 0, (1 - a) * 200, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c1 + .1, text: 'stegano-lsb hide -i 가을산책.png -m "…" -o 비밀.png', dur: 1.4 }, { at: c2 + .1, text: 'stegano-lsb reveal -i 비밀.png', dur: 1.0 }]);
    const n = popIn(t, c2 + 1.0, .5); tf(nt.b, 0, (1 - n) * 120, 1, 0, n > 0 ? 1 : 0); ink(nt.tx, eOut(P(t, c2 + 1.3, c2 + 3.0)));
    nb.render(t, [{ at: c0 + .5, a: 'enter' }, { at: c1 + .6, a: 'look' }, { at: c1 + 2.4 - .35, a: 'stamp' }, { at: c2 + 2.6, a: 'happy' }]);
  };
};
// ---- 타이틀: 'Stegano.' 글자가 투명 잉크처럼 드러남 + 별 594 카운트 → 별점 2.5/5 → hide → reveal 두 단계 카드 + '무료' 도장 ----
SCENES.title = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2);
  const tag = el('div', 'chip', { left: '110px', top: '200px', background: C.ink, color: '#fff', fontSize: '30px' }, null, '오늘의 오픈소스 · 2026.11.28');
  const word = el('div', null, { position: 'absolute', left: '100px', top: '260px', fontSize: '190px', fontWeight: '900', letterSpacing: '-7px', lineHeight: '1', transformOrigin: 'left top', whiteSpace: 'nowrap' }, null, 'Stegano<span style="color:#FF5A1F">.</span>');
  const chips = [['github.com/cedricbonhomme/Stegano', 110, 'mono'], ['★ 0', 860, ''], ['GPL-3.0 · 무료', 1050, '']].map(c => el('div', 'chip ' + c[2], { left: c[1] + 'px', top: '540px', fontSize: '25px' }, null, c[0]));
  const rc = box(1000, 190, 600, 330, 'card', { padding: '34px 40px', transformOrigin: 'right top' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, rc, '일반인 쓸모 별점');
  const sr = stars(40, 100, 90, 3, 5, rc); half(sr, 7);
  const score = el('div', null, { position: 'absolute', left: '40px', top: '220px', fontSize: '60px', fontWeight: '900', transformOrigin: 'left center' }, rc, '2.5 <span style="color:#999;font-size:40px">/ 5</span>');
  const fl = box(110, 650, 1150, 250, 'card', { padding: '30px 40px', display: 'flex', alignItems: 'center', gap: '30px' });
  const st1 = el('div', null, { fontSize: '40px', fontWeight: '900', whiteSpace: 'nowrap' }, fl, '<span class="mono" style="color:#FF5A1F">hide</span> 숨기기');
  const ar1 = el('div', null, { fontSize: '70px', fontWeight: '900', color: C.orange }, fl, '→');
  const mid = el('div', null, { fontSize: '36px', fontWeight: '900', whiteSpace: 'nowrap', padding: '10px 20px', border: '4px dashed #141414', borderRadius: '16px' }, fl, '똑같아 보이는 그림');
  const ar2 = el('div', null, { fontSize: '70px', fontWeight: '900', color: C.orange }, fl, '→');
  const st2 = el('div', null, { fontSize: '40px', fontWeight: '900', whiteSpace: 'nowrap' }, fl, '<span class="mono" style="color:#FF5A1F">reveal</span> 꺼내기');
  const free = stamp('무료', 1400, 720, 70, -10);
  const nb = NB();
  return t => {
    const ti = popIn(t, c0 + .2); const top = eIO(P(t, c2 - .3, c2 + .3));
    tf(tag, 0, -top * 60, ti, 0, ti > 0 ? 1 : 0);
    ink(word, eOut(P(t, c0 + .3, c0 + 1.6))); tf(word, 0, -top * 60, 1 - top * .35, 0, P(t, c0 + .3, c0 + .4));
    chips.forEach((c, i) => { const a = popIn(t, c0 + 1.4 + i * .8); tf(c, 0, (1 - a) * 40 - top * 40, a, 0, Math.min(1, a * 2) * (1 - top)); });
    count(chips[1], t, c0 + 2.2, STARS, 1.6, v => '★ ' + Math.round(v).toLocaleString('en-US'));
    const ri = popIn(t, c1 - .1, .55), rmv = eIO(P(t, c2 - .3, c2 + .3)); tf(rc, 0, (1 - ri) * 300 - rmv * 60, 1 - rmv * .45, 0, ri > 0 ? 1 : 0);
    sr.render(t, c1 + .5); score.style.transform = `scale(${popIn(t, c1 + 1.9)})`;
    const li = popIn(t, c2 + .2, .55); tf(fl, 0, (1 - li) * 500, 1, 0, li > 0 ? 1 : 0);
    [st1, ar1, mid, ar2, st2].forEach((e, i) => { e.style.opacity = fadeIn(t, c2 + .6 + i * .8); });
    free.render(t, c2 + 4.4);
    nb.render(t, [{ at: c0 + .8, a: 'enter' }, { at: c0 + 1.4, a: 'wave' }, { at: c1 + 1.9, a: 'nod' }, { at: c2 + 4.4 - .35, a: 'stamp' }]);
  };
};
// ---- 01 무엇인가: 편지 카드 → 화소 확대(색 번호 3개) → 끝자리 150 → 151 → 원본 = 비밀 → 정보 칩 ----
SCENES.what = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['Stegano', '='], ['*투명 잉크 편지*']], [['점마다'], ['*색 번호*', '3개']], [['끝자리를'], ['*한 칸*', '바꿔', '적음']], [['눈으로는'], ['*똑같음*']], [['2015년', '공개', '·', '별'], ['*' + STARS + '개*']]]);
  const lt = note(110, 330, 700, 300, '(눈에 안 보이는 글씨)', { head: '✉ 투명 잉크 편지', fs: 40 });
  const ltHint = el('div', null, { position: 'absolute', left: '30px', bottom: '26px', fontSize: '28px', fontWeight: '800', color: '#9A7B1C' }, lt.b, '불에 쬐면 → 글씨가 나타남');
  const zm = pic(110, 330, 700, 446, 'png', '가을산책.png · 왼쪽 위 첫 점', 'img/orig.png', { fit: 'fill' });
  const px0 = el('div', null, { position: 'absolute', left: '2px', top: '2px', width: '40px', height: '40px', border: '6px solid ' + C.red, borderRadius: '50%', boxSizing: 'border-box' }, zm.body);
  const pxl = hand('점 하나 = 색 번호 3개', 140, 800, 40, -3);
  const rg = rgbBox(860, 330, RES.pixel0.orig, { w: 740 });
  const bit = box(860, 520, 740, 200, 'card', { padding: '24px 30px' });
  el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, bit, '파랑 색 번호 → 2진수(0과 1)로 쓰면');
  const bt = el('div', 'mono', { fontSize: '58px', fontWeight: '900', marginTop: '14px', letterSpacing: '4px' }, bit, '');
  const eq = box(860, 750, 740, 160, 'card', { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', padding: '16px' });
  const i1 = el('img', null, { height: '120px', border: '3px solid #141414', borderRadius: '10px' }, eq); i1.src = 'img/orig.png';
  el('div', null, { fontSize: '80px', fontWeight: '900', color: C.green }, eq, '=');
  const i2 = el('img', null, { height: '120px', border: '3px solid #141414', borderRadius: '10px' }, eq); i2.src = 'img/secret.png';
  const lic = ['2015년 공개 · 파이썬', '별 ' + STARS, 'GPL-3.0 · 무료', '3.0.0 · 2026-07-19'].map((s, i) => chipAt(s, 860 + (i % 2) * 380, 330 + Math.floor(i / 2) * 80, { fontSize: '30px' }));
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const out0 = 1 - eIO(P(t, c[1] - .3, c[1] + .1));
    dropIn(lt.b, t, c[0] - .05, -500, -3, out0); ltHint.style.opacity = fadeIn(t, c[0] + 1.4);
    const z = popIn(t, c[1] - .1, .5); tf(zm.b, 0, (1 - z) * 300, 1, 0, z > 0 ? 1 : 0);
    const zs = t > c[2] + 1.6 ? 'img/secret.png' : 'img/orig.png'; if (!zm.img.src.endsWith(zs)) zm.img.src = zs;
    px0.style.opacity = fadeIn(t, c[1] + .6); px0.style.transform = `scale(${1 + .12 * Math.sin(t * 4)})`; pxl.render(t, c[1] + 1.0, .7, c[3] - .2);
    const outR = 1 - eIO(P(t, c[4] - .3, c[4] + .1));
    const r = popIn(t, c[1] + .9, .5); tf(rg.b, 0, (1 - r) * 200, 1, 0, r > 0 ? outR : 0);
    const flip = t > c[2] + 1.6; rg.cells[2].textContent = flip ? RES.pixel0.secret[2] : RES.pixel0.orig[2]; rg.cells[2].style.color = flip ? C.red : C.ink;
    rg.cells[2].style.transform = `scale(${flip ? lerp(1.5, 1, eOut(P(t, c[2] + 1.6, c[2] + 2.0))) : 1})`;
    const b = popIn(t, c[2] + .1, .5); tf(bit, 0, (1 - b) * 200, 1, 0, b > 0 ? outR : 0);
    const v = flip ? RES.pixel0.secret[2] : RES.pixel0.orig[2], bs = v.toString(2).padStart(8, '0');
    bt.innerHTML = bs.slice(0, 7) + `<span style="color:${C.red};background:${C.yellow};border-radius:8px;padding:0 6px">${bs[7]}</span>`;
    const e = popIn(t, c[3] + .1, .5); tf(eq, 0, (1 - e) * 200, 1, 0, e > 0 ? outR : 0);
    lic.forEach((k, i) => chipIn(k, t, c[4] + .3 + i * .8));
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + .8, a: 'point', dir: 'left' }, { at: c[2] + 1.6, a: 'oops' }, { at: c[3] + 1.0, a: 'nod' }]);
  };
};
// ---- 02 설치: 파이썬 먼저(winget) → pip 한 줄 타이핑 → 2.93초 카운트 · 함께 설치 6개 · 384.4MB → 본체 67.6KB vs opencv 301MB ----
SCENES.install = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const IN = RES.install;
  const caps = capsOf(S, [[['Windows는'], ['*파이썬*', '먼저', '설치']], [['명령', '창에'], ['*pip install*', '한', '줄']], [['*' + f2(IN.pip_sec) + '초*', '·', '함께', '설치'], ['*' + IN.site_mb + 'MB*']], [['Stegano', '자체는'], ['*' + IN.self_kb + 'KB*']]]);
  const py = box(110, 340, 640, 260, 'card', { padding: '28px 34px' });
  el('div', null, { fontSize: '30px', fontWeight: '800', color: '#666' }, py, '① 파이썬 설치 (한 번만)');
  el('div', 'mono', { fontSize: '27px', fontWeight: '800', margin: '16px 0', whiteSpace: 'nowrap' }, py, 'winget install Python.Python.3.13');
  el('div', null, { fontSize: '26px', fontWeight: '800' }, py, '또는 python.org 설치 파일 · "Add python.exe to PATH" 체크');
  const tm = term(790, 340, 810, 260, { fs: 27 });
  const sec = el('div', null, { position: 'absolute', left: '110px', top: '630px', fontSize: '110px', fontWeight: '900', color: C.orange, textShadow: '4px 4px 0 #141414' }, null, '0.00초');
  const pk = [`opencv-python ${IN.opencv_mb}MB`, 'numpy · Pillow', 'piexif · crayons · colorama'].map((s, i) => chipAt(s, 110 + [0, 330, 590][i], 780, { fontSize: '25px' }));
  const sub = chipAt('리눅스 시연 · 파이썬 ' + IN.python + ' · Windows 실행은 시연하지 않음', 110, 850, { fontSize: '24px' });
  const me = box(1080, 630, 520, 290, 'card', { padding: '26px 34px' });
  el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, me, '크기 비교 (시연)');
  const bars = [['Stegano 자체', IN.self_kb / 1000, C.green, IN.self_kb + 'KB'], ['opencv-python', IN.opencv_mb, C.red, IN.opencv_mb + 'MB']].map((r, i) => {
    el('div', null, { position: 'absolute', left: '34px', top: (80 + i * 100) + 'px', fontSize: '28px', fontWeight: '900' }, me, r[0]);
    const b = el('div', null, { position: 'absolute', left: '34px', top: (120 + i * 100) + 'px', height: '36px', width: '0', background: r[2], border: '3px solid #141414', borderRadius: '10px' }, me);
    const n = el('div', null, { position: 'absolute', right: '34px', top: (80 + i * 100) + 'px', fontSize: '30px', fontWeight: '900', color: r[2] }, me, r[3]); return { b, n, v: r[1] }; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(py, t, c[0] - .05, -400);
    const a = popIn(t, c[1] - .1, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c[1] + .3, text: 'py -m pip install stegano', dur: 1.4 }, { at: c[2] + .4, kind: 'out', text: 'Successfully installed stegano-3.0.0' }, { at: c[2] + .6, kind: 'out', text: `opencv-python-${IN.packages['opencv-python']} numpy-${IN.packages.numpy} …` }]);
    const s = popIn(t, c[2], .45); tf(sec, 0, 0, s, -3, s > 0 ? 1 : 0); count(sec, t, c[2] + .1, IN.pip_sec, 1.5, v => v.toFixed(2) + '초');
    pk.forEach((e, i) => chipIn(e, t, c[2] + 1.6 + i * .8)); chipIn(sub, t, c[2] + 4.0);
    dropIn(me, t, c[3] - .1, 400);
    bars.forEach((r, i) => { const k = eOut(P(t, c[3] + .5 + i * 1.0, c[3] + 1.5 + i * 1.0)); r.b.style.width = Math.max(6, 440 * r.v / IN.opencv_mb * k) + 'px'; r.n.style.opacity = P(t, c[3] + 1 + i, c[3] + 1.4 + i); });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'point', dir: 'left' }, { at: c[2] + 1.6, a: 'oops' }, { at: c[3] + 2.6, a: 'look' }]);
  };
};
// ---- 03 시연 ①: hide 타이핑 → 원본·비밀 그림 나란히 + 0.22초 → reveal → 쪽지 37자 ✓ → 숨긴 게 없는 그림 ✗ 문구 ----
SCENES.demo1 = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['쪽지를', '넣자'], ['*' + HIDE + '초*', '→', '비밀.png']], [['원본', '그림은'], ['*그대로*']], [['꺼내기', '→', '*' + SHOW + '초*'], ['한글', RES.hide.chars + '자', '그대로']], [['숨긴', '게', '없으면'], ['*찾을 수 없음*', '문구']]]);
  const tm = term(110, 330, 1490, 190, { fs: 27 });
  const og = pic(110, 545, 520, 330, 'png', '가을산책.png (원본)', 'img/orig.png', { fs: 24 });
  const sc = pic(660, 545, 520, 330, 'png', '비밀.png', 'img/secret.png', { fs: 24 });
  const st = stamp(HIDE + '초', 940, 820, 50);
  const same = chipAt('✓ 원본 그대로 · 결과는 새 PNG', 110, 890, { fontSize: '26px' });
  const nt = note(1210, 545, 390, 330, MSG, { fs: 30, head: '📝 꺼낸 쪽지' });
  const ok = chipAt(`✓ ${RES.hide.chars}자 같음`, 1240, 890, { fontSize: '26px', background: C.green, color: '#fff' });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const a = popIn(t, c[0] - .1, .5); tf(tm.el, 0, (1 - a) * -200, 1, 0, a > 0 ? 1 : 0);
    const outs = t < c[3] ? [] : [{ at: c[3] + .2, text: 'stegano-lsb reveal -i 가을산책.png', dur: 1.2 }, { at: c[3] + 1.6, kind: 'out', text: NOPE, color: '#FF8A7A' }];
    tm.render(t, t < c[3] ? [{ at: c[0] + .3, text: 'stegano-lsb hide -i 가을산책.png -m "엄마 생신 …" -o 비밀.png', dur: 1.6 }, { at: c[2] + .1, text: 'stegano-lsb reveal -i 비밀.png', dur: 1.0 }] : outs);
    dropIn(og.b, t, c[0] + 1.9, -500, -2); dropIn(sc.b, t, c[0] + 2.4, -500, 2); st.render(t, c[0] + 3.0);
    chipIn(same, t, c[1] + .3);
    const n = popIn(t, c[2] + 1.2, .5); tf(nt.b, (1 - n) * 300, 0, 1, 0, n > 0 ? 1 : 0); ink(nt.tx, eOut(P(t, c[2] + 1.4, c[2] + 3.0))); chipIn(ok, t, c[2] + 3.2);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 3.0 - .35, a: 'stamp' }, { at: c[2] + 3.2, a: 'nod' }, { at: c[3] + 1.8, a: 'look' }]);
  };
};
// ---- 04 시연 ②: 바뀐 화소 175 카운트 · 0.02% → 확대: 원본 ↔ 비밀(맨 위 줄) + 색 번호 150 → 151 → 바뀐 곳 지도(맨 위 한 줄) + 파일 크기 ----
SCENES.demo2 = S => {
  const c = [0, 1, 2].map(S.cue), H = RES.hide;
  const caps = capsOf(S, [[['바뀐', '점'], ['*' + H.changed_px + '개*', '·', H.changed_pct + '%']], [['색', '번호는'], ['최대', '*1칸*']], [['바뀐', '곳은'], ['*맨 위 한 줄*', '뿐']]]);
  const cn = box(110, 330, 620, 280, 'card', { padding: '26px 34px' });
  el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, cn, `1280×720 = ${(1280 * 720).toLocaleString('en-US')}개 점 가운데`);
  const big = el('div', null, { fontSize: '120px', fontWeight: '900', color: C.orange, textShadow: '4px 4px 0 #141414', lineHeight: '1.25' }, cn, '0개');
  const pct = chipAt(`전체의 ${H.changed_pct}% · 화질 지표 PSNR ${H.psnr_db}dB`, 110, 630, { fontSize: '26px' });
  const grid = (y, key, title) => { const b = box(770, y, 830, 250, 'card', { padding: '16px 20px' });
    el('div', null, { fontSize: '24px', fontWeight: '800', color: '#666', marginBottom: '8px' }, b, title);
    RES.row0[key].slice(0, 8).forEach((v, i) => { const o = RES.row0.orig[i]; const cl = el('div', 'mono', { position: 'absolute', left: (20 + i * 99) + 'px', top: '56px', width: '90px', height: '172px', borderRadius: '10px', border: '3px solid #141414',
      background: `rgb(${v.join(',')})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '900', lineHeight: '1.3' }, b,
      v.map((n, j) => `<span style="${n !== o[j] ? 'color:#E5482D;background:#FFD84D;border-radius:6px;padding:0 3px' : ''}">${n}</span>`).join('')); });
    return b; };
  const zo = grid(330, 'orig', '원본 맨 위 줄 앞 8개 점 (빨강 · 초록 · 파랑)'), zs = grid(600, 'secret', '비밀.png 같은 자리 (바뀐 번호 = 노란 칸)');
  const rg = rgbBox(110, 700, RES.pixel0.secret, { w: 620, h: 150, fs: 46 });
  const map = pic(110, 330, 1490, 520, 'png', '바뀐 곳 지도 (바뀐 점만 주황, 세로로 키워 표시)', 'img/diffmark.png', { fit: 'fill', fs: 24 });
  const ring = pen(ellipsePath(110 + 1490 * 230 / 1280 / 2 + 10, 382 + 14, 1490 * 230 / 1280 / 2 + 50, 34), 6);
  const sz = chipAt(`파일 크기 ${H.src_kb}KB → ${H.out_kb}KB`, 110, 870, { fontSize: '28px' });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const out = 1 - eIO(P(t, c[2] - .3, c[2] + .1));
    dropIn(cn, t, c[0] - .1, -400, 0, out); count(big, t, c[0] + .5, H.changed_px, 1.6, v => Math.round(v) + '개'); chipIn(pct, t, c[0] + 2.4, out);
    slideIn(zo, t, c[0] + 1.0, 500, out); slideIn(zs, t, c[1] + .3, 500, out);
    const r = popIn(t, c[1] + 1.4, .5); tf(rg.b, 0, (1 - r) * 200, 1, 0, r > 0 ? out : 0);
    const fl = t > c[1] + 2.2; rg.cells[2].textContent = fl ? RES.pixel0.secret[2] : RES.pixel0.orig[2]; rg.cells[2].style.color = fl ? C.red : C.ink;
    const m = popIn(t, c[2] + .1, .5); tf(map.b, 0, (1 - m) * 300, 1, 0, m > 0 ? 1 : 0);
    ring.set(eOut(P(t, c[2] + .9, c[2] + 1.6))); chipIn(sz, t, c[2] + 1.9);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 2.1, a: 'oops' }, { at: c[1] + 2.2, a: 'point', dir: 'left' }, { at: c[2] + .9, a: 'pen' }]);
  };
};
// ---- 05 시연 ③: 쪽지.txt → 쪽지그림.png → 꺼낸쪽지.txt ✓ → -o 없이 꺼내면 base64 ✗ → 한글 11만 5천 자 막대 ----
SCENES.demo3 = S => {
  const c = [0, 1, 2].map(S.cue), F = RES.file;
  const caps = capsOf(S, [[['메모장', '파일도'], ['*통째로*', '숨기고', '꺼냄']], [['-o', '없이', '꺼내면'], ['*알아볼 수 없는 글자*']], [['한글'], ['*11만 5천 자*도', '들어감']]]);
  const t1 = note(110, 330, 470, 380, F.text.trim(), { fs: 24, head: `📄 쪽지.txt (${F.bytes}바이트)` });
  const a1 = arrow(590, 520, 660, 520, 18);
  const pg = pic(670, 380, 460, 280, 'png', '쪽지그림.png', 'img/secret.png', { fs: 22 });
  const a2 = arrow(1140, 520, 1200, 520, 18);
  const t2 = note(1210, 330, 390, 380, F.text.trim(), { fs: 22, head: '📄 꺼낸쪽지.txt' });
  const ok = chipAt('✓ 원본과 똑같은 파일', 1240, 722, { fontSize: '26px', background: C.green, color: '#fff' });
  const b64 = box(110, 790, 1490, 130, 'card', { padding: '20px 28px', border: `4px solid ${C.red}` });
  el('div', 'mono', { fontSize: '24px', fontWeight: '800', color: '#666' }, b64, 'stegano-lsb reveal -i 쪽지그림.png   ← -o 를 빼먹음');
  el('div', 'mono', { fontSize: '34px', fontWeight: '900', color: C.red, whiteSpace: 'nowrap', overflow: 'hidden' }, b64, F.no_o.out + '…');
  const cap = box(110, 330, 1490, 560, 'card', { padding: '34px 40px' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, cap, '1280×720 그림 한 장에 넣은 한글 글자 수');
  const bar = el('div', null, { position: 'absolute', left: '40px', top: '130px', height: '90px', width: '0', borderRadius: '16px', background: C.orange, border: '4px solid #141414' }, cap);
  el('div', null, { position: 'absolute', left: '40px', top: '130px', width: '1406px', height: '90px', borderRadius: '16px', border: '4px dashed #999', boxSizing: 'border-box' }, cap);
  const num = el('div', null, { position: 'absolute', left: '40px', top: '250px', fontSize: '110px', fontWeight: '900', color: C.orange, textShadow: '4px 4px 0 #141414' }, cap, '0자');
  const cps = [`✓ 그대로 꺼내짐 (${f2(RES.capacity['115000'].sec)}초)`, `이론상 ${RES.capacity.bytes_theory.toLocaleString('en-US')}바이트 (점 하나에 3비트)`, '파일은 약 4/3배로 늘어나 들어감'].map((s, i) => chipAt(s, 40 + [0, 470, 1000][i], 450, { fontSize: '24px', position: 'absolute' }));
  cps.forEach(e => cap.appendChild(e));
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const out = 1 - eIO(P(t, c[2] - .3, c[2] + .1));
    dropIn(t1.b, t, c[0] - .1, -500, -3, out); a1.set(eOut(P(t, c[0] + .9, c[0] + 1.3)) * out); slideIn(pg.b, t, c[0] + 1.1, 300, out);
    a2.set(eOut(P(t, c[0] + 2.2, c[0] + 2.6)) * out); slideIn(t2.b, t, c[0] + 2.4, 300, out); chipIn(ok, t, c[0] + 3.4, out);
    const b = popIn(t, c[1] + .1, .5); tf(b64, (b > 0 ? shake(t, c[1] + .6, .3, 6) : 0), (1 - b) * 200, 1, 0, b > 0 ? out : 0);
    const k = popIn(t, c[2] + .1, .5); tf(cap, 0, (1 - k) * 300, 1, 0, k > 0 ? 1 : 0);
    const f = eOut(P(t, c[2] + .6, c[2] + 2.4)); bar.style.width = (1406 * 115000 * 3 / RES.capacity.bytes_theory * f) + 'px';
    count(num, t, c[2] + .6, 115000, 1.8, v => Math.round(v).toLocaleString('en-US') + '자');
    cps.forEach((e, i) => chipIn(e, t, c[2] + 2.6 + i * .8));
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 3.4, a: 'nod' }, { at: c[1] + .6, a: 'oops' }, { at: c[2] + 2.6, a: 'happy' }]);
  };
};
// ---- 06 시연 ④: 옮기기 시험 7가지 ✓/✗ 알약 (남는 것 → 사라지는 것) + 물에 젖은 쪽지 → -o 비밀.jpg ✗ ----
SCENES.demo4 = S => {
  const c = [0, 1, 2].map(S.cue), V = RES.survive;
  const caps = capsOf(S, [[['복사', '·', 'PNG', '다시', '저장'], ['→', '*쪽지 남음*']], [['JPG', '·', '크기', '1%'], ['→', '*쪽지 사라짐*']], [['결과는', '꼭'], ['*.png*', '로']]]);
  const OK = [['파일 복사', V.copy.ok], ['PNG로 다시 저장', V.png_resave.ok], ['무손실 WebP로 저장', V.webp_lossless.ok], ['아래쪽 자르기', V.crop_bottom.ok]];
  const NG = [['JPG 화질 95로 다시 저장', V.jpg95.ok], ['JPG 화질 100으로 다시 저장', V.jpg100.ok], ['크기 1% 줄이기 (1280 → 1267)', V.resize99.ok], ['위쪽 10줄 자르기', V.crop_top.ok]];
  const mk = (arr, x) => arr.map((p, i) => { const e = pill((p[1] ? '✓ ' : '✗ ') + p[0], p[1], x, 340 + i * 92, 700, 72); e.style.fontSize = '30px'; return e; });
  const po = mk(OK, 110), pn = mk(NG, 900);
  const wet = note(110, 720, 700, 180, NOTE, { fs: 34, head: '📝 쪽지 (JPG로 다시 저장한 뒤)' });
  const nope = chipAt(NOPE, 900, 720, { fontSize: '28px', fontFamily: '"DejaVu Sans Mono", monospace', background: C.ink, color: '#FF8A7A' });
  const jp = box(900, 790, 700, 120, 'card', { padding: '14px 24px', border: `4px solid ${C.red}` });
  el('div', 'mono', { fontSize: '24px', fontWeight: '900' }, jp, 'hide … -o 비밀.jpg → 오류 없이 만들어짐');
  el('div', null, { fontSize: '28px', fontWeight: '900', color: C.red }, jp, '→ reveal: ' + (RES.out_jpg.reveal_ok ? '꺼내짐' : '꺼낼 수 없음'));
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    po.forEach((e, i) => pillRender(e, t, c[0] + .4 + i * .8, true));
    pn.forEach((e, i) => pillRender(e, t, c[1] + .4 + i * .8, false));
    const w = popIn(t, c[1] + 3.6, .5); tf(wet.b, 0, (1 - w) * 200, 1, 0, w > 0 ? 1 : 0);
    const melt = eIO(P(t, c[1] + 4.2, c[1] + 5.6)); wet.tx.style.filter = `blur(${melt * 9}px)`; wet.tx.style.opacity = 1 - melt * .85;
    const o2 = t < c[2] ? 1 : 1 - eIO(P(t, c[2], c[2] + .3)); chipIn(nope, t, c[1] + 4.6, o2);
    slideIn(jp, t, c[2] + .2, 500);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 2.0, a: 'nod' }, { at: c[1] + 1.2, a: 'oops' }, { at: c[2] + 1.2, a: 'point', dir: 'left' }]);
  };
};
// ---- 07 시연 ⑤: 소수 번째 점에만 숨김(칸 그림) → -g 없이 ✗ / 있으면 ✓ → '암호 아님' 손글씨 → 검사 그림 3장 → 큰 그림·20장 막대 ----
const isPrime = n => { if (n < 2) return false; for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; };
SCENES.demo5 = S => {
  const c = [0, 1, 2, 3].map(S.cue), G = RES.gen;
  const caps = capsOf(S, [[['소수', '번째', '점에만'], ['*-g eratosthenes*']], [['암호가', '아니라'], ['*숨긴 자리*만', '바꿈']], [['검사', '그림:', '많이', '넣으면'], ['*줄무늬*로', '드러남']], [['큰', '그림', '*' + f2(RES.big.hide_sec) + '초*'], ['그림', '20장', RES.batch20.sec + '초']]]);
  const gd = box(110, 330, 760, 400, 'card', { padding: '26px' });
  el('div', null, { fontSize: '26px', fontWeight: '800', color: '#666' }, gd, '맨 위 줄 점 0~99번 · 주황 = 쪽지를 적는 점');
  const cells = Array.from({ length: 100 }, (_, i) => el('div', null, { position: 'absolute', left: (26 + (i % 20) * 35.4) + 'px', top: (80 + Math.floor(i / 20) * 58) + 'px', width: '30px', height: '50px', borderRadius: '6px', border: '2px solid #141414', background: '#fff' }, gd));
  const tm = term(910, 330, 690, 400, { fs: 24 });
  const hd = hand('자물쇠 아님! 숨긴 자리만 다름', 940, 760, 44, -4);
  const P3 = [['원본', 'img/parity-orig.png'], ['짧은 쪽지 (37자)', 'img/parity-secret.png'], ['한글 10만 자', 'img/parity-long.png']].map((p, i) => pic(110 + i * 500, 330, 470, 360, 'png', '검사 · ' + p[0], p[1], { fs: 22, fit: 'fill' }));
  const pc = [chipAt('원본과 구분 안 됨', 610, 710, { fontSize: '26px' }), chipAt(`위쪽 ${Math.round(100 * (RES.long100k.rows[1] + 1) / 720)}%가 줄무늬 · 바뀐 점 ${RES.long100k.changed_pct}%`, 1110, 710, { fontSize: '24px', background: C.red, color: '#fff' })];
  const ring = pen(ellipsePath(1345, 470, 250, 150), 6);
  const sp = box(110, 330, 1490, 560, 'card', { padding: '34px' });
  el('div', null, { fontSize: '30px', fontWeight: '800', color: '#666' }, sp, '걸린 시간 (숨기기)');
  const MX = RES.batch20.sec;
  const rows = [['4000×3000 큰 그림 한 장', RES.big.hide_sec, C.green], ['1280×720 그림 20장 하나씩', RES.batch20.sec, C.orange]].map((r, i) => {
    el('div', null, { position: 'absolute', left: '34px', top: (110 + i * 200) + 'px', fontSize: '36px', fontWeight: '900' }, sp, r[0]);
    const b = el('div', null, { position: 'absolute', left: '34px', top: (165 + i * 200) + 'px', height: '64px', width: '0', background: r[2], border: '4px solid #141414', borderRadius: '12px' }, sp);
    const n = el('div', null, { position: 'absolute', left: '34px', top: (240 + i * 200) + 'px', fontSize: '38px', fontWeight: '900', color: r[2] }, sp, ''); return { b, n, v: r[1] }; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const o1 = 1 - eIO(P(t, c[2] - .3, c[2] + .1));
    dropIn(gd, t, c[0] - .1, -400, 0, o1);
    cells.forEach((e, i) => { const on = isPrime(i) && t > c[0] + .8 + i * .03; e.style.background = on ? C.orange : '#fff'; });
    const a = popIn(t, c[0] + .2, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? o1 : 0);
    tm.render(t, [{ at: c[0] + 1.0, text: 'stegano-lsb reveal -i 소수.png', dur: 1.2 }, { at: c[0] + 2.4, kind: 'out', text: G.plain_ok ? MSG : NOPE, color: '#FF8A7A' },
      { at: c[0] + 3.2, text: 'stegano-lsb reveal -i 소수.png -g eratosthenes', dur: 1.6 }, { at: c[0] + 5.0, kind: 'out', text: G.with_ok ? NOTE : NOPE }]);
    hd.render(t, c[1] + .4, .8, c[2] - .3);
    P3.forEach((k, i) => dropIn(k.b, t, c[2] + .1 + i * .8, -500, i % 2 ? 2 : -2, 1 - eIO(P(t, c[3] - .3, c[3] + .1))));
    pc.forEach((e, i) => chipIn(e, t, c[2] + 2.0 + i * .8, 1 - eIO(P(t, c[3] - .3, c[3] + .1))));
    ring.set(t < c[3] - .3 ? eOut(P(t, c[2] + 2.8, c[2] + 3.4)) : 0);
    const k = popIn(t, c[3] + .1, .5); tf(sp, 0, (1 - k) * 300, 1, 0, k > 0 ? 1 : 0);
    rows.forEach((r, i) => { const at = c[3] + .6 + i * 1.0; const q = eOut(P(t, at, at + 1.5)); r.b.style.width = Math.max(8, 1300 * r.v / MX * q) + 'px'; r.n.textContent = t > at ? (r.v * q).toFixed(2) + '초' : ''; });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 2.6, a: 'oops' }, { at: c[0] + 5.2, a: 'nod' }, { at: c[2] + 2.8, a: 'pen' }]);
  };
};
// ---- 08 옵션: 옵션 카드(0.8초 간격) 3줄 ----
SCENES.opts = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['자주', '쓰는'], ['*옵션*', '모음']], [['*hide*', '·', '*reveal*'], ['-i', '·', '-o']], [['*-m*', '쪽지', '글', '·'], ['*-f*', '파일']], [['*-g*', '숨기는', '차례'], ['검사', '그림']]]);
  const O = [[['hide', '숨기기'], ['reveal', '꺼내기'], ['-i 사진.png', '넣을 그림'], ['-o 비밀.png', '결과 이름 (.png)']], [['-m "쪽지 글"', '글 숨기기'], ['-f 쪽지.txt', '파일 숨기기 (꺼낼 때 -o)']], [['-g eratosthenes', '숨기는 차례 (꺼낼 때도 같게)'], ['stegano-steganalysis-parity', '검사 그림 만들기']]];
  const cards = O.map((row, r) => row.map((o, i) => { const w = row.length === 4 ? 355 : 730; const b = box(110 + i * (w + 20), 340 + r * 195, w, 175, 'card', { padding: '20px 24px' });
    el('div', 'mono', { fontSize: row.length === 4 ? '30px' : '32px', fontWeight: '900', color: C.orange, whiteSpace: 'nowrap' }, b, M.esc(o[0])); el('div', null, { fontSize: '28px', fontWeight: '800' }, b, o[1]); return { b, r, i }; })).flat();
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach(k => { const at = c[k.r + 1] + .1 + k.i * .8; const a = popIn(t, at, .45); tf(k.b, 0, (1 - a) * 200, 1, 0, a > 0 ? Math.min(1, a * 2) : 0); });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'point', dir: 'left' }, { at: c[2] + 1.6, a: 'nod' }, { at: c[3] + 1.6, a: 'happy' }]);
  };
};
// ---- 09 쓸 곳: 카드 3장(0.8초 간격) + 카드마다 예시 한 줄 ----
SCENES.uses = S => {
  const c = [0, 1, 2].map(S.cue);
  const caps = capsOf(S, [[['①', '깜짝', '쪽지', '·'], ['*퀴즈 정답*']], [['②', '방탈출', '·'], ['*보물찾기*', '문제']], [['③', '숨기는', '기술'], ['*공부*']]]);
  const U = [['image', '깜짝 쪽지', 'img/secret.png', '-m "생일 축하해!"'], ['lock', '보물찾기 문제', 'img/parity-secret.png', '-g eratosthenes'], ['term', '기술 공부', 'img/parity-long.png', 'stegano-steganalysis-parity']];
  const cards = U.map((u, i) => { const b = box(110 + i * 500, 340, 460, 580, 'card', { padding: '26px' });
    const hd = el('div', null, { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }, b, iconTile(u[0], 72)); el('div', null, { fontSize: '38px', fontWeight: '900', whiteSpace: 'nowrap' }, hd, u[1]);
    const im = el('img', null, { width: '100%', height: '250px', objectFit: 'cover', border: '3px solid #141414', borderRadius: '12px', display: 'block', marginBottom: '22px' }, b); im.src = u[2];
    const ln = el('div', 'mono', { background: '#F4EFE6', border: '3px dashed #c9bd9c', borderRadius: '14px', padding: '16px', fontSize: '22px', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden' }, b, M.esc(u[3])); return { b, ln }; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((k, i) => { dropIn(k.b, t, c[i] - .05, 500, i % 2 ? 5 : -5); const a = P(t, c[i] + .6, c[i] + 1.4); k.ln.style.clipPath = `inset(0 ${100 - a * 100}% 0 0)`; });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 1.6, a: 'point', dir: 'left' }, { at: c[1] + 1.2, a: 'nod' }, { at: c[2] + 1.8, a: 'happy' }]);
  };
};
// ---- 10 아쉬운 점: 카드 4장 + 빨간 펜 동그라미(① 암호화 아님) + 밑줄(②) ----
SCENES.cons = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['아쉬운', '점도'], ['*짚어*', '보겠습니다']], [['①', '숨기기일', '뿐'], ['*암호화 아님*']], [['②', 'JPG로', '바꾸면'], ['*쪽지 사라짐*']], [['③', '같은', '이름이면'], ['*묻지 않고 덮어씀*']], [['④', '*파이썬*', '먼저'], [RES.install.site_mb + 'MB']]]);
  const K = [['숨기기일 뿐 암호화 아님 · Stegano가 있으면 누구나 꺼냄', '비밀번호·개인정보는 넣지 말 것 · -g 도 숨긴 자리만 바꿈'], ['JPG로 다시 저장 · 크기 변경 · 위쪽 자르기 → 쪽지 사라짐', '메신저·SNS가 그림을 다시 압축하면 사라질 수 있음 (실제 전송은 확인 못 함)'],
    ['같은 이름 결과가 있으면 묻지 않고 덮어씀', '꺼내기 실패도 오류 번호 없이 영어 문구만 나옴'], ['파이썬을 먼저 설치 · 버튼·창 없는 명령어 도구', `함께 설치되는 프로그램 ${RES.install.site_mb}MB (opencv-python ${RES.install.opencv_mb}MB)`]];
  const cards = K.map((k, i) => { const b = box(110, 330 + i * 150, 1480, 132, 'card', { display: 'flex', alignItems: 'center', gap: '26px', padding: '0 30px' });
    el('div', null, { minWidth: '68px', height: '68px', borderRadius: '16px', background: C.red, color: '#fff', fontWeight: '900', fontSize: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, b, String(i + 1));
    const tx = el('div', null, {}, b); const sp = k[0].split(' · '); const h = el('div', null, { fontSize: '34px', fontWeight: '900', whiteSpace: 'nowrap' }, tx, `<span>${M.esc(sp[0])}</span>` + (sp.length > 1 ? ' · ' + M.esc(sp.slice(1).join(' · ')) : '')); el('div', null, { fontSize: '25px', fontWeight: '700', color: '#666' }, tx, M.esc(k[1])); return { b, h }; });
  const r0 = cards[0].h.firstChild.getBoundingClientRect(), r1 = cards[1].h.firstChild.getBoundingClientRect(), s = M.parent.getBoundingClientRect();
  const ring = pen(ellipsePath((r0.left + r0.right) / 2 - s.left, (r0.top + r0.bottom) / 2 - s.top + 2, r0.width / 2 + 26, r0.height / 2 + 16), 6);
  const ul = pen(`M${r1.left - s.left - 6} ${r1.bottom - s.top + 2} C ${r1.left - s.left + r1.width * .4} ${r1.bottom - s.top - 4}, ${r1.left - s.left + r1.width * .7} ${r1.bottom - s.top + 6}, ${r1.right - s.left + 8} ${r1.bottom - s.top}`, 6);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((k, i) => slideIn(k.b, t, c[i + 1] - .1, -500));
    ring.set(eOut(P(t, c[1] + .6, c[1] + 1.3))); ul.set(eOut(P(t, c[2] + .6, c[2] + 1.2)));
    nb.render(t, [{ at: c[1] + .4, a: 'enter' }, { at: c[1] + .6, a: 'pen' }, { at: c[2] + .6, a: 'pen' }, { at: c[3] + .5, a: 'oops' }]);
  };
};
// ---- 정리: 체크리스트 3줄(✓가 하나씩) ----
SCENES.summary = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['오늘', '내용', '*정리*']], [['Stegano', '='], ['*투명 잉크 편지*']], [['숨기기', HIDE + '초,'], ['꺼내기', '*' + SHOW + '초*']], [['암호화', '아님,'], ['*JPG*면', '사라짐']]]);
  const L = ['Stegano = 색 번호 끝자리에 쓰는 투명 잉크 편지', `숨기기 ${HIDE}초 · 꺼내기 ${SHOW}초 · 바뀐 점 ${RES.hide.changed_pct}%`, '암호화 아님 · 결과는 꼭 PNG · JPG로 바꾸면 사라짐'];
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
SCENES.end = S => ending(S, { name: 'Stegano · 투명 잉크 편지', lines: [['다음에 또 멋진'], ['*오픈소스*', '소개하겠습니다!']], disclaimer: DISCLAIMER });

// ======================= 숏폼 · 과정 애니메이션 (세로 1080×1920 / 가로 1920×1080 둘 다) =======================
const NBX = S => S.V ? M.buddy(770, 168, .62) : M.buddy(1636, 548, .62);
const LY = S => S.V ? { x: 70, w: 940, y: 520 } : { x: 110, w: 1480, y: 340 };
SCENES.s_hook = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['이', '그림', '속에'], ['*쪽지*가?']], { size: S.V ? 84 : 78 });
  const k = pic(L.x, S.V ? 560 : 340, S.V ? L.w : 1000, S.V ? 560 : 580, 'png', '비밀.png', 'img/secret.png');
  const q = el('div', null, { position: 'absolute', left: (S.V ? L.x + 760 : 980) + 'px', top: (S.V ? 1150 : 760) + 'px', fontSize: '150px', fontWeight: '900', color: C.orange, textShadow: '5px 5px 0 #141414' }, null, '?');
  const nb = NBX(S);
  return t => {
    cap.render(t); dropIn(k.b, t, c0 + .3, -500, -3);
    const g = popIn(t, c0 + 2.0, .5); tf(q, 0, 0, g, (1 - g) * 40, g > 0 ? 1 : 0);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.4, a: 'look' }, { at: c0 + 3.0, a: 'oops' }]);
  };
};
SCENES.s_what = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['*Stegano*'], ['그림', '속', '쪽지']]), caption(c1 - .1, null, [['숨기기', HIDE + '초'], ['꺼내기', '*' + SHOW + '초*']])];
  const tm = term(L.x, L.y, S.V ? L.w : 860, S.V ? 260 : 260, { fs: S.V ? 28 : 28 });
  const nt = note(S.V ? L.x : 1010, S.V ? 820 : 340, S.V ? L.w : 590, S.V ? 420 : 420, NOTE.replace(': ', '\n'), { fs: S.V ? 52 : 40, head: '📝 꺼낸 쪽지' });
  const st = stamp(SHOW + '초', S.V ? 640 : 1300, S.V ? 1180 : 760, 64);
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t)); const a = popIn(t, c0 + .2, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c0 + .7, text: 'stegano-lsb hide … -o 비밀.png', dur: 1.4 }, { at: c1 + .1, text: 'stegano-lsb reveal -i 비밀.png', dur: 1.2 }]);
    const n = popIn(t, c1 + 1.3, .5); tf(nt.b, 0, (1 - n) * 300, 1, 0, n > 0 ? 1 : 0); ink(nt.tx, eOut(P(t, c1 + 1.5, c1 + 3.0))); st.render(t, c1 + 3.2);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.0, a: 'point', dir: 'left' }, { at: c1 + 3.2 - .35, a: 'stamp' }]);
  };
};
SCENES.s_conv = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['바뀐', '점'], ['*' + RES.hide.changed_pct + '%*']]), caption(c1 - .1, null, [['눈으로는'], ['*똑같음*']])];
  const rg = rgbBox(L.x, S.V ? 520 : 340, RES.pixel0.orig, { w: S.V ? L.w : 700, h: 180, fs: 60 });
  const W = S.V ? 425 : 680, H = S.V ? 600 : 360, Y = S.V ? 760 : 560;
  const a = pic(L.x, Y, W, H, 'png', '원본', 'img/orig.png', { fs: 22 });
  const b = pic(S.V ? 585 : 870, Y, W, H, 'png', '쪽지 숨김', 'img/secret.png', { fs: 22 });
  const eq = el('div', null, { position: 'absolute', left: (S.V ? 508 : 803) + 'px', top: (Y + (S.V ? 250 : 120)) + 'px', fontSize: '90px', fontWeight: '900', color: C.green, textShadow: '3px 3px 0 #141414' }, null, '=');
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t));
    const r = popIn(t, c0 + .1, .5); tf(rg.b, 0, (1 - r) * 200, 1, 0, r > 0 ? 1 : 0);
    const fl = t > c0 + 1.6; rg.cells[2].textContent = fl ? RES.pixel0.secret[2] : RES.pixel0.orig[2]; rg.cells[2].style.color = fl ? C.red : C.ink;
    rg.cells[2].style.transform = `scale(${fl ? lerp(1.5, 1, eOut(P(t, c0 + 1.6, c0 + 2.0))) : 1})`;
    dropIn(a.b, t, c1 - .1, -500, -3); dropIn(b.b, t, c1 + .5, -500, 3); eq.style.opacity = fadeIn(t, c1 + 1.1);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.6, a: 'oops' }, { at: c1 + 1.4, a: 'look' }]);
  };
};
SCENES.s_limit = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['*암호화*', '아님,'], ['JPG면', '사라짐']]);
  const pills = [['✗ 암호화 아님 · 누구나 꺼냄', false], ['✗ JPG로 다시 저장 → 쪽지 사라짐', false], ['✓ PNG 파일 그대로 → 쪽지 남음', true]]
    .map((p, i) => { const e = pill(p[0], p[1], L.x, (S.V ? 560 : 360) + i * (S.V ? 110 : 100), S.V ? L.w : 900, S.V ? 80 : 74); e.style.fontSize = S.V ? '34px' : '32px'; return e; });
  const wet = note(S.V ? L.x : 1060, S.V ? 920 : 360, S.V ? L.w : 540, S.V ? 420 : 330, NOTE.replace(': ', '\n'), { fs: S.V ? 46 : 34, head: '📝 JPG로 저장한 뒤' });
  const nb = NBX(S);
  return t => {
    cap.render(t); pills.forEach((p, i) => pillRender(p, t, c0 + .4 + i * .9, i === 2));
    slideIn(wet.b, t, c0 + 1.4, 500); const m = eIO(P(t, c0 + 2.2, c0 + 3.6)); wet.tx.style.filter = `blur(${m * 10}px)`; wet.tx.style.opacity = 1 - m * .85;
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + .8, a: 'oops' }, { at: c0 + 2.6, a: 'nod' }]);
  };
};
SCENES.s_end = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['설치는'], ['*명령 한 줄*']]);
  const tm = term(L.x, S.V ? 560 : 360, S.V ? L.w : 880, S.V ? 250 : 220, { fs: S.V ? 32 : 30 });
  const nb = NBX(S); const rc = box(S.V ? L.x : 1060, S.V ? 860 : 360, S.V ? L.w : 540, 300, 'card', { padding: '34px 40px' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, rc, '일반인 쓸모 별점'); const sr = stars(40, 100, S.V ? 112 : 78, 3, 5, rc); half(sr, 7);
  return t => { cap.render(t); const a = popIn(t, c0, .5); tf(tm.el, 0, (1 - a) * 200, 1, 0, a > 0 ? 1 : 0); tm.render(t, [{ at: c0 + .4, text: 'py -m pip install stegano', dur: 1.4 }]);
    const b = popIn(t, c0 + 1.6, .5); tf(rc, 0, (1 - b) * 200, 1, 0, b > 0 ? 1 : 0); sr.render(t, c0 + 2.0);
    nb.render(t, [{ at: c0 + .2, a: 'enter' }, { at: c0 + .7, a: 'point', dir: 'left' }, { at: c0 + 2.6, a: 'happy' }]); };
};
