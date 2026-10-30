# demo — 직접 만든 시연 자료와 스크립트

| 파일 | 하는 일 |
|---|---|
| **`password-check.html`** | **한국어 비밀번호 계산기 (더블클릭, 인터넷 없이 동작)** — zxcvbn 4.4.2(MIT) + 한국어 화면을 한 파일에 담음 |
| `page/` | 계산기 만들기: `python3 build.py <node_modules/zxcvbn/dist/zxcvbn.js>` (`template.html` + `ko.js` 합치기) |
| `check_password.py` (+`check_password_lib.py`) | cmd용 확인 도구 (입력이 화면에 안 보임, Windows에서도 동작하도록 작성) |
| `compare.py` | 예시 비밀번호 여러 개 한 번에 비교 |
| `test_all.py` | 테스트 비밀번호 12개 → `results.json` |
| `shot_page.py` | 인터넷을 막은 브라우저로 계산기를 열어 캡처 (`media/page-*.png`) + 외부 요청 확인 |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh 2026-10-31-zxcvbn/demo/demo.sh 2026-10-31-zxcvbn/media/terminal.gif`) |
| `anim/` | 과정 애니메이션: `python3 prep.py` → `python3 render.py 1920 1080 out.mp4` / `1080 1920` |
| `long/` | 롱폼: `python3 rec_page.py clips` → `CLIPS=clips python3 render_long.py <프레임폴더> [시작 끝]` → `python3 compose.py <프레임폴더> ../../media/zxcvbn-anim.mp4 out.mp4` |
| `narration/make.py` | 음성용 대본 (`long/script.js` 기준) |
| `thumbnail.py` | 썸네일 |

화면 속 비밀번호와 이름(minsu)은 모두 시연용 예시입니다.
