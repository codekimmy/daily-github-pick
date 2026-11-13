# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `tts/tts.mjs` | espeak-ng(npm `espeak-ng`, 인터넷·모델 없이 글을 읽는 합성 프로그램)로 말소리 wav 만들기 (`cd tts && npm install`) |
| `make_samples.py` | 시연용 가상 녹음: 합성 한국어 말소리 28초(`samples/깨끗한말.wav`) + 계산으로 만든 잡음 4가지(선풍기·녹음기 '쉬~'·키보드·옆자리 영어 말소리)를 섞은 `samples/잡음_*.wav` |
| `test_all.py` | 측정 → `results.json`, `out/*.wav`(저장소에는 빼 둠, 다시 만들 수 있음): 잡음 4가지 × 설정 5가지(기본 · 고정 잡음 · 잡음 견본 · 세기 0.5 · 0.8)의 말 없는 구간 잡음·말소리 크기·원본 대비 SNR·시간, 10분·60분 녹음 시간 |
| `잡음제거.py` | 예제 파일: `python 잡음제거.py 녹음.wav [--견본 1.5] [--세기 0.8]` → 녹음 옆에 `이름_잡음제거.wav` (wav·mp3 리눅스 실행 확인) |
| `tools_win/잡음제거.bat` | Windows용: 녹음 파일을 실행 파일 위에 끌어다 놓으면 조용한 구간 길이를 물어본 뒤 `잡음제거.py` 실행 (Windows 실행 확인 전) |
| `소리크기.py` | 녹화용 보조: 녹음 맨 앞 구간 잡음 크기(dB)를 막대로 보여 줌 |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`) |
| `make_images.py` | `media/스펙트로그램비교.png`, `잡음크기비교.png`, `말소리크기.png`, `들어보기_*.mp3` |
| `make_data.py` | 영상용 `render/data.js`(파형·측정값) + `render/img/*.png`(축 없는 스펙트로그램 띠) |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초)으로 시간 계산 → `render/timing.js`, `narration-*.txt` 4개 (2026-11-14-spec-LTX-2 도구를 고쳐 씀) |
| `render/` | `engine.js`(그리기 도구 + 엔딩 유의사항) · `scenes.js`(장면) · `page.html`(크로스페이드·자막) · `render.py`(프레임 → ffmpeg, 24fps) · `thumb.html`·`thumb.py`(썸네일) |

순서: `make_samples.py` → `test_all.py` → `make_images.py` → `make_data.py` → `build.py` → `render/render.py long ../media/noisereduce-long.mp4` · `render/render.py anim ../media/noisereduce-anim.mp4 1920 1080` · `… anim ../media/noisereduce-anim-vertical.mp4 1080 1920` → `render/thumb.py`
GIF: `ffmpeg -i media/noisereduce-anim.mp4 -vf "fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=none" media/noisereduce-anim.gif`
준비: `pip install noisereduce soundfile matplotlib asciinema playwright`, Node.js(espeak-ng), ffmpeg, agg, Noto Sans CJK 글꼴
