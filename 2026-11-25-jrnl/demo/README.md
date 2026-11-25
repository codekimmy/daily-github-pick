# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `bench.py` | 빈 가상 환경 설치 시간·함께 설치되는 프로그램 → 처음 실행 질문 3개 → ① 한 줄 쓰기·날짜 표현(yesterday·날짜·last monday·한글 '어제') ② 꼬리표·별표·글자·기간 찾기, `--tags` ③ md·JSON·txt 내보내기 ④ `--encrypt`(pexpect로 암호 입력) 후 파일 모양·틀린 암호 3번·맞는 암호 ⑤ 일기장 여러 개 ⑥ 가상 일기 10년치 3,650개 찾기 시간 → `results.json`. HOME을 `/tmp/jrnl-bench/…`로 바꿔 실제 설정과 섞이지 않게 함. 일기·암호는 모두 시연용 가상 자료 |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`, 날짜 폴더에서) |
| `tools_win/한줄일기.bat` | Windows용: 두 번 누르면 한 줄을 묻고 `jrnl.main.run([글])`로 저장(글은 환경 변수로 넘겨 `& % "`도 그대로) → 최근 5개 표시. 안 파이썬 명령은 리눅스에서 같은 방식으로 확인, .bat 자체는 Windows 실행 확인 전 |
| `mkdata.py` | results.json → `render/data.js` (RES) |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-24-segno 도구를 고쳐 씀) |
| `render/page.html` · `render/scenes.js` | 모션 스타일 키트(`tools/motion`, GUIDE 5-4): 롱폼 14개 장 + 숏폼 5장면 모두 직접 만든 장면, 엔딩 뺀 모든 장에 냥봇 |
| `render/thumb.html` · `render/thumbs.js` | 썸네일 2장 + 블로그 그림 3장 (`python3 ../../../tools/motion/render_thumbs.py`) |

순서: `python3 bench.py` → `python3 mkdata.py` → `python3 build.py` → (demo/render 폴더에서) 썸네일·블로그 그림 `python3 ../../../tools/motion/render_thumbs.py` → 확인 화면 `python3 ../../../tools/motion/render_motion.py long ../work/chk --only 20,57,…,last` (`work/`는 커밋하지 않음)
환경: 리눅스, 파이썬 3.13, jrnl 4.6, pexpect, asciinema + agg, 한글 글꼴 Noto Sans CJK

## 영상 제작 단계 (운영자 대사 점검·녹음 뒤, `tools/DAILY_TASK.md` 맨 아래)
1. 고친 대사를 `script.py`에 반영 → `python3 build.py`
2. 음성 도구는 `2026-11-24-segno/demo/voice/`를 `voice/`로 복사(`split.py`, `place.py`, `calm_bgm.py`, `add_bgm.py`) → `voice/split.py 음성.mp3 long` → `python3 build.py voice` → `render/page-voice.html`(page.html 사본, timing-voice.js 읽기)로 렌더링 (`build.py`의 voice 모드는 segno 것 그대로)
3. 렌더 결과는 `work/`, 완성 mp4는 커밋하지 않고 운영자에게 바로 전달 (`jrnl-long-voice-bgm.mp4` 등)
