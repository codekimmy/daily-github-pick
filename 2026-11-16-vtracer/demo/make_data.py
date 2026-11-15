"""영상·그림용 render/data.js: 측정값(results.json) + 그림 파일 목록. 그림은 render/img/ (시연 입력 그림과 VTracer가 만든 SVG를 그대로 복사)
사용: python3 demo/make_data.py"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(os.path.join(HERE, "results.json"), encoding="utf-8"))
IM = sorted(os.listdir(os.path.join(HERE, "render", "img")))
with open(os.path.join(HERE, "render", "data.js"), "w", encoding="utf-8") as f:
    f.write("const RES = " + json.dumps(R, ensure_ascii=False) + ";\nconst IMGS = " + json.dumps(IM) + ";\n")
print(IM)
