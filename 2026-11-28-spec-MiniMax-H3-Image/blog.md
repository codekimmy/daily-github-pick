<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 사양 체크 편 (폴더 이름에 -spec-): 직접 실행하지 않음, 공식 자료 기준 -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → MiniMax-H3-Image 사양 체크 썸네일: 80GB 그래픽카드 카드, VRAM 최고 약 65GB, 라이선스 제외 지역에 대한민국이 빨간색으로 표시된 사양 카드
spec-card.png → MiniMax-H3-Image 필요 사양 카드: 공식 최소 VRAM 표기 없음, 큰 덩이 2개 각 약 62GB를 다 올리면 약 124GB로 80GB 선을 넘고, 자동 오프로드로 4736×3552 1장 최고 약 65GB, 저장 공간 약 135GB, ComfyUI 줄인 파일 약 47GB
license.png → MiniMax-H3-Image 라이선스 카드: MiniMax-H3-Image Community License, 라이선스 날짜 2026-11-10, 제외 지역 유럽연합·영국·대한민국·미국과 '한국 제외 → 허가 필요' 도장
-->
# MiniMax-H3-Image 사양 체크 — 1,600만 화소 그림 AI, 내 PC로 돌아갈까? (필요 VRAM·라이선스 정리)

> ※ 이 프로젝트는 그래픽카드가 필요해 직접 실행하지 않았으며, 필요 사양은 공식 자료를 바탕으로 정리한 것입니다.

> **한 줄 요약** — 글이나 참고 그림으로 약 1,600만 화소(16MP) 큰 그림을 만들고 고치는 공개 그림 AI입니다. **공식 최소 VRAM은 적혀 있지 않고**, 공식 예시는 80GB 그래픽카드에서도 큰 덩이 두 개를 번갈아 올려 1장에 최고 약 65GB를 쓰며, **모델 라이선스 제외 지역에 대한민국이 들어 있습니다.**
> 🔍 사양 체크 · ⭐ 477 (2026-11-28 확인) · Hugging Face 지난달 내려받기 1,036,133번 · 모델 파일 MiniMax-H3-Image Community License

> **사양 체크** — 실행 대신 공식 자료로 "내 PC로 돌아가는지", "한국에서 써도 되는지"를 정리했습니다.
> **이걸로 할 수 있는 것** (공식 모델 카드·블로그 기준)
> 1. 글만으로 **포스터·배경 화면 크기의 큰 그림**(약 1,600만 화소)을 만든다
> 2. 가지고 있는 **사진·그림을 넣고 고쳐 달라고** 한다
> 3. **참고 그림을 최대 16장** 넣어 분위기·인물을 맞춘다

[이미지: thumbnail.jpg | 대체 텍스트: MiniMax-H3-Image 사양 체크 썸네일: 80GB 그래픽카드 카드, VRAM 최고 약 65GB, 라이선스 제외 지역에 대한민국이 빨간색으로 표시된 사양 카드]

## 목차
1. MiniMax-H3-Image란 무엇입니까?
2. 비유로 쉽게 이해하기 — 작업대에 큰 덩이 두 개
3. 필요 사양 (공식 자료)
4. 라이선스 — 한국에서 써도 됩니까?
5. 설치 없이 보는 법 · 내 사양 확인법
6. 자주 묻는 질문

## 1. MiniMax-H3-Image란 무엇입니까?
MiniMax-H3-Image(미니맥스 에이치 쓰리 이미지)는 중국 AI 회사 MiniMax가 2026년 11월 공개한 그림 생성 AI입니다. 글로 그림을 만들고(text-to-image), 참고 그림을 넣어 고치기도 합니다(image editing). 그림 본체는 **331억 개 매개변수(33.1B)** 이고, **6단계** 만에 그림을 만들도록 줄였다고 모델 카드가 밝히고 있습니다. 결과는 어느 비율이든 **약 16MP**로, 4096×4096(1:1)부터 6272×2688(21:9)까지입니다. Hugging Face에서 지난달 **1,036,133번** 내려받았습니다(2026-11-28 확인).

## 2. 비유로 쉽게 이해하기 — 작업대에 큰 덩이 두 개
그래픽카드 메모리(VRAM)는 **작업대**, 시스템 메모리(RAM)는 **선반**입니다.

- 이 모델에는 **글 읽는 부분**과 **그림 본체**라는 큰 재료가 두 덩이 있고, 공식 문서 기준 각각 **약 62GB**입니다.
- 둘을 합치면 **80GB 작업대에도 같이 올라가지 않습니다.**
- 그래서 공식 예시는 지금 필요한 덩이만 작업대에 올리고 나머지는 선반에 두는 **자동 오프로드**를 씁니다. 이렇게 해서 큰 그림(4736×3552) 1장에 작업대를 **최고 약 65GB** 썼다고 적혀 있습니다.
- 선반(RAM)이 얼마나 필요한지는 **공식 표기가 없습니다.**

## 3. 필요 사양 (공식 자료)
> **읽는 법** — 공식 자료에는 최소 VRAM·권장 그래픽카드·운영체제가 **적혀 있지 않습니다.** 메모리 숫자는 공식 diffusers 문서의 예시 설명이며 최소 요구 사양이 아닙니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">항목</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">내용</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">출처</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">최소 VRAM</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">공식 표기 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[모델 카드](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">메모리 예시</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">두 덩이 각 약 62GB → 80GB 1장에 같이 안 들어감 → 자동 오프로드로 4736×3552 1장 최고 약 65GB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[diffusers 문서](https://huggingface.co/docs/diffusers/main/en/api/pipelines/minimax_h3_image)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">저장 공간</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">그림 본체 66.28GB + 글 읽는 부분 66.7GB + VAE 2.34GB → 약 135GB(계산), 글 다듬기 도우미(선택) 17.9GB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[모델 카드](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">줄인 파일</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">ComfyUI 공식 안내: INT8 본체 21GB + INT8 글 읽기 25.28GB + VAE 1.17GB → 약 47GB(계산), 필요 VRAM 표기 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[ComfyUI 안내](https://docs.comfy.org/tutorials/image/minimax/minimax-h3-image)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">운영체제·RAM</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">공식 표기 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[모델 카드](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">생성 시간</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">4K(4096×4096) 1장 10초 이내, 그래픽카드 종류 표기 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[공식 블로그](https://www.minimax.io/blog/minimax-h3-image)</td></tr>
</tbody>
</table>

[이미지: spec-card.png | 대체 텍스트: MiniMax-H3-Image 필요 사양 카드: 공식 최소 VRAM 표기 없음, 큰 덩이 2개 각 약 62GB를 다 올리면 약 124GB로 80GB 선을 넘고, 자동 오프로드로 4736×3552 1장 최고 약 65GB, 저장 공간 약 135GB, ComfyUI 줄인 파일 약 47GB]

ComfyUI 공식 안내는 작은 그래픽카드에서는 그림 크기를 **약 4MP로 낮추라**고만 안내하며, 정확한 VRAM 숫자는 없습니다. CPU만으로 만드는 방법이나 공식 GGUF 양자화 모델은 안내되어 있지 않습니다.

## 4. 라이선스 — 한국에서 써도 됩니까?
모델 파일은 **MiniMax-H3-Image Community License**(2026-11-10)를 따릅니다. 이 라이선스는 권한을 "제외 지역을 뺀 전 세계"에서만 주며, 제외 지역(Excluded Territories)을 이렇게 정합니다.

> "Excluded Territories" means the European Union, the United Kingdom, the Republic of Korea and the United States of America. ([LICENSE I.5](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image/blob/main/LICENSE))

즉 **대한민국에서는 별도 허가 없이 모델 파일을 쓸 권한이 주어지지 않습니다.** 그 밖에 연 매출 100만 달러가 넘거나 다른 사람에게 서비스로 제공하면 사전 서면 허가가 필요하고(IV.1), 상업 제품 화면에는 'MiniMax-H3-Image'를 표시해야 합니다(IV.2). 이 내용은 법률 자문이 아니므로 실제 판단은 원문과 전문가 확인을 거치시기 바랍니다.

[이미지: license.png | 대체 텍스트: MiniMax-H3-Image 라이선스 카드: MiniMax-H3-Image Community License, 라이선스 날짜 2026-11-10, 제외 지역 유럽연합·영국·대한민국·미국과 '한국 제외 → 허가 필요' 도장]

## 5. 설치 없이 보는 법 · 내 사양 확인법
**설치 없이 보는 곳** (모델 카드·공식 블로그에 안내된 링크)
- Hugging Face Space: https://huggingface.co/spaces/MiniMaxAI/minimax-h3-image
- 모델 페이지 Colab 버튼: https://huggingface.co/MiniMaxAI/MiniMax-H3-Image/colab
- MiniMax API: https://platform.minimax.io/docs/guides/image-generation
- Hailuo 웹: https://hailuoai.video/tools/minimax-h3-image · MiniMax Agent: https://agent.minimax.io/
- 요금·이용 지역·약관은 이 글에서 확인하지 않았습니다. 각 페이지에서 확인하시기 바랍니다.

**내 사양 확인 (Windows)**
1. **Ctrl + Shift + Esc** → 작업 관리자 → **성능** → **GPU**의 '전용 GPU 메모리' = VRAM, **메모리** = RAM
2. NVIDIA 그래픽카드라면 명령 프롬프트에 `nvidia-smi` → `… MiB / 전체MiB`의 뒤 숫자
3. 파일 탐색기 → **내 PC**에서 남은 저장 공간 (원래 파일 약 135GB, 줄인 파일 약 47GB)

## 6. 자주 묻는 질문
**Q. 집에 있는 게임용 그래픽카드로 돌아갑니까?**
**A.** 공식 최소 VRAM이 적혀 있지 않아 단정할 수 없습니다. 공식 예시는 80GB 그래픽카드에서 자동 오프로드로 최고 약 65GB를 썼습니다. ComfyUI 줄인 파일도 필요한 VRAM은 적혀 있지 않습니다.

**Q. 한국에서 써도 됩니까?**
**A.** 모델 파일 라이선스의 제외 지역에 대한민국이 들어 있어, 별도 허가 없이는 사용 권한이 주어지지 않습니다. 웹 서비스(Hailuo·MiniMax Agent) 이용 조건은 모델 라이선스와 별개이므로 각 서비스 약관을 확인하시기 바랍니다.

**Q. 한 장 만드는 데 얼마나 걸립니까?**
**A.** 공식 블로그는 4K 1장을 10초 안에 만든다고 밝혔지만, 어떤 그래픽카드에서 잰 값인지는 적혀 있지 않습니다.

## 마무리
MiniMax-H3-Image는 약 1,600만 화소 그림을 만드는 공개 그림 AI지만, 공식 최소 사양이 없고 공식 예시도 80GB 그래픽카드를 전제로 합니다. 무엇보다 **모델 라이선스 제외 지역에 대한민국이 들어 있으므로**, 한국에서는 소식과 사양을 참고하는 정도로 보시기 바랍니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- ※ 이 프로젝트는 그래픽카드가 필요해 직접 실행하지 않았으며, 필요 사양은 공식 자료를 바탕으로 정리한 것입니다. **2026-11-28에 공식 자료(Hugging Face 모델 카드·LICENSE·공식 블로그·diffusers 문서·ComfyUI 안내)를 기준으로 정리**한 것이며, 운영자가 검증한 값이 아닙니다. 합계(약 135GB·약 47GB)는 공식 파일 크기를 더한 계산 값입니다.
- 별 수·버전·기능·라이선스는 작성 시점 기준이며 바뀔 수 있습니다. 사용 전에 공식 GitHub 저장소와 라이선스 원문을 꼭 확인하시기 바랍니다.
- 이 채널은 MiniMax와 관련이 없고, 광고·제휴가 아닙니다. 프로그램과 모델은 제작자의 라이선스를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 공식 GitHub 저장소·모델 페이지에서만 받으시기 바랍니다.
- 모델 파일 라이선스의 제외 지역에 대한민국이 들어 있습니다. 라이선스 정리는 법률 자문이 아니며, AI가 만든 그림에는 사실과 다른 내용이 있을 수 있고 다른 사람의 초상·저작물을 흉내 내는 데 쓰지 마시기 바랍니다.

---
**태그**: MiniMax-H3-Image, 미니맥스, 그림AI, AI이미지생성, 그래픽카드사양, VRAM, ComfyUI, AI라이선스, 사양체크
