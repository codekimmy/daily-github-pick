"""시연용 가상 '다운로드' 폴더 만들기 (파일 27개). 모두 가상 자료: 이름·내용·날짜는 지어낸 것.
사용: python3 make_assets.py <폴더>  → 폴더를 비우고 새로 만든다"""
import os, shutil, sys, time, random
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright
import docx

root = sys.argv[1]; shutil.rmtree(root, ignore_errors=True); os.makedirs(root)
_pw = sync_playwright().start(); _pg = _pw.chromium.launch().new_page()
random.seed(7)
def ts(y, m, d): return time.mktime((y, m, d, 12, 0, 0, 0, 0, -1))
def touch(name, y, m, d):
    p = os.path.join(root, name); t = ts(y, m, d); os.utime(p, (t, t))
def pdf(name, lines, date):
    # 브라우저(Chromium)로 PDF 저장: 글꼴이 PDF 안에 들어가서 글자를 다시 읽을 수 있음
    _pg.set_content("<meta charset=utf-8><body style='font:20px Noto Sans CJK KR;padding:40px'>" + "".join(f"<p>{s}</p>" for s in lines))
    _pg.pdf(path=os.path.join(root, name), format="A5"); touch(name, *date)
def photo(name, color, date, size=(640, 480)):
    im = Image.new("RGB", size, color); d = ImageDraw.Draw(im)
    for _ in range(12):
        x, y = random.randint(0, size[0]), random.randint(0, size[1]); r = random.randint(20, 90)
        d.ellipse((x - r, y - r, x + r, y + r), fill=tuple(random.randint(80, 255) for _ in range(3)))
    im.save(os.path.join(root, name)); touch(name, *date)
def word(name, lines, date):
    dd = docx.Document(); [dd.add_paragraph(s) for s in lines]; dd.save(os.path.join(root, name)); touch(name, *date)
def raw(name, data, date):
    open(os.path.join(root, name), "wb").write(data); touch(name, *date)

# 영수증 PDF (내용에 '영수증'이 들어 있음, 파일 이름만 봐서는 모름)
pdf("scan_0412.pdf", ["영수증", "콩콩 카페 (가상)", "아메리카노 2잔  9,000원", "2026-04-12"], (2026, 4, 12))
pdf("download (3).pdf", ["전자 영수증", "가상 문구점", "볼펜 외 3건  12,300원"], (2026, 7, 3))
pdf("KakaoTalk_file_0901.pdf", ["영수증 (재발행)", "가상 약국", "합계 6,500원"], (2025, 9, 1))
# 일반 문서
pdf("회의록_10월.pdf", ["10월 정기 회의록 (가상)", "참석: 가상 인물 3명"], (2026, 10, 15))
pdf("여행일정표.pdf", ["제주 2박 3일 일정 (가상)"], (2026, 8, 20))
word("자기소개서_최종.docx", ["자기소개서 (가상 예시)"], (2026, 9, 5))
word("자기소개서_최종_진짜최종.docx", ["자기소개서 (가상 예시) 수정본"], (2026, 9, 7))
raw("가계부_2026.xlsx", b"PK\x03\x04 fake xlsx", (2026, 10, 1))
raw("발표자료.pptx", b"PK\x03\x04 fake pptx", (2026, 6, 11))
raw("메모.txt", "장보기: 우유, 달걀, 두부\n".encode(), (2026, 10, 30))
# 사진 (같은 사진 2장 = 중복)
photo("IMG_2034.jpg", (40, 90, 160), (2026, 7, 14)); photo("IMG_2035.jpg", (200, 120, 60), (2026, 7, 14))
photo("IMG_2101.jpg", (30, 140, 90), (2026, 8, 2)); photo("Screenshot_20261021.png", (230, 230, 240), (2026, 10, 21), (540, 960))
photo("KakaoTalk_Photo_01.jpg", (150, 60, 140), (2026, 10, 3)); photo("bg_wallpaper.png", (20, 20, 50), (2025, 12, 24))
shutil.copy(os.path.join(root, "IMG_2034.jpg"), os.path.join(root, "IMG_2034 (1).jpg")); touch("IMG_2034 (1).jpg", 2026, 10, 2)
shutil.copy(os.path.join(root, "KakaoTalk_Photo_01.jpg"), os.path.join(root, "KakaoTalk_Photo_01 - 복사본.jpg")); touch("KakaoTalk_Photo_01 - 복사본.jpg", 2026, 10, 4)
# 영상·음악 (가짜 내용)
raw("가족여행.mp4", os.urandom(300_000), (2026, 8, 22)); raw("녹음_0315.m4a", os.urandom(80_000), (2026, 3, 15))
raw("bgm.mp3", os.urandom(120_000), (2025, 11, 2))
# 설치 파일·압축 파일 (가짜)
raw("ChromeSetup.exe", os.urandom(50_000), (2025, 6, 1)); raw("KakaoTalk_Setup.exe", os.urandom(60_000), (2026, 10, 28))
raw("사진모음.zip", os.urandom(90_000), (2026, 2, 10)); raw("폰트.zip", os.urandom(40_000), (2025, 4, 4))
# 빈 파일 (다운로드 실패 흔적)
raw("새 텍스트 문서.txt", b"", (2026, 5, 5)); raw("download.crdownload", b"", (2026, 10, 31))
_pw.stop(); print(len(os.listdir(root)), "files")
