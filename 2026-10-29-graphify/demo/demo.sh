p(){ echo; printf '\033[1;32m$ %s\033[0m\n' "$1"; sleep 1; }
cd ~/click
p 'graphify update .     # 코드 폴더를 지도로 만들기'; graphify update . 2>&1 | grep -E "Rebuilt|updated"
p 'head -12 graphify-out/GRAPH_REPORT.md | tail -4'; sed -n 9,11p graphify-out/GRAPH_REPORT.md
p 'grep -A5 "God Nodes" graphify-out/GRAPH_REPORT.md   # 가장 중요한 중심 코드'; grep -A5 "God Nodes" graphify-out/GRAPH_REPORT.md
sleep 1.5
p 'graphify explain "src/click/core.py::Context"   # 이 코드가 뭐랑 연결돼 있나'; graphify explain "src/click/core.py::Context" 2>&1 | sed -n 1,10p
sleep 2
