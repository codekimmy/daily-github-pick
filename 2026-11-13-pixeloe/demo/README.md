# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `photos/` | 시연 사진: scikit-image 견본 사진 `고양이.png`(451×300, Stefan van der Walt, CC0) · `커피.png`(600×400, Rachel Michetti, CC0) |
| `test_all.py` | 파이썬으로 측정 → `results.json`·`out/`(저장소에는 영상·그림에 쓰는 결과 그림만 남김): 기본 설정, 보통 모자이크 비교(같은 점 개수), 점 개수 `-S` 32~256, `--colors` 4~32 결과 색 개수, 외곽선 두께 `-T` 0~3, 줄이는 방식 5가지, 큰 사진(600·1920·4000 화소) 시간 |
| `test_cli.py` | 명령어 `pixeloe.pixelize`(기본값·점 128·점 64+8색) 실행 시간과 결과 색 개수, 새 명령 `pixeloe.slang` 실행 결과(실패 오류) → `results.json`의 `cli` |
| `도트변환.py` | 파이썬 예제: 폴더 속 사진을 모두 도트 그림으로 바꾸고 '원본 \| 보통 모자이크 \| PixelOE' 비교 그림까지 → `사진폴더/도트그림/` (리눅스에서 실행 확인, 사진 2장 장마다 0.3~0.5초) |
| `tools_win/도트그림.bat` | Windows용: 사진 파일을 실행 파일 위에 끌어다 놓으면 크기 번호(1·2·3)를 물어본 뒤 사진 옆에 `이름_도트128.png` 저장 (Windows 실행 확인 전) |
| `미리보기.py` | 녹화용 보조: 그림을 명령 창에 색 글자(▀)로 작게 찍어 보여 줌 |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`) |
| `make_images.py` | `media/모자이크비교.png`, `점개수비교.png`, `색줄이기.png`, `두께비교.png`, `thumbnail.jpg`, 숏폼용 세로 `thumbnail-shorts.jpg` |
| `anim/` | 과정 애니메이션: `engine.js`(그리기 도구 + 사진·도트 그림 그리기), `data.js`(= `results.json`), `anim.html` → `render.py 1920 1080 …` / `render.py 1080 1920 …` |
| `long/` | 롱폼: `script.js`(장·자막·대본) + `long.html` → `render_long.py 프레임폴더 [시작 끝]` → `compose.py 프레임폴더 출력.mp4` |
| `voice/retime.py` | 대본 말하는 시간 + 쉼으로 장·자막 시간 다시 짜기 → `long/timing.js`, `anim/timing.js` (`voice/est.json` = 빈 측정값 → 글자 수 어림, 롱폼 쉼 1.6초) |
| `voice/align.py` · `add_bgm.py` · `calm_bgm.py` | 운영자 음성을 받으면 입히기 · 잔잔한 배경음악 (Day 15·16과 같은 도구) |
| `narration/make.py` | 음성용 대본 `narration-*.txt` (구간 시간, 한글 읽기, 초당 6글자 검사, 긴 쉼 검사) |

순서: `test_all.py` → `test_cli.py` → `도트변환.py photos` → `make_images.py` → `voice/retime.py voice/est.json 1.6` → 애니메이션·롱폼 렌더 → `narration/make.py`
준비: `pip install pixeloe scikit-image asciinema playwright`, agg(GIF 변환), ffmpeg
그림을 영상에 그릴 때: PixelOE가 만든 결과 그림(`out/`)을 그대로 쓰고, 도트 그림은 계단이 보이게 부드럽게 하기(smoothing)를 끄고 확대
