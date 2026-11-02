#!/usr/bin/env bash
# 터미널 녹화용 데모: 설치 확인 → 기본 QR → 사진 QR → 컬러 → 움직이는 QR → 와이파이 QR → 판독 확인
# 사용: bash demo.sh  (amzqr 가 들어 있는 가상환경 bin 이 PATH 에 있어야 함)
export PATH=/home/claude/qrenv/bin:$PATH
cd "$(dirname "$0")"; HERE=$PWD
mkdir -p /tmp/qrdemo && cp assets/cafe.png assets/wave.gif /tmp/qrdemo/ && cd /tmp/qrdemo
p() { printf '\033[1;32m$\033[0m %s\n' "$1"; sleep 0.6; }
c() { printf '\033[90m# %s\033[0m\n' "$1"; sleep 0.8; }
t() { local s=$(date +%s.%N); eval "$1" >/dev/null 2>&1; local e=$(date +%s.%N); printf '\033[1;33m  -> %.2f초\033[0m\n' "$(echo "$e - $s" | bc)"; }

c "amzqr 버전 확인"
p "amzqr -V"; amzqr -V; sleep 1
c "1) 사진 없이 기본 QR (주소만 넣기)"
p "amzqr https://github.com/codekimmy/daily-github-pick -n plain.png"; t "amzqr https://github.com/codekimmy/daily-github-pick -n plain.png"; sleep 0.8
c "2) 내 그림을 배경으로 (-p 그림 / -c 컬러)"
p "amzqr https://github.com/codekimmy/daily-github-pick -p cafe.png -c -n cafe_qr.png"; t "amzqr https://github.com/codekimmy/daily-github-pick -p cafe.png -c -n cafe_qr.png"; sleep 0.8
c "3) 움직이는 그림(GIF)을 넣으면 움직이는 QR"
p "amzqr https://github.com/codekimmy/daily-github-pick -p wave.gif -c -n wave_qr.gif"; t "amzqr https://github.com/codekimmy/daily-github-pick -p wave.gif -c -n wave_qr.gif"; sleep 0.8
c "4) 와이파이 QR (가상의 이름·비밀번호)"
p 'amzqr "WIFI:T:WPA;S:KongKong_Guest;P:coffee1234;;" -p cafe.png -c -n wifi.png'; t 'amzqr "WIFI:T:WPA;S:KongKong_Guest;P:coffee1234;;" -p cafe.png -c -n wifi.png'; sleep 0.8
c "만들어진 파일"
p "ls -l --block-size=K *_qr.* plain.png wifi.png"; ls -l --block-size=K *_qr.* plain.png wifi.png | awk '{print "  "$5"  "$9}'; sleep 1
c "5) 정말 읽히나? QR 판독 프로그램(zxing)으로 확인"
p "python3 read_qr.py cafe_qr.png wifi.png wave_qr.gif"
python3 "$HERE/read_qr.py" cafe_qr.png wifi.png wave_qr.gif
sleep 1
c "6) 한글을 넣으면?"
p "amzqr 안녕하세요"; amzqr 안녕하세요 2>&1 | tail -1 | cut -c1-80; sleep 2.5
