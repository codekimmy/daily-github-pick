"""../results.json(test_all.py 결과)을 애니메이션용 data.js 로. 사용: python3 prep.py"""
import json, pathlib
here = pathlib.Path(__file__).parent
R = json.load(open(here.parent / "results.json", encoding="utf-8"))
(here / "data.js").write_text("const DATA = " + json.dumps(R, ensure_ascii=False) + ";\n", encoding="utf-8")
print(len(R), "개")
