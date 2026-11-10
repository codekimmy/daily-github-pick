"""시연용 가상 'PC 정리 전' 폴더 만들기 (모두 직접 만든 가상 자료).
사진은 scikit-image에 들어 있는 저작권 없는 사진(고양이·커피 CC0, 로켓 퍼블릭 도메인)과 직접 그린 그림만 씀.
사용: python3 make_data.py  → work/정리전/ 생성 (다시 실행하면 처음부터 새로 만듦)"""
import os, random, shutil, subprocess
from pathlib import Path
import numpy as np, piexif
from PIL import Image, ImageDraw, ImageEnhance, ImageFont
import skimage.data as sk

H = Path(__file__).parent; R = H / "work/정리전"
shutil.rmtree(R, ignore_errors=True)
for d in ["다운로드", "바탕화면", "사진/2025_제주", "사진/카톡받은사진", "문서/회사", "문서/백업", "동영상", "새 폴더", "새 폴더 (2)", "정리할것/빈폴더/더빈폴더"]:
    (R / d).mkdir(parents=True, exist_ok=True)
rnd = random.Random(15)
FONT = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc", 28)


def blob(path, mb, seed):  # 같은 seed = 같은 내용 (복사본)
    r = random.Random(seed); path.write_bytes(r.randbytes(int(mb * 1024 * 1024)))


def doc(path, title, body):  # 가상 문서 (글 파일)
    path.write_text(f"{title}\n\n" + body * 40, encoding="utf-8")


# 1) 똑같은 파일 (내용이 같은 복사본)
doc(R / "문서/회사/보고서_최종.txt", "3분기 매출 보고서 (가상)", "가상 회사의 3분기 매출은 전 분기보다 늘었습니다.\n")
for n in ["다운로드/보고서_최종(1).txt", "바탕화면/보고서_최종_진짜최종.txt", "문서/백업/보고서_최종_최종2.txt"]:
    shutil.copy(R / "문서/회사/보고서_최종.txt", R / n)
doc(R / "문서/회사/보고서_수정본.txt", "3분기 매출 보고서 (가상, 수정)", "가상 회사의 3분기 매출은 전 분기보다 조금 늘었습니다.\n")  # 이름은 비슷하지만 내용이 다름
import zipfile
blob(R / "_강의영상.bin", 24, 1)
with zipfile.ZipFile(R / "다운로드/강의자료.zip", "w", zipfile.ZIP_STORED) as zf:  # 진짜 압축 파일 (안에 가상 강의 영상 1개)
    zf.write(R / "_강의영상.bin", "강의영상_1주차.bin"); zf.writestr("강의계획서.txt", "가상 강의 계획서\n" * 50)
(R / "_강의영상.bin").unlink()
shutil.copy(R / "다운로드/강의자료.zip", R / "다운로드/강의자료 (1).zip"); shutil.copy(R / "다운로드/강의자료.zip", R / "바탕화면/강의자료.zip")
blob(R / "다운로드/설치파일_v2.exe", 18, 2); shutil.copy(R / "다운로드/설치파일_v2.exe", R / "다운로드/설치파일_v2 (1).exe")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anoisesrc=d=600:c=pink:a=0.05", "-c:a", "aac", "-b:a", "128k", str(R / "문서/회사/회의녹음.m4a")], check=True)  # 10분짜리 가상 녹음 (잡음)

# 2) 사진: 원본 + 비슷한 사진(크기·화질·밝기·글자·자르기·흑백) + 똑같은 복사본
P = R / "사진/2025_제주"; K = R / "사진/카톡받은사진"
src = {"고양이": sk.chelsea(), "커피": sk.coffee(), "로켓": sk.rocket()}
for name, arr in src.items():
    im = Image.fromarray(arr).convert("RGB"); im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)  # 원본을 크게
    im.save(P / f"{name}.jpg", quality=95)
im = Image.open(P / "고양이.jpg")
im.resize((im.width // 2, im.height // 2), Image.LANCZOS).save(K / "고양이_작게.jpg", quality=90)          # 크기 절반
im.save(K / "고양이_저화질.jpg", quality=25)                                                            # 화질 낮춤
ImageEnhance.Brightness(im).enhance(1.25).save(K / "고양이_밝게.jpg", quality=90)                      # 밝게 보정
w = im.copy(); ImageDraw.Draw(w).text((30, w.height - 60), "@가상계정 워터마크", font=FONT, fill=(255, 255, 255)); w.save(K / "고양이_글자.jpg", quality=90)
im.crop((40, 30, im.width - 40, im.height - 30)).save(K / "고양이_살짝자름.jpg", quality=90)          # 가장자리 조금 자름
im.convert("L").save(K / "고양이_흑백.jpg", quality=90)                                                 # 흑백
c = Image.open(P / "커피.jpg"); c.resize((c.width // 3, c.height // 3), Image.LANCZOS).save(K / "커피_카톡.jpg", quality=60)
r_ = Image.open(P / "로켓.jpg"); r_.rotate(90, expand=True).save(K / "로켓_돌림.jpg", quality=90)        # 90도 돌림
# 직접 그린 그림 (서로 다른 그림 — 비슷한 사진으로 잘못 묶이는지 확인용)
for i, (sky, sea) in enumerate([((255, 170, 90), (40, 80, 160)), ((120, 190, 255), (20, 120, 140)), ((60, 40, 110), (10, 30, 60))]):
    g = Image.new("RGB", (1200, 800), sky); d = ImageDraw.Draw(g)
    for y in range(800):
        t = y / 800; d.line([(0, y), (1200, y)], fill=tuple(int(a * (1 - t) + b * t) for a, b in zip(sky, sea)))
    d.ellipse((800 - i * 250, 150 + i * 60, 950 - i * 250, 300 + i * 60), fill=(255, 240, 200))
    d.polygon([(0, 800), (300 + i * 100, 420), (700, 800)], fill=(30 + i * 20, 60, 40))
    g.save(P / f"바다_{i + 1}.jpg", quality=92)
# 사진에 위치 정보(GPS) 넣기 — 가상 좌표 (사진 위치 지우기 시연용)
def dms(x): x = abs(x); d = int(x); m = int((x - d) * 60); s = round(((x - d) * 60 - m) * 60 * 100); return ((d, 1), (m, 1), (s, 100))
for f, (la, lo) in {"바다_1.jpg": (33.4589, 126.9425), "바다_2.jpg": (33.2445, 126.5653), "커피.jpg": (37.5665, 126.9780)}.items():
    ex = {"0th": {piexif.ImageIFD.Make: b"VirtualCam", piexif.ImageIFD.Model: b"Demo-1"}, "Exif": {piexif.ExifIFD.DateTimeOriginal: b"2025:07:15 18:20:00"},
          "GPS": {piexif.GPSIFD.GPSLatitudeRef: b"N", piexif.GPSIFD.GPSLatitude: dms(la), piexif.GPSIFD.GPSLongitudeRef: b"E", piexif.GPSIFD.GPSLongitude: dms(lo)}}
    piexif.insert(piexif.dump(ex), str(P / f))
shutil.copy(P / "커피.jpg", P / "커피 (1).jpg")  # 똑같은 복사본 (위치 정보까지 같음)

# 3) 동영상: 같은 영상 복사본 + 크기만 줄인 영상 (비슷한 영상)
V = R / "동영상"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(P / "로켓.jpg"), "-f", "lavfi", "-i", "sine=frequency=220:duration=20",
                "-vf", "scale=1280:854,zoompan=z='1+0.002*on':d=600:s=1280x854:fps=30,format=yuv420p", "-t", "20", "-c:v", "libx264", "-b:v", "6M", "-c:a", "aac", "-shortest", str(V / "로켓발사_원본.mp4")], check=True)
shutil.copy(V / "로켓발사_원본.mp4", R / "바탕화면/로켓발사_원본 - 복사본.mp4")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(V / "로켓발사_원본.mp4"), "-vf", "scale=640:-2", "-c:v", "libx264", "-crf", "30", "-c:a", "copy", str(V / "로켓발사_카톡용.mp4")], check=True)

# 4) 빈 파일 · 빈 폴더 · 임시 파일 · 확장자가 틀린 파일 · 깨진 파일 · 이상한 이름
for n in ["바탕화면/새 텍스트 문서.txt", "바탕화면/새 텍스트 문서 (2).txt", "다운로드/메모.txt"]: (R / n).write_bytes(b"")
(R / "문서/회사/~$보고서_최종.docx").write_bytes(b"\0" * 162)        # 워드가 열려 있을 때 생기는 임시 파일 모양
(R / "다운로드/설치파일.tmp").write_bytes(rnd.randbytes(4096))
(R / "다운로드/영화자막.srt.crdownload").write_bytes(rnd.randbytes(2048))
(R / "문서/백업/정리.bak").write_bytes(rnd.randbytes(1024))
shutil.copy(P / "커피.jpg", R / "다운로드/영수증.pdf")                  # 내용은 JPG인데 이름은 .pdf
Image.open(P / "로켓.jpg").save(R / "다운로드/로켓사진.jpg", format="PNG")  # 내용은 PNG인데 이름은 .jpg
b = (P / "고양이.jpg").read_bytes(); (R / "사진/깨진사진.jpg").write_bytes(b[: len(b) // 3])   # 앞부분만 남은 사진 (깨짐)
z = (R / "다운로드/강의자료.zip"); (R / "다운로드/망가진압축.zip").write_bytes(b"PK\x03\x04" + rnd.randbytes(3000))
(R / "다운로드/사진  최종 .jpg").write_bytes((P / "바다_3.jpg").read_bytes())           # 띄어쓰기가 두 번 · 끝에 띄어쓰기

tot = sum(f.stat().st_size for f in R.rglob("*") if f.is_file()); n = sum(1 for f in R.rglob("*") if f.is_file())
print(f"파일 {n}개, {tot / 1024 / 1024:.1f}MB → {R}")
