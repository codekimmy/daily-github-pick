# demo — 사양 체크 편 영상·썸네일 만드는 순서

> 이 모델(LTX-2.5)은 그래픽카드가 필요해 직접 실행하지 않았습니다. 여기 있는 것은 공식 자료의 숫자로 **사양 카드 애니메이션**을 그리는 코드뿐이며, 제작사 데모 영상·이미지는 쓰지 않았습니다.

| 파일 | 하는 일 |
|---|---|
| `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초·장 사이 1.4초)으로 시간 계산 → `render/timing.js`, `narration-*.txt` 4개 |
| `render/engine.js` | 그리기 도구(글·상자·체크 표시·그래픽카드 그림·메모리 막대) + 엔딩 유의사항 문구 |
| `render/scenes.js` | 장면별 그림 (롱폼 12장, 숏폼 5장면 가로·세로 공용) |
| `render/page.html` | 프레임 그리기: 자막 상자 이어 붙이기, 장 바뀔 때 0.6초 크로스페이드(검은 화면 없음) |
| `render/render.py` | 프레임을 찍어 바로 ffmpeg로 → `media/ltx2-spec-long.mp4`(1920×1080), `ltx2-spec-anim.mp4`(1920×1080), `ltx2-spec-vertical.mp4`(1080×1920), 24fps |
| `render/thumb.html` · `thumb.py` | `media/thumbnail.jpg`(1280×720), `media/thumbnail-shorts.jpg`(1080×1920) |

순서: `python3 demo/build.py` → `python3 demo/render/render.py anim media/ltx2-spec-vertical.mp4 1080 1920` → `… anim media/ltx2-spec-anim.mp4 1920 1080` → `… long media/ltx2-spec-long.mp4` → `python3 demo/render/thumb.py`
GIF: `ffmpeg -i media/ltx2-spec-anim.mp4 -vf "fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=none" media/ltx2-spec-anim.gif`
메모리별 막대 그림: `python3 demo/render/render.py long 폴더 --only 178.9` → `media/메모리별막대.png`
준비: `pip install playwright`, ffmpeg, Noto Sans CJK 글꼴
