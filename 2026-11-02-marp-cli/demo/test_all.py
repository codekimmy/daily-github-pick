"""marp-cli 시연: 같은 메모(trip.md)를 PDF·PPTX·HTML·PNG로, 테마 3종, 수정 가능한 PPTX, 20장 발표 → out/, results.json
사용: CHROME_PATH=/usr/bin/google-chrome python3 test_all.py"""
import json, os, statistics, subprocess, time
from pptx import Presentation
import pypdf
os.chdir(os.path.dirname(os.path.abspath(__file__))); os.makedirs("out", exist_ok=True)

def run(args, n=3):
    ts = []
    for _ in range(n):
        s = time.time(); subprocess.run(["marp", "--no-stdin", *args], check=True, capture_output=True); ts.append(time.time() - s)
    return round(statistics.median(ts), 2)

R = {"version": subprocess.check_output(["marp", "--version"], text=True).strip(), "formats": {}, "themes": {}}
src = open("trip.md", encoding="utf-8").read()
R["md_lines"] = len(src.strip().splitlines()); R["md_chars"] = len(src)
for f in ["pdf", "pptx", "html"]:
    R["formats"][f] = {"sec": run(["trip.md", "-o", f"out/trip.{f}"]), "kb": round(os.path.getsize(f"out/trip.{f}") / 1024, 1)}
R["formats"]["png"] = {"sec": run(["--images", "png", "trip.md", "-o", "out/trip.png"]), "files": 4}
R["formats"]["pdf"]["pages"] = len(pypdf.PdfReader("out/trip.pdf").pages)
for th in ["default", "gaia", "uncover"]:
    open(f"_{th}.md", "w", encoding="utf-8").write(src.replace("theme: default", f"theme: {th}"))
    R["themes"][th] = run(["--images", "png", f"_{th}.md", "-o", f"out/theme-{th}.png"], 1)
    os.remove(f"_{th}.md")
textboxes = lambda p: sum(1 for s in Presentation(p).slides for sh in s.shapes if sh.has_text_frame and sh.text_frame.text.strip())
R["pptx_plain_textboxes"] = textboxes("out/trip.pptx")
R["pptx_editable"] = {"sec": run(["--pptx", "--pptx-editable", "trip.md", "-o", "out/trip-editable.pptx"], 1), "textboxes": textboxes("out/trip-editable.pptx")}
R["big"] = {"slides": 20, "pdf_sec": run(["big.md", "-o", "out/big.pdf"]), "pptx_sec": run(["big.md", "--pptx", "-o", "out/big.pptx"])}
json.dump(R, open("results.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1))
