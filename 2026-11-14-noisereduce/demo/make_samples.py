"""시연용 가상 녹음 만들기 (모두 직접 합성, 저작권 걱정 없음).
- 말소리: espeak-ng(npm, 인터넷·모델 없이 합성)로 읽은 한국어 문장 → samples/깨끗한말.wav
- 잡음 4가지(직접 계산으로 만든 소리)를 섞음 → samples/잡음_*.wav
사용: python3 make_samples.py"""
import subprocess, os, numpy as np, soundfile as sf
from scipy.signal import resample_poly, lfilter
H = os.path.dirname(os.path.abspath(__file__)); S = f"{H}/samples"; os.makedirs(S, exist_ok=True)
SR = 22050; rng = np.random.default_rng(7)
LINES = ["안녕하세요. 오늘 회의를 시작하겠습니다.", "지난주 매출은 조금 늘었습니다.", "다음 달 일정은 금요일까지 정리해 주시기 바랍니다.",
         "자료는 공유 폴더에 올려 두었습니다.", "질문이 있으면 지금 말씀해 주십시오."]
def tts(text, voice="ko", speed="140"):
    p = f"{S}/_t.wav"; subprocess.run(["node", f"{H}/tts/tts.mjs", text, p, voice, speed], check=True)
    d, sr = sf.read(p); os.remove(p); assert sr == SR; return d
parts = [np.zeros(int(SR * 1.5))]
for l in LINES: parts += [tts(l), np.zeros(int(SR * 1.0))]
clean = np.concatenate(parts); clean = clean / np.abs(clean).max() * 0.5
n = len(clean); t = np.arange(n) / SR
def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
def at(x, db):  # 잡음 크기를 정한 dB(전체 최대 1 기준 RMS)로
    return x / np.sqrt(np.mean(x ** 2)) * 10 ** (db / 20)
# 1) 선풍기: 낮게 웅웅(분홍빛 잡음) + 120Hz 윙 소리 — 계속 같은 소리
white = rng.standard_normal(n)
pink = lfilter([0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400], white)
fan = at(pink, -30) + at(np.sin(2 * np.pi * 120 * t) + .5 * np.sin(2 * np.pi * 240 * t), -36)
# 2) 쉬~ 소리(녹음기 바탕 잡음): 높은 소리 위주
hiss = at(lfilter([1, -0.9], [1], rng.standard_normal(n)), -28)
# 3) 키보드 딸깍: 짧은 소리가 불규칙하게 — 계속 바뀌는 소리
key = np.zeros(n); pos = 0
while True:
    pos += int(SR * rng.uniform(0.12, 0.45))
    if pos + 600 >= n: break
    c = rng.standard_normal(600) * np.exp(-np.arange(600) / 60); key[pos:pos + 600] += c * rng.uniform(.5, 1)
key = at(key, -30) + at(rng.standard_normal(n), -55)
# 4) 옆자리 말소리: 다른 목소리(영어)로 다른 문장 — 말소리와 겹치는 잡음
other = tts("The weather is nice today. Let us go out for lunch after the meeting. I will bring the documents.", "en", "150")
other = np.tile(other, int(np.ceil(n / len(other))))[:n]; other = at(other, -26)
NOISES = {"선풍기": fan, "쉬소리": hiss, "키보드": key, "옆사람말": other}
sf.write(f"{S}/깨끗한말.wav", clean, SR, subtype="PCM_16")
for k, v in NOISES.items():
    mix = clean + v; sf.write(f"{S}/잡음_{k}.wav", mix, SR, subtype="PCM_16")
    print(k, "잡음", round(rms_db(v), 1), "dB / 말소리", round(rms_db(clean), 1), "dB")
print("길이", round(n / SR, 2), "초")
