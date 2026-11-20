<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → Pyxel로 만든 시연용 '별 줍기' 게임 화면을 게임기 틀에 넣고 '파이썬 40줄로 게임 완성, 자동 작곡 0.02초' 글자와 16색 팔레트를 얹은 썸네일
star-catch.gif → Pyxel로 만든 시연용 '별 줍기' 게임을 컴퓨터가 자동 플레이한 12초 화면, 별 11개를 받고 5개를 놓친 Pyxel 내장 녹화 GIF
pyxel-anim.gif → Pyxel 과정 애니메이션: 40줄 게임 화면 → 16색·소리 4줄 → 자동 작곡 8가지 파형과 '각각 0.02초 안' → 내장 글꼴 한글 빈칸·글꼴 파일 지정 후 한글 표시 → 설치 명령 순 화면
examples.png → Pyxel 제작자 예제 4개를 클라우드에서 실행한 화면 모음: 점프 게임, 그리기 기능, 발판 게임, 그림 돌리기·키우기
korean-font.png → Pyxel 한글 글자 시험 화면: 내장 글꼴은 '안녕'이 빈칸으로 빠지고, 글꼴 파일을 지정한 줄은 '안녕 Hello'가 노란 글씨로 보이는 결과
pyxel-edit.png → pyxel edit로 Pyxel 예제 그림 파일을 연 편집기 화면, 16색 팔레트와 그리기 도구, 이미지 칸이 보이는 모습
terminal.gif → 명령 창에서 Pyxel 3.0.3 확인 → 예제 꺼내기 20개 → 별 줍기 40줄 → 12초 자동 실행 초당 30장·받은 별 11개 → 게임 묶기 1,516바이트 순 터미널 화면
-->
# Pyxel이란? 파이썬 40줄로 옛날 오락실 게임 만드는 무료 도구 사용법 총정리 (설치법 포함)

> **한 줄 요약** — 16색·소리 4줄로 일부러 단순하게 만든 옛날 게임기를, 파이썬 코드로 조립해 게임을 만드는 무료 도구입니다.
> ⭐ 별 약 1.78만 (2026-11-21 확인) · 무료 오픈소스 · MIT 라이선스

> **일반인 쓸모 ★★★☆☆ (3)** — 설치 한 줄로 예제 게임을 바로 실행할 수 있고, 시연용 게임은 40줄로 만들어졌습니다. 다만 직접 만들려면 파이썬 코드를 써야 하고, 코딩 교육·취미처럼 가끔 쓰는 도구라 별 세 개입니다.
> **이걸로 할 수 있는 것**
> 1. 아이와 함께 **화면에서 바로 움직이는 첫 코딩**(별 줍기·점프 게임)을 만든다
> 2. 생일·기념일 축하 **미니 게임을 만들어 파일 하나로 보낸다** (시연: 1.5KB)
> 3. 영상·발표에 넣을 **8비트 배경음악을 자동으로 만든다** (분위기 8가지)

[이미지: thumbnail.jpg | 대체 텍스트: Pyxel로 만든 시연용 '별 줍기' 게임 화면을 게임기 틀에 넣고 '파이썬 40줄로 게임 완성, 자동 작곡 0.02초' 글자와 16색 팔레트를 얹은 썸네일]

## 목차
1. Pyxel이란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. 설치 방법 (Windows)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. Pyxel이란 무엇입니까?
Pyxel(픽셀)은 파이썬(Python, 배우기 쉬운 프로그래밍 언어)으로 옛날 오락실 느낌의 게임을 만드는 무료 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램)입니다. 일본의 개발자 kitao(키타오)가 만들었고, 게임 화면·소리·키보드 입력을 다루는 기능이 한 묶음으로 들어 있습니다. 이런 묶음을 게임 엔진이라고 부릅니다.

"코딩을 배우면 뭘 만들 수 있어?"라는 질문에 가장 빨리 보여 줄 수 있는 답이 게임입니다. Pyxel은 설치가 명령 한 줄이고, 예제 게임이 함께 들어 있어 첫 화면을 보기까지 오래 걸리지 않습니다.

## 2. 비유로 쉽게 이해하기
Pyxel은 **8비트 게임기 조립 상자**입니다.

- **상자 안 재료**: 16색 크레파스(색 16개), 소리 4줄(동시에 낼 수 있는 소리 4가지), 그림판, 작곡판
- **조립 설명서 = 파이썬 코드**: "화면 가로 160·세로 120", "별은 노란 삼각형"처럼 글로 적으면 Pyxel이 1초에 30번 화면을 다시 그립니다
- **일부러 줄인 재료**: 색과 소리가 적어서 초보자도 금방 완성품을 만듭니다
- **완성품 포장**: 게임을 파일 하나(`.pyxapp`)나 웹 페이지 파일(`.html`)로 묶어 보낼 수 있습니다

## 3. 실제 화면으로 보기
클라우드 작업 공간(리눅스, CPU 2개, 그래픽카드 없음)에서 Pyxel 3.0.3을 가상 화면에 띄워 자동 실행한 **시연 결과**입니다. 게임은 시연용으로 만든 '별 줍기'이고, 녹화할 때는 컴퓨터가 화살표를 대신 누릅니다.

[이미지: star-catch.gif | 대체 텍스트: Pyxel로 만든 시연용 '별 줍기' 게임을 컴퓨터가 자동 플레이한 12초 화면, 별 11개를 받고 5개를 놓친 Pyxel 내장 녹화 GIF]

> **읽는 법** — '초당 30장'은 1초에 화면을 30번 새로 그렸다는 뜻입니다(Pyxel 기본값 30과 같으면 느려지지 않은 것). 메모리 값은 프로그램이 실행 중 가장 많이 쓴 양입니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">시연</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">결과</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설치</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">약 1.1초 · 27.2MB · 함께 설치되는 프로그램 0개</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">예제 꺼내기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">예제 파일 20개 + 3D 예제 6개 + 완성 게임 7개</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">별 줍기 게임</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">빈 줄·설명 빼고 <b>40줄</b></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">12초 자동 플레이</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>초당 30장 유지</b> · 받은 별 11개 · 놓친 별 5개</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">내장 글꼴로 한글</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>빈칸</b> (영어·숫자만 나옴)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">글꼴 파일 지정</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">한글 보임 · 큰 글꼴 파일이면 메모리 141MB → 458MB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">자동 작곡 8가지</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">각각 <b>0.02초 안</b> (0.0003~0.0157초)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">20초 WAV 저장</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">각각 0.01초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">내장 녹화</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">마지막 12초 GIF 347KB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">게임 묶기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>.pyxapp</code> <b>1.5KB</b> · 웹 파일 2.2KB</td></tr>
</tbody>
</table>

[이미지: pyxel-anim.gif | 대체 텍스트: Pyxel 과정 애니메이션: 40줄 게임 화면 → 16색·소리 4줄 → 자동 작곡 8가지 파형과 '각각 0.02초 안' → 내장 글꼴 한글 빈칸·글꼴 파일 지정 후 한글 표시 → 설치 명령 순 화면]

- **예제 게임**: `pyxel copy_examples` 한 줄로 예제 폴더가 생기고, `pyxel run 02_jump_game.py`처럼 파일 이름을 붙이면 바로 실행됩니다

[이미지: examples.png | 대체 텍스트: Pyxel 제작자 예제 4개를 클라우드에서 실행한 화면 모음: 점프 게임, 그리기 기능, 발판 게임, 그림 돌리기·키우기]

- **한글**: Pyxel에 들어 있는 글꼴은 영어·숫자용이라 한글이 빈칸으로 빠졌습니다. `pyxel.Font("글꼴 파일", 12)`로 한글 글꼴을 지정하자 제목이 제대로 보였습니다

[이미지: korean-font.png | 대체 텍스트: Pyxel 한글 글자 시험 화면: 내장 글꼴은 '안녕'이 빈칸으로 빠지고, 글꼴 파일을 지정한 줄은 '안녕 Hello'가 노란 글씨로 보이는 결과]

- **자동 작곡**: `pyxel.gen_bgm(분위기, 높이, 악기, 번호)`에 분위기 번호(0 타이틀 ~ 7 위기)를 넣으면 Pyxel이 배경음악 악보를 만듭니다. 번호를 바꾸면 다른 곡, 같은 번호면 같은 곡이 나옵니다
- **편집기**: `pyxel edit` 명령으로 그림·지도·소리·음악을 마우스로 고치는 창이 열립니다

[이미지: pyxel-edit.png | 대체 텍스트: pyxel edit로 Pyxel 예제 그림 파일을 연 편집기 화면, 16색 팔레트와 그리기 도구, 이미지 칸이 보이는 모습]

[이미지: terminal.gif | 대체 텍스트: 명령 창에서 Pyxel 3.0.3 확인 → 예제 꺼내기 20개 → 별 줍기 40줄 → 12초 자동 실행 초당 30장·받은 별 11개 → 게임 묶기 1,516바이트 순 터미널 화면]

시연에서 아쉬운 점도 있었습니다. 웹 페이지 파일은 제작자 누리집(kitao.dev)에서 실행 파일을 받아 오는데, 시연 환경에서는 그 주소가 막혀 **웹 실행은 확인하지 못했습니다.**

## 4. 설치 방법 (Windows)
> 아래 방법은 PyPI의 Windows용 설치 파일과 `pyxel` 명령 도움말을 바탕으로 정리한 것이며, 시연에서 Windows로 실행해 보지 않았습니다.

```cmd
:: 0. 파이썬 3.11 이상 설치 확인 (python.org에서 설치, "Add python.exe to PATH" 체크)
python --version
:: 1. Pyxel 설치
pip install pyxel
:: 2. 문서 폴더에 예제 꺼내기
cd %USERPROFILE%\Documents
pyxel copy_examples
cd pyxel_examples
:: 3. 예제 게임 실행 (Esc 키로 끝남)
pyxel run 02_jump_game.py
:: 4. 그림·소리 편집기 열기
pyxel edit my_game.pyxres
:: 5. 게임 폴더를 파일 하나로 묶기 / 웹 페이지 파일로 바꾸기
pyxel package star_catch star_catch\star_catch.py
pyxel app2html star_catch.pyxapp
```

시연용 별 줍기 게임(`demo/star_catch.py`)은 아래 저장소 폴더에서 받을 수 있습니다. 한글 제목을 보려면 `set KFONT=C:\Windows\Fonts\malgun.ttf`처럼 한글 글꼴 파일 경로를 먼저 지정하고 `pyxel run star_catch.py`로 실행합니다.

## 5. 어디에 쓰면 좋을까
- **아이와 첫 코딩** → 숫자 하나만 바꿔도 별이 빨라지거나 바구니가 커지는 것이 바로 보입니다
- **축하 미니 게임 선물** → 이름을 넣은 작은 게임을 파일 하나로 묶어 보냅니다
- **8비트 배경음악** → 분위기 번호만 바꿔 짧은 배경음악을 만들고 WAV로 저장합니다

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 무료입니다. 라이선스는 MIT로, 개인·회사 모두 쓸 수 있습니다.

**Q. 코딩을 전혀 몰라도 됩니까?**
**A.** 예제 게임 실행은 명령 두세 줄이면 됩니다. 직접 만들려면 파이썬 기초(변수, if, 반복문)가 필요합니다.

**Q. 그래픽카드가 필요합니까?**
**A.** 시연에서는 그래픽카드 없는 클라우드(CPU 2개)에서도 1초에 30장을 그대로 그렸습니다.

**Q. 한글이 왜 안 나옵니까?**
**A.** 내장 글꼴은 영어·숫자용입니다. 한글 글꼴 파일을 `pyxel.Font`로 지정해야 하며, 큰 글꼴 파일은 메모리를 많이 씁니다.

## 마무리
Pyxel은 색과 소리를 일부러 줄인 "8비트 게임기 조립 상자"입니다. 시연에서 40줄짜리 게임이 그래픽카드 없이 1초에 30장으로 돌아갔고, 배경음악 8가지를 각각 0.02초 안에 만들었습니다. 다만 한글은 글꼴 파일을 꼭 지정해야 합니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-21에 클라우드 작업 공간(리눅스, 가상 화면)에서 자동으로 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 Pyxel 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(MIT)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- 예제 게임·글꼴·자동 작곡 음악을 다시 배포하거나 영상에 쓸 때는 각 제작자의 라이선스와 출처 표기 조건을 직접 확인하시기 바랍니다.

---
**태그**: Pyxel, 파이썬게임만들기, 레트로게임, 8비트게임, 도트게임, 코딩교육, 게임엔진, 무료프로그램, 오픈소스, 깃허브추천
