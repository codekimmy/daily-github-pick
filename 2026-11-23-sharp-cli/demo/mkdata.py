"""results.json + 시연 결과 그림 → render/data.js, render/img/ (영상·썸네일용 작은 그림), media/ (블로그용 비교 그림은 thumb.py)
사용: python3 demo/mkdata.py (bench.py 다음)"""
import json, os, glob
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); W = os.path.join(HERE, "work"); I = os.path.join(HERE, "render", "img"); os.makedirs(I, exist_ok=True)
R = json.load(open(os.path.join(HERE, "results.json")))
for i, p in enumerate(sorted(glob.glob(os.path.join(HERE, "photos", "*.jpg")))):
    Image.open(p).resize((640, 480), Image.LANCZOS).save(os.path.join(I, f"p{i+1}.jpg"), quality=90)
# 화질 값별 같은 자리 확대 (2_산풍경 1600px 결과에서 산등성이 320×240 → 3배)
box = (560, 380, 880, 620)
for q in ("95", "80", "40", "20"):
    Image.open(os.path.join(W, f"q{q}", "2_산풍경.webp")).convert("RGB").crop(box).resize((960, 720), Image.NEAREST).save(os.path.join(I, f"q{q}.png"))
Image.open(os.path.join(W, "ref", "2_산풍경.png")).convert("RGB").crop(box).resize((960, 720), Image.NEAREST).save(os.path.join(I, "qref.png"))
# 세로 사진: 기본(누움) / --autoOrient(바로 섬)
Image.open(os.path.join(W, "o_rot", "기본.jpg")).resize((640, 480)).save(os.path.join(I, "rot_default.jpg"), quality=90)
Image.open(os.path.join(W, "o_rot", "자동.jpg")).resize((480, 640)).save(os.path.join(I, "rot_auto.jpg"), quality=90)
# 정사각형 썸네일
Image.open(os.path.join(W, "sq_centre", "1_바다노을.jpg")).resize((540, 540)).save(os.path.join(I, "square.jpg"), quality=90)
with open(os.path.join(HERE, "render", "data.js"), "w", encoding="utf-8") as f:
    f.write("const RES = " + json.dumps(R, ensure_ascii=False) + ";\n")
print("ok", os.listdir(I))
