# demo — 직접 만든 스크립트

앱 코드는 실행하지 않고, Word Atlas가 공개한 데이터(단어 JSON·그림 webp·발음 mp3, CC BY 4.0)만 읽습니다.

| 파일 | 하는 일 |
|---|---|
| `stats.py` | 단어·예문·그림·녹음 개수 세기 (`py stats.py word-atlas`) |
| `make_deck.py` | 수준·주제로 단어를 골라 A4 그림 단어카드 + 빈칸 퀴즈(HTML/PDF) + Anki CSV 만들기 |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`) |
| `thumbnail.py` | 썸네일 |
| `anim/` | 과정 애니메이션: `python3 prep.py <word-atlas>` → `python3 render.py 1920 1080 out.mp4` / `1080 1920` |
| `long/` | 롱폼: `python3 render_long.py <프레임폴더> [시작 끝]` → `python3 compose.py <프레임폴더> ../../media/word-atlas-anim.mp4 out.mp4` |
| `narration/make.py` | 음성용 대본 (`long/script.js` 기준) |

그림·발음·뜻·예문 출처: Word Atlas contributors — CC BY 4.0 (크기·배치 변경)
