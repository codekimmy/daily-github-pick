// jrnl 썸네일·블로그 그림 — 모션 스타일 (tools/motion/README.md 10장)
// 숫자는 data.js 의 RES(= demo/results.json 시연 측정값)만 씀. 일기 내용은 시연용 가상 자료. 각 장면은 3초 안에 다 나타나고 마지막 프레임을 찍음
const { C, el, box, tf, caption, stamp, hand, pen, ellipsePath, pill, pillRender, stars } = M;
const FOOT = '2026-11-25 클라우드 시연 결과 · 일기 내용은 시연용 가상 자료';
const foot = () => el('div', null, { position: 'absolute', right: '28px', bottom: '18px', fontSize: '20px', fontWeight: '700', color: '#666' }, null, FOOT);
const chip = (s, x, y, css = {}) => el('div', 'chip', Object.assign({ left: x + 'px', top: y + 'px' }, css), null, s);
const pillOn = (p, ok) => pillRender(p, 9, 0, ok);
const f2 = v => Number(v).toFixed(2), BIG = RES.big;
const tagHL = s => M.esc(s).replace(/([@#][^\s.,]+)/g, `<span style="color:${C.orange};font-weight:900">$1</span>`);
function entry(x, y, w, date, title, body, o = {}) {   // scenes.js 의 일기 카드와 같은 모양 (다 나타난 모습)
  const h = o.h || 140, fs = o.fs || 34;
  const b = box(x, y, w, h, 'card', { display: 'flex', alignItems: 'center', gap: '24px', padding: '0 28px' });
  const d = el('div', null, { minWidth: '140px', height: '98px', border: `5px solid ${C.red}`, borderRadius: '18px', color: C.red, fontWeight: '900', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: '1.1', transform: 'rotate(-6deg)' }, b);
  const [dd, tt] = date.split(' '); el('div', null, { fontSize: '26px' }, d, dd.slice(5).replace('-', '.')); el('div', null, { fontSize: '22px' }, d, tt);
  const tx = el('div', null, { overflow: 'hidden' }, b);
  el('div', null, { fontSize: fs + 'px', fontWeight: '900', whiteSpace: 'nowrap' }, tx, tagHL(title));
  if (body) el('div', null, { fontSize: (fs - 8) + 'px', fontWeight: '700', color: '#555', whiteSpace: 'nowrap' }, tx, tagHL(body));
  if (o.dim) { b.style.opacity = .4; b.style.filter = 'grayscale(1)'; }
  return b;
}
function grid(x, y, w, h, hitCol = C.orange) {   // 10년 × 365일 칸 (떡볶이 나온 날 주황)
  const b = box(x, y, w, h, 'card', { padding: '18px' }); const cv = el('canvas', null, { position: 'absolute', left: '18px', top: '18px' }, b);
  cv.width = w - 36; cv.height = h - 36; const g = cv.getContext('2d'); let sd = 25; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const cw = cv.width / 365, rh = cv.height / 10;
  for (let i = 0; i < 3650; i++) { const hit = rnd() < BIG.contains.n / 3650, yy = Math.floor(i / 365), xx = i % 365; g.fillStyle = hit ? hitCol : '#cfc7b4'; g.fillRect(xx * cw, yy * rh + 3, Math.max(1.2, cw * .82), rh - 10); }
  return b;
}

const THUMBS = {
  // ---- 롱폼 썸네일 1280×720 ----
  thumb: { w: 1280, h: 720, file: 'thumbnail.jpg', bg: C.beige, scene: S => {
    const card = box(50, 150, 560, 470, 'card', { background: '#FFF8E1', padding: '24px', transform: 'rotate(-3deg)' });
    [['2026-11-24 09:00', '점심은 김치찌개.', '@점심 #가계부'], ['2026-11-20 19:00', '친구 생일 파티.', '@모임'], ['2026-11-25 07:47', '저녁 산책 30분.', '@운동']]
      .forEach((e, i) => { const b = entry(20, 20 + i * 145, 520, e[0], e[1], e[2], { h: 128, fs: 32 }); card.appendChild(b); });
    const st = stamp(f2(RES.write_avg) + '초', 400, 590, 56, -9);
    const cap = caption(-1, null, [['명령 창', '한', '줄로'], ['*일기 끝*']], { x: 660, y: 120, size: 92 });
    chip(`10년치 찾기 ${f2(BIG.contains.sec)}초`, 670, 390, { fontSize: '34px', padding: '12px 26px' });
    el('div', 'mono', { position: 'absolute', left: '670px', top: '500px', fontSize: '110px', fontWeight: '800', color: C.ink, letterSpacing: '-3px' }, null, 'jrnl<span style="color:#FF5A1F">.</span>');
    const nb = M.buddy(1050, 400, .62);
    return t => { cap.render(t); st.render(t, 0); nb.render(t, [{ at: 2.4, a: 'point', dir: 'left' }]); };
  } },
  // ---- 숏폼 썸네일 1080×1920 (글자는 위아래 250px 안쪽) ----
  thumbv: { w: 1080, h: 1920, file: 'thumbnail-shorts.jpg', bg: C.beige, scene: S => {
    const cap = caption(-1, null, [['10년', '전', '오늘,'], ['*기억*', '하십니까?']], { x: 70, y: 290, size: 100 });
    [['2017-11-25 21:00', '점심은 떡볶이.', '@독서'], ['2020-11-25 21:00', '점심은 비빔밥.', '@운동'], ['2023-11-25 21:00', '점심은 칼국수.', '@모임']]
      .forEach((e, i) => entry(70, 620 + i * 190, 940, e[0], e[1], e[2], { h: 165, fs: 40 }));
    const st = stamp(f2(BIG.contains.sec) + '초', 700, 560, 76, -9);
    chip(`가상 일기 3,650개에서 찾기`, 70, 1220, { fontSize: '40px', padding: '14px 30px' });
    const nb = M.buddy(800, 1230, .62);
    el('div', 'mono', { position: 'absolute', left: 0, right: 0, top: '1480px', textAlign: 'center', fontSize: '130px', fontWeight: '800', letterSpacing: '-4px' }, null, 'jrnl<span style="color:#FF5A1F">.</span>');
    return t => { cap.render(t); st.render(t, 0); nb.render(t, [{ at: 2.4, a: 'point', dir: 'left' }]); };
  } },
  // ---- 블로그 그림 1600×900: 한 줄 쓰기 + 꼬리표 찾기 ----
  tags: { w: 1600, h: 900, file: 'write-tags.png', bg: C.blue, scene: S => {
    const cap = caption(-1, null, [['한', '줄', '쓰기', '*' + f2(RES.write_avg) + '초*', '·', '@꼬리표로', '골라', '보기']], { x: 70, y: 46, size: 60 });
    const tm = box(70, 160, 860, 150, 'card dark', { padding: '22px 30px' });
    el('div', 'mono', { fontSize: '25px', lineHeight: '1.6', color: '#EDEDED' }, tm, '<span style="color:#FFB86B">C:\\&gt; </span>jrnl "점심은 김치찌개였다. @점심 #가계부 9000원"<br><span style="color:#FFB86B">C:\\&gt; </span>jrnl @점심');
    [['2026-11-16 15:00', '팀 회의 메모.', '@회의 다음 주 금요일까지 보고서', 1], ['2026-11-20 19:00', '친구 생일 파티.', '@모임 케이크를 나눠 먹었다', 1], ['2026-11-24 09:00', '점심은 김치찌개였다.', '@점심 #가계부 9000원', 0], ['2026-11-25 07:47', '오늘 저녁 산책 30분.', '@운동', 1]]
      .forEach((e, i) => entry(70, 340 + i * 122, 860, e[0], e[1], e[2], { h: 108, fs: 30, dim: e[3] }));
    const tg = box(980, 160, 550, 520, 'card', { padding: '24px 30px' });
    el('div', null, { fontSize: '30px', fontWeight: '900', marginBottom: '10px' }, tg, 'jrnl --tags (꼬리표마다 쓴 횟수)');
    RES.tags.out.split('\n').forEach(l => { const n = l.split(':')[0].trim(); const r = el('div', null, { display: 'flex', alignItems: 'center', gap: '16px', height: '66px', fontSize: '30px', fontWeight: '800' }, tg);
      el('div', null, { width: '160px', color: C.orange }, r, M.esc(n)); el('div', null, { height: '30px', width: '200px', background: C.yellow, border: '3px solid #141414', borderRadius: '8px' }, r); el('div', null, {}, r, '1'); });
    chip(`1 entry found · ${f2(RES.find_tag.sec)}초`, 980, 710, { fontSize: '30px', background: C.ink, color: '#fff' });
    foot(); return t => cap.render(t);
  } },
  // ---- 블로그 그림: 10년치 3,650개에서 찾기 ----
  big: { w: 1600, h: 900, file: 'ten-years.png', bg: C.mint, scene: S => {
    const cap = caption(-1, null, [['가상', '일기', '10년치', '3,650개에서', "'떡볶이'", '→', '*' + BIG.contains.n + '개*']], { x: 70, y: 46, size: 58 });
    grid(70, 160, 980, 540);
    for (let y = 0; y < 10; y++) el('div', null, { position: 'absolute', left: '1062px', top: (182 + y * 50.4) + 'px', fontSize: '20px', fontWeight: '800', color: '#777' }, null, (y + 1) + '년');
    const st = stamp(f2(BIG.contains.sec) + '초', 1180, 170, 64, -9);
    const P2 = [[`@운동 꼬리표 ${BIG.tag.n}개`, BIG.tag.sec], [`2020년 일기 ${BIG.year.n}개`, BIG.year.sec], [`별표 일기 ${BIG.starred.n}개`, BIG.starred.sec], [`해마다 오늘 ${BIG.today_in_history.n}개`, BIG.today_in_history.sec]];
    P2.forEach((p, i) => pillOn(pill(`${p[0]} · ${f2(p[1])}초`, true, 1130, 300 + i * 80, 420, 60), true));
    chip(`글자 파일 ${Math.round(BIG.file_bytes / 1000)}KB · CPU 2개 클라우드`, 70, 730, { fontSize: '28px' });
    foot(); return t => { cap.render(t); st.render(t, 0); };
  } },
  // ---- 블로그 그림: 암호 자물쇠 ----
  lock: { w: 1600, h: 900, file: 'encrypt.png', bg: C.peach, scene: S => {
    const cap = caption(-1, null, [['--encrypt', '→', '*' + f2(RES.encrypt.sec) + '초*', '만에', '잠김', '·', '틀린', '암호', '3번이면', '멈춤']], { x: 70, y: 46, size: 56 });
    const bf = box(70, 170, 680, 260, 'card', { padding: '0', overflow: 'hidden' });
    el('div', null, { background: '#dfe6ee', fontSize: '24px', fontWeight: '800', padding: '10px 20px' }, bf, `잠그기 전 journal.txt (${RES.encrypt.plain_bytes}바이트)`);
    el('div', 'mono', { fontSize: '25px', padding: '16px 20px', lineHeight: '1.6', whiteSpace: 'pre' }, bf, '[2026-11-24 09:00] 점심은 김치찌개였다.\n@점심 #가계부 9000원');
    const af = box(850, 170, 680, 260, 'card', { padding: '0', overflow: 'hidden' });
    el('div', null, { background: C.ink, color: '#fff', fontSize: '24px', fontWeight: '800', padding: '10px 20px' }, af, `잠근 뒤 journal.txt (${RES.encrypt.enc_bytes}바이트)`);
    el('div', 'mono', { fontSize: '25px', padding: '16px 20px', lineHeight: '1.5', wordBreak: 'break-all', color: '#444' }, af, 'JRNLv3 0eyJzYWx0IjoiQ0hkZ3Vq… gAAAAABn4kQ2x9Lw0kVnR1…');
    el('div', null, { position: 'absolute', left: '760px', top: '260px', fontSize: '70px', fontWeight: '900', color: C.orange }, null, '→');
    el('div', null, { position: 'absolute', left: '870px', top: '440px', fontSize: '32px', fontWeight: '900', color: C.red }, null, "'김치찌개' 글자 0번");
    [['✗ 틀린 암호 1', false], ['✗ 틀린 암호 2', false], ['✗ 틀린 암호 3 → Too many attempts', false], ['✓ 맞는 암호 → 그대로 열림', true]].forEach((p, i) => pillOn(pill(p[0], p[1], 70, 520 + i * 76, 640, 60), p[1]));
    hand('암호를 잊으면 되살릴 방법 없음!', 850, 600, 44, -4).el.style.clipPath = 'none';
    foot(); return t => cap.render(t);
  } },
};
