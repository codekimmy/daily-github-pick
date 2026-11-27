"""시연용 가상 그림·쪽지 만들기 (사진 아님 · 코드로 그린 그림). 결과 → demo/sample/"""
import os, random
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); SM = os.path.join(HERE, "sample"); os.makedirs(SM, exist_ok=True)
F = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
random.seed(7)


def autumn(w, h, title, sub):
    im = Image.new("RGB", (w, h)); d = ImageDraw.Draw(im)
    for y in range(h):   # 노을 하늘
        t = y / h; d.line([(0, y), (w, y)], fill=(int(250 - 40 * t), int(200 - 90 * t), int(150 - 40 * t)))
    r = h // 8; d.ellipse([w * .7 - r, h * .32 - r, w * .7 + r, h * .32 + r], fill=(255, 240, 200))
    for k, (base, col) in enumerate(((.55, (150, 90, 70)), (.68, (190, 100, 50)), (.8, (120, 70, 40)))):   # 산 세 겹
        pts = [(0, h)] + [(x, int(h * base + 40 * __import__('math').sin(x / (90 + 40 * k) + k) + random.randint(-6, 6))) for x in range(0, w + 20, 20)] + [(w, h)]
        d.polygon(pts, fill=col)
    for i in range(70):   # 낙엽 점
        x, y = random.randint(0, w), random.randint(int(h * .6), h); s = random.randint(4, 10)
        d.ellipse([x, y, x + s, y + s], fill=random.choice([(230, 120, 40), (240, 180, 60), (200, 70, 40)]))
    fs = h // 8; d.text((w * .06, h * .08), title, font=ImageFont.truetype(F, fs), fill=(255, 255, 255))
    d.text((w * .06, h * .08 + fs * 1.3), sub, font=ImageFont.truetype(F, fs // 3), fill=(255, 255, 255))
    return im


autumn(1280, 720, "가을 산책", "가상 그림 · 시연용").save(os.path.join(SM, "가을산책.png"))
autumn(1280, 720, "가을 산책", "가상 그림 · 시연용").save(os.path.join(SM, "가을산책.jpg"), quality=92)
with open(os.path.join(SM, "쪽지.txt"), "w", encoding="utf-8") as f:   # 파일 통째로 숨기기용 가상 쪽지
    f.write("[가상 쪽지]\n엄마 생신 깜짝 파티\n- 12월 5일 저녁 7시, 거실 불 끄고 대기\n- 케이크: 동생 담당\n- 꽃다발: 아빠 담당\n")
print(os.listdir(SM))
