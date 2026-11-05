# 터미널 시연 (tools/record_terminal.sh 로 녹화). 장부는 make_ledger.py 로 만든 가상 자료
cd "$(dirname "$0")/work"
p(){ printf '\033[1;32m$\033[0m %s\n' "$1"; sleep .6; eval "$1"; sleep 1.4; }
echo "# 1) 설치 확인"; p "fava --version"
echo; echo "# 2) 메모장으로 쓴 가계부 (한 거래 = 날짜·가게·메모 + 계정 두 줄)"; p "sed -n '97,99p' 가계부.beancount"
echo; echo "# 3) 장부 검사: 아무 말이 없으면 통과"; p "bean-check 가계부.beancount && echo '통과 (거래 453건)'"
echo; echo "# 4) 합이 안 맞는 거래를 넣은 장부"; p "bean-check 틀린장부1.beancount 2>&1 | head -4 | sed 's|.*/work/||'"
echo; echo "# 5) 월별 식비 합계 (예산 40만 원)"; p "bean-query 가계부.beancount \"SELECT month, sum(number) WHERE account ~ 'Food' GROUP BY month ORDER BY month\""
echo; echo "# 6) 화면(대시보드) 켜기 → 브라우저에서 http://127.0.0.1:5000"; p "timeout 3 fava 가계부.beancount || true"
