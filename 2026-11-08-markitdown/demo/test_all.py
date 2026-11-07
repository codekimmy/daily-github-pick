"""markitdown 시연 측정 → results.json
- 명령어(markitdown 파일 -o 결과.md)로 문서마다 3번 변환, 걸린 시간 가운데 값 (프로그램 켜는 시간 포함)
- 결과 글자 수, 원본 대비 크기, 표·제목·목록이 살아 있는지 자동 확인
사용: python3 test_all.py"""
import json, os, re, statistics, subprocess, time
H = os.path.dirname(os.path.abspath(__file__)); D, O = f"{H}/work/docs", f"{H}/work/out"; os.makedirs(O, exist_ok=True)
ver = subprocess.run(["markitdown", "--version"], capture_output=True, text=True).stdout.split()[-1]

def run(src, out):
    ts = []
    for _ in range(3):
        t = time.time(); p = subprocess.run(["markitdown", src, "-o", out], capture_output=True, text=True); ts.append(time.time() - t)
    return round(statistics.median(ts), 2), p.returncode, p.stderr

FILES = [("회의록.docx", "워드", "회의록"), ("가계부.xlsx", "엑셀", "가계부 (시트 2개)"), ("발표.pptx", "파워포인트", "발표 3장"),
         ("안내문.pdf", "PDF", "공지 PDF"), ("공지.html", "웹페이지", "아파트 공지"), ("명단_cp949.csv", "CSV", "윈도우 엑셀 CSV(한글 인코딩)"),
         ("화분책.epub", "전자책", "EPUB 2장"), ("묶음.zip", "ZIP", "파일 3개 묶음"), ("스캔본.pdf", "스캔 PDF", "글자가 그림인 PDF"),
         ("영수증사진.jpg", "사진", "글자가 찍힌 사진"), ("설명서100쪽.pdf", "PDF", "100쪽 설명서"), ("주문1만줄.xlsx", "엑셀", "1만 줄 주문표"), ("교육50장.pptx", "파워포인트", "50장 교육 자료")]
res = []
for f, kind, label in FILES:
    out = f"{O}/{os.path.splitext(f)[0]}.md"; sec, rc, err = run(f"{D}/{f}", out)
    md = open(out, encoding="utf-8").read() if os.path.exists(out) else ""
    r = dict(file=f, kind=kind, label=label, sec=sec, rc=rc, kb_in=round(os.path.getsize(f"{D}/{f}") / 1024, 1), kb_out=round(len(md.encode()) / 1024, 2),
             chars=len(md.strip()), hangul=len(re.findall("[가-힣]", md)), tables=len(re.findall(r"^\| ?---", md, re.M)), headings=len(re.findall(r"^#{1,6} ", md, re.M)),
             bullets=len(re.findall(r"^\s*(\*|-|\d+\.) ", md, re.M)), bold=md.count("**") // 2, links=len(re.findall(r"\]\(http", md)),
             nan=md.count("NaN"), empty_header=bool(re.search(r"^\|(\s+\|)+\s*$", md, re.M)), warn_lines=len([l for l in err.splitlines() if l.strip()]),
             head=md.strip()[:300])
    res.append(r); print(f"{f:16} {sec:5}s rc={rc} {r['kb_in']:7}KB → {r['kb_out']:6}KB 글자 {r['chars']:6} 표{r['tables']} 제목{r['headings']} 목록{r['bullets']} 경고{r['warn_lines']} NaN{r['nan']}")

# 파이썬으로 한 번에 (프로그램을 한 번만 켜고 여러 파일)
from markitdown import MarkItDown
t = time.time(); mid = MarkItDown(); init = time.time() - t
t = time.time(); n = 0
for f, *_ in FILES[:8]: mid.convert(f"{D}/{f}"); n += 1
py = dict(init=round(init, 2), files=n, sec=round(time.time() - t, 2))
print("python", py)

# 지원하지 않는 형식 (HWP 이름의 파일)
open(f"{O}/_x.hwp", "w", encoding="utf-8").write("가짜 한글 파일")
p = subprocess.run(["markitdown", f"{O}/_x.hwp"], capture_output=True, text=True); os.remove(f"{O}/_x.hwp")
conv = sorted(x[1:-13] for x in os.listdir(os.path.dirname(__import__("markitdown").__file__) + "/converters") if x.endswith("_converter.py"))
json.dump(dict(version=ver, files=res, python=py, hwp_err=p.stderr.strip().splitlines()[-1][:160], converters=conv), open(f"{H}/results.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("saved results.json")
