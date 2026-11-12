"""PixelOE 시연 측정 → results.json, 결과 그림 → out/
사진: scikit-image 견본 사진(고양이 Stefan van der Walt CC0, 커피 Rachel Michetti CC0)
사용: python3 test_all.py"""
import json, time, platform
from pathlib import Path
import cv2, numpy as np
from PIL import Image
from importlib.metadata import version
from pixeloe.legacy.pixelize import pixelize

H = Path(__file__).parent; P = H / "photos"; O = H / "out"; O.mkdir(exist_ok=True)
R = {"version": version("pixeloe"), "python": platform.python_version(), "photos": {}}


def load(n): return cv2.cvtColor(np.array(Image.open(P / f"{n}.png").convert("RGB")), cv2.COLOR_RGB2BGR)


def save(img, name): cv2.imwrite(str(O / name), img)


def run(img, **kw):
    t = time.perf_counter(); out = pixelize(img, **kw); return out, round(time.perf_counter() - t, 3)


def mosaic(img, dw, dh, scale):  # 보통 모자이크: 칸 평균색으로 줄였다가 그대로 키움 (비교용, PixelOE 결과와 같은 점 개수)
    sm = cv2.resize(img, (dw, dh), interpolation=cv2.INTER_AREA)
    return cv2.resize(sm, (dw * scale, dh * scale), interpolation=cv2.INTER_NEAREST), (dw, dh)


def count_colors(img): return int(len(np.unique(img.reshape(-1, 3), axis=0)))


for n in ["고양이", "커피"]:
    img = load(n); d = {"size": [img.shape[1], img.shape[0]]}
    run(img, target_size=64, patch_size=4)  # 첫 실행 준비(측정 제외)
    # 1) 기본 설정 (명령어 기본값: 점 크기 6, 외곽선 1, 대비 모드)
    out, t = run(img, mode="contrast", target_size=128, patch_size=6, thickness=1)
    save(out, f"{n}_기본.png"); d["default"] = {"sec": t, "out": [out.shape[1], out.shape[0]], "dots": [out.shape[1] // 6, out.shape[0] // 6]}
    # 2) 보통 모자이크 vs PixelOE (같은 점 개수)
    px, t = run(img, mode="contrast", target_size=96, patch_size=6, thickness=1); save(px, f"{n}_pixeloe96.png")
    mo, dd = mosaic(img, px.shape[1] // 6, px.shape[0] // 6, 6); save(mo, f"{n}_모자이크96.png")
    d["compare96"] = {"dots": list(dd), "sec": t}
    # 3) 점 개수(target_size) 바꾸기
    d["sizes"] = {}
    for s in [32, 64, 128, 256]:
        o, t = run(img, mode="contrast", target_size=s, patch_size=6, thickness=1)
        save(o, f"{n}_크기{s}.png"); d["sizes"][s] = {"sec": t, "dots": [o.shape[1] // 6, o.shape[0] // 6]}
    # 4) 색 개수 줄이기 (--colors)
    d["colors"] = {}
    for c in [4, 8, 16, 32]:
        o, t = run(img, mode="contrast", target_size=96, patch_size=6, thickness=1, colors=c)
        save(o, f"{n}_색{c}.png"); d["colors"][c] = {"sec": t, "uniq": count_colors(o)}
    d["colors"]["원래"] = {"uniq": count_colors(px)}
    # 5) 외곽선 두께 (--thickness)
    d["thick"] = {}
    for th in [0, 1, 2, 3]:
        o, t = run(img, mode="contrast", target_size=96, patch_size=6, thickness=th)
        save(o, f"{n}_두께{th}.png"); d["thick"][th] = {"sec": t}
    # 6) 줄이는 방식 (--mode)
    d["modes"] = {}
    for m in ["center", "contrast", "k-centroid", "bicubic", "nearest"]:
        o, t = run(img, mode=m, target_size=96, patch_size=6, thickness=1)
        save(o, f"{n}_방식{m}.png"); d["modes"][m] = {"sec": t}
    R["photos"][n] = d
    print(n, json.dumps(d, ensure_ascii=False)[:300])

# 7) 큰 사진: 커피 사진을 1920×1280, 4000×2667로 키워 걸린 시간 재기 (점 개수는 128로 같게)
img = load("커피"); R["big"] = {}
for w in [600, 1920, 4000]:
    big = cv2.resize(img, (w, int(w * 2 / 3)), interpolation=cv2.INTER_CUBIC)
    o, t = run(big, mode="contrast", target_size=128, patch_size=6, thickness=1); R["big"][w] = {"sec": t}
    print("big", w, t)
json.dump(R, open(H / "results.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("saved results.json")
