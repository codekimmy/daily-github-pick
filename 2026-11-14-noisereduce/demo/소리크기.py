"""녹음의 '말 없는 앞부분' 잡음 크기를 dB로 보여 주는 녹화용 보조 도구. 사용: python3 소리크기.py 파일.wav [앞 몇 초]"""
import sys, numpy as np, soundfile as sf
y, sr = sf.read(sys.argv[1], always_2d=True); sec = float(sys.argv[2]) if len(sys.argv) > 2 else 1.4
q = y[: int(sr * sec)].mean(1); db = 20 * np.log10(np.sqrt(np.mean(q ** 2)) + 1e-12)
bar = "█" * max(0, int((db + 80) / 2))
print(f"{sys.argv[1].split('/')[-1]}\n   → 말 없는 앞 {sec}초 잡음 크기 {db:6.1f} dB  {bar}")
