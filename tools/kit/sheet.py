"""연출 아카이브 시범 영상(tools/kit/kit-demo.mp4·gif, 세로 18초)을 만든다. 사용: python3 tools/kit/sheet.py"""
import os, subprocess
from playwright.sync_api import sync_playwright
here = os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1080, "height": 1920}); pg.goto(f"file://{here}/sheet.html?kind=demo"); pg.wait_for_function("READY === true")
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "24", "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", os.path.join(here, "kit-demo.mp4")], stdin=subprocess.PIPE)
    for f in range(24 * 18):
        pg.evaluate(f"frame({f / 24})"); ff.stdin.write(pg.screenshot(type="jpeg", quality=92))
    ff.stdin.close(); ff.wait(); b.close()
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(here, "kit-demo.mp4"), "-vf", "fps=10,scale=360:-1:flags=neighbor,split[a][b];[a]palettegen=max_colors=64[p];[b][p]paletteuse=dither=none", os.path.join(here, "kit-demo.gif")], check=True)
print("ok")
