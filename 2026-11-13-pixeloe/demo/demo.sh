# 터미널 시연 (tools/record_terminal.sh 로 녹화). 사진은 scikit-image 견본 사진(CC0)
cd "$(dirname "$0")"
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 2.2; }
echo "# 1) 설치 확인 (pip install pixeloe)"; p "pip show pixeloe | head -2"
echo; echo "# 2) 시연용 사진 (고양이·커피, CC0 공개 사진)"; p "ls photos"
p "python3 미리보기.py photos/고양이.png 44"
clear; echo "# 3) 도트 그림으로 바꾸기: 점 128 기준 · 점 하나 4×4 화소"
p "pixeloe.pixelize photos/고양이.png -O 고양이_도트.png -S 128 -P 4"
p "python3 미리보기.py 고양이_도트.png 44"
clear; echo "# 4) 큼직한 점(64) + 색 8가지로 줄이기 → 레트로 게임 느낌"
p "pixeloe.pixelize photos/커피.png -O 커피_8색.png -S 64 -P 8 --colors 8"
p "python3 미리보기.py 커피_8색.png 44"
clear; echo "# 5) 예제 파일: 폴더 속 사진을 모두 바꾸고 비교 그림까지"
p "python3 도트변환.py photos"
rm -f 고양이_도트.png 커피_8색.png
echo; echo "※ 정보 제공용 · 2026-11-13 클라우드 시연 결과(운영자 직접 검증 아님) · 원본 사진은 따로 보관"; sleep 3
