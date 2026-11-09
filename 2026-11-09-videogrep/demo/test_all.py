"""시연 측정: videogrep 명령을 실제로 실행해 시간·장면 수·결과 길이를 results.json에 기록한다.
사용: python3 test_all.py  (work/ 안에 make_videos.py로 만든 가상 영상이 있어야 함)"""
import json, os, re, shutil, statistics, subprocess, time

H = os.path.dirname(os.path.abspath(__file__)); W = f"{H}/work"; O = f"{W}/out"; os.makedirs(O, exist_ok=True)
env = dict(os.environ, PYTHONWARNINGS="ignore")
def run(args, n=1):
    ts, p = [], None
    for _ in range(n):
        t = time.time(); p = subprocess.run(["videogrep", *args], cwd=W, capture_output=True, text=True, env=env); ts.append(time.time() - t)
    return round(statistics.median(ts), 2), p
dur = lambda f: round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f])), 2)
def demo_lines(p): return [l for l in p.stdout.splitlines() if re.match(r"^\S+\.mp4 [\d.]+ [\d.]+ ", l)]
def clips(p): return [dict(zip(["file", "start", "end", "text"], (l.split(" ", 3)[0], float(l.split(" ", 3)[1]), float(l.split(" ", 3)[2]), l.split(" ", 3)[3]))) for l in demo_lines(p)]
R = {"version": subprocess.check_output(["videogrep", "--version"], text=True, env=env).strip(), "src": {}, "cases": {}}
for v in ["요리교실", "회의"]:
    R["src"][v] = {"sec": dur(f"{W}/{v}.mp4"), "lines": open(f"{W}/{v}.srt", encoding="utf-8").read().count("-->")}

def case(key, label, search_args, out=None, inputs=("요리교실.mp4",), extra=()):
    s1, p1 = run(["-i", *inputs, *search_args, "--demo", *extra], 3)  # 찾기만 (영상 안 만듦)
    c = {"label": label, "cmd": " ".join(["videogrep", "-i", *inputs, *search_args, *extra] + (["-o", out] if out else [])),
         "demo_sec": s1, "clips": clips(p1), "n": len(clips(p1))}
    if out:
        s2, p2 = run(["-i", *inputs, *search_args, *extra, "-o", f"out/{out}"])
        c["make_sec"] = s2; c["ok"] = os.path.exists(f"{O}/{out}")
        if c["ok"] and out.endswith((".mp4", ".mp3")): c["out_sec"] = dur(f"{O}/{out}")
        if not c["ok"]: c["err"] = (p2.stderr or p2.stdout).strip().splitlines()[-1:]
    R["cases"][key] = c; print(key, c.get("n"), c.get("make_sec"), c.get("out_sec"), flush=True)

case("salt", "요리 강의에서 '소금' 나온 장면만", ["-s", "소금"], "소금모음.mp4")
case("um", "말버릇 '음,' 장면만", ["-s", "^음,"], "음모음.mp4")
case("decide", "회의에서 '결정' 장면만", ["-s", "결정"], "결정모음.mp4", ("회의.mp4",))
case("regex", "'예산' 또는 '만 원' (여러 단어 한 번에)", ["-s", "예산|만 원"], "돈이야기.mp4", ("회의.mp4",))
case("both", "영상 2개에서 '마지막' 한 번에", ["-s", "마지막"], "마지막_두영상.mp4", ("요리교실.mp4", "회의.mp4"))
case("pad", "앞뒤 0.5초 여유 (--padding 0.5)", ["-s", "소금"], "소금_여유.mp4", extra=("-p", "0.5"))
case("max", "최대 2장면만 (--max-clips 2)", ["-s", "소금"], "소금_2개.mp4", extra=("-m", "2"))
case("vtt", "자막 파일도 같이 (--export-vtt)", ["-s", "결정"], "결정_자막.mp4", ("회의.mp4",), ("--export-vtt",))
case("xml", "편집 프로그램용 목록 (.xml)", ["-s", "결정"], "결정_편집용.xml", ("회의.mp4",))
case("m3u", "재생 목록 (.m3u)", ["-s", "결정"], "결정_재생목록.m3u", ("회의.mp4",))
R["cases"]["vtt"]["vtt_file"] = os.path.exists(f"{O}/결정_자막.vtt")

# 장면을 파일 하나씩 따로 저장
shutil.rmtree(f"{O}/clips", ignore_errors=True); os.makedirs(f"{O}/clips")
t = time.time(); p = subprocess.run(["videogrep", "-i", "../../요리교실.mp4", "-s", "소금", "--export-clips", "-o", "소금.mp4"], cwd=f"{O}/clips", capture_output=True, text=True, env=env)
R["cases"]["export"] = {"label": "장면마다 파일 따로 (--export-clips)", "make_sec": round(time.time() - t, 2), "files": sorted(os.listdir(f"{O}/clips"))}

# 자주 나온 낱말 순위 (--ngrams)
s, p = run(["-i", "요리교실.mp4", "--ngrams", "1"], 3)
R["cases"]["ngrams"] = {"label": "많이 나온 낱말 순위 (--ngrams 1)", "demo_sec": s, "top": [l.strip() for l in p.stdout.strip().splitlines()[:12]]}
s, p = run(["-i", "회의.mp4", "--ngrams", "2"], 1)
R["cases"]["ngrams2"] = {"label": "두 낱말 묶음 순위 (--ngrams 2)", "top": [l.strip() for l in p.stdout.strip().splitlines()[:8]]}

# 안 되는 것
s, p = run(["-i", "요리교실.mp4", "-s", "소금", "-st", "fragment", "--demo"])
R["cases"]["fragment"] = {"label": "낱말 단위 자르기 (-st fragment)", "out": (p.stdout + p.stderr).strip().splitlines()[-2:], "n": len(demo_lines(p))}
shutil.copy(f"{W}/요리교실.mp4", f"{O}/자막없음.mp4")
s, p = run(["-i", "out/자막없음.mp4", "-s", "소금", "--demo"])
R["cases"]["nosub"] = {"label": "자막 파일이 없는 영상", "out": (p.stdout + p.stderr).strip().splitlines()[-2:], "n": len(demo_lines(p))}
s, p = run(["-i", "out/자막없음.mp4", "--transcribe"])
R["cases"]["transcribe"] = {"label": "자동 받아쓰기 (--transcribe)", "out": (p.stdout + p.stderr).strip().splitlines()[-2:]}
s, p = run(["-i", "요리교실.mp4", "-s", "된장찌개 끓이는 법", "--demo"])
R["cases"]["nomatch"] = {"label": "자막에 없는 말로 찾기", "n": len(demo_lines(p)), "out": (p.stdout + p.stderr).strip().splitlines()[-1:]}

# 긴 영상: 요리 강의를 12번 이어 붙인 30분짜리 영상(자막 384줄)
lv = f"{W}/긴강의.mp4"
if not os.path.exists(lv):
    open(f"{W}/_loop.txt", "w").write("".join(f"file '요리교실.mp4'\n" for _ in range(12)))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", f"{W}/_loop.txt", "-c", "copy", lv], check=True)
    src = open(f"{W}/요리교실.srt", encoding="utf-8").read().strip().split("\n\n"); L = R["src"]["요리교실"]["sec"]; out, k = [], 0
    def sh(t, d): h, m, r = t.split(":"); s2, ms = r.split(","); v = int(h) * 3600 + int(m) * 60 + int(s2) + int(ms) / 1000 + d; ms2 = int(round(v * 1000)); return f"{ms2 // 3600000:02d}:{ms2 // 60000 % 60:02d}:{ms2 // 1000 % 60:02d},{ms2 % 1000:03d}"
    for r in range(12):
        for b in src:
            n, tm, tx = b.split("\n", 2); a, z = tm.split(" --> "); k += 1; out.append(f"{k}\n{sh(a, r * L)} --> {sh(z, r * L)}\n{tx}\n")
    open(f"{W}/긴강의.srt", "w", encoding="utf-8").write("\n".join(out))
R["src"]["긴강의"] = {"sec": dur(lv), "lines": open(f"{W}/긴강의.srt", encoding="utf-8").read().count("-->")}
case("long", "30분 영상에서 '소금' (자막 384줄)", ["-s", "소금"], "긴강의_소금.mp4", ("긴강의.mp4",))

R["install"] = {}
json.dump(R, open(f"{H}/results.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("saved results.json")
