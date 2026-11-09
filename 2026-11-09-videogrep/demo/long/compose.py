"""롱폼 합치기: 미리보기(과정 애니메이션 앞 15초, 본편과 0.5초 겹쳐 바뀜) + 본편 프레임 + 무음 소리 트랙(음성은 나중에 입힘).
사용: python3 compose.py <본편 프레임 폴더> <과정 애니메이션.mp4> <출력.mp4>"""
import json, os, subprocess, sys, tempfile

frames, anim, out = sys.argv[1:4]
here = os.path.dirname(os.path.abspath(__file__))
src = open(f"{here}/script.js", encoding="utf-8").read()
S = json.loads(src[src.index("{"): src.rindex("}") + 1])
pre = S["preview"]["dur"]; total = pre + sum(c["dur"] for c in S["chapters"]); tmp = tempfile.mkdtemp()
run = lambda *a: subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)
enc = ["-c:v", "libx264", "-preset", "slow", "-crf", "16", "-tune", "animation", "-sws_flags", "spline+accurate_rnd+full_chroma_int", "-pix_fmt", "yuv420p", "-r", "30"]
# 깜빡임 방지: 미리보기 끝 0.5초와 본편 첫 0.5초를 겹쳐 바꿈(xfade). 미리보기를 0.5초 더 잘라 와서 전체 길이·장 시각은 그대로
run("-t", str(pre + .5), "-i", anim, "-framerate", "30", "-i", f"{frames}/%05d.png",
    "-filter_complex", f"[0:v]fps=30,settb=AVTB[a];[1:v]fps=30,settb=AVTB[b];[a][b]xfade=transition=fade:duration=0.5:offset={pre}", *enc, f"{tmp}/video.mp4")
run("-i", f"{tmp}/video.mp4", "-f", "lavfi", "-t", str(total), "-i", "anullsrc=r=44100:cl=stereo", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-shortest", out)
print("saved", out, f"{total:.1f}s")
