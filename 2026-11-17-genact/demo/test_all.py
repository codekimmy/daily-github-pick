"""genact는 명령 창(터미널)이 있어야 실행되므로 script로 가상 터미널(가로 100칸)을 붙여 모듈 21개를 한 번씩 실행해 걸린 시간·줄 수·CPU 시간을 잰다 → results.json"""
import subprocess, time, json, resource, os, sys
from concurrent.futures import ThreadPoolExecutor
mods = subprocess.run(["genact","-l"],capture_output=True,text=True).stdout.split()[2:]
def run(m, extra=(), limit=90):
    import tempfile
    f=tempfile.TemporaryFile()
    t=time.time()
    cmd="stty cols 100 rows 30; genact -m %s --exit-after-modules 1 %s"%(m," ".join(extra))
    p=subprocess.Popen(["script","-qfec",cmd,"/dev/null"],stdout=f,stderr=subprocess.DEVNULL,stdin=subprocess.DEVNULL,cwd="/tmp")
    to=False
    while True:
        pid,st,ru=os.wait4(p.pid,os.WNOHANG)
        if pid: break
        if time.time()-t>limit:
            p.kill(); pid,st,ru=os.wait4(p.pid,0); to=True; break
        time.sleep(0.05)
    p.returncode=0
    dt=time.time()-t
    f.seek(0); out=f.read()
    txt=out.decode("utf-8","replace")
    print(m,round(dt,1),to,flush=True)
    return dict(module=m,sec=round(dt,2),timeout=to,lines=txt.count("\n"),bytes=len(out),cpu=round(ru.ru_utime+ru.ru_stime,2),maxrss_kb=ru.ru_maxrss)
res={}
with ThreadPoolExecutor(4) as ex:
    res["modules"]=list(ex.map(run,mods))
# 속도 배율
res["speed"]=[dict(factor=f,**run("cc",("-s",str(f)))) for f in (1,5,20)]
json.dump(res,open("results.json","w"),ensure_ascii=False,indent=1)
for r in res["modules"]+res["speed"]: print(r)
