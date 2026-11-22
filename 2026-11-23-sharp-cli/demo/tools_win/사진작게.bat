@echo off
chcp 65001 >nul
setlocal
rem ==================================================================
rem  사진작게.bat — 사진 파일을 이 파일 위에 끌어다 놓으면
rem  원본 옆 "작게만든사진" 폴더에 작게 줄인 사진이 생깁니다 (원본은 그대로)
rem  필요한 프로그램: Node.js + sharp-cli (npm install -g sharp-cli)
rem  안 명령은 2026-11-23 리눅스 클라우드에서 같은 옵션으로 확인, 이 .bat 자체는 Windows 실행 확인 전
rem ==================================================================
rem ----- 설정 (메모장으로 열어 숫자를 고칩니다) -----
rem  SIZE   : 긴 변의 최대 길이(픽셀). 1600 = 블로그·카톡용, 1080 = 인스타그램용
rem  QUALITY: 화질 1~100 (80 = 기본, 숫자가 작을수록 용량이 작고 화질이 떨어짐)
rem  FORMAT : jpg 또는 webp (webp가 더 작지만 일부 프로그램은 열지 못함)
set SIZE=1600
set QUALITY=80
set FORMAT=jpg

where sharp >nul 2>nul
if errorlevel 1 (
  echo [안내] sharp 명령을 찾지 못했습니다.
  echo  1. https://nodejs.org 에서 Node.js LTS 버전을 설치합니다
  echo  2. 명령 프롬프트를 새로 열고 npm install -g sharp-cli 를 입력합니다
  echo  3. 이 파일에 사진을 다시 끌어다 놓습니다
  pause
  exit /b 1
)
if "%~1"=="" (
  echo [안내] 사진 파일을 이 .bat 파일 위에 마우스로 끌어다 놓으시기 바랍니다.
  pause
  exit /b 1
)

:loop
if "%~1"=="" goto done
echo 처리 중: %~nx1
pushd "%~dp1"
call sharp -i "%~nx1" -o "작게만든사진/{name}.%FORMAT%" -q %QUALITY% --autoOrient resize %SIZE% %SIZE% --fit inside --withoutEnlargement >nul
if errorlevel 1 echo  [실패] %~nx1 — HEIC 사진이거나 파일 이름에 대괄호 [ ] 가 있으면 실패합니다
popd
shift
goto loop

:done
echo.
echo 끝났습니다. 원본 사진이 있던 폴더의 "작게만든사진" 폴더를 확인하시기 바랍니다.
pause
