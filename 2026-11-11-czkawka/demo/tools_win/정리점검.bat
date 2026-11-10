@echo off
chcp 65001 > nul
rem 정리점검.bat — 폴더를 물어본 뒤 czkawka_cli로 '찾기만' 합니다 (아무것도 지우지 않음)
rem czkawka_cli.exe 를 이 파일과 같은 폴더에 두고 실행합니다 (Windows 실행 확인 전)
set "CZ=%~dp0czkawka_cli.exe"
if not exist "%CZ%" set "CZ=czkawka_cli"
set /p DIR=검사할 폴더 경로를 입력하시기 바랍니다 (예: C:\Users\내이름\Downloads): 
set "OUT=%USERPROFILE%\Desktop\정리점검_결과"
mkdir "%OUT%" 2> nul
echo [1/5] 똑같은 파일을 찾는 중입니다...
"%CZ%" dup -d "%DIR%" -m 1 -f "%OUT%\1_똑같은파일.txt" -N -W
echo [2/5] 비슷한 사진을 찾는 중입니다...
"%CZ%" image -d "%DIR%" -s 15 -f "%OUT%\2_비슷한사진.txt" -N -W
echo [3/5] 빈 폴더를 찾는 중입니다...
"%CZ%" empty-folders -d "%DIR%" -f "%OUT%\3_빈폴더.txt" -N -W
echo [4/5] 큰 파일 20개를 찾는 중입니다...
"%CZ%" big -d "%DIR%" -n 20 -f "%OUT%\4_큰파일.txt" -N -W
echo [5/5] 위치 정보가 들어 있는 사진을 찾는 중입니다...
"%CZ%" exif-remover -d "%DIR%" -f "%OUT%\5_사진속정보.txt" -N -W
echo.
echo 바탕화면 '정리점검_결과' 폴더에 결과 글 파일 5개를 만들었습니다. 지운 파일은 없습니다.
start "" "%OUT%"
pause
