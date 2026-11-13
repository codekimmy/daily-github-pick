"""썸네일 2장: media/thumbnail.jpg(1280×720), media/thumbnail-shorts.jpg(1080×1920). 사용: python3 thumb.py"""
import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); media = os.path.join(here, "..", "..", "media")
with sync_playwright() as p:
    b = p.chromium.launch()
    for kind, w, h, name in (("long", 1280, 720, "thumbnail.jpg"), ("shorts", 1080, 1920, "thumbnail-shorts.jpg")):
        pg = b.new_page(viewport={"width": w, "height": h}); pg.goto(f"file://{here}/thumb.html?kind={kind}")
        pg.wait_for_function("READY === true"); pg.screenshot(path=os.path.join(media, name), type="jpeg", quality=92)
    b.close()
print("ok")
