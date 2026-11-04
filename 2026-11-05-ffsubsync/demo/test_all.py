"""ffsubsync 시연 측정: 틀어진 자막 4종 + 소리 없는 영상 → 걸린 시간(3회 가운데 값), 찾은 어긋남, 고치기 전/후 오차.
사용: python3 test_all.py work   → results.json"""
import json, re, statistics, subprocess, sys, time, os
W = sys.argv[1]; T = json.load(open(f"{W}/truth.json", encoding="utf-8"))
truth = [c[0] for c in T["cues"]]
def starts(p):
    raw = open(p, "rb").read()
    try: txt = raw.decode("utf-8")
    except UnicodeDecodeError: txt = raw.decode("cp949")
    return [sum(float(x) * k for x, k in zip(re.split("[:,]", m)[:3], (3600, 60, 1))) + int(m[-3:]) / 1000
            for m in re.findall(r"(\d\d:\d\d:\d\d,\d\d\d) -->", txt)]
def err(p): d = [abs(a - b) for a, b in zip(starts(p), truth)]; return {"mean": round(sum(d) / len(d), 3), "max": round(max(d), 3), "per_line": [round(a - b, 2) for a, b in zip(starts(p), truth)]}
# ④ 중간에 장면이 빠진 판: 6번째 문장부터만 3초 늦음 (자막 일부만 밀림)
src = open(f"{W}/정답.srt", encoding="utf-8").read().split("\n\n")
def shift_block(b, s):
    def f(m):
        h, mi, se, ms = map(int, re.split("[:,]", m.group(0))); x = h * 3600 + mi * 60 + se + ms / 1000 + s
        h, r = divmod(x, 3600); mi, se = divmod(r, 60); return f"{int(h):02d}:{int(mi):02d}:{int(se):02d},{int(round((se - int(se)) * 1000)) % 1000:03d}"
    return re.sub(r"\d\d:\d\d:\d\d,\d\d\d", f, b)
open(f"{W}/중간부터밀리는자막.srt", "w", encoding="utf-8").write("\n\n".join(shift_block(b, 3.0) if i >= 5 else b for i, b in enumerate(src)))
# 소리 없는 영상(말소리가 없으면 맞출 기준이 없음)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{W}/라면영상.mp4", "-an", "-c:v", "copy", f"{W}/소리없는영상.mp4"], check=True)
CASES = [("늦은자막", "라면영상.mp4", "전체가 2.5초 늦음"), ("빠른자막", "라면영상.mp4", "전체가 1.7초 빠름"),
         ("점점밀리는자막", "라면영상.mp4", "프레임 속도가 다른 판(25 대 23.976) + 0.8초"),
         ("중간부터밀리는자막", "라면영상.mp4", "6번째 문장부터만 3초 늦음"), ("중간부터밀리는자막", "라면영상.mp4", "같은 자막 + 구간별 맞추기(--split-penalty)", ["--split-penalty"]),
         ("늦은자막", "소리없는영상.mp4", "소리 없는 영상 + 2.5초 늦은 자막"), ("늦은자막_cp949", "라면영상.mp4", "한글 CP949(완성형) 인코딩 자막 + 2.5초 늦음")]
R = {"version": subprocess.check_output(["ffsubsync", "--version"], text=True).strip(), "video_sec": T["dur"], "lines": len(truth), "cases": []}
subprocess.run(f"iconv -f utf-8 -t cp949 '{W}/늦은자막.srt' > '{W}/늦은자막_cp949.srt'", shell=True, check=True)
for name, vid, desc, *ex in CASES:
    ex = ex[0] if ex else []
    out = f"{W}/{name}_고침{'_무음' if '소리' in vid else ''}{'_구간별' if ex else ''}.srt"; secs = []; log = ""
    for _ in range(3):
        t0 = time.time(); p = subprocess.run(["ffsubsync", f"{W}/{vid}", "-i", f"{W}/{name}.srt", "-o", out] + ex, capture_output=True, text=True); secs.append(time.time() - t0); log = p.stdout + p.stderr
    off = re.search(r"offset seconds: (-?[\d.]+)", log); sc = re.search(r"framerate scale factor: ([\d.]+)", log)
    c = {"name": name, "video": vid, "desc": desc, "args": ex, "sec": round(statistics.median(secs), 2), "secs": [round(s, 2) for s in secs], "returncode": p.returncode,
         "offset": float(off.group(1)) if off else None, "scale": float(sc.group(1)) if sc else None, "before": err(f"{W}/{name}.srt")}
    if os.path.exists(out) and p.returncode == 0:
        try: open(out, encoding="utf-8").read(); c["out_encoding"] = "utf-8"
        except UnicodeDecodeError: c["out_encoding"] = "cp949"
    c["after"] = err(out) if os.path.exists(out) and p.returncode == 0 else None
    if p.returncode: c["error"] = [l.strip() for l in log.splitlines() if "ERROR" in l or "rror" in l][-3:]
    R["cases"].append(c); print(name, vid, c["sec"], c["offset"], c["scale"], c["before"]["mean"], "→", c["after"] and c["after"]["mean"], c.get("error", ""))
old = json.load(open("results.json", encoding="utf-8")) if os.path.exists("results.json") else {}
if "long" in old: R["long"] = old["long"]
json.dump(R, open("results.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
