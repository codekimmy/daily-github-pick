<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → ffmpeg-normalize 썸네일: 제각각인 소리 크기 막대 4개가 목표선 -23 LUFS로 모이는 그림과 '볼륨 제각각 → 2초 만에 같은 크기로' 글자
before-after.png → ffmpeg-normalize로 맞추기 전·후 가상 녹음 4개의 소리 크기 막대그래프, -42.1·-20.1·-28.6·-10.1 LUFS가 모두 -22.7~-23.1 LUFS로 바뀐 결과
ffmpeg-normalize-anim.gif → ffmpeg-normalize 과정 애니메이션: 제각각인 소리 크기 막대 4개가 -23 LUFS 선으로 모임 → 지휘자 그림 → 차이 32.0에서 0.4 → 영상 소리만 키움 → 설치 명령 순 화면
peak-vs-lufs.png → ffmpeg-normalize 기준 비교 그림: 귀 기준(LUFS)으로 맞춘 파형은 배경음악 막대가 가장 낮아도 4개 모두 -23 근처, 최고점으로 맞춘 파형은 -19.1~-9.8 LUFS로 9.3 차이가 나는 결과
terminal.gif → 명령 창에서 ffmpeg-normalize 1.45.2 확인 → 가상 녹음 4개 -42.1~-10.1 LUFS 막대 → 한꺼번에 맞추기 약 2초 → 4개 모두 -23 LUFS 근처가 된 터미널 화면
-->
# ffmpeg-normalize란? 녹음·영상 소리 크기를 한 번에 맞추는 무료 도구 사용법 총정리 (설치법 포함)

> **한 줄 요약** — 여러 소리 파일을 끝까지 한 번 듣고, 사람 귀가 느끼는 크기가 모두 같아지도록 키우거나 줄여 주는 무료 명령어 도구입니다.
> ⭐ 별 약 1,540 (2026-11-22 확인) · 무료 오픈소스 · MIT 라이선스

> **일반인 쓸모 ★★★☆☆ (3)** — 명령 한 줄에 파일 이름만 붙이면 녹음 4개의 소리 크기가 2.35초 만에 맞춰졌습니다. 다만 화면 없는 명령어 도구이고 ffmpeg를 따로 설치해야 하며, 녹음·영상을 모아 다룰 때 가끔 쓰는 도구라 별 세 개입니다.
> **이걸로 할 수 있는 것**
> 1. 회의·강의 녹음 여러 개를 **같은 소리 크기로 맞춰** 볼륨을 만지지 않고 이어 듣는다 (시연: 4개 2.35초)
> 2. 유튜브·발표 영상의 **작은 말소리만 키운다** — 그림은 원본 그대로
> 3. 운동·드라이브용 **음악 모음의 들쭉날쭉한 볼륨을 고르게** 맞춘다

[이미지: thumbnail.jpg | 대체 텍스트: ffmpeg-normalize 썸네일: 제각각인 소리 크기 막대 4개가 목표선 -23 LUFS로 모이는 그림과 '볼륨 제각각 → 2초 만에 같은 크기로' 글자]

## 목차
1. ffmpeg-normalize란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. Windows에서 쓰는 법 (설치·실행·오류 해결)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. ffmpeg-normalize란 무엇입니까?
ffmpeg-normalize(에프에프엠펙 노멀라이즈)는 소리 파일과 영상 파일의 소리 크기를 정해 둔 크기로 맞춰 주는 무료 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램)입니다. Werner Robitza(slhck)가 2014년부터 만들어 왔고, 실제 소리 처리는 ffmpeg(동영상·소리 파일을 다루는 무료 프로그램)가 맡습니다.

회의 녹음은 너무 작고, 다음 파일은 갑자기 커서 볼륨을 계속 만진 적이 있다면 이 도구가 하는 일을 바로 알 수 있습니다. 파일 이름만 붙여 명령을 실행하면 모두 같은 크기로 맞춘 새 파일이 생깁니다.

## 2. 비유로 쉽게 이해하기
ffmpeg-normalize는 **소리 크기 지휘자**입니다.

- **1단계, 먼저 듣기**: 지휘자가 파일을 끝까지 한 번 듣고 크기를 잽니다
- **2단계, 손짓으로 맞추기**: 작은 파일은 키우고 큰 파일은 줄여 모두 같은 크기로 맞춥니다
- **귀 기준 악보**: '가장 큰 순간'이 아니라 **사람 귀가 느끼는 크기(LUFS, 러프스)**로 잽니다. 기본 목표는 방송 기준인 -23 LUFS입니다
- **원본은 그대로**: 결과는 `normalized` 폴더에 새 파일로 저장됩니다

## 3. 실제 화면으로 보기
클라우드 작업 공간(리눅스, CPU 2개, 그래픽카드 없음)에서 ffmpeg-normalize 1.45.2를 자동 실행한 **시연 결과**입니다. 소리 파일은 모두 시연용으로 직접 합성한 **가상 녹음**(기계 음성으로 읽은 한국어 문장, 직접 만든 화음)입니다.

> **읽는 법** — LUFS는 사람 귀가 느끼는 소리 크기 단위입니다. **0에 가까울수록 큰 소리**이고, 마이너스는 값에 붙는 부호입니다. 바뀐 크기 = 두 값의 차이입니다(-42.1 → -23.1 LUFS = 약 19 만큼 커짐).

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">시연</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">결과</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설치</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">약 2.5초 · 함께 설치되는 프로그램 8개 · ffmpeg는 따로 설치</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">녹음 4개 한꺼번에</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">회의 -42.1 · 강의 -20.1 · 인터뷰 -28.6 · 배경음악 -10.1 LUFS → <b>모두 -22.7 ~ -23.1 LUFS</b></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">걸린 시간</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">4개 <b>2.35초</b></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">가장 큰 것 − 가장 작은 것</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>32.0 → 0.4</b></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">최고점으로 맞추기(비교)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">최고점은 모두 0 dB, 귀 기준 크기는 -19.1 ~ -9.8 LUFS (<b>9.3 차이</b>)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">mp3 · 목표 -14</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">배경음악 -14.2 · 말소리 3개 -15.4 ~ -15.9 (최고점 제한 때문에 덜 키움, 경고 표시)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">가상 발표 영상</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">소리 -40.9 → <b>-23.1 LUFS</b> · 그림은 원본과 같음 · 1.24초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">60분 녹음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>111.4초(약 1분 51초)</b> · WAV 317.5MB → mp3 57.6MB</td></tr>
</tbody>
</table>

[이미지: before-after.png | 대체 텍스트: ffmpeg-normalize로 맞추기 전·후 가상 녹음 4개의 소리 크기 막대그래프, -42.1·-20.1·-28.6·-10.1 LUFS가 모두 -22.7~-23.1 LUFS로 바뀐 결과]

- **4개 한꺼번에**: `ffmpeg-normalize 파일1 파일2 파일3 파일4`처럼 파일 이름을 나열하면 지휘자가 파일마다 따로 잽니다. 회의 녹음은 +19.0 만큼 키우고, 배경음악은 -12.9 만큼 줄였습니다

[이미지: ffmpeg-normalize-anim.gif | 대체 텍스트: ffmpeg-normalize 과정 애니메이션: 제각각인 소리 크기 막대 4개가 -23 LUFS 선으로 모임 → 지휘자 그림 → 차이 32.0에서 0.4 → 영상 소리만 키움 → 설치 명령 순 화면]

- **왜 귀 기준입니까?**: 비교를 위해 '가장 큰 순간'을 0 dB로 맞추는 방식(`-nt peak`)으로도 돌렸습니다. 최고점은 같아졌지만 귀 기준 크기는 9.3 차이가 났습니다. 반대로 귀 기준으로 맞추면 파형 막대 높이는 달라도 들리는 크기가 같아집니다

[이미지: peak-vs-lufs.png | 대체 텍스트: ffmpeg-normalize 기준 비교 그림: 귀 기준(LUFS)으로 맞춘 파형은 배경음악 막대가 가장 낮아도 4개 모두 -23 근처, 최고점으로 맞춘 파형은 -19.1~-9.8 LUFS로 9.3 차이가 나는 결과]

- **영상**: 소리만 바꾸고 그림은 원본과 같았습니다. 다만 소리 표본 수가 96,000Hz로 바뀌므로 `-ar 48000`을 붙이시기 바랍니다

[이미지: terminal.gif | 대체 텍스트: 명령 창에서 ffmpeg-normalize 1.45.2 확인 → 가상 녹음 4개 -42.1~-10.1 LUFS 막대 → 한꺼번에 맞추기 약 2초 → 4개 모두 -23 LUFS 근처가 된 터미널 화면]

시연에서 아쉬운 점도 있었습니다. 기본 결과가 `.mkv` 파일이라 mp3로 받으려면 옵션을 붙여야 했고, 목표를 -14로 크게 잡자 말소리 3개는 최고점 제한 때문에 -15.4 ~ -15.9에 그쳤습니다. 같은 이름 결과가 있으면 건너뛰고, 소리 없는 영상은 오류로 멈췄습니다.

## 4. Windows에서 쓰는 법 (처음부터 끝까지)
> 시연은 클라우드(리눅스)에서 했고, 아래 Windows 방법은 PyPI 안내·`ffmpeg-normalize -h` 도움말·winget 목록(Gyan.FFmpeg)을 바탕으로 정리한 것입니다. **Windows에서 직접 실행해 확인한 것은 아닙니다.** 각 단계의 '성공 화면'과 다르게 나오면 맨 아래 '자주 나는 오류'를 보시기 바랍니다.

### 0. 준비물
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">항목</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">내용</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">운영체제</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Windows 10·11 (2단계 winget이 없으면 Microsoft Store에서 '앱 설치 관리자'를 업데이트하거나 gyan.dev에서 ffmpeg를 받음)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파이썬</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">3.10 이상 (python.org에서 무료)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">ffmpeg</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">따로 설치 필요 (아래 2단계, ffmpeg-normalize가 소리 처리를 ffmpeg에 맡김)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">ffmpeg-normalize</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>pip install</code> 한 줄 (함께 설치되는 프로그램 8개, 시연 기준 약 20MB)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">없음 — 명령 프롬프트(cmd)에 글자로 명령을 입력, 또는 아래 5단계 <code>.bat</code> 파일에 끌어다 놓기</td></tr>
</tbody>
</table>

### 1. 파이썬 설치
1. https://www.python.org/downloads/ 에서 **Download Python** 단추를 눌러 설치 파일을 받아 실행합니다
2. 설치 첫 화면 아래쪽 **"Add python.exe to PATH"에 체크**한 뒤 **Install Now**를 누릅니다 (체크를 빼먹으면 명령 프롬프트가 python을 찾지 못합니다)
3. 키보드 `윈도우 키` → `cmd` 입력 → **명령 프롬프트**를 열고 확인합니다

```cmd
:: 파이썬 버전 확인 → "Python 3.12.7"처럼 3.10 이상 숫자가 나오면 성공
python --version
```

### 2. ffmpeg 설치
```cmd
:: winget(Windows 기본 설치 도구)으로 ffmpeg 설치 → 설치 동의를 물으면 Y
winget install Gyan.FFmpeg
```
- 설치가 끝나면 **명령 프롬프트 창을 모두 닫고 새로 엽니다** (새 창이어야 ffmpeg를 찾습니다)

```cmd
:: 첫 줄이 "ffmpeg version …"으로 시작하면 성공
ffmpeg -version
```

### 3. ffmpeg-normalize 설치
```cmd
:: 설치 → 마지막 줄에 "Successfully installed ffmpeg-normalize-…"가 나오면 성공
pip install ffmpeg-normalize
:: 확인 → "ffmpeg-normalize v1.45.2"처럼 버전이 나오면 성공
ffmpeg-normalize --version
```

### 4. 내 파일로 해 보기 (명령 프롬프트)
1. 파일 탐색기에서 녹음 파일이 있는 폴더를 엽니다
2. 탐색기 위쪽 **주소창을 누르고 `cmd`를 입력한 뒤 Enter** → 그 폴더 위치에서 명령 프롬프트가 열립니다
3. 아래 명령 중 필요한 것을 입력합니다 (파일 이름에 띄어쓰기가 있으면 `"회의 1.wav"`처럼 큰따옴표로 감쌉니다)

```cmd
:: ① 여러 파일을 한꺼번에 맞추기 → 같은 폴더 안 "normalized" 폴더에 .mkv 파일로 저장 (기본 목표 -23 LUFS)
ffmpeg-normalize 회의1.wav 회의2.wav 강의.mp3

:: ② mp3로 받기 (휴대폰·차에서 바로 재생 가능한 형식)
ffmpeg-normalize 회의1.wav 강의.mp3 -c:a libmp3lame -b:a 192k -ar 48000 -ext mp3

:: ③ 영상: 그림은 그대로 두고 소리만 맞추기 → "video" 폴더에 mp4로 저장
ffmpeg-normalize 발표.mp4 -c:a aac -b:a 192k -ar 48000 -ext mp4 -of video

:: ④ 유튜브 업로드용으로 더 크게 (-14 LUFS, 말소리는 최고점 제한 때문에 조금 낮게 나올 수 있음)
ffmpeg-normalize 발표.mp4 -t -14 -c:a aac -b:a 192k -ar 48000 -ext mp4 -of yt

:: ⑤ 폴더 안 wav 파일을 모두 mp3로 (cmd는 *.wav를 파일 목록으로 펼쳐 주지 않으므로 반복문 사용)
for %f in (*.wav) do ffmpeg-normalize "%f" -c:a libmp3lame -b:a 192k -ar 48000 -ext mp3

:: ⑥ 결과 폴더 열기
explorer normalized
```
- 명령이 끝나면 `normalized`(또는 `-of`로 정한) 폴더에 같은 이름의 새 파일이 생깁니다. **원본 파일은 바뀌지 않습니다**
- 같은 명령을 다시 실행하면 결과 파일이 이미 있어 **건너뜁니다.** 다시 만들려면 명령 끝에 `-f`(덮어쓰기)를 붙입니다

### 5. 명령어 없이 쓰기 — 끌어다 놓는 실행 파일
시연 저장소의 `소리크기맞추기.bat`(https://github.com/codekimmy/daily-github-pick/blob/main/2026-11-22-ffmpeg-normalize/demo/tools_win/소리크기맞추기.bat)을 내려받아 바탕화면 등에 두고, **소리·영상 파일을 이 파일 위에 마우스로 끌어다 놓으면** 원본 옆 `소리맞춤` 폴더에 결과가 생깁니다.
- 소리 파일(wav·mp3·m4a·flac 등) → mp3, 영상 파일(mp4·mov·mkv) → mp4(그림은 그대로)
- 여러 파일을 한꺼번에 끌어다 놓아도 됩니다. 목표 크기는 메모장으로 `.bat`을 열어 `set TARGET=-23` 숫자를 고칩니다(유튜브용 -14)
- 1~3단계 설치가 먼저 끝나 있어야 합니다. ffmpeg나 ffmpeg-normalize가 없으면 화면에 무엇을 설치해야 하는지 안내합니다
- `.bat` 안 명령(`python -m ffmpeg_normalize … -of 폴더 -f`)은 리눅스에서 같은 옵션으로 동작을 확인했고, `.bat` 파일 자체는 Windows에서 실행해 보지 않았습니다

### 6. 자주 나는 오류와 해결
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">화면에 나온 말</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">원인</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">해결</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'python'은(는) 내부 또는 외부 명령 … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1단계에서 PATH 체크를 빼먹음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파이썬을 다시 설치하면서 "Add python.exe to PATH" 체크, 또는 <code>py --version</code>으로 확인 후 명령의 <code>python</code> 대신 <code>py</code> 사용</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'pip'은(는) … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">pip 경로를 못 찾음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>py -m pip install ffmpeg-normalize</code></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'ffmpeg-normalize'은(는) … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설치된 실행 파일 폴더가 PATH에 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">명령 앞부분을 <code>py -m ffmpeg_normalize</code>로 바꿔 실행 (예: <code>py -m ffmpeg_normalize 회의1.wav</code>)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>ERROR: Could not find ffmpeg in your $PATH …</code> (시연에서 ffmpeg를 숨겨 확인한 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">ffmpeg 미설치 또는 창을 새로 열지 않음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">2단계 후 <b>명령 프롬프트를 닫고 새로 열기</b>, <code>ffmpeg -version</code> 확인</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>already exists, skipping</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">결과 파일이 이미 있음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">명령 끝에 <code>-f</code></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>File does not contain any audio streams</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">소리 없는 영상</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">소리가 있는 파일인지 확인</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>exceeds the target true peak</code> 경고</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">목표를 크게 잡아 최고점 제한에 걸림</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">그대로 써도 되며(목표보다 조금 작게 나옴), 꼭 맞추려면 <code>-t</code>를 낮추거나 <code>-tp -1</code>처럼 제한을 올림</td></tr>
</tbody>
</table>

### 7. 지우는 법
```cmd
:: ffmpeg-normalize 지우기
pip uninstall ffmpeg-normalize
:: ffmpeg 지우기
winget uninstall Gyan.FFmpeg
```

### 자주 쓰는 옵션
`-t`(목표 크기, 기본 -23) · `-tp`(최고점 제한, 기본 -2) · `-c:a`(소리 형식) · `-b:a`(음질) · `-ext`(확장자) · `-ar`(표본 수) · `-of`(결과 폴더 이름, 기본 normalized) · `-f`(덮어쓰기) · `-n`(미리 보기, 실제로 바꾸지 않음) · `-nt`(방식: ebu 귀 기준·peak 최고점·rms 평균) · `--print-stats`(측정값 출력)

## 5. 어디에 쓰면 좋을까
- **회의·강의 녹음 모아 듣기** → 파일마다 볼륨을 다시 만지지 않아도 됩니다
- **영상 소리 키우기** → 말소리가 작게 녹음된 발표 영상을 그림은 그대로 두고 소리만 키웁니다
- **음악 모음** → 곡마다 다른 볼륨을 고르게 맞춥니다

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 무료입니다. ffmpeg-normalize의 라이선스는 MIT로, 개인·회사 모두 쓸 수 있습니다. ffmpeg는 따로 받는 프로그램이므로 받은 배포본의 라이선스를 따릅니다.

**Q. 원본 파일이 바뀝니까?**
**A.** 시연에서는 결과가 `normalized` 폴더에 새 파일로 저장되고 원본은 그대로 남았습니다. 그래도 중요한 파일은 먼저 백업하시기 바랍니다.

**Q. 유튜브에 올릴 영상은 몇으로 맞춥니까?**
**A.** 기본값은 방송 기준 -23 LUFS입니다. 더 크게 하려면 `-t -14`처럼 목표를 바꿉니다. 시연에서는 말소리가 최고점 제한 때문에 목표보다 조금 낮게 나왔습니다.

**Q. 잡음도 없애 줍니까?**
**A.** 아닙니다. 크기만 맞춥니다. 작은 녹음을 크게 키우면 섞인 바탕 잡음도 함께 커질 수 있습니다.

## 마무리
ffmpeg-normalize는 파일을 끝까지 듣고 귀 기준으로 크기를 맞추는 "소리 크기 지휘자"입니다. 시연에서 가상 녹음 4개의 차이가 32.0에서 0.4로 줄었고, 영상은 그림을 그대로 두고 소리만 키웠습니다. 다만 ffmpeg를 따로 설치해야 하고, mp3·mp4로 받으려면 옵션을 붙여야 합니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-22에 클라우드 작업 공간(리눅스)에서 시연용 가상 녹음으로 자동 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 ffmpeg-normalize·ffmpeg 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(ffmpeg-normalize: MIT)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- 소리 파일을 바꿀 때는 원본을 따로 보관하고, 결과 파일을 직접 들어 확인하시기 바랍니다.

---
**태그**: ffmpeg-normalize, 볼륨맞추기, 소리크기맞추기, 음량평준화, LUFS, 녹음편집, 영상편집, 무료프로그램, 오픈소스, 깃허브추천
