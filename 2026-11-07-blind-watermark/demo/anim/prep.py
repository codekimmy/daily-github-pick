"""results.json → data.js (애니메이션·롱폼이 같이 씀)"""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(f"{H}/../results.json", encoding="utf-8"))
open(f"{H}/data.js", "w", encoding="utf-8").write("const R = " + json.dumps(R, ensure_ascii=False) + ";\n")
print("saved data.js")
