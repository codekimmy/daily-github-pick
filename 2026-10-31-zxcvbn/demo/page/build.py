"""template.html 에 zxcvbn.js(npm, MIT)와 ko.js를 인라인해 인터넷 없이 열리는 password-check.html 하나로 만든다.
사용: python3 build.py <node_modules/zxcvbn/dist/zxcvbn.js>"""
import sys, pathlib
here = pathlib.Path(__file__).parent
z = pathlib.Path(sys.argv[1]).read_text(encoding="utf-8").replace("//# sourceMappingURL=zxcvbn.js.map", "")
t = (here / "template.html").read_text(encoding="utf-8")
t = t.replace("/*ZXCVBN*/", z.replace("</script", "<\\/script")).replace("/*KO*/", (here / "ko.js").read_text(encoding="utf-8"))
out = here.parent / "password-check.html"; out.write_text(t, encoding="utf-8"); print("saved", out, len(t) // 1024, "KB")
