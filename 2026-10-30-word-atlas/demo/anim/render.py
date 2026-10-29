"""anim.html 을 프레임 단위로 찍어 MP4 로 만든다.
사용: python3 render.py 1920 1080 out.mp4 [확인할 프레임 번호,...]"""
import base64, os, subprocess, sys
from playwright.sync_api import sync_playwright

w, h, out = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
only = [int(x) for x in sys.argv[4].split(",")] if len(sys.argv) > 4 else None
here = os.path.dirname(os.path.abspath(__file__))
fr = out + "_frames"; os.makedirs(fr, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": w, "height": h})
    pg.on("pageerror", lambda e: print("ERR", e))
    pg.goto(f"file://{here}/anim.html?w={w}&h={h}")
    pg.wait_for_function("READY === true", timeout=60000)
    total = pg.evaluate("TOTAL")
    for f in (only or range(total)):
        pg.evaluate(f"frame({f})")
        pg.screenshot(path=f"{fr}/{f:05d}.jpg", type="jpeg", quality=92)  # 로컬 그림을 쓰면 toDataURL 이 막혀 화면 캡처로 찍음
        if f % 150 == 0: print(f, "/", total, flush=True)
    b.close()
if only is None:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", f"{fr}/%05d.jpg", "-c:v", "libx264",
                    "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", out], check=True)
    print("saved", out)
