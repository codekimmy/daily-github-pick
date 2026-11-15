@echo off
chcp 65001 > nul
rem SVG만들기.bat — 그림 파일(PNG·JPG)을 이 실행 파일 위에 마우스로 끌어다 놓으면, VTracer가 그림을
rem 확대해도 깨지지 않는 SVG 파일로 바꿔 그림 옆에 "이름.svg"로 저장합니다. 원본 그림은 바뀌지 않습니다
rem 먼저 README의 Windows 설치(파이썬 + pip install vtracer==1.0.0a4)를 끝내 두어야 합니다 (Windows 실행 확인 전)
if "%~1"=="" (
  echo 그림 파일을 이 실행 파일 위에 마우스로 끌어다 놓으시기 바랍니다.
  pause
  exit /b
)
echo 어떤 그림입니까?
echo   1. 로고·아이콘 (색 6가지로 정리)
echo   2. 서명·손글씨·선 그림 (흑백, 그림자 있는 사진도 가능)
echo   3. 도트 그림 (네모 칸 모양 그대로)
echo   4. 사진 (포스터 느낌)
choice /c 1234 /n /m "번호를 누르시기 바랍니다: "
set "OPT=max_colors=6, simplify=1.5"
if errorlevel 2 set "OPT=clustering='bw', adaptive=True"
if errorlevel 3 set "OPT=mode='pixel', filter_speckle=0"
if errorlevel 4 set "OPT=max_colors=16"
:loop
if "%~1"=="" goto done
echo [%~nx1] SVG로 바꾸는 중입니다...
python -c "import sys, vtracer; vtracer.Config(%OPT%).convert_file(sys.argv[1], sys.argv[2])" "%~1" "%~dpn1.svg"
shift
goto loop
:done
echo.
echo 끝났습니다. 그림이 있던 폴더의 ".svg" 파일을 엣지(Edge)로 열어 확대해 보시기 바랍니다.
pause
