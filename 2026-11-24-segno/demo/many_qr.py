import os, segno  # 영상 시연 ⑥의 '파이썬 예제 4줄': 주소 끝 번호만 다른 QR 1,000장을 qr_1000 폴더에 저장
os.makedirs("qr_1000", exist_ok=True)
for i in range(1, 1001):
    segno.make(f"https://example.com/table/{i}").save(f"qr_1000/t{i:04d}.png", scale=8)
