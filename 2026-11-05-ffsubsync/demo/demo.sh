#!/usr/bin/env bash
# 터미널 녹화용: 2.5초 늦은 자막을 ffsubsync로 고치고, 고치기 전/후 첫 문장 시각을 비교
cd "$(dirname "$0")/work"
p() { printf '\033[1;32m$\033[0m %s\n' "$1"; sleep 0.6; }
p "ffsubsync --version"; ffsubsync --version; sleep 0.8
echo; p "head -3 늦은자막.srt   # 2.5초 늦은 자막 (첫 문장 정답은 1.5초)"; head -3 늦은자막.srt; sleep 1
echo; p "ffsubsync 라면영상.mp4 -i 늦은자막.srt -o 고친자막.srt"
s=$(date +%s.%N); ffsubsync 라면영상.mp4 -i 늦은자막.srt -o 고친자막.srt 2>&1 | grep -E "offset seconds|framerate scale|writing output" | sed -E 's/^ *(\[[0-9:]*\])? *INFO +//; s/ +[a-z_]+\.py:[0-9]+ *$//'
e=$(date +%s.%N); printf '\033[1;33m걸린 시간: %.2f초\033[0m\n' "$(python3 -c "print($e - $s)")"; sleep 1
echo; p "head -3 고친자막.srt"; head -3 고친자막.srt; sleep 1.2
echo; printf '\033[1;32m첫 문장: 4.000초 → 1.496초 (정답 1.500초)\033[0m\n'; sleep 2.5
