# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `texts/` | 시연용으로 직접 쓴 글: `인사.txt`(한글 2줄), `greeting_en.txt`(영어 2줄), `하루.txt`(열 줄) |
| `test_all.py` | 효과 37가지 측정 → `results.json` (프레임 수 → 초당 60장 기준 길이, 가로 80칸 가상 터미널에서 마지막 화면 확인, 글 길이, 실제 시간, 무작위) |
| `test_timebased.py` | 시계 기준 효과(matrix·thunderstorm)를 실제 실행 시간으로 고쳐 씀 |
| `test_box.py` | 넓은 무대(`--canvas-width 40 --canvas-height 10 --anchor-text c`)에서 한글 마지막 화면 다시 확인 |
| `인사카드.py` | 파이썬 예제: 이름을 물어본 뒤 이름 넣은 생일 인사를 분홍·노랑 불꽃놀이로 (리눅스에서 실행 확인, 10.9초) |
| `tools_win/인사효과.bat` | Windows용: 인사 글 두 줄과 효과 번호를 물어본 뒤 넓은 무대로 효과 보여 주기 (실행 확인 전) |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`) |
| `make_images.html` · `make_images.py` | `media/효과길이.png`, `media/한글화면비교.png`, `media/효과모음.png`, `media/thumbnail.jpg` |
| `anim/` | 과정 애니메이션: `prep.py`(tte 실제 프레임 → `fx.js`, 숫자 → `data.js`) → `render.py 1920 1080 …` / `render.py 1080 1920 …` |
| `long/` | 롱폼: `script.js`(장·자막·대본) + `long.html` → `render_long.py 프레임폴더 [시작 끝]` → `compose.py 프레임폴더 출력.mp4` |
| `voice/retime.py` | 대본 말하는 시간 + 쉼 1.4초로 장·자막 시간 다시 짜기 → `long/timing.js`, `anim/timing.js` |
| `voice/align.py` · `add_bgm.py` · `calm_bgm.py` | 운영자 음성을 받으면 입히기 · 잔잔한 배경음악 (Day 15와 같은 도구) |
| `narration/make.py` | 음성용 대본 `narration-*.txt` (구간 시간, 한글 읽기, 초당 6글자 검사, 긴 쉼 검사) |

순서: `test_all.py` → `test_timebased.py` → `test_box.py` → `anim/prep.py` → `make_images.py` → `voice/retime.py` → 애니메이션·롱폼 렌더 → `narration/make.py`
준비: `pip install terminaltexteffects pyte asciinema playwright`, agg(GIF 변환), ffmpeg
효과 화면을 영상에 그릴 때: tte가 만든 프레임(글자 + 색)을 그대로 쓰고, 한글은 실제 터미널처럼 두 칸으로 그림
