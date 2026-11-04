# demo 폴더 안내

| 파일 | 하는 일 |
|---|---|
| `자막맞추기.bat` | Windows용 끌어다 놓기 파일. 영상 1개 + 자막(.srt) 1개를 함께 골라 아이콘 위로 끌어다 놓으면 `자막이름_맞춤.srt`를 새로 만듭니다. Windows 실행 확인 전 |
| `make_assets.py`, `say.mjs` | 시연용 가상 자료 만들기: espeak-ng(npm, 오프라인)로 한국어 문장 10개를 읽힌 60초 가상 '라면 끓이는 법' 영상 + 정답 자막 + 틀어진 자막 3종 |
| `test_all.py` | 측정 전체(틀어진 자막 4종, 구간별 옵션, 소리 없는 영상, CP949 자막, 3회 가운데 값) → `results.json` |
| `test_extra.py` | 맞는 자막 기준 맞추기, `--max-offset-seconds 1` → `results.json`의 `extra` |
| `results.json` | 모든 시연 수치 (10분 영상 결과는 `long`) |
| `demo.sh` | 터미널 녹화용 (`media/terminal.gif`) |
| `anim/` | 30초 과정 애니메이션 (가로·세로): `prep.py` → `data.js`, `engine.js`, `anim.html`, `render.py` |
| `long/` | 롱폼 본편(`script.js` 대본, `long.html`, `render_long.py`) + 미리보기를 `compose.py`로 합침 |
| `narration/make.py` | 음성용 대본 만들기 (구간 시간, 한글 읽기, 초당 6글자 검사) |
| `make_images.py` | 썸네일, 고치기 전/후 그림 |

`work/`의 자막(.srt)과 `truth.json`은 저장소에 넣었고, 영상·소리 파일(약 50MB)은 다시 만들 수 있어 넣지 않았습니다. `python3 make_assets.py work` → `python3 test_all.py work`로 다시 만듭니다.
