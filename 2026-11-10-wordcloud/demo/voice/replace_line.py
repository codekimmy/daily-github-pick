"""음성을 입힌 영상에서 문장 하나만 새 녹음으로 바꾼다 (나머지 음성은 그대로).
사용: python3 replace_line.py <음성 영상.mp4> <새 문장.mp3> <출력.mp4> <지울 시작초> <지울 끝초> <새 문장 놓을 초>
새 녹음의 앞뒤 무음은 자동으로 잘라 냄"""
import re, subprocess, sys
src, clip, out, a, b, at = sys.argv[1], sys.argv[2], sys.argv[3], *map(float, sys.argv[4:7])
d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", clip]))
log = subprocess.run(["ffmpeg", "-hide_banner", "-i", clip, "-af", "silencedetect=noise=-35dB:d=0.1", "-f", "null", "-"], capture_output=True, text=True).stderr
ss = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]; se = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
s0 = max(0, (se[0] if ss and ss[0] < .05 else 0) - .05); e0 = min(d, (ss[-1] if ss and ss[-1] > d - .5 else d) + .08)
V = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src]))
fl = (f"[0:a]volume=enable='between(t,{a},{b})':volume=0[v];"
      f"[1:a]atrim={s0:.3f}:{e0:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={e0 - s0 - .03:.3f}:d=0.03,aformat=sample_rates=44100:channel_layouts=stereo,adelay={int(at * 1000)}:all=1[n];"
      f"[v][n]amix=inputs=2:normalize=0:duration=first[o]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-i", clip, "-filter_complex", fl, "-map", "0:v", "-map", "[o]", "-c:v", "copy",
                "-c:a", "aac", "-b:a", "192k", "-t", f"{V:.3f}", "-movflags", "+faststart", out], check=True)
print("saved", out, f"새 문장 {e0 - s0:.2f}초를 {at}초에 놓음 ({a}~{b}초 기존 음성 지움)")
