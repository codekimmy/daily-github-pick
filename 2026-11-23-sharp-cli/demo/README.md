# demo — 시연 재료와 만드는 순서

| 파일 | 하는 일 |
|---|---|
| `make_photos.py` | 시연용 가상 사진 만들기: 컴퓨터로 그린 풍경 6장(4032 × 3024, JPG 화질 92) + 휴대폰처럼 EXIF(가상 기기 이름·촬영 시각·서울시청 근처 가상 GPS 좌표) → `photos/` (실제 사람·장소 사진 아님, 약 16MB라 커밋하지 않음 — 같은 씨앗값으로 다시 만들면 같은 사진) |
| `bench.py` | 새 폴더 설치 시간·함께 설치되는 프로그램 → ① 6장 가로 1600 ② 형식별(JPG·WebP·AVIF·PNG) 용량·닮은 정도(SSIM) ③ WebP 화질 값 95~20 ④ 위치 정보 기본 삭제·`-m` 유지 ⑤ 60장 ⑥ 정사각형 ⑦ HEIC 입력 ⑧ 원본 폴더로 내보내기(덮어쓰기) ⑨ 작은 사진 키우기 ⑩ 세로 사진(EXIF 방향 6)·`--autoOrient` ⑪ 파일 이름·결과 폴더 형태 → `results.json` (작업 파일은 `work/`, 커밋하지 않음) |
| `tools_win/사진작게.bat` | Windows용: 사진을 끌어다 놓으면 `sharp -i 파일 -o "작게만든사진/{name}.jpg" -q 80 --autoOrient resize 1600 1600 --fit inside --withoutEnlargement`로 원본 옆 `작게만든사진` 폴더에 저장. 안 명령은 리눅스에서 같은 옵션으로 확인, .bat 자체는 Windows 실행 확인 전 |
| `sizes.py` | 녹화용 보조 도구: 파일마다 가로×세로·용량·위치 정보 여부 출력 |
| `demo.sh` | 터미널 녹화용 (`tools/record_terminal.sh demo/demo.sh media/terminal.gif`, 날짜 폴더에서) |
| `mkdata.py` | results.json → `render/data.js`, 시연 결과 그림을 줄여 `render/img/`(가상 사진 6장·화질 값 확대·세로 사진·정사각형) |
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 말하는 시간(6.3글자/초, 최소 3초) + 쉼(1.1초 · 장 사이 1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-22-ffmpeg-normalize 도구를 고쳐 씀) |
| `render/` | `engine.js`(그리기 도구 + 엔딩 유의사항) · `scenes.js`(장면, 연출: 도장 배지·설정별 막대 비교·돋보기 확대 비교 + 새 연출 '진공 압축팩' `vacBag`) · `page.html` · `render.py` · `thumb.html`·`thumb.py`(썸네일 2장 + 블로그 그림 4장) |

순서: `python3 make_photos.py` → `python3 bench.py`(npm으로 sharp-cli 6.1.0을 work/에 설치) → `python3 mkdata.py` → `python3 build.py` → `render/render.py long ../../media/sharp-cli-long.mp4` · `render/render.py anim ../../media/sharp-cli-anim.mp4 1920 1080` · `… anim ../../media/sharp-cli-anim-vertical.mp4 1080 1920` → `render/thumb.py`
GIF: `ffmpeg -i media/sharp-cli-anim.mp4 -vf "fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=none" media/sharp-cli-anim.gif`
환경: 리눅스, Node.js 22, ffmpeg 6.1.1, 파이썬 Pillow·piexif·pillow-heif·scikit-image, 한글 글꼴 Noto Sans CJK
