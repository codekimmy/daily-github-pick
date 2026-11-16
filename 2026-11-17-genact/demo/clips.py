"""casts/*.cast(asciinema 기록)를 가상 터미널(pyte)로 다시 재생해, 12분의 1초마다 화면 글자·색을 찍어 render/clips.js 로 저장한다.
영상(page.html)은 이 글자를 캔버스에 그대로 그린다 = genact가 실제로 출력한 화면."""
import json, glob, os, sys, pyte
FPS = 12; DUR = 13.0
COL = {"default": None, "black": "#484f58", "red": "#ff7b72", "green": "#7ee787", "yellow": "#f2cc60", "blue": "#79c0ff",
       "magenta": "#d2a8ff", "cyan": "#76e3ea", "white": "#e6edf3", "brightblack": "#8b949e", "brightred": "#ffa198",
       "brightgreen": "#56d364", "brightyellow": "#e3b341", "brightblue": "#a5d6ff", "brightmagenta": "#e2c5ff", "brightcyan": "#b3f0ff", "brightwhite": "#ffffff"}
def color(c):
    if c in COL: return COL[c]
    if len(c) == 6: return "#" + c
    return None
out = {}
for path in sorted(glob.glob("casts/*.cast")):
    name = os.path.basename(path)[:-5]
    lines = open(path, encoding="utf-8").read().splitlines()
    hdr = json.loads(lines[0]); ev = [json.loads(l) for l in lines[1:]]
    sc = pyte.Screen(hdr["width"], hdr["height"]); st = pyte.Stream(sc)
    frames, i = [], 0
    for f in range(int(DUR * FPS)):
        t = f / FPS
        while i < len(ev) and ev[i][0] <= t:
            if ev[i][1] == "o": st.feed(ev[i][2])
            i += 1
        rows = []
        for y in range(sc.lines):
            row, cur, buf = [], None, ""
            for x in range(sc.columns):
                ch = sc.buffer[y][x]; c = color(ch.fg) or "#c9d1d9"
                if ch.bold and c == "#c9d1d9": c = "#ffffff"
                if c != cur and buf: row.append([buf, cur]); buf = ""
                cur = c; buf += ch.data
            if buf.strip(): row.append([buf.rstrip(), cur])
            rows.append(row)
        frames.append(rows)
    # 같은 화면이 이어지면 앞 번호로 대신 (용량 줄이기)
    packed, last = [], None
    for k, fr in enumerate(frames):
        s = json.dumps(fr, ensure_ascii=False)
        packed.append(packed[-1] if s == last else fr); last = s
    out[name] = {"cols": hdr["width"], "rows": hdr["height"], "fps": FPS, "frames": packed}
    print(name, len(frames), "frames, text rows at end:", sum(1 for r in frames[-1] if r))
js = "const CLIPS = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
os.makedirs("render", exist_ok=True); open("render/clips.js", "w", encoding="utf-8").write(js)
print("clips.js", round(len(js) / 1e6, 2), "MB")
