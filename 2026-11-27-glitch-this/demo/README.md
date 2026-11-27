# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `mksample.py` → `sample/` | 시연용 가상 그림을 코드로 그림 (겨울바다.png 1280×720 · 포스터.jpg 1080×1350, 가상 촬영 정보 2개 · 움짤.gif 3장). 사진 아님 |
| `bench.py` | 새 가상환경에 glitch-this 1.0.3 설치(시간·함께 설치되는 것·크기) → 최신 버전 확인(인터넷 막은 경우 포함) → ① 세기 1·5·10(원본과 달라진 화소 비율) ② 색 어긋남·줄무늬(평균 밝기)·씨앗 번호 ③ GIF(장 수·재생 시간·씨앗과 함께) · GIF 넣기 ④ JPG·촬영 정보·확장자 ⑤ 4000×3000 큰 그림·GIF 10장·그림 20장·파이썬 코드 ⑥ 오류 문구(같은 이름·세기 범위·없는 파일·GIF·띄어쓰기) → `results.json`, 결과 그림은 `render/img/`. 작업 폴더 `/tmp/glitch-bench` |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`, 날짜 폴더에서, `glitch_this`가 PATH 에 있어야 함) |
| `tools_win/지직효과.bat` | Windows용: 그림을 끌어다 놓으면 `이름_지직.png`(또는 .jpg) 또는 `이름_지직.gif` (있으면 덮어쓸지 물음). 안 실행 방식(`py -c` 로 glitch-this 직접 실행, `-o 이름.x`)은 리눅스에서 확인, .bat 자체는 Windows 실행 확인 전 |
| `mkdata.py` | results.json → `render/data.js` (RES) |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-26-pandoc 도구를 고쳐 씀) |
| `render/img/*` | glitch-this 가 실제로 만든 결과 그림 (orig·lv1·lv5·lv10·color·scan·both·poster, gif0~7 = 움직이는 GIF 의 0·3·…·21번째 장) |
| `render/page.html` · `render/scenes.js` | 모션 스타일 키트(`tools/motion`, GUIDE 5-4): 롱폼 14개 장 + 숏폼 5장면 모두 직접 만든 장면, 엔딩 뺀 모든 장에 냥봇 |
| `render/thumb.html` · `render/thumbs.js` | 썸네일 2장 + 블로그 그림 3장 (`python3 ../../../tools/motion/render_thumbs.py`) |

순서: `python3 mksample.py` → `python3 bench.py` → `python3 mkdata.py` → `python3 build.py` → (demo/render 폴더에서) `python3 ../../../tools/motion/render_thumbs.py` → 확인 화면 `python3 ../../../tools/motion/render_motion.py long ../work/chk --only 8,20,38,…` (`work/`는 커밋하지 않음)
환경: 리눅스, 파이썬 3.13, glitch-this 1.0.3(numpy 2.5.5 · Pillow 13.0.0), asciinema + cast2gif.py, 한글 글꼴 Noto Sans CJK
주의: 씨앗 번호 없는 측정(GIF 크기·시간 등)은 돌릴 때마다 조금씩 달라짐 → 다시 돌리면 대본·그림 숫자도 data.js 를 따라 바뀜

## 영상 제작 단계 (운영자 대사 점검·녹음 뒤, `tools/DAILY_TASK.md` 맨 아래)
1. 고친 대사를 `script.py`에 반영 → `python3 build.py`
2. 음성 도구는 `2026-11-25-jrnl/demo/voice/`를 `voice/`로 복사(`split.py`, `place.py`, `calm_bgm.py`, `add_bgm.py`) → `voice/split.py 음성.mp3 long` → `python3 build.py voice` → `render/page-voice.html`(page.html 사본, timing-voice.js 읽기)로 렌더링
3. 렌더 결과는 `work/`, 완성 mp4는 커밋하지 않고 운영자에게 바로 전달 (`glitch-this-long-voice-bgm.mp4` 등)
