@echo off
chcp 65001 >nul
setlocal
rem ==================================================================
rem  한줄일기.bat — 이 파일을 마우스로 두 번 누르면 오늘 일기 한 줄을 묻고
rem  jrnl 일기장에 저장한 뒤, 최근 일기 5개를 화면에 보여 줍니다
rem  필요한 프로그램: 파이썬 3.11~3.14 + jrnl (py -m pip install jrnl)
rem  처음 한 번은 jrnl이 질문 3개(일기 파일 위치·암호·색)를 묻습니다 → 모르면 Enter 세 번
rem  태그는 @점심 처럼 @를 붙여 씁니다. 따옴표·&·% 같은 기호도 그대로 저장됩니다
rem  안 파이썬 명령은 2026-11-25 리눅스 클라우드에서 같은 방식(환경 변수로 전달)으로 확인, 이 .bat 자체는 Windows 실행 확인 전
rem ==================================================================
where py >nul 2>nul
if errorlevel 1 (
  echo [안내] 파이썬^(py 명령^)을 찾지 못했습니다.
  echo  1. https://www.python.org 에서 파이썬 3.13을 설치합니다 ^(설치 첫 화면 "Add python.exe to PATH" 체크^)
  echo  2. 이 파일을 다시 두 번 누릅니다
  pause
  exit /b 1
)
py -c "import jrnl" >nul 2>nul
if errorlevel 1 (
  echo [안내] jrnl이 설치되어 있지 않습니다.
  echo  명령 프롬프트를 열고 py -m pip install jrnl 을 입력한 뒤 이 파일을 다시 두 번 누릅니다
  pause
  exit /b 1
)
set "JR_LINE="
set /p JR_LINE=오늘 일기 한 줄을 입력하고 Enter ^(태그는 @점심 처럼^): 
if not defined JR_LINE (
  echo [안내] 입력한 글이 없습니다. 다시 실행하시기 바랍니다.
  pause
  exit /b 1
)
py -c "import os, sys; from jrnl.main import run; sys.exit(run([os.environ['JR_LINE']]))"
if errorlevel 1 (
  echo [실패] 일기를 저장하지 못했습니다. 위에 나온 오류 문구를 확인하시기 바랍니다.
  pause
  exit /b 1
)
echo.
echo ===== 최근 일기 5개 =====
py -m jrnl -n 5 --short
echo.
echo 일기 파일 위치는 py -m jrnl --list 로 확인합니다. 중요한 일기는 따로 백업하시기 바랍니다.
pause
