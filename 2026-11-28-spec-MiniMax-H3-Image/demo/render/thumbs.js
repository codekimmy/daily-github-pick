// MiniMax-H3-Image 사양 체크 편 썸네일·블로그 그림 — 직접 만든 사양 카드 (제작사 그림·데모 이미지 쓰지 않음). 숫자는 data.js 의 SPEC(공식 자료)만
const { C, el, box, tf, caption, stamp, hand, pen, ellipsePath, pill, pillRender } = M;
const FOOT = '2026-11-28 공식 자료(모델 카드·LICENSE·diffusers 문서·ComfyUI 안내) 기준 · 직접 실행하지 않음';
const foot = () => el('div', null, { position: 'absolute', right: '28px', bottom: '18px', fontSize: '20px', fontWeight: '700', color: '#666' }, null, FOOT);
const chip = (s, x, y, css = {}) => el('div', 'chip', Object.assign({ left: x + 'px', top: y + 'px' }, css), null, s);
function gpu(x, y, w, h, fs = 54, label = '80GB 그래픽카드', sub = '공식 예시 · 최소 사양 아님') { const b = box(x, y, w, h, 'card dark', { padding: '26px 30px' });
  el('div', null, { position: 'absolute', right: '26px', top: '26px', width: (h - 52) + 'px', height: (h - 52) + 'px', borderRadius: '50%', border: '6px solid #555', background: 'repeating-conic-gradient(#333 0 20deg, #222 20deg 40deg)' }, b);
  el('div', 'mono', { fontSize: fs + 'px', fontWeight: '800', color: C.yellow }, b, label); el('div', null, { fontSize: (fs * .5) + 'px', fontWeight: '700', color: '#ccc', marginTop: '8px' }, b, sub); return b; }
// 쌓은 막대 (80GB 선) — parts: [[값, 색, 글자]]
function bar(x, y, w, title, parts, val, max = 140, valCol = C.orange) { const b = box(x, y, w, 170, 'card', { padding: '20px 26px' });
  el('div', null, { fontSize: '28px', fontWeight: '900' }, b, title); el('div', null, { position: 'absolute', right: '26px', top: '14px', fontSize: '40px', fontWeight: '900', color: valCol }, b, val);
  const tr = el('div', null, { position: 'absolute', left: '26px', right: '26px', top: '76px', height: '48px', border: '4px solid #141414', borderRadius: '12px', background: '#eee', overflow: 'hidden' }, b);
  let acc = 0; parts.forEach(p => { el('div', null, { position: 'absolute', left: (acc / max * 100) + '%', top: 0, bottom: 0, width: (p[0] / max * 100) + '%', background: p[1], borderRight: '3px solid #141414', fontSize: '20px', fontWeight: '900', lineHeight: '40px', paddingLeft: '8px', whiteSpace: 'nowrap', overflow: 'hidden' }, tr, p[2] || ''); acc += p[0]; });
  const tw = w - 52; el('div', null, { position: 'absolute', left: (26 + tw * SPEC.gpuGiB / max - 2) + 'px', top: '68px', width: '4px', height: '64px', background: C.red }, b);
  el('div', null, { position: 'absolute', left: (26 + tw * SPEC.gpuGiB / max - 100) + 'px', top: '134px', width: '200px', textAlign: 'center', fontSize: '20px', fontWeight: '800', color: C.red }, b, '80GB 선'); return b; }
function exCard(x, y, w, h, fs = 34) { const b = box(x, y, w, h, 'card', { padding: '24px 28px' }); el('div', null, { fontSize: (fs - 6) + 'px', fontWeight: '900' }, b, '모델 라이선스 제외 지역');
  SPEC.excluded.forEach((n, i) => el('div', 'chip', { position: 'absolute', left: (28 + (i % 2) * (w * .6)) + 'px', top: (74 + Math.floor(i / 2) * (fs * 2.3)) + 'px', fontSize: fs + 'px', padding: '12px 24px', background: n === '대한민국' ? C.red : '#fff', color: n === '대한민국' ? '#fff' : C.ink }, b, '✗ ' + n)); return b; }
const BOTH = [[SPEC.part, C.lilac, '글 읽는 부분 62'], [SPEC.part, C.peach, '그림 본체 62']];
const PEAK = [[SPEC.peak, C.orange, '번갈아 올려 최고 약 65']];

const THUMBS = {
  thumb: { w: 1280, h: 720, file: 'thumbnail.jpg', bg: C.lilac, scene: S => {
    el('div', null, { position: 'absolute', left: '60px', top: '40px', fontSize: '88px', fontWeight: '900', letterSpacing: '-3px' }, null, 'MiniMax-H3-Image');
    const cap = caption(-1, null, [['*내 PC로*', '돌아갈까?']], { x: 60, y: 160, size: 76 });
    chip('사양 체크 · 직접 실행 안 함 · 공식 자료', 60, 270, { fontSize: '26px', background: C.ink, color: '#fff' });
    gpu(60, 340, 560, 180, 44);
    el('div', null, { position: 'absolute', left: '60px', top: '545px', fontSize: '58px', fontWeight: '900', color: C.orange, textShadow: '3px 3px 0 #141414' }, null, `VRAM 최고 약 ${SPEC.peak}GB`);
    el('div', null, { position: 'absolute', left: '64px', top: '635px', fontSize: '26px', fontWeight: '800' }, null, `최소 사양 표기 없음 · 저장 공간 약 ${SPEC.disk}GB`);
    exCard(680, 340, 560, 230, 30);
    const st = stamp('한국 제외', 900, 560, 52, -10);
    const nb = M.buddy(1050, 80, .5);
    return t => { cap.render(t); st.render(t, 0); nb.render(t, [{ at: 2.4, a: 'oops' }]); };
  } },
  thumbv: { w: 1080, h: 1920, file: 'thumbnail-shorts.jpg', bg: C.lilac, scene: S => {
    const cap = caption(-1, null, [['1,600만', '화소'], ['그림 AI,'], ['*내 PC로*', '돌아갈까?']], { x: 70, y: 280, size: 90 });
    gpu(70, 690, 940, 230, 62);
    bar(70, 960, 940, '큰 덩이 2개 (각 약 62GB)', BOTH, `약 ${SPEC.part * 2}GB`, 140, C.red);
    bar(70, 1160, 940, '80GB에서 번갈아 올리기', PEAK, `최고 약 ${SPEC.peak}GB`);
    el('div', null, { position: 'absolute', left: 0, right: 0, top: '1400px', textAlign: 'center', fontSize: '92px', fontWeight: '900', letterSpacing: '-3px' }, null, 'MiniMax-H3-Image');
    chip('라이선스 제외 지역: 대한민국', 210, 1540, { fontSize: '40px', padding: '14px 30px', background: C.red, color: '#fff' });
    const nb = M.buddy(780, 330, .62);
    return t => { cap.render(t); nb.render(t, [{ at: 2.4, a: 'look' }]); };
  } },
  spec: { w: 1600, h: 900, file: 'spec-card.png', bg: C.blue, scene: S => {
    const cap = caption(-1, null, [['MiniMax-H3-Image', '필요', '사양', '—', '*공식 최소 VRAM 표기 없음*']], { x: 70, y: 46, size: 52 });
    gpu(70, 150, 640, 200, 46);
    bar(760, 150, 770, '큰 덩이 2개를 다 올리면 (bfloat16)', BOTH, `약 ${SPEC.part * 2}GB`, 140, C.red);
    bar(760, 345, 770, `자동 오프로드 · ${SPEC.peakShape} 1장`, PEAK, `최고 약 ${SPEC.peak}GB`);
    const R = [['저장 공간 (원래 파일)', `그림 본체 ${SPEC.dit} + 글 읽기 ${SPEC.te} + VAE ${SPEC.vae}GB ≈ ${SPEC.disk}GB`], ['ComfyUI 줄인 파일', `본체 ${SPEC.comfy.dit} + 글 읽기 ${SPEC.comfy.te} + VAE ${SPEC.comfy.vae}GB ≈ ${SPEC.comfy.sum}GB (필요 VRAM 표기 없음)`], ['운영체제 · RAM', '공식 표기 없음'], ['생성 시간', `${SPEC.speed} (공식 블로그 · 그래픽카드 종류 표기 없음)`]];
    R.forEach((r, i) => { const b = box(70, 545 + i * 80, 1460, 68, 'card', { display: 'flex', alignItems: 'center', gap: '24px', padding: '0 24px' }); el('div', null, { width: '300px', flex: 'none', fontSize: '25px', fontWeight: '800', color: '#666' }, b, r[0]); el('div', null, { fontSize: '25px', fontWeight: '900', whiteSpace: 'nowrap' }, b, M.esc(r[1])); });
    el('div', null, { position: 'absolute', left: '70px', top: '378px', width: '640px', fontSize: '26px', fontWeight: '800', lineHeight: '1.5' }, null, '두 덩이는 80GB 그래픽카드 1장에 같이 안 들어감<br>→ 공식 예시는 자동 오프로드 (diffusers 문서)');
    foot(); return t => cap.render(t);
  } },
  license: { w: 1600, h: 900, file: 'license.png', bg: C.peach, scene: S => {
    const cap = caption(-1, null, [['모델', '라이선스', '제외', '지역에', '*대한민국*']], { x: 70, y: 46, size: 56 });
    const b = box(70, 160, 700, 590, 'card', { padding: '30px' }); el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, b, '모델 파일(가중치)'); el('div', null, { fontSize: '44px', fontWeight: '900', lineHeight: '1.25', marginTop: '6px' }, b, 'MiniMax-H3-Image<br>Community License');
    el('div', null, { fontSize: '27px', fontWeight: '700', color: '#444', marginTop: '22px', lineHeight: '1.65' }, b, `라이선스 날짜 ${SPEC.licDate} · 홍콩 법 적용<br>권한은 제외 지역 밖에서만 (I.3 · II · V.4)<br>${SPEC.revenue} 또는<br>남에게 서비스 제공 → 사전 서면 허가 (IV.1)<br>상업 화면에 'MiniMax-H3-Image' 표시 (IV.2)`);
    exCard(830, 160, 700, 330, 36);
    const st = stamp('한국 제외 → 허가 필요', 900, 540, 46, -6);
    el('div', null, { position: 'absolute', left: '830px', top: '650px', width: '700px', fontSize: '26px', fontWeight: '800', lineHeight: '1.5' }, null, '"Excluded Territories" (I.5): EU · 영국 ·<br>the Republic of Korea · 미국 — 법률 판단은 전문가 확인');
    foot(); return t => { cap.render(t); st.render(t, 0); };
  } },
};
