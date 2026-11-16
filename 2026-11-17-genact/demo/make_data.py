"""영상용 render/data.js: 측정값(results.json + results_extra.json)을 그대로 옮김"""
import json
R = json.load(open("results.json")); R.update(json.load(open("results_extra.json")))
open("render/data.js", "w", encoding="utf-8").write("const RES = " + json.dumps(R, ensure_ascii=False) + ";\n")
print("ok")
