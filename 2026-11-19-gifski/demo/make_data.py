"""영상용 측정값 → render/data.js (results.json · results_extra.json, 2026-11-19 시연)"""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(f"{H}/results.json")); R["extra"] = json.load(open(f"{H}/results_extra.json"))
open(f"{H}/render/data.js", "w").write("const RES = " + json.dumps(R, ensure_ascii=False) + ";\n")
