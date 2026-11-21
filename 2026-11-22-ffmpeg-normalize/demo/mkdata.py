"""results.json + 전·후 파형(파일마다 막대 96개, 0~1 = 가장 큰 소리 0 dB 기준 크기) → render/data.js, 전·후 이어 듣기 mp3 → ../media/
사용: python3 mkdata.py (bench.py 다음)"""
import json, os, subprocess
import numpy as np
H = os.path.dirname(os.path.abspath(__file__)); R = json.load(open(f"{H}/results.json"))
def pcm(f):
    b = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f, "-map", "0:a:0", "-ac", "1", "-ar", "44100", "-f", "s16le", "-"], capture_output=True).stdout
    return np.frombuffer(b, dtype=np.int16).astype(float) / 32768
def bars(a, n=96): a = np.abs(a[: len(a) // n * n]).reshape(n, -1).max(1); return [round(float(x), 3) for x in a]
F = [b["file"] for b in R["before"]]
R["wave_before"] = [bars(pcm(f"{H}/samples/{f}")) for f in F]
R["wave_after"] = [bars(pcm(f"{H}/work/normalized/{os.path.splitext(f)[0]}.mkv")) for f in F]
R["wave_peak"] = [bars(pcm(f"{H}/work/peak/{os.path.splitext(f)[0]}.mkv")) for f in F]
open(f"{H}/render/data.js", "w", encoding="utf-8").write("const RES = " + json.dumps(R, ensure_ascii=False) + ";\n")
# 전·후 이어 듣기 (4개를 0.6초 쉬고 이어 붙임)
for tag, files in (("before", [f"{H}/samples/{f}" for f in F]), ("after", [f"{H}/work/normalized/{os.path.splitext(f)[0]}.mkv" for f in F])):
    ins = sum([["-i", f] for f in files], []); n = len(files)
    flt = "".join(f"[{i}:a]aresample=44100,aformat=channel_layouts=mono,apad=pad_dur=0.6[a{i}];" for i in range(n)) + "".join(f"[a{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[o]"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", flt, "-map", "[o]", "-c:a", "libmp3lame", "-b:a", "128k", f"{H}/../media/{tag}-4files.mp3"], check=True)
print("ok")
