"""results.json + segno로 만든 QR 칸 배열 → render/data.js (영상·썸네일은 QR을 칸 배열로 직접 그림)
사용: python3 demo/mkdata.py (bench.py 다음). 글은 모두 bench.py와 같은 시연용 가상 자료"""
import json, os, segno, segno.helpers
HERE = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(os.path.join(HERE, "results.json")))
URL = "https://github.com/heuer/segno"
def mat(q): return ["".join("1" if v & 1 else "0" for v in row) for row in q.matrix]
M = {
 "wifi": mat(segno.make("WIFI:T:WPA;S:우리집_5G;P:kimchi2026!;;")),
 "card": mat(segno.make("MECARD:N:김하늘;TEL:01012345678;EMAIL:sky@example.com;;")),
 "vcard": mat(segno.helpers.make_vcard(name="김;하늘", displayname="김하늘", phone="010-1234-5678", email="sky@example.com", org="가상상회")),
 "short": mat(segno.make("https://example.com")),
 "k100": mat(segno.make("가" * 100)),
 "k500": mat(segno.make("가" * 500)),
 "micro": mat(segno.make("01012345678", micro=True)),
}
for lv in "LMQH": M["url" + lv] = mat(segno.make(URL, error=lv, boost_error=False))
with open(os.path.join(HERE, "render", "data.js"), "w", encoding="utf-8") as f:
    f.write("const RES = " + json.dumps(R, ensure_ascii=False) + ";\nconst MAT = " + json.dumps(M) + ";\n")
print({k: len(v) for k, v in M.items()})
