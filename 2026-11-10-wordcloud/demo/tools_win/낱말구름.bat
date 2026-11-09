@echo off
chcp 65001 > nul
rem 글 파일 이름을 물어보고 한글 낱말 구름을 만듭니다 (카톡구름.py와 같은 폴더에 두고 실행)
rem 처음 한 번: pip install wordcloud kiwipiepy
set /p FILE=글 파일 이름을 입력하시기 바랍니다 (예: 대화.txt): 
set /p SKIP=빼고 싶은 낱말을 쉼표로 입력하시기 바랍니다 (없으면 그냥 Enter): 
set /p KEEP=쪼개지면 안 되는 낱말을 쉼표로 입력하시기 바랍니다 (예: 흑돼지, 없으면 그냥 Enter): 
python "%~dp0카톡구름.py" "%FILE%" --빼기 "%SKIP%" --단어 "%KEEP%" --가로
echo.
echo 같은 폴더에 _낱말구름.png 와 _낱말순위.csv 가 만들어졌습니다.
pause
