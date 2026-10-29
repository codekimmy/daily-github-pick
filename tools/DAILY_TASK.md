# 매일 예약 작업 지시문

저장소 `codekimmy/daily-github-pick`에 오늘의 오픈소스 1개를 추가한다.

1. 저장소를 받아 `GUIDE.md`, `INDEX.md`, `templates/`, 가장 최근 날짜 폴더 하나를 읽고 형식과 문체를 그대로 따른다.
2. GitHub Trending(일간·주간)과 최근 별 급상승 저장소를 웹에서 찾아 후보 3~5개를 고른다. `INDEX.md`에 이미 있는 저장소는 제외. 분야는 제한하지 않되, 연속 같은 분야는 피한다. GUIDE의 우선순위로 1개 선정.
3. 별·포크·라이선스·언어·버전은 GitHub 페이지와 패키지 저장소에서 직접 확인한다.
4. 작업 공간에서 실제로 설치·실행한다. 결과 수치, 걸린 시간, 막힌 점을 기록한다. 실행이 불가능하면(하드웨어·유료 키 필요 등) 그 이유를 적고, 가능한 부분(문서 예제, 작은 데모)까지만 한다. 가능하면 `demo/`에 작은 활용 예제를 직접 구현한다.
5. 녹화: 데모 스크립트를 `demo/demo.sh`로 만들고 `tools/record_terminal.sh`로 `media/terminal.gif` 생성. 결과가 웹 화면이면 `tools/record_page.py`로 `media/*.mp4` 생성, 그리고 GUIDE.md 5장에 따라 **과정이 보이는 30초 애니메이션**을 가로·세로 두 버전으로 만들고(`2026-10-29-graphify/demo/grow-animation/`의 프레임 렌더링 방식 참고), README용 GIF(640px, 10MB 이하)도 만든다. CDN 스크립트가 막히면 npm에서 받아 HTML에 인라인한다. 녹화 결과는 프레임을 직접 열어 빈 화면이 아닌지 확인한다.
6. `YYYY-MM-DD-이름/`에 README.md, blog.md, youtube-long.md, shorts.md를 templates 형식으로 작성한다. 초보자 눈높이 규칙(GUIDE 3장)을 반드시 지킨다. 명령어는 Windows cmd 기준. 원문 문장을 베끼지 않는다.
7. `INDEX.md`에 한 줄 추가 후 main에 커밋·푸시. 커밋 메시지: `Day N: 저장소명 — 한 줄 설명`.
8. 마지막에 사용자에게 한국어로 짧게 보고: 오늘의 프로젝트 한 줄 소개, 직접 해본 핵심 결과 1~2줄, 저장소 폴더 링크, 대표 GIF/영상 파일 전송.
