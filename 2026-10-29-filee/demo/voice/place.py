import json,pickle,re,subprocess
sp=json.load(open('spans.json')); spans=sp['spans']; lines=sp['lines']
_,L,_=pickle.load(open('/root/narr/cues.pkl','rb'))
cues=[]
for a,b,t in L:
    parts=[re.sub(r'\.$','',p.strip()) for p in re.split(r'(?<=[.!?])\s+',t) if p.strip()]
    w=[max(1,len(re.sub(r'[\s,!?]','',p))) for p in parts]; tot=sum(w); x=a
    for p,k in zip(parts,w): y=x+(b-a)*k/tot; cues.append((x,y,p)); x=y
assert [c[2] for c in cues]==lines, 'mismatch'
VID=306.3; prev_end=0; place=[]; late=[]
for (ca,cb,t),(a,b) in zip(cues,spans):
    a=max(0,a-0.06); b=b+0.08; dur=b-a
    st=max(ca+0.15, prev_end+0.12)
    if st-ca>0.6: late.append((round(ca,1),round(st-ca,2),t))
    place.append((st,a,b)); prev_end=st+dur
print('end',round(prev_end,2),'late',len(late)); [print(x) for x in late]
# build ffmpeg filter: trim each span, delay to st
inp=[]; fl=[]
for i,(st,a,b) in enumerate(place):
    fl.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={b-a-0.03:.3f}:d=0.03,adelay={int(st*1000)}|{int(st*1000)}[s{i}]")
fl.append(''.join(f'[s{i}]' for i in range(len(place)))+f"amix=inputs={len(place)}:normalize=0,apad=whole_dur={VID}[v]")
open('filter.txt','w').write(';\n'.join(fl))
json.dump(place,open('place.json','w'))
