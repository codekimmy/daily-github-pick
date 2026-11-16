#!/usr/bin/env bash
# 영상용 장면 녹화: 모듈마다 가상 터미널(가로 92칸 × 세로 24줄)에서 14초씩 실행해 asciinema 기록(.cast)으로 저장 → clips.py 가 화면 글자로 바꿈
cd "$(dirname "$0")"; mkdir -p casts
for m in cc memdump bruteforce download kernel_compile cryptomining botnet docker_build simcity terraform bootlog weblog; do
  asciinema rec -q --overwrite --cols 92 --rows 24 -c "genact -m $m --exit-after-time 14s" casts/$m.cast &
  if (( $(jobs -r | wc -l) >= 3 )); then wait -n; fi
done; wait; ls -la casts
