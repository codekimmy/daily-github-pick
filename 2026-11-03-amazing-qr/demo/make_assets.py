"""시연용 가상 그림을 코드로 그린다 (실제 사진·로고 아님, 모두 가상 자료).
cafe.png  가상의 동네 카페 간판 그림
sunset.png 노을 풍경 그림
night.png  아주 어두운 밤하늘 그림 (스캔이 어려운 경우 시연용)
wide.png   가로로 긴 노을 그림 (정사각형으로 잘리는지 확인)
wave.gif   움직이는 그림 (색이 도는 물결, 12장)"""
import math, os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
os.makedirs(out, exist_ok=True)
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"
N = 600


def grad(c1, c2, size=N):
    im = Image.new("RGB", (size, size))
    d = ImageDraw.Draw(im)
    for y in range(size):
        k = y / (size - 1)
        d.line([(0, y), (size, y)], fill=tuple(int(a + (b - a) * k) for a, b in zip(c1, c2)))
    return im


# 1) 가상의 카페 간판: 따뜻한 배경 + 커피잔 + 김 + 글자
im = grad((255, 214, 153), (232, 120, 70))
d = ImageDraw.Draw(im)
d.ellipse([90, 90, 510, 510], fill=(255, 245, 230))
d.rounded_rectangle([190, 250, 390, 430], 40, fill=(120, 70, 45))          # 컵
d.ellipse([360, 290, 450, 380], outline=(120, 70, 45), width=22)            # 손잡이
d.ellipse([170, 410, 410, 460], fill=(160, 100, 70))                        # 받침
d.ellipse([205, 240, 375, 285], fill=(80, 45, 30))                          # 커피
for i, x in enumerate([235, 290, 345]):                                     # 김
    pts = [(x + 14 * math.sin(t / 6 + i), 225 - t * 1.6) for t in range(0, 60)]
    d.line(pts, fill=(200, 160, 130), width=10)
f = ImageFont.truetype(FONT, 58)
d.text((300, 520), "콩콩 카페", font=f, fill=(90, 40, 20), anchor="mm")
im.save(f"{out}/cafe.png")

# 2) 노을 풍경
im = grad((255, 120, 90), (255, 220, 140))
d = ImageDraw.Draw(im)
d.ellipse([220, 230, 380, 390], fill=(255, 250, 210))
d.polygon([(0, 420), (140, 300), (260, 400), (380, 280), (600, 430), (600, 600), (0, 600)], fill=(110, 60, 110))
d.polygon([(0, 480), (200, 410), (420, 470), (600, 420), (600, 600), (0, 600)], fill=(60, 35, 80))
for y in range(500, 600, 14):
    d.line([(60, y), (540, y)], fill=(255, 170, 120), width=3)
im = im.filter(ImageFilter.GaussianBlur(1))
im.save(f"{out}/sunset.png")
im.resize((900, 400)).save(f"{out}/wide.png")   # 가로로 긴 그림 (잘림 확인용)

# 3) 아주 어두운 밤하늘
im = grad((5, 8, 25), (20, 25, 55))
d = ImageDraw.Draw(im)
import random
random.seed(3)
for _ in range(90):
    x, y, r = random.randint(0, N), random.randint(0, N), random.choice([1, 1, 2])
    d.ellipse([x - r, y - r, x + r, y + r], fill=(200, 200, 230))
d.ellipse([400, 80, 500, 180], fill=(230, 230, 200))
d.ellipse([425, 70, 525, 170], fill=(8, 12, 32))
im.save(f"{out}/night.png")

# 4) 움직이는 그림: 무지개 고리가 돌며 커졌다 작아짐 (12장)
frames = []
for k in range(12):
    im = Image.new("RGB", (N, N), (255, 255, 255))
    d = ImageDraw.Draw(im)
    for j in range(8):
        hue = (k * 30 + j * 45) % 360
        col = Image.new("HSV", (1, 1), (int(hue / 360 * 255), 200, 250)).convert("RGB").getpixel((0, 0))
        r = 40 + j * 34 + 12 * math.sin((k / 12 + j / 8) * 2 * math.pi)
        d.ellipse([N / 2 - r, N / 2 - r, N / 2 + r, N / 2 + r], outline=col, width=22)
    frames.append(im)
frames[0].save(f"{out}/wave.gif", save_all=True, append_images=frames[1:], duration=100, loop=0)
print("saved", os.listdir(out))
