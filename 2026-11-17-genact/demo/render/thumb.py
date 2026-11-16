"""썸네일 2장: ../../media/thumbnail.jpg (1280×720), ../../media/thumbnail-shorts.jpg (1080×1920)"""
import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b = p.chromium.launch()
    for v, (w, h), name in ((0, (1280, 720), "thumbnail.jpg"), (1, (1080, 1920), "thumbnail-shorts.jpg")):
        pg = b.new_page(viewport={"width": w, "height": h}); pg.goto(f"file://{here}/thumb.html?v={v}")
        pg.wait_for_function("READY === true", timeout=60000); pg.screenshot(path=f"{here}/../../media/{name}", type="jpeg", quality=92); print("saved", name)
    b.close()
