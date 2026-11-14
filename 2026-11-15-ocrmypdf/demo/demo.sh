# 터미널 시연 (tools/record_terminal.sh 로 녹화). 문서는 make_samples.py 로 만든 가상 스캔 문서(관리비 고지서·가정통신문·영수증)
cd "$(dirname "$0")"
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 2.2; }
mkdir -p /tmp/ocrdemo && cp samples/스캔본.pdf /tmp/ocrdemo/스캔본.pdf && cp samples/거꾸로.pdf /tmp/ocrdemo/거꾸로.pdf
W="관리비 납부기한 방과후 신청서 치즈케이크"
echo "# 1) 설치 확인 (pip install ocrmypdf + Tesseract 한국어 언어 파일)"; p "ocrmypdf --version"
echo; echo "# 2) 가상 스캔 문서 3쪽 — 글자가 그림이라 찾기가 안 됨"; p "python3 찾기.py /tmp/ocrdemo/스캔본.pdf $W"
clear; echo "# 3) 한국어(kor) + 줄 단위로 읽기(--tesseract-pagesegmode 4)"
p "ocrmypdf -q -l kor+eng --tesseract-pagesegmode 4 /tmp/ocrdemo/스캔본.pdf /tmp/ocrdemo/검색가능.pdf"
p "python3 찾기.py /tmp/ocrdemo/검색가능.pdf $W"
clear; echo "# 4) 2쪽이 거꾸로 스캔된 문서 → --rotate-pages 로 바로 세우기"
p "ocrmypdf -q -l kor+eng --tesseract-pagesegmode 4 --rotate-pages /tmp/ocrdemo/거꾸로.pdf /tmp/ocrdemo/거꾸로_돌림.pdf"
p "python3 찾기.py /tmp/ocrdemo/거꾸로_돌림.pdf 방과후 신청서"
clear; echo "# 5) 이미 글자가 있는 PDF에 다시 넣으면 멈춤 → --skip-text"
p "ocrmypdf -q -l kor+eng /tmp/ocrdemo/검색가능.pdf /tmp/ocrdemo/또.pdf 2>&1 | tail -1 | cut -c1-90"
p "ocrmypdf -q -l kor+eng --skip-text /tmp/ocrdemo/검색가능.pdf /tmp/ocrdemo/또.pdf && echo 완료"
rm -rf /tmp/ocrdemo
echo; echo "※ 정보 제공용 · 2026-11-15 클라우드 시연 결과(운영자 직접 검증 아님) · 원본 PDF는 따로 보관"; sleep 3
