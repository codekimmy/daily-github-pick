"""시연용 '말하다 멈추는 가상 강의' 영상 만들기 (직접 만든 자료).
합성 목소리(tts.mjs) + 문장 사이 침묵 + 슬라이드 + 오른쪽 위 '원본 시간' 시계 + 아래 소리 파형.
시계가 있어서 auto-editor가 자른 뒤에는 시간이 '뚝뚝' 건너뛰는 게 눈에 보인다.
사용: python3 make_lecture.py <작업폴더> [목소리파일]
  - 목소리파일을 주면: lecture-lines.txt 10문장을 순서대로 읽은 녹음(문장 사이 1초 이상 쉼)을 침묵 기준으로 10조각 내서 씀
  - 안 주면: espeak-ng(작업폴더에 npm 설치 필요) 합성 음성 — 알아듣기 어려우니 시험용으로만"""
import re
import json, subprocess, sys, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

work = Path(sys.argv[1]); here = Path(__file__).parent
W, H, SR = 1280, 720, 22050
FB = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
F = lambda s: ImageFont.truetype(FB, s, index=1)

LECTURE = [  # (슬라이드 제목, 말할 문장, 말한 뒤 쉬는 시간[초])
    ("라면 맛있게 끓이는 법", "안녕하세요, 오늘은 라면 맛있게 끓이는 법을 알려 드릴게요.", 2.5),
    ("라면 맛있게 끓이는 법", "음, 어디까지 했죠?", 3.0),
    ("라면 맛있게 끓이는 법", "준비물은 라면 한 봉지와 물 오백 밀리리터예요.", 4.0),
    ("① 물은 정확하게", "첫 번째, 물은 꼭 계량컵으로 재 주세요.", 2.0),
    ("① 물은 정확하게", "물이 많으면 국물이 싱거워져요.", 3.5),
    ("② 면은 4분만", "두 번째, 면은 사 분만 끓이세요.", 2.5),
    ("② 면은 4분만", "어, 잠시만요.", 5.0),
    ("② 면은 4분만", "네, 사 분이 지나면 불을 끄세요.", 2.0),
    ("③ 마지막에 파 한 줌", "세 번째, 마지막에 파를 한 줌 넣으면 끝이에요.", 3.0),
    ("③ 마지막에 파 한 줌", "오늘 강의는 여기까지예요. 감사합니다.", 2.0),
]
LEAD = 2.0

# 1) 목소리 만들기
lines = [{"id": f"s{i:02d}", "text": t} for i, (_, t, _) in enumerate(LECTURE)]
(work / "lines.json").write_text(json.dumps(lines, ensure_ascii=False), encoding="utf-8")
VOICE = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else None
(work / "voice").mkdir(exist_ok=True)
if VOICE:  # 사람이 만든 녹음을 문장별로 자르기
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(VOICE), "-ac", "1", "-ar", str(SR), str(work / "voice_all.wav")], check=True)
    for noise, d in [(-40, 0.6), (-35, 0.6), (-40, 0.45), (-30, 0.5), (-45, 0.8)]:
        o = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(work / "voice_all.wav"), "-af", f"silencedetect=noise={noise}dB:d={d}", "-f", "null", "-"], capture_output=True, text=True).stderr
        st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", o)]; en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", o)]
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(work / "voice_all.wav")], capture_output=True, text=True).stdout)
        sp, cur = [], 0.0
        for a, b in zip(st, en + [dur] * (len(st) - len(en))):
            if a > cur + 0.15: sp.append((cur, a))
            cur = b
        if cur < dur - 0.15: sp.append((cur, dur))
        if len(sp) == len(LECTURE): break
    else:
        sys.exit(f"녹음에서 문장 {len(LECTURE)}개를 찾지 못했어요 (찾은 개수 {len(sp)}). 문장 사이를 1초 이상 띄워 주세요.")
    for i, (a, b) in enumerate(sp):
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(work / "voice_all.wav"), "-ss", f"{max(0, a - 0.05):.3f}", "-to", f"{b + 0.08:.3f}", str(work / "voice" / f"s{i:02d}.wav")], check=True)
else:
    (work / "tts.mjs").write_text((here / "tts.mjs").read_text(encoding="utf-8"), encoding="utf-8")  # ESM은 스크립트 위치에서 node_modules를 찾으므로 복사
    subprocess.run(["node", "tts.mjs", "lines.json", "voice"], cwd=work, check=True)

# 2) 소리 이어 붙이기 (+ 아주 작은 방 소음)
def read(p):
    with wave.open(str(p)) as w:
        assert w.getframerate() == SR
        return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
rng = np.random.default_rng(1)
pieces, segs, t = [np.zeros(int(LEAD * SR))], [], LEAD
for i, (title, text, pause) in enumerate(LECTURE):
    v = read(work / "voice" / f"s{i:02d}.wav") * 0.9
    segs.append({"title": title, "text": text, "start": t, "speak_end": t + len(v) / SR, "end": t + len(v) / SR + pause})
    pieces += [v, np.zeros(int(pause * SR))]; t += len(v) / SR + pause
audio = np.concatenate(pieces); audio += rng.normal(0, 0.002, len(audio))
with wave.open(str(work / "lecture.wav"), "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(audio, -1, 1) * 32767).astype(np.int16).tobytes())
total = len(audio) / SR
(work / "segments.json").write_text(json.dumps({"total": total, "lead": LEAD, "segs": segs}, ensure_ascii=False, indent=1), encoding="utf-8")

# 3) 슬라이드 그림 (구간마다 한 장)
def slide(title, caption, path):
    im = Image.new("RGB", (W, H), (250, 244, 230)); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 90), fill=(214, 72, 44)); d.text((40, 45), "가상 강의 · 시연용", font=F(30), fill="white", anchor="lm")
    d.text((W / 2, 250), title, font=F(70), fill=(40, 30, 20), anchor="mm")
    if caption:
        d.rounded_rectangle((90, 400, W - 90, 500), 24, fill=(255, 255, 255))
        d.text((W / 2, 450), caption, font=F(34), fill=(60, 60, 60), anchor="mm")
    im.save(path)
(work / "slides").mkdir(exist_ok=True)
cat = ["ffconcat version 1.0"]
slide(LECTURE[0][0], "", work / "slides/lead.png"); cat += ["file slides/lead.png", f"duration {LEAD}"]
for i, s in enumerate(segs):
    p = f"slides/s{i:02d}.png"; slide(s["title"], s["text"], work / p)
    cat += [f"file {p}", f"duration {s['end'] - s['start']:.3f}"]
cat += [f"file slides/s{len(segs) - 1:02d}.png"]
(work / "slides.txt").write_text("\n".join(cat) + "\n")

# 4) 영상: 슬라이드 + 원본 시계 + 소리 파형
clock = ("drawbox=x=930:y=110:w=320:h=70:color=black@0.75:t=fill,"
         f"drawtext=fontfile={FB}:text='원본 %{{eif\\:trunc(t/60)\\:d\\:2}}\\:%{{eif\\:mod(t\\,60)\\:d\\:2}}.%{{eif\\:mod(t*10\\,10)\\:d}}':x=950:y=125:fontsize=40:fontcolor=yellow")
fc = (f"[0:v]fps=30,format=yuv420p,{clock}[bg];"
      "[1:a]asplit[a1][a2];[a1]showwaves=s=1180x110:mode=cline:colors=0x2b6cb0:rate=30,format=rgba[wv];"
      "[bg][wv]overlay=50:580[v]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", "slides.txt", "-i", "lecture.wav",
                "-filter_complex", fc, "-map", "[v]", "-map", "[a2]", "-t", f"{total:.3f}",
                "-c:v", "libx264", "-preset", "medium", "-crf", "10", "-c:a", "aac", "-b:a", "128k", "lecture.mp4"], cwd=work, check=True)
print(f"lecture.mp4 {total:.1f}초, 문장 {len(segs)}개, 말하는 시간 {sum(s['speak_end'] - s['start'] for s in segs):.1f}초")
