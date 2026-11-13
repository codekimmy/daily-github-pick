# 터미널 시연 (tools/record_terminal.sh 로 녹화). 녹음은 make_samples.py로 직접 합성한 가상 회의 녹음
cd "$(dirname "$0")"
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 2.2; }
mkdir -p /tmp/nrdemo && cp samples/잡음_선풍기.wav /tmp/nrdemo/회의녹음.wav && cp samples/잡음_옆사람말.wav /tmp/nrdemo/옆자리말소리.wav
echo "# 1) 설치 확인 (pip install noisereduce soundfile)"; p "pip show noisereduce 2>/dev/null | head -2"
echo; echo "# 2) 시연용 가상 회의 녹음 (합성 말소리 + 선풍기 잡음, 28초)"; p "ls /tmp/nrdemo"
p "python3 소리크기.py /tmp/nrdemo/회의녹음.wav"
clear; echo "# 3) 예제 파일로 잡음 줄이기 (기본 설정)"
p "python3 잡음제거.py /tmp/nrdemo/회의녹음.wav"
p "python3 소리크기.py /tmp/nrdemo/회의녹음_잡음제거.wav"
clear; echo "# 4) 맨 앞 1.4초를 '잡음 견본'으로 지정 → 말소리가 덜 작아짐"
p "python3 잡음제거.py /tmp/nrdemo/회의녹음.wav --견본 1.4"
p "python3 소리크기.py /tmp/nrdemo/회의녹음_잡음제거.wav"
clear; echo "# 5) 약점: 옆자리 사람 말소리는 잘 안 지워짐"
p "python3 잡음제거.py /tmp/nrdemo/옆자리말소리.wav"
p "python3 소리크기.py /tmp/nrdemo/옆자리말소리.wav; python3 소리크기.py /tmp/nrdemo/옆자리말소리_잡음제거.wav"
rm -rf /tmp/nrdemo
echo; echo "※ 정보 제공용 · 2026-11-14 클라우드 시연 결과(운영자 직접 검증 아님) · 원본 녹음은 따로 보관"; sleep 3
