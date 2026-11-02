"""썸네일(media/thumbnail.jpg)과 결과 모음(media/gallery.png), 버티기 시험 그림(media/stress.png)
모든 QR은 실제 시연 결과물(out/), 원본 그림은 시연용 가상 그림(assets/)"""
import json, os
from PIL import Image, ImageDraw, ImageFont

D = os.path.dirname(os.path.abspath(__file__)); M = os.path.join(os.path.dirname(D), "media")
R = {t["name"]: t for t in json.load(open(f"{D}/results.json", encoding="utf-8"))["tests"]}
BLACK = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"; BOLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
f = lambda p, s: ImageFont.truetype(p, s)
BG, INK, SUB, GOLD, GREEN, RED = (13, 17, 23), (240, 243, 246), (154, 167, 184), (242, 193, 78), (126, 231, 135), (255, 123, 114)
qr = lambda n, s: Image.open(f"{D}/out/{n}").convert("RGB").resize((s, s), Image.NEAREST)


def card(im, q, x, y, s, pad=16):
    ImageDraw.Draw(im).rounded_rectangle([x - pad, y - pad, x + s + pad, y + s + pad], 18, fill="white")
    im.paste(q, (x, y))


# 1) 썸네일 1280×720
im = Image.new("RGB", (1280, 720), BG); d = ImageDraw.Draw(im)
card(im, qr("cafe_color.png", 520), 70, 100, 520)
d.text((680, 150), "이 그림이", font=f(BLACK, 86), fill=INK)
d.text((680, 255), "QR코드?", font=f(BLACK, 120), fill=GOLD)
d.text((684, 420), "내 그림으로 QR 만들기", font=f(BOLD, 50), fill=INK)
d.rounded_rectangle([684, 510, 1210, 600], 45, outline=GREEN, width=5)
d.text((947, 555), f"명령 한 줄 · {R['cafe_color.png']['sec']:.2f}초", font=f(BLACK, 44), fill=GREEN, anchor="mm")
im.save(f"{M}/thumbnail.jpg", quality=92)

# 2) 결과 모음 (2줄 × 4칸)
items = [("plain.png", "보통 QR (사진 없음)"), ("cafe_bw.png", "그림 + 흑백"), ("cafe_color.png", "그림 + 컬러 (-c)"), ("sunset_color.png", "노을 그림"),
         ("wifi.png", "와이파이 QR (가상 정보)"), ("night_color.png", "아주 어두운 그림"), ("night_bright.png", "어두운 그림 + 밝기 올림"), ("wide_color.png", "가로로 긴 그림 → 가운데만")]
S = 340; im = Image.new("RGB", (4 * (S + 60) + 40, 2 * (S + 150) + 120), BG); d = ImageDraw.Draw(im)
d.text((im.width // 2, 55), "amzqr 시연 결과 (2026-11-03 클라우드 자동 실행)", font=f(BLACK, 40), fill=INK, anchor="mm")
for i, (n, l) in enumerate(items):
    x, y = 70 + (i % 4) * (S + 60), 130 + (i // 4) * (S + 150); t = R[n]
    card(im, qr(n, S), x, y, S)
    d.text((x + S // 2, y + S + 45), l, font=f(BOLD, 26), fill=INK, anchor="mm")
    d.text((x + S // 2, y + S + 85), f"{t['sec']:.2f}초 · zxing {'읽힘' if t['zx_full'] else '못 읽음'} · OpenCV {'읽힘' if t['cv_full'] else '못 읽음'}", font=f(BOLD, 22),
           fill=GREEN if t["cv_full"] else SUB, anchor="mm")
im.save(f"{M}/gallery.png", optimize=True)

# 3) 버티기 시험: 작게 줄이고 흐리게 한 6가지 중 몇 번 읽혔나
rows = [("plain.png", "보통 QR"), ("cafe_v1.png", "그림 · -v 1 (글 'hi')"), ("sunset_color.png", "노을"), ("night_bright.png", "밤 + 밝기"), ("wide_color.png", "가로 그림"),
        ("cafe_L.png", "카페 · -l L"), ("cafe_color.png", "카페 컬러"), ("wifi.png", "와이파이"), ("night_color.png", "밤 그대로"), ("cafe_bw.png", "카페 흑백"), ("cafe_v10.png", "카페 · -v 10")]
im = Image.new("RGB", (1200, 120 + len(rows) * 70 + 70), BG); d = ImageDraw.Draw(im)
d.text((600, 50), "작게(200·150·120px) × 살짝 흐리게 → 6가지 중 몇 번 읽혔나 (zxing)", font=f(BLACK, 30), fill=INK, anchor="mm")
for i, (n, l) in enumerate(rows):
    y = 110 + i * 70; s = R[n]["stress"]; c = GREEN if s == 6 else GOLD if s >= 3 else RED
    im.paste(qr(n, 50), (40, y)); d.text((110, y + 25), l, font=f(BOLD, 26), fill=INK, anchor="lm")
    d.rounded_rectangle([420, y + 6, 1060, y + 44], 10, fill=(22, 27, 34)); d.rounded_rectangle([420, y + 6, 420 + 640 * s / 6, y + 44], 10, fill=c)
    d.text((1080, y + 25), f"{s}/6", font=f(BLACK, 30), fill=c, anchor="lm")
d.text((600, im.height - 40), "컴퓨터 판독 프로그램 기준 · 휴대폰 카메라로 찍어 본 결과가 아님", font=f(BOLD, 22), fill=SUB, anchor="mm")
im.save(f"{M}/stress.png", optimize=True)
print("saved thumbnail.jpg, gallery.png, stress.png")
