"""segno 시연 측정: 결과는 results.json, 만든 QR 그림은 work/ (커밋하지 않음)
모든 데이터(와이파이 이름·비밀번호·연락처)는 시연용 가상 자료"""
import json, os, subprocess, sys, time, shutil, glob
from PIL import Image, ImageDraw, ImageFilter
import zxingcpp

HERE = os.path.dirname(os.path.abspath(__file__))
W = os.path.join(HERE, "work"); os.makedirs(W, exist_ok=True)
R = {}

def run(cmd):
    t = time.perf_counter()
    p = subprocess.run(cmd, cwd=W, capture_output=True, text=True)
    return round(time.perf_counter() - t, 3), p.returncode, (p.stdout + p.stderr).strip()

def decode(path_or_img):
    im = Image.open(path_or_img) if isinstance(path_or_img, str) else path_or_img
    r = zxingcpp.read_barcodes(im.convert("RGB"))
    return [x.text for x in r]

def info(path):
    im = Image.open(path)
    return {"px": im.size[0], "bytes": os.path.getsize(path)}

# 0. 설치: 빈 폴더에 pip --target
inst = os.path.join(W, "inst"); shutil.rmtree(inst, ignore_errors=True)
t, rc, out = run([sys.executable, "-m", "pip", "install", "--no-cache-dir", "--target", inst, "segno==1.6.6"])
size = sum(os.path.getsize(f) for f in glob.glob(inst + "/**", recursive=True) if os.path.isfile(f))
pkgs = sorted({d.split("-")[0] for d in os.listdir(inst) if d.endswith(".dist-info")})
R["install"] = {"sec": t, "rc": rc, "pkgs": pkgs, "bytes": size}
t, rc, out = run(["segno", "--ver"]); R["version"] = out

# 1. 와이파이 QR (명령어)
WIFI = "WIFI:T:WPA;S:우리집_5G;P:kimchi2026!;;"
t, rc, out = run(["segno", WIFI, "-o", "wifi.png", "--scale", "10"])
R["wifi"] = {"sec": t, **info(os.path.join(W, "wifi.png")), "decoded": decode(os.path.join(W, "wifi.png"))}
import segno
q = segno.make(WIFI); R["wifi"]["version"] = q.version; R["wifi"]["error"] = q.error; R["wifi"]["modules"] = q.symbol_size(border=0)[0]
# 파이썬 도우미로 같은 내용
from segno import helpers
q2 = helpers.make_wifi(ssid="우리집_5G", password="kimchi2026!", security="WPA")
q2.save(os.path.join(W, "wifi_helper.png"), scale=10)
R["wifi"]["helper_decoded"] = decode(os.path.join(W, "wifi_helper.png"))

# 2. 연락처(명함) QR — MECARD, 한글 이름
MEC = "MECARD:N:김하늘;TEL:01012345678;EMAIL:sky@example.com;;"
t, rc, out = run(["segno", MEC, "-o", "card.png", "--scale", "10"])
R["card"] = {"sec": t, **info(os.path.join(W, "card.png")), "decoded": decode(os.path.join(W, "card.png")), "version": segno.make(MEC).version}
vc = helpers.make_vcard(name="김;하늘", displayname="김하늘", phone="010-1234-5678", email="sky@example.com", org="가상상회")
vc.save(os.path.join(W, "vcard.png"), scale=10)
R["card"]["vcard_version"] = vc.version; R["card"]["vcard_decoded"] = decode(os.path.join(W, "vcard.png"))

# 3. 글 길이 → QR 크기(버전)
texts = {"짧은 주소": "https://example.com", "한글 인사 10자": "안녕하세요반갑습니다", "한글 100자": "가" * 100, "한글 500자": "가" * 500, "영문 1000자": "a" * 1000}
R["length"] = []
for k, s in texts.items():
    qq = segno.make(s)
    R["length"].append({"name": k, "chars": len(s), "version": qq.version, "modules": qq.symbol_size(border=0)[0], "error": qq.error})
# 너무 긴 글
open(os.path.join(W, "long.txt"), "w").write("가" * 1000)
t, rc, out = run(["segno", "가" * 1000, "-o", "toolong.png"])
R["toolong"] = {"chars": 1000, "rc": rc, "msg": out.splitlines()[-1] if out else ""}
# 한글 최대 글자 수 찾기
lo, hi = 1, 1000
while lo < hi:
    m = (lo + hi + 1) // 2
    try: segno.make("가" * m); lo = m
    except Exception: hi = m - 1
R["max_korean"] = lo

# 4. 오류 정정 단계별: 같은 주소, 가운데를 가린 그림
URL = "https://github.com/heuer/segno"
R["errorlevel"] = []
for lv in "LMQH":
    fn = f"err_{lv}.png"
    t, rc, out = run(["segno", URL, "-e", lv, "--no-error-boost", "-o", fn, "--scale", "10"])
    p = os.path.join(W, fn); im = Image.open(p).convert("RGB"); n = im.size[0]
    res = {"level": lv, "version": segno.make(URL, error=lv, boost_error=False).version, "px": n, "cover": {}}
    for pct in (5, 10, 15, 20, 25):
        side = int(n * (pct / 100) ** 0.5)  # 전체 그림 넓이의 pct%
        c = im.copy(); d = ImageDraw.Draw(c); o = (n - side) // 2
        d.rectangle([o, o, o + side, o + side], fill=(255, 140, 0))
        ok = decode(c) == [URL]; res["cover"][pct] = ok
        if pct == 15: c.save(os.path.join(W, f"cover15_{lv}.png"))
    R["errorlevel"].append(res)

# 5. 색 바꾸기
R["colors"] = []
for name, dark, light in [("남색/흰색", "#1a2a6c", "white"), ("빨강/연노랑", "#c0392b", "#fff7d6"), ("연회색/흰색", "#d0d0d0", "white"), ("흰색/검정(반전)", "white", "black"), ("투명 바탕", "#1a2a6c", "transparent")]:
    fn = "color_" + str(len(R["colors"])) + ".png"
    run(["segno", URL, "--dark", dark, "--light", light, "-o", fn, "--scale", "10"])
    im = Image.open(os.path.join(W, fn)).convert("RGBA")
    bg = Image.new("RGBA", im.size, "white"); bg.alpha_composite(im)
    R["colors"].append({"name": name, "dark": dark, "light": light, "file": fn, "decoded_ok": decode(bg) == [URL]})

# 6. 테두리·배율
R["border"] = {}
for b in (0, 4):
    run(["segno", URL, "-b", str(b), "-o", f"border{b}.png", "--scale", "10"])
    im = Image.open(os.path.join(W, f"border{b}.png")).convert("RGB")
    # 사진 속처럼 주변이 어두운 배경 위에 놓았을 때
    bg = Image.new("RGB", (im.size[0] + 200, im.size[1] + 200), (40, 40, 40)); bg.paste(im, (100, 100))
    R["border"][b] = {"alone": decode(im) == [URL], "on_dark": decode(bg) == [URL]}
R["scale"] = []
for s in (1, 3, 10):
    run(["segno", URL, "-o", f"scale{s}.png", "--scale", str(s)])
    R["scale"].append({"scale": s, **info(os.path.join(W, f"scale{s}.png")), "ok": decode(os.path.join(W, f"scale{s}.png")) == [URL]})
run(["segno", URL, "-o", "url.svg", "--scale", "10"])
R["svg_bytes"] = os.path.getsize(os.path.join(W, "url.svg"))
run(["segno", URL, "-o", "print.png", "--scale", "10", "--dpi", "300"])
R["dpi"] = Image.open(os.path.join(W, "print.png")).info.get("dpi")

# 7. 휴대폰 카메라 흉내: 기울이기·흐리기·작게
src = Image.open(os.path.join(W, "wifi.png")).convert("RGB")
R["camera"] = []
tests = [("15도 기울임", lambda im: im.rotate(15, expand=True, fillcolor="white")),
         ("흐리게(반지름 3)", lambda im: im.filter(ImageFilter.GaussianBlur(3))),
         ("흐리게(반지름 8)", lambda im: im.filter(ImageFilter.GaussianBlur(8))),
         ("가로 80px로 작게", lambda im: im.resize((80, 80))),
         ("가로 40px로 작게", lambda im: im.resize((40, 40)))]
for name, f in tests:
    R["camera"].append({"name": name, "ok": decode(f(src)) == [WIFI]})

# 8. 마이크로 QR
t, rc, out = run(["segno", "01012345678", "--micro", "-o", "micro.png", "--scale", "10"])
mq = segno.make("01012345678", micro=True)
R["micro"] = {"version": mq.designator, "modules": mq.symbol_size(border=0)[0], "decoded": decode(os.path.join(W, "micro.png")), "normal_modules": segno.make_qr("01012345678").symbol_size(border=0)[0]}

# 9. 속도: 명령어 1번, 파이썬으로 QR 1,000개
t, rc, out = run(["segno", URL, "-o", "speed.png", "--scale", "10"]); R["cli_once"] = t
os.makedirs(os.path.join(W, "many"), exist_ok=True)
t0 = time.perf_counter()
for i in range(1000):
    segno.make(f"https://example.com/table/{i+1}").save(os.path.join(W, "many", f"t{i+1:04d}.png"), scale=8)
R["many1000"] = round(time.perf_counter() - t0, 2)
ok = sum(decode(os.path.join(W, "many", f"t{i:04d}.png")) == [f"https://example.com/table/{i}"] for i in (1, 250, 500, 750, 1000))
R["many_check"] = ok

# 10. 터미널 출력
t, rc, out = run(["segno", "https://example.com", "--compact"])
R["terminal_lines"] = len(out.splitlines())

json.dump(R, open(os.path.join(HERE, "results.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1))
