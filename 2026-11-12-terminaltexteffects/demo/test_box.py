"""넓은 무대 설정(--canvas-width 40 --canvas-height 10 --anchor-text c: 가로 40칸·세로 10줄 무대 가운데에 글)로
37가지 효과의 한글 마지막 화면을 다시 확인 (터미널 80칸) → results.json 의 final_ok_ko_box"""
import json, sys
sys.argv = ["x"]; exec(open(__file__.replace("test_box", "test_all")).read().split("R = {")[0])
R = json.loads((H / "results.json").read_text()); BOX = "--canvas-width 40 --canvas-height 10 --anchor-text c"
for n in EFFECTS:
    ok, d = correct(n, KO, BOX); R["effects"][n]["final_ok_ko_box"] = ok; print(n, ok, flush=True)
R["summary"]["ok_ko_box"] = sum(v["final_ok_ko_box"] for v in R["effects"].values()); R["box_args"] = BOX
(H / "results.json").write_text(json.dumps(R, ensure_ascii=False, indent=1), encoding="utf-8"); print(R["summary"])
