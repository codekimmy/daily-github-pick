<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → sharp-cli 썸네일: 가상 산풍경 사진 16.5MB가 진공 압축팩에 담겨 1.64MB가 되는 그림과 '사진 6장 0.5초 만에 1/10 용량' 글자
before-after.png → sharp-cli로 줄이기 전·후 가상 사진 6장 비교, 각 4032×3024 합계 16.50MB가 각 1600×1200 합계 1.64MB로 줄고 위치 정보가 빠진 결과 그림
sharp-cli-anim.gif → sharp-cli 과정 애니메이션: 가상 사진 6장 합계 16.5MB가 1.64MB로 줄어듦 → 진공 압축팩 그림 → 형식별 용량 막대 → 위치 정보 삭제·세로 사진 바로 세우기 → 설치 명령 순 화면
formats.png → sharp-cli 형식 비교 막대그래프: 같은 가상 사진 6장을 가로 1600으로 줄인 합계 JPG 1.64MB·WebP 1.01MB·AVIF 0.52MB·PNG 23.30MB와 닮은 정도 결과
quality-zoom.png → sharp-cli 화질 값 비교 그림: WebP 화질 95·80·40·20으로 저장한 가상 산풍경 사진의 같은 자리 3배 확대, 480KB에서 28KB로 줄며 잔무늬가 뭉개지는 결과
portrait-orient.png → sharp-cli 세로 사진 비교 그림: 기본 실행 결과는 1600×1200으로 누운 가상 산풍경, --autoOrient 결과는 1200×1600으로 바로 선 결과 그림
terminal.gif → 명령 창에서 sharp-cli 6.1.0 확인 → 가상 사진 6장 4032×3024 합계 16.50MB 목록 → 한 줄 명령 약 0.5초 → 1600×1200 합계 1.64MB·위치 없음으로 바뀐 터미널 화면
-->
# sharp-cli란? 휴대폰 사진 용량을 명령 한 줄로 줄이는 무료 도구 사용법 총정리 (설치법 포함)

> **한 줄 요약** — 사진 여러 장을 정해 준 크기·화질·형식으로 줄여 새 파일로 저장해 주는 무료 명령어 도구입니다. 사진 속 위치 정보도 기본으로 지웁니다.
> ⭐ 속 엔진 sharp 별 약 3.3만 (2026-11-23 확인) · 무료 오픈소스 · sharp Apache-2.0 · sharp-cli MIT 라이선스

> **일반인 쓸모 ★★★½☆ (3.5)** — 명령 한 줄로 휴대폰 크기 가상 사진 6장(16.5MB)이 약 0.5초 만에 1.64MB가 됐고, 사진 속 위치 정보도 기본으로 빠졌습니다. 블로그·서류 제출처럼 쓸 일은 자주 있지만, Node.js를 따로 설치해야 하는 명령어 도구이고 아이폰 HEIC 사진을 읽지 못해 별 세 개 반입니다.
> **이걸로 할 수 있는 것**
> 1. 블로그·카페에 올릴 **사진 여러 장을 한 번에 줄인다** (시연: 6장 16.5MB → 1.64MB, 약 0.5초)
> 2. 용량 제한이 있는 **서류 제출·메일 첨부 전에** 사진 크기를 줄인다 (시연: 60장 165MB → 10.1MB, 7.53초)
> 3. 사진을 공유하기 전에 **위치 정보(GPS)를 지운다**

[이미지: thumbnail.jpg | 대체 텍스트: sharp-cli 썸네일: 가상 산풍경 사진 16.5MB가 진공 압축팩에 담겨 1.64MB가 되는 그림과 '사진 6장 0.5초 만에 1/10 용량' 글자]

## 목차
1. sharp-cli란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. Windows에서 쓰는 법 (설치·실행·오류 해결)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. sharp-cli란 무엇입니까?
sharp-cli(샤프 씨엘아이)는 사진 파일의 크기·화질·형식을 바꿔 용량을 줄여 주는 무료 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램)입니다. 실제 그림 처리는 Lovell Fuller가 만든 속 엔진 sharp(샤프, Node.js용 그림 처리 프로그램)가 맡고, sharp-cli는 명령 프롬프트에서 sharp를 부르는 껍데기입니다.

휴대폰 사진 한 장이 3MB 안팎이라 블로그나 서류 제출 사이트에 올리다 "용량 초과"를 본 적이 있다면 이 도구가 하는 일을 바로 알 수 있습니다. 사진 묶음과 결과 폴더, 크기를 한 줄에 적으면 작게 줄인 새 사진이 생깁니다.

## 2. 비유로 쉽게 이해하기
sharp-cli는 **사진 진공 압축팩**입니다.

- **① 접기 = 크기 줄이기**: 4032 × 3024처럼 큰 사진을 가로 1600처럼 작게 접습니다
- **② 공기 빼기 = 화질 값**: 1~100 사이 화질 값으로 공기를 얼마나 뺄지 정합니다. 기본은 80이고, 너무 세게 빼면 잔무늬가 뭉개집니다
- **③ 영수증 빼기 = 위치 정보 삭제**: 넣기 전에 주머니 속 영수증(촬영 위치·기기 정보)을 빼 둡니다. 기본으로 빠집니다
- **새 상자에 담기**: 결과 폴더를 따로 정하면 원본은 그대로 남습니다. 결과 폴더를 원본 폴더로 정하면 원본을 덮어쓰므로 주의합니다

## 3. 실제 화면으로 보기
클라우드 작업 공간(리눅스, CPU 2개, 그래픽카드 없음)에서 sharp-cli 6.1.0을 자동 실행한 **시연 결과**입니다. 사진은 모두 시연용으로 컴퓨터가 그린 **가상 사진**(풍경 6장, 휴대폰 크기 4032 × 3024, 가상 위치 정보 포함)입니다. 실제 휴대폰 사진은 무늬가 더 복잡해 줄어드는 비율이 다를 수 있습니다.

> **읽는 법** — '닮은 정도(SSIM)'는 결과 사진이 원본과 얼마나 닮았는지를 0~1로 잰 값입니다. **1이면 똑같고, 작을수록 달라진 것**입니다. 예를 들어 0.986 → 0.788은 화질 값을 낮출수록 원본과 덜 닮았다는 뜻입니다. 보기 좋은지는 숫자만으로 알 수 없으니 직접 보고 고르시기 바랍니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">시연</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">결과</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">설치</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>npm install sharp-cli</code> 첫 설치 약 3.5초 · 함께 설치되는 프로그램 32개 · 37.7MB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">① 6장 한꺼번에</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">합계 16.50MB → <b>1.64MB(약 10분의 1)</b> · 각 1600 × 1200 · 0.49초 · 원본 그대로</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">② 형식 비교</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">JPG 1.64MB · WebP 1.01MB · AVIF <b>0.52MB</b>(11.9초로 가장 느림) · PNG <b>23.30MB</b>(원본보다 큼)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">③ 화질 값(WebP)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">95 → 480KB · 80 → 136KB · 40 → 49KB · 20 → 28KB (닮은 정도 0.986 → 0.788)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">④ 위치 정보</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">기본 실행 → 위치 정보 없음 · <code>-m</code> → 그대로 남음</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">⑤ 세로 사진</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">기본 실행 → 1600 × 1200으로 누움 · <code>--autoOrient</code> → 바로 섬</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">⑥ 60장</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">165.0MB → WebP 10.1MB · 7.53초</td></tr>
</tbody>
</table>

[이미지: before-after.png | 대체 텍스트: sharp-cli로 줄이기 전·후 가상 사진 6장 비교, 각 4032×3024 합계 16.50MB가 각 1600×1200 합계 1.64MB로 줄고 위치 정보가 빠진 결과 그림]

위 그림처럼 사진 6장이 각 2.56~3.35MB에서 0.23~0.41MB가 됐고, 결과 사진에서는 위치 정보가 빠졌습니다.

[이미지: sharp-cli-anim.gif | 대체 텍스트: sharp-cli 과정 애니메이션: 가상 사진 6장 합계 16.5MB가 1.64MB로 줄어듦 → 진공 압축팩 그림 → 형식별 용량 막대 → 위치 정보 삭제·세로 사진 바로 세우기 → 설치 명령 순 화면]

[이미지: formats.png | 대체 텍스트: sharp-cli 형식 비교 막대그래프: 같은 가상 사진 6장을 가로 1600으로 줄인 합계 JPG 1.64MB·WebP 1.01MB·AVIF 0.52MB·PNG 23.30MB와 닮은 정도 결과]

같은 사진이라도 저장 형식에 따라 용량이 크게 달랐습니다. PNG는 무손실 형식이라 사진에서는 오히려 원본보다 커졌습니다.

[이미지: quality-zoom.png | 대체 텍스트: sharp-cli 화질 값 비교 그림: WebP 화질 95·80·40·20으로 저장한 가상 산풍경 사진의 같은 자리 3배 확대, 480KB에서 28KB로 줄며 잔무늬가 뭉개지는 결과]

화질 값을 낮출수록 용량은 줄지만, 확대하면 화질 20에서 잔무늬가 뭉개집니다. 기본값 80에서 시작해 직접 보고 고르시기 바랍니다.

[이미지: portrait-orient.png | 대체 텍스트: sharp-cli 세로 사진 비교 그림: 기본 실행 결과는 1600×1200으로 누운 가상 산풍경, --autoOrient 결과는 1200×1600으로 바로 선 결과 그림]

휴대폰은 세로 사진을 눕혀 저장하고 "돌려서 보여 줘" 표시를 붙입니다. sharp-cli 기본 실행은 이 표시를 지워 결과가 눕고, `--autoOrient`를 붙이면 바로 섭니다.

[이미지: terminal.gif | 대체 텍스트: 명령 창에서 sharp-cli 6.1.0 확인 → 가상 사진 6장 4032×3024 합계 16.50MB 목록 → 한 줄 명령 약 0.5초 → 1600×1200 합계 1.64MB·위치 없음으로 바뀐 터미널 화면]

## 4. Windows에서 쓰는 법 (처음부터 끝까지)
> 시연은 클라우드(리눅스)에서 했고, 아래 Windows 방법은 sharp-cli 도움말(`sharp --help`)·npm 패키지 정보(sharp에 Windows용 `@img/sharp-win32-x64` 설치 파일이 함께 올라와 있음)·winget 목록(`OpenJS.NodeJS.LTS`)을 바탕으로 정리한 것입니다. **Windows에서 직접 실행해 확인한 것은 아닙니다.** 각 단계의 '성공 화면'과 다르게 나오면 맨 아래 '자주 나는 오류'를 보시기 바랍니다.

### 0. 준비물
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">항목</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">내용</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">운영체제</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Windows 10·11 (64비트). 2단계 winget이 없으면 nodejs.org에서 설치 파일을 받음</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Node.js</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">20.10 이상 (LTS 버전 권장, nodejs.org에서 무료) — npm(Node.js용 설치 도구)이 함께 설치됨</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">sharp-cli</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>npm install -g sharp-cli</code> 한 줄 (함께 설치되는 프로그램 32개, 시연 기준 약 38MB)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">따로 설치할 프로그램</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">없음 (그림 처리 프로그램 libvips가 sharp 안에 들어 있음)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화면</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">없음 — 명령 프롬프트(cmd)에 글자로 명령을 입력, 또는 아래 5단계 <code>.bat</code> 파일에 사진을 끌어다 놓기</td></tr>
</tbody>
</table>

### 1. Node.js 설치
1. https://nodejs.org 에서 **LTS** 버전 설치 파일(Windows Installer, .msi)을 받아 실행합니다
2. 설치 화면은 **Next**를 눌러 기본값 그대로 진행합니다 ('Add to PATH' 항목이 기본으로 켜져 있음)
3. 설치가 끝나면 키보드 `윈도우 키` → `cmd` 입력 → **명령 프롬프트**를 **새로** 엽니다

```cmd
:: (1번 대신) winget(Windows 기본 설치 도구)으로 설치해도 됩니다 → 설치 동의를 물으면 Y
winget install OpenJS.NodeJS.LTS
:: 설치 뒤 명령 프롬프트 창을 닫고 새로 열어 확인 → "v22.x.x"처럼 v20.10 이상 숫자가 나오면 성공
node --version
```

### 2. sharp-cli 설치
```cmd
:: 설치(-g = 어느 폴더에서나 쓰게) → "added 32 packages"처럼 나오면 성공 (숫자는 버전에 따라 다를 수 있음)
npm install -g sharp-cli
:: 확인 → "6.1.0"처럼 버전 번호가 나오면 성공
sharp --version
```

### 3. 내 사진으로 해 보기 (명령 프롬프트)
1. 파일 탐색기에서 사진이 있는 폴더를 엽니다
2. 탐색기 위쪽 **주소창을 누르고 `cmd`를 입력한 뒤 Enter** → 그 폴더 위치에서 명령 프롬프트가 열립니다
3. 아래 명령 중 필요한 것을 입력합니다 (파일 이름에 띄어쓰기가 있으면 `"여행 사진.jpg"`처럼 큰따옴표로 감쌉니다)

```cmd
:: ① 폴더 안 jpg 사진을 모두 가로 1600으로 줄여 "작게" 폴더에 저장 (화질 80, 원본은 그대로)
sharp -i "*.jpg" -o "작게/{name}.jpg" --autoOrient resize 1600 1600 --fit inside --withoutEnlargement

:: ② 더 작게: WebP 형식으로 (일부 프로그램은 WebP를 열지 못함)
sharp -i "*.jpg" -o "작게/{name}.webp" --autoOrient resize 1600 1600 --fit inside

:: ③ 화질 값을 바꿔 용량 조절 (1~100, 숫자가 작을수록 작고 화질이 떨어짐)
sharp -i "*.jpg" -o "작게/{name}.jpg" -q 60 --autoOrient resize 1600 1600 --fit inside

:: ④ 사진 한 장만 인스타그램용 정사각형(가운데를 잘라 1080 × 1080)
sharp -i "여행 사진.jpg" -o "정사각형/{name}.jpg" --autoOrient resize 1080 1080

:: ⑤ 위치 정보 등 사진 정보를 남기고 싶을 때 (-m)
sharp -i "*.jpg" -o "작게/{name}.jpg" -m --autoOrient resize 1600 1600 --fit inside

:: ⑥ 결과 폴더 열기
explorer 작게
```
- 결과는 **명령을 실행한 폴더 안 `작게` 폴더**에 원래 이름(`{name}`) + 정한 확장자로 생깁니다. `{name}`은 sharp-cli가 원래 파일 이름으로 바꿔 넣는 틀입니다
- `--autoOrient`는 세로로 찍은 사진이 눕지 않게 바로 세우고, `resize 1600 1600 --fit inside`는 **긴 변을 1600**에 맞춥니다(가로 사진 1600 × 1200, 세로 사진 1200 × 1600). `--withoutEnlargement`는 원래 작은 사진을 키우지 않게 합니다
- **결과 폴더(`-o`)를 원본 폴더로 정하지 않습니다.** 시연에서 원본 폴더로 정하자 묻지 않고 원본 사진을 덮어썼습니다
- 같은 명령을 다시 실행하면 `작게` 폴더 안 같은 이름 파일을 묻지 않고 새로 덮어씁니다

### 4. 명령어 없이 쓰기 — 끌어다 놓는 실행 파일
저장소의 `demo/tools_win/사진작게.bat`(이 글 아래 GitHub 저장소 링크의 날짜 폴더)을 내려받아 바탕화면 등에 두고, **사진 파일을 이 파일 위에 마우스로 끌어다 놓으면** 원본 옆 `작게만든사진` 폴더에 줄인 사진이 생깁니다(원본은 그대로).
- 기본 설정: 긴 변 1600, 화질 80, JPG, 세로 사진 바로 세우기, 작은 사진은 키우지 않음, 위치 정보 삭제
- 설정을 바꾸려면 `.bat`을 메모장으로 열어 `set SIZE=1600`(인스타그램용 1080), `set QUALITY=80`, `set FORMAT=jpg`(또는 webp)를 고칩니다
- 여러 장을 한꺼번에 끌어다 놓아도 됩니다. 1~2단계 설치가 먼저 끝나 있어야 하며, sharp가 없으면 무엇을 설치해야 하는지 화면에 안내합니다
- `.bat` 안 명령(`sharp -i 파일 -o "작게만든사진/{name}.jpg" -q 80 --autoOrient resize 1600 1600 --fit inside --withoutEnlargement`)은 리눅스에서 같은 옵션으로 확인했고(가로 사진 1600 × 1200, 세로 사진 1200 × 1600), `.bat` 파일 자체는 Windows에서 실행해 보지 않았습니다

### 5. 자주 나는 오류와 해결
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">화면에 나온 말</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">원인</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">해결</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'node'은(는) 내부 또는 외부 명령 … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Node.js 미설치 또는 설치 뒤 창을 새로 열지 않음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1단계 설치 후 <b>명령 프롬프트를 닫고 새로 열기</b></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>'sharp'은(는) 내부 또는 외부 명령 … 아닙니다</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">sharp-cli 미설치 또는 창을 새로 열지 않음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>npm install -g sharp-cli</code> 후 창을 새로 열기. 그래도 안 되면 PC를 다시 시작한 뒤 <code>sharp --version</code>으로 확인</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>No input files</code> (시연에서 본 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">입력한 이름의 사진이 없음, 또는 파일 이름에 <code>[ ]</code>가 있음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">명령 프롬프트가 사진 폴더에서 열렸는지 확인(<code>dir</code>), 파일 이름에서 대괄호 빼기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>heif: … Support for this compression format has not been built in</code> (시연에서 본 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">아이폰 HEIC 사진</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">아이폰 설정 › 카메라 › 포맷을 '높은 호환성'으로 바꾸면 JPG로 찍힘(이미 찍은 사진은 사진 앱 공유·내보내기 등으로 JPG로 바꾼 뒤 사용)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>Expected integer between 1 and 100 for quality</code> (시연에서 본 문구)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">화질 값이 1~100 밖</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-q 80</code>처럼 1~100 사이 숫자</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">결과 폴더 대신 확장자 없는 파일 하나가 생김</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-o 작게</code>처럼 없는 폴더 이름만 씀 (사진 1장일 때)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-o "작게/{name}.jpg"</code>처럼 <code>{name}</code> 틀 사용</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">결과 사진이 옆으로 누움</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">세로 사진의 방향 표시가 지워짐</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--autoOrient</code> 붙이기</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">원본 사진이 작아짐</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">결과 폴더를 원본 폴더로 정함</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">결과는 항상 다른 폴더로(<code>작게/{name}.jpg</code>), 작업 전 원본 백업</td></tr>
</tbody>
</table>

### 6. 지우는 법
```cmd
:: sharp-cli 지우기
npm uninstall -g sharp-cli
:: Node.js 지우기 (winget으로 설치했을 때. 설치 파일로 설치했으면 설정 › 앱에서 제거)
winget uninstall OpenJS.NodeJS.LTS
```

### 자주 쓰는 옵션
`-i`(입력, `"*.jpg"`처럼 여러 장) · `-o`(결과, `"폴더/{name}.jpg"`) · `-q`(화질 1~100, 기본 80) · `-f`(형식: jpeg·webp·avif·png) · `-m`(사진 정보 유지) · `--autoOrient`(방향 바로잡기) · `resize 가로 세로`(크기) · `--fit inside`(비율 유지) · `--withoutEnlargement`(키우지 않기) · `--position attention`(정사각형으로 자를 때 눈에 띄는 곳 남기기) · `-n`(미리 해 보기, 저장하지 않음) · `rotate 90` · `greyscale`(흑백)

## 5. 어디에 쓰면 좋을까
- **블로그·카페 사진** → 여러 장을 한 번에 같은 크기로 줄입니다
- **서류 제출·메일 첨부** → 용량 제한에 맞게 화질 값을 낮춥니다
- **사진 공유 전 위치 정보 지우기** → 기본 실행만으로 위치 정보가 빠집니다

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 무료입니다. sharp는 Apache-2.0, sharp-cli는 MIT 라이선스로 개인·회사 모두 쓸 수 있습니다.

**Q. 원본 사진이 바뀝니까?**
**A.** 결과 폴더를 따로 정하면 원본은 그대로 남았습니다. 그러나 결과 폴더를 원본 폴더로 정하자 묻지 않고 원본을 덮어썼습니다. 결과는 항상 다른 폴더로 받으시기 바랍니다.

**Q. 아이폰 사진도 됩니까?**
**A.** 아이폰 기본 형식인 HEIC 사진은 시연에서 오류로 실패했습니다. 아이폰 카메라 포맷을 '높은 호환성'으로 바꾸거나 JPG로 바꾼 뒤 쓰시기 바랍니다.

**Q. 어떤 형식으로 저장하면 됩니까?**
**A.** 어디서나 열리는 JPG가 무난합니다. 더 작게 하려면 WebP나 AVIF를 쓸 수 있지만, 일부 프로그램은 열지 못하고 AVIF는 시연에서 가장 느렸습니다(11.9초).

## 마무리
sharp-cli는 사진을 접고 공기를 빼서 작게 만드는 "사진 진공 압축팩"입니다. 시연에서 가상 사진 6장이 약 0.5초 만에 10분의 1 용량이 됐고, 위치 정보도 기본으로 빠졌습니다. 다만 Node.js를 따로 설치해야 하고, 세로 사진은 `--autoOrient`를 붙여야 하며, 결과는 꼭 다른 폴더로 받아야 합니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-23에 클라우드 작업 공간(리눅스)에서 시연용 가상 사진으로 자동 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 sharp·sharp-cli 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(sharp: Apache-2.0, sharp-cli: MIT)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- 사진을 바꿀 때는 원본을 따로 보관하고, 결과 사진의 화질과 위치 정보 삭제 여부를 직접 확인하시기 바랍니다.

---
**태그**: sharp-cli, sharp, 사진용량줄이기, 사진크기줄이기, 사진압축, WebP변환, 위치정보삭제, 무료프로그램, 오픈소스, 깃허브추천
