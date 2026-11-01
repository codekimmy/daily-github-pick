# demo 폴더 안내

| 파일 | 하는 일 |
|---|---|
| `trip.md` | 시연용 원고 (가상 여행 계획 31줄, 슬라이드 4장) |
| `big.md` | 20장짜리 시연 원고 |
| `drag_to_slides.bat` | Windows용: `.md` 파일을 끌어다 놓으면 PDF·PPTX 생성 (리눅스에서 만든 파일, Windows 실행 확인 전) |
| `test_all.py` | 형식 4종·테마 3종·수정 가능한 PPTX·20장 시간 측정 → `out/`, `results.json` |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh`로 `media/terminal.gif`) |
| `anim/` | 30초 과정 애니메이션 (`prep.py` → `render.py 1920 1080 …` / `render.py 1080 1920 …`) |
| `long/` | 롱폼 본편 (`script.js` 대본 → `render_long.py` → `compose.py`) |
| `make_images.py` | 썸네일·테마 비교·PPTX 비교 이미지 |
| `narration/make.py` | 음성용 대본 생성 (한글 읽기·초당 6글자 검사) |
| `out/editable-view.*.png` | `--pptx-editable` 결과를 LibreOffice로 PDF 변환해 그림으로 뽑은 것 |
