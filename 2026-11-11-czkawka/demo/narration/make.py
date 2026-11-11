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

# 숏폼: 세로 과정 애니메이션(55초) 기준
SHORTS = [(0.0, 10.5, '시연용 가상 폴더에 파일 사십한 개가 있습니다\n이 중 쓸데없는 복사본은 몇 메가바이트입니까?'),
          (10.5, 23.0, '츠카프카는 파일 내용으로 지문을 떠서 대조합니다\n이름이 달라도 내용이 같은 보고서 네 개가 한 묶음으로 나왔습니다\n복사본은 모두 칠십구 메가바이트였습니다'),
          (23.0, 35.5, '글자를 넣거나 크기를 줄인 사진도 비슷한 사진으로 찾습니다\n설정을 넓히자 고친 사진 여섯 장 중 다섯 장을 찾았습니다\n가장자리를 자른 사진은 못 찾았습니다'),
          (35.5, 46.0, '빈 폴더와 임시 파일, 위치 정보가 든 사진도 찾아 줍니다\n지우기 전에는 꼭 미리 보기로 확인하시기 바랍니다'),
          (46.0, 55.0, '자동 정리 규칙은 원본 폴더 파일까지 지울 수 있으니 주의하시기 바랍니다\n전체 영상은 관련 영상에서 확인하시기 바랍니다')]


def ts(x): return f"{int(x // 60):02d}:{x % 60:04.1f}"


def check(cues):
    for a, b, r in cues:
        assert "." not in r, r
        assert not re.search(r"[A-Za-z0-9]", r), r          # 영어·숫자는 모두 한글 읽기로
        n = len(re.sub(r"[\s,!?]", "", r)); rate = n / (b - a)
        assert rate <= 6.0, (r, round(rate, 2))


def write(name, title, video, length, cues):
    check(cues)
    head = [f"츠카프카 {title} 내레이션 대본", f"영상 파일: media/{video} (길이 {ts(length)})", "",
            "■ 읽는 법", "- 대괄호 안 시간이 영상에서 그 문장이 나와야 하는 구간입니다",
            "- 영어·숫자는 모두 읽는 소리대로 한글로 바꿨습니다 (예: czkawka → 츠카프카, Krokiet → 크로키에트, 41개 → 사십한 개, 79MB → 칠십구 메가바이트, 12.0 → 십이 쩜 영, 8KB → 팔 킬로바이트)",
            "- 한 줄에 한 문장, 마침표 없이 정리했습니다",
            "- 대본이 없는 구간은 화면만 보여 주는 곳이라 비워 둡니다", "", "■ 구간별 대본", ""]
    body = []
    for a, b, r in cues:
        body += [f"[{ts(a)} ~ {ts(b)}]  ({b - a:.1f}초)", *r.split("\n"), ""]  # 한 구간에 두 문장이면 \n으로 나눠 한 줄씩
    tail = ["■ 전체 이어 읽기", ""] + [l for _, _, r in cues for l in r.split("\n")]
    (day / f"narration-{name}.txt").write_text("﻿" + "\r\n".join(head + body + tail) + "\r\n", encoding="utf-8")
    (day / f"narration-{name}-text.txt").write_text("﻿" + "\r\n".join(l for _, _, r in cues for l in r.split("\n")) + "\r\n", encoding="utf-8")
    print(name, len(cues), "문장", ts(length))
    for a, b, r in cues:  # 예상 쉼: 구간 길이 - 읽는 시간(6.3글자/초), 5초 넘으면 알림 (GUIDE 5-1)
        n = len(re.sub(r"[\s,!?]", "", r)); rest = (b - a) - n / 6.3
        if rest > 5.0: print(f"  쉼 김 {rest:.1f}초: {r[:30]}")


write("long", "롱폼", "cz-long.mp4", LONG_LEN, long_cues)
write("shorts", "숏폼", "cz-anim-vertical.mp4", 55.0, SHORTS)
# 구간 목록 (음성 입힐 때 참고)
(here / "cues.json").write_text(json.dumps({"long": long_cues, "shorts": SHORTS}, ensure_ascii=False, indent=0), encoding="utf-8")
