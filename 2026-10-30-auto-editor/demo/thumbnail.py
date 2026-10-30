"""썸네일 1280x720: 실제 소리 크기 막대(빨강=잘릴 곳) + 큰 글씨. 사용: python3 thumbnail.py <출력.jpg>"""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

here = Path(__file__).parent
src = (here / "anim/data.js").read_text(encoding="utf-8"); D = json.loads(src[src.index("{"): src.rindex("}") + 1])
W, H = 1280, 720
im = Image.new("RGB", (W, H), (13, 17, 23)); d = ImageDraw.Draw(im)
fb = lambda s: ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc", s, index=1)
L, NF = D["levels"], len(D["levels"]); keep = [1] * NF
for a, b, k in D["chunks"]:
    for i in range(a, min(b, NF)): keep[i] = k
NC, mx = 160, max(L)
for c in range(NC):
    a, b = c * NF // NC, (c + 1) * NF // NC
    lv, k = max(L[a:b]), sum(keep[a:b]) * 2 >= (b - a)
    h = max(4, (lv / mx) ** 0.5 * 200); x = 40 + c * 7.5
    d.rectangle((x, 560 - h / 2, x + 5, 560 + h / 2), fill=(88, 166, 255) if k else (255, 107, 107))
d.text((50, 70), "지루한 컷 편집,", font=fb(96), fill=(240, 243, 246))
d.text((50, 190), "명령 한 줄로", font=fb(110), fill=(242, 193, 78))
d.rounded_rectangle((820, 90, 1240, 300), 30, fill=(126, 231, 135))
d.text((1030, 150), "1:08 → 0:36", font=fb(58), fill=(13, 17, 23), anchor="mm")
d.text((1030, 240), "무음 자동 컷", font=fb(52), fill=(13, 17, 23), anchor="mm")
im.save(sys.argv[1], quality=90); print("saved", sys.argv[1])
