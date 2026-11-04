@echo off
chcp 65001 >nul
rem 영상 파일과 자막(.srt) 파일을 함께 골라 이 아이콘 위로 끌어다 놓으면, 영상 소리에 맞춘 새 자막을 만듭니다
rem 준비: 파이썬 설치(Add python.exe to PATH 체크), cmd에서  winget install Gyan.FFmpeg  와  pip install ffsubsync
rem 원래 자막은 그대로 두고, 같은 폴더에 "자막이름_맞춤.srt"를 새로 만듭니다
set "VID=" & set "SUB="
for %%F in (%1 %2) do (
  if /i "%%~xF"==".srt" (set "SUB=%%~fF") else (set "VID=%%~fF")
)
if "%VID%"=="" goto :usage
if "%SUB%"=="" goto :usage
for %%S in ("%SUB%") do set "OUT=%%~dpnS_맞춤.srt"
echo 영상: %VID%
echo 자막: %SUB%
echo 소리를 듣고 자막을 맞추는 중입니다...
ffsubsync "%VID%" -i "%SUB%" -o "%OUT%"
if errorlevel 1 (
  echo.
  echo 맞추지 못했습니다. 영상에 말소리가 있는지, ffmpeg가 설치됐는지 확인하시기 바랍니다.
  pause
  exit /b
)
echo.
echo 끝났습니다: %OUT%
echo 영상을 재생해 자막이 맞는지 직접 확인하시기 바랍니다.
pause
exit /b
:usage
echo 영상 파일 1개와 자막(.srt) 파일 1개를 함께 골라 이 아이콘 위로 끌어다 놓으시기 바랍니다.
pause
