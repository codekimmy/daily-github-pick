// Stegano 썸네일·블로그 그림 — 모션 스타일 (tools/motion/README.md 10장)
// 숫자는 data.js 의 RES(= demo/results.json 시연 측정값)만 씀. 그림은 코드로 그린 가상 그림, 쪽지는 가상 쪽지
// img/* = Stegano 3.0.0 이 실제로 만든 결과 그림. 각 장면은 3초 안에 다 나타나고 마지막 프레임을 찍음
const { C, el, box, caption, stamp, hand, pill, pillRender } = M;
const FOOT = '2026-11-28 클라우드 시연 결과 · 그림·쪽지는 가상 자료';
const foot = () => el('div', null, { position: 'absolute', right: '28px', bottom: '18px', fontSize: '20px', fontWeight: '700', color: '#666' }, null, FOOT);
const chip = (s, x, y, css = {}) => el('div', 'chip', Object.assign({ left: x + 'px', top: y + 'px' }, css), null, s);
const pillOn = (p, ok) => pillRender(p, 9, 0, ok);
const f2 = v => Number(v).toFixed(2);
const NOTE = '엄마 생신 깜짝 파티\n12월 5일 저녁 7시';
function pic(x, y, w, h, name, src, o = {}) {   // scenes.js 의 그림 카드와 같은 모양
  const b = box(x, y, w, h, 'card', { padding: '0', overflow: 'hidden', transform: o.rot ? `rotate(${o.rot}deg)` : 'none' });
  el('div', null, { background: '#7C3AED', color: '#fff', fontWeight: '900', fontSize: (o.fs || 26) + 'px', padding: '8px 20px', display: 'flex', gap: '14px', alignItems: 'center', whiteSpace: 'nowrap' }, b,
    `<span style="background:#fff;color:#7C3AED;border-radius:8px;padding:0 10px">PNG</span><span>${M.esc(name)}</span>`);
  const body = el('div', null, { position: 'absolute', left: '0', right: '0', top: (o.fs || 26) + 26 + 'px', bottom: '0', overflow: 'hidden', background: '#222' }, b);
  el('img', null, { width: '100%', height: '100%', objectFit: o.fit || 'cover', display: 'block' }, body).src = src;
  return b;
}
function note(x, y, w, h, text, o = {}) {
  const b = box(x, y, w, h, 'card', { padding: '22px 28px', background: '#FFF6C9', transform: o.rot ? `rotate(${o.rot}deg)` : 'none' });
  el('div', null, { fontSize: (o.hs || 24) + 'px', fontWeight: '800', color: '#9A7B1C', marginBottom: '8px' }, b, o.head || '📝 꺼낸 쪽지 (가상)');
  const tx = el('div', null, { fontSize: (o.fs || 34) + 'px', fontWeight: '900', lineHeight: '1.35', whiteSpace: 'pre-wrap' }, b, M.esc(text));
  return { b, tx };
}
const name = (x, y, s, css = {}) => el('div', null, Object.assign({ position: 'absolute', left: x + 'px', top: y + 'px', fontSize: s + 'px', fontWeight: '900', letterSpacing: '-3px' }, css), null, 'Stegano<span style="color:#FF5A1F">.</span>');

const THUMBS = {
  // ---- 롱폼 썸네일 1280×720 ----
  thumb: { w: 1280, h: 720, file: 'thumbnail.jpg', bg: C.beige, scene: S => {
    pic(40, 200, 470, 300, '비밀.png', 'img/secret.png', { fs: 22, rot: -4 });
    el('div', null, { position: 'absolute', left: '520px', top: '290px', fontSize: '70px', fontWeight: '900', color: C.orange }, null, '→');
    note(600, 210, 420, 230, NOTE, { fs: 38, rot: 3 });
    const st = stamp(f2(RES.hide.sec) + '초', 820, 420, 56, -9);
    const cap = caption(-1, null, [['이', '그림', '속에'], ['*쪽지*가', '있습니다']], { x: 40, y: 30, size: 68 });
    chip(`바뀐 점 ${RES.hide.changed_pct}% · 눈으로는 똑같음`, 40, 530, { fontSize: '30px', padding: '10px 22px' });
    name(40, 600, 76);
    const nb = M.buddy(1120, 500, .42);
    return t => { cap.render(t); st.render(t, 0); nb.render(t, [{ at: 2.4, a: 'point', dir: 'left' }]); };
  } },
  // ---- 숏폼 썸네일 1080×1920 (글자는 위아래 250px 안쪽) ----
  thumbv: { w: 1080, h: 1920, file: 'thumbnail-shorts.jpg', bg: C.beige, scene: S => {
    const cap = caption(-1, null, [['이', '그림', '속에'], ['*쪽지*가?']], { x: 70, y: 290, size: 100 });
    pic(70, 560, 940, 440, '비밀.png', 'img/secret.png', { fs: 28, rot: -2 });
    el('div', null, { position: 'absolute', left: '480px', top: '1010px', fontSize: '90px', fontWeight: '900', color: C.orange }, null, '↓');
    note(70, 1150, 940, 330, NOTE, { fs: 62, rot: 2, hs: 30 });
    const st = stamp(f2(RES.reveal.sec) + '초', 700, 1420, 80, -9);
    name(0, 1540, 120, { left: 0, right: 0, textAlign: 'center' });
    const nb = M.buddy(790, 990, .4);
    return t => { cap.render(t); st.render(t, 0); nb.render(t, [{ at: 2.4, a: 'point', dir: 'left' }]); };
  } },
  // ---- 블로그 그림 1600×900: 숨기기 비교 ----
  hide: { w: 1600, h: 900, file: 'hide.png', bg: C.blue, scene: S => {
    const cap = caption(-1, null, [['쪽지를', '숨겨도', '→', '*눈으로는 똑같음*']], { x: 70, y: 46, size: 58 });
    pic(70, 160, 560, 360, '가을산책.png (원본)', 'img/orig.png', { fs: 22 });
    pic(680, 160, 560, 360, '비밀.png (쪽지 숨김)', 'img/secret.png', { fs: 22 });
    el('div', null, { position: 'absolute', left: '636px', top: '300px', fontSize: '60px', fontWeight: '900', color: C.green }, null, '=');
    const g = box(70, 550, 1170, 200, 'card', { padding: '14px 20px' });
    el('div', null, { fontSize: '22px', fontWeight: '800', color: '#666' }, g, '맨 위 줄 앞 8개 점 [빨강 · 초록 · 파랑] — 위: 원본 · 아래: 비밀.png (바뀐 번호 = 노란 칸)');
    RES.row0.secret.slice(0, 8).forEach((v, i) => { const o = RES.row0.orig[i];
      el('div', 'mono', { position: 'absolute', left: (20 + i * 143) + 'px', top: '50px', width: '134px', height: '136px', borderRadius: '10px', border: '3px solid #141414', background: `rgb(${o.join(',')})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '19px', fontWeight: '900', lineHeight: '1.3' }, g,
        `<span>${o.join(' ')}</span><span style="color:#999">↓</span><span>${v.map((n, j) => n !== o[j] ? `<b style="color:#E5482D;background:#FFD84D;border-radius:5px">${n}</b>` : n).join(' ')}</span>`); });
    const k = box(1280, 160, 260, 590, 'card', { padding: '24px' });
    el('div', null, { fontSize: '24px', fontWeight: '800', color: '#666' }, k, '바뀐 점');
    el('div', null, { fontSize: '64px', fontWeight: '900', color: C.orange }, k, RES.hide.changed_px + '개');
    el('div', null, { fontSize: '30px', fontWeight: '900' }, k, `전체의 ${RES.hide.changed_pct}%`);
    el('div', null, { fontSize: '24px', fontWeight: '800', color: '#666', marginTop: '22px' }, k, '색 번호 차이');
    el('div', null, { fontSize: '44px', fontWeight: '900', color: C.orange }, k, '최대 ' + RES.hide.max_step + '칸');
    el('div', null, { fontSize: '24px', fontWeight: '800', color: '#666', marginTop: '22px' }, k, '숨기기 · 꺼내기');
    el('div', null, { fontSize: '27px', fontWeight: '900', whiteSpace: 'nowrap' }, k, `${f2(RES.hide.sec)}초 · ${f2(RES.reveal.sec)}초`);
    chip(`stegano-lsb hide -i 가을산책.png -m "쪽지" -o 비밀.png · 쪽지 ${RES.hide.chars}자 그대로 꺼내짐`, 70, 780, { fontSize: '24px', fontFamily: '"DejaVu Sans Mono", monospace' });
    foot(); return t => cap.render(t);
  } },
  // ---- 블로그 그림: 옮기기 시험 ----
  survive: { w: 1600, h: 900, file: 'survive.png', bg: C.mint, scene: S => {
    const V = RES.survive;
    const cap = caption(-1, null, [['PNG', '그대로면', '남고', '·', '*JPG로 바꾸면 사라짐*']], { x: 70, y: 46, size: 56 });
    const OK = [['파일 복사', V.copy.ok], ['PNG로 다시 저장', V.png_resave.ok], ['무손실 WebP로 저장', V.webp_lossless.ok], ['아래쪽 자르기', V.crop_bottom.ok]];
    const NG = [['JPG 화질 95로 다시 저장', V.jpg95.ok], ['JPG 화질 100으로 다시 저장', V.jpg100.ok], ['크기 1% 줄이기 (1280 → 1267)', V.resize99.ok], ['위쪽 10줄 자르기', V.crop_top.ok], ['처음부터 -o 비밀.jpg 로 저장', RES.out_jpg.reveal_ok]];
    el('div', null, { position: 'absolute', left: '70px', top: '160px', fontSize: '32px', fontWeight: '900', color: C.green }, null, '쪽지가 남음');
    el('div', null, { position: 'absolute', left: '830px', top: '160px', fontSize: '32px', fontWeight: '900', color: C.red }, null, '쪽지가 사라짐 (Impossible to detect message.)');
    OK.forEach((p, i) => { const e = pill((p[1] ? '✓ ' : '✗ ') + p[0], p[1], 70, 220 + i * 90, 700, 70); e.style.fontSize = '30px'; pillOn(e, p[1]); });
    NG.forEach((p, i) => { const e = pill((p[1] ? '✓ ' : '✗ ') + p[0], p[1], 830, 220 + i * 90, 700, 70); e.style.fontSize = '30px'; pillOn(e, p[1]); });
    hand('결과는 꼭 .png · 파일 그대로 보내기', 70, 640, 44, -3).el.style.clipPath = 'none';
    chip('메신저 실제 전송은 확인 못 함 (JPG 다시 저장 · 크기 줄이기로 흉내 냄)', 70, 760, { fontSize: '24px' });
    foot(); return t => cap.render(t);
  } },
  // ---- 블로그 그림: 들키나 검사 ----
  detect: { w: 1600, h: 900, file: 'detect.png', bg: C.peach, scene: S => {
    const cap = caption(-1, null, [['끝자리', '검사', '그림:', '많이', '넣으면', '*줄무늬로 드러남*']], { x: 70, y: 46, size: 54 });
    [['원본', 'img/parity-orig.png'], [`짧은 쪽지 (${RES.hide.chars}자)`, 'img/parity-secret.png'], ['한글 10만 자', 'img/parity-long.png']].forEach((p, i) => pic(70 + i * 500, 160, 470, 360, '검사 · ' + p[0], p[1], { fs: 22, fit: 'fill' }));
    chip('원본과 구분 안 됨', 570, 540, { fontSize: '26px' });
    chip(`위쪽 ${Math.round(100 * (RES.long100k.rows[1] + 1) / 720)}%가 줄무늬 · 바뀐 점 ${RES.long100k.changed_pct}%`, 1070, 540, { fontSize: '24px', background: C.red, color: '#fff' });
    [['✗ 숨기기일 뿐 암호화 아님 — Stegano만 있으면 누구나 꺼냄', false], [`✗ -g 숨기는 차례도 암호가 아님 (같은 -g 없이 꺼내면 실패 · 차례 15가지 공개)`, false], ['✓ 비밀번호 · 개인정보는 넣지 않기', true]]
      .forEach((p, i) => { const e = pill(p[0], p[1], 70, 620 + i * 74, 1460, 60); e.style.fontSize = '26px'; pillOn(e, p[1]); });
    foot(); return t => cap.render(t);
  } },
};
