"""wordcloud 시연 측정 → results.json, 결과 그림은 work/out/*.png
사용: python3 make_data.py && python3 test_all.py [--install]"""
import json, re, statistics, subprocess, sys, time, shutil, os
from collections import Counter
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
import wordcloud
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator

H = Path(__file__).parent; W = H / "work"; O = W / "out"; O.mkdir(parents=True, exist_ok=True)
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"   # Windows에서는 C:\Windows\Fonts\malgun.ttf (맑은 고딕)
R = {"version": wordcloud.__version__, "python": sys.version.split()[0], "cases": {}}
RES = H / "results.json"
if RES.exists(): R.update({k: v for k, v in json.loads(RES.read_text()).items() if k in ("install",)})

def timed(fn, n=3):
    ts = []
    for _ in range(n):
        t = time.perf_counter(); out = fn(); ts.append(time.perf_counter() - t)
    return out, round(statistics.median(ts), 2)

def save(name, wc): wc.to_file(str(O / f"{name}.png")); return f"{name}.png"
def top(freq, n=10): return [[w, round(c, 3) if isinstance(c, float) else c] for w, c in sorted(freq.items(), key=lambda x: -x[1])[:n]]

# 0) 설치 (새 가상 환경, 내려받기 포함)
if "--install" in sys.argv:
    for pkg in ["wordcloud", "kiwipiepy"]:
        v = f"/tmp/venv_{pkg}"; shutil.rmtree(v, ignore_errors=True); subprocess.run([sys.executable, "-m", "venv", v], check=True)
        t = time.perf_counter(); subprocess.run([f"{v}/bin/pip", "install", "-q", "--no-cache-dir", pkg], check=True); sec = time.perf_counter() - t
        mb = int(subprocess.check_output(["du", "-sm", f"{v}/lib"]).split()[0]) - int(subprocess.check_output(["du", "-sm", f"{v}/lib/python3.13/site-packages/pip"]).split()[0])
        R.setdefault("install", {})[pkg] = {"sec": round(sec, 1), "mb": mb}
    print("install", R["install"])

chat_raw = (W / "제주여행_단톡방.txt").read_text(encoding="utf-8")
# 카톡 내보내기 줄에서 '날짜, 이름 :' 앞부분을 떼고 말만 남김
LINE = re.compile(r"^\d{4}\. \d{1,2}\. \d{1,2}\. (오전|오후) \d{1,2}:\d{2}, (.+?) : (.*)$")
msgs = [m.group(3) for l in chat_raw.splitlines() if (m := LINE.match(l))]
chat = "\n".join(msgs)
R["src"] = {"chat_lines": len(msgs), "chat_chars": len(chat), "cafe_lines": len((W / "카페_손님의견.txt").read_text(encoding="utf-8").splitlines())}

# 1) 영어 글 — 아무 설정 없이
en = (W / "market.txt").read_text()
wc, s = timed(lambda: WordCloud(width=800, height=450, random_state=1).generate(en))
R["cases"]["english"] = {"sec": s, "img": save("01_영어_기본", wc), "top": top(wc.words_, 6), "n_words": len(wc.words_)}

# 2) 한글 + 기본 글꼴 → 네모(□)로 깨짐
wc, s = timed(lambda: WordCloud(width=800, height=450, random_state=1).generate(chat))
R["cases"]["tofu"] = {"sec": s, "img": save("02_한글_기본글꼴", wc), "top": top(wc.words_, 5)}

# 3) 한글 글꼴 지정 → 보이지만 '제주도에·제주도는'처럼 조사 붙은 말이 따로 셈
mk = lambda **k: WordCloud(font_path=FONT, width=800, height=450, random_state=1, **k)
wc, s = timed(lambda: mk().generate(chat))
raw_counts = mk().process_text(chat)
variants = {k: v for k, v in raw_counts.items() if k.startswith("제주도")}
R["cases"]["font"] = {"sec": s, "img": save("03_한글_글꼴지정", wc), "top": top(wc.words_, 8), "n_words": len(raw_counts),
                      "jeju_variants": variants, "ㅋ_rank": [i + 1 for i, (w, _) in enumerate(sorted(raw_counts.items(), key=lambda x: -x[1])) if w.startswith("ㅋ")][:2]}

# 4) 형태소 분석기 kiwipiepy로 명사만 → 낱말 정리
t = time.perf_counter(); from kiwipiepy import Kiwi; kiwi = Kiwi(); load = time.perf_counter() - t
kiwi.add_user_word("흑돼지", "NNG"); kiwi.add_user_word("라떼", "NNG")  # 사용자 단어: 흑+돼지, 라+떼로 나뉘지 않게
def nouns(text): return [tk.form for tk in kiwi.tokenize(text) if tk.tag in ("NNG", "NNP")]
(ns), s_tok = timed(lambda: nouns(chat), 1)
freq = Counter(ns)
wc, s = timed(lambda: mk(colormap="viridis").generate_from_frequencies(freq))
R["cases"]["nouns"] = {"load_sec": round(load, 2), "tok_sec": s_tok, "sec": s, "img": save("04_명사만", wc), "n_words": len(freq), "top": top(freq, 12),
                       "jeju_total": freq["제주도"], "rain": freq.get("비", 0)}
# 4-0) 한글은 세로로 누운 낱말이 읽기 어려움 → 가로로만 (prefer_horizontal=1)
wc_h, s = timed(lambda: mk(colormap="viridis", prefer_horizontal=1).generate_from_frequencies(freq))
R["cases"]["horiz"] = {"sec": s, "img": save("05_가로로만", wc_h), "default_vertical": sum(1 for w in wc.layout_ if w[3] is not None), "n_layout": len(wc.layout_)}
# 4-1) 사용자 단어를 안 넣으면
kiwi2 = Kiwi(); f2 = Counter(tk.form for tk in kiwi2.tokenize(chat) if tk.tag in ("NNG", "NNP"))
R["cases"]["nouns"]["no_userword"] = {"흑돼지": f2.get("흑돼지", 0), "돼지": f2.get("돼지", 0), "흑": f2.get("흑", 0)}

# 6) 빼고 싶은 말(불용어) — 단톡방 'ㅋㅋㅋ, 그럼, 근데' 등
stop = {"ㅋㅋㅋ", "ㅋㅋㅋㅋ", "ㅎㅎ", "그럼", "근데", "오케이", "ㅇㅇ", "그러니까", "헐", "진짜"}
wc, s = timed(lambda: mk(stopwords=stop).generate(chat))
R["cases"]["stop"] = {"sec": s, "img": save("06_불용어빼기", wc), "top": top(wc.words_, 6), "removed": len(stop)}

# 7) 모양 틀(mask): 하트와 말풍선 — 직접 그린 흑백 그림, 흰 곳은 비워 둠
def heart(size=800):
    im = Image.new("L", (size, size), 255); d = ImageDraw.Draw(im); r = size * .24
    d.ellipse([size * .5 - 2 * r, size * .2, size * .5, size * .2 + 2 * r], fill=0); d.ellipse([size * .5, size * .2, size * .5 + 2 * r, size * .2 + 2 * r], fill=0)
    d.polygon([(size * .5 - 1.95 * r, size * .2 + 1.25 * r), (size * .5 + 1.95 * r, size * .2 + 1.25 * r), (size * .5, size * .93)], fill=0); return im
def bubble(w=900, h=700):
    im = Image.new("L", (w, h), 255); d = ImageDraw.Draw(im); d.rounded_rectangle([40, 40, w - 40, h - 200], 120, fill=0)
    d.polygon([(220, h - 210), (380, h - 210), (170, h - 40)], fill=0); return im
heart().save(W / "하트틀.png"); bubble().save(W / "말풍선틀.png")
mask = np.array(heart())
wc, s = timed(lambda: WordCloud(font_path=FONT, mask=mask, background_color="white", colormap="autumn", contour_width=3, contour_color="#d33", random_state=2).generate_from_frequencies(freq))
R["cases"]["mask"] = {"sec": s, "img": save("07_하트모양", wc)}
cafe = (W / "카페_손님의견.txt").read_text(encoding="utf-8")
cf = Counter(nouns(cafe))
wc, s = timed(lambda: WordCloud(font_path=FONT, mask=np.array(bubble()), background_color="white", colormap="tab10", contour_width=3, contour_color="#333", random_state=3).generate_from_frequencies(cf))
R["cases"]["cafe"] = {"sec": s, "img": save("08_카페의견_말풍선", wc), "top": top(cf, 10), "n_words": len(cf)}

# 8) 사진 색 따라 칠하기 (직접 그린 노을 그림)
g = Image.new("RGB", (800, 450)); px = g.load()
for y in range(450):
    for x in range(800):
        k = y / 450; px[x, y] = (int(255 - 60 * k), int(120 + 60 * (1 - k) * (x / 800)), int(60 + 180 * k))
g.save(W / "노을색.png")
wc = WordCloud(font_path=FONT, width=800, height=450, background_color="#111", random_state=4).generate_from_frequencies(freq)
wc.recolor(color_func=ImageColorGenerator(np.array(g))); R["cases"]["recolor"] = {"img": save("09_노을색", wc)}

# 9) 명령어(wordcloud_cli) — 파이썬 코드 없이
def cli(*a): return subprocess.run(["wordcloud_cli", *a], check=True, capture_output=True)
(W / "빼기.txt").write_text("\n".join(sorted(stop)) + "\n", encoding="utf-8")
(W / "단톡방_말만.txt").write_text(chat + "\n", encoding="utf-8")
_, s = timed(lambda: cli("--text", str(W / "단톡방_말만.txt"), "--fontfile", FONT, "--stopwords", str(W / "빼기.txt"), "--imagefile", str(O / "10_명령어.png"), "--width", "800", "--height", "450", "--random_state", "1"))
_, s2 = timed(lambda: cli("--text", str(W / "단톡방_말만.txt"), "--fontfile", FONT, "--stopwords", str(W / "빼기.txt"), "--mask", str(W / "말풍선틀.png"), "--background", "white", "--imagefile", str(O / "11_명령어_말풍선.png"), "--random_state", "1"))
R["cases"]["cli"] = {"sec": s, "mask_sec": s2, "img": "10_명령어.png", "img2": "11_명령어_말풍선.png"}

# 10) 큰 글: 단톡방 100배 (6만 줄)
big = "\n".join([chat] * 100)
_, s_big = timed(lambda: mk().generate(big), 1)
t = time.perf_counter(); fb = Counter(nouns(big)); s_bigtok = time.perf_counter() - t
R["cases"]["big"] = {"lines": len(msgs) * 100, "chars": len(big), "gen_sec": s_big, "tok_sec": round(s_bigtok, 2)}

# 11) 그림 크기에 따른 시간
for w_, h_ in [(400, 225), (1920, 1080), (3840, 2160)]:
    _, s = timed(lambda: WordCloud(font_path=FONT, width=w_, height=h_, random_state=1).generate_from_frequencies(freq), 1)
    R["cases"].setdefault("size", []).append([f"{w_}×{h_}", s])

# 12) 빈 글(낱말 0개) → 오류
try: WordCloud(font_path=FONT).generate(""); R["cases"]["empty"] = "no error"
except Exception as e: R["cases"]["empty"] = f"{type(e).__name__}: {e}"

# 13) 낱말 빈도 CSV (엑셀용)
with open(O / "낱말순위.csv", "w", encoding="utf-8-sig") as f:
    f.write("순위,낱말,횟수\n"); [f.write(f"{i + 1},{w},{c}\n") for i, (w, c) in enumerate(freq.most_common(30))]
R["cases"]["csv"] = {"rows": 30}
RES.write_text(json.dumps(R, ensure_ascii=False, indent=1), encoding="utf-8"); print(json.dumps(R, ensure_ascii=False, indent=1)[:4000])
