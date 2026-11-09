"""카카오톡 '대화 내보내기' 글 파일(또는 아무 글 파일)로 한글 낱말 구름 + 낱말 순위(엑셀용 CSV) 만들기.
필요: pip install wordcloud kiwipiepy
사용(cmd):  python 카톡구름.py 대화.txt
            python 카톡구름.py 대화.txt --빼기 "생각,기대" --단어 "흑돼지" --모양 하트.png --가로
결과: 대화_낱말구름.png, 대화_낱말순위.csv (원본 파일은 건드리지 않음)"""
import argparse, os, re, sys, time
from collections import Counter

p = argparse.ArgumentParser(description="한글 낱말 구름 만들기")
p.add_argument("파일"); p.add_argument("--빼기", default="", help="빼고 싶은 낱말, 쉼표로 구분")
p.add_argument("--단어", default="", help="쪼개지면 안 되는 낱말, 쉼표로 구분 (예: 흑돼지,라떼)")
p.add_argument("--모양", help="흑백 그림 파일 (검은 곳에만 낱말을 채움)"); p.add_argument("--가로", action="store_true", help="모든 낱말을 가로로")
p.add_argument("--글꼴", help="글꼴 파일 (기본: Windows 맑은 고딕)"); p.add_argument("--개수", type=int, default=100, help="낱말 최대 개수")
a = p.parse_args()

FONTS = [a.글꼴, r"C:\Windows\Fonts\malgun.ttf", "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc", "/System/Library/Fonts/AppleSDGothicNeo.ttc"]
font = next((f for f in FONTS if f and os.path.exists(f)), None)
if not font: sys.exit("한글 글꼴을 찾지 못했습니다. --글꼴 C:\\경로\\글꼴.ttf 로 지정하시기 바랍니다")

t0 = time.time()
from wordcloud import WordCloud
from kiwipiepy import Kiwi
import numpy as np

text = open(a.파일, encoding="utf-8-sig", errors="ignore").read()
# 카톡 내보내기 줄이면 '날짜, 이름 :' 부분을 떼고 말만 남김 (PC·모바일 모양 몇 가지)
LINE = re.compile(r"^(?:\d{4}[.년\- ]+\d{1,2}[.월\- ]+\d{1,2}[.일]?\s*(?:오전|오후)?\s*\d{1,2}:\d{2},?\s*|\[.+?\] \[(?:오전|오후) \d{1,2}:\d{2}\] )(?:(.+?) : )?(.*)$")
lines = []
for l in text.splitlines():
    m = LINE.match(l)
    if m: lines.append(m.group(2))
    elif not re.match(r"^-+ .*-+$|저장한 날짜|님과 카카오톡 대화", l): lines.append(l)
body = "\n".join(lines)

kiwi = Kiwi()
for w in a.단어.split(","):
    if w.strip(): kiwi.add_user_word(w.strip(), "NNG")  # 흑+돼지처럼 쪼개지지 않게
skip = {w.strip() for w in a.빼기.split(",") if w.strip()} | {"이모티콘"}  # 카톡 내보내기의 "사진" 줄도 빼려면 --빼기 "사진"
nouns = [t.form for t in kiwi.tokenize(body) if t.tag in ("NNG", "NNP") and t.form not in skip]
freq = Counter(nouns)
if not freq: sys.exit("낱말을 하나도 찾지 못했습니다. 파일이 UTF-8 글 파일인지 확인하시기 바랍니다")

opt = dict(font_path=font, max_words=a.개수, random_state=1, prefer_horizontal=1 if a.가로 else .9)
if a.모양:
    from PIL import Image
    opt.update(mask=np.array(Image.open(a.모양).convert("L")), background_color="white", contour_width=2, contour_color="#444")
else:
    opt.update(width=1600, height=900)
wc = WordCloud(**opt).generate_from_frequencies(freq)
base = os.path.splitext(a.파일)[0]
wc.to_file(base + "_낱말구름.png")
with open(base + "_낱말순위.csv", "w", encoding="utf-8-sig") as f:   # 엑셀에서 한글이 깨지지 않게 utf-8-sig
    f.write("순위,낱말,횟수\n")
    for i, (w, c) in enumerate(freq.most_common(50), 1): f.write(f"{i},{w},{c}\n")
print(f"완료: {base}_낱말구름.png / {base}_낱말순위.csv  (낱말 {len(freq)}종, {time.time() - t0:.1f}초)")
print("많이 나온 낱말:", ", ".join(f"{w}({c})" for w, c in freq.most_common(5)))
