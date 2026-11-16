<!-- 티스토리: 마크다운 모드로 붙여넣기 / 이미지는 모두 media/ 폴더에 있음: thumbnail.jpg(대표), vtracer-anim.gif, 로고확대비교.png, 서명비교.png, 도트비교.png, 사진비교.png, terminal.gif -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → 가상 카페 로고 JPG와 VTracer SVG를 7배로 키워 나란히 놓고 '작은 로고도 크게 키워도 또렷하게 · 로고 0.06초' 문구를 넣은 썸네일
vtracer-anim.gif → VTracer 과정 애니메이션: 240px 로고 확대 시 흐릿 → SVG 변환 0.06초 후 20배에도 또렷 → 서명 사진에서 획만 남김(60.5%→82.6%) → 도트 그림 칸 모양 유지 순 화면
로고확대비교.png → 가상 카페 로고 240px JPG와 VTracer SVG를 20배로 키워 나란히 비교한 결과 그림, 일반 확대는 흐릿하고 SVG는 테두리가 또렷하며 변환 0.06초·색 6가지 표시
서명비교.png → 그림자 진 가상 서명 사진을 VTracer로 바꾼 결과 그림, 흑백 기본 설정은 그림자까지 검게(원래 획과 겹침 60.5%), 밝기 맞춤 설정은 획만 남김(82.6%, 조각 3개)
도트비교.png → 24×24 가상 도트 화분을 480px로 키워 비교한 결과 그림, 원본 일반 확대는 흐릿, VTracer 곡선 모드는 칸이 녹고, pixel 모드는 칸 모양 그대로(2.5KB)
사진비교.png → CC0 고양이 사진을 VTracer 설정 4가지로 바꾼 결과 그림, poster 697KB·같은 색 98.3%, max_colors=8 543.7KB, photo 조각 106개, watershed 조각 23개 비교
terminal.gif → 명령 창에서 VTracer 1.0.0-alpha.4 확인 → 로고 JPG 8.3KB를 SVG 46.3KB로 → 서명 흑백 기본 조각 39개, 밝기 맞춤 3개 → 도트 pixel 모드 순 터미널 화면
-->
# 작은 로고 그림을 크게 키워도 깨지지 않게, 무료 프로그램 VTracer 사용법 총정리 (서명 그림·도트 그림·Windows 설치법 포함)

> **한 줄 요약** — JPG·PNG 그림을 넣으면, 색 덩어리의 테두리를 따라 곡선을 그려 확대해도 깨지지 않는 SVG 파일로 바꿔 주는 무료 프로그램입니다.
> ⭐ 별 7,536 · 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램) · MIT 라이선스 · Rust(파이썬으로도 사용)

> **일반인 쓸모 ★★★☆☆ (3)** — 작은 로고를 크게 써야 하거나 서명을 그림으로 만들 일은 가끔 생깁니다. 시연에서 240px 로고를 0.06초 만에 바꿔 20배로 키워도 테두리가 또렷했지만, 1.0은 아직 시험 버전이고 사진은 파일이 원본보다 커졌습니다.
> **이걸로 할 수 있는 것**
> 1. 메신저로 받은 **작은 가게 로고 그림을 현수막·명함용으로 크게 키워도 선명한 SVG**로 바꾼다
> 2. 종이에 쓴 **서명을 휴대폰으로 찍어 배경이 투명한 서명 그림**으로 만들어 문서에 올린다
> 3. **도트 그림은 칸 모양 그대로**, 사진은 **포스터·판화 느낌 그림**으로 바꾼다

[이미지: thumbnail.jpg | 대체 텍스트: 가상 카페 로고 JPG와 VTracer SVG를 7배로 키워 나란히 놓고 '작은 로고도 크게 키워도 또렷하게 · 로고 0.06초' 문구를 넣은 썸네일]

## 목차
1. VTracer란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. 설치와 사용 방법 (Windows)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. VTracer란 무엇입니까?
작은 로고 그림을 크게 키우면 테두리가 흐릿하게 뭉개집니다. VTracer(브이트레이서)는 이런 그림(JPG·PNG)을 **SVG(벡터 그림, 확대해도 깨지지 않는 그림 형식)로 바꿔 주는 무료 프로그램**입니다. 홍콩의 visioncortex가 2020년에 공개했고, 지금 버전은 1.0.0-alpha.4(시험 버전)입니다.

명령어 버전·파이썬 버전·Node.js 버전이 있고, 1.0부터는 화면 프로그램(Windows App)도 공식 저장소에 올라와 있습니다. 인공지능 모델을 내려받지 않고, 그래픽카드 없이 작동합니다.

## 2. 비유로 쉽게 이해하기
VTracer는 **모자이크 그림을 보고 '조립 설명서'를 받아 적는 프로그램**입니다.

- **JPG·PNG는 모자이크입니다** — 작은 색 점(픽셀) 수만 개로 채운 그림이라, 키우면 점이 커져 계단이 생기거나 흐려집니다
- **SVG는 조립 설명서입니다** — "이 곡선 안을 초록으로 칠하라"는 지시문만 들어 있어, 크기를 바꾸면 설명서대로 다시 그립니다. 그래서 몇 배로 키워도 선명합니다
- **받아 적기** — VTracer가 비슷한 색끼리 덩어리로 묶고, 덩어리 테두리를 곡선으로 따라 그려 설명서를 씁니다. 그림 종류에 따라 받아 적는 방식(흑백·네모 칸·색 개수)을 사용자가 고릅니다

설명서는 모자이크를 '보고' 쓴 것이라, 원래 그림에 없던 정보가 생기지는 않습니다. 대신 테두리가 매끈한 곡선이 되어 크게 써도 깨지지 않습니다.

## 3. 실제 화면으로 보기
클라우드 작업 공간(리눅스, CPU 2개, 그래픽카드 없음)에서 자동으로 실행한 **시연 결과**입니다. 그림은 시연용으로 **직접 그린 가상 자료**(가상 카페 로고·가상 서명·도트 화분)와 **CC0 고양이 사진**(scikit-image chelsea)입니다.

[이미지: vtracer-anim.gif | 대체 텍스트: VTracer 과정 애니메이션: 240px 로고 확대 시 흐릿 → SVG 변환 0.06초 후 20배에도 또렷 → 서명 사진에서 획만 남김(60.5%→82.6%) → 도트 그림 칸 모양 유지 순 화면]

**① 작은 로고 → 큰 그림.** 240px로 줄인 가상 로고 JPG(8.3KB)를 색 6가지로 정리해 SVG로 바꾸는 데 **0.06초** 걸렸습니다. 20배(4800px)로 키우면 일반 확대는 테두리가 흐릿하고, SVG는 또렷합니다.

[이미지: 로고확대비교.png | 대체 텍스트: 가상 카페 로고 240px JPG와 VTracer SVG를 20배로 키워 나란히 비교한 결과 그림, 일반 확대는 흐릿하고 SVG는 테두리가 또렷하며 변환 0.06초·색 6가지 표시]

> **표 읽는 법** — '같은 색 비율'은 1200px 원본 로고와 색이 거의 같은 점의 비율입니다. 두 값이 비슷하다는 것은 **색은 둘 다 원본과 비슷하다**는 뜻이고, 차이는 테두리가 흐릿한지 또렷한지에서 납니다(위 그림). '색 수'는 RGB 값이 조금이라도 다른 색을 모두 센 값입니다. 원본 로고는 4가지 색으로 그렸지만, 일반 확대는 JPG 압축과 테두리의 중간색 때문에 **눈에는 비슷해 보이는 미세하게 다른 색**이 18만 가지 넘게 생겼습니다. 색 수가 적을수록 인쇄용 그림으로 다루기 쉽습니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">방법</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">1200px 원본과 같은 색 비율</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">색 수</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">파일</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">일반 확대 (JPG를 그대로 키움)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">92.2%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">189,744가지</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">—</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">VTracer 기본 설정</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">94.4%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">327가지</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">73.7KB · 0.04초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">VTracer 색 6가지 + <code>simplify</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">93.0%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">6가지</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">46.4KB · 0.06초</td></tr>
</tbody>
</table>

다만 글자 테두리에 **연한 색 띠가 남은 곳**이 있었습니다.

**② 휴대폰으로 찍은 서명.** 종이에 쓴 가상 서명을 휴대폰으로 찍은 것처럼 오른쪽이 그림자로 어두운 사진입니다. 흑백 기본 설정은 **그림자까지 검게** 칠했고, 밝기 맞춤(`--adaptive`)을 더하자 **획만 남았습니다**. 결과 SVG는 배경이 투명해 문서 위에 바로 올릴 수 있습니다.

[이미지: 서명비교.png | 대체 텍스트: 그림자 진 가상 서명 사진을 VTracer로 바꾼 결과 그림, 흑백 기본 설정은 그림자까지 검게(원래 획과 겹침 60.5%), 밝기 맞춤 설정은 획만 남김(82.6%, 조각 3개)]

> **표 읽는 법** — 시연용 서명 사진은 먼저 깨끗한 서명 획 그림(**원래 획**)을 직접 그린 뒤, 그 위에 종이 색·그림자·잡티를 입혀 만들었습니다. '원래 획과 겹친 정도'는 VTracer가 검게 칠한 자리가 이 원래 획 자리와 얼마나 일치하는지를 나타냅니다. 100%면 원래 획과 똑같고, 그림자까지 검게 칠하면 원래 획에 없는 자리가 늘어 값이 내려갑니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">설정</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">걸린 시간</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">조각(도형) 수</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">파일</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">원래 획과 겹친 정도</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">색 그림 기본 설정</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">4.06초</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1,829개</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1,000KB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">59.9%</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--preset bw</code> (흑백 기본)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.04초</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">39개</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">46.1KB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">60.5%</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--clustering bw --adaptive</code> (밝기 맞춤)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.05초</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">3개</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">13.9KB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">82.6%</td></tr>
</tbody>
</table>

**③ 도트 그림.** 직접 찍은 24×24칸 화분 그림을 기본(곡선) 모드로 바꾸면 칸이 녹아 둥근 그림이 되고 노란 칸 하나가 사라졌습니다. `-m pixel`(네모 칸 그대로)로 바꾸면 칸 모양이 그대로 남았고, 480px로 키워도 칸 테두리가 번지지 않았습니다(2.5KB).

[이미지: 도트비교.png | 대체 텍스트: 24×24 가상 도트 화분을 480px로 키워 비교한 결과 그림, 원본 일반 확대는 흐릿, VTracer 곡선 모드는 칸이 녹고, pixel 모드는 칸 모양 그대로(2.5KB)]

**④ 사진.** 고양이 사진(451×300, 37.8KB)은 설정에 따라 그림 느낌이 크게 달라졌습니다. 다만 **SVG 파일이 원본 JPG보다 훨씬 커졌습니다**.

[이미지: 사진비교.png | 대체 텍스트: CC0 고양이 사진을 VTracer 설정 4가지로 바꾼 결과 그림, poster 697KB·같은 색 98.3%, max_colors=8 543.7KB, photo 조각 106개, watershed 조각 23개 비교]

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">설정</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">걸린 시간</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">파일</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">원본과 같은 색 비율</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">느낌</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">poster</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.48초</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">697KB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">98.3%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">원본과 거의 같음</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">기본</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.26초</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">551KB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">84.7%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">색 덩어리가 보임</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>max_colors=8</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.28초</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">543.7KB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">80.7%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">8가지 색 판화</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">photo</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.38초</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">146.7KB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">87.8%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">조각 106개</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">watershed</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.04초</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">48KB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">62.6%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">조각 23개 추상화</td></tr>
</tbody>
</table>

4000×2660 큰 사진은 기본 설정이 **0.92초**였지만, poster 설정은 **109초**가 걸리고 파일이 9.9MB가 됐습니다. 곡선을 단순하게 하는 `simplify`를 쓰면 로고는 73.7KB → 46.4KB, 고양이 사진은 551KB → 377.4KB로 줄었습니다. 아래는 명령 창에서 실행한 화면입니다.

[이미지: terminal.gif | 대체 텍스트: 명령 창에서 VTracer 1.0.0-alpha.4 확인 → 로고 JPG 8.3KB를 SVG 46.3KB로 → 서명 흑백 기본 조각 39개, 밝기 맞춤 3개 → 도트 pixel 모드 순 터미널 화면]

## 4. 설치와 사용 방법 (Windows)
> Windows 방법은 공식 README·PyPI 안내를 바탕으로 정리한 것이며, 이번 시연에서 Windows로 실행해 보지 않았습니다(리눅스 시연). 시연에서는 `pip install vtracer==1.0.0a4`가 0.66초, 함께 설치되는 프로그램은 없었습니다.

**방법 1. 화면 프로그램** — 공식 저장소(github.com/visioncortex/vtracer) README 맨 위 **Windows App** 링크에서 설치 파일을 받습니다. 이번 시연에서는 화면 프로그램을 실행하지 않았습니다.

**방법 2. 파이썬으로 설치** (이번 시연과 같은 방법)

```cmd
:: 1. 파이썬 설치 (이미 있으면 건너뜀) → 명령 프롬프트 창을 닫고 새로 열기
winget install -e --id Python.Python.3.12
:: 2. VTracer 1.0 설치 (버전 번호를 빼면 옛 버전 0.6.15가 설치됨)
pip install vtracer==1.0.0a4
:: 3. 그림이 있는 폴더로 이동
cd %USERPROFILE%\Desktop\그림
:: 4. 로고·아이콘: 색 6가지 + 곡선 단순화
python -c "import vtracer; vtracer.Config(max_colors=6, simplify=1.5).convert_file('로고.jpg', '로고.svg')"
:: 5. 서명·손글씨: 흑백 + 밝기 맞춤 (배경 투명)
python -c "import vtracer; vtracer.Config(clustering='bw', adaptive=True).convert_file('서명.jpg', '서명.svg')"
:: 6. 도트 그림: 네모 칸 모양 그대로
python -c "import vtracer; vtracer.Config(mode='pixel', filter_speckle=0).convert_file('도트.png', '도트.svg')"
:: 7. 결과를 엣지로 열어 Ctrl + 마우스 휠로 확대해 보기
start msedge 로고.svg
```

- **끌어다 놓기**: 저장소 `2026-11-16-vtracer/demo/tools_win/SVG만들기.bat`을 받은 뒤, 그림 파일을 실행 파일 위에 마우스로 끌어다 놓고 번호(1 로고 / 2 서명 / 3 도트 / 4 사진)를 누르면 그림 옆에 `이름.svg`가 생깁니다 (Windows 실행 확인 전)
- 만든 SVG는 파워포인트·워드에서 '삽입 → 그림'으로 넣을 수 있습니다
- 사진에 poster 설정을 쓰면 큰 사진에서 오래 걸립니다. 배치 파일 4번은 `max_colors=16`으로 색 개수를 정해 둡니다

## 5. 어디에 쓰면 좋을까
- **작은 가게·동아리 로고** → 원본 파일이 없을 때 현수막·스티커용 큰 그림 만들기 (인쇄소에 SVG를 받는지 먼저 확인)
- **서명 그림** → 종이에 쓴 서명을 찍어 배경 없는 그림으로 만들어 문서에 올리기
- **도트 그림·아이콘** → 칸 모양 그대로 크게 키운 그림 만들기

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 네. MIT 라이선스라 개인·회사 모두 무료로 쓸 수 있습니다.

**Q. 흐릿한 그림이 원본처럼 깨끗해집니까?**
**A.** 아닙니다. 테두리는 또렷한 곡선이 되지만, 원래 그림에 없던 세부 모양이 생기지는 않습니다. 시연 로고에서도 글자 테두리에 연한 색 띠가 남은 곳이 있었습니다.

**Q. 사진 용량을 줄이는 데 써도 됩니까?**
**A.** 맞지 않습니다. 시연에서 고양이 사진은 37.8KB가 SVG로 146.7~697KB가 됐습니다. 사진은 그림 느낌을 바꾸는 용도로 보시기 바랍니다.

**Q. `pip install vtracer`로 설치했는데 명령이 안 됩니다.**
**A.** 버전 번호 없이 설치하면 옛 버전 0.6.15가 설치됩니다. `pip install vtracer==1.0.0a4`로 다시 설치하시기 바랍니다.

**Q. 원본 그림이 바뀝니까?**
**A.** 아닙니다. 결과는 사용자가 정한 새 SVG 파일로 저장되고, 원본은 그대로입니다.

## 마무리
VTracer는 모자이크 그림(JPG·PNG)을 보고 **조립 설명서(SVG)를 받아 적어**, 크게 키워도 깨지지 않는 그림을 만드는 무료 프로그램입니다. 시연에서는 로고를 0.06초 만에 바꿔 20배로 키워도 또렷했고, 그림자 진 서명 사진에서 획만 남겼습니다. **로고는 색 개수, 서명은 밝기 맞춤, 도트 그림은 pixel 모드**를 고르는 것이 핵심이고, 사진은 파일이 커진다는 점을 알고 쓰시기 바랍니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-16에 클라우드 작업 공간(리눅스)에서 자동으로 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows, 파이썬 버전 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 VTracer 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(MIT)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- 원본 그림은 따로 보관하고, 결과 SVG는 직접 확대해 확인하시기 바랍니다. 남이 만든 로고·그림은 권리를 확인한 뒤 쓰시기 바랍니다.
- 서명 그림 파일은 다른 사람이 쓰지 못하게 보관에 주의하시기 바랍니다. 시연 그림은 직접 만든 가상 자료와 CC0 사진입니다.

**태그**: VTracer, vtracer, SVG변환, 벡터변환, 로고확대, 그림SVG, 서명만들기, 도트그림, 무료프로그램, 오픈소스, 깃허브추천
