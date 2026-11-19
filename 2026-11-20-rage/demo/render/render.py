"""page.html 을 프레임 단위로 찍어 바로 ffmpeg 로 넘긴다(프레임 파일을 디스크에 쌓지 않음).
사용: python3 render.py long out.mp4                      롱폼 1920×1080 (무음 소리 트랙 포함)
      python3 render.py anim out.mp4 1920 1080            과정 애니메이션 가로 / 1080 1920 세로
      python3 render.py long check_dir --only 10.5,60     지정한 초의 화면만 PNG 로 저장 (확인용)"""
import os, subprocess, sys
from playwright.sync_api import sync_playwright

mode, out = sys.argv[1], sys.argv[2]
only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
nums = [a for a in sys.argv[3:] if a.isdigit()]
w, h = (int(nums[0]), int(nums[1])) if len(nums) >= 2 else (1920, 1080)
FPS = 24
here = os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": w, "height": h})
    pg.on("pageerror", lambda e: print("ERR", e))
    pg.goto(f"file://{here}/page.html?mode={mode}&w={w}&h={h}&fps={FPS}")
    pg.wait_for_function("READY === true", timeout=60000)
    total = pg.evaluate("TOTAL"); print("frames", total, "=", total / FPS, "s", flush=True)
    if only:
        os.makedirs(out, exist_ok=True)
        for s in only.split(","):
            f = min(total - 1, int(round(float(s) * FPS)) if s != "last" else total - 1)
            pg.evaluate(f"frame({f})"); pg.screenshot(path=f"{out}/{mode}_{w}x{h}_{s}.png")
    else:
        cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-"]
        if mode == "long": cmd += ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-c:a", "aac", "-b:a", "96k", "-shortest"]
        cmd += ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-tune", "animation", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out]
        ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        for f in range(total):
            pg.evaluate(f"frame({f})")
            ff.stdin.write(pg.screenshot(type="jpeg", quality=93))
            if f % 720 == 0: print(f, "/", total, flush=True)
        ff.stdin.close(); ff.wait(); print("saved", out)
    b.close()
