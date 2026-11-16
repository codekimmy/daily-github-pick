"""추가 측정 → results_extra.json
① 모듈 여러 개를 섞어(기본 실행) 30초 돌릴 때 CPU 시간·메모리(VmRSS)  ② 속도 배율(-s)별 10초 동안 나온 줄 수(cc)
③ 빈 폴더에서 download 10초 → 생긴 파일 수  ④ 인터넷을 끊은 상태(unshare -n)에서 실행되는지  ⑤ 파이프로 넘기면(터미널 없음) 멈춤"""
import subprocess, re, json, os, time, tempfile, shutil
R = {}
def pty(cmd, sec):
    return subprocess.run(["script", "-qfec", f"stty cols 100 rows 30; {cmd}", "/dev/null"], capture_output=True, timeout=sec + 30, stdin=subprocess.DEVNULL).stdout.decode("utf-8", "replace")
# ①
p = subprocess.Popen(["script", "-qfec", "stty cols 100 rows 30; genact --exit-after-time 30s", "/dev/null"], stdout=subprocess.DEVNULL, stdin=subprocess.DEVNULL)
time.sleep(3); rss = []
for _ in range(25):
    for pid in subprocess.run(["pgrep", "-x", "genact"], capture_output=True, text=True).stdout.split():
        try:
            st = open(f"/proc/{pid}/status").read(); rss.append(int(re.search(r"VmRSS:\s+(\d+)", st).group(1)))
            stat = open(f"/proc/{pid}/stat").read().split(); last = (int(stat[13]) + int(stat[14])) / os.sysconf("SC_CLK_TCK")
        except Exception: pass
    time.sleep(1)
p.wait()
R["mixed_30s"] = {"cpu_sec_at_28s": last, "cpu_percent": round(last / 28 * 100, 2), "rss_mb_max": round(max(rss) / 1024, 1)}
# ②
R["speed_10s_lines"] = {}
for f in (1, 5, 20):
    out = pty(f"genact -m kernel_compile -s {f} --exit-after-time 10s", 10)
    R["speed_10s_lines"][f] = out.count("\n")
# ③
d = tempfile.mkdtemp(); before = len(os.listdir(d))
out = subprocess.run(["script", "-qfec", "stty cols 100 rows 30; genact -m download --exit-after-time 10s", "/dev/null"], capture_output=True, cwd=d, stdin=subprocess.DEVNULL).stdout.decode("utf-8", "replace")
mib = [float(x) for x in re.findall(r"([\d.]+)MiB ", out)]
R["download_10s"] = {"files_before": before, "files_after": len(os.listdir(d)), "shown_max_MiB": max(mib) if mib else None,
                     "fake_names": sorted(set(re.findall(r"(\S+\.iso)", out)))[:6], "ends_with": out.strip().splitlines()[-1][-40:]}
shutil.rmtree(d)
# ④
out = subprocess.run(["unshare", "-rn", "script", "-qfec", "stty cols 100 rows 30; genact -m bruteforce --exit-after-time 5s", "/dev/null"], capture_output=True, stdin=subprocess.DEVNULL).stdout
R["no_network_bytes_5s"] = len(out)
# ⑤
r = subprocess.run("genact -m cc --exit-after-time 3s | head -3", shell=True, capture_output=True, text=True, timeout=20)
R["pipe"] = {"stdout_lines": r.stdout.count("\n"), "error": [l for l in r.stderr.splitlines() if "terminal" in l][:1]}
json.dump(R, open("results_extra.json", "w"), ensure_ascii=False, indent=1); print(json.dumps(R, ensure_ascii=False, indent=1))
