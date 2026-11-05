"""시연용 가상 가계부(beancount 텍스트 장부)를 만든다. 사람·가게·금액은 모두 지어낸 것.
사용: python3 make_ledger.py <출력.beancount> [개월 수(기본 9)] [시작 연도(기본 2026)]"""
import random, sys, datetime as dt
out = sys.argv[1]; months = int(sys.argv[2]) if len(sys.argv) > 2 else 9; y0 = int(sys.argv[3]) if len(sys.argv) > 3 else 2026
rnd = random.Random(10)
L = ['option "title" "우리집 가계부 (시연용 가상 자료)"', 'option "operating_currency" "KRW"', '']
start = dt.date(y0 if months == 9 else y0, 2 if months == 9 else 1, 1)
acc = ["Assets:Bank-통장", "Assets:Savings-적금", "Liabilities:Card-카드", "Income:Salary-월급", "Income:Side-부수입",
       "Expenses:Rent-월세", "Expenses:Food-식비", "Expenses:Cafe-카페", "Expenses:Transport-교통", "Expenses:Phone-통신",
       "Expenses:Subscription-구독", "Expenses:Shopping-쇼핑", "Expenses:Health-병원", "Expenses:Gift-경조사", "Equity:Opening-시작잔액"]
L += ['2026-01-01 custom "fava-option" "language" "ko"', '2026-01-01 custom "fava-option" "locale" "ko_KR"', '2026-01-01 custom "fava-option" "invert-income-liabilities-equity" "true"', '']
for a in acc: L.append(f"{start - dt.timedelta(days=1)} open {a} KRW")
L += ["", f'{start - dt.timedelta(days=1)} * "시작 잔액"', "  Assets:Bank-통장  1500000 KRW", "  Equity:Opening-시작잔액", ""]
if months == 9:  # 예산(한 달에 쓸 돈 계획)
    for a, v in [("Food-식비", 400000), ("Cafe-카페", 60000), ("Shopping-쇼핑", 150000), ("Transport-교통", 80000)]:
        L.append(f'{start} custom "budget" Expenses:{a} "monthly" {v} KRW')
    L.append("")
CARD = {}
def tx(d, payee, memo, legs):
    if legs[-1][0].startswith("Liabilities") and legs[-1][1] is None: CARD[(d.year, d.month)] = CARD.get((d.year, d.month), 0) + legs[0][1]
    L.append(f'{d} * "{payee}" "{memo}"')
    for a, v in legs: L.append(f"  {a}  {v} KRW" if v is not None else f"  {a}")
    L.append("")
FOOD = [("동네마트", "장보기", 18000, 62000), ("편의점", "도시락", 4500, 8900), ("분식집", "점심 떡볶이", 6000, 12000), ("배달앱", "저녁 배달", 16000, 32000), ("정육점", "삼겹살", 15000, 30000)]
CAFE = [("동네카페", "아메리카노", 3800, 5500), ("빵집", "식빵", 3500, 7000)]
SHOP = [("온라인쇼핑", "생활용품", 9000, 45000), ("옷가게", "티셔츠", 19000, 59000), ("서점", "책", 12000, 22000)]
d = start; n = 0
m = 0
while m < months:
    y, mo = d.year, d.month
    first = dt.date(y, mo, 1)
    nxt = dt.date(y + (mo == 12), mo % 12 + 1, 1)
    tx(first + dt.timedelta(days=24), "회사", f"{mo}월 월급", [("Assets:Bank-통장", 2800000), ("Income:Salary-월급", None)])
    tx(first, "집주인", f"{mo}월 월세", [("Expenses:Rent-월세", 650000), ("Assets:Bank-통장", None)])
    tx(first + dt.timedelta(days=9), "통신사", "휴대폰 요금", [("Expenses:Phone-통신", 55000), ("Assets:Bank-통장", None)])
    tx(first + dt.timedelta(days=4), "영상구독", "월 구독료", [("Expenses:Subscription-구독", 13500), ("Liabilities:Card-카드", None)])
    tx(first + dt.timedelta(days=14), "카드사", "지난달 카드값", [("Liabilities:Card-카드", f"__CARD_{(first - dt.timedelta(days=1)).year}_{(first - dt.timedelta(days=1)).month}__"), ("Assets:Bank-통장", None)])
    tx(first + dt.timedelta(days=26), "적금", "매달 적금", [("Assets:Savings-적금", 300000), ("Assets:Bank-통장", None)])
    if mo in (5, 9): tx(first + dt.timedelta(days=17), "지인", "결혼식 축의금", [("Expenses:Gift-경조사", 100000), ("Assets:Bank-통장", None)])
    if mo in (3, 8): tx(first + dt.timedelta(days=11), "동네의원", "감기 진료", [("Expenses:Health-병원", rnd.randrange(8000, 25000, 100)), ("Liabilities:Card-카드", None)])
    if mo % 3 == 0: tx(first + dt.timedelta(days=20), "중고거래", "안 쓰는 물건 판매", [("Assets:Bank-통장", rnd.randrange(20000, 80000, 1000)), ("Income:Side-부수입", None)])
    day = first
    while day < nxt:
        if rnd.random() < .55: p, mm, a, b = rnd.choice(FOOD); tx(day, p, mm, [("Expenses:Food-식비", rnd.randrange(a, b, 100) * (2 if mo == 9 and p == "정육점" else 1)), ("Liabilities:Card-카드", None)])
        if rnd.random() < .35: p, mm, a, b = rnd.choice(CAFE); tx(day, p, mm, [("Expenses:Cafe-카페", rnd.randrange(a, b, 100)), ("Liabilities:Card-카드", None)])
        if day.weekday() < 5 and rnd.random() < .8: tx(day, "대중교통", "버스·지하철", [("Expenses:Transport-교통", 2900), ("Liabilities:Card-카드", None)])
        if rnd.random() < .07: p, mm, a, b = rnd.choice(SHOP); tx(day, p, mm, [("Expenses:Shopping-쇼핑", rnd.randrange(a, b, 1000)), ("Liabilities:Card-카드", None)])
        day += dt.timedelta(days=1)
    d = nxt; m += 1
# 카드값: 지난달 카드 사용액 전부를 다음 달 15일에 냄 → 간단하게 장부를 두 번 돌려 계산
import re
txt = re.sub(r"__CARD_(\d+)_(\d+)__", lambda m_: str(CARD.get((int(m_[1]), int(m_[2])), 0)), "\n".join(L))
txt = re.sub(r'.*"카드사" "지난달 카드값"\n  Liabilities:Card-카드  0 KRW\n  Assets:Bank-통장\n\n', "", txt + "\n")
open(out, "w", encoding="utf-8").write(txt)
print("lines", len(L))
