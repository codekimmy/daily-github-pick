# 한글 글자 시험: 내장 글꼴(4×6 점) vs 한글 글꼴 파일
import os, pyxel
pyxel.init(160, 60, title="ktest")
f = pyxel.Font(os.environ["KFONT"], 12)
def draw():
    pyxel.cls(0)
    pyxel.text(4, 4, "Built-in: 안녕 Hello", 7)
    pyxel.text(4, 24, "TTF: 안녕 Hello", 10, f)
pyxel.run(lambda: None, draw)
