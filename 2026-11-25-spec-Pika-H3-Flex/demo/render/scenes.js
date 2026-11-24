// Pika H3 Flex 사양 체크 편 (2026-11-25) 모션 장면 — tools/motion 키트 (GUIDE 5-4·8장)
// 직접 실행하지 않음. 숫자는 data.js 의 SPEC(공식 자료 값)만 씀. 제작사 그림·데모 영상은 쓰지 않고 사양 카드·체크리스트만 그림
// 시간: 모두 S.cue(i) 기준. 롱폼 13개 장 + 숏폼 5장면 모두 직접 만듦, 엔딩 뺀 모든 장·장면에 냥봇
// 비유 하나: 그래픽카드 메모리(VRAM) = 작업대, 시스템 메모리(RAM) = 선반
const { C, P, eOut, eIO, eBack, lerp, popIn, out, shake, el, box, tf, caption, stamp, hand, pen, ellipsePath, arrowPath, count, term, pill, pillRender, stars, iconTile, ending } = M;
const DISCLAIMER = ['정보 제공용 · 그래픽카드가 필요해 직접 실행하지 않음 · 2026-11-25 공식 자료(README·hardware.md·LICENSE) 기준 정리',
  '모델 라이선스 제외 지역에 대한민국 포함 · 법률 판단은 전문가 확인 · 사양 숫자는 최소 요구 사양이 아닌 공식 대표 측정값'];
const SCENES = {};
const capsOf = (S, arr) => arr.map((L, i) => caption(S.cue(i) - .1, i < arr.length - 1 ? S.cue(i + 1) - .25 : null, L));
const NB = () => M.buddy(1636, 548, .62);
const fadeIn = (t, a, d = .5) => Math.min(1, popIn(t, a, d) * 2);
const dropIn = (e, t, a, dy = -500, r = 0) => { const k = popIn(t, a, .55); tf(e, 0, (1 - k) * dy, 1, (1 - k) * r, k > 0 ? 1 : 0); return k; };
const slideIn = (e, t, a, dx = -300) => { const k = popIn(t, a, .5); tf(e, (1 - k) * dx, 0, 1, 0, k > 0 ? Math.min(1, k * 2) : 0); return k; };
const chip = (s, x, y, css = {}) => el('div', 'chip', Object.assign({ left: x + 'px', top: y + 'px' }, css), null, s);
const rng = a => a[0] + '~' + a[1];

// 그래픽카드 카드 (어두운 카드 + 'H100 80GB')
function gpuCard(x, y, w, h, label = SPEC.gpu, sub = '공식 확인 그래픽카드 · 1장') {
  const b = box(x, y, w, h, 'card dark', { padding: '30px 34px' });
  const fan = el('div', null, { position: 'absolute', right: '34px', top: '34px', width: (h - 68) + 'px', height: (h - 68) + 'px', borderRadius: '50%', border: '6px solid #555', background: 'repeating-conic-gradient(#333 0 20deg, #222 20deg 40deg)' }, b);
  el('div', 'mono', { fontSize: '54px', fontWeight: '800', color: C.yellow }, b, M.esc(label));
  el('div', null, { fontSize: '28px', fontWeight: '700', color: '#ccc', marginTop: '10px' }, b, M.esc(sub));
  return { b, fan, spin(t) { fan.style.transform = `rotate(${t * 220}deg)`; } };
}
// 메모리 막대 (0~100GiB 눈금, 80GiB 선 = H100) — segs: [{v:[a,b], col, label}]
function memBar(x, y, w, title, max = 100) {
  const b = box(x, y, w, 210, 'card', { padding: '24px 30px' });
  el('div', null, { fontSize: '30px', fontWeight: '900' }, b, M.esc(title));
  const track = el('div', null, { position: 'absolute', left: '30px', right: '30px', top: '86px', height: '56px', background: '#eee', border: '4px solid #141414', borderRadius: '12px', overflow: 'hidden' }, b);
  const fill = el('div', null, { position: 'absolute', left: 0, top: 0, bottom: 0, width: '0', background: C.orange }, track);
  const rangeEl = el('div', null, { position: 'absolute', top: 0, bottom: 0, background: 'repeating-linear-gradient(45deg, rgba(0,0,0,.25) 0 8px, transparent 8px 16px)' }, track);
  const tw = w - 60; const mark = (v, txt, col) => { el('div', null, { position: 'absolute', left: (30 + tw * v / max - 2) + 'px', top: '76px', width: '4px', height: '76px', background: col }, b); el('div', null, { position: 'absolute', left: (30 + tw * v / max - 100) + 'px', top: '150px', width: '200px', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '22px', fontWeight: '800', color: col }, b, txt); };
  mark(80, '80GiB (H100)', C.red);
  const val = el('div', null, { position: 'absolute', right: '30px', top: '18px', fontSize: '40px', fontWeight: '900', color: C.orange }, b, '');
  return { b, render(t, t0, v, col = C.orange) { const k = eOut(P(t, t0, t0 + 1.6)); fill.style.width = (v[1] / max * 100 * k) + '%'; fill.style.background = col;
    rangeEl.style.left = (v[0] / max * 100) + '%'; rangeEl.style.width = ((v[1] - v[0]) / max * 100) + '%'; rangeEl.style.opacity = k >= 1 ? 1 : 0;
    val.textContent = k > 0 ? `${Math.round(v[0] * k)}~${Math.round(v[1] * k)}GiB` : ''; } };
}
// 표 줄 카드 (왼쪽 이름 · 오른쪽 값)
function rowCard(x, y, w, h, name, value, o = {}) {
  const b = box(x, y, w, h, 'card', { display: 'flex', alignItems: 'center', gap: '24px', padding: '0 28px', background: o.bg || '#fff' });
  if (o.icon) el('div', null, {}, b, iconTile(o.icon, 70));
  el('div', null, { fontSize: (o.fs || 32) - 4 + 'px', fontWeight: '800', color: '#666', minWidth: (o.nw || 220) + 'px' }, b, M.esc(name));
  const v = el('div', null, { fontSize: (o.fs || 32) + 'px', fontWeight: '900', whiteSpace: 'nowrap' }, b, value);
  return { b, v };
}

// ======================= 롱폼 =======================
SCENES.preview = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2);
  const caps = [caption(c0 - .1, c1 - .3, [['글', '한', '줄', '→'], ['*소리 붙은 영상*']]), caption(c1 - .1, c2 - .3, [['공식', '확인', '그래픽카드'], ['*H100 80GB*', '1장']]), caption(c2 - .1, null, [['라이선스', '제외', '지역에'], ['*대한민국*']])];
  const prompt = box(110, 340, 760, 200, 'card', { padding: '28px 34px' });
  el('div', null, { fontSize: '26px', fontWeight: '800', color: '#777' }, prompt, '넣는 글 (예시)');
  const pt = el('div', null, { fontSize: '36px', fontWeight: '900', marginTop: '10px' }, prompt, '');
  const PT = '"비 오는 골목, 우산 위로 빗소리"';
  const film = box(110, 580, 760, 330, 'card dark', { padding: '26px' });
  const frames = [0, 1, 2, 3].map(i => el('div', null, { position: 'absolute', left: (26 + i * 180) + 'px', top: '40px', width: '160px', height: '170px', borderRadius: '10px', background: ['#3b4a6b', '#4a5b7d', '#56688a', '#3e4e70'][i] }, film));
  const wave = el('canvas', null, { position: 'absolute', left: '26px', top: '230px' }, film); wave.width = 700; wave.height = 70; const wg = wave.getContext('2d');
  const gpu = gpuCard(940, 340, 660, 250);
  const lic = box(940, 640, 660, 270, 'card', { padding: '28px 34px' });
  el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, lic, '모델 라이선스 제외 지역');
  const ex = SPEC.excluded.map((n, i) => el('div', 'chip', { position: 'absolute', left: (34 + (i % 2) * 300) + 'px', top: (80 + Math.floor(i / 2) * 80) + 'px', fontSize: '30px', background: n === '대한민국' ? C.red : '#fff', color: n === '대한민국' ? '#fff' : C.ink }, lic, '✗ ' + n));
  const nb = NB();
  return t => {
    caps.forEach(c => c.render(t));
    dropIn(prompt, t, c0 - .1, -400); pt.textContent = PT.slice(0, Math.floor(P(t, c0 + .4, c0 + 2.2) * PT.length));
    dropIn(film, t, c0 + 2.3, 400); frames.forEach((f, i) => { f.style.opacity = fadeIn(t, c0 + 2.8 + i * .3); });
    wg.clearRect(0, 0, 700, 70); const wk = P(t, c0 + 3.4, c0 + 4.6); wg.fillStyle = C.yellow; for (let i = 0; i < 140 * wk; i++) { const h = 8 + 50 * Math.abs(Math.sin(i * .7) * Math.cos(i * .23)); wg.fillRect(i * 5, 35 - h / 2, 3, h); }
    dropIn(gpu.b, t, c1 - .1, -500); gpu.spin(t);
    dropIn(lic, t, c2 - .1, 500); ex.forEach((e, i) => { const a = popIn(t, c2 + .3 + i * .25, .4); tf(e, 0, 0, a, 0, a > 0 ? 1 : 0); });
    nb.render(t, [{ at: c0 + .5, a: 'enter' }, { at: c1 + .6, a: 'look' }, { at: c2 + 1.4, a: 'oops' }]);
  };
};
SCENES.title = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2);
  const tag = chip('사양 체크 · 2026.11.25', 110, 200, { background: C.ink, color: '#fff', fontSize: '30px' });
  const word = el('div', null, { position: 'absolute', left: '100px', top: '260px', fontSize: '170px', fontWeight: '900', letterSpacing: '-6px', lineHeight: '1' }, null, '');
  const letters = [...'Pika H3 Flex'].map(ch => el('span', null, { display: 'inline-block', whiteSpace: 'pre' }, word, ch));
  const q = el('div', null, { position: 'absolute', left: '110px', top: '460px', fontSize: '72px', fontWeight: '900', color: C.orange }, null, '내 PC로 돌아갈까?');
  const note = chip('직접 실행하지 않음 · 공식 자료 기준', 110, 580, { fontSize: '30px' });
  const io = [['글', 'file'], ['사진', 'image'], ['소리', 'music']].map((u, i) => { const c = box(110 + i * 330, 660, 300, 220, 'card', { padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }); el('div', null, {}, c, iconTile(u[1], 90)); el('div', null, { fontSize: '44px', fontWeight: '900' }, c, u[0]); return c; });
  const arrow = el('div', null, { position: 'absolute', left: '1100px', top: '720px', fontSize: '90px', fontWeight: '900', color: C.orange }, null, '→');
  const outc = box(1220, 640, 380, 260, 'card dark', { padding: '30px', color: '#fff' });
  el('div', null, { fontSize: '44px', fontWeight: '900' }, outc, '영상'); el('div', null, { fontSize: '32px', fontWeight: '800', color: C.yellow, marginTop: '14px' }, outc, '+ 소리 (동시)');
  const nb = NB();
  return t => {
    tf(tag, 0, 0, popIn(t, c0), 0, t > c0 ? 1 : 0);
    letters.forEach((l, i) => { const a = popIn(t, c0 + .3 + i * .06, .5); l.style.transform = `translateY(${(1 - a) * -260}px)`; l.style.opacity = a > 0 ? 1 : 0; });
    const qa = popIn(t, c1 - .1, .5); tf(q, 0, (1 - qa) * 40, qa, -2, qa > 0 ? 1 : 0); const na = popIn(t, c1 + .8, .45); tf(note, 0, 0, na, 0, na > 0 ? 1 : 0);
    io.forEach((c, i) => dropIn(c, t, c2 + i * .8, 400)); const aa = fadeIn(t, c2 + 2.4); tf(arrow, (1 - aa) * -40, 0, 1, 0, aa); dropIn(outc, t, c2 + 2.8, -400);
    nb.render(t, [{ at: c0 + .8, a: 'enter' }, { at: c0 + 1.4, a: 'wave' }, { at: c1 + .6, a: 'look' }, { at: c2 + 3.2, a: 'point', dir: 'left' }]);
  };
};
SCENES.why = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['왜', '*화제*입니까?']], [['10월 29일', '공개'], ['별', '*' + SPEC.stars + '*']], [['지난달', '내려받기'], ['*' + SPEC.hfDownloads.toLocaleString('en-US') + '번*']], [['영상', '서비스', '회사가'], ['*모델 파일*까지', '공개']]]);
  const gh = box(110, 340, 700, 250, 'card', { padding: '30px' });
  el('div', 'mono', { fontSize: '25px', fontWeight: '800', whiteSpace: 'nowrap' }, gh, 'github.com/Pika-Labs/Pika-H3-Flex');
  const st = el('div', null, { fontSize: '80px', fontWeight: '900', color: C.orange, marginTop: '16px' }, gh, '★ 0');
  el('div', null, { fontSize: '28px', fontWeight: '700', color: '#666' }, gh, `포크 ${SPEC.forks} · 공개 ${SPEC.released}`);
  const hf = box(110, 630, 700, 280, 'card', { padding: '30px' });
  el('div', null, { fontSize: '32px', fontWeight: '800' }, hf, 'Hugging Face 모델 페이지');
  const dl = el('div', null, { fontSize: '80px', fontWeight: '900', color: C.orange, marginTop: '16px' }, hf, '0');
  el('div', null, { fontSize: '28px', fontWeight: '700', color: '#666' }, hf, `지난달 내려받기 · 좋아요 ${SPEC.hfLikes}`);
  const open = box(870, 400, 720, 420, 'card', { padding: '40px', background: '#FFF8E1' });
  el('div', null, { fontSize: '40px', fontWeight: '900', marginBottom: '20px' }, open, '공개된 것');
  const items = [['실행 코드', 'Apache-2.0', true], ['모델 파일(어댑터)', 'MiniMax H3 라이선스', true], ['고화질 키우기 등', 'Pika 웹 서비스만', false]].map((r, i) => { const d = el('div', null, { display: 'flex', alignItems: 'center', gap: '18px', height: '84px', fontSize: '32px', fontWeight: '800' }, open);
    el('div', null, { width: '52px', height: '52px', borderRadius: '50%', background: r[2] ? C.green : '#999', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }, d, r[2] ? '✓' : '–'); el('div', null, { flex: '1' }, d, r[0]); el('div', null, { fontSize: '24px', color: '#666' }, d, r[1]); return d; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(gh, t, c[1] - .1, -400); count(st, t, c[1] + .3, 1600, 1.6, v => '★ ' + (v >= 1600 ? '1.6k' : Math.round(v)));
    dropIn(hf, t, c[2] - .1, 400); count(dl, t, c[2] + .3, SPEC.hfDownloads, 1.8);
    dropIn(open, t, c[3] - .1, -500); items.forEach((d, i) => { d.style.opacity = fadeIn(t, c[3] + .5 + i * .8); });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.2, a: 'point', dir: 'left' }, { at: c[2] + 1.8, a: 'nod' }, { at: c[3] + 2.5, a: 'happy' }]);
  };
};
SCENES.what = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['영상', '+', '소리를'], ['*한 번에*']], [['5~15초', '·'], ['*480p·768p*', '· 24장/초']], [['참고', '자료'], ['*최대 12개*']], [['바탕', '모델', '+', '어댑터'], ['*6단계*', '생성']], [['결과', '='], ['*MP4*', '+ JSON']]]);
  const out1 = box(110, 340, 760, 300, 'card dark', { padding: '26px' });
  const fr = [0, 1, 2, 3].map(i => el('div', null, { position: 'absolute', left: (26 + i * 180) + 'px', top: '30px', width: '160px', height: '150px', borderRadius: '10px', background: ['#3b4a6b', '#4a5b7d', '#56688a', '#3e4e70'][i] }, out1));
  const wv = el('canvas', null, { position: 'absolute', left: '26px', top: '200px' }, out1); wv.width = 700; wv.height = 70; const wg = wv.getContext('2d');
  const specs = [['길이', `${rng(SPEC.dur)}초`], ['화질', SPEC.res.join(' · ')], ['초당 장 수', SPEC.fps + '장'], ['화면 비율', SPEC.ratios + '가지 (21:9 ~ 9:21)'], ['소리', SPEC.audio]].map((r, i) => rowCard(110, 680 + i * 0, 760, 0, r[0], r[1]));
  specs.forEach(s => s.b.remove());
  const tbl = box(110, 670, 760, 240, 'card', { padding: '18px 28px' });
  const trs = [['길이', `${rng(SPEC.dur)}초`], ['화질', SPEC.res.join(' · ') + ' · 11가지 비율'], ['초당', SPEC.fps + '장 · 소리 ' + SPEC.audio]].map(r => { const d = el('div', null, { display: 'flex', height: '68px', alignItems: 'center', fontSize: '30px', fontWeight: '800' }, tbl); el('div', null, { width: '160px', color: '#777' }, d, r[0]); el('div', null, {}, d, r[1]); return d; });
  const refs = box(930, 340, 670, 300, 'card', { padding: '26px 30px' });
  el('div', null, { fontSize: '30px', fontWeight: '900', marginBottom: '14px' }, refs, '참고 자료 (Ref2VA)');
  const dots = []; for (let i = 0; i < 12; i++) dots.push(el('div', null, { position: 'absolute', left: (30 + (i % 6) * 100) + 'px', top: (80 + Math.floor(i / 6) * 100) + 'px', width: '80px', height: '80px', borderRadius: '14px', border: '4px solid #141414', background: i < 9 ? C.blue : i < 12 ? C.peach : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '900' }, refs, i < 9 ? '그림' : '영상·소리'));
  const base = box(930, 680, 670, 230, 'card', { padding: '26px 30px' });
  el('div', null, { fontSize: '30px', fontWeight: '900' }, base, `바탕: MiniMax-H3 (${SPEC.params})`);
  el('div', null, { fontSize: '28px', fontWeight: '800', color: C.orange, margin: '10px 0' }, base, '+ Pika 어댑터 2개 (FL2VA · Ref2VA)');
  const steps = [1, 2, 3, 4, 5, 6].map(i => el('div', null, { display: 'inline-block', width: '70px', height: '50px', marginRight: '12px', borderRadius: '10px', border: '4px solid #141414', textAlign: 'center', fontSize: '28px', fontWeight: '900', lineHeight: '42px' }, base, String(i)));
  const mp4 = chip('결과.mp4 (H.264 + AAC) · 생성정보.json', 930, 600, { fontSize: '28px', background: C.ink, color: '#fff' });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(out1, t, c[0] - .1, -400); fr.forEach((f, i) => { f.style.opacity = fadeIn(t, c[0] + .4 + i * .25); });
    wg.clearRect(0, 0, 700, 70); const wk = P(t, c[0] + 1.2, c[0] + 2.4); wg.fillStyle = C.yellow; for (let i = 0; i < 140 * wk; i++) { const h = 8 + 50 * Math.abs(Math.sin(i * .7) * Math.cos(i * .23)); wg.fillRect(i * 5, 35 - h / 2, 3, h); }
    dropIn(tbl, t, c[1] - .1, 400); trs.forEach((d, i) => { d.style.opacity = fadeIn(t, c[1] + .3 + i * .8); });
    const ro = eIO(P(t, c[3] - .3, c[3] + .1));
    dropIn(refs, t, c[2] - .1, -400); dots.forEach((d, i) => { const a = popIn(t, c[2] + .4 + i * .12, .4); tf(d, 0, 0, a, 0, a > 0 ? 1 - ro * .5 : 0); });
    dropIn(base, t, c[3] - .1, 400); steps.forEach((s, i) => { const on = t > c[3] + .6 + i * .35; s.style.background = on ? C.yellow : '#fff'; });
    const m = popIn(t, c[4] + .1, .45); tf(mp4, 0, (1 - m) * 30, m, 0, m > 0 ? 1 : 0);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'point', dir: 'left' }, { at: c[3] + 2.4, a: 'nod' }, { at: c[4] + .6, a: 'happy' }]);
  };
};
SCENES.spec = S => {
  const c = [0, 1, 2, 3, 4, 5].map(S.cue);
  const caps = capsOf(S, [[['필요', '사양'], ['*공식 자료*로']], [['확인된', '그래픽카드'], ['*H100 80GB*', '1장']], [['480p·5초'], ['*' + rng(SPEC.std) + 'GiB*']], [['768p·15초는'], ['*H100도 넘침*']], [['요청', '하나'], ['= *그래픽카드 1장*']], [['최소', '사양이', '아닌'], ['*대표 측정값*']]]);
  const gpu = gpuCard(110, 340, 760, 230);
  const nq = chip('H200 · B300: 미확인', 110, 600, { fontSize: '28px' });
  const bar = memBar(110, 680, 1480, '그래픽카드 메모리 (GiB) — 공식 대표 측정값');
  const over = el('div', null, { position: 'absolute', left: '920px', top: '360px', width: '670px', padding: '26px 30px', fontSize: '34px', fontWeight: '900', background: '#FDE2DC', border: '4px solid #141414', borderRadius: '22px', boxShadow: '9px 9px 0 #141414' }, null, '768p · 15초<br><span style="color:#E5482D">기본 설정: H100 메모리 초과</span><br><span style="font-size:28px">→ --cpu-offload 로 나눠 쓰기</span>');
  const one = el('div', null, { position: 'absolute', left: '920px', top: '590px', fontSize: '32px', fontWeight: '900' }, null, '요청 1개 = 그래픽카드 1장 (나눠 돌리기 ✗)');
  const hd = hand('최소 요구 사양 아님!', 1000, 290, 44, -4);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(gpu.b, t, c[1] - .1, -500); gpu.spin(t); const n = popIn(t, c[1] + 1.4, .4); tf(nq, 0, 0, n, 0, n > 0 ? 1 : 0);
    dropIn(bar.b, t, c[2] - .1, 400); bar.render(t, c[2] + .3, SPEC.std);
    const o = popIn(t, c[3] - .05, .5); tf(over, 0, (1 - o) * -300 + shake(t, c[3] + .7, .35, 6), 1, (1 - o) * 4, o > 0 ? 1 : 0);
    one.style.opacity = fadeIn(t, c[4] + .1);
    hd.render(t, c[5] + .5, .8);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[2] + 1.9, a: 'point', dir: 'left' }, { at: c[3] + .6, a: 'oops' }, { at: c[5] + .5, a: 'pen' }]);
  };
};
SCENES.memory = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['그래픽카드', '메모리', '='], ['*작업대*']], [['재료를', '다', '올리면'], ['*' + rng(SPEC.std) + 'GiB*']], [['선반에', '두고', '꺼내', '쓰면'], ['*' + rng(SPEC.off) + 'GiB*']], [['대신', '선반(RAM)'], ['*약 ' + SPEC.offRam + 'GiB*']], [['가벼운', '공식', '버전'], ['*안내 없음*']]]);
  const desk = box(110, 360, 900, 330, 'card', { background: '#FFF8E1', padding: '26px', zIndex: '3' });
  el('div', null, { fontSize: '30px', fontWeight: '900' }, desk, '작업대 = 그래픽카드 메모리(VRAM)');
  const blocks = []; for (let i = 0; i < 12; i++) blocks.push(el('div', null, { position: 'absolute', left: (30 + (i % 6) * 140) + 'px', top: (90 + Math.floor(i / 6) * 110) + 'px', width: '120px', height: '90px', borderRadius: '12px', border: '4px solid #141414', background: [C.orange, C.yellow, '#8EC5FF'][i % 3] }, desk));
  const shelf = box(1050, 360, 540, 330, 'card', { background: C.lilac, padding: '26px' });
  el('div', null, { fontSize: '30px', fontWeight: '900' }, shelf, '선반 = 시스템 메모리(RAM)');
  const ram = el('div', null, { position: 'absolute', left: '26px', bottom: '26px', fontSize: '64px', fontWeight: '900', color: C.orange }, shelf, '');
  const b1 = memBar(110, 720, 720, '다 올리기 (480p·5초)'), b2 = memBar(870, 720, 720, '--cpu-offload (768p·15초)');
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(desk, t, c[0] - .1, -400); dropIn(shelf, t, c[0] + .8, -400);
    const move = eIO(P(t, c[2] + .2, c[2] + 1.6));
    blocks.forEach((b, i) => { const a = popIn(t, c[1] + i * .1, .4); const mv = i >= 5 ? move : 0, j = i - 5; const dx = 1080 + (j % 4) * 110 - (140 + (i % 6) * 140), dy = 418 + Math.floor(j / 4) * 66 - (450 + Math.floor(i / 6) * 110); tf(b, mv * dx, mv * dy, lerp(1, .55, mv), 0, a > 0 ? 1 : 0); });
    dropIn(b1.b, t, c[1] + .2, 300); b1.render(t, c[1] + .6, SPEC.std);
    dropIn(b2.b, t, c[2] + .2, 300); b2.render(t, c[2] + .6, SPEC.off, C.green);
    count(ram, t, c[3] + .2, SPEC.offRam, 1.6, v => '약 ' + Math.round(v) + 'GiB'); ram.style.opacity = t > c[3] ? 1 : 0;
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[2] + .8, a: 'point', dir: 'left' }, { at: c[3] + 1.0, a: 'look' }, { at: c[4] + .6, a: 'oops' }]);
  };
};
SCENES.disk = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['저장', '공간'], ['*' + SPEC.disk + 'GB*', '이상']], [['내려받기', '공간은'], ['*따로*']], [['파이썬', '3.12'], ['운영체제 *표기 없음*']], [['Windows', '설치', '안내', '없음'], ['*ComfyUI* 안내는 있음']], [['생성', '시간'], ['*공개된 측정값 없음*']]]);
  const dk = box(110, 340, 820, 340, 'card', { padding: '30px' });
  el('div', null, { fontSize: '30px', fontWeight: '900' }, dk, '저장 공간 (공식 hardware.md)');
  const tr = el('div', null, { position: 'absolute', left: '30px', right: '30px', top: '100px', height: '70px', border: '4px solid #141414', borderRadius: '12px', background: '#eee', overflow: 'hidden' }, dk);
  const f1 = el('div', null, { position: 'absolute', left: 0, top: 0, bottom: 0, background: C.orange }, tr), f2 = el('div', null, { position: 'absolute', top: 0, bottom: 0, background: C.yellow }, tr);
  const dv = el('div', null, { position: 'absolute', left: '30px', top: '190px', fontSize: '60px', fontWeight: '900', color: C.orange }, dk, '0GB');
  el('div', null, { position: 'absolute', left: '30px', right: '30px', top: '262px', fontSize: '23px', fontWeight: '700', color: '#666', lineHeight: '1.4' }, dk, `바탕 모델 ${SPEC.disk}GB 이상 + 어댑터 약 ${SPEC.adapters}GB<br>+ 함께 설치되는 프로그램·내려받기 공간 따로`);
  const rows = [['파이썬', SPEC.python], ['그래픽카드 드라이버', 'NVIDIA (버전 표기 없음)'], ['운영체제', '공식 표기 없음'], ['Windows 안내', '없음 (ComfyUI 안내는 있음)'], ['생성 시간', '공개된 측정값 없음']].map((r, i) => rowCard(980, 340 + i * 116, 610, 100, r[0], M.esc(r[1]), { fs: 26, nw: 190 }));
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(dk, t, c[0] - .1, -400); const k = eOut(P(t, c[0] + .4, c[0] + 2.0)); f1.style.width = (k * 211 / 230 * 100) + '%'; f2.style.left = (211 / 230 * 100) + '%'; f2.style.width = (eOut(P(t, c[0] + 2, c[0] + 2.5)) * 5.5 / 230 * 100) + '%';
    dv.textContent = Math.round(k * SPEC.disk) + 'GB 이상';
    const at = [c[2], c[2] + .8, c[2] + 1.6, c[3], c[4]]; rows.forEach((r, i) => slideIn(r.b, t, at[i] - .05, 400));
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 2.3, a: 'oops' }, { at: c[3] + .5, a: 'look' }, { at: c[4] + .6, a: 'oops' }]);
  };
};
SCENES.license = S => {
  const c = [0, 1, 2, 3, 4, 5].map(S.cue);
  const caps = capsOf(S, [[['한국에서', '써도'], ['*됩니까?*']], [['코드와', '모델', '파일'], ['*라이선스가 다름*']], [['코드는', '자유,'], ['핵심은 *모델 파일*']], [['제외', '지역에'], ['*대한민국*']], [['제외', '지역은'], ['*허락 안 됨*', '→ 문의']], [['매출', '큰', '회사는'], ['*사전 허가*']]]);
  const code = box(110, 340, 700, 200, 'card', { padding: '28px' }); el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, code, '실행 코드'); el('div', null, { fontSize: '50px', fontWeight: '900', color: C.green }, code, 'Apache-2.0');
  const wt = box(110, 570, 700, 340, 'card', { padding: '28px' }); el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, wt, '모델 파일(가중치)'); el('div', null, { fontSize: '40px', fontWeight: '900' }, wt, 'MiniMax H3 Community License'); el('div', null, { fontSize: '26px', fontWeight: '700', color: '#666', marginTop: '10px' }, wt, `라이선스 날짜 ${SPEC.licDate} · 홍콩 법 적용`);
  const ex = box(870, 340, 720, 360, 'card', { padding: '28px' }); el('div', null, { fontSize: '30px', fontWeight: '900' }, ex, '제외 지역 (Excluded Territories)');
  const chips = SPEC.excluded.map((n, i) => el('div', 'chip', { position: 'absolute', left: (28 + (i % 2) * 340) + 'px', top: (100 + Math.floor(i / 2) * 110) + 'px', fontSize: '36px', padding: '16px 28px', background: n === '대한민국' ? C.red : '#fff', color: n === '대한민국' ? '#fff' : C.ink }, ex, '✗ ' + n));
  const rest = el('div', null, { position: 'absolute', left: '900px', top: '730px', width: '690px', fontSize: '28px', fontWeight: '800', lineHeight: '1.6' }, null, `· ${SPEC.revenue} → MiniMax 사전 서면 허가<br>· 상업 화면에 'MiniMax H3' 표시<br>· 법률 판단은 전문가 확인`);
  const r = chips[2].getBoundingClientRect(); const ring = pen(ellipsePath(r.left + r.width / 2, r.top + r.height / 2, r.width / 2 + 26, r.height / 2 + 18), 7);
  const st = stamp('한국 제외', 1300, 600, 50, -10);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(code, t, c[1] - .1, -400); dropIn(wt, t, c[1] + .7, 400);
    const hl = eOut(P(t, c[2] + .3, c[2] + .8)); wt.style.boxShadow = `9px 9px 0 #141414, 0 0 0 ${hl * 8}px ${C.yellow}`;
    dropIn(ex, t, c[3] - .1, -500); chips.forEach((e, i) => { const a = popIn(t, c[3] + .5 + i * .3, .4); tf(e, 0, 0, a, 0, a > 0 ? 1 : 0); });
    ring.set(eOut(P(t, c[3] + 2.0, c[3] + 2.6))); st.render(t, c[4] + .4);
    rest.style.opacity = fadeIn(t, c[5] + .1);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 1.0, a: 'look' }, { at: c[3] + 2.0, a: 'oops' }, { at: c[4] + .4 - .35, a: 'stamp' }]);
  };
};
SCENES.try = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['설치', '없이'], ['*볼 수 있는 곳*']], [['①', 'Pika', 'API', '놀이터'], ['② *create.pika.art*']], [['③', 'Hugging Face', 'Space'], ['④ *ComfyUI* 안내']], [['고화질', '키우기는'], ['*웹 서비스* 기능']], [['요금·이용', '지역은'], ['*각 페이지 확인*']]]);
  const L = [['① Pika API 놀이터', 'dev.pika.art (README "Try it now")'], ['② Pika 웹사이트', 'create.pika.art'], ['③ Hugging Face Space', 'spaces/Pika-Labs/pika-h3-flex'], ['④ ComfyUI 공식 안내', 'docs.comfy.org (워크플로 견본)']];
  const cards = L.map((l, i) => { const b = box(110 + (i % 2) * 750, 340 + Math.floor(i / 2) * 200, 720, 170, 'card', { padding: '24px 30px' }); el('div', null, { fontSize: '38px', fontWeight: '900' }, b, M.esc(l[0])); el('div', 'mono', { fontSize: '24px', color: '#666', marginTop: '10px' }, b, M.esc(l[1])); return b; });
  const ext = chip('1080p · 2K · 4K 키우기 · 소리 나누기 → Pika API(웹 서비스)', 110, 760, { fontSize: '30px', background: C.ink, color: '#fff' });
  const warn = chip('⚠ 공식 페이지에 가격 표기 없음 · 이용 지역 조건 확인', 110, 850, { fontSize: '30px', background: '#FDE2DC' });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    const at = [c[1], c[1] + .9, c[2], c[2] + .9]; cards.forEach((b, i) => dropIn(b, t, at[i] - .05, -400, i % 2 ? 3 : -3));
    const e = popIn(t, c[3] + .1, .45); tf(ext, 0, (1 - e) * 30, e, 0, e > 0 ? 1 : 0);
    const w = popIn(t, c[4] + .1, .45); tf(warn, shake(t, c[4] + .5, .3, 5), (1 - w) * 30, w, 0, w > 0 ? 1 : 0);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + .6, a: 'point', dir: 'left' }, { at: c[2] + 1.0, a: 'nod' }, { at: c[4] + .5, a: 'oops' }]);
  };
};
SCENES.check = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['내', '사양', '*확인법*']], [['작업', '관리자', '→', '성능'], ['*전용 GPU 메모리*']], [['메모리', '=', 'RAM'], ['*내 PC* = 저장 공간']], [['공식', '측정값과'], ['*비교*']], [['NVIDIA라면'], ['*nvidia-smi*']]]);
  const tm = box(110, 340, 900, 540, 'card', { padding: '0', overflow: 'hidden' });
  el('div', null, { background: '#dfe6ee', fontSize: '26px', fontWeight: '800', padding: '12px 22px' }, tm, '작업 관리자 (Ctrl + Shift + Esc) → 성능 (그림 예시)');
  const side = ['CPU', '메모리', '디스크', 'GPU 0'].map((s, i) => el('div', null, { position: 'absolute', left: '20px', top: (80 + i * 100) + 'px', width: '220px', height: '80px', borderRadius: '10px', fontSize: '30px', fontWeight: '800', display: 'flex', alignItems: 'center', paddingLeft: '20px' }, tm, s));
  const pane = el('div', null, { position: 'absolute', left: '280px', top: '80px', right: '20px', bottom: '20px', fontSize: '32px', fontWeight: '800', lineHeight: '1.8' }, tm, '');
  const cmp = box(1050, 340, 540, 540, 'card', { padding: '26px 30px' });
  el('div', null, { fontSize: '30px', fontWeight: '900', marginBottom: '10px' }, cmp, '공식 측정값');
  const R = [['작업대(VRAM)', `${rng(SPEC.off)}GiB ~ ${rng(SPEC.std)}GiB`], ['선반(RAM)', `약 ${SPEC.offRam}GiB (오프로드)`], ['저장 공간', `${SPEC.disk}+${SPEC.adapters}GB 이상`]].map(r => { const d = el('div', null, { padding: '16px 0', borderBottom: '3px dashed #ddd' }, cmp); el('div', null, { fontSize: '24px', color: '#666', fontWeight: '800' }, d, r[0]); el('div', null, { fontSize: '34px', fontWeight: '900' }, d, r[1]); return d; });
  const smi = el('div', 'mono', { position: 'absolute', left: '110px', top: '900px', fontSize: '28px', background: C.termBg, color: '#EDEDED', padding: '10px 20px', borderRadius: '12px' }, null, 'C:\\> nvidia-smi   → "… MiB / 전체MiB"');
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(tm, t, c[0] - .1, -400);
    const sel = t < c[2] ? 3 : 1; side.forEach((s, i) => { s.style.background = t > c[1] && i === sel ? C.yellow : 'transparent'; });
    pane.innerHTML = t < c[1] ? '' : t < c[2] ? '전용 GPU 메모리<br><span style="color:#FF5A1F;font-size:56px">? GB</span>' : '메모리(RAM)<br><span style="color:#FF5A1F;font-size:56px">? GB</span><br>내 PC → 남은 저장 공간';
    dropIn(cmp, t, c[3] - .1, 400); R.forEach((d, i) => { d.style.opacity = fadeIn(t, c[3] + .4 + i * .8); });
    const s = popIn(t, c[4] + .1, .45); tf(smi, 0, 0, 1, 0, s > 0 ? 1 : 0);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + .6, a: 'point', dir: 'left' }, { at: c[3] + 2.0, a: 'look' }, { at: c[4] + .6, a: 'nod' }]);
  };
};
SCENES.fit = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['맞는', '곳'], ['*데이터센터급*', '그래픽카드']], [['일반', '가정용', 'PC'], ['*맞지 않음*']], [['한국에서는'], ['*소식·사양만*', '참고']], [['결과가', '궁금하면'], ['*공식 놀이터*부터']]]);
  const ok = box(110, 340, 720, 560, 'card', { padding: '30px', background: C.mint });
  el('div', null, { fontSize: '40px', fontWeight: '900', color: C.green }, ok, '✓ 맞는 곳');
  el('div', null, { fontSize: '30px', fontWeight: '800', lineHeight: '1.7', marginTop: '16px' }, ok, `· H100 80GB급 그래픽카드<br>· RAM 넉넉한 서버 (오프로드 약 ${SPEC.offRam}GiB)<br>· 저장 공간 ${SPEC.disk}GB 이상<br>· 라이선스 제외 지역 밖`);
  const ng = box(870, 340, 720, 560, 'card', { padding: '30px', background: '#FDE2DC' });
  el('div', null, { fontSize: '40px', fontWeight: '900', color: C.red }, ng, '✗ 아직 아닌 경우');
  const ngl = el('div', null, { fontSize: '30px', fontWeight: '800', lineHeight: '1.7', marginTop: '16px' }, ng, '· 일반 가정용 PC<br>· Windows 설치 프로그램을 찾는 사람<br>· 한국에서 바로 쓰려는 사람 (제외 지역)');
  const hd = hand('→ 공식 놀이터 · 이용 조건 먼저!', 900, 800, 40, -4);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(ok, t, c[0] - .1, -400); dropIn(ng, t, c[1] - .1, 400); ngl.style.opacity = 1;
    const k = eOut(P(t, c[2] + .2, c[2] + .7)); ng.style.boxShadow = `9px 9px 0 #141414, 0 0 0 ${k * 8}px ${C.yellow}`;
    hd.render(t, c[3] + .3, .8);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + .6, a: 'oops' }, { at: c[2] + .6, a: 'look' }, { at: c[3] + .5, a: 'pen' }]);
  };
};
SCENES.summary = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['오늘', '내용', '*정리*']], [['글·사진', '→'], ['*소리 붙은 영상*']], [['H100', '80GB', '·'], ['*' + rng(SPEC.std) + 'GiB*']], [['제외', '지역에'], ['*대한민국*']]]);
  const L = [`글·사진·소리 → 소리 붙은 영상 ${rng(SPEC.dur)}초 (${SPEC.res.join('·')})`, `H100 80GB 확인 · ${rng(SPEC.std)}GiB · 오프로드 ${rng(SPEC.off)}GiB + RAM ${SPEC.offRam}GiB · ${SPEC.disk}GB 이상`, '모델 라이선스 제외 지역: EU · 영국 · 대한민국 · 미국'];
  const cd = box(110, 340, 1480, 540, 'card', { padding: '40px 50px' });
  const rows = L.map((s, i) => { const r = el('div', null, { display: 'flex', alignItems: 'center', gap: '30px', height: '150px', borderBottom: i < 2 ? '3px dashed #ddd' : 'none' }, cd);
    const b = el('div', null, { minWidth: '76px', height: '76px', border: '5px solid #141414', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '58px', fontWeight: '900', color: i === 2 ? C.red : C.green }, r, '');
    el('div', null, { fontSize: '36px', fontWeight: '900', whiteSpace: 'nowrap' }, r, M.esc(s)); return { r, b, i }; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t)); dropIn(cd, t, c[0] + .2, 400);
    rows.forEach((k, i) => { k.r.style.opacity = fadeIn(t, c[i + 1] - .1); const on = t > c[i + 1] + .5; k.b.textContent = on ? (i === 2 ? '!' : '✓') : ''; k.b.style.transform = `scale(${on ? popIn(t, c[i + 1] + .5, .4) : 1})`; });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'nod' }, { at: c[2] + 1.0, a: 'nod' }, { at: c[3] + 1.0, a: 'oops' }]);
  };
};
SCENES.end = S => ending(S, { name: 'Pika H3 Flex · 사양 체크', lines: [['다음에 또 멋진'], ['*오픈소스*', '소개하겠습니다!']], disclaimer: DISCLAIMER });

// ======================= 숏폼 (세로 1080×1920 / 가로 1920×1080) =======================
const NBX = S => S.V ? M.buddy(770, 168, .62) : M.buddy(1636, 548, .62);
const LY = S => S.V ? { x: 70, w: 940, y: 520 } : { x: 110, w: 1480, y: 340 };
SCENES.s_hook = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['소리까지', '만드는'], ['영상 AI,'], ['*내 PC로*', '돌아갈까?']], { size: S.V ? 76 : 70 });
  const film = box(L.x, S.V ? 640 : 380, S.V ? L.w : 900, S.V ? 520 : 480, 'card dark', { padding: '30px' });
  const fr = [0, 1, 2, 3].map(i => el('div', null, { position: 'absolute', left: (30 + i * (S.V ? 220 : 210)) + 'px', top: '40px', width: (S.V ? 200 : 190) + 'px', height: (S.V ? 240 : 220) + 'px', borderRadius: '12px', background: ['#3b4a6b', '#4a5b7d', '#56688a', '#3e4e70'][i] }, film));
  const wv = el('canvas', null, { position: 'absolute', left: '30px', top: S.V ? '320px' : '290px' }, film); wv.width = (S.V ? L.w : 900) - 60; wv.height = 120; const wg = wv.getContext('2d');
  const q = el('div', null, { position: 'absolute', left: (S.V ? 780 : 1150) + 'px', top: (S.V ? 1200 : 420) + 'px', fontSize: '220px', fontWeight: '900', color: C.orange, textShadow: '6px 6px 0 #141414' }, null, '?');
  const nb = NBX(S);
  return t => {
    cap.render(t); dropIn(film, t, c0 + .2, 400); fr.forEach((f, i) => { f.style.opacity = fadeIn(t, c0 + .6 + i * .25); });
    wg.clearRect(0, 0, wv.width, 120); const wk = P(t, c0 + 1.4, c0 + 2.8); wg.fillStyle = C.yellow; for (let i = 0; i < wv.width / 6 * wk; i++) { const h = 10 + 90 * Math.abs(Math.sin(i * .7) * Math.cos(i * .23)); wg.fillRect(i * 6, 60 - h / 2, 4, h); }
    const a = popIn(t, c0 + 3.0, .5); tf(q, 0, 0, a, (1 - a) * 30, a > 0 ? 1 : 0);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.5, a: 'look' }, { at: c0 + 3.1, a: 'point', dir: 'left' }]);
  };
};
SCENES.s_spec = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['공식', '확인'], ['*H100 80GB*', '1장']]), caption(c1 - .1, null, [['나눠', '써도'], ['*' + rng(SPEC.off) + 'GiB*', '+ RAM']])];
  const gpu = gpuCard(L.x, L.y, S.V ? L.w : 720, 220);
  const W = S.V ? L.w : 1480;
  const b1 = memBar(L.x, S.V ? 790 : 600, S.V ? W : 720, `${SPEC.stdShape} · 다 올리기`), b2 = memBar(S.V ? L.x : 870, S.V ? 1040 : 600, S.V ? W : 720, `${SPEC.offShape} · 나눠 쓰기`);
  const ram = chip(`+ RAM 약 ${SPEC.offRam}GiB`, S.V ? L.x : 870, S.V ? 1290 : 830, { fontSize: '40px', padding: '14px 30px', background: C.ink, color: '#fff' });
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t)); dropIn(gpu.b, t, c0 - .05, -400); gpu.spin(t);
    dropIn(b1.b, t, c0 + 1.2, 300); b1.render(t, c0 + 1.6, SPEC.std);
    dropIn(b2.b, t, c1 - .05, 300); b2.render(t, c1 + .3, SPEC.off, C.green);
    const r = popIn(t, c1 + 2.2, .45); tf(ram, 0, (1 - r) * 30, r, 0, r > 0 ? 1 : 0);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 2.6, a: 'oops' }, { at: c1 + 2.4, a: 'point', dir: 'left' }]);
  };
};
SCENES.s_disk = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['저장', '공간'], ['*' + SPEC.disk + 'GB*', '이상']]), caption(c1 - .1, null, [['가벼운', '공식', '버전'], ['*안내 없음*']])];
  const W = S.V ? L.w : 1000;
  const dk = box(L.x, L.y, W, 300, 'card', { padding: '30px' });
  const tr = el('div', null, { position: 'absolute', left: '30px', right: '30px', top: '40px', height: '90px', border: '4px solid #141414', borderRadius: '14px', background: '#eee', overflow: 'hidden' }, dk);
  const f1 = el('div', null, { position: 'absolute', left: 0, top: 0, bottom: 0, background: C.orange }, tr);
  const dv = el('div', null, { position: 'absolute', left: '30px', top: '160px', fontSize: '80px', fontWeight: '900', color: C.orange }, dk, '0GB');
  const R = [['생성 시간', '공개된 측정값 없음'], ['가벼운 버전', '공식 안내 없음'], ['Windows 설치 안내', '없음']].map((r, i) => rowCard(L.x, (S.V ? 880 : 680) + i * (S.V ? 130 : 0), S.V ? W : 0, 110, r[0], r[1], { fs: 34, nw: 260 }));
  if (!S.V) R.forEach((r, i) => { r.b.style.left = (110 + i * 500) + 'px'; r.b.style.width = '470px'; r.b.style.top = '700px'; });
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t)); dropIn(dk, t, c0 - .05, -400); const k = eOut(P(t, c0 + .4, c0 + 2.2)); f1.style.width = (k * 92) + '%'; dv.textContent = Math.round(k * SPEC.disk) + 'GB 이상';
    R.forEach((r, i) => slideIn(r.b, t, (i === 0 ? c0 + 2.4 : c1 + .2 + (i - 1) * .8), 400));
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 2.3, a: 'oops' }, { at: c1 + 1.0, a: 'look' }]);
  };
};
SCENES.s_license = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['라이선스', '제외', '지역'], ['*대한민국*']]), caption(c1 - .1, null, [['따로', '문의', '전까지'], ['*사용 허락 없음*']])];
  const W = S.V ? L.w : 1000;
  const ex = box(L.x, L.y, W, S.V ? 560 : 460, 'card', { padding: '30px' });
  el('div', null, { fontSize: '34px', fontWeight: '900' }, ex, 'MiniMax H3 라이선스 제외 지역');
  const chips = SPEC.excluded.map((n, i) => el('div', 'chip', { position: 'absolute', left: (30 + (i % 2) * (W / 2)) + 'px', top: (110 + Math.floor(i / 2) * (S.V ? 200 : 150)) + 'px', fontSize: S.V ? '44px' : '38px', padding: '18px 30px', background: n === '대한민국' ? C.red : '#fff', color: n === '대한민국' ? '#fff' : C.ink }, ex, '✗ ' + n));
  const r = chips[2].getBoundingClientRect(); const ring = pen(ellipsePath(r.left + r.width / 2, r.top + r.height / 2, r.width / 2 + 28, r.height / 2 + 20), 7);
  const st = stamp('문의 필요', S.V ? 600 : 1200, S.V ? 1130 : 420, 60, -10);
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t)); dropIn(ex, t, c0 - .05, -400); chips.forEach((e, i) => { const a = popIn(t, c0 + .5 + i * .3, .4); tf(e, 0, 0, a, 0, a > 0 ? 1 : 0); });
    ring.set(eOut(P(t, c0 + 2.0, c0 + 2.6))); st.render(t, c1 + .5);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 2.0, a: 'oops' }, { at: c1 + .5 - .35, a: 'stamp' }]);
  };
};
SCENES.s_end = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['내', '사양은'], ['*작업 관리자*']]);
  const W = S.V ? L.w : 1000;
  const tm = box(L.x, L.y, W, S.V ? 600 : 500, 'card', { padding: '0', overflow: 'hidden' });
  el('div', null, { background: '#dfe6ee', fontSize: '28px', fontWeight: '800', padding: '14px 24px' }, tm, 'Ctrl + Shift + Esc → 성능 → GPU');
  const line = el('div', null, { padding: '40px 30px', fontSize: '44px', fontWeight: '900', lineHeight: '1.6' }, tm, `전용 GPU 메모리 <span style="color:#FF5A1F">? GB</span><br><span style="font-size:32px;color:#666">비교: 공식 ${rng(SPEC.off)} ~ ${rng(SPEC.std)}GiB</span>`);
  const nb = NBX(S);
  return t => { cap.render(t); dropIn(tm, t, c0, 300); line.style.opacity = fadeIn(t, c0 + .6); nb.render(t, [{ at: c0 + .2, a: 'enter' }, { at: c0 + .8, a: 'point', dir: 'left' }, { at: c0 + 2.6, a: 'happy' }]); };
};
