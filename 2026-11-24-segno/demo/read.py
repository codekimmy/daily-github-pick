# 녹화용 보조 도구: QR 그림을 읽어(zxing-cpp) 안에 든 글과 그림 크기를 보여 줌
import sys, os, zxingcpp
from PIL import Image
for f in sys.argv[1:]:
    im = Image.open(f); r = zxingcpp.read_barcodes(im.convert("RGB"))
    print(f"{f}: {im.size[0]}x{im.size[1]} px, {os.path.getsize(f)} bytes → 읽은 내용: {r[0].text if r else '(못 읽음)'}")
