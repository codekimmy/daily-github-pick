# 터미널 시연 (tools/record_terminal.sh 로 녹화). 와이파이 이름·비밀번호는 시연용 가상 값
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 1.8; }
D=$(cd "$(dirname "$0")" && pwd); W=/tmp/sgdemo; rm -rf $W; mkdir -p $W && cd $W; cp "$D/read.py" .
echo "# 1) 설치 확인 (Windows: py -m pip install segno)"; p "segno --ver"
echo; echo "# 2) 명령 창에 바로 QR 그리기"; p "segno https://example.com --compact"
echo; echo "# 3) 우리집 와이파이 QR을 그림 파일로 (가상 이름·비밀번호)"; p "time segno 'WIFI:T:WPA;S:우리집_5G;P:kimchi2026!;;' -o wifi.png --scale 10"
echo; echo "# 4) 만든 QR을 다른 프로그램(zxing-cpp)으로 읽어 확인"; p "python3 read.py wifi.png"
cd / && rm -rf $W
echo; echo "※ 정보 제공용 · 2026-11-24 클라우드 시연 결과(운영자 직접 검증 아님) · 비밀번호 QR은 아는 사람에게만"; sleep 3
