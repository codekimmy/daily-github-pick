# 녹화용 보조 도구: 파일마다 가로×세로·용량(MB)·위치 정보(GPS) 여부 출력
import sys, os, piexif
from PIL import Image
tot = 0
for p in sys.argv[1:]:
    im = Image.open(p); s = os.path.getsize(p) / 1e6; tot += s
    try: g = "위치 있음" if piexif.load(p)["GPS"] else "위치 없음"
    except Exception: g = "위치 없음"
    print(f"{os.path.basename(p):18s} {im.size[0]}x{im.size[1]:<5d} {s:6.2f} MB  {g}")
print(f"{'합계':16s} {'':10s} {tot:6.2f} MB")
