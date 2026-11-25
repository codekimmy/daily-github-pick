"""운영자 음성의 문장들(segments-long.json)을 영상 속 문장 시각(cues-long.json, build.py voice 가 만듦)에 하나씩 놓아 입힌다.
사용: python3 place.py <음성.mp3> <영상.mp4> <출력.mp4> [long|shorts]"""
import json, subprocess, sys
from pathlib import Path
mp3, video, out = sys.argv[1:4]; here = Path(__file__).parent; K = sys.argv[4] if len(sys.argv) > 4 else "long"
seg = json.load(open(here / f"segments-{K}.json", encoding="utf-8")); cue = json.load(open(here / f"cues-{K}.json"))
assert len(seg) == len(cue)
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]))
vdur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video]))
parts, labels = [], []
for i, (r, (t, ln)) in enumerate(zip(seg, cue)):
    s0, e0 = max(0, r["audio"][0] - 0.05), min(dur, r["audio"][1] + 0.08)
    parts.append(f"[0:a]atrim={s0:.3f}:{e0:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={e0 - s0 - 0.03:.3f}:d=0.03,adelay={int((t + 0.1) * 1000)}:all=1[a{i}]")
    labels.append(f"[a{i}]")
filt = ";".join(parts) + ";" + "".join(labels) + f"amix=inputs={len(seg)}:normalize=0,aformat=sample_rates=44100:channel_layouts=stereo,apad[out]"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, "-i", video, "-filter_complex", filt, "-map", "1:v", "-map", "[out]",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{vdur:.3f}", "-movflags", "+faststart", out], check=True)
print("saved", out, len(seg), "문장")
