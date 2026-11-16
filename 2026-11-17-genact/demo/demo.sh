# 터미널 시연 (tools/record_terminal.sh 로 녹화). genact는 화면에 그럴듯한 글자만 흘려보내고 실제로는 아무 작업도 하지 않음
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 2; }
mkdir -p /tmp/gademo && cd /tmp/gademo && rm -rf /tmp/gademo/*
echo "# 1) 설치 확인 (Windows는 genact-1.6.0-x86_64-pc-windows-msvc.exe 하나, 977KB)"; p "genact --version"
p "genact -l | tail -n +2 | wc -l   # 연출 종류(모듈) 개수"
clear; echo "# 2) 프로그램을 '빌드(조립)'하는 척 — 6초 뒤 자동 종료"; p "genact -m cc --exit-after-time 6s"
clear; echo "# 3) 큰 파일을 '내려받는' 척 → 폴더에 생긴 파일 개수 확인"
p "genact -m download --exit-after-time 6s"
p "ls /tmp/gademo | wc -l   # 실제로 받은 파일"
clear; echo "# 4) 그래픽카드 2개로 '채굴'하는 척 (이 작업 공간에는 그래픽카드가 없음)"
p "genact -m cryptomining --exit-after-time 5s"
clear; echo "# 5) 속도 3배 (-s 3)"; p "genact -m simcity -s 3 --exit-after-time 6s"
cd / && rm -rf /tmp/gademo
echo; echo "※ 정보 제공용 · 2026-11-17 클라우드 시연 결과(운영자 직접 검증 아님) · 남을 속이는 데 쓰지 않기"; sleep 3
