@echo off
chcp 65001 > nul
rem 장면고르기.bat — genact 실행 파일(genact-1.6.0-x86_64-pc-windows-msvc.exe)과 같은 폴더에 두고 마우스로 두 번 누르면,
rem 장면 번호와 시간(분)을 물어본 뒤 genact를 그 시간만큼 실행합니다. genact는 글자만 흘려보내고 실제 작업은 하지 않습니다
rem 멈추려면 Ctrl + C 를 누르시기 바랍니다 (Windows 실행 확인 전, 같은 옵션은 리눅스에서 확인)
cd /d "%~dp0"
set "EXE="
for %%f in (genact*.exe) do set "EXE=%%f"
if "%EXE%"=="" (
  echo 같은 폴더에 genact 실행 파일^(genact-...-windows-msvc.exe^)이 없습니다.
  echo 공식 저장소 Releases에서 받아 이 파일과 같은 폴더에 넣으시기 바랍니다.
  pause
  exit /b
)
echo 어떤 장면을 띄우시겠습니까? 번호를 고르시기 바랍니다.
echo   1. 프로그램 조립(빌드) 화면        (cc, kernel_compile)
echo   2. 큰 파일 내려받기 화면           (download)
echo   3. 영화 속 해킹 화면               (bruteforce, botnet, memdump)
echo   4. 서버 설치·배포 화면             (ansible, docker_build, terraform)
echo   5. 모든 장면 번갈아 보기           (21가지 무작위)
choice /c 12345 /n /m "번호: "
set "MODS=-m cc -m kernel_compile"
if errorlevel 2 set "MODS=-m download"
if errorlevel 3 set "MODS=-m bruteforce -m botnet -m memdump"
if errorlevel 4 set "MODS=-m ansible -m docker_build -m terraform"
if errorlevel 5 set "MODS="
set "MIN=10"
set /p "MIN=몇 분 동안 띄우시겠습니까? (숫자만, 그냥 Enter는 10분): "
echo.
echo %MIN%분 뒤 자동으로 끝납니다. 중간에 멈추려면 Ctrl + C 를 누르시기 바랍니다.
timeout /t 2 > nul
"%EXE%" %MODS% --exit-after-time %MIN%min
echo.
echo 끝났습니다. 화면의 글자는 모두 가짜이며, 실제로 받거나 저장한 파일은 없습니다.
pause
