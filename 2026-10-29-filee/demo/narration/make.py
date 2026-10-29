import re
M={l.split()[0]:float(l.split()[1]) for l in open('/root/fedit/scene_times.txt')}
# ---- vertical timeline ----
t=3.2; V={}
for k in ['hwp','heic','stamp']:
    a=M[k+'_select']-1.4; b=M[k+'_done']+0.9
    V[k]=lambda x,a=a,s=t: s+(M[x]-a) if isinstance(x,str) else s+x
    V[k+'_start']=t; t+=b-a; V[k+'_end']=t
VEND=t+4.5
h=lambda x:V['hwp'](x); e=lambda x:V['heic'](x); s=lambda x:V['stamp'](x)
shorts=[
 (0.0, 3.2, '한컴오피스 없는데 한글 파일 받으면 어떡하죠?'),
 (V['hwp_start'], h('hwp_ctrl'), '무료 프로그램 파일리면 돼요.'),
 (h('hwp_ctrl'), h('hwp_hover'), '컨트롤을 누른 채 끌면 동그란 메뉴가 뜨고,'),
 (h('hwp_hover'), h('hwp_drop')+1.2, '피디에프에 놓으면'),
 (h('hwp_drop')+1.2, V['hwp_end'], '끝! 표까지 그대로예요.'),
 (V['heic_start'], e('heic_hover'), '윈도우에서 안 열리는 아이폰 사진도'),
 (e('heic_hover'), V['heic_end'], '제이피지에 놓으면 바로 일반 사진.'),
 (V['stamp_start'], s('stamp_tab'), '도장 사진은'),
 (s('stamp_tab'), s('stamp_drop')+1.2, '탭을 눌러 뒷면의 배경 제거에 놓으면'),
 (s('stamp_drop')+1.2, V['stamp_end'], '투명한 도장 완성!'),
 (V['stamp_end'], VEND, '인터넷에 안 올리고 내 컴퓨터에서만. 링크는 고정 댓글에!'),
]
# ---- long timeline ----
L=[]
def seg(a,b,txt): L.append((a,b,txt))
def clip(start,marks): return lambda k: start+marks[k] if isinstance(k,str) else start+k
import json
J={n:json.load(open(f'/root/longrec/raw/{n}.json')) for n in ['tour','hwp','heic','contract','receipt','stamp','cli','watch']}
c=lambda st,n: (lambda k: st+(J[n][k] if isinstance(k,str) else k))
seg(0.0,9.4,'회사 컴퓨터에 한컴오피스가 없는데 한글 파일이 왔다면? 끌어서 놓기 한 번이면, 일 초 만에 피디에프가 됩니다.')
seg(9.4,13.9,'무료에, 인터넷에 올리지도 않아요.')
seg(13.9,18.9,'오늘의 오픈소스, 파일리. 일반인 쓸모 별점은 만점입니다.')
seg(18.9,21.7,'파일리가 뭔가요?')
seg(21.7,30.2,'해외여행 때 챙기는 만능 어댑터처럼, 형식이 안 맞는 파일을 맞춰 줘요. 이백육십팔 가지 형식을 서로 바꿀 수 있어요.')
seg(30.2,39.7,'무료이고, 파일을 인터넷에 올리지 않아요. 한국 개발자가 만들어 한글 파일도 되고, 깃허브 별을 만 삼천 개 넘게 받았어요.')
seg(39.7,42.5,'설치하기.')
seg(42.5,53.5,'다운로드 페이지에서 셋업 파일을 받아 실행하면 끝. 처음 뜨는 엔진 선택 창은 나중에를 눌러도 돼요. 창이 아예 안 뜨면 윈도우 업데이트부터!')
seg(53.5,56.3,'앱 화면 둘러보기.')
T=c(56.3,'tour')
seg(T(0),T('toolbar'),'첫 화면에 파일을 끌어다 놓아도 돼요.')
seg(T('toolbar'),T('toolbar_hwp'),'원형 툴바에서는 동그란 메뉴 구성을 정해요.')
seg(T('toolbar_hwp'),T('toolbar_pdf'),'파일 종류마다 메뉴가 달라요. 이건 한글 파일용.')
seg(T('toolbar_pdf'),T('preset'),'이건 피디에프용. 워드나 한글로도 바꿀 수 있어요.')
seg(T('preset'),T('watch'),'프리셋에는 화질이나 크기 같은 설정을 저장해요.')
seg(T('watch'),T('engine'),'자동 변환 폴더는 마지막에 따로 보여 드릴게요.')
seg(T('engine'),T('home2'),'변환 엔진은 동영상이나 오래된 문서용이라, 필요할 때만 받으면 돼요.')
seg(T('home2'),86.9,'진짜 쓰는 법은 지금부터!')
seg(86.9,89.7,'한글 파일을 피디에프로.')
H=c(89.7,'hwp')
seg(H(0),H('a_ctrl'),'한컴오피스가 없는데 한글 파일을 받았어요.')
seg(H('a_ctrl'),H('a_drop')+.8,'컨트롤을 누른 채 끌어서, 피디에프 위에 놓으면')
seg(H('a_drop')+.8,H('a_done')+1.0,'일 초 만에 끝! 원본 옆에 피디에프가 생겼어요.')
seg(H('a_done')+1.0,H('b_ctrl'),'이번엔 한글 이천오 문서로.')
seg(H('b_ctrl'),H('b_drop')+.8,'똑같이 끌어서 피디에프에 놓으면')
seg(H('b_drop')+.8,114.1,'이것도 바로 변환됩니다. 결과를 열어 볼까요?')
seg(114.1,119.1,'회의록은 제목, 목록, 표까지 그대로 나왔어요.')
seg(119.1,124.1,'한글 이천오 문서도 그림과 각주까지 정상이에요.')
seg(124.1,126.9,'아이폰 사진을 제이피지으로.')
E=c(126.9,'heic')
seg(E(0),E('sel1'),'아이폰 사진은 윈도우에서 안 열리죠.')
seg(E('sel1'),E('ctrl'),'여러 장을 고를 땐 컨트롤을 누르고 하나씩 클릭해요.')
seg(E('ctrl'),E('drop')+.6,'그대로 끌면 네 장이 한 번에 잡히고, 제이피지에 놓으면')
seg(E('drop')+.6,146.9,'네 장 모두 일반 사진이 됐어요. 미리 보기도 바로 보이죠.')
seg(146.9,151.4,'이제 어디서나 열리는 제이피지 사진이에요.')
seg(151.4,154.2,'피디에프 계약서를 워드로.')
C=c(154.2,'contract')
seg(C(0),C('ctrl'),'피디에프로 받은 계약서를 고쳐야 할 때.')
seg(C('ctrl'),C('hover')-1.0,'피디에프 메뉴에는 워드도, 한글도 있어요.')
seg(C('hover')-1.0,C('drop')+.6,'워드에 놓으면')
seg(C('drop')+.6,168.8,'글자를 고칠 수 있는 워드 파일이 됩니다.')
seg(168.8,173.3,'제목과 조항이 그대로 살아 있어서 바로 고치면 돼요.')
seg(173.3,176.1,'영수증 세 장을 피디에프 한 부로.')
R=c(176.1,'receipt')
seg(R(0),R('sel1'),'경비 처리할 영수증 사진 세 장.')
seg(R('sel1'),R('tab')-.6,'세 장을 골라 컨트롤을 누른 채 끌고,')
seg(R('tab')-.6,R('drop')+.6,'탭 키를 누르면 뒷면 메뉴. 피디에프 병합에 놓으면')
seg(R('drop')+.6,R('merge_click'),'합칠 순서를 정하는 창이 떠요.')
seg(R('merge_click'),199.9,'병합을 누르면 영수증 세 장이 피디에프 한 부로!')
seg(199.9,204.4,'삼 쪽짜리 피디에프 하나, 그대로 경비 청구에 첨부하세요.')
seg(204.4,207.2,'도장 배경 지우기.')
S=c(207.2,'stamp')
seg(S(0),S('ctrl'),'흰 종이에 찍은 도장 사진이에요.')
seg(S('ctrl'),S('hover')-1.0,'끌어서 탭으로 뒷면을 열고,')
seg(S('hover')-1.0,S('drop')+.6,'배경 제거에 놓으면')
seg(S('drop')+.6,222.4,'배경이 투명한 도장 그림 완성!')
seg(222.4,226.9,'전자 계약서나 견적서에 바로 붙일 수 있어요.')
seg(226.9,229.7,'아쉬운 점도 있어요.')
seg(229.7,235.7,'일반 사진은 실패예요. 커피잔, 고양이까지 지워지죠. 흰 배경 전용 기능이에요.')
seg(235.7,244.7,'동영상과 음악은 엔진을 따로 받아야 하고, 맥 버전은 아직 미리 보기예요. 몇 번 쓰면 별 주기 안내 창이 뜨는데, 닫으면 돼요.')
seg(244.7,247.5,'수백 장도 한 번에.')
K=c(247.5,'cli')
seg(K(0),K('ls1'),'사진이 수백 장이면 하나씩 끌기 번거롭죠.')
seg(K('ls1'),K('convert'),'이럴 땐 명령어 한 줄이면 돼요.')
seg(K('convert'),262.0,'여덟 장이 순식간에 제이피지으로 바뀌었어요.')
seg(262.0,270.0,'윈도우에서는 설치할 때 파일리 명령을 켜 두면, 명령 프롬프트에서 똑같이 쓸 수 있어요.')
seg(270.0,272.8,'자동 변환 폴더.')
W=c(272.8,'watch')
seg(W(0),W('started'),'변환함 폴더를 지켜보도록 걸어 두고,')
seg(W('started'),W('drop1'),'폴더에 파일이 들어오면')
seg(W('drop1'),W('drop2'),'알아서 피디에프로 바꿔서 컨버티드 폴더에 넣어 줘요.')
seg(W('drop2'),296.3,'한글, 워드, 사진 무엇이든. 파일리가 켜져 있는 동안 계속 지켜봐요.')
seg(296.3,306.3,'한컴오피스 없는 직장인, 아이폰 쓰는 분께 추천해요. 컨트롤 누르고 끌어서 놓기, 이것만 기억하세요. 내일 또 만나요!')

def ts(x): return f'{int(x//60):02d}:{x%60:04.1f}'
def check(cues,name):
    bad=0
    for a,b,t in cues:
        n=len(re.sub(r'[\s.,!?]','',t)); r=n/(b-a)
        if re.search(r'[A-Za-z0-9]',t): print('LATIN',name,t); bad+=1
        if r>6.0: print(f'FAST {name} {ts(a)} {r:.1f}/s {t}'); bad+=1
    for (a1,b1,_),(a2,b2,_) in zip(cues,cues[1:]):
        if a2<b1-0.05: print('OVERLAP',name,ts(a1),ts(a2)); bad+=1
    return bad
print(check(shorts,'shorts'), check(L,'long'), round(VEND,1))
import pickle; pickle.dump((shorts,L,VEND),open('/root/narr/cues.pkl','wb'))
