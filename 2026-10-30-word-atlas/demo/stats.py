"""Word Atlas 공개 데이터가 정말 소개대로 들어 있는지 세어 본다. 사용: py stats.py <word-atlas 폴더>"""
import collections, json, sys, time
from pathlib import Path

t0 = time.time()
root = Path(sys.argv[1])
words = json.loads((root / "data" / "word-atlas.json").read_text(encoding="utf-8"))
print(f"단어 수        : {len(words):,}개")
print(f"예문 수        : {sum(len(w['ex']) for w in words):,}개")
lv = collections.Counter(w["cefr"] for w in words)
print("수준별 단어    : " + " / ".join(f"{k} {lv[k]:,}" for k in ["A1", "A2", "B1", "B2", "C1", "C2"]))
tp = collections.Counter(w["topic"] for w in words)
print(f"주제 {len(tp)}개     : " + ", ".join(f"{k} {v}" for k, v in tp.most_common(6)) + " ...")
a = root / "public" / "atlas"
img = list((a / "img").glob("*.webp"))
mb = sum(f.stat().st_size for f in img) / 1e6
print(f"그림           : {len(img):,}장 ({mb:,.0f}MB)")
for d, name in [("uk", "영국식 발음"), ("us", "미국식 발음"), ("ex", "예문 읽기"), ("ex2", "두 번째 예문")]:
    print(f"{name:<11}: {len(list((a / 'audio' / d).glob('*.mp3'))):,}개")
print(f"세는 데 걸린 시간: {time.time() - t0:.1f}초")
