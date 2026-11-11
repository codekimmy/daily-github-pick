# 터미널 시연 (tools/record_terminal.sh 로 녹화). 인사 글은 시연용으로 직접 쓴 글(texts/인사.txt)
cd "$(dirname "$0")/texts"
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 2.2; }
echo "# 1) 설치 확인 (pip install terminaltexteffects)"; p "tte --version"
echo; echo "# 2) 시연용 인사 글 두 줄"; p "cat 인사.txt"
echo; echo "# 3) 암호 해독 효과 (기본 설정)"; p "tte -i 인사.txt decrypt"
clear; echo "# 4) 넓은 무대(가로 40칸·세로 10줄) + 생일 색(분홍·노랑) 불꽃놀이"
p "tte -i 인사.txt --canvas-width 40 --canvas-height 10 --anchor-text c fireworks --firework-colors ff6b9d ffd166 ffffff --final-gradient-stops ff6b9d ffd166"
clear; echo "# 5) 불타기 효과"; p "tte -i 인사.txt --canvas-width 40 --canvas-height 10 --anchor-text c burn"
