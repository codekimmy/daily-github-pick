"""시연용 사진 준비: scikit-image에 들어 있는 저작권 없는 예제 사진만 사용 (고양이·커피 CC0, 우주인·로켓 퍼블릭 도메인)."""
import os, cv2, skimage
H = os.path.dirname(os.path.abspath(__file__)); W = f"{H}/work"; os.makedirs(W, exist_ok=True)
D = os.path.join(os.path.dirname(skimage.__file__), "data")
for src, dst in [("chelsea.png", "cat.png"), ("coffee.png", "coffee.png"), ("astronaut.png", "astronaut.png"), ("rocket.jpg", "rocket.png")]:
    cv2.imwrite(f"{W}/{dst}", cv2.imread(f"{D}/{src}"))
# 휴대폰 사진 크기(4032×3024) 시연용: 커피 사진을 늘린 것
cv2.imwrite(f"{W}/big_4032x3024.png", cv2.resize(cv2.imread(f"{D}/coffee.png"), (4032, 3024), interpolation=cv2.INTER_CUBIC))
print(sorted(os.listdir(W)))
