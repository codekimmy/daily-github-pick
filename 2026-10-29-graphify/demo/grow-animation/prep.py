"""graphify-out/graph.json → data.js (애니메이션용 압축 데이터).
사용: python3 prep.py <graph.json> "Context,Command,Parameter,CliRunner,Option" "184,110,98,76,66"
두 번째·세 번째 인자는 GRAPH_REPORT.md의 God Nodes 목록을 그대로 넣는다."""
import json, sys, collections
g = json.load(open(sys.argv[1])); labels = sys.argv[2].split(','); degs = [int(x) for x in sys.argv[3].split(',')]
nodes, links = g['nodes'], g['links']; idx = {n['id']: i for i, n in enumerate(nodes)}
deg = collections.Counter(); E = []
for l in links:
    a, b = idx.get(l['source']), idx.get(l['target'])
    if a is None or b is None or a == b: continue
    E.append((a, b)); deg[a] += 1; deg[b] += 1
rank = lambda f: (0 if f.startswith('src/') else 1 if f.startswith('examples') else 2 if f.startswith('docs') else 3, f)
order = sorted(range(len(nodes)), key=lambda i: (rank(nodes[i].get('source_file') or 'zzz'), i))
files = []
for i in order:
    f = nodes[i].get('source_file') or '(외부 모듈)'
    if f not in files: files.append(f)
topc = [c for c, _ in collections.Counter(n['community'] for n in nodes).most_common(10)]
n_out = [[n['label'], topc.index(n['community']) if n['community'] in topc else -1, deg[i], files.index(n.get('source_file') or '(외부 모듈)')] for i, n in enumerate(nodes)]
top = [max((i for i, n in enumerate(n_out) if n[0] == lab), key=lambda i: n_out[i][2]) for lab in labels]
open('data.js', 'w').write('const DATA=' + json.dumps({'n': n_out, 'order': order, 'e': E, 'files': files, 'top': top, 'topdeg': degs}, ensure_ascii=False, separators=(',', ':')) + ';')
print('ok', len(nodes), len(E))
