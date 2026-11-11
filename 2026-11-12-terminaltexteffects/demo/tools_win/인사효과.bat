@echo off
chcp 65001 > nul
set PYTHONUTF8=1
rem 인사효과.bat — 인사 글 두 줄과 효과를 물어본 뒤, terminaltexteffects(tte)로 글자 효과를 보여 줍니다
rem 먼저 파이썬을 설치하고 명령 프롬프트에서 pip install terminaltexteffects 를 실행해 두어야 합니다 (Windows 실행 확인 전)
rem 화면을 영상으로 남기려면 Windows 11 캡처 도구의 녹화 기능으로 이 창을 녹화하시기 바랍니다
set /p L1=첫째 줄 글을 입력하시기 바랍니다 (예: 생일 축하합니다!): 
set /p L2=둘째 줄 글을 입력하시기 바랍니다 (예: 오늘도 좋은 하루 되세요): 
set "MSG=%TEMP%\tte_인사.txt"
> "%MSG%" echo %L1%
>> "%MSG%" echo %L2%
echo.
echo 효과를 고르시기 바랍니다: 1 불꽃놀이  2 암호 해독  3 불타기  4 무작위
set /p N=번호: 
set "FX=fireworks"
if "%N%"=="2" set "FX=decrypt"
if "%N%"=="3" set "FX=burn"
cls
if "%N%"=="4" (
  tte -i "%MSG%" --canvas-width 40 --canvas-height 10 --anchor-text c -R
) else (
  tte -i "%MSG%" --canvas-width 40 --canvas-height 10 --anchor-text c %FX%
)
echo.
pause
