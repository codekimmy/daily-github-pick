# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `make_samples.py` | 시연용 가상 스캔 문서: 가상 관리비 고지서·가정통신문·카페 영수증을 글자 그림으로 그리고 기울임·얼룩·흐림을 넣어 `samples/스캔본.pdf`(3쪽 200dpi), `저해상도.pdf`(70dpi), `기울어짐.pdf`(4도), `기울어짐6도.pdf`, `거꾸로.pdf`(2쪽 180도), `30쪽.pdf` + `samples/정답.json`(원래 글) |
| `test_all.py` | 측정 → `results.json`, `out/*.pdf`(저장소에는 빼 둠, 다시 만들 수 있음): 설정별 처리 시간·파일 크기·정확도(띄어쓰기 뺀 글자 비교)·낱말 9개 찾기(PDFium = 크롬·엣지 PDF 엔진), 거꾸로·기울기·30쪽·이미 글자가 있는 PDF |
| `찾기.py` | 녹화용 보조: `python3 찾기.py 문서.pdf 낱말1 낱말2` → 낱말마다 찾은 쪽 |
| `tools_win/검색PDF만들기.bat` | Windows용: 스캔 PDF를 실행 파일 위에 끌어다 놓으면 `-l kor+eng --tesseract-pagesegmode 4 --rotate-pages --deskew --skip-text`로 `이름_검색가능.pdf` 생성 (같은 명령은 리눅스에서 확인, Windows 실행 확인 전) |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`) |
| `make_data.py` | 영상·그림용 `render/data.js`(측정값 + 투명 글자층에서 꺼낸 글자 상자·찾은 자리) + `render/img/*.png`(시연 PDF 쪽 그림) |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초)으로 시간 계산 → `render/timing.js`, `narration-*.txt` 4개 (2026-11-14-noisereduce 도구를 고쳐 씀) |
| `render/` | `engine.js`(그리기 도구 + 엔딩 유의사항) · `scenes.js`(장면) · `page.html`(크로스페이드·자막) · `render.py`(프레임 → ffmpeg, 24fps) · `thumb.html`·`thumb.py`(썸네일) · `still.html`·`still.py`(결과 그림 3장) |

순서: `make_samples.py` → `test_all.py` → `make_data.py` → `build.py` → `render/render.py long ../media/ocrmypdf-long.mp4` · `render/render.py anim ../media/ocrmypdf-anim.mp4 1920 1080` · `… anim ../media/ocrmypdf-anim-vertical.mp4 1080 1920` → `render/thumb.py` · `render/still.py`
GIF: `ffmpeg -i media/ocrmypdf-anim.mp4 -vf "fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=none" media/ocrmypdf-anim.gif`
준비: `pip install ocrmypdf asciinema playwright`, Tesseract 5 + 한국어 언어 파일(tessdata_fast `kor.traineddata`), ffmpeg, agg, Noto Sans·Serif CJK 글꼴
