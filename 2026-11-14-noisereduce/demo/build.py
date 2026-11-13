"""noisereduce 대본 → 시간 계산 → render/timing.js + 음성용 대본 4개 (2026-11-14-spec-LTX-2/demo/build.py를 고쳐 씀).
대본(화면 자막, 읽는 문장)만 고치고 이 파일을 다시 돌리면 영상 시간과 대본 시간이 같이 바뀐다.
시간: 문장마다 말하는 시간(공백 뺀 글자 수 ÷ 6.3초, 최소 3초) + 쉼(같은 장 안 1.1초, 장이 바뀔 때 1.4초) — GUIDE 5-1장
사용: python3 demo/build.py"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CPS, MIN_CUE, JOIN, GAP = 6.3, 3.0, 1.1, 1.4

# 각 장: (id, 장 이름표, 최소 길이, [(화면 자막, 읽는 문장 — 여러 문장은 \n)])
exec(open(os.path.join(HERE, 'script.py'), encoding='utf-8').read())  # LONG, SHORTS


def speak(s):
    return max(MIN_CUE, len(re.sub(r"[\s,!?]", "", s)) / CPS)


def timing(chapters, end_min=7.0):
    out, acc = [], 0.0
    for idx, (cid, tag, mind, cues) in enumerate(chapters):
        t, cs = 0.3, []
        for i, (cap, nar) in enumerate(cues):
            d = sum(speak(x) for x in nar.split("\n")) + JOIN * (nar.count("\n"))
            cs.append([round(t, 2), round(t + d, 2), cap, nar])
            t += d + JOIN
        dur = max(mind, t - JOIN + GAP)
        if cid == "end": dur = max(dur, end_min)
        out.append({"id": cid, "tag": tag, "dur": round(dur, 2), "t0": round(acc, 2), "cues": cs})
        acc += dur
    return out, acc


def fmt(s):
    return f"{int(s // 60):02d}:{s % 60:04.1f}"


def narration(name, title, video, chs, total, note):
    lines = [f"noisereduce {title} 내레이션 대본", f"영상 파일: {video} (길이 {fmt(total)})", "",
             "■ 읽는 법",
             "- 대괄호 안 시간이 영상에서 그 문장이 나와야 하는 구간입니다",
             "- 영어·숫자는 모두 읽는 소리대로 한글로 바꿨습니다 (예: noisereduce → 노이즈리듀스, dB → 데시벨, 0.32초 → 영 쩜 삼이 초, -58.1 → 마이너스 오십팔 쩜 일)",
             "- 한 줄에 한 문장, 마침표 없이 정리했습니다", note, "", "■ 구간별 대본", ""]
    text = []
    for c in chs:
        for a, b, cap, nar in c["cues"]:
            A, B = c["t0"] + a, c["t0"] + b
            lines.append(f"[{fmt(A)} ~ {fmt(B)}]  ({B - A:.1f}초)")
            lines += nar.split("\n"); lines.append("")
            text += nar.split("\n")
    lines += ["■ 전체 이어 읽기", ""] + text
    for n, body in ((f"narration-{name}.txt", lines), (f"narration-{name}-text.txt", text)):
        assert not any(l.rstrip().endswith(".") for l in body if l and not l.startswith(("영상 파일", "-"))), n
        with open(os.path.join(ROOT, n), "w", encoding="utf-8-sig", newline="\r\n") as f:
            f.write("\n".join(body) + "\n")


L, lt = timing(LONG)
S, st = timing(SHORTS)
with open(os.path.join(HERE, "render", "timing.js"), "w", encoding="utf-8") as f:
    f.write("const LONG = " + json.dumps(L, ensure_ascii=False) + ";\nconst SHORTS = " + json.dumps(S, ensure_ascii=False) + ";\n")
narration("long", "롱폼", "media/noisereduce-long.mp4", L, lt, "- 영상 속 숫자는 모두 2026-11-14 클라우드 시연 측정값(demo/results.json)입니다")
narration("shorts", "숏폼", "media/noisereduce-anim-vertical.mp4", S, st, "- 같은 대본이 가로 영상(media/noisereduce-anim.mp4)에도 맞춰져 있습니다")
print(f"long {fmt(lt)} ({len(L)}장), shorts {fmt(st)}")
for c in L: print(f"  {c['id']:8s} {c['t0']:6.1f} +{c['dur']:5.1f}")
