<!-- 티스토리: 마크다운 모드로 붙여넣기 / 이미지는 모두 media/ 폴더에 있음: thumbnail.jpg(대표), ocrmypdf-anim.gif, 찾기비교.png, 정확도비교.png, 바로세우기비교.png, terminal.gif -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → 가상 관리비 고지서 스캔에 OCRmyPDF가 붙인 글자 상자와 찾은 낱말 표시를 놓고 '스캔 PDF도 Ctrl+F 된다 · 3쪽 2.05초' 문구를 넣은 썸네일
ocrmypdf-anim.gif → OCRmyPDF 과정 애니메이션: 가상 고지서 Ctrl+F 0건 → 투명 글자 필름이 덮이며 3쪽 2.05초·낱말 9개 찾음 → 영어만 지정 시 깨진 글자 → 거꾸로 쪽 0%→100% 순 화면
찾기비교.png → 가상 관리비 고지서 스캔에서 처리 전 Ctrl+F 관리비 0건, OCRmyPDF 처리 후 글자 자리 파란 상자와 찾은 낱말 노란 표시가 생긴 모습을 나란히 비교한 결과 그림
정확도비교.png → OCRmyPDF 설정별 글자 정확도 막대그래프, 영어만·한국어 기본·한국어와 줄 단위 읽기를 고지서·가정통신문·영수증 3쪽에서 비교하고 가정통신문 100%, 찾은 낱말 3·5·9개를 표시한 결과 그림
바로세우기비교.png → 거꾸로 넣은 가정통신문 0%가 --rotate-pages로 100%, 4도 기울어진 고지서 90.6%가 --deskew로 96.5%가 된 OCRmyPDF 결과 4쪽 비교 그림
terminal.gif → 명령 창에서 OCRmyPDF 17.14.1 확인 → 가상 스캔 PDF 낱말 0/5 → 한국어·줄 단위 처리 후 5/5 → 거꾸로 쪽 2/2 → --skip-text 완료 순 터미널 화면
-->
# 스캔한 PDF에서 Ctrl+F가 안 될 때, 무료 프로그램 OCRmyPDF 사용법 총정리 (한국어 설정·Windows 설치법 포함)

> **한 줄 요약** — 글자가 그림으로만 들어 있는 스캔 PDF를 넣으면, 그림 속 글자를 읽어 같은 자리에 투명한 글자를 붙인 새 PDF를 만들어 주는 무료 프로그램입니다.
> ⭐ 별 35,316 · 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램) · MPL-2.0 라이선스 · 파이썬

> **일반인 쓸모 ★★★½☆ (3.5)** — 스캔한 서류에서 낱말을 찾을 일은 자주 생기고, 시연에서 가상 스캔 3쪽을 2.05초 만에 처리해 낱말 9개를 모두 찾았습니다. 다만 Windows에서는 프로그램 세 가지를 설치해야 하고 화면 프로그램이 없으며, 표 안 글자는 일부 틀렸습니다.
> **이걸로 할 수 있는 것**
> 1. 스캔한 **관리비 고지서·가정통신문·계약서 PDF에서 Ctrl+F로 낱말을 찾는다**
> 2. 스캔 PDF 속 **문장을 복사해 메모·메일에 붙여 넣는다** (읽은 글자만 메모장 파일로도 저장)
> 3. 거꾸로 넣거나 살짝 기울어진 쪽이 섞인 **스캔 묶음을 바로 세워 한 번에 정리**한다

[이미지: thumbnail.jpg | 대체 텍스트: 가상 관리비 고지서 스캔에 OCRmyPDF가 붙인 글자 상자와 찾은 낱말 표시를 놓고 '스캔 PDF도 Ctrl+F 된다 · 3쪽 2.05초' 문구를 넣은 썸네일]

## 목차
1. OCRmyPDF란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. 설치와 사용 방법 (Windows)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. OCRmyPDF란 무엇입니까?
스캐너로 읽은 PDF는 글자가 **그림**으로 들어 있어서, Ctrl+F로 찾거나 문장을 복사할 수 없습니다. OCRmyPDF(오씨알마이피디에프)는 이런 스캔 PDF의 글자를 읽어 **찾기·복사가 되는 PDF로 바꿔 주는 무료 프로그램**입니다. 2013년에 공개됐고, 지금 판은 17.14.1입니다.

글자를 읽는 일은 OCR(글자 인식, 그림 속 글자를 읽어 내는 기술) 프로그램 **Tesseract(테서랙트)**가 맡고, OCRmyPDF는 읽은 글자를 PDF에 붙이는 일을 합니다. 인공지능 모델을 따로 내려받지 않고, 그래픽카드 없이 작동합니다.

## 2. 비유로 쉽게 이해하기
OCRmyPDF는 스캔 그림 위에 **'투명 글자 필름'**을 한 겹 덮어 주는 프로그램입니다.

- **필름에 쓸 글자 읽기** — Tesseract가 쪽마다 그림 속 글자를 읽습니다. 어떤 언어로 읽을지는 사용자가 `-l kor+eng`처럼 정합니다
- **같은 자리에 투명하게 붙이기** — OCRmyPDF가 읽은 글자를 그림 속 글자와 같은 자리에 보이지 않게 붙입니다. 겉모습은 그대로이고, 찾기를 하면 그림 속 글자 자리에 표시가 생깁니다
- **필름을 덮기 전 손질** — 거꾸로 들어간 쪽은 바로 세우고, 살짝 기울어진 쪽은 바로잡습니다

필름에 적힌 글자가 틀리면 찾기도 틀립니다. 그래서 **언어 지정**과 **읽는 방식**이 결과를 크게 바꿉니다. 아래 시연 숫자에서 그대로 나타났습니다.

## 3. 실제 화면으로 보기
클라우드 작업 공간(리눅스, CPU 2개, 그래픽카드 없음)에서 자동으로 실행한 **시연 결과**입니다. 문서는 시연용으로 **직접 만든 가상 문서**(가상 관리비 고지서·가정통신문·카페 영수증 3쪽을 스캔처럼 기울이고 얼룩을 넣은 PDF)입니다.

[이미지: ocrmypdf-anim.gif | 대체 텍스트: OCRmyPDF 과정 애니메이션: 가상 고지서 Ctrl+F 0건 → 투명 글자 필름이 덮이며 3쪽 2.05초·낱말 9개 찾음 → 영어만 지정 시 깨진 글자 → 거꾸로 쪽 0%→100% 순 화면]

처리 전 PDF에서는 꺼낼 수 있는 글자가 0자였습니다. OCRmyPDF로 처리하자 3쪽이 **2.05초** 만에 끝났고, 낱말 9개(관리비·납부기한·방과후·신청서·치즈케이크 등)를 **모두** 찾았습니다. 아래 오른쪽 그림의 파란 상자가 투명 글자가 붙은 자리, 노란색이 찾은 낱말입니다.

[이미지: 찾기비교.png | 대체 텍스트: 가상 관리비 고지서 스캔에서 처리 전 Ctrl+F 관리비 0건, OCRmyPDF 처리 후 글자 자리 파란 상자와 찾은 낱말 노란 표시가 생긴 모습을 나란히 비교한 결과 그림]

**언어와 읽는 방식에 따라 결과가 크게 달랐습니다.** 정확도는 띄어쓰기를 빼고, 꺼낸 글자를 원래 글과 한 글자씩 비교한 값입니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">설정</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">처리 시간 (3쪽)</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">고지서</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">가정통신문</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">영수증</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">찾은 낱말 (9개 중)</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">언어 지정 없음 (영어만)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1.45초</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">14.1%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">5.5%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">33.7%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">3개 (숫자만)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-l kor+eng</code> (기본 읽기)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1.96초</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">32.9%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">32.6%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">99.0%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">5개</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>-l kor+eng --tesseract-pagesegmode 4</code> (줄 단위)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">2.05초</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">79.4%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">100%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">99.0%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">9개</td></tr>
</tbody>
</table>

[이미지: 정확도비교.png | 대체 텍스트: OCRmyPDF 설정별 글자 정확도 막대그래프, 영어만·한국어 기본·한국어와 줄 단위 읽기를 고지서·가정통신문·영수증 3쪽에서 비교하고 가정통신문 100%, 찾은 낱말 3·5·9개를 표시한 결과 그림]

언어를 정하지 않으면 한글이 `7}AO}DEE 1015-12038` 같은 영어 글자로 바뀌었습니다. 한국어를 지정해도 기본 읽기 방식에서는 가정통신문 줄 대부분이 빠졌고, **줄 단위 읽기**(`--tesseract-pagesegmode 4`)를 더하자 100%가 됐습니다. 다만 고지서 **표 안 항목 이름과 날짜**는 일부 틀렸습니다 (`48,300원` → `48,3007`, '2026년 11월 25일' → `20264 114 254`).

**거꾸로·기울어진 쪽**도 넣어 보았습니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">문서</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">그대로</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">옵션 사용</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">둘째 쪽을 거꾸로 넣은 스캔</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">그 쪽 0%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--rotate-pages</code> → 100%</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">4도 기울어진 고지서</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">90.6%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--deskew</code> → 96.5% (3.4도 바로잡음)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">6도 기울어진 고지서</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">68.2%</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><code>--deskew</code> → 기울기를 0도로 판단해 그대로</td></tr>
</tbody>
</table>

[이미지: 바로세우기비교.png | 대체 텍스트: 거꾸로 넣은 가정통신문 0%가 --rotate-pages로 100%, 4도 기울어진 고지서 90.6%가 --deskew로 96.5%가 된 OCRmyPDF 결과 4쪽 비교 그림]

그 밖에 70dpi로 거칠게 스캔한 문서는 낱말 9개 중 8개('납부기한'은 못 찾음)를 찾았고, **30쪽 문서는 9.09초** 걸렸습니다. 이미 글자를 넣은 PDF를 다시 넣으면 `PriorOcrFoundError` 오류로 멈추는데, `--skip-text`를 주면 글자가 있는 쪽은 건너뛰고 끝났습니다. 아래는 명령 창에서 실행한 화면입니다.

[이미지: terminal.gif | 대체 텍스트: 명령 창에서 OCRmyPDF 17.14.1 확인 → 가상 스캔 PDF 낱말 0/5 → 한국어·줄 단위 처리 후 5/5 → 거꾸로 쪽 2/2 → --skip-text 완료 순 터미널 화면]

## 4. 설치와 사용 방법 (Windows)
> Windows 방법은 공식 설치 문서를 바탕으로 정리한 안내이며, 이번 시연에서 실행해 보지 않았습니다(리눅스 시연). 시연에서는 `pip install ocrmypdf`가 7.0초, 함께 설치되는 프로그램까지 약 125MB였습니다.

```cmd
:: 0. 관리자 권한 명령 프롬프트 열기 (시작 → cmd → 마우스 오른쪽 → 관리자 권한으로 실행)
:: 1. 글자 인식 프로그램 Tesseract 설치
winget install -e --id tesseract-ocr.tesseract
:: 2. 한국어 언어 파일(1.6MB)을 Tesseract 폴더 안 tessdata 에 받기
curl -L -o "C:\Program Files\Tesseract-OCR\tessdata\kor.traineddata" https://github.com/tesseract-ocr/tessdata_fast/raw/main/kor.traineddata
:: 3. 설치 도구 uv 설치 → 창을 닫고 새로 연 뒤 OCRmyPDF 설치
winget install -e --id astral-sh.uv
uv tool install ocrmypdf
:: 4. 스캔 PDF가 있는 폴더로 이동
cd %USERPROFILE%\Desktop\스캔
:: 5. 한국어 + 줄 단위로 읽어 새 PDF 만들기 (원본 그대로)
ocrmypdf -l kor+eng --tesseract-pagesegmode 4 스캔본.pdf 검색가능.pdf
:: 6. 거꾸로·기울어진 쪽 바로잡기 + 이미 글자가 있는 쪽 건너뛰기
ocrmypdf -l kor+eng --tesseract-pagesegmode 4 --rotate-pages --deskew --skip-text 스캔본.pdf 검색가능.pdf
:: 7. 읽은 글자만 메모장 파일로도 받기
ocrmypdf -l kor+eng --tesseract-pagesegmode 4 --sidecar 글자.txt 스캔본.pdf 검색가능.pdf
```

- **끌어다 놓기**: 저장소 `2026-11-15-ocrmypdf/demo/tools_win/검색PDF만들기.bat`을 받은 뒤, 스캔 PDF를 실행 파일 위에 마우스로 끌어다 놓으면 PDF 옆에 `이름_검색가능.pdf`가 생깁니다. 6번 옵션이 모두 들어 있고, 여러 파일을 한꺼번에 끌어다 놓아도 됩니다 (Windows 실행 확인 전)
- `ocrmypdf` 명령을 찾지 못하면 `uv tool update-shell`을 실행하고 명령 프롬프트 창을 새로 여시기 바랍니다
- Ghostscript를 설치하지 않으면 결과가 PDF/A(오래 보관하는 PDF 형식)가 아닌 일반 PDF로 저장됩니다(공식 문서 기준). 찾기·복사에는 차이가 없습니다

## 5. 어디에 쓰면 좋을까
- **종이 서류를 스캔해 보관할 때** → 고지서·영수증·계약서 묶음에서 금액·날짜·이름을 Ctrl+F로 찾기
- **스캔해 받은 가정통신문·공문** → 문장을 복사해 메모나 일정에 붙여 넣기
- **스캔 파일이 많을 때** → 배치 파일에 여러 PDF를 끌어다 놓아 한 번에 처리 (30쪽 9.09초, 시연 기준)

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 네. MPL-2.0 라이선스라 개인·회사 모두 무료로 쓸 수 있습니다. 프로그램을 고쳐서 나눠 줄 때는 고친 파일을 공개해야 하는 조건이 있습니다.

**Q. 한글도 됩니까?**
**A.** 한국어 언어 파일을 넣고 `-l kor+eng`를 지정하면 됩니다. 시연에서는 줄 단위 읽기까지 더했을 때 가정통신문 100%, 영수증 99.0%였고, 표가 있는 고지서는 79.4%였습니다.

**Q. 원본 PDF가 바뀝니까?**
**A.** 아닙니다. 결과는 사용자가 정한 새 파일 이름으로 저장되고, 원본은 그대로입니다.

**Q. 휴대폰으로 찍은 사진이나 손글씨도 됩니까?**
**A.** 이번 시연에서는 스캐너로 읽은 것 같은 반듯한 인쇄 글자만 확인했습니다. 사진(JPG)은 PDF로 바꾼 뒤 넣어야 하고, 손글씨는 시연 범위 밖입니다.

**Q. 클릭만으로 쓰는 방법은 없습니까?**
**A.** OCRmyPDF에는 화면 프로그램이 없습니다. 이 글의 배치 파일을 쓰면, 설치를 마친 뒤에는 PDF를 끌어다 놓기만 하면 됩니다.

## 마무리
OCRmyPDF는 스캔 PDF에 **투명 글자 필름**을 덮어 Ctrl+F·복사를 되게 하는 무료 프로그램입니다. 시연에서는 3쪽을 2.05초 만에 처리해 낱말 9개를 모두 찾았지만, 언어를 정하지 않거나 기본 읽기 방식만 쓰면 한글이 깨지거나 줄이 빠졌습니다. **`-l kor+eng`와 `--tesseract-pagesegmode 4`를 함께 쓰고, 금액·날짜는 원본과 비교하는 것**이 핵심입니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-15에 클라우드 작업 공간(리눅스)에서 자동으로 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows, Tesseract 판 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 OCRmyPDF 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(MPL-2.0)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- 원본 PDF는 따로 보관하고, 결과는 직접 열어 확인하시기 바랍니다. 글자 인식은 틀릴 수 있으니 금액·날짜·계좌번호 같은 숫자는 원본과 비교하시기 바랍니다.
- 주민등록번호·계좌번호가 담긴 서류는 글자를 넣으면 찾기·복사가 쉬워집니다. 파일을 보내거나 올릴 때 더 조심하시기 바랍니다. 시연 문서는 직접 만든 가상 문서입니다.

---
**태그**: OCRmyPDF, OCR, 스캔PDF, PDF검색, PDF글자인식, 글자인식, 테서랙트, Tesseract, 무료프로그램, 오픈소스, 깃허브추천
