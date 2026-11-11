"""이름을 물어본 뒤, 그 이름이 들어간 생일 인사를 불꽃놀이 효과로 보여 주는 예제 (terminaltexteffects 파이썬 라이브러리)
실행: python 인사카드.py   (먼저 pip install terminaltexteffects)"""
from terminaltexteffects.effects.effect_fireworks import Fireworks
from terminaltexteffects.utils.graphics import Color

name = input("누구에게 보낼 인사입니까? ").strip() or "친구"
effect = Fireworks(f"{name}님\n생일 축하합니다!")
effect.effect_config.firework_colors = (Color("ff6b9d"), Color("ffd166"), Color("ffffff"))  # 불꽃 색: 분홍·노랑·흰색
effect.effect_config.final_gradient_stops = (Color("ff6b9d"), Color("ffd166"))              # 마지막 글자 색: 분홍 → 노랑
effect.terminal_config.canvas_width = 40    # 무대 가로 40칸
effect.terminal_config.canvas_height = 10   # 무대 세로 10줄
effect.terminal_config.anchor_text = "c"    # 글을 무대 가운데에
with effect.terminal_output() as terminal:
    for frame in effect:
        terminal.print(frame)
