"""롱폼에 넣을 실제 영상 조각을 프레임(jpg)과 소리(wav)로 뽑기.
사용: python3 prep_clips.py <작업폴더>  (lecture.mp4, runs/*.mp4 가 있어야 함)"""
import subprocess, sys
from pathlib import Path
work = Path(sys.argv[1])
CLIPS = {"orig": ("lecture.mp4", 0, 24), "cut": ("runs/default.mp4", 0, 22),
         "m05": ("runs/margin05.mp4", 0, 12), "fast4": ("runs/fast4.mp4", 0, 16)}
for name, (src, ss, dur) in CLIPS.items():
    d = work / "clips" / name; d.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(ss), "-t", str(dur), "-i", str(work / src),
                    "-vf", "fps=30,scale=1120:630", "-q:v", "4", str(d / "%05d.jpg")], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(ss), "-t", str(dur), "-i", str(work / src),
                    "-vn", "-ac", "2", "-ar", "44100", str(work / "clips" / f"{name}.wav")], check=True)
    print(name, len(list(d.glob("*.jpg"))), "프레임")
