"""음성을 입힌 영상에 배경음악을 깐다. 목소리가 나올 때는 배경음악이 자동으로 작아진다(사이드체인 덕킹), 끝 2초는 서서히 줄임.
사용: python3 add_bgm.py <음성 영상.mp4> <배경음악.wav> <출력.mp4> [배경음악 크기, 기본 0.22]"""
import subprocess, sys
src, bgm, out = sys.argv[1:4]; vol = float(sys.argv[4]) if len(sys.argv) > 4 else 0.22
V = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src]))
fl = (f"[0:a]aresample=44100,apad=whole_dur={V},asplit[vo][key];"
      f"[1:a]atrim=0:{V},volume={vol}[bg];[bg][key]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=400[bgd];"
      f"[vo][bgd]amix=inputs=2:normalize=0,afade=t=out:st={V - 2:.2f}:d=2,alimiter=limit=0.95[a]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-stream_loop", "-1", "-i", bgm, "-filter_complex", fl, "-map", "0:v", "-map", "[a]",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{V:.3f}", "-movflags", "+faststart", out], check=True)
print("saved", out)
