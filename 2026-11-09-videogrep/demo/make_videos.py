"""시연용 가상 영상 2개 만들기 (실제 사람·기관과 관련 없음).
- 요리교실.mp4 : 가상 '주민센터 온라인 요리 교실' 강의 (기계 음성 espeak-ng + 화면 글자 + 원본 시각 표시)
- 회의.mp4     : 가상 '동네 작은도서관 운영 회의' 녹화
영상마다 같은 이름의 자막 파일(.srt)을 함께 만든다. videogrep은 이 자막을 보고 장면을 찾는다.
사용: python3 make_videos.py  (결과: work/)"""
import json, os, subprocess, wave
from PIL import Image, ImageDraw, ImageFont

H = os.path.dirname(os.path.abspath(__file__)); W = f"{H}/work"; os.makedirs(W, exist_ok=True)
FB = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"; FR = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
f = lambda p, s: ImageFont.truetype(p, s)

VIDEOS = {
 "요리교실": ("주민센터 온라인 요리 교실 · 3강 된장찌개 (가상)", "#1d3b2a", [
  ("인사", "안녕하세요, 온라인 요리 교실 세 번째 시간입니다"),
  ("인사", "오늘은 집에서 쉽게 끓이는 된장찌개를 배워 보겠습니다"),
  ("재료", "음, 먼저 재료부터 보겠습니다"),
  ("재료", "애호박 반 개, 두부 반 모, 양파 한 개를 준비합니다"),
  ("재료", "된장은 두 숟가락, 고춧가루는 반 숟가락입니다"),
  ("재료", "소금은 마지막에 맛을 보고 넣기 때문에 조금만 꺼내 둡니다"),
  ("손질", "애호박은 반달 모양으로 썹니다"),
  ("손질", "두부는 한 입 크기로 네모나게 자릅니다"),
  ("손질", "음, 양파는 너무 얇지 않게 썰어 주시기 바랍니다"),
  ("손질", "청양고추가 있으면 하나 송송 썰어 둡니다"),
  ("육수", "냄비에 물 네 컵을 붓고 멸치 다섯 마리를 넣습니다"),
  ("육수", "센 불에서 끓기 시작하면 중간 불로 줄입니다"),
  ("육수", "십 분 정도 끓인 뒤 멸치는 건져 냅니다"),
  ("된장", "이제 된장을 풀겠습니다"),
  ("된장", "체에 받쳐서 풀면 덩어리가 남지 않습니다"),
  ("된장", "음, 된장마다 짠 정도가 다르니 처음에는 조금 적게 넣습니다"),
  ("끓이기", "양파와 애호박을 먼저 넣고 오 분 끓입니다"),
  ("끓이기", "그다음 두부를 넣고 삼 분 더 끓입니다"),
  ("끓이기", "고춧가루와 다진 마늘 반 숟가락을 넣습니다"),
  ("간 맞추기", "이제 국물 맛을 한번 보겠습니다"),
  ("간 맞추기", "싱거우면 소금을 아주 조금씩 넣으면서 맞춥니다"),
  ("간 맞추기", "소금 대신 된장을 조금 더 풀어도 됩니다"),
  ("간 맞추기", "짜게 됐다면 물을 반 컵 더 붓고 한소끔 끓입니다"),
  ("마무리", "마지막으로 청양고추와 대파를 올립니다"),
  ("마무리", "불을 끄고 일 분 정도 뜸을 들입니다"),
  ("마무리", "음, 이렇게 하면 된장찌개가 완성됩니다"),
  ("정리", "오늘 배운 순서를 다시 정리하겠습니다"),
  ("정리", "육수, 된장, 채소, 두부, 그리고 간 맞추기 순서입니다"),
  ("정리", "소금은 꼭 마지막에 맛을 보고 넣으시기 바랍니다"),
  ("정리", "다음 시간에는 계란말이를 배워 보겠습니다"),
  ("정리", "음, 질문은 게시판에 남겨 주시기 바랍니다"),
  ("정리", "오늘도 함께해 주셔서 감사합니다"),
 ]),
 "회의": ("동네 작은도서관 11월 운영 회의 (가상)", "#1d2b44", [
  ("시작", "지금부터 작은도서관 십일월 운영 회의를 시작하겠습니다"),
  ("안건", "오늘 안건은 세 가지입니다"),
  ("안건", "겨울 독서 교실, 새 책 구입, 그리고 봉사자 모집입니다"),
  ("독서 교실", "먼저 겨울 독서 교실 이야기부터 하겠습니다"),
  ("독서 교실", "작년에는 아이들 스무 명이 신청했습니다"),
  ("독서 교실", "올해는 정원을 서른 명으로 늘리자는 의견이 있었습니다"),
  ("독서 교실", "그럼 정원은 서른 명으로 결정하겠습니다"),
  ("새 책", "다음은 새 책 구입 예산입니다"),
  ("새 책", "올해 남은 예산은 팔십만 원입니다"),
  ("새 책", "어린이 책에 오십만 원, 어른 책에 삼십만 원을 쓰자는 안이 나왔습니다"),
  ("새 책", "반대 의견이 없으니 예산은 이렇게 나누기로 결정하겠습니다"),
  ("새 책", "책 목록은 다음 주 금요일까지 받겠습니다"),
  ("봉사자", "마지막으로 봉사자 모집입니다"),
  ("봉사자", "주말 오후에 책을 정리할 사람이 두 명 더 필요합니다"),
  ("봉사자", "모집 안내문은 게시판과 단체 대화방에 올리겠습니다"),
  ("봉사자", "안내문은 이번 주 안에 올리기로 결정하겠습니다"),
  ("정리", "오늘 정한 것을 다시 읽겠습니다"),
  ("정리", "독서 교실 정원은 서른 명, 예산은 오십만 원과 삼십만 원입니다"),
  ("정리", "다음 회의는 십이월 첫째 주 화요일로 결정하겠습니다"),
  ("정리", "수고하셨습니다"),
 ]),
}

def frame(path, head, color, step, idx, total, sent):
    im = Image.new("RGB", (1280, 720), "#0f141a"); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 1280, 64], fill=color); d.text((28, 32), head, font=f(FB, 28), fill="#ffffff", anchor="lm")
    d.rounded_rectangle([90, 130, 1190, 470], 28, fill="#1a222c", outline="#3a4757", width=3)
    d.text((640, 230), step, font=f(FB, 84), fill="#f2c14e", anchor="mm")
    d.text((640, 340), f"장면 {idx + 1} / {total}", font=f(FR, 34), fill="#9aa7b8", anchor="mm")
    d.rectangle([90, 410, 90 + 1100 * (idx + 1) / total, 420], fill="#58a6ff")
    # 화면 아래 자막(영상에 새긴 글자)
    font = f(FB, 36); tw = d.textlength(sent, font=font)
    if tw > 1200: font = f(FB, 30); tw = d.textlength(sent, font=font)
    d.rounded_rectangle([640 - tw / 2 - 24, 560, 640 + tw / 2 + 24, 630], 14, fill="#000000")
    d.text((640, 595), sent, font=font, fill="#ffffff", anchor="mm"); im.save(path)

def ts(s): ms = int(round(s * 1000)); return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"

for name, (head, color, lines) in VIDEOS.items():
    tmp = f"{W}/_{name}"; os.makedirs(tmp, exist_ok=True)
    json.dump([s for _, s in lines], open(f"{tmp}/l.json", "w", encoding="utf-8"), ensure_ascii=False)
    subprocess.run(["node", f"{H}/tts.mjs", f"{tmp}/l.json", tmp], check=True, cwd=H)
    pcm, rate, srt, conc, t, GAP = b"", None, [], [], 0.6, 0.7
    for i, (step, sent) in enumerate(lines):
        w = wave.open(f"{tmp}/{i:03d}.wav"); rate = w.getframerate(); data = w.readframes(w.getnframes()); w.close()
        if i == 0: pcm += b"\0\0" * int(rate * t)
        dur = len(data) / 2 / rate; pcm += data + b"\0\0" * int(rate * GAP)
        srt.append(f"{i + 1}\n{ts(t)} --> {ts(t + dur)}\n{sent}\n")
        frame(f"{tmp}/{i:03d}.png", head, color, step, i, len(lines), sent)
        conc.append((f"{tmp}/{i:03d}.png", (t if i == 0 else 0) + dur + GAP)); t += dur + GAP
    o = wave.open(f"{tmp}/all.wav", "wb"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(rate); o.writeframes(pcm); o.close()
    with open(f"{tmp}/list.txt", "w") as fl:
        for p, d in conc: fl.write(f"file '{p}'\nduration {d:.3f}\n")
        fl.write(f"file '{conc[-1][0]}'\n")
    # 오른쪽 위에 '원본 영상 시각'을 새겨 둔다 → 잘라 붙인 영상에서 어느 부분이 뽑혔는지 보인다
    clock = f"drawtext=fontfile={FB}:text='원본 %{{pts\\:hms}}':x=w-tw-24:y=86:fontsize=30:fontcolor=0x7ee787:box=1:boxcolor=0x000000AA:boxborderw=10"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", f"{tmp}/list.txt", "-i", f"{tmp}/all.wav",
                    "-vf", f"fps=30,format=yuv420p,{clock}", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-c:a", "aac", "-b:a", "128k",
                    "-shortest", f"{W}/{name}.mp4"], check=True)
    open(f"{W}/{name}.srt", "w", encoding="utf-8").write("\n".join(srt))
    print(name, f"{t:.1f}s", len(lines), "lines")
