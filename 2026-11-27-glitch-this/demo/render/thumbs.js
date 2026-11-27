// glitch-this 썸네일·블로그 그림 — 모션 스타일 (tools/motion/README.md 10장)
// 숫자는 data.js 의 RES(= demo/results.json 시연 측정값)만 씀. 그림은 모두 코드로 그린 가상 그림
// img/* = glitch-this 1.0.3 이 실제로 만든 결과 그림. 각 장면은 3초 안에 다 나타나고 마지막 프레임을 찍음
const { C, el, box, caption, stamp, hand, pill, pillRender } = M;
const FOOT = '2026-11-27 클라우드 시연 결과 · 그림은 코드로 그린 가상 그림';
const foot = () => el('div', null, { position: 'absolute', right: '28px', bottom: '18px', fontSize: '20px', fontWeight: '700', color: '#666' }, null, FOOT);
const chip = (s, x, y, css = {}) => el('div', 'chip', Object.assign({ left: x + 'px', top: y + 'px' }, css), null, s);
const pillOn = (p, ok) => pillRender(p, 9, 0, ok);
const f2 = v => Number(v).toFixed(2);
const FMT = { png: ['PNG', '#7C3AED'], jpg: ['JPG', '#0E7490'], gif: ['GIF', '#DB2777'] };
function pic(x, y, w, h, kind, name, src, o = {}) {   // scenes.js 의 그림 카드와 같은 모양
  const [lab, col] = FMT[kind];
  const b = box(x, y, w, h, 'card', { padding: '0', overflow: 'hidden', transform: o.rot ? `rotate(${o.rot}deg)` : 'none' });
  el('div', null, { background: col, color: '#fff', fontWeight: '900', fontSize: (o.fs || 26) + 'px', padding: '8px 20px', display: 'flex', gap: '14px', alignItems: 'center', whiteSpace: 'nowrap' }, b,
    `<span style="background:#fff;color:${col};border-radius:8px;padding:0 10px">${lab}</span><span>${M.esc(name)}</span>`);
  const body = el('div', null, { position: 'absolute', left: '0', right: '0', top: (o.fs || 26) + 26 + 'px', bottom: '0', overflow: 'hidden', background: '#222' }, b);
  el('img', null, { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }, body).src = src;
  return b;
}
const arrowTxt = (x, y, s = 80) => el('div', null, { position: 'absolute', left: x + 'px', top: y + 'px', fontSize: s + 'px', fontWeight: '900', color: C.orange }, null, '→');
const glitchWord = (x, y, s, css = {}) => el('div', 'mono', Object.assign({ position: 'absolute', left: x + 'px', top: y + 'px', fontSize: s + 'px', fontWeight: '800', color: C.ink, letterSpacing: '-3px', textShadow: '6px 0 0 #FF2D55, -6px 0 0 #00B3FF' }, css), null, 'glitch-this<span style="color:#FF5A1F">.</span>');

const THUMBS = {
  // ---- 롱폼 썸네일 1280×720 ----
  thumb: { w: 1280, h: 720, file: 'thumbnail.jpg', bg: C.beige, scene: S => {
    pic(40, 200, 360, 240, 'png', '원본', 'img/orig.png', { fs: 22, rot: -4 });
    arrowTxt(405, 270, 70);
    pic(470, 170, 520, 330, 'png', '명령 한 줄 뒤', 'img/color.png', { fs: 22, rot: 3 });
    const st = stamp(ONE_T() + '초', 760, 470, 58, -9);
    const cap = caption(-1, null, [['멀쩡한', '그림을'], ['*고장 난 TV*처럼']], { x: 40, y: 30, size: 68 });
    chip(`움직이는 GIF ${RES.gif.frames}장도 ${f2(RES.gif.sec)}초`, 40, 525, { fontSize: '30px', padding: '10px 22px' });
    glitchWord(40, 610, 62);
    const nb = M.buddy(1120, 500, .42);
    return t => { cap.render(t); st.render(t, 0); nb.render(t, [{ at: 2.4, a: 'point', dir: 'left' }]); };
  } },
  // ---- 숏폼 썸네일 1080×1920 (글자는 위아래 250px 안쪽) ----
  thumbv: { w: 1080, h: 1920, file: 'thumbnail-shorts.jpg', bg: C.beige, scene: S => {
    const cap = caption(-1, null, [['멀쩡한', '그림이'], ['*고장 난 TV*로?']], { x: 70, y: 290, size: 100 });
    pic(70, 560, 940, 420, 'png', '겨울바다.png (원본)', 'img/orig.png', { fs: 28, rot: -2 });
    arrowTxt(480, 965, 90);
    pic(70, 1080, 940, 420, 'gif', `움직임.gif (${RES.gif.frames}장)`, 'img/gif3.jpg', { fs: 28, rot: 2 });
    const st = stamp(f2(RES.gif.sec) + '초', 700, 1400, 80, -9);
    glitchWord(0, 1560, 110, { left: 0, right: 0, textAlign: 'center' });
    const nb = M.buddy(820, 1000, .5);
    return t => { cap.render(t); st.render(t, 0); nb.render(t, [{ at: 2.4, a: 'point', dir: 'left' }]); };
  } },
  // ---- 블로그 그림 1600×900: 세기 1 · 5 · 10 ----
  levels: { w: 1600, h: 900, file: 'levels.png', bg: C.blue, scene: S => {
    const cap = caption(-1, null, [['세기', '숫자', '하나로', '→', '*망가지는 정도*', '조절']], { x: 70, y: 46, size: 58 });
    pic(70, 160, 700, 520, 'png', '원본 겨울바다.png', 'img/orig.png');
    [1, 5, 10].forEach((v, i) => { pic(830, 160 + i * 180, 300, 165, 'png', '세기 ' + v, `img/lv${v}.png`, { fs: 22 });
      chip(`달라진 부분 ${RES.levels[v].changed_pct}%`, 1150, 210 + i * 180, { fontSize: '28px' }); });
    chip(`명령: glitch_this 겨울바다.png 5  → ${ONE_T()}초 · 결과는 glitched_겨울바다.png`, 70, 720, { fontSize: '26px', fontFamily: '"DejaVu Sans Mono", monospace' });
    [['✓ 원본은 그대로', true], ['✓ 같은 씨앗 번호(-sd) = 같은 결과', true]].forEach((p, i) => { const e = pill(p[0], true, 70 + i * 340, 800, i ? 470 : 320, 56); e.style.fontSize = '22px'; pillOn(e, true); });
    foot(); return t => cap.render(t);
  } },
  // ---- 블로그 그림: 색 어긋남 · 줄무늬 · GIF ----
  effects: { w: 1600, h: 900, file: 'effects.png', bg: C.mint, scene: S => {
    const cap = caption(-1, null, [['*-c*', '색', '어긋남', '·', '*-s*', '줄무늬', '·', '*-g*', '움직이는', 'GIF']], { x: 70, y: 46, size: 58 });
    pic(70, 160, 470, 300, 'png', '-c 색 어긋남', 'img/color.png', { fs: 22 });
    pic(565, 160, 470, 300, 'png', '-s 줄무늬', 'img/scan.png', { fs: 22 });
    pic(1060, 160, 470, 300, 'gif', `-g GIF ${RES.gif.frames}장 중 1장`, 'img/gif3.jpg', { fs: 22 });
    chip(`달라진 부분 ${RES.color.changed_pct}% · 밝기 그대로`, 70, 480, { fontSize: '24px' });
    chip(`평균 밝기 ${RES.scan.bright_orig} → ${RES.scan.bright} (절반)`, 565, 480, { fontSize: '24px' });
    chip(`${f2(RES.gif.sec)}초 · ${RES.gif.kb}KB · 한 장 ${RES.gif.duration_ms / 1000}초`, 1060, 480, { fontSize: '24px' });
    [[`✗ -g 와 -sd 를 같이 쓰면 ${RES.gif_seed.frames}장짜리 (움직이지 않음)`, false], [`✓ 이미 움직이는 GIF 도 -ig 로 ${RES.gif_in.frames}장 모두 효과`, true]].forEach((p, i) => pillOn(pill(p[0], p[1], 70, 580 + i * 74, 900, 58), p[1]));
    hand('줄무늬는 어두워짐!', 1020, 620, 44, -4).el.style.clipPath = 'none';
    foot(); return t => cap.render(t);
  } },
  // ---- 블로그 그림: 설치 · 아쉬운 점 ----
  limits: { w: 1600, h: 900, file: 'install-limits.png', bg: C.peach, scene: S => {
    const cap = caption(-1, null, [['*파이썬*', '먼저', '설치', '·', '명령', '한', '줄']], { x: 70, y: 46, size: 56 });
    const tm = box(70, 160, 900, 300, 'card dark', { padding: '24px 30px' });
    el('div', 'mono', { fontSize: '24px', lineHeight: '1.6', color: '#EDEDED', whiteSpace: 'pre-wrap' }, tm,
      `<span style="color:#FFB86B">C:\\&gt; </span>winget install Python.Python.3.13<br><span style="color:#FFB86B">C:\\&gt; </span>py -m pip install glitch-this<br><span style="color:#3DDC84">Successfully installed glitch_this-1.0.3<br>(리눅스 시연 ${f2(RES.install.pip_sec)}초 · numpy·Pillow 함께 · ${RES.install.site_mb}MB)</span>`);
    pic(1010, 160, 520, 620, 'jpg', '포스터결과.jpg', 'img/poster.jpg');
    [['✗ 효과는 띠 밀기 · 색 어긋남 · 줄무늬 세 가지', false], [`✗ 촬영 정보(EXIF) ${RES.jpg.src_exif}개 → ${RES.jpg.out_exif}개 (안 남음)`, false], ['✗ 마지막 수정 2024년 · 실행 때 최신 버전 확인', false], ['✓ 같은 이름 파일은 -f 없이는 안 덮어씀', true]]
      .forEach((p, i) => pillOn(pill(p[0], p[1], 70, 490 + i * 72, 900, 58), p[1]));
    chip('Windows 명령은 안내용 (Windows 실행은 시연하지 않음)', 70, 790, { fontSize: '22px' });
    foot(); return t => cap.render(t);
  } },
};
function ONE_T() { return f2(RES.levels[5].sec); }
