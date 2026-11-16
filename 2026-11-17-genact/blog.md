<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → genact가 띄운 프로그램 조립·내려받기 명령 창 위에 '바쁜 척 화면, 213MB 받는 척 → 파일 0개' 글자를 얹은 썸네일
genact-anim.gif → genact 과정 애니메이션: 프로그램 조립 화면 → 장면 21가지 → 213MiB 내려받는 척 후 세트 뒷면을 뒤집으면 파일 0개 → 그래픽카드 없는데 채굴 중 화면, CPU 0.04% 순 화면
terminal.gif → 명령 창에서 genact 1.6.0 확인 → 장면 21가지 → 조립하는 척 → 내려받는 척 후 폴더 파일 0개 → 그래픽카드 없이 채굴하는 척 → 3배 속도 simcity 순 터미널 화면
-->
# genact란? 아무 일도 안 하면서 바쁜 척하는 명령 창 '영화 세트' 사용법 총정리 (설치법 포함)

> **한 줄 요약** — 명령 창에 프로그램 조립·파일 내려받기·해킹처럼 보이는 글자를 흘려보내지만, 실제로는 아무 작업도 하지 않는 무료 프로그램입니다.
> ⭐ 별 12,233 · 무료 오픈소스 · MIT 라이선스

> **일반인 쓸모 ★★½☆☆ (2.5)** — Windows는 실행 파일 하나(977KB)만 받으면 되어 시작은 매우 쉽습니다. 다만 화면 글자가 모두 가짜라 쓸 곳은 영상·무대 소품이나 재미 정도입니다.
> **이걸로 할 수 있는 것**
> 1. 유튜브·발표 영상에 넣을 **'컴퓨터가 열심히 작업 중인' 배경 화면**을 화면 녹화로 만든다
> 2. 연극·방탈출·행사 무대의 모니터에 **그럴듯한 해커·서버 작업 화면을 소품으로** 띄운다
> 3. 가족·친구와 **영화 속 해커 흉내 놀이**를 하고, 끝나면 가짜 화면이라고 알려 준다

[이미지: thumbnail.jpg | 대체 텍스트: genact가 띄운 프로그램 조립·내려받기 명령 창 위에 '바쁜 척 화면, 213MB 받는 척 → 파일 0개' 글자를 얹은 썸네일]

## 목차
1. genact란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. 설치 방법 (Windows)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. genact란 무엇입니까?
genact(젠액트)는 명령 창(검은 바탕에 글자로 컴퓨터를 다루는 창)에 **바쁘게 일하는 것처럼 보이는 화면**을 띄워 주는 무료 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램)입니다. 공식 소개 문구도 "진짜 일을 해야 할 때 바쁜 척하기"입니다.

- 만든 사람: 독일 개발자 Sven-Hendrik Haase(svenstaro)
- 별 12,233개 · 포크 497개 · MIT 라이선스 · Rust(러스트)로 만듦
- 최신 버전: 1.6.0 (2026년 10월 1일)
- 장면(모듈) 21가지: 프로그램 조립, 파일 내려받기, 암호 풀기, 코인 채굴, 서버 배포, 게임 로딩 등

## 2. 비유로 쉽게 이해하기
genact는 **명령 창용 영화 세트**입니다.

영화 세트장의 건물은 카메라에 보이는 **앞면만** 그럴듯하게 만들고, 뒤는 나무 버팀목뿐인 빈 공간입니다. genact도 같습니다.

- **앞면**: 프로그램 조립 명령, 진행 막대가 올라가는 내려받기, 암호를 푸는 해커 화면 같은 글자가 빠르게 흐릅니다
- **뒷면**: 파일을 만들지도, 인터넷에 접속하지도 않습니다
- **세트 고르기**: 사용자가 `-m` 옵션으로 원하는 세트(장면)만 고르고, `-s` 옵션으로 빨리 감기 속도를 정합니다

끝날 때 나오는 `Saving work to disk...`(작업 저장 중)라는 문구도 세트의 일부입니다. 실제로 저장하는 것은 없습니다.

## 3. 실제 화면으로 보기
아래는 **2026-11-17 클라우드 작업 공간(리눅스, 그래픽카드 없음)에서 genact 1.6.0을 자동으로 실행한 시연 결과**입니다.

[이미지: genact-anim.gif | 대체 텍스트: genact 과정 애니메이션: 프로그램 조립 화면 → 장면 21가지 → 213MiB 내려받는 척 후 세트 뒷면을 뒤집으면 파일 0개 → 그래픽카드 없는데 채굴 중 화면, CPU 0.04% 순 화면]

> **표 읽는 법** — MiB(메비바이트)는 MB와 거의 같은 용량 단위입니다(1MiB ≈ 1.05MB). '줄 수'는 같은 10초 동안 명령 창에 새로 나온 글자 줄의 개수로, 많을수록 화면이 빨리 흐릅니다. CPU 사용률 0.04%는 30초 중 컴퓨터 일꾼(CPU)이 실제로 일한 시간이 약 0.01초라는 뜻입니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">시연</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">결과</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설치</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Windows 실행 파일 <b>977KB</b> 하나 (리눅스는 <code>cargo install</code> 90초)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">내려받는 척 (10초)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면 숫자 <b>213MiB</b> → 폴더에 생긴 파일 <b>0개</b></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">코인 채굴하는 척</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면에는 그래픽카드 2개로 채굴 중 → <b>시연 컴퓨터에는 그래픽카드 없음</b></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">해커 화면</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">컴퓨터 2,037대에 접속하는 척, 암호를 푸는 척</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">장면 하나의 길이</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">21가지 중 12가지는 1분 안에 끝남 (9.5초~56.1초), 9가지는 약 90초까지 계속</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">속도 옵션 (10초 동안 나온 줄)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">기본 27줄 → <code>-s 5</code> 112줄 → <code>-s 20</code> 399줄</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">자동 종료</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--exit-after-time 1min</code> → 60.5초에 종료</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">가벼움 (30초 실행)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">CPU 약 <b>0.04%</b> · 메모리 <b>6.3MB</b></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">인터넷 없이</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">인터넷을 끊어도 그대로 작동</td></tr>
</tbody>
</table>

[이미지: terminal.gif | 대체 텍스트: 명령 창에서 genact 1.6.0 확인 → 장면 21가지 → 조립하는 척 → 내려받는 척 후 폴더 파일 0개 → 그래픽카드 없이 채굴하는 척 → 3배 속도 simcity 순 터미널 화면]

아쉬운 점도 있었습니다.

- 화면 글자는 **모두 영어**입니다
- 명령 창 없이 결과를 다른 명령으로 넘기면 일부 장면(ansible)이 오류로 멈췄습니다
- 화면 꺼짐 방지 옵션(`--inhibit`)은 오류 없이 실행됐지만, 화면이 없는 작업 공간이라 효과는 확인하지 못했습니다
- 공식 웹 버전과 Windows 실행은 시연하지 않았습니다

## 4. 설치 방법 (Windows)
> Windows 방법은 공식 README 안내를 바탕으로 정리했습니다. 이번 시연은 리눅스에서 했고, Windows 실행 파일은 받아서 크기만 확인했습니다.

```cmd
:: 1. 공식 저장소 → Releases → genact-1.6.0-x86_64-pc-windows-msvc.exe 를 받아 바탕화면\genact 폴더에 넣기
:: 2. 그 폴더로 이동
cd %USERPROFILE%\Desktop\genact
:: 3. 이름을 짧게 바꾸기 (선택)
ren genact-1.6.0-x86_64-pc-windows-msvc.exe genact.exe
:: 4. 21가지 장면을 무작위로 계속 보여 주기 (멈추기: Ctrl + C)
genact
:: 5. 프로그램 조립 장면만, 10분 뒤 자동 종료
genact -m cc -m kernel_compile --exit-after-time 10min
:: 6. 내려받기 장면을 5배 빠르게
genact -m download -s 5
```

- **번호로 고르기**: 저장소의 `demo/tools_win/장면고르기.bat`을 실행 파일과 같은 폴더에 두고 마우스로 두 번 누르면, 장면 번호(1~5)와 시간(분)만 고르면 됩니다 (Windows 실행 확인 전)
- **설치 도구 scoop을 쓰는 경우**: `scoop install genact` (공식 안내)
- 인터넷에서 받은 실행 파일이라 Windows가 경고를 띄울 수 있습니다. 공식 저장소 Releases에서만 받으시기 바랍니다

## 5. 어디에 쓰면 좋을까
- **영상을 만드는 사람** → '컴퓨터가 작업 중인' 장면이나 해커 영화 패러디의 배경 화면을 직접 녹화합니다
- **연극·방탈출·행사 담당자** → 무대 모니터에 그럴듯한 작업 화면을 정해진 시간만큼 띄웁니다
- **명령 창이 처음인 사람** → 글자가 흐르는 모습을 구경하며 폴더 이동·옵션 쓰는 법을 익힙니다

반대로 **회사에서 일하는 척 속이는 용도**나 **남에게 "해킹당했다"고 겁주는 장난**에는 쓰지 마시기 바랍니다.

## 6. 자주 묻는 질문
**Q. 정말 아무것도 안 합니까?**
A. 시연에서 빈 폴더에서 '내려받기' 장면을 10초 실행했는데 폴더에 생긴 파일은 0개였고, 인터넷을 끊어도 똑같이 작동했습니다. 30초 동안 CPU 사용은 약 0.04%였습니다.

**Q. 무료입니까?**
A. 네, MIT 라이선스의 무료 오픈소스입니다.

**Q. 한국어 화면도 있습니까?**
A. 없습니다. 21가지 장면 모두 영어 글자입니다.

**Q. 정해진 시간만 띄울 수 있습니까?**
A. `--exit-after-time 10min`처럼 쓰면 됩니다. 시연에서 `1min`을 넣자 60.5초에 스스로 끝났습니다.

**Q. 컴퓨터가 느려지지 않습니까?**
A. 시연에서는 CPU 약 0.04%, 메모리 6.3MB만 썼습니다. 화면만 바쁘고 컴퓨터는 거의 쉬는 셈입니다.

## 마무리
genact는 앞면만 있는 명령 창 영화 세트입니다. 213MiB를 받는 척해도 파일은 0개이고, 컴퓨터는 거의 쉽니다. 영상·무대 소품이나 재미로 쓰기에 알맞고, 실행 파일 하나라 시작도 쉽습니다. 다만 남을 속이는 데는 쓰지 마시기 바랍니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-17에 클라우드 작업 공간(리눅스)에서 자동으로 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 genact 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(MIT)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- genact 화면의 글자는 모두 지어낸 가짜입니다. 회사 업무를 속이거나 다른 사람을 놀라게 하는 데 쓰지 마시고, 회사 PC는 설치 규정을 먼저 확인하시기 바랍니다.

---
**태그**: genact, 젠액트, 바쁜척 프로그램, 해커 화면, 명령 프롬프트, 오픈소스, 무료 프로그램, 영상 소품, 터미널, 깃허브 추천
