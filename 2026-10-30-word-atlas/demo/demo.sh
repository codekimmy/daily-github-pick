#!/usr/bin/env bash
# 터미널 녹화용 데모: 공개 데이터 세기 → 단어카드·Anki 단어장 만들기
# 사용: ATLAS=<word-atlas 폴더> bash demo.sh
D=$(cd "$(dirname "$0")" && pwd)
ATLAS=${ATLAS:-word-atlas}
OUT=${OUT:-/tmp/wa-out}
rm -rf "$OUT"
type_cmd() { printf '\033[1;32m$\033[0m '; for ((i=0;i<${#1};i++)); do printf '%s' "${1:i:1}"; sleep 0.03; done; echo; sleep 0.4; }
say() { printf '\033[1;33m# %s\033[0m\n' "$1"; sleep 1; }

say "1) 받은 단어 데이터가 소개대로 다 들어 있는지 세어 보기"
type_cmd "python stats.py word-atlas"
python3 -I "$D/stats.py" "$ATLAS"
sleep 2.5
echo
say "2) B1 수준 '여행' 주제 단어 12개로 그림 단어카드 + Anki 단어장 만들기"
type_cmd "python make_deck.py --atlas word-atlas --level B1 --topic travel --count 12 --pdf"
python3 -I "$D/make_deck.py" --atlas "$ATLAS" --level B1 --topic travel --count 12 --pdf --out "$OUT"
sleep 2
echo
say "3) 만들어진 파일 확인"
type_cmd "ls out/B1-travel"
ls --color=always "$OUT/B1-travel"
type_cmd "ls out/B1-travel/media | head -6"
ls "$OUT/B1-travel/media" | head -6
sleep 3
