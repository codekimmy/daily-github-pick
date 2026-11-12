"""블로그·README용 그림 → ../media/ (모자이크비교.png, 점개수비교.png, 색줄이기.png, 두께비교.png, thumbnail.jpg, 숏폼용 세로 thumbnail-shorts.jpg)
숫자는 모두 results.json(실제 측정값). 사진은 scikit-image 견본 사진(CC0). 사용: python3 make_images.py (test_all.py · test_cli.py · 도트변환.py 다음에)"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
H = Path(__file__).parent; O = H / "out"; M = H.parent / "media"; R = json.load(open(H / "results.json", encoding="utf-8"))
B = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"; BG, INK, SUB, GOLD, GREEN, RED = "#0d1117", "#f0f3f6", "#9aa7b8", "#f2c14e", "#7ee787", "#ff7b72"
f = lambda s: ImageFont.truetype(B, s)


def fit(im, w, h):  # 도트 그림은 계단 그대로 보이게 NEAREST
    k = min(w / im.width, h / im.height); return im.resize((int(im.width * k), int(im.height * k)), Image.NEAREST)


def panels(items, title, name, pw=560, ph=374):
    W = 40 + len(items) * (pw + 30) + 10; c = Image.new("RGB", (W, ph + 230), BG); d = ImageDraw.Draw(c)
    d.text((40, 30), title, fill=INK, font=f(40))
    for i, (im, a, b, col) in enumerate(items):
        x = 40 + i * (pw + 30); t = fit(im, pw, ph); c.paste(t, (x, 100))
        d.text((x, 100 + ph + 20), a, fill=col, font=f(34)); d.text((x, 100 + ph + 68), b, fill=SUB, font=f(26))
    c.save(M / name); print(name, c.size)


P = R["photos"]; C = R["cli"]
cat, cof = Image.open(H / "photos/고양이.png"), Image.open(H / "photos/커피.png")
dd = P["고양이"]["compare96"]["dots"]
panels([(cat, "원본 사진", f"{P['고양이']['size'][0]}×{P['고양이']['size'][1]} 화소", INK),
        (Image.open(O / "고양이_모자이크96.png"), "보통 모자이크", f"칸 평균 색 · {dd[0]}×{dd[1]}점", SUB),
        (Image.open(O / "고양이_pixeloe96.png"), "PixelOE", f"외곽선 살림 · {dd[0]}×{dd[1]}점 · {P['고양이']['compare96']['sec']}초", GOLD)],
       "같은 점 개수(117×78)로 줄인 결과 — 눈·코 테두리 비교", "모자이크비교.png")
S = P["고양이"]["sizes"]
panels([(Image.open(O / f"고양이_크기{s}.png"), f"-S {s} → {S[str(s)]['dots'][0]}×{S[str(s)]['dots'][1]}점", f"{S[str(s)]['sec']}초", [RED, GOLD, GREEN, INK][i]) for i, s in enumerate([32, 64, 128, 256])],
       "점 개수(-S)를 바꾼 결과 (고양이 사진, 점 하나 6×6 화소)", "점개수비교.png", 420, 280)
panels([(cof, "원본 사진", "600×400 화소", INK), (Image.open(O / "cli_커피_점64.png"), "-S 64 -P 8", f"결과 색 {C['커피_점64']['uniq']:,}가지", SUB),
        (Image.open(O / "cli_커피_점64_색8.png"), "-S 64 -P 8 --colors 8", f"결과 색 {C['커피_점64_색8']['uniq']:,}가지 (8가지 아님)", GOLD)],
       "색 줄이기(--colors 8) 결과 — 색이 줄지만 딱 8가지가 되지는 않음", "색줄이기.png")
T = P["고양이"]["thick"]
panels([(Image.open(O / f"고양이_두께{t}.png"), f"-T {t}" + (" (외곽선 끔)" if t == 0 else " (기본)" if t == 1 else ""), f"{T[str(t)]['sec']}초", [SUB, GOLD, GREEN, INK][i]) for i, t in enumerate([0, 1, 2, 3])],
       "외곽선 두께(-T)를 바꾼 결과 (117×78점)", "두께비교.png", 420, 280)


def thumb(W, H_, vert, name):
    c = Image.new("RGB", (W, H_), BG); d = ImageDraw.Draw(c); px = Image.open(O / "고양이_크기64.png")  # 78×52점: 썸네일 크기에서도 점이 보이게
    if not vert:
        a = cat.resize((640, 426), Image.LANCZOS); b = fit(px, 640, 426); c.paste(a.crop((0, 0, 320, 426)), (0, 294)); c.paste(b.crop((320, 0, 640, 426)), (320, 294))
        d.line([(320, 294), (320, 720)], fill=GOLD, width=6)
        d.text((680, 300), "사진 → 도트 그림", fill=INK, font=f(66)); d.text((680, 395), "명령 한 줄이면 끝", fill=GOLD, font=f(66))
        d.text((680, 500), "외곽선을 살리는 무료 프로그램", fill=SUB, font=f(36)); d.text((680, 560), "PixelOE", fill=GREEN, font=f(60))
        d.text((40, 60), "내 사진이", fill=INK, font=f(96)); d.text((40, 170), "게임 속 도트 그림으로", fill=GOLD, font=f(84))
    else:
        a = cat.resize((1080, 718), Image.LANCZOS).crop((0, 100, 1080, 600)); b = fit(px, 1080, 718).crop((0, 100, 1080, 600))
        c.paste(a, (0, 400)); c.paste(b, (0, 912)); d.rectangle([0, 900, 1080, 912], fill=GOLD)
        d.text((540, 320), "내 사진이 도트 그림으로", fill=INK, font=f(80), anchor="mm"); d.text((540, 1520), "명령 한 줄이면 끝", fill=GOLD, font=f(92), anchor="mm")
        d.text((540, 1630), "PixelOE", fill=GREEN, font=f(66), anchor="mm")
        d.text((40, 420), "원본", fill=INK, font=f(48), stroke_width=4, stroke_fill=BG); d.text((40, 932), "PixelOE", fill=GOLD, font=f(48), stroke_width=4, stroke_fill=BG)
    c.convert("RGB").save(M / name, quality=92); print(name, c.size)


thumb(1280, 720, False, "thumbnail.jpg"); thumb(1080, 1920, True, "thumbnail-shorts.jpg")
