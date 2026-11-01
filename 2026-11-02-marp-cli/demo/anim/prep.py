"""results.json + trip.md → data.js (애니메이션·롱폼에서 읽는 시연 결과)"""
import json, os
here = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(f"{here}/../results.json", encoding="utf-8"))
R["md"] = open(f"{here}/../trip.md", encoding="utf-8").read().rstrip("\n").split("\n")
open(f"{here}/data.js", "w", encoding="utf-8").write("const R = " + json.dumps(R, ensure_ascii=False) + ";\n")
print("saved data.js")
