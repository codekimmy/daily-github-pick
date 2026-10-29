"""애니메이션 재료 만들기: 단어 7,298개 그림을 작은 타일 한 장(sprite.jpg)으로 묶고,
수준별 개수와 카드 12장 정보를 data.js로 저장한다. 사용: python3 prep.py <word-atlas 폴더>"""
import json, random, shutil, sys
from pathlib import Path
from PIL import Image

root = Path(sys.argv[1]); here = Path(__file__).parent
words = json.loads((root / "data/word-atlas.json").read_text(encoding="utf-8"))
T = 32; COLS = 100
rows = (len(words) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * T, rows * T), (20, 24, 36))
for i, w in enumerate(words):
    im = Image.open(root / f"public/atlas/thumb/{w['id']}.webp").convert("RGB").resize((T, T), Image.LANCZOS)
    sheet.paste(im, ((i % COLS) * T, (i // COLS) * T))
sheet.save(here / "sprite.jpg", quality=82)

lv = ["A1", "A2", "B1", "B2", "C1", "C2"]
levels = [[l, sum(1 for w in words if w["cefr"] == l)] for l in lv]
pick = [w for w in words if w["cefr"] == "B1" and w["topic"] == "travel"]
random.Random(7).shuffle(pick)                       # make_deck.py와 같은 방식으로 같은 12단어
pick = sorted(pick[:12], key=lambda w: w["w"].lower())
(here / "img").mkdir(exist_ok=True)
cards = []
for w in pick:
    shutil.copy(root / f"public/atlas/img/{w['id']}.webp", here / "img" / f"{w['id']}.webp")
    cards.append({"id": w["id"], "w": w["w"], "uk": w["uk"], "us": w["us"], "pos": w["senses"][0]["pos"],
                  "def": w["senses"][0]["en"], "ex": w["ex"][0]["en"]})
data = {"n": len(words), "cols": COLS, "tile": T, "levels": levels, "cards": cards}
(here / "data.js").write_text("const DATA=" + json.dumps(data, ensure_ascii=False) + ";", encoding="utf-8")
print("tiles", len(words), "sheet", sheet.size, "cards", [c["w"] for c in cards])
