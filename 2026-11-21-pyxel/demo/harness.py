"""녹화용 감싸개: 게임 파일을 고치지 않고 pyxel.run을 감싸서
정해진 프레임마다 화면 PNG를 저장하고(--every), 끝 프레임에서 Pyxel 내장 녹화(screencast) GIF를 저장한 뒤 종료한다.
사용: python3 harness.py 게임.py 출력폴더 끝프레임 [--every N] [--scale S]"""
import os, runpy, sys, time, json, resource
import pyxel

game, out, end = sys.argv[1], sys.argv[2], int(sys.argv[3])
every = int(sys.argv[sys.argv.index("--every") + 1]) if "--every" in sys.argv else 0
scale = int(sys.argv[sys.argv.index("--scale") + 1]) if "--scale" in sys.argv else 1
os.makedirs(out, exist_ok=True)
_run = pyxel.run
t0 = [None]


def run(update, draw):
    def up():
        if t0[0] is None: t0[0] = time.time()
        update()
        f = pyxel.frame_count
        if f >= end:
            el = time.time() - t0[0]
            pyxel.screencast(os.path.join(out, "screencast.gif"), scale)
            ru = resource.getrusage(resource.RUSAGE_SELF)
            json.dump({"frames": f, "sec": round(el, 3), "fps": round(f / el, 2),
                       "cpu_sec": round(ru.ru_utime + ru.ru_stime, 2), "max_rss_mb": round(ru.ru_maxrss / 1024, 1),
                       "state": {k: v for k, v in getattr(getattr(update, "__self__", None), "__dict__", {}).items() if isinstance(v, (int, float))}},
                      open(os.path.join(out, "stats.json"), "w"), ensure_ascii=False)
            pyxel.quit()

    def dr():
        draw()
        if every and pyxel.frame_count % every == 0:
            pyxel.screenshot(os.path.join(out, f"f{pyxel.frame_count:05d}.png"), scale)
    _run(up, dr)


pyxel.run = run
sys.argv = [game]
os.chdir(os.path.dirname(os.path.abspath(game)) or "."); sys.path.insert(0, os.getcwd())
runpy.run_path(os.path.basename(game), run_name="__main__")
