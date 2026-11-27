// pandoc (2026-11-26 픽, 2026-11-27 시연) 모션 장면 — tools/motion 키트 (GUIDE 5-4)
// 숫자: data.js 의 RES (= demo/results.json 시연 측정값)만 씀. 문서 내용은 모두 시연용 가상 자료
// img/*.jpg = pandoc 이 실제로 만든 워드·파워포인트·PDF 를 LibreOffice·pdftoppm 으로 그림으로 찍은 것 (Word 화면과는 조금 다를 수 있음)
// 시간: 모두 S.cue(i)(자막 i 의 시작 초) 기준 → 음성 길이에 맞춰 구간이 바뀌어도 그대로 따라감
// 롱폼 14개 장 + 숏폼 5장면 모두 직접 만듦 (기본 장면 없음), end 를 뺀 모든 장·장면에 냥봇(2~4번 반응)
// 비유 하나: '문서 통역사' — 한 형식으로 쓴 글을 읽고 같은 내용을 다른 형식으로 옮겨 적음(꾸밈은 그 형식의 기본 모양)
const { C, P, eOut, eIO, lerp, popIn, shake, el, box, tf, caption, stamp, hand, pen, ellipsePath, arrowPath, count, term, pill, pillRender, stars, iconTile, ending } = M;
const DISCLAIMER = ['정보 제공용 · 2026-11-27 클라우드 시연 결과(운영자 직접 검증 아님) · 문서 내용은 시연용 가상 자료',
  'Windows·버전에 따라 결과가 다를 수 있음 · 원본 파일은 따로 보관 · 같은 이름 결과 파일은 덮어씀'];
const STARS = 47107;                                  // GitHub 별 (2026-11-27 검색 API 확인)
const f2 = v => Number(v).toFixed(2);
const DOCX = f2(RES.md2docx.sec), BIGS = f2(RES.big.sec), PDFS = f2(RES.pdf_typst.sec);
const SCENES = {};

// ---------- 공통 도우미 ----------
const capsOf = (S, arr) => arr.map((L, i) => caption(S.cue(i) - .1, i < arr.length - 1 ? S.cue(i + 1) - .25 : null, L));
const NB = () => M.buddy(1636, 548, .62);
const fadeIn = (t, a, d = .5) => Math.min(1, popIn(t, a, d) * 2);
const dropIn = (e, t, a, dy = -500, r = 0) => { const k = popIn(t, a, .55); tf(e, 0, (1 - k) * dy, 1, (1 - k) * r, k > 0 ? 1 : 0); return k; };
const slideIn = (e, t, a, dx = -300, o = 1) => { const k = popIn(t, a, .5); tf(e, (1 - k) * dx, 0, 1, 0, k > 0 ? Math.min(1, k * 2) * o : 0); return k; };
const FMT = { md: ['MD', '#6B7280'], docx: ['DOCX', '#2B579A'], pptx: ['PPTX', '#D24726'], epub: ['EPUB', '#3C8C3C'], html: ['HTML', '#E44D26'], pdf: ['PDF', '#E5482D'] };
// 파일 카드: 위 색 띠(형식 이름 + 파일 이름) + 몸통(실제 결과 그림 img 또는 글)
function doc(x, y, w, h, kind, name, o = {}) {
  const [lab, col] = FMT[kind];
  const b = box(x, y, w, h, 'card', { padding: '0', overflow: 'hidden' }, o.par);
  el('div', null, { background: col, color: '#fff', fontWeight: '900', fontSize: (o.fs || 28) + 'px', padding: '10px 22px', display: 'flex', gap: '16px', alignItems: 'center', whiteSpace: 'nowrap' }, b,
    `<span style="background:#fff;color:${col};border-radius:8px;padding:0 10px">${lab}</span><span>${M.esc(name)}</span>`);
  const body = el('div', null, { position: 'absolute', left: '0', right: '0', top: (o.fs || 28) + 30 + 'px', bottom: '0', overflow: 'hidden', background: '#fff' }, b);
  if (o.img) el('img', null, { width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top' }, body).src = o.img;
  if (o.html) body.innerHTML = o.html;
  return { b, body };
}
// 마크다운 원문 줄 (# 제목은 주황, - 목록 기호는 주황, | 표 줄은 회색)
const MDL = ['# 회의 개요', '- **일시**: 11월 26일 오전 10시', '- **장소**: 3층 회의실', '', '# 결정한 것', '| 안건 | 결정 | 담당 |', '|---|---|---|', '| 연말 행사 장소 | 2안 | 김하늘 |', '', '# 다음 할 일', '- [ ] 호텔 계약서 확인하기'];
const mdHL = s => M.esc(s).replace(/^(#+ )/, `<b style="color:${C.orange}">$1</b>`).replace(/^(- )/, `<b style="color:${C.orange}">$1</b>`).replace(/(\*\*)/g, `<b style="color:${C.orange}">$1</b>`).replace(/^(\|.*)$/, '<span style="color:#555">$1</span>');
const mdBody = (fs = 24, lines = MDL) => `<div class="mono" style="font-size:${fs}px;line-height:1.55;padding:16px 22px;white-space:pre">${lines.map(l => `<div>${mdHL(l) || '&nbsp;'}</div>`).join('')}</div>`;
const half = sr => { const k = sr.el.children[8]; if (k) k.style.clipPath = 'inset(0 50% 0 0)'; };   // 별 3.5개: 4번째 채운 별을 반만
const arrow = (x1, y1, x2, y2, b = 30) => pen(arrowPath(x1, y1, x2, y2, b), 7, C.orange);

// ======================= 롱폼 (1920×1080) =======================
// ---- 미리보기: 메모 → 명령 한 줄 → 워드(실제 그림) + 0.04초 도장 → 파워포인트·전자책·PDF 카드 ----
SCENES.preview = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2);
  const caps = [caption(c0 - .1, c1 - .3, [['메모장에', '쓴'], ['*회의록*', '한', '장']]),
    caption(c1 - .1, c2 - .3, [['명령', '한', '줄'], ['→', '*워드*', DOCX + '초']]),
    caption(c2 - .06, null, [['같은', '글이'], ['*발표 자료·전자책·PDF*로도']])];
  const md = doc(110, 330, 620, 400, 'md', '회의록.md', { html: mdBody(23) });
  const tm = term(110, 760, 620, 160, { fs: 24 });
  const dx = doc(810, 330, 440, 590, 'docx', '회의록.docx', { img: 'img/docx.jpg' });
  const ar = arrow(740, 520, 800, 520, 16);
  const st = stamp(DOCX + '초', 1000, 820, 52);
  const sl = doc(1290, 330, 320, 230, 'pptx', '5장', { img: 'img/slide-1.jpg', fs: 24 });
  const ep = doc(1290, 580, 320, 150, 'epub', '전자책', { fs: 24, html: '<div style="padding:16px 22px;font-size:24px;font-weight:800">4개 장 · 목차</div>' });
  const pd = doc(1290, 750, 320, 170, 'pdf', '회의록.pdf', { img: 'img/pdf-typst.jpg', fs: 24 });
  const nb = NB();
  return t => {
    caps.forEach(c => c.render(t));
    dropIn(md.b, t, c0 - .1, -500, -3);
    const a = popIn(t, c1 - .2, .5); tf(tm.el, 0, (1 - a) * 200, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c1 + .2, text: 'pandoc 회의록.md -o 회의록.docx', dur: 1.8 }]);
    ar.set(eOut(P(t, c1 + 2.0, c1 + 2.5)));
    slideIn(dx.b, t, c1 + 2.3, 400); st.render(t, c1 + 3.0);
    [sl, ep, pd].forEach((k, i) => dropIn(k.b, t, c2 + .3 + i * .8, -500, i % 2 ? 4 : -4));
    nb.render(t, [{ at: c0 + .5, a: 'enter' }, { at: c1 + 3.0 - .35, a: 'stamp' }, { at: c2 + .8, a: 'point', dir: 'left' }, { at: c2 + 3.2, a: 'nod' }]);
  };
};
// ---- 타이틀: 'pandoc.' 글자가 떨어짐 + 별 카운트 → 별점 3.5/5 → 읽는 형식 52 · 만드는 형식 77 + '무료' 도장 ----
SCENES.title = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2);
  const tag = el('div', 'chip', { left: '110px', top: '200px', background: C.ink, color: '#fff', fontSize: '30px' }, null, '오늘의 오픈소스 · 2026.11.26');
  const word = el('div', null, { position: 'absolute', left: '100px', top: '250px', fontSize: '230px', fontWeight: '900', letterSpacing: '-8px', lineHeight: '1', transformOrigin: 'left top' });
  const letters = [...'pandoc'].map(ch => el('span', null, { display: 'inline-block' }, word, ch)); const dot = el('span', null, { display: 'inline-block', color: C.orange }, word, '.');
  const chips = [['github.com/jgm/pandoc', 110, 'mono'], ['★ 0', 560, ''], ['GPL-2.0 · 무료', 830, 'mono']].map(c => el('div', 'chip ' + c[2], { left: c[1] + 'px', top: '560px', fontSize: '26px' }, null, c[0]));
  const fm = box(1230, 190, 370, 330, 'card', { padding: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' });
  ['md', 'docx', 'pptx', 'pdf'].forEach(k => el('div', null, { background: FMT[k][1], color: '#fff', fontWeight: '900', fontSize: '34px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #141414' }, fm, FMT[k][0]));
  const rc = box(1000, 190, 600, 330, 'card', { padding: '34px 40px', transformOrigin: 'right top' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, rc, '일반인 쓸모 별점');
  const sr = stars(40, 100, 90, 4, 5, rc); half(sr);
  const score = el('div', null, { position: 'absolute', left: '40px', top: '220px', fontSize: '60px', fontWeight: '900', transformOrigin: 'left center' }, rc, '3.5 <span style="color:#999;font-size:40px">/ 5</span>');
  const nums = [['읽는 형식', RES.formats.in], ['만드는 형식', RES.formats.out]].map((u, i) => {
    const c = box(110 + i * 620, 650, 580, 250, 'card', { padding: '30px 40px' });
    el('div', null, { fontSize: '40px', fontWeight: '900', color: '#555' }, c, u[0]);
    const n = el('div', null, { fontSize: '120px', fontWeight: '900', color: C.orange, lineHeight: '1.1' }, c, '0'); return { c, n, v: u[1] };
  });
  const free = stamp('무료', 1360, 700, 70, -10);
  const nb = NB();
  return t => {
    const ti = popIn(t, c0 + .2); const top = eIO(P(t, c2 - .3, c2 + .3));
    tf(tag, 0, -top * 60, ti, 0, ti > 0 ? 1 : 0);
    letters.forEach((l, i) => { const a = popIn(t, c0 + .3 + i * .1, .55); l.style.transform = `translateY(${(1 - a) * -320}px) rotate(${(1 - a) * 20}deg)`; l.style.opacity = a > 0 ? 1 : 0; });
    dot.style.transform = `scale(${popIn(t, c0 + 1.0)})`; tf(word, 0, -top * 60, 1 - top * .35);
    chips.forEach((c, i) => { const a = popIn(t, c0 + 1.2 + i * .8); tf(c, 0, (1 - a) * 40 - top * 40, a, 0, Math.min(1, a * 2) * (1 - top)); });
    count(chips[1], t, c0 + 2.0, STARS, 1.6, v => '★ ' + Math.round(v).toLocaleString('en-US'));
    const bi = popIn(t, c0 + .6, .6), bo = eIO(P(t, c1 - .4, c1 + .1));
    tf(fm, bo * 700, (1 - bi) * -600, 1, (1 - bi) * 20 + 4, bi > 0 ? 1 - bo : 0);
    const ri = popIn(t, c1 - .1, .55), rmv = eIO(P(t, c2 - .3, c2 + .3)); tf(rc, 0, (1 - ri) * 300 - rmv * 60, 1 - rmv * .45, 0, ri > 0 ? 1 : 0);
    sr.render(t, c1 + .5); score.style.transform = `scale(${popIn(t, c1 + 2.2)})`;
    nums.forEach((u, i) => { const a = popIn(t, c2 + .3 + i * .9, .55); tf(u.c, 0, (1 - a) * 500, 1, (1 - a) * 6, a > 0 ? 1 : 0); count(u.n, t, c2 + .5 + i * .9, u.v, 1.6, v => Math.round(v) + '가지'); });
    free.render(t, c2 + 3.4);
    nb.render(t, [{ at: c0 + .8, a: 'enter' }, { at: c0 + 1.4, a: 'wave' }, { at: c1 + 2.2, a: 'nod' }, { at: c2 + 3.4 - .35, a: 'stamp' }]);
  };
};
// ---- 01 무엇인가: 마크다운 원문 → 통역 화살표 → 워드(실제 그림) + ✓ 알약 → 손글씨(꾸밈은 기본 모양) → 정보 알약 ----
SCENES.what = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['pandoc', '='], ['*문서 통역사*']], [['①', '한', '형식으로'], ['쓴', '글을', '*읽음*']], [['②', '다른', '형식으로'], ['*옮겨 적음*']], [['③', '꾸밈은'], ['그', '형식의', '*기본 모양*']], [['2006년부터', '·', '별'], ['*4.7만 개*', '넘음']]]);
  const md = doc(110, 340, 520, 560, 'md', '회의록.md', { html: mdBody(21) });
  const ar = arrow(640, 600, 720, 600, 20);
  const dx = doc(730, 340, 440, 560, 'docx', '회의록.docx', { img: 'img/docx.jpg' });
  const ok = [['✓ 제목 4개', true], ['✓ 목록', true], ['✓ 표', true]].map((p, i) => pill(p[0], true, 1210, 350 + i * 74, 390, 58));
  const ring = pen(ellipsePath(950, 470, 230, 90), 6);
  const hd = hand('글꼴·색은 기본 모양', 1210, 600, 40, -5);
  const lic = ['Haskell 프로그램', '별 47,107', 'GPL-2.0 · 무료'].map((s, i) => el('div', 'chip', { left: '1210px', top: (700 + i * 66) + 'px', fontSize: '28px' }, null, s));
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(md.b, t, c[1] - .1, -500, -3);
    ar.set(eOut(P(t, c[2] + .1, c[2] + .6))); slideIn(dx.b, t, c[2] + .4, 400);
    ok.forEach((p, i) => pillRender(p, t, c[2] + 1.2 + i * .8, true));
    ring.set(eOut(P(t, c[3] + .5, c[3] + 1.1))); hd.render(t, c[3] + 1.2, .7);
    lic.forEach((g, i) => { const a = popIn(t, c[4] + .3 + i * .8, .45); tf(g, 0, (1 - a) * 40, a, 0, a > 0 ? 1 : 0); });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + .4, a: 'point', dir: 'left' }, { at: c[2] + 1.4, a: 'nod' }, { at: c[3] + .5, a: 'pen' }]);
  };
};
// ---- 02 설치: 설치 파일(.msi) 카드 → winget 타이핑 → 36.6MB 카운트(리눅스 시연) → pandoc --version ----
SCENES.install = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['설치', '파일(.msi)', '또는'], ['*명령 한 줄*']], [['winget', '명령에'], ['*pandoc 이름*']], [['*' + RES.install.tgz_mb + 'MB*', '받기'], ['함께', '설치되는', '것', '없음']], [['명령', '창을', '*새로*', '열고'], ['버전', '확인']]]);
  const ms = box(110, 340, 600, 300, 'card', { padding: '30px 34px' });
  el('div', null, { fontSize: '30px', fontWeight: '800', color: '#666' }, ms, 'GitHub 저장소 → Releases');
  el('div', 'mono', { fontSize: '27px', fontWeight: '800', margin: '16px 0', whiteSpace: 'nowrap' }, ms, 'pandoc-3.14-windows-<br>x86_64.msi');
  el('div', null, { fontSize: '28px', fontWeight: '800' }, ms, '받아서 두 번 누르기 → Next');
  const tm = term(760, 340, 840, 300, { fs: 26 });
  const sec = el('div', null, { position: 'absolute', left: '110px', top: '680px', fontSize: '110px', fontWeight: '900', color: C.orange, textShadow: '4px 4px 0 #141414' }, null, '0.0MB');
  const sub = el('div', 'chip', { left: '110px', top: '820px', fontSize: '27px' }, null, `리눅스 시연: 받기 ${f2(RES.install.download_sec)}초`);
  const sub2 = el('div', 'chip', { left: '110px', top: '880px', fontSize: '27px' }, null, '함께 설치되는 프로그램 0개');
  const nw = box(760, 690, 840, 200, 'card', { padding: '26px 34px', display: 'flex', alignItems: 'center', gap: '26px' });
  el('div', null, {}, nw, iconTile('term', 100)); el('div', null, { fontSize: '34px', fontWeight: '900' }, nw, '설치 뒤 명령 창을<br>새로 열어야 pandoc 이 보임');
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(ms, t, c[0] - .05, -400);
    const a = popIn(t, c[1] - .1, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c[1] + .4, text: 'winget install --id JohnMacFarlane.Pandoc', dur: 2.0 }, { at: c[3] + .3, text: 'pandoc --version', dur: 1.0 }, { at: c[3] + 1.6, kind: 'out', text: 'pandoc 3.14  (리눅스 시연 화면)' }]);
    const s = popIn(t, c[2], .45); tf(sec, 0, 0, s, -3, s > 0 ? 1 : 0); count(sec, t, c[2] + .1, RES.install.tgz_mb, 1.6, v => v.toFixed(1) + 'MB');
    const b = popIn(t, c[2] + 1.9, .45); tf(sub, 0, (1 - b) * 30, b, 0, b > 0 ? 1 : 0);
    const b2 = popIn(t, c[2] + 2.7, .45); tf(sub2, 0, (1 - b2) * 30, b2, 0, b2 > 0 ? 1 : 0);
    slideIn(nw, t, c[3] + .2, 400);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'point', dir: 'left' }, { at: c[2] + .8, a: 'nod' }, { at: c[3] + 2.0, a: 'happy' }]);
  };
};
// ---- 03 시연 ①: 마크다운 원문 → 명령 타이핑 → 워드 결과(실제 그림) + 0.04초 도장 → ✓ 알약 → 덮어씀 경고 ----
SCENES.demo1 = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['#', '제목', '·', '-', '목록'], ['*마크다운*', '회의록']], [['pandoc', '한', '줄'], ['→', '*' + DOCX + '초*']], [['제목', '스타일·표·굵은', '글씨'], ['*그대로*']], [['같은', '이름', '파일은'], ['*묻지 않고 덮어씀*']]]);
  const md = doc(110, 330, 720, 430, 'md', `회의록.md (${RES.md2docx.md_bytes}바이트)`, { html: mdBody(24) });
  const tm = term(870, 330, 730, 170, { fs: 25 });
  const dx = doc(870, 530, 730, 390, 'docx', '회의록.docx', { img: 'img/docx.jpg' });
  const st = stamp(DOCX + '초', 1340, 470, 52);
  const ok = [[`✓ 제목 ${RES.md2docx.headings.length}개`], [`✓ 표 ${RES.md2docx.tables}개`], [`✓ 굵은 글씨 ${RES.md2docx.bold}곳`]].map((p, i) => pill(p[0], true, 110 + i * 245, 790, 225, 58));
  const warn = box(110, 860, 720, 64, 'card', { display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: '28px', fontWeight: '900', border: `4px solid ${C.red}`, color: C.red, whiteSpace: 'nowrap' });
  warn.textContent = '회의록.docx 가 이미 있으면 → 바로 덮어씀';
  const hd = hand('원본 따로 보관!', 1230, 790, 40, -5);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(md.b, t, c[0] - .05, -500, -2);
    const a = popIn(t, c[1] - .1, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c[1] + .3, text: 'pandoc 회의록.md -o 회의록.docx', dur: 1.8 }]);
    slideIn(dx.b, t, c[1] + 2.2, 500); st.render(t, c[1] + 2.9);
    ok.forEach((p, i) => pillRender(p, t, c[2] + .3 + i * .8, true));
    slideIn(warn, t, c[3] + .2, -500); hd.render(t, c[3] + 1.2, .7);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 2.9 - .35, a: 'stamp' }, { at: c[2] + 1.0, a: 'nod' }, { at: c[3] + .5, a: 'oops' }]);
  };
};
// ---- 04 시연 ②: 워드 → 마크다운(표 그대로) → AI 채팅 칩 → 웹 기사(HTML) → 워드 ----
SCENES.demo2 = S => {
  const c = [0, 1, 2].map(S.cue);
  const caps = capsOf(S, [[['워드', '→', '마크다운'], ['제목·표', '*그대로*']], [['AI', '채팅에'], ['*붙여넣기 좋은 글*']], [['웹', '기사(HTML)', '→'], ['*워드 문서*']]]);
  const dx = doc(110, 330, 440, 590, 'docx', '회의록.docx', { img: 'img/docx.jpg' });
  const ar = arrow(560, 520, 640, 520, 20);
  const BL = ['# 결정한 것', '', '| 안건           | 결정           | 담당   |', '|----------------|----------------|--------|', '| 연말 행사 장소 | 2안(시내 호텔) | 김하늘 |', '| 설문지 배포일  | 12월 2일       | 이바다 |'];
  const back = doc(650, 330, 950, 330, 'md', '되돌림.md (0.04초)', { html: mdBody(23, BL) });
  const ai = el('div', 'chip', { left: '650px', top: '690px', fontSize: '30px', padding: '14px 28px', background: C.ink, color: '#fff' }, null, '→ AI 채팅·메모 앱에 그대로 붙여넣기');
  const web = box(650, 770, 950, 150, 'card', { display: 'flex', alignItems: 'center', gap: '20px', padding: '0 26px' });
  const tile = (k, s) => `<span style="background:${FMT[k][1]};color:#fff;border:3px solid #141414;border-radius:10px;padding:4px 14px;font-weight:900">${FMT[k][0]}</span><span class="mono" style="font-size:26px;font-weight:800">${s}</span>`;
  web.innerHTML = tile('html', '기사.html') + `<b style="font-size:40px;color:${C.orange}">→</b>` + tile('docx', '기사.docx');
  const wp = pill(`✓ 제목 ${RES.html2docx.headings}개 · 표 ${RES.html2docx.tables}개`, true, 1250, 815, 330, 58);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(dx.b, t, c[0] - .05, -500, -3); ar.set(eOut(P(t, c[0] + 1.0, c[0] + 1.5)));
    slideIn(back.b, t, c[0] + 1.3, 500);
    const a = popIn(t, c[1] + .2, .45); tf(ai, 0, (1 - a) * 30, a, 0, a > 0 ? 1 : 0);
    slideIn(web, t, c[2] + .2, 500); pillRender(wp, t, c[2] + 2.4, true);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 2.0, a: 'nod' }, { at: c[1] + .6, a: 'point', dir: 'left' }, { at: c[2] + 2.4, a: 'happy' }]);
  };
};
// ---- 05 시연 ③: 슬라이드 5장(실제 그림)이 차례로 → 전자책·웹페이지 카드 → 서식 파일 칩 + 손글씨 ----
SCENES.demo3 = S => {
  const c = [0, 1, 2].map(S.cue);
  const caps = capsOf(S, [[['같은', '회의록', '→'], ['*파워포인트 5장*']], [['*전자책*', '·'], ['목차', '붙은', '웹페이지']], [['회사', '양식은'], ['*서식 파일*', '지정']]]);
  const md = doc(110, 330, 380, 300, 'md', '회의록.md', { html: mdBody(16) });
  const POS = [[530, 330], [900, 330], [1270, 330], [530, 560], [900, 560]];
  const sl = POS.map((p, i) => doc(p[0], p[1], 340, 210, 'pptx', `${i + 1}장`, { img: `img/slide-${i + 1}.jpg`, fs: 20 }));
  const cnt = el('div', null, { position: 'absolute', left: '1300px', top: '600px', fontSize: '96px', fontWeight: '900', color: C.orange, textShadow: '4px 4px 0 #141414' }, null, '0장');
  const ep = doc(110, 670, 380, 250, 'epub', '회의록.epub', { html: `<div style="padding:16px 22px;font-size:26px;font-weight:800;line-height:1.6">${RES.md2epub.chapters}개 장으로 나뉨<br>${f2(RES.md2epub.sec)}초</div>` });
  const ht = doc(530, 800, 710, 120, 'html', '회의록.html (목차 포함)', { fs: 24, html: `<div style="padding:10px 22px;font-size:24px;font-weight:800">웹 브라우저로 여는 한 장짜리 문서 · ${f2(RES.md2html.sec)}초</div>` });
  const rf = el('div', 'chip mono', { left: '1270px', top: '800px', fontSize: '24px', padding: '12px 20px' }, null, '--reference-doc<br>회사양식.docx');
  const hd = hand('꾸밈 = 기본 모양', 1270, 700, 40, -5);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(md.b, t, c[0] - .1, -400, -3);
    sl.forEach((k, i) => dropIn(k.b, t, c[0] + 1.2 + i * .8, -500, i % 2 ? 3 : -3));
    const cn = fadeIn(t, c[0] + 1.2); tf(cnt, 0, 0, 1, 0, cn * (1 - eIO(P(t, c[2] - .3, c[2])))); count(cnt, t, c[0] + 1.2, RES.md2pptx.slides, 3.4, v => Math.round(v) + '장');
    slideIn(ep.b, t, c[1] + .2, -400); slideIn(ht.b, t, c[1] + 1.0, 400);
    const r = popIn(t, c[2] + .2, .45); tf(rf, 0, (1 - r) * 30, r, 0, r > 0 ? 1 : 0); hd.render(t, c[2] + 1.0, .7);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 4.6, a: 'nod' }, { at: c[1] + 1.2, a: 'point', dir: 'left' }, { at: c[2] + 1.0, a: 'pen' }]);
  };
};
// ---- 06 시연 ④: PDF 이름만 → 'pdflatex' 오류(빨간 동그라미) → typst + 한글 글꼴 → PDF(실제 그림) ----
SCENES.demo4 = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['.pdf', '이름만', '적으면'], ['*오류*']], [['PDF', '만드는', '프로그램이'], ['*따로 필요*']], [['typst', '+', '한글', '글꼴'], ['→', '*PDF ' + PDFS + '초*']], [['Windows', '한글', '글꼴', '예'], ['*Malgun Gothic*']]]);
  const tm = term(110, 330, 900, 440, { fs: 24 });
  const er = RES.pdf_default.err;
  const pd = doc(1060, 330, 540, 590, 'pdf', '회의록.pdf', { img: 'img/pdf-typst.jpg' });
  const ring = pen(ellipsePath(560, 470, 470, 60), 6);
  const pg = pill(`✓ ${RES.pdf_typst.pages}쪽 · 한글 그대로`, true, 1100, 850, 460, 58);
  const win = box(110, 800, 900, 120, 'card', { padding: '16px 26px' });
  el('div', 'mono', { fontSize: '25px', fontWeight: '800', whiteSpace: 'nowrap' }, win, '-V mainfont="Malgun Gothic"');
  el('div', null, { fontSize: '24px', fontWeight: '700', color: '#666' }, win, 'Windows 맑은 고딕 · Windows 실행은 시연하지 않음');
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const a = popIn(t, c[0] - .05, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c[0] + .4, text: 'pandoc 회의록.md -o 회의록.pdf', dur: 1.6 }, { at: c[0] + 2.4, kind: 'out', color: '#FF7A6B', text: er },
      { at: c[2] + .2, text: 'pandoc 회의록.md -o 회의록.pdf --pdf-engine=typst -V mainfont="Noto Sans CJK KR"', dur: 2.4 }, { at: c[2] + 2.8, kind: 'out', text: '(오류 없이 끝남 · 회의록.pdf 생김)' }]);
    ring.set(eOut(P(t, c[1] + .3, c[1] + .9)) * (1 - eIO(P(t, c[2], c[2] + .4))));
    slideIn(pd.b, t, c[2] + 3.0, 500); pillRender(pg, t, c[2] + 3.6, true);
    slideIn(win, t, c[3] + .2, -500);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + .3, a: 'oops' }, { at: c[2] + 3.4, a: 'nod' }, { at: c[3] + .8, a: 'point', dir: 'left' }]);
  };
};
// ---- 07 시연 ⑤: 메모 50칸이 워드로 바뀜(2.15초) → 긴 보고서 쪽수 카운트 140쪽 + 0.37초 도장 → 손글씨 ----
SCENES.demo5 = S => {
  const c = [0, 1, 2].map(S.cue);
  const caps = capsOf(S, [[['가상', '메모', '50개'], ['→', '워드', '*' + f2(RES.batch50.sec) + '초*']], [['20만', '자', '보고서'], ['→', '*' + RES.big.pages_lo + '쪽*', BIGS + '초']], [['복사·붙여넣기', '대신'], ['*명령 한 줄*']]]);
  const gd = box(110, 330, 800, 590, 'card', { padding: '30px' });
  const tiles = Array.from({ length: 50 }, (_, i) => el('div', null, { position: 'absolute', left: (30 + (i % 10) * 74) + 'px', top: (30 + Math.floor(i / 10) * 100) + 'px', width: '62px', height: '84px', borderRadius: '8px', border: '3px solid #141414', background: FMT.md[1], color: '#fff', fontSize: '17px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }, gd, 'MD'));
  const n50 = el('div', null, { position: 'absolute', left: '30px', top: '530px', fontSize: '34px', fontWeight: '900' }, gd, '');
  const pc = box(960, 330, 640, 590, 'card', { padding: '34px' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, pc, `가상 보고서 100개 장 · ${RES.big.chars.toLocaleString('en-US')}자`);
  const pages = el('div', null, { fontSize: '150px', fontWeight: '900', color: C.orange, lineHeight: '1.2', textShadow: '5px 5px 0 #141414' }, pc, '0쪽');
  el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, pc, '워드 문서 쪽수 (LibreOffice 로 열어 셈)');
  const st = stamp(BIGS + '초', 1300, 760, 56);
  const hd = hand('명령 한 줄로 끝!', 470, 845, 46, -5);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(gd, t, c[0] - .1, 500);
    const k = P(t, c[0] + .8, c[0] + 2.95);
    tiles.forEach((e, i) => { const on = i / 50 < k; e.style.background = on ? FMT.docx[1] : FMT.md[1]; e.textContent = on ? 'W' : 'MD'; });
    n50.textContent = Math.round(k * 50) + ' / 50개';
    dropIn(pc, t, c[1] - .1, -500); count(pages, t, c[1] + .5, RES.big.pages_lo, 1.8, v => Math.round(v) + '쪽');
    st.render(t, c[1] + 2.6);
    hd.render(t, c[2] + .6, .7);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 3.0, a: 'nod' }, { at: c[1] + 2.6 - .35, a: 'stamp' }, { at: c[2] + 1.0, a: 'happy' }]);
  };
};
// ---- 08 옵션: 옵션 카드(0.8초 간격) → 형식 목록 명령 + 형식 이름 칩이 쏟아짐 ----
SCENES.opts = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['자주', '쓰는'], ['*옵션*', '모음']], [['확장자로', '형식', '결정'], ['*--toc*', '목차']], [['*회사 양식*', '·'], ['그림', '꺼내기']], [['만드는', '형식'], ['*' + RES.formats.out + '가지*', '목록']]]);
  const O = [['-o 결과.docx', '확장자로 형식 결정'], ['-s', '머리·꼬리까지 완성 문서'], ['--toc', '목차 붙이기'], ['--reference-doc 양식.docx', '회사 양식 글꼴·색'], ['--extract-media 폴더', '워드 속 그림 꺼내기']];
  const cards = O.map((o, i) => { const b = box(110 + (i < 3 ? i * 500 : (i - 3) * 750), i < 3 ? 340 : 510, i < 3 ? 470 : 720, 140, 'card', { padding: '20px 28px' });
    el('div', 'mono', { fontSize: '32px', fontWeight: '900', color: C.orange, whiteSpace: 'nowrap' }, b, M.esc(o[0])); el('div', null, { fontSize: '29px', fontWeight: '800' }, b, o[1]); return b; });
  const cmd = el('div', 'mono', { position: 'absolute', left: '110px', top: '690px', width: '620px', background: C.termBg, color: '#EDEDED', fontSize: '26px', padding: '20px 24px', borderRadius: '14px', whiteSpace: 'pre' }, null, '');
  const C2 = 'pandoc --list-output-formats';
  const FM = ['docx', 'pptx', 'odt', 'rtf', 'epub3', 'html5', 'pdf', 'typst', 'gfm', 'ipynb', 'latex', 'rst', 'jira', 'revealjs'];
  const chips = FM.map((f, i) => el('div', 'chip mono', { left: (780 + (i % 5) * 168) + 'px', top: (680 + Math.floor(i / 5) * 76) + 'px', fontSize: '24px', padding: '8px 16px' }, null, f));
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((b, i) => { const at = i < 3 ? c[1] + .1 + i * .8 : c[2] + .1 + (i - 3) * .8; const k = popIn(t, at, .45); tf(b, 0, (1 - k) * 200, 1, 0, k > 0 ? Math.min(1, k * 2) : 0); });
    const cc = popIn(t, c[3] - .1, .4); tf(cmd, 0, 0, 1, 0, cc > 0 ? 1 : 0); const n = Math.floor(P(t, c[3] + .1, c[3] + 1.3) * C2.length);
    cmd.innerHTML = '<span style="color:#FFB86B">C:\\&gt; </span>' + M.esc(C2.slice(0, n));
    chips.forEach((e, i) => { const a = popIn(t, c[3] + 1.5 + i * .12, .4); tf(e, 0, (1 - a) * 30, a, 0, a > 0 ? 1 : 0); });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'point', dir: 'left' }, { at: c[2] + 1.5, a: 'nod' }, { at: c[3] + 2.6, a: 'happy' }]);
  };
};
// ---- 09 쓸 곳: 아이콘 카드 3장(0.8초 간격) + 카드마다 예시 한 줄 ----
SCENES.uses = S => {
  const c = [0, 1, 2].map(S.cue);
  const caps = capsOf(S, [[['①', '메모', '→'], ['*보고서 워드*']], [['②', '워드·웹', '기사', '→'], ['*AI에 붙여넣을 글*']], [['③', '블로그', '글', '→'], ['*전자책·발표 자료*']]]);
  const U = [['file', '메모 → 워드', '회의록 · 보고서 초안', '회의록.md → 회의록.docx'], ['link', '워드·웹 → 글', 'AI 채팅 · 메모 앱', '기사.html → 기사.md'], ['image', '글 → 책·발표', '전자책 · 파워포인트', '블로그.md → 책.epub']];
  const cards = U.map((u, i) => { const b = box(110 + i * 500, 340, 460, 560, 'card', { padding: '30px' });
    el('div', null, { marginBottom: '18px' }, b, iconTile(u[0], 96)); el('div', null, { fontSize: '44px', fontWeight: '900', whiteSpace: 'nowrap' }, b, u[1]); el('div', null, { fontSize: '30px', fontWeight: '700', color: '#666', marginBottom: '30px' }, b, u[2]);
    const ln = el('div', 'mono', { background: '#F4EFE6', border: '3px dashed #c9bd9c', borderRadius: '14px', padding: '20px', fontSize: '25px', fontWeight: '800', whiteSpace: 'nowrap' }, b, M.esc(u[3])); return { b, ln }; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((k, i) => { dropIn(k.b, t, c[i] - .05, 500, i % 2 ? 5 : -5); const a = P(t, c[i] + .6, c[i] + 1.4); k.ln.style.clipPath = `inset(0 ${100 - a * 100}% 0 0)`; });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 1.2, a: 'point', dir: 'left' }, { at: c[1] + 1.2, a: 'nod' }, { at: c[2] + 1.8, a: 'happy' }]);
  };
};
// ---- 10 아쉬운 점: 카드 4장 + 빨간 펜 동그라미(② HWP) + 밑줄(④) ----
SCENES.cons = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['아쉬운', '점도'], ['*짚어*', '보겠습니다']], [['①', '명령어', '도구'], ['*마크다운*', '알아야', '함']], [['②', '한글', '문서(HWP)'], ['*안 됨*']], [['③', 'PDF는'], ['*프로그램 따로*']], [['④', '꾸밈', '안', '옮김'], ['*덮어씀* 주의']]]);
  const K = [['버튼·창 없는 명령어 도구 · 마크다운 쓰는 법 필요', '# 제목, - 목록, | 표 | 정도만 알면 시작 가능'], ['한글 문서(HWP) 읽기·만들기 안 됨', "'결과.hwp'로 적으면 경고만 나오고 속은 HTML 로 저장됨"],
    ['PDF 는 pdflatex 또는 typst 를 따로 설치', "그냥 .pdf 로 적으면 'pdflatex' not found 오류"], ['글꼴·색 꾸밈은 옮기지 않음 · 같은 이름은 덮어씀', '회사 양식은 --reference-doc · 원본은 따로 보관']];
  const cards = K.map((k, i) => { const b = box(110, 330 + i * 150, 1480, 132, 'card', { display: 'flex', alignItems: 'center', gap: '26px', padding: '0 30px' });
    el('div', null, { minWidth: '68px', height: '68px', borderRadius: '16px', background: C.red, color: '#fff', fontWeight: '900', fontSize: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, b, String(i + 1));
    const tx = el('div', null, {}, b); const h = el('div', null, { fontSize: '34px', fontWeight: '900', whiteSpace: 'nowrap' }, tx, M.esc(k[0])); el('div', null, { fontSize: '25px', fontWeight: '700', color: '#666' }, tx, M.esc(k[1])); return { b, h }; });
  const r1 = cards[1].h.getBoundingClientRect(), r3 = cards[3].h.getBoundingClientRect();
  const ring = pen(ellipsePath((r1.left + r1.right) / 2, (r1.top + r1.bottom) / 2 + 4, r1.width / 2 + 30, r1.height / 2 + 20), 6);
  const ul = pen(`M${r3.left - 6} ${r3.bottom + 2} C ${r3.left + r3.width * .4} ${r3.bottom - 4}, ${r3.left + r3.width * .7} ${r3.bottom + 6}, ${r3.right + 8} ${r3.bottom}`, 6);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    cards.forEach((k, i) => slideIn(k.b, t, c[i + 1] - .1, -500));
    ring.set(eOut(P(t, c[2] + .6, c[2] + 1.3))); ul.set(eOut(P(t, c[4] + .6, c[4] + 1.2)));
    nb.render(t, [{ at: c[1] + .4, a: 'enter' }, { at: c[2] + .6, a: 'pen' }, { at: c[3] + .5, a: 'oops' }, { at: c[4] + .6, a: 'pen' }]);
  };
};
// ---- 정리: 체크리스트 3줄(✓가 하나씩) ----
SCENES.summary = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['오늘', '내용', '*정리*']], [['pandoc', '='], ['*문서 통역사*']], [['워드', DOCX + '초,'], ['140쪽도', '*' + BIGS + '초*']], [['HWP', '안', '됨,'], ['원본은', '*따로 보관*']]]);
  const L = ['pandoc = 문서 통역사 (읽기 52가지 · 만들기 77가지)', `워드 ${DOCX}초 · 파워포인트 ${RES.md2pptx.slides}장 · ${RES.big.pages_lo}쪽 보고서 ${BIGS}초`, 'HWP 는 안 됨 · PDF 는 typst 따로 · 원본은 따로 보관'];
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
SCENES.end = S => ending(S, { name: 'pandoc · 문서 통역사', lines: [['다음에 또 멋진'], ['*오픈소스*', '소개하겠습니다!']], disclaimer: DISCLAIMER });

// ======================= 숏폼 · 과정 애니메이션 (세로 1080×1920 / 가로 1920×1080 둘 다) =======================
const NBX = S => S.V ? M.buddy(770, 168, .62) : M.buddy(1636, 548, .62);
const LY = S => S.V ? { x: 70, w: 940, y: 520 } : { x: 110, w: 1480, y: 340 };
SCENES.s_hook = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['메모장', '글이'], ['*워드*로', DOCX + '초?']], { size: S.V ? 80 : 78 });
  const md = doc(L.x, S.V ? 560 : 340, S.V ? L.w : 900, S.V ? 600 : 580, 'md', '회의록.md', { html: mdBody(S.V ? 30 : 26) });
  const q = el('div', null, { position: 'absolute', left: (S.V ? 760 : 1180) + 'px', top: (S.V ? 1180 : 420) + 'px', fontSize: S.V ? '220px' : '240px', fontWeight: '900', color: C.orange, textShadow: '6px 6px 0 #141414' }, null, '?');
  const nb = NBX(S);
  return t => {
    cap.render(t); dropIn(md.b, t, c0 + .3, -500, -3);
    const a = popIn(t, c0 + 2.4, .5); tf(q, 0, 0, a, (1 - a) * 30, a > 0 ? 1 : 0);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.4, a: 'look' }, { at: c0 + 3.0, a: 'point', dir: 'left' }]);
  };
};
SCENES.s_what = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['*pandoc*'], ['무료', '문서', '변환']]), caption(c1 - .1, null, [['명령', '한', '줄', '→'], ['*워드*', DOCX + '초']])];
  const tm = term(L.x, L.y, S.V ? L.w : 860, S.V ? 230 : 250, { fs: S.V ? 30 : 30 });
  const dx = doc(S.V ? L.x : 1010, S.V ? 790 : 340, S.V ? L.w : 580, S.V ? 680 : 590, 'docx', '회의록.docx', { img: 'img/docx.jpg' });
  const st = stamp(DOCX + '초', S.V ? 640 : 640, S.V ? 1380 : 640, 64);
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t)); const a = popIn(t, c0 + .2, .5); tf(tm.el, 0, (1 - a) * 300, 1, 0, a > 0 ? 1 : 0);
    tm.render(t, [{ at: c0 + .7, text: 'pandoc 회의록.md -o 회의록.docx', dur: 2.0 }]);
    slideIn(dx.b, t, c1 + .2, 500); st.render(t, c1 + 1.4);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.0, a: 'point', dir: 'left' }, { at: c1 + 1.4 - .35, a: 'stamp' }]);
  };
};
SCENES.s_conv = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['같은', '글', '→'], ['*발표 자료·전자책*']]), caption(c1 - .1, null, [['20만', '자', '→'], ['*' + RES.big.pages_lo + '쪽*', BIGS + '초']])];
  const W = S.V ? 455 : 470, H = S.V ? 270 : 270;
  const POS = S.V ? [[70, 520], [555, 520], [70, 810], [555, 810]] : [[110, 340], [600, 340], [110, 630], [600, 630]];
  const sl = POS.map((p, i) => doc(p[0], p[1], W, H, 'pptx', `${i + 1}장`, { img: `img/slide-${i + 1}.jpg`, fs: 22 }));
  const pc = box(S.V ? 70 : 1100, S.V ? 1120 : 340, S.V ? 940 : 500, S.V ? 330 : 560, 'card', { padding: '30px' });
  el('div', null, { fontSize: '30px', fontWeight: '800', color: '#666' }, pc, '가상 보고서 20만 자 → 워드');
  const pages = el('div', null, { fontSize: S.V ? '150px' : '140px', fontWeight: '900', color: C.orange, lineHeight: '1.2', textShadow: '5px 5px 0 #141414' }, pc, '0쪽');
  const st = stamp(BIGS + '초', S.V ? 640 : 1300, S.V ? 1300 : 740, 60);
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t));
    sl.forEach((k, i) => dropIn(k.b, t, c0 + .2 + i * .8, -500, i % 2 ? 3 : -3));
    dropIn(pc, t, c1 - .1, 500); count(pages, t, c1 + .4, RES.big.pages_lo, 1.6, v => Math.round(v) + '쪽'); st.render(t, c1 + 2.2);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 2.8, a: 'nod' }, { at: c1 + 2.2 - .35, a: 'stamp' }]);
  };
};
SCENES.s_limit = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['*HWP*는', '안', '됨,'], ['PDF는', '따로']]);
  const pills = [["✗ 한글 문서(HWP) 읽기·만들기", false], ["✗ .pdf 만 적으면 'pdflatex' 오류", false], ["✓ typst 설치 + 한글 글꼴 → PDF", true]]
    .map((p, i) => { const e = pill(p[0], p[1], L.x, (S.V ? 560 : 360) + i * (S.V ? 110 : 100), S.V ? L.w : 900, S.V ? 80 : 74); e.style.fontSize = S.V ? '34px' : '32px'; return e; });
  const hd = hand('원본은 따로 보관!', S.V ? 200 : 1050, S.V ? 1000 : 700, 56, -5);
  const nb = NBX(S);
  return t => {
    cap.render(t); pills.forEach((p, i) => pillRender(p, t, c0 + .4 + i * .9, i === 2)); hd.render(t, c0 + 3.4, .7);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + .8, a: 'oops' }, { at: c0 + 2.6, a: 'nod' }, { at: c0 + 3.4, a: 'pen' }]);
  };
};
SCENES.s_end = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['설치는'], ['*명령 한 줄*']]);
  const tm = term(L.x, S.V ? 560 : 360, S.V ? L.w : 880, S.V ? 250 : 220, { fs: S.V ? 30 : 28 });
  const nb = NBX(S); const rc = box(S.V ? L.x : 1060, S.V ? 860 : 360, S.V ? L.w : 540, 300, 'card', { padding: '34px 40px' });
  el('div', null, { fontSize: '32px', fontWeight: '800', color: '#666' }, rc, '일반인 쓸모 별점'); const sr = stars(40, 100, S.V ? 112 : 78, 4, 5, rc); half(sr);
  return t => { cap.render(t); const a = popIn(t, c0, .5); tf(tm.el, 0, (1 - a) * 200, 1, 0, a > 0 ? 1 : 0); tm.render(t, [{ at: c0 + .4, text: 'winget install --id JohnMacFarlane.Pandoc', dur: 1.6 }]);
    const b = popIn(t, c0 + 1.6, .5); tf(rc, 0, (1 - b) * 200, 1, 0, b > 0 ? 1 : 0); sr.render(t, c0 + 2.0);
    nb.render(t, [{ at: c0 + .2, a: 'enter' }, { at: c0 + .7, a: 'point', dir: 'left' }, { at: c0 + 2.6, a: 'happy' }]); };
};
