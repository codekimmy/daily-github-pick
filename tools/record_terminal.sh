#!/usr/bin/env bash
# 터미널 실행 과정을 GIF로 녹화. 사용: tools/record_terminal.sh <데모스크립트.sh> <출력.gif>
set -e
cast=$(mktemp --suffix .cast)
asciinema rec -q --overwrite --cols 100 --rows 26 -c "bash $1" "$cast"
if command -v agg >/dev/null; then
  agg --font-size 16 --speed 1.2 "$cast" "$2"
else  # agg를 못 받을 때: 같은 폴더의 cast2gif.py(pyte + Pillow)로 대체
  python3 "$(dirname "$0")/cast2gif.py" "$cast" "$2" 1.2
fi
echo "saved $2"
