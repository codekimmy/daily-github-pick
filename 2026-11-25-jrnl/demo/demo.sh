# 터미널 시연 (tools/record_terminal.sh 로 녹화). 일기 내용은 모두 시연용 가상 자료
# 처음 실행 질문 3개는 미리 답해 둔 설정으로 건너뜀 (24시간 표시). 날짜 2026-11-25 기준
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 1.8; }
export HOME=/tmp/jrdemo; rm -rf /tmp/jrdemo; mkdir -p /tmp/jrdemo && cd /tmp/jrdemo
printf '\nn\nn\n' | jrnl "첫 일기. jrnl 설치 @설치" >/dev/null 2>&1
sed -i "s/timeformat: '%F %r'/timeformat: '%Y-%m-%d %H:%M'/" .config/jrnl/jrnl.yaml
export COLUMNS=100
echo "# 1) 한 줄로 일기 쓰기 (Windows: py -m pip install jrnl)"; p 'jrnl "점심은 김치찌개였다. @점심 #가계부 9000원"'
p 'jrnl "yesterday: *친구 생일 파티. @모임"'
echo; echo "# 2) 태그로 찾기"; p 'jrnl @점심'
echo; echo "# 3) 태그 개수 세기 · 별표 일기만"; p 'jrnl --tags'; p 'jrnl -starred --short'
echo; echo "# 4) 마크다운 파일로 내보내기"; p 'jrnl --format md --file 일기.md && head -6 일기.md'
cd / && rm -rf /tmp/jrdemo
echo; echo "※ 정보 제공용 · 2026-11-25 클라우드 시연 결과(운영자 직접 검증 아님) · 일기 파일은 따로 백업"; sleep 3
