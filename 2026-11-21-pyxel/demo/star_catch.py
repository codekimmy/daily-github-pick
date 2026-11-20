# 별 줍기 — Pyxel로 만든 아주 작은 게임 (시연용 예제)
# 실행: pyxel run star_catch.py   /  ← → 화살표로 바구니를 움직여 떨어지는 별을 받습니다
import os, random
import pyxel

AUTO = os.environ.get("AUTO_PLAY") == "1"   # 시연 녹화용: 컴퓨터가 대신 화살표를 누름
if AUTO: random.seed(7)                      # 녹화할 때마다 같은 별이 떨어지게
FONT_PATH = os.environ.get("KFONT")          # 한글 글꼴 파일(TTF/TTC). 없으면 영어 제목


class App:
    def __init__(self):
        pyxel.init(160, 120, title="Star Catch", fps=30, capture_sec=12)
        self.font = pyxel.Font(FONT_PATH, 12) if FONT_PATH else None
        pyxel.sounds[0].set("c3e3g3c4", "p", "6", "n", 7)   # 별을 받았을 때 '띠링' 소리
        self.x, self.score, self.miss, self.stars = 72, 0, 0, []
        pyxel.run(self.update, self.draw)

    def update(self):
        if AUTO and self.stars:  # 가장 낮은 별 쪽으로 바구니를 움직이게 버튼을 대신 누름
            t = max(self.stars, key=lambda s: s[1])[0]
            pyxel.set_btn(pyxel.KEY_LEFT, t < self.x + 4)
            pyxel.set_btn(pyxel.KEY_RIGHT, t > self.x + 12)
        if pyxel.btn(pyxel.KEY_LEFT): self.x = max(self.x - 3, 0)
        if pyxel.btn(pyxel.KEY_RIGHT): self.x = min(self.x + 3, 144)
        if pyxel.frame_count % 20 == 0:  # 0.67초마다 별 하나
            self.stars.append([random.randint(4, 152), 14, random.uniform(1.0, 2.2)])
        for s in self.stars[:]:
            s[1] += s[2]
            if 104 <= s[1] <= 110 and self.x - 2 <= s[0] <= self.x + 18:
                self.stars.remove(s); self.score += 1; pyxel.play(0, 0)
            elif s[1] > 120:
                self.stars.remove(s); self.miss += 1

    def draw(self):
        pyxel.cls(1)                                   # 남색 하늘
        for i in range(20): pyxel.pset((i * 37) % 160, (i * 53) % 100, 5)  # 배경 작은 별
        for x, y, _ in self.stars:
            pyxel.tri(x, y - 4, x - 4, y + 3, x + 4, y + 3, 10)
            pyxel.tri(x, y + 6, x - 4, y - 1, x + 4, y - 1, 10)
        pyxel.rect(self.x, 108, 16, 6, 4); pyxel.rectb(self.x, 108, 16, 6, 9)  # 바구니
        pyxel.rect(0, 114, 160, 6, 3)                  # 풀밭
        title = "별 줍기" if self.font else "STAR CATCH"
        pyxel.text(4, 2, title, 7, self.font)
        pyxel.text(100, 4, f"SCORE {self.score:2d}", 10)
        pyxel.text(100, 11, f"MISS  {self.miss:2d}", 8)


App()
