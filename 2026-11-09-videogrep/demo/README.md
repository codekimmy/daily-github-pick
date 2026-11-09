# demo 폴더 안내

| 파일 | 하는 일 |
|---|---|
| `폴더에서찾기.py` | 폴더 안 모든 영상(같은 이름 .srt가 있는 것)에서 낱말을 찾아 `찾은장면_낱말.csv`(엑셀에서 열림)로 저장, `--make`면 장면을 이어 붙인 영상도. `python 폴더에서찾기.py D:\영상 시험`. 리눅스에서 확인, 영상 2개 0.02초 |
| `tools_win/장면모으기.bat` | 영상 폴더에 넣고 두 번 누르면 영상 이름·낱말을 물어본 뒤 `모음_낱말.mp4`를 만듦. **Windows 실행 확인 전** |
| `make_videos.py` + `tts.mjs` | 시연용 가상 영상 2개(가상 요리 강의 2분 31초·회의 1분 36초)와 같은 이름 자막(.srt) 만들기. 목소리는 npm `espeak-ng`(인터넷·모델 없이 도는 기계 음성), 화면 오른쪽 위에 원본 시각 표시. 실제 기관·사람과 관련 없음 |
| `test_all.py` | 측정 전체(찾기만 3번 실행 가운데 값, 영상 만들기 1번, 장면 수·결과 길이, 옵션, 안 되는 경우, 30분 영상) → `results.json` |
| `results.json` | 모든 시연 수치 (설치 시간·자동 받아쓰기·폴더 예제는 따로 잰 값을 덧붙임) |
| `demo.sh` | 터미널 녹화용 (`media/terminal.gif`) |
| `anim/` | 30초 과정 애니메이션 (가로·세로): `prep.py` → `data.js`, `engine.js`(플레이어·타임라인 그리기), `anim.html`, `render.py` / `images.html`은 썸네일. `fr/`(결과 영상에서 뽑은 프레임)은 `prep.py` 설명의 ffmpeg 명령으로 다시 만들 수 있어 올리지 않음 |
| `long/` | 롱폼 본편(`script.js` 대본, `long.html`, `render_long.py`) + 미리보기를 `compose.py`로 합침 |
| `narration/make.py` | 음성용 대본 만들기 (구간 시간, 한글 읽기, 초당 6글자 검사) |
| `make_images.py` | 썸네일 |

`work/`에는 가상 영상·자막, `work/out/`에는 videogrep이 실제로 만든 결과(영상·.vtt·.xml·.m3u)가 있습니다. 30분 영상(`긴강의.mp4`)과 그 결과, 장면별 파일(`out/clips/`)은 용량 때문에 올리지 않았습니다(`test_all.py`가 다시 만듦).
설치 시간은 새 폴더에 `pip install --no-cache-dir --target`으로 1번 잰 값입니다(19.0초·315MB). 새 가상 환경(venv) 안 설치는 5분 넘게 끝나지 않아 중단했습니다.
터미널 GIF는 agg 대신 `tools/cast2gif.py`로 만들었습니다(agg는 한글 글자 사이가 벌어져 보임).
