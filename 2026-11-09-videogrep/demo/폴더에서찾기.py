"""폴더 안 모든 영상(같은 이름 .srt가 있는 것)에서 낱말을 찾아, 찾은 장면 목록(CSV, 엑셀로 열림)을 만든다.
--make 를 붙이면 장면을 이어 붙인 영상도 만든다. 원본 영상은 바꾸지 않는다.
사용: python 폴더에서찾기.py D:\\강의 시험 [--make]"""
import csv, glob, os, sys, time
import videogrep

folder, word, make = sys.argv[1], sys.argv[2], "--make" in sys.argv
files = [f for f in sorted(glob.glob(os.path.join(folder, "*.mp4"))) if os.path.exists(os.path.splitext(f)[0] + ".srt")]
t = time.time(); hits = videogrep.search(files, word)
out = os.path.join(folder, f"찾은장면_{word}.csv")
with open(out, "w", newline="", encoding="utf-8-sig") as fo:  # utf-8-sig: 윈도우 엑셀에서 한글이 안 깨지게
    w = csv.writer(fo); w.writerow(["영상", "시작(초)", "끝(초)", "시작(분:초)", "자막"])
    for h in hits: w.writerow([os.path.basename(h["file"]), round(h["start"], 2), round(h["end"], 2), f"{int(h['start'] // 60)}:{int(h['start'] % 60):02d}", h["content"]])
print(f"영상 {len(files)}개에서 '{word}' {len(hits)}장면 ({time.time() - t:.2f}초) → {out}")
if make and hits:
    videogrep.videogrep(files, word, output=os.path.join(folder, f"모음_{word}.mp4"))
