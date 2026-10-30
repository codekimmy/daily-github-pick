"""음성용 대본 만들기 (GUIDE 5-1): 구간 시간 + 한글 읽기, 마침표 없음, 초당 6글자 이하 확인.
사용: python3 make.py  → 폴더 위로 narration-long.txt, narration-shorts.txt, *-text.txt 생성"""
import json, re
from pathlib import Path

here = Path(__file__).parent; day = here.parent.parent
src = (here.parent / "long/script.js").read_text(encoding="utf-8")
S = json.loads(src[src.index("{"): src.rindex("}") + 1])

# 롱폼: 미리보기 + 장별 cue (읽을 문장이 있는 것만)
long_cues, t0 = [(a, b, r) for a, b, _, r in S["preview"]["cues"]], S["preview"]["dur"]
for c in S["chapters"]:
    long_cues += [(t0 + a, t0 + b, r) for a, b, _, r in c["cues"] if r]
    t0 += c["dur"]
LONG_LEN = t0

# 숏폼: 세로 과정 애니메이션(30초) 기준
SHORTS = [(0.0, 2.4, "내 비밀번호, 몇 초면 뚫릴까?"),
          (2.4, 7.4, "흔한 비밀번호는 일 초도 안 걸려요"),
          (7.4, 12.4, "단어 세 개를 이어 쓰면 백 년이 넘게 걸려요"),
          (12.4, 19.6, "열한 개를 줄 세우면, 길수록 오래 버텨요"),
          (19.6, 23.6, "이름을 알면 십칠 분이 이 초로 줄어요"),
          (23.6, 27.0, "기호로 바꾸기보다, 길게 쓰세요"),
          (27.0, 30.0, "전체 영상은 관련 영상에서!")]


def ts(x): return f"{int(x // 60):02d}:{x % 60:04.1f}"


def check(cues):
    for a, b, r in cues:
        assert "." not in r, r
        assert not re.search(r"[A-Za-z0-9]", r), r          # 영어·숫자는 모두 한글 읽기로
        n = len(re.sub(r"[\s,!?]", "", r)); rate = n / (b - a)
        assert rate <= 6.0, (r, round(rate, 2))


def write(name, title, video, length, cues):
    check(cues)
    head = [f"지엑스씨브이비엔 {title} 내레이션 대본", f"영상 파일: media/{video} (길이 {ts(length)})", "",
            "■ 읽는 법", "- 대괄호 안 시간이 영상에서 그 문장이 나와야 하는 구간이에요",
            "- 영어·숫자는 모두 읽는 소리대로 한글로 바꿨어요 (예: zxcvbn → 지엑스씨브이비엔, 17분 → 십칠 분)",
            "- 한 줄에 한 문장, 마침표 없이 정리했어요",
            "- 대본이 없는 구간은 화면만 보여 주는 곳이라 비워 두세요", "", "■ 구간별 대본", ""]
    body = []
    for a, b, r in cues:
        body += [f"[{ts(a)} ~ {ts(b)}]  ({b - a:.1f}초)", r, ""]
    tail = ["■ 전체 이어 읽기", ""] + [r for _, _, r in cues]
    (day / f"narration-{name}.txt").write_text("﻿" + "\r\n".join(head + body + tail) + "\r\n", encoding="utf-8")
    (day / f"narration-{name}-text.txt").write_text("﻿" + "\r\n".join(r for _, _, r in cues) + "\r\n", encoding="utf-8")
    print(name, len(cues), "문장", ts(length))


write("long", "롱폼", "zxcvbn-long.mp4", LONG_LEN, long_cues)
write("shorts", "숏폼", "zxcvbn-anim-vertical.mp4", 30.0, SHORTS)
# 음성 입히기(voice/voiceover.py)에서 쓰는 구간 목록
(here / "cues.json").write_text(json.dumps({"long": long_cues, "shorts": SHORTS}, ensure_ascii=False, indent=0), encoding="utf-8")
