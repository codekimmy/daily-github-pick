# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `make_samples.py` | 시연용 그림: 가상 카페 '오늘커피' 로고(`samples/로고_원본.png` 1200px 정답 → `로고_작은.jpg` 240px·화질 60), 가상 손글씨 서명을 휴대폰으로 찍은 것처럼 오른쪽에 그림자를 넣은 `서명_사진.jpg`(+ 정답 획 `서명_정답.png`), 24×24 도트 화분 `도트.png`, scikit-image chelsea 고양이 사진(CC0) `고양이.jpg`·`고양이_4000.jpg` |
| `test_all.py` | 측정 → `results.json`, `out/*.svg·png`(저장소에는 빼 둠, 다시 만들 수 있음): 설정별 시간(3번 중 가운데 값)·파일 크기·조각(path) 수·색 수, SVG를 resvg로 다시 그려 정답과 '같은 색 비율'(RGB 거리 40 이하), 서명 '겹친 정도'(IoU), 4000px 사진 |
| `tools_win/SVG만들기.bat` | Windows용: 그림을 실행 파일 위에 끌어다 놓고 번호 1~4(로고·서명·도트·사진)를 고르면 `이름.svg` 생성 (같은 파이썬 명령은 리눅스에서 확인, Windows 실행 확인 전) |
| `demo.sh` | 터미널 녹화용, 명령어 버전 `vtracer`(cargo install vtracer-cli) 사용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`) |
| `make_data.py` | 영상·그림용 `render/data.js`(측정값 + 그림 목록). `render/img/`에는 시연 입력 그림과 VTracer가 만든 SVG를 그대로 복사해 둠 |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-15-ocrmypdf 도구를 고쳐 씀) |
| `render/` | `engine.js`(그리기 도구 + 엔딩 유의사항) · `scenes.js`(장면, 연출: 와이프·도장·픽셀 조각 전환·돋보기 확대 비교 `zoomPair`) · `page.html`(크로스페이드·자막) · `render.py`(프레임 → ffmpeg, 24fps) · `thumb.html`·`thumb.py`(썸네일) · `still.html`·`still.py`(결과 그림 4장) |

순서: `make_samples.py` → `test_all.py` → (그림 복사) `make_data.py` → `build.py` → `render/render.py long ../media/vtracer-long.mp4` · `render/render.py anim ../media/vtracer-anim.mp4 1920 1080` · `… anim ../media/vtracer-anim-vertical.mp4 1080 1920` → `render/thumb.py` · `render/still.py`
GIF: `ffmpeg -i media/vtracer-anim.mp4 -vf "fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=none" media/vtracer-anim.gif`
준비: `pip install vtracer==1.0.0a4 resvg-py scikit-image asciinema playwright`, `cargo install vtracer-cli`(터미널 녹화용, 빌드 75초), ffmpeg, agg, Noto Sans CJK 글꼴
