"""썸네일 2장 + 블로그 그림 4장 (와이파이 QR·글 길이·가림 시험·색과 여백) → ../../media/"""
import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b = p.chromium.launch()
    for s, (w, h), name in (("thumb", (1280, 720), "thumbnail.jpg"), ("thumbv", (1080, 1920), "thumbnail-shorts.jpg"), ("wifi", (1600, 900), "wifi-qr.png"), ("len", (1600, 900), "length.png"), ("cover", (1600, 900), "cover-test.png"), ("color", (1600, 900), "color-border.png")):
        pg = b.new_page(viewport={"width": w, "height": h}); pg.on("pageerror", lambda e: print("ERR", e)); pg.goto(f"file://{here}/thumb.html?s={s}")
        pg.wait_for_function("READY === true", timeout=60000)
        pg.screenshot(path=f"{here}/../../media/{name}", **({"type": "jpeg", "quality": 92} if name.endswith(".jpg") else {})); print("saved", name)
    b.close()
