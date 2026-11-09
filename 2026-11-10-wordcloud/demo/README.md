# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `make_data.py` | 시연용 가상 자료 만들기 → `work/제주여행_단톡방.txt`(600줄), `work/카페_손님의견.txt`(150줄), `work/market.txt`(영어) |
| `test_all.py` | 시연 측정 → `results.json`, 결과 그림 `work/out/*.png`, 낱말 순위 `work/out/낱말순위.csv` |
| `카톡구름.py` | 활용 예제: 카톡 '대화 내보내기' 파일(또는 아무 글 파일) → 명사만 센 낱말 구름 + 순위 CSV |
| `tools_win/낱말구름.bat` | Windows용: 파일 이름·뺄 말을 물어보고 `카톡구름.py` 실행 (실행 확인 전) |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`) |
| `anim/` | 과정 애니메이션: `prep.py`(재료 그림·data.js) → `render.py 1920 1080 …` / `render.py 1080 1920 …` |
| `long/` | 롱폼: `script.js`(장·자막·대본) + `long.html` → `render_long.py 프레임폴더 [시작 끝]` → `compose.py 프레임폴더 출력.mp4` |
| `narration/make.py` | 음성용 대본 `narration-*.txt` (구간 시간, 한글 읽기, 초당 6글자 검사) |
| `make_images.py` | 썸네일 `media/thumbnail.jpg` |

순서: `make_data.py` → `test_all.py` → `anim/prep.py` → 애니메이션·롱폼 렌더 → `narration/make.py`
글꼴: 리눅스는 Noto Sans CJK, Windows는 `C:\Windows\Fonts\malgun.ttf`(맑은 고딕)
