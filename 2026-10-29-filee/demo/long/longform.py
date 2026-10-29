"""Filee 롱폼 편집: 장면 녹화(raw/*.mp4 + *.json) + 슬라이드 + 결과 카드 → 1920x1080 영상.
자막만 읽어도 이해되도록(내레이션 없이도 올릴 수 있게) 구성.
사용: python3 longform.py <출력.mp4>
"""
import sys, json, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = sys.argv[1] if len(sys.argv) > 1 else 'filee-long.mp4'
W, H, FPS = 1920, 1080, 30
RAW = '/root/longrec/raw'; AS = '/root/longrec/assets'
FAIL_IMG = '/home/claude/daily-github-pick/2026-10-29-filee/media/result-bg-fail.png'

FK = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
FB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
FM = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
_fc = {}
def font(p, s):
    k = (p, s)
    if k not in _fc: _fc[k] = ImageFont.truetype(p, s, index=1) if p.endswith('.ttc') else ImageFont.truetype(p, s)
    return _fc[k]

BG = (18, 20, 30); INK = (20, 22, 30); SUB = (150, 156, 175); ACC = (111, 92, 230); YEL = (255, 209, 102); OK = (34, 160, 90); WHITE = (255, 255, 255)
ease = lambda t: 0 if t <= 0 else 1 if t >= 1 else t * t * (3 - 2 * t)

# ---------- drawing helpers ----------
def pill(d, xy, text, size, bg, fg, anchor='l', alpha=255, f=None):
    f = f or font(FB, size); tw = d.textlength(text, font=f); px = size * .8; h = size * 1.75; x, y = xy
    if anchor == 'c': x -= (tw + 2 * px) / 2
    d.rounded_rectangle((x, y, x + tw + 2 * px, y + h), h / 2, fill=bg + (alpha,))
    d.text((x + px, y + h / 2), text, font=f, fill=fg + (alpha,), anchor='lm'); return x + tw + 2 * px

def subtitle(fr, text, alpha=255):
    if not text: return
    d = ImageDraw.Draw(fr); f = font(FB, 46)
    lines = text.split('\n'); lh = 66; tw = max(d.textlength(l, font=f) for l in lines)
    y0 = H - 70 - lh * len(lines)
    d.rounded_rectangle((W / 2 - tw / 2 - 34, y0 - 18, W / 2 + tw / 2 + 34, y0 + lh * len(lines) + 8), 22, fill=(10, 11, 18, int(alpha * .86)))
    for i, l in enumerate(lines):
        d.text((W / 2, y0 + lh * i + lh / 2 - 4), l, font=f, fill=WHITE + (alpha,), anchor='mm')

def chapter_tag(fr, label):
    d = ImageDraw.Draw(fr); pill(d, (36, 30), label, 30, (10, 11, 18), WHITE, alpha=225)

def keycap(fr, alpha):
    d = ImageDraw.Draw(fr); x, y = 40, 120; w, h = 118, 72
    d.rounded_rectangle((x - 16, y - 14, x + w + 300, y + h + 24), 20, fill=(10, 11, 18, int(alpha * .9)))
    d.rounded_rectangle((x, y + 8, x + w, y + h + 8), 14, fill=(70, 60, 140, alpha))
    d.rounded_rectangle((x, y, x + w, y + h), 14, fill=WHITE + (alpha,), outline=(70, 60, 140, alpha), width=4)
    d.text((x + w / 2, y + h / 2), 'Ctrl', font=font(FK, 34), fill=(70, 60, 140, alpha), anchor='mm')
    d.text((x + w + 22, y + h / 2 + 4), '누른 채로 끌기', font=font(FB, 34), fill=WHITE + (alpha,), anchor='lm')

def rounded(im, r):
    m = Image.new('L', im.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, im.size[0] - 1, im.size[1] - 1), r, fill=255)
    o = Image.new('RGBA', im.size, (0, 0, 0, 0)); o.paste(im.convert('RGBA'), (0, 0), m); return o

def shadowed(im, r=26, a=110):
    pad = r * 3; out = Image.new('RGBA', (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    m = im.split()[-1].point(lambda v: a if v else 0); sh = Image.new('RGBA', out.size, (0, 0, 0, 0))
    sh.paste((0, 0, 0, 255), (pad, pad + 14), m); sh = sh.filter(ImageFilter.GaussianBlur(r))
    out.alpha_composite(sh); out.alpha_composite(im, (pad, pad)); return out, pad

def checker(w, h, s=18):
    im = Image.new('RGB', (w, h), WHITE); d = ImageDraw.Draw(im)
    for yy in range(0, h, s):
        for xx in range(0, w, s):
            if (xx // s + yy // s) % 2: d.rectangle((xx, yy, xx + s - 1, yy + s - 1), fill=(222, 222, 228))
    return im

def fit(im, mw, mh):
    s = min(mw / im.width, mh / im.height); return im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)

# ---------- segments ----------
class Seg:
    dur = 0
    def frames(self): raise NotImplementedError

class Slide(Seg):
    """정적 배경 + 요소들이 순서대로 나타남. draw(d, fr, t) 콜백"""
    def __init__(self, dur, draw, tag=None, sub=None):
        self.dur = dur; self.draw = draw; self.tag = tag; self.sub = sub
    def frames(self):
        for i in range(int(self.dur * FPS)):
            t = i / FPS; fr = Image.new('RGBA', (W, H), BG + (255,))
            self.draw(ImageDraw.Draw(fr), fr, t)
            if self.tag: chapter_tag(fr, self.tag)
            if self.sub: subtitle(fr, self.sub(t) if callable(self.sub) else self.sub, int(255 * ease(t / .3)))
            a = min(ease(t / .25), ease((self.dur - t) / .25))
            if a < 1: fr = Image.blend(Image.new('RGBA', (W, H), BG + (255,)), fr, a)
            yield fr

def chapter(num, title, sub=''):
    def draw(d, fr, t):
        a = int(255 * ease(t / .4))
        d.text((W / 2, H / 2 - 80), f'{num:02d}', font=font(FK, 110), fill=ACC + (a,), anchor='mm')
        d.text((W / 2, H / 2 + 50), title, font=font(FK, 76), fill=WHITE + (a,), anchor='mm')
        if sub: d.text((W / 2, H / 2 + 140), sub, font=font(FB, 38), fill=SUB + (int(255 * ease((t - .4) / .4)),), anchor='mm')
    return Slide(2.8, draw)

class Clip(Seg):
    def __init__(self, name, crop, tag, subs, keycap_span=None, t0=0.0, t1=None, zoom=None):
        self.name = name; self.crop = crop; self.tag = tag; self.subs = subs
        self.m = json.load(open(f'{RAW}/{name}.json')); self.ks = keycap_span
        self.t0 = t0; self.t1 = t1 if t1 is not None else self.m['end']
        self.dur = self.t1 - self.t0
    def T(self, k):
        if isinstance(k, (int, float)): return k
        name, _, off = k.partition('+')
        if '-' in name and not off: name, _, off = k.partition('-'); return self.m[name] - float(off)
        return self.m[name] + (float(off) if off else 0)
    def frames(self):
        x, y, w, h = self.crop
        dec = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-ss', f'{self.t0:.3f}', '-i', f'{RAW}/{self.name}.mp4', '-t', f'{self.dur:.3f}',
                                '-vf', f'crop={w}:{h}:{x}:{y},scale={W}:{H}:flags=lanczos,fps={FPS}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
        subs = [(self.T(a), self.T(b), s) for a, b, s in self.subs]
        ks = (self.T(self.ks[0]), self.T(self.ks[1])) if self.ks else None
        n = 0; last = None
        while True:
            b = dec.stdout.read(W * H * 3)
            if len(b) < W * H * 3: break
            t = self.t0 + n / FPS; n += 1
            fr = Image.frombuffer('RGB', (W, H), b).convert('RGBA'); last = fr
            chapter_tag(fr, self.tag)
            if ks and ks[0] - .1 <= t <= ks[1] + .2:
                keycap(fr, int(255 * min(ease((t - ks[0] + .1) / .25), ease((ks[1] + .2 - t) / .25))))
            for a, bb, s in subs:
                if a <= t < bb: subtitle(fr, s, int(255 * min(ease((t - a) / .2), 1))); break
            a = min(ease((t - self.t0) / .25), ease((self.t1 - t) / .25))
            if a < 1: fr = Image.blend(Image.new('RGBA', (W, H), BG + (255,)), fr, a)
            yield fr
        dec.wait()

class Card(Seg):
    """결과물 보여주기: 어두운 배경 위 카드가 살짝 확대되며 등장"""
    def __init__(self, dur, card, tag, sub, title=None):
        self.dur = dur; self.tag = tag; self.sub = sub; self.title = title
        self.card, self.pad = shadowed(card)
    def frames(self):
        for i in range(int(self.dur * FPS)):
            t = i / FPS; fr = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(fr)
            e = ease(t / .5); s = .94 + .06 * e + .015 * (t / self.dur)
            c = self.card.resize((int(self.card.width * s), int(self.card.height * s)), Image.BILINEAR)
            if e < 1: c.putalpha(c.split()[-1].point(lambda v: int(v * e)))
            cy = (H - 150) / 2 + (20 if self.title else 0)
            fr.alpha_composite(c, (int(W / 2 - c.width / 2), int(cy - c.height / 2)))
            if self.title:
                pill(d, (W / 2, 80), self.title, 34, OK, WHITE, anchor='c', alpha=int(255 * e))
            chapter_tag(fr, self.tag); subtitle(fr, self.sub, int(255 * ease((t - .3) / .3)))
            a = min(ease(t / .25), ease((self.dur - t) / .25))
            if a < 1: fr = Image.blend(Image.new('RGBA', (W, H), BG + (255,)), fr, a)
            yield fr

# ---------- result cards ----------
def paper(path, mw, mh, top_frac=None):
    im = Image.open(path).convert('RGB')
    if top_frac: im = im.crop((0, 0, im.width, int(im.height * top_frac)))
    im = fit(im, mw, mh); c = rounded(im, 10)
    ImageDraw.Draw(c).rounded_rectangle((0, 0, c.width - 1, c.height - 1), 10, outline=(210, 210, 220), width=2); return c

def label_under(im, text, color=(230, 232, 240)):
    out = Image.new('RGBA', (im.width, im.height + 60), (0, 0, 0, 0)); out.alpha_composite(im)
    ImageDraw.Draw(out).text((im.width / 2, im.height + 34), text, font=font(FB, 32), fill=color + (255,), anchor='mm'); return out

def row(items, gap=50):
    w = sum(i.width for i in items) + gap * (len(items) - 1); h = max(i.height for i in items)
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0)); x = 0
    for i in items: out.alpha_composite(i, (x, (h - i.height) // 2)); x += i.width + gap
    return out

card_hwp = paper(f'{AS}/11월_회의록.png', 900, 740, top_frac=.62)
card_h2005 = paper(f'{AS}/한글2005_예제_p1.png', 900, 760, top_frac=.75)
card_heic = row([rounded(fit(Image.open(f'{AS}/IMG_010{i}.jpg').convert('RGB'), 400, 300), 14) for i in (1, 2, 3, 4)], 26)
card_heic = row([label_under(c, n) for c, n in [(card_heic, 'IMG_0101 ~ 0104.jpg  —  4장 모두 변환')]])
card_docx = paper(f'{AS}/fromPdf/용역계약서.png', 900, 760, top_frac=.55)
pages = [paper(f'{AS}/영수증_문구_merged_p{i}.png', 380, 520) for i in (1, 2, 3)]
card_rcp = row([label_under(p, f'{i + 1}쪽') for i, p in enumerate(pages)], 40)
st_b = Image.open(f'{AS}/내도장.jpg').convert('RGB').resize((460, 460))
st_a = checker(460, 460).convert('RGBA'); st_a.alpha_composite(Image.open(f'{AS}/내도장_transparent.png').convert('RGBA').resize((460, 460)))
card_stamp = row([label_under(rounded(st_b, 18), '원본 (흰 종이)'), label_under(rounded(st_a, 18), '배경 제거 (투명)', YEL)], 70)
card_fail = rounded(fit(Image.open(FAIL_IMG).convert('RGB'), 1600, 560), 18)

# ---------- slides ----------
def s_hook(d, fr, t):
    a1, a2, a3 = (int(255 * ease((t - k) / .5)) for k in (0, .6, 1.3))
    d.text((W / 2, 330), '한컴오피스 없는 PC에서', font=font(FK, 84), fill=WHITE + (a1,), anchor='mm')
    d.text((W / 2, 460), '한글 파일을 PDF로, 1초', font=font(FK, 100), fill=YEL + (a2,), anchor='mm')
    pill(d, (W / 2, 590), '끌어서 놓으면 끝 · 무료 · 인터넷 업로드 없음', 40, ACC, WHITE, anchor='c', alpha=a3)

def s_title(d, fr, t):
    a = lambda k: int(255 * ease((t - k) / .45))
    d.text((W / 2, 300), '오늘의 오픈소스', font=font(FB, 44), fill=SUB + (a(0),), anchor='mm')
    d.text((W / 2, 430), 'Filee', font=font(FK, 170), fill=WHITE + (a(.2),), anchor='mm')
    d.text((W / 2, 570), '끌어서 놓으면 끝나는 무료 파일 변환기', font=font(FB, 52), fill=WHITE + (a(.5),), anchor='mm')
    d.text((W / 2, 690), '일반인 쓸모  ★★★★★', font=font(FK, 56), fill=YEL + (a(.9),), anchor='mm')

def s_about(d, fr, t):
    d.text((W / 2, 150), '파일용 "만능 어댑터"', font=font(FK, 72), fill=WHITE, anchor='mm')
    ins = ['HWP', 'HEIC', 'PDF', 'DOCX', 'JPG']; outs = ['PDF', 'JPG', 'DOCX', 'HWPX', 'PNG']
    hub = (W / 2, 520)
    for i, (a_, b_) in enumerate(zip(ins, outs)):
        k = ease((t - .3 - i * .25) / .4); y = 330 + i * 95
        if k <= 0: continue
        al = int(255 * k)
        d.line((560, y, hub[0] - 120, hub[1]), fill=(80, 84, 110, al), width=4); d.line((hub[0] + 120, hub[1], W - 560, y), fill=(80, 84, 110, al), width=4)
        pill(d, (470, y - 34), a_, 34, (40, 44, 62), WHITE, anchor='c', alpha=al)
        pill(d, (W - 470, y - 34), b_, 34, (40, 44, 62), YEL, anchor='c', alpha=al)
    d.ellipse((hub[0] - 120, hub[1] - 120, hub[0] + 120, hub[1] + 120), fill=ACC + (255,))
    d.text(hub, 'Filee', font=font(FK, 54), fill=WHITE, anchor='mm')
    d.text((W / 2, 850), '268가지 형식을 서로 바꿔줘요 · 오피스, 한컴오피스 따로 안 깔아도 돼요', font=font(FB, 38), fill=SUB, anchor='mm')

def s_facts(d, fr, t):
    d.text((W / 2, 150), '알고 쓰면 좋은 사실', font=font(FK, 70), fill=WHITE, anchor='mm')
    facts = [('무료', 'MIT 라이선스 오픈소스, 회사에서도 무료'),
             ('오프라인', '파일을 인터넷에 올리지 않고 내 PC에서만 변환'),
             ('한국 개발자', '김명구(KnifeLemon) 님 작품 — HWP·한글 자막·알집까지 지원'),
             ('인기', '10월 GitHub 별 약 1.3만, C# 분야 일간 1위 7일 연속'),
             ('지원', 'Windows 10·11 정식 / macOS·리눅스 미리보기')]
    for i, (k, v) in enumerate(facts):
        e = ease((t - .3 - i * .35) / .4)
        if e <= 0: continue
        y = 290 + i * 118; al = int(255 * e); xo = int((1 - e) * 40)
        d.rounded_rectangle((300 + xo, y, 1620 + xo, y + 92), 22, fill=(32, 35, 50, al))
        d.text((350 + xo, y + 46), k, font=font(FK, 40), fill=YEL + (al,), anchor='lm')
        d.text((640 + xo, y + 46), v, font=font(FB, 36), fill=WHITE + (al,), anchor='lm')

def s_install(d, fr, t):
    d.text((W / 2, 140), 'Windows에 설치하기', font=font(FK, 70), fill=WHITE, anchor='mm')
    steps = [('1', '다운로드 페이지 열기', 'github.com/KnifeLemon/Filee/releases/latest'),
             ('2', 'Filee-버전-win-Setup.exe 받아서 실행', '마이크로소프트 스토어에서 "Filee" 검색해도 OK'),
             ('3', '처음 켜면 "변환 엔진 선택" 창', '동영상·음악용 추가 프로그램 → 문서·사진만 쓰면 "나중에"'),
             ('!', '아무 창도 안 뜨면?', '오래 업데이트 안 한 Windows 10 문제 → Windows 업데이트 먼저')]
    for i, (n, a_, b_) in enumerate(steps):
        e = ease((t - .3 - i * .5) / .4)
        if e <= 0: continue
        y = 260 + i * 160; al = int(255 * e)
        d.rounded_rectangle((280, y, 1640, y + 132), 24, fill=(32, 35, 50, al))
        col = (230, 90, 90) if n == '!' else ACC
        d.ellipse((310, y + 31, 380, y + 101), fill=col + (al,)); d.text((345, y + 66), n, font=font(FK, 38), fill=WHITE + (al,), anchor='mm')
        d.text((420, y + 44), a_, font=font(FK, 40), fill=WHITE + (al,), anchor='lm')
        d.text((420, y + 96), b_, font=font(FB, 30), fill=SUB + (al,), anchor='lm')

def s_limits(d, fr, t):
    d.text((W / 2, 150), '아쉬운 점도 솔직하게', font=font(FK, 70), fill=WHITE, anchor='mm')
    items = [('배경 제거', '흰 배경·단색 배경 전용. 인물·사물 사진 누끼는 다른 도구로'),
             ('추가 엔진', '동영상·음악, 오래된 DOC·PPT는 엔진을 따로 받아야 해요'),
             ('맥(Mac)', '아직 미리보기 버전. 처음 실행 때 보안 허용 필요'),
             ('별 주기 안내', '몇 번 쓰면 "GitHub 별 주기" 창이 한 번 떠요 (X로 닫기)')]
    for i, (k, v) in enumerate(items):
        e = ease((t - .3 - i * .45) / .4)
        if e <= 0: continue
        y = 290 + i * 135; al = int(255 * e)
        d.rounded_rectangle((260, y, 1660, y + 108), 22, fill=(32, 35, 50, al))
        d.text((310, y + 54), k, font=font(FK, 40), fill=(255, 140, 140, al), anchor='lm')
        d.text((600, y + 54), v, font=font(FB, 34), fill=WHITE + (al,), anchor='lm')

MONO = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 38, index=6)
def s_cmd(d, fr, t):
    d.text((W / 2, 150), 'Windows 명령 프롬프트(cmd)에서는', font=font(FK, 64), fill=WHITE, anchor='mm')
    lines = [(':: 폴더 안 아이폰 사진 전부 JPG로', SUB), ('filee convert C:\\사진\\*.heic --to jpg -o jpg', WHITE), ('', None),
             (':: 한글 파일을 PDF로', SUB), ('filee convert 회의록.hwp --to pdf', WHITE), ('', None),
             (':: 이 폴더에 들어오는 파일을 자동으로 PDF로', SUB), ('filee watch C:\\변환함 --to pdf', WHITE)]
    d.rounded_rectangle((260, 260, 1660, 840), 26, fill=(10, 11, 18, 255))
    for i, (s, c) in enumerate(lines):
        if not s: continue
        e = ease((t - .3 - i * .22) / .3)
        f = font(FB, 34) if s.startswith('::') else MONO
        d.text((320, 320 + i * 64), s, font=f, fill=c + (int(255 * e),), anchor='lm')
    d.text((W / 2, 900), '설치할 때 "filee 명령"을 켜두면 쓸 수 있어요', font=font(FB, 36), fill=YEL, anchor='mm')

def s_outro(d, fr, t):
    a = lambda k: int(255 * ease((t - k) / .45))
    d.text((W / 2, 170), '이런 분께 추천해요', font=font(FK, 70), fill=WHITE + (a(0),), anchor='mm')
    for i, s in enumerate(['한컴오피스 없는 PC로 HWP 받는 직장인', '아이폰 사진을 윈도우에서 쓰는 분', '회사 문서를 변환 사이트에 올리기 찜찜한 분']):
        pill(d, (W / 2, 290 + i * 110), s, 42, (32, 35, 50), WHITE, anchor='c', alpha=a(.4 + i * .3))
    d.text((W / 2, 690), 'Ctrl 누르고 끌어서 놓기', font=font(FK, 66), fill=YEL + (a(1.5),), anchor='mm')
    d.text((W / 2, 790), 'github.com/KnifeLemon/Filee', font=font(FB, 40), fill=SUB + (a(1.9),), anchor='mm')
    d.text((W / 2, 900), '내일도 쓸모 있는 오픈소스 하나 들고 올게요', font=font(FB, 38), fill=WHITE + (a(2.4),), anchor='mm')

# ---------- timeline ----------
FM_CROP = (300, 110, 1320, 742)
TL = []; CH = []
def add(seg, ch=None):
    seg.ch = ch; TL.append(seg)

add(Clip('hwp', FM_CROP, '미리보기', [(0, 'a_ctrl', '한컴오피스가 없는 PC에 한글 파일이 왔다면?'), ('a_ctrl', 'a_drop+0.8', '끌어서 놓기 한 번이면'), ('a_drop+0.8', 'a_done', '1초 만에 PDF 완성')],
         keycap_span=('a_ctrl', 'a_drop'), t0=1.2, t1=10.6), '미리보기')
add(Slide(4.5, s_hook))
add(Slide(5.0, s_title), '오늘의 오픈소스: Filee')
add(chapter(1, 'Filee가 뭔가요?'), 'Filee가 뭔가요?')
add(Slide(8.5, s_about, '01 Filee가 뭔가요', sub='해외여행 때 챙기는 만능 어댑터처럼, 모양(형식)이 안 맞는 파일을 맞춰줘요'))
add(Slide(9.5, s_facts, '01 Filee가 뭔가요'))
add(chapter(2, '설치하기', 'Windows 10·11'), '설치하기 (Windows)')
add(Slide(11, s_install, '02 설치하기'))
add(chapter(3, '앱 화면 둘러보기'), '앱 화면 둘러보기')
add(Clip('tour', (240, 90, 1440, 810), '03 앱 화면 둘러보기', [
    (0, 'toolbar', 'Filee를 켜면 나오는 첫 화면. 여기에 파일을 끌어다 놓아도 돼요'),
    ('toolbar', 'toolbar_hwp', "'원형 툴바'에서는 동그란 메뉴에 뭐가 나올지 정해요"),
    ('toolbar_hwp', 'toolbar_pdf', '파일 종류마다 메뉴가 달라요. 이건 한글 파일(HWP)용'),
    ('toolbar_pdf', 'preset', '이건 PDF용 메뉴. 워드, 한글로도 바꿀 수 있어요'),
    ('preset', 'watch', "'프리셋'에는 화질, 크기 같은 변환 설정을 저장해 둬요"),
    ('watch', 'engine', "'자동 변환 폴더'는 영상 끝에서 따로 보여드릴게요"),
    ('engine', 'home2', "'변환 엔진'은 동영상·오래된 문서용 추가 프로그램.\n필요할 때만 받으면 돼요"),
    ('home2', 'end', '사실 이 창은 거의 안 열어도 돼요. 진짜 쓰는 법은 바로 다음!')]))
add(chapter(4, '한글(HWP) → PDF', '한컴오피스 없이'), '한글(HWP) → PDF')
add(Clip('hwp', FM_CROP, '04 한글 → PDF', [
    (0, 'a_ctrl', '회사 PC에 한컴오피스가 없는데 한글 파일을 받았어요'),
    ('a_ctrl', 'a_donut+1.4', 'Ctrl 키를 누른 채로 파일을 끌면'),
    ('a_donut+1.4', 'a_hover-1.0', '커서 옆에 동그란 메뉴가 열려요'),
    ('a_hover-1.0', 'a_drop+0.8', "'PDF' 위에서 손을 놓으면"),
    ('a_drop+0.8', 'a_done+1.0', '1초 만에 끝! 원본 옆에 PDF가 생겼어요'),
    ('a_done+1.0', 'b_ctrl', '이번엔 한글 2005로 만든 진짜 예제 문서로 해볼게요'),
    ('b_ctrl', 'b_drop+0.8', '똑같이 Ctrl 누르고 끌어서 PDF에 놓기'),
    ('b_drop+0.8', 'end', '이것도 바로 변환. 결과를 열어볼까요?')], keycap_span=('a_ctrl', 'a_drop')))
add(Card(5.0, card_hwp, '04 한글 → PDF', '직접 만든 회의록: 제목, 목록, 표까지 그대로', '변환 결과 ①'))
add(Card(5.0, card_h2005, '04 한글 → PDF', '한글 2005 예제 문서: 그림, 색 채우기, 각주까지 정상', '변환 결과 ②'))
add(chapter(5, '아이폰 사진 여러 장 → JPG'), '아이폰 사진(HEIC) → JPG')
add(Clip('heic', FM_CROP, '05 아이폰 사진 → JPG', [
    (0, 'sel1', '아이폰 사진을 윈도우로 옮기면 HEIC라서 안 열리죠'),
    ('sel1', 'ctrl', '여러 장을 골라요 (Ctrl 누르고 하나씩 클릭)'),
    ('ctrl', 'donut+1.4', 'Ctrl 누른 채로 끌면 4장이 한 번에 잡혀요'),
    ('donut+1.4', 'drop+0.6', "'JPG' 위에 놓으면"),
    ('drop+0.6', 'end', '4장 모두 JPG로! 미리보기 사진도 바로 보여요')], keycap_span=('ctrl', 'drop')))
add(Card(4.5, card_heic, '05 아이폰 사진 → JPG', '어디서나 열리는 JPG 사진이 됐어요', '변환 결과'))
add(chapter(6, 'PDF 계약서 → 워드', '고쳐 써야 할 때'), 'PDF → 워드(DOCX)')
add(Clip('contract', FM_CROP, '06 PDF → 워드', [
    (0, 'ctrl', 'PDF로 받은 계약서, 내용을 고쳐야 할 때'),
    ('ctrl', 'hover-1.0', 'PDF 메뉴에는 워드(DOCX)도, 한글(HWP)도 있어요'),
    ('hover-1.0', 'drop+0.6', "'DOCX' 위에 놓으면"),
    ('drop+0.6', 'end', '글자를 고칠 수 있는 워드 파일이 됐어요')], keycap_span=('ctrl', 'drop')))
add(Card(4.5, card_docx, '06 PDF → 워드', '제목, 조항 글자가 그대로 살아 있어서 워드에서 바로 수정', '변환 결과 (워드 파일)'))
add(chapter(7, '영수증 3장 → PDF 한 부', '경비 처리할 때'), '영수증 사진 3장 → PDF 하나로')
add(Clip('receipt', FM_CROP, '07 영수증 → PDF 합치기', [
    (0, 'sel1', '경비 처리할 영수증 사진 3장'),
    ('sel1', 'ctrl', '3장을 골라서 (Ctrl 누르고 클릭)'),
    ('ctrl', 'tab', 'Ctrl 누른 채로 끌고'),
    ('tab', 'hover-1.0', 'Tab 키를 누르면 메뉴 뒷면이 나와요'),
    ('hover-1.0', 'drop+0.6', "'PDF 병합' 위에 놓으면"),
    ('drop+0.6', 'merge_click', '합칠 순서를 정하는 창이 떠요. 위아래로 순서 바꾸기도 돼요'),
    ('merge_click', 'end', "'PDF 병합'을 누르면 영수증 3장이 PDF 한 부로!")], keycap_span=('ctrl', 'drop')))
add(Card(4.5, card_rcp, '07 영수증 → PDF 합치기', '3쪽짜리 PDF 하나. 그대로 경비 청구에 첨부', '변환 결과'))
add(chapter(8, '도장 사진 배경 지우기'), '도장 배경 지우기')
add(Clip('stamp', FM_CROP, '08 도장 배경 지우기', [
    (0, 'ctrl', '흰 종이에 찍은 도장을 사진으로 찍었어요'),
    ('ctrl', 'tab', 'Ctrl 누른 채로 끌고'),
    ('tab', 'hover-1.0', 'Tab으로 뒷면 메뉴'),
    ('hover-1.0', 'drop+0.6', "'배경 제거' 위에 놓으면"),
    ('drop+0.6', 'end', '배경이 투명한 도장 그림 완성!')], keycap_span=('ctrl', 'drop')))
add(Card(4.5, card_stamp, '08 도장 배경 지우기', '전자 계약서, 견적서에 바로 붙일 수 있어요', '변환 결과'))
add(chapter(9, '솔직 후기: 안 되는 것'), '솔직 후기: 안 되는 것')
add(Card(6.0, card_fail, '09 솔직 후기', '하지만 일반 사진은 실패! 커피잔, 고양이까지 지워졌어요.\n배경 제거는 흰 배경·단색 배경 전용이에요', '직접 해본 실패 사례'))
add(Slide(9.0, s_limits, '09 솔직 후기'))
add(chapter(10, '수백 장도 한 번에', '명령어 한 줄'), '수백 장도 한 번에 (명령어)')
add(Clip('cli', (200, 130, 1340, 754), '10 명령어로 한꺼번에', [
    (0, 'ls1', '사진이 수백 장이면 하나씩 끌기 번거롭죠'),
    ('ls1', 'convert', '명령어 한 줄이면'),
    ('convert', 'ls2', '폴더 안 HEIC 사진 8장이 순식간에 JPG로'),
    ('ls2', 'end', 'jpg 폴더에 전부 들어 있어요')]))
add(Slide(8.0, s_cmd, '10 명령어로 한꺼번에'))
add(chapter(11, '자동 변환 폴더', '넣기만 하면 알아서'), '자동 변환 폴더')
add(Clip('watch', (20, 110, 1880, 1058), '11 자동 변환 폴더', [
    (0, 'started', "'변환함' 폴더를 지켜보게 해두고"),
    ('started', 'drop1', '폴더에 파일이 들어오면'),
    ('drop1', 'drop2', '알아서 PDF로 바꿔 converted 폴더에 넣어줘요'),
    ('drop2', 'end', '한글, 워드, 사진 무엇이든. Filee가 켜져 있는 동안 계속 지켜봐요')]))
add(Slide(10.0, s_outro), '정리 · 추천 대상')

# ---------- render ----------
enc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
n = 0
for seg in TL:
    if seg.ch: CH.append((n / FPS, seg.ch))
    for fr in seg.frames():
        enc.stdin.write(np.asarray(fr.convert('RGB')).tobytes()); n += 1
    print(f'{type(seg).__name__:6s} {getattr(seg, "name", "")} -> {n / FPS:.1f}s', flush=True)
enc.stdin.close(); enc.wait()
print('TOTAL', round(n / FPS, 1))
json.dump([(round(t, 1), c) for t, c in CH], open(OUT + '.chapters.json', 'w'), ensure_ascii=False)
for t, c in CH: print(f'{int(t // 60):02d}:{int(t % 60):02d} {c}')
