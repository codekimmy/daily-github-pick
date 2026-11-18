"""시연용 원본 영상 3개 만들기 (모두 직접 만든 자료 · 사진은 scikit-image의 CC0 사진)
- photo.mp4  : 커피잔 사진(CC0, Rachel Michetti)을 천천히 확대·이동 (사진·영상 같은 장면)
- sunset.mp4 : 직접 그린 노을 하늘 그라데이션 + 해가 내려가는 장면 (색이 부드럽게 이어지는 장면)
- screen.mp4 : 직접 그린 메모장 화면에 글자가 타이핑되는 장면 (화면 녹화 같은 장면)
모두 480×320, 초당 20장, 5초(100장). 무손실에 가깝게(crf 10) 저장해 원본으로 씀.
사용: python3 demo/make_clips.py  →  demo/src/*.mp4"""
import os, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont
import skimage.data as sd

HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "src"); os.makedirs(OUT, exist_ok=True)
W, H, FPS, N = 480, 320, 20, 100


def save(name, frames):
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-c:v", "libx264", "-crf", "10", "-pix_fmt", "yuv444p", os.path.join(OUT, name)], stdin=subprocess.PIPE)
    for f in frames: p.stdin.write(np.asarray(f, dtype=np.uint8).tobytes())
    p.stdin.close(); p.wait(); print("saved", name)


def photo():
    img = Image.fromarray(sd.coffee())  # 600×400
    for i in range(N):
        k = i / (N - 1); z = 1.0 + 0.35 * k  # 1.0배 → 1.35배 확대
        cw, ch = 600 / z, 400 / z; cx = 300 + 40 * k; cy = 200 - 20 * k
        yield img.resize((W, H), Image.LANCZOS, box=(cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2))


def sunset():
    y = np.linspace(0, 1, H)[:, None, None]; x = np.linspace(0, 1, W)[None, :, None]
    top, mid, hor = np.array([40, 30, 90]), np.array([230, 110, 90]), np.array([255, 200, 120])
    for i in range(N):
        k = i / (N - 1); hz = 0.62
        t = np.clip(y / hz, 0, 1)
        sky = np.where(t < .6, top + (mid - top) * (t / .6), mid + (hor - mid) * ((t - .6) / .4))
        sky = sky * (1 - .25 * k) + np.array([20, 10, 30]) * .25 * k  # 해가 질수록 조금 어두워짐
        sx, sy = .5, .30 + .38 * k  # 해 위치
        d = np.sqrt(((x - sx) * W) ** 2 + ((y - sy) * H) ** 2)[..., 0]
        glow = (np.clip(1 - d / 140, 0, 1) ** 2)[..., None] * np.array([255, 170, 80]) * .55
        sun = np.broadcast_to(np.array([255, 235, 170]), (H, W, 3))
        img = np.where(d[..., None] < 26, sun, np.clip(sky + glow, 0, 255))
        sea_t = np.clip((y - hz) / (1 - hz), 0, 1)
        sea = np.array([30, 40, 80]) * (1 - sea_t) + np.array([10, 15, 40]) * sea_t
        refl = np.clip(1 - np.abs((x - sx) * W) / (30 + 40 * sea_t), 0, 1) * (1 - k * .5)
        sea = sea + refl * np.array([200, 120, 60]) * (0.6 + 0.4 * np.sin(y * 260 + i * .5))
        img = np.where(np.broadcast_to(y >= hz, (H, W, 1)), np.clip(np.broadcast_to(sea, (H, W, 3)), 0, 255), img)
        yield img.astype(np.uint8)


def screen():
    font = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", 18)
    head = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc", 16)
    lines = ["오늘 할 일", "1. 회의 자료 정리하기", "2. 영수증 사진 올리기", "3. 블로그에 움짤 넣기", "4. 저녁 장보기 목록 쓰기"]
    full = "\n".join(lines); total = len(full)
    for i in range(N):
        im = Image.new("RGB", (W, H), (245, 246, 248)); d = ImageDraw.Draw(im)
        d.rectangle([0, 0, W, 34], fill=(52, 120, 220)); d.text((14, 7), "메모장 - 할일.txt", font=head, fill="white")
        d.rectangle([0, 34, W, 60], fill=(230, 232, 236)); d.text((14, 38), "파일   편집   보기", font=head, fill=(60, 60, 60))
        n = int(total * min(1, i / (N * .8)))
        y = 76
        for ln in full[:n].split("\n"):
            d.text((18, y), ln, font=font, fill=(25, 25, 25)); y += 30
        if (i // 6) % 2 == 0:  # 커서
            last = full[:n].split("\n")[-1]; cx = 18 + d.textlength(last, font=font)
            d.rectangle([cx + 2, y - 28, cx + 4, y - 6], fill=(25, 25, 25))
        d.rectangle([0, H - 26, W, H], fill=(230, 232, 236)); d.text((14, H - 24), f"글자 {n}개", font=head, fill=(80, 80, 80))
        yield im


save("photo.mp4", photo()); save("sunset.mp4", sunset()); save("screen.mp4", screen())
