"""롱폼용 장면 전체 녹화. 사용: python3 record_all.py [장면이름 ...]"""
import sys, shutil, subprocess, threading
from rec import *

B = '/root/바탕화면'
GEO = (360, 170, 1200, 720)               # 파일 관리자 창
IC = [(588, 315), (730, 315), (872, 315), (1014, 315), (1156, 315)]  # 아이콘 위치
REST = (1200, 760)

def reset_materials():
    shutil.rmtree(B, ignore_errors=True); shutil.copytree('/root/longrec/backup/바탕화면', B)

def center(fx, fy): return fx + 12, fy + 6
def hide_filee():
    w = win(name='^Filee$')
    if w: x('windowminimize', w)

def term(geo, title='terminal'):
    sh('pkill -x xterm'); time.sleep(.5)
    subprocess.Popen(['xterm', '-fa', 'DejaVu Sans Mono', '-fd', 'Noto Sans Mono CJK KR', '-fs', '19', '-bg', '#14161f', '-fg', '#e8e8ee',
                      '-geometry', geo, '-T', title, '-e', 'bash', '--norc'],
                     env={**os.environ, 'LANG': 'ko_KR.UTF-8', 'LC_ALL': 'ko_KR.UTF-8', 'PS1': '$ '})
    time.sleep(2); w = win(name=title); activate(w); time.sleep(.4); return w

def cmd(s, wait=1.5):
    type_(s, 45); time.sleep(.5); key('Return'); time.sleep(wait)

# ---------------- scenes ----------------
def s_tour():
    sh('pkill -x pcmanfm'); sh('pkill -x xterm')
    w = win(name='^Filee$') or sh("xdotool search --name '^Filee$'").split()[-1]
    x('windowmap', w); place(w, 240, 90, 1440, 900); activate(w); time.sleep(1); move(1000, 700)
    with Rec('tour') as r:
        time.sleep(2.5); r.mark('home')
        click(322, 336); r.mark('toolbar'); time.sleep(2.5)
        click(636, 466); r.mark('toolbar_hwp'); time.sleep(2.5)
        click(608, 318); r.mark('toolbar_pdf'); time.sleep(2.5)
        click(315, 377); r.mark('preset'); time.sleep(3)
        click(338, 418); r.mark('watch'); time.sleep(3)
        click(323, 500); r.mark('engine'); time.sleep(3.5)
        click(302, 213); r.mark('home2'); time.sleep(2)
    hide_filee()

def s_hwp():
    hide_filee(); open_folder(f'{B}/회사문서', GEO); move(*REST); time.sleep(1)
    with Rec('hwp') as r:
        time.sleep(1.5)
        cx, cy = center(*IC[0]); ctrl_drag(*IC[0], cx, cy - 105, r, 'a_'); time.sleep(3.2); r.mark('a_done')
        glide_to(*REST); x('click 1'); time.sleep(1)
        cx, cy = center(*IC[2]); ctrl_drag(*IC[2], cx, cy - 105, r, 'b_'); time.sleep(3.2); r.mark('b_done')
        glide_to(*REST); x('click 1'); time.sleep(1.5)

def s_heic():
    hide_filee(); open_folder(f'{B}/아이폰사진', GEO); move(*REST); time.sleep(1.5)
    with Rec('heic') as r:
        time.sleep(1.5)
        click(*IC[0]); r.mark('sel1'); time.sleep(.6)
        x('keydown ctrl'); time.sleep(.3)
        click(*IC[1]); time.sleep(.5); click(*IC[2]); time.sleep(.5); r.mark('sel3')
        glide_to(*IC[3]); time.sleep(.4); r.mark('ctrl')
        x('mousedown 1')
        for _ in range(12): x('mousemove_relative', 4, 3); time.sleep(.04)
        r.mark('donut'); time.sleep(1.8)
        cx, cy = center(*IC[3]); glide_to(cx + 52, cy - 93, 24); time.sleep(1.0); r.mark('hover')
        x('mouseup 1'); time.sleep(.1); x('keyup ctrl'); r.mark('drop')
        time.sleep(4); r.mark('done')
        glide_to(*REST); x('click 1'); time.sleep(2)

def s_contract():
    hide_filee(); open_folder(f'{B}/계약서', GEO); move(*REST); time.sleep(1)
    with Rec('contract') as r:
        time.sleep(1.5)
        cx, cy = center(*IC[0]); ctrl_drag(*IC[0], cx + 106, cy + 3, r, '', hold=2.4); time.sleep(3.2); r.mark('done')
        glide_to(*REST); x('click 1'); time.sleep(1.5)

def s_receipt():
    hide_filee(); open_folder(f'{B}/영수증', GEO); move(*REST); time.sleep(1.5)
    with Rec('receipt') as r:
        time.sleep(1.5)
        click(*IC[0]); r.mark('sel1'); time.sleep(.6)
        x('keydown ctrl'); time.sleep(.3); click(*IC[1]); time.sleep(.5); r.mark('sel2')
        glide_to(*IC[2]); time.sleep(.4); r.mark('ctrl')
        x('mousedown 1')
        for _ in range(12): x('mousemove_relative', 4, 3); time.sleep(.04)
        r.mark('donut'); time.sleep(1.6)
        key('Tab'); r.mark('tab'); time.sleep(1.8)
        cx, cy = center(*IC[2]); glide_to(cx - 95, cy + 50, 24); time.sleep(1.0); r.mark('hover')
        x('mouseup 1'); time.sleep(.1); x('keyup ctrl'); r.mark('drop')
        time.sleep(1.5); r.mark('dialog')
        d = None
        for _ in range(20):
            d = [w for w in sh("xdotool search --onlyvisible --name .").split() if '병합' in sh(f'xdotool getwindowname {w}')]
            if d: break
            time.sleep(.2)
        g = dict(l.split('=') for l in sh(f'xdotool getwindowgeometry --shell {d[-1]}').splitlines())
        bx, by = int(g['X']) + int(g['WIDTH']) - 64, int(g['Y']) + int(g['HEIGHT']) - 37
        glide_to(int(g['X']) + 200, int(g['Y']) + 250, 20); time.sleep(1.6)
        glide_to(bx, by, 24); time.sleep(.8); r.mark('merge_click'); x('click 1')
        time.sleep(3.0); r.mark('done')
        glide_to(*REST); x('click 1'); time.sleep(1.5)

def s_stamp():
    hide_filee(); open_folder(f'{B}/도장', GEO); move(*REST); time.sleep(1)
    with Rec('stamp') as r:
        time.sleep(1.5)
        cx, cy = center(*IC[0]); ctrl_drag(*IC[0], cx + 105, cy + 3, r, '', tab=True); time.sleep(3.2); r.mark('done')
        glide_to(*REST); x('click 1'); time.sleep(1.5)

def s_cli():
    sh('pkill -x pcmanfm'); hide_filee()
    term('76x20+260+170'); move(1800, 1000)
    with Rec('cli') as r:
        time.sleep(1.2)
        cmd('cd ~/바탕화면/휴가사진', .8); r.mark('cd')
        cmd('ls', 2.0); r.mark('ls1')
        cmd('filee convert *.heic --to jpg -o jpg', 3.0); r.mark('convert')
        cmd('ls jpg', 3.0); r.mark('ls2')

def s_watch():
    sh('pkill -x pcmanfm'); hide_filee()
    t = term('58x24+40+150', 'watch'); move(1880, 1050)
    w = open_folder(f'{B}/변환함', (1000, 150, 880, 780)); move(1880, 1050)
    activate(t); time.sleep(.5)
    with Rec('watch') as r:
        time.sleep(1.2)
        cmd('filee watch ~/바탕화면/변환함 --to pdf', 3.0); r.mark('started')
        for i, src in enumerate([f'{B}/회사문서/11월_회의록.hwp', f'/tmp/용역계약서.docx', f'{B}/영수증/영수증_식대.jpg']):
            shutil.copy(src, f'{B}/변환함/'); r.mark(f'drop{i}'); time.sleep(4.5)
        time.sleep(2.0); r.mark('done'); time.sleep(1.5)
    sh('pkill -f "filee-cli watch"'); sh('pkill -x xterm')

ALL = dict(tour=s_tour, hwp=s_hwp, heic=s_heic, contract=s_contract, receipt=s_receipt, stamp=s_stamp, cli=s_cli, watch=s_watch)
if __name__ == '__main__':
    names = sys.argv[1:] or list(ALL)
    reset_materials()
    for n in names:
        print('==', n, flush=True); ALL[n]()
    print('ok')
