"""썸네일·전/후 그림 만들기 (anim/images.html 을 화면 캡처)"""
import os
from playwright.sync_api import sync_playwright
H = os.path.dirname(os.path.abspath(__file__)); O = f"{H}/../media"
with sync_playwright() as p:
    b = p.chromium.launch()
    for k, w, h, out in [("thumb", 1280, 720, "thumbnail.jpg"), ("ba", 1800, 900, "before-after.png")]:
        pg = b.new_page(viewport={"width": w, "height": h}); pg.goto(f"file://{H}/anim/images.html?k={k}"); pg.wait_for_function("READY === true")
        pg.screenshot(path=f"{O}/{out}", type="jpeg" if out.endswith("jpg") else "png", **({"quality": 92} if out.endswith("jpg") else {})); print("saved", out)
    b.close()
