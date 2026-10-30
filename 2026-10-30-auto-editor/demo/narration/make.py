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
SHORTS = [(0.0, 2.6, "말하다 멈춘 시간, 합치면 몇 초일까?"),
          (2.6, 6.2, "파란 곳은 말하는 곳, 빨간 곳은 조용한 곳"),
          (6.2, 11.6, "조용한 곳이 무려 열한 군데예요"),
          (11.6, 16.4, "명령 한 줄로 빨간 곳만 잘라내면"),
          (16.4, 20.4, "오십팔 초가 이십구 초로 줄어요"),
          (20.4, 26.4, "여유를 두거나, 빨리 감기로 바꿀 수도 있어요"),
          (26.4, 30.0, "오토 에디터, 전체 영상은 관련 영상에서!")]


def ts(x): return f"{int(x // 60):02d}:{x % 60:04.1f}"


def check(cues):
    for a, b, r in cues:
        assert "." not in r, r
        assert not re.search(r"[A-Za-z0-9]", r), r          # 영어·숫자는 모두 한글 읽기로
        n = len(re.sub(r"[\s,!?]", "", r)); rate = n / (b - a)
        assert rate <= 6.0, (r, round(rate, 2))


def write(name, title, video, length, cues):
    check(cues)
    head = [f"오토 에디터 {title} 내레이션 대본", f"영상 파일: media/{video} (길이 {ts(length)})", "",
            "■ 읽는 법", "- 대괄호 안 시간이 영상에서 그 문장이 나와야 하는 구간이에요",
            "- 영어·숫자는 모두 읽는 소리대로 한글로 바꿨어요 (예: auto-editor → 오토 에디터, 50% → 사십육 퍼센트)",
            "- 한 줄에 한 문장, 마침표 없이 정리했어요",
            "- 대본이 없는 구간은 시연 영상 소리가 나오는 곳이라 비워 두세요", "", "■ 구간별 대본", ""]
    body = []
    for a, b, r in cues:
        body += [f"[{ts(a)} ~ {ts(b)}]  ({b - a:.1f}초)", r, ""]
    tail = ["■ 전체 이어 읽기", ""] + [r for _, _, r in cues]
    (day / f"narration-{name}.txt").write_text("﻿" + "\r\n".join(head + body + tail) + "\r\n", encoding="utf-8")
    (day / f"narration-{name}-text.txt").write_text("﻿" + "\r\n".join(r for _, _, r in cues) + "\r\n", encoding="utf-8")
    print(name, len(cues), "문장", ts(length))


write("long", "롱폼", "auto-editor-long.mp4", LONG_LEN, long_cues)
write("shorts", "숏폼", "auto-editor-anim-vertical.mp4", 30.0, SHORTS)
# 음성 입히기(voice/voiceover.py)에서 쓰는 구간 목록
(here / "cues.json").write_text(json.dumps({"long": long_cues, "shorts": SHORTS}, ensure_ascii=False, indent=0), encoding="utf-8")
