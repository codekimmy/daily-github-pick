"""결과 그림 → ../media/ : 스펙트로그램비교.png, 잡음크기비교.png, 말소리크기.png, 들어보기 mp3 (전·후)
사용: python3 make_images.py (test_all.py 다음)"""
import json, os, subprocess, numpy as np, soundfile as sf, matplotlib
matplotlib.use("Agg"); import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
for f in ["/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"]:
    if os.path.exists(f): fm.fontManager.addfont(f)
plt.rcParams.update({"font.family": "Noto Sans CJK JP", "axes.unicode_minus": False, "figure.facecolor": "#0d1117", "axes.facecolor": "#161b22",
                     "text.color": "#f0f3f6", "axes.labelcolor": "#f0f3f6", "xtick.color": "#9aa7b8", "ytick.color": "#9aa7b8", "axes.edgecolor": "#30363d"})
H = os.path.dirname(os.path.abspath(__file__)); M = f"{H}/../media"; R = json.load(open(f"{H}/results.json", encoding="utf-8"))
# 1) 스펙트로그램 (소리를 높낮이×시간 그림으로): 잡음 섞인 녹음 / 기본 / 견본 지정
fig, ax = plt.subplots(3, 1, figsize=(12, 8.4), dpi=110)
for a, (fn, title) in zip(ax, [("samples/잡음_선풍기.wav", "① 선풍기 잡음이 섞인 가상 회의 녹음 (말 없는 구간 잡음 %.1f dB)" % R["cases"]["선풍기"]["before"]["quiet_db"]),
                              ("out/선풍기_기본.wav", "② noisereduce 기본 설정 (%.1f dB, %.2f초)" % (R["cases"]["선풍기"]["runs"]["기본(stationary=False)"]["quiet_db"], R["cases"]["선풍기"]["runs"]["기본(stationary=False)"]["sec"])),
                              ("out/선풍기_견본.wav", "③ 맨 앞 1.4초를 잡음 견본으로 지정 (%.1f dB)" % R["cases"]["선풍기"]["runs"]["잡음 견본 지정"]["quiet_db"])]):
    y, sr = sf.read(f"{H}/{fn}")
    a.specgram(y, NFFT=1024, Fs=sr, noverlap=768, cmap="magma", vmin=-130, vmax=-40)
    a.set_ylim(0, 6000); a.set_title(title, loc="left", fontsize=13, color="#f0f3f6"); a.set_ylabel("높낮이(Hz)", fontsize=10)
ax[-1].set_xlabel("시간(초)  ·  밝을수록 큰 소리, 아래쪽 띠와 바탕 점무늬가 잡음", fontsize=11)
fig.tight_layout(); fig.savefig(f"{M}/스펙트로그램비교.png"); plt.close(fig)
# 2) 잡음 4가지: 말 없는 구간 잡음 크기 (전 / 기본 / 견본)
names = ["선풍기", "쉬소리", "키보드", "옆사람말"]; lab = ["선풍기 웅웅", "녹음기 '쉬~'", "키보드 딸깍", "옆자리 말소리"]
B = [R["cases"][n]["before"]["quiet_db"] for n in names]; D = [R["cases"][n]["runs"]["기본(stationary=False)"]["quiet_db"] for n in names]
S = [R["cases"][n]["runs"]["잡음 견본 지정"]["quiet_db"] for n in names]
fig, a = plt.subplots(figsize=(12, 5.6), dpi=110); x = np.arange(4); w = .27
for i, (v, c, l) in enumerate([(B, "#ff7b72", "잡음 섞인 녹음"), (D, "#58a6ff", "기본 설정"), (S, "#7ee787", "잡음 견본 지정")]):
    bars = a.bar(x + (i - 1) * w, [80 + t for t in v], w, color=c, label=l)
    for b, t in zip(bars, v): a.text(b.get_x() + b.get_width() / 2, b.get_height() + .8, f"{t:.1f}", ha="center", fontsize=10, color="#f0f3f6")
a.set_xticks(x, lab, fontsize=13); a.set_yticks([0, 20, 40, 60], ["-80", "-60", "-40", "-20"]); a.set_ylabel("말 없는 구간 잡음 크기 (dB, 낮을수록 조용)")
a.set_title("noisereduce 시연: 잡음 4가지를 넣은 가상 녹음의 '말 없는 구간' 소리 크기", loc="left", fontsize=14)
a.legend(facecolor="#161b22", edgecolor="#30363d", labelcolor="#f0f3f6"); fig.tight_layout(); fig.savefig(f"{M}/잡음크기비교.png"); plt.close(fig)
# 3) 말소리 크기 (말하는 구간) — 기본 설정은 말소리도 작아짐
c = R["cases"]["선풍기"]; vals = [R["clean"]["speech_db"], c["before"]["speech_db"], c["runs"]["기본(stationary=False)"]["speech_db"], c["runs"]["덜 지우기 0.5"]["speech_db"], c["runs"]["잡음 견본 지정"]["speech_db"]]
labs = ["깨끗한 원본\n(잡음 없음)", "선풍기 잡음\n섞인 녹음", "기본 설정", "세기 0.5\n(덜 지우기)", "잡음 견본\n지정"]
fig, a = plt.subplots(figsize=(12, 5.4), dpi=110)
bars = a.bar(labs, [60 + v for v in vals], color=["#9aa7b8", "#ff7b72", "#58a6ff", "#d2a8ff", "#7ee787"], width=.6)
for b, v in zip(bars, vals): a.text(b.get_x() + b.get_width() / 2, b.get_height() + .5, f"{v:.1f} dB", ha="center", fontsize=12, color="#f0f3f6")
a.axhline(60 + vals[0], color="#9aa7b8", ls="--", lw=1); a.set_yticks([0, 10, 20, 30, 40], ["-60", "-50", "-40", "-30", "-20"]); a.tick_params(axis="x", labelsize=12)
a.set_ylabel("말하는 구간 소리 크기 (dB)"); a.set_title("말소리 크기 비교: 기본 설정은 말소리도 약 9dB 작아지고, 잡음 견본을 지정하면 원본에 더 가까움", loc="left", fontsize=13)
fig.tight_layout(); fig.savefig(f"{M}/말소리크기.png"); plt.close(fig)
# 4) 들어보기용 mp3 (선풍기 잡음 전 / 기본 / 견본)
for src, dst in [("samples/잡음_선풍기.wav", "들어보기_1_잡음섞인녹음.mp3"), ("out/선풍기_기본.wav", "들어보기_2_기본설정.mp3"), ("out/선풍기_견본.wav", "들어보기_3_잡음견본지정.mp3"),
                 ("samples/잡음_옆사람말.wav", "들어보기_4_옆자리말소리_전.mp3"), ("out/옆사람말_기본.wav", "들어보기_5_옆자리말소리_후.mp3")]:
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", f"{H}/{src}", "-b:a", "64k", f"{M}/{dst}"], check=True)
print("ok")
