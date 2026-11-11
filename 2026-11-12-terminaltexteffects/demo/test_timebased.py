"""시계 기준 효과(matrix·thunderstorm)는 프레임을 빨리 뽑아도 정해진 초만큼 계속되므로, 기본 설정(초당 60장)으로 실제 실행한 시간으로 고쳐 씀 → results.json"""
import json, sys
sys.argv = ["x"]; src = open(__file__.replace("test_timebased", "test_all")).read().split("R = {")[0]; exec(src)
R = json.loads((H / "results.json").read_text()); f = H / "work" / "in.txt"
for n in ["matrix", "thunderstorm"]:
    f.write_text(KO); _, s1 = run_tty(f"-i {f} {n}", KO); f.write_text(EN); _, s2 = run_tty(f"-i {f} {n}", EN)
    e = R["effects"][n]; e.update({"sec_ko": round(s1, 1), "sec_en": round(s2, 1), "time_based": True}); e.pop("frames_ko"); e.pop("frames_en"); e.pop("calc_ko")
    print(n, round(s1, 1), round(s2, 1))
R["length"].pop("matrix", None)
E_ = R["effects"]; S = R["summary"]
S["longest"] = max(E_, key=lambda k: E_[k]["sec_ko"]); S["shortest"] = min(E_, key=lambda k: E_[k]["sec_ko"])
S["median_sec_ko"] = sorted(v["sec_ko"] for v in E_.values())[len(E_) // 2]
S["under5"] = sum(v["sec_ko"] < 5 for v in E_.values()); S["over10"] = sum(v["sec_ko"] >= 10 for v in E_.values())
S["fail_ko"] = [k for k, v in E_.items() if not v["final_ok_ko"]]
(H / "results.json").write_text(json.dumps(R, ensure_ascii=False, indent=1), encoding="utf-8"); print(S)
