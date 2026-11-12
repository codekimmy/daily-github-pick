"""저작권 걱정 없는 잔잔한 배경음악을 직접 합성: 천천히 바뀌는 화음(패드)과 낮은 베이스만 (북소리·맑은 음 없음, 64BPM).
맑은 음(벨·오르골 같은 높은 음)은 귀에 거슬린다는 운영자 요청으로 넣지 않음 (2026-11-09).
사용: python3 calm_bgm.py <길이초> <출력.wav>"""
import sys, wave
import numpy as np
from scipy.signal import butter, lfilter
DUR = float(sys.argv[1]); OUT = sys.argv[2]
SR = 44100; BEAT = 60 / 64; BAR = BEAT * 4
N = int(SR * DUR); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(3)
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i < 0: sig, i = sig[-i:], 0
    if i >= N: return
    sig = sig[:N - i] * gain; L[i:i + len(sig)] += sig * (1 - max(0, pan)); R[i:i + len(sig)] += sig * (1 + min(0, pan))
def pad(freqs, dur):  # 천천히 차오르고 천천히 사라지는 화음
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for det in (-0.07, 0.0, 0.07):
            ff = f * 2 ** (det / 12); s += np.sin(2 * np.pi * ff * t + rng.uniform(0, 6))
    e = np.minimum(1, t / 2.5) * np.minimum(1, (dur - t) / 2.5)
    return s / (len(freqs) * 3) * e * (0.85 + 0.15 * np.sin(2 * np.pi * 0.11 * t))
# Cmaj7 - Am7 - Fmaj7 - G6 (두 마디씩, 느리게)
prog = [(48, [60, 64, 67, 71]), (45, [57, 60, 64, 67]), (41, [57, 60, 65, 69]), (43, [55, 59, 62, 64])]
step = BAR * 2
for b in range(int(DUR / step) + 1):
    t0 = b * step; root, ch = prog[b % 4]
    add(pad([mid(m) for m in ch], step + 2.5), t0 - 1.0, 0, 0.32)
    add(np.sin(2 * np.pi * mid(root) * np.arange(int((step + 1) * SR)) / SR) * np.minimum(1, np.arange(int((step + 1) * SR)) / SR / 1.5) * np.exp(-np.arange(int((step + 1) * SR)) / SR / 6), t0, 0, 0.18)
mix = np.stack([L, R], 1)
bb, aa = butter(2, 1800 / (SR / 2))  # 높은 소리를 깎아 부드럽게; mix = lfilter(bb, aa, mix, axis=0)
# 아주 간단한 잔향(울림): 지연된 소리를 조금씩 더함
for d, g in [(0.23, .25), (0.37, .18), (0.53, .12)]:
    k = int(d * SR); mix[k:] += mix[:-k][:, ::-1] * g
fade = np.ones(N); fi, fo = int(3 * SR), int(4 * SR); fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade[:, None]; mix /= np.max(np.abs(mix)) + 1e-9; mix *= 0.8
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('saved', OUT, DUR)
