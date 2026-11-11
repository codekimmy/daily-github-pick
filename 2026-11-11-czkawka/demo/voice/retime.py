"""말하는 길이에 맞춰 영상 시간을 다시 짠다 (GUIDE 5-1 '쉼 2초 이하', 2026-11-11 운영자 요청).
대본(문장)을 먼저 정하고 → 문장마다 말하는 시간 + 짧은 쉼으로 자막 구간을 정한 뒤 → 화면 애니메이션을 그 구간에 맞춰 늘이고 줄인다.

사용: python3 retime.py                 # 글자 수로 말하는 시간을 어림 (6.3글자/초)
      python3 retime.py 길이.json       # 운영자 음성에서 잰 문장별 길이로 다시 짬 {"long": [초, ...], "shorts": [초, ...]} (구간 순서대로)
결과: ../long/timing.js (롱폼 장·자막 시간 + 원래 시간으로 되돌리는 지점), ../anim/timing.js (숏폼 장면 경계)
      → 렌더링 다시(render_long.py, anim/render.py) → narration/make.py 로 대본 시간 갱신"""
import json, re, sys
from pathlib import Path

H = Path(__file__).parent; D = H.parent
CPS, GAP, JOIN, LEAD = 6.3, 0.9, 0.6, 0.3   # 초당 글자 · 문장 뒤 쉼 · 한 구간 안 문장 사이 · 장 첫 자막 전
# ※ Day 15는 쉼 0.9초로 만든 영상에 운영자가 녹음하며 쉼을 0.3초씩 더함. 다음 날부터는 GAP 1.4, JOIN 1.1 로 쓴다 (GUIDE 5-1)
MIN_CUE, END_HOLD = 3.0, 7.0                # 자막 하나 최소 길이 · 마지막 장 마지막 구간(엔딩 화면) 최소 길이
measured = json.load(open(sys.argv[1], encoding="utf-8")) if len(sys.argv) > 1 else {}


def speak(text):  # 말하는 시간 어림
    ls = text.split("\n")
    return sum(len(re.sub(r"[\s,!?]", "", l)) for l in ls) / CPS + JOIN * (len(ls) - 1)


# ---- 롱폼: script.js 의 원래 시간(처음 실행 때 orig 로 보관) 기준
src = (D / "long/script.js").read_text(encoding="utf-8")
S = json.loads(src[src.index("{"): src.rindex("}") + 1])
ML = measured.get("long"); k = 0; out = []
for ci, c in enumerate(S["chapters"]):
    cues = c.get("orig_cues", c["cues"]); odur = c.get("orig_dur", c["dur"])
    t, nc, knots = LEAD, [], [[0, 0]]
    for qi, q in enumerate(cues):
        d = (ML[k] if ML else speak(q[3])) + GAP; k += 1
        last = ci == len(S["chapters"]) - 1 and qi == len(cues) - 1
        d = max(d, END_HOLD if last else MIN_CUE)
        knots += [[round(t, 3), q[0]], [round(t + d, 3), q[1]]]; nc.append([round(t, 2), round(t + d, 2), q[2], q[3]]); t += d
    tail = odur - cues[-1][1]; dur = round(t + min(tail, 0.5), 2)
    knots.append([dur, odur])
    out.append({"id": c["id"], "dur": dur, "cues": nc, "knots": knots})
(D / "long/timing.js").write_text("const TIMING = " + json.dumps(out, ensure_ascii=False) + ";\n", encoding="utf-8")
print("롱폼", round(sum(c["dur"] for c in out), 1), "초 (원래", sum(c.get("orig_dur", c["dur"]) for c in S["chapters"]), "초)")

# ---- 숏폼: 장면 5개 경계(anim.html 의 T) 기준, 대본은 narration/make.py 의 SHORTS
mk = (D / "narration/make.py").read_text(encoding="utf-8")
SH = eval(mk[mk.index("SHORTS = [") + 9: mk.index("]\n", mk.index("SHORTS = [")) + 1])
MS = measured.get("shorts"); T_OLD = [0, 10.5, 23, 35.5, 46, 55]
t, bounds = 0.0, [0.0]
for i, (_, _, txt) in enumerate(SH):
    d = (MS[i] if MS else speak(txt)) + GAP + LEAD
    d = max(d, 9.0 if i == len(SH) - 1 else 6.0)   # 장면 최소 6초, 엔딩 9초
    t += d; bounds.append(round(t, 2))
(D / "anim/timing.js").write_text("const TIMING = " + json.dumps({"old": T_OLD, "new": bounds}) + ";\n", encoding="utf-8")
print("숏폼", bounds)
