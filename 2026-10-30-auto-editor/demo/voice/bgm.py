"""저작권 걱정 없는 배경음악을 직접 합성 (밝고 가벼운 로파이 느낌, 92BPM).
사용: python3 bgm.py <길이초> <출력.wav>"""
import sys, numpy as np, wave
DUR = float(sys.argv[1]); OUT = sys.argv[2]
SR = 44100; BPM = 92; BEAT = 60 / BPM; BAR = BEAT * 4
N = int(SR * DUR); L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
mid = lambda m: 440 * 2 ** ((m - 69) / 12)

def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N: return
    sig = sig[:N - i] * gain
    L[i:i + len(sig)] += sig * (1 - max(0, pan))
    R[i:i + len(sig)] += sig * (1 + min(0, pan))

def env(n, a, d, s, r):
    t = np.arange(n) / SR; e = np.ones(n) * s; tot = n / SR
    e[t < a] = t[t < a] / a
    m = (t >= a) & (t < a + d); e[m] = 1 - (1 - s) * (t[m] - a) / d
    m = t > tot - r; e[m] *= np.clip((tot - t[m]) / r, 0, 1)
    return e

def pad(freqs, dur):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for det in (-0.12, 0.0, 0.12):
            ff = f * 2 ** (det / 12)
            s += np.sin(2 * np.pi * ff * t) + 0.25 * np.sin(4 * np.pi * ff * t)
    return s / (len(freqs) * 3) * env(n, 0.6, 0.5, 0.8, 0.8)

def pluck(f, dur=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(4 * np.pi * f * t) * np.exp(-t * 12) + 0.2 * np.sin(6 * np.pi * f * t) * np.exp(-t * 18)
    return s * np.exp(-t * 5.5) * env(n, 0.004, 0.05, 1, 0.05)

def bass(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * env(n, 0.01, 0.2, 0.7, 0.1)

def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 52 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)

def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR); t = np.arange(n) / SR
    s = rng.standard_normal(n); s = np.diff(np.concatenate([[0], s]))
    return s * np.exp(-t * (18 if open_ else 70))

def snare():
    n = int(0.22 * SR); t = np.arange(n) / SR
    return (0.6 * rng.standard_normal(n) * np.exp(-t * 22) + 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25))

# I - V - vi - IV (C major) 진행, 마디마다 한 화음
prog = [(48, [60, 64, 67, 71]), (43, [59, 62, 67, 69]), (45, [57, 60, 64, 67]), (41, [57, 60, 65, 69])]
arp = [0, 2, 1, 3, 2, 1, 3, 2]
bars = int(DUR / BAR) + 1
for b in range(bars):
    t0 = b * BAR; root, ch = prog[b % 4]
    sect = (b // 8) % 4                 # 8마디마다 편곡을 살짝 바꿈
    add(pad([mid(m) for m in ch], BAR + 0.6), t0, 0, 0.30)
    add(bass(mid(root), BEAT * 1.6), t0, 0, 0.42); add(bass(mid(root), BEAT * 0.9), t0 + BEAT * 2.5, 0, 0.32)
    if sect != 0 or b >= 4:
        for k in range(8):
            m = ch[arp[k]] + 12; add(pluck(mid(m)), t0 + k * BEAT / 2, (-0.35 if k % 2 else 0.35), 0.15)
    if b >= 2:
        for k in (0, 2.5): add(kick(), t0 + k * BEAT, 0, 0.55)
        for k in (1, 3): add(snare(), t0 + k * BEAT, 0, 0.16)
        for k in range(8): add(hat(k == 7), t0 + k * BEAT / 2 + (0.012 if k % 2 else 0), 0.2, 0.05)

mix = np.stack([L, R], 1)
# 부드러운 로파이 느낌: 간단한 저역통과
from scipy.signal import butter, lfilter
bb, aa = butter(2, 3800 / (SR / 2))
mix = lfilter(bb, aa, mix, axis=0)
fade = np.ones(N); fi = int(2 * SR); fo = int(4 * SR)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade[:, None]; mix /= np.max(np.abs(mix)) + 1e-9; mix *= 0.8
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('saved', OUT, DUR)
