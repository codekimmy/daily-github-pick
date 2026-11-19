# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `bench.py` | 가상 비밀 일기·가상 가족 사진 6장(scikit-image CC0)·무작위 데이터 100MB·1GB를 만들고 rage로 열쇠 만들기 / 잠그기 / 열기 / 틀린 열쇠 / 1바이트 바꾸기·끝 자르기 / 받는 사람 2명 / 암호 문장(-p, pexpect로 입력) / tar 묶음 / 큰 파일 속도 / 덮어쓰기를 측정 → `results.json`, 작업 파일은 `work/`(커밋하지 않음) |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`, bench.py 실행 뒤) |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-19-gifski 도구를 고쳐 씀) |
| `render/` | `engine.js`(그리기 도구 + 엔딩 유의사항) · `scenes.js`(장면, 연출: 도장 배지·설정별 막대 + 새 연출 '자물쇠 잠그기' `lockDoc`·`padlock`·`keyIcon`·`term`) · `data.js`(results.json + 화면용 글 일부) · `img/photo_*.png`(가상 가족 사진 축소본) · `page.html`(크로스페이드·자막) · `render.py`(프레임 → ffmpeg, 24fps) · `thumb.html`·`thumb.py`(썸네일) |

순서: `cargo install rage` → `python3 bench.py` → `bash ../../tools/record_terminal.sh demo/demo.sh media/terminal.gif`(날짜 폴더에서) → `build.py` → `render/render.py long ../../media/rage-long.mp4` · `render/render.py anim ../../media/rage-anim.mp4 1920 1080` · `… anim ../../media/rage-anim-vertical.mp4 1080 1920` → `render/thumb.py`
GIF: `ffmpeg -i media/rage-anim.mp4 -vf "fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=none" media/rage-anim.gif`
준비: `cargo install rage`(리눅스 약 89초), `pip install asciinema playwright scikit-image pexpect`, ffmpeg, agg, Noto Sans CJK 글꼴
주의: 리눅스에 pinentry(암호 입력 창 프로그램)가 있으면 `rage -p`가 그 창을 띄우므로 bench.py는 PATH에서 빼고 실행함 (Windows처럼 명령 창 안에서 물어봄)
