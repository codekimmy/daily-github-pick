# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `star_catch.py` | 시연용으로 만든 '별 줍기' 게임(49줄, 빈 줄·설명 빼고 40줄). `AUTO_PLAY=1`이면 컴퓨터가 화살표를 대신 누르고, `KFONT=글꼴 파일`이면 한글 제목 |
| `harness.py` | 녹화용 감싸개: 게임 파일을 고치지 않고 `pyxel.run`을 감싸 정해진 프레임마다 화면 PNG 저장, 끝 프레임에서 내장 녹화(`screencast`) GIF·`stats.json`(초당 장 수·CPU·메모리·점수) 저장 후 종료 |
| `ktest.py` · `bgm.py` | 한글 글자 시험(내장 글꼴 vs 글꼴 파일) · 자동 작곡 8가지 → WAV |
| `bench.py` | 새 가상 환경 설치 시간·크기 → 별 줍기 12초(글꼴 있음/없음) → 한글 → 자동 작곡 → 묶기·웹 변환 → 예제 개수 측정 → `results.json` (작업 파일은 `work/`, 커밋하지 않음) |
| `gallery.py` | Pyxel 제작자 예제(02·03·09·10·12·16)를 4~5초 실행해 화면 저장 → `work/gallery/` (다른 제작자의 완성 게임 `apps/`는 화면을 쓰지 않음) |
| `mkdata.py` | results.json + WAV 파형 + 게임 코드 → `render/data.js` |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`, 날짜 폴더에서) |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-20-rage 도구를 고쳐 씀) |
| `render/` | `engine.js`(그리기 도구 + 엔딩 유의사항) · `scenes.js`(장면, 연출: 바탕 격자 + 픽셀 글꼴, 도장 배지 + 새 연출 '게임기 화면' `handheld`·'16색 크레파스' `pal16`·'소리 4줄 파형' `wave`·코드 창 `code`) · `img/`(실행 화면, `img/seq/`는 별 줍기 프레임 180장 — bench.py 뒤 `cp work/star/f*.png render/img/seq/`) · `page.html` · `render.py` · `thumb.html`·`thumb.py` |

순서 (가상 화면 필요: `Xvfb :9 -screen 0 1280x800x24 &`):
`pip install pyxel` → `python3 bench.py` → `python3 gallery.py` → `pyxel edit`(work/ed.pyxres) 화면 캡처 → `cp work/star/f*.png render/img/seq/` → `python3 mkdata.py` → `python3 build.py` → `render/render.py long ../../media/pyxel-long.mp4` · `render/render.py anim ../../media/pyxel-anim.mp4 1920 1080` · `… anim ../../media/pyxel-anim-vertical.mp4 1080 1920` → `render/thumb.py`
GIF: `ffmpeg -i media/pyxel-anim.mp4 -vf "fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=none" media/pyxel-anim.gif`
환경: `DISPLAY=:9 SDL_AUDIODRIVER=dummy`(소리 장치 없음), 한글 글꼴 `/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc`
