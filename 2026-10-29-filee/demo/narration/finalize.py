"""cues.pkl → 마침표 없이 한 줄 한 문장으로 정리한 대본 4개 파일"""
import pickle,re,sys
shorts,L,VEND=pickle.load(open('/root/narr/cues.pkl','rb'))
def split(cues):
    out=[]
    for a,b,t in cues:
        parts=[re.sub(r'\.$','',p.strip()) for p in re.split(r'(?<=[.!?])\s+',t) if p.strip()]
        w=[max(1,len(re.sub(r'[\s,!?]','',p))) for p in parts]; tot=sum(w); x=a
        for p,k in zip(parts,w): y=x+(b-a)*k/tot; out.append((x,y,p)); x=y
    return out
S2,L2=split(shorts),split(L)
assert not any('.' in t for _,_,t in S2+L2)
ts=lambda x:f'{int(x//60):02d}:{x%60:04.1f}'
D='/home/claude/daily-github-pick/2026-10-29-filee/'
def write(path,title,video,dur,cues):
    o=[title,f'영상 파일: {video} (길이 {ts(dur)})','','■ 읽는 법','- 대괄호 안 시간이 영상에서 그 문장이 나와야 하는 구간이에요',
       '- 영어·숫자는 모두 읽는 소리대로 한글로 바꿨어요 (예: PDF → 피디에프, JPG → 제이피지, 1초 → 일 초)','- 한 줄에 한 문장, 마침표 없이 정리했어요','','■ 구간별 대본','']
    for a,b,t in cues: o+=[f'[{ts(a)} ~ {ts(b)}]  ({b-a:.1f}초)',t,'']
    open(path,'w',encoding='utf-8-sig').write('\r\n'.join(o)+'\r\n')
write(D+'narration-shorts.txt','파일리 숏폼 내레이션 대본','media/filee-demo-vertical.mp4',VEND,S2)
write(D+'narration-long.txt','파일리 롱폼 내레이션 대본','media/filee-long.mp4',306.3,L2)
for n,c in [('narration-shorts-text.txt',S2),('narration-long-text.txt',L2)]:
    open(D+n,'w',encoding='utf-8-sig').write('\r\n'.join(t for _,_,t in c)+'\r\n')
print(len(S2),len(L2))
