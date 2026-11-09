# 터미널 시연 (tools/record_terminal.sh 로 녹화). 대화는 모두 시연용 가상 대화(make_data.py)
cd "$(dirname "$0")/work"; export PYTHONWARNINGS=ignore; T=/tmp/wc_demo; mkdir -p $T; cp 제주여행_단톡방.txt $T/대화.txt
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .6; eval "$1"; sleep 1.8; }
echo "# 1) 시연용 가상 단톡방 (카톡 '대화 내보내기' 모양, 600줄)"; p "sed -n 4,7p $T/대화.txt"
echo; echo "# 2) 명령어 한 줄로 낱말 구름 (한글 글꼴 지정)"; p "time wordcloud_cli --text 단톡방_말만.txt --fontfile /usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc --imagefile $T/구름.png"
p "ls -la $T/구름.png | awk '{print \$5, \$9}'"
echo; echo "# 3) 명사만 골라 낱말 구름 + 순위 (예제 카톡구름.py)"; p "python3 ../카톡구름.py $T/대화.txt --단어 흑돼지 --가로"
p "head -6 $T/대화_낱말순위.csv | sed 's/^\\xEF\\xBB\\xBF//'"
rm -rf $T
