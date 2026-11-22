# 터미널 시연 (tools/record_terminal.sh 로 녹화). 시연용 가상 사진 6장(photos/, 컴퓨터로 그린 풍경)을 줄임
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 1.8; }
D=$(cd "$(dirname "$0")" && pwd); W=/tmp/scdemo; rm -rf $W; mkdir -p $W && cd $W
cp "$D"/photos/*.jpg . ; cp "$D/sizes.py" .; export PATH="$D/work/node_modules/.bin:$PATH"
echo "# 1) 설치 확인 (Windows: npm install -g sharp-cli)"; p "sharp --version"
echo; echo "# 2) 휴대폰 크기 가상 사진 6장"; p "python3 sizes.py *.jpg"
echo; echo "# 3) 6장을 가로 1600으로 줄여 '작게' 폴더에 (화질 80)"; p "time sharp -i '*.jpg' -o '작게/{name}.jpg' resize 1600 >/dev/null"
echo; echo "# 4) 결과: 용량 약 10분의 1, 위치 정보는 빠짐"; p "python3 sizes.py 작게/*.jpg"
cd / && rm -rf $W
echo; echo "※ 정보 제공용 · 2026-11-23 클라우드 시연 결과(운영자 직접 검증 아님) · 원본 사진은 따로 보관"; sleep 3
