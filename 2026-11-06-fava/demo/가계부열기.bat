@echo off
chcp 65001 >nul
rem 가계부 장부 파일(.beancount)을 이 아이콘 위로 끌어다 놓으면, 장부를 검사한 뒤 fava 화면을 브라우저로 엽니다
rem 준비: 파이썬 설치(Add python.exe to PATH 체크), cmd에서  pip install fava
rem 장부 파일은 고치지 않습니다. 끝내려면 이 검은 창을 닫으시기 바랍니다
if "%~1"=="" goto :usage
if /i not "%~x1"==".beancount" goto :usage
echo 장부: %~f1
echo 장부에 틀린 곳이 있는지 검사합니다...
bean-check "%~f1"
if errorlevel 1 (
  echo.
  echo 위에 나온 줄 번호를 메모장에서 확인하시기 바랍니다. 화면은 그대로 열어 둡니다.
)
echo.
echo fava 화면을 켭니다. 잠시 뒤 브라우저가 열립니다.
start "" http://127.0.0.1:5000
fava "%~f1"
pause
exit /b
:usage
echo 장부 파일(.beancount) 1개를 이 아이콘 위로 끌어다 놓으시기 바랍니다.
pause
