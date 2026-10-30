"""애니메이션 재료: auto-editor가 실제로 잰 소리 크기(levels)와 자른 구간(v1 타임라인)을 data.js로.
사용: python3 prep.py <작업폴더>  (작업폴더에 lecture.mp4 가 있어야 함)"""
import json, subprocess, sys
from pathlib import Path

work = Path(sys.argv[1]); here = Path(__file__).parent
out = subprocess.run(["auto-editor", "levels", "lecture.mp4"], cwd=work, capture_output=True, text=True, check=True).stdout
levels = [round(float(x), 4) for x in out.split() if x[0].isdigit()]
subprocess.run(["auto-editor", "lecture.mp4", "--no-open", "--progress", "none", "--export", "v1", "-o", "tl.v1"], cwd=work, check=True)
chunks = json.loads((work / "tl.v1").read_text())["chunks"]
data = {"fps": 30, "levels": levels, "chunks": [[a, b, 0 if s > 1000 else 1] for a, b, s in chunks],
        "results": {"orig": 57.9, "cut": 29.0, "m05": 35.0, "m1": 45.0, "fast4": 36.2, "took": 7}}
(here / "data.js").write_text("const DATA=" + json.dumps(data) + ";", encoding="utf-8")
keep = sum(b - a for a, b, k in data["chunks"] if k) / 30
print("levels", len(levels), "chunks", len(chunks), f"남는 길이 {keep:.1f}초")
