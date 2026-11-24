// Pika H3 Flex 사양 체크 편 썸네일·블로그 그림 — 직접 만든 사양 카드 (제작사 그림·데모 영상 쓰지 않음). 숫자는 data.js 의 SPEC(공식 자료)만
const { C, el, box, tf, caption, stamp, hand, pen, ellipsePath, pill, pillRender } = M;
const FOOT = '2026-11-25 공식 자료(README·docs/hardware.md·LICENSE) 기준 · 직접 실행하지 않음';
const foot = () => el('div', null, { position: 'absolute', right: '28px', bottom: '18px', fontSize: '20px', fontWeight: '700', color: '#666' }, null, FOOT);
const chip = (s, x, y, css = {}) => el('div', 'chip', Object.assign({ left: x + 'px', top: y + 'px' }, css), null, s);
const rng = a => a[0] + '~' + a[1];
function gpu(x, y, w, h, fs = 54) { const b = box(x, y, w, h, 'card dark', { padding: '26px 30px' });
  el('div', null, { position: 'absolute', right: '26px', top: '26px', width: (h - 52) + 'px', height: (h - 52) + 'px', borderRadius: '50%', border: '6px solid #555', background: 'repeating-conic-gradient(#333 0 20deg, #222 20deg 40deg)' }, b);
  el('div', 'mono', { fontSize: fs + 'px', fontWeight: '800', color: C.yellow }, b, SPEC.gpu); el('div', null, { fontSize: (fs * .5) + 'px', fontWeight: '700', color: '#ccc', marginTop: '8px' }, b, '공식 확인 그래픽카드 · 1장'); return b; }
function bar(x, y, w, title, v, col = C.orange, max = 100) { const b = box(x, y, w, 170, 'card', { padding: '20px 26px' });
  el('div', null, { fontSize: '28px', fontWeight: '900' }, b, title); el('div', null, { position: 'absolute', right: '26px', top: '14px', fontSize: '40px', fontWeight: '900', color: col }, b, rng(v) + 'GiB');
  const tr = el('div', null, { position: 'absolute', left: '26px', right: '26px', top: '76px', height: '48px', border: '4px solid #141414', borderRadius: '12px', background: '#eee', overflow: 'hidden' }, b);
  el('div', null, { position: 'absolute', left: 0, top: 0, bottom: 0, width: (v[1] / max * 100) + '%', background: col }, tr);
  const tw = w - 52; el('div', null, { position: 'absolute', left: (26 + tw * .8 - 2) + 'px', top: '68px', width: '4px', height: '64px', background: C.red }, b);
  el('div', null, { position: 'absolute', left: (26 + tw * .8 - 100) + 'px', top: '134px', width: '200px', textAlign: 'center', fontSize: '20px', fontWeight: '800', color: C.red }, b, '80GiB (H100)'); return b; }
function exCard(x, y, w, h, fs = 34) { const b = box(x, y, w, h, 'card', { padding: '24px 28px' }); el('div', null, { fontSize: (fs - 6) + 'px', fontWeight: '900' }, b, '모델 라이선스 제외 지역');
  SPEC.excluded.forEach((n, i) => el('div', 'chip', { position: 'absolute', left: (28 + (i % 2) * (w / 2 - 10)) + 'px', top: (74 + Math.floor(i / 2) * (fs * 2.3)) + 'px', fontSize: fs + 'px', padding: '12px 24px', background: n === '대한민국' ? C.red : '#fff', color: n === '대한민국' ? '#fff' : C.ink }, b, '✗ ' + n)); return b; }

const THUMBS = {
  thumb: { w: 1280, h: 720, file: 'thumbnail.jpg', bg: C.lilac, scene: S => {
    el('div', null, { position: 'absolute', left: '60px', top: '40px', fontSize: '96px', fontWeight: '900', letterSpacing: '-3px' }, null, 'Pika H3 Flex');
    const cap = caption(-1, null, [['*내 PC로*', '돌아갈까?']], { x: 60, y: 160, size: 76 });
    chip('사양 체크 · 직접 실행 안 함 · 공식 자료', 60, 270, { fontSize: '26px', background: C.ink, color: '#fff' });
    gpu(60, 340, 560, 180, 48);
    el('div', null, { position: 'absolute', left: '60px', top: '545px', fontSize: '62px', fontWeight: '900', color: C.orange, textShadow: '3px 3px 0 #141414' }, null, `VRAM ${rng(SPEC.std)}GiB`);
    el('div', null, { position: 'absolute', left: '64px', top: '635px', fontSize: '26px', fontWeight: '800' }, null, `${SPEC.stdShape} 기준 · 저장 공간 ${SPEC.disk}GB 이상`);
    exCard(680, 340, 560, 230, 30);
    const st = stamp('한국 제외', 900, 560, 52, -10);
    const nb = M.buddy(1050, 60, .5);
    return t => { cap.render(t); st.render(t, 0); nb.render(t, [{ at: 2.4, a: 'oops' }]); };
  } },
  thumbv: { w: 1080, h: 1920, file: 'thumbnail-shorts.jpg', bg: C.lilac, scene: S => {
    const cap = caption(-1, null, [['소리까지', '만드는'], ['영상 AI,'], ['*내 PC로*', '돌아갈까?']], { x: 70, y: 280, size: 90 });
    gpu(70, 690, 940, 230, 62);
    bar(70, 960, 940, `${SPEC.stdShape} · 다 올리기`, SPEC.std);
    bar(70, 1160, 940, `나눠 쓰기 + RAM 약 ${SPEC.offRam}GiB`, SPEC.off, C.green);
    el('div', null, { position: 'absolute', left: 0, right: 0, top: '1400px', textAlign: 'center', fontSize: '104px', fontWeight: '900', letterSpacing: '-3px' }, null, 'Pika H3 Flex');
    chip('라이선스 제외 지역: 대한민국', 210, 1540, { fontSize: '40px', padding: '14px 30px', background: C.red, color: '#fff' });
    const nb = M.buddy(780, 330, .62);
    return t => { cap.render(t); nb.render(t, [{ at: 2.4, a: 'look' }]); };
  } },
  spec: { w: 1600, h: 900, file: 'spec-card.png', bg: C.blue, scene: S => {
    const cap = caption(-1, null, [['Pika H3 Flex', '필요', '사양', '—', '*공식 대표 측정값*', '(최소 요구 사양 아님)']], { x: 70, y: 46, size: 52 });
    gpu(70, 150, 640, 200, 52);
    bar(760, 150, 770, `${SPEC.stdShape} · 기본 설정 (GPU 메모리)`, SPEC.std);
    bar(760, 345, 770, `${SPEC.offShape} · --cpu-offload`, SPEC.off, C.green);
    const R = [['시스템 메모리(RAM)', `오프로드 때 약 ${SPEC.offRam}GiB (파일 캐시 포함)`], ['저장 공간', `바탕 모델 ${SPEC.disk}GB 이상 + 어댑터 약 ${SPEC.adapters}GB`], ['파이썬 · 운영체제', `${SPEC.python} · 운영체제 공식 표기 없음 · Windows 안내 없음`], ['생성 시간', '공개된 측정값 없음']];
    R.forEach((r, i) => { const b = box(70, 545 + i * 80, 1460, 68, 'card', { display: 'flex', alignItems: 'center', gap: '24px', padding: '0 24px' }); el('div', null, { width: '300px', fontSize: '26px', fontWeight: '800', color: '#666' }, b, r[0]); el('div', null, { fontSize: '28px', fontWeight: '900' }, b, M.esc(r[1])); });
    el('div', null, { position: 'absolute', left: '70px', top: '378px', width: '640px', fontSize: '26px', fontWeight: '800', lineHeight: '1.5' }, null, `H200 · B300 미확인 · 요청 1개 = 그래픽카드 1장<br>768p·15초 기본 설정은 H100 메모리 초과`);
    foot(); return t => cap.render(t);
  } },
  license: { w: 1600, h: 900, file: 'license.png', bg: C.peach, scene: S => {
    const cap = caption(-1, null, [['코드와', '모델', '파일', '라이선스가', '다름', '·', '제외', '지역에', '*대한민국*']], { x: 70, y: 46, size: 56 });
    const a = box(70, 160, 700, 200, 'card', { padding: '26px' }); el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, a, '실행 코드'); el('div', null, { fontSize: '56px', fontWeight: '900', color: C.green }, a, 'Apache-2.0');
    const b = box(70, 390, 700, 360, 'card', { padding: '26px' }); el('div', null, { fontSize: '28px', fontWeight: '800', color: '#666' }, b, '모델 파일(가중치)'); el('div', null, { fontSize: '40px', fontWeight: '900' }, b, 'MiniMax H3 Community License'); el('div', null, { fontSize: '26px', fontWeight: '700', color: '#666', marginTop: '10px', lineHeight: '1.5' }, b, `라이선스 날짜 ${SPEC.licDate} · 홍콩 법 적용<br>${SPEC.revenue} → 사전 서면 허가<br>상업 화면에 'MiniMax H3' 표시`);
    exCard(830, 160, 700, 330, 40);
    const st = stamp('한국 제외 → 문의 필요', 900, 540, 46, -6);
    el('div', null, { position: 'absolute', left: '830px', top: '650px', width: '700px', fontSize: '26px', fontWeight: '800', lineHeight: '1.5' }, null, '제외 지역에서는 사용이 허락되지 않음 (Section I.5 · V.4)<br>법률 판단은 전문가에게 확인');
    foot(); return t => { cap.render(t); st.render(t, 0); };
  } },
};
