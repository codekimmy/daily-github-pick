"""results.json + 실제 변환 결과(work/out/*.md) → data.js (애니메이션·롱폼이 같이 씀)"""
import json, os
H = os.path.dirname(os.path.abspath(__file__)); O = f"{H}/../work/out"
R = json.load(open(f"{H}/../results.json", encoding="utf-8"))
R["F"] = {f["file"]: f for f in R["files"]}
R["MD"] = {n: open(f"{O}/{n}.md", encoding="utf-8").read().strip().splitlines() for n in ["회의록", "발표", "가계부", "안내문", "공지", "명단_cp949", "화분책", "묶음"]}
open(f"{H}/data.js", "w", encoding="utf-8").write("const R = " + json.dumps(R, ensure_ascii=False) + ";\n")
print("saved data.js")
