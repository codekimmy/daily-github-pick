# 터미널 시연 (tools/record_terminal.sh 로 녹화). 폴더 속 파일은 모두 시연용 가상 자료(make_data.py)
cd "$(dirname "$0")"; T=/tmp/내PC; rm -rf $T ~/.cache/czkawka; cp -a work/정리전 $T; cd $T
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .6; eval "$1" 2>&1 | grep -v "MESSAGES\|cache entries\|^Results\|^(Before\|^-\{6,\}\|^$" | sed "s#$T/##g"; sleep 2.2; }
echo "# 1) 시연용 가상 'PC 정리 전' 폴더: 파일 41개, 147MB"; p "ls 다운로드 바탕화면 | head -14"
echo; echo "# 2) 똑같은 파일 찾기 (작은 파일도 포함: -m 1)"; p "time czkawka_cli dup -d $T -m 1 | head -20"
echo; echo "# 3) 비슷한 사진 찾기 (차이 15)"; p "czkawka_cli image -d $T -s 15 | grep 고양이"
echo; echo "# 4) 빈 폴더 · 위치 정보가 든 사진"; p "czkawka_cli empty-folders -d $T"; p "czkawka_cli exif-remover -d $T | sed 's/ - [0-9]\{6,\} - / /' | cut -c1-96"
echo; echo "# 5) 지우기 전에 미리 보기 (-Q): 사진 폴더는 원본으로 지킴 (-r)"; p "czkawka_cli dup -d $T -r $T/사진 -m 1 -D AEN -Q | grep Would"
rm -rf $T
