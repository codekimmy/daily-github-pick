<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 사양 체크 편 (폴더 이름에 -spec-): 직접 실행하지 않음, 공식 자료 기준 -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → Pika H3 Flex 사양 체크 썸네일: H100 80GB 그래픽카드 카드, VRAM 66~69GiB, 라이선스 제외 지역에 대한민국이 빨간색으로 표시된 사양 카드
spec-card.png → Pika H3 Flex 필요 사양 카드: H100 80GB 1장, 480p·5초 GPU 메모리 66~69GiB, 오프로드 29~32GiB·RAM 약 94GiB, 저장 공간 211GB 이상
license.png → Pika H3 Flex 라이선스 카드: 실행 코드 Apache-2.0, 모델 파일 MiniMax H3 Community License, 제외 지역 유럽연합·영국·대한민국·미국과 '한국 제외 → 문의 필요' 도장
-->
# Pika H3 Flex 사양 체크 — 소리까지 만드는 영상 AI, 내 PC로 돌아갈까? (필요 VRAM·라이선스 정리)

> ※ 이 프로젝트는 그래픽카드가 필요해 직접 실행하지 않았으며, 필요 사양은 공식 자료를 바탕으로 정리한 것입니다.

> **한 줄 요약** — 글·사진·소리로 소리가 붙은 5~15초 영상을 만드는 공개 영상 AI입니다. 공식 확인 그래픽카드는 H100 80GB 1장이고, **모델 라이선스 제외 지역에 대한민국이 들어 있습니다.**
> 🔍 사양 체크 · ⭐ 1.6k (2026-11-25 확인) · 실행 코드 Apache-2.0 / 모델 파일 MiniMax H3 Community License

> **사양 체크** — 실행 대신 공식 자료로 "내 PC로 돌아가는지", "한국에서 써도 되는지"를 정리했습니다.
> **이걸로 할 수 있는 것** (공식 README 기준)
> 1. 글만으로 **소리가 붙은 짧은 영상**(5~15초)을 만든다
> 2. **첫 장면·마지막 장면 사진**을 넣어 그 사이를 잇는 영상을 만든다
> 3. 사진·영상·소리 **참고 자료를 최대 12개** 넣어 분위기를 맞춘다

[이미지: thumbnail.jpg | 대체 텍스트: Pika H3 Flex 사양 체크 썸네일: H100 80GB 그래픽카드 카드, VRAM 66~69GiB, 라이선스 제외 지역에 대한민국이 빨간색으로 표시된 사양 카드]

## 목차
1. Pika H3 Flex란 무엇입니까?
2. 비유로 쉽게 이해하기 — 작업대와 선반
3. 필요 사양 (공식 자료)
4. 라이선스 — 한국에서 써도 됩니까?
5. 설치 없이 보는 법 · 내 사양 확인법
6. 자주 묻는 질문

## 1. Pika H3 Flex란 무엇입니까?
Pika H3 Flex(피카 에이치 쓰리 플렉스)는 영상 서비스 회사 Pika가 2026년 10월 말 공개한 영상 생성 AI입니다. 바탕 모델 **MiniMax-H3**(330억 개 매개변수) 위에 Pika가 만든 어댑터(추가 학습 파일) 2개를 얹어, **영상과 소리를 한 번에** 만듭니다. 결과는 5~15초, 480p·768p, 1초에 24장, 32kHz 스테레오 소리가 들어간 MP4 파일입니다. 생성 단계는 6번입니다(공식 README).

## 2. 비유로 쉽게 이해하기 — 작업대와 선반
그래픽카드 메모리(VRAM)는 **작업대**, 시스템 메모리(RAM)는 **선반**입니다.

- 재료를 작업대에 다 올리면(기본 설정) 480p·5초 영상에 작업대를 **약 66~69GiB** 썼습니다.
- 재료를 선반에 두고 필요한 것만 꺼내 쓰면(`--cpu-offload`) 작업대는 **약 29~32GiB**로 줄지만, 선반을 **약 94GiB** 썼습니다.

## 3. 필요 사양 (공식 자료)
> **읽는 법** — 공식 문서는 이 숫자가 "대표 측정값"이며 **최소 요구 사양이 아니라고** 밝힙니다. 1GiB ≈ 1.07GB입니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">항목</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">내용</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">출처</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">공식 확인 그래픽카드</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">NVIDIA H100 80GB 1장 (H200·B300 미확인, 요청 1개 = 그래픽카드 1장)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[docs/hardware.md](https://github.com/Pika-Labs/Pika-H3-Flex/blob/main/docs/hardware.md)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">그래픽카드 메모리</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">480p·5초 기본 설정 약 66~69GiB · 768p·15초는 H100도 넘어 <code>--cpu-offload</code> 필요 → 약 29~32GiB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[docs/hardware.md](https://github.com/Pika-Labs/Pika-H3-Flex/blob/main/docs/hardware.md)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">시스템 메모리(RAM)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">오프로드 때 약 94GiB(파일 캐시 포함), 공식 최소값 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[docs/hardware.md](https://github.com/Pika-Labs/Pika-H3-Flex/blob/main/docs/hardware.md)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">저장 공간</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">바탕 모델 211GB 이상 + 어댑터 약 5.5GB + 내려받기 공간</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[docs/hardware.md](https://github.com/Pika-Labs/Pika-H3-Flex/blob/main/docs/hardware.md)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">운영체제 · 파이썬</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">운영체제 공식 표기 없음 · 파이썬 3.12 · Windows 설치 안내 없음(ComfyUI 안내는 있음)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[docs/hardware.md](https://github.com/Pika-Labs/Pika-H3-Flex/blob/main/docs/hardware.md), [README](https://github.com/Pika-Labs/Pika-H3-Flex)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">생성 시간</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">공개된 측정값 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[README](https://github.com/Pika-Labs/Pika-H3-Flex)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">가벼운 버전</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">양자화·작은 모델·CPU 모드 공식 안내 없음</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[README](https://github.com/Pika-Labs/Pika-H3-Flex)</td></tr>
</tbody>
</table>

[이미지: spec-card.png | 대체 텍스트: Pika H3 Flex 필요 사양 카드: H100 80GB 1장, 480p·5초 GPU 메모리 66~69GiB, 오프로드 29~32GiB·RAM 약 94GiB, 저장 공간 211GB 이상]

## 4. 라이선스 — 한국에서 써도 됩니까?
실행 코드는 Apache-2.0이지만, 영상을 만드는 핵심인 **모델 파일은 MiniMax H3 Community License**(2026-08-02)를 따릅니다. 이 라이선스는 권한을 "제외 지역을 뺀 전 세계"에서만 주며, 제외 지역(Excluded Territories)을 이렇게 정합니다.

> "Excluded Territories" means the European Union, the United Kingdom, the Republic of Korea and the United States of America. ([LICENSE I.5](https://huggingface.co/Pika-Labs/Pika-H3-Flex/blob/main/LICENSE))

즉 **대한민국에서는 별도 허가 없이 모델 파일을 쓸 권한이 주어지지 않으며**, 해당 지역 라이선스는 따로 문의하라고 안내합니다. 그 밖에 연 매출 2천만 달러가 넘는 서비스는 사전 서면 허가, 상업 화면에는 'MiniMax H3' 표시가 필요합니다. 이 내용은 법률 자문이 아니므로 실제 판단은 원문과 전문가 확인을 거치시기 바랍니다.

[이미지: license.png | 대체 텍스트: Pika H3 Flex 라이선스 카드: 실행 코드 Apache-2.0, 모델 파일 MiniMax H3 Community License, 제외 지역 유럽연합·영국·대한민국·미국과 '한국 제외 → 문의 필요' 도장]

## 5. 설치 없이 보는 법 · 내 사양 확인법
**설치 없이 보는 곳** (README·모델 카드에 안내된 공식 링크)
- Pika API 놀이터: https://dev.pika.art/models/pika/pika-h3-flex/text-to-video/playground#playground
- Pika 웹사이트: https://create.pika.art
- Hugging Face Space: https://huggingface.co/spaces/Pika-Labs/pika-h3-flex
- ComfyUI 공식 안내: https://docs.comfy.org/tutorials/video/pika/pika-h3-flex
- 공식 페이지에 가격 표기가 없습니다. 요금·이용 지역·약관은 각 페이지에서 확인하시기 바랍니다.

**내 사양 확인 (Windows)**
1. **Ctrl + Shift + Esc** → 작업 관리자 → **성능** → **GPU**의 '전용 GPU 메모리' = VRAM, **메모리** = RAM
2. NVIDIA 그래픽카드라면 명령 프롬프트에 `nvidia-smi` → `… MiB / 전체MiB`의 뒤 숫자
3. 파일 탐색기 → **내 PC**에서 남은 저장 공간 (211GB + 5.5GB 이상 필요)

## 6. 자주 묻는 질문
**Q. 집에 있는 게임용 그래픽카드로 돌아갑니까?**
**A.** 공식으로 확인된 것은 H100 80GB 1장뿐이고, 가장 가벼운 공식 측정(오프로드)도 그래픽카드 메모리 약 29~32GiB에 RAM 약 94GiB를 썼습니다. 내 그래픽카드의 '전용 GPU 메모리'와 비교해 보시기 바랍니다. 더 가벼운 공식 버전은 안내되어 있지 않습니다.

**Q. 한국에서 써도 됩니까?**
**A.** 모델 파일 라이선스의 제외 지역에 대한민국이 들어 있어, 별도 허가 없이는 사용 권한이 주어지지 않습니다. 웹 서비스(Pika) 이용 조건은 모델 라이선스와 별개이므로 각 서비스 약관을 확인하시기 바랍니다.

**Q. 한 편 만드는 데 얼마나 걸립니까?**
**A.** README·모델 카드에 공개된 측정값이 없습니다.

## 마무리
Pika H3 Flex는 소리까지 함께 만드는 공개 영상 AI지만, 공식 확인 환경은 H100 80GB 1장이고 저장 공간도 211GB가 넘습니다. 무엇보다 **모델 라이선스 제외 지역에 대한민국이 들어 있으므로**, 한국에서는 소식과 사양을 참고하는 정도로 보시기 바랍니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- ※ 이 프로젝트는 그래픽카드가 필요해 직접 실행하지 않았으며, 필요 사양은 공식 자료를 바탕으로 정리한 것입니다. **2026-11-25에 공식 자료(GitHub README·docs/hardware.md·Hugging Face 모델 카드·LICENSE)를 기준으로 정리**한 것이며, 운영자가 검증한 값이 아닙니다. 버전·설정·내 PC 환경에 따라 다를 수 있습니다.
- 별 수·버전·기능·라이선스는 작성 시점 기준이며 바뀔 수 있습니다. 사용 전에 공식 저장소와 라이선스 원문을 꼭 확인하시기 바랍니다.
- 이 채널은 Pika·MiniMax와 관련이 없고, 광고·제휴가 아닙니다. 프로그램과 모델은 제작자의 라이선스를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 공식 저장소에서만 받으시기 바랍니다.
- 모델 파일 라이선스의 제외 지역에 대한민국이 들어 있습니다. 라이선스 정리는 법률 자문이 아니며, AI가 만든 영상·소리에는 사실과 다른 내용이 있을 수 있고 다른 사람의 초상·목소리·저작물을 흉내 내는 데 쓰지 마시기 바랍니다.

---
**태그**: Pika H3 Flex, 피카, 영상AI, AI영상생성, 그래픽카드사양, VRAM, H100, MiniMax H3, AI라이선스, 사양체크
