"""시연용 가상 그림 만들기 (사진 아님 · 코드로 그린 그림). 결과 → demo/sample/"""
import os
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); SM = os.path.join(HERE, "sample"); os.makedirs(SM, exist_ok=True)
F = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"


def sea(w, h, text, sub):
    im = Image.new("RGB", (w, h)); d = ImageDraw.Draw(im)
    for y in range(h):   # 하늘 → 바다 색 띠
        t = y / h
        c = (int(255 - 120 * t), int(190 - 60 * t), int(150 + 60 * t)) if t < .58 else (int(40 + 30 * t), int(90 + 40 * t), int(160 + 40 * t))
        d.line([(0, y), (w, y)], fill=c)
    r = h // 7; d.ellipse([w * .62 - r, h * .45 - r, w * .62 + r, h * .45 + r], fill=(255, 236, 180))
    for i in range(9): y = int(h * (.62 + i * .04)); d.line([(int(w * .1 + i * 37 % 200), y), (int(w * .9 - i * 53 % 240), y)], fill=(210, 230, 255), width=max(2, h // 240))
    fs = h // 7; d.text((w * .07, h * .1), text, font=ImageFont.truetype(F, fs), fill=(255, 255, 255))
    d.text((w * .07, h * .1 + fs * 1.25), sub, font=ImageFont.truetype(F, fs // 3), fill=(255, 255, 255))
    return im


sea(1280, 720, "겨울 바다", "가상 그림 · 시연용").save(os.path.join(SM, "겨울바다.png"))
# 카메라 정보(EXIF)가 든 JPG: 결과에 남는지 보기 위함 (가상 값)
ex = Image.Exif(); ex[0x0110] = "VIRTUAL-CAM"; ex[0x9003] = "2026:11:27 09:00:00"
sea(1080, 1350, "연말 공연", "포스터 · 가상").save(os.path.join(SM, "포스터.jpg"), quality=90, exif=ex)
# 움직이는 GIF (3장)
fr = [sea(480, 270, s, "가상 GIF") for s in ("하나", "둘", "셋")]
fr[0].save(os.path.join(SM, "움짤.gif"), save_all=True, append_images=fr[1:], duration=500, loop=0)
print(os.listdir(SM))
