"""정리 전/후 그림(media/before-after.png)과 썸네일(media/thumbnail.jpg): 가상 영상에 실제 자막 파일을 입힌 9.2초 화면"""
import subprocess, os
from PIL import Image, ImageDraw, ImageFont
here = os.path.dirname(os.path.abspath(__file__)); W = f"{here}/work"; M = f"{here}/../media"; T = 9.2
FB = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
def shot(srt, out):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(T), "-copyts", "-i", f"{W}/라면영상.mp4", "-vf",
        f"subtitles={W}/{srt}:force_style='FontName=Noto Sans CJK KR,FontSize=22,Outline=2'", "-frames:v", "1", out], check=True)
shot("늦은자막.srt", f"{W}/_a.png"); shot("늦은자막_고침.srt", f"{W}/_b.png")
a, b = Image.open(f"{W}/_a.png"), Image.open(f"{W}/_b.png"); w, h = a.size
g = Image.new("RGB", (w * 2 + 60, h + 260), "#0d1117"); d = ImageDraw.Draw(g)
f1, f2, f3 = ImageFont.truetype(FB, 44), ImageFont.truetype(FB, 34), ImageFont.truetype(FB, 26)
g.paste(a, (20, 150)); g.paste(b, (w + 40, 150))
d.text((20 + w / 2, 60), "고치기 전 (2.5초 늦은 자막)", font=f1, fill="#ff7b72", anchor="mm")
d.text((w + 40 + w / 2, 60), "ffsubsync로 고친 뒤", font=f1, fill="#7ee787", anchor="mm")
d.text((20 + w / 2, 115), "9.2초: 들리는 말은 2번 문장인데 화면엔 1번 문장", font=f3, fill="#9aa7b8", anchor="mm")
d.text((w + 40 + w / 2, 115), "9.2초: 들리는 말도 2번, 화면 자막도 2번", font=f3, fill="#9aa7b8", anchor="mm")
d.text((g.width / 2, h + 200), "들리는 말(9.2초): 먼저 냄비에 물 오백오십 밀리리터를 붓습니다  ·  시연용 가상 영상, 2026-11-05 클라우드 시연 결과", font=f3, fill="#9aa7b8", anchor="mm")
g.save(f"{M}/before-after.png"); os.remove(f"{W}/_a.png"); os.remove(f"{W}/_b.png")
# 썸네일
t = Image.new("RGB", (1280, 720), "#0d1117"); d = ImageDraw.Draw(t)
d.text((640, 150), "자막 싱크", font=ImageFont.truetype(FB, 110), fill="#f0f3f6", anchor="mm")
d.text((640, 300), "2.5초 → 0.03초", font=ImageFont.truetype(FB, 120), fill="#7ee787", anchor="mm")
d.text((640, 430), "소리 듣고 자동으로 맞춤 · 0.58초", font=ImageFont.truetype(FB, 54), fill="#f2c14e", anchor="mm")
d.rounded_rectangle((300, 520, 980, 620), 50, outline="#58a6ff", width=5); d.text((640, 570), "ffsubsync · 무료", font=ImageFont.truetype(FB, 52), fill="#58a6ff", anchor="mm")
t.save(f"{M}/thumbnail.jpg", quality=90); print("saved")
