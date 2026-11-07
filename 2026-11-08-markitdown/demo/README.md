# demo 폴더 안내

| 파일 | 하는 일 |
|---|---|
| `폴더변환.py` | 폴더 안 문서(docx·xlsx·pptx·pdf·html·csv·epub)를 한 번에 글 파일로 바꿔 `md` 폴더에 저장. `python 폴더변환.py D:\docs`. 리눅스에서 확인, 8개 0.4초 |
| `tools_win/폴더변환.bat` | 같은 일을 하는 Windows용 파일. 문서 폴더에 넣고 두 번 누르기. **Windows 실행 확인 전** |
| `make_docs.py` | 시연용 가상 문서 13개 만들기 (가상 꽃집 회의록·가계부·주민센터 발표·아파트 공지 PDF·스캔 PDF·CSV(cp949)·전자책·ZIP·글자 사진·100쪽 PDF·1만 줄 엑셀·50장 파워포인트). 실제 회사·사람과 관련 없음 |
| `test_all.py` | 측정 전체(문서마다 3번 변환한 시간 가운데 값, 글자 수, 표·제목·목록 수, NaN, 경고 줄 수, 파이썬 한 번에, HWP 오류, 변환기 목록) → `results.json` |
| `results.json` | 모든 시연 수치 (설치 시간·확인 개수는 따로 잰 값을 덧붙임) |
| `demo.sh` | 터미널 녹화용 (`media/terminal.gif`) |
| `anim/` | 30초 과정 애니메이션 (가로·세로): `prep.py` → `data.js`, `engine.js`(문서 모양·글 화면 그리기), `anim.html`, `render.py` / `images.html`은 썸네일·전/후 그림 |
| `long/` | 롱폼 본편(`script.js` 대본, `long.html`, `render_long.py`) + 미리보기를 `compose.py`로 합침 |
| `narration/make.py` | 음성용 대본 만들기 (구간 시간, 한글 읽기, 초당 6글자 검사) |
| `make_images.py` | 썸네일, 전/후 그림 |

`work/docs/`는 시연용 가상 문서, `work/out/`은 실제 변환 결과(.md)입니다.
설치 시간은 새 폴더에 `pip install --no-cache-dir --target`으로 1번 잰 값입니다(`markitdown[all]` 21.8초·330MB, 기본 `markitdown` 6.4초·162MB).
작업 공간에서는 GIF 변환 도구 agg 내려받기가 거부되어 `tools/cast2gif.py`(대체 도구)로 터미널 GIF를 만들었습니다.
