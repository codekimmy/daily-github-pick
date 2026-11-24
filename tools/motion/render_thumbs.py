"""썸네일·블로그 그림을 모션 스타일로 찍는다 (tools/motion, 2026-11-25 운영자 요청).
사용 (날짜 폴더의 demo/render 안에서): python3 ../../../tools/motion/render_thumbs.py [id ...]
  thumb.html(= tools/motion/thumb-template.html 복사) + thumbs.js 의 THUMBS 를 읽어 그림마다 ../../media/<file> 로 저장 (.jpg 는 품질 92)
  id 를 적으면 그 그림만. 장면은 3초짜리 한 장으로 돌리고 마지막 프레임을 찍음 (움직임은 모두 그 안에 끝나게)"""
import pathlib, sys
from playwright.sync_api import sync_playwright

PAGE = pathlib.Path("thumb.html").resolve()
OUT = pathlib.Path("../../media").resolve()
with sync_playwright() as p:
    b = p.chromium.launch()
    ids = sys.argv[1:]
    if not ids:
        t = b.new_page(); t.goto(PAGE.as_uri() + "?s=__none&mode=thumb&w=100&h=100")
        ids = t.evaluate("Object.keys(THUMBS)"); t.close()
    for sid in ids:
        info = None
        t = b.new_page(); t.goto(PAGE.as_uri() + "?s=__none&mode=thumb&w=100&h=100"); info = t.evaluate(f"(({{w,h,file}}) => ({{w,h,file}}))(THUMBS['{sid}'])"); t.close()
        pg = b.new_page(viewport={"width": info["w"], "height": info["h"]})
        pg.on("pageerror", lambda e: print("페이지 오류:", e, flush=True))
        pg.on("console", lambda m: m.type == "error" and print("콘솔 오류:", m.text, flush=True))
        pg.goto(PAGE.as_uri() + f"?s={sid}&mode=thumb&w={info['w']}&h={info['h']}&fps=30")
        pg.wait_for_function("window.READY === true", timeout=60000)
        pg.evaluate("frame(TOTAL - 1)")
        f = OUT / info["file"]; kw = {"type": "jpeg", "quality": 92} if f.suffix == ".jpg" else {}
        pg.screenshot(path=str(f), **kw); pg.close(); print("저장:", f.name, f"{info['w']}×{info['h']}")
    b.close()
