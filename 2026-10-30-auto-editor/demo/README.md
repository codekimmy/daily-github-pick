# demo — 직접 만든 시연 자료와 스크립트

| 파일 | 하는 일 |
|---|---|
| `make_lecture.py` (+`tts.mjs`) | 가상 강의 영상 만들기: `python3 make_lecture.py <작업폴더> <목소리.mp3>` — `lecture-lines.txt` 10문장을 읽은 녹음을 문장별로 잘라 침묵·슬라이드·원본 시계·파형을 입힘 (목소리 파일 없이 돌리면 espeak-ng 합성 음성, 시험용) |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`, lecture.mp4 있는 폴더에서) |
| `anim/` | 과정 애니메이션: `python3 prep.py <작업폴더>` → `python3 render.py 1920 1080 out.mp4` / `1080 1920` |
| `long/` | 롱폼: `python3 prep_clips.py <작업폴더>` → `CLIPS=<작업폴더>/clips python3 render_long.py <프레임폴더> [시작 끝]` → `python3 compose.py <프레임폴더> ../../media/auto-editor-anim.mp4 <작업폴더>/clips out.mp4` |
| `narration/make.py` | 음성용 대본 (`long/script.js` 기준) |
| `thumbnail.py` | 썸네일 |

시연 영상의 강의 내용은 직접 만든 가상 자료이고, 목소리는 운영자가 만든 음성입니다.
