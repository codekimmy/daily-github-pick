"""롱폼 합치기: 프레임(미리보기 장 포함, 장 사이는 long.html 안에서 크로스페이드) → mp4 + 무음 소리 트랙(음성은 나중에 입힘).
사용: python3 compose.py <프레임 폴더> <출력.mp4>"""
import subprocess, sys
frames, out = sys.argv[1:3]
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", f"{frames}/%05d.png", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
                "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-tune", "animation", "-sws_flags", "spline+accurate_rnd+full_chroma_int", "-pix_fmt", "yuv420p",
                "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", out], check=True)
print("saved", out)
