# 터미널 시연 (tools/record_terminal.sh 로 녹화). 시연용 가상 녹음 4개(samples/)의 소리 크기를 맞춤
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .8; eval "$1"; sleep 1.8; }
D=$(cd "$(dirname "$0")" && pwd); W=/tmp/fndemo; rm -rf $W; mkdir -p $W && cd $W
cp "$D"/samples/[1-4]_* . ; cp "$D/loud.py" .
echo "# 1) 설치 확인 (Windows: pip install ffmpeg-normalize, ffmpeg 따로 설치)"; p "ffmpeg-normalize --version"
echo; echo "# 2) 가상 녹음 4개의 소리 크기 (0에 가까울수록 큼)"; p "python3 loud.py 1_* 2_* 3_* 4_*"
echo; echo "# 3) 4개를 한꺼번에 맞추기 (기본 목표 -23 LUFS)"; p "time ffmpeg-normalize 1_* 2_* 3_* 4_* -pr 2>&1 | tail -n 3"
echo; echo "# 4) 결과: normalized 폴더"; p "python3 loud.py normalized/*"
cd / && rm -rf $W
echo; echo "※ 정보 제공용 · 2026-11-22 클라우드 시연 결과(운영자 직접 검증 아님) · 원본 파일은 따로 보관"; sleep 3
