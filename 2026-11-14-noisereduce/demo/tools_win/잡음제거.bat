@echo off
chcp 65001 > nul
set PYTHONUTF8=1
rem 잡음제거.bat — 녹음 파일(wav·mp3·flac)을 이 실행 파일 위에 끌어다 놓으면, noisereduce로 바탕 잡음을 줄여 녹음 옆에 "이름_잡음제거.wav"를 만듭니다
rem 먼저 파이썬을 설치하고 명령 프롬프트에서 pip install noisereduce soundfile 을 실행해 두어야 합니다 (Windows 실행 확인 전)
rem 같은 폴더에 잡음제거.py 가 있어야 합니다. 원본 녹음은 바뀌지 않습니다
if "%~1"=="" (
  echo 녹음 파일을 이 실행 파일 위에 마우스로 끌어다 놓으시기 바랍니다.
  pause
  exit /b
)
echo 녹음 맨 앞에 말하지 않은 조용한 구간이 있습니까? 있으면 그 길이(초)를 입력하시기 바랍니다. 없으면 그냥 Enter
set "SEC="
set /p SEC=초: 
if "%SEC%"=="" (
  python "%~dp0잡음제거.py" %*
) else (
  python "%~dp0잡음제거.py" %* --견본 %SEC%
)
echo.
echo 끝났습니다. 녹음이 있던 폴더에서 "_잡음제거.wav" 파일을 확인하시기 바랍니다.
pause
