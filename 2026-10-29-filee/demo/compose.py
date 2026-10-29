"""실제 앱 화면 녹화(raw.mp4) + 장면 시각(scene_times.txt) → 자막·결과 카드가 들어간 편집 영상.
사용: python3 compose.py <raw.mp4> <scene_times.txt> <assets폴더> <출력.mp4> [h|v]
"""
import sys, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

RAW, TIMES, AS, OUT = sys.argv[1:5]
VERT = len(sys.argv) > 5 and sys.argv[5] == 'v'
W, H = (1080, 1920) if VERT else (1920, 1080)
FPS, RW, RH = 30, 1920, 1080
M = {l.split()[0]: float(l.split()[1]) for l in open(TIMES)}

FB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
FK = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
_fc = {}
def font(path, size):
    k = (path, size)
    if k not in _fc: _fc[k] = ImageFont.truetype(path, size, index=1)  # index 1 = KR
    return _fc[k]

INK, SUB, ACC, OK, BG = (20, 22, 30), (95, 100, 115), (111, 92, 230), (34, 160, 90), (246, 244, 240)
ease = lambda t: 0 if t <= 0 else 1 if t >= 1 else t * t * (3 - 2 * t)

# ---------- scenes ----------
SCENES = [
    dict(k='hwp', title='① 한글 파일(HWP) → PDF', target='PDF', card='pdf',
         note='한컴오피스 없이 열고, PDF로 저장'),
    dict(k='heic', title='② 아이폰 사진(HEIC) → JPG', target='JPG', card='jpg',
         note='윈도우에서 안 열리던 아이폰 사진'),
    dict(k='stamp', title='③ 도장 사진 → 배경 지우기', target='배경 제거', card='stamp',
         note='전자 문서에 바로 찍는 투명 도장'),
]
SEG = []  # (raw_start, raw_end)
for s in SCENES:
    s['a'] = M[s['k'] + '_select'] - 1.4
    s['b'] = M[s['k'] + '_done'] + 0.9
INTRO, OUTRO = 3.2, 4.5

# ---------- assets ----------
def load(p): return Image.open(f'{AS}/{p}')
pdf_img = load('11월_회의록.png').convert('RGB')
jpg_img = load('아이폰사진.jpg').convert('RGB')
st_before = load('내도장.jpg').convert('RGB')
st_after = load('내도장_transparent.png').convert('RGBA')

def checker(w, h, s=16):
    im = Image.new('RGB', (w, h), (255, 255, 255)); d = ImageDraw.Draw(im)
    for y in range(0, h, s):
        for x in range(0, w, s):
            if (x // s + y // s) % 2: d.rectangle((x, y, x + s - 1, y + s - 1), fill=(222, 222, 228))
    return im

def rounded(im, r):
    m = Image.new('L', im.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, im.size[0] - 1, im.size[1] - 1), r, fill=255)
    out = Image.new('RGBA', im.size); out.paste(im, (0, 0), m); return out

def make_card(kind, cw, ch):
    """결과 카드 (흰 카드 + 제목 + 실제 결과물)"""
    card = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    d = ImageDraw.Draw(card)
    d.rounded_rectangle((0, 0, cw - 1, ch - 1), 28, fill=(255, 255, 255, 255))
    pad = 28; top = 92
    name = {'pdf': '11월_회의록.pdf', 'jpg': '아이폰사진.jpg', 'stamp': '내도장_transparent.png'}[kind]
    d.ellipse((pad, 30, pad + 34, 64), fill=OK); d.line((pad + 9, 47, pad + 15, 54, pad + 26, 39), fill='white', width=5)
    d.text((pad + 48, 47), '변환 결과', font=font(FB, 30), fill=INK, anchor='lm')
    d.text((cw - pad, 47), name, font=font(FR, 24), fill=SUB, anchor='rm')
    aw, ah = cw - 2 * pad, ch - top - pad
    if kind == 'pdf':
        im = pdf_img.crop((0, 0, pdf_img.width, int(pdf_img.width * ah / aw)))  # 위쪽만
        im = im.resize((aw, ah), Image.LANCZOS)
        card.paste(rounded(im.convert('RGBA'), 14), (pad, top), rounded(im.convert('RGBA'), 14))
        d.rounded_rectangle((pad, top, pad + aw - 1, top + ah - 1), 14, outline=(225, 225, 232), width=2)
    elif kind == 'jpg':
        sc = min(aw / jpg_img.width, ah / jpg_img.height); im = jpg_img.resize((int(jpg_img.width * sc), int(jpg_img.height * sc)), Image.LANCZOS)
        r = rounded(im, 14); card.paste(r, (pad + (aw - im.width) // 2, top + (ah - im.height) // 2), r)
    else:  # 전 / 후
        half = (aw - 20) // 2; sz = min(half, ah - 46)
        for i, (lab, img) in enumerate([('원본', st_before), ('배경 제거', st_after)]):
            x = pad + i * (half + 20) + (half - sz) // 2
            bg = checker(sz, sz) if i else Image.new('RGB', (sz, sz), (255, 255, 255))
            bg = bg.convert('RGBA'); bg.alpha_composite(img.convert('RGBA').resize((sz, sz), Image.LANCZOS))
            r = rounded(bg, 14); card.paste(r, (x, top), r)
            d.rounded_rectangle((x, top, x + sz - 1, top + sz - 1), 14, outline=(225, 225, 232), width=2)
            d.text((x + sz // 2, top + sz + 24), lab, font=font(FB, 26), fill=ACC if i else SUB, anchor='mm')
    return card

# ---------- layout ----------
if VERT:
    CROP = (150, 92, 640, 430)        # raw 영역 (x, y, w, h) → 1080 폭
    SCR = (0, 360)                    # 화면 위치
    CARD = (60, 1250, 960, 580)       # x, y, w, h
else:
    CROP = (120, 20, 1000, 562)
    SCR = (0, 0)
    CARD = (1250, 430, 630, 560)
SC = W / CROP[2]
SH = int(CROP[3] * SC)
CARDS = {s['card']: make_card(s['card'], CARD[2], CARD[3]) for s in SCENES}

def shadow(img, r=24, off=(0, 10), a=90):
    sh = Image.new('RGBA', (img.width + 4 * r, img.height + 4 * r), (0, 0, 0, 0))
    m = img.split()[-1].point(lambda v: a if v > 0 else 0)
    sh.paste((0, 0, 0, 255), (2 * r + off[0], 2 * r + off[1]), m)
    return sh.filter(ImageFilter.GaussianBlur(r))

CARD_SH = {k: shadow(v) for k, v in CARDS.items()}

def pill(d, xy, text, size, bg, fg, anchor='l', padx=None, alpha=255):
    f = font(FB, size); tw = d.textlength(text, font=f); padx = padx or size * .8; h = size * 1.75
    x, y = xy
    if anchor == 'c': x -= (tw + 2 * padx) / 2
    if anchor == 'r': x -= tw + 2 * padx
    d.rounded_rectangle((x, y, x + tw + 2 * padx, y + h), h / 2, fill=bg + (alpha,))
    d.text((x + padx, y + h / 2), text, font=f, fill=fg + (alpha,), anchor='lm')
    return x + tw + 2 * padx

def keycap(d, x, y, s, alpha):
    """Ctrl 키 + '누른 채 끌기' (어두운 판 위)"""
    f = font(FK, int(34 * s)); w = 120 * s; h = 74 * s
    d.rounded_rectangle((x - 18 * s, y - 16 * s, x + w + 310 * s, y + h + 26 * s), 22 * s, fill=(18, 20, 30, int(alpha * .92)))
    d.rounded_rectangle((x, y + 8 * s, x + w, y + h + 8 * s), 14 * s, fill=(70, 60, 140, alpha))
    d.rounded_rectangle((x, y, x + w, y + h), 14 * s, fill=(255, 255, 255, alpha), outline=(70, 60, 140, alpha), width=int(4 * s))
    d.text((x + w / 2, y + h / 2), 'Ctrl', font=f, fill=(70, 60, 140, alpha), anchor='mm')
    d.text((x + w + 22 * s, y + h / 2 + 4 * s), '누른 채로 끌기', font=font(FB, int(34 * s)), fill=(255, 255, 255, alpha), anchor='lm')

# ---------- frame builders ----------
def overlay_scene(fr, s, t):
    """fr: 출력 크기 RGBA, s: scene, t: raw 시각"""
    k = s['k']; d = ImageDraw.Draw(fr)
    ctrl, donut, hover, drop = M[k + '_ctrl'], M[k + '_donut'], M[k + '_hover'], M[k + '_drop']
    tab = M.get(k + '_tab')
    # 제목 칩
    a = int(255 * ease((t - s['a']) / .4))
    if VERT:
        d.rectangle((0, 0, W, 360), fill=(18, 20, 30, 255))
        d.text((W / 2, 120), s['title'], font=font(FK, 62), fill=(255, 255, 255, a), anchor='mm')
        d.text((W / 2, 205), s['note'], font=font(FB, 38), fill=(200, 196, 255, a), anchor='mm')
    else:
        pill(d, (40, 34), s['title'], 40, (18, 20, 30), (255, 255, 255), alpha=int(a * .92))
    # 안내 문구 (하단 중앙)
    if t < ctrl: msg = '파일을 골라서'
    elif t < donut + .3: msg = None
    elif tab and t < tab + .2: msg = '커서 옆에 변환 메뉴가 열려요'
    elif tab and t < hover - .2: msg = 'Tab을 누르면 뒷면 메뉴'
    elif t < hover - .9: msg = '커서 옆에 변환 메뉴가 열려요'
    elif t < drop + .1: msg = f"'{s['target']}' 위에 놓으면"
    elif t < drop + 1.2: msg = '변환 중…'
    else: msg = '끝! 원본 옆에 새 파일이 생겨요'
    if VERT: my = SCR[1] + SH + 40
    else: my = H - 120
    if msg:
        done = msg.startswith('끝')
        pill(d, (W / 2 if VERT else 700, my), msg, 44 if VERT else 42, OK if done else (18, 20, 30), (255, 255, 255), anchor='c', alpha=235)
    # Ctrl 키 배지
    if ctrl - .1 <= t <= drop + .2:
        al = int(255 * min(ease((t - ctrl + .1) / .25), ease((drop + .2 - t) / .25)))
        if VERT: keycap(d, 150, 262, 1.0, al)
        else: keycap(d, 60, H - 250, 1.0, al)
    # 결과 카드
    ct = t - (drop + 1.25)
    if ct > 0:
        e = ease(ct / .45); c = CARDS[s['card']]; cs = CARD_SH[s['card']]
        x = int(CARD[0] + (1 - e) * (120 if not VERT else 0)); y = int(CARD[1] + (1 - e) * (0 if not VERT else 80))
        cc = c.copy(); cc.putalpha(c.split()[-1].point(lambda v: int(v * e)))
        fr.alpha_composite(cs.point(lambda v: int(v * e)) if False else cs, (x - 48, y - 48)) if e > .99 else None
        fr.alpha_composite(cc, (x, y))

def raw_view(raw):
    x, y, w, h = CROP
    im = Image.fromarray(raw).crop((x, y, x + w, y + h)).resize((W, SH), Image.LANCZOS)
    fr = Image.new('RGBA', (W, H), (18, 20, 30, 255))
    fr.paste(im, SCR)
    return fr

def intro(t, first):
    fr = first.copy().filter(ImageFilter.GaussianBlur(14)); fr = Image.blend(fr, Image.new('RGBA', fr.size, (18, 20, 30, 255)), .72)
    d = ImageDraw.Draw(fr); cy = H / 2 - (40 if not VERT else 120)
    a1 = int(255 * ease(t / .5)); a2 = int(255 * ease((t - .7) / .5)); a3 = int(255 * ease((t - 1.4) / .5))
    big = 92 if not VERT else 84
    d.text((W / 2, cy - 90), '한컴오피스 없이', font=font(FK, big), fill=(255, 255, 255, a1), anchor='mm')
    d.text((W / 2, cy + 30), '한글 파일을 PDF로?', font=font(FK, big), fill=(255, 209, 102, a2), anchor='mm')
    pill(d, (W / 2, cy + 150), '무료 · 인터넷 없이 · 한국 개발자가 만든 Filee', 34, (111, 92, 230), (255, 255, 255), anchor='c', alpha=a3)
    return fr

def outro(t, last):
    fr = last.copy().filter(ImageFilter.GaussianBlur(14)); fr = Image.blend(fr, Image.new('RGBA', fr.size, (18, 20, 30, 255)), .78)
    d = ImageDraw.Draw(fr); cy = H / 2 - (60 if not VERT else 200)
    a = lambda dt: int(255 * ease((t - dt) / .45))
    d.text((W / 2, cy - 150), 'Filee', font=font(FK, 120), fill=(255, 255, 255, a(0)), anchor='mm')
    d.text((W / 2, cy - 40), 'Ctrl 누르고 끌어서 놓으면, 변환 끝', font=font(FB, 46), fill=(255, 209, 102, a(.3)), anchor='mm')
    items = ['268가지 형식', '인터넷 없이', '완전 무료', 'HWP 지원']
    if VERT:
        for i, it in enumerate(items):
            pill(d, (W / 2, cy + 50 + i * 100), it, 40, (255, 255, 255), INK, anchor='c', alpha=a(.6 + i * .2))
        yb = cy + 520
    else:
        tot = sum(d.textlength(i, font=font(FB, 36)) + 36 * 1.6 + 24 for i in items); x = W / 2 - tot / 2
        for i, it in enumerate(items):
            x = pill(d, (x, cy + 50), it, 36, (255, 255, 255), INK, alpha=a(.6 + i * .2)) + 24
        yb = cy + 200
    d.text((W / 2, yb), 'github.com/KnifeLemon/Filee', font=font(FR, 34), fill=(190, 195, 210, a(1.6)), anchor='mm')
    return fr

# ---------- render ----------
dec = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', RAW, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', OUT], stdin=subprocess.PIPE)
def put(fr): enc.stdin.write(np.asarray(fr.convert('RGB')).tobytes())

def raw_frames():
    n = 0
    while True:
        b = dec.stdout.read(RW * RH * 3)
        if len(b) < RW * RH * 3: return
        yield n / FPS, np.frombuffer(b, np.uint8).reshape(RH, RW, 3); n += 1

gen = raw_frames(); first = last = None; si = 0; written = 0
for t, raw in gen:
    if si >= len(SCENES): break
    s = SCENES[si]
    if t < s['a']: continue
    if t > s['b']: si += 1; continue
    base = raw_view(raw)
    if first is None:
        first = base
        for i in range(int(INTRO * FPS)): put(intro(i / FPS, first)); written += 1
    overlay_scene(base, s, t); put(base); last = base; written += 1
for i in range(int(OUTRO * FPS)): put(outro(i / FPS, last)); written += 1
enc.stdin.close(); enc.wait(); dec.kill()
print('frames', written, 'sec', written / FPS)
