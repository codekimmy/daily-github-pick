"""results.json → data.js (애니메이션·롱폼에서 읽음), 움직이는 QR(wave.gif)과 원본 wave.gif를 장별 PNG로 풀기"""
import json, os
from PIL import Image, ImageSequence
here = os.path.dirname(os.path.abspath(__file__)); demo = os.path.dirname(here)
R = json.load(open(f"{demo}/results.json", encoding="utf-8"))
R["tests"] = {t["name"]: t for t in R["tests"]}
open(f"{here}/data.js", "w", encoding="utf-8").write("const R = " + json.dumps(R, ensure_ascii=False) + ";\n")
for src, name in [(f"{demo}/out/wave.gif", "waveqr"), (f"{demo}/assets/wave.gif", "wavesrc")]:
    d = f"{demo}/out/frames"; os.makedirs(d, exist_ok=True)
    for i, f in enumerate(ImageSequence.Iterator(Image.open(src))):
        f.convert("RGB").save(f"{d}/{name}{i:02d}.png")
print("ok")
