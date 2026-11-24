<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → segno 썸네일: 가상 와이파이 우리집_5G로 만든 29×29칸 QR 그림과 0.06초 도장, '와이파이 비밀번호 QR 한 장으로' 글자
wifi-qr.png → segno로 만든 가상 와이파이 우리집_5G QR 29×29칸과 명령, 0.06초, 370×370픽셀 490바이트, zxing-cpp로 읽은 내용이 같다는 결과 그림
segno-anim.gif → segno 과정 애니메이션: 가상 와이파이 비밀번호에 취소선 → 명령 타이핑과 QR 칸 찍힘·0.06초 도장 → 읽기 띠로 이름·비밀번호 확인 → 가운데 10% 가림 시험 H만 성공 → 설치 명령 순 화면
length.png → segno 글 길이 비교 그림: 짧은 주소 19자 25칸, 한글 100자 61칸, 한글 500자 129칸 QR과 한글 984자 한도 오류 문구
cover-test.png → segno 가림 시험 결과 그림: 같은 주소를 L·M·Q·H 단계로 만들고 가운데를 5%·10% 가렸을 때 H 단계만 10%까지 읽힌 결과
color-border.png → segno 색과 여백 결과 그림: 남색·빨강·연회색·반전·투명 바탕 QR 5가지 모두 읽힘, 어두운 바탕에서 흰 여백 0칸 실패·기본 4칸 성공
terminal.gif → 명령 창에서 segno 1.6.6 확인 → 글자로 그린 QR → 가상 와이파이 QR을 0.048초에 wifi.png로 저장 → zxing-cpp로 읽어 우리집_5G 이름과 비밀번호가 그대로 나온 터미널 화면
-->
# segno란? 와이파이 비밀번호·연락처를 QR 코드로 만드는 무료 도구 사용법 총정리 (설치법 포함)

> **한 줄 요약** — 주소·와이파이·연락처 같은 글을 넣으면 휴대폰 카메라가 읽는 QR 그림으로 만들어 주는 무료 명령어 도구입니다.
> ⭐ 822 (2026-11-24 확인) · 무료 오픈소스 · BSD-3-Clause 라이선스(상업적 사용 가능)

> **일반인 쓸모 ★★★☆☆ (3)** — 명령 한 줄로 가상 와이파이 QR이 0.06초 만에 생겼고, 다른 프로그램(zxing-cpp)으로 읽으니 한글 이름·비밀번호까지 그대로 나왔습니다. 함께 설치되는 프로그램도 없습니다. 다만 파이썬을 따로 설치해야 하는 명령어 도구이고, 와이파이 QR은 한 번 만들어 붙이면 끝이라 쓸 일이 자주 있지는 않아 별 세 개입니다.
> **이걸로 할 수 있는 것**
> 1. **손님용 와이파이 QR**을 만들어 붙인다 (시연: 0.06초, 읽기 확인. 실제 휴대폰 접속은 확인 못 함)
> 2. **명함·모임 안내문에 연락처 QR**을 넣는다 (시연: 가상 인물 33 × 33칸, 한글 이름까지 읽힘)
> 3. 테이블·물품 **번호만 다른 QR 1,000장**을 한꺼번에 만든다 (시연: 2.1초)

[이미지: thumbnail.jpg | 대체 텍스트: segno 썸네일: 가상 와이파이 우리집_5G로 만든 29×29칸 QR 그림과 0.06초 도장, '와이파이 비밀번호 QR 한 장으로' 글자]

## 목차
1. segno란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. Windows에서 쓰는 법 (설치·실행·오류 해결)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. segno란 무엇입니까?
segno(세그노)는 글을 QR 코드 그림으로 만들어 주는 무료 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램)입니다. 파이썬(프로그래밍 언어)으로 만들어졌고, 명령 프롬프트에 한 줄을 입력하면 PNG·SVG 같은 그림 파일이 생깁니다.

손님이 올 때마다 공유기 뒷면의 긴 비밀번호를 불러 준 적이 있다면 쓸모를 바로 알 수 있습니다. 와이파이 QR을 한 장 붙여 두면 손님 휴대폰 카메라가 QR을 읽어 접속을 돕습니다(휴대폰 접속은 시연에서 확인하지 않았습니다).

## 2. 비유로 쉽게 이해하기
segno는 **QR 스티커 인쇄소**입니다.

- **① 주문서 = 넣을 글**: 주소, 와이파이(`WIFI:T:WPA;S:이름;P:비밀번호;;`), 연락처(`MECARD:…`) 같은 글을 받습니다
- **② 스티커 크기 = 칸 수**: 글이 길수록 칸이 많아집니다. 인쇄소가 글 길이에 맞춰 알아서 고릅니다
- **③ 여분 칸 = 오류 정정 단계(L·M·Q·H)**: 여분 칸이 많을수록 일부가 가려져도 읽힙니다. 대신 스티커가 커집니다
- **흰 테두리 = 여백**: 둘레의 흰 여백이 있어야 카메라가 QR 경계를 찾습니다

## 3. 실제 화면으로 보기
클라우드 작업 공간(리눅스, CPU 2개)에서 segno 1.6.6을 자동 실행한 **시연 결과**입니다. 와이파이·연락처는 모두 **시연용 가상 자료**이고, 만든 QR은 다른 프로그램인 zxing-cpp(QR 읽기 프로그램)로 읽어 확인했습니다. **휴대폰 카메라와 실제 와이파이 접속은 확인하지 않았습니다.**

[이미지: wifi-qr.png | 대체 텍스트: segno로 만든 가상 와이파이 우리집_5G QR 29×29칸과 명령, 0.06초, 370×370픽셀 490바이트, zxing-cpp로 읽은 내용이 같다는 결과 그림]

[이미지: segno-anim.gif | 대체 텍스트: segno 과정 애니메이션: 가상 와이파이 비밀번호에 취소선 → 명령 타이핑과 QR 칸 찍힘·0.06초 도장 → 읽기 띠로 이름·비밀번호 확인 → 가운데 10% 가림 시험 H만 성공 → 설치 명령 순 화면]

> **읽는 법** — '칸'은 QR을 이루는 작은 정사각형 한 줄의 개수입니다(29 × 29칸 = 가로세로 29칸). 칸이 많을수록 촘촘해 작게 인쇄하면 읽기 어렵습니다. '가림 %'는 흰 여백까지 포함한 그림 전체 넓이에서 가운데 상자가 차지한 비율입니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">시연</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">결과</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설치</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.61초 · 함께 설치되는 프로그램 0개 · 약 0.3MB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">와이파이 QR</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.06초 · 29 × 29칸 · 490바이트 · 읽은 글이 넣은 글과 똑같음</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">연락처 QR</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">MECARD 33 × 33칸 · vCard 41 × 41칸 · 한글 이름 그대로</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">글 길이</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">짧은 주소 25칸 · 한글 100자 61칸 · 한글 500자 129칸 · 한글 984자까지</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">가운데 가리기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">L·M 5%부터 실패 · Q 5%까지 · H 10%까지 성공 · 15% 이상 모두 실패</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">색 5가지</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">모두 읽힘(zxing-cpp 기준)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">흰 여백 0칸</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">어두운 바탕 위에서 실패 (기본 4칸은 성공)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1,000장</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">2.1초 · 골라 읽은 5장 모두 맞음</td></tr>
</tbody>
</table>

[이미지: length.png | 대체 텍스트: segno 글 길이 비교 그림: 짧은 주소 19자 25칸, 한글 100자 61칸, 한글 500자 129칸 QR과 한글 984자 한도 오류 문구]

가운데에 로고를 얹고 싶다면 여분 칸이 가장 많은 `-e H`를 쓰는 것이 좋습니다. 시연에서 H 단계만 가운데 10%를 가려도 읽혔습니다.

[이미지: cover-test.png | 대체 텍스트: segno 가림 시험 결과 그림: 같은 주소를 L·M·Q·H 단계로 만들고 가운데를 5%·10% 가렸을 때 H 단계만 10%까지 읽힌 결과]

[이미지: color-border.png | 대체 텍스트: segno 색과 여백 결과 그림: 남색·빨강·연회색·반전·투명 바탕 QR 5가지 모두 읽힘, 어두운 바탕에서 흰 여백 0칸 실패·기본 4칸 성공]

[이미지: terminal.gif | 대체 텍스트: 명령 창에서 segno 1.6.6 확인 → 글자로 그린 QR → 가상 와이파이 QR을 0.048초에 wifi.png로 저장 → zxing-cpp로 읽어 우리집_5G 이름과 비밀번호가 그대로 나온 터미널 화면]

## 4. Windows에서 쓰는 법 (처음부터 끝까지)
> 시연은 클라우드(리눅스)에서 했고, 아래 Windows 방법은 segno 도움말(`segno -h`)·PyPI 설치 파일 정보(`segno-1.6.6-py3-none-any.whl` = 운영체제 상관없이 쓰는 순수 파이썬 파일)·파이썬 공식 설치 안내를 바탕으로 정리한 것입니다. **Windows에서 직접 실행해 확인한 것은 아닙니다.** 각 단계의 '성공 화면'과 다르게 나오면 아래 '자주 나는 오류'를 보시기 바랍니다.

### 0. 준비물
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">항목</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">내용</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">운영체제</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Windows 10·11</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파이썬</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">3.5 이상 (최신 버전 권장, python.org에서 무료) — pip(파이썬 설치 도구)가 함께 설치됨</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">segno</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>py -m pip install segno</code> 한 줄 (함께 설치되는 프로그램 0개, 약 0.3MB)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">따로 설치할 프로그램</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">없음</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">없음 — 명령 프롬프트(cmd)에 글자로 명령을 입력, 또는 아래 4단계 <code>와이파이QR.bat</code>를 두 번 눌러 질문에 답하기</td></tr>
</tbody>
</table>

### 1. 파이썬 설치
1. https://www.python.org/downloads/ 에서 **Download Python** 단추로 Windows용 설치 파일을 받아 실행합니다
2. 설치 첫 화면 아래쪽 **"Add python.exe to PATH"에 체크**한 뒤 **Install Now**를 누릅니다
3. 설치가 끝나면 키보드 `윈도우 키` → `cmd` 입력 → **명령 프롬프트**를 **새로** 엽니다

```cmd
:: 파이썬 확인 → "Python 3.13.1"처럼 3.5 이상 숫자가 나오면 성공
py --version
```

### 2. segno 설치
```cmd
:: 설치 → 마지막 줄에 "Successfully installed segno-1.6.6"처럼 나오면 성공
py -m pip install segno
:: 확인 → "Segno 1.6.6"처럼 나오면 성공 (명령을 찾지 못하면 아래 py -m segno.cli 사용)
segno --ver
```

### 3. 내 QR 만들어 보기 (명령 프롬프트)
1. 파일 탐색기에서 QR 그림을 저장할 폴더(예: 바탕화면)를 엽니다
2. 탐색기 위쪽 **주소창을 누르고 `cmd`를 입력한 뒤 Enter** → 그 폴더 위치에서 명령 프롬프트가 열립니다
3. 아래 명령 중 필요한 것을 입력합니다 (글은 큰따옴표로 감쌉니다)

```cmd
:: ① 인터넷 주소 QR → 이 폴더에 qr.png (한 칸 = 10픽셀)
segno "https://example.com" -o qr.png --scale 10

:: ② 와이파이 QR (공유기 이름·비밀번호를 내 것으로 바꿈, WPA2·WPA3도 T:WPA)
segno "WIFI:T:WPA;S:공유기이름;P:비밀번호;;" -o 와이파이.png --scale 10

:: ③ 연락처 QR (MECARD 형식)
segno "MECARD:N:홍길동;TEL:01012345678;EMAIL:me@example.com;;" -o 연락처.png --scale 10

:: ④ 인쇄용: 확대해도 깨지지 않는 SVG, 또는 300dpi PNG
segno "https://example.com" -o qr.svg --scale 10
segno "https://example.com" -o qr_인쇄.png --scale 20 --dpi 300

:: ⑤ 가운데에 로고를 얹을 계획이면 여분 칸을 가장 많이 (-e H)
segno "https://example.com" -e H -o qr_로고용.png --scale 10

:: ⑥ 색 바꾸기 (진한 색 + 밝은 바탕을 권장)
segno "https://example.com" --dark darkblue --light white -o qr_남색.png --scale 10

:: ⑦ segno 명령을 찾지 못할 때 같은 일을 하는 방법
py -m segno.cli "https://example.com" -o qr.png --scale 10

:: ⑧ 결과 폴더 열기
explorer .
```
- 결과는 **명령을 실행한 폴더**에 `-o` 뒤에 쓴 이름으로 생깁니다. 같은 이름 파일이 있으면 묻지 않고 새로 덮어씁니다
- 와이파이 비밀번호에 `;` `,` `:` `\` `"` 기호가 있으면 앞에 `\`를 붙여야 합니다(예: `a;b` → `a\;b`). 헷갈리면 아래 `와이파이QR.bat`를 쓰시기 바랍니다(자동 처리)
- 비밀번호가 없는 공개 와이파이는 `"WIFI:S:공유기이름;;"`처럼 `T:`와 `P:`를 뺍니다
- 만든 QR은 **인쇄하기 전에 내 휴대폰 카메라로 비춰** 접속·연결되는지 확인하시기 바랍니다

### 4. 명령어 없이 쓰기 — 두 번 눌러 쓰는 실행 파일
저장소의 [`demo/tools_win/와이파이QR.bat`](https://github.com/codekimmy/daily-github-pick/blob/main/2026-11-24-segno/demo/tools_win/와이파이QR.bat)을 내려받아 바탕화면 등에 두고 **마우스로 두 번 누르면**, 화면이 와이파이 이름과 비밀번호를 차례로 묻고 이 `.bat` 파일과 같은 폴더에 **`와이파이QR.png`**(인쇄용 300dpi)를 만든 뒤 그림을 열어 줍니다.
- 비밀번호 속 특수 기호는 segno의 파이썬 도우미(`helpers.make_wifi`)가 자동으로 처리합니다. 비밀번호를 비워 두면 공개 와이파이 QR이 됩니다
- 1~2단계 설치가 먼저 끝나 있어야 하며, 파이썬이나 segno가 없으면 무엇을 설치해야 하는지 화면에 안내합니다
- `.bat` 안 파이썬 명령은 리눅스에서 같은 방식으로 확인했고(특수 기호 `a;b&c"d!` 비밀번호 → `a\;b&c\"d!`로 자동 처리, 29칸, 읽기 확인), `.bat` 파일 자체는 Windows에서 실행해 보지 않았습니다

### 5. 자주 나는 오류와 해결
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">화면에 나온 말</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">원인</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">해결</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'py'은(는) 내부 또는 외부 명령 … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파이썬 미설치</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1단계 설치 후 <b>명령 프롬프트를 닫고 새로 열기</b></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'segno'은(는) 내부 또는 외부 명령 … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">segno 미설치, 또는 파이썬 Scripts 폴더가 PATH에 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>py -m pip install segno</code> 후 창을 새로 열기. 그래도 안 되면 <code>py -m segno.cli "글" -o qr.png</code>로 실행</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>No module named segno.__main__</code> (시연에서 본 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>py -m segno</code>로 실행</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>py -m segno.cli</code>로 실행</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>Data too large. No QR Code can handle the provided data</code> (시연에서 본 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">글이 너무 김 (한글은 984자까지)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">글을 줄이거나, 긴 글은 인터넷 주소로 바꿔 넣기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>segno: error: argument --version/-v: expected one argument</code> (시연에서 본 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>segno --version</code>은 QR 버전(크기)을 정하는 옵션</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">프로그램 버전 확인은 <code>segno --ver</code></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">휴대폰 카메라가 QR을 읽지 못함</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">흰 여백을 지움(<code>-b 0</code>), 색이 흐림, 너무 작게 인쇄, 칸이 촘촘함</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">기본 여백 유지, 진한 색·밝은 바탕, 크게 인쇄, 글은 짧게</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">와이파이 QR은 읽히는데 접속이 안 됨</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">비밀번호 오타, 특수 기호에 <code>\</code> 빠짐, 보안 방식 다름</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">비밀번호 확인, <code>와이파이QR.bat</code>로 다시 만들기</td></tr>
</tbody>
</table>

### 6. 지우는 법
```cmd
:: segno 지우기 (Proceed (Y/n)? 이 나오면 Y)
py -m pip uninstall segno
:: 파이썬 지우기: 설정 › 앱 › 설치된 앱에서 Python 제거
```

### 자주 쓰는 옵션
`-o`(저장 파일: .png·.svg·.pdf·.eps·.txt 등, 없으면 명령 창에 그림) · `--scale`(한 칸 크기, 기본 1) · `--dpi`(PNG 인쇄 해상도) · `-e`(여분 칸 단계 L·M·Q·H) · `-b`(흰 여백 칸 수, 기본 4) · `--dark`·`--light`(색, `transparent` 가능) · `--micro`(작은 마이크로 QR) · `--compact`(명령 창 그림을 작게) · `--ver`(프로그램 버전)


## 5. 어디에 쓰면 좋을까
- **가게·집 손님용 와이파이** → QR을 인쇄해 붙여 둡니다
- **명함·모임 안내문** → 연락처나 신청서 주소 QR을 넣습니다
- **번호표·물품 관리** → 번호만 다른 QR을 한꺼번에 만듭니다

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 무료입니다. BSD-3-Clause 라이선스로 개인·회사 모두 쓸 수 있습니다.

**Q. 만든 QR을 휴대폰이 읽습니까?**
**A.** 시연에서는 다른 프로그램(zxing-cpp)으로 읽어 넣은 글과 같은지만 확인했습니다. 휴대폰 카메라 앱은 확인하지 않았으므로, 인쇄 전에 내 휴대폰으로 꼭 비춰 보시기 바랍니다.

**Q. QR 가운데에 로고를 넣어도 됩니까?**
**A.** segno는 로고를 직접 넣지 않습니다. 다른 그림 프로그램으로 얹을 때는 `-e H`로 만들고 로고를 작게 두시기 바랍니다. 시연에서 H 단계는 10%까지 가려도 읽혔고 15%는 실패했습니다.

**Q. 와이파이 비밀번호가 QR에 그대로 보입니까?**
**A.** 그림으로는 안 보이지만, QR을 읽으면 누구나 비밀번호를 알 수 있습니다. 손님용 네트워크에만 쓰시기 바랍니다.

## 마무리
segno는 글을 받아 QR 스티커를 찍어 주는 "QR 스티커 인쇄소"입니다. 시연에서 가상 와이파이 QR이 0.06초 만에 생겼고, 1,000장도 2.1초에 만들어졌습니다. 다만 파이썬을 따로 설치해야 하고, 휴대폰 카메라 확인은 직접 해야 하며, 흰 여백은 지우지 않아야 합니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-24에 클라우드 작업 공간(리눅스)에서 시연용 가상 자료로 자동 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows 등)·휴대폰 카메라 앱에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 segno 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(BSD-3-Clause)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- 와이파이 QR에는 비밀번호가 그대로 들어가므로 아는 사람에게만 보여 주고, 인쇄 전에 내 휴대폰으로 읽어 내용이 맞는지 직접 확인하시기 바랍니다.

---
**태그**: segno, QR코드만들기, 와이파이QR, 와이파이QR코드, 연락처QR, QR코드생성기, 무료프로그램, 파이썬, 오픈소스, 깃허브추천
