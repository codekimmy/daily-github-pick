"""녹음 파일의 바탕 잡음(선풍기·에어컨·'쉬~' 소리)을 noisereduce로 줄여 '이름_잡음제거.wav'로 저장하는 예제.
사용: python 잡음제거.py 녹음.wav [녹음2.mp3 ...] [--견본 1.5] [--세기 0.8]
  --견본 N : 파일 맨 앞 N초를 '잡음 견본'으로 씁니다 (말하기 전 조용한 구간이 있을 때 권장)
  --세기 X : 0.0~1.0, 잡음을 얼마나 지울지 (기본 1.0 = 최대, 말소리가 뭉개지면 0.8·0.5로 낮춤)
원본 파일은 바꾸지 않습니다. wav·flac·ogg·mp3를 읽고, 결과는 wav로 저장합니다."""
import sys, time, pathlib, numpy as np, soundfile as sf, noisereduce as nr

args, files, sample, strength = sys.argv[1:], [], 0.0, 1.0
i = 0
while i < len(args):
    if args[i] == "--견본": sample = float(args[i + 1]); i += 2
    elif args[i] == "--세기": strength = float(args[i + 1]); i += 2
    else: files.append(args[i]); i += 1
if not files: print(__doc__); sys.exit(1)
for f in files:
    p = pathlib.Path(f); t0 = time.perf_counter()
    y, sr = sf.read(str(p), always_2d=True)          # (길이, 채널)
    y = y.T                                          # noisereduce는 (채널, 길이)
    kw = dict(prop_decrease=strength)
    if sample > 0:                                   # 맨 앞 조용한 구간을 잡음 견본으로
        kw.update(stationary=True, y_noise=y[:, : int(sr * sample)])
    out = nr.reduce_noise(y=y, sr=sr, **kw)
    dst = p.with_name(p.stem + "_잡음제거.wav")
    sf.write(str(dst), np.clip(out.T, -1, 1), sr, subtype="PCM_16")
    print(f"{p.name} → {dst.name}  ({y.shape[1] / sr:.1f}초 녹음, {time.perf_counter() - t0:.2f}초 걸림)")
