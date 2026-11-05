"""시연 ①~⑨ 측정 → results.json. 장부는 모두 make_ledger.py 로 만든 가상 자료."""
import json, os, re, shutil, statistics, subprocess, time, urllib.request, urllib.parse
from playwright.sync_api import sync_playwright
H = os.path.dirname(os.path.abspath(__file__)); W = f"{H}/work"; os.makedirs(W, exist_ok=True)
R = {}
def sh(*a, **k): return subprocess.run(a, capture_output=True, text=True, **k)
def med(f, n=3):
    ts = []
    for _ in range(n): t = time.time(); out = f(); ts.append(time.time() - t)
    return round(statistics.median(ts), 2), [round(x, 2) for x in ts], out
R["version"] = sh("fava", "--version").stdout.strip(); R["beancount"] = sh("bean-check", "--version").stdout.strip() or sh("bean-check", "--version").stderr.strip()
# ② 9개월 가상 장부
L9 = f"{W}/가계부.beancount"; sh("python3", f"{H}/make_ledger.py", L9)
bank = sh("bean-query", L9, "SELECT sum(number) WHERE account='Assets:Bank-통장'").stdout.split()[-1]
open(L9, "a", encoding="utf-8").write(f"\n2026-11-01 balance Assets:Bank-통장 {bank} KRW\n")
txt = open(L9, encoding="utf-8").read()
R["ledger"] = {"tx": len(re.findall(r"^\d{4}-\d\d-\d\d \* ", txt, re.M)), "lines": txt.count("\n"), "kb": round(len(txt.encode()) / 1024, 1), "bank": int(bank)}
s, ss, p = med(lambda: sh("bean-check", L9)); R["check9"] = {"sec": s, "secs": ss, "rc": p.returncode, "err": p.stderr.strip()}
q = lambda f, s_: [l.split() for l in sh("bean-query", f, s_).stdout.strip().splitlines()[2:]]
R["monthly"] = [{"m": int(r[1]), "food": int(r[2]), "all": int(r[3])} for r in q(L9, "SELECT year, month, sum(number) WHERE account ~ 'Food', 0 GROUP BY year, month ORDER BY year, month")] if False else None
mon = {}
for r in q(L9, "SELECT month, root(account, 1) AS r, sum(number) WHERE account ~ '^(Income|Expenses)' GROUP BY month, r ORDER BY month"):
    mon.setdefault(int(r[0]), {})[r[1]] = int(r[2])
food = {int(r[0]): int(r[1]) for r in q(L9, "SELECT month, sum(number) WHERE account = 'Expenses:Food-식비' GROUP BY month ORDER BY month")}
R["monthly"] = [{"m": m, "income": -v["Income"], "expense": v["Expenses"], "food": food.get(m, 0)} for m, v in sorted(mon.items())]
R["by_account"] = sorted([[r[0].split(":")[1], int(r[1])] for r in q(L9, "SELECT account, sum(number) WHERE account ~ '^Expenses' GROUP BY account")], key=lambda x: -x[1])
R["total"] = {"income": sum(x["income"] for x in R["monthly"]), "expense": sum(x["expense"] for x in R["monthly"])}
R["food_budget"] = 400000; R["food_over"] = [x["m"] for x in R["monthly"] if x["food"] > 400000]
# ⑦ 틀린 장부 3가지
bad = {
 "합이 안 맞는 거래": txt + '\n2026-10-31 * "동네마트" "장보기"\n  Expenses:Food-식비  32000 KRW\n  Liabilities:Card-카드  -23000 KRW\n',
 "없는 계정 이름(오타)": txt + '\n2026-10-31 * "동네마트" "장보기"\n  Expenses:Fod-식비  32000 KRW\n  Liabilities:Card-카드\n',
 "통장 잔액이 다름": txt + f'\n2026-11-02 balance Assets:Bank-통장 {int(bank) + 10000} KRW\n'}
R["errors"] = []
for i, (k, v) in enumerate(bad.items()):
    f = f"{W}/틀린장부{i + 1}.beancount"; open(f, "w", encoding="utf-8").write(v); p = sh("bean-check", f)
    R["errors"].append({"name": k, "file": os.path.basename(f), "rc": p.returncode, "msg": [l for l in p.stderr.strip().splitlines() if l.strip()][:3]})
# ⑧ 10년 장부
L10 = f"{W}/10년가계부.beancount"; sh("python3", f"{H}/make_ledger.py", L10, "120", "2016")
t10 = open(L10, encoding="utf-8").read()
s, ss, p = med(lambda: sh("bean-check", L10)); R["check10"] = {"sec": s, "secs": ss, "rc": p.returncode, "tx": len(re.findall(r"^\d{4}-\d\d-\d\d \* ", t10, re.M)), "lines": t10.count("\n"), "kb": round(len(t10.encode()) / 1024)}
# ③④⑤⑨ Fava 화면
def serve(f, port):
    t = time.time(); pr = subprocess.Popen(["fava", f, "-p", str(port)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    while True:
        try: urllib.request.urlopen(f"http://127.0.0.1:{port}/", timeout=1); return pr, round(time.time() - t, 2)
        except Exception: time.sleep(0.05)
def slug(port): return urllib.request.urlopen(f"http://127.0.0.1:{port}/").geturl().split("/")[3]
pr, st = serve(L9, 5071); R["start9"] = st; S = slug(5071); B = f"http://127.0.0.1:5071/{S}"
pages = {"손익계산서": "income_statement/", "재무상태표": "balance_sheet/", "거래기록": "journal/", "식비 계정": "account/Expenses:Food-식비/", "쿼리": "query/"}
R["pages"] = {}
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1600, "height": 900})
    pg.goto(f"{B}/income_statement/"); pg.wait_for_load_state("networkidle")
    for k, v in pages.items():
        ts = []
        for _ in range(3): t = time.time(); pg.goto(f"{B}/{v}"); pg.wait_for_load_state("networkidle"); ts.append(time.time() - t)
        R["pages"][k] = round(statistics.median(ts), 2)
    # ⑨ 메모장에 한 줄 추가 → 새로고침에 반영되는지
    before = pg.goto(f"{B}/journal/") and pg.content().count("편의점")
    open(L9, "a", encoding="utf-8").write('\n2026-10-31 * "편의점" "시연용 추가 한 줄"\n  Expenses:Food-식비  3000 KRW\n  Liabilities:Card-카드\n')
    t = time.time(); seen = None
    for i in range(40):
        pg.goto(f"{B}/journal/"); pg.wait_for_load_state("networkidle")
        if "시연용 추가 한 줄" in pg.content(): seen = round(time.time() - t, 2); break
        time.sleep(0.25)
    R["reload"] = {"seen_sec": seen}
    open(L9, "w", encoding="utf-8").write(txt)  # 원래대로
    b.close()
# ⑤ 쿼리 결과 CSV 내려받기 (월별 식비)
qs = "SELECT month, sum(position) WHERE account ~ 'Food' GROUP BY month ORDER BY month"
try:
    u = f"{B}/download-query/query_result.csv?query_string=" + urllib.parse.quote(qs)
    csv = urllib.request.urlopen(u).read().decode("utf-8"); open(f"{W}/월별식비.csv", "w", encoding="utf-8").write(csv)
    R["csv"] = {"ok": True, "rows": csv.strip().count("\n"), "head": csv.splitlines()[:3]}
except Exception as e: R["csv"] = {"ok": False, "err": str(e)}
pr.terminate()
pr, st = serve(L10, 5072); R["start10"] = st; S2 = slug(5072)
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1600, "height": 900})
    ts = []
    for _ in range(3): t = time.time(); pg.goto(f"http://127.0.0.1:5072/{S2}/income_statement/"); pg.wait_for_load_state("networkidle"); ts.append(time.time() - t)
    R["page10"] = round(statistics.median(ts), 2); b.close()
pr.terminate()
json.dump(R, open(f"{H}/results.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1))
