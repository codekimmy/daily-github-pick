"""운영자 음성(대본 전체를 이어 읽은 mp3)을 문장별로 나눠 실제 길이를 잰다 → lengths.json, segments.json
문장 경계: 무음 구간 후보 중에서, 문장 글자 수에 비례한 예상 길이와 가장 잘 맞는 조합을 동적 계획법으로 고름 (2026-11-12 align.py 방식)
사용: python3 split.py <음성.mp3> [long|shorts]"""
import json, re, subprocess, sys
from pathlib import Path
mp3 = sys.argv[1]; KIND = sys.argv[2] if len(sys.argv) > 2 else "long"; here = Path(__file__).parent
lines = [l.strip() for l in open(here.parents[1] / f"narration-{KIND}-text.txt", encoding="utf-8-sig") if l.strip()]
n = len(lines); chars = [len(re.sub(r"[\s,!?]", "", l)) for l in lines]
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]))
log = subprocess.run(["ffmpeg", "-hide_banner", "-i", mp3, "-af", "silencedetect=noise=-35dB:d=0.18", "-f", "null", "-"], capture_output=True, text=True).stderr
sil = [(float(e) - float(d), float(e)) for e, d in re.findall(r"silence_end: ([\d.]+) \| silence_duration: ([\d.]+)", log)]
start = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
end = sil[-1][0] if sil and sil[-1][1] > dur - 0.3 else dur
cand = [(s, e) for s, e in sil if s > start + 0.3 and e < end - 0.3]; m = len(cand)
rate = (end - start - sum(e - s for s, e in cand) * (n - 1) / max(m, 1)) / sum(chars)
cost = lambda d, i: ((d - chars[i] * rate) / max(chars[i] * rate, .5)) ** 2 - 0.02 * 0  # 길이 맞춤
INF = float("inf"); best = [[INF] * (m + 1) for _ in range(n)]; back = [[-2] * (m + 1) for _ in range(n)]
for j in range(m): best[0][j] = cost(cand[j][0] - start, 0); back[0][j] = -1
for i in range(1, n):
    for j in range(m + 1):
        if (i < n - 1) == (j == m): continue
        bj = end if j == m else cand[j][0]
        for k in range(j):
            if best[i - 1][k] < INF:
                c = best[i - 1][k] + cost(bj - cand[k][1], i) - 0.3 * (cand[k][1] - cand[k][0])  # 긴 쉼을 경계로 더 선호
                if c < best[i][j]: best[i][j], back[i][j] = c, k
segs, j = [], m
for i in range(n - 1, -1, -1):
    k = back[i][j]; segs.append((start if k == -1 else cand[k][1], end if j == m else cand[j][0])); j = k
segs.reverse()
rep = [{"text": t, "audio": [round(s, 3), round(e, 3)], "len": round(e - s, 2), "expect": round(c * rate, 2)} for t, (s, e), c in zip(lines, segs, chars)]
json.dump(rep, open(here / f"segments-{KIND}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump([r["len"] for r in rep], open(here / f"lengths-{KIND}.json", "w"), indent=0)
print(f"문장 {n}개, 말 {end - start:.1f}초, 무음 후보 {m}개")
for r in rep:
    flag = " ⚠" if abs(r["len"] - r["expect"]) > max(1.0, r["expect"] * .35) else ""
    print(f'{r["audio"][0]:7.2f} {r["len"]:5.2f} (예상 {r["expect"]:5.2f}){flag} {r["text"][:30]}')
