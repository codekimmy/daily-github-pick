#!/usr/bin/env bash
# 터미널 녹화용: 설치 → 사진 1장 배경 지우기 → 흰 배경 → 폴더 통째로
type_cmd() { printf '\033[1;32m$\033[0m '; for ((i=0;i<${#1};i++)); do printf '%s' "${1:i:1}"; sleep 0.03; done; echo; sleep 0.4; }
say() { printf '\033[1;33m# %s\033[0m\n' "$1"; sleep 1; }
cd "$(dirname "$0")"
rm -rf rec && mkdir -p rec
say "1) 설치 — 명령 한 줄"
type_cmd 'pip install "rembg[cpu,cli]"'
echo "Successfully installed rembg-$(pip show rembg 2>/dev/null | awk '/^Version/{print $2}') onnxruntime-$(pip show onnxruntime 2>/dev/null | awk '/^Version/{print $2}')"
sleep 1.2
say "2) 커피 사진 배경 지우기 (-m u2net: 176MB 모델, 처음 한 번만 받음)"
type_cmd "rembg i -m u2net coffee.png coffee_nobg.png"
s=$(date +%s.%N); rembg i -m u2net input/coffee.png rec/coffee_nobg.png 2>/dev/null; e=$(date +%s.%N)
printf '완료 — %.1f초\n' "$(echo "$e-$s"|bc)"
type_cmd "python info.py coffee_nobg.png"
(cd rec && python3 ../info.py coffee_nobg.png)
sleep 2
say "3) 투명 대신 흰 배경으로 (중고거래·쇼핑몰 사진)"
type_cmd "rembg i -m u2net -bgc 255 255 255 255 coffee.png coffee_white.png"
s=$(date +%s.%N); rembg i -m u2net -bgc 255 255 255 255 input/coffee.png rec/coffee_white.png 2>/dev/null; e=$(date +%s.%N)
printf '완료 — %.1f초\n' "$(echo "$e-$s"|bc)"
sleep 1.5
say "4) 폴더 안 사진 전부 한 번에 (고양이·커피·로켓 3장)"
type_cmd "rembg p -m u2net input output"
s=$(date +%s.%N); rembg p -m u2net input rec/output 2>/dev/null; e=$(date +%s.%N)
printf '완료 — 3장 %.1f초\n' "$(echo "$e-$s"|bc)"
type_cmd "dir output"
ls -1 rec/output
(cd rec/output && python3 ../../info.py *.png)
sleep 3.5
