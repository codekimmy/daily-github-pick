"""blog.md 의 마크다운 표를 '테두리가 보이는 HTML 표'로 바꾼다 (티스토리 마크다운 붙여넣기에서 표 테두리가 안 보이는 문제, 2026-11-12 운영자 요청).
표·칸마다 style 로 테두리(1px 회색)·칸 여백·머리줄 배경을 직접 넣어서, 블로그 스킨과 상관없이 테두리가 보이게 한다.
사용: python3 tools/blog_tables.py <blog.md>   (파일을 그 자리에서 고침, 이미 HTML 표인 곳은 그대로)"""
import re, sys
p = sys.argv[1]; L = open(p, encoding="utf-8").read().split("\n")
TB = 'style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft"'
TH = 'style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;"'
TD = 'style="border: 1px solid #bbbbbb; padding: 6px 10px;"'
def inline(s):
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
cells = lambda l: [c.strip() for c in l.strip().strip("|").split("|")]
out, i, n = [], 0, 0
while i < len(L):
    if L[i].startswith("|") and i + 1 < len(L) and re.match(r"^\|[\s:|-]+\|$", L[i + 1].strip()):
        head = cells(L[i]); i += 2; rows = []
        while i < len(L) and L[i].startswith("|"): rows.append(cells(L[i])); i += 1
        h = [f"<table {TB}>", "<thead>", "<tr>" + "".join(f"<th {TH}>{inline(c)}</th>" for c in head) + "</tr>", "</thead>", "<tbody>"]
        h += ["<tr>" + "".join(f"<td {TD}>{inline(c)}</td>" for c in r) + "</tr>" for r in rows]
        out += h + ["</tbody>", "</table>"]; n += 1
    else:
        out.append(L[i]); i += 1
open(p, "w", encoding="utf-8").write("\n".join(out)); print(p, "표", n, "개를 테두리 있는 HTML 표로 바꿈")
