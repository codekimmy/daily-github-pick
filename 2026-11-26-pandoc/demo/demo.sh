# 터미널 시연 (tools/record_terminal.sh 로 녹화). 문서는 모두 시연용 가상 자료 (demo/sample/회의록.md)
# 날짜 폴더에서 실행: bash demo/demo.sh  — pandoc 3.14 · typst 0.14.2 가 PATH 에 있어야 함
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 1.8; }
S=$(cd "$(dirname "$0")" && pwd)/sample; rm -rf /tmp/pddemo; mkdir -p /tmp/pddemo && cp "$S"/회의록.md /tmp/pddemo/ && cd /tmp/pddemo
echo "# 0) 메모장으로 쓴 마크다운 회의록 (Windows: winget install --id JohnMacFarlane.Pandoc)"; p 'head -12 회의록.md'
echo; echo "# 1) 워드 문서로"; p 'time pandoc 회의록.md -o 회의록.docx'
echo; echo "# 2) 같은 글을 파워포인트 · 전자책 · 웹페이지로"; p 'pandoc 회의록.md -o 회의록.pptx && pandoc 회의록.md -o 회의록.epub && pandoc 회의록.md -s --toc -o 회의록.html && ls -l --time-style=+ 회의록.*'
echo; echo "# 3) 워드를 다시 마크다운으로 (표 그대로)"; p 'pandoc 회의록.docx -t gfm | sed -n 15,20p'
echo; echo "# 4) PDF: 그냥 하면 오류 → typst + 한글 글꼴"; p 'pandoc 회의록.md -o 회의록.pdf'
p 'pandoc 회의록.md -o 회의록.pdf --pdf-engine=typst -V mainfont="Noto Sans CJK KR" && ls -l --time-style=+ 회의록.pdf'
cd / && rm -rf /tmp/pddemo
echo; echo "※ 정보 제공용 · 2026-11-27 클라우드 시연 결과(운영자 직접 검증 아님) · 원본 파일은 따로 보관"; sleep 3
