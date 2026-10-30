"""password-check.html 을 인터넷을 막은 브라우저로 열어 비밀번호를 넣고 캡처. 사용: python3 shot_page.py <출력폴더>"""
import os, sys
from playwright.sync_api import sync_playwright
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
page = "file://" + os.path.abspath(os.path.join(os.path.dirname(__file__), "password-check.html"))
reqs = []
with sync_playwright() as p:
    b = p.chromium.launch(); c = b.new_context(viewport={"width": 900, "height": 1000}, device_scale_factor=1)
    c.route("**/*", lambda r: (reqs.append(r.request.url), r.abort()) if not r.request.url.startswith("file:") else r.continue_())
    pg = c.new_page(); pg.on("pageerror", lambda e: print("ERR", e)); pg.goto(page)
    for name, pw, me in [("weak", "password1", ""), ("mid", "Summer2026!", ""), ("name", "minsu1995", "minsu"), ("strong", "blue-tiger-gimbap-umbrella-77", "")]:
        pg.fill("#me", me); pg.fill("#pw", pw); pg.click("#eye") if pg.get_attribute("#pw", "type") == "password" else None
        pg.wait_for_timeout(300); pg.screenshot(path=f"{out}/page-{name}.png", full_page=True)
        print(name, pg.inner_text("#t"), "|", pg.inner_text("#g"), "|", pg.inner_text("#fb").replace("\n", " / "))
    b.close()
print("외부 요청:", reqs or "없음")
