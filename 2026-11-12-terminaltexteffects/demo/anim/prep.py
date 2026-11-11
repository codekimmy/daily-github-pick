"""애니메이션 재료: terminaltexteffects(파이썬 라이브러리)가 만든 실제 프레임을 그대로 받아 → fx.js
프레임 글(ANSI 색 코드 포함)을 줄마다 [글자, 색] 조각으로 나눠 저장, 초당 30장으로 솎음(원래 60장).
화면(long.html·anim.html)은 이 조각을 터미널처럼 한 칸씩(한글은 두 칸) 그려서 실제 효과를 다시 보여 줌.
숫자는 ../results.json, 문구는 ../texts/ (시연용으로 직접 쓴 글)"""
import importlib, json, random, re
from pathlib import Path
from terminaltexteffects.utils.graphics import Color

H = Path(__file__).parent; D = H.parent
KO = (D / "texts/인사.txt").read_text(); EN = (D / "texts/greeting_en.txt").read_text(); POEM = (D / "texts/하루.txt").read_text()
TITLE = "DAILY GITHUB PICK\n오늘의 오픈소스"
C = lambda *h: tuple(Color(x) for x in h)
# (이름, 효과, 글, 바꿀 설정)
JOBS = [("fw_ko", "fireworks", KO, {}), ("fw_bday", "fireworks", KO, {"firework_colors": C("ff6b9d", "ffd166", "ffffff"), "final_gradient_stops": C("ff6b9d", "ffd166")}),
        ("dec_ko", "decrypt", KO, {}), ("dec_title", "decrypt", TITLE, {}), ("burn_ko", "burn", KO, {}),
        ("beams_ko", "beams", KO, {}), ("rain_ko", "rain", KO, {}), ("blackhole_ko", "blackhole", KO, {}), ("slide_ko", "slide", KO, {}),
        ("waves_ko", "waves", KO, {}), ("print_ko", "print", KO, {}), ("synth_ko", "synthgrid", KO, {}), ("expand_ko", "expand", KO, {}),
        ("dec_en", "decrypt", EN, {}), ("fw_narrow", "fireworks", KO, {"_narrow": 1}), ("card", "fireworks", "민지님\n생일 축하합니다!", {"firework_colors": C("ff6b9d", "ffd166", "ffffff"), "final_gradient_stops": C("ff6b9d", "ffd166")}), ("burn_poem", "burn", POEM, {}), ("burn_blue", "burn", KO, {"burn_colors": C("ffffff", "9be7ff", "3a86ff", "1d3557", "0b132b"), "final_gradient_stops": C("9be7ff", "3a86ff")})]
SGR = re.compile(r"\x1b\[([0-9;]*)m")


def parse_row(row):
    runs, color, pos = [], "", 0
    for m in SGR.finditer(row):
        if m.start() > pos: runs.append([row[pos:m.start()], color])
        p = m.group(1).split(";")
        if p[:2] == ["38", "2"]: color = "%02x%02x%02x" % tuple(int(x) for x in p[2:5])
        elif p == ["0"] or p == [""] or p == ["39"]: color = ""
        pos = m.end()
    if pos < len(row): runs.append([row[pos:], color])
    out = []  # 같은 색 이어 붙이기, 공백 조각은 색 없음
    for t, c in runs:
        t = re.sub(r"\x1b\[[0-9;?]*[A-Za-z]", "", t)
        if not t: continue
        if not t.strip(): c = ""
        if out and out[-1][1] == c: out[-1][0] += t
        else: out.append([t, c])
    while out and not out[-1][0].strip(): out.pop()
    return out


FX = {}
for key, eff, text, cfg in JOBS:
    random.seed(1)
    E = importlib.import_module(f"terminaltexteffects.effects.effect_{'random_sequence' if eff == 'randomsequence' else eff}").get_effect_resources()[1]
    e = E(text); tc = e.terminal_config; tc.frame_rate = 0; tc.ignore_terminal_dimensions = True; tc.canvas_width = 40; tc.canvas_height = 12 if text.count("\n") > 4 else 10; tc.anchor_text = "c"   # 넓은 무대(가로 40칸·세로 10줄) 가운데에 글 — 명령어 --canvas-width 40 --canvas-height 10 --anchor-text c 와 같음
    if cfg.pop("_narrow", 0): tc.canvas_width = -1; tc.canvas_height = -1; tc.anchor_text = "sw"   # 기본 설정(무대 = 글 크기)
    for k, v in cfg.items(): setattr(e.effect_config, k, v)
    fr = [f for f in e]; keep = fr[::2] + ([fr[-1]] if len(fr) % 2 == 0 else [])
    rows = fr[0].count("\n") + 1; cols = max(len(re.sub(r"\x1b\[[0-9;?]*[A-Za-z]", "", l)) for l in fr[-1].split("\n"))
    FX[key] = {"effect": eff, "rows": rows, "cols": cols, "n60": len(fr), "frames": [[parse_row(r) for r in f.split("\n")] for f in keep]}
    print(key, eff, len(fr), "→", len(keep), "프레임", rows, "줄", cols, "칸")
js = "const FX = " + json.dumps(FX, ensure_ascii=False, separators=(",", ":")) + ";\n"
(H / "fx.js").write_text(js, encoding="utf-8"); print("fx.js", round(len(js.encode()) / 1e6, 2), "MB")
R = json.loads((D / "results.json").read_text())
(H / "data.js").write_text("const R = " + json.dumps(R, ensure_ascii=False) + ";\n", encoding="utf-8")
