"""썸네일·테마 비교·수정 가능한 PPTX 비교 이미지 (모두 out/ 의 실제 결과로) → media/"""
import os
from PIL import Image, ImageDraw, ImageFont
here = os.path.dirname(os.path.abspath(__file__)); out = f"{here}/out"; media = f"{here}/../media"
B = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"; R = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
f = lambda p, s: ImageFont.truetype(p, s)
BG, INK, GOLD, SUB, GREEN = (13, 17, 23), (240, 243, 246), (242, 193, 78), (154, 167, 184), (126, 231, 135)
def sl(p, w): im = Image.open(p).convert("RGB"); return im.resize((w, w * 9 // 16), Image.LANCZOS)

# 썸네일
t = Image.new("RGB", (1280, 720), BG); d = ImageDraw.Draw(t)
for i, th in enumerate(["default", "gaia", "uncover"]):
    im = sl(f"{out}/theme-{th}.00{[1, 3, 3][i]}.png", 380); t.paste(im, (40 + i * 410, 440))
d.text((640, 120), "메모장 글이", font=f(B, 96), fill=INK, anchor="mm")
d.text((640, 250), "발표 자료로 2초", font=f(B, 110), fill=GOLD, anchor="mm")
d.text((640, 370), "PDF · 파워포인트 · 무료", font=f(R, 46), fill=GREEN, anchor="mm")
t.save(f"{media}/thumbnail.jpg", quality=92)

# 테마 3종 비교 (같은 글, theme 한 단어만 바꿈)
c = Image.new("RGB", (1920, 760), BG); d = ImageDraw.Draw(c)
for i, th in enumerate(["default", "gaia", "uncover"]):
    c.paste(sl(f"{out}/theme-{th}.001.png", 600), (30 + i * 630, 30)); c.paste(sl(f"{out}/theme-{th}.003.png", 600), (30 + i * 630, 380))
    d.text((330 + i * 630, 725), f"theme: {th}", font=f(R, 34), fill=GOLD, anchor="mm")
c.save(f"{media}/themes.png")

# 기본 PPTX(그림) vs --pptx-editable (LibreOffice로 연 화면)
c = Image.new("RGB", (1920, 620), BG); d = ImageDraw.Draw(c)
c.paste(sl(f"{out}/theme-default.003.png", 920), (30, 30)); c.paste(sl(f"{out}/editable-view.003.png", 920), (970, 30))
d.text((490, 580), "기본 PPTX (장 전체가 그림 1장)", font=f(R, 32), fill=SUB, anchor="mm")
d.text((1430, 580), "--pptx-editable (LibreOffice로 연 화면)", font=f(R, 32), fill=GOLD, anchor="mm")
c.save(f"{media}/pptx-editable.png")
print("saved")
