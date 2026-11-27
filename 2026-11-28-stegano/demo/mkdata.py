"""results.json → render/data.js (영상·썸네일 숫자는 모두 RES에서만 가져옴)
사용: python3 demo/mkdata.py (bench.py 다음)"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(os.path.join(HERE, "results.json")))
with open(os.path.join(HERE, "render", "data.js"), "w", encoding="utf-8") as f:
    f.write("const RES = " + json.dumps(R, ensure_ascii=False) + ";\n")
print(len(json.dumps(R)))
