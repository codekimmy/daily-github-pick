// pandoc 썸네일·블로그 그림 — 모션 스타일 (tools/motion/README.md 10장)
// 숫자는 data.js 의 RES(= demo/results.json 시연 측정값)만 씀. 문서 내용은 시연용 가상 자료
// img/*.jpg = pandoc 이 실제로 만든 워드·파워포인트·PDF 를 LibreOffice·pdftoppm 으로 찍은 그림. 각 장면은 3초 안에 다 나타나고 마지막 프레임을 찍음
const { C, el, box, caption, stamp, hand, pill, pillRender } = M;
const FOOT = '2026-11-27 클라우드 시연 결과 · 문서 내용은 시연용 가상 자료 · 결과 그림은 LibreOffice 로 연 모습';
const foot = () => el('div', null, { position: 'absolute', right: '28px', bottom: '18px', fontSize: '20px', fontWeight: '700', color: '#666' }, null, FOOT);
const chip = (s, x, y, css = {}) => el('div', 'chip', Object.assign({ left: x + 'px', top: y + 'px' }, css), null, s);
const pillOn = (p, ok) => pillRender(p, 9, 0, ok);
const f2 = v => Number(v).toFixed(2);
const FMT = { md: ['MD', '#6B7280'], docx: ['DOCX', '#2B579A'], pptx: ['PPTX', '#D24726'], epub: ['EPUB', '#3C8C3C'], html: ['HTML', '#E44D26'], pdf: ['PDF', '#E5482D'] };
function doc(x, y, w, h, kind, name, o = {}) {   // scenes.js 의 파일 카드와 같은 모양
  const [lab, col] = FMT[kind];
  const b = box(x, y, w, h, 'card', { padding: '0', overflow: 'hidden', transform: o.rot ? `rotate(${o.rot}deg)` : 'none' });
  el('div', null, { background: col, color: '#fff', fontWeight: '900', fontSize: (o.fs || 28) + 'px', padding: '10px 22px', display: 'flex', gap: '16px', alignItems: 'center', whiteSpace: 'nowrap' }, b,
    `<span style="background:#fff;color:${col};border-radius:8px;padding:0 10px">${lab}</span><span>${M.esc(name)}</span>`);
  const body = el('div', null, { position: 'absolute', left: '0', right: '0', top: (o.fs || 28) + 30 + 'px', bottom: '0', overflow: 'hidden', background: '#fff' }, b);
  if (o.img) el('img', null, { width: '100%', display: 'block' }, body).src = o.img;
  if (o.html) body.innerHTML = o.html;
  return b;
}
const MDL = ['# 회의 개요', '- **일시**: 11월 26일 오전 10시', '- **장소**: 3층 회의실', '', '# 결정한 것', '| 안건 | 결정 | 담당 |', '|---|---|---|', '| 연말 행사 장소 | 2안 | 김하늘 |', '', '# 다음 할 일', '- [ ] 호텔 계약서 확인하기'];
const mdHL = s => M.esc(s).replace(/^(#+ )/, `<b style="color:${C.orange}">$1</b>`).replace(/^(- )/, `<b style="color:${C.orange}">$1</b>`).replace(/(\*\*)/g, `<b style="color:${C.orange}">$1</b>`).replace(/^(\|.*)$/, '<span style="color:#555">$1</span>');
const mdBody = (fs = 24, lines = MDL) => `<div class="mono" style="font-size:${fs}px;line-height:1.55;padding:16px 22px;white-space:pre">${lines.map(l => `<div>${mdHL(l) || '&nbsp;'}</div>`).join('')}</div>`;
const arrowTxt = (x, y, s = 80) => el('div', null, { position: 'absolute', left: x + 'px', top: y + 'px', fontSize: s + 'px', fontWeight: '900', color: C.orange }, null, '→');

const THUMBS = {
  // ---- 롱폼 썸네일 1280×720 ----
  thumb: { w: 1280, h: 720, file: 'thumbnail.jpg', bg: C.beige, scene: S => {
    doc(40, 170, 330, 420, 'md', '메모.md', { html: mdBody(15), fs: 22, rot: -4 });
    arrowTxt(372, 330, 70);
    doc(450, 150, 330, 470, 'docx', '회의록.docx', { img: 'img/docx.jpg', fs: 22, rot: 3 });
    const st = stamp(f2(RES.md2docx.sec) + '초', 560, 560, 58, -9);
    const cap = caption(-1, null, [['메모장', '글'], ['→', '*워드*', '한', '줄']], { x: 830, y: 110, size: 74 });
    chip(`PPT · 전자책 · PDF 도`, 835, 330, { fontSize: '30px', padding: '10px 22px' });
    el('div', 'mono', { position: 'absolute', left: '830px', top: '430px', fontSize: '68px', fontWeight: '800', color: C.ink, letterSpacing: '-3px' }, null, 'pandoc<span style="color:#FF5A1F">.</span>');
    const nb = M.buddy(1120, 500, .42);
    return t => { cap.render(t); st.render(t, 0); nb.render(t, [{ at: 2.4, a: 'point', dir: 'left' }]); };
  } },
  // ---- 숏폼 썸네일 1080×1920 (글자는 위아래 250px 안쪽) ----
  thumbv: { w: 1080, h: 1920, file: 'thumbnail-shorts.jpg', bg: C.beige, scene: S => {
    const cap = caption(-1, null, [['메모장', '글이'], ['*워드*로', f2(RES.md2docx.sec) + '초?']], { x: 70, y: 290, size: 100 });
    doc(70, 560, 440, 560, 'md', '회의록.md', { html: mdBody(18), fs: 26, rot: -3 });
    arrowTxt(500, 760, 80);
    doc(570, 560, 440, 620, 'docx', '회의록.docx', { img: 'img/docx.jpg', fs: 26, rot: 3 });
    const st = stamp(f2(RES.md2docx.sec) + '초', 640, 1130, 80, -9);
    chip(`같은 글 → PPT · 전자책 · PDF`, 70, 1290, { fontSize: '40px', padding: '14px 30px' });
    const nb = M.buddy(780, 1380, .62);
    el('div', 'mono', { position: 'absolute', left: 0, right: 0, top: '1520px', textAlign: 'center', fontSize: '120px', fontWeight: '800', letterSpacing: '-4px' }, null, 'pandoc<span style="color:#FF5A1F">.</span>');
    return t => { cap.render(t); st.render(t, 0); nb.render(t, [{ at: 2.4, a: 'point', dir: 'left' }]); };
  } },
  // ---- 블로그 그림 1600×900: 메모 → 워드 ----
  docx: { w: 1600, h: 900, file: 'md-to-docx.png', bg: C.blue, scene: S => {
    const cap = caption(-1, null, [['마크다운', '회의록', '→', '*워드 문서*', f2(RES.md2docx.sec) + '초']], { x: 70, y: 46, size: 60 });
    doc(70, 160, 620, 520, 'md', `회의록.md (${RES.md2docx.md_bytes}바이트)`, { html: mdBody(22) });
    arrowTxt(705, 360, 80);
    doc(800, 160, 540, 640, 'docx', '회의록.docx', { img: 'img/docx.jpg' });
    stamp(f2(RES.md2docx.sec) + '초', 1180, 690, 56, -9).render(9, 0);
    [[`✓ 제목 스타일 ${RES.md2docx.headings.length}개`], [`✓ 표 ${RES.md2docx.tables}개`], [`✓ 굵은 글씨 ${RES.md2docx.bold}곳`]].forEach((p, i) => { const e = pill(p[0], true, 70 + i * 208, 710, 200, 56); e.style.fontSize = '21px'; pillOn(e, true); });
    chip('명령: pandoc 회의록.md -o 회의록.docx', 70, 780, { fontSize: '26px', fontFamily: '"DejaVu Sans Mono", monospace' });
    foot(); return t => cap.render(t);
  } },
  // ---- 블로그 그림: 같은 글 → 파워포인트 5장 · 전자책 · 웹페이지 ----
  formats: { w: 1600, h: 900, file: 'one-to-many.png', bg: C.mint, scene: S => {
    const cap = caption(-1, null, [['같은', '회의록', '→', '*파워포인트 ' + RES.md2pptx.slides + '장*', '·', '전자책', '·', '웹페이지']], { x: 70, y: 46, size: 58 });
    const POS = [[70, 160], [570, 160], [1070, 160], [70, 470], [570, 470]];
    POS.forEach((p, i) => doc(p[0], p[1], 460, 290, 'pptx', `${i + 1}장`, { img: `img/slide-${i + 1}.jpg`, fs: 22 }));
    doc(1070, 470, 460, 130, 'epub', '회의록.epub', { fs: 22, html: `<div style="padding:12px 20px;font-size:24px;font-weight:800">${RES.md2epub.chapters}개 장 · ${f2(RES.md2epub.sec)}초</div>` });
    doc(1070, 630, 460, 130, 'html', '회의록.html', { fs: 22, html: `<div style="padding:12px 20px;font-size:24px;font-weight:800">목차 포함 · ${f2(RES.md2html.sec)}초</div>` });
    chip(`파워포인트 ${f2(RES.md2pptx.sec)}초 · 제목마다 한 장`, 70, 785, { fontSize: '26px' });
    foot(); return t => cap.render(t);
  } },
  // ---- 블로그 그림: PDF 는 typst 따로 · HWP 안 됨 ----
  pdf: { w: 1600, h: 900, file: 'pdf-hwp.png', bg: C.peach, scene: S => {
    const cap = caption(-1, null, [['PDF는', '*typst*', '따로', '설치', '·', '한글', '문서(HWP)는', '*안 됨*']], { x: 70, y: 46, size: 56 });
    const tm = box(70, 160, 900, 330, 'card dark', { padding: '24px 30px' });
    el('div', 'mono', { fontSize: '22px', lineHeight: '1.6', color: '#EDEDED', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }, tm,
      `<span style="color:#FFB86B">$ </span>pandoc 회의록.md -o 회의록.pdf<br><span style="color:#FF7A6B">${M.esc(RES.pdf_default.err)}</span><br><span style="color:#FFB86B">$ </span>pandoc 회의록.md -o 회의록.pdf --pdf-engine=typst -V mainfont="Noto Sans CJK KR"<br><span style="color:#3DDC84">(오류 없이 끝남 · ${RES.pdf_typst.pages}쪽 · ${f2(RES.pdf_typst.sec)}초)</span>`);
    doc(1010, 160, 520, 660, 'pdf', '회의록.pdf (typst)', { img: 'img/pdf-typst.jpg' });
    [["✗ '결과.hwp' → 경고만, 속은 HTML", false], ["✗ -t hwp → Unknown output format", false]].forEach((p, i) => pillOn(pill(p[0], p[1], 70, 520 + i * 74, 900, 58), p[1]));
    chip('Windows 한글 글꼴 예: -V mainfont="Malgun Gothic" (Windows 실행은 시연하지 않음)', 70, 680, { fontSize: '22px' });
    hand('원본은 따로 보관!', 560, 770, 44, -4).el.style.clipPath = 'none';
    foot(); return t => cap.render(t);
  } },
};
