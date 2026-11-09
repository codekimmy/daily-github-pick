"""썸네일 (media/thumbnail.jpg): 실제 결과 그림 + 큰 글씨"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
H = Path(__file__).parent; F = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"
im = Image.new("RGB", (1280, 720), "#0d1117"); d = ImageDraw.Draw(im)
c = Image.open(H / "anim/img/07_하트모양.png").convert("RGB"); c.thumbnail((620, 620)); im.paste(c, (630, 50))
d.text((60, 140), "단톡방 600줄이", font=ImageFont.truetype(F, 72), fill="#f0f3f6")
d.text((60, 240), "그림 한 장으로", font=ImageFont.truetype(F, 84), fill="#f2c14e")
d.text((60, 380), "wordcloud", font=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", 64), fill="#9aa7b8")
d.text((60, 480), "무료 · 한글 설정법까지", font=ImageFont.truetype(F, 44), fill="#7ee787")
im.save(H.parent / "media/thumbnail.jpg", quality=92); print("saved")
