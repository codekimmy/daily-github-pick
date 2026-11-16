# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `test_all.py` | genact는 명령 창(터미널)이 있어야 실행되므로 `script`로 가상 명령 창(가로 100칸)을 붙여, 21가지 장면(모듈)을 한 번씩 실행(`--exit-after-modules 1`, 90초에서 중단)한 시간·줄 수 + 속도 배율 → `results.json` (`test.log`는 진행 기록) |
| `test_extra.py` | 추가 측정 → `results_extra.json`: 장면을 섞어 30초 실행한 CPU 시간·메모리, `-s 1·5·20`의 10초 줄 수, 빈 폴더에서 download 10초 뒤 파일 수, 인터넷을 끊은 상태(`unshare -n`) 실행, 파이프로 넘길 때 |
| `record_clips.sh` → `clips.py` | 영상용 장면 12가지를 asciinema로 14초씩 녹화(`casts/*.cast`) → pyte로 다시 재생해 12분의 1초마다 화면 글자·색을 찍어 `render/clips.js` (영상 속 명령 창 = genact가 실제로 출력한 글자) |
| `tools_win/장면고르기.bat` | Windows용: genact 실행 파일과 같은 폴더에 두고 두 번 누르면 장면 번호(1~5)와 시간(분)을 물어본 뒤 실행 (Windows 실행 확인 전, 같은 옵션 `-m … --exit-after-time 1min`은 리눅스에서 확인: 60.5초에 종료) |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`) |
| `make_data.py` | 영상용 `render/data.js`(측정값) |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-16-vtracer 도구를 고쳐 씀) |
| `render/` | `engine.js`(그리기 도구 + 엔딩 유의사항) · `scenes.js`(장면, 연출: 바탕 격자·픽셀 글꼴·도장 배지(tools/kit) + 새 연출 '세트 뒷면 뒤집기' `flip`·`setBack`, 명령 창 그리기 `term`) · `page.html`(크로스페이드·자막) · `render.py`(프레임 → ffmpeg, 24fps) · `thumb.html`·`thumb.py`(썸네일) |

순서: `cargo install genact` → `test_all.py` · `test_extra.py` → `record_clips.sh` → `clips.py` → `make_data.py` → `build.py` → `render/render.py long ../../media/genact-long.mp4` · `render/render.py anim ../../media/genact-anim.mp4 1920 1080` · `… anim ../../media/genact-anim-vertical.mp4 1080 1920` → `render/thumb.py`
GIF: `ffmpeg -i media/genact-anim.mp4 -vf "fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=none" media/genact-anim.gif`
준비: `cargo install genact`(리눅스 빌드 90초), `pip install asciinema pyte playwright`, ffmpeg, agg, Noto Sans CJK 글꼴, 갈무리 글꼴(tools/kit/fonts)
