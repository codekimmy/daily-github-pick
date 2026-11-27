@echo off
chcp 65001 >nul
setlocal
set PYTHONUTF8=1
rem ==================================================================
rem  비밀쪽지.bat — 이 파일 위에 그림 파일(.png·.jpg)을 끌어다 놓으면 Stegano 로 쪽지를 숨기거나 꺼냅니다
rem   · 1번 선택(숨기기): 쪽지 글을 입력하면 같은 폴더에 "이름_비밀.png" 를 만듭니다 (결과는 항상 PNG)
rem   · 2번 선택(꺼내기): 그림 속에 숨은 쪽지를 화면에 보여 줍니다
rem  원본은 바꾸지 않습니다. 결과 파일이 이미 있으면 덮어쓸지 먼저 묻습니다 (Stegano 명령은 묻지 않고 덮어씀)
rem  필요한 프로그램: 파이썬(winget install Python.Python.3.13) + Stegano(py -m pip install stegano)
rem  안 실행 방식(py -c, 환경 변수로 글 넘기기)은 2026-11-28 리눅스 클라우드에서 같은 방식으로 확인, 이 .bat 자체는 Windows 실행 확인 전
rem ==================================================================
where py >nul 2>nul
if errorlevel 1 (
  echo [안내] 파이썬^(py^)을 찾지 못했습니다.
  echo  1. 명령 프롬프트에 winget install Python.Python.3.13 을 입력해 설치합니다
  echo  2. 명령 창을 새로 열고 py -m pip install stegano 를 입력합니다
  pause
  exit /b 1
)
py -c "import stegano" >nul 2>nul
if errorlevel 1 (
  echo [안내] Stegano 가 없습니다. 명령 프롬프트에 py -m pip install stegano 를 입력해 설치합니다.
  pause
  exit /b 1
)
if "%~1"=="" (
  echo [안내] 이 파일 위에 .png · .jpg 그림 파일을 끌어다 놓으시기 바랍니다.
  pause
  exit /b 1
)
set "IN=%~1"
choice /c 12 /m "1 = 쪽지 숨기기, 2 = 쪽지 꺼내기"
if errorlevel 2 goto reveal
set "OUT=%~dpn1_비밀.png"
if exist "%OUT%" (
  choice /m "%OUT% 이 이미 있습니다. 덮어쓰겠습니까"
  if errorlevel 2 goto done
)
set "MSG="
set /p "MSG=숨길 쪽지 글을 입력하고 Enter: "
if not defined MSG (echo [안내] 쪽지 글이 비어 있습니다. & goto done)
rem 쪽지 글은 환경 변수로 넘깁니다 (따옴표·& 같은 기호가 있어도 명령이 깨지지 않게)
py -c "import os; from stegano import lsb; lsb.hide(os.environ['IN'], os.environ['MSG']).save(os.environ['OUT'])"
if errorlevel 1 (echo [실패] 위에 나온 오류 문구를 확인하시기 바랍니다.) else (echo [완료] %OUT%
  echo  ※ 이 그림을 JPG 로 바꾸거나 크기를 줄이면 쪽지가 사라집니다. 파일 그대로 보내시기 바랍니다.)
goto done
:reveal
echo 숨은 쪽지:
py -c "from stegano.console.lsb import main; main()" reveal -i "%IN%"
echo  ※ "Impossible to detect message." 가 나오면 숨은 쪽지가 없거나 지워진 그림입니다.
:done
echo.
pause
