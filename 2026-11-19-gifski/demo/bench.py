"""원본 영상 3개(demo/src)를 여러 방법으로 GIF로 바꿔 크기·시간·화질을 잰다 → results.json, out/*.gif
방법: ffmpeg 기본 / ffmpeg 팔레트 2단계(흔히 쓰는 고화질 방법) / gifski 기본(-Q 90) / gifski -Q 70 / -Q 50 / --fast / --extra
화질: GIF를 다시 풀어 원본과 프레임마다 비교한 SSIM(1에 가까울수록 원본과 같음)·PSNR(dB, 높을수록 원본에 가까움)
색 수: 50번째 프레임에 쓰인 서로 다른 색 개수 (GIF 한 장면 팔레트는 최대 256색)
사용: python3 demo/bench.py"""
import json, os, re, subprocess, time
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.join(HERE, "src"); OUT = os.path.join(HERE, "out"); os.makedirs(OUT, exist_ok=True)
CLIPS = ["photo", "sunset", "screen"]
PAL = "split[a][b];[a]palettegen[p];[b][p]paletteuse"
METHODS = {
    "ffmpeg_basic": lambda s, o: [["ffmpeg", "-y", "-loglevel", "error", "-i", s, o]],
    "ffmpeg_palette": lambda s, o: [["ffmpeg", "-y", "-loglevel", "error", "-i", s, "-vf", PAL, o]],
    "gifski_q90": lambda s, o: [["gifski", "-q", "-o", o, s]],
    "gifski_q70": lambda s, o: [["gifski", "-q", "-Q", "70", "-o", o, s]],
    "gifski_q50": lambda s, o: [["gifski", "-q", "-Q", "50", "-o", o, s]],
    "gifski_fast": lambda s, o: [["gifski", "-q", "--fast", "-o", o, s]],
    "gifski_extra": lambda s, o: [["gifski", "-q", "--extra", "-o", o, s]],
}


def metric(gif, src):
    r = subprocess.run(["ffmpeg", "-i", gif, "-i", src, "-lavfi", "[0:v]format=rgb24[a];[1:v]format=rgb24[b];[a][b]ssim;[0:v]format=rgb24[c];[1:v]format=rgb24[d];[c][d]psnr",
                        "-f", "null", "-"], capture_output=True, text=True).stderr
    ssim = float(re.search(r"SSIM .*All:([\d.]+)", r).group(1)); psnr = float(re.search(r"PSNR .*average:([\d.inf]+)", r).group(1))
    return ssim, psnr


def colors(gif, idx=50):
    im = Image.open(gif); im.seek(min(idx, im.n_frames - 1)); fr = im.convert("RGB")
    return len(fr.getcolors(1 << 24)), im.n_frames


res = {"gifski_version": subprocess.run(["gifski", "--version"], capture_output=True, text=True).stdout.strip(), "clips": {}}
for c in CLIPS:
    mp4 = os.path.join(SRC, c + ".mp4"); y4m = os.path.join(OUT, c + ".y4m")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp4, "-pix_fmt", "yuv444p", y4m], check=True)  # gifski 입력용 (영상 → y4m)
    row = {"src_kb": round(os.path.getsize(mp4) / 1024, 1)}
    for m, cmd in METHODS.items():
        o = os.path.join(OUT, f"{c}_{m}.gif"); s = y4m if m.startswith("gifski") else mp4
        t = time.time()
        for cc in cmd(s, o): subprocess.run(cc, check=True)
        dt = time.time() - t
        ssim, psnr = metric(o, mp4); col, nf = colors(o)
        row[m] = {"kb": round(os.path.getsize(o) / 1024, 1), "sec": round(dt, 2), "ssim": round(ssim, 4), "psnr": round(psnr, 2), "colors_f50": col, "frames": nf}
        print(c, m, row[m], flush=True)
    os.remove(y4m); res["clips"][c] = row
json.dump(res, open(os.path.join(HERE, "results.json"), "w"), ensure_ascii=False, indent=1)
