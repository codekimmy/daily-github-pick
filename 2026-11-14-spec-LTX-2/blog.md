<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 사양 체크 편 (GUIDE 8장): 폴더 이름에 -spec- 이 있으므로 블로그 자동화는 '사양 체크' 형식으로 글을 만든다 -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → LTX-2.5 사양 체크 썸네일, 내 PC로 돌아갈까 문구와 VRAM 24GB 이상 권장·저장 공간 100GB 이상·최소 9GiB~10GB 카드가 놓인 사양 카드
ltx2-spec-anim.gif → LTX-2.5 사양 카드 애니메이션, 그래픽카드 메모리 8GB부터 32GB까지 막대가 차례로 채워지고 저장 공간 66GiB·생성 시간 약 26분 카드가 나타나는 화면
메모리별막대.png → LTX-2.5 공식 앱 기준 그래픽카드 메모리별 가능 범위 막대 그림, 8GB는 클라우드로 넘어가고 10GB는 720p 5초, 32GB는 4K 10초까지 표시된 사양 카드
-->
# LTX-2.5 사양 정리: 내 PC로 돌아갈까? 그래픽카드 메모리(VRAM)별 가능 범위와 설치 없이 써 보는 법

> ※ 이 프로젝트는 그래픽카드가 필요해 직접 실행하지 않았으며, 필요 사양은 공식 자료를 바탕으로 정리한 것입니다.

> **한 줄 요약** — 글·사진·소리를 넣으면 소리까지 맞춘 영상을 만드는 무료 공개 AI. 공식 권장은 그래픽카드 메모리 24GB 이상입니다.
> ⭐ GitHub 별 약 9,800 · 🤗 Hugging Face 좋아요 약 1.1만 · 코드 Apache-2.0 / 모델 LTX-2.x Community License

> **사양 체크** — 그래픽카드가 꼭 필요한 모델이라 실행 대신 공식 자료로 "내 PC로 돌아가는지"를 정리했습니다.
> **이걸로 할 수 있는 것**
> 1. 글 한 줄("바닷가에서 강아지가 뛰어노는 장면")로 효과음까지 붙은 짧은 영상 만들기
> 2. 가족사진 한 장을 움직이는 영상으로 바꾸기
> 3. 직접 녹음한 노래·말소리에 맞춰 움직이는 영상 만들기

[이미지: thumbnail.jpg | 대체 텍스트: LTX-2.5 사양 체크 썸네일, 내 PC로 돌아갈까 문구와 VRAM 24GB 이상 권장·저장 공간 100GB 이상·최소 9GiB~10GB 카드가 놓인 사양 카드]

## 목차
1. LTX-2.5란 무엇입니까?
2. 비유로 쉽게 이해하기 — 그래픽카드 메모리는 '작업대'
3. 필요 사양 한눈에
4. 그래픽카드 메모리별로 되는 것
5. 가벼운 버전과 설정
6. 설치 없이 써 보는 법
7. 내 PC 사양 확인법 (Windows)
8. 자주 묻는 질문

## 1. LTX-2.5란 무엇입니까?
LTX-2.5는 Lightricks(라이트릭스)라는 회사가 공개한 **영상 생성 AI**입니다. 글이나 사진, 소리를 넣으면 소리가 맞춰진 영상이 나옵니다. 영상 모델의 매개변수(AI가 배운 숫자의 개수)는 220억 개로, 4K 화질과 HDR까지 공식 기능으로 지원합니다.

2026년 11월 Hugging Face(AI 모델 공유 사이트) 인기 순위에서 영상 모델 가운데 가장 위에 올랐습니다(2026-11-11 집계 좋아요 11,436). 프로그램 코드는 GitHub 저장소 [Lightricks/LTX-2](https://github.com/Lightricks/LTX-2)에 있고, 명령어 없이 쓰는 공식 앱 [LTX Desktop](https://github.com/Lightricks/LTX-Desktop)도 있습니다.

[이미지: ltx2-spec-anim.gif | 대체 텍스트: LTX-2.5 사양 카드 애니메이션, 그래픽카드 메모리 8GB부터 32GB까지 막대가 차례로 채워지고 저장 공간 66GiB·생성 시간 약 26분 카드가 나타나는 화면]

## 2. 비유로 쉽게 이해하기 — 그래픽카드 메모리는 '작업대'
영상 AI는 작업대 위에 재료(모델)와 만들 영상을 한꺼번에 올려놓고 일합니다. 이 작업대가 **그래픽카드 메모리(VRAM, 그래픽카드에 붙은 전용 메모리)** 입니다.

- 작업대가 넓으면(32GB) 큰 영상을 한 번에 만듭니다.
- 작업대가 좁으면(10~16GB) 재료를 조금씩 꺼내 쓰거나 영상을 조각으로 나눠 만듭니다. 대신 시간이 더 걸리고, 조각 사이 장면이 조금씩 달라질 수 있습니다.
- 작업대가 너무 좁으면(8GB) 아예 시작하지 못하고, 공식 앱은 클라우드(인터넷 너머 회사 서버)로 넘깁니다.

## 3. 필요 사양 한눈에
<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">항목</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">공식 자료 기준</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">출처</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">권장 VRAM</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">24GB 이상, 32GB 권장 (예: RTX 4090 24GB, RTX 5090 32GB)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[LTX Desktop README](https://github.com/Lightricks/LTX-Desktop)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">최소 VRAM</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">공식 앱 하한 9GiB (Windows + FP8 지원 그래픽카드), 8GB 카드는 클라우드로 넘어감</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[하드웨어 호환 문서](https://github.com/Lightricks/LTX-Desktop/blob/main/docs/hardware-compatibility.md)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">저장 공간</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">모델 파일 약 66GiB, 공식 앱은 100GB 이상 여유</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[LTX-2 README](https://github.com/Lightricks/LTX-2)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">시스템 메모리(RAM)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Windows 64GB (NVMe에 모델을 두면 32GB로 모든 기능)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[LTX Desktop README](https://github.com/Lightricks/LTX-Desktop)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">운영체제</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Windows 10·11, Linux, macOS 26 이상 Apple 칩 Mac</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[LTX Desktop README](https://github.com/Lightricks/LTX-Desktop)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">생성 시간</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">RTX 5090에서 4K 3초 약 7분, 10초 약 26분. 다른 카드는 공개된 측정값 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[하드웨어 호환 문서](https://github.com/Lightricks/LTX-Desktop/blob/main/docs/hardware-compatibility.md)</td></tr>
</tbody>
</table>

## 4. 그래픽카드 메모리별로 되는 것
공식 앱 문서에는 메모리 크기별로 허용하는 화질과 길이가 표로 나와 있습니다(16:9, 24fps 기준).

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">내 그래픽카드 메모리</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">공식 앱이 허용하는 범위</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">8GB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">내 PC 생성 불가 → 클라우드로 넘어감</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">10GB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">720p 5초, 540p 10초까지</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">12GB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1080p 10초 (6조각으로 나눠 생성)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">16GB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1080p 20초 (6조각)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">24GB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1440p 20초, 4K 10초까지 (공식 권장 시작)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">32GB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">4K 10초 (7조각), 공식 권장</td></tr>
</tbody>
</table>

[이미지: 메모리별막대.png | 대체 텍스트: LTX-2.5 공식 앱 기준 그래픽카드 메모리별 가능 범위 막대 그림, 8GB는 클라우드로 넘어가고 10GB는 720p 5초, 32GB는 4K 10초까지 표시된 사양 카드]

1440p·4K의 16GB·24GB 칸은 제작사가 RTX 5090 측정값으로 계산한 값이라고 문서에 적혀 있습니다. 조각이 많을수록 시간이 더 걸립니다.

## 5. 가벼운 버전과 설정
- **증류(distilled) 모델**: 만드는 단계를 8번 + 4번으로 줄인 빠른 모델입니다. 공식 빠른 시작 예시가 이 모델을 씁니다.
- **FP8 설정**: 숫자를 작게 저장해 그래픽카드 메모리를 덜 씁니다.
- **오프로드 설정**: 모델 일부를 RAM이나 디스크에 두고 꺼내 씁니다. 대신 느려집니다.
- **공식 앱 기본 모델 LTX 2.5 Fast**: 내 PC용 기본 모델입니다. 더 높은 화질의 LTX 2.5 Pro는 클라우드 전용입니다.
- 그래픽카드 없이 CPU만으로 돌리는 방법은 공식 안내가 없습니다.

## 6. 설치 없이 써 보는 법
- **LTX 공식 Playground**: https://console.ltx.video/playground
- **LTX Studio 웹 데모 화면**: 글 → 영상 https://app.ltx.studio/ltx-2-playground/t2v · 사진 → 영상 https://app.ltx.studio/ltx-2-playground/i2v
- 두 곳 모두 가입이 필요합니다. 무료 범위와 요금은 바뀔 수 있으므로 공식 페이지에서 확인하시기 바랍니다.

## 7. 내 PC 사양 확인법 (Windows)
```cmd
:: 1. 그래픽카드 메모리: Ctrl + Shift + Esc → 작업 관리자 → 성능 → GPU → '전용 GPU 메모리'
:: 2. NVIDIA 그래픽카드라면 명령 프롬프트(cmd)에 아래 한 줄 입력 → 메모리 총량(MiB) 확인
nvidia-smi
:: 3. 시스템 메모리(RAM): 작업 관리자 → 성능 → 메모리
:: 4. 남은 저장 공간: 파일 탐색기 → 내 PC
```
24GB 이상이면 공식 권장을 채우고, 10~16GB면 짧은 영상이나 조각 생성으로 가능합니다. 8GB 이하라면 공식 웹 데모가 현실적입니다.

## 8. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 모델 파일과 코드는 무료로 받을 수 있습니다. 다만 연 매출 1,000만 달러 이상 회사는 유료 상업 라이선스가 필요하고, 개인·작은 회사도 라이선스의 금지 용도는 지켜야 합니다([LICENSE-2_x](https://github.com/Lightricks/LTX-2/blob/main/LICENSE-2_x)).

**Q. 8GB 그래픽카드 노트북으로 됩니까?**
**A.** 공식 앱 기준으로는 내 PC 생성이 되지 않고 클라우드로 넘어갑니다. 공식 웹 데모를 먼저 보시기 바랍니다.

**Q. 모델 파일은 어디서 받습니까?**
**A.** Hugging Face의 [Lightricks/LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5)에서 받습니다. 계정 로그인과 약관 동의가 필요합니다. 공식 앱은 첫 화면에서 이 과정을 안내합니다.

**Q. Mac에서도 됩니까?**
**A.** macOS 26 이상, Apple 칩 Mac에서 됩니다. 32GB가 최소이고 48GB 이상을 권장합니다. 24GB 미만 Mac과 인텔 Mac은 클라우드만 씁니다.

## 마무리
LTX-2.5는 그래픽카드 메모리 24GB 이상이면 공식 권장을 채우고, 10~16GB도 짧은 영상이라면 조각 생성으로 가능합니다. 내 사양이 부족하다면 설치보다 공식 웹 데모로 결과부터 확인하는 쪽이 현실적입니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- ※ 이 프로젝트는 그래픽카드가 필요해 직접 실행하지 않았으며, 필요 사양은 공식 자료를 바탕으로 정리한 것입니다. 이 글의 숫자는 **2026-11-14 기준 공식 자료를 정리한 것이며 직접 실행하지 않았습니다.** 운영자가 검증한 값이 아니며, 내 PC에서는 다를 수 있습니다.
- 별 수·버전·사양·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 Lightricks(LTX-2.5 제작사)와 관련이 없고, 광고·제휴가 아닙니다. 프로그램 코드는 Apache-2.0, 모델 파일은 LTX-2.x Community License를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제, 그래픽카드 과열 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- AI가 만든 영상은 사실과 다른 장면이 나올 수 있고, 실제 인물·상표를 흉내 낸 영상은 법적 분쟁으로 이어질 수 있습니다. 상업적으로 쓰기 전에 라이선스 원문을 확인하시기 바랍니다(이 글은 법률 자문이 아닙니다).

---
**태그**: LTX-2.5, LTX-2, Lightricks, 영상 생성 AI, AI 영상 만들기, 그래픽카드 VRAM, 사양 체크, 내 PC 사양, 무료 AI 영상, 오픈소스 AI
