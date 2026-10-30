"""썸네일 1280x720 (media/thumbnail.jpg). 사용: python3 thumbnail.py"""
import os
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
html = """<html><body style="margin:0;width:1280px;height:720px;background:#0d1117;font-family:'Noto Sans CJK KR';color:#f0f3f6;overflow:hidden">
<div style="position:absolute;left:70px;top:60px;font-size:92px;font-weight:900;line-height:1.15">내 비번<br><span style="color:#f2c14e">몇 초면 뚫릴까?</span></div>
<div style="position:absolute;left:70px;top:340px;width:540px;height:300px;border:5px solid #ff5c5c;border-radius:30px;background:#1a1012">
 <div style="font:600 46px 'DejaVu Sans Mono';text-align:center;margin-top:50px">P@ssw0rd</div>
 <div style="font-size:76px;font-weight:900;color:#ff5c5c;text-align:center;margin-top:30px">1초도 안</div></div>
<div style="position:absolute;left:670px;top:340px;width:540px;height:300px;border:5px solid #3fb950;border-radius:30px;background:#0f1a12">
 <div style="font:600 34px 'DejaVu Sans Mono';text-align:center;margin-top:58px">tiger-gimbap-umbrella</div>
 <div style="font-size:76px;font-weight:900;color:#3fb950;text-align:center;margin-top:32px">100년+</div></div>
<div style="position:absolute;right:70px;top:90px;font:700 44px 'DejaVu Sans Mono';color:#9aa7b8">zxcvbn</div>
<div style="position:absolute;right:70px;top:160px;font-size:36px;font-weight:800;color:#7ee787">무료 · 설치 없이</div>
</body></html>"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 720}); pg.set_content(html)
    pg.screenshot(path=f"{here}/../media/thumbnail.jpg", type="jpeg", quality=92); b.close()
print("saved")
