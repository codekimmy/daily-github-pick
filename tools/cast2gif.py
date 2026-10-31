"""asciinema 녹화(.cast)를 GIF로 — agg를 쓸 수 없을 때의 대체 도구 (pyte + Pillow + ffmpeg)
사용: python3 tools/cast2gif.py <입력.cast> <출력.gif> [배속=1.2]
한글(전각 문자)은 2칸으로 그림. 화면이 바뀔 때마다 프레임을 만들고 ffmpeg로 GIF 변환."""
import json, sys, os, subprocess, tempfile, unicodedata
import pyte
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
speed = float(sys.argv[3]) if len(sys.argv) > 3 else 1.2
lines = open(src, encoding="utf-8").read().splitlines()
head = json.loads(lines[0])
cols, rows = head.get("width", 100), head.get("height", 26)
if "term" in head:  # asciinema v3
    cols, rows = head["term"]["cols"], head["term"]["rows"]
events, t = [], 0.0
for ln in lines[1:]:
    if not ln.strip() or ln.startswith("#"):
        continue
    e = json.loads(ln)
    if head.get("version") == 3:
        t += e[0]
    else:
        t = e[0]
    if e[1] == "o":
        events.append((t / speed, e[2]))

FS = 16
font = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", FS, index=6)  # Mono CJK KR
bold = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc", FS, index=6)
CW, CH = 8, 21
PAD = 14
W, H = cols * CW + PAD * 2, rows * CH + PAD * 2
BG = (24, 26, 33)
PAL = {"default": (220, 223, 228), "black": (60, 60, 60), "red": (240, 98, 98), "green": (120, 220, 120),
       "brown": (240, 200, 90), "yellow": (240, 200, 90), "blue": (110, 160, 250), "magenta": (210, 130, 240),
       "cyan": (100, 210, 220), "white": (235, 235, 235)}


def color(c, default):
    if c == "default":
        return default
    if c in PAL:
        return PAL[c]
    if isinstance(c, str) and len(c) == 6:
        try:
            return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
        except ValueError:
            pass
    return default


screen = pyte.Screen(cols, rows)
stream = pyte.Stream(screen)


def render():
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    for y in range(rows):
        line = screen.buffer[y]
        x = 0
        while x < cols:
            ch = line[x]
            c = ch.data
            if c == "":
                x += 1
                continue
            fg = color(ch.fg, PAL["default"])
            bgc = color(ch.bg, None) if ch.bg != "default" else None
            wide = unicodedata.east_asian_width(c) in "WF"
            px, py = PAD + x * CW, PAD + y * CH
            if bgc:
                d.rectangle([px, py, px + CW * (2 if wide else 1), py + CH], fill=bgc)
            if c != " ":
                d.text((px, py), c, font=bold if ch.bold else font, fill=fg)
            x += 1
    cx, cy = screen.cursor.x, screen.cursor.y
    d.rectangle([PAD + cx * CW, PAD + cy * CH + CH - 3, PAD + cx * CW + CW, PAD + cy * CH + CH - 1], fill=(200, 200, 200))
    return im


tmp = tempfile.mkdtemp()
FPS = 10
frames, last_img, ei = [], None, 0
end = (events[-1][0] if events else 0) + 2.0
n = int(end * FPS) + 1
lst = open(os.path.join(tmp, "list.txt"), "w")
prev_path, dur = None, 0
for i in range(n):
    tt = i / FPS
    changed = False
    while ei < len(events) and events[ei][0] <= tt:
        stream.feed(events[ei][1]); ei += 1; changed = True
    if changed or prev_path is None:
        if prev_path:
            lst.write(f"file '{prev_path}'\nduration {dur:.2f}\n")
        prev_path = os.path.join(tmp, f"f{i:05d}.png")
        render().save(prev_path)
        dur = 0
    dur += 1 / FPS
lst.write(f"file '{prev_path}'\nduration {dur:.2f}\nfile '{prev_path}'\n")
lst.close()
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst.name,
                "-vf", "fps=10,split[a][b];[a]palettegen=max_colors=64[p];[b][p]paletteuse=dither=none",
                out], check=True)
print("saved", out)
