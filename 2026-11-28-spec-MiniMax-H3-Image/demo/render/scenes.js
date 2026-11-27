// MiniMax-H3-Image 사양 체크 편 (2026-11-28) 모션 장면 — tools/motion 키트 (GUIDE 5-4·8장)
// 직접 실행하지 않음. 숫자는 data.js 의 SPEC(공식 자료 값)만 씀. 제작사 그림·데모 이미지는 쓰지 않고 사양 카드·체크리스트만 그림
// 시간: 모두 S.cue(i) 기준. 롱폼 13개 장 + 숏폼 5장면 모두 직접 만듦, 엔딩 뺀 모든 장·장면에 냥봇
// 비유 하나: 그래픽카드 메모리(VRAM) = 작업대 — 큰 재료 두 덩이(글 읽는 부분·그림 본체)가 80GB 작업대에 같이 안 올라가 번갈아 올림, 쉬는 덩이는 선반(RAM)
const { C, P, eOut, eIO, eBack, lerp, popIn, out, shake, el, box, tf, caption, stamp, hand, pen, ellipsePath, arrowPath, count, term, pill, pillRender, stars, iconTile, ending } = M;
const DISCLAIMER = ['정보 제공용 · 그래픽카드가 필요해 직접 실행하지 않음 · 2026-11-28 공식 자료(모델 카드·LICENSE·diffusers 문서) 기준 정리',
  '모델 라이선스 제외 지역에 대한민국 포함 · 법률 판단은 전문가 확인 · 공식 최소 VRAM 표기 없음(숫자는 공식 예시 값)'];
const SCENES = {};
const capsOf = (S, arr) => arr.map((L, i) => caption(S.cue(i) - .1, i < arr.length - 1 ? S.cue(i + 1) - .25 : null, L));
const NB = () => M.buddy(1636, 548, .62);
const fadeIn = (t, a, d = .5) => Math.min(1, popIn(t, a, d) * 2);
const dropIn = (e, t, a, dy = -500, r = 0) => { const k = popIn(t, a, .55); tf(e, 0, (1 - k) * dy, 1, (1 - k) * r, k > 0 ? 1 : 0); return k; };
const slideIn = (e, t, a, dx = -300) => { const k = popIn(t, a, .5); tf(e, (1 - k) * dx, 0, 1, 0, k > 0 ? Math.min(1, k * 2) : 0); return k; };
const chip = (s, x, y, css = {}) => el('div', 'chip', Object.assign({ left: x + 'px', top: y + 'px' }, css), null, s);
const GRAD = 'linear-gradient(135deg, #FFB36B 0%, #FF7A59 30%, #8E7CFF 65%, #4FC3F7 100%)';

// 그래픽카드 카드 (어두운 카드 + 팬)
function gpuCard(x, y, w, h, label = '80GB 그래픽카드', sub = '공식 예시 · 최소 사양 아님', fs = 44) {
  const b = box(x, y, w, h, 'card dark', { padding: '30px 34px' });
  const fan = el('div', null, { position: 'absolute', right: '34px', top: '34px', width: (h - 68) + 'px', height: (h - 68) + 'px', borderRadius: '50%', border: '6px solid #555', background: 'repeating-conic-gradient(#333 0 20deg, #222 20deg 40deg)' }, b);
  el('div', 'mono', { fontSize: fs + 'px', fontWeight: '800', color: C.yellow }, b, M.esc(label));
  el('div', null, { fontSize: (fs * .52) + 'px', fontWeight: '700', color: '#ccc', marginTop: '10px' }, b, M.esc(sub));
  return { b, fan, spin(t) { fan.style.transform = `rotate(${t * 220}deg)`; } };
}
// 메모리 막대 (0~max GB 눈금, 80GB 선) — 조각 여러 개를 쌓아 그림
function memBar(x, y, w, title, max = 140, h = 210) {
  const b = box(x, y, w, h, 'card', { padding: '24px 30px' });
  el('div', null, { fontSize: '30px', fontWeight: '900' }, b, M.esc(title));
  const track = el('div', null, { position: 'absolute', left: '30px', right: '30px', top: '86px', height: '56px', background: '#eee', border: '4px solid #141414', borderRadius: '12px', overflow: 'hidden' }, b);
  const tw = w - 60;
  el('div', null, { position: 'absolute', left: (30 + tw * SPEC.gpuGiB / max - 2) + 'px', top: '76px', width: '4px', height: '76px', background: C.red, zIndex: '2' }, b);
  el('div', null, { position: 'absolute', left: (30 + tw * SPEC.gpuGiB / max - 100) + 'px', top: '150px', width: '200px', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '22px', fontWeight: '800', color: C.red }, b, '80GB 선');
  const val = el('div', null, { position: 'absolute', right: '30px', top: '18px', fontSize: '40px', fontWeight: '900', color: C.orange }, b, '');
  const segs = [];
  return { b, seg(col) { const s = el('div', null, { position: 'absolute', top: 0, bottom: 0, left: 0, width: 0, background: col, borderRight: '3px solid #141414' }, track); segs.push(s); return s; },
    // parts: [[값, 시작 시각]] — 앞 조각 뒤에 이어 붙임
    render(t, parts, label = v => '약 ' + Math.round(v) + 'GB') { let acc = 0; parts.forEach((p, i) => { const s = segs[i] || this.seg([C.orange, C.blue, C.yellow, C.green][i]); const k = eOut(P(t, p[1], p[1] + 1.2)); s.style.left = (acc / max * 100) + '%'; s.style.width = (p[0] * k / max * 100) + '%'; s.style.opacity = k > 0 ? 1 : 0; acc += p[0] * k; });
      val.textContent = acc > .5 ? label(acc) : ''; val.style.color = acc > SPEC.gpuGiB ? C.red : C.orange; } };
}
// 표 줄 카드 (왼쪽 이름 · 오른쪽 값)
function rowCard(x, y, w, h, name, value, o = {}) {
  const b = box(x, y, w, h, 'card', { display: 'flex', alignItems: 'center', gap: '24px', padding: '0 28px', background: o.bg || '#fff' });
  el('div', null, { fontSize: (o.fs || 32) - 4 + 'px', fontWeight: '800', color: '#666', minWidth: (o.nw || 220) + 'px' }, b, M.esc(name));
  const v = el('div', null, { fontSize: (o.fs || 32) + 'px', fontWeight: '900', whiteSpace: 'nowrap' }, b, value);
  return { b, v };
}
// 큰 재료 덩이 (글 읽는 부분 / 그림 본체)
function slab(x, y, w, h, name, gb, col) {
  const b = box(x, y, w, h, 'card', { background: col, padding: '18px 22px', zIndex: '4' });
  el('div', null, { fontSize: '28px', fontWeight: '900' }, b, M.esc(name)); el('div', null, { fontSize: '44px', fontWeight: '900', marginTop: '6px' }, b, '약 ' + gb + 'GB');
  return b;
}
// 그림 칸 (색 띠 그라데이션, 제작사 그림 아님)
function canvasCard(x, y, w, h, label) {
  const b = box(x, y, w, h, 'card', { padding: '0', overflow: 'hidden' });
  const img = el('div', null, { position: 'absolute', left: 0, top: 0, bottom: 0, width: '0', background: GRAD }, b);
  const tag = el('div', 'chip', { right: '20px', bottom: '20px', left: 'auto', top: 'auto', background: C.ink, color: '#fff', fontSize: '28px' }, b, M.esc(label));
  return { b, img, tag, render(t, a, d = 1.4) { img.style.width = (eOut(P(t, a, a + d)) * 100) + '%'; tag.style.opacity = t > a + d ? 1 : 0; } };
}

// ======================= 롱폼 =======================
SCENES.preview = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2);
  const caps = [caption(c0 - .1, c1 - .3, [['글', '한', '줄', '→'], ['*1,600만 화소*', '그림']]), caption(c1 - .1, c2 - .3, [['80GB', '그래픽카드에서도'], ['*번갈아 올려야*']]), caption(c2 - .1, null, [['라이선스', '제외', '지역에'], ['*대한민국*']])];
  const prompt = box(110, 340, 760, 180, 'card', { padding: '26px 34px' });
  el('div', null, { fontSize: '26px', fontWeight: '800', color: '#777' }, prompt, '넣는 글 (예시)');
  const pt = el('div', null, { fontSize: '34px', fontWeight: '900', marginTop: '10px' }, prompt, '');
  const PT = '"A sunset over a quiet harbor ..."';
  const pic = canvasCard(110, 560, 760, 350, `약 ${SPEC.mp}MP`);
  const gpu = gpuCard(940, 340, 660, 250);
  const lic = box(940, 640, 660, 270, 'card', { padding: '28px 34px' });
  el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, lic, '모델 라이선스 제외 지역');
  const ex = SPEC.excluded.map((n, i) => el('div', 'chip', { position: 'absolute', left: (34 + (i % 2) * 300) + 'px', top: (80 + Math.floor(i / 2) * 80) + 'px', fontSize: '30px', background: n === '대한민국' ? C.red : '#fff', color: n === '대한민국' ? '#fff' : C.ink }, lic, '✗ ' + n));
  const nb = NB();
  return t => {
    caps.forEach(c => c.render(t));
    dropIn(prompt, t, c0 - .1, -400); pt.textContent = PT.slice(0, Math.floor(P(t, c0 + .4, c0 + 2.2) * PT.length));
    dropIn(pic.b, t, c0 + 2.3, 400); pic.render(t, c0 + 2.8);
    dropIn(gpu.b, t, c1 - .1, -500); gpu.spin(t);
    dropIn(lic, t, c2 - .1, 500); ex.forEach((e, i) => { const a = popIn(t, c2 + .3 + i * .25, .4); tf(e, 0, 0, a, 0, a > 0 ? 1 : 0); });
    nb.render(t, [{ at: c0 + .5, a: 'enter' }, { at: c1 + .6, a: 'look' }, { at: c2 + 1.4, a: 'oops' }]);
  };
};
SCENES.title = S => {
  const c0 = S.cue(0), c1 = S.cue(1), c2 = S.cue(2);
  const tag = chip('사양 체크 · 2026.11.28', 110, 200, { background: C.ink, color: '#fff', fontSize: '30px' });
  const word = el('div', null, { position: 'absolute', left: '100px', top: '270px', fontSize: '140px', fontWeight: '900', letterSpacing: '-5px', lineHeight: '1' }, null, '');
  const letters = [...'MiniMax-H3-Image'].map(ch => el('span', null, { display: 'inline-block', whiteSpace: 'pre' }, word, ch));
  const q = el('div', null, { position: 'absolute', left: '110px', top: '450px', fontSize: '72px', fontWeight: '900', color: C.orange }, null, '내 PC로 돌아갈까?');
  const note = chip('직접 실행하지 않음 · 공식 자료 기준', 110, 570, { fontSize: '30px' });
  const io = [['글', 'file'], ['참고 그림', 'image']].map((u, i) => { const c = box(110 + i * 360, 660, 330, 220, 'card', { padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }); el('div', null, {}, c, iconTile(u[1], 90)); el('div', null, { fontSize: '44px', fontWeight: '900' }, c, u[0]); return c; });
  const arrow = el('div', null, { position: 'absolute', left: '850px', top: '720px', fontSize: '90px', fontWeight: '900', color: C.orange }, null, '→');
  const outc = canvasCard(980, 640, 600, 260, '큰 그림 · 고친 그림');
  const nb = NB();
  return t => {
    tf(tag, 0, 0, popIn(t, c0), 0, t > c0 ? 1 : 0);
    letters.forEach((l, i) => { const a = popIn(t, c0 + .3 + i * .05, .5); l.style.transform = `translateY(${(1 - a) * -260}px)`; l.style.opacity = a > 0 ? 1 : 0; });
    const qa = popIn(t, c1 - .1, .5); tf(q, 0, (1 - qa) * 40, qa, -2, qa > 0 ? 1 : 0); const na = popIn(t, c1 + .8, .45); tf(note, 0, 0, na, 0, na > 0 ? 1 : 0);
    io.forEach((c, i) => dropIn(c, t, c2 + i * .8, 400)); const aa = fadeIn(t, c2 + 1.8); tf(arrow, (1 - aa) * -40, 0, 1, 0, aa); dropIn(outc.b, t, c2 + 2.2, -400); outc.render(t, c2 + 2.6);
    nb.render(t, [{ at: c0 + .8, a: 'enter' }, { at: c0 + 1.4, a: 'wave' }, { at: c1 + .6, a: 'look' }, { at: c2 + 3.2, a: 'point', dir: 'left' }]);
  };
};
SCENES.why = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['왜', '*화제*입니까?']], [['지난달', '내려받기'], ['*' + SPEC.hfDownloads.toLocaleString('en-US') + '번*']], [['11월 9일', '공개'], ['별', '*' + SPEC.stars + '*']], [['4K', '1장'], ['*10초 이내*', '(공식 블로그)']]]);
  const hf = box(110, 340, 700, 270, 'card', { padding: '30px' });
  el('div', null, { fontSize: '32px', fontWeight: '800' }, hf, 'Hugging Face 모델 페이지');
  const dl = el('div', null, { fontSize: '80px', fontWeight: '900', color: C.orange, marginTop: '16px' }, hf, '0');
  el('div', null, { fontSize: '28px', fontWeight: '700', color: '#666' }, hf, `지난달 내려받기 · 좋아요 ${SPEC.hfLikes}`);
  const gh = box(110, 650, 700, 260, 'card', { padding: '30px' });
  el('div', 'mono', { fontSize: '25px', fontWeight: '800', whiteSpace: 'nowrap' }, gh, 'github.com/MiniMax-AI/MiniMax-H3-Image');
  const st = el('div', null, { fontSize: '80px', fontWeight: '900', color: C.orange, marginTop: '16px' }, gh, '★ 0');
  el('div', null, { fontSize: '28px', fontWeight: '700', color: '#666' }, gh, `포크 ${SPEC.forks} · 공개 ${SPEC.released}`);
  const sp = box(870, 400, 720, 420, 'card', { padding: '40px', background: '#FFF8E1' });
  el('div', null, { fontSize: '40px', fontWeight: '900', marginBottom: '20px' }, sp, '공식 블로그가 밝힌 속도');
  el('div', null, { fontSize: '50px', fontWeight: '900', color: C.orange }, sp, '4K 1장 → 10초 이내');
  el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666', marginTop: '20px', lineHeight: '1.6' }, sp, '4096×4096 기준<br>어떤 그래픽카드에서 쟀는지: <span style="color:#E5482D">표기 없음</span>');
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(hf, t, c[1] - .1, -400); count(dl, t, c[1] + .3, SPEC.hfDownloads, 1.8);
    dropIn(gh, t, c[2] - .1, 400); count(st, t, c[2] + .3, SPEC.stars, 1.4, v => '★ ' + Math.round(v));
    dropIn(sp, t, c[3] - .1, -500);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.2, a: 'point', dir: 'left' }, { at: c[2] + 1.8, a: 'nod' }, { at: c[3] + 2.0, a: 'look' }]);
  };
};
SCENES.what = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['글', '→', '그림'], ['*그림 고치기*도']], [['약', '*16MP*'], ['1:1 ~ 21:9']], [['참고', '그림'], ['*최대 16장*']], [['그림', '본체', '*33.1B*'], ['*6단계*', '생성']], [['넣는', '글은'], ['*영어로 자세히*']]]);
  const sq = canvasCard(110, 340, 330, 330, '4096×4096');
  const wide = canvasCard(470, 340, 400, 172, '6272×2688');
  const mpN = el('div', null, { position: 'absolute', left: '470px', top: '540px', fontSize: '30px', fontWeight: '900', lineHeight: '1.4' }, null, `어느 비율이든 약 ${SPEC.mp}MP<br><span style="font-size:24px;color:#666">쓸 수 있는 범위 약 4~20MP</span>`);
  const refs = box(930, 340, 670, 300, 'card', { padding: '26px 30px' });
  el('div', null, { fontSize: '30px', fontWeight: '900', marginBottom: '14px' }, refs, '참고 그림 (공식 블로그)');
  const dots = []; for (let i = 0; i < 16; i++) dots.push(el('div', null, { position: 'absolute', left: (30 + (i % 8) * 76) + 'px', top: (90 + Math.floor(i / 8) * 90) + 'px', width: '62px', height: '62px', borderRadius: '12px', border: '4px solid #141414', background: C.blue }, refs));
  const base = box(110, 700, 760, 210, 'card', { padding: '26px 30px' });
  el('div', null, { fontSize: '30px', fontWeight: '900' }, base, `그림 본체: ${SPEC.params} (331억 개 매개변수)`);
  const steps = [1, 2, 3, 4, 5, 6].map(i => el('div', null, { display: 'inline-block', width: '80px', height: '56px', margin: '22px 14px 0 0', borderRadius: '10px', border: '4px solid #141414', textAlign: 'center', fontSize: '30px', fontWeight: '900', lineHeight: '48px' }, base, String(i)));
  const en = box(930, 680, 670, 230, 'card', { padding: '26px 30px', background: '#FFF8E1' });
  el('div', null, { fontSize: '30px', fontWeight: '900' }, en, '넣는 글 (모델 카드 안내)');
  el('div', null, { fontSize: '28px', fontWeight: '800', marginTop: '14px', lineHeight: '1.5' }, en, '그림 전체를 <b>영어로 자세히</b> 설명<br><span style="color:#666">한국어 지원: 공식 표기 없음</span>');
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(sq.b, t, c[0] - .1, -400); sq.render(t, c[0] + .4); dropIn(wide.b, t, c[1] - .1, -400); wide.render(t, c[1] + .3); mpN.style.opacity = fadeIn(t, c[1] + 1.2);
    dropIn(refs, t, c[2] - .1, -400); dots.forEach((d, i) => { const a = popIn(t, c[2] + .4 + i * .1, .4); tf(d, 0, 0, a, 0, a > 0 ? 1 : 0); });
    dropIn(base, t, c[3] - .1, 400); steps.forEach((s, i) => { s.style.background = t > c[3] + .6 + i * .35 ? C.yellow : '#fff'; });
    dropIn(en, t, c[4] - .1, 400);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'point', dir: 'left' }, { at: c[3] + 2.4, a: 'nod' }, { at: c[4] + .6, a: 'look' }]);
  };
};
SCENES.spec = S => {
  const c = [0, 1, 2, 3, 4, 5].map(S.cue);
  const caps = capsOf(S, [[['필요', '사양'], ['*공식 자료*로']], [['공식', '최소', 'VRAM'], ['*표기 없음*']], [['큰', '덩이', '2개'], ['각 *약 62GB*']], [['80GB', '1장에'], ['*같이 안 들어감*']], [['공식', '예시는'], ['*자동 오프로드*']], [['큰', '그림', '1장'], ['최고 *약 65GB*']]]);
  const none = box(110, 340, 520, 200, 'card', { padding: '26px 30px', background: '#FDE2DC' });
  el('div', null, { fontSize: '30px', fontWeight: '800', color: '#666' }, none, '공식 최소 VRAM'); el('div', null, { fontSize: '56px', fontWeight: '900', color: C.red, marginTop: '8px' }, none, '표기 없음');
  const s1 = slab(680, 340, 440, 200, '글 읽는 부분 (bfloat16)', SPEC.part, C.lilac), s2 = slab(1150, 340, 440, 200, '그림 본체 (bfloat16)', SPEC.part, C.peach);
  const bar = memBar(110, 600, 1480, '80GB 그래픽카드 1장 (diffusers 공식 문서)');
  const off = chip('→ 자동 오프로드: 지금 쓰는 덩이만 그래픽카드로', 110, 840, { fontSize: '32px', background: C.ink, color: '#fff' });
  const hd = hand(`${SPEC.peakShape} 1장 → 최고 약 ${SPEC.peak}GB`, 1000, 870, 40, -3);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(none, t, c[1] - .1, -500); none.style.transform += ` translateX(${shake(t, c[1] + .6, .35, 6)}px)`;
    dropIn(s1, t, c[2] - .1, -400); dropIn(s2, t, c[2] + .5, -400);
    dropIn(bar.b, t, c[3] - .1, 400);
    const offK = P(t, c[4], c[4] + .6);
    if (t < c[4]) bar.render(t, [[SPEC.part, c[3] + .3], [SPEC.part, c[3] + 1.2]]);
    else if (t < c[5]) bar.render(t, [[SPEC.part * (1 - offK) + SPEC.part * offK, c[3] + .3], [SPEC.part * (1 - offK), c[3] + 1.2]]);
    else bar.render(t, [[SPEC.part, 0], [0, 0], [(SPEC.peak - SPEC.part) * eOut(P(t, c[5] + .2, c[5] + 1.2)), c[5] + .2]]);
    const o = popIn(t, c[4] + .1, .45); tf(off, 0, (1 - o) * 30, o, 0, o > 0 ? 1 : 0);
    hd.render(t, c[5] + .5, .8);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + .5, a: 'oops' }, { at: c[3] + 1.8, a: 'oops' }, { at: c[4] + .6, a: 'point', dir: 'left' }, { at: c[5] + .5, a: 'pen' }]);
  };
};
SCENES.memory = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['그래픽카드', '메모리', '='], ['*작업대*']], [['큰', '재료'], ['*두 덩이*']], [['둘', '다', '올리면'], ['*넘침*']], [['필요한', '덩이만', '올리고'], ['나머지는 *선반*']], [['선반(RAM)', '크기'], ['*공식 표기 없음*']]]);
  const desk = box(110, 520, 900, 380, 'card', { background: '#FFF8E1', padding: '26px' });
  el('div', null, { fontSize: '30px', fontWeight: '900' }, desk, '작업대 = 그래픽카드 메모리 (80GB)');
  const cap80 = el('div', null, { position: 'absolute', left: '26px', right: '26px', top: '90px', bottom: '26px', border: '5px dashed ' + C.red, borderRadius: '16px' }, desk);
  const shelf = box(1060, 520, 530, 380, 'card', { background: C.lilac, padding: '26px' });
  el('div', null, { fontSize: '30px', fontWeight: '900' }, shelf, '선반 = 시스템 메모리(RAM)');
  const ram = el('div', null, { position: 'absolute', left: '26px', bottom: '26px', fontSize: '52px', fontWeight: '900', color: C.red }, shelf, '? GB');
  const A = slab(0, 0, 400, 150, '글 읽는 부분', SPEC.part, C.lilac), B = slab(0, 0, 400, 150, '그림 본체', SPEC.part, C.peach);
  const POS = { deskL: [160, 640], deskR: [580, 640], top: [160, 340], shelf: [1120, 700] };
  const place = (e, p) => { e.style.left = p[0] + 'px'; e.style.top = p[1] + 'px'; };
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(desk, t, c[0] - .1, -400); dropIn(shelf, t, c[0] + .8, 400);
    const a1 = popIn(t, c[1] + .2, .45), a2 = popIn(t, c[1] + .9, .45);
    // 1) 위에 등장 → 2) 둘 다 작업대 (넘침·흔들림) → 3) 그림 본체는 선반으로, 글 읽는 부분과 번갈아 교대
    const k2 = eIO(P(t, c[2], c[2] + .9)), k3 = eIO(P(t, c[3], c[3] + 1.0));
    const sw = t > c[3] + 1.6 ? (Math.floor((t - c[3] - 1.6) / 2.2) % 2) : 0, sk = t > c[3] + 1.6 ? eIO(P((t - c[3] - 1.6) % 2.2, 0, .8)) : 0;
    let pa = [lerp(POS.top[0], POS.deskL[0], k2), lerp(POS.top[1], POS.deskL[1], k2)], pb = [lerp(POS.top[0] + 440, POS.deskR[0], k2), lerp(POS.top[1], POS.deskR[1] - 40, k2)];
    pb = [lerp(pb[0], POS.shelf[0], k3), lerp(pb[1], POS.shelf[1], k3)];
    if (t > c[3] + 1.6) { const [onDesk, onShelf] = sw ? [B, A] : [A, B]; const from = sw ? [POS.shelf, POS.deskL] : [POS.deskL, POS.shelf];
      // 교대: 작업대 덩이 ↔ 선반 덩이 자리 바꿈
      const d = [lerp(from[0][0], from[1][0], sk), lerp(from[0][1], from[1][1], sk)], s = [lerp(from[1][0], from[0][0], sk), lerp(from[1][1], from[0][1], sk)];
      pa = sw ? s : d; pb = sw ? d : s; }
    place(A, pa); place(B, pb); tf(A, shake(t, c[2] + .9, .5, 8), 0, a1 > 0 ? 1 : 0, 0, a1 > 0 ? 1 : 0); tf(B, shake(t, c[2] + .9, .5, 8), 0, a2 > 0 ? 1 : 0, 0, a2 > 0 ? 1 : 0);
    cap80.style.borderColor = t > c[2] + .8 && t < c[3] + .8 ? C.red : '#bbb'; cap80.style.background = t > c[2] + .8 && t < c[3] + .8 ? 'rgba(229,72,45,.12)' : 'transparent';
    ram.style.opacity = fadeIn(t, c[4] + .2);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[2] + 1.0, a: 'oops' }, { at: c[3] + .8, a: 'point', dir: 'left' }, { at: c[4] + .6, a: 'look' }]);
  };
};
SCENES.disk = S => {
  const c = [0, 1, 2, 3, 4, 5].map(S.cue);
  const caps = capsOf(S, [[['저장', '공간'], ['*약 135GB*']], [['글', '다듬기', '도우미는'], ['*17.9GB* 더']], [['ComfyUI', '줄인', '파일'], ['*약 47GB*']], [['줄인', '버전도'], ['VRAM *표기 없음*']], [['작은', '그래픽카드는'], ['*약 4MP*로 낮추기']], [['운영체제·측정', '그래픽카드'], ['*표기 없음*']]]);
  const MAX = 160;
  const dk = box(110, 340, 1480, 230, 'card', { padding: '24px 30px' });
  el('div', null, { fontSize: '30px', fontWeight: '900' }, dk, '원래 파일 (모델 카드 내려받기 표)');
  const tr = el('div', null, { position: 'absolute', left: '30px', right: '30px', top: '84px', height: '60px', border: '4px solid #141414', borderRadius: '12px', background: '#eee', overflow: 'hidden' }, dk);
  const P1 = [[SPEC.dit, C.orange, '그림 본체 66.28'], [SPEC.te, C.lilac, '글 읽기 66.7'], [SPEC.vae, C.yellow, ''], [SPEC.pe, '#bbb', '도우미 17.9']];
  const f1 = P1.map(p => el('div', null, { position: 'absolute', top: 0, bottom: 0, background: p[1], borderRight: '3px solid #141414', fontSize: '22px', fontWeight: '900', lineHeight: '52px', paddingLeft: '10px', whiteSpace: 'nowrap', overflow: 'hidden' }, tr, p[2]));
  const dv = el('div', null, { position: 'absolute', left: '30px', top: '156px', fontSize: '40px', fontWeight: '900', color: C.orange }, dk, '');
  const cf = box(110, 600, 900, 230, 'card', { padding: '24px 30px' });
  el('div', null, { fontSize: '30px', fontWeight: '900' }, cf, 'ComfyUI 공식 안내 (줄인 파일)');
  const tr2 = el('div', null, { position: 'absolute', left: '30px', right: '30px', top: '84px', height: '60px', border: '4px solid #141414', borderRadius: '12px', background: '#eee', overflow: 'hidden' }, cf);
  const P2 = [[SPEC.comfy.dit, C.orange, '본체 21'], [SPEC.comfy.te, C.lilac, '글 읽기 25.28'], [SPEC.comfy.vae, C.yellow, '']];
  const f2 = P2.map(p => el('div', null, { position: 'absolute', top: 0, bottom: 0, background: p[1], borderRight: '3px solid #141414', fontSize: '17px', fontWeight: '900', lineHeight: '52px', paddingLeft: '6px', whiteSpace: 'nowrap', overflow: 'hidden' }, tr2, p[2]));
  const cv = el('div', null, { position: 'absolute', left: '30px', top: '156px', fontSize: '34px', fontWeight: '900', color: C.green }, cf, '');
  const rows = [['필요 VRAM', '표기 없음'], ['작은 그래픽카드', '약 4MP로 낮추기'], ['운영체제', '표기 없음']].map((r, i) => rowCard(1050, 600 + i * 0, 540, 70, r[0], M.esc(r[1]), { fs: 26, nw: 170 }));
  rows.forEach((r, i) => { r.b.style.top = (600 + i * 80) + 'px'; });
  const tm = chip('생성 시간: 4K 1장 10초 이내 (공식 블로그 · 그래픽카드 종류 표기 없음)', 110, 860, { fontSize: '28px', background: '#FDE2DC' });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(dk, t, c[0] - .1, -400);
    let acc = 0; P1.forEach((p, i) => { const k = eOut(P(t, (i < 3 ? c[0] + .4 + i * .6 : c[1] + .2), (i < 3 ? c[0] + 1.2 + i * .6 : c[1] + 1.0))); f1[i].style.left = (acc / MAX * 100) + '%'; f1[i].style.width = (p[0] * k / MAX * 100) + '%'; acc += p[0] * k; });
    dv.textContent = t < c[0] + .4 ? '' : t < c[1] + .2 ? `합계 약 ${Math.round(Math.min(acc, SPEC.disk))}GB` : `약 ${SPEC.disk}GB + 도우미(선택) ${SPEC.pe}GB`;
    dropIn(cf, t, c[2] - .1, 400);
    let a2 = 0; P2.forEach((p, i) => { const k = eOut(P(t, c[2] + .4 + i * .5, c[2] + 1.2 + i * .5)); f2[i].style.left = (a2 / MAX * 100) + '%'; f2[i].style.width = (p[0] * k / MAX * 100) + '%'; a2 += p[0] * k; });
    cv.textContent = t > c[2] + .4 ? `합계 약 ${Math.round(a2)}GB (INT8 등)` : '';
    const at = [c[3], c[4], c[5]]; rows.forEach((r, i) => slideIn(r.b, t, at[i] - .05, 400));
    const m = popIn(t, c[5] + 1.0, .45); tf(tm, 0, (1 - m) * 30, m, 0, m > 0 ? 1 : 0);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 2.4, a: 'oops' }, { at: c[2] + 1.6, a: 'happy' }, { at: c[3] + .5, a: 'oops' }, { at: c[5] + .6, a: 'look' }]);
  };
};
SCENES.license = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['한국에서', '써도'], ['*됩니까?*']], [['모델', '파일'], ['*커뮤니티 라이선스*']], [['제외', '지역에'], ['*대한민국*']], [['권한은', '제외', '지역', '밖'], ['한국은 *따로 허가*']], [['매출', '크거나', '서비스면'], ['*사전 허가*']]]);
  const wt = box(110, 340, 700, 330, 'card', { padding: '28px' }); el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, wt, '모델 파일(가중치)'); el('div', null, { fontSize: '40px', fontWeight: '900', lineHeight: '1.25' }, wt, 'MiniMax-H3-Image<br>Community License'); el('div', null, { fontSize: '26px', fontWeight: '700', color: '#666', marginTop: '14px' }, wt, `라이선스 날짜 ${SPEC.licDate} · 홍콩 법 적용`);
  const ex = box(870, 340, 720, 360, 'card', { padding: '28px' }); el('div', null, { fontSize: '30px', fontWeight: '900' }, ex, '제외 지역 (Excluded Territories)');
  const chips = SPEC.excluded.map((n, i) => el('div', 'chip', { position: 'absolute', left: (28 + (i % 2) * 340) + 'px', top: (100 + Math.floor(i / 2) * 110) + 'px', fontSize: '36px', padding: '16px 28px', background: n === '대한민국' ? C.red : '#fff', color: n === '대한민국' ? '#fff' : C.ink }, ex, '✗ ' + n));
  const terr = el('div', null, { position: 'absolute', left: '110px', top: '700px', width: '700px', fontSize: '28px', fontWeight: '800', lineHeight: '1.6' }, null, '권한(II장)은 "Applicable Territory" 안에서만<br>= 전 세계 − 제외 지역');
  const rest = el('div', null, { position: 'absolute', left: '900px', top: '730px', width: '700px', fontSize: '27px', whiteSpace: 'nowrap', fontWeight: '800', lineHeight: '1.6' }, null, `· ${SPEC.revenue}·남에게 서비스 → 사전 허가<br>· 상업 화면에 'MiniMax-H3-Image' 표시<br>· 법률 판단은 전문가 확인`);
  const r = chips[2].getBoundingClientRect(); const ring = pen(ellipsePath(r.left + r.width / 2, r.top + r.height / 2, r.width / 2 + 26, r.height / 2 + 18), 7);
  const st = stamp('한국 제외', 1300, 600, 50, -10);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(wt, t, c[1] - .1, -400);
    dropIn(ex, t, c[2] - .1, -500); chips.forEach((e, i) => { const a = popIn(t, c[2] + .5 + i * .3, .4); tf(e, 0, 0, a, 0, a > 0 ? 1 : 0); });
    ring.set(eOut(P(t, c[2] + 2.0, c[2] + 2.6))); terr.style.opacity = fadeIn(t, c[3] + .1); st.render(t, c[3] + .6);
    rest.style.opacity = fadeIn(t, c[4] + .1);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[0] + 1.0, a: 'look' }, { at: c[2] + 2.0, a: 'oops' }, { at: c[3] + .6 - .35, a: 'stamp' }]);
  };
};
SCENES.try = S => {
  const c = [0, 1, 2, 3, 4].map(S.cue);
  const caps = capsOf(S, [[['설치', '없이'], ['*볼 수 있는 곳*']], [['①', 'Hugging Face', 'Space'], ['② *Colab* 버튼']], [['③', 'MiniMax', 'API'], ['④ *Hailuo* · Agent']], [['API는', '짧은', '글을'], ['*자세한 설명*으로']], [['요금·이용', '지역은'], ['*각 페이지 확인*']]]);
  const L = [['① Hugging Face Space', 'spaces/MiniMaxAI/minimax-h3-image'], ['② 모델 페이지 Colab 버튼', 'huggingface.co/MiniMaxAI/MiniMax-H3-Image'], ['③ MiniMax API', 'platform.minimax.io (그림 만들기 안내)'], ['④ Hailuo 웹 · MiniMax Agent', 'hailuoai.video · agent.minimax.io']];
  const cards = L.map((l, i) => { const b = box(110 + (i % 2) * 750, 340 + Math.floor(i / 2) * 200, 720, 170, 'card', { padding: '24px 30px' }); el('div', null, { fontSize: '38px', fontWeight: '900' }, b, M.esc(l[0])); el('div', 'mono', { fontSize: '24px', color: '#666', marginTop: '10px' }, b, M.esc(l[1])); return b; });
  const ext = chip('API: 어느 언어로 쓴 짧은 글도 자세한 설명으로 바꿔 줌 (모델 카드)', 110, 760, { fontSize: '30px', background: C.ink, color: '#fff' });
  const warn = chip('⚠ 요금·이용 지역 조건은 각 페이지에서 확인 (이 글에서 확인하지 않음)', 110, 850, { fontSize: '30px', background: '#FDE2DC' });
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
  const caps = capsOf(S, [[['내', '사양', '*확인법*']], [['작업', '관리자', '→', '성능'], ['*전용 GPU 메모리*']], [['메모리', '=', 'RAM'], ['*내 PC* = 저장 공간']], [['공식', '예시와'], ['*비교*']], [['NVIDIA라면'], ['*nvidia-smi*']]]);
  const tm = box(110, 340, 900, 540, 'card', { padding: '0', overflow: 'hidden' });
  el('div', null, { background: '#dfe6ee', fontSize: '26px', fontWeight: '800', padding: '12px 22px' }, tm, '작업 관리자 (Ctrl + Shift + Esc) → 성능 (그림 예시)');
  const side = ['CPU', '메모리', '디스크', 'GPU 0'].map((s, i) => el('div', null, { position: 'absolute', left: '20px', top: (80 + i * 100) + 'px', width: '220px', height: '80px', borderRadius: '10px', fontSize: '30px', fontWeight: '800', display: 'flex', alignItems: 'center', paddingLeft: '20px' }, tm, s));
  const pane = el('div', null, { position: 'absolute', left: '280px', top: '80px', right: '20px', bottom: '20px', fontSize: '32px', fontWeight: '800', lineHeight: '1.8' }, tm, '');
  const cmp = box(1050, 340, 540, 540, 'card', { padding: '26px 30px' });
  el('div', null, { fontSize: '30px', fontWeight: '900', marginBottom: '10px' }, cmp, '공식 자료 값');
  const R = [['그래픽카드(VRAM)', `예시 80GB · 최고 약 ${SPEC.peak}GB`], ['최소 VRAM', '공식 표기 없음'], ['저장 공간', `약 ${SPEC.disk}GB (줄인 파일 약 ${SPEC.comfy.sum}GB)`]].map(r => { const d = el('div', null, { padding: '16px 0', borderBottom: '3px dashed #ddd' }, cmp); el('div', null, { fontSize: '24px', color: '#666', fontWeight: '800' }, d, r[0]); el('div', null, { fontSize: '30px', fontWeight: '900' }, d, r[1]); return d; });
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
  const caps = capsOf(S, [[['맞는', '곳'], ['*80GB급*', '그래픽카드']], [['일반', '가정용', 'PC'], ['*맞지 않음*']], [['한국에서는'], ['*소식·사양만*', '참고']], [['결과가', '궁금하면'], ['*공식 웹*부터']]]);
  const ok = box(110, 340, 720, 560, 'card', { padding: '30px', background: C.mint });
  el('div', null, { fontSize: '40px', fontWeight: '900', color: C.green }, ok, '✓ 맞는 곳');
  el('div', null, { fontSize: '30px', fontWeight: '800', lineHeight: '1.7', marginTop: '16px' }, ok, `· 80GB급 데이터센터 그래픽카드<br>· 저장 공간 약 ${SPEC.disk}GB 이상<br>· 라이선스 제외 지역 밖`);
  const ng = box(870, 340, 720, 560, 'card', { padding: '30px', background: '#FDE2DC' });
  el('div', null, { fontSize: '40px', fontWeight: '900', color: C.red }, ng, '✗ 아직 아닌 경우');
  el('div', null, { fontSize: '30px', fontWeight: '800', lineHeight: '1.7', marginTop: '16px' }, ng, '· 일반 가정용 PC<br>· 최소 사양 숫자를 찾는 사람 (공식 표기 없음)<br>· 한국에서 바로 쓰려는 사람 (제외 지역)');
  const hd = hand('→ 공식 웹 · 이용 조건 먼저!', 900, 800, 40, -4);
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t));
    dropIn(ok, t, c[0] - .1, -400); dropIn(ng, t, c[1] - .1, 400);
    const k = eOut(P(t, c[2] + .2, c[2] + .7)); ng.style.boxShadow = `9px 9px 0 #141414, 0 0 0 ${k * 8}px ${C.yellow}`;
    hd.render(t, c[3] + .3, .8);
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + .6, a: 'oops' }, { at: c[2] + .6, a: 'look' }, { at: c[3] + .5, a: 'pen' }]);
  };
};
SCENES.summary = S => {
  const c = [0, 1, 2, 3].map(S.cue);
  const caps = capsOf(S, [[['오늘', '내용', '*정리*']], [['글·참고', '그림', '→'], ['*약 16MP* 그림']], [['최소', '표기', '없음', '·'], ['*최고 약 65GB*']], [['제외', '지역에'], ['*대한민국*']]]);
  const L = [`글·참고 그림 → 약 ${SPEC.mp}MP 큰 그림 · 그림 고치기 (${SPEC.steps}단계)`, `최소 VRAM 표기 없음 · 80GB에서 번갈아 최고 약 ${SPEC.peak}GB · 저장 약 ${SPEC.disk}GB`, '모델 라이선스 제외 지역: EU · 영국 · 대한민국 · 미국'];
  const cd = box(110, 340, 1480, 540, 'card', { padding: '40px 50px' });
  const rows = L.map((s, i) => { const r = el('div', null, { display: 'flex', alignItems: 'center', gap: '30px', height: '150px', borderBottom: i < 2 ? '3px dashed #ddd' : 'none' }, cd);
    const b = el('div', null, { minWidth: '76px', height: '76px', border: '5px solid #141414', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '58px', fontWeight: '900', color: i === 2 ? C.red : C.green }, r, '');
    el('div', null, { fontSize: '34px', fontWeight: '900', whiteSpace: 'nowrap' }, r, M.esc(s)); return { r, b, i }; });
  const nb = NB();
  return t => {
    caps.forEach(k => k.render(t)); dropIn(cd, t, c[0] + .2, 400);
    rows.forEach((k, i) => { k.r.style.opacity = fadeIn(t, c[i + 1] - .1); const on = t > c[i + 1] + .5; k.b.textContent = on ? (i === 2 ? '!' : '✓') : ''; k.b.style.transform = `scale(${on ? popIn(t, c[i + 1] + .5, .4) : 1})`; });
    nb.render(t, [{ at: c[0] + .4, a: 'enter' }, { at: c[1] + 1.0, a: 'nod' }, { at: c[2] + 1.0, a: 'nod' }, { at: c[3] + 1.0, a: 'oops' }]);
  };
};
SCENES.end = S => ending(S, { name: 'MiniMax-H3-Image · 사양 체크', lines: [['다음에 또 멋진'], ['*오픈소스*', '소개하겠습니다!']], disclaimer: DISCLAIMER });

// ======================= 숏폼 (세로 1080×1920 / 가로 1920×1080) =======================
const NBX = S => S.V ? M.buddy(770, 168, .62) : M.buddy(1636, 548, .62);
const LY = S => S.V ? { x: 70, w: 940, y: 520 } : { x: 110, w: 1480, y: 340 };
SCENES.s_hook = S => {
  const c0 = S.cue(0), L = LY(S);
  const cap = caption(c0 - .1, null, [['1,600만', '화소'], ['그림 AI,'], ['*내 PC로*', '돌아갈까?']], { size: S.V ? 76 : 70 });
  const pic = canvasCard(L.x, S.V ? 640 : 380, S.V ? L.w : 900, S.V ? 560 : 480, `약 ${SPEC.mp}MP`);
  const q = el('div', null, { position: 'absolute', left: (S.V ? 780 : 1150) + 'px', top: (S.V ? 1240 : 420) + 'px', fontSize: '220px', fontWeight: '900', color: C.orange, textShadow: '6px 6px 0 #141414' }, null, '?');
  const nb = NBX(S);
  return t => {
    cap.render(t); dropIn(pic.b, t, c0 + .2, 400); pic.render(t, c0 + .7, 1.8);
    const a = popIn(t, c0 + 3.0, .5); tf(q, 0, 0, a, (1 - a) * 30, a > 0 ? 1 : 0);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 1.5, a: 'look' }, { at: c0 + 3.1, a: 'point', dir: 'left' }]);
  };
};
SCENES.s_spec = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['최소', 'VRAM', '*표기 없음*'], ['큰 덩이 2개', '*각 62GB*']]), caption(c1 - .1, null, [['80GB에서', '번갈아도'], ['최고 *약 65GB*']])];
  const W = S.V ? L.w : 1480, hw = S.V ? (L.w - 30) / 2 : 720;
  const s1 = slab(L.x, L.y, hw, 200, '글 읽는 부분', SPEC.part, C.lilac), s2 = slab(L.x + hw + 30, L.y, hw, 200, '그림 본체', SPEC.part, C.peach);
  const bar = memBar(L.x, S.V ? 790 : 590, W, '80GB 그래픽카드 1장');
  const off = chip('번갈아 올리기 (자동 오프로드)', L.x, S.V ? 1040 : 830, { fontSize: '40px', padding: '14px 30px', background: C.ink, color: '#fff' });
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t)); dropIn(s1, t, c0 - .05, -400); dropIn(s2, t, c0 + .5, -400);
    dropIn(bar.b, t, c0 + 1.4, 300);
    if (t < c1) bar.render(t, [[SPEC.part, c0 + 1.8], [SPEC.part, c0 + 2.8]]);
    else { const k = eIO(P(t, c1, c1 + .8)); bar.render(t, [[SPEC.part, 0], [SPEC.part * (1 - k), 0], [(SPEC.peak - SPEC.part) * k, 0]]); }
    const r = popIn(t, c1 + .3, .45); tf(off, 0, (1 - r) * 30, r, 0, r > 0 ? 1 : 0);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 3.4, a: 'oops' }, { at: c1 + 1.4, a: 'point', dir: 'left' }]);
  };
};
SCENES.s_disk = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['저장', '공간', '*약 135GB*'], ['줄인 파일도', '*약 47GB*']]), caption(c1 - .1, null, [['줄인', '버전도'], ['VRAM *표기 없음*']])];
  const W = S.V ? L.w : 1000, MAX = 140;
  const dk = box(L.x, L.y, W, S.V ? 480 : 440, 'card', { padding: '30px' });
  const mk = (y, title, col) => { el('div', null, { position: 'absolute', left: '30px', top: y + 'px', fontSize: '32px', fontWeight: '900' }, dk, title); const tr = el('div', null, { position: 'absolute', left: '30px', right: '30px', top: (y + 50) + 'px', height: '80px', border: '4px solid #141414', borderRadius: '14px', background: '#eee', overflow: 'hidden' }, dk); const f = el('div', null, { position: 'absolute', left: 0, top: 0, bottom: 0, background: col }, tr); const v = el('div', null, { position: 'absolute', right: '20px', top: '6px', fontSize: '50px', fontWeight: '900' }, tr, ''); return { f, v }; };
  const b1 = mk(30, '원래 파일 (모델 카드)', C.orange), b2 = mk(S.V ? 250 : 230, 'ComfyUI 공식 안내 (줄인 파일)', C.green);
  const R = rowCard(L.x, (S.V ? 1040 : 820), W, 110, '필요 VRAM', '공식 표기 없음', { fs: 38, nw: 260 });
  const nb = NBX(S);
  return t => {
    caps.forEach(c => c.render(t)); dropIn(dk, t, c0 - .05, -400);
    const k1 = eOut(P(t, c0 + .4, c0 + 2.0)), k2 = eOut(P(t, c0 + 2.2, c0 + 3.6));
    b1.f.style.width = (k1 * SPEC.disk / MAX * 100) + '%'; b1.v.textContent = k1 > 0 ? '약 ' + Math.round(k1 * SPEC.disk) + 'GB' : '';
    b2.f.style.width = (k2 * SPEC.comfy.sum / MAX * 100) + '%'; b2.v.textContent = k2 > 0 ? '약 ' + Math.round(k2 * SPEC.comfy.sum) + 'GB' : ''; b2.v.style.left = '20px'; b2.v.style.right = 'auto'; b2.v.style.paddingLeft = (k2 * SPEC.comfy.sum / MAX * W) + 'px';
    slideIn(R.b, t, c1 + .1, 400);
    nb.render(t, [{ at: c0 + .3, a: 'enter' }, { at: c0 + 2.3, a: 'oops' }, { at: c1 + 1.0, a: 'look' }]);
  };
};
SCENES.s_license = S => {
  const c0 = S.cue(0), c1 = S.cue(1), L = LY(S);
  const caps = [caption(c0 - .1, c1 - .25, [['라이선스', '제외', '지역'], ['*대한민국*']]), caption(c1 - .1, null, [['따로', '허가', '전까지'], ['*사용 권한 없음*']])];
  const W = S.V ? L.w : 1000;
  const ex = box(L.x, L.y, W, S.V ? 560 : 460, 'card', { padding: '30px' });
  el('div', null, { fontSize: '34px', fontWeight: '900' }, ex, 'MiniMax-H3-Image 라이선스 제외 지역');
  const chips = SPEC.excluded.map((n, i) => el('div', 'chip', { position: 'absolute', left: (30 + (i % 2) * (W / 2)) + 'px', top: (110 + Math.floor(i / 2) * (S.V ? 200 : 150)) + 'px', fontSize: S.V ? '44px' : '38px', padding: '18px 30px', background: n === '대한민국' ? C.red : '#fff', color: n === '대한민국' ? '#fff' : C.ink }, ex, '✗ ' + n));
  const r = chips[2].getBoundingClientRect(); const ring = pen(ellipsePath(r.left + r.width / 2, r.top + r.height / 2, r.width / 2 + 28, r.height / 2 + 20), 7);
  const st = stamp('허가 필요', S.V ? 600 : 1200, S.V ? 1130 : 420, 60, -10);
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
  const line = el('div', null, { padding: '40px 30px', fontSize: '44px', fontWeight: '900', lineHeight: '1.6' }, tm, `전용 GPU 메모리 <span style="color:#FF5A1F">? GB</span><br><span style="font-size:32px;color:#666">비교: 공식 예시 80GB · 최고 약 ${SPEC.peak}GB</span>`);
  const nb = NBX(S);
  return t => { cap.render(t); dropIn(tm, t, c0, 300); line.style.opacity = fadeIn(t, c0 + .6); nb.render(t, [{ at: c0 + .2, a: 'enter' }, { at: c0 + .8, a: 'point', dir: 'left' }, { at: c0 + 2.6, a: 'happy' }]); };
};
