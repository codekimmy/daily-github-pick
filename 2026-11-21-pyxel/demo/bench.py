"""Pyxel 시연 측정 → results.json (작업 파일은 work/, 커밋하지 않음)
1) 새 가상 환경에 설치(내려받기 포함) 시간·용량  2) 별 줍기 게임 자동 플레이 12초(한글 글꼴 있음/없음)
3) 한글 글자 시험  4) 자동 작곡 8가지 → WAV  5) 게임 묶기(.pyxapp)·웹 페이지(.html) 변환 크기
6) 함께 들어 있는 예제 개수와 예제 게임 7개 화면"""
import glob, json, os, shutil, subprocess, sys, time
HERE = os.path.dirname(os.path.abspath(__file__)); W = os.path.join(HERE, "work"); os.makedirs(W, exist_ok=True)
KFONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
ENV = dict(os.environ, DISPLAY=":9", SDL_AUDIODRIVER="dummy")
R = {"date": "2026-11-21", "env": "클라우드 리눅스 · CPU 2개 · 그래픽카드 없음 · 가상 화면(Xvfb)"}
def sh(c, **k): return subprocess.run(c, shell=True, capture_output=True, text=True, **k)
def du(p): return round(int(sh(f"du -sb {p}").stdout.split()[0]) / 1e6, 1)

# 1) 설치
v = f"{W}/venv"; shutil.rmtree(v, ignore_errors=True); sh(f"python3 -m venv {v}")
t = time.time(); r = sh(f"{v}/bin/pip install --no-cache-dir pyxel"); R["install_sec"] = round(time.time() - t, 1)
R["install_ok"] = r.returncode == 0
R["version"] = sh(f"{v}/bin/python -c 'import pyxel;print(pyxel.VERSION)'").stdout.strip()
sp = glob.glob(f"{v}/lib/python3*/site-packages")[0]
R["installed_mb"] = du(f"{sp}/pyxel"); R["deps"] = sorted(d for d in os.listdir(sp) if not d.startswith(("pyxel", "pip", "_", "setuptools")) and not d.endswith(".dist-info") and d != "__pycache__")
R["python_req"] = ">=3.11 (PyPI)"; R["license"] = "MIT"; R["wheel_mb_win64"] = 9.2

# 2) 별 줍기 자동 플레이
for tag, font in (("star", KFONT), ("star_nofont", "")):
    e = dict(ENV, AUTO_PLAY="1", KFONT=font) if font else dict(ENV, AUTO_PLAY="1")
    shutil.rmtree(f"{W}/{tag}", ignore_errors=True)
    sh(f"python3 {HERE}/harness.py {HERE}/star_catch.py {W}/{tag} 360 --every 2 --scale 4", env=e)
    R[tag] = json.load(open(f"{W}/{tag}/stats.json")); R[tag]["gif_kb"] = round(os.path.getsize(f"{W}/{tag}/screencast.gif") / 1024)
src = open(f"{HERE}/star_catch.py", encoding="utf-8").read().splitlines()
R["star_lines_total"] = len(src); R["star_lines_code"] = sum(1 for l in src if l.strip() and not l.strip().startswith("#"))

# 3) 한글 시험
shutil.rmtree(f"{W}/k", ignore_errors=True); sh(f"python3 {HERE}/harness.py {HERE}/ktest.py {W}/k 10 --every 5 --scale 4", env=dict(ENV, KFONT=KFONT))
R["korean"] = {"builtin": "한글이 빈칸으로 나옴(영어만 보임)", "ttf": "Font(글꼴 파일, 12) 지정 시 한글 보임"}

# 4) 자동 작곡
os.makedirs(f"{W}/bgm", exist_ok=True); sh(f"python3 {HERE}/bgm.py {W}/bgm", env=ENV)
R["bgm"] = json.load(open(f"{W}/bgm/bgm.json"))

# 5) 묶기·웹 변환
pk = f"{W}/pack"; shutil.rmtree(pk, ignore_errors=True); os.makedirs(f"{pk}/star_catch")
shutil.copy(f"{HERE}/star_catch.py", f"{pk}/star_catch/")
t = time.time(); r1 = sh("pyxel package star_catch star_catch/star_catch.py", cwd=pk); t1 = time.time() - t
t = time.time(); r2 = sh("pyxel app2html star_catch.pyxapp", cwd=pk); t2 = time.time() - t
R["package"] = {"pyxapp_kb": round(os.path.getsize(f"{pk}/star_catch.pyxapp") / 1024, 1), "sec": round(t1, 2),
                "html_kb": round(os.path.getsize(f"{pk}/star_catch.html") / 1024, 1), "html_sec": round(t2, 2),
                "html_needs": "kitao.dev 의 pyxel.js(인터넷 연결 필요)" if "kitao.dev" in open(f"{pk}/star_catch.html").read() else "?"}

# 6) 예제
ex = f"{W}/ex"; shutil.rmtree(ex, ignore_errors=True); os.makedirs(ex); sh("pyxel copy_examples", cwd=ex)
E = f"{ex}/pyxel_examples"
R["examples_py"] = len(glob.glob(f"{E}/*.py")); R["examples_cube"] = len(glob.glob(f"{E}/cube/*.py")); R["examples_apps"] = sorted(os.path.basename(a) for a in glob.glob(f"{E}/apps/*.pyxapp"))
json.dump(R, open(f"{HERE}/results.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1)[:3000])
