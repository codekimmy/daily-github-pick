@echo off
chcp 65001 >nul
rem 메모(.md) 파일을 이 아이콘 위로 끌어다 놓으면 같은 폴더에 PDF와 PPTX가 생겨요
rem 준비: Node.js 설치 후 cmd에서  npm install -g @marp-team/marp-cli
if "%~1"=="" (
  echo .md 파일을 이 아이콘 위로 끌어다 놓으세요.
  pause
  exit /b
)
:loop
if "%~1"=="" goto done
echo [변환 중] %~nx1
call marp --no-stdin --allow-local-files "%~1" -o "%~dpn1.pdf"
call marp --no-stdin --allow-local-files --pptx "%~1" -o "%~dpn1.pptx"
shift
goto loop
:done
echo 끝났어요. 원래 파일 옆에 PDF, PPTX가 생겼어요.
pause
