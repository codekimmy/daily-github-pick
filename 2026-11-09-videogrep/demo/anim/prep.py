"""results.json + 가상 영상 자막(.srt) + 실제 결과 영상에서 뽑은 프레임 수 → data.js (애니메이션·롱폼이 같이 씀)
프레임 뽑기(먼저 실행): ffmpeg -i ../work/out/소금모음.mp4 -vf fps=10,scale=640:360 fr/소금모음/%04d.jpg (결정모음·음모음도 같게), 원본은 fps=1/10,scale=320:180 → fr/src/"""
import json, os, re
H = os.path.dirname(os.path.abspath(__file__)); W = f"{H}/../work"
R = json.load(open(f"{H}/../results.json", encoding="utf-8"))
def srt(n):
    out = []
    for b in open(f"{W}/{n}.srt", encoding="utf-8").read().strip().split("\n\n"):
        _, tm, tx = b.split("\n", 2); a, z = [sum(float(x) * m for x, m in zip(re.split("[:,]", s)[:3], (3600, 60, 1))) + int(s[-3:]) / 1000 for s in tm.split(" --> ")]
        out.append([round(a, 3), round(z, 3), tx])
    return out
R["SRT"] = {n: srt(n) for n in ["요리교실", "회의"]}
R["FR"] = {n: len(os.listdir(f"{H}/fr/{n}")) for n in ["소금모음", "결정모음", "음모음", "src"]}
open(f"{H}/data.js", "w", encoding="utf-8").write("const R = " + json.dumps(R, ensure_ascii=False) + ";\n")
print("saved data.js", R["FR"])
