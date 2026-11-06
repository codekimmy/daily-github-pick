"""시연 측정 전체 → results.json. 사진은 prep_photos.py 가 만든 저작권 없는 예제 사진만 사용."""
import json, os, statistics, subprocess, time, warnings
import cv2, numpy as np
from blind_watermark import WaterMark
from blind_watermark.recover import estimate_crop_parameters, recover_crop
warnings.filterwarnings("ignore")
H = os.path.dirname(os.path.abspath(__file__)); W = f"{H}/work"; A = f"{W}/attacks"; os.makedirs(A, exist_ok=True)
TEXT = "ⓒ내사진 2026"; PW_IMG, PW_WM = 1234, 5678
R = {"text": TEXT, "bytes": len(TEXT.encode()), "pw": [PW_IMG, PW_WM]}
def sh(*a): return subprocess.run(a, capture_output=True, text=True)
R["version"] = sh("pip", "show", "blind-watermark").stdout.split("\n")[1].split(": ")[1]
def med(f, n=3):
    ts, out = [], None
    for _ in range(n): t = time.time(); out = f(); ts.append(time.time() - t)
    return round(statistics.median(ts), 2), out
def embed(src, dst, text=TEXT, pi=PW_IMG, pw=PW_WM):
    bwm = WaterMark(password_img=pi, password_wm=pw); bwm.read_img(src); bwm.read_wm(text, mode="str"); bwm.embed(dst); return len(bwm.wm_bit)
def bits(text): return np.array(list(bin(int(text.encode().hex(), 16))[2:])) == "1"
def extract(path=None, img=None, n=None, pi=PW_IMG, pw=PW_WM):
    bwm = WaterMark(password_img=pi, password_wm=pw)
    return bwm.extract(filename=path, embed_img=img, wm_shape=n, mode="str")
def score(got, text=TEXT):
    a, b = bits(text), bits(got) if got else np.array([])
    acc = float((a[:len(b)] == b[:len(a)]).mean()) if len(b) else 0.0
    return {"got": got, "ok": got == text, "bit_acc": round(acc * 100, 1)}
def psnr(a, b): m = np.mean((a.astype(float) - b.astype(float)) ** 2); return round(10 * np.log10(255 ** 2 / m), 1)

# ① 사진 4장에 글자 도장 넣기 / 꺼내기
R["photos"] = []
for name in ["cat", "coffee", "astronaut", "rocket"]:
    src, dst = f"{W}/{name}.png", f"{W}/{name}_wm.png"
    t_e, n = med(lambda: embed(src, dst))
    t_x, got = med(lambda: extract(dst, n=n))
    o, e = cv2.imread(src), cv2.imread(dst); d = np.abs(o.astype(int) - e.astype(int))
    R["photos"].append({"name": name, "w": o.shape[1], "h": o.shape[0], "bits": n, "embed": t_e, "extract": t_x, **score(got),
                        "psnr": psnr(o, e), "max_diff": int(d.max()), "mean_diff": round(float(d.mean()), 2),
                        "same_px_pct": round(float((d.max(axis=2) == 0).mean() * 100), 1), "le3_pct": round(float((d.max(axis=2) <= 3).mean() * 100), 1),
                        "kb_src": round(os.path.getsize(src) / 1024), "kb_wm": round(os.path.getsize(dst) / 1024)})
N = R["photos"][0]["bits"]
# 차이 확대 그림 (고양이): 바뀐 값 × 30
o, e = cv2.imread(f"{W}/cat.png"), cv2.imread(f"{W}/cat_wm.png")
cv2.imwrite(f"{W}/cat_diff_x30.png", np.clip(np.abs(o.astype(int) - e.astype(int)) * 30, 0, 255).astype(np.uint8))

# ② 사진을 망가뜨린 뒤에도 글자가 나오는가 (고양이·우주인)
def attacks(name):
    e = cv2.imread(f"{W}/{name}_wm.png"); h, w = e.shape[:2]; out = []
    def jpg(img, q): ok, b = cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, q]); return cv2.imdecode(b, 1), len(b)
    cases = []
    for q in (90, 70, 50, 30):
        im, size = jpg(e, q); cases.append((f"jpg{q}", f"JPG로 다시 저장 (화질 {q})", im, im, size))
    sm = cv2.resize(e, (w // 2, h // 2)); cases.append(("half", "절반 크기로 줄임 → 원래 크기로 되돌려 꺼냄", sm, cv2.resize(sm, (w, h)), None))
    for f_ in (0.8, 1.2):
        im = np.clip(e.astype(float) * f_, 0, 255).astype(np.uint8); cases.append((f"bright{f_}", f"밝기 {int(f_*100)}%", im, im, None))
    im = e.copy(); rng = np.random.RandomState(0); m = rng.rand(h, w) < 0.01; im[m] = 255 * (rng.rand(m.sum(), 1) > 0.5)
    cases.append(("salt", "점 잡음 1% (소금·후추)", im, im, None))
    im = e.copy(); cv2.rectangle(im, (int(w * .55), int(h * .55)), (int(w * .95), int(h * .95)), (40, 40, 40), -1)
    cases.append(("cover", "사진 일부(16%)를 검은 상자로 가림", im, im, None))
    im = e.copy(); cv2.putText(im, "SALE", (int(w * .08), int(h * .3)), cv2.FONT_HERSHEY_DUPLEX, w / 250, (255, 255, 255), max(2, w // 120))
    cases.append(("text", "사진 위에 큰 글씨를 씀", im, im, None))
    sm, size = jpg(cv2.resize(e, (int(w * .75), int(h * .75))), 85); cases.append(("chat", "메신저 전송 흉내 (75%로 줄이고 JPG 85)", sm, cv2.resize(sm, (w, h)), size))
    M = cv2.getRotationMatrix2D((w / 2, h / 2), 10, 1); im = cv2.warpAffine(e, M, (w, h)); back = cv2.warpAffine(im, cv2.getRotationMatrix2D((w / 2, h / 2), -10, 1), (w, h))
    cases.append(("rot_back", "10도 돌림 → 다시 -10도 돌려 꺼냄", im, back, None))
    cases.append(("rot", "10도 돌린 채로 그대로 꺼냄", im, im, None))
    x1, y1, x2, y2 = int(w * .1), int(h * .1), int(w * .8), int(h * .85); cut = e[y1:y2, x1:x2].copy()
    cases.append(("crop_raw", "가장자리를 잘라 냄 (그대로 꺼냄)", cut, cv2.resize(cut, (w, h)), None))
    for key, label, shown, test, size in cases:
        r = score(extract(img=test, n=N)); cv2.imwrite(f"{A}/{name}_{key}.png", shown)
        out.append({"key": key, "label": label, **r, **({"kb": round(size / 1024)} if size else {})})
    # 잘린 사진: 원본(도장 넣은 사진) 크기를 알고 있을 때 자리 찾아 복원
    cv2.imwrite(f"{A}/{name}_crop.png", cut)
    (x1_, y1_, x2_, y2_), ish, sc, _ = estimate_crop_parameters(original_file=f"{W}/{name}_wm.png", template_file=f"{A}/{name}_crop.png", scale=(1, 1), search_num=None)
    recover_crop(template_file=f"{A}/{name}_crop.png", output_file_name=f"{A}/{name}_crop_recover.png", loc=(x1_, y1_, x2_, y2_), image_o_shape=ish)
    r = score(extract(f"{A}/{name}_crop_recover.png", n=N))
    out.append({"key": "crop_recover", "label": "가장자리를 잘라 냄 → 원래 자리 찾아 복원 후 꺼냄", **r, "found": [int(x1_), int(y1_), int(x2_), int(y2_)], "true": [x1, y1, x2, y2]})
    return out
R["attacks"] = {n: attacks(n) for n in ["cat", "astronaut"]}

# ③ 비밀번호가 틀리면
R["wrong_pw"] = [{"pw": [pi, pw], **score(extract(f"{W}/cat_wm.png", n=N, pi=pi, pw=pw))} for pi, pw in [(1234, 1111), (1111, 5678), (1, 1)]]
# ④ 도장이 없는 원본에서 꺼내 보면
R["no_wm"] = score(extract(f"{W}/cat.png", n=N))
# ⑤ 글자 길이(비트 수)를 모르면 → 다른 길이로 꺼내 봄
R["wrong_len"] = [{"n": n, **score(extract(f"{W}/cat_wm.png", n=n))} for n in (N - 8, N + 8)]
# ⑥ 글자를 얼마나 길게 넣을 수 있나 (고양이 451×300)
cap = []
for k in (10, 30, 60, 100):
    t = ("가" * k)
    try: n = embed(f"{W}/cat.png", f"{W}/_cap.png", t); cap.append({"chars": k, "bits": n, **{x: y for x, y in score(extract(f"{W}/_cap.png", n=n), t).items() if x != "got"}})
    except Exception as ex: cap.append({"chars": k, "error": str(ex)[:120]})
R["capacity"] = cap; os.remove(f"{W}/_cap.png") if os.path.exists(f"{W}/_cap.png") else None
# ⑦ 휴대폰 사진 크기 (4032×3024)
t_e, n = med(lambda: embed(f"{W}/big_4032x3024.png", f"{W}/big_wm.png"), 1); t_x, got = med(lambda: extract(f"{W}/big_wm.png", n=n), 1)
R["big"] = {"embed": t_e, "extract": t_x, **score(got)}; os.remove(f"{W}/big_wm.png")
# ⑧ 명령어(CLI)로 넣고 꺼내기
t = time.time(); p = sh("blind_watermark", "--embed", "--pwd", "1234", f"{W}/coffee.png", TEXT, f"{W}/coffee_cli.png"); te = round(time.time() - t, 2)
t = time.time(); q = sh("blind_watermark", "--extract", "--pwd", "1234", "--wm_shape", str(N), f"{W}/coffee_cli.png"); tx = round(time.time() - t, 2)
R["cli"] = {"embed_out": p.stdout.strip().splitlines()[-1:], "embed_sec": te, "extract_out": q.stdout.strip().splitlines()[-1:], "extract_sec": tx}
os.remove(f"{W}/coffee_cli.png")
# ⑨ 그림 도장(48×48 흑백 로고) 넣고 꺼내기
logo = np.zeros((48, 48), np.uint8); cv2.circle(logo, (24, 24), 21, 255, 4); cv2.putText(logo, "K", (13, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.95, 255, 3)
cv2.imwrite(f"{W}/logo48.png", logo)
bwm = WaterMark(password_img=PW_IMG, password_wm=PW_WM); bwm.read_img(f"{W}/astronaut.png"); bwm.read_wm(f"{W}/logo48.png", mode="img"); bwm.embed(f"{W}/astronaut_logo.png")
res = {}
for key, im in [("clean", cv2.imread(f"{W}/astronaut_logo.png")), ("jpg50", cv2.imdecode(cv2.imencode(".jpg", cv2.imread(f"{W}/astronaut_logo.png"), [cv2.IMWRITE_JPEG_QUALITY, 50])[1], 1))]:
    WaterMark(password_img=PW_IMG, password_wm=PW_WM).extract(embed_img=im, wm_shape=(48, 48), out_wm_name=f"{W}/logo_out_{key}.png", mode="img")
    got = cv2.imread(f"{W}/logo_out_{key}.png", 0); res[key] = round(float(((got > 128) == (logo > 128)).mean() * 100), 1)
R["logo"] = res
# ⑩ 명령어(CLI)의 --pwd 는 사진 비밀번호(password_img)만 바꾼다 → 다른 번호로도 꺼내지는지
sh("blind_watermark", "--embed", "--pwd", "1234", f"{W}/cat.png", TEXT, f"{W}/_cli.png")
R["cli_pwd"] = [{"pwd": p_, "got": sh("blind_watermark", "--extract", "--pwd", p_, "--wm_shape", str(N), f"{W}/_cli.png").stdout.strip().splitlines()[-1]} for p_ in ("1234", "9999", "1")]
os.remove(f"{W}/_cli.png")
R["install"] = {"note": "새 폴더에 pip install --no-cache-dir --target 로 3번: 3.45초(이상하게 빠름)·33.28초·30.36초, 받은 크기 253MB (OpenCV·numpy·PyWavelets 포함)", "sec": 30.4, "mb": 253}
json.dump(R, open(f"{H}/results.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1))
