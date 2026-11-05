# demo 폴더 안내

| 파일 | 하는 일 |
|---|---|
| `가계부열기.bat` | Windows용 끌어다 놓기 파일. 장부(.beancount)를 아이콘 위로 끌어다 놓으면 `bean-check`로 검사한 뒤 fava 화면을 브라우저로 엽니다. Windows 실행 확인 전 |
| `make_ledger.py` | 시연용 가상 가계부 만들기 (`python3 make_ledger.py work/가계부.beancount` = 9개월, `... 120 2016` = 10년치). 사람·가게·금액은 모두 지어낸 것 |
| `test_all.py` | 측정 전체(설치 제외: 검사·켜기·화면 열기 시간, 월별 합계, 예산, 틀린 장부 3종, 바로 반영, CSV, 10년치, 3회 가운데 값) → `results.json` |
| `results.json` | 모든 시연 수치 |
| `capture.py` | 실제 Fava 화면 13장 캡처 → `../media/shots/` |
| `record_screen.py` | 실제 Fava 화면을 브라우저 자동 조작으로 녹화 → `../media/fava-screen.mp4` (끝에 유의사항 화면) |
| `demo.sh` | 터미널 녹화용 (`media/terminal.gif`) |
| `anim/` | 30초 과정 애니메이션 (가로·세로): `prep.py` → `data.js`, `engine.js`, `anim.html`, `render.py` |
| `long/` | 롱폼 본편(`script.js` 대본, `long.html`, `render_long.py`) + 미리보기를 `compose.py`로 합침 |
| `narration/make.py` | 음성용 대본 만들기 (구간 시간, 한글 읽기, 초당 6글자 검사) |
| `make_images.py` | 썸네일, 전/후 그림 |

`work/`에는 9개월 장부(`가계부.beancount`), 틀린 장부 3종, 쿼리로 받은 `월별식비.csv`를 넣었습니다. 10년치 장부(661KB)는 `python3 make_ledger.py work/10년가계부.beancount 120 2016`으로 다시 만들 수 있어 넣지 않았습니다.
설치 시간(5.9초)은 새 가상 환경에서 `pip install --no-cache-dir fava`로 따로 잰 값입니다.
