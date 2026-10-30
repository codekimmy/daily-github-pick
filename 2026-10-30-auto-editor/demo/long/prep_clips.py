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
                    "-vf", "fps=30,scale=1120:630:flags=lanczos", str(d / "%05d.png")], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(ss), "-t", str(dur), "-i", str(work / src),
                    "-vn", "-ac", "2", "-ar", "44100", str(work / "clips" / f"{name}.wav")], check=True)
    # auto-editor 29.3.1의 빨리 감기(--when-silent speed:N) 결과에는 속도가 바뀌는 곳마다 검은 화면이 1장씩 낀다.
    # 영상에서 번쩍여 보이므로 바로 앞 장면으로 바꿔 넣는다 (README '주의할 점'에 기록)
    from PIL import Image, ImageStat
    fr = sorted(d.glob("*.png")); fixed = 0
    for i in range(1, len(fr)):
        if ImageStat.Stat(Image.open(fr[i]).convert("L")).mean[0] < 5:
            fr[i].write_bytes(fr[i - 1].read_bytes()); fixed += 1
    print(name, len(fr), "프레임", f"(검은 화면 {fixed}장 교체)" if fixed else "")
