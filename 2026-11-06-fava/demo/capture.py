"""Fava 실제 화면 캡처 → ../media/shots/*.png (1920×1080). 사용: python3 capture.py"""
import os, subprocess, time, urllib.request, urllib.parse
from playwright.sync_api import sync_playwright
H = os.path.dirname(os.path.abspath(__file__)); W = f"{H}/work"; O = f"{H}/../media/shots"; os.makedirs(O, exist_ok=True)
def serve(f, port):
    pr = subprocess.Popen(["fava", f, "-p", str(port)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    while True:
        try: return pr, urllib.request.urlopen(f"http://127.0.0.1:{port}/", timeout=1).geturl().rsplit("/", 2)[0]
        except Exception: time.sleep(.1)
pr, B = serve(f"{W}/가계부.beancount", 5081)
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1600, "height": 900}, device_scale_factor=1.2)
    def go(u, name, act=None, wait=1500):
        pg.goto(f"{B}/{u}"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
        if act: act()
        pg.wait_for_timeout(wait); pg.mouse.move(5, 890); pg.screenshot(path=f"{O}/{name}.png"); print(name)
    go("income_statement/", "01_income")
    go("income_statement/", "02_expense_tree", lambda: pg.get_by_text("Expenses", exact=True).first.click())
    go("income_statement/", "03_expense_monthly", lambda: pg.get_by_text("비용 (월별)", exact=True).first.click())
    go("balance_sheet/", "04_balance")
    go("journal/", "05_journal")
    go("account/Expenses:Food-식비/", "06_food", lambda: pg.get_by_text("변동 (월별)", exact=True).first.click())
    go("account/Expenses:Food-식비/?interval=month", "06b_food_budget", lambda: pg.get_by_text("변동 (월별)", exact=True).first.click())
    qs = "SELECT month, sum(position) WHERE account ~ 'Food' GROUP BY month ORDER BY month"
    go("query/?query_string=" + urllib.parse.quote(qs), "07_query")
    go("editor/", "08_editor")
    go("income_statement/?time=2026-09", "09_september")
    b.close()
pr.terminate()
pr, B = serve(f"{W}/틀린장부1.beancount", 5082)
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1600, "height": 900}, device_scale_factor=1.2)
    pg.goto(f"{B}/income_statement/"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1200); pg.screenshot(path=f"{O}/10_error_badge.png")
    pg.goto(f"{B}/errors/"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1200); pg.screenshot(path=f"{O}/11_errors.png"); print("errors")
    b.close()
pr.terminate()
pr, B = serve(f"{W}/10년가계부.beancount", 5083)
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1600, "height": 900}, device_scale_factor=1.2)
    pg.goto(f"{B}/income_statement/?interval=year"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(1500); pg.screenshot(path=f"{O}/12_tenyears.png"); print("10y")
    b.close()
pr.terminate()
