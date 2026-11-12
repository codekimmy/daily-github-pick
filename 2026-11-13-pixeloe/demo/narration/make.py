"""음성용 대본 만들기 (GUIDE 5-1): 구간 시간 + 한글 읽기, 마침표 없음, 초당 6글자 이하 확인.
사용: python3 make.py  → 폴더 위로 narration-long.txt, narration-shorts.txt, *-text.txt 생성"""
import json, re
from pathlib import Path

here = Path(__file__).parent; day = here.parent.parent
src = (here.parent / "long/script.js").read_text(encoding="utf-8")
S = json.loads(src[src.index("{"): src.rindex("}") + 1])
# 음성 길이에 맞춘 시간(voice/retime.py → long/timing.js)이 있으면 그 시간을 씀
tj = here.parent / "long/timing.js"
if tj.exists():
    TM = json.loads(tj.read_text(encoding="utf-8").split("=", 1)[1].rstrip().rstrip(";"))
    for c, t in zip(S["chapters"], TM): c["dur"], c["cues"] = t["dur"], t["cues"]

# 롱폼: 장별 cue (미리보기도 첫 장으로 들어 있음, 읽을 문장이 있는 것만)
long_cues, t0 = [], 0
for c in S["chapters"]:
    long_cues += [(t0 + a, t0 + b, r) for a, b, _, r in c["cues"] if r]
    t0 += c["dur"]
LONG_LEN = t0

# 숏폼: 세로 과정 애니메이션 기준
SHORTS = [(0.0, 10.0, '평범한 고양이 사진 한 장이 있습니다\n이 사진에 명령 한 줄을 붙이면 어떻게 됩니까?'),
          (10.0, 22.0, '픽셀오이는 사진을 게임 속 도트 그림으로 바꿉니다\n점 사천여 개짜리 그림으로 바꾸는 데 영 쩜 일일 초가 걸렸습니다'),
          (22.0, 34.0, '보통 모자이크와 같은 점 개수로 비교했습니다\n픽셀오이는 눈 테두리를 검은 점 줄로 남겼습니다'),
          (34.0, 45.0, '가로 사천 화소 사진도 영 쩜 사팔 초 만에 끝났습니다\n다만 함께 설치되는 부품이 약 오 기가바이트로 무겁습니다'),
          (45.0, 54.0, '색 개수 설정은 정확한 개수를 보장하지 않습니다\n전체 영상은 관련 영상에서 확인하시기 바랍니다')]


aj = here.parent / "anim/timing.js"
SHORTS_LEN = 54.0
if aj.exists():
    B = json.loads(aj.read_text(encoding="utf-8").split("=", 1)[1].rstrip().rstrip(";"))["new"]
    SHORTS = [(B[i], B[i + 1], s) for i, (_, _, s) in enumerate(SHORTS)]; SHORTS_LEN = B[-1]


def ts(x): return f"{int(x // 60):02d}:{x % 60:04.1f}"


def check(cues):
    for a, b, r in cues:
        assert "." not in r, r
        assert not re.search(r"[A-Za-z0-9]", r), r          # 영어·숫자는 모두 한글 읽기로
        n = len(re.sub(r"[\s,!?]", "", r)); rate = n / (b - a)
        assert rate <= 6.0, (r, round(rate, 2))


def write(name, title, video, length, cues):
    check(cues)
    head = [f"픽셀오이(PixelOE) {title} 내레이션 대본", f"영상 파일: media/{video} (길이 {ts(length)})", "",
            "■ 읽는 법", "- 대괄호 안 시간이 영상에서 그 문장이 나와야 하는 구간입니다",
            "- 영어·숫자는 모두 읽는 소리대로 한글로 바꿨습니다 (예: PixelOE → 픽셀오이, -S → 에스, 0.11초 → 영 쩜 일일 초, 5GB → 오 기가바이트, 2024년 → 이천이십사 년, 584개 → 오백팔십사 개)",
            "- 한 줄에 한 문장, 마침표 없이 정리했습니다",
            "- 대본이 없는 구간은 화면만 보여 주는 곳이라 비워 둡니다", "", "■ 구간별 대본", ""]
    body = []
    for a, b, r in cues:
        body += [f"[{ts(a)} ~ {ts(b)}]  ({b - a:.1f}초)", *r.split("\n"), ""]  # 한 구간에 두 문장이면 \n으로 나눠 한 줄씩
    tail = ["■ 전체 이어 읽기", ""] + [l for _, _, r in cues for l in r.split("\n")]
    (day / f"narration-{name}.txt").write_text("﻿" + "\r\n".join(head + body + tail) + "\r\n", encoding="utf-8")
    (day / f"narration-{name}-text.txt").write_text("﻿" + "\r\n".join(l for _, _, r in cues for l in r.split("\n")) + "\r\n", encoding="utf-8")
    print(name, len(cues), "문장", ts(length))
    for a, b, r in cues:  # 예상 쉼: 구간 길이 - 읽는 시간(6.3글자/초), 2초 넘으면 알림 (GUIDE 5-1)
        n = len(re.sub(r"[\s,!?]", "", r)); rest = ((b - a) - n / 6.3) / len(r.split("\n"))  # 문장 하나당 쉼
        if rest > 2.0: print(f"  쉼 김 {rest:.1f}초: {r[:30]}")


write("long", "롱폼", "pixeloe-long.mp4", LONG_LEN, long_cues)
write("shorts", "숏폼", "pixeloe-anim-vertical.mp4", SHORTS_LEN, SHORTS)
# 구간 목록 (음성 입힐 때 참고)
(here / "cues.json").write_text(json.dumps({"long": long_cues, "shorts": SHORTS}, ensure_ascii=False, indent=0), encoding="utf-8")
