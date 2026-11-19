"""rage 시연 측정 (2026-11-20, 클라우드 리눅스 CPU 2개). 결과 → results.json, 작업 파일 → work/ (커밋하지 않음)
시연 자료는 모두 직접 만든 가상 자료: 가상 비밀 일기(diary.txt), 가상 가족 사진 폴더(scikit-image CC0 사진 6장), 무작위 데이터 큰 파일
사용: python3 demo/bench.py"""
import gzip, hashlib, json, os, shutil, subprocess, tarfile, time
import pexpect
from skimage import data as skd
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
W = os.path.join(HERE, "work"); shutil.rmtree(W, ignore_errors=True); os.makedirs(W); os.chdir(W)
R = {"version": subprocess.run(["rage", "--version"], capture_output=True, text=True).stdout.strip()}
sha = lambda p: hashlib.sha256(open(p, "rb").read()).hexdigest()
sz = os.path.getsize


def run(cmd, inp=None):
    t = time.perf_counter(); p = subprocess.run(cmd, capture_output=True, input=inp)
    return time.perf_counter() - t, p.returncode, p.stderr.decode("utf-8", "replace").strip()


# 0) 가상 비밀 일기
diary = ("2026년 11월 20일 금요일 맑음\n오늘 은행 비밀번호를 바꿨다. 새 비밀번호는 일기장에만 적어 둔다: Sunflower-2026!\n"
         "다음 달 여행 계획: 제주도 3박 4일, 숙소 예약 번호 A1234-5678\n엄마 생신 선물로 목도리를 샀다. 아직 비밀!\n") * 3
open("diary.txt", "w", encoding="utf-8").write(diary)
R["diary_bytes"] = sz("diary.txt")

# 1) 열쇠 만들기
t, rc, err = run(["rage-keygen", "-o", "key.txt"]); R["keygen_s"] = round(t, 3)
pub = [l.split(": ")[1] for l in open("key.txt").read().splitlines() if l.startswith("# public key")][0]
R["pubkey_len"] = len(pub); R["pubkey_head"] = pub[:12]; R["key_file_lines"] = len(open("key.txt").read().splitlines())
R["secret_head"] = open("key.txt").read().splitlines()[-1][:16]  # AGE-SECRET-KEY-1 (뒤는 화면에 보이지 않게 함)

# 2) 공개 키(자물쇠)로 잠그기 → 열쇠 파일로 열기
t, rc, _ = run(["rage", "-r", pub, "-o", "diary.txt.age", "diary.txt"]); R["enc_s"] = round(t, 3)
R["enc_bytes"] = sz("diary.txt.age"); R["overhead_bytes"] = R["enc_bytes"] - R["diary_bytes"]
raw = open("diary.txt.age", "rb").read()
R["enc_first_line"] = raw.split(b"\n")[0].decode()
R["enc_contains_secret"] = ("Sunflower".encode() in raw) or ("비밀번호".encode() in raw)
R["enc_gzip_ratio"] = round(len(gzip.compress(raw)) / len(raw), 3); R["plain_gzip_ratio"] = round(len(gzip.compress(diary.encode())) / len(diary.encode()), 3)
t, rc, _ = run(["rage", "-d", "-i", "key.txt", "-o", "diary_open.txt", "diary.txt.age"]); R["dec_s"] = round(t, 3); R["dec_same"] = sha("diary_open.txt") == sha("diary.txt")
# 같은 일기를 두 번 잠그면 결과가 다름
run(["rage", "-r", pub, "-o", "diary2.txt.age", "diary.txt"]); R["two_runs_differ"] = sha("diary.txt.age") != sha("diary2.txt.age")
# 앞부분 16바이트 비교(사람이 보는 화면용)
R["plain_hex16"] = diary.encode()[:16].hex(" "); R["enc_body_hex16"] = raw[-64:-48].hex(" ")

# 3) 글자 형태(-a): 메신저·메일 본문에 붙여 넣는 용도
t, rc, _ = run(["rage", "-a", "-r", pub, "-o", "diary.txt.age.txt", "diary.txt"]); R["armor_bytes"] = sz("diary.txt.age.txt")
R["armor_first_line"] = open("diary.txt.age.txt").read().splitlines()[0]; R["armor_lines"] = len(open("diary.txt.age.txt").read().splitlines())
t, rc, _ = run(["rage", "-d", "-i", "key.txt", "-o", "diary_open_a.txt", "diary.txt.age.txt"]); R["armor_dec_ok"] = rc == 0 and sha("diary_open_a.txt") == sha("diary.txt")

# 4) 다른 열쇠로 열기 → 실패
run(["rage-keygen", "-o", "other.txt"])
t, rc, err = run(["rage", "-d", "-i", "other.txt", "-o", "x.txt", "diary.txt.age"]); R["wrong_key_rc"] = rc; R["wrong_key_err"] = err.splitlines()[0] if err else ""
R["wrong_key_output_exists"] = os.path.exists("x.txt") and sz("x.txt") > 0

# 5) 잠근 파일 1바이트 바꾸기 / 끝 자르기 → 열리지 않음
b = bytearray(raw); b[len(b) - 100] ^= 0x01; open("tampered.age", "wb").write(b)
t, rc, err = run(["rage", "-d", "-i", "key.txt", "-o", "t.txt", "tampered.age"]); R["tamper_rc"] = rc; R["tamper_err"] = err.splitlines()[0] if err else ""
R["tamper_out_bytes"] = sz("t.txt") if os.path.exists("t.txt") else 0
open("cut.age", "wb").write(raw[:-50]); t, rc, err = run(["rage", "-d", "-i", "key.txt", "-o", "c.txt", "cut.age"]); R["cut_rc"] = rc; R["cut_err"] = err.splitlines()[0] if err else ""

# 6) 여러 사람이 열 수 있게(받는 사람 2명)
run(["rage-keygen", "-o", "mom.txt"]); mom = [l.split(": ")[1] for l in open("mom.txt").read().splitlines() if l.startswith("# public key")][0]
run(["rage", "-r", pub, "-r", mom, "-o", "family.age", "diary.txt"]); R["two_rcpt_bytes"] = sz("family.age")
R["two_rcpt_me"] = run(["rage", "-d", "-i", "key.txt", "-o", "f1.txt", "family.age"])[1] == 0
R["two_rcpt_mom"] = run(["rage", "-d", "-i", "mom.txt", "-o", "f2.txt", "family.age"])[1] == 0
R["two_rcpt_other"] = run(["rage", "-d", "-i", "other.txt", "-o", "f3.txt", "family.age"])[1] == 0


# 7) 암호 문장(-p)으로 잠그기 — 명령이 화면에서 암호를 두 번 물어봄 (pexpect로 입력)
# 리눅스에 pinentry(암호 입력 창 프로그램)가 있으면 rage가 그 창을 띄우므로, PATH에서 빼서 Windows처럼 명령 창 안에서 묻게 함
PENV = dict(os.environ, PATH="/root/.cargo/bin")
def pw_enc(pw, out):
    t = time.perf_counter(); c = pexpect.spawn(f"/root/.cargo/bin/rage -p -o {out} diary.txt", encoding="utf-8", timeout=60, env=PENV)
    log = []
    for _ in range(2):
        c.expect(": "); log.append(c.before.strip()); c.sendline(pw)
    c.expect(pexpect.EOF); c.close(); return time.perf_counter() - t, c.exitstatus, " / ".join(log)


def pw_dec(pw, inp, out):
    c = pexpect.spawn(f"/root/.cargo/bin/rage -d -o {out} {inp}", encoding="utf-8", timeout=120, env=PENV)
    c.expect(": "); prompt = c.before.strip(); t = time.perf_counter(); c.sendline(pw); c.expect(pexpect.EOF); rest = c.before; c.close()
    return time.perf_counter() - t, c.exitstatus, prompt, rest  # 시간 = 암호 문장을 넣은 뒤 끝날 때까지


t, rc, log = pw_enc("봄날-제주-목도리-2026", "pw.age"); R["pw_enc_s"] = round(t, 2); R["pw_enc_rc"] = rc; R["pw_prompt"] = log[:200]
t, rc, prompt, rest = pw_dec("봄날-제주-목도리-2026", "pw.age", "pw_open.txt"); R["pw_dec_prompt"] = prompt; R["pw_dec_s"] = R["pw_after_input_s"] = round(t, 2); R["pw_dec_ok"] = rc == 0 and sha("pw_open.txt") == sha("diary.txt")
t, rc, prompt, rest = pw_dec("봄날-제주-목도리-2025", "pw.age", "pw_bad.txt"); R["pw_wrong_s"] = round(t, 2); R["pw_wrong_rc"] = rc; R["pw_wrong_msg"] = next((l.strip() for l in rest.splitlines() if l.strip().startswith("Error")), "")
# 빈칸으로 두면 rage가 암호를 만들어 줌
c = pexpect.spawn("/root/.cargo/bin/rage -p -o auto.age diary.txt", encoding="utf-8", timeout=60, env=PENV); c.expect(": "); c.sendline(""); c.expect(": "); c.sendline(""); c.expect(pexpect.EOF); R["pw_auto_msg"] = c.before.strip()[:300]; c.close()

# 8) 폴더 통째로: 묶고(tar) → 잠그기 (가상 가족 사진 6장)
os.makedirs("photos"); imgs = {"coffee": skd.coffee(), "chelsea": skd.chelsea(), "rocket": skd.rocket(), "astronaut": skd.astronaut(), "cat": skd.cat(), "hubble": skd.hubble_deep_field()}
for i, (k, a) in enumerate(imgs.items()): Image.fromarray(a).save(f"photos/{i + 1:02d}_{k}.jpg", quality=92)
with tarfile.open("photos.tar", "w") as tf: tf.add("photos")
R["photos_n"] = len(imgs); R["photos_bytes"] = sum(sz(f"photos/{f}") for f in os.listdir("photos")); R["tar_bytes"] = sz("photos.tar")
t, rc, _ = run(["rage", "-r", pub, "-o", "photos.tar.age", "photos.tar"]); R["photos_enc_s"] = round(t, 3); R["photos_age_bytes"] = sz("photos.tar.age")
os.makedirs("restore"); t, rc, _ = run(["rage", "-d", "-i", "key.txt", "-o", "restore/photos.tar", "photos.tar.age"])
with tarfile.open("restore/photos.tar") as tf: tf.extractall("restore", filter="data")
R["photos_restored_same"] = all(sha(f"photos/{f}") == sha(f"restore/photos/{f}") for f in os.listdir("photos"))

# 9) 큰 파일 속도: 무작위 데이터 100MB · 1GB
for mb in (100, 1024):
    with open("big.bin", "wb") as f:
        for _ in range(mb): f.write(os.urandom(1 << 20))
    te, rc, _ = run(["rage", "-r", pub, "-o", "big.age", "big.bin"]); td, rc2, _ = run(["rage", "-d", "-i", "key.txt", "-o", "big_open.bin", "big.age"])
    R[f"big{mb}"] = {"enc_s": round(te, 2), "dec_s": round(td, 2), "enc_MBps": round(mb / te), "dec_MBps": round(mb / td), "overhead": sz("big.age") - sz("big.bin"), "same": sha("big.bin") == sha("big_open.bin")}
    for f in ("big.bin", "big.age", "big_open.bin"): os.remove(f)

# 10) 이미 있는 파일 이름으로 -o를 주면 덮어씀 (도움말에도 적혀 있음)
open("keep.txt", "w").write("원래 내용"); run(["rage", "-r", pub, "-o", "keep.txt", "diary.txt"]); R["overwrite_happened"] = open("keep.txt", "rb").read(21) == b"age-encryption.org/v1"

R["scrypt_log2"] = int(open("pw.age", "rb").read().split(b"\n")[1].split()[-1])  # 암호 문장 방식의 일부러 느리게 하는 정도(2의 19제곱)
R["install_s"] = 88.7  # cargo install rage --force 시간(따로 측정, 2026-11-20)
R["crate_version_date"] = "2026-07-14"; R["license"] = "MIT OR Apache-2.0"  # crates.io 기준
json.dump(R, open(os.path.join(HERE, "results.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1))
