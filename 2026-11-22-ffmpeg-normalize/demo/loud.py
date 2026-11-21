"""녹화용 보조 도구: 파일마다 통합 음량(LUFS, 사람 귀 기준 소리 크기)을 ffmpeg ebur128 필터로 재서 막대로 보여 준다.
사용: python3 loud.py 파일 [파일 …]   (0에 가까울수록 큰 소리, -23 = 방송 기준)"""
import re, subprocess, sys, os, unicodedata
pad = lambda s, n: s + " " * (n - sum(2 if unicodedata.east_asian_width(c) in "WF" else 1 for c in s))
for f in sys.argv[1:]:
    e = subprocess.run(["ffmpeg", "-nostats", "-i", f, "-map", "0:a:0", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    i = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", e)[-1])
    print(f"{pad(os.path.basename(f), 18)} {i:6.1f} LUFS  " + "█" * max(1, int((i + 50) / 1.2)))
