# 터미널 시연 (tools/record_terminal.sh 로 녹화). 사진은 scikit-image 예제(CC0) 고양이 사진
cd "$(dirname "$0")/work"; export OPENCV_LOG_LEVEL=ERROR
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .6; eval "$1"; sleep 1.4; }
echo "# 1) 설치 확인"; p "pip show blind-watermark | head -2"
echo; echo "# 2) 사진에 안 보이는 글자 도장 넣기 (비밀번호 1234)"; p "blind_watermark --embed --pwd 1234 cat.png 'ⓒ내사진 2026' 도장.png"
echo; echo "# 3) 두 사진이 얼마나 다른가? (0~255 중 평균 차이)"; p "python3 -c \"import cv2;a,b=cv2.imread('cat.png'),cv2.imread('도장.png');print('평균 차이', round(abs(a.astype(int)-b).mean(),2))\""
echo; echo "# 4) 도장 꺼내기 (글자 길이 136비트를 알려 줘야 함)"; p "blind_watermark --extract --pwd 1234 --wm_shape 136 도장.png | tail -1"
echo; echo "# 5) JPG 화질 50으로 다시 저장한 뒤에도 나올까?"; p "python3 -c \"import cv2;cv2.imwrite('도장50.jpg',cv2.imread('도장.png'),[cv2.IMWRITE_JPEG_QUALITY,50])\" && blind_watermark --extract --pwd 1234 --wm_shape 136 도장50.jpg | tail -1"
echo; echo "# 6) 원본(도장 없는 사진)에서 꺼내면?"; p "blind_watermark --extract --pwd 1234 --wm_shape 136 cat.png | tail -1"
rm -f 도장.png 도장50.jpg
