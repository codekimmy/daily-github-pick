// =====================================================================
// 냥봇 — 말하지 않고 반응만 하는 보조 캐릭터 (2026-11-24 운영자 확정: 고양이 귀 바이저 로봇, '고양이 많이' 3단계)
//  motion.js 다음에 불러 씀: <script src="../../../tools/motion/buddy.js"></script>
//  const nb = M.buddy(x, y, 크기(1 = 키 약 450px), {flip:true=왼쪽 보기});
//  render 안에서: nb.render(t, [ {at:c0, a:'enter'}, {at:c1+2, a:'point', dir:'left'}, {at:c2, a:'nod'}, … ]);
//  동작(a): enter 등장(아래에서 톡) · leave 퇴장 · wave 손 흔들기 · point 가리키기(dir:left|up|right) · nod 끄덕(웃는 눈 + 초록 ✓)
//           oops 놀람(동그란 눈 + 빨간 !) · happy 웃는 눈만 · pen 빨간 펜으로 그리는 손짓 · stamp 도장 쾅 · look 고개 갸웃
//  동작이 없는 시간엔 숨쉬기·눈 깜빡임·꼬리 흔들기(대기)를 저절로 함. 모든 움직임은 t의 함수(어느 프레임부터 찍어도 같음)
// =====================================================================
(() => {
  const K = '#141414', PK = '#FF8FA3', OR = '#FF5A1F', CR = '#F4EFE6', GR = '#18A058', RD = '#E5482D';
  const ol = `stroke="${K}" stroke-width="6"`;
  const ARM_L = 'M138 300 C110 300 96 318 92 344', ARM_R = 'M282 300 C310 290 324 268 328 242';
  const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="21" fill="#fff" ${ol}/><ellipse cx="${x}" cy="${y + 5}" rx="8" ry="6" fill="${PK}"/><circle cx="${x - 9}" cy="${y - 7}" r="3.6" fill="${PK}"/><circle cx="${x}" cy="${y - 10}" r="3.6" fill="${PK}"/><circle cx="${x + 9}" cy="${y - 7}" r="3.6" fill="${PK}"/>`;
  const arm = d => `<path d="${d}" fill="none" stroke="${K}" stroke-width="22" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#E9EEF3" stroke-width="10" stroke-linecap="round"/>`;
  const TAIL = 'M284 380 C344 396 388 366 378 326';
  function svg(id) {
    return `<svg viewBox="0 0 420 470" width="420" height="470" overflow="visible">
<defs><radialGradient id="nbV${id}" cx="45%" cy="30%" r="80%"><stop offset="0" stop-color="#3A3F4A"/><stop offset="1" stop-color="#0E1014"/></radialGradient></defs>
<ellipse cx="210" cy="440" rx="120" ry="14" fill="rgba(0,0,0,.12)" data-p="shadow"/>
<g data-p="all">
 <g data-p="tail"><path d="${TAIL}" fill="none" stroke="${K}" stroke-width="34" stroke-linecap="round"/><path d="${TAIL}" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round"/><path d="M340 384 l6 -18 M366 364 l-14 -10" stroke="${OR}" stroke-width="7" stroke-linecap="round"/><circle cx="378" cy="322" r="17" fill="${OR}" ${ol}/></g>
 <rect x="160" y="370" width="34" height="40" rx="12" fill="#E9EEF3" ${ol}/><rect x="226" y="370" width="34" height="40" rx="12" fill="#E9EEF3" ${ol}/>
 <ellipse cx="174" cy="412" rx="32" ry="17" fill="#fff" ${ol}/><ellipse cx="246" cy="412" rx="32" ry="17" fill="#fff" ${ol}/>
 <circle cx="164" cy="414" r="4" fill="${PK}"/><circle cx="176" cy="410" r="4" fill="${PK}"/><circle cx="188" cy="414" r="4" fill="${PK}"/><circle cx="234" cy="414" r="4" fill="${PK}"/><circle cx="246" cy="410" r="4" fill="${PK}"/><circle cx="258" cy="414" r="4" fill="${PK}"/>
 <g data-p="armL">${arm(ARM_L)}${hand(90, 354)}</g>
 <rect x="134" y="262" width="152" height="124" rx="46" fill="#fff" ${ol}/><ellipse cx="210" cy="340" rx="44" ry="34" fill="#FFF1DC"/>
 <rect x="180" y="280" width="60" height="38" rx="9" fill="url(#nbV${id})" stroke="${K}" stroke-width="4"/><rect x="190" y="291" width="18" height="5" rx="2.5" fill="${OR}"/><rect x="190" y="302" width="34" height="5" rx="2.5" fill="${OR}" opacity=".7"/>
 <g data-p="armR">${arm(ARM_R)}
  <g data-p="pen" style="display:none"><g transform="rotate(30 330 230)"><rect x="316" y="132" width="28" height="120" rx="7" fill="${RD}" ${ol}/><rect x="316" y="132" width="28" height="28" rx="7" fill="${K}"/><path d="M316 252 L330 284 L344 252 Z" fill="#FFE0DE" stroke="${K}" stroke-width="5" stroke-linejoin="round"/></g></g>
  <g data-p="stamp" style="display:none"><rect x="320" y="160" width="20" height="56" rx="8" fill="#8A5A36" ${ol}/><rect x="296" y="208" width="68" height="34" rx="8" fill="${OR}" ${ol}/><text x="309" y="233" font-family="Noto Sans CJK KR" font-weight="900" font-size="20" fill="#fff">OK</text></g>
  ${hand(330, 230)}</g>
 <rect x="188" y="246" width="44" height="24" rx="8" fill="#E9EEF3" ${ol}/>
 <g data-p="head">
  <path d="M92 132 C80 72 90 28 108 14 C140 32 170 60 186 88 Z" fill="#fff" ${ol} stroke-linejoin="round"/><path d="M328 132 C340 72 330 28 312 14 C280 32 250 60 234 88 Z" fill="#fff" ${ol} stroke-linejoin="round"/>
  <path d="M108 106 C102 76 106 52 114 42 C134 56 150 72 160 88 Z" fill="${PK}"/><path d="M312 106 C318 76 314 52 306 42 C286 56 270 72 260 88 Z" fill="${PK}"/>
  <path d="M210 58 C290 58 336 100 338 156 C340 196 324 226 296 244 C270 262 240 266 210 264 C180 266 150 262 124 244 C96 226 80 196 82 156 C84 100 130 58 210 58 Z" fill="#fff" ${ol}/>
  <path d="M192 64 l4 18 M210 62 l0 20 M228 64 l-4 18" stroke="${OR}" stroke-width="8" stroke-linecap="round"/>
  <path d="M112 152 C112 110 150 94 210 94 C270 94 308 110 308 152 C308 182 298 204 278 214 C256 226 232 226 210 214 C188 226 164 226 142 214 C122 204 112 182 112 152 Z" fill="url(#nbV${id})" stroke="${K}" stroke-width="5"/>
  <g data-p="eN"><g data-p="blinkL"><ellipse cx="168" cy="156" rx="14" ry="20" fill="${CR}"/><circle cx="164" cy="149" r="3.5" fill="#fff"/></g><g data-p="blinkR"><ellipse cx="252" cy="156" rx="14" ry="20" fill="${CR}"/><circle cx="248" cy="149" r="3.5" fill="#fff"/></g></g>
  <g data-p="eH" style="display:none"><path d="M150 164 q18 -26 36 0 M234 164 q18 -26 36 0" stroke="${CR}" stroke-width="9" fill="none" stroke-linecap="round"/></g>
  <g data-p="eO" style="display:none"><circle cx="168" cy="154" r="19" fill="${CR}"/><circle cx="252" cy="154" r="19" fill="${CR}"/><circle cx="168" cy="154" r="6" fill="#0E1014"/><circle cx="252" cy="154" r="6" fill="#0E1014"/></g>
  <path d="M203 182 h14 l-7 8 z" fill="${PK}" stroke="${PK}" stroke-width="3" stroke-linejoin="round"/>
  <path data-p="mN" d="M196 196 q7 9 14 0 q7 9 14 0" stroke="${CR}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <ellipse data-p="mO" cx="210" cy="200" rx="7" ry="9" fill="${CR}" style="display:none"/>
  <path d="M146 184 l-24 -4 M146 196 l-24 4 M274 184 l24 -4 M274 196 l24 4" stroke="${CR}" stroke-width="4" stroke-linecap="round" opacity=".85"/>
  <ellipse cx="136" cy="232" rx="13" ry="7" fill="${PK}" opacity=".9"/><ellipse cx="284" cy="232" rx="13" ry="7" fill="${PK}" opacity=".9"/>
 </g>
</g>
<g data-p="ok" style="display:none"><circle cx="210" cy="-30" r="34" fill="${GR}" ${ol}/><path d="M192 -30 l13 13 l24 -26" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
<g data-p="bang" style="display:none"><rect x="190" y="-74" width="40" height="64" rx="12" fill="${RD}" ${ol}/><text x="198" y="-24" font-family="Noto Sans CJK KR" font-weight="900" font-size="52" fill="#fff">!</text></g>
<g data-p="q" style="display:none"><circle cx="300" cy="-14" r="30" fill="#fff" ${ol}/><text x="287" y="2" font-family="Noto Sans CJK KR" font-weight="900" font-size="44" fill="${K}">?</text></g>
</svg>`;
  }
  let n = 0;
  M.buddy = function (x, y, scale = .6, o = {}) {
    const { P, eOut, eIO, eBack, clamp } = M; const id = ++n;
    const wrap = M.el('div', null, { position: 'absolute', left: x + 'px', top: y + 'px', width: '420px', height: '470px', transformOrigin: '0 0', zIndex: 9 }, null, svg(id));
    const q = k => wrap.querySelector(`[data-p="${k}"]`); const g = {}; ['all', 'tail', 'armL', 'armR', 'head', 'eN', 'eH', 'eO', 'mN', 'mO', 'ok', 'bang', 'q', 'pen', 'stamp', 'blinkL', 'blinkR', 'shadow'].forEach(k => g[k] = q(k));
    const show = (k, v) => { g[k].style.display = v ? '' : 'none'; };
    const DUR = { enter: .6, leave: .5, wave: 1.6, point: 1.8, nod: 1.4, oops: 1.3, happy: 1.5, pen: 1.8, stamp: 1.2, look: 1.4 };
    return {
      el: wrap,
      render(t, script = []) {
        // 지금 하고 있는 동작 찾기 (가장 최근에 시작한 것)
        let act = null, lt = 0, vis = !script.some(s => s.a === 'enter');
        for (const s of script) {
          if (t < s.at) continue;
          if (s.a === 'enter') vis = true; if (s.a === 'leave') vis = t < s.at + DUR.leave;
          const d = s.dur ?? DUR[s.a] ?? 1.2; if (t < s.at + d) { act = s; lt = t - s.at; }
        }
        const en = script.find(s => s.a === 'enter'), lv = script.find(s => s.a === 'leave');
        let dy = 0, sc = 1;
        if (en && t < en.at + DUR.enter) dy = (1 - eBack(P(t, en.at, en.at + DUR.enter))) * 320;
        if (lv && t >= lv.at) dy = eIO(P(t, lv.at, lv.at + DUR.leave)) * 340;
        // 대기: 숨쉬기·꼬리·깜빡임
        const breath = Math.sin(t * 2.4) * 4; let headR = Math.sin(t * 1.1) * 2, armL = Math.sin(t * 1.7) * 3, armR = Math.sin(t * 1.9 + 1) * 3, tail = Math.sin(t * 1.6) * 8, jump = 0, shake = 0;
        const bl = (t % 3.4) < .13 ? .12 : 1; let eyes = 'N', mouth = 'N';
        ['ok', 'bang', 'q', 'pen', 'stamp'].forEach(k => show(k, false));
        if (act) {
          const k = act.a, d = act.dur ?? DUR[k], e = P(lt, 0, .3), x2 = 1 - P(lt, d - .3, d), on = Math.min(e, x2);
          if (k === 'wave') { armR = -30 * eOut(on) + Math.sin(lt * 14) * 18 * on; eyes = 'H'; }
          if (k === 'point') { const a = act.dir === 'right' ? -60 : act.dir === 'up' ? 78 : 48; if (act.dir === 'right') armR = a * eOut(on); else armL = a * eOut(on) + Math.sin(lt * 9) * 3 * on; headR = (act.dir === 'right' ? 6 : -6) * on; }
          if (k === 'nod') { headR = Math.sin(P(lt, .1, 1.0) * Math.PI * 2) * 9 * on; eyes = 'H'; show('ok', true); jump = -Math.sin(P(lt, 0, .5) * Math.PI) * 18; }
          if (k === 'happy') { eyes = 'H'; jump = -Math.abs(Math.sin(lt * 7)) * 10 * on; }
          if (k === 'oops') { eyes = 'O'; mouth = 'O'; show('bang', true); jump = -Math.sin(P(lt, 0, .35) * Math.PI) * 28; shake = Math.sin(lt * 50) * 5 * (1 - P(lt, .2, .8)); tail = 26 * on; }
          if (k === 'look') { headR = 14 * eOut(on); show('q', true); }
          if (k === 'pen') { show('pen', true); armR = -20 * on + Math.sin(lt * 10) * 10 * on; }
          if (k === 'stamp') { show('stamp', true); const s1 = P(lt, 0, .35), s2 = P(lt, .35, .5); armR = -50 * eOut(s1) + 62 * eOut(s2) * (1 - P(lt, .8, 1.1)); if (lt > .45 && lt < .7) shake = Math.sin(lt * 80) * 4; }
          // 말풍선 표시(✓ ! ?)는 톡 하고 커짐
          ['ok', 'bang', 'q'].forEach(m => { const z = eBack(P(lt, .05, .4)) * x2; g[m].setAttribute('transform', `translate(${210 * (1 - z)} ${-30 * (1 - z)}) scale(${z})`); });
        }
        show('eN', eyes === 'N'); show('eH', eyes === 'H'); show('eO', eyes === 'O'); show('mN', mouth === 'N'); show('mO', mouth === 'O');
        [g.blinkL, g.blinkR].forEach((b, i) => b.setAttribute('transform', `translate(0 ${156 * (1 - bl)}) scale(1 ${bl})`));
        g.head.setAttribute('transform', `rotate(${headR} 210 250)`);
        g.armL.setAttribute('transform', `rotate(${armL} 138 300)`); g.armR.setAttribute('transform', `rotate(${armR} 282 300)`);
        g.tail.setAttribute('transform', `rotate(${tail} 284 380)`);
        g.all.setAttribute('transform', `translate(${shake} ${breath * .5 + jump})`);
        g.shadow.setAttribute('transform', `translate(${210 * (1 - (1 + jump / 200))} 0) scale(${1 + jump / 200} 1)`);
        wrap.style.transform = `translate(0px,${dy}px) scale(${o.flip ? -scale : scale},${scale})` + (o.flip ? ' translateX(-420px)' : '');
        wrap.style.opacity = vis ? 1 : 0;
      }
    };
  };
})();
