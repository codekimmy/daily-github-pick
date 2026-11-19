# 터미널 시연 (tools/record_terminal.sh 로 녹화). 자료: 시연용으로 만든 가상 비밀 일기(demo/bench.py의 diary.txt)
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 1.6; }
D=$(cd "$(dirname "$0")" && pwd); W=/tmp/ragedemo; mkdir -p $W && cd $W && rm -f key.txt other.txt lock.txt diary.txt* && cp "$D/work/diary.txt" .
echo "# 1) 설치 확인 (Windows: winget install str4d.rage)"; p "rage --version"
echo; echo "# 2) 열쇠 파일 만들기 → 화면에 '자물쇠'(공개 키 age1...)가 나옴"; p "rage-keygen -o key.txt"
echo; echo "# 3) 자물쇠만 따로 파일로 꺼내기 (남에게 줘도 되는 파일)"; p "rage-keygen -y -o lock.txt key.txt"
echo; echo "# 4) 가상 비밀 일기를 자물쇠로 잠그기"; p "rage -R lock.txt -o diary.txt.age diary.txt"
echo; echo "# 5) 잠근 파일 안에서 '비밀번호' 글자 찾기 (원본 3줄 · 잠근 파일 0줄)"; p "grep -c 비밀번호 diary.txt diary.txt.age"
echo; echo "# 6) 다른 열쇠로 열기 → 실패"; rage-keygen -o other.txt 2>/dev/null; p "rage -d -i other.txt diary.txt.age"
echo; echo "# 7) 내 열쇠로 열기 → 원래 글"; p "rage -d -i key.txt diary.txt.age | head -2"
cd / && rm -f $W/key.txt $W/other.txt $W/lock.txt $W/diary.txt*
echo; echo "※ 정보 제공용 · 2026-11-20 클라우드 시연 결과(운영자 직접 검증 아님) · 열쇠 파일을 잃으면 못 엶"; sleep 3
