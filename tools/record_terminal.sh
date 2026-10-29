#!/usr/bin/env bash
# 터미널 실행 과정을 GIF로 녹화. 사용: tools/record_terminal.sh <데모스크립트.sh> <출력.gif>
set -e
cast=$(mktemp --suffix .cast)
asciinema rec -q --overwrite --cols 100 --rows 26 -c "bash $1" "$cast"
agg --font-size 16 --speed 1.2 "$cast" "$2"
echo "saved $2"
