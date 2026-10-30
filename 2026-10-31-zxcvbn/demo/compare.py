"""예시 비밀번호 여러 개를 한 번에 비교 (진짜 비밀번호는 넣지 마세요 — 명령 기록에 남아요).
사용: python compare.py password1 Summer2026! tiger-gimbap-umbrella"""
import sys, time
sys.path.insert(0, __import__("os").path.dirname(__file__))
from zxcvbn import zxcvbn
from check_password_lib import ko_time, GRADE
for pw in sys.argv[1:]:
    t = time.perf_counter(); r = zxcvbn(pw); ms = (time.perf_counter() - t) * 1000
    print(f"{pw:<30} {GRADE[r['score']]:<6} 훔친 파일(잘 보호됨) {ko_time(r['crack_times_seconds']['offline_slow_hashing_1e4_per_second']):<10}  ({ms:.1f}ms)")
