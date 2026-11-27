"""pandoc 시연 측정 (2026-11-27 실행, 클라우드 리눅스 · CPU 4개). 결과 → demo/results.json
문서는 모두 시연용 가상 자료(demo/sample/). 작업 폴더 /tmp/pandoc-bench
사용: python3 demo/bench.py   (pandoc 3.14 리눅스 파일을 GitHub 릴리스에서 받아 씀 · typst 는 PDF 시연용, LibreOffice 는 결과 그림 확인용)"""
import json, os, re, shutil, subprocess, time, zipfile, glob
from docx import Document
from pptx import Presentation

HERE = os.path.dirname(os.path.abspath(__file__))
SM = os.path.join(HERE, "sample")
W = "/tmp/pandoc-bench"
VER = "3.14"
R = {}
if os.path.isdir(W): shutil.rmtree(W)
os.makedirs(W)


def sh(cmd, cwd=W):
    t = time.time(); p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, shell=isinstance(cmd, str))
    return round(time.time() - t, 3), p.returncode, p.stdout, p.stderr


def best(cmd, n=3):
    r = [sh(cmd) for _ in range(n)]; return min(x[0] for x in r), r[0]


# ① 설치: GitHub 릴리스 파일 받기 → 풀기 (Windows 는 .msi 또는 winget, 같은 버전)
url = f"https://github.com/jgm/pandoc/releases/download/{VER}/pandoc-{VER}-linux-amd64.tar.gz"
s, rc, o, e = sh(["curl", "-sL", "-o", "pd.tgz", url])
s2, rc2, *_ = sh(["tar", "xzf", "pd.tgz"])
PD = glob.glob(W + "/pandoc-*/bin/pandoc")[0]
R["install"] = {"download_sec": s, "extract_sec": s2, "tgz_mb": round(os.path.getsize(W + "/pd.tgz") / 1e6, 1),
                "bin_mb": round(os.path.getsize(PD) / 1e6, 1), "others": 0}
R["version"] = sh([PD, "--version"])[2].splitlines()[0]
ins = sh([PD, "--list-input-formats"])[2].split(); outs = sh([PD, "--list-output-formats"])[2].split()
R["formats"] = {"in": len(ins), "out": len(outs), "hwp_in": any("hwp" in x for x in ins), "hwp_out": any("hwp" in x for x in outs),
                "docx": "docx" in ins and "docx" in outs, "pptx_in": "pptx" in ins, "pptx_out": "pptx" in outs, "epub": "epub3" in outs,
                "xlsx_in": "xlsx" in ins}
for f in os.listdir(SM): shutil.copy(os.path.join(SM, f), W)

# ② 메모(마크다운) → 워드
t, (_, rc, o, e) = best([PD, "회의록.md", "-o", "회의록.docx"])
d = Document(W + "/회의록.docx")
heads = [p.text for p in d.paragraphs if p.style.name.startswith("Heading")]
R["md2docx"] = {"sec": t, "rc": rc, "bytes": os.path.getsize(W + "/회의록.docx"), "headings": heads, "tables": len(d.tables),
                "table_rows": len(d.tables[0].rows) if d.tables else 0, "title": d.paragraphs[0].text,
                "bold": sum(1 for p in d.paragraphs for r in p.runs if r.bold), "list_items": sum(1 for p in d.paragraphs if "List" in p.style.name or p.style.name.startswith("Compact")),
                "md_bytes": os.path.getsize(W + "/회의록.md"), "korean": "참석" in "\n".join(p.text for p in d.paragraphs)}
# 결과 그림 확인용: LibreOffice 로 PDF → 첫 쪽 PNG
sh(["soffice", "--headless", "--convert-to", "pdf", "회의록.docx"]); sh(["pdftoppm", "-png", "-r", "60", "-f", "1", "-l", "1", "회의록.pdf", "docx-page"])
R["md2docx"]["pages_lo"] = int(re.search(r"Pages:\s+(\d+)", sh(["pdfinfo", "회의록.pdf"])[2]).group(1))

# ③ 워드 → 마크다운 (되돌리기): 표 · 제목 유지?
t, (_, rc, o, e) = best([PD, "회의록.docx", "-t", "gfm", "-o", "되돌림.md"])
back = open(W + "/되돌림.md", encoding="utf-8").read()
R["docx2md"] = {"sec": t, "rc": rc, "table_lines": sum(1 for l in back.splitlines() if l.startswith("|")), "h1": len(re.findall(r"^# ", back, re.M)),
                "has_bold": "**" in back, "head": back[:300]}

# ④ 마크다운 → 파워포인트
t, (_, rc, o, e) = best([PD, "회의록.md", "-o", "회의록.pptx"])
pr = Presentation(W + "/회의록.pptx")
titles = []
for sl in pr.slides:
    tt = [sh_.text_frame.text for sh_ in sl.shapes if sh_.has_text_frame and sh_.text_frame.text.strip()]
    titles.append(tt[0][:30] if tt else "")
R["md2pptx"] = {"sec": t, "rc": rc, "slides": len(pr.slides), "titles": titles, "bytes": os.path.getsize(W + "/회의록.pptx")}
sh(["soffice", "--headless", "--convert-to", "pdf", "--outdir", "pp", "회의록.pptx"]); sh(["pdftoppm", "-png", "-r", "40", "pp/회의록.pdf", "pptx-slide"])

# ⑤ 웹페이지(HTML) · 전자책(EPUB)
t, (_, rc, o, e) = best([PD, "회의록.md", "-s", "--toc", "-o", "회의록.html"])
R["md2html"] = {"sec": t, "rc": rc, "bytes": os.path.getsize(W + "/회의록.html")}
t, (_, rc, o, e) = best([PD, "회의록.md", "-o", "회의록.epub"])
z = zipfile.ZipFile(W + "/회의록.epub")
R["md2epub"] = {"sec": t, "rc": rc, "bytes": os.path.getsize(W + "/회의록.epub"), "chapters": len([n for n in z.namelist() if re.search(r"ch\d+\.xhtml$", n)]), "warn": e.strip()[:200]}
# 인터넷 기사(HTML) → 워드
t, (_, rc, o, e) = best([PD, "기사.html", "-o", "기사.docx"])
d2 = Document(W + "/기사.docx")
R["html2docx"] = {"sec": t, "rc": rc, "headings": len([p for p in d2.paragraphs if p.style.name.startswith("Heading")]), "tables": len(d2.tables), "bytes": os.path.getsize(W + "/기사.docx")}

# ⑥ PDF: 기본은 LaTeX(pdflatex) 가 필요 → 오류 문구 · typst 로는 됨 (한글 글꼴 지정)
s, rc, o, e = sh([PD, "회의록.md", "-o", "기본.pdf"], cwd=W)
R["pdf_default"] = {"rc": rc, "err": e.strip().splitlines()[0] if e.strip() else ""}
TY = shutil.which("typst") or "/tmp/typst-x86_64-unknown-linux-musl/typst"
env_path = os.path.dirname(TY)
t, (_, rc, o, e) = best(f'PATH={env_path}:$PATH {PD} 회의록.md -o 회의록.pdf --pdf-engine=typst -V mainfont="Noto Sans CJK KR"')
info = sh(["pdfinfo", "회의록.pdf"])[2]; txt = sh(["pdftotext", "회의록.pdf", "-"])[2]
R["pdf_typst"] = {"sec": t, "rc": rc, "pages": int(re.search(r"Pages:\s+(\d+)", info).group(1)), "bytes": os.path.getsize(W + "/회의록.pdf"),
                  "korean": "결정한 것" in txt, "typst": sh([TY, "--version"])[2].strip()}
s, rc, o, e = sh(f'PATH={env_path}:$PATH {PD} 회의록.md -o 글꼴없음.pdf --pdf-engine=typst')
txt2 = sh(["pdftotext", "글꼴없음.pdf", "-"])[2] if rc == 0 else ""
R["pdf_typst_nofont"] = {"rc": rc, "korean_text": "결정한 것" in txt2, "warn": len(re.findall("unknown font|font", e))}
sh(["pdftoppm", "-png", "-r", "60", "-f", "1", "-l", "1", "회의록.pdf", "pdf-page"])

# ⑦ 많이 · 크게: 메모 50개 → 워드 50개 · 100쪽짜리 긴 글 → 워드
os.makedirs(W + "/memos"); os.makedirs(W + "/out")
for i in range(50):
    open(f"{W}/memos/메모{i + 1:02d}.md", "w", encoding="utf-8").write(f"# 메모 {i + 1}\n\n- 할 일 {i + 1}\n- **중요** 확인하기\n\n| 항목 | 값 |\n|---|---|\n| 번호 | {i + 1} |\n")
t = time.time()
for f in sorted(os.listdir(W + "/memos")):
    subprocess.run([PD, f"{W}/memos/{f}", "-o", f"{W}/out/{f[:-3]}.docx"], check=True)
R["batch50"] = {"sec": round(time.time() - t, 2), "files": len(os.listdir(W + "/out"))}
para = "겨울에는 난방 때문에 실내가 쉽게 건조해집니다. 습도계를 두고 아침저녁으로 환기하시기 바랍니다. " * 6
big = "".join(f"# {i + 1}장 가상 보고서\n\n" + "\n\n".join(para for _ in range(6)) + "\n\n| 항목 | 값 |\n|---|---|\n| 장 | " + str(i + 1) + " |\n\n" for i in range(100))
open(W + "/긴글.md", "w", encoding="utf-8").write(big)
t, (_, rc, o, e) = best([PD, "긴글.md", "-o", "긴글.docx"])
sh(["soffice", "--headless", "--convert-to", "pdf", "긴글.docx"])
R["big"] = {"sec": t, "rc": rc, "md_kb": round(os.path.getsize(W + "/긴글.md") / 1e3), "docx_kb": round(os.path.getsize(W + "/긴글.docx") / 1e3),
            "pages_lo": int(re.search(r"Pages:\s+(\d+)", sh(["pdfinfo", "긴글.pdf"])[2]).group(1)), "chars": len(big)}

# ⑧ 같은 이름 결과 파일이 있으면? (묻지 않고 덮어쓰는지)
before = os.path.getmtime(W + "/회의록.docx"); time.sleep(1.1)
s, rc, o, e = sh([PD, "회의록.md", "-o", "회의록.docx"])
R["overwrite"] = {"rc": rc, "asked": bool(e.strip()), "replaced": os.path.getmtime(W + "/회의록.docx") > before}
# 회사 양식(서식 파일) 받기
s, rc, o, e = sh(f"{PD} -o 내양식.docx --print-default-data-file reference.docx")
R["refdoc"] = {"rc": rc, "bytes": os.path.getsize(W + "/내양식.docx")}

# ⑨ 자주 나는 오류 (실제 문구)
R["errors"] = {}
for k, cmd in (("missing", [PD, "없는파일.md", "-o", "x.docx"]), ("hwp_ext", [PD, "회의록.md", "-o", "결과.hwp"]), ("hwp_fmt", [PD, "회의록.md", "-t", "hwp", "-o", "x"])):
    s, rc, o, e = sh(cmd); R["errors"][k] = {"rc": rc, "err": " / ".join(l.strip() for l in e.strip().splitlines())}
shutil.copy(W + "/회의록.md", W + "/주간 회의록.md")
s, rc, o, e = sh(f"{PD} 주간 회의록.md -o y.docx"); R["errors"]["space"] = {"rc": rc, "err": e.strip()}
s, rc, o, e = sh(f'{PD} "주간 회의록.md" -o y.docx'); R["errors"]["space_quoted"] = {"rc": rc}
R["errors"]["hwp_ext"]["saved_html"] = open(W + "/결과.hwp", encoding="utf-8").read(200).lstrip().startswith("<h1")

json.dump(R, open(os.path.join(HERE, "results.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1))
