@echo off
chcp 65001 >nul
setlocal
rem ==================================================================
rem  워드로바꾸기.bat — 이 파일 위에 문서 파일을 끌어다 놓으면 pandoc 이 형식을 바꿉니다
rem   · 메모(.md·.txt)·웹페이지(.html) → 같은 폴더에 "이름_변환.docx" (워드 문서)
rem   · 워드 문서(.docx)            → 같은 폴더에 "이름_변환.md" (마크다운 글, AI 채팅에 붙여넣기용)
rem  원본은 바꾸지 않습니다. 결과 파일이 이미 있으면 덮어쓸지 먼저 묻습니다 (pandoc 자체는 묻지 않고 덮어씀)
rem  필요한 프로그램: pandoc (winget install --id JohnMacFarlane.Pandoc 또는 GitHub 저장소의 .msi)
rem  안 pandoc 명령은 2026-11-27 리눅스 클라우드에서 같은 옵션으로 확인, 이 .bat 자체는 Windows 실행 확인 전
rem ==================================================================
where pandoc >nul 2>nul
if errorlevel 1 (
  echo [안내] pandoc 을 찾지 못했습니다.
  echo  1. 명령 프롬프트에 winget install --id JohnMacFarlane.Pandoc 을 입력해 설치합니다
  echo     ^(또는 github.com/jgm/pandoc 의 Releases 에서 windows-x86_64.msi 를 받아 설치^)
  echo  2. 설치 뒤 이 파일을 다시 사용합니다
  pause
  exit /b 1
)
if "%~1"=="" (
  echo [안내] 이 파일 위에 .md · .txt · .html · .docx 파일을 끌어다 놓으시기 바랍니다.
  pause
  exit /b 1
)
:next
if "%~1"=="" goto done
set "IN=%~1"
set "EXT=%~x1"
if /i "%EXT%"==".docx" (set "OUT=%~dpn1_변환.md" & set "TO=-t gfm") else (set "OUT=%~dpn1_변환.docx" & set "TO=")
if /i "%EXT%"==".txt" set "TO=-f markdown"
if exist "%OUT%" (
  choice /m "%OUT% 이 이미 있습니다. 덮어쓰겠습니까"
  if errorlevel 2 (echo 건너뜀: %IN% & shift & goto next)
)
pandoc "%IN%" %TO% -o "%OUT%"
if errorlevel 1 (echo [실패] %IN% — 위에 나온 오류 문구를 확인하시기 바랍니다.) else (echo [완료] %OUT%)
shift
goto next
:done
echo.
echo 결과 파일은 원본과 같은 폴더에 있습니다.
pause
