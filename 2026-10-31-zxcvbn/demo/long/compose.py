"""롱폼 합치기: 미리보기(과정 애니메이션 앞 15초) + 본편 프레임 + 무음 소리 트랙(음성은 나중에 입힘).
사용: python3 compose.py <본편 프레임 폴더> <과정 애니메이션.mp4> <출력.mp4>"""
import json, os, subprocess, sys, tempfile

frames, anim, out = sys.argv[1:4]
here = os.path.dirname(os.path.abspath(__file__))
src = open(f"{here}/script.js", encoding="utf-8").read()
S = json.loads(src[src.index("{"): src.rindex("}") + 1])
pre = S["preview"]["dur"]; total = pre + sum(c["dur"] for c in S["chapters"]); tmp = tempfile.mkdtemp()
run = lambda *a: subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)
enc = ["-c:v", "libx264", "-preset", "slow", "-crf", "16", "-tune", "animation", "-sws_flags", "spline+accurate_rnd+full_chroma_int", "-pix_fmt", "yuv420p", "-r", "30"]
run("-t", str(pre), "-i", anim, *enc, f"{tmp}/pre.mp4")
run("-framerate", "30", "-i", f"{frames}/%05d.png", *enc, f"{tmp}/body.mp4")
open(f"{tmp}/list.txt", "w").write(f"file '{tmp}/pre.mp4'\nfile '{tmp}/body.mp4'\n")
run("-f", "concat", "-safe", "0", "-i", f"{tmp}/list.txt", "-c", "copy", f"{tmp}/video.mp4")
run("-i", f"{tmp}/video.mp4", "-f", "lavfi", "-t", str(total), "-i", "anullsrc=r=44100:cl=stereo", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-shortest", out)
print("saved", out, f"{total:.1f}s")
