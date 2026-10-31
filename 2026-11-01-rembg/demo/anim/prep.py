"""results.json → data.js (애니메이션·롱폼에서 읽는 테스트 결과)"""
import json, os
here = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(f"{here}/../results.json", encoding="utf-8"))
open(f"{here}/data.js", "w", encoding="utf-8").write("const R = " + json.dumps(R, ensure_ascii=False) + ";\n")
print("saved data.js")
