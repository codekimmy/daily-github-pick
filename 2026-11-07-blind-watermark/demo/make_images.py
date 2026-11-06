"""썸네일·전/후 그림 만들기 (사진은 scikit-image 예제 CC0, 숫자는 results.json)"""
import json, os
from PIL import Image, ImageDraw, ImageFont
H = os.path.dirname(os.path.abspath(__file__)); W = f"{H}/work"; O = f"{H}/../media"
R = json.load(open(f"{H}/results.json", encoding="utf-8")); P = R["photos"][0]
FB = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"; FR = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
f = lambda p, s: ImageFont.truetype(p, s)
BG, INK, SUB, GOLD, GREEN = (13, 17, 23), (240, 243, 246), (154, 167, 184), (242, 193, 78), (126, 231, 135)
def fit(im, w, h): k = min(w / im.width, h / im.height); return im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
# 전/후: 원본 · 도장 넣은 사진 · 차이×30
c = Image.new("RGB", (1800, 760), BG); d = ImageDraw.Draw(c)
d.text((900, 50), "원본과 도장 넣은 사진, 구별되십니까?", font=f(FB, 50), fill=INK, anchor="mm")
for i, (n, l, col) in enumerate([("cat", "원본", SUB), ("cat_wm", f"도장 넣은 사진 ({P['embed']}초)", SUB), ("cat_diff_x30", "차이만 30배로 키운 모습", GOLD)]):
    im = fit(Image.open(f"{W}/{n}.png").convert("RGB"), 560, 380); x = 30 + i * 590 + (560 - im.width) // 2; c.paste(im, (x, 120))
    d.text((30 + i * 590 + 280, 540), l, font=f(FR, 32), fill=col, anchor="mm")
d.text((900, 620), f"평균 색 차이 {P['mean_diff']} (0~255 중) · 숨긴 글자: {R['text']} · 꺼내기 {P['extract']}초", font=f(FR, 34), fill=GREEN, anchor="mm")
d.text((900, 700), "2026-11-07 클라우드 시연 결과 · 사진: scikit-image 예제(CC0)", font=f(FR, 24), fill=SUB, anchor="mm")
c.save(f"{O}/before-after.png")
# 썸네일 1280×720
t = Image.new("RGB", (1280, 720), BG); d = ImageDraw.Draw(t)
im = Image.open(f"{W}/cat_wm.png").convert("RGB"); k = 720 / im.height; im = im.resize((int(im.width * k), 720), Image.LANCZOS); x0 = (im.width - 640) // 2 - 60; t.paste(im.crop((x0, 0, x0 + 640, 720)), (0, 0))  # 세로를 꽉 채우고 가운데 자르기
d.rectangle((640, 0, 1280, 720), fill=BG)
d.text((960, 170), "이 사진 속에", font=f(FB, 76), fill=INK, anchor="mm")
d.text((960, 290), "글자가 숨어", font=f(FB, 92), fill=GOLD, anchor="mm")
d.text((960, 400), "있습니다", font=f(FB, 92), fill=GOLD, anchor="mm")
d.text((960, 530), R["text"], font=f(FB, 64), fill=GREEN, anchor="mm")
d.text((960, 640), "blind_watermark · 무료", font=f(FR, 36), fill=SUB, anchor="mm")
t.save(f"{O}/thumbnail.jpg", quality=92); print("ok")
