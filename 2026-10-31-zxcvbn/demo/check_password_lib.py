"""check_password.py·compare.py 공용: 걸리는 시간을 한국어로"""
GRADE = ["매우 위험", "위험", "보통", "안전", "매우 안전"]


def ko_time(s):
    s = float(s)
    for lim, div, unit in [(60, 1, "초"), (3600, 60, "분"), (86400, 3600, "시간"), (86400 * 30.4, 86400, "일"),
                           (86400 * 365, 86400 * 30.4, "개월"), (86400 * 365 * 100, 86400 * 365, "년")]:
        if s < 1: return "1초도 안 걸림"
        if s < lim: return f"약 {round(s / div)}{unit}"
    return "100년 넘게"
