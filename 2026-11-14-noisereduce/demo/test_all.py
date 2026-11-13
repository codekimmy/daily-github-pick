"""noisereduce 시연 측정 → results.json, out/*.wav
- 말 없는 구간 잡음 크기(dB): 깨끗한 말소리가 0인 구간(시작 1.5초·문장 사이)에서 소리 크기
- 말소리 대비 잡음(SNR, dB): 깨끗한 원본과 비교해 남은 차이가 얼마나 작은지 (클수록 원본에 가까움)
사용: python3 test_all.py"""
import json, os, time, numpy as np, soundfile as sf, noisereduce as nr
H = os.path.dirname(os.path.abspath(__file__)); S = f"{H}/samples"; O = f"{H}/out"; os.makedirs(O, exist_ok=True)
clean, SR = sf.read(f"{S}/깨끗한말.wav")
# 말 없는 구간 = 깨끗한 말소리의 0.1초 창 크기가 아주 작은 곳
win = int(SR * .1); env = np.sqrt(np.convolve(clean ** 2, np.ones(win) / win, "same"))
quiet = env < 1e-3
def db(x): return round(float(20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)), 1)
def snr(y): return round(float(10 * np.log10(np.sum(clean ** 2) / np.sum((y - clean) ** 2))), 1)
def measure(y): return {"quiet_db": db(y[quiet]), "speech_db": db(y[~quiet]), "snr": snr(y)}
R = {"sr": SR, "len_s": round(len(clean) / SR, 2), "quiet_ratio": round(float(quiet.mean()), 3), "clean": measure(clean), "cases": {}}
nr.reduce_noise(y=clean[:SR], sr=SR)  # 첫 실행 준비(시간 측정에서 뺌)
for name in ["선풍기", "쉬소리", "키보드", "옆사람말"]:
    y, _ = sf.read(f"{S}/잡음_{name}.wav"); c = {"before": measure(y), "runs": {}}
    configs = {"기본(stationary=False)": dict(),
               "고정 잡음(stationary=True)": dict(stationary=True),
               "잡음 견본 지정": dict(stationary=True, y_noise=y[:int(SR * 1.4)]),
               "덜 지우기 0.5": dict(prop_decrease=0.5),
               "덜 지우기 0.8": dict(prop_decrease=0.8)}
    for k, kw in configs.items():
        t0 = time.perf_counter(); out = nr.reduce_noise(y=y, sr=SR, **kw); dt = time.perf_counter() - t0
        m = measure(out); m["sec"] = round(dt, 2); c["runs"][k] = m
        if k in ("기본(stationary=False)", "잡음 견본 지정"):
            sf.write(f"{O}/{name}_{'기본' if k.startswith('기본') else '견본'}.wav", out, SR, subtype="PCM_16")
    R["cases"][name] = c
    print(name, c["before"], {k: (v["quiet_db"], v["snr"], v["sec"]) for k, v in c["runs"].items()}, flush=True)
# 긴 녹음: 선풍기 잡음 녹음을 이어 붙여 10분·60분 처리 시간
y, _ = sf.read(f"{S}/잡음_선풍기.wav"); R["long"] = {}
for mins in [10, 60]:
    big = np.tile(y, int(np.ceil(mins * 60 * SR / len(y))))[: mins * 60 * SR]
    for k, kw in {"기본": {}, "고정 잡음": {"stationary": True}}.items():
        t0 = time.perf_counter(); nr.reduce_noise(y=big, sr=SR, **kw); dt = time.perf_counter() - t0
        R["long"][f"{mins}분 {k}"] = round(dt, 1); print(mins, k, round(dt, 1), flush=True)
    if mins == 60: break
json.dump(R, open(f"{H}/results.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
