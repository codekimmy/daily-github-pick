<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → 같은 노을 영상 GIF의 하늘을 확대한 흔한 변환 5.2MB와 gifski 1.4MB 비교 위에 '움짤 용량 1/4, 점무늬 없는 GIF' 글자를 얹은 썸네일
gifski-anim.gif → gifski 과정 애니메이션: 노을 GIF 흔한 변환 5.2MB와 gifski 1.4MB 비교 → 장면별 크레파스 상자·한 화면 4,210색 → 하늘 확대 → 화면 녹화는 ffmpeg 팔레트 58KB 순 화면
compare-sunset.png → 노을 영상 50번째 장면 하늘을 3배 확대한 비교 그림, 원본·ffmpeg 기본(점무늬)·ffmpeg 팔레트(둥근 띠)·gifski(부드러움)·gifski 품질 50(얼룩) 순 결과 그림
terminal.gif → 명령 창에서 gifski 1.34.0 확인 → ffmpeg 기본 변환 → ffmpeg로 넘겨 gifski 변환 → 가로 320·초당 10장·품질 70 변환 → 크기 비교 5371K·1398K·210K 순 터미널 화면
-->
# gifski란? 영상을 작고 선명한 GIF 움짤로 바꾸는 무료 프로그램 사용법 총정리 (설치법 포함)

> **한 줄 요약** — 영상을 넣으면 장면마다 알맞은 색을 골라 칠해서, 용량은 작고 색은 부드러운 GIF 움짤을 만들어 주는 무료 프로그램입니다.
> ⭐ 별 5,711 · 무료 오픈소스 · AGPL-3.0 라이선스

> **일반인 쓸모 ★★★½☆ (3.5)** — Windows는 `winget` 명령 한 줄로 화면 프로그램을 설치해 영상을 끌어다 놓는 방식입니다(공식 안내). 시연에서 노을 영상 GIF가 흔한 변환의 약 4분의 1 용량이 됐지만, 화면 녹화 영상은 오히려 커서 반 개를 뺐습니다.
> **이걸로 할 수 있는 것**
> 1. 블로그·카페 글에 넣는 **사용법 움짤을 점무늬 없이 작게** 만든다
> 2. 여행·반려동물 영상에서 **몇 초만 잘라 메신저용 움짤**로 만든다
> 3. 상품 소개·발표 자료에 넣을 **짧은 움직이는 그림**을 만든다

[이미지: thumbnail.jpg | 대체 텍스트: 같은 노을 영상 GIF의 하늘을 확대한 흔한 변환 5.2MB와 gifski 1.4MB 비교 위에 '움짤 용량 1/4, 점무늬 없는 GIF' 글자를 얹은 썸네일]

## 목차
1. gifski란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. 설치 방법 (Windows)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. gifski란 무엇입니까?
gifski(기프스키)는 영상(mp4 등)을 **GIF 움짤**(소리 없이 저절로 반복 재생되는 움직이는 그림 파일)로 바꿔 주는 무료 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램)입니다. PNG 압축 도구 pngquant를 만든 Kornel Lesiński가 만들었고, GitHub 별은 5,711개입니다.

움짤을 만들어 블로그에 올리면 "용량이 왜 이렇게 크지?", "하늘에 왜 모래알 같은 점이 생기지?" 하는 일이 자주 생깁니다. gifski는 이 두 가지를 줄이는 데 초점을 맞춘 프로그램입니다.

## 2. 비유로 쉽게 이해하기
GIF는 **한 장면에 크레파스 256개까지만 쓸 수 있는 그림**입니다.

- **흔한 변환(ffmpeg 기본)**: 정해진 크레파스 상자 하나로 모든 장면을 칠합니다. 상자에 없는 색은 다른 색 점을 섞어 흉내 내서 **점무늬**가 생깁니다
- **ffmpeg 팔레트 방법**: 영상에 맞춰 크레파스 256개를 미리 골라 둡니다. 점무늬는 줄지만 노을 하늘에 **둥근 띠**가 보였습니다
- **gifski**: **장면마다 크레파스를 새로 골라** 칠하고, 앞 장면에서 바뀐 곳만 덧칠합니다. 그래서 한 화면에 보이는 색이 256개를 넘습니다 (시연: 커피잔 영상 한 장면 **4,210색**)

## 3. 실제 화면으로 보기
클라우드 작업 공간(리눅스, CPU 2개)에서 gifski 1.34.0으로 자동 실행한 **시연 결과**입니다. 원본은 시연용으로 직접 만든 5초짜리 영상 3개(480×320, 100장)입니다.

[이미지: gifski-anim.gif | 대체 텍스트: gifski 과정 애니메이션: 노을 GIF 흔한 변환 5.2MB와 gifski 1.4MB 비교 → 장면별 크레파스 상자·한 화면 4,210색 → 하늘 확대 → 화면 녹화는 ffmpeg 팔레트 58KB 순 화면]

> **읽는 법** — '닮은 정도'(SSIM)는 GIF를 원본 영상과 장면마다 비교한 값으로 **1에 가까울수록 원본과 같습니다**. gifski는 장면 사이에 점을 섞어 색을 늘리므로, 한 장씩 비교하는 이 점수가 눈에 보이는 것보다 낮게 나올 수 있습니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">영상</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">ffmpeg 기본</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">ffmpeg 팔레트</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">gifski 기본</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">노을 (색이 부드럽게 이어짐)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">5.2MB · 0.301</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">3.1MB · 0.947</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>1.4MB · 0.954</b></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">커피잔 사진 확대</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">7.6MB · 0.454</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">9.9MB · 0.947</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>5.6MB</b> · 0.894</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">메모장 화면 녹화</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">5.2MB · 0.257</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>58KB · 1.000</b></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">98KB · 0.999</td></tr>
</tbody>
</table>

- **노을 영상**: gifski가 가장 작고(흔한 변환의 약 4분의 1) 원본과 가장 닮았습니다
- **커피잔 영상**: gifski가 팔레트 방법보다 약 44% 작았지만, 장면마다 비교한 점수는 팔레트 방법이 높았습니다
- **화면 녹화**: 색이 적은 화면은 **ffmpeg 팔레트 방법이 더 작았습니다**

[이미지: compare-sunset.png | 대체 텍스트: 노을 영상 50번째 장면 하늘을 3배 확대한 비교 그림, 원본·ffmpeg 기본(점무늬)·ffmpeg 팔레트(둥근 띠)·gifski(부드러움)·gifski 품질 50(얼룩) 순 결과 그림]

용량을 더 줄이는 옵션도 시연했습니다 (커피잔 영상, gifski 기본 5.6MB 기준).

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">옵션</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">용량</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-Q 70</code> (품질 70)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">3.4MB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-Q 50</code> (품질 50, 확대하면 얼룩)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1.6MB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-W 320</code> (가로 320픽셀)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">2.5MB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-r 10</code> (초당 10장)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">3.2MB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-W 320 -r 10</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1.5MB</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-W 320 -r 10 -Q 70</code></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>0.95MB</b></td></tr>
</tbody>
</table>

[이미지: terminal.gif | 대체 텍스트: 명령 창에서 gifski 1.34.0 확인 → ffmpeg 기본 변환 → ffmpeg로 넘겨 gifski 변환 → 가로 320·초당 10장·품질 70 변환 → 크기 비교 5371K·1398K·210K 순 터미널 화면]

5초 영상 하나를 바꾸는 데 gifski는 0.5~6.9초 걸렸습니다. 시연에서 설치한 버전(`cargo install gifski`)은 mp4를 직접 읽지 못해, ffmpeg(영상 변환 프로그램)가 영상을 풀어 넘기는 방식으로 실행했습니다.

## 4. 설치 방법 (Windows)
> 아래 방법은 공식 누리집(gif.ski)과 winget 등록 정보를 바탕으로 정리한 것이며, 시연에서 Windows로 실행해 보지 않았습니다.

**방법 1. 화면 프로그램 (초보자 추천)**
```cmd
:: 명령 프롬프트(cmd)에 붙여넣기 → gifski 화면 프로그램 설치 (1.14.4)
winget install --id ImageOptim.gifski -e
```
설치 뒤 시작 메뉴에서 gifski를 열고, 영상 파일을 창에 끌어다 놓은 다음 크기·품질을 골라 저장합니다.

**방법 2. 명령어 버전** — gif.ski에서 명령어 zip(1.32.0)을 받아 바탕화면\gifski 폴더에 풉니다.
```cmd
:: gifski 폴더로 이동
cd %USERPROFILE%\Desktop\gifski
:: ffmpeg 설치 (영상을 풀어 넘기는 프로그램)
winget install Gyan.FFmpeg
:: 영상 → GIF (기본 품질 90)
ffmpeg -i 영상.mp4 -f yuv4mpegpipe - | gifski.exe -o 결과.gif -
:: 더 작게: 가로 320, 초당 10장, 품질 70
ffmpeg -i 영상.mp4 -f yuv4mpegpipe - | gifski.exe -W 320 -r 10 -Q 70 -o 결과_작게.gif -
```

## 5. 어디에 쓰면 좋을까
- **블로그·카페 사용법 글** → 움짤을 점무늬 없이 작게 넣습니다
- **반려동물·여행 영상** → 3~5초만 잘라 메신저용 움짤로 보냅니다
- **발표 자료·상품 소개** → 재생 버튼 없이 저절로 움직이는 그림을 넣습니다

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 개인이 프로그램으로 쓰는 것은 무료입니다. 라이선스가 AGPL-3.0이라, 회사가 자기 제품(닫힌 소스 프로그램·서비스)에 gifski를 넣으려면 별도 상업 라이선스를 확인해야 합니다.

**Q. 어떤 영상에 알맞습니까?**
**A.** 시연에서는 노을·사진처럼 색이 많은 영상에서 용량이 크게 줄었습니다. 글자 위주의 화면 녹화는 ffmpeg 팔레트 방법이 더 작았으므로 둘 다 만들어 비교하시기 바랍니다.

**Q. 용량을 더 줄이려면 어떻게 합니까?**
**A.** 가로 크기(`-W`)와 초당 장면 수(`-r`)를 먼저 줄이고, 그래도 크면 품질(`-Q`)을 70 정도로 내립니다. 품질 50에서는 얼룩이 보였습니다.

**Q. 움짤보다 영상이 더 작지 않습니까?**
**A.** 그렇습니다. 시연의 노을 영상은 mp4 167KB, gifski GIF 1.4MB였습니다. 올리는 곳이 영상을 받아 준다면 mp4가 더 가볍습니다.

## 마무리
gifski는 "움짤이 너무 크고 지글거린다"는 고민을 장면마다 크레파스를 다시 고르는 방법으로 풀어 주는 프로그램입니다. 색이 많은 영상일수록 차이가 컸고, 화면 녹화는 다른 방법이 더 작았습니다. 어느 결과가 보기 좋은지는 확대 비교 그림을 보고 직접 고르시기 바랍니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-19에 클라우드 작업 공간(리눅스)에서 자동으로 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 gifski 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(AGPL-3.0-or-later)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- 원본 영상은 지우지 말고 보관하고, 남의 영상으로 만든 움짤은 저작권을 먼저 확인하시기 바랍니다.

---
**태그**: gifski, 기프스키, GIF만들기, 움짤만들기, GIF용량줄이기, 영상GIF변환, 무료프로그램, ffmpeg, 오픈소스, 깃허브추천
