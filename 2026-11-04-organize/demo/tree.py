"""폴더 모양을 나무처럼 출력 (tree 명령이 없는 곳에서 쓰는 간단 버전)"""
import os, sys
root = sys.argv[1]
def walk(d, pre=""):
    items = sorted(os.listdir(d), key=lambda x: (os.path.isfile(os.path.join(d, x)), x))
    for i, n in enumerate(items):
        last = i == len(items) - 1; p = os.path.join(d, n)
        if os.path.isdir(p):
            cnt = sum(len(f) for _, _, f in os.walk(p))
            print(f"{pre}{'└─ ' if last else '├─ '}\033[1;34m{n}/\033[0m \033[90m({cnt})\033[0m")
            if len(sys.argv) < 3: walk(p, pre + ("   " if last else "│  "))
        else: print(f"{pre}{'└─ ' if last else '├─ '}{n}")
walk(root)
