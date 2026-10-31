"""rembg 테스트: 모델 4종 × 사진 3장, 걸린 시간·남은 면적 비율 기록 → results.json
사진: scikit-image 예제 사진 (고양이·커피 CC0, 로켓 퍼블릭 도메인)
"""
import json, time, os
from pathlib import Path
import numpy as np
from PIL import Image
from rembg import new_session, remove

HERE = Path(__file__).parent
IN, OUT = HERE / "input", HERE / "out"
OUT.mkdir(exist_ok=True)
PHOTOS = {"cat": "cat.png", "coffee": "coffee.png", "rocket": "rocket.jpg"}
MODELS = ["u2netp", "silueta", "u2net", "isnet-general-use"]

res = {"models": {}, "photos": {}, "extras": {}}
for k, f in PHOTOS.items():
    im = Image.open(IN / f)
    res["photos"][k] = {"file": f, "size": list(im.size), "bytes": os.path.getsize(IN / f)}

for m in MODELS:
    t = time.perf_counter(); s = new_session(m); load = time.perf_counter() - t
    mpath = Path.home() / ".rembg" / "models" / m / f"{m}.onnx"
    entry = {"load_sec": round(load, 2), "model_mb": round(mpath.stat().st_size / 1e6, 1), "photos": {}}
    for k, f in PHOTOS.items():
        im = Image.open(IN / f)
        t = time.perf_counter(); out = remove(im, session=s); dt = time.perf_counter() - t
        out.save(OUT / f"{k}-{m}.png")
        a = np.array(out)[..., 3]
        entry["photos"][k] = {"sec": round(dt, 2), "kept_pct": round(float((a > 128).mean() * 100), 1)}
    res["models"][m] = entry
    print(m, entry)

# 활용 ①: 흰 배경으로 바꾸기 (중고거래 사진)
s = new_session("u2net")
im = Image.open(IN / "coffee.png")
t = time.perf_counter()
remove(im, session=s, bgcolor=(255, 255, 255, 255)).convert("RGB").save(OUT / "coffee-white.jpg", quality=92)
res["extras"]["white_bg_sec"] = round(time.perf_counter() - t, 2)
# 활용 ②: 다른 배경에 합성
cut = Image.open(OUT / "coffee-u2net.png")
grad = np.linspace([255, 236, 200], [250, 180, 160], cut.size[1]).astype(np.uint8)
bg = Image.fromarray(np.repeat(grad[:, None, :], cut.size[0], axis=1))
bg.paste(cut, (0, 0), cut); bg.save(OUT / "coffee-newbg.jpg", quality=92)
# 활용 ③: 테두리만 다듬기 (alpha matting) — 고양이 털
im = Image.open(IN / "cat.png")
t = time.perf_counter()
remove(im, session=s, alpha_matting=True).save(OUT / "cat-u2net-matting.png")
res["extras"]["matting_sec"] = round(time.perf_counter() - t, 2)
# 활용 ④: 마스크(흑백 모양)만
remove(im, session=s, only_mask=True).save(OUT / "cat-u2net-mask.png")

json.dump(res, open(HERE / "results.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(res["extras"]))

# 롱폼용: 커피 마스크
if __name__ == "__main__":
    s = new_session("u2net")
    remove(Image.open(IN / "coffee.png"), session=s, only_mask=True).save(OUT / "coffee-u2net-mask.png")
