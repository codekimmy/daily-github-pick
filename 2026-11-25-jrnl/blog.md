<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → jrnl 썸네일: 날짜 도장이 찍힌 가상 일기 카드 3장과 0.15초 도장, '명령 창 한 줄로 일기 끝'·'10년치 찾기 0.34초' 글자
terminal.gif → jrnl 터미널 시연: 한 줄 일기 2개 쓰기 → @점심 꼬리표로 1개 찾기 → --tags로 꼬리표 4개 횟수 → 별표 일기 → 마크다운 파일 내보내기 순으로 바뀌는 명령 창 화면
write-tags.png → jrnl 한 줄 쓰기 0.15초와 @점심 꼬리표 찾기 결과 그림: 가상 일기 4개 중 김치찌개 일기 1개만 남고, --tags 표에 꼬리표 6개가 1번씩 표시된 화면
ten-years.png → jrnl로 가상 일기 10년치 3,650개에서 '떡볶이'로 검색해 떡볶이를 쓴 날 461개가 0.34초 만에 나온 결과 그림, @운동 607개·2020년 366개·별표 118개·해마다 오늘 9개 결과 알약 포함
encrypt.png → jrnl 암호 자물쇠 결과 그림: 잠그기 전 432바이트 텍스트 파일이 0.45초 만에 JRNLv3로 시작하는 732바이트 알 수 없는 글자로 바뀌고, 틀린 암호 3번이면 멈춘 화면
-->
# jrnl이란? 명령 창 한 줄로 쓰는 무료 일기장·업무 일지 사용법 총정리 (설치법 포함)

> **한 줄 요약** — 명령 창에 글을 한 줄 쓰면 날짜·시간을 붙여 저장하고, 꼬리표·날짜·글자로 다시 찾아 주는 무료 일기장 프로그램입니다.
> ⭐ 7,363 (2026-11-25 확인) · 무료 오픈소스 · GPL-3.0 라이선스

> **일반인 쓸모 ★★★☆☆ (3)** — 명령 창에 한 줄 쓰면 날짜가 붙어 0.15초 만에 저장됐고, 가상 일기 10년치 3,650개에서 낱말로 검색해 그 낱말을 쓴 날들이 나오는 데도 0.34초였습니다. 암호 자물쇠도 됩니다. 다만 화면 없는 명령어 도구이고 휴대폰 앱이 없어, PC 앞에서 기록하는 사람에게만 쓸 일이 많아 별 세 개입니다.
> **이걸로 할 수 있는 것**
> 1. **업무 일지·회의 메모**를 명령 한 줄로 남기고 `@회의` 꼬리표로 모아 본다 (시연: 평균 0.15초)
> 2. **한 줄 일기·가계부 메모**를 쌓고 "해마다 오늘 쓴 일기"를 꺼내 본다 (시연: 가상 10년치에서 9개, 0.32초)
> 3. 남이 보면 안 되는 일기에 **암호 자물쇠**를 채운다 (시연: 잠근 파일은 알 수 없는 글자만 보임)

[이미지: thumbnail.jpg | 대체 텍스트: jrnl 썸네일: 날짜 도장이 찍힌 가상 일기 카드 3장과 0.15초 도장, '명령 창 한 줄로 일기 끝'·'10년치 찾기 0.34초' 글자]

## 목차
1. jrnl이란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. Windows에서 쓰는 법 (설치·실행·오류 해결)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. jrnl이란 무엇입니까?
jrnl(제알엔엘, journal의 줄임말)은 명령 창에서 일기를 쓰고 찾는 무료 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램)입니다. 파이썬(프로그래밍 언어)으로 만들어졌고, 2012년부터 개발돼 GitHub 별이 7천 개가 넘습니다.

일기장 앱을 켜고, 새 글 단추를 누르고, 날짜를 고르는 과정이 귀찮아 기록을 미룬 적이 있다면 쓸모를 바로 알 수 있습니다. jrnl은 명령 창에 `jrnl 점심은 김치찌개였다.` 한 줄이면 끝입니다. 일기는 회사 서버가 아니라 **내 PC의 텍스트 파일 하나**에 쌓입니다.

## 2. 비유로 쉽게 이해하기
jrnl은 **날짜 도장 수첩**입니다.

- **① 한 줄 쓰면 날짜 도장이 찍힘**: 글을 쓰면 수첩이 지금 날짜·시간 도장을 찍습니다. 첫 문장은 제목이 됩니다. `yesterday:`처럼 날짜 표현을 붙이면 그 날짜 도장을 찍습니다(영어·숫자만)
- **② @꼬리표 = 색깔 띠지**: `@점심`, `#가계부`처럼 붙여 두면 그 꼬리표가 붙은 쪽만 모아 볼 수 있습니다. 한글 꼬리표도 됩니다
- **③ 수첩 자물쇠 = 암호**: 수첩 전체에 암호를 걸면 파일을 열어도 알아볼 수 없는 글자만 보입니다
- **수첩 종이 = 텍스트 파일 하나**: 메모장으로 열리고, 마크다운·JSON 파일로 내보낼 수 있습니다

## 3. 실제 화면으로 보기
아래는 2026-11-25에 클라우드(리눅스, CPU 2개)에서 jrnl 4.6을 **시연용 가상 일기**로 자동 실행한 결과입니다. 시간 표시는 설정 파일에서 24시간 표시로 바꿨습니다.

[이미지: terminal.gif | 대체 텍스트: jrnl 터미널 시연: 한 줄 일기 2개 쓰기 → @점심 꼬리표로 1개 찾기 → --tags로 꼬리표 4개 횟수 → 별표 일기 → 마크다운 파일 내보내기 순으로 바뀌는 명령 창 화면]

**① 한 줄 쓰기와 날짜 표현** — `jrnl "점심은 김치찌개였다. @점심 #가계부 9000원"`처럼 쓰면 5번 평균 **0.15초**에 저장됐습니다. 글 앞에 `yesterday:`를 붙이면 어제(11-24) 09:00, `2026-11-20 7pm:`을 붙이면 그 날짜로 저장됐습니다. 다만 한글로 `어제:`라고 쓰면 날짜로 알아듣지 못하고 지금 시각으로 저장되며 '어제:'가 제목 글자로 남았습니다. `last monday`는 이번 주 월요일(11-23)이 아니라 지난주 월요일(11-16)로 저장됐습니다.

**② 꼬리표로 찾기** — `jrnl @점심`으로 그 꼬리표 일기 1개가 **0.14초**에 나왔고, `--tags`는 꼬리표마다 쓴 횟수를 표로 보여 줬습니다. 별표 일기(`-starred`), 글자 찾기(`-contains`), 기간(`-from`·`-to`)도 됐습니다.

[이미지: write-tags.png | 대체 텍스트: jrnl 한 줄 쓰기 0.15초와 @점심 꼬리표 찾기 결과 그림: 가상 일기 4개 중 김치찌개 일기 1개만 남고, --tags 표에 꼬리표 6개가 1번씩 표시된 화면]

**③ 파일로 내보내기** — `--format md --file 일기.md`로 가상 일기 6개를 마크다운 파일(475바이트)로 내보냈고, 연도·월 제목이 저절로 붙었습니다. JSON(1,776바이트)·텍스트 파일(432바이트)도 됐습니다.

**④ 암호 자물쇠** — `jrnl --encrypt`로 암호를 두 번 넣자 **0.45초** 만에 잠겼습니다. 잠근 파일은 432바이트에서 732바이트로 바뀌었고, 앞부분이 `JRNLv3`인 알 수 없는 글자라 본문의 '김치찌개'는 한 번도 보이지 않았습니다. 틀린 암호를 넣으면 `Wrong password, try again`을 세 번 묻고 `Too many attempts with wrong password`로 끝났습니다.

[이미지: encrypt.png | 대체 텍스트: jrnl 암호 자물쇠 결과 그림: 잠그기 전 432바이트 텍스트 파일이 0.45초 만에 JRNLv3로 시작하는 732바이트 알 수 없는 글자로 바뀌고, 틀린 암호 3번이면 멈춘 화면]

**⑤ 10년치 일기 찾기** — 가상 일기 3,650개(약 285KB)를 넣고 찾아본 결과입니다.

> **읽는 법** — 시간은 명령을 입력하고 결과가 나올 때까지 걸린 전체 시간(프로그램을 켜는 시간 포함, 3번 중 가장 빠른 값)입니다. CPU 2개 클라우드 기준이라 내 PC에서는 다를 수 있습니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">찾은 것</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">명령</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">개수</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">시간</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">'떡볶이'로 검색 → 떡볶이를 쓴 날</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-contains 떡볶이</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">461개</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.34초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>@운동</code> 꼬리표</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>@운동</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">607개</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.34초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">2020년 일기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-year 2020</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">366개</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.33초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">별표 일기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-starred</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">118개</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.33초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">해마다 오늘(11월 25일)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-today-in-history</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">9개</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.32초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">마크다운 내보내기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--format md --file</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">300KB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.37초</td></tr>
</tbody>
</table>

[이미지: ten-years.png | 대체 텍스트: jrnl로 가상 일기 10년치 3,650개에서 '떡볶이'로 검색해 떡볶이를 쓴 날 461개가 0.34초 만에 나온 결과 그림, @운동 607개·2020년 366개·별표 118개·해마다 오늘 9개 결과 알약 포함]

**아쉬운 점** — 화면 없는 명령어 도구이고 휴대폰 앱이 없습니다. 꾸민 상자 화면(`--format fancy`)과 `--tags` 표에서는 한글 줄이 어긋났습니다(기본 화면·마크다운 내보내기는 한글 그대로). 처음 실행 때 질문 3개(영어)에 답해야 합니다.

## 4. Windows에서 쓰는 법 (처음부터 끝까지)
> 시연은 클라우드(리눅스)에서 했고, 아래 Windows 방법은 jrnl 도움말(`jrnl --help`)·PyPI 설치 정보(`jrnl-4.6-py3-none-any.whl` = 운영체제 상관없이 쓰는 순수 파이썬 파일, 파이썬 3.11~3.14)·jrnl 소스 코드의 Windows 안내 문구·공식 문서(설정 파일 위치, 외부 편집기)를 바탕으로 정리한 것입니다. **Windows에서 직접 실행해 확인한 것은 아닙니다.** 각 단계의 '성공 화면'과 다르게 나오면 아래 '자주 나는 오류'를 보시기 바랍니다.

### 0. 준비물
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">항목</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">내용</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">운영체제</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Windows 10·11</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">필요한 프로그램</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파이썬 <b>3.11~3.14</b> (3.13 권장 · 3.15는 jrnl 4.6 설치 조건 밖)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">따로 설치할 것</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">없음 (편집기로 길게 쓰고 싶으면 Notepad++·VS Code 선택)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설치 크기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">약 27MB (리눅스 시연 측정, jrnl이 안에서 쓰는 보조 프로그램 포함, 따로 실행할 일 없음 · Windows는 보조 프로그램 목록이 조금 다를 수 있음)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면 없는 명령어 도구 (명령 프롬프트에서 사용) · 저장소의 <code>한줄일기.bat</code>는 두 번 눌러 씀</td></tr>
</tbody>
</table>

### 1. 파이썬 설치
1. https://www.python.org/downloads/ 에서 **Python 3.13**을 받습니다 (Download 단추)
2. 설치 첫 화면 아래 **"Add python.exe to PATH"를 반드시 체크**하고 **Install Now**를 누릅니다
3. 명령 프롬프트 열기: `윈도우 키` → `cmd` 입력 → Enter
```cmd
:: 파이썬 확인 → "Python 3.13.x"처럼 나오면 성공
py --version
```

### 2. jrnl 설치
```cmd
:: jrnl 설치 → 마지막 줄에 "Successfully installed … jrnl-4.6 …"이 나오면 성공
py -m pip install jrnl

:: 버전 확인 → "jrnl v4.6"이 나오면 성공 (jrnl 명령이 안 되면 py -m jrnl 로)
py -m jrnl --version
```
- `jrnl`만 입력해도 되지만, 파이썬 Scripts 폴더가 PATH에 없으면 '내부 또는 외부 명령이 아닙니다'가 나옵니다. 이 글은 어디서나 되는 **`py -m jrnl`**로 적었습니다

### 3. 처음 실행 — 질문 3개
```cmd
:: 첫 일기를 쓰면 질문 3개가 차례로 나옴
py -m jrnl "첫 일기입니다. 오늘 jrnl을 설치했다. @설치"
```
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">화면에 나오는 질문 (영어)</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">뜻</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">모르면</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>Path to your journal file (leave blank for …)</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">일기 파일을 어디에 둡니까?</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>Enter</b> (괄호 안 기본 위치)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>Do you want to encrypt your journal? … [y/N]</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">암호를 겁니까?</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>Enter</b> (안 걸기, 나중에 <code>--encrypt</code>로 걸 수 있음)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>Do you want jrnl to use colors to display entries? … [Y/n]</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">색으로 보여 줍니까?</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>Enter</b> (색 쓰기)</td></tr>
</tbody>
</table>
- 성공 화면: `jrnl configuration created at …jrnl.yaml` 상자와 `Journal 'default' created at …journal.txt` 상자가 나오면 성공입니다
- **일기 파일 위치 확인**: `py -m jrnl --list` → `* default -> (일기 파일 경로)`가 나옵니다. 백업할 때 이 파일을 복사합니다
- **설정 파일**: 공식 문서 기준 Windows는 보통 `%USERPROFILE%\.config\jrnl\jrnl.yaml`입니다. 메모장으로 열기: `notepad %USERPROFILE%\.config\jrnl\jrnl.yaml`
  - 시간을 24시간으로 보려면 `timeformat: '%F %r'` 줄을 `timeformat: '%Y-%m-%d %H:%M'`으로 바꿔 저장합니다 (시연에서 이렇게 바꿈)

### 4. 내 일기 써 보기·찾기
글에 띄어쓰기·기호가 있으므로 **글 전체를 큰따옴표로 감쌉니다.** 글 속에는 큰따옴표(`"`)를 쓰지 않습니다.
```cmd
:: ① 지금 시각으로 한 줄 쓰기 (첫 문장이 제목, @점심·#가계부는 꼬리표)
py -m jrnl "점심은 김치찌개였다. @점심 #가계부 9000원"

:: ② 날짜를 붙여 쓰기 — 날짜 표현은 영어·숫자만 (한글 '어제:'는 안 됨)
py -m jrnl "yesterday: 친구 생일 파티. @모임"
py -m jrnl "2026-11-20 7pm: 팀 회의 메모. @회의"

:: ③ 별표(중요) 일기 — 글 맨 앞에 *
py -m jrnl "*합격 발표가 났다!"

:: ④ 여러 줄 쓰기 — jrnl만 입력 → 글을 여러 줄 쓰고 → 빈 줄에서 Ctrl+Z 누르고 Enter
py -m jrnl

:: ⑤ 찾기: 최근 5개 / 꼬리표 / 글자 / 기간 / 별표 / 제목만
py -m jrnl -n 5
py -m jrnl @점심
py -m jrnl -contains 김치
py -m jrnl -from 2026-11-01 -to 2026-11-30 --short
py -m jrnl -starred
py -m jrnl --tags

:: ⑥ 해마다 오늘 쓴 일기 / 달력으로 보기
py -m jrnl -today-in-history
py -m jrnl --format calendar

:: ⑦ 마크다운 파일로 내보내기 → 지금 명령 창 폴더에 일기.md 생김 → 폴더 열기
py -m jrnl --format md --file 일기.md
explorer .
```
- 일기는 **한 파일(`journal.txt`)에 계속 덧붙여** 저장됩니다. 내보내기(`--file`)는 새 파일을 만들 뿐 원본을 바꾸지 않습니다
- 내보낸 파일을 원하는 폴더에 만들려면: 그 폴더를 탐색기로 열고 **주소창에 `cmd` 입력 → Enter** → 그 폴더에서 명령 창이 열립니다
- 꼬리표는 `@`나 `#` 바로 뒤에 띄어쓰기 없이 씁니다(`@점심` ○, `@ 점심` ×)

### 5. 명령어 없이 쓰기 — 두 번 눌러 쓰는 실행 파일
- 저장소(github.com/codekimmy/daily-github-pick)의 `2026-11-25-jrnl/demo/tools_win/한줄일기.bat`을 받아 바탕화면 등에 두고 **마우스로 두 번 누르면** "오늘 일기 한 줄을 입력"하라는 글이 나옵니다 → 한 줄 쓰고 Enter → 일기장에 저장된 뒤 **최근 일기 5개**를 보여 줍니다
- 파이썬이나 jrnl이 없으면 무엇을 설치할지 안내하고 멈춥니다. 처음 한 번은 위 '질문 3개'가 이 창에 나옵니다(모르면 Enter 세 번)
- 따옴표·`&`·`%` 같은 기호도 그대로 저장됩니다(글을 명령 줄이 아닌 환경 변수로 넘김). `.bat` 안의 파이썬 명령은 리눅스에서 같은 방식으로 확인했고, `.bat` 파일 자체는 Windows에서 실행해 보지 않았습니다

### 6. 자주 나는 오류와 해결
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">화면에 나온 말</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">원인</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">해결</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'python'은(는) 내부 또는 외부 명령 … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파이썬 설치 때 PATH 체크 빠짐</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>py</code> 명령 사용, 또는 파이썬을 다시 설치하며 "Add python.exe to PATH" 체크</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'jrnl'은(는) 내부 또는 외부 명령 … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파이썬 Scripts 폴더가 PATH에 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>py -m jrnl …</code>로 실행</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">pip가 jrnl 설치를 거부하고 파이썬 버전 이야기가 나옴</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">jrnl 4.6은 파이썬 3.11~3.14만 지원(PyPI 정보)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">python.org에서 3.13 설치 후 <code>py -3.13 -m pip install jrnl</code></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>Wrong password, try again</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">암호가 틀림</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">다시 입력 (3번 틀리면 <code>Too many attempts with wrong password</code>로 끝남 — 시연에서 실제로 나온 문구)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">한글 <code>어제:</code>가 날짜가 안 되고 제목에 그대로 남음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">날짜 표현은 영어만 알아들음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>yesterday:</code> 또는 <code>2026-11-24 9am:</code>처럼 숫자로</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">여러 줄 쓰기에서 끝나지 않음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Windows는 끝내는 키가 다름</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">빈 줄에서 <b>Ctrl+Z → Enter</b> (리눅스·맥은 Ctrl+D)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>&amp;</code> 뒤 글이 잘리고 이상한 명령 오류</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">글을 큰따옴표로 감싸지 않음 (cmd에서 <code>&amp;</code>는 명령 구분 기호)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">글 전체를 <code>"…"</code>로 감싸거나 <code>한줄일기.bat</code> 사용</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>EOFError</code> · <code>EOF when reading a line</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">처음 실행 질문에 답할 입력 창이 없음(파이프·예약 작업 등)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">명령 프롬프트를 직접 열어 한 번 실행해 질문 3개에 답함</td></tr>
</tbody>
</table>

### 7. 지우는 법
```cmd
:: 프로그램 지우기 (일기 파일·설정 파일은 남음)
py -m pip uninstall jrnl

:: 일기까지 지우려면: 먼저 py -m jrnl --list 로 일기 파일 위치를 보고 백업한 뒤,
:: 그 파일과 설정 폴더(%USERPROFILE%\.config\jrnl)를 탐색기에서 직접 지웁니다
explorer %USERPROFILE%\.config\jrnl
```

### 자주 쓰는 옵션
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">옵션</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">하는 일</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-n 5</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">최근 5개만</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-on today</code> · <code>-on yesterday</code> · <code>-on 2026-11-20</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">그날 쓴 것</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-from 날짜 -to 날짜</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">기간</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>@꼬리표</code> · <code>-contains 글자</code> · <code>-starred</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">꼬리표 · 글자 · 별표로 찾기 (여러 조건을 모두 만족하려면 <code>-and</code>)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--short</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">제목만</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--tags</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">꼬리표마다 쓴 횟수</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-today-in-history</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">해마다 오늘 쓴 일기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--format md · json · txt · calendar</code> + <code>--file 이름</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">다른 모양으로 보기 · 파일로 내보내기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--encrypt</code> · <code>--decrypt</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">암호 걸기 · 풀기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--edit</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">고른 일기를 편집기로 열어 고치기 (설정 파일 <code>editor:</code>가 필요. 공식 문서 예: <code>editor: "code --wait"</code>(VS Code), Notepad++는 <code>"C:\\Program Files (x86)\\Notepad++\\notepad++.exe -multiInst -nosession"</code> — 시연하지 않음)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--delete</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">고른 일기를 하나씩 물어보며 지우기 (시연하지 않음)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>jrnl 업무 "글"</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설정 파일에 더한 <code>업무</code> 일기장에 쓰기</td></tr>
</tbody>
</table>

## 5. 어디에 쓰면 좋을까
- **직장인 업무 일지** → 명령 창에 회의 메모를 한 줄씩, 금요일에 그 주 월요일 날짜로 `-from 날짜 --short` 한 주 정리
- **한 줄 일기·가계부 메모** → `@운동`, `#가계부` 꼬리표로 나중에 모아 보기
- **비밀 일기** → 내 PC의 텍스트 파일 하나 + 암호 자물쇠 (암호는 따로 적어 두기)

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 무료입니다. GPL-3.0 라이선스로 개인·회사 모두 쓸 수 있고, 프로그램을 고쳐서 배포할 때는 같은 라이선스로 공개해야 합니다.

**Q. 한글로 써도 됩니까?**
**A.** 일기 글과 꼬리표(`@점심`)는 한글이 그대로 저장되고 찾아집니다. 다만 날짜 표현은 영어만 알아들어 `어제:` 대신 `yesterday:`나 `2026-11-24 9am:`처럼 써야 합니다.

**Q. 일기는 어디에 저장됩니까?**
**A.** 내 PC의 텍스트 파일 하나(`journal.txt`)에 저장됩니다. 위치는 `py -m jrnl --list`로 확인하고, 이 파일을 복사해 두면 백업이 됩니다.

**Q. 암호를 잊으면 어떻게 됩니까?**
**A.** 되살릴 방법이 없습니다. 암호는 따로 적어 두고 일기 파일도 따로 백업하시기 바랍니다.

**Q. 휴대폰에서도 쓸 수 있습니까?**
**A.** jrnl은 PC용 명령어 도구이고 휴대폰 앱은 없습니다.

## 마무리
jrnl은 한 줄 쓰면 날짜 도장을 찍어 주는 "날짜 도장 수첩"입니다. 시연에서 한 줄 쓰기는 0.15초, 가상 일기 10년치 3,650개에서 찾기는 0.34초였고, 암호 자물쇠도 됐습니다. 다만 날짜 표현은 영어만 알아듣고, 암호를 잊으면 되살릴 수 없으며, 명령 창에 익숙해지는 시간이 필요합니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-25에 클라우드 작업 공간(리눅스)에서 시연용 가상 일기로 자동 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 jrnl 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(GPL-3.0)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- 암호를 잊으면 잠근 일기를 되살릴 방법이 없습니다. 암호는 따로 적어 두고, 일기 파일은 따로 백업하시기 바랍니다. 암호 자물쇠가 모든 보안 위협을 막아 주지는 않습니다.

---
**태그**: jrnl, 일기장프로그램, 업무일지, 명령어일기, 한줄일기, 무료일기앱, 암호일기, 파이썬, 오픈소스, 깃허브추천
