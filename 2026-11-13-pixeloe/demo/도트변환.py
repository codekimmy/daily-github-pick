"""폴더 속 사진을 모두 도트 그림(픽셀 아트)으로 바꾸고, '원본 | 보통 모자이크 | PixelOE' 비교 그림도 함께 만드는 예제
실행: python 도트변환.py 사진폴더 [점 개수, 기본 96]
   → 사진폴더\\도트그림\\ 안에 '이름_도트.png'와 '이름_비교.png'가 생깁니다 (원본 사진은 건드리지 않음)
먼저: pip install pixeloe"""
import sys, time
from pathlib import Path
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
from pixeloe.legacy.pixelize import pixelize

src = Path(sys.argv[1] if len(sys.argv) > 1 else "photos")
dots = int(sys.argv[2]) if len(sys.argv) > 2 else 96   # 그림 가로·세로 점 개수의 기준 (클수록 자세함)
dst = src / "도트그림"; dst.mkdir(exist_ok=True)
FONTS = ["C:/Windows/Fonts/malgun.ttf", "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"]  # Windows 맑은 고딕 / 리눅스 Noto


def font(size):
    for f in FONTS:
        if Path(f).exists(): return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def mosaic(bgr, w, h):  # 보통 모자이크: 칸마다 평균 색으로 줄였다가 그대로 키움
    return cv2.resize(cv2.resize(bgr, (w, h), interpolation=cv2.INTER_AREA), (w * 6, h * 6), interpolation=cv2.INTER_NEAREST)


photos = [p for p in sorted(src.iterdir()) if p.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp")]
print(f"사진 {len(photos)}장, 점 개수 기준 {dots}")
for p in photos:
    t = time.perf_counter()
    rgb = np.array(Image.open(p).convert("RGB")); bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    out = pixelize(bgr, mode="contrast", target_size=dots, patch_size=6, thickness=1)   # 점 하나 = 6×6 화소, 외곽선 1
    out_rgb = cv2.cvtColor(out, cv2.COLOR_BGR2RGB); Image.fromarray(out_rgb).save(dst / f"{p.stem}_도트.png")
    h, w = out.shape[0] // 6, out.shape[1] // 6
    mo = cv2.cvtColor(mosaic(bgr, w, h), cv2.COLOR_BGR2RGB)
    org = cv2.resize(rgb, (out.shape[1], out.shape[0]), interpolation=cv2.INTER_AREA)
    pad = 70; sheet = Image.new("RGB", (out.shape[1] * 3 + 40, out.shape[0] + pad + 10), "white"); d = ImageDraw.Draw(sheet)
    for i, (im, lab) in enumerate([(org, "원본"), (mo, f"보통 모자이크 ({w}×{h}점)"), (out_rgb, f"PixelOE ({w}×{h}점)")]):
        x = 10 + i * (out.shape[1] + 10); sheet.paste(Image.fromarray(im), (x, pad)); d.text((x + 6, 14), lab, fill="black", font=font(34))
    sheet.save(dst / f"{p.stem}_비교.png")
    print(f"  {p.name} → {p.stem}_도트.png ({w}×{h}점) · {time.perf_counter() - t:.2f}초")
print("저장 폴더:", dst)
