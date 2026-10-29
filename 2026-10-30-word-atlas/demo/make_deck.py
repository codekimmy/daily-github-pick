"""Word Atlas 공개 데이터로 '영영 그림 단어카드(PDF)'와 'Anki 단어장(CSV)'을 만든다.

사용 예 (Windows cmd, word-atlas 폴더를 받아 둔 상태):
    py make_deck.py --atlas C:\\word-atlas --level B1 --topic travel --count 12

- 앱 코드는 실행하지 않는다. 저장소의 data/word-atlas.json, 그림(webp), 발음(mp3)만 읽는다.
- 결과: out/<수준>-<주제>/cards.html, cards.pdf(선택), anki.csv, media/
- 데이터 출처 표기: Word Atlas contributors — CC BY 4.0 (그림 크기·배치만 바꿈)
"""
import argparse, csv, html, json, random, re, shutil, sys, time
from pathlib import Path

p = argparse.ArgumentParser()
p.add_argument("--atlas", required=True, help="word-atlas 저장소 폴더")
p.add_argument("--level", default="", help="A1 A2 B1 B2 C1 C2 중 하나 (비우면 전체)")
p.add_argument("--topic", default="", help="travel, daily, health ... (비우면 전체)")
p.add_argument("--count", type=int, default=12, help="몇 단어 뽑을지")
p.add_argument("--seed", type=int, default=7, help="같은 숫자면 같은 단어가 뽑힘")
p.add_argument("--out", default="out")
p.add_argument("--pdf", action="store_true", help="PDF도 만들기 (playwright 필요)")
a = p.parse_args()

t0 = time.time()
root = Path(a.atlas)
words = json.loads((root / "data" / "word-atlas.json").read_text(encoding="utf-8"))
pick = [w for w in words
        if (not a.level or w["cefr"] == a.level.upper())
        and (not a.topic or w["topic"] == a.topic.lower())]
print(f"전체 단어 {len(words):,}개 중 조건에 맞는 단어 {len(pick):,}개")
if not pick:
    sys.exit("조건에 맞는 단어가 없어요. --level / --topic 값을 확인하세요.")
random.Random(a.seed).shuffle(pick)
pick = sorted(pick[: a.count], key=lambda w: w["w"].lower())

out = Path(a.out) / (f"{a.level or 'ALL'}-{a.topic or 'all'}")
media = out / "media"
media.mkdir(parents=True, exist_ok=True)
img_dir, aud_dir = root / "public" / "atlas" / "img", root / "public" / "atlas" / "audio"


def blank(sentence, word):
    """예문 속 단어(변형 포함)를 빈칸으로."""
    stem = re.escape(word[:-1] if len(word) > 4 else word)
    return re.sub(rf"\b{stem}\w*", "_____", sentence, flags=re.I)


rows, cards, quiz = [], [], []
for w in pick:
    wid = w["id"]
    for src, dst in [(img_dir / f"{wid}.webp", f"{wid}.webp"),
                     (aud_dir / "uk" / f"{wid}.mp3", f"{wid}_uk.mp3"),
                     (aud_dir / "us" / f"{wid}.mp3", f"{wid}_us.mp3")]:
        if src.exists():
            shutil.copy(src, media / dst)
    s = w["senses"][0]
    ex = w["ex"][0]["en"]
    e = html.escape
    cards.append(f"""<div class="card"><img src="media/{wid}.webp"><div class="b">
<div class="w">{e(w['w'])} <span class="pos">{e(s['pos'])}</span></div>
<div class="ipa">UK {e(w['uk'])} · US {e(w['us'])}</div>
<div class="def">{e(s['en'])}</div><div class="ex">“{e(ex)}”</div>
<div class="tag">{w['cefr']} · {w['topic']}</div></div></div>""")
    quiz.append(f"""<div class="card"><img src="media/{wid}.webp"><div class="b">
<div class="w line">____________</div><div class="ex">“{e(blank(ex, w['w']))}”</div>
<div class="tag">힌트: {len(w['w'])}글자 · {w['w'][0]}로 시작</div></div></div>""")
    # Anki: 앞면 = 그림 + 발음, 뒷면 = 단어·뜻·예문
    rows.append([f'<img src="{wid}.webp">[sound:{wid}_uk.mp3]',
                 f"<b>{e(w['w'])}</b> {e(w['uk'])}<br>{e(s['en'])}<br><i>{e(ex)}</i>",
                 f"{w['cefr']} {w['topic']}"])

with open(out / "anki.csv", "w", newline="", encoding="utf-8") as f:
    f.write("#separator:Comma\n#html:true\n#tags column:3\n")
    csv.writer(f).writerows(rows)

random.Random(a.seed + 1).shuffle(quiz)  # 퀴즈는 순서를 섞는다
css = """@page{size:A4;margin:10mm}body{font-family:'Noto Sans CJK KR','Malgun Gothic',sans-serif;margin:0;color:#1d2433}
h1{font-size:15px;margin:0 0 6px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.card{border:1.5px solid #c9cfdb;border-radius:12px;overflow:hidden;break-inside:avoid;background:#fff}
.card img{width:100%;aspect-ratio:1;object-fit:cover;display:block}.b{padding:7px 9px 9px}
.w{font-size:17px;font-weight:700}.pos{font-size:12px;color:#8a6d3b;font-weight:400}.ipa{font-size:10px;color:#667}
.def{font-size:11px;margin-top:4px}.ex{font-size:11px;color:#3b4a6b;margin-top:3px;font-style:italic}
.tag{font-size:9px;color:#99a;margin-top:4px}.line{color:#bbb}.pg{break-after:page}
.foot{font-size:8px;color:#99a;font-weight:400;margin-left:8px}"""
credit = "그림·데이터: Word Atlas contributors — CC BY 4.0 (크기·배치 변경)"
title = f"영영 그림 단어카드 · {a.level or '전체 수준'} · {a.topic or '전체 주제'} · {len(pick)}단어"
doc = f"""<!doctype html><meta charset="utf-8"><title>{title}</title><style>{css}</style>
<div class="pg"><h1>{title} <span class="foot">{credit}</span></h1><div class="grid">{''.join(cards)}</div></div>
<div><h1>그림 보고 단어 맞히기 (빈칸 퀴즈) <span class="foot">{credit}</span></h1><div class="grid">{''.join(quiz)}</div></div>"""
(out / "cards.html").write_text(doc, encoding="utf-8")

if a.pdf:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page()
        pg.goto((out / "cards.html").resolve().as_uri())
        pg.wait_for_load_state("networkidle")
        pg.pdf(path=str(out / "cards.pdf"), format="A4", print_background=True)
        b.close()

n_media = len(list(media.iterdir()))
print(f"뽑은 단어: {', '.join(w['w'] for w in pick)}")
print(f"그림·발음 파일 {n_media}개 복사 → {media}")
print(f"단어카드: {out / 'cards.html'}" + (f" , {out / 'cards.pdf'}" if a.pdf else ""))
print(f"Anki 단어장: {out / 'anki.csv'}")
print(f"걸린 시간: {time.time() - t0:.1f}초")
