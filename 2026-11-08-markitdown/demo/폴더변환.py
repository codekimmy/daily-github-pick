"""폴더 안 문서를 한 번에 글 파일(.md)로 바꾸기 (폴더변환.bat 와 같은 일을 파이썬으로)
사용: python 폴더변환.py <문서 폴더>   → <문서 폴더>/md/ 에 저장. 원본은 바꾸지 않음"""
import sys, time
from pathlib import Path
from markitdown import MarkItDown
src = Path(sys.argv[1] if len(sys.argv) > 1 else "."); out = src / "md"; out.mkdir(exist_ok=True)
md, t0, ok = MarkItDown(), time.time(), 0
for f in sorted(src.iterdir()):
    if f.suffix.lower() not in {".docx", ".xlsx", ".pptx", ".pdf", ".html", ".csv", ".epub"}: continue
    try:
        text = md.convert(str(f)).text_content
        (out / (f.stem + ".md")).write_text(text, encoding="utf-8"); ok += 1
        print(f"✔ {f.name:18} → md/{f.stem}.md ({len(text):,}자)" + ("   ← 글자 없음(스캔본?)" if not text.strip() else ""))
    except Exception as e:
        print(f"✘ {f.name}: {type(e).__name__}")
print(f"{ok}개 파일, {time.time() - t0:.1f}초")
