"""jrnl 시연 측정 (2026-11-25, 클라우드 리눅스 · CPU 2개). 결과 → demo/results.json
일기 내용·암호는 모두 시연용 가상 자료. 작업 폴더는 /tmp/jrnl-bench (HOME을 바꿔 실제 설정과 섞이지 않게 함)
사용: python3 demo/bench.py"""
import json, os, random, re, shutil, subprocess, sys, time, datetime as dt
import pexpect

HERE = os.path.dirname(os.path.abspath(__file__))
W = "/tmp/jrnl-bench"
R = {}


def env(home):
    e = dict(os.environ); e["HOME"] = home; e["COLUMNS"] = "100"; e.pop("VISUAL", None); e.pop("EDITOR", None)
    return e


def run(args, home, inp=None):
    t = time.time()
    p = subprocess.run(["jrnl"] + args, env=env(home), input=inp, capture_output=True, text=True)
    return round(time.time() - t, 3), p.returncode, p.stdout, p.stderr


def fresh(name):
    h = os.path.join(W, name)
    if os.path.isdir(h): shutil.rmtree(h)
    os.makedirs(h); return h


def journal(home):
    return open(os.path.join(home, ".local/share/jrnl/journal.txt"), encoding="utf-8", errors="replace").read()


if os.path.isdir(W): shutil.rmtree(W)
os.makedirs(W)

# ① 설치 (빈 가상 환경): 시간 · 함께 설치되는 프로그램 · 크기
v = os.path.join(W, "venv"); subprocess.run([sys.executable, "-m", "venv", v], check=True)
t = time.time(); p = subprocess.run([v + "/bin/pip", "install", "-q", "--no-cache-dir", "jrnl==4.6"], capture_output=True, text=True)
sec = round(time.time() - t, 2)
fr = subprocess.run([v + "/bin/pip", "freeze"], capture_output=True, text=True).stdout.split()
sp = subprocess.run(["bash", "-c", f"du -sb {v}/lib/python3*/site-packages | cut -f1"], capture_output=True, text=True).stdout
base = subprocess.run(["bash", "-c", f"python3 -m venv {W}/v0 && du -sb {W}/v0/lib/python3*/site-packages | cut -f1"], capture_output=True, text=True).stdout
R["install"] = {"sec": sec, "rc": p.returncode, "pkgs": len(fr), "others": len(fr) - 1, "list": [x.split("==")[0] for x in fr],
                "mb": round((int(sp) - int(base)) / 1e6, 1)}
R["version"] = subprocess.run([v + "/bin/jrnl", "--version"], capture_output=True, text=True).stdout.split("\n")[0]

# ② 처음 실행: 질문 3개(일기 파일 위치 · 암호 · 색) → 설정 파일과 일기 파일이 생김
h = fresh("first")
s, rc, out, err = run(["첫 일기입니다. 오늘 jrnl을 설치했다. @설치"], h, "\nn\nn\n")
q = re.findall(r"(Path to your journal file|Do you want to encrypt|Do you want jrnl to use colors)", err)
R["first"] = {"sec": s, "rc": rc, "questions": q, "config": os.path.exists(h + "/.config/jrnl/jrnl.yaml"),
              "journal": os.path.exists(h + "/.local/share/jrnl/journal.txt")}

# ③ 한 줄로 쓰기 · 날짜 말 · 태그 · 별표 (설정: 24시간 표시)
cfgp = h + "/.config/jrnl/jrnl.yaml"
c = open(cfgp).read().replace("timeformat: '%F %r'", "timeformat: '%Y-%m-%d %H:%M'"); open(cfgp, "w").write(c)
writes = [
    ("yesterday: 점심은 김치찌개였다. @점심 #가계부 9000원", "yesterday"),
    ("2026-11-20 7pm: *친구 생일 파티. @모임 케이크를 나눠 먹었다", "2026-11-20 7pm"),
    ("last monday 3pm: 팀 회의 메모. @회의 다음 주 금요일까지 보고서", "last monday"),
    ("어제: 한글로 날짜를 쓰면?", "어제 (한글)"),
    ("오늘 저녁 산책 30분. @운동", "날짜 없음 (지금)"),
]
R["write"] = []
for txt, kind in writes:
    s, rc, out, err = run([txt], h)
    R["write"].append({"kind": kind, "sec": s, "rc": rc})
raw = journal(h)
heads = re.findall(r"^\[(\d{4}-\d\d-\d\d \d\d:\d\d)\] (.*)$", raw, re.M)
R["entries"] = [{"date": d, "title": tt} for d, tt in heads]
R["write_avg"] = round(sum(w["sec"] for w in R["write"]) / len(R["write"]), 3)

# ④ 찾아보기
def found(o): m = re.search(r"(\d+) entr", o); return int(m.group(1)) if m else 0
s, rc, out, err = run(["@점심"], h); R["find_tag"] = {"sec": s, "n": found(err), "out": out.strip()}
s, rc, out, err = run(["-starred", "--short"], h); R["find_star"] = {"sec": s, "n": found(err), "out": out.strip()}
s, rc, out, err = run(["-contains", "보고서", "--short"], h); R["find_text"] = {"sec": s, "n": found(err), "out": out.strip()}
s, rc, out, err = run(["--tags"], h); R["tags"] = {"sec": s, "out": out.strip()}
s, rc, out, err = run(["-from", "2026-11-20", "-to", "2026-11-24", "--short"], h); R["find_range"] = {"sec": s, "n": found(err), "out": out.strip()}
s, rc, out, err = run(["-n", "2"], h); R["last2"] = out.strip()

# ⑤ 내보내기 (마크다운 · JSON · 글자 파일)
R["export"] = {}
for f, ext in (("md", "md"), ("json", "json"), ("txt", "txt")):
    fn = os.path.join(h, "일기." + ext)
    s, rc, out, err = run(["--format", f, "--file", fn], h)
    R["export"][f] = {"sec": s, "rc": rc, "bytes": os.path.getsize(fn) if os.path.exists(fn) else 0}
R["export_md_head"] = open(os.path.join(h, "일기.md"), encoding="utf-8").read()[:400]

# ⑥ 한글 화면 모양: --format fancy · --tags 칸 맞춤
s, rc, out, err = run(["-n", "1", "--format", "fancy"], h); R["fancy"] = out
s, rc, out, err = run(["--format", "calendar"], h); R["calendar"] = {"sec": s, "rc": rc, "lines": len(out.splitlines())}

# ⑦ 잠그기(암호화): 암호 2번 + '열쇠고리에 저장?' → 아니오
before = journal(h)
t = time.time()
ch = pexpect.spawn("jrnl --encrypt", env=env(h), encoding="utf-8", timeout=30)
ch.expect("assword"); ch.sendline("가상암호-2026"); ch.expect("assword"); ch.sendline("가상암호-2026")
ch.expect(r"\[Y/n\]"); ch.sendline("n"); ch.expect(pexpect.EOF); ch.close()
enc_sec = round(time.time() - t, 2)
rawb = open(h + "/.local/share/jrnl/journal.txt", "rb").read()
R["encrypt"] = {"sec": enc_sec, "rc": ch.exitstatus, "plain_bytes": len(before.encode()), "enc_bytes": len(rawb),
                "has_korean": "김치찌개".encode() in rawb, "head": rawb[:24].decode("latin1")}
def unlock(pw):   # 암호를 물을 때마다 pw를 넣음. 틀리면 3번까지 다시 묻고 끝남
    ch = pexpect.spawn("jrnl -n 1 --short", env=env(h), encoding="utf-8", timeout=30); n = 0; txt = ""
    while True:
        i = ch.expect(["Password: ", pexpect.EOF]); txt += ch.before
        if i == 1: break
        n += 1; ch.sendline(pw)
    ch.close(); return ch.exitstatus, n, re.sub(r"\x1b\[[0-9;]*m", "", txt)
rc, n, txt = unlock("틀린암호"); R["wrong_pw"] = {"rc": rc, "tries": n, "again": "Wrong password, try again" in txt, "too_many": "Too many attempts with wrong password" in txt}
rc, n, txt = unlock("가상암호-2026"); R["right_pw"] = {"rc": rc, "tries": n, "ok": "산책" in txt, "out": txt.strip()[-60:]}

# ⑧ 일기장 여러 개 (업무 일지)
h2 = fresh("multi"); run(["첫 일기"], h2, "\nn\nn\n")
cfg2 = h2 + "/.config/jrnl/jrnl.yaml"
c = open(cfg2).read().replace("journals:\n  default:", f"journals:\n  업무:\n    journal: {h2}/업무일지.txt\n  default:")
open(cfg2, "w").write(c)
s, rc, out, err = run(["업무", "거래처 미팅 2시. @미팅"], h2)
s2, rc2, out2, err2 = run(["--list"], h2)
R["multi"] = {"rc": rc, "file": os.path.exists(h2 + "/업무일지.txt"), "list": out2.strip()}

# ⑨ 10년치 일기 3,650개 (가상) → 찾기 시간
random.seed(25)
h3 = fresh("big"); run(["첫 일기"], h3, "\nn\nn\n")
foods = ["김치찌개", "된장찌개", "비빔밥", "라면", "샐러드", "칼국수", "떡볶이", "김밥"]
acts = ["산책 30분", "책 20쪽", "영어 단어 15개", "청소", "장보기", "영화 한 편"]
lines = []; d0 = dt.datetime(2016, 11, 26, 21, 0)
for i in range(3650):
    d = d0 + dt.timedelta(days=i)
    tg = random.choice(["@운동", "@독서", "@가계부", "@모임", "@회의", ""])
    star = " *" if random.random() < .03 else ""
    lines.append(f"[{d:%Y-%m-%d %I:%M:%S %p}] 점심은 {random.choice(foods)}.{star}\n오늘은 {random.choice(acts)}. {tg}\n")
open(h3 + "/.local/share/jrnl/journal.txt", "w", encoding="utf-8").write("\n".join(lines))
big = {}
for k, a in (("contains", ["-contains", "떡볶이", "--short"]), ("tag", ["@운동", "--short"]), ("tags", ["--tags"]),
             ("today_in_history", ["-today-in-history", "--short"]), ("year", ["-year", "2020", "--short"]), ("starred", ["-starred", "--short"])):
    ts = [run(a, h3) for _ in range(3)]
    big[k] = {"sec": round(min(x[0] for x in ts), 2), "n": found(ts[0][3])}
s, rc, out, err = run(["--format", "md", "--file", h3 + "/10년.md"], h3)
big["export_md"] = {"sec": s, "bytes": os.path.getsize(h3 + "/10년.md")}
big["file_bytes"] = os.path.getsize(h3 + "/.local/share/jrnl/journal.txt")
s, rc, out, err = run(["오늘의 일기 한 줄. @운동"], h3); big["write_sec"] = s
R["big"] = big

json.dump(R, open(os.path.join(HERE, "results.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in R.items() if k not in ("fancy", "export_md_head", "last2")}, ensure_ascii=False, indent=1))
