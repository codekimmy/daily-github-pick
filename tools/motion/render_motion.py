"""모션 스타일 page.html 을 프레임 단위로 찍어 mp4 로 만든다 (tools/motion, 2026-11-24).
기존 demo/render/render.py 와 같은 쓰임 + 여러 프로세스로 나눠 찍기(--jobs) + 30fps 기본.

사용 (날짜 폴더의 demo/render 안에서):
  python3 ../../../tools/motion/render_motion.py long  ../../media/segno-long.mp4                 롱폼 1920×1080 (무음 소리 트랙)
  python3 ../../../tools/motion/render_motion.py anim  ../../media/segno-anim-v.mp4 1080 1920     숏폼·과정 애니메이션 세로
  python3 ../../../tools/motion/render_motion.py anim  ../../media/segno-anim-h.mp4 1920 1080     가로
  python3 ../../../tools/motion/render_motion.py long  check --only 3,9.5,160,last                 그 초의 화면만 JPG 로 (확인용)
옵션: --jobs N (기본: CPU 수) · --fps 30 · --page page.html · --from 초 --to 초 (그 구간만 찍기: 장 하나 다시 만들기·시험용)
"""
import os, subprocess, sys, time, shutil, pathlib
from concurrent.futures import ProcessPoolExecutor
from playwright.sync_api import sync_playwright

A = sys.argv
mode, out = A[1], A[2]
opt = lambda k, d=None: A[A.index(k) + 1] if k in A else d
only = opt("--only")
FPS = int(opt("--fps", 30))
JOBS = int(opt("--jobs", os.cpu_count() or 2))
PAGE = pathlib.Path(opt("--page", "page.html")).resolve()
nums = [a for a in A[3:] if a.isdigit() and A[A.index(a) - 1] not in ("--fps", "--jobs", "--from", "--to", "--only", "--page")]
W, H = (int(nums[0]), int(nums[1])) if len(nums) >= 2 else (1920, 1080)
URL = f"{PAGE.as_uri()}?mode={mode}&w={W}&h={H}&fps={FPS}"


def browser(p):
    try:
        return p.chromium.launch()
    except Exception:  # 내려받은 크롬이 없으면 설치된 크롬을 씀
        for exe in ("/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"):
            if os.path.exists(exe):
                return p.chromium.launch(executable_path=exe)
        raise


def open_page(p):
    b = browser(p); pg = b.new_page(viewport={"width": W, "height": H})
    pg.on("pageerror", lambda e: print("페이지 오류:", e, flush=True))
    pg.on("console", lambda m: m.type == "error" and print("콘솔 오류:", m.text, flush=True))
    pg.goto(URL); pg.wait_for_function("window.READY === true", timeout=60000)
    return b, pg


def part(args):
    i, f0, f1, path = args
    tmp = path + ".part.mp4"
    with sync_playwright() as p:
        b, pg = open_page(p)
        ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                               "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), tmp], stdin=subprocess.PIPE)
        for f in range(f0, f1):
            pg.evaluate(f"frame({f})"); ff.stdin.write(pg.screenshot(type="jpeg", quality=92))
            if (f - f0) % 600 == 0: print(f"  조각 {i}: {f - f0}/{f1 - f0}", flush=True)
        ff.stdin.close(); rc = ff.wait(); b.close()
    if rc != 0: raise SystemExit(f"조각 {i} ffmpeg 실패")
    os.replace(tmp, path)  # 다 찍힌 조각만 이름을 바꿈 (중간에 멈춘 파일이 섞이지 않게)
    return path


if __name__ == "__main__":
    t0 = time.time()
    with sync_playwright() as p:
        b, pg = open_page(p); total = pg.evaluate("TOTAL")
        print(f"{mode} {W}×{H} {FPS}fps · {total}프레임 = {total / FPS:.1f}초", flush=True)
        if only:
            os.makedirs(out, exist_ok=True)
            for s in only.split(","):
                f = total - 1 if s == "last" else min(total - 1, round(float(s) * FPS))
                pg.evaluate(f"frame({f})"); pg.screenshot(path=f"{out}/{mode}_{W}x{H}_{s}.jpg", type="jpeg", quality=90)
            b.close(); print("저장:", out); sys.exit(0)
        b.close()
    F0 = round(float(opt("--from", 0)) * FPS); F1 = min(total, round(float(opt("--to", total / FPS)) * FPS)); span = F1 - F0
    work = pathlib.Path(out).with_suffix(".parts"); shutil.rmtree(work, ignore_errors=True); work.mkdir(parents=True)
    n = max(1, min(JOBS, span // 60)); step = -(-span // n)
    jobs = [(i, F0 + i * step, min(F1, F0 + (i + 1) * step), str(work / f"{i:02d}.mp4")) for i in range(n)]
    with ProcessPoolExecutor(n) as ex: parts = list(ex.map(part, jobs))
    lst = work / "list.txt"; lst.write_text("".join(f"file '{pathlib.Path(x).resolve()}'\n" for x in parts))
    joined = str(work / "joined.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", joined], check=True)
    tmp = out + ".tmp.mp4"
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", joined]
    if mode == "long": cmd += ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-c:a", "aac", "-b:a", "96k", "-shortest"]
    subprocess.run(cmd + ["-c:v", "copy", "-movflags", "+faststart", tmp], check=True)
    os.replace(tmp, out); shutil.rmtree(work, ignore_errors=True)
    print(f"저장: {out} ({time.time() - t0:.0f}초)")
