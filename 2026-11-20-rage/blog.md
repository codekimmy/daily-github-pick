<!-- 티스토리: 마크다운 모드로 붙여넣기. 이미지는 media/ 폴더 파일 업로드 -->
<!-- 표: 마크다운으로 쓴 뒤 커밋 전에 python3 tools/blog_tables.py 날짜폴더/blog.md → 테두리 있는 HTML 표로 바뀜 (GUIDE 4장) -->
<!-- 🖼️ 이미지 대체 텍스트 (티스토리에서 이미지 클릭 → '대체 텍스트' 칸에 붙여넣기, GUIDE 5-2장)
thumbnail.jpg → rage로 잠근 가상 비밀 일기가 뒤섞인 글자로 바뀐 화면과 금색 자물쇠 위에 '파일에 자물쇠, 비밀번호 3줄 → 0줄' 글자를 얹은 썸네일
rage-anim.gif → rage 과정 애니메이션: 가상 비밀 일기가 자물쇠와 함께 뒤섞인 글자로 바뀌고 '비밀번호' 3줄 → 0줄 → 자물쇠는 나눠 주고 열쇠는 나만 → 다른 열쇠·1바이트 바꾼 파일 실패, 내 열쇠 0.002초 → 1GB 1.59초 순 화면
terminal.gif → 명령 창에서 rage 0.12.1 확인 → 열쇠 파일 만들기 → 자물쇠 파일 꺼내기 → 가상 비밀 일기 잠그기 → '비밀번호' 원본 3줄·잠근 파일 0줄 → 다른 열쇠 오류 → 내 열쇠로 원래 글 순 터미널 화면
-->
# rage란? 파일을 자물쇠로 잠그는 무료 암호화 프로그램 사용법 총정리 (설치법 포함)

> **한 줄 요약** — 파일을 열쇠 없이는 아무도 못 읽는 뒤섞인 글자로 바꾸고, 열쇠가 있으면 원래대로 돌려주는 무료 암호화 프로그램입니다.
> ⭐ 별 약 3,700 (2026-10-30 조사값) · 무료 오픈소스 · MIT 또는 Apache-2.0 라이선스

> **일반인 쓸모 ★★★☆☆ (3)** — 명령 몇 줄로 파일을 잠그고 열 수 있고 1GB도 2초 안에 잠갔지만, 화면 프로그램이 없고 열쇠 파일을 직접 챙겨야 합니다. 꼭 숨길 파일이 있을 때 가끔 쓰는 도구라 별 세 개입니다.
> **이걸로 할 수 있는 것**
> 1. 여권·통장 사본, 비밀 일기를 **잠가서 클라우드·USB에 보관**한다
> 2. 가족 모두의 자물쇠로 잠가 **여러 사람이 함께 여는 파일**을 만든다
> 3. 메일로 보내는 파일을 **암호 문장으로 잠가 보내고**, 암호는 전화처럼 다른 길로 알려 준다

[이미지: thumbnail.jpg | 대체 텍스트: rage로 잠근 가상 비밀 일기가 뒤섞인 글자로 바뀐 화면과 금색 자물쇠 위에 '파일에 자물쇠, 비밀번호 3줄 → 0줄' 글자를 얹은 썸네일]

## 목차
1. rage란 무엇입니까?
2. 비유로 쉽게 이해하기
3. 실제 화면으로 보기
4. 설치 방법 (Windows)
5. 어디에 쓰면 좋을까
6. 자주 묻는 질문

## 1. rage란 무엇입니까?
rage(레이지)는 파일을 **암호화**(열쇠 없이는 내용을 읽을 수 없게 뒤섞는 일)하는 무료 오픈소스(누구나 무료로 쓰고 고칠 수 있게 공개된 프로그램)입니다. str4d라는 개발자가 러스트(Rust) 언어로 만들었고, 원조 프로그램 age와 같은 'age 형식' 파일을 만듭니다.

여권 사본이나 통장 사본을 클라우드에 올려 두면 "계정이 털리면 어쩌지?" 하는 걱정이 생깁니다. rage로 잠근 파일은 누가 가져가도 열쇠 없이는 뒤섞인 글자로만 보입니다.

## 2. 비유로 쉽게 이해하기
rage는 **자물쇠와 열쇠를 만들어 주는 열쇠 가게**입니다.

- **열쇠 만들기**: rage가 열쇠 1개(`key.txt`)와, 그 열쇠로만 열리는 **열린 자물쇠**(`age1…`로 시작하는 62글자)를 함께 만듭니다
- **자물쇠는 나눠 줘도 됩니다**: 친구·가족 누구나 내 자물쇠로 파일을 잠가 보낼 수 있습니다
- **여는 것은 열쇠 주인만**: 잠긴 파일은 열쇠 파일을 가진 사람만 엽니다
- **번호 자물쇠**: 열쇠 파일 대신 암호 문장으로 잠그는 방법(`-p`)도 있습니다

## 3. 실제 화면으로 보기
클라우드 작업 공간(리눅스, CPU 2개)에서 rage 0.12.1로 자동 실행한 **시연 결과**입니다. 자료는 시연용으로 만든 가상 비밀 일기(852바이트), 가상 가족 사진 6장(CC0 사진), 무작위 데이터 큰 파일입니다.

[이미지: rage-anim.gif | 대체 텍스트: rage 과정 애니메이션: 가상 비밀 일기가 자물쇠와 함께 뒤섞인 글자로 바뀌고 '비밀번호' 3줄 → 0줄 → 자물쇠는 나눠 주고 열쇠는 나만 → 다른 열쇠·1바이트 바꾼 파일 실패, 내 열쇠 0.002초 → 1GB 1.59초 순 화면]

> **읽는 법** — 바이트는 파일 크기 단위입니다(한글 한 글자 = 3바이트, 1MB = 약 100만 바이트). 시간은 명령이 시작해서 끝날 때까지 잰 값입니다.

<table style="border-collapse: collapse; width: 100%; border: 1px solid #bbbbbb;" border="1" data-ke-align="alignLeft">
<thead>
<tr><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">시연</th><th style="border: 1px solid #bbbbbb; padding: 6px 10px; background-color: #f3f3f3; text-align: left;">결과</th></tr>
</thead>
<tbody>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">열쇠 만들기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.002초</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">일기 잠그기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.003초 · 852 → 1,202바이트</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">'비밀번호' 글자 찾기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">원본 3줄 → 잠근 파일 <b>0줄</b></td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">내 열쇠로 열기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">0.002초 · 원본과 똑같음</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">다른 열쇠로 열기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>실패</b> (No matching keys found)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">잠근 파일 1바이트 바꾸기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;"><b>열기 거부</b> (decryption error)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">암호 문장으로 열기</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">약 1.6초 (일부러 느리게 계산)</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">받는 사람 2명(나·엄마)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">둘 다 열림 · 다른 사람은 실패</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">사진 6장 묶음(600KB)</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">잠그기 0.004초 · 복원 6장 모두 같음</td></tr>
<tr><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">1GB 파일</td><td style="border: 1px solid #bbbbbb; padding: 6px 10px;">잠그기 <b>1.59초</b> · 열기 2.15초</td></tr>
</tbody>
</table>

- **같은 일기를 두 번 잠가도** 잠근 결과가 매번 달랐습니다. 잠근 파일만 보고 "같은 내용인지" 알아내기 어렵습니다
- **암호 문장 방식**은 열 때 약 1.6초 걸렸습니다(열쇠 파일 방식 0.002초). 암호를 마구 맞혀 보는 공격을 늦추려고 일부러 느리게 계산하는 방식(scrypt)입니다. 빈칸으로 두면 rage가 낱말 10개짜리 암호 문장을 만들어 줍니다
- **폴더**는 바로 잠그지 못해서, 먼저 `tar`로 하나의 파일로 묶은 뒤 잠갔습니다

[이미지: terminal.gif | 대체 텍스트: 명령 창에서 rage 0.12.1 확인 → 열쇠 파일 만들기 → 자물쇠 파일 꺼내기 → 가상 비밀 일기 잠그기 → '비밀번호' 원본 3줄·잠근 파일 0줄 → 다른 열쇠 오류 → 내 열쇠로 원래 글 순 터미널 화면]

시연에서 아쉬운 점도 있었습니다. 결과 파일 이름(`-o`)에 이미 있는 파일 이름을 쓰자 rage가 **묻지 않고 덮어써서** 원래 내용이 사라졌습니다. 제작자도 아직 `[BETA]`(시험 버전)로 표시하고 있습니다.

## 4. 설치 방법 (Windows)
> 아래 방법은 winget 목록 사이트(`str4d.rage` 항목)와 rage 도움말을 바탕으로 정리한 것이며, 시연에서 Windows로 실행해 보지 않았습니다. 설치 전에 `winget search rage`로 이름을 확인하시기 바랍니다.

```cmd
:: 1. 설치 (명령 프롬프트에 붙여넣기)
winget install --id str4d.rage -e
:: 2. 새 명령 프롬프트를 열고 문서 폴더로 이동
cd %USERPROFILE%\Documents
:: 3. 열쇠 파일 만들기 → 화면의 "Public key: age1..." 이 자물쇠
rage-keygen -o key.txt
:: 4. 자물쇠만 따로 꺼내기 (남에게 줘도 되는 파일)
rage-keygen -y -o lock.txt key.txt
:: 5. 잠그기
rage -R lock.txt -o 일기.txt.age 일기.txt
:: 6. 열기
rage -d -i key.txt -o 일기_열기.txt 일기.txt.age
:: 7. 암호 문장으로 잠그기 / 열기 (암호를 두 번 입력)
rage -p -o 여권사본.pdf.age 여권사본.pdf
rage -d -o 여권사본_열기.pdf 여권사본.pdf.age
```

폴더를 잠그려면 Windows 10 이후에 들어 있는 `tar`로 먼저 묶습니다: `tar -cf 사진.tar 사진폴더` → `rage -R lock.txt -o 사진.tar.age 사진.tar`

## 5. 어디에 쓰면 좋을까
- **클라우드에 개인 서류 보관** → 여권·통장 사본을 잠가 두면 계정이 털려도 내용은 못 읽습니다
- **가족 서류 함께 관리** → 가족 모두의 자물쇠로 잠가 각자 열쇠로 엽니다
- **메일로 서류 보내기** → 암호 문장으로 잠가 보내고, 암호는 전화·문자로 따로 알려 줍니다

## 6. 자주 묻는 질문
**Q. 무료입니까?**
**A.** 무료입니다. 라이선스는 MIT 또는 Apache-2.0으로, 개인·회사 모두 쓸 수 있습니다.

**Q. 열쇠 파일을 잃어버리면 어떻게 됩니까?**
**A.** 되찾을 방법이 없습니다. 열쇠 파일은 USB 등에 따로 백업하고, 잠근 파일과 같은 곳에 두지 마시기 바랍니다.

**Q. 잠근 뒤 원본은 어떻게 됩니까?**
**A.** rage는 원본 파일을 그대로 둡니다. 잠근 파일이 열리는지 먼저 확인한 다음 원본을 직접 지우시기 바랍니다.

**Q. 파일 이름도 숨겨집니까?**
**A.** 아닙니다. 잠근 파일의 이름과 대략적인 크기는 보입니다. 이름이 드러나면 안 되는 파일은 `비밀1.age`처럼 이름을 바꿔 잠그시기 바랍니다.

## 마무리
rage는 "자물쇠는 나눠 주고 열쇠는 내가 갖는" 방식으로 파일을 잠그는 프로그램입니다. 시연에서 잠근 일기에서는 '비밀번호' 글자가 사라졌고, 1바이트만 바꿔도 열리지 않았습니다. 다만 열쇠를 잃으면 되찾을 수 없으므로, 열쇠 파일 백업부터 챙기시기 바랍니다.

## ⚠️ 유의사항
※ 이 글은 오픈소스 프로젝트를 소개하는 정보 제공용이며, 특정 프로그램 사용을 권하거나 결과를 보장하지 않습니다.

- 글에 나온 실행 결과는 **2026-11-20에 클라우드 작업 공간(리눅스)에서 자동으로 실행한 시연 결과**입니다. 운영자가 모든 기능을 직접 검증한 것은 아니며, 버전이나 내 PC 환경(Windows 등)에 따라 다를 수 있습니다.
- 별 수·버전·기능은 작성 시점 기준이며 바뀔 수 있습니다. 설치 전에 공식 저장소를 꼭 확인하시기 바랍니다.
- 이 채널은 rage 제작자와 관련이 없고, 광고·제휴가 아닙니다. 프로그램은 제작자의 라이선스(MIT 또는 Apache-2.0)를 따릅니다.
- 프로그램 설치·사용으로 생기는 문제(파일 손상, 데이터 손실, 보안 문제 등)의 책임은 사용자에게 있습니다. 중요한 파일은 먼저 백업하고, 공식 저장소에서만 받으시기 바랍니다.
- 암호화는 파일의 안전을 완전히 보장하지 않습니다. 열쇠 파일·암호 문장을 잃으면 파일을 되찾을 수 없으므로 원본과 열쇠를 따로 백업하고, 내 파일 보관용으로만 쓰시기 바랍니다.

---
**태그**: rage, age암호화, 파일암호화, 파일잠그기, 무료암호화프로그램, 개인정보보호, 여권사본보관, 무료프로그램, 오픈소스, 깃허브추천
