"""배경 지운 PNG를 확인: 크기, 남은 부분(주인공) 비율, 투명해진 비율
사용: python info.py 결과.png [결과2.png ...]"""
import sys
from PIL import Image
for p in sys.argv[1:]:
    im = Image.open(p).convert("RGBA")
    a = im.getchannel("A")
    hist = a.histogram()
    total = im.width * im.height
    keep = sum(hist[129:]) / total * 100
    print(f"{p}: {im.width}x{im.height}  주인공 {keep:.0f}%  투명해진 배경 {100-keep:.0f}%")
