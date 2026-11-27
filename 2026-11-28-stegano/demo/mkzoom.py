"""bench.py 다음: 결과 그림(render/img/orig.png · secret.png)에서 영상용 자료를 뽑음 (시연 숫자는 바꾸지 않음)
 - results.json 의 row0: 맨 위 줄 앞 12개 점의 [빨강, 초록, 파랑] (원본 · 비밀)
 - render/img/diffmark.png: 바뀐 점을 굵은 주황 막대로 표시한 '바뀐 곳 지도' (1개 점 = 가로 1 · 세로 40화소로 키움, 화면에서 보이게)"""
import json, os
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); IMG = os.path.join(HERE, "render", "img")
A = Image.open(IMG + "/orig.png").convert("RGB"); B = Image.open(IMG + "/secret.png").convert("RGB")
R = json.load(open(HERE + "/results.json"))
R["row0"] = {"orig": [list(A.getpixel((x, 0))) for x in range(12)], "secret": [list(B.getpixel((x, 0))) for x in range(12)]}
R["row0"]["changed_in_12"] = sum(1 for a, b in zip(R["row0"]["orig"], R["row0"]["secret"]) if a != b)
json.dump(R, open(HERE + "/results.json", "w"), ensure_ascii=False, indent=1)
m = Image.new("RGB", A.size, (24, 24, 28)); d = ImageDraw.Draw(m)
for y in range(A.height):
    for x in range(A.width):
        if A.getpixel((x, y)) != B.getpixel((x, y)): d.rectangle([x, y, x, y + 40], fill=(255, 90, 31))  # 세로 40화소
m.save(IMG + "/diffmark.png"); print(R["row0"])
