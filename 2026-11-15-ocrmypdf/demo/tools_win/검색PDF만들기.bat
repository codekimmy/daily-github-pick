@echo off
chcp 65001 > nul
rem 검색PDF만들기.bat — 스캔한 PDF를 이 실행 파일 위에 마우스로 끌어다 놓으면, OCRmyPDF가 한국어 글자를 읽어
rem PDF 옆에 "이름_검색가능.pdf"를 만듭니다. 원본 PDF는 바뀌지 않습니다. 여러 파일을 한꺼번에 끌어다 놓아도 됩니다
rem 먼저 README의 Windows 설치(Tesseract + 한국어 언어 파일 + OCRmyPDF)를 끝내 두어야 합니다 (Windows 실행 확인 전)
if "%~1"=="" (
  echo 스캔한 PDF 파일을 이 실행 파일 위에 마우스로 끌어다 놓으시기 바랍니다.
  pause
  exit /b
)
:loop
if "%~1"=="" goto done
echo [%~nx1] 글자를 읽는 중입니다...
rem -l kor+eng: 한국어+영어 / --tesseract-pagesegmode 4: 줄 단위로 읽기 / --rotate-pages: 거꾸로 된 쪽 바로 세우기
rem --deskew: 조금 기울어진 쪽 바로잡기 / --skip-text: 이미 글자가 있는 쪽은 건너뛰기
ocrmypdf -l kor+eng --tesseract-pagesegmode 4 --rotate-pages --deskew --skip-text "%~1" "%~dpn1_검색가능.pdf"
shift
goto loop
:done
echo.
echo 끝났습니다. PDF가 있던 폴더에서 "_검색가능.pdf" 파일을 열고 Ctrl+F로 낱말을 찾아보시기 바랍니다.
pause
