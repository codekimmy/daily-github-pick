"""롱폼 녹화 도우미: 가상 화면(:99)에서 xdotool로 조작하고 ffmpeg로 장면별 녹화."""
import subprocess, time, json, os, signal
os.environ['DISPLAY'] = ':99'
OUT = '/root/longrec/raw'; os.makedirs(OUT, exist_ok=True)

def sh(cmd, check=False):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True, check=check).stdout.strip()

def x(*a): sh('xdotool ' + ' '.join(str(v) for v in a))
def move(px, py): x('mousemove', px, py)
def glide(x1, y1, x2, y2, n=26, dt=0.022):
    for i in range(1, n + 1):
        t = i / n; t = t * t * (3 - 2 * t)
        move(int(x1 + (x2 - x1) * t), int(y1 + (y2 - y1) * t)); time.sleep(dt)
def pos():
    o = sh('xdotool getmouselocation --shell'); d = dict(l.split('=') for l in o.splitlines()); return int(d['X']), int(d['Y'])
def glide_to(x2, y2, n=26): x1, y1 = pos(); glide(x1, y1, x2, y2, n)
def click(px=None, py=None, n=26):
    if px is not None: glide_to(px, py, n); time.sleep(.25)
    x('click', 1)
def key(k): x('key', k)
def type_(s, delay=55): sh(f"xdotool type --delay {delay} -- {json.dumps(s, ensure_ascii=False)}")

def win(name=None, cls=None):
    q = f'--name "{name}"' if name else f'--class {cls}'
    o = sh(f'xdotool search --onlyvisible {q}').split()
    return o[-1] if o else None
def place(w, px, py, ww, hh):
    x('windowmove --sync', w, px, py); x('windowsize --sync', w, ww, hh)
def activate(w): x('windowactivate --sync', w)

def open_folder(path, geo=(160, 120, 1600, 860)):
    sh('pkill -x pcmanfm'); time.sleep(.8)
    subprocess.Popen(['pcmanfm', '--no-desktop', '-n', path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env={**os.environ, 'LANG': 'ko_KR.UTF-8'})
    for _ in range(40):
        time.sleep(.25); w = win(cls='pcmanfm')
        if w: break
    time.sleep(.8); place(w, *geo); activate(w); time.sleep(.6)
    return w

class Rec:
    def __init__(self, name):
        self.name = name; self.path = f'{OUT}/{name}.mp4'; self.marks = {}
    def __enter__(self):
        self.p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'x11grab', '-framerate', '30', '-video_size', '1920x1080', '-i', ':99',
                                   '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-pix_fmt', 'yuv420p', self.path], stdin=subprocess.DEVNULL)
        time.sleep(1.2); self.t0 = time.time(); self.mark('start'); return self
    def mark(self, k): self.marks[k] = round(time.time() - self.t0 + 0.0, 3); print(self.name, k, self.marks[k], flush=True)
    def __exit__(self, *a):
        time.sleep(1.0); self.mark('end'); self.p.send_signal(signal.SIGINT); self.p.wait()
        json.dump(self.marks, open(f'{OUT}/{self.name}.json', 'w'), ensure_ascii=False, indent=1)

def ctrl_drag(fx, fy, tx, ty, r=None, tag='', tab=False, hold=1.5):
    """Ctrl 누른 채 (fx,fy) 아이콘을 끌어 도넛을 열고 (tx,ty) 칸에 놓기"""
    glide_to(fx, fy); time.sleep(.5)
    x('keydown ctrl'); time.sleep(.5); r and r.mark(tag + 'ctrl')
    x('mousedown 1')
    for _ in range(12): x('mousemove_relative', 4, 3); time.sleep(.04)
    r and r.mark(tag + 'donut'); time.sleep(hold)
    if tab: key('Tab'); r and r.mark(tag + 'tab'); time.sleep(1.4)
    glide_to(tx, ty, 24); time.sleep(1.0); r and r.mark(tag + 'hover')
    x('mouseup 1'); time.sleep(.1); x('keyup ctrl'); r and r.mark(tag + 'drop')

def shot(path, crop=None):
    vf = ['-vf', f'crop={crop}'] if crop else []
    sh(f"ffmpeg -y -loglevel error -f x11grab -video_size 1920x1080 -i :99 -frames:v 1 {' '.join(vf)} {path}")
