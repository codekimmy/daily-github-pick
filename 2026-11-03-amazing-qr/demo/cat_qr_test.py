"""운영자가 제공한 고양이 춤 GIF(녹색 배경, 152장)로 움직이는 QR 만들기 + 판독 확인
원본 GIF는 출처·권리를 확인하지 못해 저장소에 넣지 않았습니다. 사용: python3 cat_qr_test.py <원본.gif>"""
import json, os, statistics, subprocess, sys, time
import numpy as np, zxingcpp, cv2
from PIL import Image, ImageSequence
src = sys.argv[1]; here = os.path.dirname(os.path.abspath(__file__)); out = f"{here}/out/cat_qr.gif"
URL = "https://github.com/codekimmy/daily-github-pick"
im = Image.open(src); info = {"src_size": list(im.size), "src_frames": im.n_frames, "src_ms": im.info.get("duration"), "src_mb": round(os.path.getsize(src) / 1e6, 1)}
secs = []
for _ in range(3):
    t = time.perf_counter(); subprocess.run(["amzqr", URL, "-p", src, "-c", "-d", f"{here}/out", "-n", "cat_qr.gif"], check=True, capture_output=True); secs.append(time.perf_counter() - t)
fr = [x.convert("RGB") for x in ImageSequence.Iterator(Image.open(out))]
det = cv2.QRCodeDetector()
zx = [zxingcpp.read_barcodes(np.array(x)) for x in fr]
info.update({"secs": [round(s, 2) for s in secs], "sec": round(statistics.median(secs), 2), "out_size": list(fr[0].size), "frames": len(fr),
             "out_mb": round(os.path.getsize(out) / 1e6, 1), "zx_full": sum(bool(z) for z in zx), "text": zx[0][0].text if zx[0] else None,
             "cv_full": sum(bool(det.detectAndDecode(cv2.cvtColor(np.array(x), cv2.COLOR_RGB2BGR))[0]) for x in fr),
             "zx_200px": sum(bool(zxingcpp.read_barcodes(np.array(x.resize((200, 200), Image.BILINEAR)))) for x in fr)})
json.dump(info, open(f"{here}/results_cat.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
# 미리보기: 4장 나란히
pick = [0, 40, 80, 120]; sheet = Image.new("RGB", (441 * 4 + 50, 441 + 20), "white")
for k, i in enumerate(pick): sheet.paste(fr[i], (10 + k * 451, 10))
sheet.save(f"{os.path.dirname(here)}/media/cat-qr-frames.png", optimize=True)
print(json.dumps(info, ensure_ascii=False))
