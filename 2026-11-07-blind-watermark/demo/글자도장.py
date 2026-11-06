"""글자 도장 넣기·꺼내기 예제 (글자 비밀번호 password_wm 까지 쓰는 방법).
명령어(blind_watermark --pwd)는 사진 섞는 번호만 바꿔서 다른 번호로도 꺼내졌습니다. 이 예제는 글자 비밀번호를 따로 정합니다.
사용 (cmd):
  python 글자도장.py 넣기 원본.png "ⓒ내사진 2026" 도장.png 5678
  python 글자도장.py 꺼내기 도장.png 136 5678
"""
import sys
from blind_watermark import WaterMark

if len(sys.argv) >= 6 and sys.argv[1] == "넣기":
    _, _, src, text, out, pw = sys.argv[:6]
    bwm = WaterMark(password_img=1, password_wm=int(pw))   # password_wm = 글자 비밀번호 (숫자)
    bwm.read_img(src)
    bwm.read_wm(text, mode="str")
    bwm.embed(out)                                        # 결과는 PNG로 저장하는 것이 안전합니다
    print("완료:", out)
    print("꺼낼 때 필요한 숫자 (꼭 적어 두기):", len(bwm.wm_bit))
elif len(sys.argv) >= 5 and sys.argv[1] == "꺼내기":
    _, _, src, n, pw = sys.argv[:5]
    bwm = WaterMark(password_img=1, password_wm=int(pw))
    print("숨은 글자:", bwm.extract(src, wm_shape=int(n), mode="str"))
else:
    print(__doc__)
