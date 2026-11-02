@echo off
chcp 65001 >nul
rem 그림 파일(jpg, png, bmp, gif)을 이 아이콘 위로 끌어다 놓으면, 같은 폴더에 "그림이름_qr.png"(GIF면 .gif) QR코드가 생겨요
rem 준비: 파이썬 설치(Add python.exe to PATH 체크) 후 cmd에서  pip install amzqr
if "%~1"=="" (
  echo 그림 파일을 이 아이콘 위로 끌어다 놓으세요.
  pause
  exit /b
)
set "URL="
set /p "URL=QR에 넣을 주소(영문·숫자·기호만, 한글 안 됨)를 붙여넣고 Enter: "
if "%URL%"=="" (
  echo 주소가 비어 있어요.
  pause
  exit /b
)
set "EXT=png"
if /i "%~x1"==".gif" set "EXT=gif"
echo [만드는 중] %~nx1
amzqr "%URL%" -p "%~1" -c -d "%~dp1." -n "%~n1_qr.%EXT%"
echo.
echo 끝났어요. 원래 그림 옆에 %~n1_qr.%EXT% 가 생겼어요. 인쇄 전에 휴대폰 여러 대로 꼭 찍어 보세요.
pause
