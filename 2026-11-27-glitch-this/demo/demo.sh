# 터미널 시연 (tools/record_terminal.sh 로 녹화). 그림은 코드로 그린 가상 그림 (demo/sample/겨울바다.png)
# 날짜 폴더에서 실행: bash demo/demo.sh  — glitch-this 1.0.3 이 PATH 에 있어야 함 (예: /tmp/glitch-bench/venv/bin)
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 1.8; }
S=$(cd "$(dirname "$0")" && pwd)/sample; rm -rf /tmp/gtdemo; mkdir -p /tmp/gtdemo && cp "$S"/겨울바다.png /tmp/gtdemo/ && cd /tmp/gtdemo
echo "# 0) 설치 (Windows: 파이썬 설치 뒤 py -m pip install glitch-this)"; p 'glitch_this --version'
echo; echo "# 1) 세기 5로 망가뜨리기 → glitched_겨울바다.png (원본은 그대로)"; p 'glitch_this 겨울바다.png 5 -sd 42 2>&1 | head -1 && ls'
echo; echo "# 2) 색 어긋남(-c) + 줄무늬(-s)"; p 'glitch_this 겨울바다.png 5 -c -s -o 효과.png 2>&1 | head -1'
echo; echo "# 3) 움직이는 GIF (-g)"; p 'glitch_this 겨울바다.png 5 -g -c -o 움직임.gif 2>&1 | head -2 && ls -l --time-style=+ 움직임.gif'
echo; echo "# 4) 같은 이름이 있으면 멈춤 (-f 로만 덮어씀)"; p 'glitch_this 겨울바다.png 5 -o 효과.png 2>&1 | tail -3'
cd / && rm -rf /tmp/gtdemo
echo; echo "※ 정보 제공용 · 2026-11-27 클라우드 시연 결과(운영자 직접 검증 아님) · 원본 그림은 따로 보관"; sleep 3
