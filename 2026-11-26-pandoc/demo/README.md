# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `sample/회의록.md` · `sample/기사.html` | 시연용 가상 문서 (가상 회의록 마크다운 · 가상 인터넷 기사) |
| `bench.py` | pandoc 3.14 리눅스 파일 받기·풀기 시간 → 형식 수(hwp 있는지) → ① 마크다운 → 워드(python-docx로 제목·표·굵은 글씨 세기, LibreOffice로 쪽수) ② 워드 → 마크다운, 웹 기사 → 워드 ③ 파워포인트(python-pptx로 슬라이드 세기)·전자책·웹페이지 ④ PDF 기본 오류 · typst 엔진 ⑤ 메모 50개·20만 자 보고서 ⑥ 덮어쓰기·서식 파일 ⑦ 오류 문구(없는 파일·hwp·띄어쓰기) → `results.json`. 작업 폴더 `/tmp/pandoc-bench` |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`, 날짜 폴더에서, pandoc·typst 가 PATH 에 있어야 함) |
| `tools_win/워드로바꾸기.bat` | Windows용: 파일을 끌어다 놓으면 .md·.txt·.html → `이름_변환.docx`, .docx → `이름_변환.md` (있으면 덮어쓸지 물음). 안 pandoc 명령은 리눅스에서 같은 옵션으로 확인, .bat 자체는 Windows 실행 확인 전 |
| `mkdata.py` | results.json → `render/data.js` (RES) |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-25-jrnl 도구를 고쳐 씀) |
| `render/img/*.jpg` | pandoc 이 만든 워드·파워포인트·PDF 를 LibreOffice·pdftoppm 으로 찍은 실제 결과 그림 (영상·썸네일에 씀) |
| `render/page.html` · `render/scenes.js` | 모션 스타일 키트(`tools/motion`, GUIDE 5-4): 롱폼 14개 장 + 숏폼 5장면 모두 직접 만든 장면, 엔딩 뺀 모든 장에 냥봇 |
| `render/thumb.html` · `render/thumbs.js` | 썸네일 2장 + 블로그 그림 3장 (`python3 ../../../tools/motion/render_thumbs.py`) |

순서: `python3 bench.py` → `python3 mkdata.py` → `python3 build.py` → (demo/render 폴더에서) `python3 ../../../tools/motion/render_thumbs.py` → 확인 화면 `python3 ../../../tools/motion/render_motion.py long ../work/chk --only 20,38,…` (`work/`는 커밋하지 않음)
환경: 리눅스, 파이썬 3.13, pandoc 3.14, typst 0.14.2, LibreOffice(결과 확인용), python-docx · python-pptx, asciinema + cast2gif.py, 한글 글꼴 Noto Sans CJK

## 영상 제작 단계 (운영자 대사 점검·녹음 뒤, `tools/DAILY_TASK.md` 맨 아래)
1. 고친 대사를 `script.py`에 반영 → `python3 build.py`
2. 음성 도구는 `2026-11-25-jrnl/demo/voice/`를 `voice/`로 복사(`split.py`, `place.py`, `calm_bgm.py`, `add_bgm.py`) → `voice/split.py 음성.mp3 long` → `python3 build.py voice` → `render/page-voice.html`(page.html 사본, timing-voice.js 읽기)로 렌더링
3. 렌더 결과는 `work/`, 완성 mp4는 커밋하지 않고 운영자에게 바로 전달 (`pandoc-long-voice-bgm.mp4` 등)
