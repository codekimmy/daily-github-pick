<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 사양 체크 편 (GUIDE 8장): 폴더 이름에 -spec- 이 있으므로 블로그 자동화는 '사양 체크' 형식으로 글을 만든다 -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → MOSS-Image 사양 체크 썸네일, 내 PC로 돌아갈까 문구와 GPU 메모리 3.65GiB~·RAM 14GiB·모델 파일 약 25GB 카드 3장을 그린 직접 만든 사양 카드
moss-spec-anim.gif → MOSS-Image 사양 카드 애니메이션: '내 PC로 돌아갈까?' 제목 아래 GPU 메모리 3.65GiB, RAM 14GiB, 모델 파일 약 25GB 막대가 차례로 채워지고 M1 Max 320.4초 카드가 나타나는 화면
-->
# MOSS-Image 사양 정리: 글자까지 그리는 무료 그림 AI, 내 PC로 돌아갈까? (최소 모드·설치 없이 써 보는 법)

> ※ 이 프로젝트는 그래픽카드가 필요해 직접 실행하지 않았으며, 필요 사양은 공식 자료를 바탕으로 정리한 것입니다.

> **한 줄 요약** — 글로 설명하면 그림 속 글자까지 또렷하게 그리는 무료 공개 그림 AI입니다. 그래픽카드 메모리를 3.65GiB만 쓰는 공식 측정 기록이 있지만, RAM 14GiB와 저장 공간 약 25GB가 함께 필요합니다.
> 🔍 사양 체크 · 무료 공개 · 실행 코드 Apache-2.0 (모델 파일 라이선스는 모델 카드 확인 필요)

> **이걸로 할 수 있는 것**
> 1. "냉장고 메모지에 '우유 사 오기'"처럼 **글자가 들어간 그림**을 글 설명만으로 만든다
> 2. 포스터·안내문 초안처럼 **글자와 물건의 자리(배치)를 정해** 그림을 만든다
> 3. 애니메이션풍·실사풍 그림을 **긴 설명**으로 자세히 지시한다

[이미지: thumbnail.jpg | 대체 텍스트: MOSS-Image 사양 체크 썸네일, 내 PC로 돌아갈까 문구와 GPU 메모리 3.65GiB~·RAM 14GiB·모델 파일 약 25GB 카드 3장을 그린 직접 만든 사양 카드]

## 목차
1. MOSS-Image란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 필요 사양
4. 메모리 모드와 가벼운 버전
5. 설치 없이 써 보는 법
6. 내 PC 사양 확인법
7. 자주 묻는 질문

## 1. MOSS-Image란 무엇입니까?
MOSS-Image(모스 이미지)는 OpenMOSS 팀이 2026년 10월 16일에 공개한 그림 생성 AI입니다. 글로 설명하면 그림을 만들어 주는데, 특히 **그림 속 글자**를 또렷하게 쓰고, 글자와 물건이 놓일 **자리(배치)**를 정할 수 있는 점을 내세웁니다. 모델은 기본 모델(Base)과, 골라 낸 자료로 더 다듬은 모델(SFT) 두 가지입니다.

그림 AI로 포스터나 안내문을 만들면 글자가 뭉개지는 일이 많습니다. MOSS-Image는 이 부분을 강점으로 소개하는 모델이라, "내 PC로도 돌아갈까?"를 공식 자료로 정리했습니다.

## 2. 비유로 쉽게 이해하기
그래픽카드 메모리(VRAM, 그래픽카드에 붙은 전용 메모리)는 **작업대**입니다.

- **넓은 작업대**: 재료(글 이해 모델·그림 모델·그림 변환기)를 다 올려놓고 한 번에 그립니다
- **좁은 작업대**: 재료를 선반(RAM·SSD)에 두고 지금 쓰는 것만 올려 씁니다. 대신 시간이 더 걸리고 선반(RAM)이 넉넉해야 합니다

## 3. 필요 사양
아래 숫자는 모두 공식 GitHub 문서에서 옮긴 값입니다.

[이미지: moss-spec-anim.gif | 대체 텍스트: MOSS-Image 사양 카드 애니메이션: '내 PC로 돌아갈까?' 제목 아래 GPU 메모리 3.65GiB, RAM 14GiB, 모델 파일 약 25GB 막대가 차례로 채워지고 M1 Max 320.4초 카드가 나타나는 화면]

> **읽는 법** — GiB와 GB는 둘 다 용량 단위입니다(1GiB ≈ 1.07GB). '할당'은 실제로 쓴 양, '예약'은 미리 잡아 둔 양입니다. '단계'는 그림을 다듬는 횟수로, 많을수록 오래 걸립니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">항목</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">내용</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">출처</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">최소 VRAM</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">공식 최소 표기 없음 · 최소 모드 측정 <b>3.65GiB 할당 / 3.85GiB 예약</b> (1024×1024 한 장, 50단계)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[README](https://github.com/OpenMOSS/MOSS-Image#memory-and-performance)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">권장 VRAM</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">공식 권장 표기 없음 · 자동 설정은 <b>12GiB 미만이면 최소 모드</b></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[README](https://github.com/OpenMOSS/MOSS-Image#memory-and-performance)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">시스템 메모리(RAM)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">같은 측정에서 <b>14.00GiB</b></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[README](https://github.com/OpenMOSS/MOSS-Image#memory-and-performance)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">저장 공간</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">모델 묶음 <b>약 25GB</b> (글 이해 약 17GB + 그림 약 10GB) · 여유 약 40GB</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[Mac 문서](https://github.com/OpenMOSS/MOSS-Image/blob/master/docs/macos.md)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">운영체제</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">리눅스 + NVIDIA 안내 · Apple 칩 Mac 실험 단계 · <b>Windows 공식 설치 안내 없음</b>(ComfyUI 지원)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[README](https://github.com/OpenMOSS/MOSS-Image#quick-start)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">생성 시간</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">Apple M1 Max(32GB): 1024×1024·20단계 <b>320.4초</b> · NVIDIA: <b>공개된 측정값 없음</b></td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[Mac 문서](https://github.com/OpenMOSS/MOSS-Image/blob/master/docs/macos.md)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">파이썬</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">3.10 이상 (torch 2.9 이상)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">[pyproject.toml](https://github.com/OpenMOSS/MOSS-Image/blob/master/pyproject.toml)</td></tr>
</tbody>
</table>

- 공식 권장 설정은 **50단계 이상**이라([사용 안내](https://github.com/OpenMOSS/MOSS-Image/blob/master/USERGUIDE.md)), 위 Mac 기록(20단계)보다 더 오래 걸릴 수 있습니다
- 3.65GiB 기록은 가장 아끼는 최소 모드 기준이며, 그만큼 RAM과 SSD를 많이 씁니다

## 4. 메모리 모드와 가벼운 버전
공식 Gradio 화면(Advanced settings → Memory mode)에서 네 가지 모드를 고릅니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">모드</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">하는 일</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">GPU 상주</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">모델 전체를 그래픽카드에 둠</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">부분 이동</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">필요한 부분만 CPU ↔ GPU로 옮김</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">순차</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">메모리를 더 아끼는 대신 느림</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">저메모리</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">그림 모델은 RAM에, 나머지는 SSD에서 필요할 때 읽음 (<code>--profile minimal</code>)</td></tr>
</tbody>
</table>

커뮤니티에서도 가벼운 버전을 공개했습니다(공식 아님, 각 페이지 확인 필요): 8단계로 줄인 증류 모델(lodestones), FP16 호환 모델(KBlueLeaf), 파이썬 없이 도는 C++ 실행기(mossimage.cpp). **그래픽카드 없이 CPU만으로 생성하는 방법은 공식 안내가 없습니다.**

## 5. 설치 없이 써 보는 법
- **Hugging Face Space 공식 데모**: https://huggingface.co/spaces/OpenMOSS-Team/MOSS-Image
- **MOSI API 플랫폼 Playground (공식)**: https://platform.mosi.cn/
- 이용 조건·대기열·요금은 각 공식 페이지에서 확인하시기 바랍니다

## 6. 내 PC 사양 확인법
```cmd
:: 1. 작업 관리자 열기: Ctrl + Shift + Esc → 성능 탭
::    GPU → '전용 GPU 메모리' = VRAM / 메모리 = RAM
:: 2. NVIDIA 그래픽카드라면 명령 프롬프트에서 전체 VRAM 확인
nvidia-smi
:: 3. 남은 저장 공간: 파일 탐색기 → 내 PC (모델 파일은 SSD에 두라는 공식 안내)
```

## 7. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 실행 코드는 Apache-2.0 무료입니다. 모델 파일 라이선스는 GitHub 설명에 없어서 Hugging Face 모델 카드에서 직접 확인해야 합니다.

**Q. 그래픽카드 메모리 4GB 카드로 됩니까?**
**A.** 공식 측정(최소 모드)은 3.65GiB였지만, 공식 문서가 "최소 사양"으로 보장한 값은 아닙니다. RAM 14GiB와 SSD 여유도 필요하고 속도는 공개된 측정값이 없습니다.

**Q. Windows에서 쓸 수 있습니까?**
**A.** Windows용 공식 설치 안내는 없습니다. 공식 README는 ComfyUI 기본 지원과 ComfyUI용 모델 파일을 안내합니다.

## 마무리
MOSS-Image는 그림 속 글자를 강점으로 내세운 무료 공개 그림 AI입니다. 공식 기록상 그래픽카드 메모리 3.65GiB로도 한 장을 만들었지만, RAM 14GiB·저장 공간 약 25GB가 함께 필요하고 Windows 공식 안내는 없습니다. 사양이 애매하면 공식 웹 데모로 결과부터 확인하시기 바랍니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- ※ 이 프로젝트는 그래픽카드가 필요해 직접 실행하지 않았으며, 필요 사양은 공식 자료를 바탕으로 정리한 것입니다. 필요 사양·시간은 **2026-11-21에 공식 자료를 기준으로 정리**한 것이며, 운영자가 검증한 값이 아닙니다. 모델 버전·설정·그림 크기·내 PC 환경에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 MOSS-Image 제작자(OpenMOSS)와 관련이 없고, 광고·제휴가 아닙니다. 프로그램과 모델은 제작자의 라이선스를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- AI가 만든 그림에는 틀린 글자·사실과 다른 내용이 있을 수 있습니다. 모델 파일 라이선스와 이용 조건을 확인한 뒤 쓰시고, 다른 사람의 저작물·초상을 흉내 내는 데 쓰지 마시기 바랍니다.

---
**태그**: MOSS-Image, 모스이미지, 그림AI, 이미지생성AI, AI사양, 그래픽카드메모리, VRAM, 내PC사양, 무료AI, 깃허브추천
