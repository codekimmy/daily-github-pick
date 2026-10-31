@echo off
chcp 65001 >nul
rem ============================================================
rem  사진 파일을 이 파일 위로 끌어다 놓으면 배경을 지워 줘요.
rem  결과: 원래이름_nobg.png (투명 배경), 원래이름_white.png (흰 배경)
rem  준비: pip install "rembg[cpu,cli]"  (처음 한 번만)
rem ============================================================
if "%~1"=="" (
  echo 사진 파일을 이 아이콘 위로 끌어다 놓으세요.
  pause
  exit /b
)
:loop
if "%~1"=="" goto done
echo [처리 중] %~nx1
rembg i -m u2net "%~1" "%~dpn1_nobg.png"
rembg i -m u2net -bgc 255 255 255 255 "%~1" "%~dpn1_white.png"
shift
goto loop
:done
echo 끝났어요! 원래 사진이 있던 폴더를 확인하세요.
pause
