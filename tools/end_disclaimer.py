"""이미 만든 영상의 엔딩 화면에 면책 문구(작은 글씨)를 얹는다 (GUIDE 6-1장). 소리는 그대로 복사.
사용: python3 tools/end_disclaimer.py <입력.mp4> <출력.mp4> <시작초(음수면 끝에서)> <y위치> "<1줄>" ["<2줄>"]"""
import os, subprocess, sys, tempfile
src, out, start, y, lines = sys.argv[1], sys.argv[2], float(sys.argv[3]), int(sys.argv[4]), sys.argv[5:]
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src]))
if start < 0: start = dur + start
font = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
tmp = tempfile.mkdtemp(); filt = []
for i, s in enumerate(lines):
    tf = f"{tmp}/l{i}.txt"; open(tf, "w", encoding="utf-8").write(s)
    filt.append(f"drawtext=fontfile={font}:textfile={tf}:fontsize=24:fontcolor=0x9aa7b8:x=(w-text_w)/2:y={y + i * 38}"
                f":alpha='if(lt(t,{start:.2f}),0,min(1,(t-{start:.2f})/0.5))'")
has_audio = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", src]).strip()
cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-vf", ",".join(filt), "-c:v", "libx264", "-preset", "medium", "-crf", "16",
       "-pix_fmt", "yuv420p", "-movflags", "+faststart"] + (["-c:a", "copy"] if has_audio else []) + [out]
subprocess.run(cmd, check=True); print("saved", out, f"(문구 {start:.1f}초부터)")
