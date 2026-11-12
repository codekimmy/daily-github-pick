"""(녹화용 보조) 그림을 명령 창에 색 글자(▀)로 작게 찍어 보여 줍니다. 사용: python3 미리보기.py 그림.png [가로 칸 수]"""
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert("RGB"); w = int(sys.argv[2]) if len(sys.argv) > 2 else 60
h = int(im.height * w / im.width) // 2 * 2; im = im.resize((w, h), Image.NEAREST); px = im.load()
for y in range(0, h, 2):
    print("".join(f"\033[38;2;{px[x, y][0]};{px[x, y][1]};{px[x, y][2]}m\033[48;2;{px[x, y + 1][0]};{px[x, y + 1][1]};{px[x, y + 1][2]}m▀" for x in range(w)) + "\033[0m")
