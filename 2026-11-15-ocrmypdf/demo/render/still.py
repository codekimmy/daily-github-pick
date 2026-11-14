"""블로그·README용 결과 그림 3장: media/찾기비교.png, 정확도비교.png, 바로세우기비교.png. 사용: python3 still.py"""
import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__)); names = {'compare': '찾기비교.png', 'accuracy': '정확도비교.png', 'rotate': '바로세우기비교.png'}
with sync_playwright() as p:
    b = p.chromium.launch()
    for k, n in names.items():
        pg = b.new_page(viewport={'width': 1600, 'height': 1000}); pg.goto(f'file://{here}/still.html?kind={k}')
        pg.wait_for_function('READY === true'); pg.screenshot(path=os.path.join(here, '..', '..', 'media', n))
    b.close()
print("ok")
