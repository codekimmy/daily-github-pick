"""영상에 쓸 그림 꺼내기: out/*.gif(bench.py 결과)와 src/*.mp4에서 프레임을 PNG로 → render/img/
- {clip}_{방법}.png : 50번째 프레임 (photo·sunset: 원본·ffmpeg 기본·ffmpeg 팔레트·gifski -Q 90·-Q 50 / screen: 원본·ffmpeg 팔레트·gifski)
- seq/{clip}_{방법}_{i}.png : 재생 장면용 5장마다 1장 (20장, 커밋하지 않음 — 이 파일로 다시 만듦)
사용: python3 demo/prep_img.py"""
import os, subprocess
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); IMG = os.path.join(HERE, "render", "img"); os.makedirs(IMG + "/seq", exist_ok=True)
def gif_frames(p):
    im = Image.open(p); out = []
    for i in range(im.n_frames): im.seek(i); out.append(im.convert("RGB"))
    return out
def src_frames(c):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f"{HERE}/src/{c}.mp4", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    n = 480 * 320 * 3; return [Image.frombytes("RGB", (480, 320), raw[i:i + n]) for i in range(0, len(raw), n)]
SETS = {"photo": ["ffmpeg_basic", "ffmpeg_palette", "gifski_q90", "gifski_q50"], "sunset": ["ffmpeg_basic", "ffmpeg_palette", "gifski_q90", "gifski_q50"], "screen": ["ffmpeg_palette", "gifski_q90"]}
for c, ms in SETS.items():
    fr = src_frames(c); fr[50].save(f"{IMG}/{c}_src.png")
    for i in range(0, 100, 5): fr[i].save(f"{IMG}/seq/{c}_src_{i // 5}.png")
    for m in ms:
        g = gif_frames(f"{HERE}/out/{c}_{m}.gif")
        if len(g) == 100:
            g[50].save(f"{IMG}/{c}_{m}.png")
            for i in range(0, 100, 5): g[i].save(f"{IMG}/seq/{c}_{m}_{i // 5}.png")
        else:  # gifski가 같은 장면을 합친 경우(화면 녹화): 마지막 근처 장면만
            g[min(50, len(g) - 1)].save(f"{IMG}/{c}_{m}.png")
print(len(os.listdir(IMG)), "files")
