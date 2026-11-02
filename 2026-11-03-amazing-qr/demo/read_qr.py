"""QR 그림이 읽히는지 확인 (zxing-cpp 판독기). 사용: python read_qr.py 그림1 [그림2 ...]
움직이는 GIF는 모든 장을 하나씩 읽어 본다.  설치: pip install zxing-cpp numpy pillow"""
import sys
import numpy as np, zxingcpp
from PIL import Image, ImageSequence
for f in sys.argv[1:]:
    fr = [x.convert("RGB") for x in ImageSequence.Iterator(Image.open(f))]
    ok = [zxingcpp.read_barcodes(np.array(x)) for x in fr]
    txt = ok[0][0].text if ok[0] else "읽기 실패"
    print(f"  {f:12s} {sum(bool(o) for o in ok)}/{len(fr)}장 읽힘 → {txt}")
