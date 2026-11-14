"""시연용 가상 스캔 문서 만들기 (모두 직접 지어낸 가상 내용, 실제 기관·사람과 관계없음).
글자를 그림으로 그린 뒤 스캐너처럼 살짝 기울이고 얼룩·흐림을 넣어, 글자를 고를 수 없는 '그림만 있는 PDF'로 저장한다.
결과: samples/*.pdf, samples/정답.json(페이지별 원래 글)
사용: python3 make_samples.py"""
import io, json, os, random
import img2pdf
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "samples"); os.makedirs(OUT, exist_ok=True)
REG = "/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc"; BOLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
KR = 1  # ttc 안 한국어 글꼴 번호
W, H, DPI = 1654, 2339, 200  # A4, 200dpi

PAGES = [
 ("관리비 고지서", [
  ("h", "2026년 10월분 관리비 고지서"),
  ("p", "가상아파트 101동 1203호 김가상 님"),
  ("t", [("일반관리비", "48,300원"), ("청소비", "12,500원"), ("경비비", "31,200원"), ("승강기유지비", "4,800원"),
         ("전기료", "52,740원"), ("수도료", "18,900원"), ("난방비", "0원"), ("합계", "168,440원")]),
  ("p", "납부기한: 2026년 11월 25일"),
  ("p", "납부계좌: 가상은행 123-456-789012"),
  ("p", "문의: 관리사무소 02-000-0000"),
 ]),
 ("가정통신문", [
  ("h", "겨울방학 방과후 교실 신청 안내"),
  ("p", "학부모님, 안녕하십니까?"),
  ("p", "가상초등학교에서는 겨울방학 동안 방과후 교실을 운영합니다."),
  ("p", "운영 기간은 2027년 1월 5일부터 1월 30일까지입니다."),
  ("p", "강좌는 코딩, 그림책 만들기, 줄넘기, 바둑 네 가지입니다."),
  ("p", "신청을 원하시면 12월 4일까지 담임 선생님께 신청서를 내 주시기 바랍니다."),
  ("p", "수강료는 강좌마다 다르며, 교재비는 따로 받지 않습니다."),
  ("p", "2026년 11월 16일 가상초등학교장"),
 ]),
 ("영수증", [
  ("h", "가상카페 영수증"),
  ("p", "사업자번호 000-00-00000"),
  ("t", [("아메리카노 2잔", "9,000원"), ("카페라테 1잔", "5,200원"), ("치즈케이크 1개", "6,500원"), ("합계", "20,700원")]),
  ("p", "카드 결제 2026-11-12 14:37"),
  ("p", "이용해 주셔서 감사합니다"),
 ]),
]


def render(blocks, scale=1.0):
    im = Image.new("L", (W, H), 255); d = ImageDraw.Draw(im)
    fh = ImageFont.truetype(BOLD, int(64 * scale), index=KR); fp = ImageFont.truetype(REG, int(40 * scale), index=KR)
    y = 180; lines = []
    for kind, v in blocks:
        if kind == "h": d.text((W // 2, y), v, font=fh, fill=20, anchor="mt"); y += int(140 * scale); lines.append(v)
        elif kind == "p": d.text((150, y), v, font=fp, fill=30); y += int(80 * scale); lines.append(v)
        else:
            y += 30; d.line((150, y - 18, W - 150, y - 18), fill=60, width=3)
            for a, b in v:
                d.text((180, y), a, font=fp, fill=30); d.text((W - 180, y), b, font=fp, fill=30, anchor="ra")
                y += int(84 * scale); d.line((150, y - 14, W - 150, y - 14), fill=150, width=1); lines.append(f"{a} {b}")
            y += 40
    return im, lines


def scan(im, angle, seed, blur=0.6):
    """스캐너 흉내: 기울기·종이색·얼룩·흐림 → JPEG"""
    r = random.Random(seed)
    im = im.rotate(angle, resample=Image.BICUBIC, expand=False, fillcolor=255).filter(ImageFilter.GaussianBlur(blur))
    px = im.load()
    for _ in range(9000):  # 먼지·얼룩 점
        x, y = r.randrange(W), r.randrange(H); px[x, y] = max(0, px[x, y] - r.randrange(40, 120))
    im = Image.eval(im, lambda v: int(v * 0.93 + 8))  # 누런 종이처럼 살짝 어둡게
    return im


def save_pdf(imgs, name, dpi=DPI, size=None):
    data = []
    for im in imgs:
        if size: im = im.resize((int(W * size), int(H * size)), Image.BILINEAR)
        b = io.BytesIO(); im.convert("L").save(b, "JPEG", quality=70); data.append(b.getvalue())
    with open(os.path.join(OUT, name), "wb") as f:
        f.write(img2pdf.convert(data, layout_fun=img2pdf.get_fixed_dpi_layout_fun((dpi, dpi))))


truth, clean = {}, []
for i, (name, blocks) in enumerate(PAGES):
    im, lines = render(blocks); clean.append(im); truth[name] = lines
scanned = [scan(im, a, i) for i, (im, a) in enumerate(zip(clean, (1.2, -0.8, 0.6)))]
save_pdf(scanned, "스캔본.pdf")                                        # 기본 시연: 3쪽, 200dpi
save_pdf(scanned, "저해상도.pdf", dpi=int(DPI * 0.35), size=0.35)       # 70dpi 로 대충 찍은 스캔
save_pdf([scan(clean[0], 4.0, 7)], "기울어짐.pdf")                     # 4도 기울어진 고지서
save_pdf([scan(clean[0], 6.0, 7)], "기울어짐6도.pdf")                  # 6도 기울어진 고지서
save_pdf([scanned[0], scanned[1].rotate(180), scanned[2]], "거꾸로.pdf")  # 2쪽이 거꾸로 들어간 스캔
save_pdf([scan(c, a, 100 + k) for k in range(10) for c, a in zip(clean, (1.0, -0.5, 0.4))], "30쪽.pdf")  # 처리 시간용 30쪽
scanned[0].save(os.path.join(OUT, "p1.png")); scanned[1].save(os.path.join(OUT, "p2.png")); scanned[2].save(os.path.join(OUT, "p3.png"))
json.dump(truth, open(os.path.join(OUT, "정답.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for f in sorted(os.listdir(OUT)): print(f, os.path.getsize(os.path.join(OUT, f)) // 1024, "KB")
