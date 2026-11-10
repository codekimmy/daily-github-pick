# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `make_data.py` | 시연용 가상 'PC 정리 전' 폴더 만들기 → `work/정리전/` (파일 41개 · 146.7MB, 용량이 커서 저장소에는 올리지 않음 — 다시 실행하면 같은 폴더가 생김) |
| `test_all.py` | czkawka_cli 시연 측정 → `results.json`, 명령 결과 글 `work/out/*.txt` |
| `tools_win/정리점검.bat` | Windows용: 폴더를 물어보고 똑같은 파일·비슷한 사진·빈 폴더·큰 파일·위치 정보 사진 목록을 바탕화면에 글 파일로 (지우지 않음, 실행 확인 전) |
| `tools_win/사진위치지우기.bat` | Windows용: 사진 폴더를 물어보고 위치 정보를 지운 새 사진 만들기 (원본 그대로, 실행 확인 전) |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`) |
| `make_images.py` | 비교표 `media/비슷한사진_비교.png`, 요약 카드 `media/정리결과_요약.png`, 썸네일 `media/thumbnail.jpg` |
| `anim/` | 과정 애니메이션: `prep.py`(사진·data.js) → `render.py 1920 1080 …` / `render.py 1080 1920 …` |
| `long/` | 롱폼: `script.js`(장·자막·대본) + `long.html` → `render_long.py 프레임폴더 [시작 끝]` → `compose.py 프레임폴더 출력.mp4` |
| `narration/make.py` | 음성용 대본 `narration-*.txt` (구간 시간, 한글 읽기, 초당 6글자 검사, 긴 쉼 검사) |

순서: `make_data.py` → `test_all.py` → `make_images.py` → `anim/prep.py` → 애니메이션·롱폼 렌더 → `narration/make.py`
준비: `cargo install czkawka_cli --locked`(12.0.2), `pip install piexif scikit-image pillow numpy`, ffmpeg(비슷한 영상 찾기·시연 영상 만들기)
사진: scikit-image 예제 사진(고양이 chelsea·커피 coffee CC0, 로켓 rocket 퍼블릭 도메인)과 직접 그린 그림만 사용
