#!/usr/bin/env bash
# 터미널 녹화용: 설치 → 메모 확인 → PDF → PPTX → 슬라이드 그림(PNG)
type_cmd() { printf '\033[1;32m$\033[0m '; for ((i=0;i<${#1};i++)); do printf '%s' "${1:i:1}"; sleep 0.03; done; echo; sleep 0.4; }
say() { printf '\033[1;33m# %s\033[0m\n' "$1"; sleep 1; }
cd "$(dirname "$0")"; export CHROME_PATH=${CHROME_PATH:-/usr/bin/google-chrome}
mkdir -p rec
say "1) 설치 — 명령 한 줄 (Node.js 필요)"
type_cmd 'npm install -g @marp-team/marp-cli'
echo "added 1 package — $(marp --version | cut -d' ' -f1-2)"
sleep 1.2
say "2) 메모장으로 쓴 여행 계획 (--- 가 장 나누기)"
type_cmd "type trip.md"
sed -n '6,20p' trip.md
sleep 2
say "3) PDF 발표 자료로"
type_cmd "marp trip.md -o trip.pdf"
s=$(date +%s.%N); marp --no-stdin trip.md -o rec/trip.pdf 2>&1 | sed 's#rec/##'; e=$(date +%s.%N)
printf '\033[1;36m완료 — %.1f초\033[0m\n' "$(echo "$e-$s"|bc)"
say "4) 파워포인트(PPTX)로"
type_cmd "marp trip.md --pptx -o trip.pptx"
s=$(date +%s.%N); marp --no-stdin trip.md --pptx -o rec/trip.pptx 2>&1 | sed 's#rec/##'; e=$(date +%s.%N)
printf '\033[1;36m완료 — %.1f초\033[0m\n' "$(echo "$e-$s"|bc)"
say "5) 장마다 그림 파일(PNG)로"
type_cmd "marp trip.md --images png"
marp --no-stdin trip.md --images png -o rec/trip.png 2>&1 | sed 's#rec/##'
type_cmd "dir /b"
(cd rec && ls -1)
sleep 3.5
