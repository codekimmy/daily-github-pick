import sys, os, base64, subprocess
from playwright.sync_api import sync_playwright
w, h, out = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
only = [int(x) for x in sys.argv[4].split(',')] if len(sys.argv) > 4 else None
fr = out + '_frames'; os.makedirs(fr, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=["--enable-unsafe-swiftshader"]); pg = b.new_page(viewport={"width": w, "height": h})
    pg.on("pageerror", lambda e: print("ERR", e))
    pg.goto(f"file://{os.path.abspath('anim.html')}?w={w}&h={h}"); pg.wait_for_timeout(500)
    total = pg.evaluate("TOTAL")
    for f in range(total):
        pg.evaluate(f"frame({f})")
        if only is None or f in only:
            d = pg.evaluate("document.getElementById('c').toDataURL('image/jpeg',0.9)")
            open(f"{fr}/{f:05d}.jpg", "wb").write(base64.b64decode(d.split(',')[1]))
        if f % 150 == 0: print(f, '/', total, flush=True)
    b.close()
if only is None:
    subprocess.run(["ffmpeg","-y","-loglevel","error","-framerate","30","-i",f"{fr}/%05d.jpg","-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p",out], check=True)
    print("saved", out)
