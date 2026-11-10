"""블로그·영상용 결과 그림 (results.json 숫자 그대로) + 썸네일
사용: python3 make_images.py → ../media/비슷한사진_비교.png, ../media/정리결과_요약.png, ../media/thumbnail.jpg"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

H = Path(__file__).parent; R = json.loads((H / "results.json").read_text()); SRC = H / "work/정리전"; M = H.parent / "media"
FB = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"; FK = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"
f = lambda s, b=FB: ImageFont.truetype(b, s)
BG, INK, SUB, GOLD, GREEN, RED, BLUE, CARD = (13, 17, 23), (240, 243, 246), (154, 167, 184), (242, 193, 78), (126, 231, 135), (255, 123, 114), (88, 166, 255), (22, 27, 34)


def thumb(p, w, h):
    im = Image.open(p).convert("RGB"); im.thumbnail((w, h)); c = Image.new("RGB", (w, h), (1, 4, 9)); c.paste(im, ((w - im.width) // 2, (h - im.height) // 2)); return c


def group_of(res, name):  # 그 사진이 어느 묶음에 들어갔나: 'main'(원본 고양이와 같은 묶음) / 'other'(다른 묶음) / None(못 찾음)
    for g in res["groups"]:
        names = [x[0].split("/")[-1] for x in g]
        if name in names: return "main" if "고양이.jpg" in names or name in ("로켓_돌림.jpg",) and "로켓.jpg" in names else "other"
    return None


# 1) 비슷한 사진 비교판: 고양이 원본과 고친 사진 6장 + 돌린 로켓 + 작게 줄인 커피
V = [("2025_제주/고양이.jpg", "원본"), ("카톡받은사진/고양이_글자.jpg", "글자 넣음"), ("카톡받은사진/고양이_작게.jpg", "크기 절반"), ("카톡받은사진/고양이_저화질.jpg", "화질 25"),
     ("카톡받은사진/고양이_밝게.jpg", "밝게 25%"), ("카톡받은사진/고양이_흑백.jpg", "흑백"), ("카톡받은사진/고양이_살짝자름.jpg", "가장자리 자름"), ("카톡받은사진/로켓_돌림.jpg", "로켓 90° 돌림"),
     ("카톡받은사진/커피_카톡.jpg", "커피 1/3 크기")]
COLS = [("image_default", "기본 (차이 5)"), ("image_s15", "차이 15"), ("image_rot", "차이 15 + 돌림")]
cw, ch = 300, 200; W = 60 + len(V) * (cw + 20); Hh = 980
im = Image.new("RGB", (W, Hh), BG); d = ImageDraw.Draw(im)
d.text((W // 2, 60), "czkawka '비슷한 사진' 찾기 — 고친 사진을 몇 장 찾았나 (시연 결과)", font=f(48), fill=INK, anchor="mm")
d.text((W // 2, 118), "고양이·커피 사진 CC0, 로켓 사진 퍼블릭 도메인 (scikit-image 예제 사진) · 2026-11-11 클라우드 자동 실행 · czkawka_cli 12.0.2", font=f(24), fill=SUB, anchor="mm")
for i, (p, lab) in enumerate(V):
    x = 60 + i * (cw + 20); im.paste(thumb(SRC / "사진" / p, cw, ch), (x, 170)); d.text((x + cw // 2, 400), lab, font=f(30), fill=INK, anchor="mm")
    for j, (key, cl) in enumerate(COLS):
        y = 470 + j * 150
        if i == 0: d.text((30, y - 30), cl, font=f(28), fill=GOLD, anchor="lm")
        name = p.split("/")[-1]; g = "main" if i == 0 else group_of(R[key], name)
        if name.startswith("로켓"): g = "main" if group_of(R[key], name) else None
        col, s = (GREEN, "○ 원본과 같은 묶음") if g == "main" else (BLUE, "△ 다른 묶음") if g == "other" else (RED, "× 못 찾음")
        if i == 0: col, s = SUB, "기준 사진"
        d.rounded_rectangle((x, y, x + cw, y + 80), 18, fill=CARD, outline=col, width=3); d.text((x + cw // 2, y + 40), s, font=f(28), fill=col, anchor="mm")
d.text((W // 2, Hh - 40), "△ 밝게·흑백 두 장은 원본이 아니라 둘끼리 따로 묶임 · 커피 1/3 크기(15.7KB)는 모든 설정에서 못 찾음", font=f(26), fill=SUB, anchor="mm")
im.save(M / "비슷한사진_비교.png")

# 2) 정리 결과 요약 카드
im = Image.new("RGB", (1600, 900), BG); d = ImageDraw.Draw(im)
d.text((800, 70), "가상 'PC 정리 전' 폴더 41개 파일 · 146.7MB를 czkawka로 검사한 결과", font=f(44), fill=INK, anchor="mm")
cards = [("똑같은 파일", f"{R['dup_all']['files']}개 · {R['dup_all']['mib']:.1f}MB", f"{R['dup_all']['groups']}묶음 · {R['dup_all']['sec']}초", GOLD),
         ("비슷한 사진", f"{sum(len(g) for g in R['image_rot']['groups'])}장 · {len(R['image_rot']['groups'])}묶음", "차이 15 + 돌림 포함", BLUE),
         ("비슷한 영상", f"{len(R['video']['files'])}개 · 1묶음", f"{R['video']['sec']}초 (ffmpeg 사용)", BLUE),
         ("빈 폴더 · 빈 파일", f"{R['empty_folders']['found']}개 · {R['empty_files']['found']}개", "빈 폴더 안 빈 폴더도 한 번에", GREEN),
         ("임시 파일", f"{R['temp']['found']}개", ".tmp · .crdownload · .bak", GREEN),
         ("확장자가 틀린 파일", f"{R['ext']['found']}개", "영수증.pdf → 실제는 JPG", RED),
         ("위치 정보가 든 사진", f"{R['exif']['found']}장", "GPS · 찍은 날짜 · 기종", RED),
         ("이름이 이상한 파일", f"{R['bad_names']['found']}개", "띄어쓰기 두 번 · 끝 띄어쓰기", SUB)]
for i, (k, v, s, c) in enumerate(cards):
    x, y = 60 + (i % 4) * 380, 150 + (i // 4) * 340
    d.rounded_rectangle((x, y, x + 350, y + 300), 22, fill=CARD, outline=(48, 54, 61), width=2)
    d.text((x + 175, y + 60), k, font=f(32), fill=SUB, anchor="mm"); d.text((x + 175, y + 150), v, font=f(46, FK), fill=c, anchor="mm"); d.text((x + 175, y + 235), s, font=f(24), fill=SUB, anchor="mm")
d.text((800, 860), "모두 시연용 가상 자료 · 찾기만 한 결과(지운 파일 없음) · CPU 2개 리눅스", font=f(26), fill=SUB, anchor="mm")
im.save(M / "정리결과_요약.png")

# 3) 썸네일 (1280×720)
im = Image.new("RGB", (1280, 720), BG); d = ImageDraw.Draw(im)
for i, p in enumerate(["2025_제주/고양이.jpg", "카톡받은사진/고양이_글자.jpg", "카톡받은사진/고양이_흑백.jpg", "카톡받은사진/고양이_작게.jpg"]):
    t = thumb(SRC / "사진" / p, 290, 195); x = 30 + i * 310; im.paste(t, (x, 470)); d.rounded_rectangle((x - 3, 467, x + 293, 668), 10, outline=GOLD, width=4)
d.text((640, 120), "'최종_진짜최종' 복사본", font=f(78, FK), fill=INK, anchor="mm")
d.text((640, 245), f"{R['dup_all']['sec']}초 만에 {R['dup_all']['mib']:.0f}MB 찾음", font=f(92, FK), fill=GOLD, anchor="mm")
d.text((640, 370), "무료 czkawka · 똑같은 파일 · 비슷한 사진 · 빈 폴더", font=f(40), fill=SUB, anchor="mm")
d.text((640, 700), "시연용 가상 자료 · 클라우드 자동 실행 결과", font=f(20), fill=SUB, anchor="mm")
im.convert("RGB").save(M / "thumbnail.jpg", quality=92)
print("saved")
