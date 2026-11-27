"""Stegano 시연 측정 (2026-11-28 실행, 클라우드 리눅스 · 파이썬 3.13). 결과 → demo/results.json
그림·쪽지는 모두 코드로 만든 가상 자료(demo/mksample.py → demo/sample/). 작업 폴더 /tmp/stegano-bench
사용: python3 demo/mksample.py && python3 demo/bench.py   (PyPI 에서 stegano 3.0.0 을 새 가상환경에 설치)"""
import json, os, re, shutil, subprocess, time, hashlib, glob, sys, math
from PIL import Image, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__)); SM = os.path.join(HERE, "sample"); IMG = os.path.join(HERE, "render", "img")
W = "/tmp/stegano-bench"; R = {}
if os.path.isdir(W): shutil.rmtree(W)
os.makedirs(W); os.makedirs(IMG, exist_ok=True)
MSG = "엄마 생신 깜짝 파티: 12월 5일 저녁 7시, 거실 불 끄고 대기"


def sh(cmd, cwd=W):
    t = time.time(); p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, shell=isinstance(cmd, str))
    return round(time.time() - t, 3), p.returncode, p.stdout, p.stderr


def best(cmd, n=3):
    r = [sh(cmd) for _ in range(n)]; return min(x[0] for x in r), r[-1]


md5 = lambda f: hashlib.md5(open(f, "rb").read()).hexdigest()
kb = lambda f: round(os.path.getsize(f) / 1e3, 1)


def diff(a, b):   # 원본과 비교: 바뀐 화소 비율, 한 색에서 가장 크게 바뀐 값(0~255), 화질 지표 PSNR(dB)
    A = Image.open(a).convert("RGB"); B = Image.open(b).convert("RGB"); d = ImageChops.difference(A, B)
    px = list(d.getdata()); n = len(px)
    ch = sum(1 for p in px if any(p)); mx = max(max(p) for p in px)
    mse = sum(c * c for p in px for c in p) / (n * 3)
    rows = [i // A.width for i, p in enumerate(px) if any(p)]
    return {"changed_pct": round(100 * ch / n, 2), "changed_px": ch, "max_step": mx,
            "psnr_db": round(10 * math.log10(255 ** 2 / mse), 1) if mse else None, "rows": [min(rows), max(rows)] if rows else None}


def last(e):
    L = [l.strip() for l in (e or "").strip().splitlines() if l.strip()]
    if not L: return ""
    i = max([j for j, l in enumerate(L) if re.match(r"[\w.]*(Error|Exception)\b", l) or "error:" in l] or [len(L) - 1])
    return " / ".join(L[i:])[:300]


# ① 설치: 새 가상환경 + pip install (Windows 도 파이썬이 있으면 같은 명령)
s0, *_ = sh([sys.executable, "-m", "venv", "venv"])
s, rc, o, e = sh([W + "/venv/bin/pip", "install", "-q", "stegano==3.0.0"])
pk = sh([W + "/venv/bin/pip", "list", "--format=json"])[2]
SP = glob.glob(W + "/venv/lib/python3*/site-packages")[0]
du = lambda p: sum(os.path.getsize(os.path.join(a, f)) for a, _, fs in os.walk(p) for f in fs)
pkgs = {x["name"]: x["version"] for x in json.loads(pk)}
R["install"] = {"venv_sec": s0, "pip_sec": s, "rc": rc, "packages": pkgs, "n_with": len([k for k in pkgs if k.lower() not in ("pip", "stegano")]),
                "site_mb": round(du(SP) / 1e6, 1), "self_kb": round(du(SP + "/stegano") / 1e3, 1),
                "opencv_mb": round(sum(du(p) for p in glob.glob(SP + "/cv2*") + glob.glob(SP + "/opencv*")) / 1e6, 1), "python": sys.version.split()[0]}
B = W + "/venv/bin/"; LSB = B + "stegano-lsb"; PY = B + "python"
for f in os.listdir(SM): shutil.copy(os.path.join(SM, f), W)
shutil.copy(W + "/가을산책.png", IMG + "/orig.png")

# ② 숨기기 · 꺼내기 (한글 그대로, 기본 UTF-8)
t, (_, rc, o, e) = best([LSB, "hide", "-i", "가을산책.png", "-m", MSG, "-o", "비밀.png"])
R["hide"] = {"sec": t, "rc": rc, "msg": MSG, "chars": len(MSG), "bytes": len(MSG.encode()), "src_kb": kb(W + "/가을산책.png"), "out_kb": kb(W + "/비밀.png"),
             "w": 1280, "h": 720, **diff(W + "/가을산책.png", W + "/비밀.png")}
shutil.copy(W + "/비밀.png", IMG + "/secret.png")
t, (_, rc, o, e) = best([LSB, "reveal", "-i", "비밀.png"])
R["reveal"] = {"sec": t, "rc": rc, "out": o.strip(), "same": o.strip() == MSG}
# 숨긴 게 없는 그림을 꺼내 보면?
s, rc, o, e = sh([LSB, "reveal", "-i", "가을산책.png"]); R["reveal_plain"] = {"rc": rc, "out": o.strip()[:80], "err": last(e)}
# 원본과 결과의 '바뀐 곳 지도'(차이를 255배 키움) · 맨 위 줄 확대
A = Image.open(W + "/가을산책.png").convert("RGB"); Bm = Image.open(W + "/비밀.png").convert("RGB")
ImageChops.difference(A, Bm).point(lambda v: 255 if v else 0).save(IMG + "/diffmap.png")
A.crop((0, 0, 32, 6)).resize((640, 120), Image.NEAREST).save(IMG + "/zoom-orig.png")
Bm.crop((0, 0, 32, 6)).resize((640, 120), Image.NEAREST).save(IMG + "/zoom-secret.png")
R["pixel0"] = {"orig": list(A.getpixel((0, 0))), "secret": list(Bm.getpixel((0, 0))), "orig1": list(A.getpixel((1, 0))), "secret1": list(Bm.getpixel((1, 0)))}

# ③ 얼마나 들어가나: 화소 하나에 3비트(빨강·초록·파랑 끝자리) → 1280×720 = 345,600바이트
cap = 1280 * 720 * 3 // 8
R["capacity"] = {"bytes_theory": cap, "hangul_chars_theory": cap // 3}
for n in (10000, 100000, 115000):
    m = "가" * n
    t, rc, o, e = sh([PY, "-c", f"from stegano import lsb; lsb.hide('가을산책.png', '가'*{n}).save('긴{n}.png')"])
    ok = rc == 0 and sh([PY, "-c", f"from stegano import lsb; print(lsb.reveal('긴{n}.png') == '가'*{n})"])[2].strip() == "True"
    R["capacity"][str(n)] = {"rc": rc, "sec": t, "ok": ok, "err": last(e)}
# 명령어로 너무 긴 글: 쪽지 파일 대신 큰 파일 -f
big = W + "/큰파일.bin"; open(big, "wb").write(os.urandom(400000))
s, rc, o, e = sh([LSB, "hide", "-i", "가을산책.png", "-f", "큰파일.bin", "-o", "넘침.png"]); R["capacity"]["too_big_file"] = {"rc": rc, "err": last(e), "kb": 400}

# ④ 파일 통째로 숨기기 (-f) → 꺼내기 (-o)
t, (_, rc, o, e) = best([LSB, "hide", "-i", "가을산책.png", "-f", "쪽지.txt", "-o", "쪽지그림.png"])
t2, (_, rc2, o2, e2) = best([LSB, "reveal", "-i", "쪽지그림.png", "-o", "꺼낸쪽지.txt"])
R["file"] = {"hide_sec": t, "reveal_sec": t2, "rc": [rc, rc2], "bytes": os.path.getsize(W + "/쪽지.txt"),
             "same": os.path.exists(W + "/꺼낸쪽지.txt") and md5(W + "/쪽지.txt") == md5(W + "/꺼낸쪽지.txt"), "text": open(W + "/쪽지.txt", encoding="utf-8").read()}

s, rc, o, e = sh([LSB, "reveal", "-i", "쪽지그림.png"]); R["file"]["no_o"] = {"rc": rc, "out": o.strip()[:48]}   # -o 없이 꺼내면 base64 글자
# Windows 에서 stegano-lsb 명령이 안 잡힐 때 쓰는 방식 (.bat 도 이 방식): py -c "from stegano.console.lsb import main; main()" …
PC = [PY, "-c", "from stegano.console.lsb import main; main()"]
s, rc, o, e = sh(PC + ["hide", "-i", "가을산책.png", "-m", MSG, "-o", "pyc.png"]); s2, rc2, o2, e2 = sh(PC + ["reveal", "-i", "pyc.png"])
R["pyc"] = {"rc": [rc, rc2], "ok": o2.strip() == MSG}

# ⑤ 그림을 옮기거나 바꾸면 남아 있나 (같은 글을 숨긴 비밀.png 기준)
def survive(name, fn):
    fn(); s, rc, o, e = sh([LSB, "reveal", "-i", name]); return {"ok": rc == 0 and o.strip() == MSG, "rc": rc, "out": o.strip()[:40], "err": last(e)[:160]}
im = Image.open(W + "/비밀.png")
R["survive"] = {
    "copy": survive("복사.png", lambda: shutil.copy(W + "/비밀.png", W + "/복사.png")),
    "png_resave": survive("다시저장.png", lambda: im.save(W + "/다시저장.png")),
    "webp_lossless": survive("무손실.webp", lambda: im.save(W + "/무손실.webp", lossless=True)),
    "jpg95": survive("압축95.jpg", lambda: im.convert("RGB").save(W + "/압축95.jpg", quality=95)),
    "jpg100": survive("압축100.jpg", lambda: im.convert("RGB").save(W + "/압축100.jpg", quality=100)),
    "resize99": survive("줄임.png", lambda: im.resize((1267, 713)).save(W + "/줄임.png")),
    "crop_bottom": survive("아래자름.png", lambda: im.crop((0, 0, 1280, 600)).save(W + "/아래자름.png")),
    "crop_top": survive("위자름.png", lambda: im.crop((0, 10, 1280, 720)).save(W + "/위자름.png")),
}
# 결과 이름을 .jpg 로 주면? (명령이 JPG 로 저장 → 끝자리가 지워짐)
s, rc, o, e = sh([LSB, "hide", "-i", "가을산책.png", "-m", MSG, "-o", "비밀.jpg"])
s2, rc2, o2, e2 = sh([LSB, "reveal", "-i", "비밀.jpg"]) if rc == 0 else (0, None, "", "")
R["out_jpg"] = {"hide_rc": rc, "hide_err": last(e), "made": os.path.exists(W + "/비밀.jpg"), "reveal_rc": rc2, "reveal_ok": o2.strip() == MSG, "reveal_err": last(e2)[:160]}
# JPG 그림에 숨기고 PNG 로 저장 → 됨?
t, (_, rc, o, e) = best([LSB, "hide", "-i", "가을산책.jpg", "-m", MSG, "-o", "jpg에서.png"])
s, rc2, o2, e2 = sh([LSB, "reveal", "-i", "jpg에서.png"])
R["in_jpg"] = {"rc": rc, "sec": t, "err": last(e), "reveal_ok": o2.strip() == MSG, "src_kb": kb(W + "/가을산책.jpg"), "out_kb": kb(W + "/jpg에서.png") if rc == 0 else None}

# ⑥ 숨기는 순서 바꾸기(-g 소수 차례): 같은 순서를 모르면 못 꺼냄
t, (_, rc, o, e) = best([LSB, "hide", "-i", "가을산책.png", "-m", MSG, "-g", "eratosthenes", "-o", "소수.png"])
s, rc1, o1, e1 = sh([LSB, "reveal", "-i", "소수.png"])
s, rc2, o2, e2 = sh([LSB, "reveal", "-i", "소수.png", "-g", "eratosthenes"])
R["gen"] = {"hide_sec": t, "rc": rc, "plain_ok": rc1 == 0 and o1.strip() == MSG, "plain_err": last(e1)[:160], "plain_out": o1.strip()[:40],
            "with_ok": o2.strip() == MSG, **{k: v for k, v in diff(W + "/가을산책.png", W + "/소수.png").items() if k in ("changed_px", "rows")}}
ImageChops.difference(A, Image.open(W + "/소수.png").convert("RGB")).point(lambda v: 255 if v else 0).save(IMG + "/diffmap-gen.png")

# ⑦ 들키나: 끝자리만 모아 보는 검사 그림(stegano-steganalysis-parity)
for src, dst in (("가을산책.png", "parity-orig.png"), ("비밀.png", "parity-secret.png"), ("긴100000.png", "parity-long.png")):
    s, rc, o, e = sh([B + "stegano-steganalysis-parity", "-i", src, "-o", dst]); shutil.copy(W + "/" + dst, IMG + "/" + dst)
R["parity"] = {"rc": rc}
shutil.copy(W + "/긴100000.png", IMG + "/long100k.png")
R["long100k"] = {k: v for k, v in diff(W + "/가을산책.png", W + "/긴100000.png").items()}

# ⑧ 크게 · 많이: 4000×3000 그림에 쪽지 · 그림 20장
Image.open(W + "/가을산책.png").resize((4000, 3000)).save(W + "/큰그림.png")
t, (_, rc, o, e) = best([LSB, "hide", "-i", "큰그림.png", "-m", MSG, "-o", "큰비밀.png"], n=2)
t2, (_, rc2, o2, e2) = best([LSB, "reveal", "-i", "큰비밀.png"], n=2)
R["big"] = {"hide_sec": t, "reveal_sec": t2, "rc": [rc, rc2], "ok": o2.strip() == MSG, "mp": 12, "src_mb": round(os.path.getsize(W + "/큰그림.png") / 1e6, 1), "out_mb": round(os.path.getsize(W + "/큰비밀.png") / 1e6, 1)}
os.makedirs(W + "/many"); os.makedirs(W + "/out")
for i in range(20): shutil.copy(W + "/가을산책.png", f"{W}/many/그림{i + 1:02d}.png")
t = time.time()
for f in sorted(os.listdir(W + "/many")): subprocess.run([LSB, "hide", "-i", f"{W}/many/{f}", "-m", f"{f} 의 쪽지", "-o", f"{W}/out/{f}"], check=True, capture_output=True)
R["batch20"] = {"sec": round(time.time() - t, 2), "files": len(os.listdir(W + "/out"))}
code = f"from stegano import lsb; lsb.hide('가을산책.png', '{MSG}').save('코드결과.png'); print(lsb.reveal('코드결과.png'))"
t, rc, o, e = sh([PY, "-c", code]); R["lib"] = {"sec": t, "rc": rc, "ok": o.strip() == MSG}
# 다른 방식: 빨강 색만 쓰는 stegano-red
t, rc, o, e = sh([B + "stegano-red", "hide", "-i", "가을산책.png", "-m", "red test", "-o", "빨강.png"])
s, rc2, o2, e2 = sh([B + "stegano-red", "reveal", "-i", "빨강.png"]); R["red"] = {"rc": rc, "err": last(e), "out": o2.strip()[:40]}

# ⑨ 자주 나는 오류 (실제 문구)
R["errors"] = {}
for k, cmd in (("missing", [LSB, "hide", "-i", "없는그림.png", "-m", "a", "-o", "x.png"]),
               ("no_output", [LSB, "hide", "-i", "가을산책.png", "-m", "a"]),
               ("exists", [LSB, "hide", "-i", "가을산책.png", "-m", "새 글", "-o", "비밀.png"])):
    s, rc, o, e = sh(cmd); R["errors"][k] = {"rc": rc, "err": last(e), "out": o.strip()[-160:]}
R["errors"]["exists"]["overwritten"] = sh([LSB, "reveal", "-i", "비밀.png"])[2].strip() == "새 글"
shutil.copy(W + "/가을산책.png", W + "/가을 산책.png")
s, rc, o, e = sh(f"{LSB} hide -i 가을 산책.png -m 안녕 -o y.png"); R["errors"]["space"] = {"rc": rc, "err": last(e)}
s, rc, o, e = sh(f'{LSB} hide -i "가을 산책.png" -m "안녕 하세요" -o y.png'); R["errors"]["space_quoted"] = {"rc": rc}
s, rc, o, e = sh(f"{LSB} hide -i 가을산책.png -m 띄어 쓴 글 -o z.png"); R["errors"]["msg_space"] = {"rc": rc, "err": last(e)}

json.dump(R, open(os.path.join(HERE, "results.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1))
