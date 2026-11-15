"""시연용 자료 만들기 (모두 직접 그린 가상 자료 + scikit-image에 들어 있는 CC0 고양이 사진).
- samples/로고_원본.png   : 가상 카페 '오늘커피' 로고 1200px (비교용 정답, VTracer에 넣지 않음)
- samples/로고_작은.jpg   : 위 로고를 240px로 줄이고 JPG 화질 60으로 저장 (메신저로 받은 작은 로고 흉내)
- samples/서명_사진.jpg   : 가상 손글씨 서명을 종이에 쓰고 휴대폰으로 찍은 것처럼 한쪽이 어두운 그림 (1600×800)
- samples/서명_정답.png   : 서명 획만 있는 정답 그림 (비교용)
- samples/도트.png        : 직접 찍은 24×24 도트 그림 (가상 화분)
- samples/고양이.jpg      : scikit-image 'chelsea' (CC0, 사진가 Stefan van der Walt) 451×300
- samples/고양이_4000.jpg : 같은 사진을 4000px로 키운 것 (큰 사진 처리 시간용)
사용: python3 demo/make_samples.py"""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from skimage import data

HERE = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(HERE, "samples"); os.makedirs(S, exist_ok=True)
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"
random.seed(7); np.random.seed(7)

# 1) 가상 카페 로고 (원 + 컵 + 김 + 글자)
N = 1200; im = Image.new("RGB", (N, N), "white"); d = ImageDraw.Draw(im)
d.ellipse((60, 60, N - 60, N - 60), fill="#1f6f5c"); d.ellipse((110, 110, N - 110, N - 110), outline="#f4e3c1", width=18)
d.rounded_rectangle((380, 380, 760, 700), radius=60, fill="#f4e3c1")               # 컵
d.ellipse((700, 450, 880, 630), outline="#f4e3c1", width=46)                        # 손잡이
d.rectangle((330, 700, 870, 740), fill="#f4e3c1")                                   # 받침
for x in (470, 570, 670):                                                            # 김
    pts = [(x + 28 * math.sin(t / 12), 340 - t) for t in range(0, 150, 3)]
    d.line(pts, fill="#f4e3c1", width=22, joint="curve")
d.ellipse((520, 500, 620, 600), fill="#c8553d")                                      # 컵의 하트 대신 동그라미 무늬
f = ImageFont.truetype(FONT, 150, index=1); d.text((N / 2, 880), "오늘커피", font=f, fill="#f4e3c1", anchor="mm")
im.save(os.path.join(S, "로고_원본.png"))
im.resize((240, 240), Image.LANCZOS).save(os.path.join(S, "로고_작은.jpg"), quality=60)

# 2) 가상 손글씨 서명 (굵기가 바뀌는 곡선) + 종이 사진 효과(한쪽 그림자·잡티)
W, H = 1600, 800
def stroke(dr, pts, w0, w1):
    for i in range(len(pts) - 1):
        w = w0 + (w1 - w0) * i / (len(pts) - 1); dr.line([pts[i], pts[i + 1]], fill=0, width=int(w))
        dr.ellipse((pts[i][0] - w / 2, pts[i][1] - w / 2, pts[i][0] + w / 2, pts[i][1] + w / 2), fill=0)
def curve(f, a, b, n=240): return [f(a + (b - a) * i / n) for i in range(n + 1)]
mask = Image.new("L", (W, H), 255); md = ImageDraw.Draw(mask)
stroke(md, curve(lambda t: (250 + 260 * t + 60 * math.sin(t * 9), 430 - 170 * math.sin(t * 3.1) + 30 * math.cos(t * 7)), 0, 1), 9, 15)
stroke(md, curve(lambda t: (520 + 380 * t, 420 + 70 * math.sin(t * 14) - 40 * t), 0, 1), 14, 9)
stroke(md, curve(lambda t: (900 + 300 * t + 50 * math.sin(t * 18), 380 + 90 * math.sin(t * 8 + 1)), 0, 1), 10, 16)
stroke(md, curve(lambda t: (230 + 1050 * t, 560 + 25 * math.sin(t * 5) - 30 * t), 0, 1), 7, 4)   # 밑줄
stroke(md, curve(lambda t: (1240 + 40 * math.cos(t * 6.28), 330 + 40 * math.sin(t * 6.28)), 0, 1), 8, 8)  # 동그라미 점
mask.save(os.path.join(S, "서명_정답.png"))
paper = np.full((H, W), 236.0)
xx, yy = np.meshgrid(np.arange(W), np.arange(H))
shade = 1 - 0.55 * np.clip((xx - 700) / 900, 0, 1) ** 1.3 * (0.6 + 0.4 * yy / H)   # 오른쪽이 휴대폰 그림자로 어두움
ink = np.asarray(mask.filter(ImageFilter.GaussianBlur(1.2)), dtype=float) / 255
photo = (paper * ink + 45 * (1 - ink)) * shade + np.random.normal(0, 6, (H, W))
Image.fromarray(np.clip(photo, 0, 255).astype(np.uint8)).convert("RGB").save(os.path.join(S, "서명_사진.jpg"), quality=85)

# 3) 24×24 도트 그림 (가상 화분)
P = {".": None, "g": "#3fa34d", "G": "#2b7a3a", "p": "#c8553d", "P": "#9c3d2b", "y": "#f2c14e", "w": "#ffffff"}
art = """
........................
..........gg............
.........gGGg...........
....gg...gGGg....gg.....
...gGGg...gg....gGGg....
...gGGGg..gg...gGGGg....
....gGGGg.gg..gGGGg.....
.....gGGGggg.gGGGg......
......gGGGgggGGGg.......
.......ggGGGGGgg........
.........gGGGg..........
..........gg............
..........gg...yy.......
.....pppppppppppppp.....
.....PPPPPPPPPPPPPP.....
......pppppppppppp......
......pwwpppppppp.......
......pwppppppppp.......
.......pppppppppp.......
.......pppppppppp.......
........pppppppp........
........PPPPPPPP........
........................
........................""".strip().split("\n")
dot = Image.new("RGBA", (24, 24), (0, 0, 0, 0))
for y, row in enumerate(art):
    for x, ch in enumerate(row[:24]):
        if P.get(ch): dot.putpixel((x, y), Image.new("RGB", (1, 1), P[ch]).getpixel((0, 0)) + (255,))
dot.save(os.path.join(S, "도트.png"))

# 4) CC0 고양이 사진
cat = Image.fromarray(data.chelsea()); cat.save(os.path.join(S, "고양이.jpg"), quality=92)
cat.resize((4000, int(4000 * cat.height / cat.width)), Image.LANCZOS).save(os.path.join(S, "고양이_4000.jpg"), quality=90)
for n in sorted(os.listdir(S)): print(n, os.path.getsize(os.path.join(S, n)) // 1024, "KB", Image.open(os.path.join(S, n)).size)
