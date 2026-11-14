"""OCRmyPDF 시연 측정 → results.json, out/*.pdf (out 은 저장소에서 빼 둠, 다시 만들 수 있음)
정확도 = 1 - (글자 편집 거리 / 정답 글자 수), 띄어쓰기는 빼고 비교. 찾기·글자 = 크롬·엣지 PDF 화면과 같은 엔진(PDFium, pypdfium2)의 찾기·글자 꺼내기
사용: python3 test_all.py"""
import json, os, re, subprocess, time
import pypdfium2 as pdfium

HERE = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(HERE, "samples"); O = os.path.join(HERE, "out"); os.makedirs(O, exist_ok=True)
TRUTH = json.load(open(os.path.join(S, "정답.json"), encoding="utf-8")); PAGES = list(TRUTH)
WORDS = ["관리비", "168,440", "납부기한", "789012", "방과후", "12월 4일", "신청서", "치즈케이크", "20,700"]


def lev(a, b):
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1): cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


def text_of(pdf, page=None):
    doc = pdfium.PdfDocument(pdf); idx = [page - 1] if page else range(len(doc))
    return "\n".join(doc[i].get_textpage().get_text_bounded() for i in idx)


def acc(pdf, pages=(1, 2, 3)):
    out = {}
    for p in pages:
        got = re.sub(r"\s", "", text_of(pdf, p)); want = re.sub(r"\s", "", "".join(TRUTH[PAGES[p - 1]]))
        out[PAGES[p - 1]] = round(100 * max(0, 1 - lev(got, want) / len(want)), 1)
    return out


def found(pdf):  # PDF 화면에서 Ctrl+F 로 찾았을 때 걸리는지 (PDFium 찾기)
    doc = pdfium.PdfDocument(pdf)
    return {w: any(doc[i].get_textpage().search(w).get_next() for i in range(len(doc))) for w in WORDS}


def run(name, src, *opts):
    dst = os.path.join(O, name + ".pdf"); t = time.time()
    p = subprocess.run(["ocrmypdf", *opts, os.path.join(S, src), dst], capture_output=True, text=True)
    sec = round(time.time() - t, 2); print(name, p.returncode, sec, flush=True)
    ang = [l.split("Deskew angle:")[1].strip() for l in p.stderr.splitlines() if "Deskew angle:" in l]
    r = {"angle": ang[0] if ang else None, "cmd": "ocrmypdf " + " ".join(opts) + f" {src} {name}.pdf", "code": p.returncode, "sec": sec,
         "in_kb": os.path.getsize(os.path.join(S, src)) // 1024, "err": p.stderr.strip().splitlines()[-1:] if p.returncode else []}
    if p.returncode == 0: r["out_kb"] = os.path.getsize(dst) // 1024
    return r, dst


R = {"version": subprocess.run(["ocrmypdf", "--version"], capture_output=True, text=True).stdout.strip(),
     "tesseract": subprocess.run(["tesseract", "--version"], capture_output=True, text=True).stdout.splitlines()[0],
     "before_chars": len(text_of(os.path.join(S, "스캔본.pdf")).strip())}

K4 = ("-l", "kor+eng", "--tesseract-pagesegmode", "4")  # 한국어 + 줄 단위로 읽기
r, d = run("영어만", "스캔본.pdf"); r["acc"] = acc(d); r["found"] = found(d); r["sample"] = text_of(d, 1).strip().splitlines()[:4]; R["eng"] = r
r, d = run("한국어_기본", "스캔본.pdf", "-l", "kor+eng"); r["acc"] = acc(d); r["found"] = found(d); R["kor"] = r
r, d = run("한국어_줄단위", "스캔본.pdf", *K4, "--sidecar", os.path.join(O, "한국어_줄단위.txt")); r["acc"] = acc(d); r["found"] = found(d); R["kor4"] = r
r, d = run("저해상도", "저해상도.pdf", *K4); r["acc"] = acc(d); r["found"] = found(d); R["lowres"] = r
r, d = run("기울어짐_그대로", "기울어짐.pdf", *K4); r["acc"] = acc(d, (1,)); R["skew"] = r
r, d = run("기울어짐_바로잡기", "기울어짐.pdf", *K4, "--deskew", "-v", "1"); r["acc"] = acc(d, (1,)) if r["code"] == 0 else {}; R["deskew"] = r
r, d = run("기울어짐6도_바로잡기", "기울어짐6도.pdf", *K4, "--deskew", "-v", "1"); r["acc"] = acc(d, (1,)); R["deskew6"] = r
r, d = run("거꾸로_그대로", "거꾸로.pdf", *K4); r["acc"] = acc(d); R["upside"] = r
r, d = run("거꾸로_돌리기", "거꾸로.pdf", *K4, "--rotate-pages"); r["acc"] = acc(d) if r["code"] == 0 else {}; R["rotate"] = r
r, d = run("30쪽", "30쪽.pdf", *K4); R["p30"] = r
r, d = run("다시넣기", "../out/한국어_줄단위.pdf", *K4); R["again"] = r
r, d = run("다시넣기_건너뛰기", "../out/한국어_줄단위.pdf", *K4, "--skip-text"); R["again_skip"] = r
json.dump(R, open(os.path.join(HERE, "results.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1))
