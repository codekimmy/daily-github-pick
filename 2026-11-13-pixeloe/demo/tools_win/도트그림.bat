@echo off
chcp 65001 > nul
set PYTHONUTF8=1
rem 도트그림.bat — 사진 파일을 이 실행 파일 위에 끌어다 놓으면, PixelOE로 도트 그림(픽셀 아트)을 만들어 사진 옆에 저장합니다
rem 먼저 파이썬을 설치하고 명령 프롬프트에서 pip install pixeloe 를 실행해 두어야 합니다 (Windows 실행 확인 전)
rem 원본 사진은 건드리지 않고, 같은 폴더에 "이름_도트64.png"처럼 새 파일을 만듭니다
if "%~1"=="" (
  echo 사진 파일을 이 실행 파일 위에 마우스로 끌어다 놓으시기 바랍니다.
  pause
  exit /b
)
echo 도트 크기를 고르시기 바랍니다: 1 큼직한 점(가로 약 80점)  2 보통(가로 약 150점)  3 자세히(가로 약 300점)
set /p N=번호: 
set "S=128"
if "%N%"=="1" set "S=64"
if "%N%"=="3" set "S=256"
for %%F in (%*) do (
  echo 바꾸는 중: %%~nxF
  pixeloe.pixelize "%%~fF" -O "%%~dpnF_도트%S%.png" -S %S% -P 6 -T 1
)
echo.
echo 끝났습니다. 사진이 있던 폴더에서 "_도트%S%.png" 파일을 확인하시기 바랍니다.
pause
