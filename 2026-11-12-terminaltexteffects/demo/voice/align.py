"""음성 파일(대본 전체를 이어 읽은 것)을 문장별로 잘라, 롱폼 영상의 구간 시간(cues.json)에 맞춰 놓는다.
사용: python3 align.py <음성.mp3> <영상.mp4> <출력.mp4> [long|shorts] [구간별 늦출 초 0,0.4,…]  (기본 long)
문장 경계: 무음 구간 후보 중에서, 문장 글자 수에 비례한 예상 길이와 가장 잘 맞는 조합을 동적 계획법으로 고름."""
import json, re, subprocess, sys
from pathlib import Path

mp3, video, out = sys.argv[1:4]
here = Path(__file__).parent
KIND = sys.argv[4] if len(sys.argv) > 4 else "long"
OFF = [float(x) for x in sys.argv[5].split(",")] if len(sys.argv) > 5 else []  # 구간별로 소리를 늦출 초 (앞뒤 쉼을 고르게 할 때, 2026-11-11)
cues = json.load(open(here.parent / "narration/cues.json", encoding="utf-8"))[KIND]
n = len(cues)
vdur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video]))
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]))
log = subprocess.run(["ffmpeg", "-hide_banner", "-i", mp3, "-af", "silencedetect=noise=-35dB:d=0.15", "-f", "null", "-"], capture_output=True, text=True).stderr
sil = [(float(e) - float(d), float(e)) for e, d in re.findall(r"silence_end: ([\d.]+) \| silence_duration: ([\d.]+)", log)]
# 앞뒤 무음 제외한 실제 말 시작·끝
start = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
end = sil[-1][0] if sil and sil[-1][1] > dur - 0.05 else dur
cand = [(s, e) for s, e in sil if s > start + 0.3 and e < end - 0.3]
chars = [len(re.sub(r"[\s,!?]", "", c[2])) for c in cues]
speech = end - start - 0.0
rate = speech / sum(chars)
# DP: 문장 i 의 끝 경계로 후보 j 를 고름 (경계 k개 = n-1)
INF = float("inf"); m = len(cand)
pos = lambda j: start if j == -1 else (end if j == m else None)
def seg_cost(a_end, b_start, i):  # 문장 i 가 a_end~b_start 동안 말해짐
    d = b_start - a_end; e = chars[i] * rate
    return ((d - e) / max(e, 0.5)) ** 2
best = [[INF] * (m + 1) for _ in range(n)]; back = [[-2] * (m + 1) for _ in range(n)]
for j in range(m):  # 첫 문장 끝 = 후보 j
    best[0][j] = seg_cost(start, cand[j][0], 0); back[0][j] = -1
for i in range(1, n):
    for j in range(m + 1):
        bj = end if j == m else cand[j][0]
        if i < n - 1 and j == m: continue
        if i == n - 1 and j != m: continue
        for k in range(j):
            if best[i - 1][k] == INF: continue
            c = best[i - 1][k] + seg_cost(cand[k][1], bj, i)
            if c < best[i][j]: best[i][j], back[i][j] = c, k
segs = []; j = m
for i in range(n - 1, -1, -1):
    k = back[i][j]
    s = start if k == -1 else cand[k][1]; e = end if j == m else cand[j][0]
    segs.append((s, e)); j = k
segs.reverse()
report = []
for (s, e), (a, b, t), ch in zip(segs, cues, chars):
    report.append({"cue": [a, b], "text": t, "audio": [round(s, 2), round(e, 2)], "len": round(e - s, 2), "expect": round(ch * rate, 2), "fits": e - s <= b - a + 0.05})
json.dump(report, open(here / ("segments.json" if KIND == "long" else f"segments-{KIND}.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
# 소리 이어 붙이기: 문장마다 구간 시작 시각에 놓음 (앞뒤 0.05초 여유)
parts, labels = [], []
for i, ((s, e), (a, b, t)) in enumerate(zip(segs, cues)):
    s0, e0 = max(0, s - 0.05), min(dur, e + 0.08)
    parts.append(f"[0:a]atrim={s0:.3f}:{e0:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={e0 - s0 - 0.03:.3f}:d=0.03,adelay={int((a + 0.15 + (OFF[i] if i < len(OFF) else 0)) * 1000)}:all=1[a{i}]")
    labels.append(f"[a{i}]")
filt = ";".join(parts) + ";" + "".join(labels) + f"amix=inputs={n}:normalize=0,aformat=sample_rates=44100:channel_layouts=stereo,apad[out]"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, "-i", video, "-filter_complex", filt, "-map", "1:v", "-map", "[out]",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{vdur:.3f}", "-movflags", "+faststart", out], check=True)
bad = [r for r in report if not r["fits"]]
print("saved", out, f"문장 {n}개, 구간을 넘는 문장 {len(bad)}개", f"말 속도 {1/rate:.2f}글자/초")
for r in bad: print("  넘침:", r["cue"], r["len"], "초 >", round(r["cue"][1] - r["cue"][0], 2), r["text"])
