"""czkawka_cli 시연 측정 → results.json, 결과 글은 work/out/*.txt
사용: python3 make_data.py && python3 test_all.py   (czkawka_cli 12.0.2 필요: cargo install czkawka_cli)"""
import json, os, re, shutil, statistics, subprocess, time
from pathlib import Path
import piexif
from PIL import Image
import numpy as np

H = Path(__file__).parent; W = H / "work"; R = W / "정리전"; O = W / "out"
O.mkdir(parents=True, exist_ok=True)
CACHE = Path.home() / ".cache/czkawka"
RES = {"version": subprocess.check_output(["czkawka_cli", "--version"], text=True).split()[1]}


def run(args, keep=None, n=3, cache=False):
    """같은 명령을 n번 돌려 가운데 시간. cache=False면 매번 캐시 지우고(첫 검사와 같은 조건)"""
    ts = []
    for _ in range(n):
        if not cache: shutil.rmtree(CACHE, ignore_errors=True)
        t = time.perf_counter(); p = subprocess.run(["czkawka_cli", *args], capture_output=True, text=True); ts.append(time.perf_counter() - t)
    out = p.stdout.replace(str(R) + "/", "").replace(str(W) + "/", "")
    if keep: (O / keep).write_text(out, encoding="utf-8")
    return round(statistics.median(ts), 2), out


def files(): return sorted(str(f.relative_to(R)) for f in R.rglob("*") if f.is_file())


RES["src"] = {"files": len(files()), "mb": round(sum(f.stat().st_size for f in R.rglob("*") if f.is_file()) / 2**20, 1)}
d = str(R)

# 1) 똑같은 파일
s, o = run(["dup", "-d", d], "01_똑같은파일_기본.txt")
m = re.search(r"Found (\d+) duplicated files which in (\d+) groups which takes ([\d.]+) MiB", o)
RES["dup_default"] = {"sec": s, "files": int(m[1]), "groups": int(m[2]), "mib": float(m[3])}
s, o = run(["dup", "-d", d, "-m", "1"], "02_똑같은파일_작은파일포함.txt")
m = re.search(r"Found (\d+) duplicated files which in (\d+) groups which takes ([\d.]+) MiB", o)
RES["dup_all"] = {"sec": s, "files": int(m[1]), "groups": int(m[2]), "mib": float(m[3]),
                  "groups_list": [[l.strip('"') for l in g.strip().splitlines()[1:] if l.startswith('"')] for g in o.split("---- Size")[1:]]}
s, o = run(["dup", "-d", d, "-s", "NAME"], "03_이름이같은파일.txt")
RES["dup_name"] = {"sec": s, "found": int(re.search(r"Found (\d+)", o)[1]) if "Found" in o else 0}

# 2) 비슷한 사진
s, o = run(["image", "-d", d], "04_비슷한사진_기본.txt")
grp = lambda o: [[re.match(r'"(.+?)" - (\d+x\d+) - .+ - (.+)$', l).groups() for l in g.strip().splitlines()[1:] if l.startswith('"')] for g in o.split("Found ")[1:] if "similar friends" in g.splitlines()[0] and g.splitlines()[0][0].isdigit()]
RES["image_default"] = {"sec": s, "groups": grp(o)}
s, o = run(["image", "-d", d, "-s", "15"], "05_비슷한사진_차이15.txt")
RES["image_s15"] = {"sec": s, "groups": grp(o)}
s, o = run(["image", "-d", d, "-s", "15", "--geometric-invariance", "mirror-flip-rotate90"], "06_비슷한사진_돌림포함.txt")
RES["image_rot"] = {"sec": s, "groups": grp(o)}
s, o = run(["image", "-d", d, "-s", "15", "-m", "1", "--geometric-invariance", "mirror-flip-rotate90"], "07_비슷한사진_작은사진포함.txt")
RES["image_all"] = {"sec": s, "groups": grp(o)}
cats = [f for f in files() if "고양이" in f]
RES["cat_variants"] = cats

# 3) 비슷한 영상 (ffmpeg 필요)
s, o = run(["video", "-d", d], "08_비슷한영상.txt", n=1)
RES["video"] = {"sec": s, "files": re.findall(r'"(.+?)" - ([\d.]+ \w+) - .+ - (\d+x\d+) - (\d\d:\d\d)', o)}

# 4) 빈 폴더 · 빈 파일 · 임시 파일 · 큰 파일 · 확장자 · 깨진 파일 · 이상한 이름 · 사진 속 정보(EXIF)
def lines(o): return [l.strip().strip('"') for l in o.splitlines() if l.startswith('"') or (l and not l.startswith(("Found", "-", "Properly", "Results", "(Before", "Not found")) and "/" not in l[:1])]
for key, args, fn in [("empty_folders", ["empty-folders"], "09_빈폴더.txt"), ("empty_files", ["empty-files"], "10_빈파일.txt"), ("temp", ["temp"], "11_임시파일.txt"),
                      ("ext", ["ext"], "13_확장자가틀린파일.txt"), ("broken", ["broken"], "14_깨진파일.txt"), ("bad_names", ["bad-names", "-w", "-a"], "15_이상한이름.txt"),
                      ("bad_names_korean", ["bad-names", "-n"], "16_이상한이름_한글포함.txt"), ("exif", ["exif-remover"], "17_사진속정보.txt")]:
    s, o = run([*args, "-d", d], fn)
    m = re.search(r"Found (\d+)", o); RES[key] = {"sec": s, "found": int(m[1]) if m else 0, "out": [l for l in o.splitlines() if l.strip() and not l.startswith(("Results", "(Before", "---", "Properly"))][:20]}
s, o = run(["big", "-d", d, "-n", "5"], "12_큰파일5개.txt")
RES["big"] = {"sec": s, "top": re.findall(r'^([\d.]+ \w+) \(\d+\) - "(.+)"', o, re.M)}
RES["broken_missed"] = "사진/깨진사진.jpg" not in (O / "14_깨진파일.txt").read_text()

# 5) 지우기: 미리 보기(-Q) → 휴지통(-y) / 원본 폴더 지키기(-r)
T = W / "_지우기시험"; shutil.rmtree(T, ignore_errors=True); shutil.copytree(R, T)
mb = lambda p: round(sum(f.stat().st_size for f in p.rglob("*") if f.is_file()) / 2**20, 1)
_, o = run(["dup", "-d", str(T), "-m", "1", "-D", "AEN", "-Q"], "18_지우기미리보기_AEN.txt", n=1)
would = [l.split('"')[1].replace(str(T) + "/", "").replace("_지우기시험/", "") for l in o.splitlines() if l.startswith("Would delete")]
RES["delete_aen_preview"] = {"would": would, "orig_photo_deleted": any(w.startswith("사진/") for w in would), "after_mb_same": mb(T)}
ref = ["-r", str(T / "사진"), "-r", str(T / "문서/회사"), "-r", str(T / "동영상")]
_, o = run(["dup", "-d", str(T), *ref, "-m", "1", "-D", "AEN", "-Q"], "19_지우기미리보기_원본폴더지킴.txt", n=1)
would_r = [l.split('"')[1].replace(str(T) + "/", "").replace("_지우기시험/", "") for l in o.splitlines() if l.startswith("Would delete")]
before = mb(T); n0 = len(list(T.rglob("*.*")))
t = time.perf_counter(); subprocess.run(["czkawka_cli", "dup", "-d", str(T), *ref, "-m", "1", "-D", "AEN", "-y"], capture_output=True); t = time.perf_counter() - t
trash = Path.home() / ".local/share/Trash/files"
RES["delete_ref"] = {"would": would_r, "before_mb": before, "after_mb": mb(T), "sec": round(t, 2), "trash": sorted(p.name for p in trash.iterdir()) if trash.exists() else []}
shutil.rmtree(Path.home() / ".local/share/Trash", ignore_errors=True)
# 빈 폴더 지우기
subprocess.run(["czkawka_cli", "empty-folders", "-d", str(T), "-D"], capture_output=True)
RES["empty_folders_deleted"] = not (T / "새 폴더").exists()

# 6) 사진 속 위치 정보 지우기 (-F: 원본은 두고 새 파일, -o를 붙이면 원본을 덮어씀)
subprocess.run(["czkawka_cli", "exif-remover", "-d", str(T / "사진"), "-F"], capture_output=True)
new = sorted(T.rglob("*.czkawka_cleaned_exif.jpg")); ex = []
for f in new:
    org = Path(str(f).replace(".czkawka_cleaned_exif", "")); a, b = piexif.load(str(org)), piexif.load(str(f))
    ex.append({"file": org.name, "gps_before": bool(a["GPS"]), "gps_after": bool(b["GPS"]), "date_after": bool(b["Exif"]),
               "same_pixels": bool((np.array(Image.open(org)) == np.array(Image.open(f))).all())})
RES["exif_fix"] = ex
shutil.rmtree(T)

# 7) 캐시: 같은 폴더를 두 번째 검사할 때
big = W / "_파일5천개"; shutil.rmtree(big, ignore_errors=True); big.mkdir()
import random
rnd = random.Random(5); pics = [p for p in (R / "사진").rglob("*.jpg")]
for i in range(5000):  # 5,000개 중 1,000개는 앞 파일의 복사본
    f = big / f"폴더{i % 50:02d}" / f"파일{i:05d}.dat"; f.parent.mkdir(exist_ok=True)
    if i % 5 == 4: shutil.copy(big / f"폴더{(i - 1) % 50:02d}" / f"파일{i - 1:05d}.dat", f)
    else: f.write_bytes(rnd.randbytes(rnd.randint(20_000, 400_000)))
RES["big5000"] = {"files": 5000, "mb": mb(big)}
s1, o = run(["dup", "-d", str(big)], n=3)
RES["big5000"]["first_sec"] = s1; RES["big5000"]["found"] = re.search(r"Found (\d+) duplicated files which in (\d+) groups which takes ([\d.]+) MiB", o).groups()
s2, _ = run(["dup", "-d", str(big)], n=3, cache=True)   # 캐시가 남은 상태로
RES["big5000"]["cached_sec"] = s2  # 방금 만든 파일이라 이미 메모리에 올라와 있어 캐시 차이가 거의 없음
shutil.rmtree(big)

(H / "results.json").write_text(json.dumps(RES, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps({k: v for k, v in RES.items() if k not in ("dup_all",)}, ensure_ascii=False)[:3000])
