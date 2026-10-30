# 예비 후보 목록 (작업 공간에서 실제로 돌려 본 것만)

> 2026-10-30 조사. 5개 분야로 나눠 후보를 넓게 찾았고(인기 목록 + 꾸준히 유명한 것 + 호기심 자극형), **이 작업 공간에서 설치·실행해 결과물이 나온 것만** 실었다. 별 수는 조사 당시 대략값이므로 쓸 때 다시 확인한다.
> 매일 작업 때: 인기 목록에 조건(GUIDE 1장)에 맞는 후보가 없으면 이 목록에서 고른다. 쓴 항목은 `✅ Day N`으로 표시한다.
> 추천 칸: ⭐ = 숏폼 훅이 강하고 일반인 쓸모가 큰 1순위

## 작업 공간에서 확인된 조건 (2026-10-30)
- 됨: PyPI(pip), npm, crates.io(`cargo install`, 2 CPU라 빌드 35초~13분), `git clone`, raw.githubusercontent.com, GitHub 릴리스 파일 다운로드(rembg 모델 받기 성공)
- 안 됨: Hugging Face, Go 모듈 저장소(proxy.golang.org), apt, cdn.jsdelivr.net/gh, YouTube, 대부분의 지도·데이터 API, Google·Bing 음성 서버
- 클론한 저장소 코드를 빌드·실행(`npm run dev`, 저장소 안 `cargo build`)하면 보안 확인에서 거부됨 → **레지스트리(pip·npm·crates) 설치형**만 가능
- 그래픽카드 없음: 큰 AI 모델(이미지·음악·영상 생성)은 제외
- tesseract 한국어: `raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/kor.traineddata` 받아 `TESSDATA_PREFIX` 지정

## 사진·이미지·그림
| 추천 | 저장소 | 한 줄 | 만든 곳 | 별 | 설치 | 테스트 결과 | 숏폼 훅 | 쓸모 |
|---|---|---|---|---|---|---|---|---|
| ⭐ | danielgatis/rembg | 사진 배경 자동 지우기 | 브라질 | 2.5만 | pip `rembg[cli]` | `-m u2net` 11.9초(모델 176MB 받기 포함), `-m u2netp` 5.6초. 기본 모델(1GB)은 시간 초과 → 모델 지정 필수 | 누끼 따기 한 줄 | ★5 |
| ⭐ | x-hw/amazing-qr | 내 사진·GIF를 배경으로 한 QR코드 | 중국 | 1.1만 | pip `amzqr` | 0.14초, 스캔 성공, 움직이는 QR도 됨 | 이 그림이 QR이라고? | ★5 |
| ⭐ | guofei9987/blind_watermark | 눈에 안 보이는 워터마크 | 중국 | 1.5만 | pip `blind-watermark` | 1.4초, JPEG 재압축 후에도 문자 추출 | 사진 도용 잡는 투명 도장 | ★4 |
|  | MemeCrafters/meme-generator | 밈 템플릿 300종에 글·얼굴 합성 | 중국 | 1천 | pip `meme_generator` | 0.2~0.5초, 한글 짤·쓰다듬기 GIF. 템플릿 받으려면 config의 resource_url을 raw.githubusercontent로 변경 | 내 사진으로 짤 1초 | ★4 |
|  | KohakuBlueleaf/PixelOE | AI 없이 사진을 도트 그림으로 | 대만 | 542 | pip `pixeloe` | 5.2초 | 내 사진이 16비트 게임 속으로 | ★4 |
|  | visioncortex/vtracer | 그림을 확대해도 안 깨지는 SVG로 | 홍콩 | 7.4천 | pip `vtracer` (파이썬으로 호출) | 0.23초, path 36개 | 로고 무한 확대 | ★4 |
|  | amueller/word_cloud | 글에서 많이 나온 단어 구름 그림 | 독일 | 1만 | pip `wordcloud` | 0.6초, 한글은 Noto CJK 글꼴 지정 | 카톡 대화로 워드클라우드 | ★4 |
|  | TotallyNotChase/glitch-this | 사진을 고장 난 TV 효과 GIF로 | 개인 | 1.8천 | pip `glitch-this` | 2.6초 | 레트로 TV 고장 효과 | ★3 |
|  | Schroedinger-Hat/ImageGoNord | 사진 색감을 테마 팔레트로 | 이탈리아 | 936 | pip `image-go-nord` | 0.9초 | 바탕화면 색 통일 | ★3 |
|  | li-plus/seam-carving | 사물은 그대로 두고 사진 비율만 줄이기 | 중국 | 119 | pip `seam-carving` | 800→500px 23초 | 사진 가운데만 쏙 | ★3 |
|  | lovell/sharp (sharp-cli) | 사진 용량 줄이기·WebP 변환 | 영국 | 3.3만 | npm `sharp-cli` | 0.29초, 21.7KB→1.9KB | 용량 10분의 1 | ★3 |
|  | ImageOptim/gifski | 영상·사진을 고화질 GIF로 | 영국 | 5.7천 | crates `gifski` | 빌드 100초, 변환 0.4~0.8초 | GIF가 이렇게 선명? | ★4 |
|  | cedricbonhomme/Stegano | 사진 속에 비밀 글 숨기기 | 룩셈부르크 | 594 | pip `stegano` | 0.4초. 한글은 `-e UTF-32LE` 필요 | 이 사진엔 편지가 숨어 있다 | ★3 |
|  | sepandhaghighi/samila | 수학 공식으로 추상화 그리기 | 이란 | 1.2천 | pip `samila` | 6~12초 | 시드 하나가 세상에 하나뿐인 그림 | ★3 |
|  | oxipng/oxipng · sharkdp/pastel | PNG 무손실 압축 · 색 섞기 계산기 | 커뮤니티·독일 | 4.3천·6.5천 | crates | 성공 | 단독으로는 약함 | ★2 |

## 영상·음악·소리
| 추천 | 저장소 | 한 줄 | 만든 곳 | 별 | 설치 | 테스트 결과 | 숏폼 훅 | 쓸모 |
|---|---|---|---|---|---|---|---|---|
| ⭐ | WyattBlue/auto-editor | 영상에서 말 없는 구간 자동 컷 | 미국 | 5.7천 | pip `auto-editor` | 15.0초→9.8초, 2.4초 | 편집 3시간을 명령 한 줄로 | ★5 |
| ⭐ | smacke/ffsubsync | 어긋난 자막 싱크를 소리 듣고 자동 보정 | 미국 | 7.9천 | pip `ffsubsync` | 2초 밀린 자막 → -1.99초 찾아 보정, 1.3초 | 자막 싱크 1초 해결 | ★5 |
| ⭐ | antiboredom/videogrep | 자막에서 단어 찾아 그 장면만 이어 붙이기 | 미국 | 3.5천 | pip `videogrep` | 6초 슈퍼컷, 3.2초 | '음…'만 모은 영상 | ★4 |
|  | timsainb/noisereduce | 녹음의 '쉬~' 잡음 제거 | 미국 | 1.9천 | pip `noisereduce` | 잡음 -34→-71dB, 0.66초 (실제 말소리로 재시연 필요) | 원룸 녹음을 스튜디오처럼 | ★4 |
|  | lagmoellertim/unsilence | 무음 구간 자르기·빨리 감기 | 독일 | 600 | pip `unsilence` (+`setuptools<80`) | 15.0→10.7초 | 강의 몰아보기 | ★4 |
|  | spotify/pedalboard | 소리에 리버브·피치·코러스 | 스웨덴 Spotify | 6.4천 | pip `pedalboard` | 0.55초 | Spotify 이펙터 공짜로 | ★3 |
|  | sergree/matchering | 좋아하는 곡 기준으로 자동 마스터링 | 개인 | 2.7천 | pip `matchering` | -32.4→-21.1 LUFS | 내 곡을 프로 곡처럼 | ★3 |
|  | slhck/ffmpeg-normalize | 여러 파일 소리 크기 맞추기 | 독일 | 1.5천 | pip `ffmpeg-normalize` | -21.8→-23.0 LUFS | 볼륨 들쭉날쭉 해결 | ★3 |
|  | adefossez/seewav | 음악을 춤추는 파형 영상으로 | 프랑스 | 300 | pip `seewav` | 15초 mp4, 7초 | 노래 하나로 비주얼라이저 | ★3 |
|  | espeak-ng/espeak-ng | 인터넷·모델 없이 한국어 읽어 주기 | 국제 커뮤니티 | 7천 | npm `espeak-ng` | 4.66초 WAV (발음 품질 귀로 확인 필요) | 오프라인 한국어 TTS | ★3 |
|  | s-macke/SAM | 1982년 로봇 목소리 합성기 | 미국(원작) | 1.5천 | npm `sam-js` | 0.2초 (귀로 확인 필요) | 40년 전 컴퓨터 목소리 | ★3 |
|  | aubio/aubio · Rainbow-Dreamer/musicpy · grumdrig/jsfxr | 튜너·박자 / 코드로 작곡 / 8비트 효과음 | 프랑스·중국·미국 | 3.8천·1.5천·300 | pip·pip·npm | 성공 | 마리오 코인 소리 만들기 등 | ★2 |

## 문서·PDF·생산성
| 추천 | 저장소 | 한 줄 | 만든 곳 | 별 | 설치 | 테스트 결과 | 숏폼 훅 | 쓸모 |
|---|---|---|---|---|---|---|---|---|
| ⭐ | marp-team/marp-cli | 메모장 글로 발표 슬라이드 PDF·PPTX | 일본 | 3.9천 | npm `@marp-team/marp-cli` | 3쪽 PDF 4초, 수정 가능한 PPTX 4.6초, 한글 OK (`--no-stdin` 필수) | 텍스트 10줄이 5초 만에 PPT | ★4 |
| ⭐ | tfeldmann/organize | 규칙대로 폴더 자동 정리 | 독일 | 3.2천 | pip `organize-tool` | 0.8초, 한글 파일명 OK, 중복도 알려 줌 | 다운로드 폴더 1초 정리 | ★4 |
| ⭐ | qarmin/czkawka | 중복·비슷한 파일 찾아 용량 확보 | 폴란드 | 3.5만 | crates `czkawka_cli` (빌드 13분) | 0.1초에 중복 2그룹 | '최종_진짜최종' 찾기 | ★4 |
|  | microsoft/markitdown | PDF·워드·엑셀·PPT를 텍스트로 | 미국 MS | 19만 | pip `markitdown[all]` | docx 1.9초(표·목록 유지), PDF 2.7초 | 문서를 ChatGPT용 글로 | ★4 |
|  | ocrmypdf/OCRmyPDF | 스캔 PDF를 검색되는 PDF로 | 미국 | 3.5만 | pip `ocrmypdf` (venv 권장) | 한글 영수증 7.4초, 일부 글자 깨짐 | 영수증 PDF가 Ctrl+F로 검색 | ★4 |
|  | simonhaenisch/md-to-pdf | 마크다운을 보고서 PDF로 | 독일 | 2천 | npm `md-to-pdf` | 4.1초, 한글 OK | 메모가 보고서처럼 | ★3 |
|  | rendercv/rendercv | 설정 파일 하나로 디자이너급 이력서 | 튀르키예 | 1.8만 | pip `rendercv<2` | 영문만 됨(한글 실패), 최신판은 다운로드 막힘 | 이력서 디자인 끝 | ★3 |

## 개인정보·보안·생활
| 추천 | 저장소 | 한 줄 | 만든 곳 | 별 | 설치 | 테스트 결과 | 숏폼 훅 | 쓸모 |
|---|---|---|---|---|---|---|---|---|
| ⭐ | ORB-HD/deface | 사진·영상 속 얼굴 자동 블러 | 독일 하이델베르크대 | 1.6천 | pip `deface` (모델 내장) | 0.8초, 얼굴만 정확히 블러 | 단톡방 올리기 전 모자이크 | ★5 |
| ⭐ | dropbox/zxcvbn | 내 비밀번호가 몇 초 만에 뚫리는지 | 미국 Dropbox | 1.6만 | pip `zxcvbn` | password1 '1초 미만' / 긴 문장 '수백 년' | 내 비번은 몇 초? | ★5 |
| ⭐ | beancount/fava | 텍스트 가계부를 차트 대시보드로 | 독일 | 2.6천 | pip `fava` | 가상 9개월 가계부 → 월별 막대그래프 화면 | 메모장 가계부가 대시보드로 | ★4 |
|  | thampiman/reverse-geocoder | 사진 GPS → 동네 이름 (오프라인) | 개인 | 1.9천 | pip `reverse_geocoder` | 가짜 남산 좌표 → Seoul, 0.6초 | 사진 한 장으로 사는 동네가 드러난다 | ★4 |
|  | RapidAI/RapidOCR | CPU에서 도는 OCR | 중국 | 8.4천 | pip `rapidocr_onnxruntime` | 영문·숫자 영수증 정확, **한글 못 읽음** | 영수증 → 가계부 | ★3 |
|  | str4d/rage (원본 age) | 파일을 열쇠로 잠그는 암호화 | 뉴질랜드 | 3.7천 | crates `rage` (빌드 4.5분) | 한글 일기 암호화·복원 | 비밀 일기 잠그기 | ★4 |
|  | heuer/segno · redacted/XKCD-password-generator | 와이파이 QR · 외우기 쉬운 비밀번호 | 독일·개인 | 800·1.4천 | pip `segno`·`xkcdpass` | 성공 | zxcvbn 편과 묶기 | ★3 |
|  | sml2h3/ddddocr | 보안문자(캡차) 읽는 AI | 중국 | 1.5만 | pip `ddddocr` | 5자 중 4자 | 캡차는 사람만 읽을까? | ★3 |
|  | ShieldMnt/invisible-watermark | AI 그림에 숨은 표식 | 미국 | 2천 | pip `invisible-watermark` | 파이썬 + dwtDctSvd 방식만 안정 | AI 그림의 숨은 도장 | ★3 |
|  | kerrickstaley/genanki · miurahr/pykakasi | Anki 카드 파일 만들기 · 일본어 한자 읽기 | 미국·일본 | 2.8천·500 | pip | 성공 | 여행 회화 카드 1초 | ★3 |

## 호기심·재미
| 추천 | 저장소 | 한 줄 | 만든 곳 | 별 | 설치 | 테스트 결과 | 숏폼 훅 | 쓸모 |
|---|---|---|---|---|---|---|---|---|
| ⭐ | svenstaro/genact | 아무것도 안 하면서 바쁜 척하는 가짜 작업 화면 | 독일 | 1.2만 | crates `genact` (윈도우 exe 있음) | 빌드 3분, 가짜 커널 컴파일 로그 | 상사 지나갈 때 켜두는 화면 | ★5 |
| ⭐ | kitao/pyxel | pip 한 줄로 8비트 레트로 게임 | 일본 | 1.9만 | pip `pyxel` | 예제 플랫포머 게임 화면 확인(Xvfb) | 패미컴 감성 게임 | ★5 |
| ⭐ | ChrisBuilds/terminaltexteffects | 글자가 해독·폭발하는 영화 효과 | 개인 | 4.3천 | pip `terminaltexteffects` | 14초 애니메이션 | 글자가 암호 해독되듯 | ★4 |
|  | unhappychoice/gitlogue | 코드 기록을 타이핑 영화처럼 재생 | 일본 | 5.2천 | crates `gitlogue` (빌드 7분) | 15초 녹화 | 8년 전 코드가 다시 타이핑된다 | ★4 |
|  | shinshin86/oh-my-logo | 거대한 그라데이션 글자 로고 | 일본 | 1.6천 | npm `oh-my-logo` | 즉시 출력 | 내 이름을 Claude Code 로고처럼 | ★4 |
|  | adamsky/globe · cowboy8625/rusty-rain | 터미널에서 도는 지구본 · 매트릭스 글자 비 | 개인 | 700·500 | crates `globe-cli`·`rusty-rain` | 회전(`-c 0.5 -g 0.5`)·글자 비 확인 | 글자로 만든 지구가 돈다 | ★4 |
|  | taichi-dev/taichi | 파이썬 30줄로 프랙털 애니메이션 | 중국 | 2.8만 | pip `taichi` | 60프레임 5.7초 | 무한 프랙털 | ★3 |
|  | peterbrittain/asciimatics | 터미널 불꽃놀이 | 영국 | 4.3천 | pip `asciimatics` | 직접 쓴 15줄 스크립트로 확인 | 터미널 불꽃놀이 | ★3 |
|  | git-truck/git-truck | 프로젝트 속을 버블 지도로 | 덴마크 | 800 | npm `git-truck` | 대시보드 화면 확인 | 프로젝트가 지도처럼 | ★3 |
|  | kraanzu/smassh · viblo/pymunk | 터미널 타자 게임 · 2D 물리(행성 궤도) | 인도·스웨덴 | 2.1천·1.1천 | pip | 화면 확인 | 공 100개가 궤도를 돈다 | ★2~3 |

## 안 되는 것 (다시 시도하지 않기)
- **모델 다운로드가 막힘**: whisper·piper·kokoro·demucs·spleeter, argos-translate(한국어 모델), PDFMathTranslate, AI 글 판별(Binoculars 등)
- **인터넷 서비스에 연결해야 함**: edge-tts, gTTS, yt-dlp·spotDL(YouTube), mapscii·prettymaps·osmnx(지도), starplot(별자리, DuckDB 확장 차단), wttr.in
- **Go 패키지 (proxy.golang.org 차단)**: pdfcpu, maaslalani/invoice, primitive, ascii-image-converter
- **시스템 라이브러리가 필요한데 apt가 막힘**: manim, silicon, tplay, trianglify
- **GUI 설치형이거나 클론해서 빌드해야 함**: Stirling-PDF, PhotoCraft, Concat, Umi-OCR, VoiceStudio, ComfyUI
- **기타**: pixelsort(Pillow 11과 호환 안 됨), @squoosh/cli(Node 22에서 크래시), pdfly(OpenSSL 인식 실패), pdf2docx(한글 띄어쓰기 사라짐), PyBoy(게임 ROM 없음)
