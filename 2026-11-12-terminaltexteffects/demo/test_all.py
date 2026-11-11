"""terminaltexteffects(TTE) 시연 측정 → results.json
- 37가지 효과마다: 같은 인사 문구(한글 2줄 · 영어 2줄)로 프레임 수 → 초당 60장 기준 재생 시간
- 실제 명령(tte)을 가상 터미널(80칸×24줄, pyte)에 그대로 출력해서 마지막 화면이 원래 글과 같은지 확인
  (기본 캔버스 = 글 크기 / --canvas-width 0 = 터미널 가로 전체)
- 글 길이에 따라 재생 시간이 어떻게 바뀌는지 (2줄 ↔ 10줄)
- 실제 시간: 기본 설정(초당 60장)으로 효과 3개를 실행해 걸린 시간
문구는 모두 시연용으로 직접 쓴 글(texts/)"""
import fcntl, importlib, json, os, pkgutil, pty, random, re, struct, subprocess, termios, time
from pathlib import Path
import pyte, terminaltexteffects, terminaltexteffects.effects as EF

H = Path(__file__).parent; TX = H / "texts"
KO, EN, POEM = (TX / "인사.txt").read_text(), (TX / "greeting_en.txt").read_text(), (TX / "하루.txt").read_text()
COLS, ROWS = 80, 24
EFFECTS = {}
for m in sorted(x.name for x in pkgutil.iter_modules(EF.__path__)):
    cmd, E, C = importlib.import_module(f"terminaltexteffects.effects.{m}").get_effect_resources(); EFFECTS[cmd] = E


def frames(name, text, seed=1):
    random.seed(seed); e = EFFECTS[name](text)
    tc = e.terminal_config; tc.frame_rate = 0; tc.ignore_terminal_dimensions = True; tc.canvas_width = -1; tc.canvas_height = -1
    t = time.time(); n = sum(1 for _ in e); return n, time.time() - t


def run_tty(args, text, cols=COLS, rows=ROWS, timeout=120):
    """진짜 터미널처럼 창 크기를 정한 가상 단말에서 tte 실행 → 출력 전부"""
    pid, fd = pty.fork()
    if pid == 0:
        os.execvp("bash", ["bash", "-c", f"tte {args}"])
    fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", rows, cols, 0, 0))
    out, t0 = b"", time.time()
    os.write(fd, b"")
    while True:
        try:
            b = os.read(fd, 65536)
        except OSError:
            break
        if not b: break
        out += b
        if time.time() - t0 > timeout: os.kill(pid, 9); break
    os.waitpid(pid, 0); return out.decode("utf-8", "replace"), time.time() - t0


def final_screen(raw, cols=COLS, rows=ROWS):
    sc = pyte.Screen(cols, rows); st = pyte.Stream(sc); st.feed(raw.replace("\n", "\r\n") if "\r" not in raw else raw)
    out = []
    for y in range(rows):
        row, line, skip = sc.buffer[y], "", False
        for x in range(cols):
            ch = row[x].data
            if ch == "": continue          # 넓은 글자(한글) 뒤 빈칸
            line += ch
        out.append(line.rstrip())
    return out


def correct(name, text, extra=""):
    f = H / "work" / "in.txt"; f.parent.mkdir(exist_ok=True); f.write_text(text)
    raw, sec = run_tty(f"--frame-rate 0 {extra} -i {f} {name}", text)
    disp = [l for l in final_screen(raw) if l.strip()]
    want = [l for l in text.splitlines() if l.strip()]
    ok = [l.strip() for l in disp] == [l.strip() for l in want]   # 남은 글자 조각(잔상) 없이 원래 글만 남았는가
    return ok, disp[-6:]


R = {"version": terminaltexteffects.__version__ if hasattr(terminaltexteffects, "__version__") else subprocess.getoutput("tte --version").split()[-1],
     "effects": {}, "n_effects": len(EFFECTS)}
for name in EFFECTS:
    nk, ck = frames(name, KO); ne, ce = frames(name, EN)
    okk, dk = correct(name, KO); oke, de = correct(name, EN); okw, dw = correct(name, KO, "--canvas-width 0")
    R["effects"][name] = {"frames_ko": nk, "sec_ko": round(nk / 60, 1), "calc_ko": round(ck, 2), "frames_en": ne, "sec_en": round(ne / 60, 1),
                          "final_ok_ko": okk, "final_ok_en": oke, "final_ok_ko_fullwidth": okw, "screen_ko_fullwidth": dw}
    print(f"{name:15s} 한글 {nk/60:5.1f}초 영어 {ne/60:5.1f}초  마지막화면 한글:{okk} 영어:{oke} 가로전체 한글:{okw}", flush=True)
E_ = R["effects"]
R["summary"] = {"ok_ko": sum(v["final_ok_ko"] for v in E_.values()), "ok_en": sum(v["final_ok_en"] for v in E_.values()),
                "ok_ko_fullwidth": sum(v["final_ok_ko_fullwidth"] for v in E_.values()),
                "shortest": min(E_, key=lambda k: E_[k]["sec_ko"]), "longest": max(E_, key=lambda k: E_[k]["sec_ko"]),
                "median_sec_ko": sorted(v["sec_ko"] for v in E_.values())[len(E_) // 2]}
# 글 길이 2줄 ↔ 10줄
R["length"] = {n: {"2줄": round(frames(n, KO)[0] / 60, 1), "10줄": round(frames(n, POEM)[0] / 60, 1)} for n in ["print", "decrypt", "fireworks", "burn", "slide"]}
# 실제 시간 (초당 60장 기본)
f = H / "work" / "in.txt"; f.write_text(KO); R["realtime"] = {}
for n in ["decrypt", "burn", "fireworks"]:
    _, sec = run_tty(f"-i {f} {n}", KO); R["realtime"][n] = round(sec, 1); print("실제", n, round(sec, 1))
# 같은 효과를 다시 실행하면 모양이 달라지는가 (무작위)
R["random_diff"] = {n: len({frames(n, KO, s)[0] for s in range(5)}) for n in ["fireworks", "decrypt", "rain", "print"]}
# matrix·thunderstorm은 시계(초) 기준으로 끝나는 효과라 프레임 수가 의미 없음 → test_timebased.py 가 실제 시간으로 고쳐 씀
(H / "results.json").write_text(json.dumps(R, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps({k: R[k] for k in ["summary", "length", "realtime", "random_diff"]}, ensure_ascii=False))
