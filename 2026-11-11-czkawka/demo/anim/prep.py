"""애니메이션 재료: 시연에 쓴 실제 사진을 작게 복사 + data.js (숫자는 results.json 그대로)"""
import json, shutil
from pathlib import Path
from PIL import Image
H = Path(__file__).parent; D = H.parent; S = D / "work/정리전/사진"; IMG = H / "img"; IMG.mkdir(exist_ok=True)
for p in list(S.rglob("*.jpg")):
    if "깨진" in p.name: continue
    im = Image.open(p).convert("RGB"); im.thumbnail((640, 640)); im.save(IMG / p.name, quality=90)
for p in (D.parent / "media").glob("*.png"): shutil.copy(p, IMG / p.name)
R = json.loads((D / "results.json").read_text())
(H / "data.js").write_text("const R = " + json.dumps(R, ensure_ascii=False) + ";\n", encoding="utf-8")
print(sorted(x.name for x in IMG.iterdir()))
