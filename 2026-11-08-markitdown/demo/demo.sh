# 터미널 시연 (tools/record_terminal.sh 로 녹화). 문서는 모두 시연용으로 만든 가상 자료(make_docs.py)
cd "$(dirname "$0")/work/docs"
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .6; eval "$1"; sleep 1.6; }
echo "# 1) 설치 확인"; p "markitdown --version"
echo; echo "# 2) 워드 회의록 → 글(마크다운)로"; p "markitdown 회의록.docx 2>/dev/null | head -18"
echo; echo "# 3) 파워포인트 → 슬라이드별 글 + 발표자 메모"; p "markitdown 발표.pptx | sed -n 6,14p"
echo; echo "# 4) 파일로 저장 (-o) 하고 크기 비교"; p "markitdown 회의록.docx -o /tmp/회의록.md && ls -lh 회의록.docx /tmp/회의록.md | awk '{print \$5, \$9}'"
echo; echo "# 5) 스캔한 PDF(글자가 그림)는?"; p "markitdown 스캔본.pdf | wc -c"
rm -f /tmp/회의록.md
