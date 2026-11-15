# 터미널 시연 (tools/record_terminal.sh 로 녹화). 그림은 make_samples.py 로 만든 가상 로고·서명·도트 그림 + CC0 고양이 사진
cd "$(dirname "$0")"
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 2.2; }
mkdir -p /tmp/vtdemo && cp samples/로고_작은.jpg samples/서명_사진.jpg samples/도트.png /tmp/vtdemo/ && cd /tmp/vtdemo
k(){ printf '  %-16s %6s KB\n' "$1" "$(echo "scale=1; $(stat -c%s "$1")/1024" | bc)"; }
echo "# 1) 설치 확인 (pip install vtracer==1.0.0a4 · 명령어판은 cargo install vtracer-cli)"; p "vtracer --version"
echo; echo "# 2) 240px 작은 로고 JPG → SVG (색 6가지 + 곡선 단순화)"
p "time vtracer 로고_작은.jpg 로고.svg --max-colors 6 --simplify 1.5"
p "k 로고_작은.jpg; k 로고.svg; grep -c '<path' 로고.svg"
clear; echo "# 3) 휴대폰으로 찍은 서명 (오른쪽에 그림자) → 흑백 선 그림"
p "vtracer 서명_사진.jpg 서명_기본.svg --preset bw && grep -c '<path' 서명_기본.svg"
p "vtracer 서명_사진.jpg 서명.svg --clustering bw --adaptive && grep -c '<path' 서명.svg"
clear; echo "# 4) 24x24 도트 그림 → 네모 칸 그대로 (-m pixel)"
p "vtracer 도트.png 도트.svg -m pixel -f 0 && k 도트.svg"
cd / && rm -rf /tmp/vtdemo
echo; echo "※ 정보 제공용 · 2026-11-16 클라우드 시연 결과(운영자 직접 검증 아님) · 원본 그림은 따로 보관"; sleep 3
