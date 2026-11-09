# 터미널 시연 (tools/record_terminal.sh 로 녹화). 영상은 모두 시연용 가상 영상(make_videos.py)
cd "$(dirname "$0")/work"; export PYTHONWARNINGS=ignore
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .6; eval "$1"; sleep 1.8; }
echo "# 1) 영상과 같은 이름의 자막 파일이 있어야 합니다"; p "ls 요리교실.*"
echo; echo "# 2) '소금'이 나온 장면 찾기만 (--demo: 영상은 안 만듦)"; p "videogrep -i 요리교실.mp4 -s 소금 --demo"
echo; echo "# 3) 찾은 장면만 이어 붙여 새 영상으로 (길이 비교: 원본 → 결과, 초)"; p "videogrep -i 요리교실.mp4 -s 소금 -o /tmp/소금모음.mp4 2>&1 | grep -E 'video ready'"
p "ffprobe -v error -show_entries format=duration -of csv=p=0 요리교실.mp4"
p "ffprobe -v error -show_entries format=duration -of csv=p=0 /tmp/소금모음.mp4"
echo; echo "# 4) 많이 나온 낱말 순위"; p "videogrep -i 요리교실.mp4 --ngrams 1 2>/dev/null | sed -n 1,5p"
rm -f /tmp/소금모음.mp4
