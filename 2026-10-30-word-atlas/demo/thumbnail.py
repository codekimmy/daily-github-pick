"""썸네일 1280x720: 그림 모자이크 + 큰 글씨. 사용: python3 thumbnail.py <출력.jpg>"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFont

here = Path(__file__).parent
W, H = 1280, 720
bg = Image.open(here / "anim/sprite.jpg").crop((0, 0, 1600, 900)).resize((W, H))
bg = ImageEnhance.Brightness(bg).enhance(0.35)
c = Image.open(here / "anim/img/honeymoon.webp").convert("RGB").resize((430, 430))
m = Image.new("L", c.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, 429, 429), 28, fill=255)
bg.paste(c, (800, 145), m)
d = ImageDraw.Draw(bg)
fb = lambda s: ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc", s, index=1)
d.text((60, 150), "영어 단어", font=fb(84), fill=(244, 239, 228))
d.text((60, 250), "7,298개", font=fb(150), fill=(242, 184, 75))
d.text((60, 430), "전부 그림 + 발음", font=fb(76), fill=(244, 239, 228))
d.rounded_rectangle((60, 560, 400, 640), 40, fill=(123, 211, 137))
d.text((230, 600), "무료 공개", font=fb(48), fill=(11, 15, 28), anchor="mm")
bg.save(sys.argv[1], quality=90)
print("saved", sys.argv[1])
