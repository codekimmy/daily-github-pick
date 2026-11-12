"""블로그·README용 그림 → ../media/ (효과길이.png, 한글화면비교.png, 효과모음.png, thumbnail.jpg, 숏폼용 세로 thumbnail-shorts.jpg)"""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
H = Path(__file__).parent; M = H.parent / "media"
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1600, "height": 2000}); pg.on("pageerror", lambda e: print("ERR", e))
    pg.goto(f"file://{H}/make_images.html"); pg.wait_for_function("READY === true")
    for k, name in [("bars", "효과길이.png"), ("korean", "한글화면비교.png"), ("gallery", "효과모음.png"), ("thumb", "thumbnail.png"), ("thumbShorts", "thumbnail-shorts.png")]:
        pg.evaluate(f"IMGS.{k}()"); pg.locator("#c").screenshot(path=str(M / name)); print(name)
    b.close()
for n in ["thumbnail", "thumbnail-shorts"]: os.system(f"ffmpeg -loglevel error -y -i {M}/{n}.png -q:v 2 {M}/{n}.jpg && rm {M}/{n}.png")
