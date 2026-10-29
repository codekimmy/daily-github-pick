#!/usr/bin/env bash
# 가상 데스크톱: Xvfb + openbox + Filee + pcmanfm
export DISPLAY=:99 LANG=ko_KR.UTF-8
Xvfb :99 -screen 0 1920x1080x24 >/dev/null 2>&1 &
sleep 1
openbox >/dev/null 2>&1 &
sleep 1
picom --backend xrender >/dev/null 2>&1 &
sleep 1
xsetroot -solid "#2b3a55"
cd /root/filee/Filee-2.2.0-linux-x64 && ./Filee >/dev/null 2>&1 &
sleep 7
pcmanfm --no-desktop -n /root/바탕화면/회사문서 >/dev/null 2>&1 &
sleep 3
F=$(xdotool search --name "^Filee$" | head -1)
W=$(xdotool search --class pcmanfm | tail -1)
xdotool windowmove "$F" 840 70; xdotool windowsize "$F" 1040 920
xdotool windowmove "$W" 60 140; xdotool windowsize "$W" 720 500
xdotool windowactivate "$W"
sleep 1
echo "F=$F W=$W"
