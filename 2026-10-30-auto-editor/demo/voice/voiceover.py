"""운영자가 만든 내레이션 음성(mp3 한 파일)을 문장별로 잘라 영상의 자막 구간에 맞춰 얹고, 배경음악을 깐다.
사용: python3 voiceover.py <long|shorts> <내레이션.mp3> <원본 영상.mp4> <배경음악.wav|없음> <출력.mp4>
- 문장 나누기: 침묵 기준으로 조각낸 뒤, 글자 수 비율로 조각들을 문장에 순서대로 배정(동적 계획법)
- 배치: 각 문장을 자막 시작 0.1초 뒤에 놓되, 앞 문장과 겹치면 바로 뒤로 민다
- 섞기: 원래 영상 소리(시연 영상 소리) + 내레이션 + 배경음악(목소리가 나올 때 자동으로 작아짐)"""
import json, re, subprocess, sys
from pathlib import Path

kind, voice, video, bgm, out = sys.argv[1:6]
here = Path(__file__).parent
cues = json.loads((here.parent / "narration" / "cues.json").read_text(encoding="utf-8"))[kind]
lines = [c[2] for c in cues]
run = lambda *a: subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)
dur_of = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)

D = dur_of(voice)
def speech(d, noise=-38):
    o = subprocess.run(["ffmpeg", "-hide_banner", "-i", voice, "-af", f"silencedetect=noise={noise}dB:d={d}", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", o)]; en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", o)]
    sp, cur = [], 0.0
    for s, e in zip(st, en + [D] * (len(st) - len(en))):
        if s > cur + 0.05: sp.append((cur, s))
        cur = e
    if cur < D - 0.05: sp.append((cur, D))
    return sp

S = speech(0.12)
w = [max(1, len(re.sub(r"[\s,!?]", "", l))) for l in lines]
n, m = len(lines), len(S)
assert m >= n, f"조각 {m}개 < 문장 {n}개"
rate = sum(b - a for a, b in S) / sum(w)
INF = 1e18; dp = [[INF] * (m + 1) for _ in range(n + 1)]; bk = [[0] * (m + 1) for _ in range(n + 1)]; dp[0][0] = 0
for i in range(1, n + 1):
    exp = w[i - 1] * rate
    for j in range(i, m + 1):
        for k in range(max(i - 1, j - 8), j):
            if dp[i - 1][k] >= INF: continue
            gaps = [S[t + 1][0] - S[t][1] for t in range(k, j - 1)]
            c = dp[i - 1][k] + ((S[j - 1][1] - S[k][0] - sum(gaps)) - exp) ** 2 / max(exp, 0.4) + 3 * max(0, max(gaps or [0]) - 0.35)
            if c < dp[i][j]: dp[i][j], bk[i][j] = c, k
j, spans = m, []
for i in range(n, 0, -1):
    k = bk[i][j]; spans.append((S[k][0], S[j - 1][1])); j = k
spans = spans[::-1]

prev, place, late = 0.0, [], []
for (ca, cb, t), (a, b) in zip(cues, spans):
    a, b = max(0, a - 0.06), b + 0.08
    st = max(ca + 0.1, prev + 0.12)
    if st - ca > 0.6: late.append((round(ca, 1), round(st - ca, 2), t))
    place.append((st, a, b)); prev = st + (b - a)
for (st, a, b), t in zip(place, lines):
    print(f"{st:7.2f}s  ({b - a:4.1f}s)  {t}")
print("늦어진 문장:", late or "없음")

V = dur_of(video)
has_audio = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", video], capture_output=True, text=True).stdout.strip()
if not has_audio:  # 소리 없는 영상(과정 애니메이션)이면 무음 트랙을 붙여서 진행
    tmpv = str(Path(out).with_suffix(".silent.mp4"))
    run("-i", video, "-f", "lavfi", "-t", f"{V:.3f}", "-i", "anullsrc=r=44100:cl=stereo", "-c:v", "copy", "-c:a", "aac", "-shortest", tmpv); video = tmpv
fl = [f"[1:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={b - a - 0.03:.3f}:d=0.03,adelay={int(st * 1000)}|{int(st * 1000)}[s{i}]"
      for i, (st, a, b) in enumerate(place)]
fl.append("".join(f"[s{i}]" for i in range(len(place))) + f"amix=inputs={len(place)}:normalize=0,apad=whole_dur={V},volume=1.2[vo]")
fl.append(f"[0:a]aresample=44100,apad=whole_dur={V},volume=1.3[orig]")
inputs = ["-i", video, "-i", voice]
if bgm != "없음":
    inputs += ["-stream_loop", "-1", "-i", bgm]
    fl.append("[vo]asplit[vo1][vo2];[orig]asplit[or1][or2];[vo2][or2]amix=inputs=2:normalize=0[key]")
    fl.append(f"[2:a]atrim=0:{V},volume=0.22[bg];[bg][key]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=400[bgd]")
    fl.append(f"[vo1][or1][bgd]amix=inputs=3:normalize=0,afade=t=out:st={V - 2:.2f}:d=2,alimiter=limit=0.95[a]")
else:
    fl.append("[vo][orig]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]")
run(*inputs, "-filter_complex", ";".join(fl), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{V:.3f}", out)
if not has_audio: Path(video).unlink()
print("saved", out)
