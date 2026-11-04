"""시연용 가상 자료 만들기: 한국어 말소리(espeak-ng, 오프라인) → 60초 가상 '라면 요리' 영상 + 정답 자막 + 틀어진 자막 3종.
사용: python3 make_assets.py <출력폴더>   (espeak-ng는 npm i espeak-ng 로 받은 폴더에서 say.mjs 실행)"""
import json, os, shutil, subprocess, sys, wave
out = os.path.abspath(sys.argv[1]); os.makedirs(out, exist_ok=True)
here = os.path.dirname(os.path.abspath(__file__)); NODE_DIR = os.environ.get("ESPEAK_DIR", "/tmp/w")
LINES = ["안녕하세요, 오늘은 라면을 맛있게 끓이는 법을 알려 드립니다",
         "먼저 냄비에 물 오백오십 밀리리터를 붓습니다",
         "물이 팔팔 끓을 때까지 기다립니다",
         "물이 끓으면 면과 수프를 함께 넣습니다",
         "면은 젓가락으로 들었다 놓았다 해 줍니다",
         "그러면 면이 더 꼬들꼬들해집니다",
         "사 분이 지나면 달걀 하나를 넣습니다",
         "파를 송송 썰어 올리면 완성입니다",
         "김치와 함께 드시면 더 맛있습니다",
         "오늘 영상은 여기까지입니다, 감사합니다"]
GAP = [1.5, 1.2, 2.0, 1.0, 2.5, 0.8, 3.0, 1.4, 1.8, 2.2]  # 문장 앞 쉬는 시간(초)
shutil.copy(f"{here}/say.mjs", f"{NODE_DIR}/say.mjs")  # ESM은 스크립트 위치 기준으로 패키지를 찾으므로 복사해서 실행
SR = 22050; pcm = b""; cues = []; t = 0.0
for i, (s, g) in enumerate(zip(LINES, GAP)):
    w = f"{out}/_l{i}.wav"; subprocess.run(["node", f"{NODE_DIR}/say.mjs", s, w], cwd=NODE_DIR, check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", w, "-ar", str(SR), "-ac", "1", "-sample_fmt", "s16", w + ".r.wav"], check=True)
    data = wave.open(w + ".r.wav").readframes(10**9); pcm += b"\0\0" * int(g * SR); t += g
    d = len(data) / 2 / SR; cues.append([round(t, 3), round(t + d, 3), s]); pcm += data; t += d
    os.remove(w); os.remove(w + ".r.wav")
pcm += b"\0\0" * int(2.0 * SR); t += 2.0
with wave.open(f"{out}/voice.wav", "wb") as f: f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes(pcm)
def ts(x): x = max(0, x); h, r = divmod(x, 3600); m, s = divmod(r, 60); return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)) % 1000:03d}"
def srt(path, f): open(path, "w", encoding="utf-8").write("".join(f"{i+1}\n{ts(f(a))} --> {ts(f(b))}\n{s}\n\n" for i, (a, b, s) in enumerate(cues)))
srt(f"{out}/정답.srt", lambda x: x)
srt(f"{out}/늦은자막.srt", lambda x: x + 2.5)          # ① 전체가 2.5초 늦게 나옴 (다른 판 영상용 자막)
srt(f"{out}/빠른자막.srt", lambda x: x - 1.7)          # ② 전체가 1.7초 빨리 나옴
srt(f"{out}/점점밀리는자막.srt", lambda x: x * 25 / 23.976 + 0.8)  # ③ 프레임 속도가 다른 판(25 vs 23.976) → 뒤로 갈수록 더 밀림
# 가상 영상: 검은 화면 + 소리 파형 + '시연용 가상 영상' 문구 (자막은 넣지 않음)
font = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
open(f"{out}/_t.txt", "w", encoding="utf-8").write("시연용 가상 영상 · 라면 끓이는 법")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{out}/voice.wav", "-filter_complex",
    f"[0:a]showwaves=s=1280x300:mode=cline:colors=0x58a6ff,pad=1280:720:0:300:color=0x0d1117,drawtext=fontfile={font}:textfile={out}/_t.txt:fontsize=44:fontcolor=white:x=(w-text_w)/2:y=120[v]",
    "-map", "[v]", "-map", "0:a", "-r", "25", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", f"{out}/라면영상.mp4"], check=True)
os.remove(f"{out}/_t.txt")
json.dump({"cues": cues, "dur": round(t, 3)}, open(f"{out}/truth.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("길이", round(t, 2), "초, 문장", len(cues))
