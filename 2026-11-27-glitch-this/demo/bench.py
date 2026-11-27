"""glitch-this 시연 측정 (2026-11-27 실행, 클라우드 리눅스 · CPU 4개 · 파이썬 3.13). 결과 → demo/results.json
그림은 모두 코드로 그린 가상 그림(demo/mksample.py → demo/sample/). 작업 폴더 /tmp/glitch-bench
사용: python3 demo/mksample.py && python3 demo/bench.py   (PyPI 에서 glitch-this 1.0.3 을 새 가상환경에 설치)"""
import json, os, re, shutil, subprocess, time, hashlib, glob, sys
from PIL import Image, ImageChops, ImageStat

HERE = os.path.dirname(os.path.abspath(__file__)); SM = os.path.join(HERE, "sample"); IMG = os.path.join(HERE, "render", "img")
W = "/tmp/glitch-bench"; R = {}
if os.path.isdir(W): shutil.rmtree(W)
os.makedirs(W); os.makedirs(IMG, exist_ok=True)


def sh(cmd, cwd=W, env=None):
    t = time.time(); p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, shell=isinstance(cmd, str), env=env)
    return round(time.time() - t, 3), p.returncode, p.stdout, p.stderr


def best(cmd, n=3):
    r = [sh(cmd) for _ in range(n)]; return min(x[0] for x in r), r[-1]


md5 = lambda f: hashlib.md5(open(f, "rb").read()).hexdigest()
def changed(a, b):   # 원본과 비교해 달라진 화소 비율(%)
    A = Image.open(a).convert("RGB"); B = Image.open(b).convert("RGB")
    bb = ImageChops.difference(A, B).convert("L").point(lambda v: 255 if v > 8 else 0)
    return round(100 * sum(1 for v in bb.getdata() if v) / (A.width * A.height), 1)


bright = lambda f: round(ImageStat.Stat(Image.open(f).convert("L")).mean[0])   # 평균 밝기 0~255


# ① 설치: 새 가상환경 + pip install (Windows 도 파이썬이 있으면 같은 명령)
s0, *_ = sh([sys.executable, "-m", "venv", "venv"])
s, rc, o, e = sh([W + "/venv/bin/pip", "install", "-q", "glitch-this==1.0.3"])
pk = sh([W + "/venv/bin/pip", "list", "--format=json"])[2]
SP = glob.glob(W + "/venv/lib/python3*/site-packages")[0]
du = lambda p: sum(os.path.getsize(os.path.join(a, f)) for a, _, fs in os.walk(p) for f in fs)
R["install"] = {"venv_sec": s0, "pip_sec": s, "rc": rc, "packages": {x["name"]: x["version"] for x in json.loads(pk)},
                "site_mb": round(du(SP) / 1e6, 1), "self_kb": round(du(SP + "/glitch_this") / 1e3, 1), "python": sys.version.split()[0]}
GT = W + "/venv/bin/glitch_this"; PY = W + "/venv/bin/python"
for f in os.listdir(SM): shutil.copy(os.path.join(SM, f), W)
VI = SP + "/glitch_this/version.info"

# ② 최신 버전 확인(인터넷): 처음 실행 때 PyPI 에 물어보고 14일 동안 기억
if os.path.exists(VI): os.remove(VI)
# 인터넷이 끊긴 상황: urlopen 을 막고 같은 명령 실행 (이 작업 공간은 프록시로만 나가므로 이렇게 흉내 냄)
OFF = "import sys, urllib.request as u\ndef no(*a, **k): raise OSError('offline')\nu.urlopen = no\nsys.argv = ['glitch_this', '겨울바다.png', '3', '-sd', '7', '-o', '오프라인.png']\nfrom glitch_this.commandline import main; main()"
t, rc, o, e = sh([PY, "-c", OFF])
R["offline"] = {"rc": rc, "sec": t, "made": os.path.exists(W + "/오프라인.png"), "cached": os.path.exists(VI), "version_line": "Latest version" in o}
t, rc, o, e = sh([GT, "겨울바다.png", "3", "-sd", "7", "-o", "온라인.png"])
R["online"] = {"rc": rc, "sec": t, "cached": os.path.exists(VI), "out": o.strip().splitlines(), "cache_file": "site-packages/glitch_this/version.info"}

# ③ 한 장 망가뜨리기: 세기 1 · 5 · 10 (같은 씨앗 42)
R["levels"] = {}
for lv in (1, 5, 10):
    t, (_, rc, o, e) = best([GT, "겨울바다.png", str(lv), "-sd", "42", "-f", "-o", f"lv{lv}.png"])
    R["levels"][lv] = {"sec": t, "rc": rc, "kb": round(os.path.getsize(f"{W}/lv{lv}.png") / 1e3, 1), "changed_pct": changed(W + "/겨울바다.png", f"{W}/lv{lv}.png")}
    shutil.copy(f"{W}/lv{lv}.png", f"{IMG}/lv{lv}.png")
shutil.copy(W + "/겨울바다.png", IMG + "/orig.png")
# 기본 이름(-o 없이): glitched_원래이름
t, rc, o, e = sh([GT, "겨울바다.png", "5"]); R["default_name"] = {"rc": rc, "file": [f for f in os.listdir(W) if f.startswith("glitched_")], "msg": o.strip().splitlines()[-1]}
# 색 어긋남(-c) · 줄무늬(-s)
for k, fl in (("color", ["-c"]), ("scan", ["-s"]), ("both", ["-c", "-s"])):
    t, (_, rc, o, e) = best([GT, "겨울바다.png", "5", "-sd", "42", "-f", "-o", f"{k}.png"] + fl)
    R[k] = {"sec": t, "rc": rc, "changed_pct": changed(W + "/겨울바다.png", f"{W}/{k}.png"), "bright": bright(f"{W}/{k}.png"), "bright_orig": bright(W + "/겨울바다.png")}; shutil.copy(f"{W}/{k}.png", f"{IMG}/{k}.png")
# 같은 씨앗 → 같은 결과? 씨앗 없음 → 매번 다름?
sh([GT, "겨울바다.png", "5", "-sd", "42", "-f", "-o", "a.png"]); sh([GT, "겨울바다.png", "5", "-sd", "42", "-f", "-o", "b.png"])
sh([GT, "겨울바다.png", "5", "-f", "-o", "c.png"]); sh([GT, "겨울바다.png", "5", "-f", "-o", "d.png"])
R["seed"] = {"same_seed_identical": md5(W + "/a.png") == md5(W + "/b.png"), "no_seed_identical": md5(W + "/c.png") == md5(W + "/d.png")}

# ④ 움직이는 GIF 만들기: 기본(23장) · 장 수 · 재생 속도
t, (_, rc, o, e) = best([GT, "겨울바다.png", "5", "-g", "-c", "-f", "-o", "움직임.gif"])
g = Image.open(W + "/움직임.gif")
R["gif"] = {"sec": t, "rc": rc, "frames": g.n_frames, "duration_ms": g.info.get("duration"), "help_says": "centiseconds", "kb": round(os.path.getsize(W + "/움직임.gif") / 1e3), "msg": o.strip().splitlines()[-1]}
t, (_, rc, o, e) = best([GT, "겨울바다.png", "5", "-g", "-c", "-fr", "10", "-d", "100", "-f", "-o", "짧은.gif"])
g2 = Image.open(W + "/짧은.gif"); R["gif_short"] = {"sec": t, "frames": g2.n_frames, "duration_ms": g2.info.get("duration"), "kb": round(os.path.getsize(W + "/짧은.gif") / 1e3)}
# 씨앗(-sd)을 주면 모든 장이 같아져 GIF 가 한 장으로 합쳐짐 (Pillow 가 같은 장을 합침)
sh([GT, "겨울바다.png", "5", "-g", "-c", "-sd", "42", "-f", "-o", "씨앗움직임.gif"]); gs = Image.open(W + "/씨앗움직임.gif")
R["gif_seed"] = {"frames": gs.n_frames, "duration_ms": gs.info.get("duration")}
for i in range(g.n_frames):   # 영상·그림용 몇 장
    if i % 3 == 0: g.seek(i); g.convert("RGB").save(f"{IMG}/gif{i // 3}.jpg", quality=82)
# 움짤(GIF) 넣기
t, (_, rc, o, e) = best([GT, "움짤.gif", "4", "-ig", "-sd", "42", "-f", "-o", "움짤결과.gif"])
g3 = Image.open(W + "/움짤결과.gif"); R["gif_in"] = {"sec": t, "rc": rc, "frames": g3.n_frames, "src_frames": Image.open(W + "/움짤.gif").n_frames}

# ⑤ JPG 포스터 · 카메라 정보(EXIF) 남는지
t, (_, rc, o, e) = best([GT, "포스터.jpg", "6", "-c", "-sd", "42", "-f", "-o", "포스터결과.jpg"])
pj = Image.open(W + "/포스터결과.jpg")
R["jpg"] = {"sec": t, "rc": rc, "fmt": pj.format, "src_exif": len(Image.open(W + "/포스터.jpg").getexif()), "out_exif": len(pj.getexif()),
            "src_kb": round(os.path.getsize(W + "/포스터.jpg") / 1e3), "out_kb": round(os.path.getsize(W + "/포스터결과.jpg") / 1e3)}
pj.convert("RGB").save(IMG + "/poster.jpg", quality=85); shutil.copy(W + "/포스터.jpg", IMG + "/poster-orig.jpg")
# -o 확장자는 무시됨 (PNG 를 .jpg 로 저장 요청)
t, rc, o, e = sh([GT, "겨울바다.png", "5", "-f", "-o", "바꿈.jpg"]); R["ext_ignored"] = {"rc": rc, "files": sorted(f for f in os.listdir(W) if f.startswith("바꿈"))}

# ⑥ 크게 · 많이: 4000×3000 큰 그림 · 그림 20장
Image.open(W + "/포스터.jpg").resize((4000, 3000)).save(W + "/큰그림.jpg", quality=90)
t, (_, rc, o, e) = best([GT, "큰그림.jpg", "5", "-c", "-s", "-sd", "1", "-f", "-o", "큰결과.jpg"])
R["big"] = {"sec": t, "rc": rc, "mp": 12}
t, (_, rc, o, e) = best([GT, "큰그림.jpg", "5", "-g", "-fr", "10", "-sd", "1", "-f", "-o", "큰움직임.gif"], n=1)
R["big_gif"] = {"sec": t, "rc": rc, "frames": 10, "mb": round(os.path.getsize(W + "/큰움직임.gif") / 1e6, 1)}
os.makedirs(W + "/many"); os.makedirs(W + "/out")
for i in range(20): shutil.copy(W + "/겨울바다.png", f"{W}/many/그림{i + 1:02d}.png")
t = time.time()
for f in sorted(os.listdir(W + "/many")): subprocess.run([GT, f"{W}/many/{f}", "4", "-c", "-o", f"{W}/out/{f}"], check=True, capture_output=True)
R["batch20"] = {"sec": round(time.time() - t, 2), "files": len(os.listdir(W + "/out"))}
# 파이썬 코드로 (같은 일을 라이브러리로)
code = "from glitch_this import ImageGlitcher as G; G().glitch_image('겨울바다.png', 5, seed=42, color_offset=True).save('코드결과.png')"
t, rc, o, e = sh([PY, "-c", code]); R["lib"] = {"sec": t, "rc": rc, "made": os.path.exists(W + "/코드결과.png")}

# ⑦ 자주 나는 오류 (실제 문구)
R["errors"] = {}
def last(e):   # 마지막 Exception/Error 줄부터 끝까지
    L = [l.strip() for l in e.strip().splitlines() if l.strip()]
    i = max([j for j, l in enumerate(L) if re.match(r"\w*(Error|Exception)\b", l) or l.startswith("glitch_this: error")] or [len(L) - 1])
    return " / ".join(L[i:])
for k, cmd in (("exists", [GT, "겨울바다.png", "5", "-o", "lv5.png"]), ("level", [GT, "겨울바다.png", "11", "-f"]),
               ("missing", [GT, "없는그림.png", "5"]), ("gif_noflag", [GT, "움짤.gif", "4", "-f", "-o", "x.gif"])):
    s, rc, o, e = sh(cmd); R["errors"][k] = {"rc": rc, "err": last(e), "out": o.strip()[-200:]}
shutil.copy(W + "/겨울바다.png", W + "/겨울 바다.png")
s, rc, o, e = sh(f"{GT} 겨울 바다.png 5 -f"); R["errors"]["space"] = {"rc": rc, "err": last(e)}
s, rc, o, e = sh(f'{GT} "겨울 바다.png" 5 -f'); R["errors"]["space_quoted"] = {"rc": rc}

json.dump(R, open(os.path.join(HERE, "results.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1))
