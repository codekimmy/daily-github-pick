"""롱폼 합치기: 미리보기(과정 애니메이션 앞 15초) + 본편 프레임 + 실제 영상 조각의 소리를 제자리에.
사용: python3 compose.py <본편 프레임 폴더> <과정 애니메이션.mp4> <clips 폴더> <출력.mp4>"""
import json, os, subprocess, sys, tempfile

frames, anim, clips, out = sys.argv[1:5]
here = os.path.dirname(os.path.abspath(__file__))
src = open(f"{here}/script.js", encoding="utf-8").read()
S = json.loads(src[src.index("{"): src.rindex("}") + 1])
pre = S["preview"]["dur"]; tmp = tempfile.mkdtemp()
run = lambda *a: subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)

run("-t", str(pre), "-i", anim, "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", f"{tmp}/pre.mp4")
run("-framerate", "30", "-i", f"{frames}/%05d.jpg", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", f"{tmp}/body.mp4")
open(f"{tmp}/list.txt", "w").write(f"file '{tmp}/pre.mp4'\nfile '{tmp}/body.mp4'\n")
run("-f", "concat", "-safe", "0", "-i", f"{tmp}/list.txt", "-c", "copy", f"{tmp}/video.mp4")

t0, placed = pre, []
for c in S["chapters"]:
    if "clip" in c:
        name, start, dur = c["clip"]; placed.append((t0 + start, f"{clips}/{name}.wav"))
    t0 += c["dur"]
inputs, filt = [], []
for i, (at, f) in enumerate(placed):
    inputs += ["-i", f]; ms = int(at * 1000)
    filt.append(f"[{i + 1}:a]aresample=44100,afade=t=in:d=0.3,adelay={ms}|{ms}[a{i}]")
filt.append("[0:a]" + "".join(f"[a{i}]" for i in range(len(placed))) + f"amix=inputs={len(placed) + 1}:normalize=0[aout]")
run("-f", "lavfi", "-t", str(t0), "-i", "anullsrc=r=44100:cl=stereo", *inputs, "-filter_complex", ";".join(filt),
    "-map", "[aout]", "-c:a", "aac", "-b:a", "160k", f"{tmp}/audio.m4a")
run("-i", f"{tmp}/video.mp4", "-i", f"{tmp}/audio.m4a", "-c:v", "copy", "-c:a", "copy", "-shortest", out)
print("saved", out, f"{t0:.1f}s, 영상 조각 소리 {len(placed)}개")
