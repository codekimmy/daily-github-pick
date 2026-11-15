"""블로그·README용 결과 그림 4장: media/로고확대비교.png, 서명비교.png, 도트비교.png, 사진비교.png. 사용: python3 still.py"""
import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); names = {'logo': '로고확대비교.png', 'sign': '서명비교.png', 'dot': '도트비교.png', 'photo': '사진비교.png'}
with sync_playwright() as p:
    b = p.chromium.launch()
    for k, n in names.items():
        pg = b.new_page(viewport={'width': 1600, 'height': 1000}); pg.on("pageerror", lambda e: print("ERR", e)); pg.goto(f'file://{here}/still.html?kind={k}')
        pg.wait_for_function('READY === true'); pg.screenshot(path=os.path.join(here, '..', '..', 'media', n))
    b.close()
print("ok")
