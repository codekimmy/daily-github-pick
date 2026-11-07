"""시연용 가상 문서 만들기 (모든 내용은 지어낸 가상 자료 — 실제 회사·사람과 관련 없음)
결과: work/docs/ 에 워드·엑셀·파워포인트·PDF·스캔 PDF·웹페이지·CSV(윈도우 한글 인코딩)·전자책·ZIP·사진
사용: python3 make_docs.py"""
import os, csv, io, zipfile, random
from docx import Document
from docx.shared import Pt
from openpyxl import Workbook
from pptx import Presentation
from pptx.util import Inches, Pt as PPt
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

H = os.path.dirname(os.path.abspath(__file__)); D = f"{H}/work/docs"; os.makedirs(D, exist_ok=True)
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"

# 1) 워드: 동네 꽃집 회의록 (제목·굵은 글씨·목록·표)
doc = Document()
doc.add_heading("꽃집 '봄날' 11월 운영 회의록", 0)
p = doc.add_paragraph("일시: 2026년 11월 3일(화) 오후 2시 · 장소: 매장 2층 · 참석: 김사장, 이매니저, 박직원")
doc.add_heading("1. 지난달 결과", 1)
p = doc.add_paragraph(); p.add_run("10월 매출은 ").bold = False; p.add_run("1,284만 원").bold = True; p.add_run("으로 9월보다 12% 늘었습니다.")
for s in ["가을 꽃다발 주문이 가장 많았습니다", "온라인 예약이 전체 주문의 38%였습니다", "배달 지연 문의가 7건 있었습니다"]:
    doc.add_paragraph(s, style="List Bullet")
doc.add_heading("2. 이번 달 할 일", 1)
t = doc.add_table(rows=1, cols=3); t.style = "Table Grid"
for i, s in enumerate(["할 일", "담당", "마감"]): t.rows[0].cells[i].text = s
for row in [["빼빼로데이 꽃다발 30개 준비", "이매니저", "11/10"], ["배달 기사 1명 추가 구하기", "김사장", "11/14"],
            ["포인세티아 화분 입고", "박직원", "11/20"], ["연말 예약 안내문 붙이기", "박직원", "11/25"]]:
    c = t.add_row().cells
    for i, s in enumerate(row): c[i].text = s
doc.add_heading("3. 정한 것", 1)
for s in ["배달은 오후 6시 전 주문만 당일 출발", "꽃다발 기본 가격 35,000원 유지", "다음 회의: 12월 1일"]:
    doc.add_paragraph(s, style="List Number")
doc.save(f"{D}/회의록.docx")

# 2) 엑셀: 두 달치 가계부 (시트 2개)
wb = Workbook(); random.seed(7)
items = [("식비", "장보기"), ("식비", "점심"), ("교통", "지하철"), ("생활", "세제"), ("통신", "휴대폰 요금"), ("문화", "영화"), ("식비", "카페")]
for si, (name, month) in enumerate([("10월", 10), ("11월", 11)]):
    ws = wb.active if si == 0 else wb.create_sheet(); ws.title = name
    ws.append(["날짜", "분류", "내용", "금액(원)"])
    for d in range(1, 13):
        cat, what = items[(d + si) % len(items)]
        ws.append([f"2026-{month:02d}-{d * 2:02d}", cat, what, random.choice([4500, 8900, 12000, 23800, 55000, 1450])])
    ws.append(["", "", "합계", sum(r[3].value for r in ws.iter_rows(min_row=2))])
wb.save(f"{D}/가계부.xlsx")

# 3) 파워포인트: 3장짜리 발표 (제목·글머리표·표·발표자 메모)
pr = Presentation(); pr.slide_width, pr.slide_height = Inches(13.33), Inches(7.5)
s = pr.slides.add_slide(pr.slide_layouts[0]); s.shapes.title.text = "우리 동네 플리마켓 안내"; s.placeholders[1].text = "2026년 11월 · 주민센터 문화팀"
s = pr.slides.add_slide(pr.slide_layouts[1]); s.shapes.title.text = "언제·어디서?"
tf = s.placeholders[1].text_frame; tf.text = "11월 21일(토) 오전 10시 ~ 오후 4시"
for x in ["주민센터 앞마당 (비 오면 1층 강당)", "판매 자리 40칸, 선착순 신청", "참가비 무료, 쓰레기는 각자 가져가기"]: tf.add_paragraph().text = x
s.notes_slide.notes_text_frame.text = "발표자 메모: 주차 공간이 없다는 점을 꼭 말하기"
s = pr.slides.add_slide(pr.slide_layouts[5]); s.shapes.title.text = "신청 방법"
tb = s.shapes.add_table(4, 3, Inches(1), Inches(2), Inches(11), Inches(3)).table
for r, row in enumerate([["방법", "기간", "준비물"], ["주민센터 방문", "11/9 ~ 11/16", "신분증"], ["전화 신청", "11/9 ~ 11/14", "없음"], ["현장 접수", "당일 9시", "남은 자리만"]]):
    for c, v in enumerate(row): tb.cell(r, c).text = v
pr.save(f"{D}/발표.pptx")

# 4) 웹페이지 + PDF (같은 안내문을 크로미움으로 PDF 인쇄) + 5) 스캔 PDF (글자를 그림으로만)
NOTICE = """<html><head><meta charset="utf-8"><title>아파트 관리사무소 공지</title>
<style>body{font-family:'Noto Sans CJK KR';margin:40px;line-height:1.6} table{border-collapse:collapse} td,th{border:1px solid #888;padding:6px 12px}</style></head>
<body><nav>홈 | 공지사항 | 민원 신청 | 로그인</nav>
<h1>겨울철 동파 예방 안내</h1>
<p>입주민 여러분, 기온이 <b>영하 10도</b> 아래로 내려가는 날에는 아래 내용을 꼭 지켜 주시기 바랍니다.</p>
<h2>지켜 주실 것</h2>
<ol><li>외출할 때도 보일러를 '외출' 모드로 켜 두기</li><li>수도꼭지를 아주 조금 틀어 물이 흐르게 하기</li><li>계량기함 안을 헌 옷이나 보온재로 채우기</li></ol>
<h2>동파 시 연락처</h2>
<table><tr><th>구분</th><th>연락처</th><th>시간</th></tr><tr><td>관리사무소</td><td>02-000-0000</td><td>평일 9시~18시</td></tr><tr><td>당직실</td><td>02-000-0001</td><td>24시간</td></tr></table>
<p>자세한 내용은 <a href="https://example.com/notice/2026-11">관리사무소 누리집</a>에서 확인하시기 바랍니다.</p>
<footer>© 2026 가상아파트 관리사무소 · 개인정보처리방침 · 이용약관</footer></body></html>"""
open(f"{D}/공지.html", "w", encoding="utf-8").write(NOTICE)
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); pg.set_content(NOTICE); pg.pdf(path=f"{D}/안내문.pdf", format="A4")
    # 100쪽짜리 긴 PDF (속도 시연용)
    long = "".join(f"<h2>{i}장. 가상 설명서</h2>" + "".join(f"<p>{i}-{j}. 이 문단은 속도를 재기 위해 만든 가상 문장입니다. 세탁기 사용 전에 전원 플러그를 확인하시기 바랍니다.</p>" for j in range(14)) + "<div style='page-break-after:always'></div>" for i in range(1, 101))
    pg.set_content(f"<html><body style=\"font-family:'Noto Sans CJK KR'\">{long}</body></html>"); pg.pdf(path=f"{D}/설명서100쪽.pdf", format="A4")
    pg.set_viewport_size({"width": 900, "height": 1270}); pg.set_content(NOTICE); pg.screenshot(path=f"{D}/_scan.png")
    b.close()
im = Image.open(f"{D}/_scan.png").convert("L").rotate(0.6, fillcolor=255, expand=False); im.save(f"{D}/스캔본.pdf", resolution=110); os.remove(f"{D}/_scan.png")

# 6) CSV: 윈도우 엑셀이 저장하는 한글 인코딩(cp949) 그대로
rows = [["이름", "반", "연락처", "회비 납부"], ["김하늘", "1반", "010-0000-0001", "O"], ["이바다", "1반", "010-0000-0002", "X"], ["박구름", "2반", "010-0000-0003", "O"], ["최들판", "2반", "010-0000-0004", "O"]]
with open(f"{D}/명단_cp949.csv", "w", encoding="cp949", newline="") as f: csv.writer(f).writerows(rows)

# 7) 전자책(EPUB)
from ebooklib import epub
bk = epub.EpubBook(); bk.set_identifier("demo-0001"); bk.set_title("작은 화분 키우기"); bk.set_language("ko"); bk.add_author("가상 저자")
chs = []
for i, (t1, body) in enumerate([("물 주기", "흙 겉면이 마르면 화분 밑으로 물이 나올 때까지 줍니다. 겨울에는 횟수를 절반으로 줄입니다."),
                                 ("햇빛", "하루 4시간 이상 창가 빛을 받게 합니다. 한여름 직사광선은 잎을 태울 수 있습니다.")], 1):
    c = epub.EpubHtml(title=t1, file_name=f"ch{i}.xhtml", lang="ko"); c.content = f"<h1>{i}장. {t1}</h1><p>{body}</p>"; bk.add_item(c); chs.append(c)
bk.toc = chs; bk.spine = ["nav"] + chs; bk.add_item(epub.EpubNcx()); bk.add_item(epub.EpubNav()); epub.write_epub(f"{D}/화분책.epub", bk)

# 8) 사진(글자가 있는 사진 — 글자를 읽어 주는지 확인용)
im = Image.new("RGB", (800, 400), "#fdf6e3"); dr = ImageDraw.Draw(im); ft = ImageFont.truetype(FONT, 56)
dr.text((60, 120), "영수증  합계 12,500원", font=ft, fill="#222"); im.save(f"{D}/영수증사진.jpg", quality=92)

# 9) ZIP: 여러 파일을 한 번에
with zipfile.ZipFile(f"{D}/묶음.zip", "w") as z:
    for n in ["회의록.docx", "가계부.xlsx", "명단_cp949.csv"]: z.write(f"{D}/{n}", n)

# 10) 큰 파일 (속도 시연): 1만 줄 엑셀, 50장 파워포인트
wb = Workbook(); ws = wb.active; ws.title = "주문"; ws.append(["번호", "상품", "수량", "금액"])
for i in range(1, 10001): ws.append([i, f"상품{i % 50}", i % 7 + 1, (i % 13 + 1) * 1000])
wb.save(f"{D}/주문1만줄.xlsx")
pr = Presentation()
for i in range(1, 51):
    s = pr.slides.add_slide(pr.slide_layouts[1]); s.shapes.title.text = f"{i}장. 가상 교육 자료"; s.placeholders[1].text = f"{i}번째 슬라이드의 핵심 내용입니다"
pr.save(f"{D}/교육50장.pptx")
for n in sorted(os.listdir(D)): print(f"{os.path.getsize(f'{D}/{n}') / 1024:8.1f}KB  {n}")
