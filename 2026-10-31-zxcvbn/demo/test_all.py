"""테스트용 비밀번호 목록을 zxcvbn(파이썬판)으로 재고 results.json에 저장. 사용: python3 test_all.py"""
import json, time
from zxcvbn import zxcvbn
CASES = [  # (비밀번호, 설명, 개인정보 힌트)
    ("123456", "숫자 연속", None),
    ("password1", "영어 단어 + 숫자 1", None),
    ("qwer1234!", "키보드 줄 + 숫자 + 느낌표", None),
    ("P@ssw0rd", "글자를 기호로 바꾼 password", None),
    ("iloveyou", "영어 문장 붙여 쓰기", None),
    ("minsu1995", "이름 + 태어난 해", None),
    ("minsu1995", "이름 + 태어난 해 (이름을 알려 준 경우)", ["minsu"]),
    ("dkssudgktpdy", "한글 '안녕하세요'를 영어 자판으로", None),
    ("Summer2026!", "계절 + 올해 + 느낌표", None),
    ("tiger-gimbap-umbrella", "관련 없는 단어 3개", None),
    ("blue-tiger-gimbap-umbrella-77", "관련 없는 단어 4개 + 숫자", None),
    ("X9#qLm2$vR8!", "무작위 12자리", None),
]
out = []
for pw, desc, ui in CASES:
    t = time.perf_counter(); r = zxcvbn(pw, user_inputs=ui); ms = (time.perf_counter() - t) * 1000
    c = r["crack_times_seconds"]
    out.append({"pw": pw, "desc": desc, "hint": ui, "score": r["score"], "guesses": float(r["guesses"]),
                "log10": round(float(r["guesses_log10"]), 2),
                "online": float(c["online_no_throttling_10_per_second"]),
                "offline": float(c["offline_fast_hashing_1e10_per_second"]),
                "slow": float(c["offline_slow_hashing_1e4_per_second"]),
                "display_slow": r["crack_times_display"]["offline_slow_hashing_1e4_per_second"],
                "display_online": r["crack_times_display"]["online_no_throttling_10_per_second"],
                "patterns": [s["pattern"] + (":" + s.get("dictionary_name", "") if s["pattern"] == "dictionary" else "") for s in r["sequence"]],
                "warning": r["feedback"]["warning"], "ms": round(ms, 1)})
    print(f'{pw:32} {desc:28} 점수{r["score"]} 10^{out[-1]["log10"]:5} 느린해시:{out[-1]["display_slow"]:18} 온라인:{out[-1]["display_online"]:14} {ms:6.1f}ms {out[-1]["patterns"]} | {out[-1]["warning"]}')
json.dump(out, open("results.json", "w"), ensure_ascii=False, indent=1)
