"""시연용 가상 녹음 만들기 (모두 직접 합성, 저작권 걱정 없음).
- 말소리: espeak-ng(npm, 인터넷·모델 없이 합성)로 읽은 한국어 문장
- 배경음악: 직접 계산한 화음(사인파)
- 일부러 소리 크기를 제각각으로 만든다 → samples/
사용: python3 make_samples.py"""
import subprocess, os, numpy as np, soundfile as sf
from scipy.signal import resample_poly
H = os.path.dirname(os.path.abspath(__file__)); S = f"{H}/samples"; os.makedirs(S, exist_ok=True)
SR = 44100


def tts(text, voice="ko", speed="140"):
    p = f"{S}/_t.wav"; subprocess.run(["node", f"{H}/tts/tts.mjs", text, p, voice, speed], check=True)
    d, sr = sf.read(p); os.remove(p)
    return resample_poly(d, SR, sr)


def speech(lines, pause=0.8):
    parts = [np.zeros(int(SR * .6))]
    for l in lines: parts += [tts(l), np.zeros(int(SR * pause))]
    x = np.concatenate(parts); return x / np.abs(x).max()


def gain(x, peak_db):  # 가장 큰 순간(피크)을 정한 dB로
    return x / np.abs(x).max() * 10 ** (peak_db / 20)


meeting = speech(["회의를 시작하겠습니다.", "지난주 매출은 조금 늘었습니다.", "자료는 공유 폴더에 올려 두었습니다."])
lecture = speech(["오늘은 분수의 덧셈을 배우겠습니다.", "분모가 같으면 분자끼리 더합니다.", "다음 시간에는 곱셈을 배웁니다."])
inter = speech(["취미가 무엇입니까?", "주말마다 자전거를 탑니다.", "한강을 따라 달리면 기분이 좋습니다."])
# 배경음악: 천천히 바뀌는 화음 4개(각 3초) + 낮은 베이스
t = np.arange(int(SR * 12)) / SR
CH = [[261.6, 329.6, 392.0], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [196.0, 246.9, 293.7]]
mus = np.zeros_like(t)
for i, ch in enumerate(CH):
    m = (t >= i * 3) & (t < i * 3 + 3); env = np.minimum(1, np.minimum((t - i * 3) / .05, (i * 3 + 3 - t) / .3))
    for f in ch: mus += m * env * np.sin(2 * np.pi * f * t)
    mus += m * env * .8 * np.sin(2 * np.pi * ch[0] / 2 * t)
# 작게 녹음된 회의 / 크게 녹음된 강의 / 보통 인터뷰 / 아주 큰 배경음악
sf.write(f"{S}/1_회의녹음.wav", gain(meeting, -24), SR, subtype="PCM_16")
sf.write(f"{S}/2_강의녹음.wav", gain(lecture, -1), SR, subtype="PCM_16")
sf.write(f"{S}/_inter.wav", gain(inter, -10), SR, subtype="PCM_16")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{S}/_inter.wav", "-c:a", "libmp3lame", "-b:a", "128k", f"{S}/3_인터뷰.mp3"], check=True)
os.remove(f"{S}/_inter.wav")
sf.write(f"{S}/4_배경음악.wav", gain(mus, -0.3), SR, subtype="PCM_16")
# 발표 영상: 색 화면 + 작은 말소리 (영상은 그대로 두고 소리만 맞추는지 확인용)
pres = speech(["발표를 시작하겠습니다.", "이번 분기 목표는 고객 만족입니다.", "감사합니다."])
sf.write(f"{S}/_pres.wav", gain(pres, -20), SR, subtype="PCM_16")
dur = len(pres) / SR
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", f"color=c=0x1f6feb:s=640x360:d={dur:.2f}:r=24",
                "-i", f"{S}/_pres.wav", "-vf", "drawtext=fontfile=/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc:text='가상 발표 영상':fontsize=48:fontcolor=white:x=(w-tw)/2:y=(h-th)/2",
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-shortest", f"{S}/5_발표영상.mp4"], check=True)
os.remove(f"{S}/_pres.wav")
for f in sorted(os.listdir(S)): print(f, os.path.getsize(f"{S}/{f}"))
