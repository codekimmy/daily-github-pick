# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `mksample.py` → `sample/` | 시연용 가상 그림·쪽지를 코드로 만듦 (가을산책.png 1280×720 · 같은 그림 .jpg · 가상 쪽지.txt 149바이트). 사진 아님 |
| `bench.py` | 새 가상환경에 Stegano 3.0.0 설치(시간·함께 설치되는 것·크기) → ① 숨기기·꺼내기(바뀐 점·색 번호 차이·PSNR) ② 파일 통째로·얼마나 들어가나 ③ 옮기거나 바꾸면 남나(복사·PNG·WebP·JPG 95/100·1% 줄이기·자르기)·.jpg 결과·JPG 입력 ④ `-g` 숨기는 차례 ⑤ 검사 그림(parity) ⑥ 큰 그림·20장·파이썬 코드·`py -c` 방식 ⑦ 오류 문구 → `results.json`, 결과 그림은 `render/img/`. 작업 폴더 `/tmp/stegano-bench` |
| `mkzoom.py` | bench.py 다음: `render/img/orig.png`·`secret.png`에서 맨 위 줄 앞 12개 점 색 번호(`row0`)를 results.json에 더하고, 바뀐 곳 지도 `render/img/diffmark.png`를 만듦 (시연 숫자는 바꾸지 않음) |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`, 날짜 폴더에서, `stegano-lsb`가 PATH 에 있어야 함) |
| `tools_win/비밀쪽지.bat` | Windows용: 그림을 끌어다 놓으면 1 = 쪽지 숨기기(`이름_비밀.png`, 있으면 덮어쓸지 물음) / 2 = 쪽지 꺼내기. 안 실행 방식(`py -c`, 쪽지 글은 환경 변수로)은 리눅스에서 확인, .bat 자체는 Windows 실행 확인 전 |
| `mkdata.py` | results.json → `render/data.js` (RES) |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-27-glitch-this 도구를 고쳐 씀) |
| `render/img/*` | Stegano 가 실제로 만든 결과 그림 (orig·secret·long100k, parity-* = 검사 그림, diffmap·diffmark = 바뀐 곳 지도, zoom-* = 맨 위 32×6 점 확대) |
| `render/page.html` · `render/scenes.js` | 모션 스타일 키트(`tools/motion`, GUIDE 5-4): 롱폼 14개 장 + 숏폼 5장면 모두 직접 만든 장면, 엔딩 뺀 모든 장에 냥봇 |
| `render/thumb.html` · `render/thumbs.js` | 썸네일 2장 + 블로그 그림 3장 (`python3 ../../../tools/motion/render_thumbs.py`) |

순서: `python3 mksample.py` → `python3 bench.py` → `python3 mkzoom.py` → `python3 mkdata.py` → `python3 build.py` → (demo/render 폴더에서) `python3 ../../../tools/motion/render_thumbs.py` → 확인 화면 `python3 ../../../tools/motion/render_motion.py long ../work/chk --only 7.9,48.6,…,last` (`work/`는 커밋하지 않음)
환경: 리눅스, 파이썬 3.13, Stegano 3.0.0(opencv-python 5.1.0.95 · numpy 2.5.5 · Pillow 12.3.0), asciinema + cast2gif.py, 한글 글꼴 Noto Sans CJK
주의: bench.py 를 다시 돌리면 시간 숫자가 조금씩 달라짐 → script.py 대본 속 읽는 숫자(영 쩜 이이 초 등)도 results.json 에 맞춰 고칠 것

## 영상 제작 단계 (운영자 대사 점검·녹음 뒤, `tools/DAILY_TASK.md` 맨 아래)
1. 고친 대사를 `script.py`에 반영 → `python3 build.py`
2. 음성 도구는 `2026-11-25-jrnl/demo/voice/`를 `voice/`로 복사(`split.py`, `place.py`, `calm_bgm.py`, `add_bgm.py`) → `voice/split.py 음성.mp3 long` → `python3 build.py voice` → `render/page-voice.html`(page.html 사본, timing-voice.js 읽기)로 렌더링
3. 렌더 결과는 `work/`, 완성 mp4는 커밋하지 않고 운영자에게 바로 전달 (`stegano-long-voice-bgm.mp4` 등)
