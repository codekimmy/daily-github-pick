"""시연용 가상 사진 만들기: 컴퓨터로 그린 풍경 6장(휴대폰 사진 크기 4032×3024, JPG 화질 92)
+ 휴대폰처럼 EXIF(촬영 기기 이름·촬영 시각·GPS 위치=서울시청 근처 가상 좌표)를 넣는다. 실제 사람·장소 사진 아님.
사용: python3 demo/make_photos.py → demo/photos/"""
import os, numpy as np, piexif
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "photos"); os.makedirs(OUT, exist_ok=True)
W, H = 4032, 3024
rng = np.random.default_rng(20261123)

def noise(scale, octaves=6, seed=0):
    r = np.random.default_rng(seed); acc = np.zeros((H, W), np.float32); amp, tot = 1.0, 0
    for o in range(octaves):
        s = max(2, int(scale * 2 ** o)); g = r.random((s * H // W + 2, s + 2)).astype(np.float32)
        im = Image.fromarray(g).resize((W, H), Image.BICUBIC); acc += amp * np.asarray(im); tot += amp; amp *= .5
    return acc / tot

def grad(top, bot):
    k = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
    return np.array(top, np.float32) * (1 - k) + np.array(bot, np.float32) * k * np.ones((1, W, 1), np.float32)

def ridge(base, amp, seed):  # 산·지평선 높이(열마다)
    n = noise(3, 7, seed)[H // 2]; return (base + amp * (n - .5) * 2) * H

def layer(img, h, col, tex_seed, tex=40):
    yy = np.arange(H)[:, None]; m = yy > h[None, :]; t = noise(20, 6, tex_seed)[..., None] * tex
    img[m] = (np.array(col, np.float32) + t - tex / 2)[m]

def sky(top, bot, cloud=0.0, seed=1):
    img = grad(top, bot)
    if cloud: c = np.clip((noise(4, 7, seed) - .45) * 3, 0, 1)[..., None]; img = img * (1 - cloud * c) + 245 * cloud * c
    return img

S = {}
img = sky((40, 60, 140), (250, 150, 80), .35, 2); h = np.full(W, H * .62); layer(img, h, (30, 50, 90), 3, 60)
sun = ((np.arange(W)[None] - W * .6) ** 2 + (np.arange(H)[:, None] - H * .55) ** 2) ** .5; img += (np.clip(1 - sun / 380, 0, 1) ** 2 * 200)[..., None] * np.array([1, .8, .4]); S["1_바다노을"] = img
img = sky((70, 130, 210), (190, 215, 240), .5, 4); layer(img, ridge(.45, .12, 5), (90, 100, 125), 6, 50); layer(img, ridge(.6, .08, 7), (50, 85, 55), 8, 70); layer(img, ridge(.78, .05, 9), (35, 60, 35), 10, 80); S["2_산풍경"] = img
img = sky((150, 190, 140), (60, 90, 50), 0, 11); t = noise(30, 7, 12)[..., None]; img = img * .5 + np.array([40, 110, 40]) * t * 1.2; layer(img, np.full(W, H * .7), (110, 90, 60), 13, 90); S["3_숲길"] = img
img = sky((120, 170, 230), (200, 225, 245), .3, 14); layer(img, np.full(W, H * .5), (60, 130, 50), 15, 60)
f = noise(60, 4, 16); yy = np.arange(H)[:, None]; m = (f > .62) & (yy > H * .5); img[m] = np.array([235, 70, 110]) * (f[m, None] + .3); S["4_꽃밭"] = img
img = sky((5, 10, 35), (40, 30, 70), 0, 17); hb = H * (.45 + .35 * (np.floor(np.arange(W) / 180) % 7) / 7 * (noise(2, 2, 18)[H // 2] + .5)); layer(img, hb, (20, 22, 35), 19, 30)
win = (noise(120, 2, 20) > .6) & (np.arange(H)[:, None] > hb[None, :]); img[win] = np.array([255, 210, 120]); S["5_도시야경"] = img
img = sky((40, 110, 220), (170, 205, 245), .9, 21); S["6_구름하늘"] = img

exif = {"0th": {piexif.ImageIFD.Make: b"VirtualPhone", piexif.ImageIFD.Model: b"Demo-Cam 1", piexif.ImageIFD.Orientation: 1},
        "Exif": {piexif.ExifIFD.DateTimeOriginal: b"2026:11:20 14:30:00"},
        "GPS": {piexif.GPSIFD.GPSLatitudeRef: b"N", piexif.GPSIFD.GPSLatitude: ((37, 1), (33, 1), (5000, 100)),
                piexif.GPSIFD.GPSLongitudeRef: b"E", piexif.GPSIFD.GPSLongitude: ((126, 1), (58, 1), (4000, 100))}}
FINE = (noise(500, 3, 99)[..., None] - .5) * 36  # 잎·물결·벽돌 같은 잔무늬(실제 사진처럼 압축이 덜 되게)
for name, a in S.items():
    a = a + FINE
    a = a + rng.normal(0, 4, a.shape).astype(np.float32)  # 휴대폰 센서처럼 미세한 잡티
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)); p = os.path.join(OUT, name + ".jpg")
    im.save(p, quality=92, exif=piexif.dump(exif)); print(name, round(os.path.getsize(p) / 1e6, 2), "MB")
