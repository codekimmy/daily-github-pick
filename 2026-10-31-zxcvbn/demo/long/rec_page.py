"""password-check.html 에 비밀번호를 한 글자씩 넣는 장면을 프레임(PNG)으로 찍는다 (실제 페이지, 인터넷 차단 상태).
사용: python3 rec_page.py <clips 폴더>  → clips/<장면이름>/00001.png ...  (30fps, 1920x1080)"""
import os, shutil, sys
from playwright.sync_api import sync_playwright

FPS = 30
# 장면: [(비밀번호, 내 정보, 머무는 초)] — 한 글자씩 0.13초 간격으로 입력
SCENES = {
    "common": [("123456", "", 2.2), ("password1", "", 2.6), ("qwer1234!", "", 2.6), ("iloveyou", "", 2.6)],
    "swap":   [("password", "", 2.4), ("P@ssw0rd", "", 3.2), ("P@ssw0rd!2026", "", 3.4)],
    "name":   [("minsu1995", "", 4.0), ("minsu1995", "minsu", 5.0)],
    "words":  [("tiger", "", 2.0), ("tiger-gimbap", "", 2.6), ("tiger-gimbap-umbrella", "", 4.0)],
    "korean": [("dkssudgktpdy", "", 5.0)],
}
out = sys.argv[1]
page = "file://" + os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "password-check.html"))
with sync_playwright() as p:
    b = p.chromium.launch(); c = b.new_context(viewport={"width": 1280, "height": 720}, device_scale_factor=1.5)
    c.route("**/*", lambda r: r.abort() if not r.request.url.startswith("file:") else r.continue_())
    pg = c.new_page(); pg.goto(page)
    pg.add_style_tag(content="body{zoom:.82}.wrap{padding-top:18px}#pw{-webkit-text-security:none}.meter i{transition:none!important}")
    pg.evaluate("document.getElementById('pw').type='text'; document.getElementById('eye').textContent='숨기기'")
    for name, steps in SCENES.items():
        d = f"{out}/{name}"; shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
        n, prev = 0, None
        def put(pw, me, hold):
            global n, prev
            key = (pw, me)
            if key != prev:
                pg.evaluate("([a,b])=>{const p=document.getElementById('pw'),m=document.getElementById('me');m.value=b;p.value=a;p.dispatchEvent(new Event('input'))}", [pw, me])
                pg.screenshot(path=f"{d}/_cur.png"); prev = key
            for _ in range(max(1, round(hold * FPS))):
                n += 1; shutil.copy(f"{d}/_cur.png", f"{d}/{n:05d}.png")
        cur_me = ""
        put("", "", 0.6)
        for pw, me, hold in steps:
            if me != cur_me:  # 내 정보 칸 입력
                for k in range(1, len(me) + 1): put(pw, me[:k], 0.13)
                cur_me = me
            elif not pw.startswith(prev[0] if prev else ""):
                put("", me, 0.3)
            start = len(prev[0]) if prev and pw.startswith(prev[0]) else 0
            for k in range(start + 1, len(pw) + 1): put(pw[:k], me, 0.13)
            put(pw, me, hold)
        os.remove(f"{d}/_cur.png"); print(name, n, "frames", f"{n / FPS:.1f}s", flush=True)
    b.close()
