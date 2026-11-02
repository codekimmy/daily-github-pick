"""amzqr 시연: 여러 설정으로 QR을 만들고(3번 실행, 가운데 값), 두 가지 QR 판독기로 읽히는지 확인한다.
판독기: OpenCV QRCodeDetector, zxing-cpp (휴대폰 카메라 앱이 아니라 컴퓨터 판독 프로그램)
읽기 시험은 원본 크기 + 300px로 줄인 그림(작게 인쇄·화면 캡처한 경우 흉내) 두 가지.
버티기 시험: 200·150·120px × (그대로, 살짝 흐리게) 6가지 중 zxing이 읽은 수
결과: out/*.png|gif, results.json"""
import json, os, shutil, statistics, subprocess, time
import cv2, numpy as np, zxingcpp
from PIL import Image, ImageFilter, ImageSequence

HERE = os.path.dirname(os.path.abspath(__file__))
A, O = f"{HERE}/assets", f"{HERE}/out"
AMZQR = shutil.which("amzqr") or "/home/claude/qrenv/bin/amzqr"
URL = "https://github.com/codekimmy/daily-github-pick"
WIFI = "WIFI:T:WPA;S:KongKong_Guest;P:coffee1234;;"   # 가상의 와이파이 정보


def decode(im):
    """그림 한 장 → (opencv 결과, zxing 결과)"""
    rgb = np.array(im.convert("RGB"))
    try:
        cv = cv2.QRCodeDetector().detectAndDecode(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR))[0] or None
    except Exception:
        cv = None
    zx = zxingcpp.read_barcodes(rgb)
    return cv, (zx[0].text if zx else None)


def check(path, want):
    im = Image.open(path)
    frames = [f.copy() for f in ImageSequence.Iterator(im)]
    res = {"size": list(im.size), "frames": len(frames), "kb": round(os.path.getsize(path) / 1024)}
    ok = {"cv_full": 0, "zx_full": 0, "cv_300": 0, "zx_300": 0}
    for f in frames:
        f = f.convert("RGB")
        a, b = decode(f)
        c, d = decode(f.resize((300, 300), Image.LANCZOS))
        ok["cv_full"] += a == want; ok["zx_full"] += b == want
        ok["cv_300"] += c == want; ok["zx_300"] += d == want
    res.update(ok)
    # 버티기 시험: 첫 장을 200·150·120px로 줄이고, 각각 그대로/살짝 흐리게(멀리서 찍은 듯) → zxing으로 6번 중 몇 번 읽히나
    f0 = frames[0].convert("RGB"); st = []
    for s in (200, 150, 120):
        for blur in (0, 1.0):
            x = f0.resize((s, s), Image.LANCZOS)
            if blur: x = x.filter(ImageFilter.GaussianBlur(blur))
            st.append(decode(x)[1] == want)
    res["stress"] = sum(st); res["stress_detail"] = "".join("O" if v else "." for v in st)
    return res


def run(name, words, args, want=None, reps=3):
    times, err = [], None
    for _ in range(reps):
        t = time.perf_counter()
        p = subprocess.run([AMZQR, words, *args, "-d", O, "-n", name], capture_output=True, text=True)
        times.append(time.perf_counter() - t)
        if p.returncode:
            err = (p.stderr or p.stdout).strip().splitlines()[-1]
            break
    r = {"name": name, "cmd": "amzqr " + " ".join([f'"{words}"' if " " in words or ";" in words else words] + args + ["-n", name]),
         "sec": round(statistics.median(times), 2)}
    r["cmd"] = r["cmd"].replace(A + "/", "")
    if err:
        r["error"] = err
    else:
        r.update(check(f"{O}/{name}", want or words))
    print(json.dumps(r, ensure_ascii=False), flush=True)
    return r


os.makedirs(O, exist_ok=True)
R = {"version": subprocess.run([AMZQR, "-V"], capture_output=True, text=True).stdout.strip(), "url": URL, "tests": []}
T = R["tests"].append
T(run("plain.png", URL, []))                                                      # 1. 사진 없는 기본 QR
T(run("cafe_bw.png", URL, ["-p", f"{A}/cafe.png"]))                               # 2. 사진 + 흑백
T(run("cafe_color.png", URL, ["-p", f"{A}/cafe.png", "-c"]))                      # 3. 사진 + 컬러
T(run("sunset_color.png", URL, ["-p", f"{A}/sunset.png", "-c"]))                  # 4. 노을 + 컬러
T(run("wave.gif", URL, ["-p", f"{A}/wave.gif", "-c"]))                            # 5. 움직이는 QR
T(run("night_color.png", URL, ["-p", f"{A}/night.png", "-c"]))                    # 6. 아주 어두운 사진
T(run("night_bright.png", URL, ["-p", f"{A}/night.png", "-c", "-bri", "2.5", "-con", "1.2"]))  # 7. 밝기 올리기
T(run("cafe_v1.png", "hi", ["-p", f"{A}/cafe.png", "-c", "-v", "1"]))            # 8. 짧은 글 + 가장 작은 판
T(run("cafe_v10.png", URL, ["-p", f"{A}/cafe.png", "-c", "-v", "10"]))           # 9. 큰 판(촘촘)
T(run("cafe_L.png", URL, ["-p", f"{A}/cafe.png", "-c", "-l", "L"]))              # 10. 오류 복구 낮음
T(run("wifi.png", WIFI, ["-p", f"{A}/cafe.png", "-c"]))                           # 11. 와이파이 QR
T(run("wide_color.png", URL, ["-p", f"{A}/wide.png", "-c"]))                   # 12. 가로로 긴 그림
T(run("korean.png", "안녕하세요", [], reps=1))                                       # 13. 한글 → 실패 예상
json.dump(R, open(f"{HERE}/results.json", "w"), ensure_ascii=False, indent=1)
print("saved results.json")
