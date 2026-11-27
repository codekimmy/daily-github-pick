# 터미널 시연 (tools/record_terminal.sh 로 녹화). 그림은 코드로 그린 가상 그림 (demo/sample/가을산책.png)
# 날짜 폴더에서 실행: bash demo/demo.sh  — stegano 3.0.0 이 PATH 에 있어야 함 (예: /tmp/stegano-bench/venv/bin)
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 1.8; }
S=$(cd "$(dirname "$0")" && pwd)/sample; rm -rf /tmp/stdemo; mkdir -p /tmp/stdemo && cp "$S"/가을산책.png /tmp/stdemo/ && cd /tmp/stdemo
echo "# 0) 설치 (Windows: 파이썬 설치 뒤 py -m pip install stegano)"; p 'pip show stegano 2>/dev/null | sed -n 1,2p'
echo; echo "# 1) 그림 속에 쪽지 숨기기 → 비밀.png (원본은 그대로)"; p 'stegano-lsb hide -i 가을산책.png -m "엄마 생신 깜짝 파티: 12월 5일 저녁 7시" -o 비밀.png && ls -l --time-style=+ *.png'
echo; echo "# 2) 쪽지 꺼내기"; p 'stegano-lsb reveal -i 비밀.png'
echo; echo "# 3) 숨긴 게 없는 그림을 꺼내 보면"; p 'stegano-lsb reveal -i 가을산책.png'
echo; echo "# 4) JPG 로 다시 저장(메신저 압축 흉내)하면 쪽지가 사라짐"; p 'python3 -c "from PIL import Image; Image.open(\"비밀.png\").convert(\"RGB\").save(\"압축.jpg\", quality=95)" && stegano-lsb reveal -i 압축.jpg'
cd / && rm -rf /tmp/stdemo
echo; echo "※ 정보 제공용 · 2026-11-28 클라우드 시연 결과(운영자 직접 검증 아님) · 숨기기일 뿐 암호화 아님"; sleep 3
