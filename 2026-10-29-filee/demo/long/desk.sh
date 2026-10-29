#!/usr/bin/env bash
# 가상 데스크톱 시작: Xvfb + openbox + picom + 배경색 + Filee
export DISPLAY=:99 LANG=ko_KR.UTF-8
for p in pcmanfm Filee picom openbox xterm Xvfb; do pkill -x $p; done; sleep 1
Xvfb :99 -screen 0 1920x1080x24 >/dev/null 2>&1 &
sleep 1; openbox >/dev/null 2>&1 &
sleep 1; picom --backend xrender >/dev/null 2>&1 &
sleep 1; xsetroot -solid "#1d2433"
cd /root/filee/Filee-2.2.0-linux-x64 && ./Filee >/dev/null 2>&1 &
sleep 7
echo started
