# 그래프가 자라나는 영상 만들기

Graphify 기본 화면(graph.html)은 완성된 그림만 보여줘서 "그려지는 과정"이 안 보인다.
그래서 graph.json을 읽어 **파일 하나씩 코드 조각이 생겨나고 연결되는 과정**을 직접 애니메이션으로 만들었다.

| 구간 | 내용 |
|---|---|
| 0~2초 | "파일 155개짜리 프로그램, 지도로 그리면?" |
| 2~14초 | 파일을 하나씩 읽으며 점(코드 조각)과 선(연결)이 생겨남. 새로 생긴 것은 하얗게 반짝임. 왼쪽 위 카운터가 같이 올라감 |
| 14~16초 | "완성 · 약 5초 · AI 토큰 0" |
| 16~21초 | 나머지는 어둡게, 환승역 TOP 5에 고리 + 순위표 |
| 21~26초 | 1위 Context로 확대, 연결선 184개가 하나씩 켜짐 |
| 26~30초 | 엔딩 카드 |

```bash
python3 prep.py ~/click/graphify-out/graph.json "Context,Command,Parameter,CliRunner,Option" "184,110,98,76,66"
python3 render.py 1920 1080 graphify-grow.mp4            # 가로 (롱폼)
python3 render.py 1080 1920 graphify-grow-vertical.mp4   # 세로 (숏폼)
```
실시간 녹화가 아니라 프레임을 한 장씩 계산해 찍기 때문에 끊김이 없다 (30fps, 각 1~2분).
