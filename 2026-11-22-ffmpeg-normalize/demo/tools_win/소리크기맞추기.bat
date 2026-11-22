@echo off
chcp 65001 > nul
set PYTHONUTF8=1
rem 소리크기맞추기.bat — 녹음·음악·영상 파일을 이 실행 파일 위에 마우스로 끌어다 놓으면,
rem ffmpeg-normalize가 소리 크기를 -23 LUFS(방송 기준)로 맞춰 원본 옆 "소리맞춤" 폴더에 저장합니다.
rem 소리 파일(wav·mp3·m4a·flac 등) → mp3 / 영상 파일(mp4·mov·mkv) → mp4(그림은 그대로, 소리만 바꿈)
rem 먼저 파이썬·ffmpeg 설치와 pip install ffmpeg-normalize 가 끝나 있어야 합니다. 원본 파일은 바뀌지 않습니다.
rem 목표 크기를 바꾸려면 아래 TARGET 값을 고칩니다 (예: 유튜브용 -14). (Windows 실행 확인 전)
set TARGET=-23

if "%~1"=="" (
  echo 소리·영상 파일을 이 실행 파일 위에 마우스로 끌어다 놓으시기 바랍니다.
  echo 여러 파일을 한꺼번에 끌어다 놓아도 됩니다.
  pause
  exit /b
)
where ffmpeg > nul 2> nul
if errorlevel 1 (
  echo ffmpeg를 찾을 수 없습니다. 명령 프롬프트에서 winget install Gyan.FFmpeg 로 설치한 뒤
  echo 명령 프롬프트 창을 모두 닫고 다시 실행하시기 바랍니다.
  pause
  exit /b
)
python -m ffmpeg_normalize --version > nul 2> nul
if errorlevel 1 (
  echo ffmpeg-normalize를 찾을 수 없습니다. 명령 프롬프트에서 pip install ffmpeg-normalize 를 먼저 실행하시기 바랍니다.
  pause
  exit /b
)
for %%F in (%*) do call :one "%%~fF"
echo.
echo 끝났습니다. 원본 파일이 있던 폴더의 "소리맞춤" 폴더를 확인하시기 바랍니다.
pause
exit /b

:one
set "EXT=%~x1"
echo.
echo 처리 중: %~nx1
if /i "%EXT%"==".mp4" goto video
if /i "%EXT%"==".mov" goto video
if /i "%EXT%"==".mkv" goto video
python -m ffmpeg_normalize "%~f1" -t %TARGET% -c:a libmp3lame -b:a 192k -ar 48000 -ext mp3 -of "%~dp1소리맞춤" -f
exit /b
:video
python -m ffmpeg_normalize "%~f1" -t %TARGET% -c:a aac -b:a 192k -ar 48000 -ext mp4 -of "%~dp1소리맞춤" -f
exit /b
