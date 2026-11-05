"""실제 Fava 화면을 브라우저로 자동 조작하며 녹화 → ../media/fava-screen.mp4 (1280×720). 유의사항 문구는 tools/end_disclaimer.py 로 얹음"""
import glob, os, subprocess, tempfile, time, urllib.request
from playwright.sync_api import sync_playwright
H = os.path.dirname(os.path.abspath(__file__)); tmp = tempfile.mkdtemp()
pr = subprocess.Popen(["fava", f"{H}/work/가계부.beancount", "-p", "5091"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
while True:
    try: B = urllib.request.urlopen("http://127.0.0.1:5091/", timeout=1).geturl().rsplit("/", 2)[0]; break
    except Exception: time.sleep(.1)
with sync_playwright() as p:
    b = p.chromium.launch(); c = b.new_context(viewport={"width": 1280, "height": 720}, record_video_dir=tmp, record_video_size={"width": 1280, "height": 720})
    pg = c.new_page(); pg.goto(f"{B}/income_statement/"); pg.wait_for_timeout(3000)
    for label in ["Expenses", "비용 (월별)"]:
        pg.get_by_text(label, exact=True).first.click(); pg.wait_for_timeout(3000)
    for menu in ["재무상태표", "거래기록"]:
        pg.get_by_role("link", name=menu, exact=True).first.click(); pg.wait_for_timeout(3000)
    pg.mouse.move(640, 400); pg.mouse.wheel(0, 900); pg.wait_for_timeout(1500); pg.mouse.wheel(0, -900)
    pg.goto(f"{B}/account/Expenses:Food-식비/"); pg.wait_for_timeout(1500); pg.get_by_text("변동 (월별)", exact=True).first.click(); pg.wait_for_timeout(3000)
    pg.goto(f"{B}/income_statement/"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(3000)
    c.close(); b.close()
pr.terminate()
webm = glob.glob(tmp + "/*.webm")[0]
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", webm, "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p", f"{tmp}/raw.mp4"], check=True)
# 끝에 어두운 엔딩 화면 4초를 붙이고 그 위에 유의사항 문구를 얹음
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{tmp}/raw.mp4", "-f", "lavfi", "-i", "color=c=0x0d1117:s=1280x720:r=25:d=4",
                "-filter_complex", "[0:v]fps=25,setsar=1[a];[1:v]setsar=1[b];[a][b]concat=n=2:v=1[v]", "-map", "[v]", "-c:v", "libx264", "-pix_fmt", "yuv420p", f"{tmp}/cat.mp4"], check=True)
subprocess.run(["python3", f"{H}/../../tools/end_disclaimer.py", f"{tmp}/cat.mp4", f"{H}/../media/fava-screen.mp4", "-4", "320",
                "정보 제공용 · 2026-11-06 클라우드 시연 결과(운영자 직접 검증 아님)", "시연용 가상 가계부 · 장부 파일은 꼭 백업 · 실제 금액은 직접 확인"], check=True)
