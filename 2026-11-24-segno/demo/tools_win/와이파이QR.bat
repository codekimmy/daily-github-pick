@echo off
chcp 65001 >nul
setlocal
rem ==================================================================
rem  와이파이QR.bat — 이 파일을 마우스로 두 번 누르면 와이파이 이름·비밀번호를 묻고
rem  이 .bat 파일이 있는 폴더에 "와이파이QR.png"(인쇄용 300dpi)를 만듭니다
rem  필요한 프로그램: 파이썬 + segno (py -m pip install segno)
rem  비밀번호 속 ; , : \ " 기호는 segno 파이썬 도우미(make_wifi)가 자동으로 처리합니다
rem  안 명령은 2026-11-24 리눅스 클라우드에서 같은 방식으로 확인, 이 .bat 자체는 Windows 실행 확인 전
rem ==================================================================
where py >nul 2>nul
if errorlevel 1 (
  echo [안내] 파이썬^(py 명령^)을 찾지 못했습니다.
  echo  1. https://www.python.org 에서 파이썬을 설치합니다 ^(설치 첫 화면 "Add python.exe to PATH" 체크^)
  echo  2. 이 파일을 다시 두 번 누릅니다
  pause
  exit /b 1
)
py -c "import segno" >nul 2>nul
if errorlevel 1 (
  echo [안내] segno가 설치되어 있지 않습니다.
  echo  명령 프롬프트를 열고 py -m pip install segno 를 입력한 뒤 이 파일을 다시 두 번 누릅니다
  pause
  exit /b 1
)
set "QR_SSID="
set "QR_PW="
set /p QR_SSID=와이파이 이름^(공유기 이름^)을 입력하고 Enter: 
set /p QR_PW=와이파이 비밀번호를 입력하고 Enter: 
if not defined QR_SSID (
  echo [안내] 와이파이 이름이 비어 있습니다. 다시 실행하시기 바랍니다.
  pause
  exit /b 1
)
set "QR_OUT=%~dp0와이파이QR.png"
py -c "import os, segno.helpers as h; q = h.make_wifi(ssid=os.environ['QR_SSID'], password=os.environ.get('QR_PW') or None, security='WPA' if os.environ.get('QR_PW') else None); q.save(os.environ['QR_OUT'], scale=20, dpi=300); print('완료:', os.environ['QR_OUT'], '(', q.symbol_size(border=0)[0], '칸 )')"
if errorlevel 1 (
  echo [실패] QR 그림을 만들지 못했습니다. 이미 열려 있는 와이파이QR.png 창을 닫고 다시 실행하시기 바랍니다.
  pause
  exit /b 1
)
echo 인쇄하기 전에 내 휴대폰 카메라로 비춰 접속되는지 꼭 확인하시기 바랍니다.
echo 비밀번호가 그림에 그대로 들어 있으므로 아는 사람에게만 보여 주시기 바랍니다.
start "" "%QR_OUT%"
pause
