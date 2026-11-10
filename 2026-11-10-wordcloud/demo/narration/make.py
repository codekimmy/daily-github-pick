"""음성용 대본 만들기 (GUIDE 5-1): 구간 시간 + 한글 읽기, 마침표 없음, 초당 6글자 이하 확인.
사용: python3 make.py  → 폴더 위로 narration-long.txt, narration-shorts.txt, *-text.txt 생성"""
import json, re
from pathlib import Path

here = Path(__file__).parent; day = here.parent.parent
src = (here.parent / "long/script.js").read_text(encoding="utf-8")
S = json.loads(src[src.index("{"): src.rindex("}") + 1])

# 롱폼: 장별 cue (미리보기도 첫 장으로 들어 있음, 읽을 문장이 있는 것만)
long_cues, t0 = [], 0
for c in S["chapters"]:
    long_cues += [(t0 + a, t0 + b, r) for a, b, _, r in c["cues"] if r]
    t0 += c["dur"]
LONG_LEN = t0

# 숏폼: 세로 과정 애니메이션(54.5초) 기준
SHORTS = [(0.0, 9.5, "여기 친구 네 명이 나눈 육백 줄짜리 가상 단톡방이 있습니다\n이 대화에서 가장 많이 한 이야기는 무엇입니까?"),
          (9.5, 21.5, "같은 낱말도 조사가 붙으면 다른 낱말로 셉니다\n조사를 떼고 명사만 세면 다섯 갈래로 흩어져 있던 제주도가 칠십다섯 번으로 일 위가 됩니다"),
          (21.5, 34.5, "많이 나온 낱말일수록 크게, 큰 낱말부터 하나씩 자리를 잡습니다\n제주도, 흑돼지, 예약 순서로 크게 놓였습니다\n그림 한 장 만드는 데 일 초도 걸리지 않았습니다"),
          (34.5, 45.5, "하트나 말풍선 모양 틀을 주면 그 모양 안에만 낱말을 채웁니다\n카페 손님 의견은 말풍선에 담고, 노을 색으로도 칠할 수 있습니다"),
          (45.5, 54.5, "한글로 만들 때는 글꼴 지정이 꼭 필요합니다\n전체 영상은 관련 영상에서 확인하시기 바랍니다")]


def ts(x): return f"{int(x // 60):02d}:{x % 60:04.1f}"


def check(cues):
    for a, b, r in cues:
        assert "." not in r, r
        assert not re.search(r"[A-Za-z0-9]", r), r          # 영어·숫자는 모두 한글 읽기로
        n = len(re.sub(r"[\s,!?]", "", r)); rate = n / (b - a)
        assert rate <= 6.0, (r, round(rate, 2))


def write(name, title, video, length, cues):
    check(cues)
    head = [f"워드클라우드 {title} 내레이션 대본", f"영상 파일: media/{video} (길이 {ts(length)})", "",
            "■ 읽는 법", "- 대괄호 안 시간이 영상에서 그 문장이 나와야 하는 구간입니다",
            "- 영어·숫자는 모두 읽는 소리대로 한글로 바꿨습니다 (예: wordcloud → 워드클라우드, 600줄 → 육백 줄, 0.17초 → 영 쩜 일칠 초, 1.5초 → 일 쩜 오 초, 1위 → 일 위)",
            "- 한 줄에 한 문장, 마침표 없이 정리했습니다",
            "- 대본이 없는 구간은 화면만 보여 주는 곳이라 비워 둡니다", "", "■ 구간별 대본", ""]
    body = []
    for a, b, r in cues:
        body += [f"[{ts(a)} ~ {ts(b)}]  ({b - a:.1f}초)", *r.split("\n"), ""]  # 한 구간에 두 문장이면 \n으로 나눠 한 줄씩
    tail = ["■ 전체 이어 읽기", ""] + [l for _, _, r in cues for l in r.split("\n")]
    (day / f"narration-{name}.txt").write_text("﻿" + "\r\n".join(head + body + tail) + "\r\n", encoding="utf-8")
    (day / f"narration-{name}-text.txt").write_text("﻿" + "\r\n".join(l for _, _, r in cues for l in r.split("\n")) + "\r\n", encoding="utf-8")
    print(name, len(cues), "문장", ts(length))


write("long", "롱폼", "wc-long.mp4", LONG_LEN, long_cues)
write("shorts", "숏폼", "wc-anim-vertical.mp4", 54.5, SHORTS)
# 구간 목록 (음성 입힐 때 참고)
(here / "cues.json").write_text(json.dumps({"long": long_cues, "shorts": SHORTS}, ensure_ascii=False, indent=0), encoding="utf-8")
