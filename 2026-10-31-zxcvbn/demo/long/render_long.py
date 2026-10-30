"""long.html 을 프레임으로 찍기. 사용: python3 render_long.py <프레임폴더> [시작 끝] [또는 --only 1,2,3]
두 범위로 나눠 동시에 돌리면 빨라진다."""
import os, sys
from playwright.sync_api import sync_playwright

out = sys.argv[1]; os.makedirs(out, exist_ok=True)
here = os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.on("pageerror", lambda e: print("ERR", e))
    clips = os.environ.get("CLIPS", "clips")  # 영상 조각 프레임 폴더 (prep_clips.py 결과)
    pg.goto(f"file://{here}/long.html?clips=file://{os.path.abspath(clips)}"); pg.wait_for_function("READY === true", timeout=60000)
    total = pg.evaluate("TOTAL")
    if len(sys.argv) > 2 and sys.argv[2] == "--only":
        frames = [int(x) for x in sys.argv[3].split(",")]
    elif len(sys.argv) > 3:
        frames = range(int(sys.argv[2]), min(int(sys.argv[3]), total))
    else:
        frames = range(total)
    print("total", total, flush=True)
    for f in frames:
        pg.evaluate(f"frame({f})")
        pg.screenshot(path=f"{out}/{f:05d}.png")  # 무손실로 찍어야 색번짐·깜빡임이 안 생김
        if f % 600 == 0: print(f, "/", total, flush=True)
    b.close()
