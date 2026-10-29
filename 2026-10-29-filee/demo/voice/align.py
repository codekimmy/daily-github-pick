import re,subprocess,json,pickle
D=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','in.mp3'],capture_output=True,text=True).stdout)
def segs(d,noise=-38):
    o=subprocess.run(['ffmpeg','-hide_banner','-i','in.mp3','-af',f'silencedetect=noise={noise}dB:d={d}','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',o)]; en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',o)]
    # speech = complement
    sp=[]; cur=0.0
    for s,e in zip(st,en+[D]*(len(st)-len(en))):
        if s>cur+0.05: sp.append((cur,s))
        cur=e
    if cur<D-0.05: sp.append((cur,D))
    return sp
S=segs(0.12)
lines=[l.strip() for l in open('/home/claude/daily-github-pick/2026-10-29-filee/narration-long-text.txt',encoding='utf-8-sig') if l.strip()]
w=[len(re.sub(r'[\s,!?]','',l)) for l in lines]
print('segments',len(S),'lines',len(lines))
tot_sp=sum(b-a for a,b in S); rate=tot_sp/sum(w)
# DP: assign consecutive segment groups to each line
import math
n,m=len(lines),len(S)
INF=1e18; dp=[[INF]*(m+1) for _ in range(n+1)]; bk=[[0]*(m+1) for _ in range(n+1)]
dp[0][0]=0
for i in range(1,n+1):
    exp=w[i-1]*rate
    for j in range(i,m+1):
        best=INF;bj=0
        for k in range(max(i-1,j-8),j):   # line i uses segments k..j-1
            if dp[i-1][k]>=INF: continue
            dur=S[j-1][1]-S[k][0]
            gaps=sum(S[t+1][0]-S[t][1] for t in range(k,j-1))
            c=dp[i-1][k]+((dur-gaps)-exp)**2/ max(exp,0.4) + 0.6*max(0,max([S[t+1][0]-S[t][1] for t in range(k,j-1)] or [0])-0.35)*5
            if c<best: best,bj=c,k
        dp[i][j]=best; bk[i][j]=bj
j=m; res=[]
for i in range(n,0,-1):
    k=bk[i][j]; res.append((S[k][0],S[j-1][1])); j=k
res=res[::-1]
for (a,b),l,ww in list(zip(res,lines,w)):
    print(f'{a:7.2f}-{b:7.2f} {b-a:5.2f} exp{ww*rate:5.2f} {l}')
json.dump({'spans':res,'lines':lines},open('spans.json','w'),ensure_ascii=False)
