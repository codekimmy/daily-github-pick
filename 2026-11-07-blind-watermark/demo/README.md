# demo 폴더 안내

| 파일 | 하는 일 |
|---|---|
| `글자도장.py` | 글자 비밀번호(`password_wm`)까지 쓰는 넣기·꺼내기 예제. `python 글자도장.py 넣기 photo.png "글자" stamp.png 5678` / `python 글자도장.py 꺼내기 stamp.png 136 5678`. Windows 실행 확인 전 |
| `prep_photos.py` | 시연용 사진 준비: scikit-image 예제 사진(고양이·커피 CC0, 우주인·로켓 퍼블릭 도메인) + 휴대폰 크기(4032×3024) 사진 |
| `test_all.py` | 측정 전체(넣기·꺼내기 시간, 원본과 차이, 망가뜨린 사진 15가지 × 2장, 비밀번호, 글자 길이, 용량, 그림 도장, 큰 사진, 명령어) → `results.json` |
| `results.json` | 모든 시연 수치 |
| `demo.sh` | 터미널 녹화용 (`media/terminal.gif`) |
| `anim/` | 30초 과정 애니메이션 (가로·세로): `prep.py` → `data.js`, `engine.js`, `anim.html`, `render.py` |
| `long/` | 롱폼 본편(`script.js` 대본, `long.html`, `render_long.py`) + 미리보기를 `compose.py`로 합침 |
| `narration/make.py` | 음성용 대본 만들기 (구간 시간, 한글 읽기, 초당 6글자 검사) |
| `make_images.py` | 썸네일, 전/후 그림 |

`work/`에는 예제 사진 4장, 도장 넣은 사진(`*_wm.png`), 차이 30배 그림, 로고 그림과 꺼낸 그림, `attacks/`(망가뜨린 사진)를 넣었습니다. 휴대폰 크기 사진(약 20MB)은 `prep_photos.py`로 다시 만들 수 있어 넣지 않았습니다.
설치 시간(약 30초)은 새 폴더에 `pip install --no-cache-dir --target`으로 3번 따로 잰 값입니다(33.3초·30.4초, 한 번은 3.5초로 유난히 빨랐습니다).
