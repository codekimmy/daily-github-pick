"""results.json + 말소리 크기(voice.wav) + 자막 시각 → data.js (과정 애니메이션·롱폼이 같이 씀)"""
import json, os, re, sys, wave, array
here = os.path.dirname(os.path.abspath(__file__)); W = os.path.join(here, "..", "work")
R = json.load(open(f"{here}/../results.json", encoding="utf-8")); T = json.load(open(f"{W}/truth.json", encoding="utf-8"))
w = wave.open(f"{W}/voice.wav"); sr = w.getframerate(); a = array.array("h", w.readframes(10**9))
step = sr // 20; env = [round(max(abs(x) for x in a[i:i + step]) / 32768, 3) for i in range(0, len(a), step)]  # 0.05초마다 소리 크기
def cues(p):
    raw = open(p, "rb").read()
    try: s = raw.decode("utf-8")
    except UnicodeDecodeError: s = raw.decode("cp949")
    tt = lambda m: sum(float(x) * k for x, k in zip(re.split("[:,]", m)[:3], (3600, 60, 1))) + int(m[-3:]) / 1000
    return [[round(tt(x), 3), round(tt(y), 3)] for x, y in re.findall(r"(\d\d:\d\d:\d\d,\d\d\d) --> (\d\d:\d\d:\d\d,\d\d\d)", s)]
SUBS = {k: cues(f"{W}/{k}.srt") for k in ["늦은자막", "빠른자막", "점점밀리는자막", "중간부터밀리는자막"]}
SUBS.update({k + "_고침": cues(f"{W}/{k}_고침.srt") for k in ["늦은자막", "빠른자막", "점점밀리는자막", "중간부터밀리는자막"]})
SUBS["중간부터밀리는자막_고침_구간별"] = cues(f"{W}/중간부터밀리는자막_고침_구간별.srt")
open(f"{here}/data.js", "w", encoding="utf-8").write("const R = " + json.dumps(R, ensure_ascii=False) + ";\nconst TRUTH = " + json.dumps(T, ensure_ascii=False) +
    ";\nconst ENV = " + json.dumps(env) + ";\nconst SUBS = " + json.dumps(SUBS, ensure_ascii=False) + ";\n")
print("env", len(env), "subs", list(SUBS))
