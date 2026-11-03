#!/usr/bin/env bash
# 터미널 녹화용 데모: 정리 전 목록 → 규칙 미리보기(sim) → 실제 정리(run) → 정리 후 폴더 → 다시 실행
# 사용: bash demo.sh  (organize 가 설치되어 있어야 함)
cd "$(dirname "$0")"; HERE=$PWD; D=/tmp/claude-0/orgdemo/다운로드
python3 make_assets.py "$D" >/dev/null; cd "$D"
p() { printf '\033[1;32m$\033[0m %s\n' "$1"; sleep 0.6; }
c() { printf '\033[90m# %s\033[0m\n' "$1"; sleep 0.8; }
c "정리 전: 다운로드 폴더에 파일 27개가 뒤섞여 있음 (시연용 가상 파일)"
p "ls"; ls --color=never -C -w 100; sleep 2.2
c "1) 미리보기(sim): 파일은 그대로 두고 어디로 갈지만 보여 줌"
p "organize sim config.yaml"; organize sim "$HERE/config.yaml" -W . 2>&1 | sed -n '5,13p' | sed 's|/tmp/claude-0/orgdemo/||'; echo "  ..."; sleep 2.5
c "2) 실제 정리(run)"
p "organize run config.yaml"
s=$(date +%s.%N); organize run "$HERE/config.yaml" -W . -F JSONL > /tmp/claude-0/orgdemo/log.jsonl 2>&1; e=$(date +%s.%N)
grep -c '"sender":"move"' /tmp/claude-0/orgdemo/log.jsonl | xargs printf '\033[1;33m  -> 파일 %s개 이동, '; printf '%.2f초\033[0m\n' "$(echo "$e - $s" | bc)"; sleep 1.5
c "정리 후 폴더 모습"
p "tree (폴더만)"; python3 "$HERE/tree.py" . 1; sleep 3
c "3) 한 번 더 실행하면? (이미 정리된 파일은 건드리지 않음)"
p "organize run config.yaml"; n=$(organize run "$HERE/config.yaml" -W . -F JSONL | grep -c "\"sender\":\"move\""); printf "\033[1;33m  -> 이동한 파일 %s개\033[0m\n" "$n"; sleep 3
printf "\033[90m※ 정보 제공용 · 2026-11-04 클라우드 시연 결과(운영자 직접 검증 아님) · 실제 폴더에 쓰기 전 sim으로 확인·백업\033[0m\n"; sleep 3
