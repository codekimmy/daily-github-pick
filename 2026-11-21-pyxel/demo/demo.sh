# 터미널 시연 (tools/record_terminal.sh 로 녹화). 게임 화면은 가상 화면(Xvfb)에 띄우고 결과 숫자만 명령 창에 보여 줌
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 1.6; }
D=$(cd "$(dirname "$0")" && pwd); W=/tmp/pyxeldemo; rm -rf $W; mkdir -p $W && cd $W
export DISPLAY=:9 SDL_AUDIODRIVER=dummy
echo "# 1) 설치 확인 (Windows: pip install pyxel)"; p "pip show pyxel 2>/dev/null | sed -n 2,3p"
echo; echo "# 2) 예제 꺼내기 → 예제 폴더 개수 확인"; p "pyxel copy_examples > /dev/null && ls pyxel_examples/*.py | wc -l"
echo; echo "# 3) 시연용 '별 줍기' 게임: 빈 줄·설명 빼고 줄 수"; cp "$D/star_catch.py" "$D/harness.py" .; p "grep -cv '^\s*\$\|^\s*#' star_catch.py"
echo; echo "# 4) 컴퓨터가 화살표를 대신 눌러 12초 실행 (화면 360장)"; p "AUTO_PLAY=1 python3 harness.py star_catch.py out 360 2>/dev/null; cat out/stats.json"
echo; echo "# 5) 게임을 파일 하나로 묶기"; mkdir -p star && cp star_catch.py star/; p "pyxel package star star/star_catch.py && ls -l star.pyxapp | awk '{print \$5, \"바이트\", \$9}'"
cd / && rm -rf $W
echo; echo "※ 정보 제공용 · 2026-11-21 클라우드 시연 결과(운영자 직접 검증 아님) · Windows 결과는 다를 수 있음"; sleep 3
