"""ffmpeg-normalize 시연 측정 → results.json (작업 파일은 work/, 커밋하지 않음)
소리 크기는 ffmpeg-normalize 출력과 별도로 ffmpeg의 ebur128 필터로 다시 잰다(통합 음량 LUFS, 실제 최고점 dBTP).
사용: python3 bench.py"""
import json, os, re, shutil, subprocess, time, sys
H = os.path.dirname(os.path.abspath(__file__)); W = f"{H}/work"; S = f"{H}/samples"
shutil.rmtree(W, ignore_errors=True); os.makedirs(W)
R = {"date": "2026-11-22", "env": "클라우드 리눅스 · CPU 2개 · 그래픽카드 없음"}


def run(cmd, cwd=W):
    t = time.time(); p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True); return time.time() - t, p


def loud(f):
    _, p = run(["ffmpeg", "-nostats", "-i", f, "-map", "0:a:0", "-af", "ebur128=peak=true", "-f", "null", "-"])
    s = p.stderr[p.stderr.rfind("Summary:"):]
    i = float(re.search(r"I:\s+(-?[\d.]+) LUFS", s).group(1)); tp = float(re.search(r"Peak:\s+(-?[\d.inf]+) dBFS", s).group(1))
    return {"lufs": i, "peak": tp}


def info(f):
    _, p = run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,codec_name,sample_rate:format=duration", "-of", "json", f])
    j = json.loads(p.stdout); return {"streams": [(s["codec_type"], s["codec_name"], s.get("sample_rate")) for s in j["streams"]], "sec": round(float(j["format"]["duration"]), 2), "kb": round(os.path.getsize(f) / 1000, 1)}


# 0) 설치: 새 가상 환경에 설치 시간·함께 설치되는 프로그램
venv = f"{W}/venv"; subprocess.run([sys.executable, "-m", "venv", venv], check=True)
t, p = run([f"{venv}/bin/pip", "install", "--no-cache-dir", "-q", "ffmpeg-normalize"])
_, fr = run([f"{venv}/bin/pip", "freeze"])
deps = [l.split("==")[0] for l in fr.stdout.split() if "==" in l and not l.lower().startswith("ffmpeg-normalize")]
_, v = run([f"{venv}/bin/ffmpeg-normalize", "--version"])
sz = sum(os.path.getsize(os.path.join(a, f)) for a, _, fs in os.walk(f"{venv}/lib") for f in fs)
R["install"] = {"sec": round(t, 1), "version": v.stdout.strip().split()[-1], "deps": deps, "venv_mb": round(sz / 1e6, 1)}
shutil.rmtree(venv)

FILES = ["1_회의녹음.wav", "2_강의녹음.wav", "3_인터뷰.mp3", "4_배경음악.wav"]
NAMES = ["회의 녹음", "강의 녹음", "인터뷰", "배경음악"]
for f in FILES + ["5_발표영상.mp4"]: shutil.copy(f"{S}/{f}", W)
R["before"] = [dict(name=n, file=f, **loud(f"{W}/{f}"), **info(f"{W}/{f}")) for n, f in zip(NAMES, FILES)]

# ① 기본값: 4개 한꺼번에 → normalized/*.mkv (목표 -23 LUFS, EBU R128)
t, p = run(["ffmpeg-normalize", *FILES, "--print-stats"])
st = json.loads(p.stdout[p.stdout.find("["):])
R["basic"] = {"sec": round(t, 2), "files": [dict(name=n, out=os.path.basename(s["output_file"]), **loud(f"{W}/{s['output_file']}"), **info(f"{W}/{s['output_file']}"),
              type1=s["ebu_pass1"]["normalization_type"], type2=s["ebu_pass2"]["normalization_type"]) for n, s in zip(NAMES, st)]}

# ② mp3로 받기 + 유튜브 기준 -14 LUFS
t, p = run(["ffmpeg-normalize", *FILES, "-t", "-14", "-c:a", "libmp3lame", "-b:a", "192k", "-ext", "mp3", "-of", "yt", "--print-stats"])
st = json.loads(p.stdout[p.stdout.find("["):])
R["yt14"] = {"sec": round(t, 2), "files": [dict(name=n, out=os.path.basename(s["output_file"]), **loud(f"{W}/{s['output_file']}"), **info(f"{W}/{s['output_file']}"),
             type2=s["ebu_pass2"]["normalization_type"]) for n, s in zip(NAMES, st)]}

# ③ 영상: 그림은 그대로, 소리만 맞추기
t, p = run(["ffmpeg-normalize", "5_발표영상.mp4", "-c:a", "aac", "-b:a", "128k", "-ext", "mp4", "-of", "video"])
out = f"{W}/video/5_발표영상.mp4"
_, md = run(["sh", "-c", f"ffmpeg -loglevel error -i 5_발표영상.mp4 -map 0:v -f md5 - ; ffmpeg -loglevel error -i {out} -map 0:v -f md5 -"])
h = md.stdout.split()
R["video"] = {"sec": round(t, 2), "before": dict(**loud(f"{W}/5_발표영상.mp4"), **info(f"{W}/5_발표영상.mp4")), "after": dict(**loud(out), **info(out)), "video_same": len(h) == 2 and h[0] == h[1]}

# ④ 최고점 맞추기(peak) — 가장 큰 순간을 0 dB로
t, p = run(["ffmpeg-normalize", *FILES, "-nt", "peak", "-t", "0", "-of", "peak"])
R["peak"] = {"sec": round(t, 2), "files": [dict(name=n, **loud(f"{W}/peak/{os.path.splitext(f)[0]}.mkv")) for n, f in zip(NAMES, FILES)]}

# ⑤ 같은 출력 파일이 있을 때 (다시 실행)
t, p = run(["ffmpeg-normalize", FILES[0]])
R["again"] = {"code": p.returncode, "msg": (p.stderr.strip().splitlines() or [""])[-1][:200]}

# ⑥ 소리 없는 영상 넣기
run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=gray:s=320x240:d=3", "-c:v", "libx264", "-pix_fmt", "yuv420p", "noaudio.mp4"])
t, p = run(["ffmpeg-normalize", "noaudio.mp4", "-of", "na"])
R["noaudio"] = {"code": p.returncode, "msg": (p.stderr.strip().splitlines() or [""])[-1][:200], "made": os.path.exists(f"{W}/na/noaudio.mkv")}

# ⑦ 긴 녹음: 회의 녹음을 이어 붙인 60분 파일
run(["ffmpeg", "-y", "-loglevel", "error", "-stream_loop", "-1", "-i", FILES[0], "-t", "3600", "-c:a", "pcm_s16le", "long60.wav"])
t, p = run(["ffmpeg-normalize", "long60.wav", "-c:a", "libmp3lame", "-b:a", "128k", "-ext", "mp3", "-of", "long"])
R["long60"] = {"sec": round(t, 1), "code": p.returncode, "after": loud(f"{W}/long/long60.mp3"), "in_mb": round(os.path.getsize(f"{W}/long60.wav") / 1e6, 1), "out_mb": round(os.path.getsize(f"{W}/long/long60.mp3") / 1e6, 1)}
os.remove(f"{W}/long60.wav")

json.dump(R, open(f"{H}/results.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1))
