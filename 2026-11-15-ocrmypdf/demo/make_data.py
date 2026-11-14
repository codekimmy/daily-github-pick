"""영상·그림용 자료: render/img/*.png(시연 PDF 쪽 그림) + render/data.js(글자 상자·찾기 위치·측정값)
글자 상자는 OCRmyPDF가 넣은 투명 글자층에서 PDFium(크롬·엣지 PDF 엔진)으로 꺼낸 실제 위치다.
사용: python3 make_data.py (test_all.py 다음)"""
import json, os
import pypdfium2 as pdfium

HERE = os.path.dirname(os.path.abspath(__file__)); O = os.path.join(HERE, "out"); S = os.path.join(HERE, "samples")
IMG = os.path.join(HERE, "render", "img"); os.makedirs(IMG, exist_ok=True)
RES = json.load(open(os.path.join(HERE, "results.json"), encoding="utf-8"))
KEYS = ["관리비", "168,440", "납부기한", "방과후", "12월 4일", "신청서", "치즈케이크", "20,700"]


def save(pdf, i, name, scale=1.4):
    pdfium.PdfDocument(pdf)[i].render(scale=scale).to_pil().convert("RGB").save(os.path.join(IMG, name + ".png"))


def boxes(pdf):
    doc = pdfium.PdfDocument(pdf); pages = []
    for i in range(len(doc)):
        pg = doc[i]; W, H = pg.get_size(); tp = pg.get_textpage(); n = tp.count_chars()
        words, cur = [], None
        for c in range(n):
            ch = tp.get_text_range(c, 1)
            if not ch.strip():
                cur = None; continue
            l, b, r, t = tp.get_charbox(c)
            if cur and abs(cur[1] - (H - t) / H) < .01 and l / W - cur[2] < .02:
                cur[2] = r / W; cur[3] = max(cur[3], (H - b) / H)
            else:
                cur = [l / W, (H - t) / H, r / W, (H - b) / H]; words.append(cur)
        hits = []
        for k in KEYS:
            s = tp.search(k); m = s.get_next()
            while m:
                bs = [tp.get_charbox(j) for j in range(m[0], m[0] + m[1])]
                hits.append([k, min(x[0] for x in bs) / W, (H - max(x[3] for x in bs)) / H, max(x[2] for x in bs) / W, (H - min(x[1] for x in bs)) / H]); m = s.get_next()
        pages.append({"words": [[round(v, 4) for v in w] for w in words if (w[2] - w[0]) > .004], "hits": [[h[0]] + [round(v, 4) for v in h[1:]] for h in hits]})
    return pages


for i in range(3): save(os.path.join(S, "스캔본.pdf"), i, f"p{i + 1}")
save(os.path.join(S, "거꾸로.pdf"), 1, "up2"); save(os.path.join(O, "거꾸로_돌리기.pdf"), 1, "rot2")
save(os.path.join(S, "기울어짐.pdf"), 0, "skew"); save(os.path.join(O, "기울어짐_바로잡기.pdf"), 0, "deskew")
eng = [l for l in pdfium.PdfDocument(os.path.join(O, "영어만.pdf"))[0].get_textpage().get_text_bounded().splitlines() if l.strip()][:6]
kor = [l for l in open(os.path.join(O, "한국어_줄단위.txt"), encoding="utf-8").read().split("\f")[0].splitlines() if l.strip()][:6]
D = {"kor4": boxes(os.path.join(O, "한국어_줄단위.pdf")), "eng": boxes(os.path.join(O, "영어만.pdf")),
     "engLines": eng, "korLines": [" ".join(l.split()) for l in kor],
     "korPay": [" ".join(l.split()) for l in open(os.path.join(O, "한국어_줄단위.txt"), encoding="utf-8").read().splitlines() if l.startswith("납부")]}
with open(os.path.join(HERE, "render", "data.js"), "w", encoding="utf-8") as f:
    f.write("const RES = " + json.dumps(RES, ensure_ascii=False) + ";\nconst OCR = " + json.dumps(D, ensure_ascii=False) + ";\n")
print("words", [len(p["words"]) for p in D["kor4"]], "hits", [len(p["hits"]) for p in D["kor4"]], "eng hits", [len(p["hits"]) for p in D["eng"]])
print(eng); print(D["korLines"])
