@echo off
chcp 65001 >nul
rem 이 파일을 문서가 들어 있는 폴더에 넣고 두 번 누르면, 같은 폴더의 md 폴더에 글 파일(.md)이 만들어집니다
rem 원본 파일은 바꾸지 않습니다. 리눅스 작업 공간에서 만든 예제이며 Windows에서는 실행 확인을 거치지 않았습니다
if not exist md mkdir md
for %%f in (*.docx *.xlsx *.pptx *.pdf *.html *.csv *.epub) do (
  echo 변환 중: %%f
  markitdown "%%f" -o "md\%%~nf.md"
)
echo.
echo 끝났습니다. md 폴더를 확인하시기 바랍니다
pause
