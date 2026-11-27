# demo — 사양 체크 편 영상·썸네일 만드는 순서

> 이 모델(MiniMax-H3-Image)은 그래픽카드가 필요해 직접 실행하지 않았습니다. 여기 있는 것은 공식 자료의 숫자(`render/data.js`의 SPEC)로 **사양 카드·체크리스트 애니메이션**을 그리는 코드뿐이며, 제작사 그림·데모 이미지는 쓰지 않았습니다.

| 파일 | 하는 일 |
|---|---|
| `script.py` · `build.py` | 롱폼·숏폼 대본(화면 자막 + 읽는 문장) → 시간 계산(6.3글자/초, 최소 3초, 쉼 1.1·1.4초) → `render/timing.js`, `narration-*.txt` 4개 (2026-11-25-spec-Pika-H3-Flex 도구를 고쳐 씀) |
| `render/data.js` | 공식 자료 값 SPEC (Hugging Face 모델 카드·LICENSE·공식 블로그·diffusers 문서·ComfyUI 안내, 2026-11-28 확인) |
| `render/page.html` · `render/scenes.js` | 모션 스타일 키트(`tools/motion`): 롱폼 13개 장 + 숏폼 5장면 모두 직접 만든 장면(그래픽카드 카드·쌓는 메모리 막대·작업대에 두 덩이를 번갈아 올리기·저장 공간 막대·제외 지역 칩), 엔딩 뺀 모든 장에 냥봇 |
| `render/thumb.html` · `render/thumbs.js` | 썸네일 2장 + 블로그 그림 2장(`spec-card.png`·`license.png`) — `python3 ../../../tools/motion/render_thumbs.py` |

확인 화면: (render 폴더에서) `python3 ../../../tools/motion/render_motion.py long ../work/chk --only 20,56,…,last` (`work/`는 커밋하지 않음)
영상 제작 단계: `tools/DAILY_TASK.md` 맨 아래 순서 그대로 (음성 도구는 `2026-11-24-segno/demo/voice/` 복사)
