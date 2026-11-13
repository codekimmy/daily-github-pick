<!-- 티스토리: 마크다운 모드로 붙여넣기 / 이미지는 모두 media/ 폴더에 있음: thumbnail.jpg(대표), noisereduce-anim.gif, 스펙트로그램비교.png, 잡음크기비교.png, 말소리크기.png, terminal.gif / 소리 파일(선택): media/들어보기_*.mp3 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → 선풍기 잡음이 섞인 가상 녹음과 noisereduce로 잡음을 줄인 뒤의 스펙트로그램을 위아래로 놓고 '녹음 속 선풍기 소리 0.32초 만에 줄이기' 문구를 넣은 썸네일
noisereduce-anim.gif → noisereduce 과정 애니메이션: 선풍기 잡음 가상 녹음의 소리 그림이 0.32초 만에 바뀌고, 잡음 -29.0→-58.1 dB·말소리 9dB 감소·60분 녹음 19.9초 순으로 나오는 화면
스펙트로그램비교.png → 선풍기 잡음이 섞인 가상 회의 녹음, noisereduce 기본 설정 결과(-58.1 dB), 맨 앞 1.4초를 잡음 견본으로 지정한 결과(-59.3 dB)의 스펙트로그램 3장을 위아래로 비교한 결과 그림
잡음크기비교.png → 선풍기·녹음기 쉬 소리·키보드·옆자리 말소리 잡음 4가지의 말 없는 구간 잡음 크기를 잡음 섞인 녹음, 기본 설정, 잡음 견본 지정으로 비교한 막대그래프, 선풍기는 29dB·키보드는 8dB 줄어든 결과 그림
말소리크기.png → 깨끗한 원본 -23.8 dB, 잡음 섞인 녹음, noisereduce 기본 설정 -32.6 dB, 세기 0.5 -26.6 dB, 잡음 견본 지정 -27.6 dB의 말소리 크기를 비교한 막대그래프 결과 그림
terminal.gif → 명령 프롬프트에서 noisereduce 설치 확인 → 가상 녹음 잡음 -29.0 dB → 예제 파일 0.36초 처리 후 -55.5 dB → 견본 지정 -58.9 dB → 옆자리 말소리 -32.1 dB 순 터미널 화면
-->
# 녹음 속 선풍기·에어컨 소리 줄이기, 무료 프로그램 noisereduce 사용법 총정리 (설치법·예제 파일 포함)

> **한 줄 요약** — 녹음 파일을 넣으면, 녹음 내내 깔려 있는 선풍기·에어컨·'쉬~' 같은 소리를 찾아 작게 줄인 새 녹음 파일을 만들어 주는 무료 프로그램입니다.
> ⭐ 별 1,885 · 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램) · MIT 라이선스 · 파이썬

> **일반인 쓸모 ★★★☆☆ (3)** — 회의·강의·영상 녹음의 바탕 잡음은 자주 생기고, 시연에서 28초 녹음을 0.32초 만에 처리했습니다. 다만 바로 쓰는 명령어나 화면 프로그램이 없어 파이썬과 예제 파일이 필요하고, 옆자리 말소리처럼 바뀌는 잡음은 덜 줄었습니다.
> **이걸로 할 수 있는 것**
> 1. 선풍기·에어컨이 돌던 방에서 녹음한 **회의·강의 녹음의 바탕 소리를 줄인다**
> 2. 유튜브·팟캐스트용 목소리 녹음의 **'쉬~' 하는 녹음기 잡음을 줄인 뒤 편집**한다
> 3. 예제 파일로 **녹음 파일 여러 개를 한 번에 처리**하고, 원본은 그대로 둔다

[이미지: thumbnail.jpg | 대체 텍스트: 선풍기 잡음이 섞인 가상 녹음과 noisereduce로 잡음을 줄인 뒤의 스펙트로그램을 위아래로 놓고 '녹음 속 선풍기 소리 0.32초 만에 줄이기' 문구를 넣은 썸네일]

## 목차
1. noisereduce란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. 설치와 사용 방법 (Windows)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. noisereduce란 무엇입니까?
noisereduce(노이즈리듀스)는 녹음 속 **바탕 잡음을 줄여 주는 무료 파이썬 프로그램**입니다. 미국 연구자 Tim Sainburg가 2019년에 공개했고, 지금 판은 3.0.3입니다. 인공지능 모델을 내려받지 않고 계산만으로 작동해서 그래픽카드가 필요 없습니다.

다만 noisereduce에는 바로 쓰는 명령어나 화면 프로그램이 없습니다. 그래서 이 글에서는 녹음 파일을 넣기만 하면 되는 **예제 파일 `잡음제거.py`**(와 Windows용 `잡음제거.bat`)를 함께 만들어 두었습니다.

## 2. 비유로 쉽게 이해하기
noisereduce는 잡음 모양을 재서 걸러 내는 **'소리 거름망'**입니다.

- **1단계** — 거름망이 녹음을 낮은 소리부터 높은 소리까지 칸으로 나눕니다
- **2단계** — 칸마다 늘 깔려 있는 잡음 크기를 잽니다. 녹음 맨 앞 조용한 구간을 **잡음 견본**으로 주면 그 구간으로 잽니다
- **3단계** — 잡음보다 크지 않은 소리는 작게 줄이고, 큰 말소리는 남깁니다

그래서 **늘 같은 소리**(선풍기·에어컨)는 잘 걸러지고, **갑자기 바뀌는 소리**(키보드·옆사람 말소리)는 거름망 눈을 빠져나가기 쉽습니다. 아래 시연 숫자에서도 그대로 나타났습니다.

## 3. 실제 화면으로 보기
클라우드 작업 공간(리눅스, CPU 2개, 그래픽카드 없음)에서 자동으로 실행한 **시연 결과**입니다. 녹음은 시연용으로 **직접 합성한 가상 녹음**(합성 말소리 28초 + 계산으로 만든 잡음)입니다.

[이미지: noisereduce-anim.gif | 대체 텍스트: noisereduce 과정 애니메이션: 선풍기 잡음 가상 녹음의 소리 그림이 0.32초 만에 바뀌고, 잡음 -29.0→-58.1 dB·말소리 9dB 감소·60분 녹음 19.9초 순으로 나오는 화면]

아래 그림은 소리를 높낮이 × 시간으로 나타낸 **스펙트로그램**입니다. 밝을수록 큰 소리이고, 위쪽 그림의 바탕 점무늬와 맨 아래 띠가 선풍기 잡음입니다. 기본 설정(가운데)은 0.32초 만에 바탕을 거의 까맣게 만들었지만, 녹음 맨 앞·맨 끝 1초 남짓에는 옅은 잡음이 남았습니다.

[이미지: 스펙트로그램비교.png | 대체 텍스트: 선풍기 잡음이 섞인 가상 회의 녹음, noisereduce 기본 설정 결과(-58.1 dB), 맨 앞 1.4초를 잡음 견본으로 지정한 결과(-59.3 dB)의 스펙트로그램 3장을 위아래로 비교한 결과 그림]

잡음 종류를 4가지로 바꾼 결과입니다. 숫자는 말 없는 구간의 소리 크기(dB, 낮을수록 조용)입니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">잡음 종류</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">잡음 섞인 녹음</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">기본 설정</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">줄어든 크기</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">선풍기 웅웅</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-29.0 dB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-58.1 dB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">29dB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">녹음기 '쉬~'</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-28.0 dB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-51.9 dB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">24dB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">키보드 딸깍</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-29.7 dB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-37.3 dB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">8dB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">옆자리 말소리</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-26.1 dB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-34.4 dB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">8dB</td></tr>
</tbody>
</table>

[이미지: 잡음크기비교.png | 대체 텍스트: 선풍기·녹음기 쉬 소리·키보드·옆자리 말소리 잡음 4가지의 말 없는 구간 잡음 크기를 잡음 섞인 녹음, 기본 설정, 잡음 견본 지정으로 비교한 막대그래프, 선풍기는 29dB·키보드는 8dB 줄어든 결과 그림]

**말소리는 괜찮을까?** 말하는 구간의 크기도 측정했습니다. 기본 설정은 말소리도 원본보다 **약 9dB 작게** 만들었습니다. 녹음 맨 앞 1.4초를 잡음 견본으로 지정하면 잡음은 비슷하게 줄고, 말소리는 원본에 더 가까웠습니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">설정 (선풍기 잡음 녹음)</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">말 없는 구간 잡음</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">말소리 크기</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">깨끗한 원본 (참고)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">소리 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-23.8 dB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">기본 설정 (세기 1.0)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-58.1 dB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-32.6 dB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">세기 0.8</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-42.5 dB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-30.0 dB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">세기 0.5</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-34.9 dB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-26.6 dB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">잡음 견본 지정 (맨 앞 1.4초)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-59.3 dB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">-27.6 dB</td></tr>
</tbody>
</table>

[이미지: 말소리크기.png | 대체 텍스트: 깨끗한 원본 -23.8 dB, 잡음 섞인 녹음, noisereduce 기본 설정 -32.6 dB, 세기 0.5 -26.6 dB, 잡음 견본 지정 -27.6 dB의 말소리 크기를 비교한 막대그래프 결과 그림]

처리 시간은 28초 녹음 0.23~0.32초, **10분 녹음 3.5초, 60분 녹음 19.9초**였습니다. 아래는 예제 파일을 명령 창에서 실행한 화면입니다.

[이미지: terminal.gif | 대체 텍스트: 명령 프롬프트에서 noisereduce 설치 확인 → 가상 녹음 잡음 -29.0 dB → 예제 파일 0.36초 처리 후 -55.5 dB → 견본 지정 -58.9 dB → 옆자리 말소리 -32.1 dB 순 터미널 화면]

> 처리 전·후 소리는 저장소 `media/들어보기_*.mp3`로 들을 수 있습니다.

## 4. 설치와 사용 방법 (Windows)
> Windows 방법은 이번 시연에서 실행해 보지 않은 안내입니다(리눅스 시연). 시연에서는 설치에 29.5초, 함께 설치되는 프로그램(numpy·scipy 등)까지 약 266MB가 들었습니다.

```cmd
:: 0. 파이썬 확인 (없으면 python.org 에서 설치, "Add python.exe to PATH" 체크)
python --version
:: 1. 설치 (soundfile = 녹음 파일을 읽고 쓰는 프로그램)
pip install noisereduce soundfile
:: 2. 예제 파일 잡음제거.py 와 녹음이 있는 폴더로 이동
cd %USERPROFILE%\Desktop\녹음
:: 3. 기본 설정 → 회의녹음_잡음제거.wav 가 생김 (원본 그대로)
python 잡음제거.py 회의녹음.wav
:: 4. 맨 앞 1.5초가 조용하면 잡음 견본으로 (말소리가 덜 작아짐)
python 잡음제거.py 회의녹음.wav --견본 1.5
:: 5. 말소리가 뭉개지면 세기를 낮춤 (0.0~1.0)
python 잡음제거.py 회의녹음.wav --세기 0.8
```

- **예제 파일 받기**: 저장소 `2026-11-14-noisereduce/demo/` 폴더의 `잡음제거.py`, `tools_win/잡음제거.bat`
- **끌어다 놓기**: `잡음제거.bat`과 `잡음제거.py`를 같은 폴더에 두고, 녹음 파일을 `잡음제거.bat` 위에 마우스로 끌어다 놓으면 화면이 맨 앞 조용한 구간 길이(초)를 물어본 뒤 처리합니다 (Windows 실행 확인 전)
- **녹음 팁**: 녹음을 시작하고 2초쯤 말하지 않고 기다리면, 그 구간을 잡음 견본으로 쓰기 좋습니다

## 5. 어디에 쓰면 좋을까
- **회의·강의 녹음** → 에어컨·프로젝터 소리가 깔린 녹음을 다시 들을 때
- **유튜브·팟캐스트 목소리 녹음** → 편집 전에 녹음기의 '쉬~' 소리를 줄여 둘 때
- **녹음 파일이 많을 때** → 예제 파일에 여러 파일을 한 번에 넣어 처리 (60분 녹음 19.9초, 시연 기준)

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 네. MIT 라이선스라 개인·회사 모두 무료로 쓸 수 있습니다.

**Q. 옆사람 말소리나 음악도 지워집니까?**
**A.** 시연에서는 옆자리 말소리와 키보드 소리가 8dB 정도만 줄었습니다. noisereduce는 늘 같은 바탕 소리에 알맞고, 말소리와 비슷한 잡음은 잘 걸러지지 않습니다.

**Q. 말소리가 작아지거나 뭉개지면 어떻게 합니까?**
**A.** `--견본`으로 녹음 맨 앞 조용한 구간을 잡음 견본으로 주거나, `--세기 0.8`·`0.5`로 덜 지우시기 바랍니다. 어느 값이 알맞은지는 직접 들어 보고 고르시기 바랍니다.

**Q. 클릭만으로 쓰는 프로그램은 없습니까?**
**A.** noisereduce에는 화면 프로그램이 없습니다. 클릭으로 쓰고 싶다면 무료 녹음 편집 프로그램 Audacity(오대시티)에도 '노이즈 제거' 기능이 있습니다 (이번 시연 대상은 아닙니다).

**Q. mp3도 됩니까?**
**A.** 예제 파일은 wav·mp3·flac·ogg를 읽고, 결과는 wav로 저장합니다 (리눅스 시연에서 mp3 확인).

## 마무리
noisereduce는 선풍기·에어컨처럼 **늘 깔린 바탕 잡음**을 빠르게 줄이는 무료 '소리 거름망'입니다. 시연에서는 28초 녹음의 잡음이 0.32초 만에 29dB 줄었지만, 말소리도 약 9dB 작아졌고 옆자리 말소리는 8dB 정도만 줄었습니다. 녹음 앞 2초를 조용히 두고 `--견본`을 쓰는 것이 핵심입니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-14에 클라우드 작업 공간(리눅스)에서 자동으로 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 noisereduce 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(MIT)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- 원본 녹음은 따로 보관하고, 결과는 직접 들어 보고 확인하시기 바랍니다. 잡음을 줄이면 말소리도 함께 작아지거나 뭉개질 수 있습니다.
- 다른 사람의 목소리가 담긴 녹음은 녹음·사용에 대한 당사자의 동의를 먼저 확인하시기 바랍니다. 시연 녹음은 직접 합성한 가상 녹음입니다.

---
**태그**: noisereduce, 잡음제거, 노이즈제거, 녹음잡음, 회의녹음, 강의녹음, 유튜브녹음, 파이썬, 무료프로그램, 오픈소스, 깃허브추천
