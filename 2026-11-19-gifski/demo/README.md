# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `make_clips.py` | 시연용 원본 영상 3개(480×320, 초당 20장, 5초) → `src/`: 커피잔 사진(scikit-image CC0) 천천히 확대 `photo.mp4`, 직접 그린 노을 `sunset.mp4`, 직접 그린 메모장 타이핑 `screen.mp4` |
| `bench.py` | 원본 3개를 ffmpeg 기본 / ffmpeg 팔레트 2단계 / gifski(-Q 90·70·50, --fast, --extra)로 GIF 변환 → 크기·시간·닮은 정도(SSIM·PSNR)·50번째 장면 색 개수 → `results.json`, 결과 GIF는 `out/`(커밋하지 않음, 다시 만들 수 있음) |
| (인라인) | 커피잔 영상 `-W 320`·`-r 10`·조합 크기 → `results_extra.json` |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`) |
| `prep_img.py` | 영상에 쓸 장면 꺼내기 → `render/img/` (재생용 `render/img/seq/`는 커밋하지 않음) |
| `make_data.py` | 영상용 `render/data.js`(측정값) |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-17-genact 도구를 고쳐 씀) |
| `render/` | `engine.js`(그리기 도구 + 엔딩 유의사항) · `scenes.js`(장면, 연출: 돋보기 확대 비교·설정별 막대·도장 배지 + 새 연출 '크레파스 상자' `crayons`) · `page.html`(크로스페이드·자막) · `render.py`(프레임 → ffmpeg, 24fps) · `thumb.html`·`thumb.py`(썸네일) |

순서: `cargo install gifski` → `make_clips.py` → `bench.py` → `prep_img.py` → `make_data.py` → `build.py` → `render/render.py long ../../media/gifski-long.mp4` · `render/render.py anim ../../media/gifski-anim.mp4 1920 1080` · `… anim ../../media/gifski-anim-vertical.mp4 1080 1920` → `render/thumb.py`
GIF: `ffmpeg -i media/gifski-anim.mp4 -vf "fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=none" media/gifski-anim.gif`
준비: `cargo install gifski`(리눅스 39초), `pip install asciinema playwright scikit-image`, ffmpeg, agg, Noto Sans CJK 글꼴
