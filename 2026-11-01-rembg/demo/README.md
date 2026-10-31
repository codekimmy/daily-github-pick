# demo — rembg 테스트·영상 제작 파일

| 파일 | 하는 일 |
|---|---|
| `drag_remove_bg.bat` | **Windows용 끌어다 놓기 파일.** 사진을 이 아이콘 위에 놓으면 `이름_nobg.png`(투명)·`이름_white.png`(흰 배경) 생성 (먼저 `pip install "rembg[cpu,cli]"`) |
| `info.py` | 결과 PNG의 크기와 주인공·투명 비율 확인: `python info.py 결과.png` |
| `test_all.py` | 모델 4종 × 사진 3장 테스트 + 흰 배경·새 배경·테두리 다듬기·마스크 → `out/`, `results.json` |
| `input/` | 테스트 사진 (scikit-image 예제: cat·coffee CC0, rocket 퍼블릭 도메인) |
| `out/` | 실제 결과물 |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh`) |
| `anim/` | 30초 과정 애니메이션 (`python3 prep.py` → `python3 render.py 1920 1080 out.mp4`) |
| `long/` | 롱폼 본편 (`render_long.py` 프레임 → `compose.py`로 미리보기와 합치기) |
| `make_images.py` | 전후 비교·모델 비교·수염 확대·썸네일 |
| `narration/make.py` | 음성용 대본 생성 |
