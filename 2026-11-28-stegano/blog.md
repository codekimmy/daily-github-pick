<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → Stegano 썸네일: 가상 가을 산책 그림 카드에서 화살표로 꺼낸 깜짝 파티 쪽지 카드가 나오고 0.22초 도장, '이 그림 속에 쪽지가 있습니다'·'바뀐 점 0.02% 눈으로는 똑같음' 글자
terminal.gif → Stegano 터미널 시연: 버전 3.0.0 확인 → 가상 가을 산책 그림에 깜짝 파티 쪽지를 숨겨 비밀.png 생성 → 쪽지 꺼내기 성공 → 숨긴 게 없는 그림은 Impossible to detect message → JPG로 다시 저장하자 쪽지가 사라진 결과 순으로 바뀌는 명령 창 화면
hide.png → Stegano 숨기기 비교 그림: 가상 가을 산책 원본과 쪽지를 숨긴 그림이 똑같아 보이고, 맨 위 줄 확대에서 색 번호 150이 151로 한 칸 바뀐 곳, 바뀐 화소 175개 0.02% 숫자
survive.png → Stegano 옮기기 시험 그림: 파일 복사·PNG 다시 저장·무손실 WebP는 쪽지가 남고, JPG 화질 95로 다시 저장·크기 1% 줄이기·위쪽 자르기는 쪽지가 사라진 결과 알약 표
detect.png → Stegano 들키나 검사 그림: 끝자리만 모아 본 검사 그림에서 짧은 쪽지는 원본과 구분되지 않고, 한글 10만 자를 넣은 그림은 위쪽 87%가 규칙적인 줄무늬로 드러난 비교와 숨기기일 뿐 암호화 아님 경고
-->
# Stegano란? 그림 속에 비밀 쪽지를 숨기고 꺼내는 무료 스테가노그래피 프로그램 사용법 총정리 (설치법 포함)

> **한 줄 요약** — 그림을 이루는 점마다 있는 색 번호의 끝자리를 한 칸씩 바꿔, 눈으로는 똑같아 보이는 그림 속에 쪽지를 숨기는 무료 파이썬 프로그램입니다.
> ⭐ 594 (2026-11-28 확인) · 무료 오픈소스 · GPL-3.0 이상 라이선스

> **일반인 쓸모 ★★½☆☆ (2.5)** — 코드로 그린 가상 그림에 깜짝 파티 쪽지(한글 37자)를 넣자 0.22초 만에 겉모습이 같은 새 그림이 나왔고, 꺼내기 명령은 0.17초 만에 쪽지를 그대로 보여 줬습니다. 다만 파이썬을 먼저 설치해야 하는 명령어 도구이고, JPG로 다시 저장하거나 크기를 조금만 줄여도 쪽지가 사라지며, 암호화가 아니어서 쓸 일이 가끔이라 별 두 개 반입니다.
> **이걸로 할 수 있는 것**
> 1. 가족·친구에게 보내는 그림 파일 속에 **깜짝 파티 쪽지·퀴즈 정답을 숨긴다** (시연: 숨기기 0.22초 · 꺼내기 0.17초)
> 2. 메모장 파일(.txt) 같은 **작은 파일을 통째로** 그림 속에 넣었다가 그대로 꺼낸다
> 3. 방탈출·보물찾기 놀이에 **'이 그림에 비밀이 있다'** 문제를 만든다

[이미지: thumbnail.jpg | 대체 텍스트: Stegano 썸네일: 가상 가을 산책 그림 카드에서 화살표로 꺼낸 깜짝 파티 쪽지 카드가 나오고 0.22초 도장, '이 그림 속에 쪽지가 있습니다'·'바뀐 점 0.02% 눈으로는 똑같음' 글자]

## 목차
1. Stegano란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. Windows에서 쓰는 법 (설치·실행·오류 해결)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. Stegano란 무엇입니까?
Stegano(스테가노)는 그림 속에 글자나 작은 파일을 숨기는 무료 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램)입니다. 이런 기술을 '스테가노그래피'(그림·소리 속에 정보를 숨기는 기술)라고 부릅니다. 2015년에 GitHub 저장소가 만들어졌고 GitHub 별은 594개입니다. 최신 버전은 2026-07-19에 PyPI에 올라온 3.0.0이고, GitHub 저장소는 2026-11-21에도 고쳐졌습니다.

그림은 아주 작은 점(화소)으로 이루어지고, 점마다 빨강·초록·파랑 색 번호(0~255)가 있습니다. Stegano는 이 번호의 맨 끝자리를 한 칸씩 바꿔 글자를 나눠 적습니다. 150이 151이 되는 정도라 눈으로는 차이를 알 수 없습니다. 명령은 `stegano-lsb hide`(숨기기)와 `stegano-lsb reveal`(꺼내기) 두 가지면 됩니다.

## 2. 비유로 쉽게 이해하기
Stegano는 **투명 잉크 편지**입니다.

- **투명 잉크로 쓰기(`hide`)**: 레몬즙으로 쓴 편지처럼, 그림은 그대로인데 색 번호 끝자리에 글자가 들어갑니다
- **불에 쬐어 읽기(`reveal`)**: 꺼내기 명령을 넣으면 숨은 글자가 그대로 나타납니다
- **불만 있으면 누구나 읽음**: 투명 잉크는 자물쇠가 아닙니다. Stegano를 가진 사람은 누구나 꺼낼 수 있습니다(암호화 아님)
- **물에 젖으면 지워짐**: 그림을 JPG로 다시 저장하거나 크기를 바꾸면 쪽지가 사라집니다

## 3. 실제 화면으로 보기
아래는 2026-11-28에 클라우드(리눅스, 파이썬 3.13)에서 Stegano 3.0.0을 **코드로 그린 가상 그림과 가상 쪽지**로 자동 실행한 결과입니다.

[이미지: terminal.gif | 대체 텍스트: Stegano 터미널 시연: 버전 3.0.0 확인 → 가상 가을 산책 그림에 깜짝 파티 쪽지를 숨겨 비밀.png 생성 → 쪽지 꺼내기 성공 → 숨긴 게 없는 그림은 Impossible to detect message → JPG로 다시 저장하자 쪽지가 사라진 결과 순으로 바뀌는 명령 창 화면]

**① 숨기기·꺼내기** — `stegano-lsb hide -i 가을산책.png -m "쪽지" -o 비밀.png`를 넣자 **0.22초** 만에 `비밀.png`가 새로 생겼고 원본은 그대로였습니다. `stegano-lsb reveal -i 비밀.png`를 넣자 **0.17초** 만에 한글 37자 쪽지가 한 글자도 다르지 않게 나왔습니다. 숨긴 게 없는 그림을 넣으면 `Impossible to detect message.`가 나왔습니다.

**② 얼마나 바뀌나** — 1280×720 그림의 점 921,600개 가운데 **175개(0.02%)**만 바뀌었고, 바뀐 크기는 색 번호 **최대 1칸**이었습니다. 바뀐 점은 모두 맨 위 한 줄에 있었고 파일 크기는 21.7KB에서 22.1KB가 됐습니다.

[이미지: hide.png | 대체 텍스트: Stegano 숨기기 비교 그림: 가상 가을 산책 원본과 쪽지를 숨긴 그림이 똑같아 보이고, 맨 위 줄 확대에서 색 번호 150이 151로 한 칸 바뀐 곳, 바뀐 화소 175개 0.02% 숫자]

**③ 파일 통째로** — 메모장 쪽지 파일(149바이트)을 `-f`로 넣고 `-o 꺼낸쪽지.txt`로 꺼내자 원본과 똑같은 파일이 나왔습니다. `-o` 없이 꺼내면 `W+qwgOyD…` 같은 알아볼 수 없는 글자만 나왔습니다. 그림 한 장(1280×720)에 한글 '가' 11만 5천 자를 넣어도 그대로 꺼내졌습니다.

**④ JPG로 바꾸면** — 파일 복사, PNG로 다시 저장, 무손실 WebP로는 쪽지가 남았습니다. 하지만 **JPG 화질 95로 다시 저장하거나 크기를 1%만 줄여도 쪽지가 사라졌습니다.** 결과 이름을 `비밀.jpg`로 적으면 오류 없이 만들어지지만 꺼낼 수 없었습니다.

[이미지: survive.png | 대체 텍스트: Stegano 옮기기 시험 그림: 파일 복사·PNG 다시 저장·무손실 WebP는 쪽지가 남고, JPG 화질 95로 다시 저장·크기 1% 줄이기·위쪽 자르기는 쪽지가 사라진 결과 알약 표]

**⑤ 숨기는 차례·들키나** — `-g eratosthenes`로 소수 번째 점에만 숨기자, 같은 `-g`를 모르면 꺼내지 못했습니다. 다만 이것은 암호가 아니라 숨긴 자리만 바꾸는 것이고, 고를 수 있는 차례 15가지가 도움말에 공개돼 있습니다. 끝자리만 모아 보는 검사 그림에서는 짧은 쪽지는 티가 나지 않았지만, 한글 10만 자를 넣으면 그림 위쪽 87%가 줄무늬로 드러났습니다.

[이미지: detect.png | 대체 텍스트: Stegano 들키나 검사 그림: 끝자리만 모아 본 검사 그림에서 짧은 쪽지는 원본과 구분되지 않고, 한글 10만 자를 넣은 그림은 위쪽 87%가 규칙적인 줄무늬로 드러난 비교와 숨기기일 뿐 암호화 아님 경고]

> **읽는 법** — 시간은 명령을 입력하고 끝날 때까지 걸린 전체 시간(프로그램을 켜는 시간 포함, 3번 중 가장 빠른 값)입니다. 색 번호는 0~255 사이 숫자이고, '1칸'은 150이 151로 바뀌는 정도입니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">해 본 것</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">결과</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">시간</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1280×720 그림 · 쪽지 37자 숨기기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">바뀐 점 175개(0.02%) · 색 번호 최대 1칸</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.22초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">같은 그림 · 꺼내기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">쪽지 37자 그대로</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.17초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">메모장 파일(149바이트) 숨기기 → 꺼내기 (-o)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">원본과 똑같은 파일</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.20초 · 0.16초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">한글 '가' 11만 5천 자 숨기기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">그대로 꺼내짐</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1.13초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">4000×3000 큰 그림 · 쪽지 숨기기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1,200만 화소 · 꺼내기 0.31초</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1.01초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1280×720 그림 20장 하나씩</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">20장</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">4.35초</td></tr>
</tbody>
</table>

**아쉬운 점** — 숨기기일 뿐 암호화가 아니어서 Stegano만 있으면 누구나 꺼낼 수 있습니다. JPG로 바꾸거나 크기를 바꾸면 쪽지가 사라지고, 같은 이름 결과가 있으면 묻지 않고 덮어씁니다. 파이썬을 먼저 설치해야 하고, 함께 설치되는 프로그램이 384.4MB(그중 opencv-python 301MB)로 큽니다.

## 4. Windows에서 쓰는 법 (처음부터 끝까지)
> 시연은 클라우드(리눅스)에서 했고, 아래 Windows 방법은 Stegano 도움말(`stegano-lsb hide -h`)·PyPI 설명·PyPI 설치 파일 목록(Stegano는 모든 운영체제용 `py3-none-any`, 함께 설치되는 opencv-python은 Windows용 `win_amd64` 설치 파일 약 48MB가 올라와 있음)·winget 목록(`Python.Python.3.13`)을 바탕으로 정리한 것입니다. **Windows에서 직접 실행해 확인한 것은 아닙니다.** PyPI 분류 표에는 운영체제가 'Linux'로만 적혀 있습니다. 각 단계의 '성공 화면'과 다르게 나오면 아래 '자주 나는 오류'를 보시기 바랍니다.

### 0. 준비물
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">항목</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">내용</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">운영체제</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Windows 10·11 (64비트)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">필요한 프로그램</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파이썬 3.10 이상 (PyPI 기준 3.10~3.14, 시연은 3.13) + Stegano 3.0.0</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">함께 설치되는 것</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">opencv-python · numpy · Pillow 등 6개 (그림을 다루는 파이썬 프로그램, 시연 리눅스에서 합쳐 384.4MB · Windows용 opencv-python 내려받기 약 48MB)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면 없는 명령어 도구 (명령 프롬프트에서 사용) · GitHub 저장소의 <code>비밀쪽지.bat</code>에 그림을 끌어다 놓아 쓸 수도 있음</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">인터넷</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설치할 때만 필요 (숨기기·꺼내기는 인터넷 없이 내 PC 안에서 처리)</td></tr>
</tbody>
</table>

### 1. 파이썬 설치 (한 번만, 둘 중 하나)
**방법 A — 명령 한 줄 (winget)**
1. 명령 프롬프트 열기: `윈도우 키` → `cmd` 입력 → Enter
```cmd
:: 파이썬 3.13 설치 → "설치 성공" 또는 "Successfully installed"가 나오면 성공
winget install Python.Python.3.13
```
**방법 B — 설치 파일**
1. https://www.python.org/downloads/ 에서 Windows 설치 파일을 받습니다
2. 첫 화면 아래 **`Add python.exe to PATH`에 체크**한 뒤 **Install Now**를 누릅니다

### 2. Stegano 설치
**파이썬 설치가 끝나면 명령 프롬프트 창을 닫고 새로 엽니다.**
```cmd
:: 파이썬 버전 확인 → "Python 3.13.…"이 나오면 성공 (3.10 이상이어야 함)
py --version

:: Stegano 설치 → 마지막 줄에 "Successfully installed … stegano-3.0.0 …"이 나오면 성공 (opencv-python 내려받기로 1~2분 걸릴 수 있음)
py -m pip install stegano

:: 설치 확인 → "usage: stegano-lsb [-h] {hide,reveal,list-generators}"로 시작하는 도움말이 나오면 성공
stegano-lsb -h
```
- 마지막 명령에서 `'stegano-lsb'은(는) 내부 또는 외부 명령 … 아닙니다`가 나오면 아래 '자주 나는 오류'를 보시기 바랍니다

### 3. 내 그림으로 해 보기
1. 그림이 있는 폴더를 탐색기로 엽니다
2. 탐색기 **주소창에 `cmd` 입력 → Enter** → 그 폴더에서 명령 창이 열립니다
3. 아래 명령을 붙여넣습니다. **결과는 `-o` 뒤에 적은 이름으로 같은 폴더에** 생기고, 원본은 바뀌지 않습니다
```cmd
:: ① 쪽지 숨기기 → 비밀.png (결과 이름은 꼭 .png, 쪽지 글은 큰따옴표로 감쌈)
stegano-lsb hide -i 사진.png -m "토요일 3시 공원 정문" -o 비밀.png

:: ② 쪽지 꺼내기 → 화면에 쪽지가 나옴 (없으면 Impossible to detect message.)
stegano-lsb reveal -i 비밀.png

:: ③ 메모장 파일을 통째로 숨기기 → 쪽지그림.png
stegano-lsb hide -i 사진.png -f 쪽지.txt -o 쪽지그림.png

:: ④ 숨긴 파일 꺼내기 → 꺼낸쪽지.txt (-o 를 빼면 알아볼 수 없는 글자만 나옴)
stegano-lsb reveal -i 쪽지그림.png -o 꺼낸쪽지.txt

:: ⑤ 숨기는 차례 바꾸기 (꺼낼 때도 같은 -g 를 붙여야 나옴)
stegano-lsb hide -i 사진.png -m "보물은 화분 밑" -g eratosthenes -o 보물.png
stegano-lsb reveal -i 보물.png -g eratosthenes

:: ⑥ 파일 이름에 띄어쓰기가 있으면 큰따옴표
stegano-lsb hide -i "가을 산책.png" -m "안녕" -o "가을 산책_비밀.png"

:: ⑦ 결과 폴더 열기
explorer .
```
- **결과 이름은 꼭 `.png`로 적습니다.** `-o 비밀.jpg`라고 적으면 오류 없이 JPG가 만들어지지만 쪽지를 꺼낼 수 없었습니다(시연)
- **같은 이름 결과가 있으면 묻지 않고 덮어씁니다**(시연). 결과 이름을 원본과 다르게 적으시기 바랍니다
- JPG 사진을 넣어도 되지만, 결과는 PNG로 저장해야 하고 파일이 커집니다(시연: 61.3KB → 199.5KB)
- 쪽지를 지키려면 **파일 그대로**(메일 첨부·USB·클라우드 공유의 '원본 파일') 보내시기 바랍니다. 메신저·SNS가 그림을 JPG로 바꾸거나 줄이면 쪽지가 사라질 수 있습니다(시연은 JPG 다시 저장·1% 줄이기로 흉내 냄, 카카오톡 등 실제 전송은 확인 못 함)

### 4. 명령어 없이 쓰기 — 끌어다 놓는 실행 파일
- GitHub 저장소의 [`demo/tools_win/비밀쪽지.bat`](demo/tools_win/비밀쪽지.bat)을 받아 바탕화면 등에 두고, **그 파일 위에 `.png`·`.jpg` 그림을 끌어다 놓으면** `1 = 쪽지 숨기기, 2 = 쪽지 꺼내기`를 묻습니다
  - 1번: 쪽지 글을 입력하고 Enter → 같은 폴더에 `이름_비밀.png`가 생깁니다 (이미 있으면 덮어쓸지 먼저 물음)
  - 2번: 그림 속 쪽지를 화면에 보여 줍니다
- 파이썬이나 Stegano가 없으면 설치 방법을 안내하고 멈춥니다. `stegano-lsb` 명령이 안 보이는 경우(아래 오류 ①)에도 쓸 수 있게 `py`로 직접 실행합니다
- `.bat` 안의 실행 방식(`py -c`, 쪽지 글을 환경 변수로 넘기기 — 따옴표·& 기호가 든 글도 시연에서 그대로 꺼내짐)은 리눅스에서 같은 방식으로 확인했고, `.bat` 파일 자체는 Windows에서 실행해 보지 않았습니다. 명령 창에서 한글 입력이 깨지면 명령어 방법(3단계)을 쓰시기 바랍니다[추정]

### 5. 파이썬 코드로 쓰기 (선택)
```python
# 비밀.png 를 만들고 바로 꺼내 확인 (시연 0.27초)
from stegano import lsb
lsb.hide('사진.png', '토요일 3시 공원 정문').save('비밀.png')
print(lsb.reveal('비밀.png'))
```

### 6. 자주 나는 오류와 해결
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">화면에 나온 말</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">원인</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">해결</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'py'은(는) 내부 또는 외부 명령 … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파이썬이 설치 안 됨, 또는 예전 명령 창을 그대로 씀</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">명령 창을 닫고 새로 열기 → 그래도 안 되면 1단계 다시</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'stegano-lsb'은(는) 내부 또는 외부 명령 … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">pip가 만든 실행 파일 폴더(Scripts)가 PATH에 없음[추정] — 설치 때 <code>WARNING: The scripts … are installed in '…' which is not on PATH</code>가 나왔다면 이 경우</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">4단계의 <code>비밀쪽지.bat</code> 쓰기, 또는 <code>py -c "from stegano.console.lsb import main; main()" reveal -i 비밀.png</code>처럼 실행(시연에서 같은 결과), 또는 파이썬을 다시 설치하며 <code>Add python.exe to PATH</code> 체크</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>Impossible to detect message.</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">숨긴 쪽지가 없는 그림, 또는 JPG로 저장·크기 변경·위쪽 자르기로 쪽지가 지워짐, 또는 숨길 때 쓴 <code>-g</code>를 안 붙임</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">원본 PNG 파일로 다시 꺼내기, 숨길 때와 같은 <code>-g</code> 붙이기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>stegano-lsb hide: error: the following arguments are required: -o/--output</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">결과 이름(<code>-o</code>)을 빼먹음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-o 비밀.png</code> 붙이기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>stegano-lsb: error: unrecognized arguments: 산책.png</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">띄어쓰기 있는 파일 이름이나 쪽지 글을 따옴표 없이 씀</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>"가을 산책.png"</code>, <code>-m "띄어 쓴 글"</code>처럼 큰따옴표</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>FileNotFoundError: [Errno 2] No such file or directory: '없는그림.png'</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파일 이름이 틀렸거나 다른 폴더에서 명령 창을 엶</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>dir</code>로 이름 확인, 탐색기 주소창 <code>cmd</code>로 그 폴더에서 열기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>Exception: The message you want to hide is too long: 533336 bytes</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">숨길 파일이 그림보다 큼 (1280×720 그림 기준 약 34만 바이트, 파일은 약 4/3배로 늘어남)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">더 큰 그림을 쓰거나 파일을 줄이기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">꺼낸 쪽지가 <code>W+qwgOyD…</code> 같은 글자</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파일을 통째로 숨긴 그림을 <code>-o</code> 없이 꺼냄</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-o 꺼낸쪽지.txt</code>를 붙여 파일로 꺼내기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">결과 파일이 원래 있던 파일을 덮어씀</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Stegano는 같은 이름이 있어도 묻지 않음(시연)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">결과 이름을 새로 적기, 또는 묻고 진행하는 <code>비밀쪽지.bat</code> 쓰기</td></tr>
</tbody>
</table>

### 7. 지우는 법
```cmd
:: Stegano 지우기 (opencv-python·numpy·Pillow 는 다른 프로그램이 쓸 수 있어 남김)
py -m pip uninstall stegano

:: 함께 설치된 큰 프로그램(opencv-python, 약 300MB)도 지우려면 (다른 프로그램이 안 쓸 때만)
py -m pip uninstall opencv-python

:: 파이썬까지 지우기 (winget 으로 설치했을 때)
winget uninstall Python.Python.3.13
```
- 설치 파일로 파이썬을 설치했다면 `설정` → `앱` → `설치된 앱`에서 Python을 찾아 제거합니다. 만든 그림은 지워지지 않습니다

### 자주 쓰는 옵션
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">옵션</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">하는 일</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>hide</code> · <code>reveal</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">숨기기 · 꺼내기 (명령 이름 <code>stegano-lsb</code> 바로 뒤)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-i 그림</code> · <code>-o 이름</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">넣을 그림 · 결과 이름 (숨기기는 <code>.png</code> 필수, 꺼내기에서는 꺼낸 파일 이름)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-m "글"</code> · <code>-f 파일</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">숨길 쪽지 글 · 숨길 파일 (둘 중 하나)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-g 이름</code> · <code>-s 숫자</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">숨기는 차례(예: <code>eratosthenes</code> 소수 차례, 목록은 <code>stegano-lsb list-generators</code>) · 차례를 몇 칸 건너뛰고 시작 (꺼낼 때도 같게)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-e UTF-32LE</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">글자 저장 방식 (기본 UTF-8로도 한글 됨, 시연)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>stegano-steganalysis-parity -i 그림 -o 검사.png</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">끝자리만 모아 보는 검사 그림 만들기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>stegano-red</code> · <code>stegano-rdh</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">빨강 색만 쓰는 방식 · 꺼낸 뒤 원본 그림으로 되돌리는 방식 (<code>stegano-red</code>는 영어 쪽지 확인, <code>stegano-rdh</code>는 시연하지 않음)</td></tr>
</tbody>
</table>

## 5. 어디에 쓰면 좋을까
- **가족·친구에게 깜짝 쪽지** → 그림 파일 속에 생일 파티 계획·퀴즈 정답을 숨겨 보내기 (PNG 파일 그대로)
- **방탈출·보물찾기 놀이** → `-g`로 숨기는 차례를 바꿔 '그림 속 비밀' 문제 만들기
- **스테가노그래피 공부** → 색 번호 1칸 차이와 검사 그림으로 숨기는 기술이 어떻게 작동하는지 확인

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 무료입니다. GPL-3.0 이상 라이선스로 누구나 쓸 수 있고, 고쳐서 배포할 때는 같은 라이선스로 공개해야 합니다.

**Q. 숨긴 쪽지는 안전합니까?**
**A.** 아닙니다. 숨기기일 뿐 암호화가 아니어서 Stegano를 가진 사람은 누구나 꺼낼 수 있습니다. 비밀번호·개인정보는 넣지 마시기 바랍니다.

**Q. 카카오톡으로 보내도 쪽지가 남습니까?**
**A.** 확인하지 못했습니다. 시연에서는 JPG로 다시 저장하거나 크기를 1% 줄이자 쪽지가 사라졌습니다. 메신저가 그림을 다시 압축하면 사라질 수 있으므로, PNG 파일 그대로(파일 전송·메일 첨부 등) 보내시기 바랍니다.

**Q. 사진(JPG)에도 숨길 수 있습니까?**
**A.** JPG 사진을 넣을 수는 있지만 결과는 꼭 `.png`로 저장해야 합니다. 시연에서 61.3KB JPG가 199.5KB PNG가 됐습니다.

**Q. 화면이 있는 프로그램입니까?**
**A.** 명령 창에서 쓰는 도구입니다. 그림을 끌어다 놓는 `.bat` 파일을 함께 올려 두었습니다.

## 마무리
Stegano는 그림 속 색 번호 끝자리에 쪽지를 적는 "투명 잉크 편지" 같은 무료 프로그램입니다. 시연에서 숨기기는 0.22초, 꺼내기는 0.17초였고 바뀐 점은 0.02%뿐이었습니다. 다만 암호화가 아니고, JPG로 바꾸면 쪽지가 사라진다는 점을 꼭 기억하시기 바랍니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-28에 클라우드 작업 공간(리눅스)에서 코드로 그린 가상 그림과 가상 쪽지로 자동 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows·파이썬 버전 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 GitHub 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 Stegano 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(GPL-3.0 이상)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 GitHub 저장소·PyPI에서만 받으시기 바랍니다.
- Stegano는 숨기기 도구이며 암호화가 아니어서 실제 안전을 보장하지 않습니다. 비밀번호·개인정보는 넣지 말고, 다른 사람의 그림·회사 보안 규칙을 해치는 용도로 쓰지 마시기 바랍니다.

---
**태그**: Stegano, 스테가노, 스테가노그래피, 사진속비밀글, 숨은메시지, 파이썬프로그램, 무료프로그램, 오픈소스, 깃허브추천
