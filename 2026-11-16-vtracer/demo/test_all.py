"""VTracer 시연 측정 → results.json, out/*.svg, out/*.png (다시 그린 그림, 저장소에는 빼 둠)
- 시간: 같은 변환을 3번 해서 가운데 값
- 같은 색 비율: SVG를 원래 크기로 다시 그린 뒤, 정답 그림과 색 차이(RGB 거리)가 40 이하인 점의 비율
- 원래 획과 겹친 정도(IoU): 서명에서 검게 그린 자리와 원래 획(서명_정답.png, 그림자를 넣기 전 획) 자리가 겹치는 정도 (100%면 똑같음)
사용: python3 demo/test_all.py"""
import json, os, re, statistics, time
import numpy as np, resvg_py, vtracer
from PIL import Image
import io

HERE = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(HERE, "samples"); O = os.path.join(HERE, "out"); os.makedirs(O, exist_ok=True)
R = {"version": vtracer.vtracer.__version__ if hasattr(vtracer.vtracer, "__version__") else "1.0.0-alpha.4"}


def conv(name, src, cfg, runs=3):
    data = open(os.path.join(S, src), "rb").read(); ts = []
    for _ in range(runs):
        t = time.perf_counter(); svg = cfg.convert_bytes(data); ts.append(time.perf_counter() - t)
    p = os.path.join(O, name + ".svg"); open(p, "w").write(svg)
    return svg, {"sec": round(statistics.median(ts), 3), "kb": round(len(svg.encode()) / 1024, 1), "paths": svg.count("<path"),
                 "colors": len(set(re.findall(r'fill="(#[0-9a-fA-F]{3,6})"', svg)))}


def render(svg, w, h, name):
    png = bytes(resvg_py.svg_to_bytes(svg_string=svg, width=w, height=h)); im = Image.open(io.BytesIO(png)).convert("RGBA")
    bg = Image.new("RGBA", im.size, "white"); bg.alpha_composite(im); im = bg.convert("RGB"); im.save(os.path.join(O, name + ".png")); return im


def same(a, b, tol=40):
    a = np.asarray(a, float); b = np.asarray(b.resize(a.shape[1::-1], Image.LANCZOS) if b.size != a.shape[1::-1] else b, float)
    return round(float((np.sqrt(((a - b) ** 2).sum(2)) <= tol).mean() * 100), 1)


# ① 작은 로고(240px JPG) → SVG → 1200px로 다시 그려 원본과 비교 (일반 확대와 비교)
orig = Image.open(os.path.join(S, "로고_원본.png")).convert("RGB"); small = Image.open(os.path.join(S, "로고_작은.jpg")).convert("RGB")
up = small.resize((1200, 1200), Image.BICUBIC); up.save(os.path.join(O, "logo_bicubic.png"))
R["logo"] = {"in_kb": round(os.path.getsize(os.path.join(S, "로고_작은.jpg")) / 1024, 1), "in_colors": len(set(small.getdata())),
             "bicubic_same": same(orig, up), "bicubic_colors": len(set(up.getdata()))}
for key, cfg in (("default", vtracer.Config()), ("poster", vtracer.Config.poster()), ("max6", vtracer.Config(max_colors=6))):
    svg, m = conv("logo_" + key, "로고_작은.jpg", cfg); im = render(svg, 1200, 1200, "logo_" + key)
    m["same"] = same(orig, im); m["render_colors"] = len(set(im.getdata())); R["logo"][key] = m
svg = open(os.path.join(O, "logo_max6.svg")).read(); render(svg, 4800, 4800, "logo_max6_4800")   # 20배 확대도 그려 봄
R["logo"]["big_px"] = 4800

# ② 휴대폰으로 찍은 서명 → 흑백 선 그림
truth = np.asarray(Image.open(os.path.join(S, "서명_정답.png"))) < 128
def iou(im):
    a = np.asarray(im.convert("L")) < 128; return round(float((a & truth).sum() / (a | truth).sum() * 100), 1), round(float(a.mean() * 100), 1)
R["sign"] = {"truth_black": round(float(truth.mean() * 100), 1)}
for key, cfg in (("color", vtracer.Config()), ("bw", vtracer.Config.bw()), ("adaptive", vtracer.Config(clustering="bw", adaptive=True))):
    svg, m = conv("sign_" + key, "서명_사진.jpg", cfg, 1 if key == "color" else 3); im = render(svg, 1600, 800, "sign_" + key)
    m["iou"], m["black"] = iou(im); R["sign"][key] = m

# ③ 고양이 사진 → 색 그림
cat = Image.open(os.path.join(S, "고양이.jpg")).convert("RGB")
R["cat"] = {"in_kb": round(os.path.getsize(os.path.join(S, "고양이.jpg")) / 1024, 1)}
for key, cfg in (("default", vtracer.Config()), ("photo", vtracer.Config.photo()), ("poster", vtracer.Config.poster()),
                 ("max8", vtracer.Config(max_colors=8)), ("simplify", vtracer.Config(simplify=2.0)), ("watershed", vtracer.Config(clustering="watershed", hierarchical="cutout"))):
    svg, m = conv("cat_" + key, "고양이.jpg", cfg); im = render(svg, cat.width, cat.height, "cat_" + key); m["same"] = same(cat, im); R["cat"][key] = m

# ④ 24×24 도트 그림 → pixel 모드 / 기본(곡선) 모드, 480px로 다시 그림
for key, cfg in (("pixel", vtracer.Config(mode="pixel", filter_speckle=0)), ("spline", vtracer.Config(filter_speckle=0)), ("polygon", vtracer.Config(mode="polygon", filter_speckle=0))):
    svg, m = conv("dot_" + key, "도트.png", cfg); render(svg, 480, 480, "dot_" + key); R.setdefault("dot", {})[key] = m
Image.open(os.path.join(S, "도트.png")).convert("RGBA").resize((480, 480), Image.BICUBIC).save(os.path.join(O, "dot_bicubic.png"))

# ⑤ 큰 사진 4000×2660
svg, m = conv("cat4000", "고양이_4000.jpg", vtracer.Config()); R["big"] = m | {"in_kb": round(os.path.getsize(os.path.join(S, "고양이_4000.jpg")) / 1024)}
svg, m = conv("cat4000_poster", "고양이_4000.jpg", vtracer.Config.poster(), runs=1); R["big_poster"] = m  # 오래 걸려 1번만

json.dump(R, open(os.path.join(HERE, "results.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps(R, ensure_ascii=False, indent=1))
