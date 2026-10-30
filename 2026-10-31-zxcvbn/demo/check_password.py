"""cmd 에서 비밀번호 강도 확인 (입력한 글자는 화면에 안 보임). Windows 에서도 동작하도록 zxcvbn 명령 대신 직접 호출.
사용: python check_password.py          → 비밀번호 입력
      python check_password.py minsu 0315 → 이름·생일 같은 내 정보를 같이 넣어 더 엄격하게 확인"""
import getpass, os, re, sys
from pathlib import Path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from zxcvbn import zxcvbn
from check_password_lib import ko_time, GRADE

try:  # 경고·조언 한국어 번역 (page/ko.js 와 같은 표)
    KO = dict(re.findall(r'^\s*"(.+?)": "(.+?)",?$', (Path(__file__).parent / "page/ko.js").read_text(encoding="utf-8"), re.M))
except OSError:
    KO = {}
ko = lambda s: KO.get(s.rstrip("."), KO.get(s, s))

pw = getpass.getpass("비밀번호 (입력해도 화면에 안 보여요): ")
r = zxcvbn(pw, user_inputs=sys.argv[1:])
c = r["crack_times_seconds"]
print(f"\n등급: {GRADE[r['score']]} (5단계 중 {r['score'] + 1}단계)")
print(f"  로그인 창에 계속 넣어 보기 (1초에 10번)      : {ko_time(c['online_no_throttling_10_per_second'])}")
print(f"  훔친 파일, 잘 보호된 경우 (1초에 1만 번)     : {ko_time(c['offline_slow_hashing_1e4_per_second'])}")
print(f"  훔친 파일, 허술하게 보호된 경우 (1초에 100억 번): {ko_time(c['offline_fast_hashing_1e10_per_second'])}")
if r["feedback"]["warning"]: print("⚠", ko(r["feedback"]["warning"]))
for s in r["feedback"]["suggestions"]: print("💡", ko(s))
