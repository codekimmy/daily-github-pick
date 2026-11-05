"""results.json + 가계부 일부 → data.js (애니메이션·롱폼이 같이 씀)"""
import json, os, re
H = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(f"{H}/../results.json", encoding="utf-8"))
txt = open(f"{H}/../work/가계부.beancount", encoding="utf-8").read()
blocks = [b.strip() for b in txt.split("\n\n") if re.match(r"\d{4}-\d\d-\d\d \* ", b.strip())]
blocks.sort(key=lambda b: b[:10])
lines = []
for b in blocks[:40]: lines += b.splitlines() + [""]
open(f"{H}/data.js", "w", encoding="utf-8").write("const R = " + json.dumps(R, ensure_ascii=False) + ";\nconst LED = " + json.dumps(lines, ensure_ascii=False) + ";\n")
print(len(lines))
