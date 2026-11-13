"""영상용 자료: render/data.js (파형 크기 줄인 값) + render/img/*.png (스펙트로그램 띠, 축 없음)
사용: python3 make_data.py (test_all.py 다음)"""
import json, os, numpy as np, soundfile as sf, matplotlib
matplotlib.use("Agg"); import matplotlib.pyplot as plt
H = os.path.dirname(os.path.abspath(__file__)); I = f"{H}/render/img"; os.makedirs(I, exist_ok=True)
R = json.load(open(f"{H}/results.json", encoding="utf-8"))
F = {"noisy": "samples/잡음_선풍기.wav", "def": "out/선풍기_기본.wav", "smp": "out/선풍기_견본.wav", "clean": "samples/깨끗한말.wav",
     "o_noisy": "samples/잡음_옆사람말.wav", "o_def": "out/옆사람말_기본.wav", "k_noisy": "samples/잡음_키보드.wav", "k_def": "out/키보드_기본.wav"}
wave = {}
for k, fn in F.items():
    y, sr = sf.read(f"{H}/{fn}"); n = 480; b = len(y) // n
    wave[k] = [round(float(np.abs(y[i * b:(i + 1) * b]).max()), 3) for i in range(n)]
    fig = plt.figure(figsize=(16, 3.2), dpi=100); ax = fig.add_axes([0, 0, 1, 1]); ax.axis("off")
    ax.specgram(y, NFFT=1024, Fs=sr, noverlap=768, cmap="magma", vmin=-130, vmax=-40); ax.set_ylim(0, 6000)
    fig.savefig(f"{I}/{k}.png"); plt.close(fig)
open(f"{H}/render/data.js", "w", encoding="utf-8").write("const WAVE = " + json.dumps(wave) + ";\nconst RES = " + json.dumps(R, ensure_ascii=False) + ";\n")
print("ok")
