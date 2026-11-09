"""시연용 가상 글 자료 만들기 (실제 사람·대화와 관련 없음).
- work/제주여행_단톡방.txt : 카카오톡 '대화 내보내기'와 비슷한 모양의 가상 단톡방 (4명, 3주)
- work/카페_손님의견.txt   : 가상 동네 카페 손님 의견 150줄
- work/market.txt          : 영어 기본 동작 확인용 짧은 글 (직접 씀)
사용: python3 make_data.py"""
import random
from datetime import datetime, timedelta
from pathlib import Path

random.seed(14)
W = Path(__file__).parent / "work"; W.mkdir(exist_ok=True)

# 단톡방: 같은 낱말이 여러 조사와 붙어 나오게 (제주도에/제주도는/제주도 …) — 한국어 낱말 구름의 '조사 문제'를 보이기 위함
P = {"제주도": ["제주도", "제주도에", "제주도는", "제주도에서", "제주도 가면"], "흑돼지": ["흑돼지", "흑돼지는", "흑돼지를", "흑돼지 집"],
     "렌터카": ["렌터카", "렌터카는", "렌터카를", "렌터카 예약"], "숙소": ["숙소", "숙소는", "숙소를", "숙소에서"],
     "비행기": ["비행기", "비행기표", "비행기는", "비행기를"], "한라산": ["한라산", "한라산은", "한라산에"],
     "바다": ["바다", "바다가", "바다를", "바다 보면서"], "우도": ["우도", "우도는", "우도에"], "카페": ["카페", "카페는", "카페에서"],
     "일정": ["일정", "일정은", "일정을", "일정표"], "날씨": ["날씨", "날씨가", "날씨는"], "귤": ["귤", "귤은", "귤 따기"],
     "공항": ["공항", "공항에서", "공항에"], "사진": ["사진", "사진은", "사진을"], "오름": ["오름", "오름은", "오름에"], "비": ["비", "비가", "비 오면"]}
WEIGHT = {"제주도": 30, "흑돼지": 22, "렌터카": 18, "숙소": 18, "비행기": 15, "한라산": 12, "바다": 14, "우도": 9, "카페": 12,
          "일정": 13, "날씨": 10, "귤": 8, "공항": 9, "사진": 11, "오름": 6, "비": 16}
TAIL = ["어때?", "괜찮다", "좋아", "알아봤어", "정하자", "예약했어", "꼭 가자", "어디로 할까", "찾아볼게", "생각보다 비싸", "보고 정하자", "완전 기대된다"]
FILL = ["ㅋㅋㅋ", "ㅋㅋㅋㅋ", "ㅎㅎ", "그럼", "근데", "아 진짜", "오케이", "헐", "ㅇㅇ", "그러니까"]
NAMES = ["민지", "준호", "서연", "도윤"]
keys = list(WEIGHT); wts = [WEIGHT[k] for k in keys]
t = datetime(2026, 10, 12, 20, 3); lines = ["제주 여행 준비방 님과 카카오톡 대화 (시연용 가상 대화)", f"저장한 날짜 : 2026-11-01 21:00", ""]
for i in range(600):
    t += timedelta(minutes=random.randint(1, 50))
    r = random.random()
    if r < .25: msg = random.choice(FILL)
    elif r < .85: msg = f"{random.choice(P[random.choices(keys, wts)[0]])} {random.choice(TAIL)}"
    else: msg = f"{random.choice(FILL)} {random.choice(P[random.choices(keys, wts)[0]])} {random.choice(P[random.choices(keys, wts)[0]])} {random.choice(TAIL)}"
    ap = "오전" if t.hour < 12 else "오후"; h = t.hour % 12 or 12
    lines.append(f"{t.year}. {t.month}. {t.day}. {ap} {h}:{t.minute:02d}, {random.choice(NAMES)} : {msg}")
(W / "제주여행_단톡방.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")

# 카페 손님 의견 (가상)
GOOD = ["라떼가 부드럽고 고소함", "창가 자리가 밝아서 좋음", "직원분이 친절함", "디저트 케이크가 맛있음", "원두 향이 진함", "음악 소리가 적당함",
        "라떼 아트가 예쁨", "케이크가 너무 달지 않음", "콘센트가 많아 공부하기 좋음"]
BAD = ["주말에는 자리가 부족함", "주차 공간이 좁음", "와이파이가 자주 끊김", "아메리카노 가격이 조금 비쌈", "의자가 딱딱함", "화장실이 멀음"]
fb = [random.choice(GOOD) if random.random() < .62 else random.choice(BAD) for _ in range(150)]
(W / "카페_손님의견.txt").write_text("\n".join(fb) + "\n", encoding="utf-8")

# 영어 짧은 글 (직접 쓴 문장을 섞어 반복)
EN = ["The Saturday market opens early and the farmers bring fresh apples, honey and bread.",
      "Children love the apple stand because the farmers give free slices.",
      "Coffee from the small cart smells great on a cold market morning.",
      "Local honey and fresh bread sell out before noon.",
      "Music, coffee and apples make the market a happy place for the neighborhood."]
(W / "market.txt").write_text(" ".join(random.choice(EN) for _ in range(60)) + "\n", encoding="utf-8")
print("saved", *[p.name for p in W.glob("*.txt")])
