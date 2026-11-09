"""애니메이션 재료: 실제 wordcloud 결과 그림 복사 + 낱말이 하나씩 놓이는 과정 그림(build/NN.png) + data.js
과정 그림은 wordcloud가 실제로 정한 자리(layout_)를 앞에서부터 k개만 남겨 다시 그린 것 (자리·크기·색은 실제 결과 그대로)"""
import json, re, shutil
from collections import Counter
from pathlib import Path
from wordcloud import WordCloud
from kiwipiepy import Kiwi
H = Path(__file__).parent; D = H.parent; O = D / "work/out"; IMG = H / "img"; B = IMG / "build"
B.mkdir(parents=True, exist_ok=True)
for p in O.glob("*.png"): shutil.copy(p, IMG / p.name)
for p in ["하트틀.png", "말풍선틀.png", "노을색.png"]: shutil.copy(D / "work" / p, IMG / p)
R = json.loads((D / "results.json").read_text())
chat = (D / "work/단톡방_말만.txt").read_text(encoding="utf-8")
k = Kiwi(); k.add_user_word("흑돼지", "NNG")
freq = Counter(t.form for t in k.tokenize(chat) if t.tag in ("NNG", "NNP"))
wc = WordCloud(font_path="/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc", width=1600, height=900, random_state=7, prefer_horizontal=1, colormap="viridis").generate_from_frequencies(freq)
L = list(wc.layout_)
for i in range(1, len(L) + 1):
    wc.layout_ = L[:i]; wc.to_image().save(B / f"{i:02d}.png")
raw = [l for l in (D / "work/제주여행_단톡방.txt").read_text(encoding="utf-8").splitlines() if re.match(r"^\d{4}\.", l)]
DATA = {"R": R, "build": [[w[0][0], w[1]] for w in L], "chat": raw[:40], "freq": freq.most_common(30)}
(H / "data.js").write_text("const DATA = " + json.dumps(DATA, ensure_ascii=False) + ";\nconst R = DATA.R;\n", encoding="utf-8")
print(len(L), "words", [w[0][0] for w in L[:8]])
