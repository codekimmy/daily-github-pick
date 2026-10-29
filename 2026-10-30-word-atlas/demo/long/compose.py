"""롱폼 합치기: 미리보기(과정 애니메이션 앞 15초) + 본편 프레임 + 실제 발음 녹음(CC BY 4.0)을 제자리에 깔기.
사용: python3 compose.py <본편 프레임 폴더> <과정 애니메이션.mp4> <출력.mp4>"""
import json, os, subprocess, sys, tempfile

frames, anim, out = sys.argv[1:4]
here = os.path.dirname(os.path.abspath(__file__))
src = open(f"{here}/script.js", encoding="utf-8").read()
S = json.loads(src[src.index("{"): src.rindex("}") + 1])
pre = S["preview"]["dur"]
tmp = tempfile.mkdtemp()
run = lambda *a: subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)

run("-t", str(pre), "-i", anim, "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", f"{tmp}/pre.mp4")
run("-framerate", "30", "-i", f"{frames}/%05d.jpg", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", f"{tmp}/body.mp4")
open(f"{tmp}/list.txt", "w").write(f"file '{tmp}/pre.mp4'\nfile '{tmp}/body.mp4'\n")
run("-f", "concat", "-safe", "0", "-i", f"{tmp}/list.txt", "-c", "copy", f"{tmp}/video.mp4")

# 발음 녹음 배치
t0, clips = pre, []
for c in S["chapters"]:
    for at, name in c.get("audio", []):
        clips.append((t0 + at, f"{here}/audio/{name}.mp3"))
    t0 += c["dur"]
inputs, filt = [], []
for i, (at, f) in enumerate(clips):
    inputs += ["-i", f]
    ms = int(at * 1000)
    filt.append(f"[{i + 1}:a]aresample=44100,adelay={ms}|{ms}[a{i}]")
mix = "".join(f"[a{i}]" for i in range(len(clips)))
filt.append(f"[0:a]{mix}amix=inputs={len(clips) + 1}:normalize=0[aout]")
run("-f", "lavfi", "-t", str(t0), "-i", "anullsrc=r=44100:cl=stereo", *inputs,
    "-filter_complex", ";".join(filt), "-map", "[aout]", "-c:a", "aac", "-b:a", "160k", f"{tmp}/audio.m4a")
run("-i", f"{tmp}/video.mp4", "-i", f"{tmp}/audio.m4a", "-c:v", "copy", "-c:a", "copy", "-shortest", out)
print("saved", out, f"{t0:.1f}s, 발음 {len(clips)}개")
