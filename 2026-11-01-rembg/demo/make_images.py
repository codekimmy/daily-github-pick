"""블로그·README용 이미지: 전후 비교, 모델 비교, 썸네일 (media/)
사용: python3 make_images.py   (test_all.py 를 먼저 실행해 out/ 이 있어야 함)"""
import base64, os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent; M = HERE.parent / "media"; M.mkdir(exist_ok=True)
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
f = lambda s: ImageFont.truetype(FONT, s, index=1)


def checker(w, h, s=14):
    im = Image.new("RGB", (w, h), (244, 244, 244)); d = ImageDraw.Draw(im)
    for y in range(0, h, s):
        for x in range(0, w, s):
            if (x // s + y // s) % 2: d.rectangle([x, y, x + s - 1, y + s - 1], fill=(208, 208, 208))
    return im


def tile(p, w, h, cut=True):
    im = Image.open(p).convert("RGBA"); im.thumbnail((w, h))
    bg = checker(*im.size) if cut else Image.new("RGB", im.size); bg.paste(im, (0, 0), im); return bg


# 1) 전후 비교 (u2net)
rows = [("coffee", "coffee.png", "커피잔"), ("cat", "cat.png", "고양이"), ("rocket", "rocket.jpg", "로켓")]
W, TH, PAD = 1200, 380, 24
S = Image.new("RGB", (W, 70 + len(rows) * (TH + PAD)), (13, 17, 23)); d = ImageDraw.Draw(S)
d.text((PAD, 18), "원본", font=f(30), fill=(154, 167, 184)); d.text((W // 2 + PAD, 18), "rembg -m u2net 결과 (바둑판 = 투명)", font=f(30), fill=(126, 231, 135))
for i, (k, fn, lab) in enumerate(rows):
    y = 70 + i * (TH + PAD)
    S.paste(tile(HERE / "input" / fn, W // 2 - 2 * PAD, TH, False), (PAD, y))
    S.paste(tile(HERE / "out" / f"{k}-u2net.png", W // 2 - 2 * PAD, TH), (W // 2 + PAD, y))
S.save(M / "before-after.png")

# 2) 로켓 모델 4종 비교
MODELS = [("u2netp", "가벼운 (5MB)"), ("silueta", "중간 (44MB)"), ("u2net", "기본 추천 (176MB)"), ("isnet-general-use", "꼼꼼한 (179MB)")]
import json
R = json.load(open(HERE / "results.json", encoding="utf-8"))
TW, TH2 = 380, 254
S = Image.new("RGB", (4 * TW + 5 * 16, TH2 + 110), (13, 17, 23)); d = ImageDraw.Draw(S)
for i, (m, lab) in enumerate(MODELS):
    x = 16 + i * (TW + 16); S.paste(tile(HERE / "out" / f"rocket-{m}.png", TW, TH2), (x, 16))
    r = R["models"][m]["photos"]["rocket"]
    d.text((x, TH2 + 26), lab, font=f(26), fill=(240, 243, 246))
    d.text((x, TH2 + 64), f"{r['sec']:.1f}초 · 남긴 부분 {r['kept_pct']}%", font=f(22), fill=(242, 193, 78) if m.startswith("isnet") else (154, 167, 184))
S.save(M / "models-rocket.png")

# 3) 고양이 수염 확대 (원본 / 기본 / -a)
box = (290, 185, 450, 290); Z = 3
parts = [(HERE / "input/cat.png", False, "원본"), (HERE / "out/cat-u2net.png", True, "기본"), (HERE / "out/cat-u2net-matting.png", True, "-a 테두리 다듬기")]
cw, chh = (box[2] - box[0]) * Z, (box[3] - box[1]) * Z
S = Image.new("RGB", (3 * cw + 4 * 16, chh + 70), (13, 17, 23)); d = ImageDraw.Draw(S)
for i, (p, cut, lab) in enumerate(parts):
    im = Image.open(p).convert("RGBA").crop(box).resize((cw, chh), Image.LANCZOS)
    bg = checker(cw, chh, 20) if cut else Image.new("RGB", (cw, chh)); bg.paste(im, (0, 0), im)
    S.paste(bg, (16 + i * (cw + 16), 16)); d.text((16 + i * (cw + 16), chh + 26), lab, font=f(26), fill=(240, 243, 246))
S.save(M / "cat-whisker-zoom.png")

# 4) 썸네일 1280x720
b64 = lambda p: "data:image/png;base64," + base64.b64encode(open(p, "rb").read()).decode()
html = f"""<html><body style="margin:0;width:1280px;height:720px;background:#0d1117;font-family:'Noto Sans CJK KR';color:#f0f3f6;overflow:hidden">
<div style="position:absolute;left:60px;top:50px;font-size:96px;font-weight:900;line-height:1.12">사진 배경<br><span style="color:#f2c14e">1초 만에 삭제</span></div>
<img src="{b64(HERE / 'input/coffee.png')}" style="position:absolute;left:60px;top:330px;width:520px;height:347px;border-radius:24px;object-fit:cover">
<div style="position:absolute;left:600px;top:470px;font-size:80px;font-weight:900;color:#9aa7b8">→</div>
<div style="position:absolute;left:700px;top:330px;width:520px;height:347px;border-radius:24px;border:5px solid #7ee787;overflow:hidden;
 background:repeating-conic-gradient(#d0d0d0 0 25%,#f4f4f4 0 50%) 0 0/36px 36px"><img src="{b64(HERE / 'out/coffee-u2net.png')}" style="width:100%;height:100%;object-fit:cover"></div>
<div style="position:absolute;right:60px;top:70px;font:700 52px 'DejaVu Sans Mono';color:#9aa7b8">rembg</div>
<div style="position:absolute;right:60px;top:150px;font-size:40px;font-weight:800;color:#7ee787">무료 · 명령 한 줄</div>
</body></html>"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 720}); pg.set_content(html); pg.wait_for_timeout(300)
    pg.screenshot(path=str(M / "thumbnail.jpg"), type="jpeg", quality=92); b.close()
print("saved", sorted(os.listdir(M)))
