<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → pandoc 썸네일: 가상 마크다운 메모 카드에서 화살표로 워드 문서 카드로 바뀌고 0.04초 도장, '메모장 글 → 워드 한 줄'·'PPT·전자책·PDF 도' 글자
terminal.gif → pandoc 터미널 시연: 마크다운 회의록 내용 보기 → 워드 문서로 바꾸기 → 파워포인트·전자책·웹페이지 파일 목록 → 워드를 다시 마크다운 표로 → PDF 오류 'pdflatex' not found → typst로 PDF 35,813바이트 순으로 바뀌는 명령 창 화면
md-to-docx.png → pandoc으로 가상 마크다운 회의록 821바이트를 0.04초 만에 워드 문서로 바꾼 결과 그림: 왼쪽 마크다운 원문, 오른쪽 LibreOffice로 연 워드 문서, 제목 스타일 4개·표 1개·굵은 글씨 3곳 알약
one-to-many.png → pandoc으로 같은 가상 회의록을 파워포인트 5장, 전자책 4개 장, 목차 붙은 웹페이지로 바꾼 결과 그림, 슬라이드 5장의 실제 모습 포함
pdf-hwp.png → pandoc PDF 결과 그림: 그냥 PDF로 바꾸면 'pdflatex' not found 오류, typst와 한글 글꼴을 지정하면 0.23초 만에 1쪽 PDF, 한글 문서(HWP) 저장은 경고만 나오고 속은 HTML인 화면
-->
# pandoc이란? 메모장 글을 워드·파워포인트·전자책으로 바꾸는 무료 문서 변환기 사용법 총정리 (설치법 포함)

> **한 줄 요약** — 한 형식으로 쓴 문서를 읽어 같은 내용을 다른 형식으로 다시 써 주는 무료 문서 변환 프로그램입니다.
> ⭐ 47,107 (2026-11-27 확인) · 무료 오픈소스 · GPL-2.0 라이선스

> **일반인 쓸모 ★★★½☆ (3.5)** — 메모장에 마크다운으로 쓴 가상 회의록이 명령 한 줄로 0.04초 만에 제목·표가 살아 있는 워드 문서가 됐고, 같은 글이 파워포인트 5장·전자책·웹페이지로도 바뀌었습니다. 다만 화면 없는 명령어 도구이고, 마크다운 쓰는 법을 조금 알아야 하며, 한글 문서(HWP)는 안 되고 PDF는 다른 프로그램을 따로 설치해야 해서 별 세 개 반입니다.
> **이걸로 할 수 있는 것**
> 1. 메모장에 쓴 **회의록·보고서 초안을 워드 문서**로 바꾼다 (시연: 0.04초)
> 2. 워드 문서나 저장한 **웹 기사를 AI 채팅에 붙여넣기 좋은 글**로 바꾼다 (시연: 제목·표 그대로)
> 3. 블로그 글을 **전자책·발표 자료**로 묶는다 (시연: 파워포인트 5장 0.06초)

[이미지: thumbnail.jpg | 대체 텍스트: pandoc 썸네일: 가상 마크다운 메모 카드에서 화살표로 워드 문서 카드로 바뀌고 0.04초 도장, '메모장 글 → 워드 한 줄'·'PPT·전자책·PDF 도' 글자]

## 목차
1. pandoc이란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. Windows에서 쓰는 법 (설치·실행·오류 해결)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. pandoc이란 무엇입니까?
pandoc(팬독)은 문서 형식을 바꿔 주는 무료 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램)입니다. 2006년에 시작해 지금도 고쳐지고 있고, GitHub 별이 4.7만 개가 넘습니다. 최신 버전은 2026-11-10에 나온 3.14입니다.

메모장에 빠르게 적어 둔 회의록을 워드 양식으로 다시 옮겨 적느라 시간을 쓴 적이 있다면 쓸모를 바로 알 수 있습니다. 메모장에 `#`으로 제목, `-`로 목록을 표시해 두면(마크다운), `pandoc 회의록.md -o 회의록.docx` 한 줄로 제목 스타일과 표가 들어간 워드 문서가 생깁니다.

## 2. 비유로 쉽게 이해하기
pandoc은 **문서 통역사**입니다.

- **① 한 형식으로 쓴 글을 읽음**: 마크다운, 워드, 웹페이지 등 52가지 형식을 읽습니다
- **② 같은 내용을 다른 형식으로 옮겨 적음**: 제목·목록·표 같은 짜임을 살려 워드·파워포인트·전자책 등 77가지 형식으로 다시 씁니다
- **③ 꾸밈은 그 형식의 기본 모양**: 글꼴·색은 옮기지 않습니다. 회사 양식을 쓰려면 서식 파일을 지정합니다
- **통역할 수 없는 말도 있음**: 한글 문서(HWP)는 목록에 없습니다

## 3. 실제 화면으로 보기
아래는 2026-11-27에 클라우드(리눅스, CPU 4개)에서 pandoc 3.14를 **시연용 가상 문서**로 자동 실행한 결과입니다. 만든 워드·파워포인트는 LibreOffice로 열어 그림으로 찍었습니다(Word에서는 모양이 조금 다를 수 있습니다).

[이미지: terminal.gif | 대체 텍스트: pandoc 터미널 시연: 마크다운 회의록 내용 보기 → 워드 문서로 바꾸기 → 파워포인트·전자책·웹페이지 파일 목록 → 워드를 다시 마크다운 표로 → PDF 오류 'pdflatex' not found → typst로 PDF 35,813바이트 순으로 바뀌는 명령 창 화면]

**① 메모 → 워드** — 마크다운 가상 회의록(821바이트)을 `pandoc 회의록.md -o 회의록.docx`로 바꾸자 **0.04초** 만에 워드 문서가 생겼습니다. 제목 4개는 워드의 제목 스타일로, 표 1개와 굵은 글씨 3곳도 그대로 들어갔습니다.

[이미지: md-to-docx.png | 대체 텍스트: pandoc으로 가상 마크다운 회의록 821바이트를 0.04초 만에 워드 문서로 바꾼 결과 그림: 왼쪽 마크다운 원문, 오른쪽 LibreOffice로 연 워드 문서, 제목 스타일 4개·표 1개·굵은 글씨 3곳 알약]

**② 거꾸로 바꾸기** — 방금 만든 워드를 다시 마크다운으로 바꾸자 제목 4개와 표가 글로 그대로 돌아왔습니다. 저장한 가상 웹 기사(HTML)도 제목 4개·표 1개가 든 워드 문서가 됐습니다(각 0.04초).

**③ 한 글로 여러 형식** — 같은 회의록이 파워포인트 **5장**(표지 + 제목마다 1장, 0.06초), 4개 장으로 나뉜 전자책(EPUB, 0.03초), 목차 붙은 웹페이지(0.04초)가 됐습니다.

[이미지: one-to-many.png | 대체 텍스트: pandoc으로 같은 가상 회의록을 파워포인트 5장, 전자책 4개 장, 목차 붙은 웹페이지로 바꾼 결과 그림, 슬라이드 5장의 실제 모습 포함]

**④ PDF** — 결과 이름만 `.pdf`로 적으면 `'pdflatex' not found` 오류가 났습니다. PDF를 만드는 프로그램이 따로 필요하다는 뜻입니다. 무료 프로그램 typst를 설치하고 `--pdf-engine=typst`와 한글 글꼴을 지정하자 **0.23초** 만에 1쪽 PDF가 나왔습니다.

[이미지: pdf-hwp.png | 대체 텍스트: pandoc PDF 결과 그림: 그냥 PDF로 바꾸면 'pdflatex' not found 오류, typst와 한글 글꼴을 지정하면 0.23초 만에 1쪽 PDF, 한글 문서(HWP) 저장은 경고만 나오고 속은 HTML인 화면]

**⑤ 많이·길게** — 결과를 표로 정리했습니다.

> **읽는 법** — 시간은 명령을 입력하고 pandoc이 끝날 때까지 걸린 전체 시간(프로그램을 켜는 시간 포함, 3번 중 가장 빠른 값)이고, CPU 4개 클라우드 기준입니다. '쪽'은 LibreOffice로 열었을 때의 쪽수입니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">바꾼 것</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">결과</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">시간</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">가상 회의록 → 워드</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">제목 4개 · 표 1개 · 1쪽</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.04초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">같은 회의록 → 파워포인트</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">5장</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.06초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">같은 회의록 → 전자책(EPUB)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">4개 장</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.03초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">같은 회의록 → PDF (typst)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1쪽 · 한글 그대로</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.23초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">가상 메모 50개 → 워드 50개</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">50개</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">2.15초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">가상 보고서 200,284자 → 워드</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">140쪽</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.37초</td></tr>
</tbody>
</table>

**아쉬운 점** — 화면 없는 명령어 도구이고, 마크다운 쓰는 법을 조금 알아야 합니다. 한글 문서(HWP)는 읽지도 만들지도 못하고, 결과 이름을 `결과.hwp`로 적으면 경고만 나오고 속은 HTML인 파일이 생겼습니다. 같은 이름의 결과 파일이 있으면 묻지 않고 덮어썼습니다.

## 4. Windows에서 쓰는 법 (처음부터 끝까지)
> 시연은 클라우드(리눅스)에서 했고, 아래 Windows 방법은 pandoc 도움말(`pandoc --help`)·GitHub 릴리스 파일 목록(`pandoc-3.14-windows-x86_64.msi`·`.zip` 주소 확인)·winget 목록(`JohnMacFarlane.Pandoc` 3.14, `Typst.Typst` 0.14.2 — microsoft/winget-pkgs GitHub 저장소에서 확인)을 바탕으로 정리한 것입니다. **Windows에서 직접 실행해 확인한 것은 아닙니다.** 각 단계의 '성공 화면'과 다르게 나오면 아래 '자주 나는 오류'를 보시기 바랍니다.

### 0. 준비물
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">항목</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">내용</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">운영체제</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Windows 10·11 (64비트)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">필요한 프로그램</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">pandoc 3.14 하나 (파이썬 등 다른 프로그램 필요 없음)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">따로 설치할 것</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">PDF를 만들 때만 typst(무료) · 결과를 열어 볼 Word 또는 무료 LibreOffice</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설치 크기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설치 파일 약 37MB(리눅스 파일 기준 36.6MB, Windows <code>.msi</code> 크기는 확인하지 못함)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면 없는 명령어 도구 (명령 프롬프트에서 사용) · GitHub 저장소의 <code>워드로바꾸기.bat</code>에 파일을 끌어다 놓아 쓸 수도 있음</td></tr>
</tbody>
</table>

### 1. pandoc 설치 (둘 중 하나)
**방법 A — 명령 한 줄 (winget, Windows 11과 최근 Windows 10에는 보통 들어 있음)**
1. 명령 프롬프트 열기: `윈도우 키` → `cmd` 입력 → Enter
```cmd
:: pandoc 설치 → "설치 성공" 또는 "Successfully installed"가 나오면 성공
winget install --id JohnMacFarlane.Pandoc
```
**방법 B — 설치 파일**
1. GitHub 저장소 https://github.com/jgm/pandoc/releases 에서 `pandoc-3.14-windows-x86_64.msi`를 받습니다
2. 받은 파일을 마우스로 두 번 누르고 안내대로 **Next** → **Install**을 누릅니다

### 2. 설치 확인
**설치가 끝나면 명령 프롬프트 창을 닫고 새로 엽니다** (새 창에서만 pandoc 명령이 보입니다).
```cmd
:: 버전 확인 → 첫 줄에 "pandoc 3.14"가 나오면 성공
pandoc --version
```

### 3. 내 파일로 해 보기
1. 바꿀 파일이 있는 폴더를 탐색기로 엽니다
2. 탐색기 **주소창에 `cmd` 입력 → Enter** → 그 폴더에서 명령 창이 열립니다
3. 아래 명령을 붙여넣습니다. **결과 파일은 같은 폴더에, `-o` 뒤에 적은 이름으로** 생기고, 원본은 바뀌지 않습니다
```cmd
:: ① 메모(마크다운) → 워드 문서 (결과 이름의 확장자 .docx로 형식이 정해짐)
pandoc 회의록.md -o 회의록.docx

:: ② 워드 → 마크다운 글 (AI 채팅·메모 앱에 붙여넣기용, 표도 글로)
pandoc 회의록.docx -t gfm -o 회의록_글.md

:: ③ 저장한 웹페이지 → 워드
pandoc 기사.html -o 기사.docx

:: ④ 같은 메모 → 파워포인트 / 전자책 / 목차 붙은 웹페이지
pandoc 회의록.md -o 회의록.pptx
pandoc 회의록.md -o 회의록.epub
pandoc 회의록.md -s --toc -o 회의록.html

:: ⑤ 파일 이름에 띄어쓰기가 있으면 큰따옴표로 감쌈
pandoc "주간 회의록.md" -o "주간 회의록.docx"

:: ⑥ 결과 폴더 열기
explorer .
```
- **메모장에 마크다운 쓰는 법(최소한)**: `# 제목`, `- 목록`, `1. 번호 목록`, `**굵게**`, 표는 `| 칸 | 칸 |` 줄 아래 `|---|---|`. 메모장에서 저장할 때 인코딩을 **UTF-8**로 둡니다(Windows 10·11 메모장 기본값)
- **같은 이름의 결과 파일이 있으면 묻지 않고 덮어씁니다.** 중요한 파일은 결과 이름을 다르게 적으시기 바랍니다

### 4. PDF 만들기 (typst 따로 설치)
```cmd
:: typst 설치 (무료) → 설치 뒤 명령 창을 새로 엶
winget install --id Typst.Typst

:: PDF 만들기 — 한글 글꼴(맑은 고딕)을 지정
pandoc 회의록.md -o 회의록.pdf --pdf-engine=typst -V mainfont="Malgun Gothic"
```
- 시연에서는 리눅스 한글 글꼴 `Noto Sans CJK KR`로 확인했습니다. Windows 글꼴 이름 `Malgun Gothic`으로는 실행해 보지 않았습니다
- 워드 문서를 이미 만들었다면 Word의 '다른 이름으로 저장 → PDF'로 만드는 방법도 있습니다

### 5. 명령어 없이 쓰기 — 끌어다 놓는 실행 파일
- GitHub 저장소(github.com/codekimmy/daily-github-pick)의 `2026-11-26-pandoc/demo/tools_win/워드로바꾸기.bat`을 받아 바탕화면 등에 두고, **그 파일 위에 `.md`·`.txt`·`.html`·`.docx` 파일을 끌어다 놓으면** 같은 폴더에 `이름_변환.docx`(워드)가 생깁니다. 워드 파일(`.docx`)을 놓으면 `이름_변환.md`(마크다운 글)가 생깁니다. 여러 파일을 한꺼번에 놓아도 됩니다
- 결과 파일이 이미 있으면 덮어쓸지 먼저 묻습니다(pandoc 자체는 묻지 않음). pandoc이 없으면 설치 방법을 안내하고 멈춥니다
- `.bat` 안의 pandoc 명령은 리눅스에서 같은 옵션으로 확인했고, `.bat` 파일 자체는 Windows에서 실행해 보지 않았습니다

### 6. 자주 나는 오류와 해결
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">화면에 나온 말</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">원인</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">해결</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'pandoc'은(는) 내부 또는 외부 명령 … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설치 직후 예전 명령 창을 그대로 씀, 또는 설치 안 됨</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">명령 창을 닫고 새로 열기 → 그래도 안 되면 1단계 다시</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'pdflatex' not found. Please select a different --pdf-engine or install 'pdflatex'</code> (시연에서 실제로 나온 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">PDF를 만드는 프로그램이 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">4단계처럼 typst 설치 후 <code>--pdf-engine=typst</code></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>회의록.md: withBinaryFile: does not exist (No such file or directory)</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파일 이름이 틀렸거나 다른 폴더에서 명령 창을 엶</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>dir</code>로 파일 이름 확인, 탐색기 주소창 <code>cmd</code>로 그 폴더에서 열기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>주간: withBinaryFile: does not exist</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">띄어쓰기 있는 파일 이름을 따옴표 없이 씀</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>"주간 회의록.md"</code>처럼 큰따옴표</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>[WARNING] Could not deduce format from file extension .hwp</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">한글 문서(HWP)는 지원하지 않음 — 이 경고 뒤 HTML 내용이 <code>.hwp</code> 이름으로 저장됨</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>.docx</code>로 만든 뒤 한글 프로그램에서 열어 HWP로 저장 (한글 프로그램에서 열어 보는 것은 시연하지 않음)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>Unknown output format 'hwp'</code> (시연 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">위와 같음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">위와 같음</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">결과 워드의 글꼴·색이 원본 워드와 다름</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">pandoc은 내용(제목·목록·표)만 옮기고 꾸밈은 기본 모양</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">원하는 모양의 워드 파일을 <code>--reference-doc 양식.docx</code>로 지정</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">PDF의 한글이 □ 로 보임</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">한글 글꼴을 지정하지 않음 (시연 리눅스에서는 자동으로 한글 글꼴을 찾아 보였음, Windows는 확인 못 함)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-V mainfont="Malgun Gothic"</code> 추가</td></tr>
</tbody>
</table>

### 7. 지우는 법
```cmd
:: winget으로 설치했을 때
winget uninstall --id JohnMacFarlane.Pandoc
winget uninstall --id Typst.Typst
```
- 설치 파일(.msi)로 설치했다면 `설정` → `앱` → `설치된 앱`에서 Pandoc을 찾아 제거합니다. 만든 문서 파일은 지워지지 않습니다

### 자주 쓰는 옵션
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">옵션</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">하는 일</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-o 결과.확장자</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">결과 파일 이름 (확장자 .docx·.pptx·.epub·.html·.md·.pdf로 형식이 정해짐)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-t gfm</code> · <code>-f markdown</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">만들 형식 / 읽을 형식을 직접 지정 (<code>.txt</code> 메모를 마크다운으로 읽게 할 때 <code>-f markdown</code>)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-s</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">머리·꼬리까지 갖춘 완성 문서 (웹페이지 만들 때)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--toc</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">목차 붙이기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--reference-doc 양식.docx</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">회사 양식 워드 파일의 글꼴·색·여백을 따라 만들기 (기본 양식 받기: <code>pandoc -o 내양식.docx --print-default-data-file reference.docx</code>, 시연에서 10,953바이트 파일이 생김 · 양식을 고쳐 적용하는 것은 시연하지 않음)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--extract-media 폴더</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">워드 속 그림을 폴더로 꺼내기 (시연하지 않음)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--pdf-engine=typst</code> · <code>-V mainfont="글꼴"</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">PDF 만들기 · 한글 글꼴 지정</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--list-input-formats</code> · <code>--list-output-formats</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">읽는 형식 52가지 · 만드는 형식 77가지 목록</td></tr>
</tbody>
</table>

## 5. 어디에 쓰면 좋을까
- **직장인 회의록·보고서** → 메모장에 빠르게 쓰고 명령 한 줄로 워드 문서, 같은 글로 발표 자료까지
- **AI 채팅 활용** → 워드 문서·웹 기사를 표까지 글로 바꿔 붙여넣기
- **블로그 글 모음** → 제목마다 장이 나뉜 전자책(EPUB)

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 무료입니다. GPL-2.0 라이선스로 개인·회사 모두 쓸 수 있고, 프로그램을 고쳐서 배포할 때는 같은 라이선스로 공개해야 합니다. 만든 문서는 프로그램 라이선스와 상관없습니다.

**Q. 한글 문서(HWP)도 됩니까?**
**A.** 안 됩니다. 읽는 형식·만드는 형식 목록 어디에도 HWP가 없습니다. 워드(.docx)로 만든 뒤 한글 프로그램에서 열어 저장하는 방법이 있지만, 이 과정은 시연하지 않았습니다.

**Q. 한글 글자는 깨지지 않습니까?**
**A.** 시연에서는 워드·파워포인트·전자책·웹페이지 모두 한글이 그대로 들어갔습니다. PDF는 한글 글꼴을 지정해서 만들었습니다(Windows 예: `Malgun Gothic`, Windows에서는 확인하지 않음).

**Q. 원본 워드의 글꼴·색도 그대로 옮겨집니까?**
**A.** 아닙니다. 제목·목록·표 같은 내용의 짜임만 옮기고, 꾸밈은 결과 형식의 기본 모양을 따릅니다. 회사 양식은 `--reference-doc`으로 지정합니다.

**Q. 화면이 있는 프로그램입니까?**
**A.** 명령 창에서 쓰는 도구입니다. 파일을 끌어다 놓는 `.bat` 파일을 함께 올려 두었습니다.

## 마무리
pandoc은 한 형식으로 쓴 글을 다른 형식으로 옮겨 적는 "문서 통역사"입니다. 시연에서 메모 → 워드는 0.04초, 20만 자 보고서도 0.37초 만에 140쪽 워드 문서가 됐고, 같은 글이 파워포인트·전자책·웹페이지로도 바뀌었습니다. 다만 한글 문서(HWP)는 안 되고, PDF는 typst 같은 프로그램을 따로 설치해야 하며, 같은 이름의 결과 파일은 묻지 않고 덮어씁니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-27에 클라우드 작업 공간(리눅스)에서 시연용 가상 문서로 자동 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows·Word 버전 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 GitHub 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 pandoc 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(GPL-2.0)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 GitHub 저장소에서만 받으시기 바랍니다.
- 변환한 문서는 표·목록·그림이 원본과 같은지 꼭 확인하시기 바랍니다. 원본 파일은 따로 보관하시기 바랍니다.

---
**태그**: pandoc, 팬독, 문서변환, 마크다운워드변환, 워드변환, 파워포인트만들기, 전자책만들기, 무료프로그램, 오픈소스, 깃허브추천
