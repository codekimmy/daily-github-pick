#!/usr/bin/env bash
# 터미널 녹화용: 설치 → 예시 비밀번호 비교 → 이름을 알 때 달라지는 결과
# 사용: cd demo && bash demo.sh   (진짜 비밀번호는 넣지 말 것)
type_cmd() { printf '\033[1;32m$\033[0m '; for ((i=0;i<${#1};i++)); do printf '%s' "${1:i:1}"; sleep 0.03; done; echo; sleep 0.4; }
say() { printf '\033[1;33m# %s\033[0m\n' "$1"; sleep 1; }
cd "$(dirname "$0")"
say "1) 설치 — 명령 한 줄"
type_cmd "pip install zxcvbn"
pip install --break-system-packages -q zxcvbn 2>/dev/null; echo "Successfully installed zxcvbn-$(pip show zxcvbn 2>/dev/null | awk '/^Version/{print $2}')"
sleep 1.2
say "2) 흔한 비밀번호 → 도둑이 푸는 데 걸리는 시간"
type_cmd "python compare.py 123456 password1 qwer1234! P@ssw0rd"
python3 compare.py 123456 password1 qwer1234! P@ssw0rd
sleep 2.5
say "3) 조금 신경 쓴 것 vs 관련 없는 단어 이어 쓰기"
type_cmd "python compare.py Summer2026! tiger-gimbap-umbrella"
python3 compare.py Summer2026! tiger-gimbap-umbrella
sleep 2.5
say "4) 이름+생년 — 내 이름을 알려 주면?"
type_cmd "python compare.py minsu1995"
python3 compare.py minsu1995
type_cmd "python check_password.py minsu     (입력: minsu1995)"
printf 'minsu1995\n' | python3 -c "import sys,getpass,runpy;getpass.getpass=lambda p='':(print(p+'*********'),sys.stdin.readline().rstrip())[1];sys.argv=['check_password.py','minsu'];runpy.run_path('check_password.py',run_name='__main__')"
sleep 3.5
