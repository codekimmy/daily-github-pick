<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → glitch-this 썸네일: 가상 겨울바다 원본 그림 카드에서 화살표로 색이 어긋난 결과 카드로 바뀌고 0.17초 도장, '멀쩡한 그림을 고장 난 TV처럼'·'움직이는 GIF 23장도 1.41초' 글자
terminal.gif → glitch-this 터미널 시연: 버전 확인 → 세기 5로 망가뜨려 glitched_겨울바다.png 생성 → 색 어긋남과 줄무늬 → 움직이는 GIF 23장 331,500바이트 → 같은 이름이 있어 멈춘 오류 순으로 바뀌는 명령 창 화면
levels.png → glitch-this 세기 비교 그림: 왼쪽 가상 원본 겨울바다 그림, 오른쪽 세기 1·5·10 결과와 달라진 부분 0.4%·7.8%·9.7%, 원본은 그대로·같은 씨앗 번호는 같은 결과 알약
effects.png → glitch-this 효과 비교 그림: 색 어긋남(-c) 결과, 줄무늬(-s)로 밝기가 161에서 81로 어두워진 결과, 움직이는 GIF 23장 중 한 장, 씨앗 번호와 GIF를 같이 쓰면 1장짜리가 된다는 경고
install-limits.png → glitch-this 설치와 아쉬운 점 그림: Windows 파이썬 설치와 pip 설치 명령 창, 가상 포스터에 색 어긋남을 넣은 결과, 효과 세 가지뿐·촬영 정보 안 남음·마지막 수정 2024년·같은 이름은 덮어쓰지 않음 알약
-->
# glitch-this란? 사진을 고장 난 TV 화면·글리치 GIF로 만드는 무료 효과 프로그램 사용법 총정리 (설치법 포함)

> **한 줄 요약** — 그림의 가로 띠를 밀고, 색을 어긋나게 하고, 줄무늬를 그어 '화면이 깨진' 그림이나 움직이는 GIF를 만드는 무료 파이썬 프로그램입니다.
> ⭐ 1,797 (2026-11-27 확인) · 무료 오픈소스 · MIT 라이선스

> **일반인 쓸모 ★★½☆☆ (2.5)** — 코드로 그린 가상 그림에 명령 한 줄을 넣자 0.17초 만에 고장 난 텔레비전 화면처럼 바뀌었고, 움직이는 GIF 23장도 1.41초 만에 만들어졌습니다. 다만 파이썬을 먼저 설치해야 하는 명령어 도구이고, 효과는 세 가지뿐이며 마지막 수정이 2024년이라 별 두 개 반입니다.
> **이걸로 할 수 있는 것**
> 1. 영상 썸네일·공연 포스터에 **지직거리는 고장 화면 효과**를 넣는다 (시연: 0.17초)
> 2. 프로필·메신저용 **짧은 움직이는 GIF**를 만든다 (시연: 23장 1.41초)
> 3. 파이썬을 아는 사람은 **코드 몇 줄로 다른 프로그램에** 넣는다

[이미지: thumbnail.jpg | 대체 텍스트: glitch-this 썸네일: 가상 겨울바다 원본 그림 카드에서 화살표로 색이 어긋난 결과 카드로 바뀌고 0.17초 도장, '멀쩡한 그림을 고장 난 TV처럼'·'움직이는 GIF 23장도 1.41초' 글자]

## 목차
1. glitch-this란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. Windows에서 쓰는 법 (설치·실행·오류 해결)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. glitch-this란 무엇입니까?
glitch-this(글리치 디스)는 그림에 '글리치'(화면이 깨진 듯한 효과)를 넣는 무료 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램)입니다. 2020년에 GitHub 저장소가 만들어졌고 GitHub 별은 1,797개입니다. 최신 버전은 2024-03-11에 PyPI에 올라온 1.0.3이고, GitHub 저장소의 마지막 수정은 2024-06-06입니다.

사진 편집 프로그램에서 지직거리는 효과를 손으로 만들려면 레이어를 잘라 밀고 색을 나누는 일을 여러 번 해야 합니다. glitch-this는 `glitch_this 사진.png 5` 한 줄로 이 일을 대신합니다. 숫자는 망가뜨리는 세기(0.1~10)입니다.

## 2. 비유로 쉽게 이해하기
glitch-this는 **일부러 고장 낸 텔레비전**입니다.

- **① 가로 띠를 옆으로 밀기**: 화면이 지직거릴 때처럼 그림 몇 줄을 좌우로 밉니다. 세기가 클수록 많이 밉니다
- **② 색 어긋남(`-c`)**: 빨강·초록·파랑 가운데 한 색을 옆으로 밀어 그림자처럼 번지게 합니다
- **③ 줄무늬(`-s`)**: 한 줄 건너 한 줄을 검게 칠해 옛날 브라운관 화면처럼 만듭니다. 그래서 그림이 절반쯤 어두워집니다
- **여러 번 고장 내서 이어 붙이면 GIF**: 매번 조금씩 다르게 고장 낸 그림을 이어 움직이는 그림을 만듭니다

## 3. 실제 화면으로 보기
아래는 2026-11-27에 클라우드(리눅스, CPU 4개, 파이썬 3.13)에서 glitch-this 1.0.3을 **코드로 그린 가상 그림**으로 자동 실행한 결과입니다.

[이미지: terminal.gif | 대체 텍스트: glitch-this 터미널 시연: 버전 확인 → 세기 5로 망가뜨려 glitched_겨울바다.png 생성 → 색 어긋남과 줄무늬 → 움직이는 GIF 23장 331,500바이트 → 같은 이름이 있어 멈춘 오류 순으로 바뀌는 명령 창 화면]

**① 세기 바꾸기** — `glitch_this 겨울바다.png 5`를 넣자 **0.17초** 만에 `glitched_겨울바다.png`가 새로 생겼고, 원본은 그대로였습니다. 원본과 달라진 부분은 세기 1에서 0.4%, 5에서 7.8%, 10에서 9.7%였습니다.

[이미지: levels.png | 대체 텍스트: glitch-this 세기 비교 그림: 왼쪽 가상 원본 겨울바다 그림, 오른쪽 세기 1·5·10 결과와 달라진 부분 0.4%·7.8%·9.7%, 원본은 그대로·같은 씨앗 번호는 같은 결과 알약]

**② 색 어긋남·줄무늬** — `-c`를 붙이자 한 색이 옆으로 밀려 번졌고 밝기는 그대로였습니다. `-s`를 붙이자 한 줄 건너 한 줄이 검게 칠해져 평균 밝기가 161에서 **81로 절반**이 됐습니다. 씨앗 번호(`-sd 42`)를 같게 주면 몇 번을 돌려도 같은 파일이 나왔습니다.

**③ 움직이는 GIF** — `-g`를 붙이자 **23장짜리 GIF가 1.41초** 만에 나왔습니다(333KB, 한 장 0.2초). 다만 씨앗 번호와 같이 쓰면 모든 장이 똑같아져 움직이지 않는 1장짜리가 됐습니다.

[이미지: effects.png | 대체 텍스트: glitch-this 효과 비교 그림: 색 어긋남(-c) 결과, 줄무늬(-s)로 밝기가 161에서 81로 어두워진 결과, 움직이는 GIF 23장 중 한 장, 씨앗 번호와 GIF를 같이 쓰면 1장짜리가 된다는 경고]

**④ 크게·많이** — 결과를 표로 정리했습니다.

> **읽는 법** — 시간은 명령을 입력하고 끝날 때까지 걸린 전체 시간(프로그램을 켜는 시간 포함, 3번 중 가장 빠른 값)이고, CPU 4개 클라우드 기준입니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">해 본 것</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">결과</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">시간</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1280×720 그림 · 세기 5</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">새 파일 glitched_겨울바다.png</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.17초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">같은 그림 · GIF (-g -c)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">23장 · 333KB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1.41초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">가상 포스터 JPG · 색 어긋남</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">JPG · 촬영 정보(EXIF) 2개 → 0개</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.17초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">4000×3000 큰 그림 한 장 (-c -s)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1,200만 화소</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.44초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">같은 큰 그림 · GIF 10장</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.5MB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">11.59초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1280×720 그림 20장 하나씩</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">20장</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">3.9초</td></tr>
</tbody>
</table>

[이미지: install-limits.png | 대체 텍스트: glitch-this 설치와 아쉬운 점 그림: Windows 파이썬 설치와 pip 설치 명령 창, 가상 포스터에 색 어긋남을 넣은 결과, 효과 세 가지뿐·촬영 정보 안 남음·마지막 수정 2024년·같은 이름은 덮어쓰지 않음 알약]

**아쉬운 점** — 파이썬을 먼저 설치해야 하는 명령어 도구이고, 효과는 띠 밀기·색 어긋남·줄무늬 세 가지뿐입니다. 실행할 때 인터넷으로 최신 버전을 확인합니다(14일마다, 인터넷을 막아도 그림은 만들어졌습니다). 도움말은 GIF 한 장 시간(`-d`)을 '1/100초'라고 설명하지만 실제로는 밀리초로 저장됐습니다. 반대로 같은 이름 파일이 있으면 `-f` 없이는 덮어쓰지 않고 멈추는 점은 안심할 만합니다.

## 4. Windows에서 쓰는 법 (처음부터 끝까지)
> 시연은 클라우드(리눅스)에서 했고, 아래 Windows 방법은 glitch-this 도움말(`glitch_this -h`)·PyPI 설명·winget 목록(`Python.Python.3.13` — microsoft/winget-pkgs GitHub 저장소에서 설치 정보 파일 확인)을 바탕으로 정리한 것입니다. **Windows에서 직접 실행해 확인한 것은 아닙니다.** 각 단계의 '성공 화면'과 다르게 나오면 아래 '자주 나는 오류'를 보시기 바랍니다.

### 0. 준비물
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">항목</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">내용</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">운영체제</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Windows 10·11 (64비트)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">필요한 프로그램</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파이썬 3 (PyPI 기준 3.6 이상, 시연은 3.13) + glitch-this 1.0.3</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">함께 설치되는 것</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">numpy · Pillow (그림을 다루는 파이썬 프로그램, 시연에서 합쳐 83.9MB)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면 없는 명령어 도구 (명령 프롬프트에서 사용) · GitHub 저장소의 <code>지직효과.bat</code>에 그림을 끌어다 놓아 쓸 수도 있음</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">인터넷</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설치할 때 필요 · 실행할 때 최신 버전을 확인하지만 인터넷이 없어도 그림은 만들어짐(시연)</td></tr>
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

### 2. glitch-this 설치
**설치가 끝나면 명령 프롬프트 창을 닫고 새로 엽니다.**
```cmd
:: 파이썬 버전 확인 → "Python 3.13.…"이 나오면 성공
py --version

:: glitch-this 설치 → 마지막 줄에 "Successfully installed glitch_this-1.0.3 …"이 나오면 성공
py -m pip install glitch-this

:: 설치 확인 → "glitch_this 1.0.3"이 나오면 성공
glitch_this --version
```
- 마지막 명령에서 `'glitch_this'은(는) 내부 또는 외부 명령 … 아닙니다`가 나오면 아래 '자주 나는 오류'를 보시기 바랍니다

### 3. 내 그림으로 해 보기
1. 그림이 있는 폴더를 탐색기로 엽니다
2. 탐색기 **주소창에 `cmd` 입력 → Enter** → 그 폴더에서 명령 창이 열립니다
3. 아래 명령을 붙여넣습니다. **결과는 같은 폴더에 `glitched_원래이름`으로** 생기고, 원본은 바뀌지 않습니다
```cmd
:: ① 세기 5로 망가뜨리기 (숫자 0.1~10, 클수록 많이 밀림) → glitched_사진.png
glitch_this 사진.png 5

:: ② 색 어긋남 + 줄무늬 (줄무늬는 그림이 절반쯤 어두워짐)
glitch_this 사진.png 5 -c -s -o 효과.png

:: ③ 움직이는 GIF 23장 (한 장 0.2초) → 움짤.gif
glitch_this 사진.png 5 -g -c -o 움짤.gif

:: ④ 장 수 10장 · 한 장 0.1초 (-d 는 밀리초로 저장됨)
glitch_this 사진.png 5 -g -c -fr 10 -d 100 -o 짧은움짤.gif

:: ⑤ 똑같은 결과를 다시 만들기 (씨앗 번호, 한 장짜리 그림에만)
glitch_this 사진.png 5 -c -sd 42 -o 고정.png

:: ⑥ 같은 이름 결과를 덮어쓰기 (-f 가 없으면 멈춤)
glitch_this 사진.png 5 -c -o 효과.png -f

:: ⑦ 파일 이름에 띄어쓰기가 있으면 큰따옴표
glitch_this "겨울 바다.png" 5

:: ⑧ 결과 폴더 열기
explorer .
```
- **`-o` 뒤 확장자는 무시됩니다.** PNG 그림에 `-o 결과.jpg`라고 적어도 `결과.png`로 저장됩니다(GIF는 `-g`일 때만)
- **`-g`와 `-sd`를 같이 쓰면** 모든 장이 같아져 움직이지 않는 1장짜리 GIF가 됩니다(시연)
- 결과 그림에는 원본의 촬영 정보(EXIF: 카메라·찍은 시각 등)가 남지 않았습니다(시연)

### 4. 명령어 없이 쓰기 — 끌어다 놓는 실행 파일
- GitHub 저장소의 [`demo/tools_win/지직효과.bat`](demo/tools_win/지직효과.bat)을 받아 바탕화면 등에 두고, **그 파일 위에 `.png`·`.jpg` 그림을 끌어다 놓으면** `1 = 그림 한 장, 2 = 움직이는 GIF`를 묻고, 같은 폴더에 `이름_지직.png`(또는 `.jpg`·`.gif`)를 만듭니다(세기 5 + 색 어긋남). 여러 장을 한꺼번에 놓아도 됩니다
- 결과 파일이 이미 있으면 덮어쓸지 먼저 묻습니다. 파이썬이나 glitch-this가 없으면 설치 방법을 안내하고 멈춥니다
- `glitch_this` 명령이 안 보이는 경우(아래 오류 ①)에도 쓸 수 있게 `py`로 직접 실행합니다
- `.bat` 안의 실행 방식은 리눅스에서 같은 방식으로 확인했고, `.bat` 파일 자체는 Windows에서 실행해 보지 않았습니다

### 5. 파이썬 코드로 쓰기 (선택)
```python
# 결과.png 를 같은 폴더에 만듦 (시연 0.13초)
from glitch_this import ImageGlitcher
ImageGlitcher().glitch_image('사진.png', 5, seed=42, color_offset=True).save('결과.png')
```

### 6. 자주 나는 오류와 해결
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">화면에 나온 말</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">원인</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">해결</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'py'은(는) 내부 또는 외부 명령 … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파이썬이 설치 안 됨, 또는 예전 명령 창을 그대로 씀</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">명령 창을 닫고 새로 열기 → 그래도 안 되면 1단계 다시</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'glitch_this'은(는) 내부 또는 외부 명령 … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">pip가 만든 실행 파일 폴더(Scripts)가 PATH에 없음[추정] — 설치 때 <code>WARNING: The script glitch_this.exe is installed in '…' which is not on PATH</code>가 나왔다면 이 경우</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">4단계의 <code>지직효과.bat</code> 쓰기, 또는 파이썬을 다시 설치하며 <code>Add python.exe to PATH</code> 체크</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>Exception: 효과.png already exists</code> / <code>Cannot overwrite existing file unless -f or --force is included</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">같은 이름 결과 파일이 이미 있음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">다른 이름(<code>-o</code>)을 쓰거나 끝에 <code>-f</code></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>ValueError: glitch_amount parameter must be a positive number in range 0.1 to 10.0, inclusive</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">세기를 0.1~10 밖으로 적음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.1~10 사이 숫자</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>FileNotFoundError: No image found at given path</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파일 이름이 틀렸거나 다른 폴더에서 명령 창을 엶</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>dir</code>로 이름 확인, 탐색기 주소창 <code>cmd</code>로 그 폴더에서 열기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>Exception: File format not supported - must be a non-animated image file</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">움직이는 GIF를 그냥 넣음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-ig</code>를 붙임 (<code>glitch_this 움짤.gif 4 -ig</code>)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>glitch_this: error: argument Glitch_Level: invalid float value: '바다.png'</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">띄어쓰기 있는 이름을 따옴표 없이 씀</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>"겨울 바다.png"</code>처럼 큰따옴표</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">GIF가 움직이지 않음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-g</code>와 <code>-sd</code>를 같이 씀 (시연: 1장짜리)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-sd</code>를 빼고 다시 만들기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">결과가 너무 어두움</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-s</code> 줄무늬가 한 줄 건너 한 줄을 검게 칠함 (시연: 밝기 절반)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-s</code>를 빼고 <code>-c</code>만 쓰기</td></tr>
</tbody>
</table>

### 7. 지우는 법
```cmd
:: glitch-this 지우기 (numpy·Pillow 는 다른 프로그램이 쓸 수 있어 남김)
py -m pip uninstall glitch-this

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
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">숫자 <code>0.1~10</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">망가뜨리는 세기 (필수, 그림 이름 바로 뒤)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-c</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">색 하나를 어긋나게 (밝기는 그대로)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-s</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">줄무늬 (한 줄 건너 검게, 그림이 어두워짐)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-g</code> · <code>-fr 숫자</code> · <code>-d 숫자</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">GIF로 만들기 · 장 수(기본 23) · 한 장 시간(기본 200, 실제 저장은 밀리초)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-ig</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">이미 움직이는 GIF를 넣을 때</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-sd 숫자</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">씨앗 번호 — 같은 번호면 같은 결과 (GIF에 쓰면 1장짜리)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-o 이름</code> · <code>-f</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">결과 이름(확장자는 무시) · 같은 이름 덮어쓰기 허락</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-l 숫자</code> · <code>-i 숫자</code> · <code>-cy</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">GIF 반복 횟수(0 = 계속) · 장마다 세기를 조금씩 올리기 · 세기가 범위를 넘으면 처음으로 (시연하지 않음)</td></tr>
</tbody>
</table>

## 5. 어디에 쓰면 좋을까
- **영상·SNS 썸네일, 공연 포스터** → 지직거리는 레트로 효과를 명령 한 줄로
- **프로필·메신저용 움직이는 그림** → `-g`로 짧은 GIF
- **파이썬으로 그림을 다루는 사람** → 라이브러리로 불러 다른 프로그램에

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 무료입니다. MIT 라이선스로 개인·회사 모두 쓸 수 있고 고쳐 써도 됩니다.

**Q. 원본 사진이 망가지지 않습니까?**
**A.** 시연에서는 원본은 그대로 두고 `glitched_원래이름`으로 새 파일을 만들었습니다. 같은 이름 결과가 있으면 `-f` 없이는 멈췄습니다. 그래도 원본은 따로 보관하시기 바랍니다.

**Q. 사진의 촬영 정보(위치·카메라)도 남습니까?**
**A.** 시연에서는 원본 JPG에 넣어 둔 촬영 정보(EXIF) 2개가 결과에는 0개였습니다.

**Q. 화면이 있는 프로그램입니까?**
**A.** 명령 창에서 쓰는 도구입니다. 그림을 끌어다 놓는 `.bat` 파일을 함께 올려 두었습니다.

**Q. 아직 관리되고 있습니까?**
**A.** 마지막 수정이 2024-06-06이라 새 기능이 나오지는 않는 상태로 보입니다(추정). 시연 시점의 최신 파이썬 3.13에서는 그대로 실행됐습니다.

## 마무리
glitch-this는 멀쩡한 그림을 "일부러 고장 낸 텔레비전" 화면처럼 바꿔 주는 무료 효과 프로그램입니다. 시연에서 그림 한 장은 0.17초, 움직이는 GIF 23장은 1.41초 만에 만들어졌고 원본은 그대로 남았습니다. 다만 파이썬을 먼저 설치해야 하고, 효과는 세 가지뿐이며, 줄무늬를 켜면 그림이 절반쯤 어두워집니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-27에 클라우드 작업 공간(리눅스)에서 코드로 그린 가상 그림으로 자동 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows·파이썬 버전 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 GitHub 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 glitch-this 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(MIT)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 GitHub 저장소·PyPI에서만 받으시기 바랍니다.
- 원본 그림은 따로 보관하시기 바랍니다. 다른 사람의 사진·그림에 효과를 넣어 올릴 때는 허락과 저작권을 확인하시기 바랍니다.

---
**태그**: glitch-this, 글리치디스, 글리치효과, 사진효과, GIF만들기, 움짤만들기, 레트로효과, 무료프로그램, 오픈소스, 깃허브추천
