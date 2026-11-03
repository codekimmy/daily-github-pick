"""썸네일(media/thumbnail.jpg)과 정리 전/후 비교 그림(media/before-after.png). 파일 이름·숫자는 실제 시연 결과(results.json, out/trees.json)"""
import json, os
from PIL import Image, ImageDraw, ImageFont
D = os.path.dirname(os.path.abspath(__file__)); M = os.path.join(os.path.dirname(D), "media")
R = json.load(open(f"{D}/results.json", encoding="utf-8")); T = json.load(open(f"{D}/out/trees.json", encoding="utf-8"))
BLACK = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"; BOLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
f = lambda p, s: ImageFont.truetype(p, s)
BG, INK, SUB, GOLD, GREEN, RED, BLUE, PURPLE = (13, 17, 23), (240, 243, 246), (154, 167, 184), (242, 193, 78), (126, 231, 135), (255, 123, 114), (88, 166, 255), (210, 168, 255)
FC = {"영수증": RED, "사진": GREEN, "문서": BLUE, "영상음악": PURPLE, "정리대상": GOLD, "중복": (255, 166, 87), "빈파일": SUB}
EC = {"jpg": GREEN, "png": GREEN, "pdf": RED, "docx": BLUE, "xlsx": BLUE, "pptx": BLUE, "txt": BLUE, "mp4": PURPLE, "mp3": PURPLE, "m4a": PURPLE, "exe": GOLD, "zip": GOLD}

def chip(d, n, x, y, w, h, fs):
    c = EC.get(n.rsplit(".", 1)[-1], SUB); d.rounded_rectangle([x, y, x + w, y + h], 8, fill=(22, 27, 34), outline=(48, 54, 61), width=2)
    d.rectangle([x, y, x + 7, y + h], fill=c); d.text((x + 18, y + h // 2), n if len(n) < 24 else n[:22] + "…", font=f(BOLD, fs), fill=INK, anchor="lm")

# 1) 썸네일 1280×720: 왼쪽 뒤죽박죽 칩, 오른쪽 문구
im = Image.new("RGB", (1280, 720), BG); d = ImageDraw.Draw(im)
import random; random.seed(3)
for i, n in enumerate(T["before"][:16]):
    x, y = 40 + (i % 2) * 270 + random.randint(-12, 12), 60 + (i // 2) * 76 + random.randint(-8, 8); chip(d, n, x, y, 250, 52, 20)
d.text((640, 120), "다운로드 폴더", font=f(BLACK, 72), fill=INK)
d.text((640, 220), f"{R['run']['median']:.2f}초", font=f(BLACK, 150), fill=GOLD)
d.text((644, 410), "규칙대로 자동 정리", font=f(BOLD, 52), fill=INK)
for i, n in enumerate(["영수증", "사진", "문서", "중복"]):
    x = 644 + i * 148; d.rounded_rectangle([x, 520, x + 134, 600], 14, outline=FC[n], width=4); d.text((x + 67, 560), n, font=f(BLACK, 30), fill=FC[n], anchor="mm")
im.save(f"{M}/thumbnail.jpg", quality=92)

# 2) 정리 전/후
groups = {}
for p in T["after"]:
    s = p.split("/"); groups.setdefault(s[0] if len(s) > 1 else "(그대로)", []).append("/".join(s[1:]) or p)
im = Image.new("RGB", (1600, 1000), BG); d = ImageDraw.Draw(im)
d.text((800, 50), f"organize 시연: 정리 전 {len(T['before'])}개 → 정리 후 (클라우드 자동 실행 결과)", font=f(BLACK, 34), fill=INK, anchor="mm")
d.text((300, 110), "정리 전 (다운로드 폴더)", font=f(BLACK, 28), fill=SUB, anchor="mm")
for i, n in enumerate(T["before"]): chip(d, n, 40 + (i % 2) * 270, 145 + (i // 2) * 58, 255, 48, 17)
d.text((620, 520), "→", font=f(BLACK, 90), fill=BLUE, anchor="mm")
cols = [[("영수증"), ("사진")], [("문서"), ("영상음악"), ("빈파일")], [("정리대상"), ("중복"), ("(그대로)")]]
for ci, col in enumerate(cols):
    y = 120; x = 700 + ci * 300
    for g in col:
        c = FC.get(g, SUB); d.text((x, y), (g + "/" if g != "(그대로)" else "그대로 남음") + f" ({len(groups[g])})", font=f(BLACK, 26), fill=c); y += 44
        for s in groups[g]: d.text((x + 10, y), s if len(s) < 26 else s[:24] + "…", font=f(BOLD, 19), fill=INK); y += 30
        y += 24
d.text((800, 960), f"이동 {R['run']['moved']}개 · {R['run']['median']:.2f}초 · 시연용 가상 파일 · 정보 제공용(운영자 직접 검증 아님)", font=f(BOLD, 24), fill=SUB, anchor="mm")
im.save(f"{M}/before-after.png", optimize=True)
print("saved")
