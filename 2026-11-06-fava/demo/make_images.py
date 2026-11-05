"""썸네일(media/thumbnail.jpg)과 전/후 그림(media/before-after.png). 화면은 실제 Fava 캡처, 장부는 시연용 가상 자료"""
import os
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__)); M = f"{H}/../media"
B = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"; MO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
f = lambda s, p=B: ImageFont.truetype(p, s)
led = open(f"{H}/work/가계부.beancount", encoding="utf-8").read().splitlines()[96:111]
def pad(w, h, size):
    im = Image.new("RGB", (w, h), "#fbfbfb"); d = ImageDraw.Draw(im); d.rectangle([0, 0, w, 44], fill="#e8eaed")
    d.text((16, 8), "가계부.beancount - 메모장", font=f(22), fill="#333")
    for i, s in enumerate(led): d.text((20, 60 + i * size * 1.5), s, font=f(size, MO) if s.isascii() else f(size, "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"), fill="#0b5cad" if s[:2] == "20" else "#222")
    return im
# 전/후
W_, H_ = 1920, 760; im = Image.new("RGB", (W_, H_), "#0d1117"); d = ImageDraw.Draw(im)
im.paste(pad(760, 600, 24), (60, 120)); shot = Image.open(f"{M}/shots/02_expense_tree.png").resize((1000, 562)); im.paste(shot, (880, 140))
d.text((440, 60), "전: 메모장에 적은 장부 (글자)", font=f(44), fill="#f0f3f6", anchor="mm"); d.text((1380, 60), "후: fava 화면 (실제 캡처)", font=f(44), fill="#f2c14e", anchor="mm")
d.text((850, 420), "→", font=f(80), fill="#f2c14e", anchor="mm")
d.text((W_ // 2, 735), "시연용 가상 가계부 · 2026-11-06 클라우드 시연 결과(운영자 직접 검증 아님)", font=f(24), fill="#9aa7b8", anchor="mm")
im.save(f"{M}/before-after.png")
# 썸네일
t = Image.new("RGB", (1280, 720), "#0d1117"); d = ImageDraw.Draw(t)
t.paste(pad(470, 420, 17), (40, 250)); t.paste(Image.open(f"{M}/shots/02_expense_tree.png").crop((216, 137, 1920, 619)).resize((700, 198)), (550, 330))
d.text((640, 90), "메모장 가계부 → 차트", font=f(92), fill="#f2c14e", anchor="mm"); d.text((640, 190), "무료 fava · 거래 453건 한눈에", font=f(48), fill="#f0f3f6", anchor="mm")
d.text((900, 600), "→", font=f(1), fill="#0d1117")
d.text((900, 590), "어디에 많이 썼나", font=f(44), fill="#7ee787", anchor="mm")
t.convert("RGB").save(f"{M}/thumbnail.jpg", quality=90)
print("ok")
