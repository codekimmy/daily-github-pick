#!/usr/bin/env bash
# 터미널 녹화용: 원본 길이 확인 → 미리보기(--preview) → 자르기 → 결과 길이
# 사용: cd <lecture.mp4 있는 폴더> && bash demo.sh
type_cmd() { printf '\033[1;32m$\033[0m '; for ((i=0;i<${#1};i++)); do printf '%s' "${1:i:1}"; sleep 0.03; done; echo; sleep 0.4; }
say() { printf '\033[1;33m# %s\033[0m\n' "$1"; sleep 1; }
len() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1" | awk '{printf "%d분 %.1f초\n", $1/60, $1%60}'; }
rm -f lecture_ALTERED.mp4

say "1) 원본 강의 영상 길이"
type_cmd "길이 확인: lecture.mp4"
len lecture.mp4
sleep 1.5
say "2) 얼마나 잘릴지 미리보기 (실제로 자르지는 않음)"
type_cmd "auto-editor lecture.mp4 --preview"
auto-editor lecture.mp4 --preview 2>&1 | sed -n '2,10p'
sleep 3
say "3) 진짜 자르기 — 명령 한 줄"
type_cmd "auto-editor lecture.mp4"
start=$(date +%s.%N)
auto-editor lecture.mp4 --no-open --progress none >/dev/null 2>&1
end=$(date +%s.%N)
printf '완료! 걸린 시간 %.1f초 → lecture_ALTERED.mp4\n' "$(echo "$end-$start" | bc)"
sleep 1
type_cmd "길이 확인: lecture_ALTERED.mp4"
len lecture_ALTERED.mp4
sleep 3
