"""썸네일 만들기 (anim/images.html 을 화면 캡처)"""
import os
from playwright.sync_api import sync_playwright
H = os.path.dirname(os.path.abspath(__file__)); O = f"{H}/../media"
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 720})
    pg.goto(f"file://{H}/anim/images.html"); pg.wait_for_function("READY === true")
    pg.screenshot(path=f"{O}/thumbnail.jpg", type="jpeg", quality=92); print("saved thumbnail.jpg"); b.close()
