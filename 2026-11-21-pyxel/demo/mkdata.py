"""results.json + 자동 작곡 WAV 파형(앞 8초, 막대 96개) → render/data.js"""
import json, os, wave
import numpy as np
H = os.path.dirname(os.path.abspath(__file__)); R = json.load(open(f"{H}/results.json"))
wf = {}
for p in range(8):
    w = wave.open(f"{H}/work/bgm/bgm_{p}.wav"); a = np.frombuffer(w.readframes(w.getframerate() * 8), dtype=np.int16).astype(float)
    b = np.abs(a[: len(a) // 96 * 96]).reshape(96, -1).max(1); wf[p] = [round(x / 8000, 3) for x in b]
R["wave"] = wf
R["code"] = open(f"{H}/star_catch.py", encoding="utf-8").read().splitlines()
open(f"{H}/render/data.js", "w", encoding="utf-8").write("const RES = " + json.dumps(R, ensure_ascii=False) + ";\n")
print("ok", len(R["code"]))
