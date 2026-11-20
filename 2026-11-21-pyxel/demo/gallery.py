"""Pyxel 제작자의 예제 6개를 각각 4초 실행해 화면 저장 → work/gallery/*.png"""
import glob, os, subprocess, zipfile, shutil
HERE = os.path.dirname(os.path.abspath(__file__)); W = f"{HERE}/work"; G = f"{W}/gallery"; os.makedirs(G, exist_ok=True)
E = f"{W}/ex/pyxel_examples"; ENV = dict(os.environ, DISPLAY=":9", SDL_AUDIODRIVER="dummy")
jobs = []
for a in []:  # 함께 들어 있는 다른 제작자 게임(apps/)은 화면을 쓰지 않음(제목 그림·캐릭터)
    d = f"{W}/apps/{os.path.basename(a)[:-7]}"; shutil.rmtree(d, ignore_errors=True); zipfile.ZipFile(a).extractall(d)
    st = glob.glob(f"{d}/*/.pyxapp_startup_script")[0]; top = os.path.dirname(st)
    jobs.append((os.path.basename(a)[:-7], os.path.join(top, open(st).read().strip())))
for n in ("02_jump_game", "03_draw_api", "09_shooter", "10_platformer", "12_perlin_noise", "16_transform"): jobs.append((n, f"{E}/{n}.py"))
for name, py in jobs:
    if os.path.exists(f"{G}/{name}.png"): continue
    out = f"{W}/g_{name}"; shutil.rmtree(out, ignore_errors=True)
    r = subprocess.run(["python3", f"{HERE}/harness.py", py, out, "150", "--every", "150", "--scale", "1"], env=ENV, capture_output=True, text=True, timeout=60)
    pngs = sorted(glob.glob(f"{out}/f*.png"))
    if pngs: shutil.copy(pngs[-1], f"{G}/{name}.png")
    print(name, "ok" if pngs else "FAIL " + r.stderr[-300:])
