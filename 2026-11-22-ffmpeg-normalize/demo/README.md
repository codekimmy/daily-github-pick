# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `make_samples.py` · `tts/` | 시연용 가상 녹음 만들기: espeak-ng(npm `espeak-ng`, 인터넷·모델 없이 합성)로 읽은 한국어 문장 + 직접 계산한 화음 → 일부러 소리 크기를 제각각으로 (`samples/` 1_회의녹음.wav · 2_강의녹음.wav · 3_인터뷰.mp3 · 4_배경음악.wav · 5_발표영상.mp4) |
| `bench.py` | 새 가상 환경 설치 시간·함께 설치되는 프로그램 → ① 4개 기본값 ② mp3·-14 LUFS ③ 영상(그림 값 비교) ④ 최고점 맞추기 ⑤ 같은 이름 다시 실행 ⑥ 소리 없는 영상 ⑦ 60분 녹음 → `results.json` (소리 크기는 ffmpeg `ebur128`로 따로 잼, 작업 파일은 `work/`, 커밋하지 않음) |
| `loud.py` | 녹화용 보조 도구: 파일마다 통합 음량(LUFS)을 막대로 출력 |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`, 날짜 폴더에서) |
| `mkdata.py` | results.json + 전·후·최고점 맞춤 파형(막대 96개) → `render/data.js`, 전·후 이어 듣기 mp3 → `media/` |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-21-pyxel 도구를 고쳐 씀) |
| `render/` | `engine.js`(그리기 도구 + 엔딩 유의사항) · `scenes.js`(장면, 연출: 도장 배지·설정별 막대 비교 + 새 연출 '음량 계기판 줄 맞추기' `meters`·'지휘자' `conductor`·파형 `wv`) · `page.html` · `render.py` · `thumb.html`·`thumb.py`(썸네일 2장 + 블로그 그림 2장) |

순서: `cd tts && npm install` → `python3 make_samples.py` → `pip install ffmpeg-normalize` → `python3 bench.py` → `python3 mkdata.py` → `python3 build.py` → `render/render.py long ../../media/ffmpeg-normalize-long.mp4` · `render/render.py anim ../../media/ffmpeg-normalize-anim.mp4 1920 1080` · `… anim ../../media/ffmpeg-normalize-anim-vertical.mp4 1080 1920` → `render/thumb.py`
GIF: `ffmpeg -i media/ffmpeg-normalize-anim.mp4 -vf "fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=none" media/ffmpeg-normalize-anim.gif`
환경: 리눅스, ffmpeg 6.1.1, 한글 글꼴 `/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc`
