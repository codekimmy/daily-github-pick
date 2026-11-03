"""results.json + 정리 전/후 목록 → data.js (애니메이션·롱폼에서 읽음)"""
import json, os
here = os.path.dirname(os.path.abspath(__file__)); demo = os.path.dirname(here)
R = json.load(open(f"{demo}/results.json", encoding="utf-8")); R["trees"] = json.load(open(f"{demo}/out/trees.json", encoding="utf-8"))
open(f"{here}/data.js", "w", encoding="utf-8").write("const R = " + json.dumps(R, ensure_ascii=False) + ";\n")
print("ok", len(R["moves"]), "moves")
