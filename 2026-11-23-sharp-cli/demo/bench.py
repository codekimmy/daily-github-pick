"""sharp-cli 시연 측정 → results.json (작업 파일은 work/, 커밋하지 않음)
① 새 폴더 설치 시간·크기 ② 가상 사진 6장 가로 1600 줄이기(JPG 기본) ③ 형식별(JPG·WebP·AVIF·PNG) 용량·화질(SSIM)
④ WebP 화질 값별 용량·SSIM ⑤ 위치 정보(EXIF GPS) 기본 삭제·-m 유지 ⑥ 60장 한꺼번에 ⑦ 정사각형 썸네일
⑧ HEIC(아이폰 사진 형식) 입력 ⑨ 같은 폴더 덮어쓰기 ⑩ 작은 사진 키우기 방지
사용: python3 demo/bench.py"""
import glob, json, os, shutil, subprocess, time, numpy as np, piexif, pillow_heif
from PIL import Image
from skimage.metrics import structural_similarity as ssim
HERE = os.path.dirname(os.path.abspath(__file__)); W = os.path.join(HERE, "work"); P = os.path.join(HERE, "photos")
R = {}
def run(cmd, cwd=W):
    t = time.time(); r = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True); return round(time.time() - t, 2), r
def mb(p): return round(os.path.getsize(p) / 1e6, 3)
def fresh(d):
    d = os.path.join(W, d); shutil.rmtree(d, ignore_errors=True); os.makedirs(d); return d
def sim(a, b):
    A = np.asarray(Image.open(a).convert("L"), np.float32); B = np.asarray(Image.open(b).convert("L").resize(A.shape[::-1]), np.float32)
    return round(float(ssim(A, B, data_range=255)), 4)
os.makedirs(W, exist_ok=True)
shutil.rmtree(os.path.join(W, "node_modules"), ignore_errors=True)
for f in ("package.json", "package-lock.json"):
    if os.path.exists(os.path.join(W, f)): os.remove(os.path.join(W, f))
run("npm init -y")
t, r = run("npm install sharp-cli@6.1.0"); S = os.path.join(W, "node_modules/.bin/sharp")
R["install"] = {"sec": t, "pkgs": len(os.listdir(os.path.join(W, "node_modules"))) , "mb": round(int(subprocess.check_output(["du", "-sk", os.path.join(W, "node_modules")]).split()[0]) / 1024, 1),
                "version": subprocess.check_output([S, "--version"], text=True).strip(), "sharp": json.load(open(os.path.join(W, "node_modules/sharp/package.json")))["version"]}
print("install", R["install"])
photos = sorted(glob.glob(os.path.join(P, "*.jpg"))); names = [os.path.basename(p)[:-4] for p in photos]
R["photos"] = [{"name": n, "mb": mb(p), "w": 4032, "h": 3024} for n, p in zip(names, photos)]
# ② 기본(JPG 화질 80) 가로 1600
o = fresh("o_jpg"); t, r = run(f'"{S}" -i {P}/*.jpg -o {o} resize 1600'); assert r.returncode == 0, r.stderr
R["resize"] = {"sec": t, "before": round(sum(mb(p) for p in photos), 2), "after": round(sum(mb(os.path.join(o, n + ".jpg")) for n in names), 2),
               "each": [mb(os.path.join(o, n + ".jpg")) for n in names], "size": Image.open(os.path.join(o, names[0] + ".jpg")).size}
print("resize", R["resize"])
# 기준 그림: 원본을 1600으로 PNG(무손실) 줄인 것
ref = fresh("ref"); run(f'"{S}" -i {P}/*.jpg -o {ref} -f png resize 1600')
# ③ 형식별
fm = {}
for f, q in (("jpeg", 80), ("webp", 80), ("avif", 50), ("png", None)):
    o = fresh("o_" + f); ext = {"jpeg": "jpg"}.get(f, f)
    t, r = run(f'"{S}" -i {P}/*.jpg -o {o} -f {f} ' + (f"-q {q} " if q else "") + "resize 1600"); assert r.returncode == 0, r.stderr
    outs = [os.path.join(o, n + "." + ext) for n in names]
    fm[f] = {"q": q, "sec": t, "total": round(sum(mb(x) for x in outs), 2), "each": [mb(x) for x in outs],
             "ssim": round(float(np.mean([sim(os.path.join(ref, n + ".png"), x) for n, x in zip(names, outs)])), 4)}
    print(f, fm[f])
R["formats"] = fm
# ④ WebP 화질 값
qs = {}; one = photos[1]; n1 = names[1]
for q in (95, 90, 80, 60, 40, 20):
    o = fresh(f"q{q}"); t, r = run(f'"{S}" -i "{one}" -o {o} -f webp -q {q} resize 1600'); x = os.path.join(o, n1 + ".webp")
    qs[q] = {"kb": round(os.path.getsize(x) / 1024, 1), "ssim": sim(os.path.join(ref, n1 + ".png"), x), "sec": t}
R["quality"] = {"photo": n1, "rows": qs}; print("quality", qs)
# ⑤ 위치 정보
o = fresh("o_meta"); run(f'"{S}" -i "{photos[0]}" -o {o} -m resize 1600')
def gps(p):
    try: return bool(piexif.load(p)["GPS"])
    except Exception: return False
R["meta"] = {"orig_gps": gps(photos[0]), "default_gps": gps(os.path.join(W, "o_jpg", names[0] + ".jpg")), "keep_gps": gps(os.path.join(o, names[0] + ".jpg")),
             "default_kb": round(os.path.getsize(os.path.join(W, "o_jpg", names[0] + ".jpg")) / 1024, 1)}
print("meta", R["meta"])
# ⑥ 60장
src = fresh("many"); [shutil.copy(p, os.path.join(src, f"{i:02d}_{os.path.basename(p)}")) for i in range(10) for p in photos]
o = fresh("o_many"); t, r = run(f'"{S}" -i "{src}/*.jpg" -o {o} -f webp resize 1600'); outs = glob.glob(o + "/*.webp")
R["many"] = {"n": len(outs), "sec": t, "before": round(sum(mb(p) for p in glob.glob(src + "/*.jpg")), 1), "after": round(sum(mb(p) for p in outs), 1), "err": r.stderr[-300:]}
print("many", R["many"])
# ⑦ 정사각형 썸네일 (가운데 / attention)
for pos in ("centre", "attention"):
    o = fresh("sq_" + pos); t, r = run(f'"{S}" -i "{photos[0]}" -o {o} resize 1080 1080 --position {pos}')
    R.setdefault("square", {})[pos] = {"sec": t, "size": Image.open(os.path.join(o, names[0] + ".jpg")).size}
print("square", R["square"])
# ⑧ HEIC
h = fresh("heic"); pillow_heif.register_heif_opener(); Image.open(photos[0]).save(os.path.join(h, "아이폰사진.heic"), quality=80)
o = fresh("o_heic"); t, r = run(f'"{S}" -i "{h}/아이폰사진.heic" -o {o} -f jpeg resize 1600')
R["heic"] = {"code": r.returncode, "err": (r.stderr or r.stdout).strip()[-400:], "out": os.listdir(o)}; print("heic", R["heic"])
# ⑨ 같은 폴더로 내보내기 (원본 덮어쓰기?)
same = fresh("same"); shutil.copy(photos[0], same); before = mb(os.path.join(same, names[0] + ".jpg"))
t, r = run(f'"{S}" -i "{same}/{names[0]}.jpg" -o {same} resize 1600')
R["same"] = {"code": r.returncode, "err": (r.stderr or r.stdout).strip()[-300:], "before": before, "after": mb(os.path.join(same, names[0] + ".jpg"))}; print("same", R["same"])
# ⑩ 작은 사진(800px) 키우기
sm = fresh("small"); Image.open(photos[0]).resize((800, 600)).save(os.path.join(sm, "작은사진.jpg"), quality=90)
o1 = fresh("o_small1"); run(f'"{S}" -i "{sm}/작은사진.jpg" -o {o1} resize 1600'); o2 = fresh("o_small2"); run(f'"{S}" -i "{sm}/작은사진.jpg" -o {o2} resize 1600 --withoutEnlargement')
R["enlarge"] = {"default": Image.open(os.path.join(o1, "작은사진.jpg")).size, "without": Image.open(os.path.join(o2, "작은사진.jpg")).size}; print("enlarge", R["enlarge"])
# ⑪ 세로로 찍은 휴대폰 사진(EXIF 방향 값 6) — 기본 / --autoOrient / 긴 변 1600 (.bat 설정)
# 세로 내용(산풍경 가운데를 세로로 자름)을 휴대폰처럼 눕혀 저장하고 '보여 줄 때 시계 방향 90도'(값 6) 표시를 붙임
ex = piexif.load(photos[1]); ex["0th"][piexif.ImageIFD.Orientation] = 6
P = Image.open(photos[1]).crop((882, 0, 3150, 3024)).resize((3024, 4032)); P.transpose(Image.ROTATE_90).save(os.path.join(W, "세로사진.jpg"), quality=92, exif=piexif.dump(ex))
o = fresh("o_rot"); run(f'"{S}" -i 세로사진.jpg -o "{o}/기본.jpg" resize 1600'); run(f'"{S}" -i 세로사진.jpg -o "{o}/자동.jpg" --autoOrient resize 1600')
t, r = run(f'"{S}" -i 세로사진.jpg -o "{o}/bat/{{name}}.jpg" -q 80 --autoOrient resize 1600 1600 --fit inside --withoutEnlargement')
R["orient"] = {"default": Image.open(os.path.join(o, "기본.jpg")).size, "auto": Image.open(os.path.join(o, "자동.jpg")).size, "bat": Image.open(os.path.join(o, "bat/세로사진.jpg")).size}; print("orient", R["orient"])
# ⑫ 파일 이름·결과 폴더 (Windows .bat에서 쓰는 형태)
nm = fresh("names"); [shutil.copy(photos[0], os.path.join(nm, n)) for n in ("여행 사진 (2).jpg", "여행 사진 [1].jpg")]
t1, r1 = run(f'"{S}" -i "여행 사진 [1].jpg" -o "작게/{{name}}.jpg" resize 1600', cwd=nm)
t2, r2 = run(f'"{S}" -i "여행 사진 (2).jpg" -o 없는폴더 resize 1600', cwd=nm)
t3, r3 = run(f'"{S}" -i "*.jpg" -o "작게/{{name}}.webp" resize 1600', cwd=nm)
t4, r4 = run(f'"{S}" -i "여행 사진 (2).jpg" -o "작게/{{name}}.webp" -q 150 resize 1600', cwd=nm)
R["names"] = {"bracket": (r1.stderr or r1.stdout).strip().splitlines()[0], "nodir_isfile": os.path.isfile(os.path.join(nm, "없는폴더")),
              "template": sorted(os.listdir(os.path.join(nm, "작게"))), "q150": (r4.stderr or r4.stdout).strip().splitlines()[0]}; print("names", R["names"])
json.dump(R, open(os.path.join(HERE, "results.json"), "w"), ensure_ascii=False, indent=1)
