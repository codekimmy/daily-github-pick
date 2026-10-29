#!/usr/bin/env bash
# Filee 실제 앱 시연: 자동 조작 + 녹화. 장면 시각은 scene_times.txt에 기록
export DISPLAY=:99
S=/tmp/claude-0/-home-claude/fffa8a80-8fc0-5a1e-b0de-0dc560fc49d9/scratchpad
OUT=${1:-$S/raw.mp4}
LOG=$S/scene_times.txt; : > "$LOG"
T0=$(date +%s.%N)
mark(){ echo "$1 $(echo "$(date +%s.%N) - $T0" | bc)" >> "$LOG"; }

glide(){ local x1=$1 y1=$2 x2=$3 y2=$4 n=${5:-25} i
  for i in $(seq 1 $n); do xdotool mousemove $(( x1 + (x2-x1)*i/n )) $(( y1 + (y2-y1)*i/n )); sleep 0.025; done; }
CX=1000; CY=700   # 쉬는 위치(빈 곳)

# drag <아이콘x> <아이콘y> <놓을x> <놓을y> <이름> [tab]
drag(){ local fx=$1 fy=$2 tx=$3 ty=$4 name=$5 tab=$6
  glide $CX $CY $fx $fy 28; sleep .5
  sleep .3; mark "${name}_select"
  xdotool keydown ctrl; sleep .6; mark "${name}_ctrl"
  xdotool mousedown 1
  for i in $(seq 1 12); do xdotool mousemove_relative 4 3; sleep 0.04; done
  mark "${name}_donut"; sleep 1.4
  if [ "$tab" = tab ]; then xdotool key Tab; mark "${name}_tab"; sleep 1.3; fi
  glide $((fx+48)) $((fy+36)) $tx $ty 24; sleep 1.0; mark "${name}_hover"
  xdotool mouseup 1; sleep .1; xdotool keyup ctrl; mark "${name}_drop"
  sleep 2.8; mark "${name}_done"
  glide $tx $ty $CX $CY 20; xdotool click 1; sleep .8
}

ffmpeg -y -loglevel error -f x11grab -framerate 30 -video_size 1920x1080 -i :99 -c:v libx264 -preset veryfast -crf 16 -pix_fmt yuv420p "$OUT" &
FF=$!
sleep 1.5; mark start
xdotool mousemove $CX $CY; sleep 1.5

drag 364 240 376 149 hwp            # 한글 → PDF
drag 646 240 711 156 heic           # 아이폰 사진(HEIC) → JPG
drag 552 240 671 233 stamp tab      # 도장 → (뒷면) 배경 제거
sleep 2; mark end
kill -INT $FF; wait $FF 2>/dev/null
