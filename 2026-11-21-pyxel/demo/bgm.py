# 자동 작곡(gen_bgm) 8가지 분위기 → WAV 파일로 저장 (소리 장치 없이도 됨)
import sys, time, json, wave, pyxel
out = sys.argv[1]
pyxel.init(32, 32, title="bgm")
NAMES = ["타이틀", "출발", "마을", "평화", "들판", "모험", "전투", "위기"]
res = []
for p in range(8):
    t = time.time()
    mml = pyxel.gen_bgm(p, 0, 3 if p >= 6 else 1, 2026)
    g = time.time() - t
    for ch, code in enumerate(mml):
        pyxel.sounds[ch].mml(code)
    pyxel.musics[0].set(*[[ch] for ch in range(len(mml))])
    t = time.time(); fn = f"{out}/bgm_{p}.wav"; pyxel.musics[0].save(fn, 20); s = time.time() - t
    w = wave.open(fn); dur = w.getnframes() / w.getframerate()
    res.append({"preset": p, "name": NAMES[p], "channels": len(mml), "gen_sec": round(g, 4), "save_sec": round(s, 2), "wav_sec": round(dur, 2), "mml_chars": sum(len(c) for c in mml)})
json.dump(res, open(f"{out}/bgm.json", "w"), ensure_ascii=False, indent=1)
print(res)
