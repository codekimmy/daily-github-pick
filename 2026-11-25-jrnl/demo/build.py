"""jrnl 대본 → 시간 계산 → render/timing.js + 음성용 대본 4개 (2026-11-24-segno/demo/build.py를 고쳐 씀).
대본(화면 자막, 읽는 문장)만 고치고 이 파일을 다시 돌리면 영상 시간과 대본 시간이 같이 바뀐다.
시간: 문장마다 말하는 시간(공백 뺀 글자 수 ÷ 6.3초, 최소 3초) + 쉼(같은 장 안 1.1초, 장이 바뀔 때 1.4초) — GUIDE 5-1장
사용: python3 demo/build.py
      python3 demo/build.py voice   (운영자 음성 voice/lengths-long.json 의 실제 문장 길이로 롱폼만 다시 계산 → render/timing-voice.js, voice/cues-long.json, 2026-11-14 noisereduce 방식)"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CPS, MIN_CUE, JOIN, GAP = 6.3, 3.0, 1.1, 1.4

# 각 장: (id, 장 이름표, 최소 길이, [(화면 자막, 읽는 문장 — 여러 문장은 \n)])
exec(open(os.path.join(HERE, 'script.py'), encoding='utf-8').read())  # LONG, SHORTS


def speak(s):
    return max(MIN_CUE, len(re.sub(r"[\s,!?]", "", s)) / CPS)


VOICE = "voice" in sys.argv
VOICE_S = "voice-shorts" in sys.argv   # 숏폼 음성 (2026-11-25): 말이 짧아 45초를 넘기도록 쉼을 2초 안에서 늘림 (문장 사이 1.7초, 장 사이 1.6+0.3초, 자막 = 말 길이)
LEN = json.load(open(os.path.join(HERE, "voice", "lengths-long.json"))) if VOICE and not VOICE_S else None
SENT = []  # 음성 모드: 문장마다 [영상 속 시작 초, 길이]


def timing(chapters, end_min=7.0, voice=False, lens=None, join=JOIN, gap=GAP, pad=.8):
    out, acc, k = [], 0.0, 0
    lens = lens if lens is not None else LEN
    for idx, (cid, tag, mind, cues) in enumerate(chapters):
        t, cs = 0.3, []
        if voice and cid != "end": mind = 0
        for i, (cap, nar) in enumerate(cues):
            if voice:   # 실제 문장 길이 + 문장 사이 쉼 1.1초 (GUIDE 5-1), 자막은 최소 3초
                ls = lens[k:k + nar.count("\n") + 1]; k += len(ls); tt = t
                for x in ls: SENT.append([round(acc + tt, 3), x]); tt += x + join
                sp = sum(ls) + join * (len(ls) - 1); d = max(sp, min(MIN_CUE, sp + pad))
            else:
                d = sum(speak(x) for x in nar.split("\n")) + JOIN * (nar.count("\n"))
            cs.append([round(t, 2), round(t + d, 2), cap, nar])
            t += d + (join if voice else JOIN)
        dur = max(mind, t - (join if voice else JOIN) + (gap if voice else GAP))
        if cid == "end": dur = max(dur, end_min)
        out.append({"id": cid, "tag": tag, "dur": round(dur, 2), "t0": round(acc, 2), "cues": cs})
        acc += dur
    return out, acc


def fmt(s):
    return f"{int(s // 60):02d}:{s % 60:04.1f}"


def narration(name, title, video, chs, total, note):
    lines = [f"jrnl {title} 내레이션 대본", f"영상 파일: {video} (길이 {fmt(total)})", "",
             "■ 읽는 법",
             "- 대괄호 안 시간이 영상에서 그 문장이 나와야 하는 구간입니다",
             "- 영어·숫자는 모두 읽는 소리대로 한글로 바꿨습니다 (예: jrnl → 제알엔엘, @ → 골뱅이, 0.15 → 영 쩜 일오, 3,650 → 삼천육백오십)",
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


if VOICE_S:
    LS = json.load(open(os.path.join(HERE, "voice", "lengths-shorts.json")))
    S, st = timing(SHORTS, voice=True, lens=LS, join=1.9, gap=1.7, pad=0.0)
    assert len(SENT) == len(LS)
    if st + 6 < 45.5:   # 숏폼 45초 이상 (GUIDE 4장): 마지막 문장 뒤(설치·별점 화면)를 늘림 — 문장 사이 쉼은 그대로 2초 이하
        S[-1]["dur"] = round(S[-1]["dur"] + 45.5 - 6 - st, 2); st = 45.5 - 6
    json.dump(SENT, open(os.path.join(HERE, "voice", "cues-shorts.json"), "w"))
    tv = os.path.join(HERE, "render", "timing-voice.js"); longpart = open(tv, encoding="utf-8").read().split("const SHORTS = ")[0]
    with open(tv, "w", encoding="utf-8") as f:
        f.write(longpart + "const SHORTS = " + json.dumps(S, ensure_ascii=False) + ";\n")
    narration("shorts", "숏폼(운영자 음성)", "media/jrnl-shorts-voice.mp4", S, st, "- 구간 시간은 운영자 음성의 실제 문장 길이로 다시 맞춘 값입니다 (demo/voice/lengths-shorts.json), 끝에 엔딩 카드 6초")
    gaps = [b[0] - a[0] - a[1] for a, b in zip(SENT, SENT[1:])]
    print(f"shorts(voice) {fmt(st)} + 엔딩 6초 = {fmt(st + 6)}, 쉼 최대 {max(gaps):.2f}초")
    for c in S: print(f"  {c['id']:8s} {c['t0']:6.1f} +{c['dur']:5.1f}")
    sys.exit()
if VOICE:
    L, lt = timing(LONG, voice=True)
    assert len(SENT) == len(LEN), (len(SENT), len(LEN))
    json.dump(SENT, open(os.path.join(HERE, "voice", "cues-long.json"), "w"))
    old = open(os.path.join(HERE, "render", "timing.js"), encoding="utf-8").read().split("const SHORTS = ")[1]
    with open(os.path.join(HERE, "render", "timing-voice.js"), "w", encoding="utf-8") as f:
        f.write("const LONG = " + json.dumps(L, ensure_ascii=False) + ";\nconst SHORTS = " + old)
    narration("long", "롱폼(운영자 음성)", "media/jrnl-long-voice.mp4", L, lt, "- 구간 시간은 운영자 음성의 실제 문장 길이로 다시 맞춘 값입니다 (demo/voice/lengths-long.json)")
    gaps = [b[0] - a[0] - a[1] for a, b in zip(SENT, SENT[1:])]
    print(f"long(voice) {fmt(lt)} 쉼 최대 {max(gaps):.2f}초, 2초 넘는 곳 {sum(g > 2 for g in gaps)}개")
    for c in L: print(f"  {c['id']:8s} {c['t0']:6.1f} +{c['dur']:5.1f}")
    sys.exit()
L, lt = timing(LONG)
S, st = timing(SHORTS)
with open(os.path.join(HERE, "render", "timing.js"), "w", encoding="utf-8") as f:
    f.write("const LONG = " + json.dumps(L, ensure_ascii=False) + ";\nconst SHORTS = " + json.dumps(S, ensure_ascii=False) + ";\n")
narration("long", "롱폼", "media/jrnl-long.mp4", L, lt, "- 영상 속 숫자는 모두 2026-11-25 클라우드 시연 측정값(demo/results.json)입니다")
narration("shorts", "숏폼", "media/jrnl-anim-vertical.mp4", S, st, "- 같은 대본이 가로 영상(media/jrnl-anim.mp4)에도 맞춰져 있습니다")
print(f"long {fmt(lt)} ({len(L)}장), shorts {fmt(st)}")
for c in L: print(f"  {c['id']:8s} {c['t0']:6.1f} +{c['dur']:5.1f}")
