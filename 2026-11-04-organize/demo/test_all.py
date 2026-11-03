"""시연 측정: 미리보기(sim) → 실제 정리(run) 3회 → 다시 실행 → 새 파일 → 이름 충돌 → 파일 1,000개
결과는 results.json, 정리 전/후 목록은 out/ 에 저장. 사용: python3 test_all.py"""
import json, os, shutil, statistics, subprocess, sys, time
here = os.path.dirname(os.path.abspath(__file__)); CFG = f"{here}/config.yaml"
WORK = "/tmp/claude-0/orgtest"; DL = f"{WORK}/다운로드"; OUT = f"{here}/out"; os.makedirs(OUT, exist_ok=True)

def org(cmd, wd=DL, cfg=CFG):
    t = time.perf_counter(); p = subprocess.run(["organize", cmd, cfg, "-W", wd, "-F", "JSONL"], capture_output=True, text=True)
    sec = time.perf_counter() - t; ev = [json.loads(l) for l in p.stdout.splitlines() if l.startswith("{")]
    return sec, ev
def tree(d): return sorted(os.path.relpath(os.path.join(r, f), d) for r, _, fs in os.walk(d) for f in fs)
def fresh(): subprocess.run([sys.executable, f"{here}/make_assets.py", DL], check=True, capture_output=True)
def moves(ev): return [e for e in ev if e.get("type") == "MSG" and e.get("sender") == "move"]

R = {"version": subprocess.run(["organize", "--version"], capture_output=True, text=True).stdout.strip()}
fresh(); before = tree(DL); R["before_count"] = len(before)
sec, ev = org("sim"); R["sim"] = {"sec": round(sec, 2), "files_after_sim": len(tree(DL)), "unchanged": tree(DL) == before}
runs = []
for i in range(3):
    fresh(); sec, ev = org("run"); runs.append(sec)
after = tree(DL); mv = moves(ev)
R["run"] = {"secs": [round(s, 2) for s in runs], "median": round(statistics.median(runs), 2), "moved": len(mv),
            "left_in_root": [f for f in after if "/" not in f], "by_rule": {}}
for e in mv: R["run"]["by_rule"][e["rule_name"]] = R["run"]["by_rule"].get(e["rule_name"], 0) + 1
R["moves"] = [{"file": e["path"], "to": os.path.relpath(e["msg"].split("Move to ", 1)[1], DL), "rule": e["rule_nr"]} for e in mv]
json.dump({"before": before, "after": after}, open(f"{OUT}/trees.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
# 다시 실행: 이미 정리됐으면 0개
sec, ev = org("run"); R["rerun"] = {"sec": round(sec, 2), "moved": len(moves(ev))}
# 새 파일 2개(사진 1, 영수증 PDF 1)를 넣고 다시 실행
shutil.copy(f"{DL}/사진/2026-07/IMG_2035.jpg", f"{DL}/IMG_3001.jpg"); os.utime(f"{DL}/IMG_3001.jpg", (time.time(), time.time()))
shutil.copy(f"{DL}/영수증/2026/scan_0412.pdf", f"{DL}/새영수증.pdf")
sec, ev = org("run"); R["newfiles"] = {"sec": round(sec, 2), "moves": [os.path.relpath(e["msg"].split("Move to ", 1)[1], DL) for e in moves(ev)]}
# 이름 충돌: 이미 문서/메모.txt 가 있는데 내용이 다른 메모.txt 가 또 들어옴
open(f"{DL}/메모.txt", "w").write("다른 메모\n")
sec, ev = org("run"); R["conflict"] = {"moves": [os.path.relpath(e["msg"].split("Move to ", 1)[1], DL) for e in moves(ev)],
                                       "files": sorted(f for f in os.listdir(f"{DL}/문서") if f.startswith("메모"))}
# 파일 1,000개 (가짜 사진·문서·음악을 섞어서)
big = f"{WORK}/big"; shutil.rmtree(big, ignore_errors=True); os.makedirs(big)
ext = ["jpg", "png", "pdf", "docx", "mp3", "mp4", "zip", "txt"]
for i in range(1000): open(f"{big}/file_{i:04d}.{ext[i % 8]}", "wb").write(os.urandom(200) + str(i).encode())
cfg2 = f"{WORK}/big.yaml"; shutil.copy(CFG, cfg2)
sec, ev = org("run", big, cfg2); R["big"] = {"files": 1000, "sec": round(sec, 2), "moved": len(moves(ev)), "left": len([f for f in os.listdir(big) if os.path.isfile(f"{big}/{f}")])}
json.dump(R, open(f"{here}/results.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in R.items() if k != "moves"}, ensure_ascii=False, indent=1))
# 글자 대신 그림으로만 된 '스캔 영수증' PDF (사진처럼 찍힌 PDF 흉내) → 영수증 규칙에 걸리는지
from PIL import Image, ImageDraw, ImageFont
sc = f"{WORK}/scan"; shutil.rmtree(sc, ignore_errors=True); os.makedirs(sc)
im = Image.new("RGB", (600, 300), "white"); ImageDraw.Draw(im).text((40, 40), "영수증  합계 9,000원", fill="black", font=ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", 40))
im.save(f"{sc}/스캔영수증.pdf"); shutil.copy(f"{DL}/영수증/2026/scan_0412.pdf", f"{sc}/글자영수증.pdf")
sec, ev = org("run", sc); R["scan_pdf"] = {e["path"]: os.path.relpath(e["msg"].split("Move to ", 1)[1], sc) for e in moves(ev)}
json.dump(R, open(f"{here}/results.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("scan_pdf", R["scan_pdf"])
