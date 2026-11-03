@echo off
chcp 65001 >nul
rem 정리할 폴더(예: 다운로드 폴더)를 이 아이콘 위로 끌어다 놓으면, 같은 곳에 있는 config.yaml 규칙대로 정리합니다
rem 준비: 파이썬 설치(Add python.exe to PATH 체크) 후 cmd에서  pip install organize-tool
rem 이 파일과 config.yaml 은 같은 폴더에 두어야 합니다
if "%~1"=="" (
  echo 정리할 폴더를 이 아이콘 위로 끌어다 놓으시기 바랍니다.
  pause
  exit /b
)
if not exist "%~dp0config.yaml" (
  echo 이 파일 옆에 config.yaml 이 없습니다. 같은 폴더에 두시기 바랍니다.
  pause
  exit /b
)
echo [1단계] 미리보기입니다. 파일은 아직 움직이지 않습니다.
organize sim "%~dp0config.yaml" -W "%~1"
echo.
set "OK="
set /p "OK=위 내용대로 실제로 옮기려면 y 를 누르고 Enter (그 밖의 글자는 취소): "
if /i not "%OK%"=="y" (
  echo 취소했습니다. 파일은 그대로입니다.
  pause
  exit /b
)
echo [2단계] 실제로 정리합니다.
organize run "%~dp0config.yaml" -W "%~1"
echo.
echo 끝났습니다. 폴더를 열어 결과를 확인하시기 바랍니다.
pause
