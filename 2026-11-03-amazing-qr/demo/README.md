# demo 폴더 안내

| 파일 | 하는 일 |
|---|---|
| `assets/` | 시연용 가상 그림 (카페 간판·노을·밤하늘·가로로 긴 그림·무지개 GIF) — `make_assets.py`로 생성 |
| `drag_to_qr.bat` | Windows용: 그림 파일을 끌어다 놓고 주소를 붙여넣으면 `그림이름_qr.png` 생성 (리눅스에서 만든 파일, Windows 실행 확인 전) |
| `read_qr.py` | QR 그림이 읽히는지 확인 (zxing-cpp). `pip install zxing-cpp numpy pillow` 후 `python read_qr.py 그림.png` |
| `test_all.py` | 설정 13가지 × 3회 시간 측정, zxing·OpenCV 판독, 버티기 시험(작게·흐리게 6가지) → `out/`, `results.json` |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh`로 `media/terminal.gif`) |
| `anim/` | 30초 과정 애니메이션 (`prep.py` → `render.py 1920 1080 …` / `render.py 1080 1920 …`) |
| `long/` | 롱폼 본편 (`script.js` 대본 → `render_long.py` → `compose.py`) |
| `make_images.py` | 썸네일·결과 모음·버티기 시험 그림 |
| `narration/make.py` | 음성용 대본 생성 (한글 읽기·초당 6글자 검사) |
| `out/frames/` | 움직이는 QR(`waveqr*`)과 원본 GIF(`wavesrc*`)를 장별로 푼 그림 (애니메이션용) |
