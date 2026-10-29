"""결과 HTML 페이지를 헤드리스 브라우저로 열어 MP4로 녹화.
사용: python3 tools/record_page.py <html경로> <출력.mp4> [대기초]
CDN 스크립트는 샌드박스에서 막히므로 npm으로 받은 파일을 인라인하는 건 호출 전에 처리."""
import sys, glob, os, subprocess, tempfile
from playwright.sync_api import sync_playwright
html, out = sys.argv[1], sys.argv[2]; wait = int(sys.argv[3]) if len(sys.argv) > 3 else 12
tmp = tempfile.mkdtemp()
with sync_playwright() as p:
    b = p.chromium.launch()
    c = b.new_context(viewport={"width": 1280, "height": 720}, record_video_dir=tmp, record_video_size={"width": 1280, "height": 720})
    pg = c.new_page(); pg.goto("file://" + os.path.abspath(html)); pg.wait_for_timeout(wait * 1000)
    pg.mouse.move(400, 360); pg.mouse.wheel(0, -500); pg.wait_for_timeout(3000)
    c.close(); b.close()
webm = glob.glob(tmp + "/*.webm")[0]
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", webm, "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p", out], check=True)
print("saved", out)
