# 터미널 시연 (tools/record_terminal.sh 로 녹화). 원본: 직접 그린 5초 노을 영상(demo/src/sunset.mp4, 480×320, 100장)
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 1.6; }
D=$(cd "$(dirname "$0")" && pwd); mkdir -p /tmp/gsdemo && cd /tmp/gsdemo && rm -f *.gif && cp "$D/src/sunset.mp4" .
echo "# 1) 설치 확인 (Windows: winget install ImageOptim.gifski)"; p "gifski --version"
echo; echo "# 2) 흔한 방법: ffmpeg 기본 변환"; p "ffmpeg -loglevel error -i sunset.mp4 basic.gif"
echo; echo "# 3) gifski: ffmpeg가 영상을 풀어 넘기고 gifski가 GIF로 칠함"
p "ffmpeg -loglevel error -i sunset.mp4 -f yuv4mpegpipe - | gifski -q -o gifski.gif -"
echo; echo "# 4) 더 작게: 가로 320 · 초당 10장 · 품질 70"
p "ffmpeg -loglevel error -i sunset.mp4 -f yuv4mpegpipe - | gifski -q -W 320 -r 10 -Q 70 -o small.gif -"
echo; echo "# 5) 크기 비교"; p "ls -lh --block-size=K *.gif | awk '{print \$5, \$9}'"
cd / && rm -rf /tmp/gsdemo
echo; echo "※ 정보 제공용 · 2026-11-19 클라우드 시연 결과(운영자 직접 검증 아님) · 원본 영상은 보관"; sleep 3
