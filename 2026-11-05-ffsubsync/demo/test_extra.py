"""추가 시연: ① 맞는 자막(정답.srt)을 기준으로 맞추기 ② --max-offset-seconds 1 로 밀 수 있는 폭을 줄였을 때 → results.json 의 extra"""
import json, re, subprocess, time
R = json.load(open("results.json", encoding="utf-8")); X = {}
for k, cmd in [("srt_ref", ["ffsubsync", "work/정답.srt", "-i", "work/늦은자막.srt", "-o", "work/자막기준_고침.srt"]),
               ("max_offset_1", ["ffsubsync", "work/라면영상.mp4", "-i", "work/늦은자막.srt", "-o", "work/최대1초_고침.srt", "--max-offset-seconds", "1"])]:
    t = time.time(); p = subprocess.run(cmd, capture_output=True, text=True); s = time.time() - t; log = p.stdout + p.stderr
    X[k] = {"cmd": " ".join(cmd), "sec": round(s, 2), "offset": float(re.search(r"offset seconds: (-?[\d.]+)", log).group(1))}
    print(k, X[k])
R["extra"] = X; json.dump(R, open("results.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
