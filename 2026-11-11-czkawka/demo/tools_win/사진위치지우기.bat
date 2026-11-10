@echo off
chcp 65001 > nul
rem 사진위치지우기.bat — 폴더 속 사진의 위치·날짜·기종 정보(EXIF)를 지운 '새 사진'을 만듭니다
rem 원본 사진은 그대로 두고, 같은 폴더에 '원래이름.czkawka_cleaned_exif.jpg' 사진을 새로 만듭니다 (Windows 실행 확인 전)
set "CZ=%~dp0czkawka_cli.exe"
if not exist "%CZ%" set "CZ=czkawka_cli"
set /p DIR=사진 폴더 경로를 입력하시기 바랍니다 (예: C:\Users\내이름\Pictures\올릴사진): 
"%CZ%" exif-remover -d "%DIR%" -F -W
echo.
echo 위치 정보를 지운 새 사진을 같은 폴더에 만들었습니다. 올리기 전에 새 사진을 직접 확인하시기 바랍니다.
pause
