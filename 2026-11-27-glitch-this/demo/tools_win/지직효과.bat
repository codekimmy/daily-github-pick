@echo off
chcp 65001 >nul
setlocal
set PYTHONUTF8=1
rem ==================================================================
rem  지직효과.bat — 이 파일 위에 그림 파일(.png·.jpg)을 끌어다 놓으면 glitch-this 로 지직거리는 효과를 넣습니다
rem   · 1번 선택: 같은 폴더에 "이름_지직.png"(또는 .jpg) 한 장 (세기 5 + 색 어긋남)
rem   · 2번 선택: 같은 폴더에 "이름_지직.gif" 움직이는 그림 23장 (세기 5 + 색 어긋남)
rem  원본은 바꾸지 않습니다. 결과 파일이 이미 있으면 덮어쓸지 먼저 묻습니다
rem  필요한 프로그램: 파이썬(winget install Python.Python.3.13) + glitch-this(py -m pip install glitch-this)
rem  안 glitch-this 명령은 2026-11-27 리눅스 클라우드에서 같은 방식으로 확인, 이 .bat 자체는 Windows 실행 확인 전
rem ==================================================================
where py >nul 2>nul
if errorlevel 1 (
  echo [안내] 파이썬^(py^)을 찾지 못했습니다.
  echo  1. 명령 프롬프트에 winget install Python.Python.3.13 을 입력해 설치합니다
  echo  2. 명령 창을 새로 열고 py -m pip install glitch-this 를 입력합니다
  pause
  exit /b 1
)
py -c "import glitch_this" >nul 2>nul
if errorlevel 1 (
  echo [안내] glitch-this 가 없습니다. 명령 프롬프트에 py -m pip install glitch-this 를 입력해 설치합니다.
  pause
  exit /b 1
)
if "%~1"=="" (
  echo [안내] 이 파일 위에 .png · .jpg 그림 파일을 끌어다 놓으시기 바랍니다.
  pause
  exit /b 1
)
choice /c 12 /m "1 = 그림 한 장, 2 = 움직이는 GIF"
if errorlevel 2 (set "G=-g" & set "OX=gif") else (set "G=" & set "OX=")
set "RUN=import sys; from glitch_this.commandline import main; sys.argv=['glitch_this']+sys.argv[1:]; main()"
:next
if "%~1"=="" goto done
set "IN=%~1"
if defined OX (set "OUT=%~dpn1_지직.gif") else (set "OUT=%~dpn1_지직%~x1")
set "F="
if exist "%OUT%" (
  choice /m "%OUT% 이 이미 있습니다. 덮어쓰겠습니까"
  if errorlevel 2 (echo 건너뜀: %IN% & shift & goto next)
  set "F=-f"
)
rem -o 의 확장자는 glitch-this 가 무시하고 원본(또는 gif) 확장자를 붙임 → 이름 뒤에 .x 를 붙여 넘김
py -c "%RUN%" "%IN%" 5 -c %G% %F% -o "%~dpn1_지직.x"
if errorlevel 1 (echo [실패] %IN% — 위에 나온 오류 문구를 확인하시기 바랍니다.) else (echo [완료] %OUT%)
shift
goto next
:done
echo.
echo 결과 파일은 원본과 같은 폴더에 있습니다.
pause
