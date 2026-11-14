"""PDF 안에서 낱말 찾기 (크롬·엣지 PDF 화면과 같은 엔진 PDFium 사용) — 터미널 녹화용 보조.
사용: python3 찾기.py 문서.pdf 낱말1 낱말2 ..."""
import sys
import pypdfium2 as pdfium
doc = pdfium.PdfDocument(sys.argv[1]); total = 0
for w in sys.argv[2:]:
    pages = [i + 1 for i in range(len(doc)) if doc[i].get_textpage().search(w).get_next()]
    total += bool(pages); print(f"  '{w}' → " + (f"{', '.join(map(str, pages))}쪽에서 찾음" if pages else "찾을 수 없음"))
print(f"  찾은 낱말 {total} / {len(sys.argv) - 2}개")
