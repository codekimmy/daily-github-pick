"""명령어(pixeloe.pixelize, pixeloe.slang) 실행 시간·결과 크기 → results.json 의 "cli"
사용: python3 test_cli.py  (test_all.py 다음에)"""
import json, subprocess, time
from pathlib import Path
from PIL import Image
import numpy as np
H = Path(__file__).parent; R = json.load(open(H / "results.json", encoding="utf-8")); C = {}
def uniq(f): a = np.array(Image.open(f).convert("RGB")); return int(len(np.unique(a.reshape(-1, 3), axis=0)))
def run(args):
    t = time.perf_counter(); p = subprocess.run(args, capture_output=True, text=True); return round(time.perf_counter() - t, 2), p
for ph, name, args in [("고양이", "기본값", []), ("고양이", "점128_크기4", ["-S", "128", "-P", "4"]), ("고양이", "점64_색8", ["-S", "64", "-P", "8", "--colors", "8"]), ("커피", "커피_점64_색8", ["-S", "64", "-P", "8", "--colors", "8"]), ("커피", "커피_점64", ["-S", "64", "-P", "8"])]:
    out = H / "out" / f"cli_{name}.png"
    wall, p = run(["pixeloe.pixelize", str(H / f"photos/{ph}.png"), "-O", str(out), *args])
    C[name] = {"args": " ".join(args), "wall_sec": wall, "inner_ms": p.stdout.strip().splitlines()[-1], "out": list(Image.open(out).size), "uniq": uniq(out)}
wall, p = run(["pixeloe.slang", str(H / "photos/고양이.png"), str(H / "out/slang.png")])
C["slang"] = {"wall_sec": wall, "ok": p.returncode == 0, "error": (p.stderr.strip().splitlines() or [""])[-1]}
R["cli"] = C; json.dump(R, open(H / "results.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps(C, ensure_ascii=False, indent=1))
