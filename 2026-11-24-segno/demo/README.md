# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `bench.py` | 빈 폴더 설치 시간·함께 설치되는 프로그램 → ① 와이파이 QR(명령어·파이썬 도우미) ② 연락처 QR(MECARD·vCard) ③ 글 길이별 칸 수·한글 최대 글자 수·너무 긴 글 ④ 오류 정정 L·M·Q·H별 가운데 5~25% 가림 시험 ⑤ 색 5가지·흰 여백 0/4칸(어두운 바탕)·카메라 흉내(기울임·흐림·작게) ⑥ 마이크로 QR ⑦ 명령 1번·파이썬으로 1,000장 → `results.json`. 만든 QR은 모두 zxing-cpp 3.1.1로 읽어 넣은 글과 같은지 확인 (작업 파일은 `work/`, 커밋하지 않음). 와이파이·연락처는 모두 시연용 가상 자료 |
| `many_qr.py` | 영상 시연 ⑥의 파이썬 예제 4줄: 주소 끝 번호만 다른 QR 1,000장을 `qr_1000/`에 저장 (리눅스 약 2.2초) |
| `read.py` | 녹화용 보조 도구: QR 그림을 zxing-cpp로 읽어 크기·용량·읽은 내용 출력 |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`, 날짜 폴더에서) |
| `tools_win/와이파이QR.bat` | Windows용: 두 번 누르면 와이파이 이름·비밀번호를 묻고 `segno.helpers.make_wifi`로 `와이파이QR.png`(scale 20, 300dpi) 저장. 안 파이썬 명령은 리눅스에서 같은 방식(환경 변수로 전달, 특수 기호 비밀번호)으로 확인, .bat 자체는 Windows 실행 확인 전 |
| `mkdata.py` | results.json + segno로 만든 실제 QR 칸 배열 → `render/data.js` (영상·그림은 QR을 칸 배열로 직접 그림) |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-23-sharp-cli 도구를 고쳐 씀) |
| `render/` | **2026-11-24 다시 만듦 — 모션 스타일 키트(`tools/motion`, GUIDE 5-4)**: `page.html`(tools/motion/page-template.html 복사) · `scenes.js`(롱폼 14개 장 + 숏폼 5장면 모두 직접 만든 장면, 엔딩 뺀 모든 장에 냥봇) · `timing.js`·`data.js`(그대로) · `render.py`(옛 렌더러, 쓰지 않음) |
| `render/thumb.html` · `render/thumbs.js` | **2026-11-25 모션 스타일로 다시 만듦**: 썸네일 2장 + 블로그 그림 4장 (`python3 ../../../tools/motion/render_thumbs.py`) |
| `render-old/` | 처음 만든 남색 캔버스 버전(`engine.js`·`scenes.js`·`page.html`·`thumb.html`·`thumb.py`) 보관만, 쓰지 않음 |

순서: `python3 bench.py` → `python3 mkdata.py` → `python3 build.py` → (demo/render 폴더에서) `python3 ../../../tools/motion/render_motion.py long ../../media/segno-long.mp4` · `… anim ../../media/segno-anim-vertical.mp4 1080 1920` · `… anim ../../media/segno-anim.mp4 1920 1080` → 썸네일·블로그 그림은 `python3 ../../../tools/motion/render_thumbs.py`
GIF: `ffmpeg -i media/segno-anim.mp4 -vf "fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=none" media/segno-anim.gif`
환경: 리눅스, 파이썬 3, segno 1.6.6, zxing-cpp 3.1.1, Pillow, ffmpeg, 한글 글꼴 Noto Sans CJK
