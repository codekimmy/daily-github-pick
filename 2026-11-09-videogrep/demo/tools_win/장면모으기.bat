@echo off
chcp 65001 >nul
rem 이 파일을 영상과 자막(.srt)이 들어 있는 폴더에 넣고 두 번 누릅니다
rem 영상 이름과 찾을 낱말을 물어본 뒤, 그 낱말이 나온 장면만 이어 붙여 "모음_낱말.mp4"로 저장합니다
rem 원본 영상은 바꾸지 않습니다. 리눅스 작업 공간에서 만든 예제이며 Windows에서는 실행 확인을 거치지 않았습니다
set /p VIDEO=영상 파일 이름 (예: 강의.mp4):
set /p WORD=찾을 낱말 (예: 시험):
echo.
echo [1/2] 찾은 장면 목록
videogrep -i "%VIDEO%" -s "%WORD%" --demo
echo.
echo [2/2] 장면을 이어 붙이는 중...
videogrep -i "%VIDEO%" -s "%WORD%" -o "모음_%WORD%.mp4"
echo.
echo 끝났습니다. "모음_%WORD%.mp4" 파일을 확인하시기 바랍니다
pause
